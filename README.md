# ACM Officer Database - Backend
This is the backend repository for the ACM Officer Database

## Local Development

#### 1. Project Setup
1. Clone the repository and install the dependencies:
```bash
$ git clone https://github.com/acmutd/officer-database-backend.git
$ cd officer-database-backend
$ npm install # Or yarn install
```

#### 2. Firestore Database Credentials
> [!CAUTION]
> Do not ignore this step

1. Open your Firebase project settings
2. Go to the tab that says "Service accounts"
3. Select the **Node.js** option, then click on the bright blue button that says "Generate new private key" then click Generate key in the modal.
4. It'll download a file containing all the login credentials for the SDK, **move** the file to the top level directory of the repository and **rename** it to `firebase-creds.json`.

#### 3. Run the Backend
1. Start the development server
```bash
$ npm run dev
```

2. Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension
3. Open the `/tests` folder and select a CRUD test file (I separate them)
4. Above each operation should be a button that says "Send Request". Click it and it should work!