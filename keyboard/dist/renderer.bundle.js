(() => {
  // ../node_modules/ramda/es/internal/_isPlaceholder.js
  function _isPlaceholder(a) {
    return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
  }

  // ../node_modules/ramda/es/internal/_curry1.js
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  // ../node_modules/ramda/es/internal/_curry2.js
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
            return fn(a, _b);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
            return fn(_a, b);
          }) : _isPlaceholder(b) ? _curry1(function(_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }

  // ../node_modules/ramda/es/internal/_arity.js
  function _arity(n, fn) {
    switch (n) {
      case 0:
        return function() {
          return fn.apply(this, arguments);
        };
      case 1:
        return function(a0) {
          return fn.apply(this, arguments);
        };
      case 2:
        return function(a0, a1) {
          return fn.apply(this, arguments);
        };
      case 3:
        return function(a0, a1, a2) {
          return fn.apply(this, arguments);
        };
      case 4:
        return function(a0, a1, a2, a3) {
          return fn.apply(this, arguments);
        };
      case 5:
        return function(a0, a1, a2, a3, a4) {
          return fn.apply(this, arguments);
        };
      case 6:
        return function(a0, a1, a2, a3, a4, a5) {
          return fn.apply(this, arguments);
        };
      case 7:
        return function(a0, a1, a2, a3, a4, a5, a6) {
          return fn.apply(this, arguments);
        };
      case 8:
        return function(a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.apply(this, arguments);
        };
      case 9:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.apply(this, arguments);
        };
      case 10:
        return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.apply(this, arguments);
        };
      default:
        throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
    }
  }

  // ../node_modules/ramda/es/internal/_curryN.js
  function _curryN(length3, received, fn) {
    return function() {
      var combined = [];
      var argsIdx = 0;
      var left = length3;
      var combinedIdx = 0;
      while (combinedIdx < received.length || argsIdx < arguments.length) {
        var result;
        if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments[argsIdx];
          argsIdx += 1;
        }
        combined[combinedIdx] = result;
        if (!_isPlaceholder(result)) {
          left -= 1;
        }
        combinedIdx += 1;
      }
      return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length3, combined, fn));
    };
  }

  // ../node_modules/ramda/es/curryN.js
  var curryN = /* @__PURE__ */ _curry2(function curryN2(length3, fn) {
    if (length3 === 1) {
      return _curry1(fn);
    }
    return _arity(length3, _curryN(length3, [], fn));
  });
  var curryN_default = curryN;

  // ../node_modules/ramda/es/internal/_curry3.js
  function _curry3(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;
        case 1:
          return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          });
        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1(function(_c) {
            return fn(a, b, _c);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder(a) ? _curry1(function(_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder(b) ? _curry1(function(_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder(c) ? _curry1(function(_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }

  // ../node_modules/ramda/es/internal/_isArray.js
  var isArray_default = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
  };

  // ../node_modules/ramda/es/internal/_isTransformer.js
  function _isTransformer(obj) {
    return obj != null && typeof obj["@@transducer/step"] === "function";
  }

  // ../node_modules/ramda/es/internal/_dispatchable.js
  function _dispatchable(methodNames, xf, fn) {
    return function() {
      if (arguments.length === 0) {
        return fn();
      }
      var args = Array.prototype.slice.call(arguments, 0);
      var obj = args.pop();
      if (!isArray_default(obj)) {
        var idx = 0;
        while (idx < methodNames.length) {
          if (typeof obj[methodNames[idx]] === "function") {
            return obj[methodNames[idx]].apply(obj, args);
          }
          idx += 1;
        }
        if (_isTransformer(obj)) {
          var transducer = xf.apply(null, args);
          return transducer(obj);
        }
      }
      return fn.apply(this, arguments);
    };
  }

  // ../node_modules/ramda/es/internal/_reduced.js
  function _reduced(x) {
    return x && x["@@transducer/reduced"] ? x : {
      "@@transducer/value": x,
      "@@transducer/reduced": true
    };
  }

  // ../node_modules/ramda/es/internal/_xfBase.js
  var xfBase_default = {
    init: function() {
      return this.xf["@@transducer/init"]();
    },
    result: function(result) {
      return this.xf["@@transducer/result"](result);
    }
  };

  // ../node_modules/ramda/es/internal/_map.js
  function _map(fn, functor) {
    var idx = 0;
    var len = functor.length;
    var result = Array(len);
    while (idx < len) {
      result[idx] = fn(functor[idx]);
      idx += 1;
    }
    return result;
  }

  // ../node_modules/ramda/es/internal/_isString.js
  function _isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
  }

  // ../node_modules/ramda/es/internal/_isArrayLike.js
  var _isArrayLike = /* @__PURE__ */ _curry1(function isArrayLike(x) {
    if (isArray_default(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if (typeof x !== "object") {
      return false;
    }
    if (_isString(x)) {
      return false;
    }
    if (x.nodeType === 1) {
      return !!x.length;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
  });
  var isArrayLike_default = _isArrayLike;

  // ../node_modules/ramda/es/internal/_xwrap.js
  var XWrap = /* @__PURE__ */ function() {
    function XWrap2(fn) {
      this.f = fn;
    }
    XWrap2.prototype["@@transducer/init"] = function() {
      throw new Error("init not implemented on XWrap");
    };
    XWrap2.prototype["@@transducer/result"] = function(acc) {
      return acc;
    };
    XWrap2.prototype["@@transducer/step"] = function(acc, x) {
      return this.f(acc, x);
    };
    return XWrap2;
  }();
  function _xwrap(fn) {
    return new XWrap(fn);
  }

  // ../node_modules/ramda/es/bind.js
  var bind = /* @__PURE__ */ _curry2(function bind2(fn, thisObj) {
    return _arity(fn.length, function() {
      return fn.apply(thisObj, arguments);
    });
  });
  var bind_default = bind;

  // ../node_modules/ramda/es/internal/_reduce.js
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf["@@transducer/step"](acc, list[idx]);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      idx += 1;
    }
    return xf["@@transducer/result"](acc);
  }
  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf["@@transducer/step"](acc, step.value);
      if (acc && acc["@@transducer/reduced"]) {
        acc = acc["@@transducer/value"];
        break;
      }
      step = iter.next();
    }
    return xf["@@transducer/result"](acc);
  }
  function _methodReduce(xf, acc, obj, methodName) {
    return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
  }
  var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
  function _reduce(fn, acc, list) {
    if (typeof fn === "function") {
      fn = _xwrap(fn);
    }
    if (isArrayLike_default(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list["fantasy-land/reduce"] === "function") {
      return _methodReduce(fn, acc, list, "fantasy-land/reduce");
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === "function") {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === "function") {
      return _methodReduce(fn, acc, list, "reduce");
    }
    throw new TypeError("reduce: list must be array or iterable");
  }

  // ../node_modules/ramda/es/internal/_has.js
  function _has(prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  // ../node_modules/ramda/es/internal/_isArguments.js
  var toString = Object.prototype.toString;
  var _isArguments = /* @__PURE__ */ function() {
    return toString.call(arguments) === "[object Arguments]" ? function _isArguments2(x) {
      return toString.call(x) === "[object Arguments]";
    } : function _isArguments2(x) {
      return _has("callee", x);
    };
  }();
  var isArguments_default = _isArguments;

  // ../node_modules/ramda/es/keys.js
  var hasEnumBug = !/* @__PURE__ */ {
    toString: null
  }.propertyIsEnumerable("toString");
  var nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
  var hasArgsEnumBug = /* @__PURE__ */ function() {
    "use strict";
    return arguments.propertyIsEnumerable("length");
  }();
  var contains = function contains2(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };
  var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? /* @__PURE__ */ _curry1(function keys2(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) : /* @__PURE__ */ _curry1(function keys3(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    var prop, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && isArguments_default(obj);
    for (prop in obj) {
      if (_has(prop, obj) && (!checkArgsLength || prop !== "length")) {
        ks[ks.length] = prop;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;
      while (nIdx >= 0) {
        prop = nonEnumerableProps[nIdx];
        if (_has(prop, obj) && !contains(ks, prop)) {
          ks[ks.length] = prop;
        }
        nIdx -= 1;
      }
    }
    return ks;
  });
  var keys_default = keys;

  // ../node_modules/ramda/es/reduce.js
  var reduce = /* @__PURE__ */ _curry3(_reduce);
  var reduce_default = reduce;

  // ../node_modules/ramda/es/internal/_isFunction.js
  function _isFunction(x) {
    var type3 = Object.prototype.toString.call(x);
    return type3 === "[object Function]" || type3 === "[object AsyncFunction]" || type3 === "[object GeneratorFunction]" || type3 === "[object AsyncGeneratorFunction]";
  }

  // ../node_modules/ramda/es/type.js
  var type = /* @__PURE__ */ _curry1(function type2(val) {
    return val === null ? "Null" : val === void 0 ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
  });
  var type_default = type;

  // ../node_modules/ramda/es/internal/_pipe.js
  function _pipe(f, g) {
    return function() {
      return g.call(this, f.apply(this, arguments));
    };
  }

  // ../node_modules/ramda/es/internal/_checkForMethod.js
  function _checkForMethod(methodname, fn) {
    return function() {
      var length3 = arguments.length;
      if (length3 === 0) {
        return fn();
      }
      var obj = arguments[length3 - 1];
      return isArray_default(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length3 - 1));
    };
  }

  // ../node_modules/ramda/es/slice.js
  var slice = /* @__PURE__ */ _curry3(
    /* @__PURE__ */ _checkForMethod("slice", function slice2(fromIndex, toIndex, list) {
      return Array.prototype.slice.call(list, fromIndex, toIndex);
    })
  );
  var slice_default = slice;

  // ../node_modules/ramda/es/tail.js
  var tail = /* @__PURE__ */ _curry1(
    /* @__PURE__ */ _checkForMethod(
      "tail",
      /* @__PURE__ */ slice_default(1, Infinity)
    )
  );
  var tail_default = tail;

  // ../node_modules/ramda/es/pipe.js
  function pipe() {
    if (arguments.length === 0) {
      throw new Error("pipe requires at least one argument");
    }
    return _arity(arguments[0].length, reduce_default(_pipe, arguments[0], tail_default(arguments)));
  }

  // ../node_modules/ramda/es/internal/_arrayFromIterator.js
  function _arrayFromIterator(iter) {
    var list = [];
    var next;
    while (!(next = iter.next()).done) {
      list.push(next.value);
    }
    return list;
  }

  // ../node_modules/ramda/es/internal/_includesWith.js
  function _includesWith(pred, x, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      if (pred(x, list[idx])) {
        return true;
      }
      idx += 1;
    }
    return false;
  }

  // ../node_modules/ramda/es/internal/_functionName.js
  function _functionName(f) {
    var match = String(f).match(/^function (\w*)/);
    return match == null ? "" : match[1];
  }

  // ../node_modules/ramda/es/internal/_objectIs.js
  function _objectIs(a, b) {
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    } else {
      return a !== a && b !== b;
    }
  }
  var objectIs_default = typeof Object.is === "function" ? Object.is : _objectIs;

  // ../node_modules/ramda/es/internal/_equals.js
  function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
    var a = _arrayFromIterator(aIterator);
    var b = _arrayFromIterator(bIterator);
    function eq(_a, _b) {
      return _equals(_a, _b, stackA.slice(), stackB.slice());
    }
    return !_includesWith(function(b2, aItem) {
      return !_includesWith(eq, aItem, b2);
    }, b, a);
  }
  function _equals(a, b, stackA, stackB) {
    if (objectIs_default(a, b)) {
      return true;
    }
    var typeA = type_default(a);
    if (typeA !== type_default(b)) {
      return false;
    }
    if (a == null || b == null) {
      return false;
    }
    if (typeof a["fantasy-land/equals"] === "function" || typeof b["fantasy-land/equals"] === "function") {
      return typeof a["fantasy-land/equals"] === "function" && a["fantasy-land/equals"](b) && typeof b["fantasy-land/equals"] === "function" && b["fantasy-land/equals"](a);
    }
    if (typeof a.equals === "function" || typeof b.equals === "function") {
      return typeof a.equals === "function" && a.equals(b) && typeof b.equals === "function" && b.equals(a);
    }
    switch (typeA) {
      case "Arguments":
      case "Array":
      case "Object":
        if (typeof a.constructor === "function" && _functionName(a.constructor) === "Promise") {
          return a === b;
        }
        break;
      case "Boolean":
      case "Number":
      case "String":
        if (!(typeof a === typeof b && objectIs_default(a.valueOf(), b.valueOf()))) {
          return false;
        }
        break;
      case "Date":
        if (!objectIs_default(a.valueOf(), b.valueOf())) {
          return false;
        }
        break;
      case "Error":
        return a.name === b.name && a.message === b.message;
      case "RegExp":
        if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
          return false;
        }
        break;
    }
    var idx = stackA.length - 1;
    while (idx >= 0) {
      if (stackA[idx] === a) {
        return stackB[idx] === b;
      }
      idx -= 1;
    }
    switch (typeA) {
      case "Map":
        if (a.size !== b.size) {
          return false;
        }
        return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
      case "Set":
        if (a.size !== b.size) {
          return false;
        }
        return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
      case "Arguments":
      case "Array":
      case "Object":
      case "Boolean":
      case "Number":
      case "String":
      case "Date":
      case "Error":
      case "RegExp":
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "ArrayBuffer":
        break;
      default:
        return false;
    }
    var keysA = keys_default(a);
    if (keysA.length !== keys_default(b).length) {
      return false;
    }
    var extendedStackA = stackA.concat([a]);
    var extendedStackB = stackB.concat([b]);
    idx = keysA.length - 1;
    while (idx >= 0) {
      var key = keysA[idx];
      if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
        return false;
      }
      idx -= 1;
    }
    return true;
  }

  // ../node_modules/ramda/es/equals.js
  var equals = /* @__PURE__ */ _curry2(function equals2(a, b) {
    return _equals(a, b, [], []);
  });
  var equals_default = equals;

  // ../node_modules/ramda/es/internal/_indexOf.js
  function _indexOf(list, a, idx) {
    var inf, item;
    if (typeof list.indexOf === "function") {
      switch (typeof a) {
        case "number":
          if (a === 0) {
            inf = 1 / a;
            while (idx < list.length) {
              item = list[idx];
              if (item === 0 && 1 / item === inf) {
                return idx;
              }
              idx += 1;
            }
            return -1;
          } else if (a !== a) {
            while (idx < list.length) {
              item = list[idx];
              if (typeof item === "number" && item !== item) {
                return idx;
              }
              idx += 1;
            }
            return -1;
          }
          return list.indexOf(a, idx);
        // all these types can utilise Set
        case "string":
        case "boolean":
        case "function":
        case "undefined":
          return list.indexOf(a, idx);
        case "object":
          if (a === null) {
            return list.indexOf(a, idx);
          }
      }
    }
    while (idx < list.length) {
      if (equals_default(list[idx], a)) {
        return idx;
      }
      idx += 1;
    }
    return -1;
  }

  // ../node_modules/ramda/es/internal/_includes.js
  function _includes(a, list) {
    return _indexOf(list, a, 0) >= 0;
  }

  // ../node_modules/ramda/es/internal/_quote.js
  function _quote(s) {
    var escaped = s.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\f/g, "\\f").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\v/g, "\\v").replace(/\0/g, "\\0");
    return '"' + escaped.replace(/"/g, '\\"') + '"';
  }

  // ../node_modules/ramda/es/internal/_toISOString.js
  var pad = function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  };
  var _toISOString = typeof Date.prototype.toISOString === "function" ? function _toISOString2(d) {
    return d.toISOString();
  } : function _toISOString3(d) {
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "." + (d.getUTCMilliseconds() / 1e3).toFixed(3).slice(2, 5) + "Z";
  };
  var toISOString_default = _toISOString;

  // ../node_modules/ramda/es/internal/_complement.js
  function _complement(f) {
    return function() {
      return !f.apply(this, arguments);
    };
  }

  // ../node_modules/ramda/es/internal/_filter.js
  function _filter(fn, list) {
    var idx = 0;
    var len = list.length;
    var result = [];
    while (idx < len) {
      if (fn(list[idx])) {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  }

  // ../node_modules/ramda/es/internal/_isObject.js
  function _isObject(x) {
    return Object.prototype.toString.call(x) === "[object Object]";
  }

  // ../node_modules/ramda/es/internal/_xfilter.js
  var XFilter = /* @__PURE__ */ function() {
    function XFilter2(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XFilter2.prototype["@@transducer/init"] = xfBase_default.init;
    XFilter2.prototype["@@transducer/result"] = xfBase_default.result;
    XFilter2.prototype["@@transducer/step"] = function(result, input) {
      return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
    };
    return XFilter2;
  }();
  var _xfilter = /* @__PURE__ */ _curry2(function _xfilter2(f, xf) {
    return new XFilter(f, xf);
  });
  var xfilter_default = _xfilter;

  // ../node_modules/ramda/es/filter.js
  var filter = /* @__PURE__ */ _curry2(
    /* @__PURE__ */ _dispatchable(["filter"], xfilter_default, function(pred, filterable) {
      return _isObject(filterable) ? _reduce(function(acc, key) {
        if (pred(filterable[key])) {
          acc[key] = filterable[key];
        }
        return acc;
      }, {}, keys_default(filterable)) : (
        // else
        _filter(pred, filterable)
      );
    })
  );
  var filter_default = filter;

  // ../node_modules/ramda/es/reject.js
  var reject = /* @__PURE__ */ _curry2(function reject2(pred, filterable) {
    return filter_default(_complement(pred), filterable);
  });
  var reject_default = reject;

  // ../node_modules/ramda/es/internal/_toString.js
  function _toString(x, seen) {
    var recur = function recur2(y) {
      var xs = seen.concat([x]);
      return _includes(y, xs) ? "<Circular>" : _toString(y, xs);
    };
    var mapPairs = function(obj, keys4) {
      return _map(function(k) {
        return _quote(k) + ": " + recur(obj[k]);
      }, keys4.slice().sort());
    };
    switch (Object.prototype.toString.call(x)) {
      case "[object Arguments]":
        return "(function() { return arguments; }(" + _map(recur, x).join(", ") + "))";
      case "[object Array]":
        return "[" + _map(recur, x).concat(mapPairs(x, reject_default(function(k) {
          return /^\d+$/.test(k);
        }, keys_default(x)))).join(", ") + "]";
      case "[object Boolean]":
        return typeof x === "object" ? "new Boolean(" + recur(x.valueOf()) + ")" : x.toString();
      case "[object Date]":
        return "new Date(" + (isNaN(x.valueOf()) ? recur(NaN) : _quote(toISOString_default(x))) + ")";
      case "[object Null]":
        return "null";
      case "[object Number]":
        return typeof x === "object" ? "new Number(" + recur(x.valueOf()) + ")" : 1 / x === -Infinity ? "-0" : x.toString(10);
      case "[object String]":
        return typeof x === "object" ? "new String(" + recur(x.valueOf()) + ")" : _quote(x);
      case "[object Undefined]":
        return "undefined";
      default:
        if (typeof x.toString === "function") {
          var repr = x.toString();
          if (repr !== "[object Object]") {
            return repr;
          }
        }
        return "{" + mapPairs(x, keys_default(x)).join(", ") + "}";
    }
  }

  // ../node_modules/ramda/es/toString.js
  var toString2 = /* @__PURE__ */ _curry1(function toString3(val) {
    return _toString(val, []);
  });
  var toString_default = toString2;

  // ../node_modules/ramda/es/internal/_xdrop.js
  var XDrop = /* @__PURE__ */ function() {
    function XDrop2(n, xf) {
      this.xf = xf;
      this.n = n;
    }
    XDrop2.prototype["@@transducer/init"] = xfBase_default.init;
    XDrop2.prototype["@@transducer/result"] = xfBase_default.result;
    XDrop2.prototype["@@transducer/step"] = function(result, input) {
      if (this.n > 0) {
        this.n -= 1;
        return result;
      }
      return this.xf["@@transducer/step"](result, input);
    };
    return XDrop2;
  }();
  var _xdrop = /* @__PURE__ */ _curry2(function _xdrop2(n, xf) {
    return new XDrop(n, xf);
  });
  var xdrop_default = _xdrop;

  // ../node_modules/ramda/es/drop.js
  var drop = /* @__PURE__ */ _curry2(
    /* @__PURE__ */ _dispatchable(["drop"], xdrop_default, function drop2(n, xs) {
      return slice_default(Math.max(0, n), Infinity, xs);
    })
  );
  var drop_default = drop;

  // ../node_modules/ramda/es/internal/_xtake.js
  var XTake = /* @__PURE__ */ function() {
    function XTake2(n, xf) {
      this.xf = xf;
      this.n = n;
      this.i = 0;
    }
    XTake2.prototype["@@transducer/init"] = xfBase_default.init;
    XTake2.prototype["@@transducer/result"] = xfBase_default.result;
    XTake2.prototype["@@transducer/step"] = function(result, input) {
      this.i += 1;
      var ret = this.n === 0 ? result : this.xf["@@transducer/step"](result, input);
      return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
    };
    return XTake2;
  }();
  var _xtake = /* @__PURE__ */ _curry2(function _xtake2(n, xf) {
    return new XTake(n, xf);
  });
  var xtake_default = _xtake;

  // ../node_modules/ramda/es/take.js
  var take = /* @__PURE__ */ _curry2(
    /* @__PURE__ */ _dispatchable(["take"], xtake_default, function take2(n, xs) {
      return slice_default(0, n < 0 ? Infinity : n, xs);
    })
  );
  var take_default = take;

  // ../node_modules/ramda/es/takeLast.js
  var takeLast = /* @__PURE__ */ _curry2(function takeLast2(n, xs) {
    return drop_default(n >= 0 ? xs.length - n : 0, xs);
  });
  var takeLast_default = takeLast;

  // ../node_modules/ramda/es/invoker.js
  var invoker = /* @__PURE__ */ _curry2(function invoker2(arity, method) {
    return curryN_default(arity + 1, function() {
      var target = arguments[arity];
      if (target != null && _isFunction(target[method])) {
        return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
      }
      throw new TypeError(toString_default(target) + ' does not have a method named "' + method + '"');
    });
  });
  var invoker_default = invoker;

  // ../node_modules/ramda/es/join.js
  var join = /* @__PURE__ */ invoker_default(1, "join");
  var join_default = join;

  // ../node_modules/ramda/es/internal/_isNumber.js
  function _isNumber(x) {
    return Object.prototype.toString.call(x) === "[object Number]";
  }

  // ../node_modules/ramda/es/length.js
  var length = /* @__PURE__ */ _curry1(function length2(list) {
    return list != null && _isNumber(list.length) ? list.length : NaN;
  });
  var length_default = length;

  // ../node_modules/ramda/es/startsWith.js
  var startsWith = /* @__PURE__ */ _curry2(function(prefix, list) {
    return equals_default(take_default(prefix.length, list), prefix);
  });
  var startsWith_default = startsWith;

  // predictionRamda.mjs
  var wordTransitions = {};
  var letterTransitions = {};
  async function loadMarkovData() {
    const wordRes = await fetch("./markov_word_transitions.json");
    const letterRes = await fetch("./markov_letter_transitions.json");
    wordTransitions = await wordRes.json();
    letterTransitions = await letterRes.json();
  }
  function getNextWordProbabilities(context) {
    for (let n = length_default(context); n > 0; n--) {
      const key = pipe(
        takeLast_default(n),
        join_default(" ")
      )(context);
      const options = wordTransitions[key];
      if (options) return { options, contextUsed: n };
    }
    return { options: null, contextUsed: 0 };
  }
  function completeWord(prefix, options) {
    let best = null;
    let bestProb = 0;
    for (let word in options) {
      if (startsWith_default(prefix)(word)) {
        if (options[word] > bestProb) {
          bestProb = options[word];
          best = word;
        }
      }
    }
    return best ? best.slice(length_default(prefix)) : null;
  }
  function predictNextLetterProbs(currentPrefix, wordOptions = {}, context = "") {
    const letterProbs = {};
    let totalWeight = 0;
    for (let word in wordOptions) {
      if (!word.startsWith(currentPrefix)) continue;
      const nextLetter = word[currentPrefix.length];
      if (!nextLetter) continue;
      const wp = wordOptions[word];
      totalWeight += wp;
      letterProbs[nextLetter] = (letterProbs[nextLetter] || 0) + wp;
    }
    if (currentPrefix.length > 0) {
      const lastChar = currentPrefix[currentPrefix.length - 1].toLowerCase();
      const letterOptions = letterTransitions[lastChar] || {};
      for (let l in letterOptions) {
        const lp = letterOptions[l];
        totalWeight += lp;
        letterProbs[l] = (letterProbs[l] || 0) + lp * 0.7;
      }
    }
    if (Object.keys(letterProbs).length === 0) {
      const commonStarts = letterTransitions[""] || {};
      for (let l in commonStarts) {
        letterProbs[l] = commonStarts[l];
        totalWeight += commonStarts[l];
      }
    }
    if (totalWeight > 0) {
      for (let l in letterProbs) {
        letterProbs[l] /= totalWeight;
      }
    }
    return Object.fromEntries(
      Object.entries(letterProbs).sort(([, a], [, b]) => b - a).slice(0, 10).filter(([, p]) => p > 0.05)
      // seulement si la proba est > 0.05
    );
  }
  function getMostProbableNextLetter(currentPrefix, options) {
    const letterProbs = predictNextLetterProbs(currentPrefix, options);
    let bestLetter = null;
    let bestProb = 0;
    for (let letter in letterProbs) {
      if (letterProbs[letter] > bestProb) {
        bestProb = letterProbs[letter];
        bestLetter = letter;
      }
    }
    return bestLetter;
  }

  // src/keyboard.js
  var Keyboard = {
    elements: {
      main: null,
      keysContainer: null,
      keys: [],
      capsKey: null
    },
    properties: {
      value: "",
      capsLock: false,
      keyboardInputs: null,
      keyLayout: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "backspace",
        "q",
        "w",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p",
        "caps",
        "a",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "enter",
        "done",
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
        ",",
        ".",
        "?",
        "space"
      ]
    },
    init() {
      this.elements.main = document.createElement("div");
      this.elements.main.classList.add("keyboard");
      document.body.appendChild(this.elements.main);
      this.elements.keysContainer = document.createElement("div");
      this.elements.keysContainer.classList.add("keyboard__keys");
      this.elements.main.appendChild(this.elements.keysContainer);
      this.elements.keysContainer.appendChild(this._createKeys());
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
      this.properties.keyboardInputs = document.querySelectorAll(
        ".use-keyboard-input"
      );
      this.properties.keyboardInputs.forEach((element) => {
        element.addEventListener("focus", () => {
          this.open(element.value, (currentValue) => {
            element.value = currentValue;
          });
        });
      });
    },
    _createIconHTML(icon_name) {
      return `<span class="material-icons">${icon_name}</span>`;
    },
    _createKeyBtn(iconName = "", class1 = "", onclick = () => {
    }, class2 = "", dataChar = null) {
      this.keyElement = document.createElement("button");
      this.keyElement.setAttribute("type", "button");
      this.keyElement.classList.add("keyboard__key");
      if (class1) this.keyElement.classList.add(class1);
      if (class2) this.keyElement.classList.add(class2);
      if (iconName) {
        this.keyElement.innerHTML = this._createIconHTML(iconName);
      }
      if (dataChar !== null) {
        this.keyElement.dataset.char = dataChar;
      }
      this.keyElement.addEventListener("click", onclick);
      return this.keyElement;
    },
    _createKeys() {
      const fragment = document.createDocumentFragment();
      this.properties.keyLayout.forEach((key) => {
        const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
        switch (key) {
          case "backspace":
            this._createKeyBtn(
              "backspace",
              "keyboard__key--wide",
              () => {
                this.properties.value = this.properties.value.slice(0, -1);
                this._updateValueInTarget();
              }
            );
            break;
          case "caps":
            this._createKeyBtn(
              "keyboard_capslock",
              "keyboard__key--activatable",
              () => {
                this.elements.capsKey.classList.toggle("keyboard__key--active");
                this._toggleCapsLock();
              },
              "keyboard__key--wide"
            );
            this.elements.capsKey = this.keyElement;
            break;
          case "enter":
            this._createKeyBtn(
              "keyboard_return",
              "keyboard__key--wide",
              () => {
                this.properties.value += "\n";
                this._updateValueInTarget();
              }
            );
            break;
          case "space":
            const spaceBtn = this._createKeyBtn(
              "space_bar",
              "keyboard__key--extra--wide",
              () => {
                this.properties.value += " ";
                this._updateValueInTarget();
              },
              "",
              // pas de class2
              " "
              // data-char pour la touche espace
            );
            fragment.appendChild(spaceBtn);
            break;
          case "done":
            this._createKeyBtn(
              "check_circle",
              "keyboard__key--dark",
              () => {
                this.close();
                this._updateValueInTarget();
              },
              "keyboard__key--wide"
            );
            break;
          default:
            this._createKeyBtn("", "", () => {
              this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
              this._updateValueInTarget();
              const currentValue = this.properties.value.trim().split(/\s+/);
              const lastWord = currentValue[currentValue.length - 1] || "";
              const context = currentValue.slice(0, -1);
              const { options } = getNextWordProbabilities(context);
              const word = completeWord(lastWord, options);
              console.log("Valeur tap\xE9e :", this.properties.value);
              console.log("Mot en cours :", lastWord);
              console.log("Contexte :", context);
              console.log("Options:", options);
              console.log("Mots en train de taper pr\xE9dit:", word);
              console.log("Letter probs (filtered):", predictNextLetterProbs(lastWord, options));
              console.log("most probable letter:", getMostProbableNextLetter(lastWord, options));
              let letterProbs = predictNextLetterProbs(lastWord, options);
              this.elements.keys.forEach((keyEl) => {
                const char = (keyEl.dataset.char || keyEl.textContent.trim()).toLowerCase();
                if (!letterProbs[char]) {
                  keyEl.classList.remove("activeYellow");
                  keyEl.classList.remove("activePurple");
                }
                const prob = letterProbs[char];
                if (prob > 0.2) {
                  keyEl.classList.add("activePurple");
                  keyEl.classList.remove("activeYellow");
                } else if (prob > 0 && prob <= 0.2) {
                  keyEl.classList.add("activeYellow");
                  keyEl.classList.remove("activePurple");
                } else {
                  keyEl.classList.remove("activeYellow");
                  keyEl.classList.remove("activePurple");
                }
              });
            });
            this.keyElement.textContent = key.toLowerCase();
            break;
        }
        fragment.appendChild(this.keyElement);
        if (insertLineBreak) {
          fragment.appendChild(document.createElement("br"));
        }
      });
      return fragment;
    },
    _updateValueInTarget() {
      this.properties.keyboardInputs.forEach((keyboard) => {
        keyboard.value = this.properties.value;
      });
    },
    _toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;
      for (let key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    },
    open(initialValue, oninput) {
      this.properties.value = initialValue || "";
      this.elements.main.classList.remove("keyboard--hidden");
      this.elements.main.classList.add("keyboard--visible");
    },
    close() {
      this.elements.main.classList.remove("keyboard--visible");
      this.properties.value = this.properties.value;
      this.elements.main.classList.add("keyboard--hidden");
    }
  };
  window.addEventListener("DOMContentLoaded", async () => {
    await loadMarkovData();
    Keyboard.init();
    setTimeout(() => {
      Keyboard.elements.main.classList.add("keyboard--visible");
    }, 100);
  });
})();
//# sourceMappingURL=renderer.bundle.js.map
