const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwvGNYwJMUpO4MIMpC90s0tdjZB5JTu2UFg3m2R8U0XuH7hPT6g-XyOwkR2g0LLFhg/exec";
const MAIL_TO_EMAIL = "thebridgeinitiative6@gmail.com";

// EmailJS credentials are loaded from config.local.js (git-ignored).
// See config.example.js for the required format.
// NEVER hardcode real keys here — this file is public on GitHub.
const EMAILJS_PUBLIC_KEY  = window._bridgeConfig?.emailjsPublicKey  ?? "";
const EMAILJS_SERVICE_ID  = window._bridgeConfig?.emailjsServiceId  ?? "";
const EMAILJS_TEMPLATE_ID = window._bridgeConfig?.emailjsTemplateId ?? "";

// Initialise EmailJS once
if (typeof emailjs !== "undefined") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

function serializeForm(form) {
  const fields = {};

  new FormData(form).forEach((value, key) => {
    if (typeof value !== "string") return;

    if (Object.hasOwn(fields, key)) {
      fields[key] = Array.isArray(fields[key])
        ? [...fields[key], value]
        : [fields[key], value];
    } else {
      fields[key] = value;
    }
  });

  return fields;
}

function setFormStatus(form, message, type = "info") {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;

  status.textContent = message;
  status.className = "form-status mt-5 text-sm";

  if (type === "success") {
    status.classList.add("font-semibold", "text-green-700");
  } else if (type === "error") {
    status.classList.add("font-semibold", "text-red-700");
  } else {
    status.classList.add("font-semibold", "text-bridge-blue");
  }
}

document.querySelectorAll("[data-google-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const button = event.submitter;
    const originalText = button?.textContent;
    const fields = serializeForm(form);

    if (button) {
      button.disabled = true;
      button.textContent = "Submitting...";
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          formName: form.dataset.formName,
          fields,
        }),
      });

      setFormStatus(
        form,
        "Thank you! Your submission has been received.",
        "success",
      );
      form.reset();
    } catch (error) {
      console.error(error);
      setFormStatus(
        form,
        "We could not submit your information. Please try again.",
        "error",
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText || "Submit";
      }
    }
  });
});

document.querySelectorAll("[data-mail-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const button = event.submitter;
    const originalText = button?.textContent;
    const formData = new FormData(form);
    const name    = (formData.get("name")    || "").toString().trim();
    const email   = (formData.get("email")   || "").toString().trim();
    const subject = (formData.get("subject") || "Website enquiry").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: MAIL_TO_EMAIL,
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
      });

      setFormStatus(form, "Your message has been sent. We'll be in touch soon.", "success");
      form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      setFormStatus(form, "We could not send your message. Please try again.", "error");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText || "Submit";
      }
    }
  });
});
