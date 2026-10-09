# Nexora Technologies — Professional Static Company Website

A modern, responsive, and production-ready **static corporate website** for an enterprise cloud architecture and intelligent engineering company.

Built with **HTML5**, **CSS3**, **Vanilla JavaScript**, and **Bootstrap 5**, this project contains zero backend, database, or server runtime requirements. It is engineered to deploy instantly to **AWS S3 + CloudFront**, **GitHub Pages**, or **Netlify**.

---

## 🚀 Key Features

* **5 Fully Connected Pages**:
  * `index.html` — Corporate landing page with hero banner, service matrix, stats, featured careers, client testimonials, and trust badges.
  * `about.html` — Company background, mission & vision, core values, leadership profiles, and interactive timeline milestones.
  * `careers.html` — Interactive job search portal featuring instant text search, multi-facet filtering (Department, Job Type, Location, Experience), job card badges, and a detailed role specification modal.
  * `apply.html` — Candidate application form with drag-and-drop resume upload, strict file type (`.pdf`, `.doc`, `.docx`) and file size (`≤5MB`) validation, auto-population of selected roles, and clear static-demo confirmation.
  * `contact.html` — Corporate contact hubs (San Francisco HQ, Austin, London), validated inquiry form, office visiting guide with map visualization, and FAQ accordion.
* **Modern Design Aesthetics**:
  * Clean typography using Google Fonts (*Plus Jakarta Sans* and *Inter*).
  * Harmonious corporate slate and vibrant blue/cyan palette.
  * Glassmorphism navigation bar with blur and scroll shadow.
  * Mobile-first responsive layouts tested across mobile, tablet, and desktop viewports.
* **Static Architecture Compliance**:
  * Real-time client-side form validation.
  * Transparent notifications explaining static-site demo mode without misleading users into believing emails were sent to a non-existent server.
  * Zero build tools or compilation steps required—open and run directly.

---

## 📁 Directory Structure

```text
company-website/
├── index.html               # Home / Landing page
├── about.html               # About Us page
├── careers.html             # Careers listing & filter page
├── apply.html               # Job application form page
├── contact.html             # Contact Us & office hubs page
├── assets/
│   ├── images/
│   │   ├── logo.svg         # Primary corporate logo
│   │   ├── logo-white.svg   # Light logo for dark footer
│   │   └── favicon.svg      # Browser favicon
│   └── icons/
├── css/
│   └── style.css            # Custom CSS design system & utilities
├── js/
│   ├── main.js              # Header scroll, nav highlighting, footer date
│   ├── careers.js           # Sample job data, search, filtering & modal
│   ├── apply.js             # Form validation, file checks, auto-populate
│   └── contact.js           # Contact form validation & demo modal
└── README.md                # Deployment, architecture & testing guide
```

---

## 💻 How to Run Locally

Because this project uses standard web technologies with relative asset paths, you can run it in multiple ways:

