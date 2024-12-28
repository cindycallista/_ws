let isLoggedIn = false;
let currentUser = null;

const authPage = document.getElementById('authPage');
const loginPage = document.getElementById('loginPage');
const createPostPage = document.getElementById('createPostPage');
const authForm = document.getElementById('authForm');
const toggleLink = document.getElementById('toggleLink');
const logoutBtn = document.getElementById('logoutBtn');
const usernameDisplay = document.getElementById('usernameDisplay');
const postForm = document.getElementById('postForm');
const postList = document.getElementById('postList');
const songInput = document.getElementById('songSearch');
const songResults = document.createElement('ul');
songResults.id = 'songResults';
songInput.parentElement.appendChild(songResults);

let users = [];
let posts = [];
let selectedSongUri = null;

// Spotify API Variables
const SPOTIFY_CLIENT_ID = 'e7bf79f1f45d46d08862e9d379e7aeef';
const SPOTIFY_CLIENT_SECRET = '6ac2ccf915084373b3319e3d35116306';
let spotifyAccessToken = null;

// Fetch Spotify Access Token
async function fetchSpotifyAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    spotifyAccessToken = data.access_token;
}

function initializePlayer() {
    if (window.Spotify) {
        player = new Spotify.Player({
            name: 'Unsent Project Player',
            getOAuthToken: (cb) => { cb(spotifyAccessToken); },
            volume: 0.5
        });

        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        player.addListener('player_state_changed', (state) => {
            if (!state) return;
            const { track_window: { current_track } } = state;
            console.log('Currently playing: ' + current_track.name);
        });

        player.addListener('ready', ({ device_id }) => {
            console.log('The player is ready with device ID', device_id);
        });

        player.connect();
    }
}
// Search Songs Using Spotify API
async function searchSongs(query) {
    if (!spotifyAccessToken) await fetchSpotifyAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        headers: { Authorization: `Bearer ${spotifyAccessToken}` },
    });

    const data = await response.json();
    return data.tracks.items;
}

// Populate Song Results
songInput.addEventListener('input', async () => {
    const query = songInput.value.trim();
    if (!query) {
        songResults.innerHTML = '';
        return;
    }

    const songs = await searchSongs(query);
    songResults.innerHTML = songs
        .map(
            (song) => `
        <li data-uri="${song.uri}">
            ${song.name} by ${song.artists.map((artist) => artist.name).join(', ')}
        </li>
    `
        )
        .join('');

    // Handle Song Selection
    document.querySelectorAll('#songResults li').forEach((li) => {
        li.addEventListener('click', () => {
            selectedSongUri = li.dataset.uri;
            songInput.value = li.textContent;
            songResults.innerHTML = '';
        });
    });
});

// Handle Toggle Between Login and Register Pages
toggleLink.addEventListener('click', () => {
    authPage.style.display = 'none';
    loginPage.style.display = 'block';
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        alert('Username already exists!');
        return;
    }

    users.push({ username, email, password });

    alert('Registration successful! You can now log in.');
    authPage.style.display = 'none';
    loginPage.style.display = 'block';
    authForm.reset();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginUsername = document.getElementById('loginUsername').value.trim();
    const loginPassword = document.getElementById('loginPassword').value.trim();

    const user = users.find((u) => u.username === loginUsername && u.password === loginPassword);

    if (user) {
        isLoggedIn = true;
        currentUser = user.username;
        loginPage.style.display = 'none';
        createPostPage.style.display = 'block';
        usernameDisplay.textContent = currentUser;
    } else {
        alert('Invalid username or password!');
    }
});

logoutBtn.addEventListener('click', () => {
    isLoggedIn = false;
    currentUser = null;
    createPostPage.style.display = 'none';
    authPage.style.display = 'flex';
});

// Post Form Handler
postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const song = document.getElementById("songSearch").value.trim();
    const caption = document.getElementById("caption").value.trim();

    if (!song || !caption) {
        alert("Please fill out all fields before posting.");
        return;
    }

    // Create the post
    const post = {
        user: currentUser,
        song,
        caption,
        time: new Date().toLocaleString(),
        likes: 0,
        likedBy: [],
        comments: []
    };

    posts.push(post);
    renderPosts();
    postForm.reset();
});

// Function to render posts
function renderPosts() {
    console.log("Rendering posts...");
    postList.innerHTML = "";

    posts.forEach((post, index) => {
        if (!post.song || !post.caption) {
            console.warn("Skipping post with missing song or caption", post);
            return;
        }

        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>${post.song}</h3>
            <p>${post.caption}</p>
            <small>Posted by ${post.user} on ${post.time}</small>
            <div class="post-actions">
                <button class="like-btn" onclick="toggleLike(${index})">Like (${post.likes})</button>
                <button class="comment-btn" onclick="toggleComments(${index})">Comment</button>
            </div>
            <div id="comments-${index}" class="comments-section hidden">
                ${post.comments.map((comment) => `<p><strong>${comment.user}:</strong> ${comment.text}</p>`).join('')}
                <textarea id="comment-text-${index}" placeholder="Add a comment"></textarea>
                <button onclick="addComment(${index})">Submit Comment</button>
            </div>
        `;
        postList.appendChild(postDiv);
    });
}

// Toggle Like Function
function toggleLike(postIndex) {
    const post = posts[postIndex];
    if (!post.likes) post.likes = 0;

    // Toggle like/unlike logic
    if (post.likedBy.includes(currentUser)) {
        post.likes -= 1;
        post.likedBy = post.likedBy.filter((user) => user !== currentUser);
    } else {
        post.likes += 1;
        post.likedBy.push(currentUser);
    }
    renderPosts();
}

// Add Comment Handler
function addComment(postIndex) {
    const commentText = document.getElementById(`comment-text-${postIndex}`).value.trim();
    if (commentText) {
        posts[postIndex].comments.push({ user: currentUser, text: commentText });
        renderPosts();
    }
}

// Toggle Comments Visibility
function toggleComments(postIndex) {
    const commentsSection = document.getElementById(`comments-${postIndex}`);
    commentsSection.classList.toggle('hidden');
}
