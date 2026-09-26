import re
import requests

from users.models import UserProfile


OPEN_FOOD_FACTS_SEARCH_URL = (
    "https://world.openfoodfacts.net/api/v2/search"
)

OPEN_FOOD_FACTS_TEXT_SEARCH_URL = (
    "https://world.openfoodfacts.net/cgi/search.pl"
)


CATEGORY_MAPPING = {
    "sweets": "sweets",
    "sweet": "sweets",
    "biscuits": "biscuits",
    "cookies": "biscuits",
    "chips": "chips",
    "snacks": "snacks",
    "chocolates": "chocolates",
    "chocolate": "chocolates",
    "fruit juices": "fruit-juices",
    "fruit juice": "fruit-juices",
    "soft drinks": "soft-drinks",
    "soft drink": "soft-drinks",
    "sweet spreads": "sweet-spreads",
    "sweet spread": "sweet-spreads",
    "cereals": "breakfast-cereals",
    "breakfast cereals": "breakfast-cereals",
    "instant noodles": "instant-noodles",
    "noodles": "noodles",
    "sauces": "sauces",
    "dairy products": "dairy-products",
    "milk": "milks",
}


PRODUCT_TYPE_KEYWORDS = {
    "sweets": {
        "candy": {
            "candy",
            "bonbon",
            "hard candy",
            "mint",
            "lozenge",
            "toffee",
            "caramel",
            "lollipop",
            "gummy",
            "gummies",
            "jelly",
            "chew",
        },
        "chocolate": {
            "chocolate",
            "cocoa",
            "truffle",
            "praline",
            "choco",
        },
        "indian_sweet": {
            "soan",
            "soan papdi",
            "papdi",
            "laddu",
            "ladoo",
            "barfi",
            "burfi",
            "halwa",
            "gulab",
            "gulab jamun",
            "jamun",
            "rasgulla",
            "jalebi",
            "mysore",
            "mysore pak",
            "peda",
            "kaju",
            "kaju katli",
            "katli",
        },
    },

    "biscuits": {
        "biscuit": {
            "biscuit",
            "cookie",
            "cookies",
            "cracker",
            "wafer",
        },
    },

    "chips": {
        "chips": {
            "chips",
            "crisps",
            "potato",
            "nachos",
            "tortilla",
        },
    },

    "chocolates": {
        "chocolate": {
            "chocolate",
            "cocoa",
            "truffle",
            "praline",
        },
    },

    "fruit-juices": {
        "juice": {
            "juice",
            "nectar",
            "fruit drink",
        },
    },

    "soft-drinks": {
        "soft_drink": {
            "cola",
            "soda",
            "soft drink",
            "carbonated",
            "fizzy",
        },
        "fruit_drink": {
            "fruit drink",
            "fruit beverage",
            "mango drink",
            "mango beverage",
            "mango juice",
            "maaza",
            "frooti",
            "slice mango",
        },
    },

    "sweet-spreads": {
        "spread": {
            "spread",
            "nutella",
            "hazelnut",
            "peanut butter",
            "chocolate spread",
        },
    },

    "breakfast-cereals": {
        "cereal": {
            "cereal",
            "flakes",
            "muesli",
            "granola",
            "oats",
        },
    },

    "instant-noodles": {
        "noodles": {
            "noodle",
            "noodles",
            "ramen",
            "vermicelli",
        },
    },
}


PRODUCT_SEARCH_TERMS = {
    "indian_sweet": [
        "mysore pak",
        "soan papdi",
        "laddu",
        "ladoo",
        "barfi",
        "burfi",
        "halwa",
        "peda",
        "kaju katli",
        "gulab jamun",
        "rasgulla",
        "jalebi",
    ],
    "fruit_drink": [
        "mango drink",
        "mango juice",
        "fruit drink",
        "fruit beverage",
    ],
}


def normalize_text(text):
    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text,
    )

    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


def normalize_category(category):
    if not category:
        return None

    category = category.strip().lower()

    return CATEGORY_MAPPING.get(category)


