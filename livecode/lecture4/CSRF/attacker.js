// this code demos cross-site request forgery

const express = require('express')
const { createReadStream } = require('fs')
const app = express()

app.get('/', (req, res) => {
    createReadStream('attacker.html').pipe(res);
})
app.listen(9999)