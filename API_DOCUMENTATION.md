# API Documentation
This page will explain the intricacies of my wonderful creation, the ACM Officer Database CRUD operations

### Get All Officers

```http
GET /getOfficers
```

**Description:** Retrieves officers from the database. Use `?archived=true` to get archived (past) officers instead.

**Query Parameters:**
- `archived` (optional): Set to `true` to retrieve from the `archived` collection instead of `officer`

**Response:** `200 OK`
```json
[
  {
    "id": "usdf98n9sdf87s897fasd98n",
    "firstName": "Bobby",
    "lastName": "Balls",
    "netId": "DAL676767",
    "photo": {
      "url": "https://storage.googleapis.com/acm-officer-database.firebasestorage.app/officers/usdf98n9sdf87s897fasd98n",
      "lastUpdatedAt": "2025-12-01T10:30:00.000Z"
    },
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
GET /getOfficer?id={officerId}
```

**Description:** Retrieves a specific officer by their ID. Use `?archived=true` to look in the archived collection.

**Query Parameters:**
- `id` (required): The officer's unique identifier
- `archived` (optional): Set to `true` to search in the `archived` collection

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "firstName": "Bobby",
  "lastName": "Balls",
  "photo": {
    "url": "https://storage.googleapis.com/acm-officer-database.firebasestorage.app/officers/usdf98n9sdf87s897fasd98n",
    "lastUpdatedAt": "2025-12-01T10:30:00.000Z"
  },
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
POST /createOfficer
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
PATCH /updateOfficer?id={officerId}
```

**Description:** Updates specific fields of an existing officer. Only include the fields you want to update. Use `?archived=true` to update an archived officer.

**Query Parameters:**
- `id` (required): The officer's unique identifier
- `archived` (optional): Set to `true` to update in the `archived` collection

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
DELETE /deleteOfficer?id={officerId}
```

**Description:** Deletes an officer from the database. Use `?archived=true` to delete from the archived collection.

**Query Parameters:**
- `id` (required): The officer's unique identifier
- `archived` (optional): Set to `true` to delete from the `archived` collection

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

### Upload Officer Photo

```http
POST /uploadOfficerPhoto
```

**Description:** Uploads a photo for an existing officer using multipart/form-data.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `id` (required): The officer's unique identifier (text field)
- `file` (required): The image file to upload (file field)

**Supported File Types:**
- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

**Example using cURL:**
```bash
curl -X POST http://localhost:8080/uploadOfficerPhoto \
  -F "id=usdf98n9sdf87s897fasd98n" \
  -F "file=@/path/to/photo.jpg"
```

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "photo": {
    "url": "https://storage.googleapis.com/acm-officer-database.firebasestorage.app/officers/usdf98n9sdf87s897fasd98n",
    "lastUpdatedAt": "2025-12-01T10:30:00.000Z"
  }
}
```

**Stored in Database:**
- Photos are stored in Firestore under `photo` object with `url` and `lastUpdatedAt` fields
- The photo URL is permanent and public

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid content type
```json
{
  "error": "Content-Type must be multipart/form-data"
}
```
```json
{
  "error": "id field is required"
}
```
```json
{
  "error": "file upload is required"
}
```
```json
{
  "error": "File size exceeds 10MB limit"
}
```
- `404 Not Found`: Officer does not exist
```json
{
  "error": "Officer not found"
}
```
- `405 Method Not Allowed`: Non-POST request
```json
{
  "error": "Method Not Allowed"
}
```

---

## Error Handling

### Upload Officer Resume

```http
POST /uploadOfficerResume
```

**Description:** Uploads a PDF resume for an existing officer using multipart/form-data.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `id` (required): The officer's unique identifier (text field)
- `file` (required): The resume file to upload (file field)

**Supported File Types:**
- `application/pdf`

**Max File Size:** 5MB

**Example using cURL:**
```bash
curl -X POST http://localhost:8080/uploadOfficerResume \
  -F "id=usdf98n9sdf87s897fasd98n" \
  -F "file=@/path/to/resume.pdf;type=application/pdf"
