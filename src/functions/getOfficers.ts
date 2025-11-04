import { Request, Response } from "express";

import { db } from '../firebase';
import { validateRequest } from "../middleware";

export const getOfficers = [validateRequest, async (req: Request, res: Response) => {
  const officerRef = db.collection("officer")
  const snapshot = await officerRef.get()
  if (snapshot.empty) return []

  const officers: any[] = []
  snapshot.forEach((d) => {
    officers.push({ id: d.id, ...d.data() })
  })
  return officers
}];