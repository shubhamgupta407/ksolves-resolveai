import os
import json
import re
import random
from datetime import datetime

import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(title="ResolveAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# REQUEST MODEL
# =====================================================

class TicketRequest(BaseModel):
    ticket: str
    ticket_id: str = "AUTO1001"

# =====================================================
# PURE BACKEND LOGIC FROM YOUR COLAB
# ONLY SEMANTIC ENGINE REPLACED:
# SentenceTransformer -> TF-IDF
# =====================================================

intent_phrases = {

    "refund": [
        "need refund","want refund","money back","return my money",
        "please refund me","i need my money back","charged wrongly refund",
        "refund for this order","cancel and refund","reimburse payment"
    ],

    "damaged_item": [
        "item arrived damaged","product is broken","received broken item",
        "defective product","product cracked","not working product",
        "box damaged item damaged","item came unusable",
        "received faulty item","product was destroyed"
    ],

    "tracking": [
        "where is my order","track my package","track my parcel",
        "delivery status","not delivered yet","when will it arrive",
        "where is parcel","shipment update","package location",
        "order still not received"
    ],

    "cancel_order": [
        "cancel my order","want to cancel","ordered by mistake",
        "stop this purchase","do not ship order","please cancel order",
        "cancel before dispatch","i dont need it now",
        "abort my order","remove this order"
    ],

    "payment_issue": [
        "payment failed","money deducted no order","charged twice",
        "double payment happened","transaction problem","payment stuck",
        "paid but no confirmation","amount debited",
        "payment error","money gone no order"
    ],

    "replacement": [
        "replace this item","need replacement","send another product",
        "wrong item received","exchange product","want replacement",
        "replace broken item","received wrong size replace",
        "swap this item","new piece needed"
    ],

    "late_delivery": [
        "delivery is late","order delayed","package late",
        "still not arrived","why is delivery delayed",
        "shipment taking too long","order running late",
        "delivery overdue","parcel delayed","waiting too long"
    ],

    "missing_item": [
        "item missing","box empty","one item not received",
        "parts missing","package incomplete","missing accessories",
        "received less items","product missing from package",
        "nothing inside box","order incomplete"
    ],

    "address_change": [
        "change delivery address","wrong address entered",
        "update shipping address","modify address",
        "need to change location","change my order address",
        "edit delivery location","entered wrong pin code",
        "wrong city selected","change destination"
    ],

    "account_issue": [
        "cannot login","unable to login","account locked",
        "password reset","forgot password",
        "unable to access account","login issue",
        "cant sign in","account blocked","signin failed"
    ],

    "coupon_issue": [
        "coupon not working","promo code failed",
        "discount code invalid","voucher not applying",
        "coupon expired wrongly","offer code issue",
        "promo rejected","discount unavailable",
        "coupon error","promo not accepted"
    ],

    "warranty_claim": [
        "claim warranty","under warranty repair",
        "product stopped working later","need warranty support",
        "repair under warranty","warranty request",
        "item failed in warranty","warranty replacement needed",
        "service under warranty","product dead after month"
    ],

    "complaint_general": [
        "very disappointed","bad experience","poor service",
        "unhappy with order","terrible support","worst experience",
        "not satisfied","this is unacceptable",
        "extremely upset","frustrated with service"
    ]
}

# =====================================================
# TF-IDF ENGINE
# =====================================================

all_phrases = []
phrase_to_intent = []

for intent, phrases in intent_phrases.items():
    for p in phrases:
        all_phrases.append(p)
        phrase_to_intent.append(intent)

vectorizer = TfidfVectorizer()
phrase_matrix = vectorizer.fit_transform(all_phrases)

# =====================================================
# CLASSIFIER (UPDATED LOGIC ONLY)
# =====================================================

def keyword_score(text, phrases):
    text_lower = text.lower()
    best = 0.0

    for phrase in phrases:
        phrase_lower = phrase.lower()

        if phrase_lower in text_lower:
            best = max(best, 0.95)
        else:
            phrase_words = phrase_lower.split()
            hit_count = sum(1 for word in phrase_words if word in text_lower)

            if len(phrase_words) > 0:
                partial = hit_count / len(phrase_words)
                best = max(best, partial * 0.85)

    return round(best, 3)

def classify_ticket(text):
    query_vec = vectorizer.transform([text])
    semantic_scores = cosine_similarity(query_vec, phrase_matrix)[0]

    best_intent = "complaint_general"
    best_final_score = 0.0

    for intent, phrases in intent_phrases.items():
        indices = [
            i for i, mapped_intent in enumerate(phrase_to_intent)
            if mapped_intent == intent
        ]

        semantic_score = max([semantic_scores[i] for i in indices])
        keyword_match_score = keyword_score(text, phrases)

        final_score = (
            keyword_match_score * 0.40 +
            float(semantic_score) * 0.60
        )

        if final_score > best_final_score:
            best_final_score = final_score
            best_intent = intent

    return {
        "ticket": text,
        "intent": best_intent,
        "confidence": round(best_final_score, 3)
    }

# =====================================================
# ROUTER (UPDATED THRESHOLD ONLY)
# =====================================================

CONFIDENCE_THRESHOLD = 0.60

def route_ticket(ticket_text):
    result = classify_ticket(ticket_text)

    if result["confidence"] >= CONFIDENCE_THRESHOLD:
        result["source"] = "local_model"
        result["needs_llm"] = False
    else:
        result["source"] = "fallback_needed"
        result["needs_llm"] = True

    return result

# =====================================================
# OPENROUTER FALLBACK
# =====================================================

def openrouter_classify(ticket_text):
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        return {
            "intent": "complaint_general",
            "confidence": 0.40
        }

    url = "https://openrouter.ai/api/v1/chat/completions"

    prompt = f"""
Classify this support ticket into exactly ONE category:

refund
damaged_item
tracking
cancel_order
payment_issue
replacement
late_delivery
missing_item
address_change
account_issue
coupon_issue
warranty_claim
complaint_general

Return ONLY JSON.

{{"intent":"refund","confidence":0.92}}

Ticket: {ticket_text}
"""

    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=20
        )

        data = response.json()
        content = data["choices"][0]["message"]["content"].strip()
        content = re.sub(r"```json|```", "", content).strip()

        return json.loads(content)

    except Exception:
        return {
            "intent": "complaint_general",
            "confidence": 0.40
        }

