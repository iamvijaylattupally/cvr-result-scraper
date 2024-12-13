
# CVR Results Scraper API Documentation

## **Table of Contents**
1. [Introduction](#introduction)
2. [API Endpoint](#api-endpoint)
3. [Request Body](#request-body)
4. [Response](#response)
5. [Error Handling](#error-handling)
6. [Bypassing Cloudflare](#bypassing-cloudflare)
7. [Local Setup Instructions](#local-setup-instructions)
8. [License](#license)

---

## **Introduction**
The **CVR Results Scraper API** allows users to extract student results from the CVR results page by providing a URL to the page and a list of roll numbers. The API returns a detailed JSON response containing information such as student roll number, name, subject details, SGPA, and CGPA.

---

## **API Endpoint**

**POST** `/getresults`

### **Request Body**
The request should be sent as a JSON object with the following properties:

| Field         | Type    | Required | Description                                |
|---------------|---------|----------|--------------------------------------------|
| `link`        | string  | Yes      | The URL to the CVR results page. Must be a valid URL. |
| `rollnumbers` | array   | Yes      | A list of roll numbers to be processed.    |

#### **Example Request**
```json
{
  "link": "https://example.com/results-page",
  "rollnumbers": ["20BCE1234", "20BCE5678", "20BCE9123"]
}
```

---

## **Response**
The response will be a JSON array containing the result for each roll number. Each result contains the following fields:

| Field         | Type   | Description                                   |
|---------------|--------|-----------------------------------------------|
| `rollNumber`  | string | The roll number of the student.              |
| `name`        | string | The name of the student.                     |
| `subjects`    | array  | An array of subject details.                 |
| `sgpa`        | float  | The SGPA of the student.                     |
| `cgpa`        | float  | The CGPA of the student.                     |

Each entry in the `subjects` array will have the following structure:

| Field         | Type   | Description                                |
|---------------|--------|--------------------------------------------|
| `subject`     | string | The name of the subject.                   |
| `grade`       | string | The grade received in the subject.        |
| `status`      | string | The pass/fail status of the subject.      |
| `credits`     | int    | The number of credits for the subject.    |

#### **Example Response**
```json
[
  {
    "rollNumber": "20BCE1234",
    "name": "John Doe",
    "subjects": [
      { "subject": "Mathematics", "grade": "A", "status": "Pass", "credits": 4 },
      { "subject": "Physics", "grade": "B", "status": "Pass", "credits": 3 }
    ],
    "sgpa": 8.5,
    "cgpa": 8.7
  },
  {
    "rollNumber": "20BCE5678",
    "name": "Jane Doe",
    "subjects": [
      { "subject": "Mathematics", "grade": "B", "status": "Pass", "credits": 4 },
      { "subject": "Physics", "grade": "A", "status": "Pass", "credits": 3 }
    ],
    "sgpa": 9.0,
    "cgpa": 8.8
  }
]
```

---

## **Error Handling**
The API returns error responses in the following scenarios:

| Status Code | Description                                  |
|-------------|----------------------------------------------|
| 400         | Invalid or missing `link` or `rollnumbers`.  |
| 500         | Server error or scraping issue.              |

---

## **Bypassing Cloudflare**
The API uses **puppeteer-real-browser** to handle dynamic content and bypass Cloudflare's anti-bot protection. Key techniques used to bypass Cloudflare include:

1. **Using a Real Browser Instance**: 
   - The API establishes a real browser session using Puppeteer. By using a real browser (not headless), it mimics actual user behavior.

2. **Handling JavaScript Challenges**:
   - Cloudflare often presents JavaScript challenges. The **puppeteer-real-browser** library helps solve these challenges by allowing the browser to execute JavaScript naturally.

3. **Waiting for Elements and Delays**:
   - Custom delays are used to wait for elements on the page to load, allowing Cloudflare scripts to run.

4. **Automatic Turnstile Handling**:
   - The `turnstile: true` option ensures that any challenges related to Turnstile CAPTCHA are automatically handled.

5. **Custom Headers and User Agents**:
   - Puppeteer can be configured to use custom headers and user agents to avoid being flagged as a bot.

6. **Waiting for Dynamic Content**:
   - The scraper waits for specific elements to load (like input fields and buttons) before interacting with the page, ensuring all scripts from Cloudflare have been executed.

**Note:** These techniques help in bypassing basic Cloudflare protection, but advanced bot protection may require further tuning, like using proxies, rotating IPs, or more sophisticated headless browser techniques.

---

## **Local Setup Instructions**
1. Install **Node.js** and **npm**.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   node server.js
   //or
   npm run start 
   ```
4. The API will be available at `http://localhost:3030/getresults`.

---

## **License**
This API is licensed under the MIT License. Please follow ethical practices and use the scraper only for educational or authorized purposes.
