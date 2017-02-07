
/*
 * Plugin admin end scripts
 *
 * @package Storefront_Pro_Skins
 * @version 1.0.0
 */
var sfpSkins,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

sfpSkins = 'object' === typeof sfpSkins && sfpSkins ? sfpSkins : {};

sfpSkins.data = 'object' === typeof sfpSkins.data && sfpSkins.data ? sfpSkins.data : {};

jQuery(function($) {
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
  sfpSkins.refreshSkinControl = function(msg) {
    var data;
    sfpSkins.$wrap.html('');
    data = {
      'action': 'sfp_skins_save',
      'skins': JSON.stringify(sfpSkins.data),
      'theme': sfpSkins.theme
    };
    $.post(ajaxurl, data, function(r) {
      console.log('WPSkins AJAX Success:', r);
      if (msg) {
        return sfpSkins.notice(msg);
      }
    }).fail(function(r) {
      console.log('WPSkins AJAX Failed:', r);
      return sfpSkins.notice('Error: Could not connect to server');
    });
    $.each(sfpSkins.data, function(name, v) {
      if ('undefined' === typeof v['sfpSkinHidden'] || !v['sfpSkinHidden']) {
        return sfpSkins.$wrap.append($('<h3></h3>').addClass('sfp-skin-button').html(name).append($('<span></span>').addClass('delete dashicons dashicons-no')));
      }
    });
    return sfpSkins.$wrap.append('<span class="no-skins">You don\'t have any skins for ' + sfpSkins.theme + ' theme...</span>');
  };
  sfpSkins.addSkin = function(name, values) {
    if (sfpSkins.data && sfpSkins.data[name]) {
      if (confirm('Skin with name "' + name + '" already exists, Do you wanna over write it?')) {
        sfpSkins.data[name] = values;
      }
    } else {
      sfpSkins.data[name] = values;
    }
    return sfpSkins.refreshSkinControl('Skin saved');
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
    if ('string' === typeof sfpSkins.renameSkin) {
      if (sfpSkins.renameSkin !== skinName) {
        sfpSkins.data[skinName] = sfpSkins.data[sfpSkins.renameSkin];
        delete sfpSkins.data[sfpSkins.renameSkin];
        delete sfpSkins.renameSkin;
        sfpSkins.refreshSkinControl('Skin renamed');
      }
      $('#sfp-skins-save-skin').text('Save skin');
      return sfpSkins.notice('Skin Renamed');
    } else {
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
      return sfpSkins.closeSaveDlg();
    }
  };
  sfpSkins.clickedSkin = function(e) {
    var $t, settings, skin;
    $t = $(e.target);
    skin = $t.closest('.sfp-skin-button').text();
    if ($t.is('.sfp-skin-button .delete')) {
      if (confirm('Are you sure you want to delete "' + skin + '" skin?')) {
        delete sfpSkins.data[skin];
        return sfpSkins.refreshSkinControl('Skin deleted');
      }
    } else if ($t.is('.sfp-skin-button')) {
      settings = sfpSkins.data[skin];
      if (settings) {
        return sfpSkins.$skinApplyConfirmDialog.data('skin', skin).data('settings', settings).show().find('.skin-name').html(skin);
      }
    }
  };
  sfpSkins.doubleClickedSkin = function(e) {
    var $t;
    $t = $(e.target);
    sfpSkins.renameSkin = $t.closest('.sfp-skin-button').text();
    $('#sfp-skins-skin-name').val(sfpSkins.renameSkin);
    $('#sfp-skins-save-skin').text('Rename');
    return sfpSkins.showSaveDlg();
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
  return sfpSkins.$wrap.click(function(e) {
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
});
