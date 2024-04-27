const express = require('express')
const { createReadStream } = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { randomBytes } = require('crypto')

const USERS = {
    alice: 'password',
    bob: 'hunter2'
}
const BALANCES = {
    alice: 500,
    bob: 100
}
const SESSIONS = {} // sessionId -> username


const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
    const sessionId = req.cookies.sessionId
    const username = SESSIONS[sessionId]
    if (username) { 
        const balance = BALANCES[username]
        res.send(`Hi, ${username}. Your balance is $${balance}`)
    } else {
        createReadStream('index.html').pipe(res)
    }  
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = USERS[username]

    if (req.body.password === password) {
        let nextSessionId = randomBytes(16).toString()
        SESSIONS[nextSessionId] = username // assign a sessionId to the user
        res.cookie('sessionId', nextSessionId)
        res.send('nice!')
    } else {
        res.send('falied!')
    }
})

app.get('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId
    delete SESSIONS[sessionId] // invalidate the sessionId when the user logout
    res.clearCookie('sessionId')
    res.redirect('/')
})

app.listen(80)