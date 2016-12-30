###
 * Plugin admin end scripts
 *
 * @package WP_Skins
 * @version 1.0.0
###

wpSkins = if typeOf wpSkins == 'object' then wpSkins else {}

jQuery ($) ->

	# Properties
	wpSkins.$orle = $ '#wp-skins-overlay'
	wpSkins.$dlg = $ '#wp-skins-dialog'

	# Methods
	wpSkins.get = ( id ) ->
		wp.customize.control.value( id ).setting.get()
	wpSkins.set = ( id, val ) ->
		wp.customize.control.value( id ).setting.set( val )
	wpSkins.showSaveDlg = () ->
		wpSkins.$orle.show()
		wpSkins.$dlg.show()
	wpSkins.closeSaveDlg = ( id, val ) ->
		wpSkins.$orle.hide()
		wpSkins.$dlg.hide()
	wpSkins.saveSkin = () ->
		values = {}
		$.each( wp.customize.settings.settings, (k,v) ->
			if ( v && v.type == 'theme_mod' )
				values[k] = wpSkins.get( k )
		)
		# @TODO Save values
		wpSkins.closeSaveDlg

	# DOM Manipulation
	$ '#customize-header-actions'
	.prepend(
		$ '<a/>'
		.addClass 'button button-primary'
		.attr( { id: 'wp-skins-save-dialog', title: 'Save as a skin' } )
		.html 'Save skin'
	)

	# Event Handlers
	$( '#wp-skins-save-skin' ).click wpSkins.saveSkin

	$( '#wp-skins-save-dialog' ).click wpSkins.showSaveDlg

	wpSkins.$orle.click wpSkins.closeSaveDlg
