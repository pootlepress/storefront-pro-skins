
/*
 * Plugin admin end scripts
 *
 * @package WP_Skins
 * @version 1.0.0
 */
jQuery(function($) {
  $('#customize-header-actions').prepend($('<a/>').addClass('button button-primary').attr({
    id: 'save-skin',
    title: 'Save as a skin'
  }).html('Save skin'));
  return $('#save-skin'.click(function() {
    return alert('Hi!');
  }));
});
