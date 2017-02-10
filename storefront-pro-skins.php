<?php
/*
Plugin Name: Storefront Pro Skins
Plugin URI: http://pootlepress.com/
Description: Save instances of theme customization settings as skins and apply them on demand later.
Author: pootlepress
Version: 0.5.0
Author URI: http://pootlepress.com/
@developer shramee <shramee.srivastav@gmail.com>
*/

/** Plugin admin class */
require 'inc/class-admin.php';
/** Plugin public class */
require 'inc/class-public.php';

/**
 * Storefront Pro Skins main class
 * @static string $token Plugin token
 * @static string $file Plugin __FILE__
 * @static string $url Plugin root dir url
 * @static string $path Plugin root dir path
 * @static string $version Plugin version
 */
class Storefront_Pro_Skins{

	/** @var Storefront_Pro_Skins Instance */
	private static $_instance = null;

	/** @var string Token */
	public static $token;

	/** @var string Version */
	public static $version;

	/** @var string Plugin main __FILE__ */
	public static $file;

	/** @var string Plugin directory url */
	public static $url;

	/** @var string Plugin directory path */
	public static $path;

	/** @var Storefront_Pro_Skins_Admin Instance */
	public $admin;

	/** @var Storefront_Pro_Skins_Public Instance */
	public $public;

	/**
	 * Return class instance
	 * @return Storefront_Pro_Skins instance
	 */
	public static function instance( $file = __FILE__ ) {
		if ( null == self::$_instance ) {
			self::$_instance = new self( $file );
		}
		return self::$_instance;
	}

	/**
	 * Constructor function.
	 * @param string $file __FILE__ of the main plugin
	 * @access  private
	 * @since   1.0.0
	 */
	private function __construct( $file ) {

		self::$token   = 'sfp-skins';
		self::$file    = $file;
		self::$url     = plugin_dir_url( $file );
		self::$path    = plugin_dir_path( $file );
		self::$version = '0.5.0';

		add_action( 'after_setup_theme', array( $this, 'setup' ) );
	}

	/**
	 * Initiates the plugin
	 * @action init
	 */
	public function setup() {
		$theme = wp_get_theme();
		if ( class_exists( 'Storefront_Pro' ) && ( $theme->name == 'Storefront' || $theme->parent_theme == 'Storefront' ) ) {
			$this->_admin(); //Initiate admin
			$this->_public(); //Initiate public
		}
	}

	/**
	 * Initiates admin class and adds admin hooks
	 */
	private function _admin() {
		//Instantiating admin class
		$this->admin = Storefront_Pro_Skins_Admin::instance();

		//Enqueue admin end JS and CSS
		add_action( 'customize_controls_print_footer_scripts',	array( $this->admin, 'enqueue' ) );
		add_action( 'admin_enqueue_scripts',					array( $this->admin, 'admin_enqueue' ) );
		add_action( 'customize_register',						array( $this->admin, 'customize_register' ) );
		add_action( 'admin_menu',								array( $this->admin, 'admin_menu' ) );
		add_action( 'wp_ajax_sfp_skins_save',					array( $this->admin, 'ajax_sfp_skins_save' ) );
		add_action( 'wp_ajax_sfp_skins_export',					array( $this->admin, 'ajax_sfp_skins_export' ) );
		add_action( 'wp_ajax_sfp_skins_import',					array( $this->admin, 'ajax_sfp_skins_import' ) );

	}

	/**
	 * Initiates public class and adds public hooks
	 */
	private function _public() {
		//Instantiating public class
		$this->public = Storefront_Pro_Skins_Public::instance();

		//Enqueue front end JS and CSS
		add_action( 'wp_enqueue_scripts',	array( $this->public, 'enqueue' ) );

	}
}

/** Intantiating main plugin class */
Storefront_Pro_Skins::instance( __FILE__ );
