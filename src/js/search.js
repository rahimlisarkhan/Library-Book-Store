$(document).ready(function () {
    // ----------------- SEARCH PAGE ------------------------ 
    //DOM elements
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
    $(document).on('click', '#searchBookBtn', function () {
        let searchBook = $('#searchBook').val()

        if (searchBook.trim() === '') {
            $('#searchHelpId').removeClass('d-none')
            return
        }


        $('#searchHelpId').addClass('d-none')
        $('.search-loading').removeClass('d-none')

        //API GET BOOKS
        database.ref('/books').on('value', (res) => {
            $('.search-loading').addClass('d-none')

            let array = Object.values(res.val())
            let resultData = array.filter(book => book.title.toLowerCase().includes(searchBook))
            console.log(resultData);

            if (resultData.length === 0) {
                $('.search-content').html(`
                    <div class="alert alert-danger mt-5" role="alert">
                        Book name not found!
                    </div>
                `)
                return
            }
       
            $('.search-content').html(resultData.map(book => {

                return (`
                    <div>
                        <div class="jumbotron d-flex bg-transparent justify-content-between shadow mt-5"
                            style="height: 504px !important">
                            <div class="about-image mt-1">
                            <span class="${!book.is_new && 'd-none'} badge bg-danger text-light">New</span>
                                <img class="img-fluid rounded-circle" width="200"
                                    src="${book.img_url}">
                            </div>

                            <div class="w-75 ml-4">
                                <h1 class="h2">${book.title}  </h1>
                                <p class="h6">${book.author}</p>
                                <hr class="my-4">
                                <p>${book.description}</p>
                            </div>
                        </div>
                    </div>
        `)
            }))

            $('.prev-search').removeClass('d-none')
            $('.next-search').removeClass('d-none')
            $('.search-content').slick({
                infinite: true,
                autoplay: true,
                slidesToShow: 1,
                speed: 700,
                prevArrow: $('.prev-search'),
                nextArrow: $('.next-search'),
            });
        })
    })

})