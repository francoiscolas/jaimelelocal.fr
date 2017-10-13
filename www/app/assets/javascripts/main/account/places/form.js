$(function () { if ($('body.new-user-farm-place, body.edit-user-farm-place').length == 1) {

  var Form = function () {
    _.bindAll(this, _.functions(Form.prototype));

    this.$form = $('form');
    this.$form.on('submit', this._onSubmit);

    this.$address = $('#place_address');
    this.$address.on('keypress', function disableReturnKey(e) { if (e.which === 13) return false; });
    this.$lat = $('#place_lat');
    this.$lng = $('#place_lng');

    this.geocoder = new google.maps.Geocoder();

    this.autocomplete = new google.maps.places.Autocomplete(this.$address.get(0), {componentRestrictions: {country: 'FR'}});
    google.maps.event.addListener(this.autocomplete, 'place_changed', this._onAddressChanged);

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
    if (this.$lat.val() && this.$lng.val())
      this.setMarkerPosition(new google.maps.LatLng(+this.$lat.val(), +this.$lng.val()));
    google.maps.event.addListener(this.marker, 'position_changed', this._onMarkerPositionChanged);
  };

  Form.prototype.setMarkerPosition = function (position) {
    this.marker.setPosition(position);
    this.map.setCenter(position);
    this.map.setZoom(17);
  };

  Form.prototype._onMarkerPositionChanged = function () {
    var position = this.marker.getPosition();

    this.$lat.val(position.lat());
    this.$lng.val(position.lng());
  };

  Form.prototype._onAddressChanged = function () {
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

  Form.prototype._onSubmit = function () {
    if (!this.$address.val() || !this.$lat.val() || !this.$lng.val()) {
      this.$address.focus();
      return false;
    }
  };

  new Form();

}});
