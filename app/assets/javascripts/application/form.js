$(function () {

  //
  // Form fields's required property
  (function () {
    var span = $('<span class="required">*</span>');

    $('input[required], textarea[required], select[required]').each(function () {
      var id = $(this).attr('id');

      if (id !== undefined)
        $('label[for=' + id + ']').append(span.clone());
    }).removeAttr('required');
  })();

  //
  // Form fields help message
  /*(function () {
    $('form .form-field-help').each(function () {
      var help  = $(this);
      var input = help.siblings('input:text, textarea, select');
      var last  = input.last();

      if (input.is('input:checkbox')) {
        input = input.siblings('label');
        last  = input.last();
      }

      input.on('mouseenter', function () { help.fadeIn('fast'); })
        .on('mouseleave', function () { help.fadeOut('fast'); });

      help.on('position', function () {
        _.defer(function () {
          var x = (input.is('label')) ? 15 : 15;
          var y = (input.is('label')) ? 10 : 10;

          help.position({
            my: 'left+' + x + ' top-' + y,
            at: 'right top',
            of: last
          }).hide();
        });
      });

      if (help.is(':visible'))
        help.trigger('position');
    });
  })();*/

  //
  // Autoresize textareas
  (function () {
    $('textarea[autoresize=true]').each(function () {
      var input = $(this).css({
        'overflow': 'hidden'
      });
      var div = $(document.createElement('div')).css({
        'display'    : 'none',
        'font-family': input.css('font-family'),
        'font-size'  : input.css('font-size'),
        'min-height' : '20px',
        'padding'    : input.css('padding'),
        'white-space': 'pre-wrap',
        'width'      : input.width(),
        'word-wrap'  : 'break-word'
      });

      input.parent().append(div).keyup(function () {
        div.html(input.val().replace(/\n/g, '<br>') + '<br>');
        input.height(div.height());
      }).keyup();
    });
  })();

  //
  // Autocomplete
  (function () {
    $('input[data-autocomplete-url]').each(function () {
      $(this).autocomplete({delay: 0, source: $(this).data('autocomplete-url')});
    });
  })();

});
