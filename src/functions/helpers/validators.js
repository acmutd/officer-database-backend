const { Timestamp } = require('firebase-admin/firestore')

const { OfficerSchema } = require('../../schemas/officer')

function validateOfficerData(data) {
  const parsed = OfficerSchema.safeParse(data)
  if (!parsed.success) {
    const err = new Error('Validation failed')
    err.status = 400
    err.errors = parsed.error.flatten()
    throw err
  }
  return parsed.data
}

function validateOfficerPatch(data) {
  const PatchSchema = OfficerSchema.partial()
  // For patches, keep requiredness flexible but still validate types/shape
  const parsed = PatchSchema.safeParse(data)
  if (!parsed.success) {
    const err = new Error('Validation failed')
    err.status = 400
    err.errors = parsed.error.flatten()
    throw err
  }
  return parsed.data
}

function toTimestampFlexible(val, context = 'date') {
  if (val === null) return null
  // Already a Firestore Timestamp
  if (val && typeof val === 'object' && typeof val.toDate === 'function' && typeof val.seconds === 'number') return val
  if (val instanceof Date) {
    if (isNaN(val.getTime())) {
      const err = new Error(`${context} is not a valid Date`)
      err.status = 400
      throw err
    }
    return Timestamp.fromDate(val)
  }
  if (typeof val === 'number') {
    return Timestamp.fromMillis(val)
  }
  if (typeof val === 'string') {
    const parsed = new Date(val)
    if (isNaN(parsed.getTime())) {
      const err = new Error(`${context} is not a valid date string`)
      err.status = 400
      throw err
    }
    return Timestamp.fromDate(parsed)
  }
  const err = new Error(`${context} must be null, a valid date string, number (ms), Date, or Firestore Timestamp`)
  err.status = 400
  throw err
}

function convertRoleDates(roles) {
  if (!Array.isArray(roles)) return roles
  return roles.map((role, i) => {
    const r = { ...role }
    if ('startDate' in r) r.startDate = toTimestampFlexible(r.startDate, `roles[${i}].startDate`)
    if ('endDate' in r) r.endDate = r.endDate === null ? null : toTimestampFlexible(r.endDate, `roles[${i}].endDate`)
    return r
  })
}

function convertOfficerDates(payload) {
  if (!payload || typeof payload !== 'object') return payload
  const out = { ...payload }
  if ('joinDate' in out) out.joinDate = toTimestampFlexible(out.joinDate, 'joinDate')
  if ('roles' in out) out.roles = convertRoleDates(out.roles)
  return out
}

module.exports = {
  validateOfficerData,
  validateOfficerPatch,
  convertRoleDates,
  convertOfficerDates,
}
