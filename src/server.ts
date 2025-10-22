import express from "express";
import * as functions from "./functions";
import { validateRequest } from "./middleware";

const app = express();
const port = 8080;

app.use(express.json());
app.use(validateRequest);

app.get("/officers", async (req, res) => {
	try {
		const officers = await functions.listOfficers();
		res.status(200).json(officers);
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: "Failed to list officers" });
	}
});

app.get("/officers/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const officer = await functions.getOfficerById(id);
		if (!officer) return res.status(404).send({ error: "Officer not found" });
		res.status(200).json(officer);
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: "Failed to get officer" });
	}
});

app.post("/officers", async (req, res) => {
	const data = req.body;
	try {
		const newOfficer = await functions.createOfficer(data);
		res.status(201).json(newOfficer);
	} catch (err: any) {
		console.error(err);
		if (err && err.status === 400) {
			if (err.errors)
				return res
					.status(400)
					.json({ error: err.message, details: err.errors });
			return res.status(400).send({ error: err.message });
		}
		res.status(500).send({ error: "Failed to create officer" });
	}
});

app.patch("/officers/:id", async (req, res) => {
	const { id } = req.params;
	const patch = req.body;
	try {
		const updated = await functions.updateOfficer(id, patch);
		res.status(200).json(updated);
	} catch (err: any) {
		console.error(err);
		if (err && err.status === 400) {
			if (err.errors)
				return res
					.status(400)
					.json({ error: err.message, details: err.errors });
			return res.status(400).send({ error: err.message });
		}
		if (err && err.status === 404)
			return res.status(404).send({ error: err.message });
		res.status(500).send({ error: "Failed to update officer" });
	}
});

app.delete("/officers/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const deleted = await functions.deleteOfficer(id);
		if (!deleted) return res.status(404).send({ error: "Officer not found" });
		res.status(200).json(deleted);
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: "Failed to delete officer" });
	}
});

app.listen(port, () => console.log(`Server started on port ${port}`));
