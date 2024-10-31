<?php
/**
 * Plugin Name: Pinz
 * Plugin URI: http://www.solidrock.fr/wordpress/pinz
 * Description: Pin any post/page anywhere on your website.
 * Version: 1.2
 * Author: SolidRock Studio
 * Author URI: http://www.solidrock.fr/wordpress/
 * Copyright 2014  Maher SOPHIE  (email : maher.sophie@solidrock.fr)
 */

/////////////////////////////// ALL - SCRIPT REGISTRING /////////////////////////////////
wp_register_script( 'linq', plugins_url( 'js/linq.min.js', __FILE__ ), array());
wp_register_script( 'pinz_common', plugins_url( 'js/pinz_common.js', __FILE__ ), array('jquery'));

////////////////////////////// ADMIN -> LANG /////////////////////////////////////////////
function pinz_textdomain() {
    load_plugin_textdomain( 'pinz', false, dirname( plugin_basename( __FILE__ ) ) . '/langs/' );
}
add_action( 'plugins_loaded', 'pinz_textdomain' );

////////////////////////////// ADMIN -> JAVASCRIPT + CSS INCLUDE [GLOBAL] ///////////////////////////////
function pinz_admin_scripts()
{
    // css
    wp_enqueue_style( 'pinz', plugins_url( 'css/pinz.css', __FILE__ ) );
    
    //js
	wp_enqueue_script('pinz_common');
    
    wp_register_script( 'pinz_post', plugins_url( 'js/pinz_post.js', __FILE__ ), array('jquery'));
    wp_enqueue_script('pinz_post');
}
//add_action('wp_enqueue_scripts', 'pinz_scripts');
add_action( 'admin_enqueue_scripts', 'pinz_admin_scripts' );

////////////////////////////// ADMIN -> JAVASCRIPT + CSS INCLUDE [OPTION PAGE ONLY] ///////////////////////////////
function pinz_options_scripts()
{
    /*
    * javascript
    */
    wp_enqueue_script('jquery');
	
    wp_register_script( 'pinz', plugins_url( 'js/pinz.js', __FILE__ ), array('jquery'));
	wp_enqueue_script('pinz');
    
    wp_register_script( 'perfect_scrollbar', plugins_url( 'js/perfect-scrollbar-0.4.10.with-mousewheel.min.js', __FILE__ ), array('jquery'));
	wp_enqueue_script('perfect_scrollbar');
    
    wp_register_script( 'jquery_easing', plugins_url( 'js/jquery.easing.1.3.js', __FILE__ ), array('jquery'));
	wp_enqueue_script('jquery_easing');
    
    
	wp_enqueue_script('linq');    
    
    wp_register_script( 'pinz_wp', plugins_url( 'js/pinz_wp.js', __FILE__ ), array('jquery'));
	wp_enqueue_script('pinz_wp');
    
    // wp_javascript
    wp_enqueue_script( 'customize-loader' );
    wp_enqueue_script( 'customize-controls' );
    wp_enqueue_script( 'jquery-ui-accordion' );
    
    
    /*
    * css
    */
    wp_enqueue_style( 'pecfect_scrollbar', plugins_url( 'css/perfect-scrollbar-0.4.10.min.css', __FILE__ ) );
    wp_enqueue_style( 'pinz_wp', plugins_url( 'css/pinz_wp.css', __FILE__ ) );
    
    // wp_css
    wp_enqueue_style( 'customize-controls' );
    
    
}
//add_action( 'wp_enqueue_script', 'pinz_options_scripts' ); -> add_action in pinz_menu declation


////////////////////////////// ADMIN -> HEAD (template, custom html...) ///////////////////////////////////////////
function pinz_head() {
    require_once dirname( __FILE__ ) . '/inc/pinz_list_template.php';
}

////////////////////////////// ADMIN -> MENU //////////////////////////////////////////////////////////////////////
function pinz_menu() {
	//add_menu_page : $page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position
	$pinz_hook_suffixP = add_menu_page( 'Pinz Options', 'Pinz', 'manage_options', 'pinz_loader', 'pinz_admin_loader', 'dashicons-pressthis');
    $pinz_hook_suffix = add_submenu_page( null, 'Pinz', 'Pinz', 'manage_options', 'pinz', 'pinz_admin', 'dashicons-pressthis');
    
    //Load all css and js for the page
    add_action( 'admin_print_scripts-' . $pinz_hook_suffix, 'pinz_options_scripts' );
    add_action( 'admin_print_scripts-' . $pinz_hook_suffixP, 'pinz_options_scripts' );
    
    //Load some html templates in the head of the page
    add_action( 'admin_head-' . $pinz_hook_suffix, 'pinz_head' );
    add_action( 'admin_head-' . $pinz_hook_suffixP, 'pinz_head' );
}
add_action( 'admin_menu', 'pinz_menu' ); 


function pinz_admin() { //Pin Admin Page
    
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	require_once dirname( __FILE__ ) . '/inc/pinz_admin.php';
    
}

function pinz_admin_loader() {
    if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
    
    require_once dirname( __FILE__ ) . '/inc/pinz_admin_loader.php';
}

///////////////////////////////// ADMIN -> SAVE AJAX DATA /////////////////////////
add_action('wp_ajax_pinz_save', 'pinz_save');
function pinz_save()
{
    if (!isset($_POST['_data'])) {
        return;
    }
    //update_option('pinz_data', array( 'pinz_list' => '' ));
	$pinzData = get_option('pinz_data');
    $pinzData['pinz_list'] = $_POST['_data'];
    update_option('pinz_data', $pinzData);
    echo get_option('pinz_data')['pinz_list'];
    wp_die();
}

////////////////////////////// ADMIN -> ADD META BOX TO ALL POST TYPE ///////////////////////////////
require_once dirname( __FILE__ ) . '/inc/pinz_post.php';