# ACM Officer Database - Backend
This is the backend repository for the ACM Officer Database

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase Admin SDK credentials
- Google Cloud SDK (for deployment)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/acmutd/officer-database-backend.git
   cd officer-database-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase credentials**

   > [!CAUTION]
   > Never commit `firebase-creds.json` to version control!

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to **Project Settings** → **Service Accounts**
   - Click **Generate New Private Key**
   - Save the downloaded file as `firebase-creds.json` in the project root

4. **Build the TypeScript code**
   ```bash
   npm run build
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:8080`

### Development Workflow

**Build TypeScript:**
```bash
npm run build
```

**Run locally with Functions Framework:**
```bash
npm run dev
```

**Test the API:**

More to come :)

### Project Structure

```
officer-database-backend/
├── src/
│   ├── functions/          # Cloud Functions (CRUD operations)
│   │   ├── createOfficer.ts
│   │   ├── getOfficers.ts
│   │   ├── getOfficer.ts
│   │   ├── updateOfficer.ts
│   │   └── deleteOfficer.ts
│   ├── helpers/            # Validation utilities
│   │   └── validators.ts
│   ├── types/              # TypeScript types and Zod schemas
│   │   └── officer.ts
│   ├── middleware.ts       # Request validation middleware
│   ├── firebase.ts         # Firebase Admin SDK initialization
│   └── index.ts            # Function exports
├── tests/                  # Test scripts
│   ├── api-test.js
│   └── validator-test.js
├── dist/                   # Compiled JavaScript (generated)
├── firebase-creds.json     # Firebase credentials (not in git)
├── package.json
├── tsconfig.json
└── README.md
```

### Environment Notes

- **Local:** Uses Functions Framework to simulate Cloud Functions locally
- **Production:** Deployed as individual Google Cloud Functions
- **Database:** Firestore collection `officer`

### Troubleshooting

**"Cannot find module" errors:**
- Run `npm run build` to compile TypeScript

**Firebase authentication errors:**
- Verify `firebase-creds.json` exists in project root
- Check that the service account has Firestore permissions

**Port already in use:**
- Change the port in `package.json` dev script or kill the process using port 8080

**Type errors:**
- Run `npm install` to ensure all `@types/*` packages are installed


## API Routes

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