"""
Clinical Skincare Recommendation Engine.
Provides personalized active ingredient guides, routines, and lifestyle tips.
"""

INGREDIENT_GUIDE = {
    "acne": {
        "title": "Acne & Blemish Control",
        "ingredients": [
            "Salicylic Acid (BHA 2%)",
            "Niacinamide (4-5%)",
            "Benzoyl Peroxide (2.5%)",
            "Azelaic Acid (10%)",
            "Zinc PCA"
        ],
        "avoid": [
            "Heavy mineral oils",
            "Comedogenic waxes & coconut oil",
            "High-alcohol astringents",
            "Harsh physical walnut scrubs",
            "Synthetic fragrances"
        ],
        "morning_routine": [
            "Gentle foaming or gel cleanser",
            "Niacinamide + Zinc balancing serum",
            "Lightweight oil-free gel moisturizer",
            "Non-comedogenic matte SPF 50+"
        ],
        "night_routine": [
            "Clarifying BHA/Salicylic Acid cleanser",
            "Spot treatment or low-dose Retinoid (0.025%)",
            "Barrier-soothing ceramide gel cream"
        ],
        "weekly_treatments": [
            "Kaolin/Bentonite clay mask (1x/week)",
            "Gentle BHA liquid exfoliant (2x/week)"
        ],
        "product_types": [
            "Gel Cleanser",
            "Oil-Free Fluid",
            "Broad Spectrum Water-Gel SPF"
        ],
        "lifestyle": [
            "Change pillowcases at least twice weekly",
            "Sanitize smartphone screen daily",
            "Refrain from picking or touching active breakouts",
            "Stay well hydrated and reduce high-glycemic dairy intake"
        ]
    },

    "oily_skin": {
        "title": "Sebum Regulation & Pore Balance",
        "ingredients": [
            "Niacinamide (5-10%)",
            "Hyaluronic Acid (Low MW)",
            "Salicylic Acid (BHA)",
            "Green Tea Extract",
            "Zinc PCA"
        ],
        "avoid": [
            "Heavy petrolatum & thick ointments",
            "Pure coconut / cocoa butter",
            "Over-drying alcohol toners",
            "Heavy silicone primers"
        ],
        "morning_routine": [
            "Balancing gel/foaming cleanser",
            "Pore-refining Niacinamide toner",
            "Ultra-light oil-free water cream",
            "Matte-finish broad spectrum SPF 50"
        ],
        "night_routine": [
            "Double cleanse (Micellar water + Gentle foaming wash)",
            "BHA liquid exfoliant or gentle retinol",
            "Lightweight hydration gel"
        ],
        "weekly_treatments": [
            "Activated charcoal detox mask (1-2x/week)",
            "Enzyme peel exfoliation"
        ],
        "product_types": [
            "Foaming Cleanser",
            "Mattifying Fluid",
            "Oil-Control Sunscreen"
        ],
        "lifestyle": [
            "Use oil-blotting sheets instead of re-powdering",
            "Avoid over-washing to prevent rebound sebum production",
            "Maintain consistent 2L daily water intake"
        ]
    },

    "dry_skin": {
        "title": "Deep Hydration & Barrier Repair",
        "ingredients": [
            "Ceramides (NP, AP, EOP)",
            "Multi-Molecular Hyaluronic Acid",
            "Glycerin & Panthenol (Pro-Vitamin B5)",
            "Squalane",
            "Centella Asiatica (Cica)"
        ],
        "avoid": [
            "Denatured alcohol (Alcohol Denat)",
            "Sulfate (SLS) stripping cleansers",
            "Over-frequent chemical peeling",
            "Hot water showers on face"
        ],
        "morning_routine": [
            "Hydrating cream or milk cleanser (or water rinse)",
            "Soothing milky hydration toner",
            "Hyaluronic acid + Vitamin B5 serum",
            "Rich peptide barrier cream",
            "Nourishing broad spectrum SPF 50"
        ],
        "night_routine": [
            "Nourishing cleansing balm / oil",
            "Ceramide & peptide repair serum",
            "Thick lipid recovery night cream / gentle slugging"
        ],
        "weekly_treatments": [
            "Overnight hydration barrier sleeping mask (2x/week)",
            "Sheet mask with soothing Centella"
        ],
        "product_types": [
            "Cream Cleanser",
            "Barrier Repair Balm",
            "Hydrating Mineral Sunscreen"
        ],
        "lifestyle": [
            "Use a cool-mist room humidifier while sleeping",
            "Wash face with lukewarm water, never steaming hot",
            "Apply moisturizer to damp skin to lock in moisture"
        ]
    },

    "open_pores": {
        "title": "Pore Refinement & Elasticity",
        "ingredients": [
            "Niacinamide (5%)",
            "Salicylic Acid (BHA 2%)",
            "Encapsulated Retinol",
            "Vitamin C (L-Ascorbic Acid)",
            "Peptides & Adenosine"
        ],
        "avoid": [
            "Pore-stripping peel-off adhesive strips",
            "Heavy pore-clogging occlusives",
            "Harsh abrasive facial scrubs"
        ],
        "morning_routine": [
            "Gentle clarifying cleanser",
            "Antioxidant Vitamin C + Niacinamide serum",
            "Oil-free hydrator",
            "Invisible shield SPF 50"
        ],
        "night_routine": [
            "Double cleanse to melt sebum plugs",
            "Pore-clearing BHA toner (alternate nights)",
            "Cellular-turnover Retinol serum (alternate nights)",
            "Lightweight collagen-support cream"
        ],
        "weekly_treatments": [
            "AHA/BHA chemical exfoliation peel (1x/week)",
            "Clay pore-tightening treatment"
        ],
        "product_types": [
            "BHA Toner",
            "Pore Minimizer Serum",
            "Weightless Fluid SPF"
        ],
        "lifestyle": [
            "Never manually extract or squeeze enlarged pores",
            "Double-cleanse every evening if wearing makeup or sunscreen",
            "Keep hands clean and off the face"
        ]
    },

    "pigmentation": {
        "title": "Tone Correction & Radiance",
        "ingredients": [
            "Vitamin C (10-15% Pure L-Ascorbic)",
            "Alpha Arbutin (2%)",
            "Tranexamic Acid (3-5%)",
            "Kojic Acid",
            "Niacinamide",
            "Azelaic Acid"
        ],
        "avoid": [
            "Direct unprotected UV exposure",
            "Physical picking / scratching at spots",
            "Essential oils that cause photosensitivity"
        ],
        "morning_routine": [
            "Mild brightening cleanser",
            "High-potency Vitamin C antioxidant serum",
            "Alpha Arbutin balancing fluid",
            "Lightweight brightening moisturizer",
            "High-protection SPF 50+ (Crucial for fading dark spots)"
        ],
        "night_routine": [
            "Gentle cleanser",
            "Tranexamic acid / Azelaic acid brightening serum",
            "Targeted dark spot corrector",
            "Barrier restoring night cream"
        ],
        "weekly_treatments": [
            "AHA (Glycolic/Lactic Acid) resurfacing treatment (1x/week)",
            "Vitamin C glow radiance mask"
        ],
        "product_types": [
            "Vitamin C Serum",
            "Broad-Spectrum Tinted Sunscreen",
            "Brightening Night Treatment"
        ],
        "lifestyle": [
            "Reapply SPF every 2 hours when outdoors or near windows",
            "Wear a wide-brim hat during peak UV hours (10 AM - 4 PM)",
            "Combine Vitamin C and Sunscreen for synergistic UV defense"
        ]
    },

    "normal": {
        "title": "Preventative Care & Radiance Maintenance",
        "ingredients": [
            "Antioxidant Complex (Vitamin E, Ferulic Acid)",
            "Hyaluronic Acid",
            "Peptides",
            "Ceramides",
            "Broad Spectrum UV Filters"
        ],
        "avoid": [
            "Overly aggressive treatments that disrupt healthy skin barrier",
            "Skipping daily sunscreen"
        ],
        "morning_routine": [
            "Gentle pH-balanced cleanser",
            "Antioxidant protective serum",
            "Daily hydration moisturizer",
            "Broad spectrum SPF 50"
        ],
        "night_routine": [
            "Mild cleanser",
            "Nourishing peptide or low-strength retinol serum",
            "Replenishing night cream"
        ],
        "weekly_treatments": [
            "Hydrating essence mask (1x/week)",
            "Gentle enzyme smoothing polish"
        ],
        "product_types": [
            "Balanced Cleanser",
            "Antioxidant Moisturizer",
            "Daily Sunscreen"
        ],
        "lifestyle": [
            "Maintain balanced sleep and hydration habits",
            "Keep up consistent daily SPF protection",
            "Eat antioxidant-rich fruits and vegetables"
        ]
    }
}


