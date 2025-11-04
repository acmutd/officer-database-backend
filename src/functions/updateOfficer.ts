import { Request, Response } from "express";
import { db } from '../firebase'
import { validateOfficerPatch } from './helpers/validators'
import { validateRequest } from "../middleware";

export const updateOfficer = [validateRequest, async (req: Request, res: Response) => {
  const { id } = req.params
  const patch = req.body
  if (!id || typeof id !== 'string') {
    const err: any = new Error('Invalid id')
    err.status = 400
    throw err
  }

  const parsed = validateOfficerPatch(patch)
  const updates = { ...parsed }

  const docRef = db.collection("officer").doc(id)
  await docRef.set(updates, { merge: true })

  const updated = await docRef.get()
  if (!updated.exists) {
    const err: any = new Error('Officer not found')
    err.status = 404
    throw err
  }
  return updated.data();
}];