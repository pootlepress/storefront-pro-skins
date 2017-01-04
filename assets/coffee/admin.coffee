###
 * Plugin admin end scripts
 *
 * @package WP_Skins
 * @version 1.0.0
###

wpSkins = if 'object' == typeof wpSkins && wpSkins then wpSkins else {}

wpSkins.data = if 'object' == typeof wpSkins.data && wpSkins.data then wpSkins.data else {}

jQuery ($) ->

	# Element: Overlay
	wpSkins.$orle = $ '#wp-skins-overlay'

	# Element: Dialog
	wpSkins.$dlg = $ '#wp-skins-dialog'

	# Element: Skins control wrapper
	wpSkins.$wrap = $ '#wp-skins-wrap'

	# Method: Get setting value
	wpSkins.get = ( id ) ->
		return if wp.customize.control.value( id ) then wp.customize.control.value( id ).setting.get() else 'wp_skins_no_value'

	# Method: Set setting value
	wpSkins.set = ( id, val ) ->
		return if wp.customize.control.value( id ) then wp.customize.control.value( id ).setting.set( val ) else console.log( 'Couldn\'t set ' + id )

	# Method: Prepare skins control
	wpSkins.refreshSkinControl = () ->
		wpSkins.$wrap.html ''

		data = {
			'action': 'wp_skins_save',
			'skins': wpSkins.data
		};

		$.post( ajaxurl, data, (response) -> )

		$.each( wpSkins.data, ( name, values ) ->
			wpSkins.$wrap.append(
				$ '<h3></h3>'
				.addClass 'wp-skin-button'
				.html name
			)
		);

	# Method: Add skin to data
	wpSkins.addSkin = ( name, values ) ->
		if ( wpSkins.data && wpSkins.data[ name ] )
			if ( confirm 'Skin with name "' + name + '" already exists, Do you wanna over write it?' )
				wpSkins.data[ name ] = values
		else
			wpSkins.data[ name ] = values
		wpSkins.refreshSkinControl();

	# Method: Show skin save dialog
	wpSkins.showSaveDlg = () ->
		wpSkins.$orle.show()
		wpSkins.$dlg.show()

	# Method: Close skin save dialog
	wpSkins.closeSaveDlg = () ->
		wpSkins.$orle.hide()
		wpSkins.$dlg.hide()

	# Method: Save skin button
	wpSkins.saveSkinButton = () ->
		values = {}
		$.each( wp.customize.settings.settings, (k,v) ->
			if ( v && v.type == 'theme_mod' )
				val = wpSkins.get( k )
				if ( val != 'wp_skins_no_value' )
					values[k] = val
		)
		wpSkins.addSkin( $( '#wp-skins-skin-name' ).val(), values )
		wpSkins.closeSaveDlg()

	# DOM Manipulation
	$ '#customize-header-actions'
	.prepend(
		$ '<a/>'
		.addClass 'button button-primary'
		.attr( { id: 'wp-skins-save-dialog', title: 'Save as a skin' } )
		.html 'Save skin'
	)

	# Handlers: Save skin dialog open button
	$( '#wp-skins-save-dialog' ).click wpSkins.showSaveDlg

	# Handlers: Save skin button
	$( '#wp-skins-save-skin' ).click wpSkins.saveSkinButton

	# Handler: Overlay close dialog
	wpSkins.$orle.click wpSkins.closeSaveDlg

	# Handler: Skin apply handler
	wpSkins.$wrap.click ( e ) ->
		$t = $( e.target )
		if $t.is( '.wp-skin-button' )
			settings = wpSkins.data[$t.html()];

			if ( settings )
				if ( confirm 'Are you sure you want to apply "' + $t.html() + '" skin? Your current changes will be lost!' )
					$.each( settings, ( k, v ) ->
						wpSkins.set( k, v );
					)
