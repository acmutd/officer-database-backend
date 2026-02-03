import { http } from '@google-cloud/functions-framework';

import { createOfficer } from './functions/createOfficer';
import { getOfficer } from './functions/getOfficer';
import { getOfficers } from './functions/getOfficers';
import { updateOfficer } from './functions/updateOfficer';
import { deleteOfficer } from './functions/deleteOfficer';
import { uploadOfficerPhoto } from './functions/uploadOfficerPhoto';
import { uploadOfficerResume } from './functions/uploadOfficerResume';
import { getOfficerResume } from './functions/getOfficerResume';
import { archiveOfficer } from './functions/archiveOfficer';
import { unarchiveOfficer } from './functions/unarchiveOfficer';
import { getPublicOfficers } from './functions/getPublicOfficers';

http('createOfficer', createOfficer);
http('getOfficer', getOfficer);
http('getOfficers', getOfficers);
http('updateOfficer', updateOfficer);
http('deleteOfficer', deleteOfficer);
http('uploadOfficerPhoto', uploadOfficerPhoto);
http('uploadOfficerResume', uploadOfficerResume);
http('getOfficerResume', getOfficerResume);
http('archiveOfficer', archiveOfficer);
http('unarchiveOfficer', unarchiveOfficer);
http('getPublicOfficers', getPublicOfficers);

export { createOfficer, getOfficer, getOfficers, updateOfficer, deleteOfficer, uploadOfficerPhoto, uploadOfficerResume, getOfficerResume, archiveOfficer, unarchiveOfficer, getPublicOfficers };