Dom = new (function() {
  this.hasClass = function(ele,cls) {
    if (ele.hasClass) return ele.hasClass(cls);
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  }

  this.addClass = function(ele,cls) {
    if (ele.addClass) return ele.addClass(cls);
    if (!this.hasClass(ele,cls)) ele.className += " "+cls;
  }

  this.removeClass = function(ele,cls) {
    if (ele.removeClass) return ele.removeClass(cls);
    if (this.hasClass(ele,cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
  }  
})();