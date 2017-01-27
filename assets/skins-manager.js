jQuery(function($) {
  var $xpA, skinsSortingHandlers;
  $xpA = $('#export-skin');
  skinsSortingHandlers = {
    fromList: null,
    "export": function($t, $f, ui) {
      var attr;
      $f.sortable("cancel");
      attr = {
        download: ui.item.data('name') + '.json',
        href: $xpA.data('href') + ui.item.data('name')
      };
      console.log(attr, ui);
      $xpA.attr(attr);
      return $xpA[0].click();
    },
    active: function($t, $f) {
      return console.log('Handling active');
    },
    inactive: function($t, $f) {
      return console.log('Handling inactive');
    }
  };
  return $('.skins').sortable({
    connectWith: '.skins',
    receive: function(e, ui) {
      var $t, action;
      $t = $(this);
      action = $t.data('skins-action');
      if (skinsSortingHandlers[action]) {
        return skinsSortingHandlers[action]($t, ui.sender, ui);
      } else {
        return console.log("No handler for action: " + action);
      }
    }
  });
});
