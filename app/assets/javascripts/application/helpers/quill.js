window.Helpers || (window.Helpers = {});
window.Helpers.newQuill = function (selector) {
  return new Quill(selector, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{header:1}, {header:2}],
        ['bold', 'italic', 'underline', 'strike', 'link'],
        [{color:[]}, {background:[]}],
        [{list:'bullet'}, {list:'ordered'}, {align:[]}, {indent:'-1'}, {indent:'+1'}],
        ['clean'],
      ]
    }
  });
};
