$(function () {
  var top = 'inset 0 7px 7px -7px gray';
  var bot = 'inset 0 -7px 7px -7px gray';

  $('.scrollable')
    .css({
      'overflow-y': 'scroll',
      'box-shadow': top,
    })
    .scroll(function () {
      var $el = $(this);

      if (this.scrollTop == 0)
        $el.css('box-shadow', bot);
      else if (this.scrollTop == (this.scrollHeight - this.offsetHeight))
        $el.css('box-shadow', top);
      else
        $el.css('box-shadow', top + ',' + bot);
    });
});
