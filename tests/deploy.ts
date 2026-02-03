import express from 'express';

import {
  createOfficer,
  deleteOfficer,
  getOfficer,
  getOfficerResume,
  getOfficers,
  updateOfficer,
  uploadOfficerPhoto,
  uploadOfficerResume,
  archiveOfficer,
  unarchiveOfficer,
  getPublicOfficers
} from '../src/functions';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const handlers: Record<string, express.RequestHandler> = {
  createOfficer,
  deleteOfficer,
  getOfficer,
  getOfficerResume,
  getOfficers,
  updateOfficer,
  uploadOfficerPhoto,
  uploadOfficerResume,
  archiveOfficer,
  unarchiveOfficer,
  getPublicOfficers
};

Object.entries(handlers).forEach(([name, handler]) => {
  app.all(`/${name}`, handler);
});

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`Local functions running on http://localhost:${port}`);
  console.log('Endpoints:', Object.keys(handlers).map((name) => `/${name}`).join(', '));
});