def get_product_category(food_label):
    analysis = food_label.analysis or {}

    category = analysis.get("product_category")

    if category:
        return normalize_category(category)

    # Fallback for older analyses
    # that do not have product_category.
    product_name = normalize_text(
        analysis.get("product_name") or ""
    )

    if any(
        keyword in product_name
        for keyword in [
            "mysore pak",
            "soan papdi",
            "laddu",
            "ladoo",
            "barfi",
            "burfi",
            "halwa",
            "gulab jamun",
            "rasgulla",
            "jalebi",
            "peda",
            "kaju katli",
        ]
    ):
        return "sweets"

    if any(
        keyword in product_name
        for keyword in [
            "chocolate",
            "cocoa",
            "truffle",
            "praline",
        ]
    ):
        return "chocolates"

    if any(
        keyword in product_name
        for keyword in [
            "biscuit",
            "cookie",
            "cracker",
            "wafer",
        ]
    ):
        return "biscuits"

    if any(
        keyword in product_name
        for keyword in [
            "chips",
            "crisps",
            "nachos",
        ]
    ):
        return "chips"

    if any(
        keyword in product_name
        for keyword in [
            "juice",
            "nectar",
            "maaza",
            "frooti",
            "slice",
            "fruit drink",
            "mango drink",
            "mango beverage",
        ]
    ):
        return "fruit-juices"

    return None


def search_products_by_category(
    category,
    page_size=30,
    search_terms=None,
):
    """
    Search Open Food Facts for candidate products.

    The v2 endpoint supports structured category filtering, but it does
    not support full-text ``search_terms``. When a specific search term
    is supplied, use the legacy full-text endpoint instead. This is
    important for product types such as Soan Papdi and Maaza, where the
    useful product name may not be represented by an Open Food Facts
    category tag.
    """

    fields = (
        "code,"
        "product_name,"
        "brands,"
        "categories_tags,"
        "ingredients_text,"
        "allergens_tags,"
        "nutriments,"
        "image_url"
    )

    headers = {
        "User-Agent": (
            "AI-Food-Label-Analyzer/1.0 "
            "(MCA Project)"
        )
    }

    if search_terms:
        # Full-text search. Open Food Facts documents that the v2 search
        # endpoint does not support search_terms, while the legacy search
        # endpoint does.
        params = {
            "search_terms": search_terms,
            "page": 1,
            "page_size": page_size,
            "json": 1,
            "fields": fields,
        }

        response = requests.get(
            OPEN_FOOD_FACTS_TEXT_SEARCH_URL,
            params=params,
            headers=headers,
            auth=("off", "off"),
            timeout=15,
        )
    else:
        # Structured category search.
        params = {
            "categories_tags_en": category,
            "page": 1,
            "page_size": page_size,
            "fields": fields,
        }

        response = requests.get(
            OPEN_FOOD_FACTS_SEARCH_URL,
            params=params,
            headers=headers,
            auth=("off", "off"),
            timeout=15,
        )

    response.raise_for_status()

    data = response.json()

    return data.get("products", [])


def has_allergen_conflict(product, user_profile):
    product_allergens = (
        product.get("allergens_tags") or []
    )

    user_allergies = [
        allergy.strip().lower()
        for allergy in (user_profile.allergies or [])
        if allergy.strip()
    ]

    if user_profile.other_allergy:
        user_allergies.append(
            user_profile.other_allergy.strip().lower()
        )

    for allergen in product_allergens:
        allergen_name = (
            allergen.replace("en:", "")
            .replace("-", " ")
            .lower()
            .strip()
        )

        for allergy in user_allergies:
            if (
                allergy in allergen_name
                or allergen_name in allergy
            ):
                return True

    return False


