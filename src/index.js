$(document).ready(function () {

    // ----------------- ADMIN PAGE ------------------------ 

    let searchAdminInput = $('#searchAdminInput')
    let searchAdminResult = $('#searchAdminResult')
    let searchAdminButton = $('#searchAdminButton')
    let bookFormSubmit = $('#bookFormSubmit')
    let searchResultData = null
    let searchChooseBookData = null

    //form Inputs
    let bookName = $('#bookName');
    let authorName = $('#authorName');
    let bookImageUrl = $('#bookImageUrl');
    let publicationYear = $('#publicationYear');
    let bookDesc = $('#bookDesc');
    let bookSelectType = $('#bookSelectType')

    //Event Buttons
    searchAdminInput.on('input', function () {
        if ($(this).val().length < 3) {
            searchAdminResult.addClass('d-none')
        }
    })

    searchAdminButton.on('click', function () {
        let value = searchAdminInput.val()
        console.log(value);
        if (value.trim() === '') {
            return
        }
        searchAdminResult.removeClass('d-none')
        getSearchBook(value)
    })

    bookFormSubmit.on('click', function (e) {
        e.preventDefault();
        console.log(e);


        let formData = {
            author: authorName.val(),
            title: bookName.val(),
            img_url: bookImageUrl.val(),
            publicationYear: publicationYear.val(),
            description: bookDesc.val().trim(),
            catalog: bookSelectType.val()
        }


        bookName.val('')
        authorName.val('')
        bookImageUrl.val('')
        publicationYear.val('')
        bookDesc.val('')

        console.log(formData);

    })

    $(document).on('click', '.search-result-item', function () {
        let selectBookID = parseInt($(this).attr('id'))
        searchChooseBookData = searchResultData.find(book => book.id === selectBookID)
        searchAdminResult.addClass('d-none')
        searchAdminInput.val('')
        bookFormValueResult(searchChooseBookData)

    })


    //Function for Action
    function searchResultDropdownRender(data) {

        let searchResultList = $('.search-result-list')

        if (data.error) {
            searchResultList.html(`<p class="text-danger mt-5 text-center h3">${data.message}</p>`)

            setTimeout(() => {
                searchAdminResult.addClass('d-none')
            }, 2000)
            return
        }

        searchResultList.html(data.map(book => `
              <div class="search-result-item cursor-pointer" id=${book.id}>
                <p class="lead">
                    <img src="./src/img/icon/clock.svg" witdh="50" class="mr-2" alt="">
                    <span>
                    ${book.author} ${book.title.slice(0,23)}...
                    </span>
                </p>
              </div>
        `).join(''))
    }

    function bookFormValueResult(obj) {
        bookName.val(obj.title)
        authorName.val(obj.author)
        bookImageUrl.val(obj.smallImageURL)
        publicationYear.val(obj.publicationYear)
    }

    //Api for Admin page
    async function getSearchBook(bookName) {
        let url = `https://goodreads-books.p.rapidapi.com/search?q=${bookName}`
        const settings = {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "goodreads-books.p.rapidapi.com",
                "x-rapidapi-key": "9d9588302emsh58804fa5a30d4d9p1b947ajsn659ea6ae2269"
            }
        };

        try {
            let response = await $.ajax(url, settings)
            searchResultData = response
            console.log(response);

            searchResultDropdownRender(searchResultData)
        } catch (err) {
            // alert('Server Error')
            console.log(err);
        }
    }

})