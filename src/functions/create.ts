import { db } from '../firebase'
import { validateOfficerData } from './helpers/validators'

const COLLECTION = 'officer'

export async function createOfficer(data: any) {
  const parsed = validateOfficerData(data)

  const officerRef = db.collection(COLLECTION)
  const docRef = officerRef.doc()

  await docRef.set(parsed)
  const snap = await docRef.get()
  return { id: snap.id, ...snap.data() }
}
