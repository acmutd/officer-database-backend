(async () => { })()

const { db } = require('../firebase.js')
const { validateOfficerPatch, convertRoleDates } = require('./helpers/validators.js')

const COLLECTION = 'officer'

async function updateOfficer(id, patch) {
  if (!id || typeof id !== 'string') {
    const err = new Error('Invalid id')
    err.status = 400
    throw err
  }

  validateOfficerPatch(patch)

  const updates = { ...patch }
  if ('roles' in updates) {
    updates.roles = convertRoleDates(updates.roles)
  }

  const docRef = db.collection(COLLECTION).doc(id)
  await docRef.set(updates, { merge: true })

  const updated = await docRef.get()
  if (!updated.exists) {
    const err = new Error('Officer not found')
    err.status = 404
    throw err
  }
  return { id: updated.id, ...updated.data() }
}

module.exports = {
  updateOfficer
}

