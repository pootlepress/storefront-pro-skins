<?php

/**
 * Storefront Pro Skins public class
 */
class Storefront_Pro_Skins_Public{

	/** @var Storefront_Pro_Skins_Public Instance */
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
	 * Storefront Pro Skins public class instance
	 * @return Storefront_Pro_Skins_Public instance
	 */
	public static function instance() {
		if ( null == self::$_instance ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Constructor function.
	 * @access  private
	 * @since   1.0.0
	 */
	private function __construct() {
		$this->token   =   Storefront_Pro_Skins::$token;
		$this->url     =   Storefront_Pro_Skins::$url;
		$this->path    =   Storefront_Pro_Skins::$path;
		$this->version =   Storefront_Pro_Skins::$version;
	}

	/**
	 * Adds front end stylesheet and js
	 * @action wp_enqueue_scripts
	 */
	public function enqueue() {
		$token = $this->token;
		$url = $this->url;

		wp_enqueue_style( $token . '-css', $url . '/assets/front.css' );
		wp_enqueue_script( $token . '-js', $url . '/assets/front.js', array( 'jquery' ) );
	}
}