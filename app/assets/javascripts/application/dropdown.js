$.fn.dropdown = function () {
  var paneId = this.data('dropdown-pane');
  var $pane  = $(document.getElementById(paneId)).css({
    'display' : 'none',
    'position': 'absolute',
    'z-index' : 100000
  });
  var $btn   = this;

  $(document).on('mouseup', function (e) {
    if (!$pane.is(e.target) && $pane.has(e.target).length == 0)
      $pane.hide();
  });
  $btn.on('click', function () {
    var bo = $btn.offset();
    $pane.toggle().position({
      my: 'top left',
      at: 'bottom right',
      of: $btn,
    });
  });
  return this;
};
$(function () {
  $('[data-dropdown-pane]').dropdown();
});
