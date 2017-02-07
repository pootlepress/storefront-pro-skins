<div class="wrap">
	<h1>
		WP Skins
		<a href="https://wordpress.org/plugins/wp-skins/changelog/" class="button button-small right" target="_blank">
			Version <?php echo WP_Skins::$version ?>
		</a>
	</h1>
	<hr>
	<?php
	$ajax_url = admin_url( 'admin-ajax.php' );

	echo "
	<div class='button-group'>
		<a class='button button-primary' href='$ajax_url?action=wp_skins_export' download='wp-skins-export.json'>
			Export all Skins
		</a>
		<a class='button' href='#wp-skins-import'>
			Import Skins from file
		</a>
	</div>
	";
	?>

	<style>
		#wp-skins-import, #wp-skins-reset {
			position:fixed;
			width: 360px;
			padding: 10px 16px 16px;
			right: 50%;
			top: 34%;
			margin-right: -180px;
			background: #fff;
			box-shadow: 1px 1px 3px 2px rgba(0,0,0,0.16);
			display: none;
		}
		#wp-skins-import:target, #wp-skins-reset:target {
			display: block;
		}
	</style>
	<div id='wp-skins-import'>
		<div id="wpskins-import-msg"></div>
		<p>Please choose a file to import skins from.</p>
		<p><input type="file" id="wpskins-import-file"></p>
		<a class='button button-primary' type='button' id='wpskins-import-start' style='display:none;'>Import from file</a>
		<a class='button right' href='#wp-skins'>Cancel</a>
	</div>
	<div class='notice notice-warning' id='wp-skins-reset'>
		<p>Are you sure you wanna reset to default Storefront options?</p>
		<a class='button' href='<?php echo "$ajax_url?action=wp_skins_reset&redirect=$pagenow"; ?>'>Yeah</a>
		<a class='button button-primary right' href='#wp-skins'>Noooo!!!!</a>
	</div>
	<script>

	</script>

<?php include 'tpl-skins-manager.php'; ?>

</div><!-- .wrap -->