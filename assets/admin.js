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
      'skins': wpSkins.data
    };
    $.post(ajaxurl, data, function(response) {});
    return $.each(wpSkins.data, function(name, values) {
      return wpSkins.$wrap.append($('<h3></h3>').addClass('wp-skin-button').html(name));
    });
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
    wpSkins.$orle.show();
    return wpSkins.$dlg.show();
  };
  wpSkins.closeSaveDlg = function() {
    wpSkins.$orle.hide();
    return wpSkins.$dlg.hide();
  };
  wpSkins.saveSkinButton = function() {
    var values;
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
    wpSkins.addSkin($('#wp-skins-skin-name').val(), values);
    return wpSkins.closeSaveDlg();
  };
  $('#customize-header-actions').prepend($('<a/>').addClass('button button-primary').attr({
    id: 'wp-skins-save-dialog',
    title: 'Save as a skin'
  }).html('Save skin'));
  $('#wp-skins-save-dialog').click(wpSkins.showSaveDlg);
  $('#wp-skins-save-skin').click(wpSkins.saveSkinButton);
  wpSkins.$orle.click(wpSkins.closeSaveDlg);
  return wpSkins.$wrap.click(function(e) {
    var $t, settings;
    $t = $(e.target);
    if ($t.is('.wp-skin-button')) {
      settings = wpSkins.data[$t.html()];
      if (settings) {
        if (confirm('Are you sure you want to apply "' + $t.html() + '" skin? Your current changes will be lost!')) {
          return $.each(settings, function(k, v) {
            return wpSkins.set(k, v);
          });
        }
      }
    }
  });
});
