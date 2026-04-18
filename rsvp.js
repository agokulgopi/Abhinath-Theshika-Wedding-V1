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

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "RSVP endpoint is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Sheet1');

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Sheet not found." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const p = e.parameter || {};

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Contact Number', 'WhatsApp Number', 'Mail ID', 'Attending', 'Events Choice', 'Accompanying', 'Stay Req']);
    }

    sheet.appendRow([
      new Date(),
      p.fullName       || '',
      p.contactNumber  || '',
      p.whatsappNumber || '',
      p.email          || '',
      p.attending      || '',
      p.eventsChoice   || '',
      p.accompanying   || '',
      p.stay           || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
  endpoint: "https://script.google.com/macros/s/AKfycbzKVZ8SyYq17zf5FtLS3VuCKcwwt_IHXUKx_2tkFFg8lqtJtJCyQH-JiMbqQuYSTNvh9g/exec",
  fieldMap: {
    fullName: "entry.1111111111",
    contactNumber: "entry.2222222222",
    whatsappNumber: "entry.3333333333",
    email: "entry.4444444444",
    attending: "entry.5555555555",
    eventsChoice: "entry.6666666666",
    accompanying: "entry.7777777777",
    stay: "entry.8888888888"
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

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";
    submitBtn.style.cursor = "not-allowed";

  if (!RSVP_CONFIG.endpoint || !RSVP_CONFIG.endpoint.startsWith("https://script.google.com")) {
    alert("Please configure RSVP endpoint in rsvp.js first.");
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
    return;
  }

    const formData = new FormData(form);

    const payload = {
      fullName: (formData.get("fullName") || "").toString().trim(),
      contactNumber: (formData.get("contactNumber") || "").toString().trim(),
      whatsappNumber: (formData.get("whatsappNumber") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      attending: (formData.get("attending") || "").toString(),
      eventsChoice: (formData.get("eventsChoice") || "").toString(),
      accompanying: (formData.get("accompanying") || "").toString(),
      stay: (formData.get("stay") || "").toString()
    };

    try {
      if (RSVP_CONFIG.mode === "appsScript") {
        // Use simple form encoding + no-cors to avoid preflight/CORS blocks from script.google.com
        const appScriptData = new URLSearchParams();
        appScriptData.append("fullName", payload.fullName);
        appScriptData.append("contactNumber", payload.contactNumber);
        appScriptData.append("whatsappNumber", payload.whatsappNumber);
        appScriptData.append("email", payload.email);
        appScriptData.append("attending", payload.attending);
        appScriptData.append("eventsChoice", payload.eventsChoice);
        appScriptData.append("accompanying", payload.accompanying);
        appScriptData.append("stay", payload.stay);

        await fetch(RSVP_CONFIG.endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: appScriptData.toString()
        });
      } else {
        const googleFormData = new URLSearchParams();
        googleFormData.append(RSVP_CONFIG.fieldMap.fullName, payload.fullName);
        googleFormData.append(RSVP_CONFIG.fieldMap.contactNumber, payload.contactNumber);
        googleFormData.append(RSVP_CONFIG.fieldMap.whatsappNumber, payload.whatsappNumber);
        googleFormData.append(RSVP_CONFIG.fieldMap.email, payload.email);
        googleFormData.append(RSVP_CONFIG.fieldMap.attending, payload.attending);
        googleFormData.append(RSVP_CONFIG.fieldMap.eventsChoice, payload.eventsChoice);
        googleFormData.append(RSVP_CONFIG.fieldMap.accompanying, payload.accompanying);
        googleFormData.append(RSVP_CONFIG.fieldMap.stay, payload.stay);

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
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.style.cursor = "pointer";
    }
  });
});
