import { Request, Response } from "@google-cloud/functions-framework";
import { auth } from "./firebase";

type Handler = (req: Request, res: Response) => Promise<void> | void;

export const validateRequest = (handler: Handler) => {
	return async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization;
		const userId = req.get("X-User-Id");

		if (!authHeader || !userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		try {
			const decodedToken = await auth.verifyIdToken(token);
			if (!decodedToken || decodedToken.uid !== userId) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			// Validation passed, call the actual function
			return handler(req, res);
		} catch (error) {
			return res.status(401).json({ error: "Unauthorized" });
		}
	};
};