export function signupUi() {
    return `
    <html>
      <head>
        <title>Sign Up</title>
      </head>
      <body>
        <form action="/signup" method="post">
          <input name="username" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <input name="email" placeholder="Email" />
          <button type="submit">Sign Up</button>
        </form>
      </body>
    </html>
    `;
}


export function loginUi() {
    return `<form action="/login" method="post">
                <input name="username" placeholder="Username" />
                <input name="password" type="password" placeholder="Password" />
                <button type="submit">Log In</button>
            </form>`;
}

export function newPost() {
    return `<form action="/post" method="post">
                <input name="title" placeholder="Title" />
                <textarea name="body" placeholder="Body"></textarea>
                <button type="submit">Post</button>
            </form>`;
}

export function success() {
    return `<p>Success! <a href="/">Go back</a></p>`;
}

export function fail() {
    return `<p>Fail! <a href="/">Go back</a></p>`;
}

export function list(posts, user) {
    let html = `<h1>All Posts</h1>`;
    if (user) html += `<p>Welcome, ${user.username}!</p>`;
    posts.forEach(post => {
        html += `<h2>${post.title} by ${post.username}</h2><p>${post.body}</p>`;
    });
    return html;
}

export function show(post) {
    return `<h1>${post.title}</h1><p>${post.body}</p><p>by ${post.username}</p>`;
}
