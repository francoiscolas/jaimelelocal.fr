$(function () { if ($('body.home').length == 1) {

  //
  // Search form

  var Form = function (options) {
    this.$el = options.$el;

    this.$form = this.$('form');

    this.$q = this.$('#q');
    this.$q.on('change', this.submit.bind(this));
    this.$q.on('autocompleteselect', function () {
      _.defer(this.$q.change.bind(this.$q)); }.bind(this));

    this.$l = this.$('#l');
    var geocoder = new google.maps.Geocoder();
    var autocomplete = new google.maps.places.Autocomplete(this.$l.get(0), {
      componentRestrictions: {country: 'FR'},
      types                : ['(cities)']
    });
    google.maps.event.addListener(autocomplete, 'place_changed', this.submit.bind(this));

    this.$d = this.$('#d');
    this.$d.on('change', this.submit.bind(this));

    window.onpopstate = this._onHistoryBack.bind(this);
  };

  Form.prototype.$ = function (selector) {
    return this.$el.find(selector);
  };

  Form.prototype.submit = function () {
    this.$form.submit();
  };

  Form.prototype._onSuccess = function (content) {
    var state = {
      q: this.$q.val(),
      l: this.$l.val(),
      d: this.$d.val(),
      content: content
    };
    window.history.pushState(state, null,
      '/?q=' + state.q + '&l=' + state.l + '&d=' + state.d);
    this.$('.content').html(content);
  };

  Form.prototype._onHistoryBack = function (e) {
    console.log(e, e.state);
    if (e.state) {
      this.$q.val(e.state.q);
      this.$l.val(e.state.l);
      this.$d.val(e.state.d);
      this.$('.content').html(e.state.content);
    } else {
      window.location.reload();
    }
  };

  //
  // Main

  window.home = {
    form: new Form({$el: $('.home')})
  };

}});
