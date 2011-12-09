(function() {
  var Sounds = [
    { label: 'Fire Alarm', file: 'default.mp3' },
    { label: 'Klaxon', file: 'klaxon.mp3' },
  ];

  var selector = {
    name: 'SoundSelector',
    kind: enyo.Stateful,
    className: 'sound-selector', cssNamespace: 'sound-selector',
    published: { selected: '' },    
    events: { onChange: '' },
    layoutKind: 'HFlexLayout',
    chrome: [
      { kind: 'Button', name: 'label', components: [
        { kind: 'SoundSelectorList', name: 'list',
          hideItem: true,
          onSelect: 'on_list_select',
          onChange: 'on_list_change',
          popupAlign: 'left',
          items: [
            { caption: Sounds[0].label, value: Sounds[0].file },
            { caption: Sounds[1].label, value: Sounds[1].file },
            { caption: 'Music...', value: 'Choose' }
          ]
        }
      ]},
      { kind: 'FilePicker', name: 'picker',
        fileType: 'audio',
        allowMultiSelect: false,
        onPickFile: 'on_music_selected'
      }
    ],

    create: function() {
      this.inherited(arguments);
      this.selectedChanged();
    },

    selectedChanged: function() {
      var label = '', value = this.selected,
          tune = find_sound_by_file(value);
      
      if (tune) {
        label = tune.label;
      }
      else {
        label = label_from_path(value);
        value = 'Choose';
      }

      this.$.list.setLabel(label);
      if (this.$.list.getValue() != value)
        this.$.list.setValue(value);
    },

    on_list_select: function(sender, event) {
      if (event.value == 'Choose') {
        event.cancel = true;
        this.$.picker.pickFile();
      }   
    },

    on_list_change: function(sender, newValue) {
      if (newValue != 'Choose') {
        this.setSelected(newValue);
        this.doChange(this.selected);
      }
    },

    on_music_selected: function(sender, files) {
      if (files && files.length) {
        this.setSelected(files[0].fullPath);
        this.doChange(this.selected);
      }
    }
  };

  var list = {
    name: 'SoundSelectorList',
    kind: enyo.CustomListSelector,

    popupSelect: function(inSender, inSelected, inOldItem) {
      var event = {
        value: inSelected.value,
        previousValue: this.value, 
        cancel: false
      }

      this.doSelect(event);
      if (event.cancel) return;

      var oldValue = this.value;
      this.setValue(inSelected.value);
      this.selected = inSelected;

      if (this.value != oldValue) {
        this.doChange(this.value, oldValue);
      }
    }
  };

  function find_sound_by_file(file) {
    if ((file || '') == '') file = Sounds[0].file;
    for (var i = 0; i < Sounds.length; i++) {
      if (Sounds[i].file == file) return Sounds[i];
    }
    return null;
  }

  function label_from_path(path) {
    var index = path.lastIndexOf('/');
    return index < 0 ? path : path.substr(index + 1);
  }

  enyo.kind(list);
  enyo.kind(selector);
})();