import { RequestHandler, Request, Response } from "express";
import { auth } from "./firebase";

export const validateRequest: RequestHandler = async (req: Request, res: Response, next) => {
	const authHeader = req.headers.authorization;
	const userId = req.get("X-User-Id");
	if (!authHeader || !userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const decodedToken = await auth.verifyIdToken(token);
	// This should throw if no token is provided but just in case :)
	if (!decodedToken || decodedToken.uid !== userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	next();
};