(function() {
  var scroller = {
    name: 'App.Scroller',
    kind: enyo.BasicScroller,
    className: 'scroller',

    create: function() {
      this.inherited(arguments);
      this.views = this.$.client.children;
      update_components(this.views, this.views[0]);
    },

    show: function(name) {
      if (this.hidden()) {
        this.removeClass('scroller-hide');
        this.addClass('scroller-show');     
      }
      update_components(this.views,
        get_component_by_name(this.views, name));
    },

    hide: function() {
      this.removeClass('scroller-show');
      this.addClass('scroller-hide');
    },

    contains: function(name) {
      return get_component_by_name(this.views, name) != null;
    },

    hidden: function() {
      return this.hasClass('scroller-hide');
    }
  };

  function get_component_by_name(components, name) {
    return _.detect(components, function(c) {
      return c.name == name;
    });
  }

  function update_components(components, current) {
    if (!current) return;
    _.each(components, function(c) {
      c == current
        ? c.show() : c.hide()
    });
  }

  enyo.kind(scroller);
})();