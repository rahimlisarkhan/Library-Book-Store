$(document).ready(function () {
    // ----------------- CONTACT PAGE ------------------------ 

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

})