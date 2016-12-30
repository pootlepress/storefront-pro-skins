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

		add_action( 'customize_register', array( $this, 'customize_register' ) );
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
			<input placeholder="Skin name" type="text" id="wp-skins-name">
			<button id="wp-skins-save-skin" class="button button-primary">Save skin</button>
		</div>
		<?php

		$token = $this->token;
		$url = $this->url;

		wp_enqueue_style( $token . '-css', $url . '/assets/admin.css' );
		wp_enqueue_script( $token . '-js', $url . '/assets/admin.js', array( 'jquery' ) );
		wp_localize_script( $token . '-js', 'wpSkins', array(
			'data' => get_option( 'wp_skin_data', array() ),
		) );
	}
	/**
	 * Registers customizer elements
	 * @param WP_Customize_Manager $wp_customize
	 */
	public function customize_register( $wp_customize ) {
		$wp_customize->add_section( 'wp_skins_section',
			array(
				'title' => __( 'Skins', 'wp-skins' ),
				'priority' => -7,
				'description' => __('Save and apply customizer settings as skins.', 'wp-skin'),
			)
		);

		$wp_customize->add_setting( 'wp_skins',
			array(
				'type' => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			'wp_skin_data',
			array(
				'label' => __( 'Skins data', 'wp-skin' ),
				'type' => 'hidden',
				'section' => 'wp_skins_section',
				'settings' => 'wp_skins',
				'priority' => 7,
			)
		);

	}
}