(function() {
  var dialog = {
    kind: 'enyo.ModalDialog',
    name: 'App.AlarmDialog',
    components: [
      { kind: 'HFlexBox', components: [
        { kind: 'Input', name: 'name', hint: 'Alarm name', flex: 1 },
        { kind: 'ToggleButton', name: 'active' }
      ]},

      { kind: 'HFlexBox', components: [
        { kind: 'enyo.TimePicker', name: 'time', label: '' },
        { kind: 'Spacer' },
        { kind: 'HFlexBox', components: [
          { className: 'enyo-picker-label', content: 'Snooze' },
          { kind: 'Picker', name: 'snooze', items: [
            '1 minute', '5 minutes', '10 minutes', '15 minutes', '30 minutes', '60 minutes'
          ]}
        ]}
      ]},

      { kind: 'DayPicker', name: 'days' },
      { kind: 'Button', name: 'music', caption: 'Music', onclick: 'on_pick_music' },

      { kind: 'HFlexBox', className: 'actions', components: [
        { kind: 'Button', name: 'remove', caption: 'Remove', onclick: 'on_delete', className: 'enyo-button-negative' },
        { kind: 'Spacer' },
        { kind: 'Button', name: 'cancel', caption: 'Cancel', flex:1, onclick: 'on_cancel', className: 'enyo-button-dark' },
        { kind: 'Button', name: 'commit', caption: 'Save', flex:1, onclick: 'on_save', className: 'enyo-button-affirmative' }
      ]},

      { kind: 'FilePicker', name: 'picker', allowMultiSelect: false,
        fileType: 'audio', currentRingtonePath: "/media/internal/ringtones/Pre.mp3",
        onPickFile: 'on_change_music'
      },
    ],
    create: function() {
      this.addClass('dialog');
      this.inherited(arguments);
    },
    open: function(alarm) {
      this.alarm = _.clone(alarm || new_alarm());
      this.setBoundsInfo("applyCenterBounds", []);
      this.inherited(arguments);
    },
    afterOpen: function() {
      this.inherited(arguments);
      var alarm = this.alarm;
      var time = Date.today()
        .hour(alarm.hour)
        .minute(alarm.minute);

      this.$.name.setValue(alarm.name || '');
      this.$.active.setState(alarm.on || false);
      if (alarm.snooze)
        this.$.snooze.setValue(snooze_value_to_text(alarm.snooze));
      
      this.$.time.setValue(time);
      this.$.days.setSunday(alarm.sunday);
      this.$.days.setMonday(alarm.monday);
      this.$.days.setTuesday(alarm.tuesday);
      this.$.days.setWednesday(alarm.wednesday);
      this.$.days.setThursday(alarm.thursday);
      this.$.days.setFriday(alarm.friday);
      this.$.days.setSaturday(alarm.saturday);

      this.$.remove.setShowing(!_.isUndefined(alarm.id))
    },
    on_pick_music: function() {
      this.$.picker.pickFile();
    },
    on_change_music: function() {
      _.log('change music');
      // _.log(arguments);
    },
    on_cancel: function() {
      this.close();
    },
    on_delete: function() {
      var self = this;
      _.trigger('alarms:delete', {
        id: this.alarm.id,
        complete: function() {
          self.close();
        }
      });
    },
    on_save: function() {
      this.alarm.name = this.$.name.getValue();
      this.alarm.on = this.$.active.getState();
      this.alarm.sunday = this.$.days.sunday;
      this.alarm.monday = this.$.days.monday;
      this.alarm.tuesday = this.$.days.tuesday;
      this.alarm.wednesday = this.$.days.wednesday;
      this.alarm.thursday = this.$.days.thursday;
      this.alarm.friday = this.$.days.friday;
      this.alarm.saturday = this.$.days.saturday;
      this.alarm.hour = this.$.time.getValue().hour();
      this.alarm.minute = this.$.time.getValue().minute();
      this.alarm.snooze = snooze_text_to_value(this.$.snooze.getValue())
      
      var self = this;
      _.trigger('alarms:save', {
        alarm: this.alarm,
        complete: function() {
          self.close();
        }
      });
    }
  };

  function new_alarm() {
    var now = Date.now();
    now = now.add((60 - now.minute()).minutes);
    return {
      hour: now.hour(),
      minute: now.minute(),
      on: true, snooze: 10,
      monday: true, tuesday: true, wednesday: true, thursday: true, friday: true
    };
  }

  function snooze_value_to_text(value) {
    if (value == 1) return value + ' minute';
    return value + ' minutes';
  }

  function snooze_text_to_value(text) {
    return parseInt(text);
  }

  enyo.kind(dialog);
})();