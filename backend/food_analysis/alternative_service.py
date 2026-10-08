# import re
# import requests

# from users.models import UserProfile


# OPEN_FOOD_FACTS_SEARCH_URL = (
#     "https://world.openfoodfacts.org/api/v2/search"
# )

# OPEN_FOOD_FACTS_TEXT_SEARCH_URL = (
#     "https://world.openfoodfacts.org/cgi/search.pl"
# )

# CATEGORY_MAPPING = {
#     "sweets": "sweets",
#     "sweet": "sweets",
#     "biscuits": "biscuits",
#     "cookies": "biscuits",
#     "chips": "chips",
#     "snacks": "snacks",
#     "chocolates": "chocolates",
#     "chocolate": "chocolates",
#     "fruit juices": "fruit-juices",
#     "fruit juice": "fruit-juices",
#     "soft drinks": "soft-drinks",
#     "soft drink": "soft-drinks",
#     "sweet spreads": "sweet-spreads",
#     "sweet spread": "sweet-spreads",
#     "cereals": "breakfast-cereals",
#     "breakfast cereals": "breakfast-cereals",
#     "instant noodles": "instant-noodles",
#     "noodles": "noodles",
#     "sauces": "sauces",
#     "dairy products": "dairy-products",
#     "milk": "milks",
# }


# PRODUCT_TYPE_KEYWORDS = {
#     "sweets": {
#         "candy": {
#             "candy",
#             "bonbon",
#             "hard candy",
#             "mint",
#             "lozenge",
#             "toffee",
#             "caramel",
#             "lollipop",
#             "gummy",
#             "gummies",
#             "jelly",
#             "chew",
#         },
#         "chocolate": {
#             "chocolate",
#             "cocoa",
#             "truffle",
#             "praline",
#             "choco",
#         },
#         "indian_sweet": {
#             "soan",
#             "soan papdi",
#             "papdi",
#             "laddu",
#             "ladoo",
#             "barfi",
#             "burfi",
#             "halwa",
#             "gulab",
#             "gulab jamun",
#             "jamun",
#             "rasgulla",
#             "jalebi",
#             "mysore",
#             "mysore pak",
#             "peda",
#             "kaju",
#             "kaju katli",
#             "katli",
#         },
#     },

#     "biscuits": {
#         "biscuit": {
#             "biscuit",
#             "cookie",
#             "cookies",
#             "cracker",
#             "wafer",
#         },
#     },

#     "chips": {
#         "chips": {
#             "chips",
#             "crisps",
#             "potato",
#             "nachos",
#             "tortilla",
#         },
#     },
    
    
#     "snacks": {
#         "extruded_snack": {
#             "kurkure",
#             "bingo",
#             "tedhe medhe",
#             "too yumm",
#             "haldiram",
#             "namkeen",
#             "sev",
#             "bhujia",
#             "mixture",
#             "murukku",
#             "wheels",
#             "puffed snack",
#             "extruded snack",
#         },
#         "potato_chips": {
#             "lays",
#             "lay's",
#             "potato chips",
#             "potato wafers",
#         },
#         "nachos": {
#             "doritos",
#             "nachos",
#             "tortilla chips",
#         },
#         "snack_wafers": {
#             "mad angles",
#             "balaji wafers",
#             "aloos sev",
#         },
#     },

#     "chocolates": {
#         "chocolate": {
#             "chocolate",
#             "cocoa",
#             "truffle",
#             "praline",
#         },
#     },

#     "fruit-juices": {
#         "juice": {
#             "juice",
#             "nectar",
#             "fruit drink",
#         },
#     },

#     "soft-drinks": {
#         "soft_drink": {
#             "cola",
#             "soda",
#             "soft drink",
#             "carbonated",
#             "fizzy",
#         },
#         "fruit_drink": {
#             "fruit drink",
#             "fruit beverage",
#             "mango drink",
#             "mango beverage",
#             "mango juice",
#             "maaza",
#             "frooti",
#             "slice mango",
#         },
#     },

#     "sweet-spreads": {
#         "spread": {
#             "spread",
#             "nutella",
#             "hazelnut",
#             "peanut butter",
#             "chocolate spread",
#         },
#     },

#     "breakfast-cereals": {
#         "cereal": {
#             "cereal",
#             "flakes",
#             "muesli",
#             "granola",
#             "oats",
#         },
#     },

#     "instant-noodles": {
#         "noodles": {
#             "noodle",
#             "noodles",
#             "ramen",
#             "vermicelli",
#         },
#     },
# }


# PRODUCT_SEARCH_TERMS = {
#     "indian_sweet": [
#         "mysore pak",
#         "soan papdi",
#         "laddu",
#         "ladoo",
#         "barfi",
#         "burfi",
#         "halwa",
#         "peda",
#         "kaju katli",
#         "gulab jamun",
#         "rasgulla",
#         "jalebi",
#     ],
#     "fruit_drink": [
#         "mango drink",
#         "mango juice",
#         "fruit drink",
#         "fruit beverage",
#     ],
#     # Search multiple snack brands and types for broader coverage.
#     "extruded_snack": [
#         "Kurkure",
#         "Bingo Tedhe Medhe",
#         "Bingo snacks",
#         "Too Yumm snacks",
#         "Haldiram namkeen",
#         "namkeen",
#         "sev",
#         "bhujia",
#         "mixture",
#     ],
#     "potato_chips": [
#         "Lay's chips",
#         "potato chips",
#         "Balaji wafers",
#     ],
#     "nachos": [
#         "Doritos",
#         "nachos",
#         "tortilla chips",
#     ],
#     "snack_wafers": [
#         "Bingo Mad Angles",
#         "Balaji snacks",
#         "snack wafers",
#     ],
# }


# def normalize_text(text):
#     if not text:
#         return ""

#     text = text.lower()

#     text = re.sub(
#         r"[^a-z0-9\s]",
#         " ",
#         text,
#     )

#     text = re.sub(
#         r"\s+",
#         " ",
#         text,
#     )

#     return text.strip()


# def normalize_category(category):
#     if not category:
#         return None

#     category = category.strip().lower()

#     return CATEGORY_MAPPING.get(category)


# def get_product_category(food_label):
#     analysis = food_label.analysis or {}

#     category = analysis.get("product_category")

#     if category:
#         return normalize_category(category)

#     # Fallback for older analyses
#     # that do not have product_category.
#     product_name = normalize_text(
#         analysis.get("product_name") or ""
#     )

