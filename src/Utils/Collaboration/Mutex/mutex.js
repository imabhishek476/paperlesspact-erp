export const createMutex = () => {
  let token = true;
  return (f, g) => {
    if (token) {
      token = false;
      try {
        f();
      } finally {
        token = true;
      }
    } else if (g !== undefined) {
      g();
    }
  };
};
// var unlayer;
// !(function () {
//   var e = {
//       9051: function (e, t) {
//         var r, n;
//         void 0 ===
//           (n =
//             "function" ==
//             typeof (r = function () {
//               var e =
//                 /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
//               function t(e) {
//                 var t,
//                   r,
//                   n = e.replace(/^v/, "").replace(/\+.*$/, ""),
//                   i =
//                     ((r = "-"),
//                     -1 === (t = n).indexOf(r) ? t.length : t.indexOf(r)),
//                   o = n.substring(0, i).split(".");
//                 return o.push(n.substring(i + 1)), o;
//               }
//               function r(e) {
//                 return isNaN(Number(e)) ? e : Number(e);
//               }
//               function n(t) {
//                 if ("string" != typeof t)
//                   throw new TypeError("Invalid argument expected string");
//                 if (!e.test(t))
//                   throw new Error(
//                     "Invalid argument not valid semver ('" + t + "' received)"
//                   );
//               }
//               function i(e, i) {
//                 [e, i].forEach(n);
//                 for (
//                   var o = t(e), a = t(i), s = 0;
//                   s < Math.max(o.length - 1, a.length - 1);
//                   s++
//                 ) {
//                   var l = parseInt(o[s] || 0, 10),
//                     u = parseInt(a[s] || 0, 10);
//                   if (l > u) return 1;
//                   if (u > l) return -1;
//                 }
//                 var c = o[o.length - 1],
//                   f = a[a.length - 1];
//                 if (c && f) {
//                   var h = c.split(".").map(r),
//                     d = f.split(".").map(r);
//                   for (s = 0; s < Math.max(h.length, d.length); s++) {
//                     if (
//                       void 0 === h[s] ||
//                       ("string" == typeof d[s] && "number" == typeof h[s])
//                     )
//                       return -1;
//                     if (
//                       void 0 === d[s] ||
//                       ("string" == typeof h[s] && "number" == typeof d[s])
//                     )
//                       return 1;
//                     if (h[s] > d[s]) return 1;
//                     if (d[s] > h[s]) return -1;
//                   }
//                 } else if (c || f) return c ? -1 : 1;
//                 return 0;
//               }
//               var o = [">", ">=", "=", "<", "<="],
//                 a = {
//                   ">": [1],
//                   ">=": [0, 1],
//                   "=": [0],
//                   "<=": [-1, 0],
//                   "<": [-1],
//                 };
//               return (
//                 (i.validate = function (t) {
//                   return "string" == typeof t && e.test(t);
//                 }),
//                 (i.compare = function (e, t, r) {
//                   !(function (e) {
//                     if ("string" != typeof e)
//                       throw new TypeError(
//                         "Invalid operator type, expected string but got " +
//                           typeof e
//                       );
//                     if (-1 === o.indexOf(e))
//                       throw new TypeError(
//                         "Invalid operator, expected one of " + o.join("|")
//                       );
//                   })(r);
//                   var n = i(e, t);
//                   return a[r].indexOf(n) > -1;
//                 }),
//                 i
//               );
//             })
//               ? r.apply(t, [])
//               : r) || (e.exports = n);
//       },
//     },
//     t = {};
//   function r(n) {
//     var i = t[n];
//     if (void 0 !== i) return i.exports;
//     var o = (t[n] = { exports: {} });
//     return e[n].call(o.exports, o, o.exports, r), o.exports;
//   }
//   (r.d = function (e, t) {
//     for (var n in t)
//       r.o(t, n) &&
//         !r.o(e, n) &&
//         Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
//   }),
//     (r.o = function (e, t) {
//       return Object.prototype.hasOwnProperty.call(e, t);
//     }),
//     (r.p = "/");
//   var n,
//     i,
//     o = {};
//   (Window.prototype.forceJURL = !1),
//     (function (e) {
//       "use strict";
//       var t = !1;
//       if (!e.forceJURL)
//         try {
//           var r = new URL("b", "http://a");
//           (r.pathname = "c%20d"), (t = "http://a/c%20d" === r.href);
//         } catch (e) {}
//       if (!t) {
//         var n = Object.create(null);
//         (n.ftp = 21),
//           (n.file = 0),
//           (n.gopher = 70),
//           (n.http = 80),
//           (n.https = 443),
//           (n.ws = 80),
//           (n.wss = 443);
//         var i = Object.create(null);
//         (i["%2e"] = "."),
//           (i[".%2e"] = ".."),
//           (i["%2e."] = ".."),
//           (i["%2e%2e"] = "..");
//         var o = void 0,
//           a = /[a-zA-Z]/,
//           s = /[a-zA-Z0-9+\-.]/;
//         y.prototype = {
//           toString: function () {
//             return this.href;
//           },
//           get href() {
//             if (this._isInvalid) return this._url;
//             var e = "";
//             return (
//               ("" == this._username && null == this._password) ||
//                 (e =
//                   this._username +
//                   (null != this._password ? ":" + this._password : "") +
//                   "@"),
//               this.protocol +
//                 (this._isRelative ? "//" + e + this.host : "") +
//                 this.pathname +
//                 this._query +
//                 this._fragment
//             );
//           },
//           set href(e) {
//             p.call(this), v.call(this, e);
//           },
//           get protocol() {
//             return this._scheme + ":";
//           },
//           set protocol(e) {
//             this._isInvalid || v.call(this, e + ":", "scheme start");
//           },
//           get host() {
//             return this._isInvalid
//               ? ""
//               : this._port
//               ? this._host + ":" + this._port
//               : this._host;
//           },
//           set host(e) {
//             !this._isInvalid && this._isRelative && v.call(this, e, "host");
//           },
//           get hostname() {
//             return this._host;
//           },
//           set hostname(e) {
//             !this._isInvalid && this._isRelative && v.call(this, e, "hostname");
//           },
//           get port() {
//             return this._port;
//           },
//           set port(e) {
//             !this._isInvalid && this._isRelative && v.call(this, e, "port");
//           },
//           get pathname() {
//             return this._isInvalid
//               ? ""
//               : this._isRelative
//               ? "/" + this._path.join("/")
//               : this._schemeData;
//           },
//           set pathname(e) {
//             !this._isInvalid &&
//               this._isRelative &&
//               ((this._path = []), v.call(this, e, "relative path start"));
//           },
//           get search() {
//             return this._isInvalid || !this._query || "?" == this._query
//               ? ""
//               : this._query;
//           },
//           set search(e) {
//             !this._isInvalid &&
//               this._isRelative &&
//               ((this._query = "?"),
//               "?" == e[0] && (e = e.slice(1)),
//               v.call(this, e, "query"));
//           },
//           get hash() {
//             return this._isInvalid || !this._fragment || "#" == this._fragment
//               ? ""
//               : this._fragment;
//           },
//           set hash(e) {
//             this._isInvalid ||
//               (e
//                 ? ((this._fragment = "#"),
//                   "#" == e[0] && (e = e.slice(1)),
//                   v.call(this, e, "fragment"))
//                 : (this._fragment = ""));
//           },
//           get origin() {
//             var e;
//             if (this._isInvalid || !this._scheme) return "";
//             switch (this._scheme) {
//               case "data":
//               case "file":
//               case "javascript":
//               case "mailto":
//                 return "null";
//             }
//             return (e = this.host) ? this._scheme + "://" + e : "";
//           },
//         };
//         var l = e.URL;
//         l &&
//           ((y.createObjectURL = function (e) {
//             return l.createObjectURL.apply(l, arguments);
//           }),
//           (y.revokeObjectURL = function (e) {
//             l.revokeObjectURL(e);
//           })),
//           (e.URL = y);
//       }
//       function u(e) {
//         return void 0 !== n[e];
//       }
//       function c() {
//         p.call(this), (this._isInvalid = !0);
//       }
//       function f(e) {
//         return "" == e && c.call(this), e.toLowerCase();
//       }
//       function h(e) {
//         var t = e.charCodeAt(0);
//         return t > 32 && t < 127 && -1 == [34, 35, 60, 62, 63, 96].indexOf(t)
//           ? e
//           : encodeURIComponent(e);
//       }
//       function d(e) {
//         var t = e.charCodeAt(0);
//         return t > 32 && t < 127 && -1 == [34, 35, 60, 62, 96].indexOf(t)
//           ? e
//           : encodeURIComponent(e);
//       }
//       function v(e, t, r) {
//         function l(e) {
//           b.push(e);
//         }
//         var v = t || "scheme start",
//           p = 0,
//           y = "",
//           m = !1,
//           g = !1,
//           b = [];
//         e: for (; (e[p - 1] != o || 0 == p) && !this._isInvalid; ) {
//           var _ = e[p];
//           switch (v) {
//             case "scheme start":
//               if (!_ || !a.test(_)) {
//                 if (t) {
//                   l("Invalid scheme.");
//                   break e;
//                 }
//                 (y = ""), (v = "no scheme");
//                 continue;
//               }
//               (y += _.toLowerCase()), (v = "scheme");
//               break;
//             case "scheme":
//               if (_ && s.test(_)) y += _.toLowerCase();
//               else {
//                 if (":" != _) {
//                   if (t) {
//                     if (o == _) break e;
//                     l("Code point not allowed in scheme: " + _);
//                     break e;
//                   }
//                   (y = ""), (p = 0), (v = "no scheme");
//                   continue;
//                 }
//                 if (((this._scheme = y), (y = ""), t)) break e;
//                 u(this._scheme) && (this._isRelative = !0),
//                   (v =
//                     "file" == this._scheme
//                       ? "relative"
//                       : this._isRelative && r && r._scheme == this._scheme
//                       ? "relative or authority"
//                       : this._isRelative
//                       ? "authority first slash"
//                       : "scheme data");
//               }
//               break;
//             case "scheme data":
//               "?" == _
//                 ? ((this._query = "?"), (v = "query"))
//                 : "#" == _
//                 ? ((this._fragment = "#"), (v = "fragment"))
//                 : o != _ &&
//                   "\t" != _ &&
//                   "\n" != _ &&
//                   "\r" != _ &&
//                   (this._schemeData += h(_));
//               break;
//             case "no scheme":
//               if (r && u(r._scheme)) {
//                 v = "relative";
//                 continue;
//               }
//               l("Missing scheme."), c.call(this);
//               break;
//             case "relative or authority":
//               if ("/" != _ || "/" != e[p + 1]) {
//                 l("Expected /, got: " + _), (v = "relative");
//                 continue;
//               }
//               v = "authority ignore slashes";
//               break;
//             case "relative":
//               if (
//                 ((this._isRelative = !0),
//                 "file" != this._scheme && (this._scheme = r._scheme),
//                 o == _)
//               ) {
//                 (this._host = r._host),
//                   (this._port = r._port),
//                   (this._path = r._path.slice()),
//                   (this._query = r._query),
//                   (this._username = r._username),
//                   (this._password = r._password);
//                 break e;
//               }
//               if ("/" == _ || "\\" == _)
//                 "\\" == _ && l("\\ is an invalid code point."),
//                   (v = "relative slash");
//               else if ("?" == _)
//                 (this._host = r._host),
//                   (this._port = r._port),
//                   (this._path = r._path.slice()),
//                   (this._query = "?"),
//                   (this._username = r._username),
//                   (this._password = r._password),
//                   (v = "query");
//               else {
//                 if ("#" != _) {
//                   var w = e[p + 1],
//                     k = e[p + 2];
//                   ("file" != this._scheme ||
//                     !a.test(_) ||
//                     (":" != w && "|" != w) ||
//                     (o != k &&
//                       "/" != k &&
//                       "\\" != k &&
//                       "?" != k &&
//                       "#" != k)) &&
//                     ((this._host = r._host),
//                     (this._port = r._port),
//                     (this._username = r._username),
//                     (this._password = r._password),
//                     (this._path = r._path.slice()),
//                     this._path.pop()),
//                     (v = "relative path");
//                   continue;
//                 }
//                 (this._host = r._host),
//                   (this._port = r._port),
//                   (this._path = r._path.slice()),
//                   (this._query = r._query),
//                   (this._fragment = "#"),
//                   (this._username = r._username),
//                   (this._password = r._password),
//                   (v = "fragment");
//               }
//               break;
//             case "relative slash":
//               if ("/" != _ && "\\" != _) {
//                 "file" != this._scheme &&
//                   ((this._host = r._host),
//                   (this._port = r._port),
//                   (this._username = r._username),
//                   (this._password = r._password)),
//                   (v = "relative path");
//                 continue;
//               }
//               "\\" == _ && l("\\ is an invalid code point."),
//                 (v =
//                   "file" == this._scheme
//                     ? "file host"
//                     : "authority ignore slashes");
//               break;
//             case "authority first slash":
//               if ("/" != _) {
//                 l("Expected '/', got: " + _), (v = "authority ignore slashes");
//                 continue;
//               }
//               v = "authority second slash";
//               break;
//             case "authority second slash":
//               if (((v = "authority ignore slashes"), "/" != _)) {
//                 l("Expected '/', got: " + _);
//                 continue;
//               }
//               break;
//             case "authority ignore slashes":
//               if ("/" != _ && "\\" != _) {
//                 v = "authority";
//                 continue;
//               }
//               l("Expected authority, got: " + _);
//               break;
//             case "authority":
//               if ("@" == _) {
//                 m && (l("@ already seen."), (y += "%40")), (m = !0);
//                 for (var M = 0; M < y.length; M++) {
//                   var j = y[M];
//                   if ("\t" != j && "\n" != j && "\r" != j)
//                     if (":" != j || null !== this._password) {
//                       var S = h(j);
//                       null !== this._password
//                         ? (this._password += S)
//                         : (this._username += S);
//                     } else this._password = "";
//                   else l("Invalid whitespace in authority.");
//                 }
//                 y = "";
//               } else {
//                 if (o == _ || "/" == _ || "\\" == _ || "?" == _ || "#" == _) {
//                   (p -= y.length), (y = ""), (v = "host");
//                   continue;
//                 }
//                 y += _;
//               }
//               break;
//             case "file host":
//               if (o == _ || "/" == _ || "\\" == _ || "?" == _ || "#" == _) {
//                 2 != y.length || !a.test(y[0]) || (":" != y[1] && "|" != y[1])
//                   ? (0 == y.length ||
//                       ((this._host = f.call(this, y)), (y = "")),
//                     (v = "relative path start"))
//                   : (v = "relative path");
//                 continue;
//               }
//               "\t" == _ || "\n" == _ || "\r" == _
//                 ? l("Invalid whitespace in file host.")
//                 : (y += _);
//               break;
//             case "host":
//             case "hostname":
//               if (":" != _ || g) {
//                 if (o == _ || "/" == _ || "\\" == _ || "?" == _ || "#" == _) {
//                   if (
//                     ((this._host = f.call(this, y)),
//                     (y = ""),
//                     (v = "relative path start"),
//                     t)
//                   )
//                     break e;
//                   continue;
//                 }
//                 "\t" != _ && "\n" != _ && "\r" != _
//                   ? ("[" == _ ? (g = !0) : "]" == _ && (g = !1), (y += _))
//                   : l("Invalid code point in host/hostname: " + _);
//               } else if (
//                 ((this._host = f.call(this, y)),
//                 (y = ""),
//                 (v = "port"),
//                 "hostname" == t)
//               )
//                 break e;
//               break;
//             case "port":
//               if (/[0-9]/.test(_)) y += _;
//               else {
//                 if (
//                   o == _ ||
//                   "/" == _ ||
//                   "\\" == _ ||
//                   "?" == _ ||
//                   "#" == _ ||
//                   t
//                 ) {
//                   if ("" != y) {
//                     var I = parseInt(y, 10);
//                     I != n[this._scheme] && (this._port = I + ""), (y = "");
//                   }
//                   if (t) break e;
//                   v = "relative path start";
//                   continue;
//                 }
//                 "\t" == _ || "\n" == _ || "\r" == _
//                   ? l("Invalid code point in port: " + _)
//                   : c.call(this);
//               }
//               break;
//             case "relative path start":
//               if (
//                 ("\\" == _ && l("'\\' not allowed in path."),
//                 (v = "relative path"),
//                 "/" != _ && "\\" != _)
//               )
//                 continue;
//               break;
//             case "relative path":
//               var T;
//               o != _ && "/" != _ && "\\" != _ && (t || ("?" != _ && "#" != _))
//                 ? "\t" != _ && "\n" != _ && "\r" != _ && (y += h(_))
//                 : ("\\" == _ && l("\\ not allowed in relative path."),
//                   (T = i[y.toLowerCase()]) && (y = T),
//                   ".." == y
//                     ? (this._path.pop(),
//                       "/" != _ && "\\" != _ && this._path.push(""))
//                     : "." == y && "/" != _ && "\\" != _
//                     ? this._path.push("")
//                     : "." != y &&
//                       ("file" == this._scheme &&
//                         0 == this._path.length &&
//                         2 == y.length &&
//                         a.test(y[0]) &&
//                         "|" == y[1] &&
//                         (y = y[0] + ":"),
//                       this._path.push(y)),
//                   (y = ""),
//                   "?" == _
//                     ? ((this._query = "?"), (v = "query"))
//                     : "#" == _ && ((this._fragment = "#"), (v = "fragment")));
//               break;
//             case "query":
//               t || "#" != _
//                 ? o != _ &&
//                   "\t" != _ &&
//                   "\n" != _ &&
//                   "\r" != _ &&
//                   (this._query += d(_))
//                 : ((this._fragment = "#"), (v = "fragment"));
//               break;
//             case "fragment":
//               o != _ &&
//                 "\t" != _ &&
//                 "\n" != _ &&
//                 "\r" != _ &&
//                 (this._fragment += _);
//           }
//           p++;
//         }
//       }
//       function p() {
//         (this._scheme = ""),
//           (this._schemeData = ""),
//           (this._username = ""),
//           (this._password = null),
//           (this._host = ""),
//           (this._port = ""),
//           (this._path = []),
//           (this._query = ""),
//           (this._fragment = ""),
//           (this._isInvalid = !1),
//           (this._isRelative = !1);
//       }
//       function y(e, t) {
//         void 0 === t || t instanceof y || (t = new y(String(t))),
//           (this._url = "" + e),
//           p.call(this);
//         var r = this._url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
//         v.call(this, r, null, t);
//       }
//     })(window),
//     (function (e) {
//       var t = "currentScript",
//         r = e.getElementsByTagName("script");
//       t in e ||
//         Object.defineProperty(e, t, {
//           get: function () {
//             try {
//               throw new Error();
//             } catch (n) {
//               var e,
//                 t = (/.*at [^\(]*\((.*):.+:.+\)$/gi.exec(n.stack) || [!1])[1];
//               for (e in r)
//                 if (r[e].src == t || "interactive" == r[e].readyState)
//                   return r[e];
//               return null;
//             }
//           },
//         });
//     })(document),
//     (i = (n = new URL(document.currentScript.src)).href.substring(
//       0,
//       n.href.lastIndexOf("/") + 1
//     )),
//     (r.p = i),
//     (function () {
//       "use strict";
//       function e(e, r) {
//         return (
//           (function (e) {
//             if (Array.isArray(e)) return e;
//           })(e) ||
//           (function (e, t) {
//             var r =
//               null == e
//                 ? null
//                 : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
//                   e["@@iterator"];
//             if (null != r) {
//               var n,
//                 i,
//                 o,
//                 a,
//                 s = [],
//                 l = !0,
//                 u = !1;
//               try {
//                 if (((o = (r = r.call(e)).next), 0 === t)) {
//                   if (Object(r) !== r) return;
//                   l = !1;
//                 } else
//                   for (
//                     ;
//                     !(l = (n = o.call(r)).done) &&
//                     (s.push(n.value), s.length !== t);
//                     l = !0
//                   );
//               } catch (e) {
//                 (u = !0), (i = e);
//               } finally {
//                 try {
//                   if (
//                     !l &&
//                     null != r.return &&
//                     ((a = r.return()), Object(a) !== a)
//                   )
//                     return;
//                 } finally {
//                   if (u) throw i;
//                 }
//               }
//               return s;
//             }
//           })(e, r) ||
//           (function (e, r) {
//             if (e) {
//               if ("string" == typeof e) return t(e, r);
//               var n = Object.prototype.toString.call(e).slice(8, -1);
//               return (
//                 "Object" === n && e.constructor && (n = e.constructor.name),
//                 "Map" === n || "Set" === n
//                   ? Array.from(e)
//                   : "Arguments" === n ||
//                     /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
//                   ? t(e, r)
//                   : void 0
//               );
//             }
//           })(e, r) ||
//           (function () {
//             throw new TypeError(
//               "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
//             );
//           })()
//         );
//       }
//       function t(e, t) {
//         (null == t || t > e.length) && (t = e.length);
//         for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
//         return n;
//       }
//       function n(e) {
//         return (
//           (n =
//             "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
//               ? function (e) {
//                   return typeof e;
//                 }
//               : function (e) {
//                   return e &&
//                     "function" == typeof Symbol &&
//                     e.constructor === Symbol &&
//                     e !== Symbol.prototype
//                     ? "symbol"
//                     : typeof e;
//                 }),
//           n(e)
//         );
//       }
//       function i(t, r) {
//         var o =
//             arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
//           a = o._path,
//           s = void 0 === a ? [] : a,
//           l = o._visited,
//           u = void 0 === l ? new WeakMap() : l,
//           c = [];
//         if (t && u.has(t)) return c;
//         var f =
//           "function" == typeof r
//             ? r
//             : function (e) {
//                 return e === r;
//               };
//         f(t) && c.push(s);
//         try {
//           (Array.isArray(t) || (t && "object" === n(t))) &&
//             (u.set(t, !0),
//             Object.entries(t).forEach(function (t) {
//               var r = e(t, 2),
//                 n = r[0];
//               i(r[1], f, { _path: s.concat(n), _visited: u }).forEach(function (
//                 e
//               ) {
//                 return c.push(e);
//               });
//             }));
//         } catch (e) {
//           console.error(e);
//         }
//         return c;
//       }
//       function a(e) {
//         return (
//           (a =
//             "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
//               ? function (e) {
//                   return typeof e;
//                 }
//               : function (e) {
//                   return e &&
//                     "function" == typeof Symbol &&
//                     e.constructor === Symbol &&
//                     e !== Symbol.prototype
//                     ? "symbol"
//                     : typeof e;
//                 }),
//           a(e)
//         );
//       }
//       var s, l;
//       function u(e, t) {
//         for (var r = 0; r < t.length; r++) {
//           var n = t[r];
//           (n.enumerable = n.enumerable || !1),
//             (n.configurable = !0),
//             "value" in n && (n.writable = !0),
//             Object.defineProperty(e, f(n.key), n);
//         }
//       }
//       function c(e, t, r) {
//         return (
//           (t = f(t)) in e
//             ? Object.defineProperty(e, t, {
//                 value: r,
//                 enumerable: !0,
//                 configurable: !0,
//                 writable: !0,
//               })
//             : (e[t] = r),
//           e
//         );
//       }
//       function f(e) {
//         var t = (function (e, t) {
//           if ("object" !== a(e) || null === e) return e;
//           var r = e[Symbol.toPrimitive];
//           if (void 0 !== r) {
//             var n = r.call(e, t);
//             if ("object" !== a(n)) return n;
//             throw new TypeError("@@toPrimitive must return a primitive value.");
//           }
//           return String(e);
//         })(e, "string");
//         return "symbol" === a(t) ? t : String(t);
//       }
//       r.d(o, {
//         default: function () {
//           return q;
//         },
//       }),
//         (window.__unlayer_lastFrameId = window.__unlayer_lastFrameId || 0),
//         (window.__unlayer_multipleEditors =
//           null === (s = window.__unlayer_multipleEditors) || void 0 === s || s),
//         (window.__unlayer_originalFunctionReferences =
//           null === (l = window.__unlayer_originalFunctionReferences) ||
//           void 0 === l ||
//           l);
//       var h = {},
//         d = (function () {
//           function e(t) {
//             var r = this;
//             !(function (e, t) {
//               if (!(e instanceof t))
//                 throw new TypeError("Cannot call a class as a function");
//             })(this, e),
//               c(this, "id", void 0),
//               c(this, "ready", void 0),
//               c(this, "iframe", void 0),
//               c(this, "messages", void 0),
//               c(this, "callbackId", void 0),
//               c(this, "callbacks", void 0),
//               c(this, "destroy", function () {
//                 var e;
//                 window.removeEventListener("message", r.onWindowMessage, !1),
//                   null === (e = r.iframe) || void 0 === e || e.remove(),
//                   delete r.iframe;
//               }),
//               c(this, "onWindowMessage", function (e) {
//                 var t, n, i;
//                 if (
//                   (null == e ? void 0 : e.source) ===
//                   (null === (t = r.iframe) || void 0 === t
//                     ? void 0
//                     : t.contentWindow)
//                 )
//                   if (
//                     "unlayer:destroy" !==
//                     (null == e || null === (n = e.data) || void 0 === n
//                       ? void 0
//                       : n.action)
//                   ) {
//                     var o,
//                       a = window.__unlayer_multipleEditors
//                         ? null == e || null === (i = e.data) || void 0 === i
//                           ? void 0
//                           : i.frameId
//                         : 1;
//                     a &&
//                       (null === (o = h[a]) ||
//                         void 0 === o ||
//                         o.receiveMessage(e));
//                   } else r.destroy();
//               }),
//               (this.id = ++window.__unlayer_lastFrameId),
//               (h[this.id] = this),
//               (this.ready = !1),
//               (this.iframe = this.createIframe(t)),
//               (this.messages = []),
//               (this.iframe.onload = function () {
//                 (r.ready = !0), r.flushMessages();
//               }),
//               (this.callbackId = 0),
//               (this.callbacks = {}),
//               window.removeEventListener("message", this.onWindowMessage, !1),
//               window.addEventListener("message", this.onWindowMessage, !1);
//           }
//           var t, r;
//           return (
//             (t = e),
//             (r = [
//               {
//                 key: "createIframe",
//                 value: function (e) {
//                   var t = document.createElement("iframe");
//                   return (
//                     (t.src = e),
//                     (t.frameBorder = "0"),
//                     (t.width = "100%"),
//                     (t.height = "100%"),
//                     (t.style.minWidth = "1024px"),
//                     (t.style.minHeight = "100%"),
//                     (t.style.height = "100%"),
//                     (t.style.width = "100%"),
//                     (t.style.border = "0px"),
//                     t
//                   );
//                 },
//               },
//               {
//                 key: "appendTo",
//                 value: function (e) {
//                   this.iframe && e.appendChild(this.iframe);
//                 },
//               },
//               {
//                 key: "postMessage",
//                 value: function (e, t) {
//                   this.scheduleMessage(Object.assign({ action: e }, t)),
//                     this.flushMessages();
//                 },
//               },
//               {
//                 key: "withMessage",
//                 value: function (e, t, r) {
//                   var n = this.callbackId++;
//                   (this.callbacks[n] = r),
//                     this.postMessage(
//                       e,
//                       Object.assign({ frameId: this.id, callbackId: n }, t)
//                     );
//                 },
//               },
//               {
//                 key: "_preprocessMessageFunctions",
//                 value: function (e) {
//                   var t = this,
//                     r = Object.assign({}, e, {
//                       __unlayer_functions_map: Object.assign(
//                         {},
//                         null == e ? void 0 : e.__unlayer_functions_map,
//                         {}
//                       ),
//                     });
//                   return (
//                     i(e, function (e) {
//                       return "function" == typeof e;
//                     }).forEach(function (e) {
//                       var n,
//                         i = e.slice(-1)[0],
//                         o = "onCreateOption" === i;
//                       try {
//                         n = e.reduce(function (e, t) {
//                           return e[t];
//                         }, r);
//                         var a =
//                           e.length > 1
//                             ? e.slice(0, -1).reduce(function (e, t) {
//                                 return e[t];
//                               }, r)
//                             : r;
//                         if (!window.__unlayer_originalFunctionReferences && !o)
//                           return void (a[i] = "".concat(n));
//                         delete a[i];
//                       } catch (e) {
//                         console.error(e);
//                       }
//                       var s = t.callbackId++,
//                         l = t.id;
//                       t.callbacks[s] = n;
//                       var u =
//                         o && !window.__unlayer_originalFunctionReferences
//                           ? e.join(".")
//                           : ""
//                               .concat(e.join("."), "_")
//                               .concat(l, "_")
//                               .concat(s);
//                       r.__unlayer_functions_map[u] = {
//                         frameId: l,
//                         callbackId: s,
//                         path: e,
//                       };
//                     }),
//                     r
//                   );
//                 },
//               },
//               {
//                 key: "preprocessMessage",
//                 value: function (e) {
//                   return this._preprocessMessageFunctions(e);
//                 },
//               },
//               {
//                 key: "scheduleMessage",
//                 value: function (e) {
//                   var t = this.preprocessMessage(e);
//                   this.messages.push(t);
//                 },
//               },
//               {
//                 key: "flushMessages",
//                 value: function () {
//                   var e = this;
//                   this.ready &&
//                     (this.messages.forEach(function (t) {
//                       e.iframe &&
//                         e.iframe.contentWindow &&
//                         e.iframe.contentWindow.postMessage(t, "*");
//                     }),
//                     (this.messages = []));
//                 },
//               },
//               {
//                 key: "handleMessage",
//                 value: function (e) {
//                   var t = e.action,
//                     r = e.callbackId,
//                     n = e.doneId,
//                     i = e.result,
//                     o = e.resultArgs,
//                     a = this,
//                     s = Array.isArray(o) ? o : [i],
//                     l = null != i ? i : s[0],
//                     u = this.callbacks[r];
//                   switch (t) {
//                     case "response":
//                       u && (u(l), delete this.callbacks[r]);
//                       break;
//                     case "callback":
//                       var c;
//                       if (
//                         (null != s &&
//                           null !== (c = s[0]) &&
//                           void 0 !== c &&
//                           c.attachments &&
//                           (s[0].attachments = s[0].attachments.map(function (
//                             e
//                           ) {
//                             return new File([e.content], e.name, {
//                               type: e.type,
//                             });
//                           })),
//                         !u)
//                       )
//                         break;
//                       u.apply(
//                         null,
//                         s.concat(function () {
//                           a.postMessage("done", {
//                             doneId: n,
//                             resultArgs: Array.from(arguments),
//                             result: Array.from(arguments)[0],
//                           });
//                         })
//                       );
//                   }
//                 },
//               },
//               {
//                 key: "receiveMessage",
//                 value: function (e) {
//                   e.data && this.handleMessage(e.data);
//                 },
//               },
//             ]),
//             r && u(t.prototype, r),
//             Object.defineProperty(t, "prototype", { writable: !1 }),
//             e
//           );
//         })();
//       function v(e, t) {
//         (null == t || t > e.length) && (t = e.length);
//         for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
//         return n;
//       }
//       function p(e) {
//         return (
//           (p =
//             "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
//               ? function (e) {
//                   return typeof e;
//                 }
//               : function (e) {
//                   return e &&
//                     "function" == typeof Symbol &&
//                     e.constructor === Symbol &&
//                     e !== Symbol.prototype
//                     ? "symbol"
//                     : typeof e;
//                 }),
//           p(e)
//         );
//       }
//       function y(e) {
//         var t;
//         if (e)
//           return Object.assign(
//             {},
//             e,
//             !!e.attrs && {
//               attrs:
//                 ((t = e.attrs),
//                 t && "object" === p(t)
//                   ? Object.entries(t || {}).reduce(function (e, t) {
//                       var r,
//                         n,
//                         i,
//                         o =
//                           ((i = 2),
//                           (function (e) {
//                             if (Array.isArray(e)) return e;
//                           })((n = t)) ||
//                             (function (e, t) {
//                               var r =
//                                 null == e
//                                   ? null
//                                   : ("undefined" != typeof Symbol &&
//                                       e[Symbol.iterator]) ||
//                                     e["@@iterator"];
//                               if (null != r) {
//                                 var n,
//                                   i,
//                                   o,
//                                   a,
//                                   s = [],
//                                   l = !0,
//                                   u = !1;
//                                 try {
//                                   if (((o = (r = r.call(e)).next), 0 === t)) {
//                                     if (Object(r) !== r) return;
//                                     l = !1;
//                                   } else
//                                     for (
//                                       ;
//                                       !(l = (n = o.call(r)).done) &&
//                                       (s.push(n.value), s.length !== t);
//                                       l = !0
//                                     );
//                                 } catch (e) {
//                                   (u = !0), (i = e);
//                                 } finally {
//                                   try {
//                                     if (
//                                       !l &&
//                                       null != r.return &&
//                                       ((a = r.return()), Object(a) !== a)
//                                     )
//                                       return;
//                                   } finally {
//                                     if (u) throw i;
//                                   }
//                                 }
//                                 return s;
//                               }
//                             })(n, i) ||
//                             (function (e, t) {
//                               if (e) {
//                                 if ("string" == typeof e) return v(e, t);
//                                 var r = Object.prototype.toString
//                                   .call(e)
//                                   .slice(8, -1);
//                                 return (
//                                   "Object" === r &&
//                                     e.constructor &&
//                                     (r = e.constructor.name),
//                                   "Map" === r || "Set" === r
//                                     ? Array.from(e)
//                                     : "Arguments" === r ||
//                                       /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
//                                         r
//                                       )
//                                     ? v(e, t)
//                                     : void 0
//                                 );
//                               }
//                             })(n, i) ||
//                             (function () {
//                               throw new TypeError(
//                                 "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
//                               );
//                             })()),
//                         a = o[0],
//                         s = o[1];
//                       return Object.assign(
//                         {},
//                         e,
//                         (function (e, t, r) {
//                           return (
//                             (t = (function (e) {
//                               var t = (function (e, t) {
//                                 if ("object" !== p(e) || null === e) return e;
//                                 var r = e[Symbol.toPrimitive];
//                                 if (void 0 !== r) {
//                                   var n = r.call(e, t);
//                                   if ("object" !== p(n)) return n;
//                                   throw new TypeError(
//                                     "@@toPrimitive must return a primitive value."
//                                   );
//                                 }
//                                 return String(e);
//                               })(e, "string");
//                               return "symbol" === p(t) ? t : String(t);
//                             })(t)) in e
//                               ? Object.defineProperty(e, t, {
//                                   value: r,
//                                   enumerable: !0,
//                                   configurable: !0,
//                                   writable: !0,
//                                 })
//                               : (e[t] = r),
//                             e
//                           );
//                         })(
//                           {},
//                           a,
//                           "function" == typeof s
//                             ? "".concat(null != (r = s) ? r : "")
//                             : s
//                         )
//                       );
//                     }, {})
//                   : t),
//             }
//           );
//       }
//       function m(e) {
//         return y(e);
//       }
//       function g(e) {
//         return e && Array.isArray(e) ? e.map(m) : [];
//       }
//       function b(e, t) {
//         return (
//           (function (e) {
//             if (Array.isArray(e)) return e;
//           })(e) ||
//           (function (e, t) {
//             var r =
//               null == e
//                 ? null
//                 : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
//                   e["@@iterator"];
//             if (null != r) {
//               var n,
//                 i,
//                 o,
//                 a,
//                 s = [],
//                 l = !0,
//                 u = !1;
//               try {
//                 if (((o = (r = r.call(e)).next), 0 === t)) {
//                   if (Object(r) !== r) return;
//                   l = !1;
//                 } else
//                   for (
//                     ;
//                     !(l = (n = o.call(r)).done) &&
//                     (s.push(n.value), s.length !== t);
//                     l = !0
//                   );
//               } catch (e) {
//                 (u = !0), (i = e);
//               } finally {
//                 try {
//                   if (
//                     !l &&
//                     null != r.return &&
//                     ((a = r.return()), Object(a) !== a)
//                   )
//                     return;
//                 } finally {
//                   if (u) throw i;
//                 }
//               }
//               return s;
//             }
//           })(e, t) ||
//           (function (e, t) {
//             if (e) {
//               if ("string" == typeof e) return _(e, t);
//               var r = Object.prototype.toString.call(e).slice(8, -1);
//               return (
//                 "Object" === r && e.constructor && (r = e.constructor.name),
//                 "Map" === r || "Set" === r
//                   ? Array.from(e)
//                   : "Arguments" === r ||
//                     /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
//                   ? _(e, t)
//                   : void 0
//               );
//             }
//           })(e, t) ||
//           (function () {
//             throw new TypeError(
//               "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
//             );
//           })()
//         );
//       }
//       function _(e, t) {
//         (null == t || t > e.length) && (t = e.length);
//         for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
//         return n;
//       }
//       function w(e) {
//         if ("function" == typeof e)
//           return function (t, r) {
//             new Promise(function (r) {
//               r(e(t));
//             }).then(function (e) {
//               r(e);
//             });
//           };
//       }
//       function k(e) {
//         return (
//           (k =
//             "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
//               ? function (e) {
//                   return typeof e;
//                 }
//               : function (e) {
//                   return e &&
//                     "function" == typeof Symbol &&
//                     e.constructor === Symbol &&
//                     e !== Symbol.prototype
//                     ? "symbol"
//                     : typeof e;
//                 }),
//           k(e)
//         );
//       }
//       function M(e, t) {
//         return (
//           (function (e) {
//             if (Array.isArray(e)) return e;
//           })(e) ||
//           (function (e, t) {
//             var r =
//               null == e
//                 ? null
//                 : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
//                   e["@@iterator"];
//             if (null != r) {
//               var n,
//                 i,
//                 o,
//                 a,
//                 s = [],
//                 l = !0,
//                 u = !1;
//               try {
//                 if (((o = (r = r.call(e)).next), 0 === t)) {
//                   if (Object(r) !== r) return;
//                   l = !1;
//                 } else
//                   for (
//                     ;
//                     !(l = (n = o.call(r)).done) &&
//                     (s.push(n.value), s.length !== t);
//                     l = !0
//                   );
//               } catch (e) {
//                 (u = !0), (i = e);
//               } finally {
//                 try {
//                   if (
//                     !l &&
//                     null != r.return &&
//                     ((a = r.return()), Object(a) !== a)
//                   )
//                     return;
//                 } finally {
//                   if (u) throw i;
//                 }
//               }
//               return s;
//             }
//           })(e, t) ||
//           (function (e, t) {
//             if (e) {
//               if ("string" == typeof e) return j(e, t);
//               var r = Object.prototype.toString.call(e).slice(8, -1);
//               return (
//                 "Object" === r && e.constructor && (r = e.constructor.name),
//                 "Map" === r || "Set" === r
//                   ? Array.from(e)
//                   : "Arguments" === r ||
//                     /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
//                   ? j(e, t)
//                   : void 0
//               );
//             }
//           })(e, t) ||
//           (function () {
//             throw new TypeError(
//               "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
//             );
//           })()
//         );
//       }
//       function j(e, t) {
//         (null == t || t > e.length) && (t = e.length);
//         for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
//         return n;
//       }
//       function S(e, t) {
//         for (var r = 0; r < t.length; r++) {
//           var n = t[r];
//           (n.enumerable = n.enumerable || !1),
//             (n.configurable = !0),
//             "value" in n && (n.writable = !0),
//             Object.defineProperty(e, T(n.key), n);
//         }
//       }
//       function I(e, t, r) {
//         return (
//           (t = T(t)) in e
//             ? Object.defineProperty(e, t, {
//                 value: r,
//                 enumerable: !0,
//                 configurable: !0,
//                 writable: !0,
//               })
//             : (e[t] = r),
//           e
//         );
//       }
//       function T(e) {
//         var t = (function (e, t) {
//           if ("object" !== k(e) || null === e) return e;
//           var r = e[Symbol.toPrimitive];
//           if (void 0 !== r) {
//             var n = r.call(e, t);
//             if ("object" !== k(n)) return n;
//             throw new TypeError("@@toPrimitive must return a primitive value.");
//           }
//           return String(e);
//         })(e, "string");
//         return "symbol" === k(t) ? t : String(t);
//       }
//       var O = function (e, t) {
//           var n =
//               arguments.length > 2 && void 0 !== arguments[2]
//                 ? arguments[2]
//                 : {},
//             i = n.isLockedVersion,
//             o = void 0 !== i && i;
//           return e.startsWith("dev") || e.startsWith("qa")
//             ? o
//               ? -1
//               : 1
//             : r(9051)(e, t);
//         },
//         E = function (e) {
//           return "".concat(
//             e,
//             " method is not available here. It must be passed as customJS. More info at https://docs.unlayer.com/docs/custom-js-css"
//           );
//         },
//         x = (function () {
//           function e(t) {
//             !(function (e, t) {
//               if (!(e instanceof t))
//                 throw new TypeError("Cannot call a class as a function");
//             })(this, e),
//               I(this, "frame", null),
//               I(this, "version", void 0),
//               (function (e) {
//                 for (
//                   var t =
//                       arguments.length > 1 && void 0 !== arguments[1]
//                         ? arguments[1]
//                         : [
//                             "constructor",
//                             "hasOwnProperty",
//                             "isPrototypeOf",
//                             "propertyIsEnumerable",
//                             "toLocaleString",
//                             "toString",
//                             "valueOf",
//                           ],
//                     r = {},
//                     n = Object.getPrototypeOf(e);
//                   n;

