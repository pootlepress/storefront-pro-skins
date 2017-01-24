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

	# Element: Skins control wrapper
	wpSkins.$skinApplyConfirmDialog = $ '#wp-skins-apply-confirm'

	# Property: Settings maps
	wpSkins.settingsMaps = {}

	# Method: Get setting value
	wpSkins.prepMaps = ->
		wpSkins.settingsMaps = {} # Reset maps
		count = 0
		supportedTypes = [ 'theme_mod', ]
		$.each( wp.customize.settings.controls, (k, control) ->
			if ( control && control.settings && control.settings.default ) # Control has a setting ID
				settingId = control.settings.default
				if ( wp.customize.settings.settings[ settingId ] ) # Setting for setting ID exists
					setting = wp.customize.settings.settings[ settingId ]
					if 0 > settingId.indexOf 'wp_skins' # skip wp skins settings
						if setting.type in supportedTypes
							count++
							wpSkins.settingsMaps[ settingId ] = k
			undefined
		)
		console.log(count + ' settings mapped')

	# Method: Get setting value
	wpSkins.get = ( id ) ->
		return if wp.customize.control.value( id ) then wp.customize.control.value( id ).setting.get() else 'wp_skins_no_value'

	# Method: Set setting value
	wpSkins.set = ( id, val ) ->
		if val is 'false' then val = ''
		return if wp.customize.control.value( id ) then wp.customize.control.value( id ).setting.set( val ) else console.log( 'Couldn\'t set ' + id )

	# Method: Display notice
	wpSkins.notice = ( message ) ->
		if ! message then return;
		$ '#wp-skins-notice'
		.html( '<div id="wp-skins-notice-message">' + message + '</div>' ).fadeIn(250)
		setTimeout(
			() ->
				$ '#wp-skins-notice'
				.html('').fadeOut(250)
		,1100
		)

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
			wpSkins.notice 'Skin Renamed'
		else
			count = 0
			values = {}
			$.each( wpSkins.settingsMaps, ( setID, conID ) ->
				count++
				val = wpSkins.get( conID ) # Get data with control ID
				if ( val != 'wp_skins_no_value' )
					if val is 'false' then val = ''
					if typeof val is 'string'
						values[ setID ] = val # Set data with setting ID
				undefined
			)
			console.log(count + ' settings saved')
			wpSkins.addSkin( skinName, values )
			wpSkins.closeSaveDlg()
			wpSkins.notice 'Skin Saved'

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
				wpSkins.$skinApplyConfirmDialog
				.data( 'skin', skin )
				.data( 'settings', settings )
				.show().find '.skin-name'
				.html skin

	# Method: Clicked skin
	wpSkins.doubleClickedSkin = ( e ) ->
		$t = $( e.target )
		wpSkins.renameSkin = $t.closest( '.wp-skin-button' ).text()
		$( '#wp-skins-skin-name' ).val( wpSkins.renameSkin )
		$( '#wp-skins-save-skin' ).text( 'Rename' )
		wpSkins.showSaveDlg()

	# Prepare maps for settings
	wpSkins.prepMaps()

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

	# Handlers: Save skin button
	wpSkins.$skinApplyConfirmDialog.find( '.button-primary' ).click ()->
		$.each( wpSkins.$skinApplyConfirmDialog.data( 'settings' ), ( setID, value ) ->
			settingId = if 'string' is typeof wpSkins.settingsMaps[ setID ]
			then wpSkins.settingsMaps[ setID ]
			else wpSkins.settingsMaps[ setID + ']' ]

			if settingId
				wpSkins.set( settingId, value )
			else
				console.log 'Couldn\'t find setting for ' + setID
			undefined
		)
		wpSkins.notice 'Skin applied.'

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
				wpSkins.clickedSkin( e )
			wpSkins.timesClickedSkin = false
		, 250 )
