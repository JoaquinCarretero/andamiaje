from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000/")
        page.wait_for_url("http://localhost:3000/")
        print("Successfully connected to the server.")

        page.goto("http://localhost:3000/terapeuta")
        page.wait_for_url("http://localhost:3000/terapeuta")

        # Click on the "facturas" button to show the invoice upload component
        page.click('text="Facturas"')

        # Click the "Ver" button to open the preview modal
        page.click('text="Ver"')

        # Wait for the modal to appear
        page.wait_for_selector('.bg-black/50')

        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