#     if any(
#         keyword in product_name
#         for keyword in [
#             "mysore pak",
#             "soan papdi",
#             "laddu",
#             "ladoo",
#             "barfi",
#             "burfi",
#             "halwa",
#             "gulab jamun",
#             "rasgulla",
#             "jalebi",
#             "peda",
#             "kaju katli",
#         ]
#     ):
#         return "sweets"

#     if any(
#         keyword in product_name
#         for keyword in [
#             "chocolate",
#             "cocoa",
#             "truffle",
#             "praline",
#         ]
#     ):
#         return "chocolates"

#     if any(
#         keyword in product_name
#         for keyword in [
#             "biscuit",
#             "cookie",
#             "cracker",
#             "wafer",
#         ]
#     ):
#         return "biscuits"

#     if any(
#         keyword in product_name
#         for keyword in [
#             "chips",
#             "crisps",
#             "nachos",
#         ]
#     ):
#         return "chips"

    
#     if any(
#         keyword in product_name
#         for keyword in [
#             "kurkure",
#             "namkeen",
#             "sev",
#             "mixture",
#             "bhujia",
#             "murukku",
#             "banana chips",
#         ]
#     ):
#         return "snacks"

#     if any(
#         keyword in product_name
#         for keyword in [
#             "juice",
#             "nectar",
#             "maaza",
#             "frooti",
#             "slice",
#             "fruit drink",
#             "mango drink",
#             "mango beverage",
#         ]
#     ):
#         return "fruit-juices"

#     return None


# def is_sold_in_india(product):
#     """
#     Return True only when Open Food Facts explicitly lists India
#     in the product's country tags.
#     """
#     country_tags = (
#         product.get("countries_tags_en")
#         or product.get("countries_tags")
#         or []
#     )

#     if isinstance(country_tags, str):
#         country_tags = country_tags.split(",")

#     normalized_tags = {
#         str(tag).strip().lower()
#         for tag in country_tags
#         if tag
#     }

#     return bool(
#         normalized_tags.intersection({
#             "india",
#             "en:india",
#         })
#     )


# def search_products_by_category(
#     category,
#     page_size=30,
#     search_terms=None,
# ):
#     """Search Open Food Facts, returning only products tagged for India."""

#     fields = (
#         "code,"
#         "product_name,"
#         "brands,"
#         "categories_tags,"
#         "countries_tags,"
#         "countries_tags_en,"
#         "ingredients_text,"
#         "allergens_tags,"
#         "nutriments,"
#         "image_url"
#     )

#     headers = {
#         "User-Agent": (
#             "AI-Food-Label-Analyzer/1.0 "
#             "(MCA Project)"
#         )
#     }

#     if search_terms:
#         # Legacy endpoint supports full-text search.
#         params = {
#             "search_terms": search_terms,
#             "countries_tags_en": "india",
#             "page": 1,
#             "page_size": page_size,
#             "json": 1,
#             "fields": fields,
#         }

#         response = requests.get(
#             OPEN_FOOD_FACTS_TEXT_SEARCH_URL,
#             params=params,
#             headers=headers,
#             timeout=15,
#         )

#     else:
#         # Structured search: filter by category and country.
#         params = {
#             "categories_tags_en": category,
#             "countries_tags_en": "india",
#             "page": 1,
#             "page_size": page_size,
#             "fields": fields,
#         }

#         response = requests.get(
#             OPEN_FOOD_FACTS_SEARCH_URL,
#             params=params,
#             headers=headers,
#             timeout=15,
#         )

#     response.raise_for_status()
#     data = response.json()

#     # Strict validation: never return a product unless its country
#     # tags explicitly include India.
#     products = data.get("products", [])

#     return [
#         product
#         for product in products
#         if is_sold_in_india(product)
#     ]

# def has_allergen_conflict(product, user_profile):
#     product_allergens = (
#         product.get("allergens_tags") or []
#     )

#     user_allergies = [
#         allergy.strip().lower()
#         for allergy in (user_profile.allergies or [])
#         if allergy.strip()
#     ]

#     if user_profile.other_allergy:
#         user_allergies.append(
#             user_profile.other_allergy.strip().lower()
#         )

#     for allergen in product_allergens:
#         allergen_name = (
#             allergen.replace("en:", "")
#             .replace("-", " ")
#             .lower()
#             .strip()
#         )

#         for allergy in user_allergies:
#             if (
#                 allergy in allergen_name
#                 or allergen_name in allergy
#             ):
#                 return True

#     return False


# def has_dietary_conflict(product, user_profile):
#     preference = (
#         user_profile.dietary_preference or ""
#     ).strip().lower()

#     if not preference:
#         return False

#     ingredients = (
#         product.get("ingredients_text") or ""
#     ).lower()

#     allergens = product.get("allergens_tags") or []

#     # Vegetarian
#     if preference == "vegetarian":

#         if "gelatin" in ingredients:
#             return True

#         if "gelatine" in ingredients:
#             return True

#         if any(
#             "gelatin" in allergen.lower()
#             or "gelatine" in allergen.lower()
#             for allergen in allergens
#         ):
#             return True

#     # Vegan
#     if preference == "vegan":

#         animal_ingredients = [
#             "milk",
#             "butter",
#             "cream",
#             "cheese",
#             "whey",
#             "casein",
#             "gelatin",
#             "gelatine",
#             "egg",
#             "honey",
#         ]

#         for ingredient in animal_ingredients:
#             if ingredient in ingredients:
#                 return True

#         for allergen in allergens:
#             allergen_name = allergen.lower()

#             if any(
#                 item in allergen_name
#                 for item in [
#                     "milk",
#                     "egg",
#                 ]
#             ):
#                 return True

#     return False


# def get_original_product_text(food_label):
#     analysis = food_label.analysis or {}

#     product_name = normalize_text(
#         analysis.get("product_name") or ""
#     )

#     ingredients = analysis.get("ingredients") or []

#     ingredient_text = ""

#     if isinstance(ingredients, list):

#         parts = []

#         for ingredient in ingredients:

#             if isinstance(ingredient, str):
#                 parts.append(ingredient)

#             elif isinstance(ingredient, dict):
#                 parts.append(
#                     ingredient.get("name")
#                     or ingredient.get("ingredient")
#                     or ingredient.get("text")
#                     or ""
#                 )

#         ingredient_text = " ".join(parts)

#     elif isinstance(ingredients, str):
#         ingredient_text = ingredients

#     return (
#         product_name,
#         normalize_text(ingredient_text),
#     )

# def detect_product_type(text, category=None):
#     """
#     Detect the most specific product type from the product text.

#     More specific phrases are checked before generic words. This is
#     important for names such as ``Haldiram's Chocolate Soan Papdi``:
#     ``soan papdi`` should identify the product as an Indian sweet even
#     though the name also contains the generic word ``chocolate``.

