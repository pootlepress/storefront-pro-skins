
/*
 * Plugin admin end scripts
 *
 * @package Storefront_Pro_Skins
 * @version 1.0.0
 */
var sfpSkins, sfps,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

sfps = {};

sfpSkins = 'object' === typeof sfpSkins && sfpSkins ? sfpSkins : {};

sfpSkins.data = 'object' === typeof sfpSkins.data && sfpSkins.data ? sfpSkins.data : {};

jQuery(function($) {
  var $appWrap, $bd;
  sfpSkins.$orle = $('#sfp-skins-overlay');
  sfpSkins.$dlg = $('#sfp-skins-dialog');
  sfpSkins.$wrap = $('#sfp-skins-wrap');
  sfpSkins.$skinApplyConfirmDialog = $('#sfp-skins-apply-confirm');
  sfpSkins.settingsMaps = {};
  sfpSkins.prepMaps = function() {
    var count, supportedTypes;
    sfpSkins.settingsMaps = {};
    count = 0;
    supportedTypes = ['theme_mod'];
    $.each(wp.customize.settings.controls, function(k, control) {
      var ref, setting, settingId;
      if (control && control.settings && control.settings["default"]) {
        settingId = control.settings["default"];
        if (wp.customize.settings.settings[settingId]) {
          setting = wp.customize.settings.settings[settingId];
          if (0 > settingId.indexOf('sfp_skins')) {
            if (ref = setting.type, indexOf.call(supportedTypes, ref) >= 0) {
              count++;
              sfpSkins.settingsMaps[settingId] = k;
            }
          }
        }
      }
      return void 0;
    });
    return console.log(count + ' settings mapped');
  };
  sfpSkins.get = function(id) {
    if (wp.customize.control.value(id)) {
      return wp.customize.control.value(id).setting.get();
    } else {
      return 'sfp_skins_no_value';
    }
  };
  sfpSkins.set = function(id, val) {
    if (val === 'false') {
      val = '';
    }
    if (wp.customize.control.value(id)) {
      return wp.customize.control.value(id).setting.set(val);
    } else {
      return console.log('Couldn\'t set ' + id);
    }
  };
  sfpSkins.notice = function(message) {
    if (!message) {
      return;
    }
    $('#sfp-skins-notice').html('<div id="sfp-skins-notice-message">' + message + '</div>').fadeIn(250);
    return setTimeout(function() {
      return $('#sfp-skins-notice').html('').fadeOut(250);
    }, 1100);
  };
  sfpSkins.removeSkinsFromSite = function(msg) {
    var data;
    sfpSkins.$wrap.html('');
    data = {
      'action': 'sfp_skins_save',
      'skins': '{}',
      'theme': sfpSkins.theme
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
  sfpSkins.addSkin = function(name, values) {
    var skin;
    skin = {
      name: name,
      data: values
    };
    return sfps.appMsg('saveSkin', skin);
  };
  sfpSkins.showSaveDlg = function() {
    sfpSkins.$;
    sfpSkins.$orle.show();
    return sfpSkins.$dlg.show();
  };
  sfpSkins.closeSaveDlg = function() {
    sfpSkins.$orle.hide();
    return sfpSkins.$dlg.hide();
  };
  sfpSkins.saveSkinButton = function() {
    var count, skinName, values;
    skinName = $('#sfp-skins-skin-name').val();
    $('#sfp-skins-skin-name').val('');
    count = 0;
    values = {};
    $.each(sfpSkins.settingsMaps, function(setID, conID) {
      var val;
      count++;
      val = sfpSkins.get(conID);
      if (val !== 'sfp_skins_no_value') {
        if (val === 'false') {
          val = '';
        }
        if (typeof val === 'string') {
          values[setID] = val;
        }
      }
      return void 0;
    });
    console.log(count + ' settings saved');
    sfpSkins.addSkin(skinName, values);
    sfpSkins.closeSaveDlg();
    return sfpSkins.notice('Skin Saved');
  };
  sfpSkins.prepMaps();
  $('#customize-header-actions').after($('#sfp-skins-actions'));
  $('#sfp-skins-save-dialog').click(sfpSkins.showSaveDlg);
  $('#sfp-skins-save-skin').click(sfpSkins.saveSkinButton);
  sfpSkins.$skinApplyConfirmDialog.find('.button-primary').click(function() {
    $.each(sfpSkins.$skinApplyConfirmDialog.data('settings'), function(setID, value) {
      var settingId;
      settingId = 'string' === typeof sfpSkins.settingsMaps[setID] ? sfpSkins.settingsMaps[setID] : sfpSkins.settingsMaps[setID + ']'];
      if (settingId) {
        sfpSkins.set(settingId, value);
      } else {
        console.log('Couldn\'t find setting for ' + setID);
      }
      return void 0;
    });
    sfpSkins.$skinApplyConfirmDialog.hide();
    return sfpSkins.notice('Skin applied.');
  });
  sfpSkins.$orle.click(sfpSkins.closeSaveDlg);
  sfpSkins.$wrap.click(function(e) {
    if (sfpSkins.timesClickedSkin === 1) {
      sfpSkins.doubleClickedSkin(e);
      sfpSkins.timesClickedSkin = 2;
    } else {
      sfpSkins.timesClickedSkin = 1;
    }
    return setTimeout(function() {
      if (sfpSkins.timesClickedSkin === 1) {
        sfpSkins.clickedSkin(e);
      }
      return sfpSkins.timesClickedSkin = false;
    }, 250);
  });
  $bd = $('body');
  $appWrap = $('#sfps-app-wrap');
  sfps = {
    postMsgActions: {
      loggedIn: function() {
        $bd.addClass('sfps-logged-in');
        $bd.removeClass('sfps-logged-out');
        $appWrap.fadeOut();
      },
      loggedOut: function() {
        $bd.removeClass('sfps-logged-in');
        $bd.addClass('sfps-logged-out');
        $appWrap.fadeOut();
      },
      applySkin: function(skn) {
        $appWrap.fadeOut();
        if (skn) {
          sfpSkins.$skinApplyConfirmDialog.data('skin', skn.name).data('settings', skn.data).show().find('.skin-name').html(skn.name);
        }
      }
    },
    saveRow: function() {
      if ($bd.hasClass('sfps-logged-in')) {
        $nameDlg.ppbDialog('open');
      } else {
        alert('You need to login to your pootle cloud account before you can save templates.');
      }
    },
    manage: function() {
      $appWrap.fadeIn();
    },
    logout: function() {
      sfps.appMsg('logout');
    },
    loginPopup: function() {
      sfps.showLogin = true;
      $appWrap.fadeIn();
    },
    appMsg: function(cb, payload) {
      sfps.appWin.postMessage({
        sfpsCallback: cb,
        payload: payload
      }, '*');
    },
    receiveMessage: function(e) {
      var callback, msg, payload;
      callback = void 0;
      payload = void 0;
      msg = e[e.message ? 'message' : 'data'];
      if (e.origin.replace(/http[s]?:\/\//, '').indexOf(sfpsData.appUrl) && msg.sfpsCallback) {
        callback = msg.sfpsCallback;
        payload = msg.payload;
        console.log(callback);
        if (typeof sfps.postMsgActions[callback] === 'function') {
          sfps.postMsgActions[callback](payload);
          sfps.appWin = e.source;
        }
      }
    }
  };
  return window.addEventListener('message', sfps.receiveMessage, false);
});
