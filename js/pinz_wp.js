// Variables
var pinzViewer
var mousePosition = { x: -1, y: -1 };
var _currentPinzList = [];

(function($) {

$(document).ready(function() {
	
    //Option page accodion init
    $('#customize-info').accordion({ collapsible:true, active:false });
    $('#customize-info').accordion( "option", "animate", 100 );
    $('.pinzlist').accordion({ collapsible:true, active:false });
    $('.pinzlist').accordion( "option", "animate", 100 );
    
    $('body').addClass('pinz-edit');
    
	// Variables Inits
	$('body').on('click', '.pinz',  pinz_click_event);
    //Event on the pinz list
    $('body').on('mouseenter', '.pinz',  pinz_mouseenter_event)
             .on('mouseleave', '.pinz',  pinz_mouseleave_event)
             .on('keyup', 'input[name="pd-name"]', pinz_change_name_event)
             .on('click', '.beforeOrAfter', pinz_beforeOrAfter)
             .on('keyup', 'input[name="pd-encapsulate"]', pinz_encapsulate_event)
             .on('click', '.delete', pinz_delete)
             .on('click', '.update-pinz', pinz_update)
             .on('click', '.re-pinz', pinz_re)
             .on('click', '.back', pinz_exit);
    //setTimeout(function() { $('#pinz-viewer').attr('src', 'http://127.0.0.1/Pins_WP/www/Avada_Premium_WordPress.htm'); }, 1000)
    
    
	// UI Interactions
	$('#addPinzButton').click(pinz_add);
	
	
	// Main functions
	function pinz_add (){
        $('.button').addClass('disabled');
		pinz_viewer_hookEvents();
        //Open the DOM explorer on the accordion and scroll to top.
        $('#customize-info').accordion({active : 0 });
        $('.wp-full-overlay-sidebar-content').scrollTop(0);
	}
    
    
    // Attach css to iframe when loaded
    //var firstLoad = true;
    $('#pinz-viewer').load(function (){
        
        pinzViewer = $('#pinz-viewer').contents();
        
        //Loading pinz_list
        $(".pinzlist > li").empty();
        //if (firstLoad) {
            $.each(_currentPinzList, function(index, value) {
                $(".pinzlist").append(tmpl("pinz_tmpl", value));
                $('.pinzlist').accordion( 'refresh' );
                if (placePinz(value) == null) {
                    $('.logo', '#customize-controls').last().addClass('disabled');
                } 
                else {
                    
                }
            });
            //firstLoad = false;
        //}
        
        //Override default wordpress style
        //$('head', pinzViewer).append("<style type='text/css'> html { margin-top: 0px !important; }	* html body { margin-top: 0px !important; } #wpadminbar { display: none; }</style>");
        
        //Inject CSS to the iframe
        $('body', pinzViewer).on('mouseenter', '.pinzHereAfter, .pinzHereBefore', pinzHere_mouseenter)
                             .on('mouseleave', '.pinzHereAfter, .pinzHereBefore', pinzHere_mouseleave);      
        
        $('head', pinzViewer).append("<style type='text/css'> .pinz-viewer-hover { z-index:999999; opacity: 0.8; background:#0990C5; border: 1px dashed #0990C5; padding:-1px; position:absolute;}</style>");
        
        $('head', pinzViewer).append("<style type='text/css'>.pinz-here { z-index:999999; position:absolute; top:-100px; padding:5px; width:120px; font-size:10px; font-family: Arial; color: #fff; opacity: 0.8; background-color: #0990C5; position:absolute; }</style>");
        
        $('head', pinzViewer).append("<style type='text/css'>/*.pinzHereSelected { -webkit-filter: drop-shadow(0px 13px 20px 0px rgba(0,0,0,.75)); filter:url(#drop-shadow); -ms-filter: 'progid:DXImageTransform.Microsoft.Dropshadow(OffX=12, OffY=12, Color=#000)'; filter:'progid:DXImageTransform.Microsoft.Dropshadow(OffX=12, OffY=12, Color=#000)'; */ }</style>");
        
        $('head', pinzViewer).append("<style type='text/css'>.pinzHereAfter { position:absolute; z-index:999999; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAkCAMAAABVGlGRAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABCFBMVEUuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuosz////JvRCzAAAAVnRSTlMASebnSuRn0TkKqvtwGcybAxvZrgcc3bEP0pYBczck9tewdu4MqXIQ+MLQWvINIJXqLWLH/j49oK2s2PNO/SXrGBbINYt+fYwOyQLKsheaXESGP0DP8NjotscAAAABYktHRFd9CtkfAAAACXBIWXMAAAsSAAALEgHS3X78AAABM0lEQVQoz52SW1vCMAyGw0lxoOIRdZt4FhQYuKkoKAooqAhDYf//p9i0Xc3YvLE3X/puafLlCcTiXvjEYxCF2Yc/eAKSiQicSsL/z8JiOoIuaZ6XyYbw8govuJoL4rV12cnGJsVb26rFPMnY2SW97+k+1vMBU4bPs0GzGVPg/cLcFA5E7cPQeI4Qm+GxHZ8wfhoxzzOA86KMiyWt5McXAJciKhsVllsxyuJaBYtrrS57rtf4/QpsFOdaeb9xENxCCqVBZnWH4B6aKC3CWwgK8IDySHiVPwxtlCfCnxG0oYNiEt5F0IEeygvhrwj6kOZpA4UH/GG2GW+80XeJcw28figjw09RdPhrs8+dN0djdzzibtjrPHV+0ppcCX3iUDxRCwFftqL2N10s3bWmM282tVz58w9bAZbd/RwH5wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNC0wNS0wOFQyMToxNDozMy0wMzowMORX7SUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDUtMDhUMjE6MTQ6MzMtMDM6MDCVClWZAAAAAElFTkSuQmCC); }</style>");
        $('head', pinzViewer).append("<style type='text/css'>.pinzHereBefore { position:absolute; z-index:999999;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAkCAMAAABVGlGRAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABGlBMVEUuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuoswuosz////yK33nAAAAXHRSTlMAAUGVzu9CRdADjv6Sq6yM85pdRj2yGMiop8o56w6Lf343NRkW/SUg9k7Y5KE8x2PoLeqX8nMNW/fGsPgQcakMNnixB9c4/HWk0g8GtN0cr9kdnM1w+wpnSebnSmtMYYoAAAABYktHRF2d3zABAAAACXBIWXMAAAsSAAALEgHS3X78AAABNElEQVQoz52S11rCQBCFT4QIEZUiATVgwwJiQwFBRVRs2LuUff/nMDMpbki88dzMzL9l5uy3AEsZC4VVoYZD4wokRaLCUTTiUm0iJiRNajaeEl5NWwtxLhLJ1EwqmeA8TjjNl+gZ3pPRqYilzTRL2azm9Jqjch4wKOby7hD5HAEDCxQWpZmXrA58zbLEVwhkwccKEl/li7FGYV3iGzwRihRKEi+xG2yyQ4mz+zK2XCOWttnmDnbZ+V7FxpV9rg+sNkJUa3WT1mtVqzwEnKdvNI+aDTs/PgFawq9T82xb9fMzanXuwxc8QudyBBdt+1fXXt5yvNx4sO5+FeVWwt273ze5f3Dx45P8sTrPNn55hUfaG+P3Akb18Wn6/IJfRvcb/1evH/Ce/R6CsLnwBx9gOAjA5eEPPdueXe225BEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTQtMDUtMDhUMjE6MTQ6MTktMDM6MDACArUWAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTA1LTA4VDIxOjE0OjE5LTAzOjAwc18NqgAAAABJRU5ErkJggg==); }</style>");
        $('head', pinzViewer).append("<style type='text/css'>.pinzHere { width:23px; height:36px; position:absolute; }</style>");
        
        $('body', pinzViewer).addClass('pinz-edit');
        $('body', pinzViewer).append("<div id='pinz-viewer-top' class='pinz-viewer-hover' style='height:1px'></div>");
        $('body', pinzViewer).append("<div id='pinz-viewer-bottom' class='pinz-viewer-hover' style='height:1px'></div>");
        $('body', pinzViewer).append("<div id='pinz-viewer-left' class='pinz-viewer-hover' style='width:1px'></div>");
        $('body', pinzViewer).append("<div id='pinz-viewer-right' class='pinz-viewer-hover' style='width:1px'></div>");
        $('head', pinzViewer).append("<style type='text/css'>@keyframes pinz-viewer-blink {  0% {opacity:1;  } 50% { opacity:0;} 100% {opacity:1;}} @-webkit-keyframes pinz-viewer-blink {  0% {opacity:1;  } 50% { opacity:0;} 100% {opacity:1;}} @-ms-keyframes  pinz-viewer-blink {  0% {opacity:1;  } 50% { opacity:0;} 100% {opacity:1;}} @-moz-keyframes  pinz-viewer-blink {  0% {opacity:1;  } 50% { opacity:0;} 100% {opacity:1;}} </style>");
        $('head', pinzViewer).append("<style type='text/css'> .pinz-viewer-blink { -webkit-transition: all 1s ease-in-out; -moz-transition: all 1s ease-in-out;  -o-transition: all 1s ease-in-out;  -ms-transition: all 1s ease-in-out;    transition: all 1s ease-in-out;  -webkit-animation-direction: normal;-webkit-animation-duration: 2s;   -webkit-animation-iteration-count: infinite;    -webkit-animation-name: pinz-viewer-blink;    -webkit-animation-timing-function: ease-in-out;-moz-animation-direction: normal;-moz-animation-duration: 2s;-moz-animation-iteration-count: infinite; -moz-animation-name: pinz-viewer-blink;    -moz-animation-timing-function: ease-in-out;     }</style>");
        
        $('body', pinzViewer).append("<div class='pinz-here'>CLICK TO ADD A PINZ</div>");
        $('body', pinzViewer).append("<div class='pinzHere' style='visibility:hidden; position absolute; top:-9999px;'></div>");
        //$('body', pinzViewer).append('<svg height="0" xmlns="http://www.w3.org/2000/svg"><filter id="drop-shadow"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2"/><feOffset dx="0" dy="13" result="offsetblur"/><feFlood flood-color="rgba(0,0,0,.75)"/><feComposite in2="offsetblur" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></svg>');
        $('body', pinzViewer).append('<svg height="0" xmlns="http://www.w3.org/2000/svg"><filter id="drop-shadow"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2"/><feOffset dx="12" dy="12" result="offsetblur"/><feFlood flood-color="rgba(0,0,0,0.5)"/><feComposite in2="offsetblur" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></svg>')  ;
        
        
        
        bgWorking(false);
        
    });
    
    
    // Scrollbar init
    $('#sidebar').perfectScrollbar({suppressScrollX: true});
	$( window ).resize(function() {
      $('#sidebar').perfectScrollbar('update');
    });
    
});

//****************************************************************************************************************************
//
// Basic functions
//
//****************************************************************************************************************************
function pinz_viewer_hookEvents (){
    
	$("body *:not(a)", pinzViewer)
		.on('mouseover', ':not(.pinz-viewer-hover, .pinz_here)', pinz_viewer_mouseover)
		.on('mouseout', ':not(.pinz-viewer-hover, .pinz_here)', pinz_viewer_mouseout)
		.on('click', ':not(.pinz-viewer-hover, .pinz_here)',  pinz_viewer_mouseclick);
    $('body', pinzViewer).on('mousemove', function(event) {
            mousePosition.x = event.pageX;
            mousePosition.y = event.pageY;
            pinz_prevent_viewer_glitch();
        });
    
    $('a', pinzViewer).on('click', function(e) { e.preventDefault(); });
    
    $(document).on('keyup', function(event) {  // Esc handler
        if (event.keyCode == 27) {
            pinz_viewer_unHookEvents();
            pinz_viewer_hide();
            $('#addPinzButton').removeClass('disabled'); $('.button').removeClass('disabled');
            $('#customize-info').accordion({active : false });
        }
    });
}
function pinz_viewer_unHookEvents() {
	$("body *:not(a)", pinzViewer)
		.off('mouseover', pinz_viewer_mouseover)
		.off('mouseout', pinz_viewer_mouseout)
		.off('click', pinz_viewer_mouseclick);
    $('body', pinzViewer).off('mousemove');
    $('a', pinzViewer).off('click');
    $(document).off('keyup'); // Esc handler
}

////// DOM Exploring the webpage to pinz 
var stillMouseTimer = false; 
var hovedElem = null;
function pinz_viewer_mouseover(e) {
	e.stopPropagation();
	
	drawPinzViewerBorders($(this));
	
	var pinzHereTop = $(this).offset().top - $('.pinz-here', pinzViewer).outerHeight();
	
    pinz_update_DOM_Details($(this));
    hovedElem = $(this);
    
}

function drawPinzViewerBorders($this) {
    $('#pinz-viewer-top', pinzViewer).css($this.offset());
	$('#pinz-viewer-top', pinzViewer).width($this.outerWidth());
	
	$('#pinz-viewer-bottom', pinzViewer).css({top: $this.offset().top + $this.outerHeight(), left : $this.offset().left});
	$('#pinz-viewer-bottom', pinzViewer).width($this.outerWidth());
	
	$('#pinz-viewer-left', pinzViewer).css($this.offset());
	$('#pinz-viewer-left', pinzViewer).height($this.outerHeight());
	
	$('#pinz-viewer-right', pinzViewer).css({top: $this.offset().top , left : $this.offset().left + $this.outerWidth()});
	$('#pinz-viewer-right', pinzViewer).height($this.outerHeight());
}

function pinz_viewer_mouseout(e) {
	e.stopPropagation();
	//$(this).removeClass("pinz-viewer-hover")
}

// Click event : add new pinz on the page
function pinz_viewer_mouseclick(e) {
	
    try { e.stopPropagation(); } catch(e){}
	
    
    // create a new pinz object
    var ret = newPinz( $('#pinz-id').text(), $('#pinz-class').text(), $('#pinz-parentID').text(), $('#pinz-position').text(), $('#pinz-distance').text(), getRandomPinzName() );
    ret._tagName = $('#pinz-tag').text();
    ret._id = $('#pinz-id').text();
    ret._class = $('#pinz-class').text();
    ret._parentID = $('#pinz-parentID').text();
    ret._serialized = $('<div/>').append( hovedElem.clone() ).html();
    
    ret._domPathArray = [];
    var obj = hovedElem //ret._serialized;
    var i = '';
    do {
        i = obj.attr('id');
        ret._domPathArray.unshift( newDomPath(obj.prop('tagName'), 
                                              obj.attr('id') != undefined ? obj.attr('id') : '', 
                                              obj.attr('class') != undefined ? obj.attr('class') : '', 
                                              obj.index() ) 
                                 );
        obj = obj.parent();
    } while (i != ret._parentID && obj[0].nodeName != 'BODY')
    console.debug(ret);
    //--------------
    if ( !!$('body').attr('re-pinz') )
    {
        var pinzName = $('body').attr('re-pinz');
        $('body').removeAttr('re-pinz');
        var indexToUpdate = _currentPinzList.indexOf(Enumerable.From(_currentPinzList).Where("$._name=='" + pinzName + "'").Select().ToArray()[0]);
        ret._name = pinzName;
        _currentPinzList[indexToUpdate] = ret;
        $('.pinzlist > li[name="' + pinzName + '"]').replaceWith( tmpl("pinz_tmpl", ret) );
        removeUiPinz(pinzName);
        $('.pinzlist').accordion( 'refresh' );
        $('.pinzlist').accordion({active : indexToUpdate });
    }
    else {
        _currentPinzList.push( ret );
        // based on the template, add the pinz to the ui
        closeAllPinz();
        $(".pinzlist").append(tmpl("pinz_tmpl", ret));
        $('.pinz').last().addClass('newz');
        openPinz($('.pinz').last());
        $('.pinzlist').accordion( 'refresh' );
    }
    
    
    
    //Add pinz to the webpage (iframe)
    placePinz(ret);
    
    //unhookEvents
    pinz_viewer_unHookEvents();
    
    pinz_viewer_hide();
    
    $('#addPinzButton').removeClass('disabled'); $('.button').removeClass('disabled');
    
    //Close the DOM explorer on the accodion and scroll to last inserted pinz
    $('#customize-info').accordion({active : false });
    jQuery('.wp-full-overlay-sidebar-content').scrollTop( $('.pinz').last().offset().top - 60 );
}

// click event on a pinz on the pinz list
function pinz_click_event(e) { 
    if ( $('.logo', this).hasClass('closed')) {
        openPinz($(this));
    }
    else {
        if ($(e.target).hasClass('logo') || $(e.target).hasClass('pinz-name') || $(e.target).hasClass('info'))
            closePinz($(this));
    }
}



// onmouseenter on the pinzList, scrool 
var delayPinzMouseEnterTimer;

function pinz_mouseenter_event(e) { 
    var pinzName = $(this).attr('name');
    var pinzObj = Enumerable.From(_currentPinzList).Where("$._name=='" + pinzName + "' && $._toDeleteBool!=true").Select().ToArray()[0];
    var iframe = $('#pinz-viewer').contents();
    
    delayPinzMouseEnterTimer = setTimeout(function() {
        var st = $('.pinzHere' + pinzObj._beforeOrAfter.charAt(0).toUpperCase() + pinzObj._beforeOrAfter.slice(1) + '[name="' + pinzName + '"]', pinzViewer) 
                .offset().top -  ($('#pinz-viewer').outerHeight() / 2);
        pinzViewer.find('body').animate({
            scrollTop : st
        }, 500, 'easeOutExpo', function() { $('#pinz-viewer').contents().scrollTop(st)  });
        drawPinzViewerBorders( $(fromDomPathToSelector(pinzObj._domPathArray), pinzViewer) );
        pinz_viewer_blink();
    }, 750);
    
    
    
    $('.pinzHere' + pinzObj._beforeOrAfter.charAt(0).toUpperCase() + pinzObj._beforeOrAfter.slice(1) + '[name="' + pinzName + '"]', iframe).addClass('pinzHereSelected');
    
}

// onmouseleave on the pinzList, remove class 
function pinz_mouseleave_event(e) { 
    var pinzName = $(this).attr('name');
    var pinzObj = Enumerable.From(_currentPinzList).Where("$._name=='" + pinzName + "'").Select().ToArray()[0];
    var iframe = $('#pinz-viewer').contents();
    $('.pinzHere' + pinzObj._beforeOrAfter.charAt(0).toUpperCase() + pinzObj._beforeOrAfter.slice(1) + '[name="' + pinzName + '"]', iframe).removeClass('pinzHereSelected');
    pinz_viewer_unblink();
    clearTimeout(delayPinzMouseEnterTimer); 
}



//pinzHere_mouseenter
function pinzHere_mouseenter(e) {
    var pinzName = $(this).attr('name');
    $('.pinz[name="' + pinzName + '"').addClass('hover');
    var pinzObj = Enumerable.From(_currentPinzList).Where("$._name=='" + pinzName + "'").Select().ToArray()[0];
    drawPinzViewerBorders( $(fromDomPathToSelector(pinzObj._domPathArray), pinzViewer) );
    pinz_viewer_blink();
}
//pinzHere_mouseleave
function pinzHere_mouseleave(e) {
    var pinzName = $(this).attr('name');
    $('.pinz[name="' + pinzName + '"').removeClass('hover');
    pinz_viewer_unblink();
}
    
    
//pinz change name event
var timeoutId;
function pinz_change_name_event(e) {
    var $this = $(this);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        checkPinzName( $this );
    }, 500);
}
function checkPinzName($this) {
    //the new wanted pinz name
    var newPinzName = $this.val().trim();
    var pinzArrayObjs = Enumerable.From(_currentPinzList).Where("$._name=='" + newPinzName + "'").Select().ToArray();
    
    // check of the pinzName is empty. If so, generate one randomly
    if (newPinzName == "") {
        newPinzName = getRandomPinzName();
        updatePinzName(newPinzName, $this);
        return;
    } else if (pinzArrayObjs.length > 0) { //see if the name is already exist,
        if ( !pinzArrayObjs[0]._toDeleteBool && _currentPinzList.indexOf(pinzArrayObjs[0]) != $('.pinzlist > li[name="' + $this.attr('ref') + '"').index() )
        {
            alert('A pinz with the same name already exists. Please choose an other name.');
            newPinzName = getRandomPinzName();
            updatePinzName(newPinzName, $this);
        }
        else {
            updatePinzName(newPinzName, $this);
        }
    } else {
        //else, just update 
        updatePinzName(newPinzName, $this);
    }
}
    

