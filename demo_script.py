"""
InternHub — Demo video  (≈ 45 sec)
Act 1 | Student  : Home → Browse → Favourite → Apply → My Applications
Act 2 | Company  : Company Profile → Post Vacancy → Browse Candidates → Home

Requirements:
  pip install playwright
  playwright install chromium
  python demo_script.py
"""

import asyncio
import os
from playwright.async_api import async_playwright

BASE_URL  = "https://internship-search-app-project.vercel.app"
VIDEO_DIR = "demo_video"
SLOW_MO   = 60   # ms per action

STUDENT_EMAIL    = "inna.likhacheva@student.kpedu.fi"
STUDENT_PASSWORD = "Inna()78"
COMPANY_EMAIL    = "inna@innalab.com"
COMPANY_PASSWORD = "Inna()78"


async def p(page, ms: int = 200):
    await page.wait_for_timeout(ms)


async def accept_cookies(page):
    try:
        btn = page.locator("#cookieAccept")
        await btn.wait_for(state="visible", timeout=3000)
        await btn.click()
        await p(page, 150)
    except Exception:
        pass


async def do_login(page, email, password):
    await page.goto(f"{BASE_URL}/auth.html")
    await p(page, 400)
    await page.fill("#loginEmail", email)
    await p(page, 120)
    await page.fill("#loginPassword", password)
    await p(page, 120)
    await page.locator("#loginForm_form .btn-primary").click()
    await page.wait_for_url(lambda url: "auth.html" not in url, timeout=10000)
    await p(page, 500)


async def do_logout(page):
    """Clear session without full page-reload cycle."""
    await page.evaluate("""() => {
        ['isLoggedIn', 'userId', 'userRole', 'userLogin', 'favorites']
            .forEach(k => localStorage.removeItem(k));
    }""")
    await p(page, 150)


# ── ACT 1: STUDENT  (≈ 22 sec) ────────────────────────────────────────────────
async def act_student(page):
    print("▶  Act 1 — Student")

    # 1. Home — hero scroll
    await page.goto(f"{BASE_URL}/index.html")
    await p(page, 500)
    await accept_cookies(page)
    await page.evaluate("window.scrollBy(0, 400)")
    await p(page, 600)
    await page.evaluate("window.scrollTo(0, 0)")
    await p(page, 400)

    # 2. Login as student
    await do_login(page, STUDENT_EMAIL, STUDENT_PASSWORD)

    # 3. Browse internships — search + filter
    await page.goto(f"{BASE_URL}/internships.html")
    await p(page, 700)
    await page.fill("#searchInput", "developer")
    await p(page, 200)
    await page.locator("#filterBtn").click()
    await p(page, 600)
    await page.fill("#searchInput", "")
    await page.locator("#filterBtn").click()
    await p(page, 600)

    # 4. Mark first card as favourite
    fav = page.locator(".favorite-btn").first
    if await fav.count() > 0:
        await fav.click()
        await p(page, 400)

    # 5. Open first card → Apply modal
    card = page.locator(".job-card").first
    if await card.count() > 0:
        await card.click()
        await p(page, 700)

        apply_btn = page.locator("#applyBtn")
        if await apply_btn.count() > 0:
            await apply_btn.scroll_into_view_if_needed()
            await p(page, 300)
            await apply_btn.click()
            await p(page, 500)

            await page.fill(
                "#applyLetter",
                "Hi,\n\nI am excited about this opportunity. "
                "I bring strong motivation and fresh ideas.\n\nBest regards, Inna",
            )
            await p(page, 400)
            await page.locator("#modalApplyForm button[type='submit']").click()
            await p(page, 800)

    # 6. Student profile — scroll to applications section
    await page.goto(f"{BASE_URL}/student-profile.html")
    await p(page, 700)
    await page.evaluate("window.scrollBy(0, 500)")
    await p(page, 700)


# ── ACT 2: COMPANY  (≈ 22 sec) ────────────────────────────────────────────────
async def act_company(page):
    print("▶  Act 2 — Company")

    # 7. Switch to company account
    await do_logout(page)
    await do_login(page, COMPANY_EMAIL, COMPANY_PASSWORD)

    # 8. Company profile overview
    await page.goto(f"{BASE_URL}/company-profile.html")
    await p(page, 700)
    await page.evaluate("window.scrollBy(0, 300)")
    await p(page, 500)

    # 9. Open "Post New Position" modal
    await page.locator("button[onclick='openPostModal()']").click()
    await p(page, 500)

    await page.fill("#pTitle", "Frontend Developer Intern")
    await p(page, 200)
    await page.fill("#pDesc", "Join our team and work on real projects with a modern tech stack.")
    await p(page, 200)
    await page.fill("#pSalary", "1 800 € / month")
    await p(page, 150)

    # Fill dates via JS (avoids locale-specific date-input quirks)
    await page.evaluate("document.getElementById('pStart').value = '2025-09-01'")
    await p(page, 100)
    await page.evaluate("document.getElementById('pEnd').value = '2025-12-31'")
    await p(page, 200)

    # 10. Submit the position
    await page.locator("#submitPostBtn").click()
    await p(page, 800)

    # 11. Browse candidates
    await page.goto(f"{BASE_URL}/footer_info/browse-candidates.html")
    await p(page, 700)
    await page.evaluate("window.scrollBy(0, 380)")
    await p(page, 700)
    await page.evaluate("window.scrollTo(0, 0)")
    await p(page, 400)

    # 12. Home — final frame
    await page.goto(f"{BASE_URL}/index.html")
    await p(page, 700)
    await page.evaluate("window.scrollBy(0, 200)")
    await p(page, 600)


# ── Main ──────────────────────────────────────────────────────────────────────
async def main():
    os.makedirs(VIDEO_DIR, exist_ok=True)
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=False,
            slow_mo=SLOW_MO,
            args=["--start-maximized"],
        )
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir=VIDEO_DIR,
            record_video_size={"width": 1440, "height": 900},
        )
        print("\n🎬  Recording started — target: ~45 sec")
        page = await context.new_page()

        await act_student(page)
        await act_company(page)

        print("\n✅  Done!")
        await p(page, 600)

        video = page.video
        await context.close()
        path = await video.path()
        await browser.close()

    print(f"\n📹  Saved → {path}")


if __name__ == "__main__":
    asyncio.run(main())
