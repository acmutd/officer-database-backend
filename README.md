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

> [!TIP]
> The Functions Framework runs **one function at a time**. By default, `npm run dev` runs `getOfficers`.

> [!TIP]
> You may want to disable the auth and CORS checkers by removing it from the function you want to run, this way you can open it in your browser and not get blocked

**To test different functions:**

Edit the `dev` script in `package.json` and change the `--target` parameter:

```json
"dev": "npm run build && functions-framework --target=FUNCTION_NAME --source=dist --port=8080"
```

Replace `FUNCTION_NAME` with:
- `getOfficers` - GET all officers
- `getOfficer` - GET single officer by ID (query param `?id=...`)
- `createOfficer` - POST create new officer
- `updateOfficer` - PATCH update officer (query param `?id=...`)
- `deleteOfficer` - DELETE officer (query param `?id=...`)

Then restart the dev server and test at `http://localhost:8080`

**Example workflow:**
1. Change target to `createOfficer` in package.json
2. Run `npm run dev`
3. Send POST request to `http://localhost:8080` with officer data
4. Stop server, change target to `getOfficers`
5. Run `npm run dev` again
6. Visit `http://localhost:8080` to see all officers

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

- **Local:** Uses Functions Framework to simulate Cloud Functions. Each function runs independently at `http://localhost:8080` (change `--target` in package.json to switch functions)
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