<?php

class Storefront_Pro_Skins_Customize_Control extends WP_Customize_Control {

	function __construct( WP_Customize_Manager $manager, $id, array $args ) {
		parent::__construct( $manager, $id, $args );

	}

	function render_content() {
		$skins = json_decode( $this->value(), 'array' );
		?>
		<div id="sfps-user-actions">
			<a onclick="sfps.manage()" id="sfps-manage" class="btn button-primary">Apply/Manage skins</a>
			<a onclick="sfps.logout()" id="sfps-logout" class="btn button">Logout</a>
		</div>
		<div id="sfps-new-user">
			<?php
			if ( $skins ) {
				?>
				Since version 2 we have moved skins storage to Storefront Skins cloud so they can be used on any site.
				Log in to Storefront Skins cloud to find your old skins.
				<?php
			} else {
				echo 'Login to pootle cloud to start saving and using skins.';
			}
			?>
			<a onclick="sfps.loginPopup()" id="sfps-login" class="btn button-primary">Login</a>
		</div>

		<div id="sfps-app-wrap" style="display: none;" onclick="jQuery(this).fadeToggle()">
			<i class="dashicons dashicons-no"></i>
			<iframe src="<?php echo Storefront_Pro_Skins::$app_url ?>" frameborder="0" id="sfps-app"></iframe>
		</div>
		<?php
	}
}