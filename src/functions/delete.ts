import { db } from '../firebase'
import { formatOfficerDates } from '../schemas/format'

const COLLECTION = 'officer'

export async function deleteOfficer(id: string) {
  const officerRef = db.collection(COLLECTION).doc(id)
  const doc = await officerRef.get()
  if (!doc.exists) return null
  await officerRef.delete()
  return formatOfficerDates({ id: doc.id, ...doc.data() })
}
