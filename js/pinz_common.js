
function fromDomPathToSelector(domPathArray) {
    var ret = '';
    //If the pinzed element has an id, just return the id
    if (domPathArray[domPathArray.length - 1]._id != "")
        ret = '#' + domPathArray[domPathArray.length - 1]._id;
    else
    {
        //if not, tries to figure out where can it be locacted "DOMly"
        jQuery.each(domPathArray, function(index, value) {
            if (ret.length > 0) {
                ret += ' > ';
            }
            ret += value._tagName;
            if (value._id != '' && value._id != undefined) {
                ret += '#' + value._id;
            }
            if (value._class != '' && value._class != undefined) {
                ret += '.' + value._class.split(' ').join('.');
            }
            if (value._position > 0) {
                if ( jQuery(ret , jQuery('#pinz-viewer').contents()).length > 1 )
                    ret+= ':nth-child(' + (value._position + 1) + ')';
            }
        });
    }
    return ret;
}


(function($) {
    $(document).ready(function() {
        if ( $('body').hasClass('pinz-edit') ||  $('body').hasClass('admin_page_pinz') || $('body').hasClass('wp-admin') || self !== top) return;
        
        
        //else
        $.each( _pinzPosts, function( index, value ) {
            var pinzObj = Enumerable.From(_currentPinzList).Where("$._name=='" + value.pinz_name + "'").Select().ToArray()[0];
            var elem = fromDomPathToSelector(pinzObj._domPathArray);
            var content = ''
            if (value.pinz_show == 'content') {
                content = value.post_content;
            }
            if (value.pinz_show == 'title') {
                content = value.post_title;
            }
            if (value.pinz_show == 'title_link') {
                content = '<a href="' + value.post_href + '">' + value.post_title + '</a>';
            }
            if (pinzObj._beforeOrAfter == 'after') {
                $(elem).after( '<div class="pinz ' + value.pinz_name + '">' + content + '</div>' );
            }
            else {
                $(elem).before( '<div class="pinz ' + value.pinz_name + '">' + content + '</div>');
            }
        });
    });
})(jQuery);