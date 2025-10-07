const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383

const functions = require('./functions')

app.use(express.json())

// List all officers
app.get('/officers', async (req, res) => {
    try {
        const officers = await functions.listOfficers()
        res.status(200).json(officers)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to list officers' })
    }
})

// Get officer by ID
app.get('/officers/:id', async (req, res) => {
    const { id } = req.params
    try {
        const officer = await functions.getOfficerById(id)
        if (!officer) {
            return res.status(404).send({ error: 'Officer not found' })
        }
        res.status(200).json(officer)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to get officer' })
    }
})

// Create a new officer
app.post('/officers/', async (req, res) => {
    const data = req.body
    try {
        const newOfficer = await functions.createOfficer(data)
        res.status(201).json(newOfficer)
    } catch (err) {
        console.error(err)
        if (err && err.status === 400) {
            if (err.errors) return res.status(400).json({ error: err.message, details: err.errors })
            return res.status(400).send({ error: err.message })
        }
        res.status(500).send({ error: 'Failed to create officer' })
    }
})

// Update an existing officer
app.patch('/officers/:id', async (req, res) => {
    const { id } = req.params
    const patch = req.body
    try {
        const updated = await functions.updateOfficer(id, patch)
        res.status(200).json(updated)
    } catch (err) {
        console.error(err)
        if (err && err.status === 400) {
            if (err.errors) return res.status(400).json({ error: err.message, details: err.errors })
            return res.status(400).send({ error: err.message })
        }
        if (err && err.status === 404) {
            return res.status(404).send({ error: err.message })
        }
        res.status(500).send({ error: 'Failed to update officer' })
    }
})

// Delete an officer by ID
app.delete('/officers/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deletedOfficer = await functions.deleteOfficer(id)
        if (!deletedOfficer) {
            return res.status(404).send({ error: 'Officer not found' })
        }
        res.status(200).json(deletedOfficer)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to delete officer' })
    }
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))