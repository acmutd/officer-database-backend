import { db } from '../firebase'
import { validateOfficerPatch } from './helpers/validators'

const COLLECTION = 'officer'

export async function updateOfficer(id: string, patch: any) {
  if (!id || typeof id !== 'string') {
    const err: any = new Error('Invalid id')
    err.status = 400
    throw err
  }

  const parsed = validateOfficerPatch(patch)
  const updates = { ...parsed }

  const docRef = db.collection(COLLECTION).doc(id)
  await docRef.set(updates, { merge: true })

  const updated = await docRef.get()
  if (!updated.exists) {
    const err: any = new Error('Officer not found')
    err.status = 404
    throw err
  }
  return { id: updated.id, ...updated.data() }
}