### Option A: Python HTTP Server (Fastest, zero install on most OS)
Open terminal / PowerShell in the project directory:
```bash
# Python 3
python -m http.server 8000
```
Then visit [http://localhost:8000](http://localhost:8000) in your browser.

### Option B: Node.js (npx serve or live-server)
```bash
npx -y serve . -l 3000
```
Then visit [http://localhost:3000](http://localhost:3000).

### Option C: VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` and select **"Open with Live Server"**.

### Option D: Direct Browser Opening
Double-click `index.html` in your file explorer. All pages and relative links will function immediately.

---

## ☁️ Deployment Guide

### 1. Amazon S3 + CloudFront Static Hosting (Recommended)

#### Step 1: Create an S3 Bucket
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/) and navigate to **Amazon S3**.
2. Click **Create bucket**.
3. Bucket Name: e.g. `nexora-company-website-2026` (must be globally unique).
4. Region: Choose your preferred AWS region (e.g., `us-east-1`).
5. Object Ownership: **ACLs disabled (recommended)**.
6. Leave **Block all public access** enabled if using CloudFront with Origin Access Control (OAC).

#### Step 2: Upload Files
Upload all files and folders maintaining relative directory paths:
* `index.html`, `about.html`, `careers.html`, `apply.html`, `contact.html` in the root.
* `assets/`, `css/`, and `js/` folders with their respective contents.

#### Step 3: Configure Amazon CloudFront
1. Navigate to **CloudFront** in the AWS Console.
2. Click **Create distribution**.
3. **Origin domain**: Select your S3 bucket.
4. **Origin access**: Select **Origin Access Control (OAC)** and create a new control setting.
5. **Viewer protocol policy**: Select **Redirect HTTP to HTTPS**.
6. **Default root object**: Set to `index.html`.
7. Click **Create distribution**.
8. Copy the generated S3 bucket policy from CloudFront and apply it under the S3 bucket's **Permissions > Bucket policy** tab.
9. Under CloudFront **Error pages**, configure custom error responses:
   * HTTP error code: `404` -> Response page path: `/index.html` (or a custom 404 page) -> HTTP Response code: `200`.

Your website is now globally distributed via CloudFront edge locations with SSL/TLS encryption.

---

### 2. GitHub Pages Deployment

1. Initialize git in the folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of static company website"
   ```
2. Push to your GitHub repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repository settings:
   * Go to **Settings** > **Pages**.
   * Under **Build and deployment**, select **Source: Deploy from a branch**.
   * Choose branch: `main` and folder: `/ (root)`.
   * Click **Save**. Your site will be published at `https://<your-username>.github.io/<repo-name>/`.

---

### 3. Netlify Deployment

1. Drag and drop the `company-website/` directory into the [Netlify Drop](https://app.netlify.com/drop) dashboard.
2. Alternatively, connect your Git repository; leave build command blank and publish directory as `.`.

---

## 🔌 Connecting Form Services (Without Rebuilding Frontend)

Because this website operates as a pure static frontend, submissions are currently handled in demo mode with client validation. To connect live email notifications or CRM storage without rebuilding the UI, choose one of the following approaches:

### Option 1: AWS Serverless (API Gateway + Lambda + Amazon SES)
1. Deploy an AWS Lambda function that parses JSON payloads and uses `boto3` / `@aws-sdk/client-ses` to send an email to your team.
2. Create an **HTTP API** in **Amazon API Gateway** with CORS enabled for your domain.
3. In `js/apply.js` or `js/contact.js`, replace the `setTimeout` simulation with a standard `fetch`:
   ```javascript
   const response = await fetch("https://api-id.execute-api.us-east-1.amazonaws.com/submit", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(formData)
   });
   ```

### Option 2: Formspree / Web3Forms / FormKeep
Update the `<form>` opening tag in `contact.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <!-- Inputs remain identical -->
</form>
```

### Option 3: Netlify Forms
Add the `data-netlify="true"` attribute to the `<form>` element:
```html
<form name="job-application" method="POST" data-netlify="true" enctype="multipart/form-data">
  <!-- Netlify automatically captures form and file uploads -->
</form>
```

---

## 🧪 Testing & Quality Assurance Checklist

| Category | Test Item | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **Navigation** | All navbar links (`Home`, `About`, `Careers`, `Apply`, `Contact`) | Navigate correctly without broken links or 404s | Pass |
| **Navigation** | Active page highlighting | Nav link for the active page receives `.active` class | Pass |
| **Careers** | Search input | Filters jobs in real time by title, skills, description | Pass |
| **Careers** | Dropdown filters | Filters by Department, Job Type, Location, Experience | Pass |
| **Careers** | Empty state | Shows helpful message and "Clear All Filters" button | Pass |
| **Careers** | "View Details" modal | Opens pop-up with role responsibilities, qualifications, and perks | Pass |
| **Careers -> Apply** | "Apply Now" button click | Navigates to `apply.html?job=...` and automatically selects position | Pass |
| **Application Form** | Required field validation | Flags empty required fields with clear red error feedback | Pass |
| **Application Form** | Email & Phone checks | Validates email syntax and telephone formatting | Pass |
| **Application Form** | Resume file extension | Rejects unsupported extensions (e.g. `.exe`, `.png`); allows `.pdf`, `.doc`, `.docx` | Pass |
| **Application Form** | Resume file size | Rejects files > 5.0 MB with error message; displays size if valid | Pass |
| **Application Form** | Reset Form button | Clears all fields and resets validation error states | Pass |
| **Application Form** | Submission Demo Modal | Shows candidate summary with static-site architecture disclaimer | Pass |
| **Contact Form** | Client-side validation | Requires Name, Email, Subject, and minimum 10 characters for Message | Pass |
| **Responsive** | Mobile viewport (< 576px) | Collapsible burger menu, single-column cards, touch-friendly tap targets | Pass |
| **Console** | Developer Console inspection | Zero syntax errors, missing asset 404s, or uncaught exceptions | Pass |

---

## 🎨 Branding & Customization

To rebrand this template for your own organization:
1. **Logo**: Replace `assets/images/logo.svg` and `assets/images/logo-white.svg` with your SVG or PNG logos.
2. **Company Name**: Search & replace `Nexora Technologies` with your business name.
3. **Contact Details**: Update the email, phone numbers, and address in `index.html`, `about.html`, and `contact.html`.
4. **Job Listings**: Modify the `sampleJobs` array in `js/careers.js` to add, update, or remove positions.
5. **Theme Colors**: Modify CSS variables in `css/style.css` (e.g., `--primary: #2563eb;`, `--secondary: #06b6d4;`).

---

## 📄 License
This project is open-source and free to adapt for personal, educational, or commercial purposes.
