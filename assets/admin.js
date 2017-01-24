
/*
 * Plugin admin end scripts
 *
 * @package WP_Skins
 * @version 1.0.0
 */
var wpSkins,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

wpSkins = 'object' === typeof wpSkins && wpSkins ? wpSkins : {};

wpSkins.data = 'object' === typeof wpSkins.data && wpSkins.data ? wpSkins.data : {};

jQuery(function($) {
  wpSkins.$orle = $('#wp-skins-overlay');
  wpSkins.$dlg = $('#wp-skins-dialog');
  wpSkins.$wrap = $('#wp-skins-wrap');
  wpSkins.$skinApplyConfirmDialog = $('#wp-skins-apply-confirm');
  wpSkins.settingsMaps = {};
  wpSkins.prepMaps = function() {
    var count, supportedTypes;
    wpSkins.settingsMaps = {};
    count = 0;
    supportedTypes = ['theme_mod'];
    $.each(wp.customize.settings.controls, function(k, control) {
      var ref, setting, settingId;
      if (control && control.settings && control.settings["default"]) {
        settingId = control.settings["default"];
        if (wp.customize.settings.settings[settingId]) {
          setting = wp.customize.settings.settings[settingId];
          if (0 > settingId.indexOf('wp_skins')) {
            if (ref = setting.type, indexOf.call(supportedTypes, ref) >= 0) {
              count++;
              wpSkins.settingsMaps[settingId] = k;
            }
          }
        }
      }
      return void 0;
    });
    return console.log(count + ' settings mapped');
  };
  wpSkins.get = function(id) {
    if (wp.customize.control.value(id)) {
      return wp.customize.control.value(id).setting.get();
    } else {
      return 'wp_skins_no_value';
    }
  };
  wpSkins.set = function(id, val) {
    if (val === 'false') {
      val = '';
    }
    if (wp.customize.control.value(id)) {
      return wp.customize.control.value(id).setting.set(val);
    } else {
      return console.log('Couldn\'t set ' + id);
    }
  };
  wpSkins.notice = function(message) {
    if (!message) {
      return;
    }
    $('#wp-skins-notice').html('<div id="wp-skins-notice-message">' + message + '</div>').fadeIn(250);
    return setTimeout(function() {
      return $('#wp-skins-notice').html('').fadeOut(250);
    }, 1100);
  };
  wpSkins.refreshSkinControl = function() {
    var data;
    wpSkins.$wrap.html('');
    data = {
      'action': 'wp_skins_save',
      'skins': wpSkins.data,
      'theme': wpSkins.theme
    };
    $.post(ajaxurl, data, function(response) {});
    $.each(wpSkins.data, function(name, v) {
      return wpSkins.$wrap.append($('<h3></h3>').addClass('wp-skin-button').html(name).append($('<span></span>').addClass('delete dashicons dashicons-no')));
    });
    return wpSkins.$wrap.append('<span class="no-skins">You don\'t have any skins for ' + wpSkins.theme + ' theme...</span>');
  };
  wpSkins.addSkin = function(name, values) {
    if (wpSkins.data && wpSkins.data[name]) {
      if (confirm('Skin with name "' + name + '" already exists, Do you wanna over write it?')) {
        wpSkins.data[name] = values;
      }
    } else {
      wpSkins.data[name] = values;
    }
    return wpSkins.refreshSkinControl();
  };
  wpSkins.showSaveDlg = function() {
    wpSkins.$;
    wpSkins.$orle.show();
    return wpSkins.$dlg.show();
  };
  wpSkins.closeSaveDlg = function() {
    wpSkins.$orle.hide();
    return wpSkins.$dlg.hide();
  };
  wpSkins.saveSkinButton = function() {
    var count, skinName, values;
    skinName = $('#wp-skins-skin-name').val();
    $('#wp-skins-skin-name').val('');
    if ('string' === typeof wpSkins.renameSkin) {
      if (wpSkins.renameSkin !== skinName) {
        wpSkins.data[skinName] = wpSkins.data[wpSkins.renameSkin];
        delete wpSkins.data[wpSkins.renameSkin];
        delete wpSkins.renameSkin;
        wpSkins.refreshSkinControl();
      }
      $('#wp-skins-save-skin').text('Save skin');
      return wpSkins.notice('Skin Renamed');
    } else {
      count = 0;
      values = {};
      $.each(wpSkins.settingsMaps, function(setID, conID) {
        var val;
        count++;
        val = wpSkins.get(conID);
        if (val !== 'wp_skins_no_value') {
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
      wpSkins.addSkin(skinName, values);
      wpSkins.closeSaveDlg();
      return wpSkins.notice('Skin Saved');
    }
  };
  wpSkins.clickedSkin = function(e) {
    var $t, settings, skin;
    $t = $(e.target);
    skin = $t.closest('.wp-skin-button').text();
    if ($t.is('.wp-skin-button .delete')) {
      if (confirm('Are you sure you want to delete "' + skin + '" skin?')) {
        delete wpSkins.data[skin];
        return wpSkins.refreshSkinControl();
      }
    } else if ($t.is('.wp-skin-button')) {
      settings = wpSkins.data[skin];
      if (settings) {
        return wpSkins.$skinApplyConfirmDialog.data('skin', skin).data('settings', settings).show().find('.skin-name').html(skin);
      }
    }
  };
  wpSkins.doubleClickedSkin = function(e) {
    var $t;
    $t = $(e.target);
    wpSkins.renameSkin = $t.closest('.wp-skin-button').text();
    $('#wp-skins-skin-name').val(wpSkins.renameSkin);
    $('#wp-skins-save-skin').text('Rename');
    return wpSkins.showSaveDlg();
  };
  wpSkins.prepMaps();
  $('#customize-header-actions').prepend($('<a/>').addClass('button button-primary').attr({
    id: 'wp-skins-save-dialog',
    title: 'Save as a skin'
  }).html('Save skin'));
  $('#wp-skins-save-dialog').click(wpSkins.showSaveDlg);
  $('#wp-skins-save-skin').click(wpSkins.saveSkinButton);
  wpSkins.$skinApplyConfirmDialog.find('.button-primary').click(function() {
    $.each(wpSkins.$skinApplyConfirmDialog.data('settings'), function(setID, value) {
      var settingId;
      settingId = 'string' === typeof wpSkins.settingsMaps[setID] ? wpSkins.settingsMaps[setID] : wpSkins.settingsMaps[setID + ']'];
      if (settingId) {
        wpSkins.set(settingId, value);
      } else {
        console.log('Couldn\'t find setting for ' + setID);
      }
      return void 0;
    });
    return wpSkins.notice('Skin applied.');
  });
  wpSkins.$orle.click(wpSkins.closeSaveDlg);
  return wpSkins.$wrap.click(function(e) {
    if (wpSkins.timesClickedSkin === 1) {
      wpSkins.doubleClickedSkin(e);
      wpSkins.timesClickedSkin = 2;
    } else {
      wpSkins.timesClickedSkin = 1;
    }
    return setTimeout(function() {
      if (wpSkins.timesClickedSkin === 1) {
        wpSkins.clickedSkin(e);
      }
      return wpSkins.timesClickedSkin = false;
    }, 250);
  });
});
