function signup() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Fill all fields");
    return;
  }

  if (localStorage.getItem("user_" + username)) {
    alert("User already exists");
    return;
  }

  localStorage.setItem("user_" + username, password);
  alert("Signup successful");

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function login() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();

  let savedPassword = localStorage.getItem("user_" + username);

  if (savedPassword === password) {
    localStorage.setItem("currentUser", username);

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";

    loadPosts();

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  } else {
    alert("Invalid login");
  }
}

function addPost() {
  let caption = document.getElementById("caption").value.trim();
  let file = document.getElementById("image").files[0];

  if (!caption && !file) {
    alert("Add something");
    return;
  }

  let reader = new FileReader();

  reader.onload = function () {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    let newPost = {
      id: Date.now(),
      caption: caption,
      image: file ? reader.result : ""
    };

    posts.push(newPost);

    localStorage.setItem("posts", JSON.stringify(posts));

    document.getElementById("caption").value = "";
    document.getElementById("image").value = "";

    loadPosts();
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onload();
  }
}

function loadPosts() {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let container = document.getElementById("posts");

  container.innerHTML = "";

  posts.slice().reverse().forEach(post => {
    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      ${post.image ? `<img src="${post.image}">` : ""}
      <p>${post.caption}</p>
      <div class="actions">
        <button onclick="editPost(${post.id})">Edit</button>
        <button onclick="deletePost(${post.id})">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function deletePost(id) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts = posts.filter(post => post.id !== id);

  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
}

function editPost(id) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let post = posts.find(post => post.id === id);

  let newCaption = prompt("Edit caption:", post.caption);

  if (newCaption !== null && newCaption.trim() !== "") {
    post.caption = newCaption;

    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
  }
}