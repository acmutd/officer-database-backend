import { Request, Response } from "@google-cloud/functions-framework";
import { auth } from "./firebase";

type Handler = (req: Request, res: Response) => Promise<void> | void;

// CORS checker
export const validateCors = (handler: Handler) => {
	return async (req: Request, res: Response) => {
		// Set CORS headers
		res.set('Access-Control-Allow-Origin', '*'); // Definitely change this later to restrict domains
		res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id');
		res.set('Access-Control-Max-Age', '3600');

		// Handle preflight OPTIONS request
		if (req.method === 'OPTIONS') {
			res.status(204).send('');
			return;
		}

		// Call the actual handler
		return handler(req, res);
	};
};

// Auth checker
export const validateAuth = (handler: Handler) => {
	return async (req: Request, res: Response) => {
		const authHeader = req.headers.authorization;
		const userId = req.get("X-User-Id");

		if (!authHeader || !userId) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		try {
			const decodedToken = await auth.verifyIdToken(token);
			if (!decodedToken || decodedToken.uid !== userId) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}

			return handler(req, res);
		} catch (error) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}
	};
};

// Combine the two checkers, CORS first and then auth
export const validateRequest = (handler: Handler) => {
	return validateCors(validateAuth(handler));
};