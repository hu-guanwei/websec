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

const COOKIE_SECRET = 'dasofniuerwbgifubewoiud'
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(COOKIE_SECRET)) // !

app.get('/', (req, res) => {
    console.log(req) // see unpredictable cookie in request header
    const username = req.signedCookies.username 
    
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
        res.cookie('username', username, { signed: true }) // !
        res.send('nice!')
    } else {
        res.send('falied!')
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('username')
    res.redirect('/')
})

app.listen(80)

// good: cookie is not predictable thus cannot be guessed out
// bad: if some has alice's cookie, even if alice changes her password her account is not safe
//      why? because the cookie string for alice stays the same and effective
//           so the server invalidate that when the user logout