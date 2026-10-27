# The Bridge Initiative — Official Website

A responsive, multi-page static organizational website built with HTML5, Tailwind CSS 4.3, and vanilla JavaScript. It is not a web app and has no backend, database, or authentication. Form submissions are handled via a Google Apps Script web app (Google Sheets) for community and volunteer forms, and via EmailJS for the contact form.

## Requirements

- Node.js 20+ recommended
- npm
- Internet access during development if using Google Fonts and the current remote photography URLs

## Pages

- `index.html` — Home (hero carousel, about preview, focus areas, impact, conference, get involved, stories, contact, privacy)
- `about.html` — About Us (who we are, story, mission/vision/values, communities we serve, leadership)
- `work.html` — Our Work (approach, programmes, participation pathways)
- `impact.html` — Our Impact (measured outcomes, project highlights, community stories, milestones)
- `conference.html` — Digital for Impact 1.0 (hero, countdown, overview, objectives, audience, topics, speakers, programme, FAQ, partners)
- `join.html` — Join Our Community (community interest form → Google Sheets)
- `volunteer.html` — Volunteer (roles, process, volunteer interest form → Google Sheets, FAQ)
- `news.html` — News & Updates (featured article, grid, empty state)
- `contact.html` — Contact Us (contact details, contact form → EmailJS, privacy)

## Shared assets

- `src/input.css` — Tailwind source with brand tokens and component styles
- `src/output.css` — Generated stylesheet (run `npm run build:css`)
- `src/main.js` — Homepage interactions (carousel, mobile nav, reveal, back-to-top)
- `src/page.js` — Shared script for all inner pages (mobile nav, active nav state, reveal, back-to-top, FAQ accordion, countdown)
- `form-handler.js` — Form submission logic (Google Sheets + EmailJS)
- `config.local.js` — EmailJS credentials (git-ignored; see `config.example.js`)
- `scripts/generate-config.js` — Vercel build step to generate `config.local.js` from env vars
- `google-sheet-apps-script.js` — Apps Script code to paste into your Google Apps Script project

## Run locally

```bash
npm install
npm run dev
```

The `dev` command compiles Tailwind CSS and watches for changes. Open `index.html` with a local static server (for example, VS Code Live Server) for the best experience. For a one-time optimized stylesheet build, run:

```bash
npm run build:css
```

The generated stylesheet is `src/output.css`.

> Tailwind CSS 4.3 is requested by the project brief and specified in `package.json`. If npm reports that this exact version is not published in your registry, check the currently published v4 release and update both Tailwind package versions together.

## Deploy

After running `npm install` and `npm run build:css`, deploy the project folder as a static site to any static hosting provider. No server-side runtime is required. Include `index.html`, `src/output.css`, `src/main.js`, and the `assets` directory.

## Update the website

- **Logo:** replace the temporary mark in `index.html` and update `assets/logo/favicon.svg`.
- **Brand colors and fonts:** edit the `@theme` block in `src/input.css`. Colors currently use deep navy, teal, and lime as an editable starting palette.
- **Photography:** replace the Unsplash image URLs in `index.html` with approved, licensed assets. Keep meaningful alt text. The current images are remote editorial placeholders and need to be reviewed before launch.
- **Conference details:** edit the featured-event copy in `index.html` and the `slidesData` array in `src/main.js`. Confirm details with event organizers before publication.
- **Mission, vision, values, programmes, impact and stories:** replace clearly labelled draft copy/placeholders with approved statements and verified material.
- **Contact and social media:** the supplied project context includes `thebridgeinitiative6@gmail.com`. Add phone numbers, official social links, or an office address only after confirmation.
- **Partners:** verify the partner names and obtain permission before adding logos.

## Google Sheets submission setup

The website is configured to submit form entries to a Google Apps Script web app that writes rows to a Google Sheet. This is the easiest way to collect real submissions from a static site without a backend server.

### 1) Create the Google Sheet

1. Open Google Sheets.
2. Create a sheet named `Form Responses`.
3. Add the columns you want to capture, for example:
   - `formName`
   - `submittedAt`
   - `name`
   - `email`
   - `phone`
   - `organization`
   - `interest`
   - `contribution`
   - `message`
   - `consent`
   - `role`
   - `availability`
   - `skills`
   - `motivation`
   - `subject`

### 2) Create the Apps Script

Use the script in `google-sheet-apps-script.js` and paste it into Google Apps Script.

1. Open `script.google.com`.
2. Create a new Apps Script project.
3. Paste the code from `google-sheet-apps-script.js`.
4. Save the project and deploy it as a Web App.
5. Set access to `Anyone` or `Anyone with Google account` depending on your requirements.
6. Copy the generated deployment URL.

### 3) Connect it to this website

Update the `GOOGLE_SHEET_WEB_APP_URL` value in `src/main.js` with the deployment URL.

Example:

```js
const GOOGLE_SHEET_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbx.../exec";
```

### 4) Publish and test

- Submit a test form from the site.
- Check the Google Sheet for a new row.
- Confirm that the success message appears and that validation still blocks incomplete entries.

Do not place the Apps Script URL in a public repository if it should stay private. Use the deployment URL only in the production site.

## Accessibility and behavior

- Responsive navigation with an accessible toggle.
- Keyboard-operable carousel controls, slide indicators, and pause/play control.
- Carousel pauses when focused or hovered and does not autoplay when reduced motion is preferred.
- Swipe support on touch devices.
- Scroll-reveal effects with a reduced-motion fallback.
- Labelled form fields, inline validation, live status announcements, and visible focus.
- Back-to-top control and dynamic copyright year.

## Pre-launch checklist

- [ ] Replace temporary logo with the official logo.
- [ ] Approve mission, vision, values, and program descriptions.
- [ ] Confirm event details and partner branding.
- [ ] Replace/review remote photos and ensure usage rights.
- [ ] Add verified social links.
- [ ] Approve privacy notice.
- [ ] Connect forms to an authorized destination and verify the live submission workflow.
- [ ] Run `npm run build:css` and test desktop, tablet, and mobile layouts.
