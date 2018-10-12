$(function () {

  var root = $('body.new-user-farm, body.edit-user-farm');
  if (root.length === 0)
    return ;

  //
  // Build farm_url attribute.

  var $name = $('#farm_name');
  var $path = $('#farm_url');

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
      str = str.replace(new RegExp(c, 'g'), accents[c]);
    return str;
  };

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

  //
  // Ensure farm_website attribute starting with 'http://'.

  var $website = $('#farm_website');

  $website.on('blur', function () {
    var value = $website.val();

    if (value && !value.startsWith('http'))
      $website.val('http://' + value);
  });

  //
  // Ensure farm_lat and farm_lng are well defined.

  var Geocoder = function () {
    this.$form = root.find('form');
    this.$form.on('submit', _.bind(this._onSubmit, this));

    this.$address = root.find('#farm_address');
    this.$address.on('keypress', function (e) {
      if (e.which === 13) return false; });
    this.$lat = root.find('#farm_lat');
    this.$lng = root.find('#farm_lng');

    this.geocoder = new google.maps.Geocoder();

    this.autocomplete = new google.maps.places.Autocomplete(this.$address.get(0), {componentRestrictions: {country: 'FR'}});
    google.maps.event.addListener(this.autocomplete, 'place_changed', _.bind(this._onAddressChanged, this));

    this.map  = new google.maps.Map(document.getElementById('map'), {
      center   : new google.maps.LatLng(46.2276380, 2.2137490),
      zoom     : 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.marker = new google.maps.Marker({
      map      : this.map,
      draggable: true,
      animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(this.marker, 'position_changed', _.bind(this._onMarkerPositionChanged, this));

    if (this.$lat.val() && this.$lng.val())
      this.setMarkerPosition(new google.maps.LatLng(+this.$lat.val(), +this.$lng.val()));
    else if (this.$address.val())
      this._onAddressChanged();
  };

  Geocoder.prototype.setMarkerPosition = function (position) {
    this.marker.setPosition(position);
    this.map.setCenter(position);
    this.map.setZoom(17);
  };

  Geocoder.prototype._onMarkerPositionChanged = function () {
    var position = this.marker.getPosition();

    this.$lat.val(position.lat());
    this.$lng.val(position.lng());
  };

  Geocoder.prototype._onAddressChanged = function () {
    var place    = this.autocomplete.getPlace();
    var position = (place && place.geometry) ? place.geometry.location : null;

    if (position) {
      this.setMarkerPosition(position);
    } else {
      this.geocoder.geocode({address: this.$address.val()}, _.bind(function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
          this.$address.val(results[0].formatted_address);
          this.setMarkerPosition(results[0].geometry.location);
        }
      }, this));
    }
    return false;
  };

  Geocoder.prototype._onSubmit = function () {
    if (!this.$address.val() || !this.$lat.val() || !this.$lng.val()) {
      this.$address.focus();
      return false;
    }
  };

  new Geocoder();

});
