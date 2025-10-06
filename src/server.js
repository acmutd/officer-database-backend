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

app.listen(port, () => console.log(`Server has started on port: ${port}`))