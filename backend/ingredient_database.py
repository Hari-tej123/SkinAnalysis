"""
Comprehensive clinical skincare ingredient database.
Used by the Product OCR Scanner to identify benefits, concerns, and comedogenic ratings.
"""

INGREDIENTS_DB = {
    # 1. Salicylic Acid
    "salicylic acid": {
        "benefit": "Unclogs pores, dissolves sebum, reduces acne and blackheads",
        "concern": "Can be drying if overused",
        "comedogenic": 0,
        "categories": ["bha", "exfoliant", "acne_fighter"],
        "good_for": ["acne", "oily_skin", "open_pores"],
        "bad_for": ["dry_skin"]
    },
    # 2. Niacinamide
    "niacinamide": {
        "benefit": "Reduces enlarged pores, regulates oil, brightens tone and calms inflammation",
        "concern": None,
        "comedogenic": 0,
        "categories": ["vitamin", "brightener", "barrier"],
        "good_for": ["acne", "oily_skin", "pigmentation", "open_pores"],
        "bad_for": []
    },
    # 3. Coconut Oil
    "coconut oil": {
        "benefit": "Deep surface moisturization and lipid replenishment",
        "concern": "Highly comedogenic — clogs pores and triggers breakouts",
        "comedogenic": 4,
        "categories": ["oil", "moisturizer", "comedogenic_risk"],
        "good_for": ["dry_skin"],
        "bad_for": ["acne", "oily_skin", "open_pores"]
    },
    # 4. Hyaluronic Acid
    "hyaluronic acid": {
        "benefit": "Intense multi-layer hydration, plumps fine lines and restores moisture barrier",
        "concern": None,
        "comedogenic": 0,
        "categories": ["humectant", "hydration"],
        "good_for": ["dry_skin", "normal", "acne", "open_pores"],
        "bad_for": []
    },
    # 5. Retinol
    "retinol": {
        "benefit": "Accelerates cellular renewal, shrinks pore appearance, fades dark spots",
        "concern": "Can cause initial purging and dryness; avoid if pregnant",
        "comedogenic": 0,
        "categories": ["retinoid", "anti_aging", "cell_renewal"],
        "good_for": ["pigmentation", "open_pores", "acne"],
        "bad_for": []
    },
    # 6. Dimethicone
    "dimethicone": {
        "benefit": "Smooths skin texture and seals trans-epidermal moisture",
        "concern": "Can trap sweat and sebum in congestion-prone pores",
        "comedogenic": 2,
        "categories": ["silicone", "occlusive"],
        "good_for": ["dry_skin", "normal"],
        "bad_for": ["acne", "oily_skin"]
    },
    # 7. Isopropyl Myristate
    "isopropyl myristate": {
        "benefit": "Improves product glide and cosmetic absorption",
        "concern": "Extremely high comedogenic rating — major pore-clogging trigger",
        "comedogenic": 5,
        "categories": ["emollient", "comedogenic_risk"],
        "good_for": [],
        "bad_for": ["acne", "oily_skin", "open_pores"]
    },
    # 8. Glycerin
    "glycerin": {
        "benefit": "Gentle humectant that pulls moisture into the outer skin layers",
        "concern": None,
        "comedogenic": 0,
        "categories": ["humectant", "barrier"],
        "good_for": ["dry_skin", "normal", "acne"],
        "bad_for": []
    },
    # 9. Vitamin C / Ascorbic Acid
    "vitamin c": {
        "benefit": "Brightens dark spots, promotes collagen, and neutralizes free radicals",
        "concern": "Can oxidize quickly; may cause mild tingling on sensitive skin",
        "comedogenic": 0,
        "categories": ["vitamin", "brightener", "antioxidant"],
        "good_for": ["pigmentation", "normal"],
        "bad_for": []
    },
    # 10. Alcohol Denat
    "alcohol denat": {
        "benefit": "Quick-drying solvent and astringent",
        "concern": "Extremely drying, disrupts skin barrier lipid matrix",
        "comedogenic": 0,
        "categories": ["alcohol", "astringent"],
        "good_for": [],
        "bad_for": ["dry_skin", "acne", "normal"]
    },
    # 11. Shea Butter
    "shea butter": {
        "benefit": "Rich emollient fatty acids for barrier soothing",
        "concern": "Heavy occlusive texture may congest oily or acne-prone skin",
        "comedogenic": 2,
        "categories": ["butter", "moisturizer"],
        "good_for": ["dry_skin"],
        "bad_for": ["acne", "oily_skin"]
    },
    # 12. Zinc Oxide
    "zinc oxide": {
        "benefit": "Mineral broad-spectrum UV filter, calms inflammation and redness",
        "concern": None,
        "comedogenic": 0,
        "categories": ["sunscreen", "mineral", "soothing"],
        "good_for": ["acne", "oily_skin", "normal"],
        "bad_for": []
    },
    # 13. Titanium Dioxide
    "titanium dioxide": {
        "benefit": "Physical sunscreen filter with high photostability",
        "concern": None,
        "comedogenic": 0,
        "categories": ["sunscreen", "mineral"],
        "good_for": ["acne", "oily_skin", "normal"],
        "bad_for": []
    },
    # 14. Ceramide
    "ceramide": {
        "benefit": "Restores essential intercellular lipids and repairs moisture barrier",
        "concern": None,
        "comedogenic": 0,
        "categories": ["lipid", "barrier", "repair"],
        "good_for": ["dry_skin", "normal", "acne"],
        "bad_for": []
    },
    # 15. Alpha Arbutin
    "alpha arbutin": {
        "benefit": "Tyrosinase inhibitor that safely fades post-acne marks and sun spots",
        "concern": None,
        "comedogenic": 0,
        "categories": ["brightener", "pigment_corrector"],
        "good_for": ["pigmentation"],
        "bad_for": []
    },
    # 16. Benzoyl Peroxide
    "benzoyl peroxide": {
        "benefit": "Eradicates P. acnes bacteria and prevents inflammatory pimples",
        "concern": "Can bleach fabrics and cause initial dryness/flaking",
        "comedogenic": 0,
        "categories": ["acne_fighter", "antibacterial"],
        "good_for": ["acne"],
        "bad_for": ["dry_skin"]
    },
    # 17. Mineral Oil
    "mineral oil": {
        "benefit": "Forms a protective film to prevent moisture loss",
        "concern": "Can trap sebum and sweat if not cleansed thoroughly",
        "comedogenic": 2,
        "categories": ["oil", "occlusive"],
        "good_for": ["dry_skin"],
        "bad_for": ["acne"]
    },
    # 18. Fragrance / Parfum
    "fragrance": {
        "benefit": "Provides cosmetic aromatic scent",
        "concern": "Leading cause of contact dermatitis, barrier irritation, and flare-ups",
        "comedogenic": 0,
        "categories": ["fragrance", "irritant_risk"],
        "good_for": [],
        "bad_for": ["acne", "dry_skin", "normal"]
    },
    # 19. Lactic Acid
    "lactic acid": {
        "benefit": "Mild AHA exfoliant with natural moisturizing humectant properties",
        "concern": "Increases photosensitivity to UV rays",
        "comedogenic": 0,
        "categories": ["aha", "exfoliant", "brightener"],
        "good_for": ["dry_skin", "pigmentation"],
        "bad_for": []
    },
    # 20. Kojic Acid
    "kojic acid": {
        "benefit": "Derived from fungi to visibly diminish melasma and discoloration",
        "concern": "Can cause contact sensitivity in concentrations > 2%",
        "comedogenic": 0,
        "categories": ["brightener", "antioxidant"],
        "good_for": ["pigmentation"],
        "bad_for": []
    },
    # 21. Azelaic Acid
    "azelaic acid": {
        "benefit": "Dual-action dicarboxylic acid that combats acne bacteria and reduces redness",
        "concern": "Mild transient stinging upon application",
        "comedogenic": 0,
        "categories": ["acne_fighter", "brightener", "anti_inflammatory"],
        "good_for": ["acne", "pigmentation", "oily_skin"],
        "bad_for": []
    },
    # 22. Centella Asiatica / Cica
    "centella asiatica": {
        "benefit": "Powerful botanical antioxidant that soothes irritated and inflamed skin",
        "concern": None,
        "comedogenic": 0,
        "categories": ["botanical", "soothing", "barrier"],
        "good_for": ["acne", "dry_skin", "normal"],
        "bad_for": []
    },
    # 23. Squalane
    "squalane": {
        "benefit": "Biomimetic lightweight hydrator that softens skin without clogging",
        "concern": None,
        "comedogenic": 1,
        "categories": ["lipid", "hydration", "non_comedogenic_oil"],
        "good_for": ["dry_skin", "oily_skin", "normal"],
        "bad_for": []
    },
    # 24. Glycolic Acid
    "glycolic acid": {
        "benefit": "Smallest molecule AHA that deeply exfoliates dead keratinized cells",
        "concern": "High potency may cause stinging on compromised skin barriers",
        "comedogenic": 0,
        "categories": ["aha", "exfoliant"],
        "good_for": ["pigmentation", "open_pores"],
        "bad_for": ["dry_skin"]
    },
    # 25. Tranexamic Acid
    "tranexamic acid": {
        "benefit": "Inhibits UV-induced plasmin activity to dramatically fade stubborn melasma",
        "concern": None,
        "comedogenic": 0,
        "categories": ["brightener", "melasma_fighter"],
        "good_for": ["pigmentation"],
        "bad_for": []
    },
    # 26. Panthenol / Vitamin B5
    "panthenol": {
        "benefit": "Deeply moisturizes, accelerates skin wound healing, and strengthens barrier",
        "concern": None,
        "comedogenic": 0,
        "categories": ["vitamin", "barrier", "soothing"],
        "good_for": ["dry_skin", "acne", "normal"],
        "bad_for": []
    },
    # 27. Kaolin Clay
    "kaolin": {
        "benefit": "Absorbs excess surface sebum and refines congested pores",
        "concern": "Can feel tight if left on until bone dry",
        "comedogenic": 0,
        "categories": ["clay", "sebum_control"],
        "good_for": ["oily_skin", "acne", "open_pores"],
        "bad_for": ["dry_skin"]
    },
    # 28. Bentonite Clay
    "bentonite": {
        "benefit": "High-absorbency volcanic clay that clarifies oil and draws impurities",
        "concern": "Drying for low-sebum skin types",
        "comedogenic": 0,
        "categories": ["clay", "sebum_control"],
        "good_for": ["oily_skin", "acne", "open_pores"],
        "bad_for": ["dry_skin"]
    },
    # 29. Zinc PCA
    "zinc pca": {
        "benefit": "Regulates sebaceous gland secretion while maintaining hydration",
        "concern": None,
        "comedogenic": 0,
        "categories": ["mineral", "sebum_control"],
        "good_for": ["oily_skin", "acne", "open_pores"],
        "bad_for": []
    },
    # 30. Green Tea Extract
    "green tea": {
        "benefit": "EGCG polyphenol provides antioxidant and sebum-reducing benefits",
        "concern": None,
        "comedogenic": 0,
        "categories": ["antioxidant", "botanical"],
        "good_for": ["oily_skin", "acne", "normal"],
        "bad_for": []
    },
    # 31. Cocoa Butter
    "cocoa butter": {
        "benefit": "Intensely rich emollient for extremely dry body areas",
        "concern": "Comedogenic rating of 4 — severe pore clogger on facial skin",
        "comedogenic": 4,
        "categories": ["butter", "comedogenic_risk"],
        "good_for": ["dry_skin"],
        "bad_for": ["acne", "oily_skin", "open_pores"]
    },
    # 32. Wheat Germ Oil
    "wheat germ oil": {
        "benefit": "Rich in Vitamin E for extreme dryness",
        "concern": "Comedogenic rating of 5 — highest possible pore blockage risk",
        "comedogenic": 5,
        "categories": ["oil", "comedogenic_risk"],
        "good_for": [],
        "bad_for": ["acne", "oily_skin", "open_pores"]
    },
    # 33. Allantoin
    "allantoin": {
        "benefit": "Calms irritated skin and stimulates healthy cell tissue proliferation",
        "concern": None,
        "comedogenic": 0,
        "categories": ["soothing", "healing"],
        "good_for": ["acne", "dry_skin", "normal"],
        "bad_for": []
    },
    # 34. Peptides / Copper Peptides
    "peptides": {
        "benefit": "Signal molecules that stimulate collagen synthesis and skin elasticity",
        "concern": None,
        "comedogenic": 0,
        "categories": ["anti_aging", "collagen"],
        "good_for": ["open_pores", "normal", "dry_skin"],
        "bad_for": []
    },
    # 35. Tea Tree Oil
    "tea tree oil": {
        "benefit": "Natural antimicrobial terpinen-4-ol that combats acne lesions",
        "concern": "Must be properly diluted to avoid contact dermatitis",
        "comedogenic": 0,
        "categories": ["essential_oil", "antibacterial"],
        "good_for": ["acne", "oily_skin"],
        "bad_for": ["dry_skin"]
    },
    # 36. L-Ascorbic Acid
    "ascorbic acid": {
        "benefit": "Purest form of Vitamin C for collagen building and brightening",
        "concern": "Requires low pH (< 3.5) which may cause transient redness",
        "comedogenic": 0,
        "categories": ["vitamin", "antioxidant", "brightener"],
        "good_for": ["pigmentation", "normal"],
        "bad_for": []
    },
    # 37. Sodium Laureth Sulfate (SLES)
    "sodium laureth sulfate": {
        "benefit": "Effective foaming surfactant for makeup removal",
        "concern": "Can strip natural lipid moisture barrier with frequent use",
        "comedogenic": 0,
        "categories": ["surfactant", "cleanser"],
        "good_for": ["oily_skin"],
        "bad_for": ["dry_skin", "acne"]
    },
    # 38. Sodium Lauryl Sulfate (SLS)
    "sodium lauryl sulfate": {
        "benefit": "Aggressive surfactant and degreaser",
        "concern": "Known skin irritant; compromises stratum corneum barrier",
        "comedogenic": 2,
        "categories": ["surfactant", "stripping_agent"],
        "good_for": [],
        "bad_for": ["dry_skin", "acne", "normal"]
    },
    # 39. Jojoba Oil
    "jojoba oil": {
        "benefit": "Wax ester closely resembling human sebum; balances oil production",
        "concern": None,
        "comedogenic": 2,
        "categories": ["oil", "balancing"],
        "good_for": ["oily_skin", "dry_skin", "normal"],
        "bad_for": []
    },
    # 40. Rosehip Oil
    "rosehip oil": {
        "benefit": "High in linoleic acid and pro-vitamin A; fades blemishes and scars",
        "concern": "Can spoil quickly; store in cool dark container",
        "comedogenic": 1,
        "categories": ["oil", "brightener", "regenerative"],
        "good_for": ["pigmentation", "acne", "dry_skin"],
        "bad_for": []
    },
    # 41. Argan Oil
    "argan oil": {
        "benefit": "Nourishing oleic and linoleic acids with Vitamin E",
        "concern": None,
        "comedogenic": 0,
        "categories": ["oil", "antioxidant"],
        "good_for": ["dry_skin", "normal"],
        "bad_for": ["oily_skin"]
    },
    # 42. Bakuchiol
    "bakuchiol": {
        "benefit": "Plant-derived alternative to retinol; gentle on skin barrier",
        "concern": None,
        "comedogenic": 0,
        "categories": ["botanical", "anti_aging", "gentle"],
        "good_for": ["pigmentation", "open_pores", "acne"],
        "bad_for": []
    },
    # 43. Colloidal Oatmeal
    "colloidal oatmeal": {
        "benefit": "FDA-approved skin protectant that relieves itching and barrier distress",
        "concern": None,
        "comedogenic": 0,
        "categories": ["soothing", "barrier_repair"],
        "good_for": ["dry_skin", "acne", "normal"],
        "bad_for": []
    },
    # 44. Mandelic Acid
    "mandelic acid": {
        "benefit": "Large molecule AHA that gently accelerates turnover with zero irritation",
        "concern": None,
        "comedogenic": 0,
        "categories": ["aha", "exfoliant", "gentle"],
        "good_for": ["acne", "pigmentation"],
        "bad_for": []
    },
    # 45. Ferulic Acid
    "ferulic acid": {
        "benefit": "Antioxidant that stabilizes Vitamin C and boosts sun protection",
        "concern": None,
        "comedogenic": 0,
        "categories": ["antioxidant", "photoprotection"],
        "good_for": ["pigmentation", "normal"],
        "bad_for": []
    },
    # 46. Tocopherol / Vitamin E
    "tocopherol": {
        "benefit": "Lipid-soluble antioxidant that shields against environmental damage",
        "concern": "Synthetic heavy esters can occasionally trigger congestion",
        "comedogenic": 2,
        "categories": ["vitamin", "antioxidant"],
        "good_for": ["dry_skin", "normal"],
        "bad_for": ["acne"]
    },
    # 47. Witch Hazel
    "witch hazel": {
        "benefit": "Plant extract with astringent tannins for temporary pore tightening",
        "concern": "Often distilled with high alcohol which dries and inflames skin",
        "comedogenic": 0,
        "categories": ["botanical", "astringent"],
        "good_for": ["oily_skin"],
        "bad_for": ["dry_skin", "acne"]
    },
    # 48. Licorice Root Extract
    "licorice root": {
        "benefit": "Glabridin compound disperses melanin and calms red discoloration",
        "concern": None,
        "comedogenic": 0,
        "categories": ["botanical", "brightener", "soothing"],
        "good_for": ["pigmentation", "acne", "normal"],
        "bad_for": []
    },
    # 49. Adenosine
    "adenosine": {
        "benefit": "Yeast-derived ingredient that supports collagen and soothes skin",
        "concern": None,
        "comedogenic": 0,
        "categories": ["anti_aging", "elasticity"],
        "good_for": ["open_pores", "normal", "dry_skin"],
        "bad_for": []
    },
    # 50. Madecassoside
    "madecassoside": {
        "benefit": "Active molecule of Centella Asiatica for intensive barrier healing",
        "concern": None,
        "comedogenic": 0,
        "categories": ["botanical", "healing", "cica"],
        "good_for": ["acne", "dry_skin", "normal"],
        "bad_for": []
    },
    # 51. Algae Extract
    "algae extract": {
        "benefit": "Rich in marine minerals and moisture-binding polysaccharides",
        "concern": "High comedogenic rating in certain concentrated forms (rating 4-5)",
        "comedogenic": 4,
        "categories": ["marine", "comedogenic_risk"],
        "good_for": ["dry_skin"],
        "bad_for": ["acne", "open_pores"]
    },
    # 52. Laureth-4
    "laureth-4": {
        "benefit": "Surfactant and emulsifier",
        "concern": "Comedogenic rating 5 — strongly induces follicular plug formation",
        "comedogenic": 5,
        "categories": ["surfactant", "comedogenic_risk"],
        "good_for": [],
        "bad_for": ["acne", "oily_skin", "open_pores"]
    }
}