#     The function checks the complete product text, including the product
#     name and, for Open Food Facts candidates, category tags.
#     """

#     text = normalize_text(text)

#     if not text:
#         return None

#     matches = []

#     for category_name, category_types in PRODUCT_TYPE_KEYWORDS.items():
#         for product_type, keywords in category_types.items():
#             for keyword in keywords:
#                 normalized_keyword = normalize_text(keyword)

#                 if normalized_keyword and normalized_keyword in text:
#                     matches.append(
#                         (
#                             len(normalized_keyword),
#                             product_type,
#                         )
#                     )

#     if not matches:
#         return None

#     # Prefer the longest, most specific phrase.
#     # Example: ``soan papdi`` wins over ``soan`` and ``chocolate``.
#     matches.sort(
#         key=lambda item: item[0],
#         reverse=True,
#     )

#     return matches[0][1]

# def calculate_relevance(food_label, product):
#     category = get_product_category(
#         food_label
#     )

#     original_name, original_ingredients = (
#         get_original_product_text(
#             food_label
#         )
#     )

#     candidate_name = normalize_text(
#         product.get("product_name") or ""
#     )

#     candidate_ingredients = normalize_text(
#         product.get("ingredients_text") or ""
#     )

#     candidate_categories = " ".join(
#         [
#             category_name
#             .replace("en:", "")
#             .replace("-", " ")
#             for category_name in (
#                 product.get("categories_tags")
#                 or []
#             )
#         ]
#     )

#     candidate_text = " ".join(
#         [
#             candidate_name,
#             candidate_categories,
#         ]
#     )

#     score = 0

#     original_type = detect_product_type(
#         original_name,
#         category,
#     )

#     candidate_type = detect_product_type(
#         candidate_text,
#         category,
#     )

#     # Matching specific product types
#     if (
#         original_type
#         and candidate_type
#         and original_type == candidate_type
#     ):
#         score += 8

#     elif (
#         original_type
#         and candidate_type
#         and original_type != candidate_type
#     ):
#         score -= 4

#     # Product name word overlap
#     original_words = set(
#         original_name.split()
#     )

#     candidate_words = set(
#         candidate_name.split()
#     )

#     common_name_words = (
#         original_words
#         & candidate_words
#     )

#     score += min(
#         len(common_name_words) * 2,
#         4,
#     )

#     # Ingredient overlap
#     if (
#         original_ingredients
#         and candidate_ingredients
#     ):

#         original_terms = set(
#             word
#             for word in original_ingredients.split()
#             if len(word) >= 4
#         )

#         candidate_terms = set(
#             word
#             for word in candidate_ingredients.split()
#             if len(word) >= 4
#         )

#         common_ingredients = (
#             original_terms
#             & candidate_terms
#         )

#         score += min(
#             len(common_ingredients),
#             3,
#         )

#     # Category match
#     if category:

#         normalized_candidate_categories = (
#             candidate_categories
#         )

#         normalized_category = (
#             category
#             .replace("-", " ")
#             .lower()
#         )

#         if normalized_category in (
#             normalized_candidate_categories
#         ):
#             score += 2

#     return score

# def is_relevant_product(food_label, product):
#     """
#     Keep alternatives within the same specific product type.

#     If the original product can be identified as a specific
#     type, only products with the same type are accepted.

#     If no specific type can be identified, fall back to
#     the relevance score.
#     """

#     category = get_product_category(food_label)

#     original_name, original_ingredients = (
#         get_original_product_text(food_label)
#     )

#     candidate_name = normalize_text(
#         product.get("product_name") or ""
#     )

#     candidate_categories = " ".join(
#         [
#             category_name
#             .replace("en:", "")
#             .replace("-", " ")
#             for category_name in (
#                 product.get("categories_tags") or []
#             )
#         ]
#     )

#     candidate_text = " ".join(
#         [
#             candidate_name,
#             candidate_categories,
#         ]
#     )

#     original_type = detect_product_type(
#         original_name,
#         category
#     )

#     candidate_type = detect_product_type(
#         candidate_text,
#         category
#     )

#     # --------------------------------------------------
#     # Strict matching for specific product types
#     # --------------------------------------------------

#     if original_type:
#         # For savoury snacks, allow closely related snack formats
#         # (extruded snacks, potato chips, nachos, and snack wafers).
#         # This lets brands such as Bingo!, Lay's, Doritos, and Balaji
#         # be considered without allowing biscuits or sweets.
#         snack_types = {
#             "extruded_snack",
#             "potato_chips",
#             "nachos",
#             "snack_wafers",
#             "chips",
#         }

#         if original_type in snack_types:
#             return candidate_type in snack_types

#         return candidate_type == original_type

#     # --------------------------------------------------
#     # Fallback when no specific type is detected
#     # --------------------------------------------------

#     score = calculate_relevance(
#         food_label,
#         product
#     )

#     return score >= 2


# def get_product_family_key(product):
#     """
#     Create a stable product-family key.

#     The goal is to remove different Open Food Facts
#     entries that represent the same product family,
#     while keeping genuinely different products.
#     """

#     name = normalize_text(
#         product.get("product_name") or ""
#     )

#     brand = normalize_text(
#         product.get("brands") or ""
#     )

#     if not name:
#         return None

#     # --------------------------------------------------
#     # Normalize product name
#     # --------------------------------------------------

#     name = re.sub(
#         r"\b\d+(?:\.\d+)?\s*(ml|l|ltr|cl|g|kg|mg)\b",
#         "",
#         name,
#     )

#     removable_words = {
#         "drink",
#         "drinks",
#         "beverage",
#         "beverages",
#         "refresh",
#         "original",
#         "pack",
#         "bottle",
#         "can",
#         "juice",
#     }

#     words = [
#         word
#         for word in name.split()
#         if word not in removable_words
#     ]

#     name = " ".join(words).strip()

#     if not name:
#         return None

#     # --------------------------------------------------
#     # Recognize important product brands directly
#     # from the product name.
#     #
#     # This handles cases where Open Food Facts
#     # has inconsistent brand fields.
#     # --------------------------------------------------

#     known_product_families = {
#         "maaza": "maaza",
#         "frooti": "frooti",
#         "slice": "slice",
#         "appy fizz": "appy fizz",
#         "appy": "appy",
#         "real fruit power": "real fruit power",
#         "rasna": "rasna",
#     }

#     # Check longer names first.
#     known_families = sorted(
#         known_product_families.items(),
#         key=lambda item: len(item[0]),
#         reverse=True,
#     )

