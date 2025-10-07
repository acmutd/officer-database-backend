import { db } from '../firebase'
import { formatOfficerDates } from '../schemas/format'

const COLLECTION = 'officer'

export async function listOfficers() {
  const officerRef = db.collection(COLLECTION)
  const snapshot = await officerRef.get()
  if (snapshot.empty) return []

  const officers: any[] = []
  snapshot.forEach((d) => {
    officers.push(formatOfficerDates({ id: d.id, ...d.data() }))
  })
  return officers
}

export async function getOfficerById(id: string) {
  const officerRef = db.collection(COLLECTION).doc(id)
  const doc = await officerRef.get()
  if (!doc.exists) return null
  return formatOfficerDates({ id: doc.id, ...doc.data() })
}
