import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);

const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Redirect based on user type
      if (email.includes("@svecw.edu.in")) {
        window.location.href = "admin/dashboard.html";
      } else {
        window.location.href = "user/dashboard.html";
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error.message);
    });
});
