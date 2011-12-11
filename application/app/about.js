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
      { kind: 'HtmlContent', srcId: 'about-description', onLinkClick: 'linkHandler' },
      { kind: 'RowGroup', components: [
        { layoutKind: 'HFlexLayout', onclick: 'helpHandler', components: [
          { kind: 'Image', src: 'images/info.png' },
          { content: 'How to use Whendle', flex: 1 }
        ]},
        { layoutKind: 'HFlexLayout', onclick: 'feedbackHandler', components: [
          { kind: 'Image', src: 'images/mail.png' },
          { content: 'Leave feedback', flex: 1 }
        ]},
        { layoutKind: 'HFlexLayout', onclick: 'sourceHandler', components: [
          { kind: 'Image', src: 'images/octocat.png' },
          { content: 'Whendle is open source!', flex: 1 }
        ]}
      ]},
      { kind: 'HtmlContent', srcId: 'about-attribution', onLinkClick: 'linkHandler' }
    ],
    create: function() {
      this.addClass('dialog');
      this.addClass('about-dialog');
      this.inherited(arguments);
      this.version = enyo.fetchAppInfo().version;
    },
    open: function(alarm) {
      this.setBoundsInfo("applyCenterBounds", []);
      this.inherited(arguments);
    },
    afterOpen: function() {
      this.inherited(arguments);
      this.$.name.setContent('Whendle v' + this.version);
    },
    close: function(){
      this.inherited(arguments);
    },

    helpHandler: function() {
      window.location = 'http://whendle.com/help/' + this.version;
    },

    feedbackHandler: function() {
      window.location = 'mailto:whendle.app@gmail.com?subject=Regarding%20Whendle%20' + this.version + '...';
    },

    sourceHandler: function() {
      window.location = 'https://github.com/dylanmei/enyo-whendle';
    },

    linkHandler: function(sender, href) {
      window.location = href;
    }
  };

  enyo.kind(dialog);
})();
