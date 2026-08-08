import os
import time
import pandas as pd
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

INPUT_FILE = "master_product_names_3000.csv"
OUTPUT_FILE = "my_website_products_3000_final.csv"

def scrape_product_data(page, product_name):
    print(f"Searching: {product_name} ...")
    search_url = f"https://www.google.com/search?q={product_name}&tbm=shop"
    
    try:
        page.goto(search_url, timeout=30000, wait_until="domcontentloaded")
        time.sleep(1.5)
        
        html = page.content()
        soup = BeautifulSoup(html, 'html.parser')
        
        # Multiple fallback selectors for Google Shopping cards
        cards = soup.select('.sh-dgr__content, .sh-pr__target, .sh-np__click-target, .g, .I41Oof')
        
        if not cards:
            print(f"  ❌ No results found")
            return None
            
        first_card = cards[0]
        
        # Extract Image
        img_tag = first_card.select_one('img')
        image_url = img_tag['src'] if img_tag and img_tag.has_attr('src') else "N/A"
        
        # Extract Price (multiple fallback selectors)
        price_tag = first_card.select_one('.a88f2c, .offence, .a98f2c, .u3fB9e, .H8932e, span[aria-hidden="true"]')
        lowest_price = price_tag.text.strip() if price_tag else "N/A"
        
        # Extract Merchant / Store
        store_tag = first_card.select_one('.aUL09e, .I3012e, .E5A16b, .d39e2e')
        best_store = store_tag.text.strip() if store_tag else "Google Shopping"
        
        # Extract Direct Buy Link
        link_tag = first_card.select_one('a')
        if link_tag and link_tag.has_attr('href'):
            href = link_tag['href']
            buy_url = f"https://www.google.com{href}" if href.startswith('/') else href
        else:
            buy_url = "N/A"

        print(f"  ✅ Found: {lowest_price} on {best_store}")

        return {
            "Product_Name": product_name,
            "Image_URL": image_url,
            "Lowest_Price": lowest_price,
            "Best_Store": best_store,
            "Best_Store_Buy_URL": buy_url
        }

    except Exception as e:
        print(f"  ❌ Error searching {product_name}: {e}")
        return None

def run():
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: '{INPUT_FILE}' file nahi mili!")
        return

    df_input = pd.read_csv(INPUT_FILE)
    products = df_input["Product_Name"].tolist()

    print(f"🚀 Starting Clean Search for {len(products)} Products...")
    print("="*40)

    all_data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        for idx, prod in enumerate(products, start=1):
            data = scrape_product_data(page, prod)
            if data:
                all_data.append(data)

            if idx % 25 == 0:
                pd.DataFrame(all_data).to_csv(OUTPUT_FILE, index=False, encoding='utf-8-sig')
                print(f"\n--- 💾 Progress Saved: {idx}/{len(products)} Products Complete ---\n")

        browser.close()

    df_output = pd.DataFrame(all_data)
    df_output.to_csv(OUTPUT_FILE, index=False, encoding='utf-8-sig')
    print("\n" + "="*40)
    print(f"🎉 SUCCESS! All {len(df_output)} products scraped & saved to '{OUTPUT_FILE}'")

if __name__ == "__main__":
    run()