You are helping me continue development of a static web app: a dairy receipt generator with a newly added milk-tracker bridge to Google Sheets.
Project path (local):
c:\Users\C77598A\Manish\Personal\Coding\Projects\receipt_generator
Current structure:
- src/
  - index.html
  - styles.css
  - script.js
  - assets/images/qr_code.jpg
Stack:
- Plain HTML/CSS/Vanilla JS
- No backend server in repo
- Google Apps Script Web App URL is used as bridge to Google Sheets
Critical constraint:
DO NOT break existing receipt generator functionality. The receipt feature must continue to work exactly as now.
==================================================
CURRENT FUNCTIONALITY (already implemented)
==================================================
1) Receipt Generator (existing)
- Billing form with:
  - Billed To
  - Date From / Date To
  - Skipped days
  - Cow + Buffalo checkboxes
  - Quantity and price for each milk type
  - Tax
- Computes totals and renders receipt preview.
- QR image shown from:
  src/assets/images/qr_code.jpg
- Download PDF currently uses browser print flow (window.print + print CSS), not html2pdf.
- Filename is based on billed-to name by temporarily setting document.title.
- Default Date From/To are set to first/last day of previous month.
- Print styles hide form/tracker and print receipt.
2) New section added: “Milk Tracker (Google Sheets Bridge)”
- Separate section below receipt.
- Must remain isolated from receipt logic.
- Includes:
  - Bridge URL setup + save/test
  - Add customer form
  - Add daily entry form
  - Monthly fetch/view table
- In JS, tracker expects Apps Script actions:
  - ping
  - listCustomers
  - addCustomer
  - addEntry
  - getEntries
- URL is stored in localStorage key:
  dairy_tracker_apps_script_url
==================================================
WHAT I NEED YOU TO DO
==================================================
Please audit and improve this implementation with focus on reliability and maintainability.
A) Review and harden tracker bridge logic
- Validate request/response handling.
- Handle malformed or non-JSON responses gracefully.
- Improve status/error messages for user clarity.
- Ensure no crashes if bridge URL missing, wrong, or returns partial data.
- Ensure customer dropdown and monthly table states are always consistent.
B) Keep strict separation from receipt generator
- Tracker changes must not impact any existing receipt IDs, calculations, print behavior, or styles.
- If any shared CSS causes conflicts, isolate tracker styles better.
C) Improve code organization in script.js
- Keep behavior same, but refactor where needed for readability.
- Avoid global collisions between receipt and tracker code.
- Add small comments only where logic is non-obvious.
D) Add lightweight developer guidance
- Add a short “Bridge contract” note in code comments:
  expected payload and response shape for each action.
E) Verify GitHub Pages compatibility
- Site is hosted from /src.
- Asset paths must work in this setup.
==================================================
KNOWN NOTES FROM DISCUSSION
==================================================
- We intentionally avoided setting up backend DB.
- Google Sheets + Apps Script Web App is chosen.
- User may manually upload files to GitHub.
- Custom domain is not required.
- App must stay static and easy to run.
==================================================
ACCEPTANCE CRITERIA
==================================================
1) Receipt generator works exactly as before.
2) Tracker section works independently without JS errors.
3) Bad bridge URL / network / malformed response handled gracefully.
4) Loading customers and monthly entries doesn’t break UI state.
5) No linter errors.
6) Paths and functionality continue to work with GitHub Pages source = /src.
==================================================
DELIVERABLE FORMAT
==================================================
- Provide:
  1) Short summary of what you changed
  2) List of files changed
  3) Key before/after behavior
  4) Any remaining risks or follow-up suggestions
