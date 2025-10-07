import { db } from '../firebase'
import { validateOfficerData } from './helpers/validators'

const COLLECTION = 'officer'

export async function createOfficer(data: any) {
  const parsed = validateOfficerData(data)

  const officerRef = db.collection(COLLECTION)
  const docRef = officerRef.doc()
  const UID = docRef.id
  const dataWithUID = { UID, ...parsed }

  await docRef.set(dataWithUID)
  const snap = await docRef.get()
  return { id: snap.id, ...snap.data() }
}
