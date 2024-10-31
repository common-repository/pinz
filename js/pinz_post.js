(function($) {

    $(document).ready(function() {
        
        $('.pinz_show_status').text( $('input[name=pinz_content]:checked').next().text() );
        
        $('.edit-pinz-show, .cancel-pinz-show').click(function(e) {
            e.preventDefault();
            $('#pinz_show').slideToggle('fast', function() {
                $('.edit-pinz-show').toggle();
            });
        });
        
        $('.ok-pinz-show').click(function(e) {
            e.preventDefault();
            $('.pinz_show_status').text( $('input[name=pinz_content]:checked').next().text() );
            $('.edit-pinz-show').trigger('click');
        });
        
    });

})(jQuery);