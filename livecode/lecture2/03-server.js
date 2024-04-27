const express = require('express')
const { createReadStream } = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// username and password database
const USERS = {
    alice: 'password',
    bob: 'hunter2'
}

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
    const username = req.cookies.username
    if (username) { // if username is set in cookie then go to logged-in page 
        res.send(`Hi, ${username}`)
    } else {
        createReadStream('03-index.html').pipe(res) // input username and password page
    }  
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = USERS[username]

    if (req.body.password === password) {
        res.cookie('username', username) // Set-Cookie for later usage
        res.send('nice!')
    } else {
        res.send('falied!')
    }
})

app.listen(80)

// Take-away
// Cookie is what the server gave you earlier and then sent to the server later to keeps you logged in.