#     for product_text, family_key in known_families:

#         if (
#             name == product_text
#             or name.startswith(
#                 product_text + " "
#             )
#         ):
#             return family_key

#     # --------------------------------------------------
#     # If the product name itself contains the brand,
#     # remove the brand from the remaining name.
#     # --------------------------------------------------

#     if brand:

#         brand_words = set(
#             brand.split()
#         )

#         name_words = [
#             word
#             for word in name.split()
#             if word not in brand_words
#         ]

#         name_without_brand = " ".join(
#             name_words
#         ).strip()

#         if name_without_brand:
#             return (
#                 f"{brand}|{name_without_brand}"
#             )

#         return brand

#     # --------------------------------------------------
#     # Fallback
#     # --------------------------------------------------

#     return name

# def get_nutrition_values(product):
#     """
#     Extract commonly available nutrition values per 100g/ml
#     from Open Food Facts.
#     """

#     nutriments = product.get("nutriments") or {}

#     def get_value(key):
#         value = nutriments.get(key)

#         try:
#             return float(value)
#         except (TypeError, ValueError):
#             return None

#     return {
#         "energy": get_value("energy-kcal_100g"),
#         "sugar": get_value("sugars_100g"),
#         "fat": get_value("fat_100g"),
#         "saturated_fat": get_value("saturated-fat_100g"),
#         "sodium": get_value("sodium_100g"),
#         "protein": get_value("proteins_100g"),
#         "carbohydrates": get_value("carbohydrates_100g"),
#         "fiber": get_value("fiber_100g"),
#     }
# def calculate_personalized_score(
#     food_label,
#     candidate_product,
#     user_profile,
# ):
#     """
#     Calculate a personalized alternative score.

#     Higher score = better match for the user's profile.
#     This is used only to rank already-relevant alternatives.
#     """

#     score = 50
#     reasons = []

#     if not user_profile:
#         return score, reasons

#     # --------------------------------------------------
#     # GET ORIGINAL PRODUCT NUTRITION
#     # --------------------------------------------------

#     analysis = food_label.analysis or {}

#     original_nutrition = {
#         "sugar": None,
#         "carbohydrates": None,
#         "fat": None,
#         "saturated_fat": None,
#         "sodium": None,
#         "energy": None,
#     }

#     nutrition_summary = (
#         analysis.get("nutrition_summary")
#         or ""
#     )

#     # nutrition_summary is stored as text.
#     #
#     # Example:
#     # "Per 100 ml: Energy 44 kcal,
#     # Carbohydrates 11 g, Total Sugars 10.7 g,
#     # Added Sugars 9 g, Total Fat 0 g,
#     # Protein 0 g, Sodium 22.1 mg."

#     if isinstance(
#         nutrition_summary,
#         str,
#     ):

#         # Energy
#         match = re.search(
#             r"energy\s*[:\-]?\s*([\d.]+)\s*kcal",
#             nutrition_summary,
#             re.IGNORECASE,
#         )

#         if match:
#             original_nutrition["energy"] = float(
#                 match.group(1)
#             )

#         # Carbohydrates
#         match = re.search(
#             r"carbohydrates?\s*[:\-]?\s*([\d.]+)\s*g",
#             nutrition_summary,
#             re.IGNORECASE,
#         )

#         if match:
#             original_nutrition["carbohydrates"] = float(
#                 match.group(1)
#             )

#         # Total sugars
#         match = re.search(
#             r"total\s+sugars?\s*[:\-]?\s*([\d.]+)\s*g",
#             nutrition_summary,
#             re.IGNORECASE,
#         )

#         if match:
#             original_nutrition["sugar"] = float(
#                 match.group(1)
#             )

#         # Total fat
#         match = re.search(
#             r"total\s+fat\s*[:\-]?\s*([\d.]+)\s*g",
#             nutrition_summary,
#             re.IGNORECASE,
#         )

#         if match:
#             original_nutrition["fat"] = float(
#                 match.group(1)
#             )

#         # Saturated fat
#         match = re.search(
#             r"saturated\s+fat\s*[:\-]?\s*([\d.]+)\s*g",
#             nutrition_summary,
#             re.IGNORECASE,
#         )

#         if match:
#             original_nutrition["saturated_fat"] = float(
#                 match.group(1)
#             )

#         # Sodium
#         match = re.search(
#             r"sodium\s*[:\-]?\s*([\d.]+)\s*mg",
#             nutrition_summary,
#             re.IGNORECASE,
#         )

#         if match:
#             original_nutrition["sodium"] = float(
#                 match.group(1)
#             )

#     # --------------------------------------------------
#     # GET CANDIDATE NUTRITION
#     # --------------------------------------------------

#     candidate_nutrition = get_nutrition_values(
#         candidate_product
#     )

#     # --------------------------------------------------
#     # MEDICAL CONDITIONS
#     # --------------------------------------------------

#     medical_conditions = [
#         condition.strip().lower()
#         for condition in (
#             user_profile.medical_conditions
#             or []
#         )
#         if condition
#         and condition.strip()
#     ]

#     if user_profile.other_medical_condition:

#         medical_conditions.append(
#             user_profile.other_medical_condition
#             .strip()
#             .lower()
#         )

#     # --------------------------------------------------
#     # ALLERGY SAFETY
#     # --------------------------------------------------

#     if not has_allergen_conflict(
#         candidate_product,
#         user_profile,
#     ):

#         score += 15

#         reasons.append(
#             "No detected conflict with your recorded allergies."
#         )

#     # --------------------------------------------------
#     # DIETARY PREFERENCE
#     # --------------------------------------------------

#     if not has_dietary_conflict(
#         candidate_product,
#         user_profile,
#     ):

#         score += 10

#         if user_profile.dietary_preference:

#             reasons.append(
#                 "No detected conflict with your dietary preference."
#             )

#     # --------------------------------------------------
#     # NUTRITION COMPARISON
#     # --------------------------------------------------

#     nutrition_checks = [
#         ("sugar", "sugar"),
#         ("saturated_fat", "saturated fat"),
#         ("sodium", "sodium"),
#         ("fat", "total fat"),
#         ("energy", "calories"),
#     ]

#     for key, label in nutrition_checks:

#         original_value = (
#             original_nutrition.get(key)
#         )

#         candidate_value = (
#             candidate_nutrition.get(key)
#         )

#         if (
#             original_value is not None
#             and candidate_value is not None
#         ):

#             try:

#                 original_value = float(
#                     original_value
#                 )

#                 candidate_value = float(
#                     candidate_value
#                 )

