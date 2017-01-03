<?php

class WP_Skins_Customize_Control extends WP_Customize_Control {

	function __construct( WP_Customize_Manager $manager, $id, array $args ) {
		parent::__construct( $manager, $id, $args );
	}

	function render_content() {
		$skins = json_decode( $this->value(), 'array' );
		?>
		<label>
			<?php if ( ! empty( $this->label ) ) : ?>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
			<?php endif;
			if ( ! empty( $this->description ) ) : ?>
				<span class="description customize-control-description"><?php echo $this->description; ?></span>
			<?php endif; ?>
		</label>
		<div id="wp-skins-wrap">
			<?php
			foreach ( $skins as $name => $val ) {
				echo "<h3 class='wp-skin-button'>$name</h3>";
			}
			?>
		</div>
		<?php
	}
}