#### Cookie Policy

Continue last lecture

Don't relay on `Path` of cookie. not safe. can be bypassed using iframe.

Cookie Policy: cookie of a website can be accessed by same or more specific domains. so use a subdomain.

#### Problem with ambient authority, CSRF
Consider this html embedded in attacker.com

```html
<img src='https://bank.example.com/withdraw?from=bob&to=mallory&amount=1000'>
```
Browser includes bank.example.com cookies in all requests to bank.com, even though the request originated from attacker.com.

This is cross-site request forgery (CSRF). Use `SameSite` cookie attribute to prevent CSRF.
`SameSite=None`: default, always send cookie; `SameSite=Lax`: allow subresource requests on top-level requests; 
`SameSite=Strict`: only send cookies if the request originates from the website that set the cookie.k

#### Same Origin Policy

Origin: protocol, hostname, port

SOP is not enforced for certain web features. Some exceptions.

Workaround idea 1: need a way round SOP to allow different origins to communiocate. `document.domain`. sites share a common top-level domain.
- For example, both `login.stanford.edu` and `axess.stanford.edu` set `document.domain = 'stanford.edu'` 
- This is bad. Because this allow anyone on stanford.edu to join the party. `attacker.stanford.edu` can also set `document.domain` to `stanford.edu` to become same origin with others.

Idea 2: Send messages from a parent page to a child iframe.
- Parent is allowed to navigate child iframes
- Child can poll for changes to fragement identifier
- Encode data in URL fragment identifiers
