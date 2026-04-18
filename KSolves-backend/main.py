import os
import json
import random
from datetime import datetime

import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

# =====================================================
# PURE BACKEND LOGIC (BASED ON USER COLAB .PY WORKFLOW)
# Rule Based / Semantic / LLM Fallback / Human Escalation
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
# LOAD MODEL
# =====================================================

model = SentenceTransformer("paraphrase-MiniLM-L3-v2")

# =====================================================
# INTENT DATASET (FROM YOUR BACKEND STYLE)
# =====================================================

intent_examples = {
    "refund": [
        "need refund",
        "want refund",
        "money back",
        "refund my payment",
        "charged wrongly refund",
        "annual plan by mistake refund",
        "cancel and refund"
    ],

    "late_delivery": [
        "parcel not arrived",
        "delivery delayed",
        "where is my order",
        "shipment is late",
        "still not delivered",
        "track package"
    ],

    "replacement": [
        "item broken",
        "damaged product",
        "need replacement",
        "wrong product received",
        "box empty",
        "faulty item"
    ],

    "account_issue": [
        "cannot login",
        "login failed",
        "password reset failed",
        "account locked",
        "signin problem",
        "saml login issue"
    ],

    "coupon_issue": [
        "coupon not working",
        "promo code invalid",
        "discount failed",
        "voucher issue"
    ],

    "payment_issue": [
        "charged twice",
        "duplicate payment",
        "money deducted no order",
        "invoice issue",
        "billing issue",
        "tax charged wrongly"
    ],

    "cancel_order": [
        "cancel my order",
        "ordered by mistake",
        "please cancel purchase"
    ],

    "complaint_general": [
        "bad experience",
        "poor service",
        "very frustrated",
        "nothing is working",
        "terrible support",
        "disappointed with service"
    ]
}

# =====================================================
# EMBEDDINGS
# =====================================================

intent_vectors = {}

for intent, phrases in intent_examples.items():
    intent_vectors[intent] = model.encode(
        phrases,
        convert_to_tensor=True
    )

# =====================================================
# CONFIG
# =====================================================

LOCAL_THRESHOLD = 0.75
ESCALATE_THRESHOLD = 0.65

# =====================================================
# LOCAL SEMANTIC CLASSIFIER
# =====================================================

def classify_local(ticket_text):
    query = model.encode(ticket_text, convert_to_tensor=True)

    best_intent = "unknown_intent"
    best_score = 0

    for intent, vectors in intent_vectors.items():
        score = float(util.cos_sim(query, vectors)[0].max())

        if score > best_score:
            best_score = score
            best_intent = intent

    return {
        "intent": best_intent,
        "confidence": round(best_score, 2)
    }

# =====================================================
# OPENROUTER FALLBACK
# =====================================================

def openrouter_classify(ticket_text):
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        return {
            "intent": "unknown_intent",
            "confidence": 0.50
        }

    prompt = f"""
Classify customer support ticket into one category only:

refund
late_delivery
replacement
account_issue
coupon_issue
payment_issue
cancel_order
complaint_general

Return only JSON:
{{"intent":"refund","confidence":0.91}}

Ticket:
{ticket_text}
"""

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0
            },
            timeout=25
        )

        data = response.json()
        content = data["choices"][0]["message"]["content"].strip()

        if content.startswith("```"):
            content = content.replace("```json", "").replace("```", "").strip()

        result = json.loads(content)

        return {
            "intent": result["intent"],
            "confidence": round(float(result["confidence"]), 2)
        }

    except:
        return {
            "intent": "unknown_intent",
            "confidence": 0.50
        }

# =====================================================
# SMART ROUTER
# =====================================================

def smart_classify(ticket_text):
    local_result = classify_local(ticket_text)

    if local_result["confidence"] >= LOCAL_THRESHOLD:
        return {
            "intent": local_result["intent"],
            "confidence": local_result["confidence"],
            "source": "local_model"
        }

    llm_result = openrouter_classify(ticket_text)

    if llm_result["confidence"] > local_result["confidence"]:
        return {
            "intent": llm_result["intent"],
            "confidence": llm_result["confidence"],
            "source": "llm_fallback"
        }

    return {
        "intent": local_result["intent"],
        "confidence": local_result["confidence"],
        "source": "local_model"
    }

# =====================================================
# TOOL FUNCTIONS
# =====================================================

def get_order(order_id):
    return {
        "order_id": order_id,
        "amount": random.choice([499, 999, 1299, 2499]),
        "status": random.choice(["processing", "shipped", "delivered"]),
        "days_since_delivery": random.randint(0, 12)
    }

def check_refund_eligibility(order):
    if order["status"] == "delivered" and order["days_since_delivery"] <= 7:
        return True
    return False

# =====================================================
# AGENTS
# =====================================================

def refund_agent(order_id):
    order = get_order(order_id)

    if check_refund_eligibility(order):
        return {
            "resolved": True,
            "flow": "auto_resolved",
            "message": f"Refund approved. ₹{order['amount']} credited in 3-5 business days."
        }

    return {
        "resolved": False,
        "flow": "escalated_to_human",
        "message": "Refund request forwarded to support executive."
    }

def delivery_agent():
    return {
        "resolved": False,
        "flow": "escalated_to_human",
        "message": "Your request has been forwarded to logistics support."
    }

def replacement_agent():
    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": "Replacement request has been approved."
    }

def account_agent():
    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": "Password reset instructions have been sent to your registered email."
    }

def coupon_agent():
    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": "Fresh coupon code generated: KSOLVES10"
    }

def payment_agent():
    return {
        "resolved": False,
        "flow": "escalated_to_human",
        "message": "Billing request forwarded to finance support."
    }

def complaint_agent():
    return {
        "resolved": False,
        "flow": "escalated_to_human",
        "message": "Your complaint has been forwarded to our support executive for review."
    }

# =====================================================
# MASTER AGENT
# =====================================================

def master_agent(ticket_text, ticket_id):
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

    if confidence < ESCALATE_THRESHOLD:
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
                "message": "Low confidence classification. Routed to human support."
            },
            "logs": logs
        }

    if intent == "refund":
        response = refund_agent(order_id)

    elif intent == "late_delivery":
        response = delivery_agent()

    elif intent == "replacement":
        response = replacement_agent()

    elif intent == "account_issue":
        response = account_agent()

    elif intent == "coupon_issue":
        response = coupon_agent()

    elif intent == "payment_issue":
        response = payment_agent()

    elif intent == "cancel_order":
        response = complaint_agent()

    elif intent == "complaint_general":
        response = complaint_agent()

    else:
        response = {
            "resolved": False,
            "flow": "escalated_to_human",
            "message": "Request forwarded to support executive."
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
