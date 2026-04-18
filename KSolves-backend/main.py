import os
import json
import re
import random
from datetime import datetime

import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ===============================
# FASTAPI APP
# ===============================

app = FastAPI(title="ResolveAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# REQUEST MODEL
# ===============================

class TicketRequest(BaseModel):
    ticket: str
    ticket_id: str = "AUTO1001"


# ===============================
# SIMPLE LOCAL CLASSIFIER
# ===============================

intent_keywords = {
    "refund": [
        "refund", "money back", "return", "charged wrongly", "reimburse"
    ],
    "late_delivery": [
        "late", "parcel", "delivery", "tracking", "not arrived", "where is my order"
    ],
    "replacement": [
        "wrong item", "replace", "damaged", "broken", "faulty", "missing item"
    ],
    "complaint_general": [
        "bad", "worst", "angry", "disappointed", "poor service", "unhappy"
    ],
    "coupon_issue": [
        "coupon", "promo", "discount", "voucher"
    ],
    "account_issue": [
        "login", "password", "signin", "account locked", "cannot login"
    ]
}


def classify_ticket(ticket_text):
    text = ticket_text.lower()

    best_intent = "unknown_intent"
    best_score = 0

    for intent, words in intent_keywords.items():
        score = 0
        for word in words:
            if word in text:
                score += 1

        if score > best_score:
            best_score = score
            best_intent = intent

    confidence = round(min(0.75 + best_score * 0.06, 0.98), 3)

    if best_score == 0:
        confidence = 0.60

    return {
        "intent": best_intent,
        "confidence": confidence,
        "source": "local_model"
    }


def smart_classify(ticket_text):
    return classify_ticket(ticket_text)


# ===============================
# TOOLS
# ===============================

def get_order(order_id):
    return {
        "order_id": order_id,
        "customer": "Customer",
        "amount": random.choice([499, 999, 1299, 2499]),
        "status": random.choice(["processing", "shipped", "delivered"]),
        "days_since_delivery": random.randint(0, 15)
    }


def check_refund_eligibility(order):
    eligible = (
        order["status"] == "delivered"
        and order["days_since_delivery"] <= 7
    )

    return {
        "eligible": eligible,
        "reason": (
            "Within return window"
            if eligible else
            "Refund window expired or not delivered"
        )
    }


def issue_refund(order):
    return {
        "success": True,
        "amount": order["amount"],
        "txn_id": f"RF{random.randint(10000,99999)}"
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


# ===============================
# AGENTS
# ===============================

def refund_agent(ticket_id, order_id):
    logs = []

    order = get_order(order_id)
    logs.append(f"get_order -> {order}")

    eligibility = check_refund_eligibility(order)
    logs.append(f"check_refund_eligibility -> {eligibility}")

    if eligibility["eligible"]:
        refund = issue_refund(order)
        logs.append(f"issue_refund -> {refund}")

        reply = send_reply(
            f"Your refund request has been approved. ₹{refund['amount']} "
            f"will be credited in 3-5 business days. Ref ID: {refund['txn_id']}"
        )

        return {
            "resolved": True,
            "flow": "auto_resolved",
            "message": reply["message"],
            "logs": logs
        }

    if order["status"] == "delivered":
        reply = send_reply(
            "Your refund request could not be approved because it is "
            "outside the return policy window."
        )

        return {
            "resolved": True,
            "flow": "auto_denied",
            "message": reply["message"],
            "logs": logs
        }

    escalate(ticket_id, "Refund needs manual review", "medium")

    reply = send_reply(
        "Your refund request has been forwarded to our support executive."
    )

    return {
        "resolved": False,
        "flow": "escalated_to_human",
        "message": reply["message"],
        "logs": logs
    }


def delivery_agent(ticket_id):
    order = get_order(ticket_id)

    if order["status"] == "shipped":
        reply = send_reply(
            "Your order is in transit. Tracking details have been shared."
        )

        return {
            "resolved": True,
            "flow": "auto_resolved",
            "message": reply["message"]
        }

    if order["status"] == "delivered":
        reply = send_reply(
            "Our records show your order has already been delivered."
        )

        return {
            "resolved": True,
            "flow": "auto_resolved",
            "message": reply["message"]
        }

    escalate(ticket_id, "Processing delay", "medium")

    reply = send_reply(
        "Your request has been forwarded to logistics support."
    )

    return {
        "resolved": False,
        "flow": "escalated_to_human",
        "message": reply["message"]
    }


def replacement_agent(ticket_id):
    reply = send_reply(
        "Your replacement request has been approved and initiated."
    )

    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": reply["message"]
    }


def complaint_agent(ticket_id):
    escalate(ticket_id, "Customer complaint", "high")

    reply = send_reply(
        "We apologize for your experience. "
        "Your complaint has been forwarded to our senior support team."
    )

    return {
        "resolved": False,
        "flow": "escalated_to_human",
        "message": reply["message"]
    }


def coupon_agent(ticket_id):
    reply = send_reply(
        "A fresh promo code has been generated for you: KSOLVES10"
    )

    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": reply["message"]
    }


def account_agent(ticket_id):
    reply = send_reply(
        "Password reset instructions have been sent to your registered email."
    )

    return {
        "resolved": True,
        "flow": "auto_resolved",
        "message": reply["message"]
    }


# ===============================
# MASTER AGENT
# ===============================

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
            "Your request has been forwarded to our support executive for review."
        )

        return {
            "ticket_id": ticket_id,
            "order_id": order_id,
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

        elif intent == "late_delivery":
            response = delivery_agent(ticket_id)

        elif intent == "replacement":
            response = replacement_agent(ticket_id)

        elif intent == "complaint_general":
            response = complaint_agent(ticket_id)

        elif intent == "coupon_issue":
            response = coupon_agent(ticket_id)

        elif intent == "account_issue":
            response = account_agent(ticket_id)

        else:
            reply = send_reply(
                "Your request has been forwarded to our support executive."
            )

            response = {
                "resolved": False,
                "flow": "escalated_to_human",
                "message": reply["message"]
            }

    except Exception:
        response = {
            "resolved": False,
            "flow": "system_error",
            "message": "Temporary issue occurred. Support team notified."
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


# ===============================
# ROUTES
# ===============================

@app.get("/")
def home():
    return {"status": "ResolveAI Backend Running"}


@app.post("/resolve-ticket")
def resolve_ticket(data: TicketRequest):
    return master_agent(data.ticket, data.ticket_id)
