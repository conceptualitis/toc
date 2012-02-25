jQuery.fn.toc = function(options) {
  var self = this;
  var opts = $.extend({}, jQuery.fn.toc.defaults, options);

  var container = $(opts.container);
  var headings = $(opts.selectors, container);
  var headingOffsets = [];

  var scrollTo = function(e) {
    if (opts.smoothScrolling) {
      e.preventDefault();
      var elScrollTo = $(e.target).attr('href');
      var $el = $(elScrollTo);
      $(opts.container).animate({ scrollTop: $el.offset().top }, 400, 'swing', function() {
        location.hash = elScrollTo;
      });
    }
  };

  //highlight on scroll
  var timeout;
  var highlightOnScroll = function(e) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
      var top = $(window).scrollTop();
      for (var i = 0, c = headingOffsets.length; i < c; i++) {
        if (headingOffsets[i] >= top) {
          $('li', self).removeClass('active');
          $('li:eq('+i+')', self).addClass('active');
          break;
        }
      }
    }, 50);
  };
  if (opts.highlightOnScroll) {
    $(window).bind('scroll', highlightOnScroll);
    highlightOnScroll();
  }


  return this.each(function() {
    //build TOC
    var ul = $('<ul/>');
    headings.each(function(i, heading) {
      var $h = $(heading);
      headingOffsets.push($h.offset().top);

      //add anchor
      var anchor = $('<span/>').attr('id', opts.prefix+i).insertBefore($h);

      //build TOC item
      var a = $('<a/>')
      .text($h.text())
      .attr('href', '#'+opts.prefix+i)
      .bind('click', scrollTo);

      var li = $('<li/>')
      .addClass(opts.prefix+$h[0].tagName)
      .append(a);

      ul.append(li);
    });
    var el = $(this);
    console.log(el);
    el.html(ul);
  });
};


jQuery.fn.toc.defaults = {
  container: 'body',
  selectors: 'h1,h2,h3',
  smoothScrolling: true,
  prefix: 'toc',
  highlightOnScroll: true
};
