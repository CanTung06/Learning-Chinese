import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.login = async function(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
};

window.logout = async function () {
    await signOut(auth);
    window.location.href = "index.html";
};

export function checkAuth(callback) {
    onAuthStateChanged(auth, user => {
        if (!user) {
            alert("Chưa đăng nhập!");
            window.location.href = "index.html";
        } else {
            callback();
        }
    });
}