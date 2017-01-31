<?php
/**
 * WP Skins Admin class
 */
class WP_Skins_Admin {

	/** @var WP_Skins_Admin Instance */
	private static $_instance = null;

	/* @var string $token Plugin token */
	public $token;

	/* @var string $url Plugin root dir url */
	public $url;

	/* @var string $path Plugin root dir path */
	public $path;

	/* @var string $version Plugin version */
	public $version;

	/**
	 * Main WP Skins Instance
	 * Ensures only one instance of Storefront_Extension_Boilerplate is loaded or can be loaded.
	 * @return WP_Skins_Admin instance
	 * @since 	1.0.0
	 */
	public static function instance() {
		if ( null == self::$_instance ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	} // End instance()

	/**
	 * Constructor function.
	 * @access  private
	 * @since 	1.0.0
	 */
	private function __construct() {
		$this->token   =   WP_Skins::$token;
		$this->url     =   WP_Skins::$url;
		$this->path    =   WP_Skins::$path;
		$this->version =   WP_Skins::$version;
	} // End __construct()

	/**
	 * Adds row settings panel tab
	 * @param array $tabs The array of tabs
	 * @return array Tabs
	 * @filter pootlepb_row_settings_tabs
	 * @since 	1.0.0
	 */
	public function row_settings_tabs( $tabs ) {
		$tabs[ $this->token ] = array(
			'label' => 'Sample Tab',
			'priority' => 5,
		);
		return $tabs;
	}

	/**
	 * Adds front end stylesheet and js
	 * @action wp_enqueue_scripts
	 */
	public function enqueue() {
		?>
		<div id="wp-skins-overlay" style="display: none;"></div>
		<div id="wp-skins-dialog" style="display: none;">
			<div class="notice already-exists" style="display: none">
				<p>
					Skin with this name already exists. Rename the skin or
					<button id="wp-skins-overwrite-skin" class="button">Overwrite</button>
				</p>
			</div>
			<input placeholder="Skin name" type="text" id="wp-skins-skin-name">
			<button id="wp-skins-save-skin" class="button button-primary">Save skin</button>
		</div>
		<div id="wp-skins-notice" style="display: none;">This is a notice</div>
		<div id="wp-skins-apply-confirm" style="display: none;">
			<p>Are you sure you want to apply "<span class="skin-name"></span>" skin? Your current changes will be lost!
				<button id="wp-skins-save-skin" class="button button-primary">Yeah, Apply skin</button>
				<button id="wp-skins-save-skin" onclick="jQuery(this).parent.hide()" class="button">Cancel</button>
		</div>

		<div id="wp-skins-actions" class="wp-full-overlay-header">
			<a id="wp-skins-view" class="button view-skins"
			   onclick="wp.customize.section.value( 'wp_skins_section' ).expand()">
				<span class="dashicons dashicons-admin-appearance"></span> View skins
			</a>
			<a class="button button-primary" id="wp-skins-save-dialog" title="Save as a skin">
				<span class="dashicons dashicons-plus-alt"></span> Save skin
			</a>
		</div>
		<?php

		$token = $this->token;
		$url = $this->url;

		wp_enqueue_style( $token . '-css', $url . '/assets/admin.css' );
		wp_enqueue_script( $token . '-js', $url . '/assets/admin.js', array( 'jquery' ) );

		$skins = json_decode( get_option( 'wp_skins_data', '{}' ), 'array' );

		wp_localize_script( $token . '-js', 'sfpSkins', array(
			'data'	=> ! $skins ? new stdClass() : $skins,
			'theme'	=> 'storefront',
		) );
	}

	/**
	 * Registers customizer elements
	 * @param WP_Customize_Manager $wp_customize
	 */
	public function customize_register( $wp_customize ) {
		require_once 'class-customize-control.php';

		$wp_customize->add_section( 'wp_skins_section',
			array(
				'title' => __( 'Skins', 'wp-skins' ),
				'priority' => -7,
				'description' => __('Save and apply customizer settings as skins.', 'wp-skin'),
			)
		);

		$wp_customize->add_setting( 'wp_skins_data',
			array(
				'type' => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Skins_Customize_Control( $wp_customize, 'wp_skins_data', array(
				'label' => __( 'Skins for this theme', 'wp-skin' ),
				'section' => 'wp_skins_section',
				'settings' => 'wp_skins_data',
				'priority' => 7,
			) ) );

	}
	/** Adds admin menu */
	public function admin_menu() {
		add_theme_page(
			'WP Skins',
			'WP Skins',
			'manage_options',
			$this->token,
			function () {
				include dirname( __FILE__ ) . '/tpl-settings.php';
			}
		);
	}

	/** AJAX action to save skins data */
	public function ajax_wp_skins_save() {
		if ( ! current_user_can( 'manage_options' ) ) {
			die( "You don't have permission to manage options." );
		}

		if ( empty( $_POST['skins'] ) ) {
			die( "Skins data required." );
		}

		if ( is_array( $_POST['skins'] ) ) {
			$skins = json_encode( $_POST['skins'] );
		} else {
			$skins = stripslashes( $_POST['skins'] );
		}

		if ( update_option( 'wp_skins_data', $skins ) ) {
			die( 'Success: Skins updated' );
		}

		die( 'Success: Skin data identical.' );
	}

	/** AJAX action to export skins data */
	public function ajax_wp_skins_export() {
		$json = get_option( 'wp_skins_data', '{}' );
		$skins = json_decode( $json, 'assoc_array' );
		if ( ! empty( $_REQUEST['skin'] ) ) {
			$skin_name = $_REQUEST['skin'];
			$skin = empty( $skins[ $skin_name ] ) ? array() : $skins[ $skin_name ];
			die(
				json_encode(
					array(
						$skin_name => $skin
					)
				)
			);
		}
		die( $json );
	}

	/** AJAX action to import skins data */
	public function ajax_wp_skins_import() {
		$json = get_option( 'wp_skins_data', '{}' );
		$skins = json_decode( $json, 'assoc_array' );

		if ( empty( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'wpskins_import_settings' ) ) {
			var_dump( $_POST );
			die( 'failed: Nonce validation failed.' );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			die( 'failed: You don\'t have permission to manage options.' );
		}

		if ( empty( $_POST['json'] ) ) {
			die( 'failed: File contains no data.' );
		}

		$new_skins = json_decode( stripslashes( $_POST['json'] ), 'assoc_array' );

		if ( ! $new_skins ) {
			die( "failed: Skin data malformed.\n\n" . $_POST['json'] );
		}

		$skins = wp_parse_args( $new_skins, $skins );

		update_option( 'wp_skins_data', json_encode( $skins ) );

		die( 'success: Skins successfully imported from the file.' );
	}

	/**
	 * Adds front end stylesheet and js
	 * @action wp_enqueue_scripts
	 */
	public function admin_enqueue() {
		if ( ! filter_input( INPUT_GET, 'page' ) == 'wp-skins' ) return;

		$token = $this->token;
		$url = $this->url;
		wp_enqueue_style( $token . '-css', $url . '/assets/skins-manager.css' );
		wp_enqueue_script( $token . '-js-skin-man', $url . '/assets/skins-manager.js', array( 'jquery', 'jquery-ui-sortable' ) );

		$skins = json_decode( get_option( 'wp_skins_data', '{}' ), 'array' );

		wp_localize_script( $token . '-js-skin-man', 'sfpSkins', array(
			'data'	=> ! $skins ? new stdClass() : $skins,
			'theme'	=> 'storefront',
			'ajaxurl'	=> admin_url( 'admin-ajax.php' ),
			'importNonce' => wp_create_nonce( 'wpskins_import_settings' ),
		) );
	}
}