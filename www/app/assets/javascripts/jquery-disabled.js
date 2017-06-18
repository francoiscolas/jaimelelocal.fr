(function ($) {
    $.fn.disabled = function (disabled) {
        if (disabled === undefined) {
            return this.first().is(':disabled');
        } else {
            return this.each(function () {
                if (disabled)
                    $(this).attr('disabled', 'disabled');
                else
                    $(this).removeAttr('disabled');
            });
        }
    };
})(jQuery);
