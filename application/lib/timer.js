Timer = (function() {
  function Timer(callback) {
    this.frequency = 250;
    this.executing = false;
    this.callback = callback;
    if (callback) this.start();
  }

  _.extend(Timer.prototype, {
    start: function() {
      this.timer = setInterval(
        _.bind(this.on_interval, this), this.frequency);
    },

    stop: function() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null
      }
    },

    on_interval: function() {
      if (this.executing) return;
      try {
        this.executing = true;
        this.callback(Date.now());
      }
      finally {
        this.executing = false;
      }
    }
  });
  
  return Timer;
})();