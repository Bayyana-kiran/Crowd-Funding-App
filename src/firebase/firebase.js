import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCInetPuElJH-TWKIYv8kUcswvbHSYIp5o",
    authDomain: "crowd-funding-app-866f0.firebaseapp.com",
    projectId: "crowd-funding-app-866f0",
    storageBucket: "crowd-funding-app-866f0.appspot.com",
    messagingSenderId: "307816974854",
    appId: "1:307816974854:web:f0a4fc02038bfbadc31187",
    measurementId: "G-BV6RKVV7XT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };