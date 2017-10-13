$(function () {

  if ($('body.home').length == 1) {

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

  } else if ($('body.farm').length == 1) {
    //
    // Places

    var Places = function (options) {
      this.$el     = options.$el;
      this.details = new google.maps.InfoWindow();
      this.map     = new google.maps.Map(this.$el.get(0), {
        zoom     : 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      this.places = [];

      this.addPlaces($.parseJSON($('#places-data').text()));
    };

    Places.prototype.template = _.template(
      '<div class="place-details">' +
        '<h4><%= name %></h4>' +
        '<p><%= description %></p>' +
        '<h5>Adresse:</h5>' +
        '<p><%= address %></p>' +
        '<h5>Coordonnées GPS:</h5>' +
        '<p>' +
          '<%= (lat > 0) ? "N" : "S" %> <%= Math.abs(lat) %>°<br>' +
          '<%= (lng > 0) ? "E" : "O" %> <%= Math.abs(lng) %>°<br>' +
        '</p>' +
      '</div>'
    );

    Places.prototype.$ = function (selector) {
      return this.$el.find(selector);
    };

    Places.prototype.addPlace = function (place) {
      var center = this.map.getCenter();

      if (center)
        center = new google.maps.LatLng(
          center.lat() + -(center.lat() - place.lat) / 2,
          center.lng() + -(center.lng() - place.lng) / 2
        );
      else
        center = new google.maps.LatLng(place.lat, place.lng);
      this.map.setCenter(center);

      place.marker = new google.maps.Marker({
        map     : this.map,
        position: new google.maps.LatLng(place.lat, place.lng),
        title   : place.name
      });
      google.maps.event.addListener(place.marker, 'click', _.bind(this.selectPlace, this, place));

      this.places.push(place);
    };

    Places.prototype.addPlaces = function (places) {
      _.forEach(places, _.bind(this.addPlace, this));
    };

    Places.prototype.selectPlace = function (place) {
      place = _.clone(place);
      place.description = place.description.replace(/\n/g, '<br>');

      this.details.setContent(this.template(place));
      this.details.open(this.map, place.marker);
    };

    //
    // Products

    var Products = function (options) {
      this.$el = options.$el;
      this.$el.find('li')
        .on('mouseenter', _.bind(this.showDetails, this))
        .on('mouseleave', _.bind(this.delayHideDetails, this));

      this.$input = this.$('input');
      this.$input.val('').on('keyup', _.bind(this._onInputChange, this));
    }

    Products.FADE_DURATION = 300;

    Products.prototype.$ = function (selector) {
      return this.$el.find(selector);
    }

    Products.prototype.showDetails = function (e) {
      var $li = $(e.currentTarget);
      var top = $li.position().top + $li.parent().position().top + $li.height() * 0.7;

      this.$('li p').hide();
      $li.find('p').css('top', top).fadeIn(Products.FADE_DURATION);
    }

    Products.prototype.hideDetails = function (e) {
      var $li = $(e.currentTarget);

      $li.find('p').fadeOut(Products.FADE_DURATION);
    }

    Products.prototype.delayHideDetails = function (e) {
      clearTimeout(this._hideDetailsTimer);
      this._hideDetailsTimer = _.delay(_.bind(this.hideDetails, this), 200, e);
    }

    Products.prototype._onInputChange = function () {
      var pattern = this.$input.val().replace('*', '[\\s\\S]*');

      this.$('li').each(function (idx, li) {
        var $li = $(li);

        if (!pattern || $li.text().match(new RegExp(pattern, 'i')))
          $li.show();
        else
          $li.hide();
      });
    }

    //
    // Main

    $places = $('.places:not(.is-empty)');
    if ($places.length)
      new Places({$el: $places});

    $products = $('.products');
    if ($products.length)
      new Products({$el: $products});
  }
});
