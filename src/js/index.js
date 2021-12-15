$(document).ready(function () {
    // ----------------- CONTACT PAGE ------------------------ 
    const firebaseConfig = {
        apiKey: "AIzaSyBkhrpkbBxNsGFvNYi8FZK39sOE8WxQEmoa",
        authDomain: "rahimlisarkhan.github.io",
        storageBucket: "library-bookstore.appspot.com",
        databaseURL: "https://library-bookstore-default-rtdb.firebaseio.com/",
        // projectId: "library-bookstore",
        // messagingSenderId: "971596087187",
        // appId: "1:971596087187:web:f4355a30e9077873357266"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    let database = firebase.database();

    //Call App Functions
    if (window.location.pathname === "/index.html") {
        getCatalogProduct('/catalog')
    }

    if (window.location.pathname === "/about.html") {
        getAboutInfo('/about')
    }

    if (window.location.pathname === "/catalog.html") {
        getBooksData('/books')
        getCatalogProduct('/catalog')
    }

    if (window.location.pathname === "/search.html") {
        searchResult()
    }

    //Event Buttons
    $('#joinBookBtn').on('click', function (e) {
        e.preventDefault();

        let joinBookFullName = $('#joinBookFullName')
        let joinBookEmail = $('#joinBookEmail')

        if (joinBookFullName.val().trim() === '' ||
            joinBookEmail.val().trim() === '' ||
            !joinBookEmail.val().trim().includes('a')
        ) {
            $('.join-error').fadeIn(125)
            return
        }

        $('.join-error').fadeOut(100)
        $('.join-success').fadeIn(125)

        let formData = {
            full_name: joinBookFullName.val(),
            email: joinBookEmail.val(),
        }

        writeDatabaseData('/join/', formData)

        joinBookFullName.val('')
        joinBookEmail.val('')

        setTimeout(function () {
            window.location.reload()
        }, 1200)
    })

    $('#backSection').on('click', function () {
        // $("#productSection").fadeOut(150)
        // $("#catalogSection").fadeIn(150)
        setTimeout(function (){
            window.location.reload()
        },200 )
    })

    $('#contactBookBtn').on('click', function (e) {
        e.preventDefault();

        let sendContact = false

        let fullNameContact = $('#fullNameContact')
        let emailContact = $('#emailContact')
        let addressContact = $('#addressContact')
        let phoneContact = $('#phoneContact')

        if (fullNameContact.val().trim() === '' ||
            emailContact.val().trim() === '' ||
            !emailContact.val().trim().includes('@') ||
            addressContact.val().trim() === '' ||
            phoneContact.val().trim() === ''
        ) {
            sendContact = true
            $('#contactError').fadeIn(150)
            return
        }


        let formData = {
            full_name: fullNameContact.val(),
            email: emailContact.val(),
            address: addressContact.val(),
            phone: phoneContact.val(),
        }

        if (!sendContact) {
            $('#contactError').fadeOut(150)
            $('#contactSuccess').fadeIn(150)

            writeDatabaseData('/contact/', formData)

            fullNameContact.val('')
            emailContact.val('')
            addressContact.val('')
            phoneContact.val('')
        }

    })

    $('#searchBookBtn').on('click', function () {
        let searchBook = $('#searchBook').val()

        localStorage.setItem('searchBook', searchBook)

        window.location.reload()

    })

    $(document).on('click', '.readMoreBook', function () {

        $("#productSection").fadeIn(150)
        $("#catalogSection").fadeOut(150)

        let bookID = $(this).data('id')
        console.log(bookID);
        database.ref(`books/${bookID}`).on('value', (res) => {
            let bookInfo = res.val()

            $('.productBookYear').html(bookInfo.publicationYear)
            $('.productBookTitle').html(bookInfo.title)
            $('.productBookAuthor').html(bookInfo.author)
            $('.productBookDesc').html(bookInfo.description)
            $('.productBookImg').attr('src', bookInfo.img_url)

            if (!bookInfo.is_new) {
                $('.productBookNew').addClass('d-none');
            } else {
                $('.productBookNew').removeClass('d-none');
            }

        })
    })

    $(document).on('click', '.catalog-item', function () {
        let catalogValue = $(this).val()

        $('.catalog-item').removeClass('text-orange')
        $(this).addClass('text-orange')
        localStorage.setItem('catalog', catalogValue)
        window.location.reload()

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
            let catalogs = Object.values(res.val())
            localStorage.setItem('catalogs', JSON.stringify(catalogs))
        })

        let catalogData = JSON.parse(localStorage.getItem('catalogs'))
        let catalogClass = localStorage.getItem('catalog')

        $('#catalogList div').html(catalogData.map((type, index) => {
            return `<button class="catalog-item list-group-item border-0 cursor-pointer 
                            ${catalogClass == index + 1 && "text-orange"} "  
                            value="${index+1}">${type.catalog}</button>`
        }))
        $('#catalog-home-list').html(catalogData.map((type, index) => {
            return `
            <div class="col-md-4 mb-4">
                <div class="card shadow cursor-pointer  py-3">
                    <div class="card-body">
                        <h4 class="card-title m-0 text-center   h5 font-weight-bold">
                        <a class="text-main" href="./catalog.html
                        "> ${type.catalog}  </a>
                    </h4>
                    </div>
                </div>
             </div>
           `
        }))
    }

    function getBooksData(collection) {
        //API GET BOOKS
        database.ref(collection).on('value', (res) => {

            let array = Object.entries(res.val())
            let allBookData = array.map(book => {
                return {
                    id: book[0],
                    ...book[1]
                }
            })

            localStorage.setItem("books", JSON.stringify(allBookData))

            let chooseCatalogBookData = allBookData.filter(book => book.catalog == localStorage.getItem('catalog'))
            let bestellerBookData = allBookData.filter(book => book.catalog === "2")
            let isNewBookData = allBookData.filter(book => book.is_new)

            renderSlider('.product-slider', '.product-prev', '.product-next', chooseCatalogBookData.length > 0 ? chooseCatalogBookData : allBookData)
            renderSlider('.besteller-slider', '.besteller-prev', '.besteller-next', bestellerBookData)
            renderSlider('.isNew-slider', '.isNew-prev', '.isNew-next', isNewBookData)
        })
    }

    function getAboutInfo(collection) {
        database.ref(collection).on('value', (res) => {
            let aboutInfoData = res.val()

            $('.about-title').html(aboutInfoData.title)
            $('.about-desc').html(aboutInfoData.description)
            $('.about-image img').attr('src', aboutInfoData.img_url)

        })
    }

    function searchResult() {

        let searchBook = localStorage.getItem("searchBook")
        if (!searchBook) {
            return
        }

        if (searchBook.trim() === '') {
            $('#searchHelpId').removeClass('d-none')
            return
        }

        $('#searchHelpId').addClass('d-none')
        $('.search-loading').removeClass('d-none')

        let booksData = JSON.parse(localStorage.getItem('books'))

        //API GET BOOKS
        $('.search-loading').addClass('d-none')

        let resultData = booksData.filter(book => book.title.toLowerCase().includes(searchBook))

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
        $('.search-content').not('.slick-initialized').slick({
            infinite: true,
            autoplay: true,
            slidesToShow: 1,
            speed: 700,
            prevArrow: $('.prev-search'),
            nextArrow: $('.next-search'),
        });
    }

    function renderSlider(content, arrowPrev, arrowNext, data) {

        $(content).html(data.map(book => {

            return (`
                <div>
                    <div class="card p-3 shadow position-relative" style="width: 184px;">
                        <span class="${!book.is_new && 'd-none'} badge badge-danger p-1 position-absolute">New</span>
                        <img width="240" height="190"
                            src="${book.img_url}"
                            class="card-img-top" alt="${book.title}">
                        <div class="card-body px-0 pb-0 text-center">
                            <h5 class="card-title">${book.title.slice(0,10)}...</h5>
                            <h6 class="card-title">${book.author.slice(0,10)}..</h6>
                            <button data-id="${book.id}" class="btn bg-orange text-white btn-block readMoreBook ">Read more</a>
                        </div>
                    </div>
                </div>
    `)
        }))

        $(arrowPrev).removeClass('d-none')
        $(arrowNext).removeClass('d-none')

        $(content).not('.slick-initialized').slick({
            infinite: true,
            autoplay: true,
            slidesToShow: 5,
            speed: 700,
            prevArrow: $(arrowPrev),
            nextArrow: $(arrowNext),
        });

    }

})