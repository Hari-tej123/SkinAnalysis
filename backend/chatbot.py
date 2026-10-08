import os
import re
from typing import AsyncGenerator
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_KEY and GEMINI_KEY != "your_actual_api_key":
    try:
        genai.configure(api_key=GEMINI_KEY)
    except Exception as e:
        print(f"Warning: Gemini config failed: {e}")

SYSTEM_PROMPT = """You are Dr. Nova, a certified clinical AI dermatology and skincare specialist assistant.

Core Principles:
1. Provide accurate, evidence-based, empathetic, and highly actionable skincare guidance.
2. Formulate advice specifically grounded in the user's uploaded skin analysis results (conditions, skin type, severity, and routines).
3. If an ingredient is listed in the user's "Ingredients to avoid", warn them against using it.
4. If a condition is marked "severe", gently suggest professional clinical dermatologist evaluation in addition to gentle barrier care.
5. Keep explanations clear, well-structured (using bullet points or concise steps), and easy to understand for beginners.
6. Do not prescribe prescription pharmaceuticals (e.g. isotretinoin, oral antibiotics), but explain over-the-counter actives clearly.
"""

def build_context_prompt(skin_context: dict) -> str:
    """Formats skin analysis results into a clear prompt context."""
    if not skin_context:
        return ""

    prediction = skin_context.get("prediction", {})
    recommendations = skin_context.get("recommendations", {})

    scores = prediction.get("scores", {})
    primary = prediction.get("primary_condition", "normal")
    severity = prediction.get("severity", "mild")
    skin_type = prediction.get("skin_type", "Normal/Combination")

    top_conditions = [
        f"{k.replace('_', ' ').title()}: {v:.0f}%"
        for k, v in sorted(scores.items(), key=lambda x: x[1], reverse=True)
        if v > 20
    ]

    key_ingredients = recommendations.get("key_ingredients", [])
    avoid_ingredients = recommendations.get("ingredients_to_avoid", [])
    morning_routine = recommendations.get("morning_routine", [])
    night_routine = recommendations.get("night_routine", [])

    return f"""
[PATIENT SKIN ANALYSIS CONTEXT]
• Primary Condition: {primary.replace('_', ' ').title()} ({severity.title()} Severity)
• Identified Skin Type: {skin_type}
• Detected Condition Scores: {', '.join(top_conditions) if top_conditions else 'Normal healthy baseline'}
• Recommended Key Actives: {', '.join(key_ingredients)}
• Ingredients to Avoid: {', '.join(avoid_ingredients)}
• Suggested Morning Steps: {' -> '.join(morning_routine)}
• Suggested Night Steps: {' -> '.join(night_routine)}
[/PATIENT SKIN ANALYSIS CONTEXT]
Always reference this patient profile to customize recommendations directly.
"""

def estimate_tokens(text: str) -> int:
    """Approximate token count (1 token ~= 4 chars or 0.75 words)."""
    return len(re.findall(r'\w+|[^\w\s]', text))


def trim_history_sliding_window(history: list[dict], max_messages: int = 10, max_tokens: int = 3000) -> list[dict]:
    """
    Trims chat history to the most recent messages within sliding window and token limits.
    """
    if not history:
        return []

    # Keep at most max_messages
    trimmed = history[-max_messages:]
    
    # Calculate tokens in reverse and trim if needed
    total_tokens = 0
    valid_slice = []
    for msg in reversed(trimmed):
        msg_tokens = estimate_tokens(msg.get("content", ""))
        if total_tokens + msg_tokens > max_tokens and len(valid_slice) >= 2:
            break
        total_tokens += msg_tokens
        valid_slice.insert(0, msg)

    return valid_slice