```

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "resumeUrl": "https://storage.googleapis.com/acm-officer-database.firebasestorage.app/resumes/usdf98n9sdf87s897fasd98n?X-Goog-Algorithm=GOOG4-RSA-SHA256&..."
}
```

**Important:**
- Resumes are NOT stored in the Firestore database
- A fresh signed URL is generated on-demand with each upload
- Signed URLs are valid for 3 days
- Resumes are stored privately in Firebase Storage (not publicly accessible)

**Error Responses:**
- `400 Bad Request`: Missing required fields, invalid content type, or file too large
```json
{
  "error": "Content-Type must be multipart/form-data"
}
```
```json
{
  "error": "id field is required"
}
```
```json
{
  "error": "file upload is required"
}
```
```json
{
  "error": "File size exceeds 5MB limit"
}
```
- `404 Not Found`: Officer does not exist
```json
{
  "error": "Officer not found"
}
```
- `405 Method Not Allowed`: Non-POST request
```json
{
  "error": "Method Not Allowed"
}
```

---

### Get Officer Resume (Signed URL)

```http
GET /getOfficerResume?id={officerId}
```

**Description:** Generates and returns a fresh signed URL for an officer's resume. This endpoint should be called whenever you need access to a resume file.

**Query Parameters:**
- `id` (required): The officer's unique identifier

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "resumeUrl": "https://storage.googleapis.com/acm-officer-database.firebasestorage.app/resumes/usdf98n9sdf87s897fasd98n?X-Goog-Algorithm=GOOG4-RSA-SHA256&..."
}
```

**Important:**
- Returns a fresh signed URL valid for 3 days
- Call this endpoint each time you need to access the resume
- Signed URLs are single-use and time-limited for security
- If no resume is stored for the officer, returns 404

**Error Responses:**
- `400 Bad Request`: Missing officer ID
```json
{
  "error": "Officer ID is required"
}
```
- `404 Not Found`: Resume not found for officer
```json
{
  "error": "Resume not found for this officer"
}
```
- `500 Internal Server Error`: Server error
```json
{
  "error": "Server error"
}
```

---

## Summary of Storage Approach

### Photos
- **Stored in:** Firebase Storage + Firestore database
- **Access:** Public permanent URLs
- **Stored in DB:** Yes, as nested object with `photo.url` and `photo.lastUpdatedAt`
- **Expiration:** Never expires

### Resumes
- **Stored in:** Firebase Storage only (private)
- **Access:** Signed URLs (3-day expiration)
- **Stored in DB:** No
- **How to access:** Call `/getOfficerResume` endpoint to get a fresh signed URL

---

### Archive Officer

```http
POST /archiveOfficer?id={officerId}
```

**Description:** Moves an officer document from `officer` to `archived` collection. Does not delete data or modify the `isActive` status.

**Query Parameters:**
- `id` (required): The officer's unique identifier

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "firstName": "Bobby",
  "lastName": "Balls",
  "isActive": true,
  "...": "..."
}
```

**Important:**
- The officer is moved to the `archived` collection
- The `isActive` status remains unchanged during archiving

**Error Responses:**
- `400 Bad Request`: Missing officer ID
- `404 Not Found`: Officer not found in active collection
- `409 Conflict`: Officer already archived

---

### Unarchive Officer

```http
POST /unarchiveOfficer?id={officerId}
```

**Description:** Moves an officer document from `archived` to `officer` collection. Does not delete data or modify the `isActive` status.

**Query Parameters:**
- `id` (required): The officer's unique identifier

**Response:** `200 OK`
```json
{
  "id": "usdf98n9sdf87s897fasd98n",
  "firstName": "Bobby",
  "lastName": "Balls",
  "isActive": true,
  "...": "..."
}
```

**Important:**
- The officer is moved back to the `officer` collection
- The `isActive` status remains unchanged during unarchiving

**Error Responses:**
- `400 Bad Request`: Missing officer ID
- `404 Not Found`: Archived officer not found
- `409 Conflict`: Officer already active

---