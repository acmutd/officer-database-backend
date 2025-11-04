import { Request, Response } from "express";
import { db } from '../firebase'
import { validateRequest } from "../middleware";

export const deleteOfficer = [validateRequest, async (req: Request, res: Response) => {
  const { id } = req.params;
  const officerRef = db.collection("officer").doc(id)
  const doc = await officerRef.get()
  if (!doc.exists) return null
  await officerRef.delete()

  return res.status(200).json(doc.data());
}];