def has_dietary_conflict(product, user_profile):
    preference = (
        user_profile.dietary_preference or ""
    ).strip().lower()

    if not preference:
        return False

    ingredients = (
        product.get("ingredients_text") or ""
    ).lower()

    allergens = product.get("allergens_tags") or []

    # Vegetarian
    if preference == "vegetarian":

        if "gelatin" in ingredients:
            return True

        if "gelatine" in ingredients:
            return True

        if any(
            "gelatin" in allergen.lower()
            or "gelatine" in allergen.lower()
            for allergen in allergens
        ):
            return True

    # Vegan
    if preference == "vegan":

        animal_ingredients = [
            "milk",
            "butter",
            "cream",
            "cheese",
            "whey",
            "casein",
            "gelatin",
            "gelatine",
            "egg",
            "honey",
        ]

        for ingredient in animal_ingredients:
            if ingredient in ingredients:
                return True

        for allergen in allergens:
            allergen_name = allergen.lower()

            if any(
                item in allergen_name
                for item in [
                    "milk",
                    "egg",
                ]
            ):
                return True

    return False


def get_original_product_text(food_label):
    analysis = food_label.analysis or {}

    product_name = normalize_text(
        analysis.get("product_name") or ""
    )

    ingredients = analysis.get("ingredients") or []

    ingredient_text = ""

    if isinstance(ingredients, list):

        parts = []

        for ingredient in ingredients:

            if isinstance(ingredient, str):
                parts.append(ingredient)

            elif isinstance(ingredient, dict):
                parts.append(
                    ingredient.get("name")
                    or ingredient.get("ingredient")
                    or ingredient.get("text")
                    or ""
                )

        ingredient_text = " ".join(parts)

    elif isinstance(ingredients, str):
        ingredient_text = ingredients

    return (
        product_name,
        normalize_text(ingredient_text),
    )

def detect_product_type(text, category=None):
    """
    Detect the most specific product type from the product text.

    More specific phrases are checked before generic words. This is
    important for names such as ``Haldiram's Chocolate Soan Papdi``:
    ``soan papdi`` should identify the product as an Indian sweet even
    though the name also contains the generic word ``chocolate``.

    The function checks the complete product text, including the product
    name and, for Open Food Facts candidates, category tags.
    """

    text = normalize_text(text)

    if not text:
        return None

    matches = []

    for category_name, category_types in PRODUCT_TYPE_KEYWORDS.items():
        for product_type, keywords in category_types.items():
            for keyword in keywords:
                normalized_keyword = normalize_text(keyword)

                if normalized_keyword and normalized_keyword in text:
                    matches.append(
                        (
                            len(normalized_keyword),
                            product_type,
                        )
                    )

    if not matches:
        return None

    # Prefer the longest, most specific phrase.
    # Example: ``soan papdi`` wins over ``soan`` and ``chocolate``.
    matches.sort(
        key=lambda item: item[0],
        reverse=True,
    )

    return matches[0][1]

def calculate_relevance(food_label, product):
    category = get_product_category(
        food_label
    )

    original_name, original_ingredients = (
        get_original_product_text(
            food_label
        )
    )

    candidate_name = normalize_text(
        product.get("product_name") or ""
    )

    candidate_ingredients = normalize_text(
        product.get("ingredients_text") or ""
    )

    candidate_categories = " ".join(
        [
            category_name
            .replace("en:", "")
            .replace("-", " ")
            for category_name in (
                product.get("categories_tags")
                or []
            )
        ]
    )

    candidate_text = " ".join(
        [
            candidate_name,
            candidate_categories,
        ]
    )

    score = 0

    original_type = detect_product_type(
        original_name,
        category,
    )

    candidate_type = detect_product_type(
        candidate_text,
        category,
    )

    # Matching specific product types
    if (
        original_type
        and candidate_type
        and original_type == candidate_type
    ):
        score += 8

    elif (
        original_type
        and candidate_type
        and original_type != candidate_type
    ):
        score -= 4

    # Product name word overlap
    original_words = set(
        original_name.split()
    )

    candidate_words = set(
        candidate_name.split()
    )

    common_name_words = (
        original_words
        & candidate_words
    )

    score += min(
        len(common_name_words) * 2,
        4,
    )

    # Ingredient overlap
    if (
        original_ingredients
        and candidate_ingredients
    ):

        original_terms = set(
            word
            for word in original_ingredients.split()
            if len(word) >= 4
        )

        candidate_terms = set(
            word
            for word in candidate_ingredients.split()
            if len(word) >= 4
        )

        common_ingredients = (
            original_terms
            & candidate_terms
        )

        score += min(
            len(common_ingredients),
            3,
        )

    # Category match
    if category:

        normalized_candidate_categories = (
            candidate_categories
        )

        normalized_category = (
            category
            .replace("-", " ")
            .lower()
        )

        if normalized_category in (
            normalized_candidate_categories
        ):
            score += 2

    return score

