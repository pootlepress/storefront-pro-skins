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
		<p>Are you sure you wanna import Skins for this file? All your current Skins will be lost.</p>
		<p><input type="file" id="wpskins-import-file"></p>
		<a class='button button-primary' type='button' id='wpskins-import-start'>Yeah, Load file</a>
		<a class='button right' href='#wp-skins'>No, thanks</a>
	</div>
	<div class='notice notice-warning' id='wp-skins-reset'>
		<p>Are you sure you wanna reset to default Storefront options?</p>
		<a class='button' href='<?php echo "$ajax_url?action=wp_skins_reset&redirect=$pagenow"; ?>'>Yeah</a>
		<a class='button button-primary right' href='#wp-skins'>Noooo!!!!</a>
	</div>
	<script>
		( function ( $ ) {
			var $msg = $( '#wpskins-import-msg' ),
				msg = function ( msg ) {
					if ( ! msg ) return;
					response = {
						msg:	msg.charAt(0).toUpperCase() + msg.slice(1),
						type:	msg.indexOf( 'failed' ) === 0 ? 'error' : 'info'
					};
					$msg.html(
						'<div class="notice notice-' + response.type + '"><p>' + response.msg + '</p></div>'
					)
				};
			$( '#wpskins-import-start' ).click( function () {
				if ( ! window.FileReader ) {
					alert( 'The FileReader API is not supported in this browser.' );
					return;
				}

				var $i = $( '#wpskins-import-file' ), // Put file input ID here
					input = $i[0];

				if ( input.files && input.files[0] ) {
					var file = input.files[0];
					console.log( file );
					var fr = new FileReader();
					fr.onload = function () {
						var json = fr.result,
							reqArgs;
						msg( 'Requesting import from file ' + file.name + '.' );
						reqArgs = {
							type: "POST",
							url: '<?php echo "$ajax_url?action=wp_skins_import"; ?>',
							data: {
								json: json,
								nonce: '<?php echo wp_create_nonce( 'wpskins_import_settings' ) ?>'
							},
							success: function ( res ) {
								msg( res );
							}
						};
						// console.log( reqArgs );
						$.ajax( reqArgs );
					};
					fr.readAsText( file );
				} else {
					// Handle errors here
					alert( "File not selected or broser incompatible." )
				}
			} );
		} )( jQuery );
	</script>

</div><!-- .wrap -->