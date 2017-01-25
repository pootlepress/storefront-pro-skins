<h2>Skins Manager</h2>

<?php
$skins = json_decode( get_option( 'wp_skins_data', '{}' ), 'array' );
$inactive_skins = $active_skins = '';

if ( $skins && ! empty( $skins[ 'storefront' ] ) ) {
	foreach ( $skins[ 'storefront' ] as $name => $val ) {
		if ( $name[0] != '_' ) {
			$active_skins .= "<a class='wp-skin-button button'>$name</a>";
		} else {
			$inactive_skins .= "<a class='wp-skin-button button'>$name</a>";
		}
	}
}
?>

<div class="export-skins">
	Drop skins here to export
</div>

<div class="active-skins">
	<h3>Active Skins</h3>
	<?php echo $active_skins ? $active_skins : ''; ?>
</div>

<div class="inactive-skins">
	<h3>Inactive Skins</h3>
	<?php echo $inactive_skins ? $inactive_skins : ''; ?>
</div>