$(document).ready(function () {
    // ----------------- AbOUT PAGE ------------------------ 
    const firebaseConfig = {
        apiKey: "AIzaSyBkhrpkbBxNsGFvNYi8FZK39sOE8WxQEmoa",
        authDomain: "library-bookstore.firebaseapp.com",
        projectId: "library-bookstore",
        storageBucket: "library-bookstore.appspot.com",
        messagingSenderId: "971596087187",
        databaseURL: "https://library-bookstore-default-rtdb.firebaseio.com/",
        appId: "1:971596087187:web:f4355a30e9077873357266"
    };

    // // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    let database = firebase.database();

    getAboutInfo('/about')

    // ----------------API-----------------------------
    function getAboutInfo(collection) {
        database.ref(collection).on('value', (res) => {
            let aboutInfoData = res.val()

            $('.about-title').html(aboutInfoData.title)
            $('.about-desc').html(aboutInfoData.description)
            $('.about-image img').attr('src', aboutInfoData.img_url)

        })
    }
})