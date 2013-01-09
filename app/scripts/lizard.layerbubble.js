
!function ($) {

 /* LAYERBUBBLE PUBLIC CLASS DEFINITION
  * =============================== */

  var LayerBubble = function (element, options) {
    this.init('layerbubble', element, options);
  };

  LayerBubble.prototype = {

    constructor: LayerBubble,

    init: function (type, element, options) {
      var eventIn, eventOut;

      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);
      this.enabled = true;
    },
    getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data());

      if (options.delay && typeof options.delay === 'number') {
        options.delay = {
          show: options.delay,
          hide: options.delay
        };
      }
      return options;
    },


    setContent: function () {
      var $tip = this.tip();
      var title = this.getTitle();

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
      $tip.removeClass('fade in top bottom left right');
    },

    hide: function () {
      var that = this;
      $tip = this.tip();

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      return this
    }

  
  , getPosition: function () {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  }


 /* LAYERBUBBLE PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.layerbubble

  $.fn.layerbubble = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('layerbubble')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new LayerBubble(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.layerbubble.Constructor = LayerBubble

  $.fn.layerbubble.defaults = {
    placement: 'top'
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.layerbubble.noConflict = function () {
    $.fn.layerbubble = old
    return this
  }

}(window.jQuery);