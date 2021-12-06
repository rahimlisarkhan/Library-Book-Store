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

    getAboutInfo('/about')
    // writeDatabaseData('/join',{full_name:'Elshad Agazade',email:"rahimlisarkhan@gmail.com"})
    // writeDatabaseData('/contact',{full_name:'Sabina Ganieva',address:"1921 Ranchview Dr undefined San Francisco",email:"rahimlisarkhan@gmail.com",phone:"+9942222222"})

    
    //Event Buttons
    $(document).on('click','#searchBookBtn',function(){
        let searchBook = $('#searchBook').val()

        console.log(searchBook);
        database.ref('/books').on('value', (res) => {
                    let dataObjects = res.val()
                    let array =  Object.values(dataObjects)
                    let resultData = array.filter(book=> book.title.toLowerCase().includes(searchBook))
                    console.log(resultData);
            
        })
    })


    //Function for Action


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

    // function getBooks(collection) {
    //     database.ref(collection).on('value', (res) => {
    //         let dataObjects = res.val()
    //         let array =  Object.entries(dataObjects)

    //         let booksData = array.map(item => {
    //             return {
    //                 id: item[0],
    //                 ...item[1]
    //             }
    //         })
    //         console.log(booksData);
    //     })
    // }

  

    function getAboutInfo(collection) {
        database.ref(collection).on('value', (res) => {
            let aboutInfoData = res.val()

            aboutTitle.html(aboutInfoData.title)
            aboutDesc.html(aboutInfoData.description)
            // aboutDesc.parent().append(`<img class="img-fluid" width="500" />`)
            aboutImg.attr('src',aboutInfoData.img_url)

        })
    }

})