#             except (
#                 TypeError,
#                 ValueError,
#             ):
#                 continue

#             if candidate_value < original_value:

#                 score += 4

#                 reasons.append(
#                     f"Lower {label} than the analyzed product."
#                 )

#             elif candidate_value > original_value:

#                 score -= 2

#     # --------------------------------------------------
#     # MEDICAL-CONDITION RELEVANCE
#     # --------------------------------------------------

#     for condition in medical_conditions:

#         # --------------------------------------------------
#         # DIABETES
#         # --------------------------------------------------

#         if (
#             "diabetes" in condition
#             or "high blood sugar" in condition
#         ):

#             candidate_sugar = (
#                 candidate_nutrition.get(
#                     "sugar"
#                 )
#             )

#             if candidate_sugar is not None:

#                 try:

#                     candidate_sugar = float(
#                         candidate_sugar
#                     )

#                 except (
#                     TypeError,
#                     ValueError,
#                 ):

#                     candidate_sugar = None

#                 if candidate_sugar is not None:

#                     if candidate_sugar < 5:

#                         score += 15

#                         reasons.append(
#                             "Lower sugar content may be a "
#                             "better match for your recorded "
#                             "diabetes-related preference."
#                         )

#                     elif candidate_sugar < 10:

#                         score += 8

#                         reasons.append(
#                             "Moderate sugar content may be a "
#                             "better match for your recorded "
#                             "diabetes-related preference."
#                         )

#         # --------------------------------------------------
#         # HIGH BLOOD PRESSURE
#         # --------------------------------------------------

#         if (
#             "hypertension" in condition
#             or "high blood pressure" in condition
#         ):

#             candidate_sodium = (
#                 candidate_nutrition.get(
#                     "sodium"
#                 )
#             )

#             if candidate_sodium is not None:

#                 try:

#                     candidate_sodium = float(
#                         candidate_sodium
#                     )

#                 except (
#                     TypeError,
#                     ValueError,
#                 ):

#                     candidate_sodium = None

#                 if candidate_sodium is not None:

#                     if candidate_sodium < 120:

#                         score += 15

#                         reasons.append(
#                             "Lower sodium content may be "
#                             "a better match for your recorded "
#                             "blood-pressure related preference."
#                         )

#                     elif candidate_sodium < 300:

#                         score += 8

#                         reasons.append(
#                             "Moderate sodium content may be "
#                             "a better match for your recorded "
#                             "blood-pressure related preference."
#                         )

#         # --------------------------------------------------
#         # HIGH CHOLESTEROL
#         # --------------------------------------------------

#         if "high cholesterol" in condition:

#             candidate_fat = (
#                 candidate_nutrition.get(
#                     "fat"
#                 )
#             )

#             candidate_saturated_fat = (
#                 candidate_nutrition.get(
#                     "saturated_fat"
#                 )
#             )

#             if (
#                 candidate_saturated_fat
#                 is not None
#             ):

#                 try:

#                     candidate_saturated_fat = float(
#                         candidate_saturated_fat
#                     )

#                 except (
#                     TypeError,
#                     ValueError,
#                 ):

#                     candidate_saturated_fat = None

#                 if (
#                     candidate_saturated_fat
#                     is not None
#                     and candidate_saturated_fat < 1.5
#                 ):

#                     score += 15

#                     reasons.append(
#                         "Lower saturated fat content may be "
#                         "a better match for your recorded "
#                         "cholesterol-related preference."
#                     )

#             if (
#                 candidate_fat is not None
#             ):

#                 try:

#                     candidate_fat = float(
#                         candidate_fat
#                     )

#                 except (
#                     TypeError,
#                     ValueError,
#                 ):

#                     candidate_fat = None

#                 if (
#                     candidate_fat is not None
#                     and candidate_fat < 5
#                 ):

#                     score += 8

#                     reasons.append(
#                         "Lower fat content may be a better "
#                         "match for your recorded "
#                         "cholesterol-related preference."
#                     )

#     # --------------------------------------------------
#     # KEEP SCORE BETWEEN 0 AND 100
#     # --------------------------------------------------

#     score = max(
#         0,
#         min(score, 100),
#     )

#     # --------------------------------------------------
#     # REMOVE DUPLICATE REASONS
#     # --------------------------------------------------

#     reasons = list(
#         dict.fromkeys(reasons)
#     )

#     return score, reasons

# def find_alternatives(food_label, page_size=30):
#     category = get_product_category(
#         food_label
#     )

#     if not category:
#         return []

#     current_product = normalize_text(
#         (food_label.analysis or {}).get(
#             "product_name",
#             "",
#         )
#     )

#     user_profile = None

#     if food_label.user:

#         user_profile, _ = (
#             UserProfile.objects.get_or_create(
#                 user=food_label.user
#             )
#         )

#     original_name, _ = (
#         get_original_product_text(
#             food_label
#         )
#     )

#     original_type = detect_product_type(
#         original_name,
#         category,
#     )

#     # First search using the broad category.
#     products = search_products_by_category(
#         category,
#         page_size,
#     )

#     # For specific product types, also try
#     # more targeted searches.
#     if original_type in PRODUCT_SEARCH_TERMS:

#         for search_term in PRODUCT_SEARCH_TERMS[
#             original_type
#         ]:

#             try:

#                 specific_products = (
#                     search_products_by_category(
#                         category,
#                         10,
#                         search_term,
#                     )
#                 )

#                 products.extend(
#                     specific_products
#                 )

#             except requests.RequestException:
#                 continue

#     # Remove duplicate products and duplicate product families.
#     unique_products = {}

#     for product in products:

#         product_name = normalize_text(
#             product.get("product_name") or ""
#         )

#         if not product_name:
#             continue

#         # Use the product-family key to identify
#         # duplicate product entries.
#         key = get_product_family_key(product)

#         if not key:
#             continue

#         # Keep only the first product from each family.
#         if key not in unique_products:
#             unique_products[key] = product

#     products = list(
#         unique_products.values()
#     )

#     alternatives = []

#     for product in products:

#         product_name = normalize_text(
#             product.get("product_name") or ""
#         )

#         # Skip products without names.
#         if not product_name:
#             continue

#         # Skip the original product.
#         if product_name == current_product:
#             continue

#         # Remove allergy conflicts.
#         if (
#             user_profile
#             and has_allergen_conflict(
#                 product,
#                 user_profile,
#             )
#         ):
#             continue

#         # Remove dietary conflicts.
#         if (
#             user_profile
#             and has_dietary_conflict(
#                 product,
#                 user_profile,
#             )
#         ):
#             continue

