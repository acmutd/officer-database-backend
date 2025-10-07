const { db } = require('../firebase.js')

const COLLECTION = 'officer'

async function deleteOfficer(id) {
  const officerRef = db.collection(COLLECTION).doc(id)
  const doc = await officerRef.get()
  if (!doc.exists) return null
  await officerRef.delete()
  const { formatOfficerDates } = require('../schemas/format')
  return formatOfficerDates({ id: doc.id, ...doc.data() })
}

module.exports = {
  deleteOfficer
}