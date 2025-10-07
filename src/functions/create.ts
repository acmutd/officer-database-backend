import { db } from '../firebase'
import { convertOfficerDates, validateOfficerData } from './helpers/validators'
import { formatOfficerDates } from '../schemas/format'

const COLLECTION = 'officer'

export async function createOfficer(data: any) {
  const parsed = validateOfficerData(data)
  const dataConverted = convertOfficerDates(parsed)

  const officerRef = db.collection(COLLECTION)
  const docRef = officerRef.doc()
  const UID = docRef.id
  const dataWithUID = { UID, ...dataConverted }

  await docRef.set(dataWithUID)
  const snap = await docRef.get()
  return formatOfficerDates({ id: snap.id, ...snap.data() })
}
