import { http } from '@google-cloud/functions-framework';

import { createOfficer } from './functions/createOfficer';
import { getOfficer } from './functions/getOfficer';
import { getOfficers } from './functions/getOfficers';
import { updateOfficer } from './functions/updateOfficer';
import { deleteOfficer } from './functions/deleteOfficer';
import { uploadOfficerPhoto } from './functions/uploadOfficerPhoto';

http('createOfficer', createOfficer);
http('getOfficer', getOfficer);
http('getOfficers', getOfficers);
http('updateOfficer', updateOfficer);
http('deleteOfficer', deleteOfficer);
http('uploadOfficerPhoto', uploadOfficerPhoto);

export { createOfficer, getOfficer, getOfficers, updateOfficer, deleteOfficer, uploadOfficerPhoto };