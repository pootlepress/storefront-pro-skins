
/*
 * Plugin admin end scripts
 *
 * @package WP_Skins
 * @version 1.0.0
 */
jQuery(function($) {
  var $dialog, $overlay;
  $overlay = $('#wp-skins-overlay');
  $dialog = $('#wp-skins-dialog');
  $('#customize-header-actions').prepend($('<a/>').addClass('button button-primary').attr({
    id: 'wp-skins-save-dialog',
    title: 'Save as a skin'
  }).html('Save skin'));
  $('#wp-skins-save-skin').click(function() {
    var values;
    values = {};
    $('[data-customize-setting-link]').each(function() {
      var $t;
      $t = $(this);
      if (($t.is(':radio' || $t.is(':checkbox'))) && !$t.prop('checked')) {
        return;
      }
      return values[$t.attr('data-customize-setting-link')] = $t.val();
    });
    return console.log(values);
  });
  return $('#wp-skins-save-dialog').click(function() {
    $overlay.show();
    return $dialog.show();
  });
});
