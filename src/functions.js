const { db } = require('./firebase.js')

const COLLECTION = 'officer'

async function listOfficers() {
  const officerRef = db.collection(COLLECTION)
  const snapshot = await officerRef.get()
  if (snapshot.empty) return []

  const officers = []
  snapshot.forEach((d) => {
    officers.push({ id: d.id, ...d.data() })
  })
  return officers
}

module.exports = {
  listOfficers,
}
