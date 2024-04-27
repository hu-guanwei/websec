### useful http request headers

`User-Agent`: the name of your browser and operating system. useful for checking bot or not.

`Cookie`: the cookie server gave you earlier; keeps you logged in.

### useful http response headers

`Set-Cookie`: set a cookie on the client

### demo: `curl`

```sh
$ curl https://twitter.com --header "Accept-Language: en" --silent | grep JavaScript
```

### demo: make manual http request
```javascript
const net = require('net')

// open a socket
const socket = net.createConnection({
    host: 'example.com',
    port: 80
})

// manual http request
const request = `
GET / HTTP/1.1
Host: example.com

`.slice(1)

socket.write(request)
socket.pipe(process.stdout)
```

#### Q: what happens when you type a url and press enter 
1. perform a dns lookup on the hostname to get an ip address;
2. open a tcp socket to the ip on port 80 (the http port)
3. send an http request that includes the desired path
4. read the http response from the socket
5. parse the html into the dom
6. render the page based on the dom
7. repeat until all external resources are loaded

### Cookie

Client sets a cookie on the clinet. Response header like:
```
Set-Cookie: theme=dark;
```