const { db } = require('../firebase.js')
const { formatOfficerDates } = require('../schemas/format')

const COLLECTION = 'officer'

async function listOfficers() {
  const officerRef = db.collection(COLLECTION)
  const snapshot = await officerRef.get()
  if (snapshot.empty) return []

  const officers = []
  snapshot.forEach((d) => {
    officers.push(formatOfficerDates({ id: d.id, ...d.data() }))
  })
  return officers
}

async function getOfficerById(id) {
  const officerRef = db.collection(COLLECTION).doc(id)
  const doc = await officerRef.get()
  if (!doc.exists) return null
  return formatOfficerDates({ id: doc.id, ...doc.data() })
}

module.exports = {
  listOfficers, getOfficerById
}