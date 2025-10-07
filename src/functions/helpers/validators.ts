import { Timestamp } from 'firebase-admin/firestore'
import { OfficerSchema } from '../../schemas/officer'

export function validateOfficerData(data: any) {
  const parsed = OfficerSchema.safeParse(data)
  if (!parsed.success) {
    const err: any = new Error('Validation failed')
    err.status = 400
    err.errors = parsed.error.flatten()
    throw err
  }
  return parsed.data
}

export function validateOfficerPatch(data: any) {
  const PatchSchema = OfficerSchema.partial()
  const parsed = PatchSchema.safeParse(data)
  if (!parsed.success) {
    const err: any = new Error('Validation failed')
    err.status = 400
    err.errors = parsed.error.flatten()
    throw err
  }
  return parsed.data
}

export function toTimestampFlexible(val: any, context = 'date') {
  if (val === null) return null
  if (val && typeof val === 'object' && typeof val.toDate === 'function' && typeof val.seconds === 'number') return val
  if (val instanceof Date) {
    if (isNaN(val.getTime())) {
      const err: any = new Error(`${context} is not a valid Date`)
      err.status = 400
      throw err
    }
    return Timestamp.fromDate(val)
  }
  if (typeof val === 'number') return Timestamp.fromMillis(val)
  if (typeof val === 'string') {
    const parsed = new Date(val)
    if (isNaN(parsed.getTime())) {
      const err: any = new Error(`${context} is not a valid date string`)
      err.status = 400
      throw err
    }
    return Timestamp.fromDate(parsed)
  }
  const err: any = new Error(`${context} must be null, a valid date string, number (ms), Date, or Firestore Timestamp`)
  err.status = 400
  throw err
}

export function convertRoleDates(roles: any) {
  if (!Array.isArray(roles)) return roles
  return roles.map((role: any, i: number) => {
    const r = { ...role }
    if ('startDate' in r) r.startDate = toTimestampFlexible(r.startDate, `roles[${i}].startDate`)
    if ('endDate' in r) r.endDate = r.endDate === null ? null : toTimestampFlexible(r.endDate, `roles[${i}].endDate`)
    return r
  })
}

export function convertOfficerDates(payload: any) {
  if (!payload || typeof payload !== 'object') return payload
  const out: any = { ...payload }
  if ('joinDate' in out) out.joinDate = toTimestampFlexible(out.joinDate, 'joinDate')
  if ('roles' in out) out.roles = convertRoleDates(out.roles)
  return out
}
