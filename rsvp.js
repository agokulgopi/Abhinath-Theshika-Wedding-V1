/*
SETUP GUIDE: Store RSVP responses in Google Sheets / Google Forms
========================================================================
Choose ONE mode below:
1) "appsScript" (recommended): saves directly to Google Sheet
2) "googleForm": submits to Google Form (responses appear in linked sheet)

Update RSVP_CONFIG.endpoint with your real URL.

-----------------------------------------------------------------------
MODE A: appsScript (recommended)
-----------------------------------------------------------------------
1. Create a Google Sheet (for RSVPs).
2. In that sheet: Extensions -> Apps Script.
3. Paste this script and save:

function doPost(e) {
  // RSVP page sends form-urlencoded fields (see fetch in this file). Use e.parameter — NOT e.postData.
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const p = e.parameter || {};
  sheet.appendRow([
    new Date(),
    p.fullName || '',
    p.email || '',
    p.attending || '',
    p.events || '',
    p.dietary || ''
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

4. Deploy -> New deployment -> Web app:
   - Execute as: Me
   - Who has access: Anyone
5. Copy Web App URL and set it as RSVP_CONFIG.endpoint.

-----------------------------------------------------------------------
MODE B: googleForm
-----------------------------------------------------------------------
1. Create Google Form with matching questions.
2. Open form in browser and inspect HTML for each input name like entry.123456.
3. Set RSVP_CONFIG.endpoint to:
   https://docs.google.com/forms/d/<FORM_ID>/formResponse
4. Replace fieldMap values with your real entry IDs.
========================================================================
*/

const RSVP_CONFIG = {
  mode: "appsScript", // "appsScript" or "googleForm"
  endpoint: "",
  fieldMap: {
    fullName: "entry.1111111111",
    email: "entry.2222222222",
    attending: "entry.3333333333",
    events: "entry.4444444444",
    dietary: "entry.5555555555"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvp-form");
  const successMsg = document.getElementById("success-message");
  const page = document.querySelector(".rsvp-page");

  setTimeout(() => page?.classList.add("visible"), 100);
  if (!form || !successMsg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!RSVP_CONFIG.endpoint || RSVP_CONFIG.endpoint.includes("PASTE_YOUR_ENDPOINT_HERE")) {
      alert("Please configure RSVP endpoint in rsvp.js first.");
      return;
    }

    const formData = new FormData(form);
    const events = [];
    if (formData.get("eventsSangeet")) events.push("Sangeet");
    if (formData.get("eventsWedding")) events.push("Wedding");

    const payload = {
      fullName: (formData.get("fullName") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      attending: (formData.get("attending") || "").toString(),
      events,
      dietary: (formData.get("dietary") || "").toString().trim()
    };

    try {
      if (RSVP_CONFIG.mode === "appsScript") {
        // Use simple form encoding + no-cors to avoid preflight/CORS blocks from script.google.com
        const appScriptData = new URLSearchParams();
        appScriptData.append("fullName", payload.fullName);
        appScriptData.append("email", payload.email);
        appScriptData.append("attending", payload.attending);
        appScriptData.append("events", payload.events.join(", "));
        appScriptData.append("dietary", payload.dietary);

        await fetch(RSVP_CONFIG.endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: appScriptData.toString()
        });
      } else {
        const googleFormData = new URLSearchParams();
        googleFormData.append(RSVP_CONFIG.fieldMap.fullName, payload.fullName);
        googleFormData.append(RSVP_CONFIG.fieldMap.email, payload.email);
        googleFormData.append(RSVP_CONFIG.fieldMap.attending, payload.attending);
        googleFormData.append(RSVP_CONFIG.fieldMap.events, payload.events.join(", "));
        googleFormData.append(RSVP_CONFIG.fieldMap.dietary, payload.dietary);

        await fetch(RSVP_CONFIG.endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: googleFormData.toString()
        });
      }

      form.classList.add("hidden");
      successMsg.style.display = "block";
    } catch (error) {
      console.error("RSVP submit error:", error);
      alert("Sorry, we could not submit your RSVP. Please try again.");
    }
  });
});
