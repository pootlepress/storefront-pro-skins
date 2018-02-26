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
			<header>Save skin <span class="dashicons dashicons-no" onclick="sfpSkins.closeSaveDlg()"></span></header>
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
			<p>
				Are you sure you want to apply "<span class="skin-name"></span>" skin? Your current changes will be lost!
				<button id="sfp-skins-apply" class="button button-primary">Yeah, Apply skin</button>
				<button id="sfp-skins-dont-apply" onclick="jQuery(this).closest('#sfp-skins-apply-confirm').hide()" class="button">Cancel</button>
			</p>
		</div>

		<div id="sfp-skins-actions" class="wp-full-overlay-header">
			<div id="sfps-connecting">
				Connecting with Storefront Skins Cloud...
			</div>
			<div id="sfps-user-actions">

				<a onclick="sfps.manage()" id="sfps-manage" class="button view-skins">
					Manage skins
				</a>
				<a class="right button button-primary" id="sfp-skins-save-dialog" title="Save as a skin">
					Save skin
				</a>

			</div>
			<div id="sfps-new-user">
				<a onclick="sfps.loginPopup()" id="sfps-login" class="btn button-primary">Login</a> to Storefront Skins Cloud
			</div>
		</div>

		<div id="sfps-app-wrap" style="display: none;" onclick="jQuery(this).fadeToggle()">
			<i class="dashicons dashicons-no"></i>
			<iframe frameborder="0" id="sfps-app"></iframe>
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
			'appUrl' => Storefront_Pro_Skins::$app_url,
		) );
	}

	public function ajax_sfp_clear_skins() {
		if ( ! current_user_can( 'manage_options' ) ) {
			die( "You don't have permission to manage options." );
		}

		if ( delete_option( 'sfp_skins_data' ) ) {
			die( 'Success: Skins updated' );
		}

		die( 'Success: Skin data identical.' );

	}
}