# =====================================================
# SMART CLASSIFIER
# =====================================================

def smart_classify(ticket_text):
    local_result = route_ticket(ticket_text)

    if local_result["needs_llm"] is False:
        return {
            "ticket": ticket_text,
            "intent": local_result["intent"],
            "confidence": local_result["confidence"],
            "source": "local_model"
        }

    llm_result = openrouter_classify(ticket_text)

    return {
        "ticket": ticket_text,
        "intent": llm_result["intent"],
        "confidence": llm_result["confidence"],
        "source": "openrouter_fallback"
    }

# =====================================================
# TOOLS
# =====================================================

def get_order(order_id):
    return {
        "order_id": order_id,
        "customer": "Shubham",
        "amount": 1299,
        "status": random.choice(["shipped", "delivered", "processing"]),
        "days_since_delivery": random.randint(0, 15)
    }

def check_refund_eligibility(order):
    eligible = (
        order["status"] == "delivered"
        and order["days_since_delivery"] <= 7
    )

    return {
        "eligible": eligible,
        "reason": "Within 7-day return window"
        if eligible else
        "Refund window expired or not delivered"
    }

def issue_refund(order):
    return {
        "success": True,
        "amount": order["amount"],
        "txn_id": "RF" + str(random.randint(10000, 99999))
    }

def send_reply(message):
    return {
        "sent": True,
        "message": message
    }

def escalate(ticket_id, summary, priority):
    return {
        "ticket_id": ticket_id,
        "escalated": True,
        "priority": priority,
        "summary": summary
    }

# =====================================================
# AGENTS
# =====================================================

def refund_agent(ticket_id, order_id):
    order = get_order(order_id)
    eligibility = check_refund_eligibility(order)

    if eligibility["eligible"]:
        refund = issue_refund(order)

        reply = send_reply(
            f"Your refund request has been approved. "
            f"Amount ₹{refund['amount']} will be credited "
            f"within 3-5 business days. Ref ID: {refund['txn_id']}"
        )

        return {
            "ticket_id": ticket_id,
            "resolved": True,
            "flow": "auto_resolved",
            "message": reply["message"]
        }

    if order["status"] == "delivered" and order["days_since_delivery"] > 7:
        reply = send_reply(
            "Your refund request could not be approved because it is outside the 7-day return policy window."
        )

        return {
            "ticket_id": ticket_id,
            "resolved": True,
            "flow": "auto_denied",
            "message": reply["message"]
        }

    reply = send_reply(
            "Your refund request has been forwarded to our support executive for manual review."
    )

    return {
        "ticket_id": ticket_id,
        "resolved": False,
        "flow": "escalated_to_human",
        "message": reply["message"]
    }

