import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set your specific download path
download_dir = r"C:\Users\bayya\OneDrive\Desktop\Test"

# Ensure the directory exists
os.makedirs(download_dir, exist_ok=True)

# --- PART 1: Use Chrome with DevTools Protocol to trigger PDF download ---
# Set Chrome options
options = Options()
options.add_argument("--headless")  # Run in headless mode (no UI)
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--window-size=1920,1080")  # Prevent rendering issues in headless mode

# Set download preferences to directly download PDFs
options.add_experimental_option("prefs", {
    "download.default_directory": download_dir,
    "download.prompt_for_download": False,
    "download.directory_upgrade": True,
    "plugins.always_open_pdf_externally": True
})

# Set up the Chrome WebDriver
driver_chrome = webdriver.Chrome(options=options)

# Open the NGO Darpan search page using Chrome
driver_chrome.get("https://ngodarpan.gov.in/index.php/search/")

try:
    # Wait for the page to fully load (including dynamic content)
    WebDriverWait(driver_chrome, 20).until(EC.presence_of_element_located((By.ID, "unique_id_search")))

    # Search for the Unique ID
    search_box = driver_chrome.find_element(By.ID, "unique_id_search")
    unique_id = "MH/2017/0151463"
    search_box.clear()
    search_box.send_keys(unique_id)
    search_box.send_keys(Keys.RETURN)

    # Wait for search results to load and be visible
    WebDriverWait(driver_chrome, 20).until(EC.presence_of_element_located((By.ID, "example")))

    # Click on the first NGO link
    first_link = driver_chrome.find_element(By.XPATH, "//table[@id='example']//tbody//tr[1]//td[2]//a")
    first_link.click()
    print("Clicked on the NGO link.")

    # Wait for the details page to load (this may take a few seconds)
    WebDriverWait(driver_chrome, 20).until(EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'NGO Details')]")))

    # Use Chrome DevTools Protocol to trigger PDF download directly
    driver_chrome.execute_cdp_cmd('Page.printToPDF', {
        'path': f'{download_dir}\\ngo_details.pdf',
        'format': 'A4'
    })
    print("PDF has been downloaded.")

    # Wait for the download to complete
    time.sleep(5)

except Exception as e:
    print("Error:", e)

finally:
    driver_chrome.quit()