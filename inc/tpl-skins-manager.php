<h2>Skins Manager</h2>

<?php
$skins = json_decode( get_option( 'wp_skins_data', '{}' ), 'array' );
$inactive_skins = $active_skins = '';

if ( $skins && ! empty( $skins ) ) {
	foreach ( $skins as $name => $data ) {
		var_dump( empty( $data['sfpSkinHidden'] ) );
		if ( empty( $data['sfpSkinHidden'] ) ) {
			$active_skins .= "<a class='wp-skin-button wp-skin-active button' data-name='$name'>$name</a>";
		} else {
			$inactive_skins .= "<a class='wp-skin-button wp-skin-inactive button' data-name='$name'>$name</a>";
		}
	}
}
?>

<div class="export-skins">
	<a href="#" id="export-skin" download="skin.json" data-href="<?php echo "$ajax_url?action=wp_skins_export&skin=" ?>"></a>
	<div data-skins-action="export" class="skins">
		Drop skins here to export
	</div>
</div>

<div class="active-skins">
	<h3>Active Skins</h3>
	<div data-skins-action="active" class="skins">
		<?php echo $active_skins ? $active_skins : ''; ?>
	</div>
</div>

<div class="inactive-skins">
	<h3>Inactive Skins</h3>
	<div data-skins-action="inactive" class="skins">
		<?php echo $inactive_skins ? $inactive_skins : ''; ?>
	</div>
</div>

<a href='#' id="wp-skins-save" class="button button-primary clear-fix">Save</a>