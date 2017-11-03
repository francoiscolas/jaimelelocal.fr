$(function () {

  var List = function (options) {
    this.$el = options.$el;

    this.$destroyBtn = this.$(':submit').disabled(true);

    this.$checkboxs = this.$(':checkbox').checked(false);
    this.$checkboxs.on('change', _.bind(this._onChange, this));

    this.$trs = this.$('tr');
    this.$trs.on('click', _.bind(this._onClick, this));
    this.$trs.on('mouseenter', _.bind(this.showDetails, this));
    this.$trs.on('mouseleave', _.bind(this.delayHideDetails, this));

    this.$input = this.$('.cl-list-filter');
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

  $('.cl-list').each(function () { new List({$el: $(this)}); });

});
