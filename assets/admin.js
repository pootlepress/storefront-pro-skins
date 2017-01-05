
/*
 * Plugin admin end scripts
 *
 * @package WP_Skins
 * @version 1.0.0
 */
var wpSkins;

wpSkins = 'object' === typeof wpSkins && wpSkins ? wpSkins : {};

wpSkins.data = 'object' === typeof wpSkins.data && wpSkins.data ? wpSkins.data : {};

jQuery(function($) {
  wpSkins.$orle = $('#wp-skins-overlay');
  wpSkins.$dlg = $('#wp-skins-dialog');
  wpSkins.$wrap = $('#wp-skins-wrap');
  wpSkins.get = function(id) {
    if (wp.customize.control.value(id)) {
      return wp.customize.control.value(id).setting.get();
    } else {
      return 'wp_skins_no_value';
    }
  };
  wpSkins.set = function(id, val) {
    if (wp.customize.control.value(id)) {
      return wp.customize.control.value(id).setting.set(val);
    } else {
      return console.log('Couldn\'t set ' + id);
    }
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
    var skinName, values;
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
    } else {
      values = {};
      $.each(wp.customize.settings.settings, function(k, v) {
        var val;
        if (v && v.type === 'theme_mod') {
          val = wpSkins.get(k);
          if (val !== 'wp_skins_no_value') {
            return values[k] = val;
          }
        }
      });
      wpSkins.addSkin(skinName, values);
    }
    return wpSkins.closeSaveDlg();
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
        if (confirm('Are you sure you want to apply "' + skin + '" skin? Your current changes will be lost!')) {
          return $.each(settings, function(k, v) {
            return wpSkins.set(k, v);
          });
        }
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
  $('#customize-header-actions').prepend($('<a/>').addClass('button button-primary').attr({
    id: 'wp-skins-save-dialog',
    title: 'Save as a skin'
  }).html('Save skin'));
  $('#wp-skins-save-dialog').click(wpSkins.showSaveDlg);
  $('#wp-skins-save-skin').click(wpSkins.saveSkinButton);
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
