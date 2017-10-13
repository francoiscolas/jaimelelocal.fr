$(function () { if ($('body.user-farm').length == 1) {

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

}});
