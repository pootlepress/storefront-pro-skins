jQuery ( $ ) ->
	$xpA = $ '#export-skin'
	skinsSortingHandlers =
		fromList	: null
		export		: ( $t, $f, ui ) ->
			$f.sortable( "cancel" );
			attr =
				download:	ui.item.data( 'name' ) + '.json'
				href:		$xpA.data( 'href' ) + ui.item.data 'name'

			console.log(attr,ui)
			$xpA.attr attr
			$xpA[0].click() # jQuery.click doesn't seem to work

		active		: ( $t, $f ) ->
			console.log 'Handling active'
		inactive	: ( $t, $f ) ->
			console.log 'Handling inactive'

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
