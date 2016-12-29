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
		$.each( wp.customize._value, (k,v) ->
			val = v._value
			if ( typeof val == 'string' )
				values[k] = val
		)
		console.log( values )


	$ '#wp-skins-save-dialog'
	.click () ->
		$overlay.show()
		$dialog.show()
	$overlay.click () ->
		$overlay.hide()
		$dialog.hide()