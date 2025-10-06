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

#### 4. Testing
> [!TIP]
> This isn't needed to run the repository, but it's always good to run tests to make sure everything is working

1. Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension
2. Create a new file called `test.rest`
3. Paste this into the file:
```
### GET OFFICERS
GET http://localhost:8383/officers
```
Any tests written in the file should be formatted like that, with a title above each test. The extension will recognize the formatting and insert a "Send Request" button below the title, clicking it will run the test!