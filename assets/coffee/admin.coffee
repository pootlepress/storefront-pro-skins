###
 * Plugin admin end scripts
 *
 * @package WP_Skins
 * @version 1.0.0
###
jQuery ($) ->
	$overlay = $ '#wp-skins-overlay'
	$dialog = $ '#wp-skins-dialog'
	

	$ '#customize-header-actions'
	.prepend(
		$ '<a/>'
		.addClass 'button button-primary'
		.attr( { id: 'wp-skins-save-dialog', title: 'Save as a skin' } )
		.html 'Save skin'
	)

	$ '#wp-skins-save-skin'
	.click () ->
		values = {}
		$ '[data-customize-setting-link]'
		.each () ->
			$t = $( this )
			if ( ( $t.is ':radio' || $t.is ':checkbox' ) && ! $t.prop 'checked' )
				return;
			values[$t.attr( 'data-customize-setting-link' )] = $t.val()
		console.log( values )


	$ '#wp-skins-save-dialog'
	.click () ->
		$overlay.show()
		$dialog.show()