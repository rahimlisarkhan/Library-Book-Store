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




    getCatalogProduct('/catalog')
    getBooksData('/books')
    //Event Buttons
    $('#joinBookBtn').on('click', function (e) {
        e.preventDefault();

        console.log('test');
        let joinBookFullName = $('#joinBookFullName')
        let joinBookEmail = $('#joinBookEmail')

        let formData = {
            full_name: joinBookFullName.val(),
            email: joinBookEmail.val(),
        }

        console.log(formData);
        writeDatabaseData('/join/', formData)

        joinBookFullName.val('')
        joinBookEmail.val('')
    })


    $('#backSection').on('click', function () {
        $("#productSection").fadeOut(150)
        $("#catalogSection").fadeIn(150)
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
            $('.productBookImg').attr('src',bookInfo.img_url)

            if(!bookInfo.is_new){
                $('.productBookNew').addClass('d-none');
            }else{
                $('.productBookNew').removeClass('d-none');
            }

        })
    })

    $(document).on('click', '.catalog-item', function () {
        let catalogValue = $(this).val()
        let data = JSON.parse(localStorage.getItem('getBooks'))
        let filterData = data.filter(book => book.catalog === catalogValue)
        // console.log(filterData);

        $('.product-slider').html(filterData.map(book => {
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

            $('#catalogList').html(catalogData.map((type, index) => {
                return `<button class="catalog-item list-group-item border-0 cursor-pointer" value="${index+1}">${type.catalog}</button>`

            }))

            $('#catalog-home-list').html(catalogData.map((type, index) => {
                return `
                <div class="col-md-4 mb-4">
                    <div class="card shadow cursor-pointer  py-3">
                        <div class="card-body">
                            <h4 class="card-title m-0 text-center h5 font-weight-bold">
                            <a class="text-main" href="./catalog.html
                            "> ${type.catalog}  </a>
                        </h4>
                        </div>
                    </div>
                 </div>
               `
            }))
            // console.log(catalogData);
        })
    }

    function getBooksData(collection) {
        //API GET BOOKS
        database.ref(collection).on('value', (res) => {
            // $('.search-loading').addClass('d-none')

            let array = Object.entries(res.val())
            let allBookData = array.map(book => {
                return {
                    id: book[0],
                    ...book[1]
                }
            })

            localStorage.setItem('getBooks', JSON.stringify(allBookData))
            // console.log(allBookData);
            let bestellerBookData = allBookData.filter(book => book.catalog === "2")
            let isNewBookData = allBookData.filter(book => book.is_new)

            renderSlider('.product-slider', allBookData)
            renderSlider('.besteller-slider', bestellerBookData)
            renderSlider('.isNew-slider', isNewBookData)
        })
    }

    function renderSlider(content, data) {

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

        $('.prev-search').removeClass('d-none')
        $('.next-search').removeClass('d-none')
        $(content).slick({
            infinite: true,
            autoplay: true,
            slidesToShow: 5,
            speed: 700,
            prevArrow: $('.prev-search'),
            nextArrow: $('.next-search'),
        });

    }

})