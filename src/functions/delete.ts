import { db } from '../firebase'

const COLLECTION = 'officer'

export async function deleteOfficer(id: string) {
  const officerRef = db.collection(COLLECTION).doc(id)
  const doc = await officerRef.get()
  if (!doc.exists) return null
  await officerRef.delete()

  return { id: doc.id, ...doc.data() }
}