def _build_fallback_reply(message: str, skin_context: dict | None) -> str:
    """Generates informative rule-based skincare guidance when Gemini API key is unavailable."""
    msg_lower = message.lower()
    
    primary = "healthy skin"
    skin_type = "combination"
    rec_actives = "Niacinamide, Hyaluronic Acid, and Broad-Spectrum SPF 50"
    avoid_actives = "Harsh physical scrubs and denatured alcohol"

    if skin_context:
        pred = skin_context.get("prediction", {})
        recs = skin_context.get("recommendations", {})
        primary = pred.get("primary_condition", "normal").replace("_", " ")
        skin_type = pred.get("skin_type", "Normal")
        if recs.get("key_ingredients"):
            rec_actives = ", ".join(recs["key_ingredients"][:3])
        if recs.get("ingredients_to_avoid"):
            avoid_actives = ", ".join(recs["ingredients_to_avoid"][:2])

    if "sunscreen" in msg_lower or "spf" in msg_lower:
        return f"For your **{skin_type}** and target concerns ({primary}), daily broad-spectrum SPF 50+ is essential. Look for a lightweight water-gel formula that doesn't clog pores, and reapply every 2 hours during direct daylight exposure."

    if "routine" in msg_lower or "morning" in msg_lower or "night" in msg_lower:
        return f"Based on your scan ({primary} concern, {skin_type}):\n\n• **Morning**: Gentle hydrating cleanser → {rec_actives} → Lightweight moisturizer → SPF 50+\n• **Night**: Double cleanse → Active treatment (e.g. BHA or Retinoid) → Barrier repair cream.\n• **Avoid**: {avoid_actives}."

    if "retinol" in msg_lower or "acne" in msg_lower or "breakout" in msg_lower:
        return f"For managing {primary}, start with gentle actives like **{rec_actives}**. Introduce retinol or exfoliating acids gradually (2 nights per week) and avoid {avoid_actives} to protect your skin barrier."

    return f"Based on your skin profile ({primary.title()}, {skin_type}):\n\n1. **Focus Actives**: Incorporate **{rec_actives}** into your daily routine.\n2. **Caution**: Avoid **{avoid_actives}**.\n3. **Consistency**: Give new products 4–6 weeks to show visible results while maintaining daily SPF protection."


async def get_skincare_advice(
    message: str,
    skin_context: dict | None = None,
    history: list[dict] | None = None
) -> str:
    """Generates complete AI advice using Gemini or fallback."""
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    if not gemini_key or gemini_key == "your_actual_api_key":
        return _build_fallback_reply(message, skin_context)

    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=SYSTEM_PROMPT
        )

        context_prompt = build_context_prompt(skin_context) if skin_context else ""
        trimmed_history = trim_history_sliding_window(history or [])

        gemini_history = []
        for msg in trimmed_history:
            role = "user" if msg.get("role") == "user" else "model"
            gemini_history.append({
                "role": role,
                "parts": [msg.get("content", "")]
            })

        chat = model.start_chat(history=gemini_history)

        prompt = ""
        if context_prompt and len(gemini_history) == 0:
            prompt += f"{context_prompt}\n\n"
        prompt += f"User inquiry: {message}"

        response = await chat.send_message_async(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error in get_skincare_advice: {e}")
        return _build_fallback_reply(message, skin_context)


async def get_skincare_advice_stream(
    message: str,
    skin_context: dict | None = None,
    history: list[dict] | None = None
) -> AsyncGenerator[str, None]:
    """Streams response tokens asynchronously."""
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    if not gemini_key or gemini_key == "your_actual_api_key":
        fallback = _build_fallback_reply(message, skin_context)
        # Yield words in chunks to simulate streaming
        words = fallback.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i:i+3]) + " "
            yield chunk
        return

    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=SYSTEM_PROMPT
        )

        context_prompt = build_context_prompt(skin_context) if skin_context else ""
        trimmed_history = trim_history_sliding_window(history or [])

        gemini_history = []
        for msg in trimmed_history:
            role = "user" if msg.get("role") == "user" else "model"
            gemini_history.append({
                "role": role,
                "parts": [msg.get("content", "")]
            })

        chat = model.start_chat(history=gemini_history)

        prompt = ""
        if context_prompt and len(gemini_history) == 0:
            prompt += f"{context_prompt}\n\n"
        prompt += f"User inquiry: {message}"

        response = await chat.send_message_async(prompt, stream=True)
        async for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        print(f"Gemini Streaming Error: {e}")
        fallback = _build_fallback_reply(message, skin_context)
        yield fallback