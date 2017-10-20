(function ($) {
    $.fn.checked = function (checked) {
        if (checked === undefined)
            return this.first().is(':checked');
        else
            return this.prop('checked', !!checked);
    };
})(jQuery);