#         # Keep relevant products.
#         if not is_relevant_product(
#             food_label,
#             product,
#         ):
#             continue

#         # Existing relevance score.
#         product["_relevance_score"] = (
#             calculate_relevance(
#                 food_label,
#                 product,
#             )
#         )

#         # Personalized score based on
#         # the user's profile and health preferences.
#         product["_personalized_score"], product[
#             "_recommendation_reasons"
#         ] = calculate_personalized_score(
#             food_label,
#             product,
#             user_profile,
#         )

#         alternatives.append(product)

#     # Highest personalized score first.
#     # Relevance score is used as the tie-breaker.
#     alternatives.sort(
#         key=lambda product: (
#             product.get(
#                 "_personalized_score",
#                 0,
#             ),
#             product.get(
#                 "_relevance_score",
#                 0,
#             ),
#         ),
#         reverse=True,
#     )

#     # Remove internal scores and expose
#     # personalized recommendation information.
#     for product in alternatives:

#         product.pop(
#             "_relevance_score",
#             None,
#         )

#         product["personalized_score"] = product.pop(
#             "_personalized_score",
#             0,
#         )

#         product["recommendation_reasons"] = product.pop(
#             "_recommendation_reasons",
#             [],
#         )

#     return alternatives[:10]





import re

import requests

from users.models import UserProfile

OPEN_FOOD_FACTS_SEARCH_URL = (

    "https://world.openfoodfacts.org/api/v2/search"

)

