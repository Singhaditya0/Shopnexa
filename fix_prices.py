import pandas as pd

INPUT_FILE = "my_website_products_final.csv"

CORRECTED_PRICES = {
    "OnePlus Nord 3": 28999,
    "OnePlus 12R": 34999,
    "Realme 12 Pro": 22999,
    "Redmi Note 13 Pro": 21999,
    "Poco X6 Pro": 26999,
    "Vivo V30": 31999,
    "Apple Watch Series 9": 34900,
    "Apple iPhone 15": 74900,
    "Apple iPhone 14": 59900,
    "Apple iPhone 13": 54900,
    "MacBook Air M2": 99900,
    "MacBook Air M3": 114900,
    "JBL Wave 200": 1499,
    "Realme Buds Air 5": 2699,
    "Woodland Leather Shoes": 2999,
}

df = pd.read_csv(INPUT_FILE)

for product_name, correct_price in CORRECTED_PRICES.items():
    mask = df["Product_Name"] == product_name
    if mask.any():
        df.loc[mask, "Lowest_Price"] = correct_price
        df.loc[mask, "Best_Store"] = "Manual"
        print(f"Fixed: {product_name} -> Rs.{correct_price}")
    else:
        print(f"Warning: {product_name} not found in CSV")

df.to_csv(INPUT_FILE, index=False, encoding="utf-8-sig")
print("\nDone! CSV updated.")
