(function() {
  var dialog = {
    kind: 'enyo.ModalDialog',
    name: 'App.AboutDialog',
    dismissWithEscape: true,
    dismissWithClick: true,
    components: [
      { kind: 'HFlexBox', components: [
        { kind: 'Image', src: '../icon-48.png' },
        { flex:1, style: 'margin: 0 0 0 8px;', components: [
          { name: 'name', className: 'name', content: '' },
          { name: 'vendor', className: 'vendor', content: 'by Dylan Meissner / Hoop Engines' },
        ]}
      ]},
      { kind: enyo.VFlexBox, autoVertical: false, components: [
        { kind: enyo.Spacer },
        { kind: 'HtmlContent', srcId: 'about', className: 'content', onLinkClick: 'on_link_clicked' },
        { kind: enyo.Spacer }
      ]}
    ],
    create: function() {
      this.addClass('dialog');
      this.addClass('about-dialog');
      this.inherited(arguments);
    },
    open: function(alarm) {
      this.setBoundsInfo("applyCenterBounds", []);
      this.inherited(arguments);
    },
    afterOpen: function() {
      this.inherited(arguments);
      this.$.name.setContent('Whendle v' +
        enyo.fetchAppInfo().version);
    },
    close: function(){
      this.inherited(arguments);
    },

    on_link_clicked: function(sender, href) {
      window.location = href;
    }
  };

  enyo.kind(dialog);
})();