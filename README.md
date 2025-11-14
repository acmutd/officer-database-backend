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