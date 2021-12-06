$(document).ready(function () {
    // ----------------- ADMIN PAGE ------------------------ 
    //DOM elements
    let adminPanelLogin = $('#adminPanelLogin')
    let searchAdminInput = $('#searchAdminInput')
    let searchAdminResult = $('#searchAdminResult')
    let bookFormSubmit = $('#bookFormSubmit')
    let aboutFormSubmit = $('#aboutFormSubmit')
    let searchResultData = null
    let searchChooseBookData = null

    //Form Inputs
    //Admin login form
    let adminUserName = $('#userName');
    let adminPassword = $('#password');

    //Book form
    let bookName = $('#bookName');
    let authorName = $('#authorName');
    let bookImageUrl = $('#bookImageUrl');
    let publicationYear = $('#publicationYear');
    let bookDesc = $('#bookDesc');
    let bookSelectType = $('#bookSelectType')
    //About form
    let aboutTitle = $('#aboutTitle')
    let aboutDesc = $('#aboutDesc')
    let aboutImageUrl = $('#aboutImageUrl')

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

    //Call Project Functions
    // getBooks('/books')
    adminLogin('/admin', JSON.parse(localStorage.getItem('admin')))
    getJoin('/join')
    getContacts('/contact')
    getAboutInfo('/about')
    // updateDatabaseData('/admin',{username:"adminadmin",password:1234})
    // writeDatabaseData('/join',{full_name:'Elshad Agazade',email:"rahimlisarkhan@gmail.com"})
    // writeDatabaseData('/join',{full_name:'Elshad Agazade',email:"rahimlisarkhan@gmail.com"})
    // writeDatabaseData('/contact',{full_name:'Sabina Ganieva',address:"1921 Ranchview Dr undefined San Francisco",email:"rahimlisarkhan@gmail.com",phone:"+9942222222"})

    //Event Buttons
    searchAdminInput.on('input', function () {
        let value = $(this).val()

        if (value.length < 3) {
            searchAdminResult.addClass('d-none')
            return
        }

        if (value.trim() === '') {
            return
        }

        searchAdminResult.removeClass('d-none')
        getSearchBook(value)


    })

    bookFormSubmit.on('click', function (e) {
        e.preventDefault();

        let formData = {
            author: authorName.val(),
            title: bookName.val(),
            img_url: bookImageUrl.val(),
            publicationYear: publicationYear.val(),
            description: bookDesc.val().trim(),
            catalog: bookSelectType.val()
        }

        writeDatabaseData('/books/', formData)

        bookName.val('')
        authorName.val('')
        bookImageUrl.val('')
        publicationYear.val('')
        bookDesc.val('')

    })

    aboutFormSubmit.on('click', function (e) {
        e.preventDefault();

        let formData = {
            title: aboutTitle.val().trim(),
            img_url: aboutImageUrl.val(),
            description: aboutDesc.val().trim(),
        }

        updateDatabaseData('/about/', formData)

    })

    adminPanelLogin.on('click', function () {
        let formData = {
            username: adminUserName.val(),
            password: adminPassword.val()
        }

        localStorage.setItem('admin', JSON.stringify(formData))

        adminLogin('/admin/', formData)

    })

    $(document).on('click', '.search-result-item', function () {
        let selectBookID = parseInt($(this).attr('id'))
        searchChooseBookData = searchResultData.find(book => book.id === selectBookID)
        searchAdminResult.addClass('d-none')
        searchAdminInput.val('')
        bookFormValueResult(searchChooseBookData)

    })

    $(document).on('click', '#adminLogout', function () {
        adminLogout()
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

    function adminLogout() {
        localStorage.clear('admin')
        window.location.reload()
    }


    //----------------API-----------
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

    function adminLogin(collection, form) {
        let adminPanel = $('#adminPanel')
        let adminSignPanel = $('#adminSignPanel')

        database.ref(collection).on('value', (res) => {
            let adminPanelObj = res.val()

            if (!form) {
                adminSignPanel.fadeIn(300)
                return
            }

            if (adminPanelObj.username === form.username && adminPanelObj.password.toString() === form.password) {
                adminPanel.fadeIn()
                adminSignPanel.fadeOut()
                return
            }

        })
    }

    function getJoin(collection) {
        let joinTable = $('#joinTable')

        database.ref(collection).on('value', (res) => {
            let dataObjects = res.val()
            let array = Object.entries(dataObjects)

            let data = array.map(item => {
                return {
                    id: item[0],
                    ...item[1]
                }
            })
            joinTable.html(data.map((user, index) => `
            <tr>
                <th scope="row">${index+1}</th>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
             </tr>
  
        `).join(''))
        })
    }

    function getContacts(collection) {
        let contactTable = $('#contactTable')

        database.ref(collection).on('value', (res) => {
            let dataObjects = res.val()
            let array = Object.entries(dataObjects)

            let data = array.map(item => {
                return {
                    id: item[0],
                    ...item[1]
                }
            })

            contactTable.html(data.map((user, index) => `
            <tr>
                <th scope="row">${index+1}</th>
                <td>${user.full_name}</td>
                <td>${user.address}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
             </tr>
  
        `).join(''))
        })
    }

    function getAboutInfo(collection) {
        database.ref(collection).on('value', (res) => {
            let aboutInfoData = res.val()

            aboutTitle.val(aboutInfoData.title)
            aboutDesc.val(aboutInfoData.description)
            aboutImageUrl.val(aboutInfoData.img_url)
        })
    }

})