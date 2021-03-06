/*
 * Plugin admin end scripts
 *
 * @package Storefront_Pro_Skins
 * @version 1.0.0
 */

// region Set up
sfps = {};
sfpSkins = 'object' === typeof sfpSkins && sfpSkins ? sfpSkins : {};
// endregion

jQuery( function ( $ ) {
	var $appWrap, $bd;

	// region Elements reference
	sfpSkins.$orle = $( '#sfp-skins-overlay' );
	sfpSkins.$dlg = $( '#sfp-skins-dialog' );
	sfpSkins.$wrap = $( '#sfp-skins-wrap' );
	sfpSkins.$skinApplyConfirmDialog = $( '#sfp-skins-apply-confirm' );
	// endregion

	sfpSkins.settingsMaps = {};

	// region Skins data from customizer

	sfpSkins.prepMaps = function () {
		var count, supportedTypes;
		sfpSkins.settingsMaps = {};
		count = 0;
		supportedTypes = ['theme_mod'];
		$.each( wp.customize.settings.controls, function ( k, control ) {
			var ref, setting, settingId;
			if ( control && control.settings && control.settings["default"] ) {
				settingId = control.settings["default"];
				if ( wp.customize.settings.settings[settingId] ) {
					setting = wp.customize.settings.settings[settingId];
					if ( 0 > settingId.indexOf( 'sfp_skins' ) ) {
						if ( supportedTypes.indexOf( setting.type ) >= 0 ) {
							count ++;
							sfpSkins.settingsMaps[settingId] = k;
						}
					}
				}
			}
			return void 0;
		} );
		return console.log( count + ' settings mapped' );
	};
	sfpSkins.get = function ( id ) {
		if ( wp.customize.control.value( id ) ) {
			return wp.customize.control.value( id ).setting.get();
		} else {
			return 'sfp_skins_no_value';
		}
	};
	sfpSkins.set = function ( id, val ) {
		if ( val === 'false' ) {
			val = '';
		}
		if ( wp.customize.control.value( id ) ) {
			return wp.customize.control.value( id ).setting.set( val );
		} else {
			return console.log( 'Couldn\'t set ' + id );
		}
	};

	// endregion

	// region Utilities

	sfpSkins.notice = function ( message ) {
		if ( ! message ) {
			return;
		}
		$( '#sfp-skins-notice' )
			.html( '<div id="sfp-skins-notice-message">' + message + '</div>' )
			.fadeIn( 250 );

		setTimeout( function () {
			return $( '#sfp-skins-notice' ).html( '' ).fadeOut( 250 );
		}, 2500 );

	};

	sfpSkins.getSkinValues = function () {
		var values = {};
		$.each( sfpSkins.settingsMaps, function ( setID, conID ) {

			var val = sfpSkins.get( conID );

			if ( val !== 'sfp_skins_no_value' ) {
				if ( val === 'false' ) {
					val = '';
				}
				if ( typeof val === 'string' ) {
					values[setID] = val;
				}
			}

		} );
		return values;
	};

	sfpSkins.saveSkin = function ( name, values ) {
		var skin;
		skin = {
			name: name,
			data: values
		};
		return sfps.appMsg( 'saveSkin', skin );
	};

	sfpSkins.removeSkinsFromSite = function(msg) {
		var data;
		sfpSkins.$wrap.html('');
		data = {
			'action': 'sfp_clear_skins',
		};
		return $.post(ajaxurl, data, function(r) {
			console.log('WPSkins AJAX Success:', r);
			if (msg) {
				return sfpSkins.notice(msg);
			}
		}).fail(function(r) {
			console.log('WPSkins AJAX Failed:', r);
			return sfpSkins.notice('Error: Could not connect to server');
		});
	};

	// endregion

	sfpSkins.prepMaps();

	sfpSkins.closeSaveDlg = function () {
		sfpSkins.$orle.hide();
		return sfpSkins.$dlg.hide();
	};

	$( '#customize-header-actions' ).after( $( '#sfp-skins-actions' ) );

	$( '#sfp-skins-save-dialog' ).click( function () {
		sfpSkins.$orle.show();
		return sfpSkins.$dlg.show();
	} );

	$( '#sfp-skins-save-skin' ).click( function () {
		var $sknName = $( '#sfp-skins-skin-name' );

		sfpSkins.saveSkin( $sknName.val(), sfpSkins.getSkinValues() );

		$sknName.val( '' );

		sfpSkins.closeSaveDlg();
		sfpSkins.notice( 'Skin Saved' );
	} );

	sfpSkins.$orle.click( sfpSkins.closeSaveDlg );

	sfpSkins.$wrap.click( function ( e ) {
		if ( sfpSkins.timesClickedSkin === 1 ) {
			sfpSkins.doubleClickedSkin( e );
			sfpSkins.timesClickedSkin = 2;
		} else {
			sfpSkins.timesClickedSkin = 1;
		}
		return setTimeout( function () {
			if ( sfpSkins.timesClickedSkin === 1 ) {
				sfpSkins.clickedSkin( e );
			}
			return sfpSkins.timesClickedSkin = false;
		}, 250 );
	} );

	$bd = $( 'body' );
	$appWrap = $( '#sfps-app-wrap' );

	sfps = {
		postMsgActions: {
			loggedIn: function () {

				$bd.addClass( 'sfps-logged-in' );
				$bd.removeClass( 'sfps-logged-out' );

				if ( sfpSkins.data && ! jQuery.isEmptyObject( sfpSkins.data ) ) {
					sfps.appMsg( 'syncSkins', sfpSkins.data );
				} else {
					$appWrap.fadeOut();
				}
			},
			syncedSkins: function ( success ) {
				if ( success ) {
					delete sfpSkins.data;
					sfpSkins.removeSkinsFromSite( 'Skins synced to Pootle cloud successfully.' );
				}
				$appWrap.fadeOut();
			},
			loggedOut: function () {
				$bd.removeClass( 'sfps-logged-in' );
				$bd.addClass( 'sfps-logged-out' );
				$appWrap.fadeOut();
			},
			applySkin: function ( skn ) {
				$appWrap.fadeOut();
				if ( skn ) {
					$.each( skn.data, function ( setID, value ) {
						var settingId;
						settingId = 'string' === typeof sfpSkins.settingsMaps[setID] ? sfpSkins.settingsMaps[setID] : sfpSkins.settingsMaps[setID + ']'];
						if ( settingId ) {
							sfpSkins.set( settingId, value );
						} else {
							console.log( 'Couldn\'t find setting for ' + setID );
						}
						return void 0;
					} );
					return sfpSkins.notice( 'Loading skin preview...' );
				}
			}
		},
		saveRow: function () {
			if ( $bd.hasClass( 'sfps-logged-in' ) ) {
				$nameDlg.ppbDialog( 'open' );
			} else {
				alert( 'You need to login to your pootle cloud account before you can save templates.' );
			}
		},
		manage: function () {
			$appWrap.fadeIn();
		},
		logout: function () {
			sfps.appMsg( 'logout' );
		},
		loginPopup: function () {
			sfps.showLogin = true;
			$appWrap.fadeIn();
		},
		appMsg: function ( cb, payload ) {
			sfps.appWin.postMessage( {
				sfpsCallback: cb,
				payload: payload
			}, '*' );
		},
		receiveMessage: function ( e ) {
			var callback, msg, payload;
			callback = void 0;
			payload = void 0;
			msg = e[e.message ? 'message' : 'data'];
			if ( e.origin.replace( /http[s]?:\/\//, '' ).indexOf( sfpSkins.appUrl ) && msg.sfpsCallback ) {
				callback = msg.sfpsCallback;
				payload = msg.payload;
				console.log( callback );
				if ( typeof sfps.postMsgActions[callback] === 'function' ) {
					sfps.postMsgActions[callback]( payload );
					sfps.appWin = e.source;
				}
			}
		}
	};

	window.addEventListener( 'message', sfps.receiveMessage, false );

	console.log( sfpSkins.appUrl );

	$appWrap.find( 'iframe' ).attr( 'src', sfpSkins.appUrl );
} );