def is_relevant_product(food_label, product):
    """
    Keep alternatives within the same specific product type.

    If the original product can be identified as a specific
    type, only products with the same type are accepted.

    If no specific type can be identified, fall back to
    the relevance score.
    """

    category = get_product_category(food_label)

    original_name, original_ingredients = (
        get_original_product_text(food_label)
    )

    candidate_name = normalize_text(
        product.get("product_name") or ""
    )

    candidate_categories = " ".join(
        [
            category_name
            .replace("en:", "")
            .replace("-", " ")
            for category_name in (
                product.get("categories_tags") or []
            )
        ]
    )

    candidate_text = " ".join(
        [
            candidate_name,
            candidate_categories,
        ]
    )

    original_type = detect_product_type(
        original_name,
        category
    )

    candidate_type = detect_product_type(
        candidate_text,
        category
    )

    # --------------------------------------------------
    # Strict matching for specific product types
    # --------------------------------------------------

    if original_type:
        return candidate_type == original_type

    # --------------------------------------------------
    # Fallback when no specific type is detected
    # --------------------------------------------------

    score = calculate_relevance(
        food_label,
        product
    )

    return score >= 2

def find_alternatives(food_label, page_size=30):
    category = get_product_category(
        food_label
    )

    if not category:
        return []

    current_product = normalize_text(
        (food_label.analysis or {}).get(
            "product_name",
            "",
        )
    )

    user_profile = None

    if food_label.user:

        user_profile, _ = (
            UserProfile.objects.get_or_create(
                user=food_label.user
            )
        )

    original_name, _ = (
        get_original_product_text(
            food_label
        )
    )

    original_type = detect_product_type(
        original_name,
        category,
    )
    # First search using the broad category.
    products = search_products_by_category(
        category,
        page_size,
    )

    # For specific product types, also try
    # more targeted searches.
    if original_type in PRODUCT_SEARCH_TERMS:

        for search_term in PRODUCT_SEARCH_TERMS[
            original_type
        ]:

            try:

                specific_products = (
                    search_products_by_category(
                        category,
                        10,
                        search_term,
                    )
                )

                products.extend(
                    specific_products
                )

            except requests.RequestException:
                continue

    # Remove duplicate products.
    unique_products = {}

    for product in products:

        code = product.get("code")

        product_name = normalize_text(
            product.get("product_name") or ""
        )

        key = code or product_name

        if not key:
            continue

        unique_products[key] = product

    products = list(
        unique_products.values()
    )

    alternatives = []

    for product in products:

        product_name = normalize_text(
            product.get("product_name") or ""
        )

        # Skip products without names.
        if not product_name:
            continue

        # Skip the original product.
        if product_name == current_product:
            continue

        # Remove allergy conflicts.
        if (
            user_profile
            and has_allergen_conflict(
                product,
                user_profile,
            )
        ):
            continue

        # Remove dietary conflicts.
        if (
            user_profile
            and has_dietary_conflict(
                product,
                user_profile,
            )
        ):
            continue

        # Keep relevant products.
        if not is_relevant_product(
            food_label,
            product,
        ):
            continue

        product["_relevance_score"] = (
            calculate_relevance(
                food_label,
                product,
            )
        )

        alternatives.append(product)

    # Highest relevance first.
    alternatives.sort(
        key=lambda product: product.get(
            "_relevance_score",
            0,
        ),
        reverse=True,
    )

    # Remove internal score.
    for product in alternatives:

        product.pop(
            "_relevance_score",
            None,
        )

    return alternatives[:10]