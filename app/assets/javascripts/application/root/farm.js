$(function () { if ($('body.farm').length == 1) {

  if ($('body').is('.is-owner')) {

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

    //
    // Main

    new Header({$el: $('.banner')});

  } else {

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
    // Main

    $places = $('.places-map:not(.is-empty)');
    if ($places.length)
      new Places({$el: $places});

  }

  //
  // List

  var List = function (options) {
    this.$el = options.$el;

    this.$destroyBtn = this.$(':submit').disabled(true);

    this.$checkboxs = this.$(':checkbox').checked(false);
    this.$checkboxs.on('change', _.bind(this._onChange, this));

    this.$trs = this.$('tr');
    this.$trs.on('click', _.bind(this._onClick, this));
    this.$trs.on('mouseenter', _.bind(this.showDetails, this));
    this.$trs.on('mouseleave', _.bind(this.delayHideDetails, this));

    this.$input = this.$('.filter');
    this.$input.val('').on('keyup', _.bind(this._onInputChange, this));
  };

  List.FADE_DURATION = 300;

  List.prototype.$ = function (selector) {
    return this.$el.find(selector);
  }

  List.prototype.showDetails = function (e) {
    var $tr = $(e.currentTarget);
    var top = $tr.height() + 10;

    this.$('tr p').hide();
    $tr.find('p').css('top', top).fadeIn(List.FADE_DURATION);
  }

  List.prototype.hideDetails = function (e) {
    var $tr = $(e.currentTarget);

    $tr.find('p').fadeOut(List.FADE_DURATION);
  }

  List.prototype.delayHideDetails = function (e) {
    clearTimeout(this._hideDetailsTimer);
    this._hideDetailsTimer = _.delay(_.bind(this.hideDetails, this), 200, e);
  }

  List.prototype._onInputChange = function () {
    var pattern = this.$input.val().replace('*', '[\\s\\S]*');

    this.$('tr').each(function (idx, tr) {
      var $tr = $(tr);

      if (!pattern || $tr.text().match(new RegExp(pattern, 'i')))
        $tr.show();
      else
        $tr.hide();
    });
  }

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

  new List({$el: $('.places')});
  new List({$el: $('.products')});

}});
