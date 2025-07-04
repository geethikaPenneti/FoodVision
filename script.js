const toggleBtn = document.getElementById("toggle-btn");
const formTitle = document.getElementById("form-title");
const panelTitle = document.getElementById("panel-title");
const panelText = document.getElementById("panel-text");
const container = document.getElementById("container");

// Admin Form Elements
const adminForm = document.getElementById("admin-login-form");
const adminEmail = document.getElementById("admin-email");
const adminPassword = document.getElementById("admin-password");
const adminError = document.getElementById("admin-error");

// User Form Elements
const userForm = document.getElementById("user-login-form");
const userEmail = document.getElementById("user-email");
const userPassword = document.getElementById("user-password");
const userError = document.getElementById("user-error");

let isAdmin = true;

// Toggle Between Admin and User Login
toggleBtn.addEventListener("click", () => {
  if (isAdmin) {
    formTitle.innerText = "User Login";
    panelTitle.innerText = "Are you an Admin?";
    panelText.innerText = "Enter admin credentials to access the dashboard.";
    toggleBtn.innerText = "ADMIN LOGIN";
    container.classList.add("admin-active");
    userForm.classList.remove("hidden");
    adminForm.classList.add("hidden");
  } else {
    formTitle.innerText = "Admin Login";
    panelTitle.innerText = "Welcome back!";
    panelText.innerText =
      "Enter your personal details and start your journey with us.";
    toggleBtn.innerText = "USER LOGIN";
    container.classList.remove("admin-active");
    userForm.classList.add("hidden");
    adminForm.classList.remove("hidden");
  }
  isAdmin = !isAdmin;
});

// Admin Login Functionality
adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(adminEmail.value, adminPassword.value);
    const user = userCredential.user;
    if (user.email.includes("admin")) {
      window.location.href = "admin/dashboard.html"; // Redirect to Admin Dashboard
    } else {
      throw new Error("Not an admin account.");
    }
  } catch (error) {
    adminError.textContent = error.message;
    adminError.style.display = "block";
  }
});

// User Login Functionality
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(userEmail.value, userPassword.value);
    const user = userCredential.user;
    if (!user.email.includes("admin")) {
      window.location.href = "user/dashboard.html"; // Redirect to User Dashboard
    } else {
      throw new Error("Admin account detected. Use the Admin Login panel.");
    }
  } catch (error) {
    userError.textContent = error.message;
    userError.style.display = "block";
  }
});
