$(function () {

  //
  // Bind flash's close button.

  var flashBtn = $('.flash.row .close-button');

  if (flashBtn.length > 0) {
    setTimeout(function () {
      flashBtn.click();
    }, 7000);
  }

});
