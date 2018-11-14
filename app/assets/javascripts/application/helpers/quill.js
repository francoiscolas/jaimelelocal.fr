window.Helpers || (window.Helpers = {});
window.Helpers.newQuill = function (selector) {
  return new Quill(selector, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{header:1}, {header:2}],
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'image'],
        [{color:[]}, {background:[]}],
        [{list:'bullet'}, {list:'ordered'}, {align:[]}, {indent:'-1'}, {indent:'+1'}],
        ['clean'],
      ]
    }
  });
};

//
// Auto "Quillify" div with data-quill="<input-field-id>" attribute.

$(function () {
  $('div[data-quill]').each(function () {
    var $div   = $(this);
    var $input = $($div.data('quill'));
    var quill  = null;

    $input.parents('form').submit(function () {
      $input.val(quill.root.innerHTML);
    });

    $div.html($input.val());
    quill = window.Helpers.newQuill(this);
  });
});
