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

### The `PostMessage` cross-origin communication
- Send strings and aribitrarily complicated data cross-origin
- Useful features:
    - structured clone 算法是 postMessage API 中使用的一种算法，它允许你传递几乎任何类型的数据，包括但不限于原始数据类型（如数字、字符串、布尔值）、对象、数组等。这个算法能够递归地复制对象的属性，包括嵌套的对象和数组，从而创建一个与原始数据结构相同的副本。使用 structured clone 算法的优点是：安全性：由于 postMessage 只能传递克隆的数据副本，而不是原始数据的引用，因此可以防止潜在的数据污染或恶意操作。灵活性：可以传递复杂的数据结构，包括循环引用的对象。兼容性：structured clone 算法被现代浏览器广泛支持。然而，structured clone 也有其局限性，比如它不能克隆一些特殊的对象，如函数、Error 对象、DOM 节点等。
    - "Trnasferrable objects" allows transferring ownership of an object. It becomes unusuable in the context it was sent from.

