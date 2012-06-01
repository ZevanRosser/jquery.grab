(function($) {
  var cache = {},
      target, isVal = /^\{\{(.*?)\}\}$/,
      stripDelimeters = /\{\{|\}\}/g;

  $.fn.grab = function(theTarget, params) {
    var elem, tmp = this,
        key, curr, notScript = !tmp.is("script");
    if (notScript && tmp.parent().length == 0) {
      tmp = tmp.wrap('<script>').parent();
    }
    target = theTarget;
    if (notScript) {
      elem = tmp;
    } else {
      key = this.selector;
      if (cache[key]) {
        elem = cache[key].clone();
      } else {
        elem = $(tmp.html());
        cache[key] = elem.clone();
      }
    }
    elem.map(populate);
    elem.find("*").each(populate);
    if (params) {
      for (var i in params) {
        curr = target[i];
        if (curr) {
          curr.html(params[i]);
        }
      }
    }
    return elem;
  };

  function populate() {
    var curr = $(this),
        html = $.trim(curr.html()),
        dataGrab = curr.attr("data-grab");
    if (isVal.test(html)) {
      html = html.replace(stripDelimeters, "");
      target[html] = curr;
      curr.html("");
    } else if (dataGrab) {
      target[dataGrab] = curr;
    }
  }

  $.grab = {};
  $.grab.delimeters = function(start, end) {
    var allChars = /(.)/g;
    start = start.replace(allChars, "\\$1");
    end = end.replace(allChars, "\\$1");
    isVal = new RegExp("^" + start + "(.*?)" + end + "$");
    stripDelimeters = new RegExp(start + "|" + end, "g");
  };
})(jQuery);