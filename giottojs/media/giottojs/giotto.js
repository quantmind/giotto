//      GiottoJs - v0.2.0
//
//      Compiled 2016-02-12.
//
//      Copyright (c) 2016 - quantmind.com
//      All rights reserved.
//
//      Licensed BSD-3-Clause.
//      For all details and documentation:
//      https://github.com/quantmind/giotto
//
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.giotto = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  function setOptions(options, defaults) {
      options || (options = {});
      var opts = [defaults];
      if (options.plugins) {
          options.plugins.forEach(function () {});
      }
      return opts;
  }

  var ostring = Object.prototype.toString;

  function extend() {
      var length = arguments.length,
          object = arguments[0],
          index = 0,
          deep = false,
          obj;

      if (object === true) {
          deep = true;
          object = arguments[1];
          index++;
      }

      if (!object || length < index + 2) return object;

      while (++index < length) {
          obj = arguments[index];
          if (isObject(obj)) {
              for (var prop in obj) {
                  if (obj.hasOwnProperty(prop)) {
                      if (deep) {
                          if (isObject(obj[prop])) {
                              if (isObject(object[prop])) extend(true, object[prop], obj[prop]);else object[prop] = extend(true, {}, obj[prop]);
                          } else object[prop] = obj[prop];
                      } else object[prop] = obj[prop];
                  }
              }
          }
      }
      return object;
  }

  function isObject(value) {
      return ostring.call(value) === '[object Object]';
  }

  function isString(value) {
      return ostring.call(value) === '[object String]';
  }

  function isFunction(value) {
      return ostring.call(value) === '[object Function]';
  }

  /**
   * This function retrieve the inner elements of an object
   * @param obj
   * @returns {*}
   */
  function inner(obj) {
      return obj._inner;
  }

  //  Load a style sheet link
  function loadCss(filename) {
      var fileref = document.createElement("link");
      fileref.setAttribute("rel", "stylesheet");
      fileref.setAttribute("type", "text/css");
      fileref.setAttribute("href", filename);
      document.getElementsByTagName("head")[0].appendChild(fileref);
  }

  function getElement(element) {
      if (element && isFunction(element.node)) element = element.node();
      return element;
  }

  function round (a, b) {
    return a = +a, b -= a, function (t) {
      return Math.round(a + b * t);
    };
  }

  /**
   * A paper is created via a giotto object
   *
   * var g = new Giotto();
   * var p = p.paper();
   */
  var Paper = function () {
      function Paper(giotto, element, options) {
          babelHelpers.classCallCheck(this, Paper);

          this._inner = extend(setOptions(options), {
              giotto: giotto,
              element: getElement(element),
              draws: []
          });
      }

      babelHelpers.createClass(Paper, [{
          key: 'giotto',
          get: function get() {
              return inner(this).giotto;
          }
      }, {
          key: 'element',
          get: function get() {
              return inner(this).element;
          }
      }, {
          key: 'marginLeft',
          get: function get() {
              var i = inner(this);
              return i.factor * pc(i.margin.left, i.size[0]);
          }
      }, {
          key: 'marginRight',
          get: function get() {
              var i = inner(this);
              return i.factor * pc(i.margin.right, i.size[0]);
          }
      }, {
          key: 'marginTop',
          get: function get() {
              var i = inner(this);
              return i.factor * pc(i.margin.left, i.size[1]);
          }
      }, {
          key: 'marginBottom',
          get: function get() {
              var i = inner(this);
              return i.factor * pc(i.margin.bottom, i.size[1]);
          }
      }, {
          key: 'innerWidth',
          get: function get() {
              var i = inner(this);
              return i.factor * i.size[0] - this.marginLeft - this.marginRight;
          }
      }, {
          key: 'innerHeight',
          get: function get() {
              var i = inner(this);
              return i.factor * i.size[1] - this.marginTop - this.marginBottom;
          }
      }, {
          key: 'aspectRatio',
          get: function get() {
              return this.innerHeight / this.innerWidth;
          }
      }]);
      return Paper;
  }();

  function pc(margin, size) {
      if (isString(margin) && margin.indexOf('%') === margin.length - 1) margin = round(0.01 * parseFloat(margin) * size, 5);
      return margin;
  }

  /**
   * Giotto class
   *
   * Manage multiple papers objects and coordinate rendering between them
   */
  var Giotto = function () {
      function Giotto(options) {
          babelHelpers.classCallCheck(this, Giotto);

          this._inner = {
              options: setOptions(options, Giotto.defaults),
              papers: []
          };
      }

      babelHelpers.createClass(Giotto, [{
          key: 'create',
          value: function create(element, options) {
              var paper = new Paper(this, element, options);
              this._inner.papers.push(paper);
              return paper;
          }
      }]);
      return Giotto;
  }();

  Giotto.version = '0.2.0';

  Giotto.defaults = {
      type: 'svg',
      resizeDelay: 200,
      resize: true,
      interact: true,
      css: null
  };

  Giotto.constants = {
      DEFAULT_VIZ_GROUP: 'default_viz_group',
      WIDTH: 400,
      HEIGHT: 300,
      vizevents: ['data', 'change', 'start', 'tick', 'end'],
      pointEvents: ["mouseenter", "mousemove", "touchstart", "touchmove", "mouseleave", "mouseout"],
      //
      // Events a giotto group can fire, added by pluigins
      groupEvents: [],
      //
      // leaflet url
      leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css'
  };

  // load Css unless blocked
  Giotto.theme = theme;

  var current_theme = null;

  /**
   * Set or get the theme
   *
   * @param theme
   * @returns {*}
   */
  function theme(theme) {
    if (arguments.length === 0) return current_theme;
    if (current_theme === theme) return;
    loadCss('https://giottojs.com/media/' + Giotto.version + '/css/' + theme + '.min.css');
    current_theme = theme;
  }

  return Giotto;

}));
//# sourceMappingURL=bundle.js.map