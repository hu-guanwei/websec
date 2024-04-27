const express = require('express')
const { createReadStream } = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const USERS = {
    alice: 'password',
    bob: 'hunter2'
}
const BALANCES = {
    alice: 500,
    bob: 100
}

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
    const username = req.cookies.username // good: the user doesn't have to login repeatly; 
                                          // the site remembers the session
                                          // bad: not secure
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
        res.cookie('username', username)
        res.send('nice!')
    } else {
        res.send('falied!')
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('username') // tell the client to clear the cookie set before
                                // the way to clear cookie is set expire date to the past
    res.redirect('/')
})

app.listen(80)