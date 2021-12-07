$(document).ready(function () {
    // ----------------- ADMIN PAGE ------------------------ 
    //DOM elements
    let aboutTitle = $('.about-title')
    let aboutDesc = $('.about-desc')
    let aboutImg = $('.about-image img')

    console.log(aboutTitle);

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

    // writeDatabaseData('/join',{full_name:'Elshad Agazade',email:"rahimlisarkhan@gmail.com"})
    // writeDatabaseData('/contact',{full_name:'Sabina Ganieva',address:"1921 Ranchview Dr undefined San Francisco",email:"rahimlisarkhan@gmail.com",phone:"+9942222222"})


    //Event Buttons
    $('#contactBookBtn').on('click', function (e) {
        e.preventDefault();

        console.log('test');
        let fullNameContact =$('#fullNameContact')
        let emailContact =$('#emailContact')
        let addressContact =$('#addressContact')
        let phoneContact =$('#phoneContact')

        let formData = {
            full_name: fullNameContact.val(),
            email: emailContact.val(),
            address: addressContact.val(),
            phone: phoneContact.val(),
        }

        console.log(formData);
        writeDatabaseData('/contact/', formData)

        fullNameContact.val('')
        emailContact.val('')
        addressContact.val('')
        phoneContact.val('')
    })

    //----------------API-----------
    function writeDatabaseData(collection, data) {
        try {
            database.ref(collection).push().set(data);
            return true
        } catch (err) {
            console.log(err);
            return false
        }
    }

    function updateDatabaseData(collection, data) {
        try {
            database.ref(collection).set(data);
            return true
        } catch (err) {
            console.log(err);
            return false
        }
    }


})