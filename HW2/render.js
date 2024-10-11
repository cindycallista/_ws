export function layout(title, content) {
    return `
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f0f5;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          h1, h2 {
            color: #333;
            font-weight: bold;
          }
          h1 {
            font-size: 2.2em;
            margin-bottom: 20px;
          }
          h2 {
            font-size: 1.6em;
            margin: 15px 0;
          }
          #content {
            max-width: 800px;
            margin: 50px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            background: #fff;
            margin: 15px 0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
          }
          li:hover {
            transform: scale(1.03);
          }
          a {
            color: #f9a1bc; /* Pastel Pink */
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
          input[type="text"], textarea {
            width: 100%;
            padding: 15px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 1.1em;
          }
          input[type="submit"] {
            background-color: #f9a1bc; /* Pastel Pink */
            color: white;
            padding: 12px 18px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s;
          }
          input[type="submit"]:hover {
            background-color: #f4b4c6; /* Slightly darker pastel pink */
          }
          button {
            background-color: #e74c3c;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s;
          }
          button:hover {
            background-color: #c0392b;
          }
          footer {
            margin-top: 50px;
            text-align: center;
            font-size: 0.9em;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div id="content">
          ${content}
        </div>
        <footer>
          <p>Powered by Deno</p>
        </footer>
      </body>
      </html>
    `;
}

export function list(posts) {
    let list = [];
    for (let post of posts) {
        const formattedDate = post.created_at;
        list.push(`
        <li>
          <h2>${post.title}</h2>
          <p><a href="/post/${post.id}">Read post</a></p>
          <p><small>Created at: ${formattedDate}</small></p>
        </li>
      `);
    }

    let content = `
      <h1>Blog Posts</h1>
      <p>You have <strong>${posts.length}</strong> posts!</p>
      <p><a href="/post/new" style="display: inline-block; padding: 12px 18px; background-color: #f9a1bc; color: white; text-decoration: none; border-radius: 5px;">Create a Post</a></p>
      <ul id="posts">
        ${list.join('\n')}
      </ul>
    `;

    return layout('Posts', content);
}

export function newPost() {
    return layout('New Post', `
      <h1>Create New Post</h1>
      <p>Fill out the form below to create a new post.</p>
      <form action="/post" method="post">
        <p><input type="text" placeholder="Title" name="title" required></p>
        <p><textarea placeholder="Contents" name="body" required></textarea></p>
        <p><input type="submit" value="Create"></p>
      </form>
    `);
}

export function show(post) {
    const formattedDate = post.created_at;
    return layout(post.title, `
      <h1>${post.title}</h1>
      <pre style="white-space: pre-wrap; word-wrap: break-word; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #fafafa;">${post.body}</pre>
      <p><small>Created at: ${formattedDate}</small></p>
      <p><a href="/" style="color: #f9a1bc;">Back to posts</a></p>
    `);
}
