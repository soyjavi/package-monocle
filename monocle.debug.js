/*
    Monocle 0.9.2
    http://monocle.tapquo.com

    Copyright (C) 2011,2012 Javi Jiménez Villar (@soyjavi)

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
*/


(function() {
  var Events, Module, Monocle, moduleKeywords,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Events = {
    bind: function(ev, callback) {
      var calls, evs, name, _i, _len;
      evs = ev.split(' ');
      calls = this.hasOwnProperty('_callbacks') && this._callbacks || (this._callbacks = {});
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        calls[name] || (calls[name] = []);
        calls[name].push(callback);
      }
      return this;
    },
    trigger: function() {
      var args, callback, ev, list, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ev = args.shift();
      list = this.hasOwnProperty('_callbacks') && ((_ref = this._callbacks) != null ? _ref[ev] : void 0);
      if (!list) {
        return;
      }
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        callback = list[_i];
        if (callback.apply(this, args) === false) {
          break;
        }
      }
      return true;
    },
    unbind: function(ev, callback) {
      var cb, i, list, _i, _len, _ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) {
        return this;
      }
      if (!callback) {
        delete this._callbacks[ev];
        return this;
      }
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        cb = list[i];
        if (!(cb === callback)) {
          continue;
        }
        list = list.slice();
        list.splice(i, 1);
        this._callbacks[ev] = list;
        break;
      }
      return this;
    }
  };

  moduleKeywords = ['included', 'extended'];

  Module = (function() {

    Module.include = function(obj) {
      var included, key, value;
      if (!obj) {
        throw 'include(obj) requires obj';
      }
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      included = obj.included;
      if (included) {
        included.apply(this);
      }
      return this;
    };

    Module.extend = function(obj) {
      var extended, key, value;
      if (!obj) {
        throw 'extend(obj) requires obj';
      }
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      extended = obj.extended;
      if (extended) {
        extended.apply(this);
      }
      return this;
    };

    Module.proxy = function(method) {
      var _this = this;
      return function() {
        return method.apply(_this, arguments);
      };
    };

    Module.prototype.proxy = function(method) {
      var _this = this;
      return function() {
        return method.apply(_this, arguments);
      };
    };

    Module.prototype.delay = function(method, timeout) {
      return setTimeout(this.proxy(method), timeout || 0);
    };

    function Module() {
      if (typeof this.init === "function") {
        this.init.apply(this, args);
      }
    }

    return Module;

  })();

  Monocle = this.Monocle = {};

  Monocle.version = "0.3";

  Monocle.Events = Events;

  Monocle.Module = Module;

  Monocle.Dom = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (typeof $$ !== "undefined" && $$ !== null) {
      return $$.apply(null, args);
    } else {
      return $.apply(null, args);
    }
  };

  this.__ = Monocle.App = {
    Model: {},
    View: {},
    Controller: {}
  };

  this.__Model = Monocle.App.Model;

  this.__View = Monocle.App.View;

  this.__Controller = Monocle.App.Controller;

}).call(this);
// Generated by CoffeeScript 1.3.3
(function() {
  var guid,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Monocle.Model = (function(_super) {

    __extends(Model, _super);

    Model.extend(Monocle.Events);

    Model.records = {};

    Model.attributes = [];

    Model.configure = function() {
      var attributes;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.records = {};
      if (attributes.length) {
        this.attributes = attributes;
      }
      this.attributes || (this.attributes = []);
      this.unbind();
      return this;
    };

    Model.create = function(attributes) {
      var record;
      record = new this(attributes);
      return record.save();
    };

    Model.uid = function(prefix) {
      var uid;
      if (prefix == null) {
        prefix = 'c-';
      }
      uid = guid();
      return uid;
    };

    Model.exists = function(uid) {
      try {
        return this.find(uid);
      } catch (e) {
        return false;
      }
    };

    Model.find = function(uid) {
      var record;
      record = this.records[uid];
      if (!record) {
        throw new Error('Unknown record');
      }
      return record.clone();
    };

    Model.findBy = function(name, value) {
      var id, record, _ref;
      _ref = this.records;
      for (id in _ref) {
        record = _ref[id];
        if (record[name] === value) {
          return record.clone();
        }
      }
      throw new Error('Unknown record');
    };

    Model.select = function(callback) {
      var id, record, result;
      result = (function() {
        var _ref, _results;
        _ref = this.records;
        _results = [];
        for (id in _ref) {
          record = _ref[id];
          if (callback(record)) {
            _results.push(record);
          }
        }
        return _results;
      }).call(this);
      return this.cloneArray(result);
    };

    Model.all = function() {
      return this.cloneArray(this.recordsValues());
    };

    Model.count = function() {
      return this.recordsValues().length;
    };

    Model.cloneArray = function(array) {
      var value, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        _results.push(value.clone());
      }
      return _results;
    };

    Model.recordsValues = function() {
      var key, result, value, _ref;
      result = [];
      _ref = this.records;
      for (key in _ref) {
        value = _ref[key];
        result.push(value);
      }
      return result;
    };

    Model.destroyAll = function() {
      return this.records = {};
    };

    function Model(attributes) {
      Model.__super__.constructor.apply(this, arguments);
      this.className = this.constructor.name;
      if (attributes) {
        this.load(attributes);
      }
      this.uid = this.constructor.uid();
    }

    Model.prototype.isNew = function() {
      return !this.exists();
    };

    Model.prototype.exists = function() {
      return this.uid && this.uid in this.constructor.records;
    };

    Model.prototype.clone = function() {
      return createObject(this);
    };

    Model.prototype.load = function(attributes) {
      var key, value;
      for (key in attributes) {
        value = attributes[key];
        if (typeof this[key] === 'function') {
          this[key](value);
        } else {

        }
        this[key] = value;
      }
      return this;
    };

    Model.prototype.attributes = function() {
      var key, result, _i, _len, _ref;
      result = {};
      _ref = this.constructor.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key in this) {
          if (typeof this[key] === 'function') {
            result[key] = this[key]();
          } else {
            result[key] = this[key];
          }
        }
      }
      if (this.id) {
        result.id = this.id;
      }
      return result;
    };

    Model.prototype.save = function() {
      var error, record;
      if (this.validate != null) {
        error = this.validate();
      }
      if (error) {
        this.trigger('error', error);
        return false;
      }
      this.trigger('beforeSave');
      record = this.isNew() ? this.create() : this.update();
      this.trigger('save');
      return record;
    };

    Model.prototype.updateAttributes = function(attributes, options) {
      this.load(attributes);
      return this.save();
    };

    Model.prototype.create = function() {
      var record;
      this.trigger('beforeCreate');
      record = new this.constructor(this.attributes());
      record.uid = this.uid;
      this.constructor.records[this.uid] = record;
      this.trigger('create');
      this.trigger('change', 'create');
      return record.clone();
    };

    Model.prototype.update = function() {
      var records;
      this.trigger('beforeUpdate');
      records = this.constructor.records;
      records[this.uid].load(this.attributes());
      this.trigger('update');
      this.trigger('change', 'update');
      return records[this.uid].clone();
    };

    Model.prototype.destroy = function() {
      this.trigger('beforeDestroy');
      delete this.constructor.records[this.uid];
      this.trigger('destroy');
      this.trigger('change', 'destroy');
      this.unbind();
      return this;
    };

    Model.prototype.clone = function() {
      return Object.create(this);
    };

    Model.prototype.unbind = function() {
      return this.trigger('unbind');
    };

    Model.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.splice(1, 0, this);
      return (_ref = this.constructor).trigger.apply(_ref, args);
    };

    return Model;

  })(Monocle.Module);

  if (typeof Object.create !== 'function') {
    Object.create = function(o) {
      var Func;
      Func = function() {};
      Func.prototype = o;
      return new Func();
    };
  }

  guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 3 | 8;
      return v.toString(16);
    }).toUpperCase();
  };

}).call(this);
// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Monocle.Controller = (function(_super) {

    __extends(Controller, _super);

    Controller.include(Monocle.Events);

    Controller.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

    Controller.prototype.tag = 'div';

    /*
        Constructor of Monocle.Controller based on Monocle.Module
        @method constructor
        @param  {options} Create properties within the controller or an element selector if the type is string.
    */


    function Controller(options) {
      this.destroy = __bind(this.destroy, this);

      var key, value;
      if (typeof options === "string") {
        this.el = Monocle.Dom(options);
      } else {
        for (key in options) {
          value = options[key];
          this[key] = value;
        }
      }
      if (!this.el) {
        this.el = Monocle.Dom(document.createElement(this.tag));
      }
      if (!this.events) {
        this.events = this.constructor.events;
      }
      if (!this.elements) {
        this.elements = this.constructor.elements;
      }
      if (this.events) {
        this.delegateEvents();
      }
      if (this.elements) {
        this.refreshElements();
      }
      Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.delegateEvents = function() {
      var eventName, key, match, method, selector, _ref, _results;
      _ref = this.events;
      _results = [];
      for (key in _ref) {
        method = _ref[key];
        if (typeof method !== 'function') {
          method = this.proxy(this[method]);
        }
        match = key.match(this.eventSplitter);
        eventName = match[1];
        selector = match[2];
        if (selector === '') {
          _results.push(this.el.bind(eventName, method));
        } else {
          _results.push(this.el.delegate(selector, eventName, method));
        }
      }
      return _results;
    };

    Controller.prototype.refreshElements = function() {
      var key, value, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this[value] = this.el.find(key));
      }
      return _results;
    };

    Controller.prototype.destroy = function() {
      this.trigger('release');
      this.el.remove();
      return this.unbind();
    };

    return Controller;

  })(Monocle.Module);

}).call(this);
// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Monocle.View = (function(_super) {

    __extends(View, _super);

    View.container = null;

    function View(options) {
      View.__super__.constructor.apply(this, arguments);
      if (!this.template) {
        this.template = this.constructor.template;
      }
      if (!this.container) {
        this.container = this.constructor.container;
      }
      this.container = Monocle.Dom(this.container);
      this.container.attr('data-monocle', this.constructor.name);
    }

    View.prototype.html = function() {
      var elements;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this._html.apply(this, ["html"].concat(__slice.call(elements)));
    };

    View.prototype.append = function() {
      var elements;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this._html.apply(this, ["append"].concat(__slice.call(elements)));
    };

    View.prototype.prepend = function() {
      var elements;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this._html.apply(this, ["prepend"].concat(__slice.call(elements)));
    };

    View.prototype.remove = function() {
      var elements;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.item.destroy();
      return this.el.remove();
    };

    View.prototype.refresh = function() {
      var render;
      render = Mustache.render(this.template, this.item);
      return this.replace(render);
    };

    View.prototype._html = function() {
      var element, elements, method, render;
      method = arguments[0], elements = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      elements = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          _results.push(element.el || element);
        }
        return _results;
      })();
      render = Mustache.render.apply(Mustache, [this.template].concat(__slice.call(elements)));
      this.replace(render);
      this.container[method](this.el[0]);
      return this;
    };

    View.prototype.replace = function(element) {
      var previous, _ref;
      _ref = [this.el, Monocle.Dom(element.el || element)], previous = _ref[0], this.el = _ref[1];
      previous.replaceWith(this.el[0]);
      this.delegateEvents(this.events);
      this.refreshElements();
      return this.el;
    };

    return View;

  })(Monocle.Controller);

}).call(this);
// Generated by CoffeeScript 1.3.3
(function() {
  var ESCAPED_ENTITIES, Expand, Find, Renderer, TemplateCache,
    __slice = [].slice;

  TemplateCache = {};

  ESCAPED_ENTITIES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  Find = function(name, stack, value) {
    var ctx, i, part, parts, _i, _j, _len, _ref, _ref1;
    if (value == null) {
      value = null;
    }
    if (name === '.') {
      return stack[stack.length - 1];
    }
    _ref = name.split(/\./), name = _ref[0], parts = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    for (i = _i = _ref1 = stack.length - 1; _ref1 <= -1 ? _i < -1 : _i > -1; i = _ref1 <= -1 ? ++_i : --_i) {
      if (stack[i] == null) {
        continue;
      }
      if (!(typeof stack[i] === 'object' && name in (ctx = stack[i]))) {
        continue;
      }
      value = ctx[name];
      break;
    }
    for (_j = 0, _len = parts.length; _j < _len; _j++) {
      part = parts[_j];
      value = Find(part, [value]);
    }
    if (value instanceof Function) {
      value = (function(value) {
        return function() {
          var val;
          val = value.apply(ctx, arguments);
          return (val instanceof Function) && val.apply(null, arguments) || val;
        };
      })(value);
    }
    return value;
  };

  Expand = function() {
    var args, f, obj, tmpl;
    obj = arguments[0], tmpl = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    return ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tmpl.length; _i < _len; _i++) {
        f = tmpl[_i];
        _results.push(f.call.apply(f, [obj].concat(__slice.call(args))));
      }
      return _results;
    })()).join('');
  };

  Renderer = function(template, delimiters, section) {
    var BuildRegex, buffer, buildInterpolationTag, buildInvertedSectionTag, buildPartialTag, buildSectionTag, cache, content, contentEnd, d, error, escape, isStandalone, match, name, parseError, pos, sectionInfo, tag, tagPattern, tmpl, type, whitespace, _name, _ref, _ref1, _ref2;
    if (delimiters == null) {
      delimiters = ['{{', '}}'];
    }
    if (section == null) {
      section = null;
    }
    cache = (TemplateCache[_name = delimiters.join(' ')] || (TemplateCache[_name] = {}));
    if (template in cache) {
      return cache[template];
    }
    buffer = [];
    BuildRegex = function() {
      var tagClose, tagOpen;
      tagOpen = delimiters[0], tagClose = delimiters[1];
      return RegExp("([\\s\\S]*?)([" + ' ' + "\\t]*)(?:" + tagOpen + "\\s*(?:(!)\\s*([\\s\\S]+?)|(=)\\s*([\\s\\S]+?)\\s*=|({)\\s*(\\w[\\S]*?)\\s*}|([^0-9a-zA-Z._!={]?)\\s*([\\w.][\\S]*?))\\s*" + tagClose + ")", "gm");
    };
    tagPattern = BuildRegex();
    tagPattern.lastIndex = pos = (section || {
      start: 0
    }).start;
    parseError = function(pos, msg) {
      var carets, e, endOfLine, error, indent, key, lastLine, lastTag, lineNo, parsedLines, tagStart;
      (endOfLine = /$/gm).lastIndex = pos;
      endOfLine.exec(template);
      parsedLines = template.substr(0, pos).split('\n');
      lineNo = parsedLines.length;
      lastLine = parsedLines[lineNo - 1];
      tagStart = contentEnd + whitespace.length;
      lastTag = template.substr(tagStart + 1, pos - tagStart - 1);
      indent = new Array(lastLine.length - lastTag.length + 1).join(' ');
      carets = new Array(lastTag.length + 1).join('^');
      lastLine = lastLine + template.substr(pos, endOfLine.lastIndex - pos);
      error = new Error();
      for (key in e = {
        "message": "" + msg + "\n\nLine " + lineNo + ":\n" + lastLine + "\n" + indent + carets,
        "error": msg,
        "line": lineNo,
        "char": indent.length,
        "tag": lastTag
      }) {
        error[key] = e[key];
      }
      return error;
    };
    while (match = tagPattern.exec(template)) {
      _ref = match.slice(1, 3), content = _ref[0], whitespace = _ref[1];
      type = match[3] || match[5] || match[7] || match[9];
      tag = match[4] || match[6] || match[8] || match[10];
      contentEnd = (pos + content.length) - 1;
      pos = tagPattern.lastIndex;
      isStandalone = (contentEnd === -1 || template.charAt(contentEnd) === '\n') && ((_ref1 = template.charAt(pos)) === (void 0) || _ref1 === '' || _ref1 === '\r' || _ref1 === '\n');
      if (content) {
        buffer.push((function(content) {
          return function() {
            return content;
          };
        })(content));
      }
      if (isStandalone && (type !== '' && type !== '&' && type !== '{')) {
        if (template.charAt(pos) === '\r') {
          pos += 1;
        }
        if (template.charAt(pos) === '\n') {
          pos += 1;
        }
      } else if (whitespace) {
        buffer.push((function(whitespace) {
          return function() {
            return whitespace;
          };
        })(whitespace));
        contentEnd += whitespace.length;
        whitespace = '';
      }
      switch (type) {
        case '!':
          break;
        case '':
        case '&':
        case '{':
          buildInterpolationTag = function(name, is_unescaped) {
            return function(context) {
              var value, _ref2;
              if ((value = (_ref2 = Find(name, context)) != null ? _ref2 : '') instanceof Function) {
                value = Expand.apply(null, [this, Renderer("" + (value()))].concat(__slice.call(arguments)));
              }
              if (!is_unescaped) {
                value = this.escape("" + value);
              }
              return "" + value;
            };
          };
          buffer.push(buildInterpolationTag(tag, type));
          break;
        case '>':
          buildPartialTag = function(name, indentation) {
            return function(context, partials) {
              var partial;
              partial = partials(name).toString();
              if (indentation) {
                partial = partial.replace(/^(?=.)/gm, indentation);
              }
              return Expand.apply(null, [this, Renderer(partial)].concat(__slice.call(arguments)));
            };
          };
          buffer.push(buildPartialTag(tag, whitespace));
          break;
        case '#':
        case '^':
          sectionInfo = {
            name: tag,
            start: pos,
            error: parseError(tagPattern.lastIndex, "Unclosed section '" + tag + "'!")
          };
          _ref2 = Renderer(template, delimiters, sectionInfo), tmpl = _ref2[0], pos = _ref2[1];
          sectionInfo['#'] = buildSectionTag = function(name, delims, raw) {
            return function(context) {
              var parsed, result, v, value;
              value = Find(name, context) || [];
              tmpl = value instanceof Function ? value(raw) : raw;
              if (!(value instanceof Array)) {
                value = [value];
              }
              parsed = Renderer(tmpl || '', delims);
              context.push(value);
              result = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = value.length; _i < _len; _i++) {
                  v = value[_i];
                  context[context.length - 1] = v;
                  _results.push(Expand.apply(null, [this, parsed].concat(__slice.call(arguments))));
                }
                return _results;
              }).apply(this, arguments);
              context.pop();
              return result.join('');
            };
          };
          sectionInfo['^'] = buildInvertedSectionTag = function(name, delims, raw) {
            return function(context) {
              var value;
              value = Find(name, context) || [];
              if (!(value instanceof Array)) {
                value = [1];
              }
              value = value.length === 0 ? Renderer(raw, delims) : [];
              return Expand.apply(null, [this, value].concat(__slice.call(arguments)));
            };
          };
          buffer.push(sectionInfo[type](tag, delimiters, tmpl));
          break;
        case '/':
          if (section == null) {
            error = "End Section tag '" + tag + "' found, but not in section!";
          } else if (tag !== (name = section.name)) {
            error = "End Section tag closes '" + tag + "'; expected '" + name + "'!";
          }
          if (error) {
            throw parseError(tagPattern.lastIndex, error);
          }
          template = template.slice(section.start, contentEnd + 1 || 9e9);
          cache[template] = buffer;
          return [template, pos];
        case '=':
          if ((delimiters = tag.split(/\s+/)).length !== 2) {
            error = "Set Delimiters tags should have two and only two values!";
          }
          if (error) {
            throw parseError(tagPattern.lastIndex, error);
          }
          escape = /[-[\]{}()*+?.,\\^$|#]/g;
          delimiters = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = delimiters.length; _i < _len; _i++) {
              d = delimiters[_i];
              _results.push(d.replace(escape, "\\$&"));
            }
            return _results;
          })();
          tagPattern = BuildRegex();
          break;
        default:
          throw parseError(tagPattern.lastIndex, "Unknown tag type -- " + type);
      }
      tagPattern.lastIndex = pos != null ? pos : template.length;
    }
    if (section != null) {
      throw section.error;
    }
    if (template.length !== pos) {
      buffer.push(function() {
        return template.slice(pos);
      });
    }
    return cache[template] = buffer;
  };

  this.Mustache = {
    version: '0.0.1',
    helpers: [],
    partials: null,
    escape: function(value) {
      return String(value).replace(/[&"<>]/g, function(character) {
        return "&" + ESCAPED_ENTITIES[character] + ";";
      });
    },
    render: function(template, data, partials) {
      var context;
      if (partials == null) {
        partials = null;
      }
      context = [];
      return Expand(this, Renderer(template), context.concat([data]), partials);
    }
  };

}).call(this);
