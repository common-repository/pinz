<?php
////////////////////////////// ADMIN -> ADD META BOX TO ALL POST TYPE ///////////////////////////////
function pinz_add_meta_box() {
	$types = array(
		'public' => true,
		'_builtin' => true
	);
	$all_post_types = get_post_types( $types, 'names', 'or' ); 
	foreach ( $all_post_types as $post_type ) {
        add_meta_box(
				'pinz_meta_box',
				__( 'Pinz your ' . $post_type, 'pinz_textdomain' ),
				'pinz_meta_box_callback',
				$post_type,
                'side',
                'high',
                array('post_type' => $post_type)
		);
	}
    
}
add_action ( 'add_meta_boxes', 'pinz_add_meta_box' );

/**
* Prints the box content
*
* @param WP_Post $post The object for current post/page.
*/
function pinz_meta_box_callback( $post ) { 
    wp_nonce_field( 'pinz_meta_box', 'pinz_meta_box_nonce' );
    
    $value = get_post_meta( $post->ID, '_pinz_selected', true );
    
    echo '<label for="pinz_it" class="dashicons-before dashicons-pressthis">';
    _e('Choose a pinz for your ' . $post->post_type , 'pinz_testdomain' );
    echo '</label>';
    echo '<br/>';
    echo '<select id="pinz_it" name="pinz_it" class="pinz-select">';
        echo '<option value="null">None</option>';
        echo pinz_get_all_pinz_html( esc_attr( $value ) );
    echo '</select>';
    
  
    //pinz_get_all_pinz_html( esc_attr( $value ) );
}

function pinz_get_all_pinz_html($pinzSelected) {
    $pinzData = get_option( 'pinz_data' );
    $html_select_options = '';
    $pinz_list = json_decode( $pinzData['pinz_list'] ); 
    foreach( $pinz_list as $pinz ) {
        if ( $pinz->_name == $pinzSelected)
            $html_select_options .= '<option selected="selected" value="' . $pinz->_name . '">' . $pinz->_name . '</option>';
        else
            $html_select_options .= '<option value="' . $pinz->_name . '">' . $pinz->_name . '</option>';
    }
    return $html_select_options;
}


/**
 * When the post is saved, saves our custom data.
 *
 * @param int $post_id The ID of the post being saved.
 */
function pinz_save_meta_box_data( $post_id ) {

	/*
	 * We need to verify this came from our screen and with proper authorization,
	 * because the save_post action can be triggered at other times.
	 */

	// Check if our nonce is set.
	if ( ! isset( $_POST['pinz_meta_box_nonce'] ) ) {
		return;
	}

	// Verify that the nonce is valid.
	if ( ! wp_verify_nonce( $_POST['pinz_meta_box_nonce'], 'pinz_meta_box' ) ) {
		return;
	}

	// If this is an autosave, our form has not been submitted, so we don't want to do anything.
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check the user's permissions.
	/*if ( isset( $_POST['post_type'] ) ) {

		if ( ! current_user_can( 'edit_page', $post_id ) ) {
			return;
		}

	} else {

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
	}
    */
    
	/* OK, its safe for us to save the data now. */
	
	// Make sure that it is set.
	if ( ! isset( $_POST['pinz_it'] ) ) {
		return;
	}

	// Sanitize user input.
	$pinz_selected = sanitize_text_field( $_POST['pinz_it'] );

	// Update the meta field in the database.
	update_post_meta( $post_id, '_pinz_selected', $pinz_selected );
}
add_action( 'save_post', 'pinz_save_meta_box_data' );