# Smart Debt Assistant – Inya + Google Sheets + SendGrid + Sentiment Analysis

## 🚀 Overview
Smart Debt Assistant is an AI-powered collections agent built on **Inya.ai**.  
It automates debt recovery workflows by:
- Personalized EMI reminders via SendGrid email templates
- Logging all call outcomes to Google Sheets
- Running sentiment analysis on customer remarks using Hugging Face API
- Providing compliance-friendly scripts and safe escalation flows

---

## 🛠️ Components

### 1. Inya.ai Agent
- Configured with **System Prompt + Disposition Prompt**
- Uses **Post-Call Triggers** for:
  - Logging dispositions → Google Sheets
  - Sending EMI reminder emails → SendGrid
  - Running sentiment analysis → Hugging Face

### 2. Google Apps Script (Dynamic API + Logger)
- `/apps_script/doGet.js` → Provides dynamic data to Inya (customer info).
- `/apps_script/doPost.js` → Logs call outcomes, runs Hugging Face sentiment analysis, appends to Google Sheets.

### 3. SendGrid
- Verified sender email (Single Sender Auth)
- Dynamic template (`d-xxxx...`) for EMI reminders
- Supports variables like `{{customer_name}}`, `{{loan_id}}`, `{{amount_due}}`, `{{due_date}}`, `{{next_action.url}}`

### 4. Hugging Face API
- Model: `distilbert-base-uncased-finetuned-sst-2-english`
- Used to classify sentiment → mapped as:
  - NEGATIVE → angry
  - POSITIVE → polite
  - otherwise → neutral

---

## ⚙️ Setup Instructions

### Google Apps Script
1. Open Google Apps Script
2. Paste code from `/apps_script/doGet.js` and `/apps_script/doPost.js`
3. Set script properties:
   - `HF_API_KEY` → Hugging Face API token
4. Deploy → Web App:
   - Execute as: Me
   - Access: Anyone with link

### SendGrid
1. Verify Single Sender
2. Create **Dynamic Template**
3. Insert HTML (see `/templates/emi_reminder.html`)
4. Copy template ID → use in Inya Email Action

### Inya.ai
1. Create agent → paste System Prompt
2. Add Actions:
   - `log_disposition` (POST to Apps Script doPost URL)
   - `send_emi_reminder_email` (SendGrid template)
3. Map variables (customer_name, loan_id, amount_due, due_date, bucket, customer_email, next_action.url)

---

## 📊 Example Google Sheets Log

| Timestamp   | Customer | Loan ID | Bucket  | Remark                | Intent   | Sentiment | Next Action      |
|-------------|----------|---------|---------|-----------------------|----------|-----------|------------------|
| 2025-09-30  | Ravi     | LN12345 | Bucket1 | I will not pay!       | dispute  | angry     | Escalation ticket|
| 2025-09-30  | Meera    | LN45678 | Pre-due | Sure, I’ll pay today. | pay_now  | polite    | Payment link sent|

---

## 🎯 Hackathon Wow Factor
- **Sentiment Analysis** adds emotional intelligence to debt recovery.
- Escalates angry disputes to human agents automatically.
- Provides dashboard-ready logs (bucket-wise + sentiment trends).

---

## 📂 Repo Structure
