const { Timestamp } = require('firebase-admin/firestore')

function assertObject(val, name) {
  if (!val || typeof val !== 'object' || Array.isArray(val)) {
    const err = new Error(`${name} must be an object`)
    err.status = 400
    throw err
  }
}

function validateOfficerData(data) {
  assertObject(data, 'Request body')

  const requiredTop = ['accessLevel', 'expectedGrad', 'firstName', 'isActive', 'lastName', 'netId', 'roles', 'standing']
  for (const key of requiredTop) {
    if (!(key in data)) {
      const err = new Error(`Missing required field: ${key}`)
      err.status = 400
      throw err
    }
  }

  const eg = data.expectedGrad
  if (!eg || typeof eg !== 'object' || typeof eg.term !== 'string' || typeof eg.year !== 'number') {
    const err = new Error('expectedGrad must be an object with { term: string, year: number }')
    err.status = 400
    throw err
  }

  if (!Array.isArray(data.roles) || data.roles.length === 0) {
    const err = new Error('roles must be a non-empty array')
    err.status = 400
    throw err
  }
  for (const [i, role] of data.roles.entries()) {
    if (!role || typeof role !== 'object') {
      const err = new Error(`roles[${i}] must be an object`)
      err.status = 400
      throw err
    }
    const roleRequired = ['division', 'endDate', 'level', 'startDate', 'title']
    for (const rkey of roleRequired) {
      if (!(rkey in role)) {
        const err = new Error(`roles[${i}] is missing required field: ${rkey}`)
        err.status = 400
        throw err
      }
    }
    if (typeof role.level !== 'number') {
      const err = new Error(`roles[${i}].level must be a number`)
      err.status = 400
      throw err
    }
  }

  if ('socialLinks' in data) {
    const sl = data.socialLinks
    if (!sl || typeof sl !== 'object') {
      const err = new Error('socialLinks must be an object when provided')
      err.status = 400
      throw err
    }
    const slFields = ['github', 'linkedin', 'personalEmail']
    for (const f of slFields) {
      if (f in sl && typeof sl[f] !== 'string') {
        const err = new Error(`socialLinks.${f} must be a string when provided`)
        err.status = 400
        throw err
      }
    }
  }
}

function validateOfficerPatch(data) {
  if (!data || typeof data !== 'object') {
    const err = new Error('Request body must be a JSON object')
    err.status = 400
    throw err
  }

  // validate known fields if present
  if ('accessLevel' in data && typeof data.accessLevel !== 'number') {
    const err = new Error('accessLevel must be a number')
    err.status = 400
    throw err
  }
  if ('expectedGrad' in data) {
    const eg = data.expectedGrad
    if (!eg || typeof eg !== 'object') {
      const err = new Error('expectedGrad must be an object when provided')
      err.status = 400
      throw err
    }
    const hasTerm = 'term' in eg
    const hasYear = 'year' in eg
    // For patches, require both year and term when updating expectedGrad
    if (!hasYear || !hasTerm) {
      const err = new Error('expectedGrad patch must include both year and term')
      err.status = 400
      throw err
    }
    if (hasTerm && typeof eg.term !== 'string') {
      const err = new Error('expectedGrad.term must be a string')
      err.status = 400
      throw err
    }
    if (hasYear && typeof eg.year !== 'number') {
      const err = new Error('expectedGrad.year must be a number')
      err.status = 400
      throw err
    }
  }
  if ('firstName' in data && typeof data.firstName !== 'string') {
    const err = new Error('firstName must be a string')
    err.status = 400
    throw err
  }
  if ('isActive' in data && typeof data.isActive !== 'boolean') {
    const err = new Error('isActive must be a boolean')
    err.status = 400
    throw err
  }
  if ('lastName' in data && typeof data.lastName !== 'string') {
    const err = new Error('lastName must be a string')
    err.status = 400
    throw err
  }
  if ('netId' in data && typeof data.netId !== 'string') {
    const err = new Error('netId must be a string')
    err.status = 400
    throw err
  }
  if ('roles' in data) {
    // When roles are provided in a patch, require the full roles array to be submitted
    if (!Array.isArray(data.roles) || data.roles.length === 0) {
      const err = new Error('roles must be a non-empty array when provided')
      err.status = 400
      throw err
    }
    const roleRequired = ['division', 'endDate', 'level', 'startDate', 'title']
    for (const [i, role] of data.roles.entries()) {
      if (typeof role !== 'object' || role === null) {
        const err = new Error(`roles[${i}] must be an object`)
        err.status = 400
        throw err
      }
      for (const rkey of roleRequired) {
        if (!(rkey in role)) {
          const err = new Error(`roles[${i}] is missing required field: ${rkey}`)
          err.status = 400
          throw err
        }
      }
      if (typeof role.level !== 'number') {
        const err = new Error(`roles[${i}].level must be a number`)
        err.status = 400
        throw err
      }
    }
  }
  if ('socialLinks' in data) {
    const sl = data.socialLinks
    if (!sl || typeof sl !== 'object') {
      const err = new Error('socialLinks must be an object when provided')
      err.status = 400
      throw err
    }
    const slFields = ['github', 'linkedin', 'personalEmail']
    for (const f of slFields) {
      if (f in sl && typeof sl[f] !== 'string') {
        const err = new Error(`socialLinks.${f} must be a string when provided`)
        err.status = 400
        throw err
      }
    }
  }
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
