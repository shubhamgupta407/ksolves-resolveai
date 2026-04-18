import os
import json
import random
import threading
from datetime import datetime

import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

# =====================================================
# FASTAPI APP
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
# GLOBAL MODEL STATE
# =====================================================

semantic_model = None
model_ready = False
model_loading = False
intent_vectors = {}

# =====================================================
# INTENT EXAMPLES (10 EACH)
# =====================================================

intent_examples = {
    "refund": [
        "need refund",
        "want refund",
        "money back",
        "refund my payment",
        "cancel and refund",
        "wrong plan refund",
        "double payment refund",
        "refund extra charge",
        "return my money",
        "billing refund request"
    ],

    "late_delivery": [
        "parcel delayed",
        "where is my order",
        "delivery late",
        "not delivered yet",
        "shipment delayed",
        "tracking not updated",
        "package stuck",
        "courier not arrived",
        "order still pending",
        "delivery taking too long"
    ],

    "replacement": [
        "damaged product",
        "need replacement",
        "wrong item received",
        "broken item",
        "replace defective product",
        "screen cracked",
        "item not working",
        "received damaged parcel",
        "want exchange product",
        "faulty product replacement"
    ],

    "account_issue": [
        "cannot login",
        "login failed",
        "password reset",
        "account locked",
        "saml login issue",
        "unable to access account",
        "forgot password",
        "otp not received",
        "authentication failed",
        "sign in error"
    ],

    "coupon_issue": [
        "coupon not working",
        "promo invalid",
        "discount failed",
        "voucher not applying",
        "promo expired",
        "discount code invalid",
        "offer not working",
        "coupon rejected",
        "promo code issue",
        "cashback not applied"
    ],

    "payment_issue": [
        "charged twice",
        "billing issue",
        "invoice mismatch",
        "tax issue",
        "duplicate charge",
        "wrong invoice",
        "payment failed but money deducted",
        "extra billing",
        "seat billing mismatch",
        "finance reconciliation needed"
    ],

    "cancel_order": [
        "cancel my order",
        "ordered by mistake",
        "cancel purchase",
        "stop my order",
        "abort order request",
        "cancel subscription",
        "close my account",
        "terminate order",
        "need cancellation",
        "reverse order now"
    ],

    "complaint_general": [
        "very frustrated",
        "nothing is working",
        "bad experience",
        "poor support",
        "terrible service",
        "i am angry",
        "worst experience",
        "nobody helping me",
        "very disappointed",
        "not satisfied with service"
    ]
}

# =====================================================
# MODEL LOADER
# =====================================================

def load_semantic_model():
    global semantic_model, model_ready, model_loading, intent_vectors

    if model_ready or model_loading:
        return

    model_loading = True

    try:
        semantic_model = SentenceTransformer(
            "paraphrase-MiniLM-L3-v2",
            device="cpu"
        )

        for intent, phrases in intent_examples.items():
            intent_vectors[intent] = semantic_model.encode(
                phrases,
                convert_to_tensor=True
            )

        model_ready = True

    except Exception:
        model_ready = False

    model_loading = False


def start_warmup():
    thread = threading.Thread(
        target=load_semantic_model,
        daemon=True
    )
    thread.start()

# =====================================================
# LOCAL SEMANTIC CLASSIFIER
# =====================================================

def classify_local(ticket_text):
    if not model_ready:
        return {
            "intent": "unknown_intent",
            "confidence": 0.0
        }

    query = semantic_model.encode(
        ticket_text,
        convert_to_tensor=True
    )

    best_intent = "unknown_intent"
    best_score = 0.0

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
# OPENROUTER LLM FALLBACK
# =====================================================

def llm_fallback(ticket_text):
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        return {
            "intent": "unknown_intent",
            "confidence": 0.50
        }

    prompt = f"""
Classify the customer support ticket into exactly one label:

refund
late_delivery
replacement
account_issue
coupon_issue
payment_issue
cancel_order
complaint_general

Return only JSON format:
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
            timeout=20
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
# HYBRID DECISION ENGINE
# =====================================================

LOCAL_THRESHOLD = 0.75
ESCALATE_THRESHOLD = 0.65

def smart_classify(ticket_text):
    local_result = classify_local(ticket_text)

    if local_result["confidence"] >= LOCAL_THRESHOLD:
        return {
            "intent": local_result["intent"],
            "confidence": local_result["confidence"],
            "source": "semantic_local_model"
        }

    llm_result = llm_fallback(ticket_text)

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
# AGENTS
# =====================================================

def refund_agent():
    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": "Refund approved. Amount will be credited in 3-5 business days."
    }

def account_agent():
    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": "Password reset instructions have been sent to your registered email."
    }

def escalate_agent():
    return {
        "resolved": False,
        "flow": "escalated_to_human",
        "message": "Your request has been forwarded to our support executive for review."
    }

def generic_agent():
    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": "Your request has been processed successfully."
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
        f"semantic_model_ready -> {model_ready}",
        f"timestamp -> {datetime.now()}"
    ]

    if confidence < ESCALATE_THRESHOLD:
        response = escalate_agent()

    elif intent == "refund":
        response = refund_agent()

    elif intent == "account_issue":
        response = account_agent()

    elif intent == "complaint_general":
        response = escalate_agent()

    else:
        response = generic_agent()

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

@app.on_event("startup")
def startup_event():
    start_warmup()

@app.get("/")
def home():
    return {"status": "ResolveAI Backend Running"}

@app.get("/health")
def health():
    return {
        "backend": "online",
        "semantic_model": "ready" if model_ready else (
            "loading" if model_loading else "idle"
        ),
        "llm_fallback": "active" if os.getenv("OPENROUTER_API_KEY") else "inactive"
    }

@app.get("/warmup")
def warmup():
    if not model_ready and not model_loading:
        start_warmup()

    return {
        "status": "warmup_started",
        "semantic_model": "ready" if model_ready else "loading"
    }

@app.post("/resolve-ticket")
def resolve_ticket(data: TicketRequest):
    return master_agent(data.ticket, data.ticket_id)
