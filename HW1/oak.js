import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
    console.log('url=', ctx.request.url)
    let pathname = ctx.request.url.pathname
    if (pathname == '/') {
        ctx.response.body = `<html>
<body>
<h1>我的自我介紹</h1>
<ol>
<li><a href="/name">姓名</a></li>
<li><a href="/age">年齡</a></li>
<li><a href="/gender">性別</a></li>
<li><a href="/hobby">愛好</a></li>
<li><a href="/music">音樂</a></li>
</ol>
</body>
</html>
`
    } else if (pathname == '/name') {
        ctx.response.body = 'cindy'
    } else if (pathname == '/age') {
        ctx.response.body = '18'
    } else if (pathname == '/gender') {
        ctx.response.body = '女'
    } else if (pathname == '/hobby') {
        ctx.response.body = '耍廢'
    } else if (pathname == '/music') {
        ctx.response.redirect('https://youtu.be/M1JCWGss4es?si=tvddk7r35pNycdxS')
    }
    else {

    }
});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 })