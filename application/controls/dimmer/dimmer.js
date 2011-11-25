(function() {
  var dimmer = {
    name: 'Dimmer',
    kind: enyo.Stateful,
    className: 'dimmer', cssNamespace: 'dimmer',
    published: { minimum: 0.0, maximum: 1.0, position: 0.0 },    
    events: { onChanging: '', onChanged: '' },
    layoutKind: 'HFlexLayout',
    chrome: [
      { className: 'dark-icon' },
      { name: 'slider', kind: 'Slider', className: 'dimmer-slider',
        onChange: 'changed', onChanging: 'changing'
      },
      { className: 'lite-icon' }
    ],

    create: function() {
      this.inherited(arguments);
      this.rangeChanged();
    },

    positionChanged: function() {
      this.rangeChanged();
    },

    minimumChanged: function() {
      this.rangeChanged();
    },

    maximumChanged: function() {
      this.rangeChanged();
    },

    rangeChanged: function() {
      if (this.minimum < 0) this.minimum = 0;
      if (this.maximum > 1) this.maximum = 1;
      if (this.position < this.minimum) this.position = this.minimum;
      if (this.position > this.maximum) this.position = this.maximum;
      this.$.slider.setMinimum(this.minimum * 100);
      this.$.slider.setMaximum(this.maximum * 100);
      this.$.slider.setPosition((this.maximum - this.minimum - this.position) * 100);
    },

    changed: function(sender, value) {
      this.position = (this.maximum - this.minimum) - (value / 100);
      this.doChanged(this.position);
    },

    changing: function(sender, value) {
      this.position = (this.maximum - this.minimum) - (value / 100);
      this.doChanging(this.position);
    },

    mousedownHandler: function(sender) {
      if (sender.hasClass('enyo-custom-button')) {
        this.doChanging(this.position);
      }
    }
  };

  enyo.kind(dimmer);
})();