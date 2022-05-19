$(document).ready(function () {
  //DOM elements
  let searchAdminInput = $("#searchAdminInput");
  let searchAdminResult = $("#searchAdminResult");
  let searchResultData = null;
  let searchChooseBookData = null;

  //Form Inputs
  //Book form
  let bookName = $("#bookName");
  let authorName = $("#authorName");
  let bookImageUrl = $("#bookImageUrl");
  let year = $("#publicationYear");
  let isNew = $("#isNew");
  let bookDesc = $("#bookDesc");
  let bookSelectType = $("#bookSelectType");
  //About form
  let aboutTitle = $("#aboutTitle");
  let aboutDesc = $("#aboutDesc");
  let aboutImageUrl = $("#aboutImageUrl");

  //Call Project Functions
  adminLogin("/admin", JSON.parse(localStorage.getItem("admin")));
  getJoin("/join");
  getContacts("/contact");
  getAboutInfo("/about");
  getCatalog("/catalog/");
  // updateDatabaseData('/admin',{username:"adminadmin",password:1234})

  //Event Buttons
  searchAdminInput.on("input", function () {
    let value = $(this).val();

    if (value.length < 3) {
      searchAdminResult.addClass("d-none");
      return;
    }

    if (value.trim() === "") {
      return;
    }

    searchAdminResult.removeClass("d-none");
    getSearchBook(value);
  });
  bookDesc.on("input", function () {
    let descArea = $(this).val();
    $(this).siblings("span").html(` ${descArea.length} / 100`);
    $(this).siblings("span").removeClass("text-danger");

    if (descArea.length > 100) {
      textAreaCount = true;
      $(this).siblings("span").addClass("text-danger");
    }
  });

  $("#bookFormSubmit").on("click", function (e) {
    e.preventDefault();

    let validate = false;
    validator(authorName, validate);
    validator(bookName, validate);
    validator(bookImageUrl, validate);
    validator(year, validate);
    validator(bookDesc, validate);
    validator(bookSelectType, validate);

    let author = authorName.val(),
      title = bookName.val(),
      img_url = bookImageUrl.val(),
      is_new = isNew.is(":checked"),
      publicationYear = year.val(),
      description = bookDesc.val().trim(),
      catalog = bookSelectType.val();

    if (author.trim() === "") {
      validate = true;
      validator(authorName, validate, "Please Enter Author name");
    }

    if (title.trim() === "") {
      validate = true;
      validator(bookName, validate, "Please Enter Book name");
    }

    if (img_url.trim() === "") {
      validate = true;
      validator(bookImageUrl, validate, "Please Enter Image url");
    }

    if (publicationYear.trim() === "") {
      validate = true;
      validator(year, validate, "Please Enter publication year");
    }

    if (description.trim() === "") {
      validate = true;
      validator(bookDesc, validate, "Please Enter description");
    }

    if (catalog.trim() === "") {
      validate = true;
      validator(bookSelectType, validate, "Please Enter Catalog");
    }

    if (!validate) {
      $("#bookFormAlert").fadeOut();
      let formData = {
        author,
        title,
        img_url,
        is_new,
        publicationYear,
        description,
        catalog,
      };

      writeDatabaseData("/books/", formData);

      bookName.val("");
      authorName.val("");
      bookImageUrl.val("");
      year.val("");
      bookDesc.val("");
    }
  });

  $("#aboutFormSubmit").on("click", function (e) {
    e.preventDefault();
    let validate = false;
    validator(aboutTitle, validate);
    validator(aboutImageUrl, validate);
    validator(aboutDesc, validate);

    if (aboutTitle.val().trim() === "") {
      validate = true;
      validator(aboutTitle, validate, "Please Enter About Title");
    }

    if (aboutImageUrl.val().trim() === "") {
      validate = true;
      validator(aboutImageUrl, validate, "Please Enter Image url");
    }

    if (aboutDesc.val().trim() === "") {
      validate = true;
      validator(aboutDesc, validate, "Please Enter About Description");
    }

    if (!validate) {
      let formData = {
        title: aboutTitle.val().trim(),
        img_url: aboutImageUrl.val(),
        description: aboutDesc.val().trim(),
      };
      updateDatabaseData("/about/", formData);
    }
  });

  $("#adminPanelLogin").on("click", function () {
    //Admin login form
    let adminUserName = $("#userName");
    let adminPassword = $("#password");

    if (
      adminUserName.val().trim() === "" ||
      adminPassword.val().trim() === ""
    ) {
      $(".admin-error").fadeIn(125);
      return;
    }

    $(".admin-error").fadeOut(125);
    $(".admin-success").fadeIn(125);

    let formData = {
      username: adminUserName.val(),
      password: adminPassword.val(),
    };
    localStorage.setItem("admin", JSON.stringify(formData));

    setTimeout(() => {
      adminLogin("/admin/", formData);
    }, 1200);
  });

  $(document).on("click", ".search-result-item", function () {
    let selectBookID = $(this).attr("id");
    searchChooseBookData = searchResultData.find(
      (book) => book.id === selectBookID
    );
    searchAdminResult.addClass("d-none");
    searchAdminInput.val("");
    bookFormValueResult(searchChooseBookData);
  });

  $(document).on("click", "#adminLogout", function () {
    adminLogout();
  });

  $("#addTypeBtn").on("click", function (e) {
    e.preventDefault();
    let catalog = $("#addType");

    let formData = {
      catalog: catalog.val(),
    };

    writeDatabaseData("/catalog/", formData);

    catalog.val("");

    getCatalog("/catalog/");
  });

  //Function for Action
  function searchResultDropdownRender(data) {
    let searchResultList = $(".search-result-list");

    if (data.error) {
      searchResultList.html(
        `<p class="text-danger mt-5 text-center h3">${data.message}</p>`
      );

      setTimeout(() => {
        searchAdminResult.addClass("d-none");
      }, 2000);
      return;
    }

    searchResultList.html(
      data
        .map(
          (book) => `
              <div class="search-result-item cursor-pointer" id=${book.id}>
                <p class="lead">
                    <img src="./src/img/icon/clock.svg" witdh="50" class="mr-2" alt="">
                    <span>
                    ${
                      book.volumeInfo?.authors?.[0]
                    } ${book.volumeInfo?.title?.slice(0, 23)}...
                    </span>
                </p>
              </div>
        `
        )
        .join("")
    );
  }

  function bookFormValueResult(obj) {
    bookName.val(obj?.volumeInfo?.title);
    authorName.val(obj?.volumeInfo?.authors[0]);
    bookImageUrl.val(obj?.volumeInfo?.imageLinks?.thumbnail);
    bookDesc.val(obj?.volumeInfo?.description);
    year.val(obj?.volumeInfo?.publishedDate ?? "");
  }

  function validator(element, error, text) {
    if (error) {
      element.css({
        border: "1px solid red",
      });
      element.siblings("small").fadeIn();
      element.siblings("small").html(text);
      return;
    }
    element.css({
      borderColor: "green",
    });
    element.siblings("small").fadeOut();
  }

  function adminLogout() {
    localStorage.clear("admin");
    window.location.reload();
  }

  //----------------API-----------
  async function getSearchBook(bookName) {
    let url = `https://www.googleapis.com/books/v1/volumes?q=${bookName}`;
    const settings = {
      method: "GET",
      // "headers": {
      //     "x-rapidapi-host": "goodreads-books.p.rapidapi.com",
      //     "x-rapidapi-key": "9d9588302emsh58804fa5a30d4d9p1b947ajsn659ea6ae2269"
      // }
    };

    try {
      let response = await $.ajax(url, settings);
      searchResultData = response.items;

      searchResultDropdownRender(searchResultData);
    } catch (err) {
      // alert('Server Error')
      console.log(err);
    }
  }

  function writeDatabaseData(collection, data) {
    try {
      database.ref(collection).push().set(data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  function updateDatabaseData(collection, data) {
    try {
      database.ref(collection).set(data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  function adminLogin(collection, form) {
    let adminPanel = $("#adminPanel");
    let adminSignPanel = $("#adminSignPanel");

    if (!form) {
      adminSignPanel.fadeIn(300);
      return;
    }

    database.ref(collection).on("value", (res) => {
      let adminPanelObj = res.val();

      if (
        adminPanelObj.username !== form.username ||
        adminPanelObj.password.toString() !== form.password
      ) {
        $(".admin-success").fadeOut(0);
        $(".admin-error").fadeIn(100);

        adminPanel.fadeOut();
        adminSignPanel.fadeIn();
        return;
      }

      if (
        adminPanelObj.username === form.username &&
        adminPanelObj.password.toString() === form.password
      ) {
        adminPanel.fadeIn();

        adminSignPanel.fadeOut();
        $(".admin-success").fadeIn(125);
        return;
      }
    });
  }

  function getJoin(collection) {
    let joinTable = $("#joinTable");

    database.ref(collection).on("value", (res) => {
      let dataObjects = res.val();
      let array = Object.entries(dataObjects);

      let data = array.map((item) => {
        return {
          id: item[0],
          ...item[1],
        };
      });
      joinTable.html(
        data
          .map(
            (user, index) => `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
             </tr>
  
        `
          )
          .join("")
      );
    });
  }

  function getContacts(collection) {
    let contactTable = $("#contactTable");

    database.ref(collection).on("value", (res) => {
      let dataObjects = res.val();
      let array = Object.entries(dataObjects);

      let data = array.map((item) => {
        return {
          id: item[0],
          ...item[1],
        };
      });

      contactTable.html(
        data
          .map(
            (user, index) => `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${user.full_name}</td>
                <td>${user.address}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
             </tr>
  
        `
          )
          .join("")
      );
    });
  }

  function getAboutInfo(collection) {
    database.ref(collection).on("value", (res) => {
      let aboutInfoData = res.val();

      aboutTitle.val(aboutInfoData.title);
      aboutDesc.val(aboutInfoData.description);
      aboutImageUrl.val(aboutInfoData.img_url);
    });
  }

  function getCatalog(collection) {
    bookDesc.val("");
    database.ref(collection).on("value", (res) => {
      let catalogData = Object.values(res.val());
      $("#bookSelectType").html(
        catalogData.map((type, index) => {
          return `<option value="${index + 1}">${type.catalog}</option>`;
        })
      );
    });
  }
});
