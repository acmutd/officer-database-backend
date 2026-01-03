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

This starts a local Express server on `http://localhost:8080` that runs all endpoints simultaneously. No need to select or run individual functions—just start the server and call any endpoint.

**Available endpoints:**
- `GET /getOfficers` - Retrieve all officers
- `GET /getOfficer?id={id}` - Get a single officer by ID
- `POST /createOfficer` - Create a new officer
- `PATCH /updateOfficer?id={id}` - Update an officer
- `DELETE /deleteOfficer?id={id}` - Delete an officer
- `POST /archiveOfficer?id={id}` - Archive an officer (sets `isActive` to false)
- `POST /unarchiveOfficer?id={id}` - Unarchive an officer (sets `isActive` to true)
- `POST /uploadOfficerPhoto` - Upload officer photo (multipart/form-data)
- `POST /uploadOfficerResume` - Upload officer resume (multipart/form-data)
- `GET /getOfficerResume?id={id}` - Get signed URL for officer resume

**Note:** Auth is disabled locally for convenience. All requests will succeed if the server is running.

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

- **Local:** Uses Functions Framework to simulate Cloud Functions. Each function runs independently at `http://localhost:8080` (use `npm run dev:FUNCTION_NAME` to run a specific function)
- **Production:** Each function is deployed separately with its own URL. All functions are accessible via their individual Cloud Functions endpoints.
- **Database:** Firestore collection `officer`

### Local vs Production

| Environment | Routing | URL Structure |
|-------------|---------|---------------|
| **Local** | One function at a time on port 8080 | `http://localhost:8080` (function determined by `--target` flag) |
| **Production** | Each function has its own endpoint | `https://REGION-PROJECT.cloudfunctions.net/FUNCTION_NAME` |

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