//                 )
//                   Object.assign(r, Object.getOwnPropertyDescriptors(n)),
//                     (n = Object.getPrototypeOf(n));
//                 Object.entries(r).forEach(function (r) {
//                   var n = b(r, 2),
//                     i = n[0],
//                     o = n[1];
//                   i &&
//                     "string" == typeof i &&
//                     (t.includes(i) ||
//                       i.startsWith("__") ||
//                       Object.defineProperty(
//                         e,
//                         i,
//                         Object.assign({}, o, { enumerable: !0 })
//                       ));
//                 });
//               })(this),
//               t && this.init(t);
//           }
//           var t, n;
//           return (
//             (t = e),
//             (n = [
//               {
//                 key: "init",
//                 value: function () {
//                   var e =
//                     arguments.length > 0 && void 0 !== arguments[0]
//                       ? arguments[0]
//                       : {};
//                   this.loadEditor(e), this.renderEditor(e), this.initEditor(e);
//                 },
//               },
//               {
//                 key: "destroy",
//                 value: function () {
//                   var e;
//                   null === (e = this.frame) || void 0 === e || e.destroy(),
//                     (this.frame = null);
//                 },
//               },
//               {
//                 key: "loadEditor",
//                 value: function (e) {
//                   var t,
//                     n,
//                     i = this;
//                   (e.offline ||
//                     (null !== (t = e.appearance) &&
//                       void 0 !== t &&
//                       t.loader)) &&
//                     (e.render = !1);
//                   var o = e.version || "1.5.39",
//                     a = "".concat(r.p).concat(o, "/editor.html"),
//                     s = !1 === e.render ? "".concat(a, "?norender=true") : a;
//                   O(o, "1.0.57", { isLockedVersion: !!e.version }) <= 0 &&
//                     (window.__unlayer_multipleEditors = !1),
//                     O(o, "1.5.37", { isLockedVersion: !!e.version }) <= 0 &&
//                       (window.__unlayer_originalFunctionReferences = !1),
//                     (this.frame = new d(s)),
//                     null === (n = this.frame) ||
//                       void 0 === n ||
//                       n.withMessage("version", {}, function (e) {
//                         i.version = e;
//                       });
//                 },
//               },
//               {
//                 key: "renderEditor",
//                 value: function (e) {
//                   var t,
//                     r = null;
//                   if (
//                     (e.id
//                       ? (r = document.getElementById(e.id))
//                       : e.className &&
//                         (r = document.getElementsByClassName(e.className)[0]),
//                     !e.id && !e.className)
//                   )
//                     throw new Error("id or className must be provided.");
//                   if (!r)
//                     throw new Error(
//                       "Could not find a valid element for given id or className."
//                     );
//                   null === (t = this.frame) || void 0 === t || t.appendTo(r);
//                 },
//               },
//               {
//                 key: "initEditor",
//                 value: function (e) {
//                   var t,
//                     n = {};
//                   if (
//                     (e.env && (n.env = e.env),
//                     e.offline &&
//                       ((n.licenseUrl = "".concat(r.p, "license.json")),
//                       (n.offline = e.offline)),
//                     (n.referrer = window.location.href),
//                     e.source && (n.source = e.source),
//                     e.amp && (n.amp = e.amp),
//                     e.defaultDevice && (n.defaultDevice = e.defaultDevice),
//                     e.devices && (n.devices = e.devices),
//                     e.displayMode && (n.displayMode = e.displayMode),
//                     e.designMode && (n.designMode = e.designMode),
//                     e.designId && (n.designId = e.designId),
//                     e.projectId && (n.projectId = e.projectId),
//                     e.user && (n.user = e.user),
//                     e.templateId && (n.templateId = e.templateId),
//                     e.stockTemplateId &&
//                       (n.stockTemplateId = e.stockTemplateId),
//                     e.loadTimeout && (n.loadTimeout = e.loadTimeout),
//                     (e.safeHtml || e.safeHTML) &&
//                       (n.safeHtml = e.safeHtml || e.safeHTML || !0),
//                     e.options && (n.options = e.options),
//                     e.validator &&
//                       ("function" == typeof e.validator &&
//                       window.__unlayer_originalFunctionReferences
//                         ? (n.validator = w(e.validator))
//                         : (n.validator = e.validator)),
//                     e.tools)
//                   ) {
//                     var i = Object.entries(e.tools).reduce(function (e, t) {
//                       var r = M(t, 2),
//                         n = r[0],
//                         i = r[1];
//                       return Object.assign(
//                         {},
//                         e,
//                         I(
//                           {},
//                           n,
//                           Object.entries(i).reduce(function (e, t) {
//                             var r = M(t, 2),
//                               n = r[0],
//                               i = r[1];
//                             return Object.assign(
//                               {},
//                               e,
//                               I(
//                                 {},
//                                 n,
//                                 "function" == typeof i ? i.toString() : i
//                               )
//                             );
//                           }, {})
//                         )
//                       );
//                     }, {});
//                     n.tools = i;
//                   }
//                   e.excludeTools && (n.excludeTools = e.excludeTools),
//                     e.blocks && (n.blocks = e.blocks),
//                     e.editor && (n.editor = e.editor),
//                     e.fonts && (n.fonts = e.fonts),
//                     e.linkTypes && (n.linkTypes = g(e.linkTypes)),
//                     e.linkTypesSharedConfig &&
//                       (n.linkTypesSharedConfig = y(e.linkTypesSharedConfig)),
//                     e.mergeTags && (n.mergeTags = e.mergeTags),
//                     e.displayConditions &&
//                       (n.displayConditions = e.displayConditions),
//                     e.specialLinks && (n.specialLinks = e.specialLinks),
//                     e.designTags && (n.designTags = e.designTags),
//                     e.customCSS && (n.customCSS = e.customCSS),
//                     e.customJS && (n.customJS = e.customJS),
//                     e.locale && (n.locale = e.locale),
//                     e.textDirection && (n.textDirection = e.textDirection),
//                     e.translations && (n.translations = e.translations),
//                     e.appearance && (n.appearance = e.appearance),
//                     e.features && (n.features = e.features),
//                     e.designTagsConfig &&
//                       (n.designTagsConfig = e.designTagsConfig),
//                     e.mergeTagsConfig &&
//                       (n.mergeTagsConfig = e.mergeTagsConfig),
//                     e.tabs && (n.tabs = e.tabs),
//                     window.Cypress && (n.IS_TEST = !0),
//                     null === (t = this.frame) ||
//                       void 0 === t ||
//                       t.postMessage("config", n);
//                 },
//               },
//               {
//                 key: "registerColumns",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("registerColumns", { cells: e });
//                 },
//               },
//               {
//                 key: "registerCallback",
//                 value: function (e, t) {
//                   var r;
//                   null === (r = this.frame) ||
//                     void 0 === r ||
//                     r.withMessage("registerCallback", { type: e }, t);
//                 },
//               },
//               {
//                 key: "unregisterCallback",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("unregisterCallback", { type: e });
//                 },
//               },
//               {
//                 key: "registerProvider",
//                 value: function (e, t) {
//                   var r;
//                   null === (r = this.frame) ||
//                     void 0 === r ||
//                     r.withMessage("registerProvider", { type: e }, t);
//                 },
//               },
//               {
//                 key: "unregisterProvider",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("unregisterProvider", { type: e });
//                 },
//               },
//               {
//                 key: "reloadProvider",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("reloadProvider", { type: e });
//                 },
//               },
//               {
//                 key: "addEventListener",
//                 value: function (e, t) {
//                   var r;
//                   null === (r = this.frame) ||
//                     void 0 === r ||
//                     r.withMessage("registerCallback", { type: e }, t);
//                 },
//               },
//               {
//                 key: "removeEventListener",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("unregisterCallback", { type: e });
//                 },
//               },
//               {
//                 key: "setDesignId",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("setDesignId", { id: e });
//                 },
//               },
//               {
//                 key: "setDesignMode",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("setDesignMode", { designMode: e });
//                 },
//               },
//               {
//                 key: "setDisplayMode",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("setDisplayMode", { displayMode: e });
//                 },
//               },
//               {
//                 key: "loadProject",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("loadProject", { projectId: e });
//                 },
//               },
//               {
//                 key: "loadUser",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("loadUser", { user: e });
//                 },
//               },
//               {
//                 key: "loadTemplate",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("loadTemplate", { templateId: e });
//                 },
//               },
//               {
//                 key: "loadStockTemplate",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("loadStockTemplate", { stockTemplateId: e });
//                 },
//               },
//               {
//                 key: "setLinkTypes",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setLinkTypes", { linkTypes: g(e) });
//                 },
//               },
//               {
//                 key: "setLinkTypesSharedConfig",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setLinkTypesSharedConfig", {
//                       linkTypesSharedConfig: y(e),
//                     });
//                 },
//               },
//               {
//                 key: "setMergeTags",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setMergeTags", { mergeTags: e });
//                 },
//               },
//               {
//                 key: "setSpecialLinks",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setSpecialLinks", { specialLinks: e });
//                 },
//               },
//               {
//                 key: "setDisplayConditions",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setDisplayConditions", {
//                       displayConditions: e,
//                     });
//                 },
//               },
//               {
//                 key: "setLocale",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setLocale", { locale: e });
//                 },
//               },
//               {
//                 key: "setTextDirection",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setTextDirection", { textDirection: e });
//                 },
//               },
//               {
//                 key: "setTranslations",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setTranslations", { translations: e });
//                 },
//               },
//               {
//                 key: "loadBlank",
//                 value: function () {
//                   var e,
//                     t =
//                       arguments.length > 0 && void 0 !== arguments[0]
//                         ? arguments[0]
//                         : {};
//                   null === (e = this.frame) ||
//                     void 0 === e ||
//                     e.postMessage("loadBlank", { bodyValues: t });
//                 },
//               },
//               {
//                 key: "loadDesign",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("loadDesign", { design: e });
//                 },
//               },
//               {
//                 key: "saveDesign",
//                 value: function (e) {
//                   var t,
//                     r =
//                       arguments.length > 1 && void 0 !== arguments[1]
//                         ? arguments[1]
//                         : {};
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("saveDesign", r, e);
//                 },
//               },
//               {
//                 key: "exportHtml",
//                 value: function (e, t) {
//                   var r;
//                   null === (r = this.frame) ||
//                     void 0 === r ||
//                     r.withMessage("exportHtml", t, e);
//                 },
//               },
//               {
//                 key: "exportLiveHtml",
//                 value: function (e) {
//                   var t,
//                     r =
//                       arguments.length > 1 && void 0 !== arguments[1]
//                         ? arguments[1]
//                         : {};
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("exportLiveHtml", r, e);
//                 },
//               },
//               {
//                 key: "exportPlainText",
//                 value: function (e) {
//                   var t,
//                     r =
//                       arguments.length > 1 && void 0 !== arguments[1]
//                         ? arguments[1]
//                         : {};
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("exportPlainText", r, e);
//                 },
//               },
//               {
//                 key: "exportImage",
//                 value: function (e) {
//                   var t,
//                     r =
//                       arguments.length > 1 && void 0 !== arguments[1]
//                         ? arguments[1]
//                         : {};
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("exportImage", r, e);
//                 },
//               },
//               {
//                 key: "exportPdf",
//                 value: function (e) {
//                   var t,
//                     r =
//                       arguments.length > 1 && void 0 !== arguments[1]
//                         ? arguments[1]
//                         : {};
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("exportPdf", r, e);
//                 },
//               },
//               {
//                 key: "exportZip",
//                 value: function (e) {
//                   var t,
//                     r =
//                       arguments.length > 1 && void 0 !== arguments[1]
//                         ? arguments[1]
//                         : {};
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("exportZip", r, e);
//                 },
//               },
//               {
//                 key: "setAppearance",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setAppearance", { appearance: e });
//                 },
//               },
//               {
//                 key: "setBodyValues",
//                 value: function (e, t) {
//                   var r;
//                   null === (r = this.frame) ||
//                     void 0 === r ||
//                     r.postMessage("setBodyValues", {
//                       bodyId: t,
//                       bodyValues: e,
//                     });
//                 },
//               },
//               {
//                 key: "setDesignTagsConfig",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setDesignTagsConfig", {
//                       designTagsConfig: e,
//                     });
//                 },
//               },
//               {
//                 key: "setMergeTagsConfig",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("setMergeTagsConfig", { mergeTagsConfig: e });
//                 },
//               },
//               {
//                 key: "showPreview",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.postMessage("showPreview", { device: e });
//                 },
//               },
//               {
//                 key: "hidePreview",
//                 value: function () {
//                   var e;
//                   null === (e = this.frame) ||
//                     void 0 === e ||
//                     e.postMessage("hidePreview", {});
//                 },
//               },
//               {
//                 key: "canUndo",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("canUndo", {}, e);
//                 },
//               },
//               {
//                 key: "canRedo",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("canRedo", {}, e);
//                 },
//               },
//               {
//                 key: "undo",
//                 value: function () {
//                   var e;
//                   null === (e = this.frame) ||
//                     void 0 === e ||
//                     e.postMessage("undo", {});
//                 },
//               },
//               {
//                 key: "redo",
//                 value: function () {
//                   var e;
//                   null === (e = this.frame) ||
//                     void 0 === e ||
//                     e.postMessage("redo", {});
//                 },
//               },
//               {
//                 key: "audit",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("audit", {}, e);
//                 },
//               },
//               {
//                 key: "setValidator",
//                 value: function (e) {
//                   var t;
//                   "function" == typeof e || null === e
//                     ? null === (t = this.frame) ||
//                       void 0 === t ||
//                       t.withMessage("setValidator", {
//                         validator:
//                           "function" == typeof e &&
//                           window.__unlayer_originalFunctionReferences
//                             ? w(e)
//                             : e,
//                       })
//                     : console.error("Validator must be a function or null");
//                 },
//               },
//               {
//                 key: "setToolValidator",
//                 value: function (e, t) {
//                   var r;
//                   e && "string" == typeof e
//                     ? "function" == typeof t || null === t
//                       ? null === (r = this.frame) ||
//                         void 0 === r ||
//                         r.withMessage("setToolValidator", {
//                           tool: e,
//                           validator:
//                             "function" == typeof t &&
//                             window.__unlayer_originalFunctionReferences
//                               ? w(t)
//                               : t,
//                         })
//                       : console.error("Validator must be a function")
//                     : console.error("Tool name must be a string");
//                 },
//               },
//               {
//                 key: "updateTabs",
//                 value: function (e) {
//                   var t;
//                   null === (t = this.frame) ||
//                     void 0 === t ||
//                     t.withMessage("updateTabs", { tabs: e });
//                 },
//               },
//               {
//                 key: "clearValidators",
//                 value: function () {
//                   var e;
//                   null === (e = this.frame) ||
//                     void 0 === e ||
//                     e.withMessage("clearValidators", {});
//                 },
//               },
//               {
//                 key: "registerContainerExporter",
//                 value: function () {
//                   throw new Error(E("registerContainerExporter"));
//                 },
//               },
//               {
//                 key: "registerItemExporter",
//                 value: function () {
//                   throw new Error(E("registerItemExporter"));
//                 },
//               },
//               {
//                 key: "registerTool",
//                 value: function () {
//                   throw new Error(E("registerTool"));
//                 },
//               },
//               {
//                 key: "registerPropertyEditor",
//                 value: function () {
//                   throw new Error(E("registerPropertyEditor"));
//                 },
//               },
//               {
//                 key: "registerTab",
//                 value: function () {
//                   throw new Error(E("registerTab"));
//                 },
//               },
//               {
//                 key: "createPanel",
//                 value: function () {
//                   throw new Error(E("createPanel"));
//                 },
//               },
//               {
//                 key: "createViewer",
//                 value: function () {
//                   throw new Error(E("createViewer"));
//                 },
//               },
//               {
//                 key: "createWidget",
//                 value: function () {
//                   throw new Error(E("createWidget"));
//                 },
//               },
//             ]),
//             n && S(t.prototype, n),
//             Object.defineProperty(t, "prototype", { writable: !1 }),
//             e
//           );
//         })();
//       function C(e) {
//         return (
//           (C =
//             "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
//               ? function (e) {
//                   return typeof e;
//                 }
//               : function (e) {
//                   return e &&
//                     "function" == typeof Symbol &&
//                     e.constructor === Symbol &&
//                     e !== Symbol.prototype
//                     ? "symbol"
//                     : typeof e;
//                 }),
//           C(e)
//         );
//       }
//       function P(e, t) {
//         if (!(e instanceof t))
//           throw new TypeError("Cannot call a class as a function");
//       }
//       function A(e, t) {
//         for (var r = 0; r < t.length; r++) {
//           var n = t[r];
//           (n.enumerable = n.enumerable || !1),
//             (n.configurable = !0),
//             "value" in n && (n.writable = !0),
//             Object.defineProperty(
//               e,
//               (void 0,
//               (i = (function (e, t) {
//                 if ("object" !== C(e) || null === e) return e;
//                 var r = e[Symbol.toPrimitive];
//                 if (void 0 !== r) {
//                   var n = r.call(e, t);
//                   if ("object" !== C(n)) return n;
//                   throw new TypeError(
//                     "@@toPrimitive must return a primitive value."
//                   );
//                 }
//                 return String(e);
//               })(n.key, "string")),
//               "symbol" === C(i) ? i : String(i)),
//               n
//             );
//         }
//         var i;
//       }
//       function R(e, t) {
//         return (
//           (R = Object.setPrototypeOf
//             ? Object.setPrototypeOf.bind()
//             : function (e, t) {
//                 return (e.__proto__ = t), e;
//               }),
//           R(e, t)
//         );
//       }
//       function L(e, t) {
//         if (t && ("object" === C(t) || "function" == typeof t)) return t;
//         if (void 0 !== t)
//           throw new TypeError(
//             "Derived constructors may only return object or undefined"
//           );
//         return (function (e) {
//           if (void 0 === e)
//             throw new ReferenceError(
//               "this hasn't been initialised - super() hasn't been called"
//             );
//           return e;
//         })(e);
//       }
//       function D(e) {
//         return (
//           (D = Object.setPrototypeOf
//             ? Object.getPrototypeOf.bind()
//             : function (e) {
//                 return e.__proto__ || Object.getPrototypeOf(e);
//               }),
//           D(e)
//         );
//       }
//       var U = (function (e) {
//           !(function (e, t) {
//             if ("function" != typeof t && null !== t)
//               throw new TypeError(
//                 "Super expression must either be null or a function"
//               );
//             (e.prototype = Object.create(t && t.prototype, {
//               constructor: { value: e, writable: !0, configurable: !0 },
//             })),
//               Object.defineProperty(e, "prototype", { writable: !1 }),
//               t && R(e, t);
//           })(a, e);
//           var t,
//             r,
//             n,
//             i,
//             o =
//               ((n = a),
//               (i = (function () {
//                 if ("undefined" == typeof Reflect || !Reflect.construct)
//                   return !1;
//                 if (Reflect.construct.sham) return !1;
//                 if ("function" == typeof Proxy) return !0;
//                 try {
//                   return (
//                     Boolean.prototype.valueOf.call(
//                       Reflect.construct(Boolean, [], function () {})
//                     ),
//                     !0
//                   );
//                 } catch (e) {
//                   return !1;
//                 }
//               })()),
//               function () {
//                 var e,
//                   t = D(n);
//                 if (i) {
//                   var r = D(this).constructor;
//                   e = Reflect.construct(t, arguments, r);
//                 } else e = t.apply(this, arguments);
//                 return L(this, e);
//               });
//           function a() {
//             return P(this, a), o.apply(this, arguments);
//           }
//           return (
//             (t = a),
//             (r = [
//               {
//                 key: "createEditor",
//                 value: function (e) {
//                   return new x(e);
//                 },
//               },
//             ]) && A(t.prototype, r),
//             Object.defineProperty(t, "prototype", { writable: !1 }),
//             a
//           );
//         })(x),
//         q = new U();
//     })(),
//     (unlayer = o.default);
// })();
