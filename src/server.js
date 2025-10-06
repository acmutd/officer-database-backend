const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383

const functions = require('./functions')

app.use(express.json())

app.get('/officers', async (req, res) => {
    try {
        const officers = await functions.listOfficers()
        res.status(200).json(officers)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Failed to list officers' })
    }
})

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

app.post('/officers/create/', async (req, res) => {
    const data = req.body
    try {
        const newOfficer = await functions.createOfficer(data)
        res.status(201).json(newOfficer)
    } catch (err) {
        console.error(err)
        if (err && err.status === 400) {
            return res.status(400).send({ error: err.message })
        }
        res.status(500).send({ error: 'Failed to create officer' })
    }
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))