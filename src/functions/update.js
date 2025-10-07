(async () => { })()

const { db } = require('../firebase.js')
const { validateOfficerPatch } = require('./helpers/validators.js')

const COLLECTION = 'officer'

async function updateOfficer(id, patch) {
  if (!id || typeof id !== 'string') {
    const err = new Error('Invalid id')
    err.status = 400
    throw err
  }

  const parsed = validateOfficerPatch(patch)

  // convert joinDate and roles if present in parsed patch
  const { convertOfficerDates } = require('./helpers/validators.js')
  const updates = convertOfficerDates({ ...parsed })

  const docRef = db.collection(COLLECTION).doc(id)
  await docRef.set(updates, { merge: true })

  const updated = await docRef.get()
  if (!updated.exists) {
    const err = new Error('Officer not found')
    err.status = 404
    throw err
  }
  const { formatOfficerDates } = require('../schemas/format')
  return formatOfficerDates({ id: updated.id, ...updated.data() })
}

module.exports = {
  updateOfficer
}

