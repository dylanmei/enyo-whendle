(function() {

  var card = {
    kind: 'enyo.Control',
    name: 'App.Alarms',
    className: 'alarms list',
    components: [
      { kind: 'Image', src: 'images/whendle-2.0.0.png' },
      { kind: 'VirtualRepeater', name: 'repeater', onSetupRow: 'on_render_item', components: [
        { kind: 'Item', name: 'item', layoutKind: 'HFlexLayout', components: [
          { name: 'name', flex: 1 },
          { name: 'time' }
        ]}
      ]},
      { name: 'adder', className: 'add-item', content: 'Add Alarm' },
      { kind: 'App.AlarmDialog', name: 'dialog', onClose: 'on_close_dialog' }
    ],

    create: function() {
      this.alarms = [];
      this.inherited(arguments);
      this.bind();
      enyo.keyboard.setResizesWindow(false);
      this.scroller = this.parent.parent;
      this.time_formatter = new enyo.g11n.DateFmt({time:'short'});
      _.defer(_.bind(this.load, this));
    },

    bind: function() {
      this.clickHandler = _.bind(this.on_click, this);
    },

    load: function() {
      var self = this;
      _.trigger('alarms:list', {
        success: function(alarms) {
          self.alarms = alarms;
        },
        complete: function() {
          self.render()
        }
      });
    },

    render: function() {
      if (this.hasNode())
        this.$.repeater.render();
    },

    on_close_dialog: function() {
      this.load();
    },

    on_click: function(sender, event) {
      var instance = sender;
      var list = this.$.repeater;
      var adder = this.$.adder;
      while (instance != this) {
        if (instance == list) {
          this.on_item_click(list.fetchRowIndex());
        }
        if (instance == adder) {
          this.on_adder_click();
        }
       instance = instance.parent;
      }
    },

    on_item_click: function(index) {
      apply_tap_effect(this.$.repeater.fetchRowNode(index));
      this.$.dialog.open(this.alarms[index]); 
    },

    on_adder_click: function() {
      apply_tap_effect(this.$.adder);
      this.$.dialog.open();      
    },

    on_render_item: function(sender, index) {
      if (!(index < this.alarms.length))
        return false;

      var alarm = this.alarms[index];
      var date = Date.today()
        .hour(alarm.hour)
        .minute(alarm.minute);

      this.$.name.setContent(alarm.name || '');
      this.$.time.setContent(
        this.time_formatter.format(date)
      );
//      this.$.time.setContent(date.hh12);

      alarm.on
        ? this.$.item.addClass('on')
        : this.$.item.removeClass('on');

      return true;
    }
  };

  function apply_tap_effect(element) {
    Dom.removeClass(element, 'tap-off');
    Dom.addClass(element, 'tap');

    _.defer(function() {
      Dom.removeClass(element, 'tap');
      Dom.addClass(element, 'tap-off');
    });
  }

  enyo.kind(card);
})();