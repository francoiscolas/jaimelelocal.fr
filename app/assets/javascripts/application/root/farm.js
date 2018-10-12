$(function () { if ($('body.farm').length == 1) {

  //
  // Header

  var Header = function (options) {
    this.$el = options.$el;
    this.$el.on('click', '.remove-banner.action-btn', _.bind(this.submitForm, this));
    this.$el.on('change', 'input[type=file]', _.bind(this.submitForm, this));
  };

  Header.prototype.submitForm = function () {
    this.$el.find('form').submit();
    return false;
  };

}});
