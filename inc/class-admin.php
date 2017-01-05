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
		add_action( 'wp_ajax_wp_skins_save', array( $this, 'ajax_wp_skins_save' ) );
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
		<?php

		$token = $this->token;
		$url = $this->url;

		wp_enqueue_style( $token . '-css', $url . '/assets/admin.css' );
		wp_enqueue_script( $token . '-js', $url . '/assets/admin.js', array( 'jquery' ) );

		$skins = json_decode( get_option( 'wp_skins_data', '{}' ), 'array' );
		$theme = get_stylesheet();

		wp_localize_script( $token . '-js', 'wpSkins', array(
			'data'	=> ! $skins || empty( $skins[ $theme ] ) ? new stdClass() : $skins[ $theme ],
			'theme'	=> $theme,
		) );
	}

	/**
	 * AJAX action to save skins data
	 */
	public function ajax_wp_skins_save() {
		if ( current_user_can( 'manage_options' ) && ! empty( $_POST['skins'] ) && ! empty( $_POST['theme'] ) ) {
			$theme = $_POST['theme'];
			$skins = json_decode( get_option( 'wp_skins_data', '{}' ), 'array' );
			if ( ! $skins ) {
				$skins = array();
			}
			$skins[ $theme ] = $_POST['skins'];
			if ( update_option( 'wp_skins_data', json_encode( $skins ) ) ) {
				die( 'success' );
			} else {
				die( '' );
			}
		}
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
}