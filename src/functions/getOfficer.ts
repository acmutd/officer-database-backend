import { Request, Response } from "express";
import { db } from '../firebase';
import { validateRequest } from "../middleware";

export const getOfficer = [validateRequest, async (req: Request, res: Response) => {
  const { id } = req.params;
  const officerRef = db.collection("officer").doc(id)
  const doc = await officerRef.get()
  if (!doc.exists) return null

  return doc.data()
}];