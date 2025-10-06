const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')

app.use(express.json())

app.get('/officers', async (req, res) => {
    const officerRef = db.collection('officer')
    const doc = await officerRef.get()
    if (doc.empty) {
        return res.sendStatus(400)
    }

    const officers = []
    doc.forEach((d) => {
        officers.push({ id: d.id, ...d.data() })
    })

    res.status(200).send(officers)
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))