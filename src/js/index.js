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

    getCatalogProduct('/catalog/')

    //Event Buttons
    $('#joinBookBtn').on('click', function (e) {
        e.preventDefault();

        console.log('test');
        let joinBookFullName =$('#joinBookFullName')
        let joinBookEmail =$('#joinBookEmail')

        let formData = {
            full_name: joinBookFullName.val(),
            email: joinBookEmail.val(),
        }

        console.log(formData);
        writeDatabaseData('/join/', formData)

        joinBookFullName.val('')
        joinBookEmail.val('')
    })


    $('#backSection').on('click',function(){
        $("#productSection").fadeOut(150)
        $("#catalogSection").fadeIn(150)
    })


    $(document).on('click','.readMoreBook',function(){
        $("#productSection").fadeIn(150)
        $("#catalogSection").fadeOut(150)
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

    function getCatalogProduct(collection) {

        database.ref(collection).on('value', (res) => {
            let catalogData = Object.values(res.val())
            $('#catalogList').html(catalogData.map((type,index)=>{
                return `<button class="list-group-item border-0 cursor-pointer" value="${index+1}">${type.catalog}</button>`

            }))
            console.log(catalogData);
        })
    }


    $(document).ready(function () {
    $('.product-slider').slick({
        infinite: true,
        autoplay: true,
        speed: 1000,
        slidesToShow: 5,
        speed: 700,
        prevArrow: $('.prev-search'),
        nextArrow: $('.next-search'),
    });
})
})



// slidesToShow: 1,
// speed: 700,
// prevArrow: $('.prev-search'),
// nextArrow: $('.next-search'),
// });