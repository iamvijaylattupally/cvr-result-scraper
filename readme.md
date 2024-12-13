# CVR Results Scraper API

Welcome to the **CVR Results Scraper API** documentation. This API allows users to retrieve student results from a CVR results page by providing a link to the page and a list of student roll numbers. The API scrapes the required information and returns it as a JSON response.

## 📘 **Table of Contents**
- [Introduction](#introduction)
- [API Endpoint](#api-endpoint)
- [Request Body](#request-body)
- [Response](#response)
- [Error Handling](#error-handling)
- [Example Usage](#example-usage)
- [Setup Instructions](#setup-instructions)

---

## 📚 **Introduction**
The **CVR Results Scraper API** is a Node.js service that leverages Puppeteer to scrape student results from a provided link. It captures essential details like roll number, name, subjects, grades, SGPA, and CGPA for each student listed in the roll numbers array.

> **Note:** This service interacts with live web pages, so it may take a few seconds to complete the process depending on the page's loading speed and the number of roll numbers provided.

---

## 🚀 **API Endpoint**
**POST** `/getresults`

This endpoint accepts a POST request with a JSON body containing the following required fields:

---

## 📩 **Request Body**
The request body must be in **JSON format** and should have the following structure:

```json
{
  "link": "<URL of the CVR results page>",
  "rollnumbers": ["<RollNumber1>", "<RollNumber2>", "<RollNumber3>"]
}
```

### 🔹 **Parameters**
| **Parameter** | **Type** | **Required** | **Description** |
|---------------|----------|--------------|------------------|
| `link`        | String   | ✅ Yes       | URL of the CVR results page where the results are displayed. Must be a valid URL starting with `http` or `https`. |
| `rollnumbers` | Array    | ✅ Yes       | Array of roll numbers for which results need to be fetched. Must be an array of strings. |

**Example Request Body**
```json
{
  "link": "https://example.com/results", 
  "rollnumbers": ["123456", "789012", "345678"]
}
```

---

## 📦 **Response**
If the request is successful, the API responds with a **200 OK** status and a JSON body containing the results for each roll number.

### 🔹 **Response Format**
```json
[
  {
    "rollNumber": "123456",
    "name": "John Doe",
    "subjects": [
      {"subject": "Mathematics", "grade": "A", "status": "Pass", "credits": 4},
      {"subject": "Physics", "grade": "B", "status": "Pass", "credits": 3}
    ],
    "sgpa": 8.75,
    "cgpa": 8.42
  },
  {
    "rollNumber": "789012",
    "name": "Jane Smith",
    "subjects": [
      {"subject": "Mathematics", "grade": "B", "status": "Pass", "credits": 4},
      {"subject": "Chemistry", "grade": "A", "status": "Pass", "credits": 3}
    ],
    "sgpa": 9.00,
    "cgpa": 8.89
  }
]
```

### 🔹 **Response Fields**
| **Field**        | **Type**  | **Description** |
|-----------------|-----------|-----------------|
| `rollNumber`     | String    | Roll number of the student. |
| `name`           | String    | Name of the student. |
| `subjects`       | Array     | List of subjects with details like name, grade, status, and credits. |
| `sgpa`           | Number    | Semester Grade Point Average. |
| `cgpa`           | Number    | Cumulative Grade Point Average. |

---

## ❌ **Error Handling**
If something goes wrong during the request, the API responds with an appropriate error message and status code.

| **Error Code** | **Message**                             | **Reason**                    |
|---------------|-----------------------------------------|--------------------------------|
| 400           | "Invalid or missing link in request body." | The `link` is not provided or is not a valid URL. |
| 400           | "Roll numbers are missing or not an array in request body." | The `rollnumbers` field is not an array or is missing. |
| 500           | "Failed to scrape results."             | An unexpected error occurred during scraping. |

**Example Error Response**
```json
{
  "error": "Roll numbers are missing or not an array in request body."
}
```

---

## 🛠️ **Example Usage**
### **cURL Example**
```bash
curl -X POST http://localhost:3030/getresults \
-H "Content-Type: application/json" \
-d '{ 
  "link": "https://example.com/results", 
  "rollnumbers": ["123456", "789012", "345678"] 
}'
```

### **JavaScript (Axios) Example**
```javascript
const axios = require('axios');

const data = {
  link: "https://example.com/results",
  rollnumbers: ["123456", "789012", "345678"]
};

axios.post('http://localhost:3030/getresults', data)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });
```

---

## 📦 **Setup Instructions**
### **1. Clone the repository**
```bash
git clone https://github.com/your-repo/cvr-results-scraper.git
cd cvr-results-scraper
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Start the server**
```bash
node server.js
```
> The server will be running on **http://localhost:3030**

### **4. Send API Requests**
Use the API with **Postman**, **cURL**, or any HTTP client to send requests to `http://localhost:3030/getresults`.

---

## 🔥 **Notes**
- The API uses Puppeteer to scrape information from a live page, so page load times can impact response time.
- The service closes the browser after collecting results, ensuring efficient memory usage.
- For larger lists of roll numbers, ensure you provide sufficient system resources and avoid multiple concurrent requests to prevent rate limits or blocking by the target site.

**Happy Scraping! 🚀**
