import { db } from '../firebase'

const COLLECTION = 'officer'

export async function listOfficers() {
  const officerRef = db.collection(COLLECTION)
  const snapshot = await officerRef.get()
  if (snapshot.empty) return []

  const officers: any[] = []
  snapshot.forEach((d) => {
    officers.push({ id: d.id, ...d.data() })
  })
  return officers
}

export async function getOfficerById(id: string) {
  const officerRef = db.collection(COLLECTION).doc(id)
  const doc = await officerRef.get()
  if (!doc.exists) return null

  return { id: doc.id, ...doc.data() }
}
