import { db } from '../firebase'
import { validateOfficerPatch, convertOfficerDates } from './helpers/validators'
import { formatOfficerDates } from '../schemas/format'

const COLLECTION = 'officer'

export async function updateOfficer(id: string, patch: any) {
  if (!id || typeof id !== 'string') {
    const err: any = new Error('Invalid id')
    err.status = 400
    throw err
  }

  const parsed = validateOfficerPatch(patch)
  const updates = convertOfficerDates({ ...parsed })

  const docRef = db.collection(COLLECTION).doc(id)
  await docRef.set(updates, { merge: true })

  const updated = await docRef.get()
  if (!updated.exists) {
    const err: any = new Error('Officer not found')
    err.status = 404
    throw err
  }
  return formatOfficerDates({ id: updated.id, ...updated.data() })
}
