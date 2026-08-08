import os
import pandas as pd
from serpapi import GoogleSearch
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.environ.get("SERPAPI_KEY")

if not API_KEY:
    raise ValueError("SERPAPI_KEY .env file mein nahi mili. .env file check karo.")

INPUT_FILE = "master_product_names_for_scraping.csv"
OUTPUT_FILE = "my_website_products_final.csv"

def fetch_multi_store_prices(product_name):
    print(f"Searching: {product_name} ...")

    params = {
        "engine": "google_shopping",
        "q": product_name,
        "location": "India",
        "hl": "en",
        "gl": "in",
        "api_key": API_KEY
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        shopping_results = results.get("shopping_results", [])
    except Exception as e:
        print(f"Error: {e}")
        return None

    stores_price = {"Amazon": None, "Flipkart": None, "eBay": None, "Meesho": None, "Myntra": None}
    stores_link = {"Amazon": None, "Flipkart": None, "eBay": None, "Meesho": None, "Myntra": None}
    image_url = ""

    for item in shopping_results:
        source = item.get("source", "").lower()

        price_val = item.get("extracted_price")
        if not price_val and item.get("price"):
            raw_p = str(item.get("price")).replace("rupee_sign", "").replace(",", "").strip()
            try:
                price_val = float(raw_p)
            except:
                price_val = None

        product_link = item.get("product_link") or item.get("link") or item.get("merchant_link")

        if not image_url and item.get("thumbnail"):
            image_url = item.get("thumbnail")

        for store in stores_price.keys():
            if store.lower() in source and stores_price[store] is None:
                stores_price[store] = price_val
                stores_link[store] = product_link

    valid_prices = {k: v for k, v in stores_price.items() if v is not None}

    if valid_prices:
        best_store = min(valid_prices, key=valid_prices.get)
        lowest_price = valid_prices[best_store]
        best_store_link = stores_link[best_store]
    else:
        best_store, lowest_price, best_store_link = "N/A", "N/A", "N/A"

    return {
        "Product_Name": product_name,
        "Image_URL": image_url,
        "Lowest_Price": lowest_price,
        "Best_Store": best_store,
        "Best_Store_Buy_URL": best_store_link,
        "Amazon_Price": stores_price["Amazon"],
        "Amazon_URL": stores_link["Amazon"],
        "Flipkart_Price": stores_price["Flipkart"],
        "Flipkart_URL": stores_link["Flipkart"],
        "eBay_Price": stores_price["eBay"],
        "eBay_URL": stores_link["eBay"],
        "Meesho_Price": stores_price["Meesho"],
        "Meesho_URL": stores_link["Meesho"],
        "Myntra_Price": stores_price["Myntra"],
        "Myntra_URL": stores_link["Myntra"]
    }

def run_scraper():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: '{INPUT_FILE}' file nahi mili!")
        return

    df_input = pd.read_csv(INPUT_FILE)

    col = "Product_Name" if "Product_Name" in df_input.columns else "Exact_Product_Name"
    product_list = df_input[col].tolist()

    all_data = []
    for product in product_list:
        res = fetch_multi_store_prices(product)
        if res:
            all_data.append(res)

    df_output = pd.DataFrame(all_data)
    df_output.to_csv(OUTPUT_FILE, index=False, encoding='utf-8-sig')
    print(f"\nSUCCESS! Final CSV saved with URLs as '{OUTPUT_FILE}'")

if __name__ == "__main__":
    run_scraper()
