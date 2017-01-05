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
			'action': 'wp_skins_save'
			'skins': wpSkins.data
			'theme': wpSkins.theme
		};

		$.post( ajaxurl, data, (response) -> )

		$.each( wpSkins.data, ( name, v ) ->
			wpSkins.$wrap.append(
				$ '<h3></h3>'
				.addClass 'wp-skin-button'
				.html name
				.append(
					$ '<span></span>'
					.addClass 'delete dashicons dashicons-no'
				)
			)
		)
		wpSkins.$wrap.append '<span class="no-skins">You don\'t have any skins for ' + wpSkins.theme + ' theme...</span>'

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
		wpSkins.$
		wpSkins.$orle.show()
		wpSkins.$dlg.show()

	# Method: Close skin save dialog
	wpSkins.closeSaveDlg = () ->
		wpSkins.$orle.hide()
		wpSkins.$dlg.hide()

	# Method: Save skin button
	wpSkins.saveSkinButton = () ->
		skinName = $( '#wp-skins-skin-name' ).val()
		$( '#wp-skins-skin-name' ).val( '' )

		if 'string' is typeof wpSkins.renameSkin
			if wpSkins.renameSkin isnt skinName
				wpSkins.data[ skinName ] = wpSkins.data[ wpSkins.renameSkin ]
				delete wpSkins.data[ wpSkins.renameSkin ]
				delete wpSkins.renameSkin
				wpSkins.refreshSkinControl();
			$( '#wp-skins-save-skin' ).text( 'Save skin' )
		else
			values = {}
			$.each( wp.customize.settings.settings, (k,v) ->
				if ( v && v.type == 'theme_mod' )
					val = wpSkins.get( k )
					if ( val != 'wp_skins_no_value' )
						values[k] = val
			)
			wpSkins.addSkin( skinName, values )
		wpSkins.closeSaveDlg()

	# Method: Clicked skin
	wpSkins.clickedSkin = ( e ) ->
		$t = $( e.target )
		skin = $t.closest( '.wp-skin-button' ).text()

		if $t.is( '.wp-skin-button .delete' )
			if confirm 'Are you sure you want to delete "' + skin + '" skin?'
				delete wpSkins.data[ skin ]
				wpSkins.refreshSkinControl();
		else if $t.is( '.wp-skin-button' )
			settings = wpSkins.data[ skin ]
			if ( settings )
				if ( confirm 'Are you sure you want to apply "' + skin + '" skin? Your current changes will be lost!' )
					$.each( settings, ( k, v ) ->
						wpSkins.set( k, v )
					)

	# Method: Clicked skin
	wpSkins.doubleClickedSkin = ( e ) ->
		$t = $( e.target )
		wpSkins.renameSkin = $t.closest( '.wp-skin-button' ).text()
		$( '#wp-skins-skin-name' ).val( wpSkins.renameSkin )
		$( '#wp-skins-save-skin' ).text( 'Rename' )
		wpSkins.showSaveDlg()

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
		if wpSkins.timesClickedSkin is 1 # Clicked second time within 250ms
			wpSkins.doubleClickedSkin( e );
			wpSkins.timesClickedSkin = 2; # Not single click
		else
			wpSkins.timesClickedSkin = 1;

		setTimeout( () ->
			if wpSkins.timesClickedSkin is 1
				wpSkins.clickedSkin( e );
			wpSkins.timesClickedSkin = false;
		, 250 );
