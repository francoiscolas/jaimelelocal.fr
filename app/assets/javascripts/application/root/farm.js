$(function () {

  /**
   * Farm's "page" attribute description :
   * [{
   *   "type": 'text' | 'map',
   *   "data": <text>, // if type == text
   *   "data": null,   // if type == map
   * }, ...]
   */
  
  var root = $('body.farm');
  if (root.length == 0)
    return ;

  var isOwner = root.is('.is-owner');

  //
  // Header

  var Header = function () {
    this.$el = $('.banner');
    this.$el.on('click', '.remove-banner.action-btn', _.bind(this.submitForm, this));
    this.$el.on('change', 'input[type=file]', _.bind(this.submitForm, this));
  };

  Header.prototype.submitForm = function () {
    this.$el.find('form').submit();
    return false;
  };

  //
  // Rows

  var Rows = function () {
    var that = this;

    this.$el = $('#farm-rows');
    this.data = window.farm.page;

    $(document).on('click', function (event) {
      var $el = $(event.target);

      if ($el.is('.add-row button'))
        that.onAddRowBtnClick($el);
      else if ($el.is('.edit-row button'))
        that.onEditRowBtnClick($el);
    });

    _.forEach(this.data, function (row, i) {
      that.insertRow(row, i);
    });
    this.$el.append($(Rows.addTemplate()));
  };

  Rows.types = (function (types) {
    var desc = {};

    _.forEach(types, function (type) {
      desc[type] = {
        template: _.template($((isOwner ? '#edit-' : '#') + type + '-template').html()),
        saveFunc: 'saveTextRow',
      };
    });
    return desc;
  })(['text', 'map']);

  Rows.addTemplate = _.template($('#add-template').html());

  Rows.editTemplate = _.template($('#edit-template').html());

  Rows.prototype.insertRow = function (desc, i) {
    var type = Rows.types[desc.type];

    if (type) {
      var $row  = $(type.template({i: i, farm: window.farm, data: desc.data}));
      var $rows = this.$el.find('.farm-row');
  
      if (i == 0)
        this.$el.prepend($row);
      else
        $row.insertAfter($rows[i - 1]);
      if (isOwner) {
        $(Rows.addTemplate()).insertBefore($row);
        $(Rows.editTemplate()).insertBefore($row);
      }
    }
  };

  Rows.prototype.onAddRowBtnClick = function ($btn) {
    var type = $btn.attr('class').match(/add-([a-z]+)-row/)[1];
    var $rows = this.$el.find('.farm-row');
    
    this.insertRow(
      {type: type, data: null},
      $rows.index($btn.parents('.add-row').prev('.farm-row')) + 1
    );
  };

  Rows.prototype.onEditRowBtnClick = function ($btn) {
    var type = $btn.attr('class').match(/([a-z]+)-row/)[1];
    var $row = $btn.parents('.edit-row').next();

    switch (type) {
      case 'remove':
        $row.prev().remove();
        $row.prev().remove();
        $row.remove();
        break;
    }
  };

  //
  // Main

  new Header();
  new Rows();

});
