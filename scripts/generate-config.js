// Runs at build time on Vercel to generate config.local.js from environment variables.
// Set these in your Vercel project dashboard under Settings → Environment Variables:
//   EMAILJS_PUBLIC_KEY
//   EMAILJS_SERVICE_ID
//   EMAILJS_TEMPLATE_ID

const fs   = require("fs");
const path = require("path");

const publicKey  = process.env.EMAILJS_PUBLIC_KEY  || "";
const serviceId  = process.env.EMAILJS_SERVICE_ID  || "";
const templateId = process.env.EMAILJS_TEMPLATE_ID || "";

if (!publicKey || !serviceId || !templateId) {
  console.warn(
    "[generate-config] Warning: one or more EmailJS environment variables are missing. " +
    "The contact form will not send emails until they are set in Vercel."
  );
}

const content = `// Auto-generated at build time — do not edit manually.
window._bridgeConfig = {
  emailjsPublicKey:  "${publicKey}",
  emailjsServiceId:  "${serviceId}",
  emailjsTemplateId: "${templateId}",
};
`;

const outPath = path.join(__dirname, "..", "config.local.js");
fs.writeFileSync(outPath, content, "utf8");
console.log("[generate-config] config.local.js written successfully.");
