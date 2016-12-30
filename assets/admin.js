
/*
 * Plugin admin end scripts
 *
 * @package WP_Skins
 * @version 1.0.0
 */
var wpSkins;

wpSkins = typeOf(wpSkins === 'object') ? wpSkins : {};

jQuery(function($) {
  wpSkins.$orle = $('#wp-skins-overlay');
  wpSkins.$dlg = $('#wp-skins-dialog');
  wpSkins.get = function(id) {
    return wp.customize.control.value(id).setting.get();
  };
  wpSkins.set = function(id, val) {
    return wp.customize.control.value(id).setting.set(val);
  };
  wpSkins.showSaveDlg = function() {
    wpSkins.$orle.show();
    return wpSkins.$dlg.show();
  };
  wpSkins.closeSaveDlg = function(id, val) {
    wpSkins.$orle.hide();
    return wpSkins.$dlg.hide();
  };
  wpSkins.saveSkin = function() {
    var values;
    values = {};
    $.each(wp.customize.settings.settings, function(k, v) {
      if (v && v.type === 'theme_mod') {
        return values[k] = wpSkins.get(k);
      }
    });
    return wpSkins.closeSaveDlg;
  };
  $('#customize-header-actions').prepend($('<a/>').addClass('button button-primary').attr({
    id: 'wp-skins-save-dialog',
    title: 'Save as a skin'
  }).html('Save skin'));
  $('#wp-skins-save-skin').click(wpSkins.saveSkin);
  $('#wp-skins-save-dialog').click(wpSkins.showSaveDlg);
  return wpSkins.$orle.click(wpSkins.closeSaveDlg);
});
