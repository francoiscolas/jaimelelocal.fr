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

  //
  // Map

  var Map = function (options) {
    this.$el     = options.$el;
    this.details = new google.maps.InfoWindow();
    this.map     = new google.maps.Map(this.$el.get(0), {
      zoom     : 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.places = [];

    this.addPlaces($.parseJSON($('#places-map-data').text()));
  };

  Map.prototype.template = _.template(
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

  Map.prototype.$ = function (selector) {
    return this.$el.find(selector);
  };

  Map.prototype.addPlace = function (place) {
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

  Map.prototype.addPlaces = function (places) {
    _.forEach(places, _.bind(this.addPlace, this));
  };

  Map.prototype.selectPlace = function (place) {
    place = _.clone(place);
    place.description = place.description.replace(/\n/g, '<br>');

    this.details.setContent(this.template(place));
    this.details.open(this.map, place.marker);
  };

  //
  // Main

  var $map = $('.places-map');

  if ($('body').is('.is-owner')) {
    new Header({$el: $('.banner')});
  }

  if ($map.length) {
    new Map({$el: $map});

    // make places tabs clickable, to switch between map and list.
    $('button.places-tabs-title').click(function () {
      var $button = $(this);

      $('.places-tabs-panel').hide();
      $('#' + $button.attr('data-target')).show();
      $button.siblings().removeClass('is-active');
      $button.addClass('is-active');
    });
  }

}});
