$(function () {

  if ($('body.new-user-farm, body.edit-user-farm').length == 1) {
    var $name = $('#farm_name');
    var $path = $('#farm_url');
    var $website = $('#farm_website');

    var sanitize = function (value) {
      return rmAccents(value)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '');
    };

    $name.on('keyup blur', function () {
      $path.val(sanitize($name.val()));
    });
    $path.on('keyup', function () {
      $path.val(sanitize($path.val()));
    });
    $website.on('blur', function () {
      var value = $website.val();

      if (value && !value.startsWith('http'))
        $website.val('http://' + value);
    });
  }

  if ($('body.user-farm').length == 1) {
    var bindList = function (options) {
      var that = this;

      that.$el         = options.$el;
      that.$destroyBtn = that.$el.find(':submit').disabled(true);
      that.$checkboxs  = that.$el.find(':checkbox').checked(false);
      that.$checkboxs.on('change', function (e) {
        that.$el.find(e.target).toggleClass('selected');
        that.$destroyBtn.disabled(!that.$checkboxs.filter(':checked').length);
      });
    };

    bindList({$el: $('#places-ui')});
  }

  var rmAccents = function (str) {
    var accents = {
      "á": "a",
      "à": "a",
      "â": "a",
      "ä": "a",
      "ç": "c",
      "é": "e",
      "è": "e",
      "ê": "e",
      "ë": "e",
      "î": "i",
      "ï": "i",
      "ô": "o",
      "ö": "o",
      "ù": "u",
      "û": "u",
      "ü": "u",
      "Â": "A",
      "Ä": "A",
      "À": "A",
      "Ç": "C",
      "Ê": "E",
      "Ë": "E",
      "É": "E",
      "È": "E",
      "Î": "I",
      "Ï": "I",
      "Ô": "O",
      "Ö": "O",
      "Û": "U",
      "Ü": "U",
      "Ù": "U"
    };

    for (var c in accents)
      str = str.replace(c, accents[c]);
    return str;
  };

});