// pinz beofre or after element click
function pinz_beforeOrAfter(e) {
    var pinzName = $(this).attr('ref'); //get pinz name
    var indexToUpdate = _currentPinzList.indexOf(Enumerable.From(_currentPinzList).Where("$._name=='" + pinzName + "'").Select().ToArray()[0]);
    _currentPinzList[indexToUpdate]._beforeOrAfter = $(this).val().toLowerCase();
    removeUiPinz(pinzName);
    placePinz(_currentPinzList[indexToUpdate]);
    $(this).parent().parent().parent().trigger('mouseenter');
}

//Encapsulate pinz by a dom element
function pinz_encapsulate_event(e) {
    var pinzName = $(this).attr('ref'); //get pinz name
    var indexToUpdate = _currentPinzList.indexOf(Enumerable.From(_currentPinzList).Where("$._name=='" + pinzName + "'").Select().ToArray()[0]);
    _currentPinzList[indexToUpdate]._encapsulateBy = $(this).val().toLowerCase().trim();
}

// delete pinz
function pinz_delete(e) {
    var pinzName = $(this).attr('ref'); //get pinz name
    var pinzObj = Enumerable.From(_currentPinzList).Where("$._name=='" + pinzName + "'").Select().ToArray()[0];
    var indexToRemove = _currentPinzList.indexOf(Enumerable.From(_currentPinzList).Where("$._name=='" + pinzName + "'").Select().ToArray()[0]);
    _currentPinzList[indexToRemove]._toDeleteBool = true;
    
    pinz_viewer_unblink();
    pinz_viewer_hide();
    
    $('.pinzlist > li').eq(indexToRemove).hide(); //fix
    $('.pinzlist').accordion( 'refresh' );
    
    removeUiPinz(pinzName);
    
    //save
    //pinz_update(null);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// Save the pinz
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function pinz_update(e) {
    $('#addPinzButton').addClass('disabled'); $('.button').addClass('disabled');
    bgWorking(true);
    
    for (i = 0; i   < _currentPinzList.length ; i++) {
        if (_currentPinzList[i]._toDeleteBool) {
            _currentPinzList.splice(i, 1);
            i--;
        }
    };
    var data = { 'action': 'pinz_save', '_data' : JSON.stringify(_currentPinzList) };
    $.post(ajaxurl, data, function(response) {
        if (e == 'exit') parent.history.back();
        console.log(response);
        $('#addPinzButton').removeClass('disabled'); $('.button').removeClass('disabled');
        bgWorking(false);
	});
}


function pinz_re(e) {
    $('body').attr('re-pinz', $(this).attr( 'ref' ) );
    $('#addPinzButton').trigger('click');
}
    
    
function pinz_exit(e) {
    pinz_update('exit');
    e.preventDefault();
    //parent.history.back();
}
    
    
    

function getRandomPinzName() {
    return "pinz" + Math.floor(Math.random()*8999+1000);
}

function pinz_update_DOM_Details($this) {
    $('#pinz-tag').text('');
    $('#pinz-id').text('');
    $('#pinz-class').text('');
    $('#pinz-parentID').text('');
    
    
    $('#pinz-tag').text($this.prop('tagName'));
    $('#pinz-id').text($this.attr('id') != undefined ? $this.attr('id') : '');
    $('#pinz-class').text($this.attr('class') != undefined ? $this.attr('class') : '');
    $('#pinz-position').text($this.index()); 
    
    var i = 0;
    while (($this.parent().attr('id') == undefined || $this.parent().attr('id') == '') && $this.prop("tagName") != 'body') {
        $this = $this.parent();
        i++;
    }
    $('#pinz-parentID').text($this.parent().attr('id'));
    $('#pinz-distance').text(i);
}

//****************************************************************************************************************************
//
// Prevent a small glitch while showing the pinz-viewer (DOM Inspector). Usefull when user tries to access menus
//
//****************************************************************************************************************************
function pinz_prevent_viewer_glitch() {
    var pixelOffset = 7;
    pinz_viewer_show();
    // Right control
    if (mousePosition.x + pixelOffset > $('#pinz-viewer-right', pinzViewer).offset().left) 
        pinz_viewer_hide();
    else if (mousePosition.x - pixelOffset < $('#pinz-viewer-left', pinzViewer).offset().left)
        pinz_viewer_hide();
    else if (mousePosition.y - pixelOffset < $('#pinz-viewer-top', pinzViewer).offset().top)
        pinz_viewer_hide();
    else if (mousePosition.y + pixelOffset > $('#pinz-viewer-bottom', pinzViewer).offset().top)
        pinz_viewer_hide();
}
        
function pinz_viewer_hide() {
    $('#pinz-viewer-top', pinzViewer).hide()
    $('#pinz-viewer-bottom', pinzViewer).hide()
    $('#pinz-viewer-left', pinzViewer).hide()
    $('#pinz-viewer-right', pinzViewer).hide()
}
function pinz_viewer_show() {
    $('#pinz-viewer-top', pinzViewer).show()
    $('#pinz-viewer-bottom', pinzViewer).show()
    $('#pinz-viewer-left', pinzViewer).show()
    $('#pinz-viewer-right', pinzViewer).show()
}
function pinz_viewer_blink() {
    pinz_viewer_show();
    $('#pinz-viewer-top', pinzViewer).addClass("pinz-viewer-blink");
    $('#pinz-viewer-bottom', pinzViewer).addClass("pinz-viewer-blink");
    $('#pinz-viewer-left', pinzViewer).addClass("pinz-viewer-blink");
    $('#pinz-viewer-right', pinzViewer).addClass("pinz-viewer-blink");
}
function pinz_viewer_unblink() {
    pinz_viewer_hide();
    $('#pinz-viewer-top', pinzViewer).removeClass("pinz-viewer-blink");
    $('#pinz-viewer-bottom', pinzViewer).removeClass("pinz-viewer-blink");
    $('#pinz-viewer-left', pinzViewer).removeClass("pinz-viewer-blink");
    $('#pinz-viewer-right', pinzViewer).removeClass("pinz-viewer-blink");
}



//****************************************************************************************************************************
//
// PINZ Object Manipulations
//
//****************************************************************************************************************************

// Create a new pinz object
 function newPinz(_id, _class, _parentId, _position, _distance, _name) {
     var pinz = { 
         _name: _name,                      //the name of the pinz
         _parentID: _parentId,              //the parent of the selected element
         _id: _id,                          //ID of the selected element
         _class: _class,                    //Class of the selected element
        _tagName: '',                       //Tag name of the selected element
         _distance: _distance,              //Distance between the selected element and the closest parent who has an ID
         _position: _position,              //Position of the selected element relative its parent
         _customCss: '',                    //Add custom css rules
         _beforeOrAfter: 'after',           //Pinz the post before or after the selected element
         _encapsulateBy: '',                //Encapsulate post by tag. Can be any HTML tag
         _displayPostMode: '',              //Display post : {title, content, title+content}
         _displayFeaturedImage: '',         //Display image : boolean
         _serialized: '',
         _domPathArray: '',                 //_domPath = {}
         _toDeleteBool: false
     };
     return pinz;
 }

function newDomPath(_tagName, _id, _class, _position) {
    var npd = { _tagName: _tagName , _id: _id , _class: _class , _position : _position};
    return npd;              
}


// Create a new pinz for HTML display
function newHtmlPinz()
{
    
}


/// Open a pinz
function openPinz(pinz) {
    //$(".details", pinz).slideDown('slow', function() { $('#sidebar').perfectScrollbar('update'); });
    //$('.logo', pinz).removeClass('closed');
    $( '.pinzlist' ).accordion( 'option', 'active', pinz.index() );
}
function closePinz(pinz) {
    //$(".details", pinz).slideUp('slow', function() { $('#sidebar').perfectScrollbar('update'); });
    //$('.logo', pinz).addClass('closed');
}
function closeAllPinz() {
    $(".details").each(function(){
        closePinz($(this).parent());
    });
}

// Place a pinz on the webpage
function placePinz(pinzObject) {
    var obj = null;
    obj = fromDomPathToSelector(pinzObject._domPathArray);
    
    if ( $(obj, pinzViewer).length == 0 ) return null; //if the element is not found in the iframe, return null.
    
    var p = '<div name="' + pinzObject._name +'" class="pinzHere pinzHere' + pinzObject._beforeOrAfter.charAt(0).toUpperCase() + pinzObject._beforeOrAfter.slice(1) + '" ></div>';
    $(p).css( $(obj, pinzViewer).offset() );
    if (pinzObject._beforeOrAfter == 'after')
        p = $(p).css({top :  $(obj, pinzViewer).offset().top + $(obj, pinzViewer).outerHeight() , //36px ->$(obj, pinzViewer).outerHeight() -> the height of the blue pin in the iframe
                     left :  $(obj, pinzViewer).offset().left  });
    else
        p = $(p).css({top :  $(obj, pinzViewer).offset().top - 36 , // 36px -> $(obj, pinzViewer).outerHeight() -> the height of the blue pin in the iframe
                     left :  $(obj, pinzViewer).offset().left  });
    $('body', pinzViewer).append($(p));
    return true;
}

// Update the pinz name, updating the object and the UI
function updatePinzName(newPinzName, inputName) {
    var oldPinzName = inputName.attr('ref');
    
    var pinzObj = Enumerable.From(_currentPinzList).Where("$._name=='" + oldPinzName + "'").Select().ToArray()[0];
    pinzObj._name = newPinzName;
    inputName.val(newPinzName);
    //inputName.parent().parent().parent().attr('name', newPinzName);
    //$('.pinz-name', inputName.parent().parent().parent()).text(newPinzName);
    $('li[name="' + oldPinzName + '"]').attr('name', newPinzName);
    $('.pinz-name', 'li[name="' + newPinzName + '"]').text(newPinzName);
    $('[ref]', 'li[name="' + newPinzName + '"]').attr('ref', newPinzName);
    
    $('[name="' + oldPinzName + '"]', pinzViewer).attr('name', newPinzName);
}

function removeUiPinz(pinzName) {
    $('.pinzHere[name="' + pinzName + '"', pinzViewer).fadeOut('fast', function() { $(this).remove(); });
}

function bgWorking(bool) {
    if (!bool) {
        $('#loadingSpinner').fadeOut('slow'); 
        $('#addPinzButton').removeClass('disabled');
        $('.update-pinz, .delete').removeClass('disabled');
    }
    else {
        $('#loadingSpinner').fadeIn('slow');
        $('#addPinzButton').addClass('disabled');
        $('.update-pinz, .delete').addClass('disabled');
    }
}

//****************************************************************************************************************************
// CSS Fcuntions : Get all the style for a given css class.
//****************************************************************************************************************************
function css(a) {
    var sheets = document.styleSheets, o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}

})(jQuery);




//****************************************************************************************************************************
//
// JavaScript Templating
//
//****************************************************************************************************************************
(function(){
  var cache = {};
  this.tmpl = function tmpl(str, data){
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    return data ? fn( data ) : fn;
  };
})();