OPEN_FOOD_FACTS_TEXT_SEARCH_URL = (

    "https://world.openfoodfacts.org/cgi/search.pl"

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

    "snacks": {

        "extruded_snack": {

            "kurkure",

            "bingo",

            "tedhe medhe",

            "too yumm",

            "haldiram",

            "namkeen",

            "sev",

            "bhujia",

            "mixture",

            "murukku",

            "wheels",

            "puffed snack",

            "extruded snack",

        },

        "potato_chips": {

            "lays",

            "lay's",

            "potato chips",

            "potato wafers",

        },

        "nachos": {

            "doritos",

            "nachos",

            "tortilla chips",

        },

        "snack_wafers": {

            "mad angles",

            "balaji wafers",

            "aloos sev",

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

    # Search multiple snack brands and types for broader coverage.

    "extruded_snack": [

        "Kurkure",

        "Bingo Tedhe Medhe",

        "Bingo snacks",

        "Too Yumm snacks",

        "Haldiram namkeen",

        "namkeen",

        "sev",

        "bhujia",

        "mixture",

    ],

    "potato_chips": [

        "Lay's chips",

        "potato chips",

        "Balaji wafers",

    ],

    "nachos": [

        "Doritos",

        "nachos",

        "tortilla chips",

    ],

    "snack_wafers": [

        "Bingo Mad Angles",

        "Balaji snacks",

        "snack wafers",

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

            "kurkure",

            "namkeen",

            "sev",

            "mixture",

            "bhujia",

            "murukku",

            "banana chips",

        ]

    ):

        return "snacks"

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

def is_sold_in_india(product):

    """

    Return True only when Open Food Facts explicitly lists India

    in the product's country tags.

    """

    country_tags = (

        product.get("countries_tags_en")

        or product.get("countries_tags")

        or []

    )

    if isinstance(country_tags, str):

        country_tags = country_tags.split(",")

    normalized_tags = {

        str(tag).strip().lower()

        for tag in country_tags

        if tag

    }

    return bool(

        normalized_tags.intersection({

            "india",

            "en:india",

        })

    )

def search_products_by_category(

    category,

    page_size=30,

    search_terms=None,

):

    """Search Open Food Facts, returning only products tagged for India."""

    fields = (

        "code,"

        "product_name,"

        "brands,"

        "categories_tags,"

        "countries_tags,"

        "countries_tags_en,"

        "ingredients_text,"

        "allergens_tags,"

        "labels_tags,"

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

        # Legacy endpoint supports full-text search.

        params = {

            "search_terms": search_terms,

            "countries_tags_en": "india",

            "page": 1,

            "page_size": page_size,

            "json": 1,

            "fields": fields,

        }

        response = requests.get(

            OPEN_FOOD_FACTS_TEXT_SEARCH_URL,

            params=params,

            headers=headers,

            timeout=15,

        )

    else:

        # Structured search: filter by category and country.

        params = {

            "categories_tags_en": category,

            "countries_tags_en": "india",

            "page": 1,

            "page_size": page_size,

            "fields": fields,

        }

        response = requests.get(

            OPEN_FOOD_FACTS_SEARCH_URL,

            params=params,

            headers=headers,

            timeout=15,

        )

    response.raise_for_status()

    data = response.json()

    # Strict validation: never return a product unless its country

    # tags explicitly include India.

    products = data.get("products", [])

    return [

        product

        for product in products

        if is_sold_in_india(product)

    ]

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

def _product_labels(product):
    labels = product.get("labels_tags") or []
    if isinstance(labels, str):
        labels = labels.split(",")
    return " ".join(
        str(label).lower().replace("en:", "").replace("-", " ")
        for label in labels
    )

def has_medical_condition_conflict(product, user_profile):
    """Return True for explicit celiac/lactose conflicts only."""
    if not user_profile:
        return False

    conditions = [
        str(condition).strip().lower()
        for condition in (user_profile.medical_conditions or [])
        if str(condition).strip()
    ]
    if user_profile.other_medical_condition:
        conditions.append(user_profile.other_medical_condition.strip().lower())

    ingredients = str(product.get("ingredients_text") or "").lower()
    allergens = " ".join(
        str(item).lower() for item in (product.get("allergens_tags") or [])
    )
    labels = _product_labels(product)
    product_text = f"{ingredients} {allergens}"

    if any("celiac" in condition for condition in conditions):
        gluten_terms = (
            "gluten", "wheat", "barley", "rye", "malt",
            "malt extract", "malted",
        )
        if "gluten free" not in labels and not any(
            term in product_text for term in gluten_terms
        ):
            pass
        elif "gluten free" not in labels:
            return True

    if any("lactose" in condition for condition in conditions):
        lactose_terms = (
            "lactose", "milk", "whey", "cream", "cheese",
            "casein", "caseinate", "milk powder", "milk solids",
        )
        if "lactose free" not in labels and any(
            term in product_text for term in lactose_terms
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

        # For savoury snacks, allow closely related snack formats

        # (extruded snacks, potato chips, nachos, and snack wafers).

        # This lets brands such as Bingo!, Lay's, Doritos, and Balaji

        # be considered without allowing biscuits or sweets.

        snack_types = {

            "extruded_snack",

            "potato_chips",

            "nachos",

            "snack_wafers",

            "chips",

        }

        if original_type in snack_types:

            return candidate_type in snack_types

        return candidate_type == original_type

    # --------------------------------------------------

    # Fallback when no specific type is detected

    # --------------------------------------------------

    score = calculate_relevance(

        food_label,

        product

    )

    return score >= 2

def get_product_family_key(product):

    """

    Create a stable product-family key.

    The goal is to remove different Open Food Facts

    entries that represent the same product family,

    while keeping genuinely different products.

    """

    name = normalize_text(

        product.get("product_name") or ""

    )

    brand = normalize_text(

        product.get("brands") or ""

    )

    if not name:

        return None

    # --------------------------------------------------

    # Normalize product name

    # --------------------------------------------------

    name = re.sub(

        r"\b\d+(?:\.\d+)?\s*(ml|l|ltr|cl|g|kg|mg)\b",

        "",

        name,

    )

    removable_words = {

        "drink",

        "drinks",

        "beverage",

        "beverages",

        "refresh",

        "original",

        "pack",

        "bottle",

        "can",

        "juice",

    }

    words = [

        word

        for word in name.split()

        if word not in removable_words

    ]

    name = " ".join(words).strip()

    if not name:

        return None

    # --------------------------------------------------

    # Recognize important product brands directly

    # from the product name.

    #

    # This handles cases where Open Food Facts

    # has inconsistent brand fields.

    # --------------------------------------------------

    known_product_families = {

        "maaza": "maaza",

        "frooti": "frooti",

        "slice": "slice",

        "appy fizz": "appy fizz",

        "appy": "appy",

        "real fruit power": "real fruit power",

        "rasna": "rasna",

    }

    # Check longer names first.

    known_families = sorted(

        known_product_families.items(),

        key=lambda item: len(item[0]),

        reverse=True,

    )

    for product_text, family_key in known_families:

        if (

            name == product_text

            or name.startswith(

                product_text + " "

            )

        ):

            return family_key

    # --------------------------------------------------

    # If the product name itself contains the brand,

    # remove the brand from the remaining name.

    # --------------------------------------------------

    if brand:

        brand_words = set(

            brand.split()

        )

        name_words = [

            word

            for word in name.split()

            if word not in brand_words

        ]

        name_without_brand = " ".join(

            name_words

        ).strip()

        if name_without_brand:

            return (

                f"{brand}|{name_without_brand}"

            )

        return brand

    # --------------------------------------------------

    # Fallback

    # --------------------------------------------------

    return name

def get_nutrition_values(product):

    """

    Extract commonly available nutrition values per 100g/ml

    from Open Food Facts.

    """

    nutriments = product.get("nutriments") or {}

    def get_value(key):

        value = nutriments.get(key)

        try:

            return float(value)

        except (TypeError, ValueError):

            return None

    sodium_g = get_value("sodium_100g")
    sodium_mg = sodium_g * 1000 if sodium_g is not None else None

    return {
        "energy": get_value("energy-kcal_100g"),
        "sugar": get_value("sugars_100g"),
        "fat": get_value("fat_100g"),
        "saturated_fat": get_value("saturated-fat_100g"),
        "sodium": sodium_mg,
        "protein": get_value("proteins_100g"),
        "carbohydrates": get_value("carbohydrates_100g"),
        "fiber": get_value("fiber_100g"),
    }

def calculate_personalized_score(

    food_label,

    candidate_product,

    user_profile,

):

    """

    Calculate a personalized alternative score.

    Higher score = better match for the user's profile.

    This is used only to rank already-relevant alternatives.

    """

    score = 50

    reasons = []

    if not user_profile:

        return score, reasons

    # --------------------------------------------------

    # GET ORIGINAL PRODUCT NUTRITION

    # --------------------------------------------------

    analysis = food_label.analysis or {}

    original_nutrition = {

        "sugar": None,

        "carbohydrates": None,

        "fat": None,

        "saturated_fat": None,

        "sodium": None,

        "energy": None,

    }

    nutrition_summary = (

        analysis.get("nutrition_summary")

        or ""

    )

    # nutrition_summary is stored as text.

    #

    # Example:

    # "Per 100 ml: Energy 44 kcal,

    # Carbohydrates 11 g, Total Sugars 10.7 g,

    # Added Sugars 9 g, Total Fat 0 g,

    # Protein 0 g, Sodium 22.1 mg."

    if isinstance(

        nutrition_summary,

        str,

    ):

        # Energy

        match = re.search(

            r"energy\s*:?\s*([\d.]+)\s*kcal",

            nutrition_summary,

            re.IGNORECASE,

        )

        if match:

            original_nutrition["energy"] = float(

                match.group(1)

            )

        # Carbohydrates

        match = re.search(

            r"carbohydrates?\s*:?\s*([\d.]+)\s*g",

            nutrition_summary,

            re.IGNORECASE,

        )

        if match:

            original_nutrition["carbohydrates"] = float(

                match.group(1)

            )

        # Total sugars

        match = re.search(

            r"total\s+sugars?\s*:?\s*([\d.]+)\s*g",

            nutrition_summary,

            re.IGNORECASE,

        )

        if match:

            original_nutrition["sugar"] = float(

                match.group(1)

            )

        # Total fat

        match = re.search(

            r"total\s+fat\s*:?\s*([\d.]+)\s*g",

            nutrition_summary,

            re.IGNORECASE,

        )

        if match:

            original_nutrition["fat"] = float(

                match.group(1)

            )

        # Saturated fat

        match = re.search(

            r"saturated\s+fat\s*:?\s*([\d.]+)\s*g",

            nutrition_summary,

            re.IGNORECASE,

        )

        if match:

            original_nutrition["saturated_fat"] = float(

                match.group(1)

            )

        # Sodium

        match = re.search(

            r"sodium\s*:?\s*([\d.]+)\s*mg",

            nutrition_summary,

            re.IGNORECASE,

        )

        if match:

            original_nutrition["sodium"] = float(

                match.group(1)

            )

    # --------------------------------------------------

    # GET CANDIDATE NUTRITION

    # --------------------------------------------------

    candidate_nutrition = get_nutrition_values(

        candidate_product

    )

    # --------------------------------------------------

    # MEDICAL CONDITIONS

    # --------------------------------------------------

    medical_conditions = [

        condition.strip().lower()

        for condition in (

            user_profile.medical_conditions

            or []

        )

        if condition

        and condition.strip()

    ]

    if user_profile.other_medical_condition:

        medical_conditions.append(

            user_profile.other_medical_condition

            .strip()

            .lower()

        )

    # --------------------------------------------------

    # ALLERGY SAFETY

    # --------------------------------------------------

    if not has_allergen_conflict(

        candidate_product,

        user_profile,

    ):

        score += 15

        reasons.append(

            "No detected conflict with your recorded allergies."

        )

    # --------------------------------------------------

    # DIETARY PREFERENCE

    # --------------------------------------------------

    if not has_dietary_conflict(

        candidate_product,

        user_profile,

    ):

        score += 10

        if user_profile.dietary_preference:

            reasons.append(

                "No detected conflict with your dietary preference."

            )

    # --------------------------------------------------

    # NUTRITION COMPARISON

    # --------------------------------------------------

    nutrition_checks = [

        ("sugar", "sugar"),

        ("saturated_fat", "saturated fat"),

        ("sodium", "sodium"),

        ("fat", "total fat"),

        ("energy", "calories"),

    ]

    for key, label in nutrition_checks:

        original_value = (

            original_nutrition.get(key)

        )

        candidate_value = (

            candidate_nutrition.get(key)

        )

        if (

            original_value is not None

            and candidate_value is not None

        ):

            try:

                original_value = float(

                    original_value

                )

                candidate_value = float(

                    candidate_value

                )

            except (

                TypeError,

                ValueError,

            ):

                continue

            if candidate_value < original_value:

                score += 4

                reasons.append(

                    f"Lower {label} than the analyzed product."

                )

            elif candidate_value > original_value:

                score -= 2

    # --------------------------------------------------

    # MEDICAL-CONDITION RELEVANCE

    for condition in medical_conditions:
        if "diabetes" in condition or "high blood sugar" in condition:
            sugar = candidate_nutrition.get("sugar")
            carbs = candidate_nutrition.get("carbohydrates")
            if sugar is not None and float(sugar) < 5:
                score += 12
                reasons.append("Lower sugar content may be a better match for your recorded diabetes-related preference.")
            elif sugar is not None and float(sugar) < 10:
                score += 6
                reasons.append("Moderate sugar content may be a better match for your recorded diabetes-related preference.")
            if carbs is not None and float(carbs) < 15:
                score += 5
                reasons.append("Lower carbohydrate content may be a better match for your recorded diabetes-related preference.")

        if "hypertension" in condition or "high blood pressure" in condition:
            sodium = candidate_nutrition.get("sodium")
            if sodium is not None and float(sodium) < 120:
                score += 15
                reasons.append("Lower sodium content may be a better match for your recorded blood-pressure related preference.")
            elif sodium is not None and float(sodium) < 300:
                score += 8
                reasons.append("Moderate sodium content may be a better match for your recorded blood-pressure related preference.")

        if "high cholesterol" in condition:
            saturated_fat = candidate_nutrition.get("saturated_fat")
            fat = candidate_nutrition.get("fat")
            if saturated_fat is not None and float(saturated_fat) < 1.5:
                score += 15
                reasons.append("Lower saturated fat content may be a better match for your recorded cholesterol-related preference.")
            if fat is not None and float(fat) < 5:
                score += 8
                reasons.append("Lower total fat content may be a better match for your recorded cholesterol-related preference.")

        if "heart disease" in condition or "cardiovascular" in condition:
            sodium = candidate_nutrition.get("sodium")
            saturated_fat = candidate_nutrition.get("saturated_fat")
            if sodium is not None and float(sodium) < 120:
                score += 10
                reasons.append("Lower sodium content may be a better match for your recorded heart-health preference.")
            elif sodium is not None and float(sodium) < 300:
                score += 5
            if saturated_fat is not None and float(saturated_fat) < 1.5:
                score += 10
                reasons.append("Lower saturated fat content may be a better match for your recorded heart-health preference.")

        if "kidney disease" in condition or condition == "kidney":
            sodium = candidate_nutrition.get("sodium")
            if sodium is not None and float(sodium) < 120:
                score += 12
                reasons.append("Lower sodium content may be a better match for your recorded kidney-health preference.")
            elif sodium is not None and float(sodium) < 300:
                score += 6
                reasons.append("Moderate sodium content may be a better match for your recorded kidney-health preference.")

        if "obesity" in condition:
            energy = candidate_nutrition.get("energy")
            sugar = candidate_nutrition.get("sugar")
            fat = candidate_nutrition.get("fat")
            if energy is not None and float(energy) < 150:
                score += 8
                reasons.append("Lower calorie content may be a better match for your recorded weight-management preference.")
            if sugar is not None and float(sugar) < 5:
                score += 6
                reasons.append("Lower sugar content may be a better match for your recorded weight-management preference.")
            if fat is not None and float(fat) < 5:
                score += 6
                reasons.append("Lower total fat content may be a better match for your recorded weight-management preference.")

        # Celiac disease and lactose intolerance are handled as hard filters.
        # Other Medical Condition is not automatically interpreted.

    # KEEP SCORE BETWEEN 0 AND 100

    # --------------------------------------------------

    score = max(

        0,

        min(score, 100),

    )

    # --------------------------------------------------

    # REMOVE DUPLICATE REASONS

    # --------------------------------------------------

    reasons = list(

        dict.fromkeys(reasons)

    )

    return score, reasons

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

    # Remove duplicate products and duplicate product families.

    unique_products = {}

    for product in products:

        product_name = normalize_text(

            product.get("product_name") or ""

        )

        if not product_name:

            continue

        # Use the product-family key to identify

        # duplicate product entries.

        key = get_product_family_key(product)

        if not key:

            continue

        # Keep only the first product from each family.

        if key not in unique_products:

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

        # Existing relevance score.

        product["_relevance_score"] = (

            calculate_relevance(

                food_label,

                product,

            )

        )

        # Personalized score based on

        # the user's profile and health preferences.

        product["_personalized_score"], product[

            "_recommendation_reasons"

        ] = calculate_personalized_score(

            food_label,

            product,

            user_profile,

        )

        alternatives.append(product)

    # Highest personalized score first.

    # Relevance score is used as the tie-breaker.

    alternatives.sort(

        key=lambda product: (

            product.get(

                "_personalized_score",

                0,

            ),

            product.get(

                "_relevance_score",

                0,

            ),

        ),

        reverse=True,

    )

    # Remove internal scores and expose

    # personalized recommendation information.

    for product in alternatives:

        product.pop(

            "_relevance_score",

            None,

        )

        product["personalized_score"] = product.pop(

            "_personalized_score",

            0,

        )

        product["recommendation_reasons"] = product.pop(

            "_recommendation_reasons",

            [],

        )

    return alternatives[:10]


