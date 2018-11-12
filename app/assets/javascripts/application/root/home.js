$(function () {

  if ($('body.home').length == 0)
    return ;

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

    this.$d = this.$('#d');
    this.$d.on('change', this.submit.bind(this));

    this.$noQuery = this.$('.no-query');
    this.$noFarm = this.$('.no-farm');

    this.geocoder = new google.maps.Geocoder();
    this.autocomplete = new google.maps.places.Autocomplete(this.$l.get(0), {
      componentRestrictions: {country: 'FR'},
      types                : ['(cities)']
    });
    google.maps.event.addListener(this.autocomplete,
      'place_changed', this.submit.bind(this));

    this.map = new google.maps.Map(document.getElementById('map'));
    this.$map = $(this.map.getDiv());

    this.lmarker = new google.maps.Marker({
      map : this.map,
      icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png',
    });

    this.infoWindow = new google.maps.InfoWindow();

    this.farms = [];
    this.markers = [];

    window.onpopstate = this._onHistoryBack.bind(this);
  };

  Form.infoWindowTpl = _.template($('#infowindow-tpl').html());

  Form.prototype.$ = function (selector) {
    return this.$el.find(selector);
  };

  Form.prototype.submit = function () {
    $('.loading-bar').show();
    this.$form.submit();
  };

  Form.prototype.setResult = function (result, saveState /*= true*/) {
    var bounds = new google.maps.LatLngBounds();

    if (saveState !== false) {
      window.history.pushState(result, null,
        '/?q=' + result.q + '&l=' + result.l + '&d=' + result.d);
    }

    this.$q.val(result.q);
    this.$l.val(result.l);
    this.$d.val(result.d);
    this.farms = result.farms;

    if (_.isEmpty(result.q) && _.isEmpty(result.l)) {
      this.$noQuery.show();
      this.$noFarm.hide();
      this.$map.hide();
    } else if (_.isEmpty(result.farms)) {
      this.$noQuery.hide();
      this.$noFarm.show();
      this.$map.hide();
    } else {
      this.$noQuery.hide();
      this.$noFarm.hide();
      this.$map.show();

      this.markers.forEach(function (marker) {
        marker.setMap(null);
      });
      if (this.markers.length > result.farms.length) {
        this.markers.splice(-(this.markers.length
          - result.farms.length));
      }
      if (this.markers.length < result.farms.length) {
        while (this.markers.length != result.farms.length) {
          var marker;
          
          marker = new google.maps.Marker();
          marker.addListener('click', this.showInfoWindow.bind(this, marker));
          this.markers.push(marker);
        }
      }

      this.markers.forEach(function (marker, i) {
        marker.setPosition({
          lat: result.farms[i].lat,
          lng: result.farms[i].lng,
        });
        marker.setMap(this.map);
        bounds.extend(marker.getPosition());
      }, this);

      this.lmarker.setPosition(
        (result.lat && result.lng)
          ? _.pick(result, 'lat', 'lng')
          : null
      );
      if (this.lmarker.getPosition())
        bounds.extend(this.lmarker.getPosition());

      this.map.fitBounds(bounds);
    }

    $('.loading-bar').hide();
  };

  Form.prototype.showInfoWindow = function (marker) {
    var i = this.markers.indexOf(marker);

    if (i >= 0 && i < this.farms.length) {
      this.infoWindow.setContent(Form.infoWindowTpl({farm: this.farms[i]}));
      this.infoWindow.open(this.map, marker);
    }
  };

  Form.prototype._onHistoryBack = function (e) {
    if (e.state)
      this.setResult(e.state, false);
    else
      window.location.reload();
  };

  //
  // Main

  window._form = new Form({$el: $('.home')});

});
