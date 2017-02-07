<?php

class Storefront_Pro_Skins_Customize_Control extends WP_Customize_Control {

	function __construct( WP_Customize_Manager $manager, $id, array $args ) {
		parent::__construct( $manager, $id, $args );
	}

	function render_content() {
		$skins = json_decode( $this->value(), 'array' );
		?>
		<span class="customize-control-title">
			Skins for Storefront Pro
		</span>
		<hr>
		<div id="sfp-skins-wrap">
			<?php
			if ( $skins ) {
				foreach ( $skins as $name => $data ) {
					if ( empty( $data['sfpSkinHidden'] ) ) {
						echo "<h3 class='sfp-skin-button'>$name<span class='delete dashicons dashicons-no'></span></h3>";
					}
				}
			} else {
				echo "<span class='no-skins'>You don't have any skins yet...</span>";
			}
			?>
		</div>
		<hr>
		<span class="description customize-control-description">
			Click on a skin to apply it, double click to rename it and click <span class='dashicons dashicons-no'></span> to delete.
		</span>
		<?php
	}
}