def get_recommendations(scores: dict) -> dict:
    """
    Generate personalized skincare recommendations based on predicted condition scores.
    """
    sorted_conditions = sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    primary = sorted_conditions[0][0]
    primary_score = sorted_conditions[0][1]

    # Secondary conditions with significant confidence (> 30%)
    secondary = [
        c for c, s in sorted_conditions[1:]
        if s > 30 and c != "normal"
    ]

    guide = INGREDIENT_GUIDE.get(primary, INGREDIENT_GUIDE["normal"])

    # Severity evaluation
    if primary == "normal":
        severity = "mild"
    elif primary_score >= 65:
        severity = "severe"
    elif primary_score >= 35:
        severity = "moderate"
    else:
        severity = "mild"

    # Build combined avoid list
    combined_avoid = list(guide["avoid"])
    for cond in secondary:
        sec_guide = INGREDIENT_GUIDE.get(cond, {})
        for avoid_item in sec_guide.get("avoid", []):
            if avoid_item not in combined_avoid:
                combined_avoid.append(avoid_item)

    # Extra clinical notes
    extra_tips = []
    if primary == "acne" and "dry_skin" in secondary:
        extra_tips.append(
            "Acne with dry skin detected: Prioritize barrier hydration alongside BHA to prevent flaking and rebound breakouts."
        )
    if "pigmentation" in secondary or primary == "pigmentation":
        extra_tips.append(
            "UV defense is the #1 factor in resolving pigmentation: Daily SPF 50+ reapplication is mandatory."
        )
    if "open_pores" in secondary or primary == "open_pores":
        extra_tips.append(
            "Pore care tip: Regular double cleansing prevents sebum oxidation that stretches pore walls."
        )
    if severity == "severe":
        extra_tips.append(
            "High condition severity detected. Clinical consultation with a certified dermatologist is strongly recommended."
        )

    return {
        "primary_condition": primary,
        "title": guide.get("title", "Personalized Skincare Plan"),
        "secondary_conditions": secondary,
        "severity": severity,
        "confidence_score": round(primary_score, 1),
        "key_ingredients": guide["ingredients"],
        "ingredients_to_avoid": combined_avoid,
        "morning_routine": guide["morning_routine"],
        "night_routine": guide["night_routine"],
        "weekly_treatments": guide.get("weekly_treatments", []),
        "recommended_product_types": guide.get("product_types", []),
        "lifestyle_tips": guide["lifestyle"],
        "extra_tips": extra_tips,
        "professional_advice": (
            "Consider booking a dermatologist consultation for tailored prescription care."
            if severity == "severe"
            else None
        )
    }