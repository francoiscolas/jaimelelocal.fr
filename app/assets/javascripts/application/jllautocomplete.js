/**
 * To activate this piece of code :
 * <select name="..." multiple jllAutocomplete></select>
 */
$.fn.extend({
  jllAutocomplete: function () {
    var _init = function ($select) {
      if (!$select.is('select'))
        throw new Error('jllAutocomplete: this must be a <select> tag')
      $select.hide();
     
      var $root = $(''
        +'<div class="form-autocomplete">'
          +'<div class="form-autocomplete-input form-input">'
            +'<input class="form-input" type="text"/>'
          +'</div>'
        +'</div>'
      ).insertAfter($select).on('click', '.chip a.btn-clear', function () {
        _deselect($root, $options, $(this).parent());
      });

      var $options = $select.find('option');

      var $input = $root.find('input')
        .on('focusin focusout', function (e) {
          $input.parent().toggleClass('is-focused');
        })
        .on('keydown', function (e) {
          if (e && e.keyCode == 13) {
            if (e.preventDefault)
              e.preventDefault();
            return false;
          }
        })
        .autocomplete({
          delay: 0,
          autoFocus: true,
          source: function (request, response) {
            var term = _.toLower(_.deburr(request.term));
            response($.grep($input._JLL_SOURCE, function (item) {
              return (_.toLower(_.deburr(item.label)).indexOf(term) >= 0);
            }));
          },
          focus: function (e, ui) {
            if (e && e.preventDefault)
              e.preventDefault();
            return false;
          },
          select: function (e, ui) {
            _select($root, $input, $options, ui.item);
            if (e && e.preventDefault)
              e.preventDefault();
            return false;
          },
        });
      $input._JLL_SOURCE = _.map($options.toArray(), function (option) {
        return {label: _.trim(option.innerText), value: option.value};
      });
      $options.filter(':selected').each(function () {
        var $option = $(this);
        _select($root, $input, $options, {
          label: _.trim($option.text()),
          value: $option.val(),
        });
      });
    };
    var _select = function ($root, $input, $options, item) {
      $input.val('');

      $(''
        +'<div class="chip" data-value="' + item.value + '">'
          + item.label +'<a class="btn btn-clear"></a>'
        +'</div>').insertBefore($input);

      $options.filter('[value=' + item.value + ']')
        .attr('selected', '');
    };
    var _deselect = function ($root, $options, $chip) {
      var value = $chip.remove().data('value');
      $options.filter('[value=' + value + ']').removeAttr('selected');
    };
    return this.each(function () {_init($(this))});
  }
});

$(function () {
  $('select[jllAutocomplete]').jllAutocomplete();
});
