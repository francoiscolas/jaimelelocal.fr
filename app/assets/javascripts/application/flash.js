$(function () {

  //
  // Bind flash's close button.

  var flashBtn = $('.flash button');

  flashBtn.on('click', function () {
    $(this).parent().fadeOut();
  });

  setTimeout(function () {
    flashBtn.click();
  }, 7000);

});
