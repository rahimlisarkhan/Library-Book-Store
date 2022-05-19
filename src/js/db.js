const firebaseConfig = {
    apiKey: "AIzaSyBkhrpkbBxNsGFvNYi8FZK39sOE8WxQEmo",
    authDomain: "library-bookstore.firebaseapp.com",
    databaseURL: "https://library-bookstore-default-rtdb.firebaseio.com",
    projectId: "library-bookstore",
    storageBucket: "library-bookstore.appspot.com",
    messagingSenderId: "971596087187",
    appId: "1:971596087187:web:f4355a30e9077873357266"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database = firebase.database();