const getPosts = (render) => {
  $.ajax({
    url: "https://bloggy-api.herokuapp.com/posts",
    method: "GET",
  }).then((res) => {
    render(res);
  });
};

const createPost = (postData, render, resetInput) => {
  $.ajax({
    url: "https://bloggy-api.herokuapp.com/posts",
    method: "POST",
    data: postData,
  })
    .then(() => {
      getPosts(render);
      resetInput();
    })
    .catch((err) => {
      alert(err);
    });
};
