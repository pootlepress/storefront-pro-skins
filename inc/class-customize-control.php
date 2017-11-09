<?php

class Storefront_Pro_Skins_Customize_Control extends WP_Customize_Control {

	function __construct( WP_Customize_Manager $manager, $id, array $args ) {
		parent::__construct( $manager, $id, $args );

	}

	function render_content() {
		$skins = json_decode( $this->value(), 'array' );
		?>

		<div id="sfps-app-wrap" style="display: none;" onclick="jQuery(this).fadeToggle()">
			<i class="dashicons dashicons-no"></i>
			<iframe src="<?php echo Storefront_Pro_Skins::$app_url ?>" frameborder="0" id="sfps-app"></iframe>
		</div>
		<?php
	}
}