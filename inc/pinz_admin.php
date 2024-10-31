
<?php

//echo "BEFORE : " . get_option('pinz_data')['pinz_list'];
/*

	
    $data = array(
        'pinz_list' => '[{"_name":"pinz9375","_parentID":"post-8251","_id":"","_class":"","_tagName":"P","_distance":"3","_position":"1","_beforeOrAfter":"after","_serialized":"<p style=\"text-align: center; margin-top: -10px; font-size: 17px !important;\">With over <span class=\"tooltip-shortcode\"><strong>65,000 Users and counting</strong><span class=\"popup\"> <span class=\"holder\"> <span>Join The Avada Community!</span> </span> </span></span>, Avada is the <span class=\"tooltip-shortcode\"><strong>most complete and trusted</strong><span style=\"display: inline; opacity: 0.805506;\" class=\"popup\"> <span class=\"holder\"> <span>We Love Our Users!</span> </span> </span></span> wordpress theme on the market.</p>","_domPathArray":[{"_tagName":"DIV","_id":"post-8251","_class":"post-8251 page type-page status-publish hentry","_position":0},{"_tagName":"DIV","_id":"","_class":"post-content","_position":3},{"_tagName":"DIV","_id":"","_class":"fullwidth-box","_position":0},{"_tagName":"DIV","_id":"","_class":"avada-row","_position":0},{"_tagName":"P","_id":"","_class":"","_position":1}],"_toDeleteBool":false},{"_name":"pinz5448","_parentID":"post-8251","_id":"","_class":"","_tagName":"P","_distance":"4","_position":"1","_beforeOrAfter":"after","_serialized":"<p style=\"text-align: center; margin-top: -10px; font-size: 17px !important; line-height: 24px !important;\">Our\n #1 priority is you, the user. We believe in our product and hold \nourselves to the highest standards. We truly care about your site as \nmuch as you do, which is why we offer the best support around at our \ndedicated support center. In addition, Avada constantly offers free \nupdates with new features requested by our users. You can count on us.</p>","_domPathArray":[{"_tagName":"DIV","_id":"post-8251","_class":"post-8251 page type-page status-publish hentry","_position":0},{"_tagName":"DIV","_id":"","_class":"post-content","_position":3},{"_tagName":"DIV","_id":"","_class":"fullwidth-box","_position":1},{"_tagName":"DIV","_id":"","_class":"avada-row","_position":0},{"_tagName":"DIV","_id":"","_class":"one_half","_position":0},{"_tagName":"P","_id":"","_class":"","_position":1}],"_toDeleteBool":false},{"_name":"pinz6546","_parentID":"post-8251","_id":"","_class":"","_tagName":"H1","_distance":"4","_position":"0","_beforeOrAfter":"after","_serialized":"<h1 style=\"text-align: center; font-size: 30px !important;\">Free Updates &amp; Support: You Need It, We Provide It.</h1>","_domPathArray":[{"_tagName":"DIV","_id":"post-8251","_class":"post-8251 page type-page status-publish hentry","_position":0},{"_tagName":"DIV","_id":"","_class":"post-content","_position":3},{"_tagName":"DIV","_id":"","_class":"fullwidth-box","_position":1},{"_tagName":"DIV","_id":"","_class":"avada-row","_position":0},{"_tagName":"DIV","_id":"","_class":"one_half","_position":0},{"_tagName":"H1","_id":"","_class":"","_position":0}],"_toDeleteBool":false}]'
    );

	update_option( 'pinz_data' , $data);
	echo "AFTER : " . get_option('pinz_list');
	//delete_option('pinz_list');
*/
?>

<?php

/*
* HTML Template for the pinz list
*/


?>

<script type="text/javascript"> _currentPinzList = JSON.parse("<?php echo get_option('pinz_data')['pinz_list'] ?>") </script>
<div class="wp-full-overlay expanded">
    
    <div id="customize-controls" class="wrap wp-full-overlay-sidebar">
            
        <div id="" class="">
        
            <div id="customize-header-actions" class="addPinzButton wp-full-overlay-header">
                <button id="addPinzButton" class="button-primary add-pinz disabled" style="display:inline;">Add a Pinz</button>
                <span id="loadingSpinner" class="spinner" style="display: inline;"></span>
                <a class="back button" href="http://127.0.0.1/wordpress/wp-admin/themes.php">Close</a>
            </div>
            
            <div id="widgets-right" class="">
                <div class="wp-full-overlay-sidebar-content accordion-container">
                    
                    <div id="customize-info" class="accordion-section">
                        <div class="accordion-section-title" >
                            <span class="preview-notice">DOM Explorer<strong class="theme-name">Pinz</strong></span>
                        </div>
                        <div class="domex accordion-section-content">
                            <ul class="sidebarmenudetails ">
                                <li>HTML Tag : <span id="pinz-tag" class="pinz-details"></span></li>
                                <li>ID : <span id="pinz-id" class="pinz-details"></span></li>
                                <li>Class : <span id="pinz-class" class="pinz-details"></span></li>
                                <li>Parent ID : <span id="pinz-parentID" class="pinz-details"></span></li>
                                <li style="display:none;">Distance : <span id="pinz-distance"></span></li>
                                <li style="display:none;">Distance : <span id="pinz-position"></span></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div id="pinzListContainer">
                        <ul id="customize-theme-controls" class="pinzlist">
                        </ul>
                    </div> 
                
                </div>
            </div>
            
        
        </div> <!-- sidebar -->
        
        
    </div>
    
    <div id="customize-preview" class="wp-full-overlay-main">
        <div id="pinz-content">
            <iframe id="pinz-viewer" src="<?php echo get_site_url(); ?>"></iframe>
            <!-- <iframe id="pinz-viewer" src="http://127.0.0.1/Pins_WP/www/wp_theme1.htm"></iframe> -->
            <div class="pinz-viewer-hover"></div>
        </div>
    </div>
    
</div>