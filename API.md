# ACM Officer Database - Backend
This is the backend repository for the ACM Officer Database

## Local Development

Base URL: Your Google Cloud Functions URL

All endpoints require JSON request bodies where applicable and return JSON responses.

### Get All Officers

```http
GET /officers
```

**Description:** Retrieves all officers from the database.

**Response:** `200 OK`
```json
[
  {
    "id": "usdf98n9sdf87s897fasd98n",
    "firstName": "Bobby",
    "lastName": "Balls",
    "netId": "DAL676767",
    "resume": null,
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/bobbyballs",
      "github": "https://github.com/bobbyballs",
      "personalEmail": "bobbyballs@gmail.com"
    },
    "creditStanding": "Freshman",
    "yearStanding": "Freshman",
    "expectedGrad": {
      "term": "Spring",
      "year": 2029
    },
    "internships": [],
    "research": [],
    "joinDate": {
      "term": "Fall",
      "year": 2025
    },
    "roles": [
      {
        "title": "Development Officer",
        "division": "Development",
        "level": 1,
        "startDate": {
          "term": "Fall",
          "year": 2025
        },
        "endDate": null
      }
    ],
    "accessLevel": 1,
    "isActive": true
  }
]
```

---

### Get Single Officer

```http
GET /officers?id={officerId}
```

**Description:** Retrieves a specific officer by their ID.

**Query Parameters:**
- `id` (required): The officer's unique identifier

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "firstName": "Bobby",
  "lastName": "Balls",
  ...
}
```

**Error Responses:**
- `404 Not Found`: Officer does not exist
```json
{
  "error": "Officer not found"
}
```

---

### Create Officer

```http
POST /officers
```

**Description:** Creates a new officer in the database.

**Request Body:** (all fields required except optional ones noted)
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "firstName": "Bobby",
  "lastName": "Balls",
  "netId": "BBL420",
  "resume": "https://bobbyballs.com/resume.pdf",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/bobbyballs",
    "github": "https://github.com/bobbyballs",
    "personalEmail": "bobbyballs@gmail.com"
  },
  "creditStanding": "Freshman",
  "yearStanding": "Freshman",
  "expectedGrad": {
    "term": "Spring",
    "year": 2029
  },
  "internships": [
    {
      "title": "Software Engineer Intern",
      "company": "Meta",
      "startDate": "2025-05-01",
      "endDate": "2025-08-01"
    }
  ],
  "research": [
    {
      "title": "AI Ethics Research",
      "lab": "Computer Science Lab",
      "principalInvestigator": ["Dr. Bobby Sr."],
      "startDate": "2025-01-01",
      "endDate": "2025-12-01"
    }
  ],
  "joinDate": {
    "term": "Fall",
    "year": 2025
  },
  "roles": [
    {
      "title": "Development Officer",
      "division": "Development",
      "level": 1,
      "startDate": {
        "term": "Fall",
        "year": 2025
      },
      "endDate": null
    }
  ],
  "accessLevel": 1,
  "isActive": true
}
```

**Field Constraints:**
- `id`: Unique string identifier
- `creditStanding` / `yearStanding`: `"Freshman"` | `"Sophomore"` | `"Junior"` | `"Senior"` | `"Graduate"` | `"Alumni"`
- `term`: `"Fall"` | `"Spring"` | `"Summer"`
- `year`: Integer >= 2020
- `division`: `"Media"` | `"Research"` | `"Development"` | `"Projects"` | `"Education"` | `"Executive"` | `"Community"` | `"HackUTD"` | `"Industry"`
- `level`: Integer 1-3 (1 = Officer, 2 = Director, 3 = Executive)
- `accessLevel`: Integer 1-3
- `socialLinks`: All fields optional but must be valid URLs/emails if provided
- `endDate`: Can be `null` for current/ongoing roles
- `resume`, `internships`, `research`: Optional fields

**Response:** `201 Created`
```json
{
  "firstName": "Bobby",
  "lastName": "Balls",
  ...
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
```json
{
  "error": "Validation failed",
  "details": {
    "fieldErrors": {
      "firstName": ["Required"]
    }
  }
}
```

---

### Update Officer

```http
PATCH /officers?id={officerId}
```

**Description:** Updates specific fields of an existing officer. Only include the fields you want to update.

**Query Parameters:**
- `id` (required): The officer's unique identifier

**Request Body:** (partial update - include only fields to change)
```json
{
  "firstName": "Bobby",
  "accessLevel": 3,
  "roles": [
    {
      "title": "President",
      "division": "Executive",
      "level": 3,
      "startDate": {
        "term": "Spring",
        "year": 2026
      },
      "endDate": null
    }
  ]
}
```

**Note:** When updating nested objects like `roles`, `internships`, or `research`, you must provide the complete array with all items (not just the changed ones).

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "firstName": "Bobby",
  "lastName": "Balls",
  "accessLevel": 3,
  ...
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID or validation failed
- `404 Not Found`: Officer does not exist

---

### Delete Officer

```http
DELETE /officers?id={officerId}
```

**Description:** Deletes an officer from the database.

**Query Parameters:**
- `id` (required): The officer's unique identifier

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "firstName": "Bobby",
  "lastName": "Balls",
  ...
}
```

**Error Responses:**
- `404 Not Found`: Officer does not exist

---

## Error Handling

All endpoints may return the following error responses:

**`400 Bad Request`** - Validation error or invalid request
```json
{
  "error": "Validation failed",
  "details": { ... }
}
```

**`404 Not Found`** - Resource not found
```json
{
  "error": "Officer not found"
}
```

**`500 Internal Server Error`** - Server error
```json
{
  "error": "Failed to [operation] officer"
}
```

##