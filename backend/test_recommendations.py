from recommendations import get_recommendations

fake_scores = {
    "acne": 82.5,
    "oily_skin": 60.0,
    "dry_skin": 12.0,
    "pigmentation": 25.0,
    "normal": 5.0
}

result = get_recommendations(fake_scores)

print(result)