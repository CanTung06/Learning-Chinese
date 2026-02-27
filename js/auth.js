import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.login = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "index.html";
    } catch (e) {
        alert("Sai tài khoản!");
    }
};

window.logout = async function () {
    await signOut(auth);
    window.location.href = "login.html";
};

export function checkAuth(callback) {
    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = "login.html";
        } else {
            callback();
        }
    });
}