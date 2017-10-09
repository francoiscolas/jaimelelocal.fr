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

    //
    // Header

    var Header = function (options) {
      this.$el = options.$el;
      this.$el.on('click', '#remove-banner-btn', _.bind(this.submitForm, this));
      this.$el.on('change', 'input[type=file]', _.bind(this.submitForm, this));
    };

    Header.prototype.submitForm = function () {
      this.$el.find('form').submit();
      return false;
    };

    //
    // List

    var List = function (options) {
      this.$el = options.$el;

      this.$destroyBtn = this.$el.find(':submit').disabled(true);

      this.$checkboxs = this.$el.find(':checkbox').checked(false);
      this.$checkboxs.on('change', _.bind(this._onChange, this));

      this.$trs = this.$el.find('tr');
      this.$trs.on('click', _.bind(this._onClick, this));
    };

    List.prototype._onChange = function (e) {
      $(e.target).parents('tr').toggleClass('selected');
      this.$destroyBtn.disabled(!this.$checkboxs.filter(':checked').length);
    };

    List.prototype._onClick = function (e) {
      if ($(e.target).is(':checkbox, a')) return ;
      $(e.currentTarget).find(':checkbox').click();
    };

    //
    // Main

    new Header({$el: $('#banner')});

    new List({$el: $('#places')});
    new List({$el: $('#products')});
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
