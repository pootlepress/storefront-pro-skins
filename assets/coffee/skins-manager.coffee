jQuery ( $ ) ->

	$msg = $('#wpskins-import-msg')
	$xpA = $ '#export-skin'

	msg = (msg) ->
		if !msg
			return
		response =
			msg: msg.charAt(0).toUpperCase() + msg.slice(1)
			type: if msg.indexOf('failed') == 0 then 'error' else 'info'
		$msg.html '<div class="notice notice-' + response.type + '"><p>' + response.msg + '</p></div>'
		return

	importSkins = ( json, callback, postData )->
		postData = if postData then postData else {};

		if typeof json isnt 'string' then json = JSON.stringify(json)

		postData.json  = json
		postData.nonce = sfpSkins.importNonce

		reqArgs =
			type   : 'POST'
			url    : ajaxurl + '?action=wp_skins_import'
			data   : postData
			success: callback
		$.ajax reqArgs


	readFile = ( callback ) ->
		if !window.FileReader
			alert 'The FileReader API is not supported in this browser.'
			return
		$i = $('#wpskins-import-file')
		input = $i[0]
		if input.files and input.files[0]
			file = input.files[0]
			fr = new FileReader

			fr.onload = ->
				callback( fr.result, file, fr )

			fr.readAsText file
		else
			alert 'File not selected or browser incompatible.'


	$('#wpskins-import-start').click ->
		readFile ( json, file ) ->
			msg 'Uploading file ' + file.name + '.'
			importSkins(
				json,
				( res ) ->
					msg res
			)

	skinsSortingHandlers =
		fromList	: null
		export		: ( $t, $f, ui ) ->
			$f.sortable( "cancel" );
			attr =
				download:	ui.item.data( 'name' ) + '.json'
				href:		$xpA.data( 'href' ) + ui.item.data 'name'

			$xpA.attr attr
			$xpA[0].click() # jQuery.click doesn't seem to work

		active		: ( $t, $f, ui ) ->
			skin = ui.item.data( 'name' )
			sfpSkins.data[ skin ].sfpSkinHidden = false;
		inactive	: ( $t, $f, ui ) ->
			skin = ui.item.data( 'name' )
			sfpSkins.data[ skin ].sfpSkinHidden = true;

	$ '.skins'
	.sortable
		connectWith: '.skins',
		receive: (e,ui) ->
			$t = $ this
			action = $t.data 'skins-action'
			if skinsSortingHandlers[ action ]
				skinsSortingHandlers[ action ]( $t, ui.sender, ui )
			else
				console.log "No handler for action: " + action

	$ '#wpskins-import-file'
	.change ->
		$ '#wpskins-import-start'
		.fadeIn()

	$ '#wp-skins-save'
	.click ->
		importSkins(
			sfpSkins.data,
			( res ) ->
				if res.search( 'success' ) > -1
					alert 'Saved skins'
				else
					alert 'Failed to save skins'
					console.log res
		)
