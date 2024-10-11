import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

let posts = [
    { id: 0, title: 'Post One', body: 'Content of post one', created_at: new Date().toLocaleString() },
    { id: 1, title: 'Post Two', body: 'Content of post two', created_at: new Date().toLocaleString() }
];

const router = new Router();

router
    .get('/', list)
    .get('/post/new', add)
    .get('/post/:id', show)
    .post('/post', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function list(ctx) {
    ctx.response.body = await render.list(posts);
}

async function add(ctx) {
    ctx.response.body = await render.newPost();
}

async function show(ctx) {
    const id = parseInt(ctx.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        ctx.throw(404, 'Post not found');
        return;
    }

    ctx.response.body = await render.show(post);
}

async function create(ctx) {
    const body = ctx.request.body({ type: 'form' });
    const pairs = await body.value;

    const post = {};
    for (const [key, value] of pairs) {
        post[key] = value.trim();
    }

    if (!post.title || !post.body) {
        ctx.throw(400, 'required!');
        return;
    }

    post.id = posts.length;
    post.created_at = new Date().toLocaleString();

    posts.push(post);

    ctx.response.redirect('/');
}

console.log('Server running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
