const { Timestamp } = require('firebase-admin/firestore')

function toIsoFromFirestoreTimestamp(val) {
  if (val === null || val === undefined) return val
  if (val instanceof Timestamp) return val.toDate().toISOString()
  if (val && typeof val === 'object' && typeof val._seconds === 'number') {
    const ms = val._seconds * 1000 + Math.floor((val._nanoseconds || 0) / 1000000)
    return new Date(ms).toISOString()
  }
  if (val instanceof Date) return val.toISOString()
  if (typeof val === 'string') {
    const d = new Date(val)
    if (isNaN(d.getTime())) return val
    return d.toISOString()
  }
  return val
}

function formatOfficerDates(officer) {
  if (!officer || typeof officer !== 'object') return officer
  const out = { ...officer }
  if ('joinDate' in out) out.joinDate = toIsoFromFirestoreTimestamp(out.joinDate)
  if (Array.isArray(out.roles)) {
    out.roles = out.roles.map((r) => ({
      ...r,
      startDate: toIsoFromFirestoreTimestamp(r.startDate),
      endDate: r.endDate === null ? null : toIsoFromFirestoreTimestamp(r.endDate),
    }))
  }
  return out
}

module.exports = { toIsoFromFirestoreTimestamp, formatOfficerDates }
