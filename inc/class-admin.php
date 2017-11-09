<?php
/**
 * Storefront Pro Skins Admin class
 */
class Storefront_Pro_Skins_Admin {

	/** @var Storefront_Pro_Skins_Admin Instance */
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
	 * Main Storefront Pro Skins Instance
	 * Ensures only one instance of Storefront_Extension_Boilerplate is loaded or can be loaded.
	 * @return Storefront_Pro_Skins_Admin instance
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
		$this->token   =   Storefront_Pro_Skins::$token;
		$this->url     =   Storefront_Pro_Skins::$url;
		$this->path    =   Storefront_Pro_Skins::$path;
		$this->version =   Storefront_Pro_Skins::$version;
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
		<div id="sfp-skins-overlay" style="display: none;"></div>
		<div id="sfp-skins-dialog" style="display: none;">
			<div class="notice already-exists" style="display: none">
				<p>
					Skin with this name already exists. Rename the skin or
					<button id="sfp-skins-overwrite-skin" class="button">Overwrite</button>
				</p>
			</div>
			<input placeholder="Skin name" type="text" id="sfp-skins-skin-name">
			<button id="sfp-skins-save-skin" class="button button-primary">Save skin</button>
		</div>
		<div id="sfp-skins-notice" style="display: none;">This is a notice</div>
		<div id="sfp-skins-apply-confirm" style="display: none;">
			<p>Are you sure you want to apply "<span class="skin-name"></span>" skin? Your current changes will be lost!
				<button id="sfp-skins-save-skin" class="button button-primary">Yeah, Apply skin</button>
				<button id="sfp-skins-save-skin" onclick="jQuery(this).parent.hide()" class="button">Cancel</button>
		</div>

		<div id="sfp-skins-actions" class="wp-full-overlay-header">
			<div id="sfps-user-actions">

				<a onclick="sfps.manage()" id="sfps-manage" class="button view-skins">
					Manage skins
				</a>
				<a class="button button-primary" id="sfp-skins-save-dialog" title="Save as a skin">
					Save skin
				</a>

			</div>
			<div id="sfps-new-user">
				Login to Storefront Pro Skins app
				<a onclick="sfps.loginPopup()" id="sfps-login" class="btn button-primary">Login</a>
			</div>
		</div>
		<?php

		$token = $this->token;
		$url = $this->url;

		wp_enqueue_style( $token . '-css', $url . '/assets/admin.css' );
		wp_enqueue_script( $token . '-js', $url . '/assets/admin.js', array( 'jquery' ) );

		$skins = json_decode( get_option( 'sfp_skins_data', '{}' ), 'array' );

		wp_localize_script( $token . '-js', 'sfpSkins', array(
			'data'	=> ! $skins ? new stdClass() : $skins,
			'theme'	=> 'storefront',
		) );

		wp_localize_script( $token . '-js', 'sfpsData', array(
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

		$wp_customize->add_section( 'sfp_skins_section',
			array(
				'title' => __( 'Skins', 'sfp-skins' ),
				'priority' => -7,
				'description' => __('Save and apply customizer settings as skins.', 'sfp-skin'),
			)
		);

		$wp_customize->add_setting( 'sfp_skins_data',
			array(
				'type' => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new Storefront_Pro_Skins_Customize_Control( $wp_customize, 'sfp_skins_data', array(
				'label' => __( 'Skins for this theme', 'sfp-skin' ),
				'section' => 'sfp_skins_section',
				'settings' => 'sfp_skins_data',
				'priority' => 7,
			) ) );

	}
	/** Adds admin menu */
	public function admin_menu() {
		add_theme_page(
			'Storefront Pro Skins',
			'Storefront Pro Skins',
			'manage_options',
			$this->token,
			function () {
				include dirname( __FILE__ ) . '/tpl-settings.php';
			}
		);
	}

	/** AJAX action to save skins data */
	public function ajax_sfp_skins_save() {
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

		if ( update_option( 'sfp_skins_data', $skins ) ) {
			die( 'Success: Skins updated' );
		}

		die( 'Success: Skin data identical.' );
	}

	/** AJAX action to export skins data */
	public function ajax_sfp_skins_export() {
		$json = get_option( 'sfp_skins_data', '{}' );
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
	public function ajax_sfp_skins_import() {
		$json = get_option( 'sfp_skins_data', '{}' );
		$skins = json_decode( $json, 'assoc_array' );

		if ( empty( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'sfpskins_import_settings' ) ) {
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

		update_option( 'sfp_skins_data', json_encode( $skins ) );

		die( 'success: Skins successfully imported from the file.' );
	}

	/**
	 * Adds front end stylesheet and js
	 * @action wp_enqueue_scripts
	 */
	public function admin_enqueue() {
		if ( ! filter_input( INPUT_GET, 'page' ) == 'sfp-skins' ) return;

		$token = $this->token;
		$url = $this->url;
		wp_enqueue_style( $token . '-css', $url . '/assets/skins-manager.css' );
		wp_enqueue_script( $token . '-js-skin-man', $url . '/assets/skins-manager.js', array( 'jquery', 'jquery-ui-sortable' ) );

		$skins = json_decode( get_option( 'sfp_skins_data', '{}' ), 'array' );

		wp_localize_script( $token . '-js-skin-man', 'sfpSkins', array(
			'data'	=> ! $skins ? new stdClass() : $skins,
			'theme'	=> 'storefront',
			'ajaxurl'	=> admin_url( 'admin-ajax.php' ),
			'importNonce' => wp_create_nonce( 'sfpskins_import_settings' ),
		) );
	}
}