
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
    $.each(wp.customize._value, function(k, v) {
      var val;
      val = v._value;
      if (typeof val === 'string') {
        return values[k] = val;
      }
    });
    return console.log(values);
  });
  $('#wp-skins-save-dialog').click(function() {
    $overlay.show();
    return $dialog.show();
  });
  return $overlay.click(function() {
    $overlay.hide();
    return $dialog.hide();
  });
});
