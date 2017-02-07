jQuery(function($) {
  var $msg, $xpA, importSkins, msg, readFile, skinsSortingHandlers;
  $msg = $('#wpskins-import-msg');
  $xpA = $('#export-skin');
  msg = function(msg) {
    var response;
    if (!msg) {
      return;
    }
    response = {
      msg: msg.charAt(0).toUpperCase() + msg.slice(1),
      type: msg.indexOf('failed') === 0 ? 'error' : 'info'
    };
    $msg.html('<div class="notice notice-' + response.type + '"><p>' + response.msg + '</p></div>');
  };
  importSkins = function(json, callback, postData) {
    var reqArgs;
    postData = postData ? postData : {};
    if (typeof json !== 'string') {
      json = JSON.stringify(json);
    }
    postData.json = json;
    postData.nonce = sfpSkins.importNonce;
    reqArgs = {
      type: 'POST',
      url: ajaxurl + '?action=wp_skins_import',
      data: postData,
      success: callback
    };
    return $.ajax(reqArgs);
  };
  readFile = function(callback) {
    var $i, file, fr, input;
    if (!window.FileReader) {
      alert('The FileReader API is not supported in this browser.');
      return;
    }
    $i = $('#wpskins-import-file');
    input = $i[0];
    if (input.files && input.files[0]) {
      file = input.files[0];
      fr = new FileReader;
      fr.onload = function() {
        return callback(fr.result, file, fr);
      };
      return fr.readAsText(file);
    } else {
      return alert('File not selected or browser incompatible.');
    }
  };
  $('#wpskins-import-start').click(function() {
    return readFile(function(json, file) {
      msg('Uploading file ' + file.name + '.');
      return importSkins(json, function(res) {
        return msg(res);
      });
    });
  });
  skinsSortingHandlers = {
    fromList: null,
    "export": function($t, $f, ui) {
      var attr;
      $f.sortable("cancel");
      attr = {
        download: ui.item.data('name') + '.json',
        href: $xpA.data('href') + ui.item.data('name')
      };
      $xpA.attr(attr);
      return $xpA[0].click();
    },
    active: function($t, $f, ui) {
      var skin;
      skin = ui.item.data('name');
      return sfpSkins.data[skin].sfpSkinHidden = false;
    },
    inactive: function($t, $f, ui) {
      var skin;
      skin = ui.item.data('name');
      return sfpSkins.data[skin].sfpSkinHidden = true;
    }
  };
  $('.skins').sortable({
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
  $('#wpskins-import-file').change(function() {
    return $('#wpskins-import-start').fadeIn();
  });
  return $('#wp-skins-save').click(function() {
    return importSkins(sfpSkins.data, function(res) {
      if (res.search('success') > -1) {
        return alert('Saved skins');
      } else {
        alert('Failed to save skins');
        return console.log(res);
      }
    });
  });
});
