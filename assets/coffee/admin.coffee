###
 * Plugin admin end scripts
 *
 * @package Storefront_Pro_Skins
 * @version 1.0.0
###
sfps = {}

sfpSkins = if 'object' == typeof sfpSkins && sfpSkins then sfpSkins else {}

sfpSkins.data = if 'object' == typeof sfpSkins.data && sfpSkins.data then sfpSkins.data else {}

jQuery ($) ->

	# Element: Overlay
	sfpSkins.$orle = $ '#sfp-skins-overlay'

	# Element: Dialog
	sfpSkins.$dlg = $ '#sfp-skins-dialog'

	# Element: Skins control wrapper
	sfpSkins.$wrap = $ '#sfp-skins-wrap'

	# Element: Skins control wrapper
	sfpSkins.$skinApplyConfirmDialog = $ '#sfp-skins-apply-confirm'

	# Property: Settings maps
	sfpSkins.settingsMaps = {}

	# Method: Get setting value
	sfpSkins.prepMaps = ->
		sfpSkins.settingsMaps = {} # Reset maps
		count = 0
		supportedTypes = [ 'theme_mod', ]
		$.each( wp.customize.settings.controls, (k, control) ->
			if ( control && control.settings && control.settings.default ) # Control has a setting ID
				settingId = control.settings.default
				if ( wp.customize.settings.settings[ settingId ] ) # Setting for setting ID exists
					setting = wp.customize.settings.settings[ settingId ]
					if 0 > settingId.indexOf 'sfp_skins' # skip Storefront Pro Skins settings
						if setting.type in supportedTypes
							count++
							sfpSkins.settingsMaps[ settingId ] = k
			undefined
		)
		console.log(count + ' settings mapped')

	# Method: Get setting value
	sfpSkins.get = ( id ) ->
		return if wp.customize.control.value( id ) then wp.customize.control.value( id ).setting.get() else 'sfp_skins_no_value'

	# Method: Set setting value
	sfpSkins.set = ( id, val ) ->
		if val is 'false' then val = ''
		return if wp.customize.control.value( id ) then wp.customize.control.value( id ).setting.set( val ) else console.log( 'Couldn\'t set ' + id )

	# Method: Display notice
	sfpSkins.notice = ( message ) ->
		if ! message then return;
		$ '#sfp-skins-notice'
		.html( '<div id="sfp-skins-notice-message">' + message + '</div>' ).fadeIn(250)
		setTimeout(
			() ->
				$ '#sfp-skins-notice'
				.html('').fadeOut(250)
		,1100
		)

	# Method: Remove old skins
	sfpSkins.removeSkinsFromSite = ( msg ) ->
		sfpSkins.$wrap.html ''

		data =
			'action': 'sfp_skins_save'
			'skins': '{}',
			'theme': sfpSkins.theme

		$.post( ajaxurl, data, (r) ->
			console.log( 'WPSkins AJAX Success:', r )
			if msg then sfpSkins.notice msg
		).fail (r) ->
			console.log( 'WPSkins AJAX Failed:', r )
			sfpSkins.notice 'Error: Could not connect to server'

	# Method: Add skin to data
	sfpSkins.addSkin = ( name, values ) ->
		if ( sfpSkins.data && sfpSkins.data[ name ] )
			if ( confirm 'Skin with name "' + name + '" already exists, Do you wanna over write it?' )
				sfpSkins.data[ name ] = values
		else
			skin =
				name: name,
				data: values,

			sfps.appMsg( 'saveSkin', skin );
			sfpSkins.data[ name ] = values

	# Method: Show skin save dialog
	sfpSkins.showSaveDlg = () ->
		sfpSkins.$
		sfpSkins.$orle.show()
		sfpSkins.$dlg.show()

	# Method: Close skin save dialog
	sfpSkins.closeSaveDlg = () ->
		sfpSkins.$orle.hide()
		sfpSkins.$dlg.hide()

	# Method: Save skin button
	sfpSkins.saveSkinButton = () ->
		skinName = $( '#sfp-skins-skin-name' ).val()
		$( '#sfp-skins-skin-name' ).val( '' )

		if 'string' is typeof sfpSkins.renameSkin
			if sfpSkins.renameSkin isnt skinName
				sfpSkins.data[ skinName ] = sfpSkins.data[ sfpSkins.renameSkin ]
				delete sfpSkins.data[ sfpSkins.renameSkin ]
				delete sfpSkins.renameSkin
			$( '#sfp-skins-save-skin' ).text( 'Save skin' )
			sfpSkins.notice 'Skin Renamed'
		else
			count = 0
			values = {}
			$.each( sfpSkins.settingsMaps, ( setID, conID ) ->
				count++
				val = sfpSkins.get( conID ) # Get data with control ID
				if ( val != 'sfp_skins_no_value' )
					if val is 'false' then val = ''
					if typeof val is 'string'
						values[ setID ] = val # Set data with setting ID
				undefined
			)
			console.log(count + ' settings saved')

			sfpSkins.addSkin( skinName, values )
			sfpSkins.closeSaveDlg()
			sfpSkins.notice 'Skin Saved'

	# Prepare maps for settings
	sfpSkins.prepMaps()

	# DOM Manipulation
	$ '#customize-header-actions'
	.after( $ '#sfp-skins-actions' )

	# Handlers: Save skin dialog open button
	$( '#sfp-skins-save-dialog' ).click sfpSkins.showSaveDlg

	# Handlers: Save skin button
	$( '#sfp-skins-save-skin' ).click sfpSkins.saveSkinButton

	# Handlers: Save skin button
	sfpSkins.$skinApplyConfirmDialog.find( '.button-primary' ).click ()->
		$.each( sfpSkins.$skinApplyConfirmDialog.data( 'settings' ), ( setID, value ) ->
			settingId = if 'string' is typeof sfpSkins.settingsMaps[ setID ]
			then sfpSkins.settingsMaps[ setID ]
			else sfpSkins.settingsMaps[ setID + ']' ]

			if settingId
				sfpSkins.set( settingId, value )
			else
				console.log 'Couldn\'t find setting for ' + setID
			undefined
		)
		sfpSkins.$skinApplyConfirmDialog.hide()
		sfpSkins.notice 'Skin applied.'

	# Handler: Overlay close dialog
	sfpSkins.$orle.click sfpSkins.closeSaveDlg

	# Handler: Skin apply handler
	sfpSkins.$wrap.click ( e ) ->
		if sfpSkins.timesClickedSkin is 1 # Clicked second time within 250ms
			sfpSkins.doubleClickedSkin( e );
			sfpSkins.timesClickedSkin = 2; # Not single click
		else
			sfpSkins.timesClickedSkin = 1;

		setTimeout( () ->
			if sfpSkins.timesClickedSkin is 1
				sfpSkins.clickedSkin( e )
			sfpSkins.timesClickedSkin = false
		, 250 )

	$bd = $( 'body' );
	$appWrap = $( '#sfps-app-wrap' );


	sfps =
		postMsgActions:
			loggedIn: ->
				$bd.addClass 'sfps-logged-in'
				$appWrap.fadeOut()
				return
			loggedOut: ->
				$bd.removeClass 'sfps-logged-in'
				$appWrap.fadeOut()
				return
			applySkin: (skn) ->
				$appWrap.fadeOut()
				if ( skn )
					sfpSkins.$skinApplyConfirmDialog
						.data( 'skin', skn.name )
						.data( 'settings', skn.data )
						.show()
						.find( '.skin-name' ).html skn.name
				return
		saveRow: ->
			if $bd.hasClass('sfps-logged-in')
				$nameDlg.ppbDialog 'open'
			else
				alert 'You need to login to your pootle cloud account before you can save templates.'
			return
		manage: ->
			$appWrap.fadeIn()
			return
		logout: ->
			sfps.appMsg 'logout'
			return
		loginPopup: ->
			sfps.showLogin = true
			$appWrap.fadeIn()
			return
		appMsg: (cb, payload) ->
			sfps.appWin.postMessage {
				sfpsCallback: cb
				payload: payload
			}, '*'
			return
		receiveMessage: (e) ->
			callback = undefined
			payload = undefined
			msg = e[if e.message then 'message' else 'data']
			if e.origin.replace(/http[s]?:\/\//, '').indexOf(sfpsData.appUrl) and msg.sfpsCallback
				callback = msg.sfpsCallback
				payload = msg.payload
				console.log( callback )
				if typeof sfps.postMsgActions[callback] == 'function'
	# Call post message action callback
					sfps.postMsgActions[callback] payload
					sfps.appWin = e.source
			return
	window.addEventListener( 'message', sfps.receiveMessage, false );