def delivery_agent(ticket_id):
    order = get_order(ticket_id)

    if order["status"] == "shipped":
        reply = send_reply(
            f"Your order {order['order_id']} is in transit and will reach you soon. Tracking details have been shared."
        )

        return {
            "ticket_id": ticket_id,
            "resolved": True,
            "flow": "auto_resolved",
            "message": reply["message"]
        }

    elif order["status"] == "delivered":
        reply = send_reply(
            f"Our records show order {order['order_id']} has already been delivered successfully."
        )

        return {
            "ticket_id": ticket_id,
            "resolved": True,
            "flow": "auto_resolved",
            "message": reply["message"]
        }

    reply = send_reply(
        "Your delivery request has been forwarded to our logistics support executive for priority review."
    )

    return {
        "ticket_id": ticket_id,
        "resolved": False,
        "flow": "escalated_to_human",
        "message": reply["message"]
    }

def replacement_agent(ticket_id):
    order = get_order(ticket_id)

    if order["status"] == "delivered":
        reply = send_reply(
            f"Your replacement request for order {order['order_id']} has been approved. A new replacement order has been initiated."
        )

        return {
            "ticket_id": ticket_id,
            "resolved": True,
            "flow": "auto_resolved",
            "message": reply["message"]
        }

    elif order["status"] == "shipped":
        reply = send_reply(
            "Your replacement request has been forwarded to our support executive as the original order is still in transit."
        )

        return {
            "ticket_id": ticket_id,
            "resolved": False,
            "flow": "escalated_to_human",
            "message": reply["message"]
        }

    reply = send_reply(
        "Your replacement request cannot be processed yet because the order is still under processing."
    )

    return {
        "ticket_id": ticket_id,
        "resolved": True,
        "flow": "auto_denied",
        "message": reply["message"]
    }

def complaint_agent(ticket_id):
    reply = send_reply(
        "We sincerely apologize for your experience. Your complaint has been forwarded to our senior support executive, who will assist you shortly."
    )

    return {
        "ticket_id": ticket_id,
        "resolved": False,
        "flow": "escalated_to_human",
        "message": reply["message"]
    }

def coupon_agent(ticket_id):
    reply = send_reply(
        "We verified your coupon issue. A fresh promo code has been generated for you: KSOLVES10"
    )

    return {
        "ticket_id": ticket_id,
        "resolved": True,
        "flow": "auto_resolved",
        "message": reply["message"]
    }

def account_agent(ticket_id):
    reply = send_reply(
        "We detected an account access issue. Password reset instructions have been sent to your registered email address."
    )

    return {
        "ticket_id": ticket_id,
        "resolved": True,
        "flow": "auto_resolved",
        "message": reply["message"]
    }

# =====================================================
# MASTER AGENT
# =====================================================

def master_agent(ticket_text, ticket_id="AUTO1001"):
    result = smart_classify(ticket_text)

    intent = result["intent"]
    confidence = result["confidence"]
    source = result["source"]

    order_id = f"ORD{random.randint(1000,9999)}"

    logs = [
        f"ticket_received -> {ticket_text}",
        f"classified_intent -> {intent}",
        f"confidence -> {confidence}",
        f"classifier_source -> {source}",
        f"timestamp -> {datetime.now()}"
    ]

    if confidence < 0.65:
        reply = send_reply(
            "Your request has been forwarded to our support executive for manual review."
        )

        return {
            "ticket_id": ticket_id,
            "order_id": order_id,
            "input_ticket": ticket_text,
            "intent": intent,
            "confidence": confidence,
            "source": source,
            "agent_response": {
                "resolved": False,
                "flow": "escalated_to_human",
                "message": reply["message"]
            },
            "logs": logs
        }

    try:
        if intent == "refund":
            response = refund_agent(ticket_id, order_id)

        elif intent in ["late_delivery", "tracking"]:
            response = delivery_agent(ticket_id)

        elif intent in ["replacement", "damaged_item", "missing_item"]:
            response = replacement_agent(ticket_id)

        elif intent == "complaint_general":
            response = complaint_agent(ticket_id)

        elif intent == "coupon_issue":
            response = coupon_agent(ticket_id)

        elif intent == "account_issue":
            response = account_agent(ticket_id)

        else:
            response = {
                "resolved": False,
                "flow": "escalated_to_human",
                "message": "Your request has been forwarded to our support executive for review."
            }

    except Exception:
        response = {
            "resolved": False,
            "flow": "system_error",
            "message": "A temporary issue occurred while processing your request."
        }

    return {
        "ticket_id": ticket_id,
        "order_id": order_id,
        "input_ticket": ticket_text,
        "intent": intent,
        "confidence": confidence,
        "source": source,
        "agent_response": response,
        "logs": logs
    }

# =====================================================
# ROUTES
# =====================================================

@app.get("/")
def home():
    return {"status": "ResolveAI Backend Running"}

@app.post("/resolve-ticket")
def resolve_ticket(data: TicketRequest):
    return master_agent(data.ticket, data.ticket_id)
