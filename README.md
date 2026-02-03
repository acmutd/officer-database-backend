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
- `GET /getPublicOfficers` - Get public officers grouped by division
- `POST /createOfficer` - Create a new officer
- `PATCH /updateOfficer?id={id}` - Update an officer
- `DELETE /deleteOfficer?id={id}` - Delete an officer
- `POST /archiveOfficer?id={id}` - Archive an officer (sets `isActive` to false)
- `POST /unarchiveOfficer?id={id}` - Unarchive an officer (sets `isActive` to true)
- `POST /uploadOfficerPhoto` - Upload officer photo (multipart/form-data)
- `POST /uploadOfficerResume` - Upload officer resume (multipart/form-data)
- `GET /getOfficerResume?id={id}` - Get signed URL for officer resume

### Project Structure

```
officer-database-backend/
├── src/
│   ├── functions/          # Cloud Functions (CRUD operations)
│   │   ├── archiveOfficer.ts
│   │   ├── createOfficer.ts
│   │   ├── deleteOfficer.ts
│   │   ├── getOfficer.ts
│   │   ├── getOfficerResume.ts
│   │   ├── getOfficers.ts
│   │   ├── getPublicOfficers.ts
│   │   ├── index.ts
│   │   ├── unarchiveOfficer.ts
│   │   ├── updateOfficer.ts
│   │   ├── uploadOfficerPhoto.ts
│   │   └── uploadOfficerResume.ts
│   ├── helpers/            # Validation utilities
│   │   └── validators.ts
│   ├── types/              # TypeScript types and Zod schemas
│   │   └── officer.ts
│   ├── middleware.ts       # Request validation middleware
│   ├── firebase.ts         # Firebase Admin SDK initialization
│   └── index.ts            # Function exports
├── tests/                  # Test scripts
│   └── deploy.ts
├── dist/                   # Compiled JavaScript (generated)
├── firebase-creds.json     # Firebase credentials (not in git)
├── cloudbuild.yaml
├── package.json
├── tsconfig.json
├── API_DOCUMENTATION.md
└── README.md
```

### Environment Notes

- **Local:** Uses an Express server to run all functions simultaneously on a single port (8080 by default). Start the server with `npm run dev` to access all endpoints.
- **Production:** Serverless Cloud Functions deployed on Google Cloud Platform (GCP). Each function has its own endpoint URL.
- **Database:** Firestore database on Firebase with two collections: `officer` (current officers) and `archived` (archived officers)

### Local vs Production

| Environment | Server | URL Structure |
|-------------|--------|---------------|
| **Local** | Express server running all functions | `http://localhost:8080/ENDPOINT_NAME` |
| **Production** | Serverless Cloud Functions on GCP | `https://REGION-PROJECT.cloudfunctions.net/FUNCTION_NAME` |

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