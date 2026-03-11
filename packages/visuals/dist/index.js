import k2 from "react";
var N1 = { exports: {} }, l1 = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var J1;
function b2() {
  if (J1) return l1;
  J1 = 1;
  var l = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
  function c(e, s, r) {
    var i = null;
    if (r !== void 0 && (i = "" + r), s.key !== void 0 && (i = "" + s.key), "key" in s) {
      r = {};
      for (var o in s)
        o !== "key" && (r[o] = s[o]);
    } else r = s;
    return s = r.ref, {
      $$typeof: l,
      type: e,
      key: i,
      ref: s !== void 0 ? s : null,
      props: r
    };
  }
  return l1.Fragment = n, l1.jsx = c, l1.jsxs = c, l1;
}
var n1 = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var K1;
function E2() {
  return K1 || (K1 = 1, process.env.NODE_ENV !== "production" && function() {
    function l(a) {
      if (a == null) return null;
      if (typeof a == "function")
        return a.$$typeof === x1 ? null : a.displayName || a.name || null;
      if (typeof a == "string") return a;
      switch (a) {
        case u:
          return "Fragment";
        case w:
          return "Profiler";
        case y:
          return "StrictMode";
        case D:
          return "Suspense";
        case U:
          return "SuspenseList";
        case E:
          return "Activity";
      }
      if (typeof a == "object")
        switch (typeof a.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), a.$$typeof) {
          case m:
            return "Portal";
          case _:
            return a.displayName || "Context";
          case F:
            return (a._context.displayName || "Context") + ".Consumer";
          case k:
            var M = a.render;
            return a = a.displayName, a || (a = M.displayName || M.name || "", a = a !== "" ? "ForwardRef(" + a + ")" : "ForwardRef"), a;
          case I:
            return M = a.displayName || null, M !== null ? M : l(a.type) || "Memo";
          case R:
            M = a._payload, a = a._init;
            try {
              return l(a(M));
            } catch {
            }
        }
      return null;
    }
    function n(a) {
      return "" + a;
    }
    function c(a) {
      try {
        n(a);
        var M = !1;
      } catch {
        M = !0;
      }
      if (M) {
        M = console;
        var z = M.error, C = typeof Symbol == "function" && Symbol.toStringTag && a[Symbol.toStringTag] || a.constructor.name || "Object";
        return z.call(
          M,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          C
        ), n(a);
      }
    }
    function e(a) {
      if (a === u) return "<>";
      if (typeof a == "object" && a !== null && a.$$typeof === R)
        return "<...>";
      try {
        var M = l(a);
        return M ? "<" + M + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function s() {
      var a = V.A;
      return a === null ? null : a.getOwner();
    }
    function r() {
      return Error("react-stack-top-frame");
    }
    function i(a) {
      if (L.call(a, "key")) {
        var M = Object.getOwnPropertyDescriptor(a, "key").get;
        if (M && M.isReactWarning) return !1;
      }
      return a.key !== void 0;
    }
    function o(a, M) {
      function z() {
        v1 || (v1 = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          M
        ));
      }
      z.isReactWarning = !0, Object.defineProperty(a, "key", {
        get: z,
        configurable: !0
      });
    }
    function h() {
      var a = l(this.type);
      return g1[a] || (g1[a] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), a = this.props.ref, a !== void 0 ? a : null;
    }
    function p(a, M, z, C, w1, T1) {
      var A = z.ref;
      return a = {
        $$typeof: x,
        type: a,
        key: M,
        props: z,
        _owner: C
      }, (A !== void 0 ? A : null) !== null ? Object.defineProperty(a, "ref", {
        enumerable: !1,
        get: h
      }) : Object.defineProperty(a, "ref", { enumerable: !1, value: null }), a._store = {}, Object.defineProperty(a._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(a, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(a, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: w1
      }), Object.defineProperty(a, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: T1
      }), Object.freeze && (Object.freeze(a.props), Object.freeze(a)), a;
    }
    function d(a, M, z, C, w1, T1) {
      var A = M.children;
      if (A !== void 0)
        if (C)
          if (X(A)) {
            for (C = 0; C < A.length; C++)
              f(A[C]);
            Object.freeze && Object.freeze(A);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else f(A);
      if (L.call(M, "key")) {
        A = l(a);
        var q = Object.keys(M).filter(function(j2) {
          return j2 !== "key";
        });
        C = 0 < q.length ? "{key: someKey, " + q.join(": ..., ") + ": ...}" : "{key: someKey}", M1[A + C] || (q = 0 < q.length ? "{" + q.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          C,
          A,
          q,
          A
        ), M1[A + C] = !0);
      }
      if (A = null, z !== void 0 && (c(z), A = "" + z), i(M) && (c(M.key), A = "" + M.key), "key" in M) {
        z = {};
        for (var $1 in M)
          $1 !== "key" && (z[$1] = M[$1]);
      } else z = M;
      return A && o(
        z,
        typeof a == "function" ? a.displayName || a.name || "Unknown" : a
      ), p(
        a,
        A,
        z,
        s(),
        w1,
        T1
      );
    }
    function f(a) {
      g(a) ? a._store && (a._store.validated = 1) : typeof a == "object" && a !== null && a.$$typeof === R && (a._payload.status === "fulfilled" ? g(a._payload.value) && a._payload.value._store && (a._payload.value._store.validated = 1) : a._store && (a._store.validated = 1));
    }
    function g(a) {
      return typeof a == "object" && a !== null && a.$$typeof === x;
    }
    var v = k2, x = Symbol.for("react.transitional.element"), m = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), F = Symbol.for("react.consumer"), _ = Symbol.for("react.context"), k = Symbol.for("react.forward_ref"), D = Symbol.for("react.suspense"), U = Symbol.for("react.suspense_list"), I = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), E = Symbol.for("react.activity"), x1 = Symbol.for("react.client.reference"), V = v.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, L = Object.prototype.hasOwnProperty, X = Array.isArray, W = console.createTask ? console.createTask : function() {
      return null;
    };
    v = {
      react_stack_bottom_frame: function(a) {
        return a();
      }
    };
    var v1, g1 = {}, m1 = v.react_stack_bottom_frame.bind(
      v,
      r
    )(), u1 = W(e(r)), M1 = {};
    n1.Fragment = u, n1.jsx = function(a, M, z) {
      var C = 1e4 > V.recentlyCreatedOwnerStacks++;
      return d(
        a,
        M,
        z,
        !1,
        C ? Error("react-stack-top-frame") : m1,
        C ? W(e(a)) : u1
      );
    }, n1.jsxs = function(a, M, z) {
      var C = 1e4 > V.recentlyCreatedOwnerStacks++;
      return d(
        a,
        M,
        z,
        !0,
        C ? Error("react-stack-top-frame") : m1,
        C ? W(e(a)) : u1
      );
    };
  }()), n1;
}
process.env.NODE_ENV === "production" ? N1.exports = b2() : N1.exports = E2();
var t = N1.exports;
const D2 = 400, B = 24, t2 = 8, R2 = 4, e2 = 14, l2 = 16;
function V2({ config: l, width: n = D2, className: c }) {
  const { min: e, max: s, interval: r, labelled: i, blank: o } = l, h = s - e, p = r, d = [];
  for (let g = e; g <= s; g += p) d.push(g);
  const f = (g) => 24 + (g - e) / h * (n - 48);
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: n,
      height: 48,
      viewBox: `0 0 ${n} 48`,
      className: c,
      style: { overflow: "visible" },
      "aria-hidden": !0,
      children: [
        /* @__PURE__ */ t.jsx(
          "line",
          {
            x1: 24,
            y1: B,
            x2: n - 24,
            y2: B,
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "2"
          }
        ),
        d.map((g) => {
          const v = i.includes(g), x = o.includes(g), m = f(g);
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx(
              "line",
              {
                x1: m,
                y1: B,
                x2: m,
                y2: B + t2,
                stroke: "var(--sp-visual-stroke, #374151)",
                strokeWidth: "2"
              }
            ),
            v && /* @__PURE__ */ t.jsx(
              "text",
              {
                x: m,
                y: B + t2 + R2 + 12,
                textAnchor: "middle",
                fill: "var(--sp-visual-text, #111827)",
                style: { fontSize: 14, fontFamily: "system-ui, sans-serif" },
                children: g
              }
            ),
            x && /* @__PURE__ */ t.jsx(
              "path",
              {
                d: `M ${m} ${B} L ${m - l2 / 2} ${B - e2} L ${m + l2 / 2} ${B - e2} Z`,
                fill: "var(--sp-visual-fill, #374151)",
                stroke: "var(--sp-visual-stroke, #111827)",
                strokeWidth: "1"
              }
            )
          ] }, g);
        })
      ]
    }
  );
}
const L2 = 96, Z1 = 12, B2 = 6;
function T2({ cx: l, cy: n }) {
  return /* @__PURE__ */ t.jsx(
    "circle",
    {
      cx: l,
      cy: n,
      r: B2,
      fill: "var(--sp-visual-fill, #111827)"
    }
  );
}
function $2({ value: l, size: n }) {
  const c = n / 2, e = n / 4, s = [];
  return l === 1 && s.push({ cx: c, cy: c }), l === 2 && (s.push({ cx: c - e, cy: c - e }), s.push({ cx: c + e, cy: c + e })), l === 3 && (s.push({ cx: c - e, cy: c - e }), s.push({ cx: c, cy: c }), s.push({ cx: c + e, cy: c + e })), l === 4 && (s.push({ cx: c - e, cy: c - e }), s.push({ cx: c + e, cy: c - e }), s.push({ cx: c - e, cy: c + e }), s.push({ cx: c + e, cy: c + e })), l === 5 && (s.push({ cx: c - e, cy: c - e }), s.push({ cx: c + e, cy: c - e }), s.push({ cx: c, cy: c }), s.push({ cx: c - e, cy: c + e }), s.push({ cx: c + e, cy: c + e })), l === 6 && (s.push({ cx: c - e, cy: c - e }), s.push({ cx: c + e, cy: c - e }), s.push({ cx: c - e, cy: c }), s.push({ cx: c + e, cy: c }), s.push({ cx: c - e, cy: c + e }), s.push({ cx: c + e, cy: c + e })), /* @__PURE__ */ t.jsx(t.Fragment, { children: s.map((r, i) => /* @__PURE__ */ t.jsx(T2, { cx: Z1 + r.cx, cy: Z1 + r.cy }, i)) });
}
const O = 32, n2 = 12, s2 = 24;
function G2({ config: l, width: n = L2, className: c }) {
  const e = Math.max(1, Math.min(6, l.value)), s = n - Z1 * 2, r = l.number_options ?? [], i = r.length > 0, o = i ? r.length * O + (r.length - 1) * n2 : 0, h = i ? n + s2 + O : n, p = Math.max(n, o), d = i ? (p - n) / 2 : 0;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: h,
      height: p,
      viewBox: `0 0 ${h} ${p}`,
      className: c,
      "aria-hidden": !0,
      children: [
        /* @__PURE__ */ t.jsxs("g", { transform: `translate(0, ${d})`, children: [
          /* @__PURE__ */ t.jsx(
            "rect",
            {
              x: 2,
              y: 2,
              width: n - 4,
              height: n - 4,
              rx: 10,
              fill: "var(--sp-visual-bg, #fefce8)",
              stroke: "var(--sp-visual-stroke, #374151)",
              strokeWidth: "2"
            }
          ),
          /* @__PURE__ */ t.jsx($2, { value: e, size: s })
        ] }),
        i && /* @__PURE__ */ t.jsx("g", { transform: `translate(${n + s2}, ${(p - o) / 2})`, children: r.map((f, g) => {
          const v = g * (O + n2);
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx(
              "rect",
              {
                x: 0,
                y: v,
                width: O,
                height: O,
                rx: 4,
                fill: "var(--sp-visual-bg, #fff)",
                stroke: "var(--sp-visual-stroke, #374151)",
                strokeWidth: "2"
              }
            ),
            /* @__PURE__ */ t.jsx(
              "text",
              {
                x: O / 2,
                y: v + O / 2 + 5,
                textAnchor: "middle",
                fill: "var(--sp-visual-text, #111827)",
                style: { fontSize: 16, fontFamily: "system-ui, sans-serif", fontWeight: 600 },
                children: f
              }
            )
          ] }, f);
        }) })
      ]
    }
  );
}
const H2 = 320, h1 = 14, U2 = 8, I2 = 24, X1 = 8;
function W2({
  label: l,
  coins: n,
  x: c,
  y: e
}) {
  let s = c;
  return /* @__PURE__ */ t.jsxs("g", { children: [
    /* @__PURE__ */ t.jsx(
      "text",
      {
        x: c,
        y: e - 4,
        fill: "var(--sp-visual-text, #111827)",
        style: { fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" },
        children: l
      }
    ),
    n.map((r, i) => {
      const o = { cx: s, cy: e + h1 + X1 };
      return s += h1 * 2 + U2, /* @__PURE__ */ t.jsxs("g", { children: [
        /* @__PURE__ */ t.jsx(
          "circle",
          {
            cx: o.cx,
            cy: o.cy,
            r: h1,
            fill: "var(--sp-visual-coin, #fcd34d)",
            stroke: "var(--sp-visual-stroke, #b45309)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ t.jsx(
          "text",
          {
            x: o.cx,
            y: o.cy + 4,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #111827)",
            style: { fontSize: 10, fontFamily: "system-ui, sans-serif" },
            children: r
          }
        )
      ] }, `${r}-${i}`);
    })
  ] });
}
function O2({ config: l, width: n = H2, className: c }) {
  const e = Object.keys(l.sets), s = h1 * 2 + X1 + 20 + I2, r = e.length * s + 16;
  return /* @__PURE__ */ t.jsx(
    "svg",
    {
      width: n,
      height: r,
      viewBox: `0 0 ${n} ${r}`,
      className: c,
      "aria-hidden": !0,
      children: e.map((i, o) => /* @__PURE__ */ t.jsx(
        W2,
        {
          label: i,
          coins: l.sets[i],
          x: 24,
          y: 24 + o * s + h1 + X1 + 14
        },
        i
      ))
    }
  );
}
const G = 32, P = 44, c2 = 20, j1 = 200, P2 = 72, q1 = 72, k1 = G, b1 = k1 + j1 + P2, r2 = 18, Y2 = b1 + q1 + G;
function N2({ config: l, width: n = Y2, className: c }) {
  const { left: e, right: s, correct: r, example_pair: i, layout: o } = l, h = o === "compact" || o !== "spaced" && e.length === s.length, p = h ? e.length : s.length, d = P + c2, f = G + p * d - c2 + G, g = (v) => h ? v : v * 2;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: n,
      height: f,
      viewBox: `0 0 ${n} ${f}`,
      className: c,
      "aria-hidden": !0,
      children: [
        e.map((v, x) => {
          const m = g(x), u = G + m * d;
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx(
              "rect",
              {
                x: k1,
                y: u,
                width: j1,
                height: P,
                rx: 6,
                fill: "var(--sp-visual-bg, #fff)",
                stroke: "var(--sp-visual-stroke, #374151)",
                strokeWidth: "2"
              }
            ),
            /* @__PURE__ */ t.jsx(
              "text",
              {
                x: k1 + j1 / 2,
                y: u + P / 2 + 6,
                textAnchor: "middle",
                fill: "var(--sp-visual-text, #111827)",
                style: { fontSize: r2, fontFamily: "system-ui, sans-serif" },
                children: v
              }
            )
          ] }, `l-${x}`);
        }),
        s.map((v, x) => {
          const m = G + x * d;
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx(
              "rect",
              {
                x: b1,
                y: m,
                width: q1,
                height: P,
                rx: 6,
                fill: "var(--sp-visual-bg, #fff)",
                stroke: "var(--sp-visual-stroke, #374151)",
                strokeWidth: "2"
              }
            ),
            /* @__PURE__ */ t.jsx(
              "text",
              {
                x: b1 + q1 / 2,
                y: m + P / 2 + 6,
                textAnchor: "middle",
                fill: "var(--sp-visual-text, #111827)",
                style: { fontSize: r2, fontFamily: "system-ui, sans-serif", fontWeight: 600 },
                children: v
              }
            )
          ] }, `r-${x}`);
        }),
        i != null && r[i] != null && (() => {
          const v = e.indexOf(i), x = r[i], m = s.indexOf(x);
          if (v === -1 || m === -1) return null;
          const u = G + g(v) * d + P / 2, y = G + m * d + P / 2, w = k1 + j1, F = b1;
          return /* @__PURE__ */ t.jsx(
            "line",
            {
              x1: w,
              y1: u,
              x2: F,
              y2: y,
              stroke: "var(--sp-visual-stroke, #6b7280)",
              strokeWidth: "2",
              strokeDasharray: "8 5"
            }
          );
        })()
      ]
    }
  );
}
const Z2 = 320, s1 = 48, X2 = 32, q2 = 8, i2 = 12, y1 = 12;
function Q2({ config: l, width: n = Z2, className: c }) {
  const { title: e, x_label: s, y_label: r, scale: i, bars: o } = l, h = n - s1 - 24, p = 120, d = p + X2 + 40 + q2 * 2, f = Math.max(8, (h - (o.length - 1) * i2) / o.length), g = Math.max(...o.map((x) => x.value), i), v = g > 0 ? p / g : 0;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: n,
      height: d,
      viewBox: `0 0 ${n} ${d}`,
      className: c,
      "aria-hidden": !0,
      children: [
        /* @__PURE__ */ t.jsx(
          "text",
          {
            x: n / 2,
            y: 16,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #111827)",
            style: { fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" },
            children: e
          }
        ),
        /* @__PURE__ */ t.jsx(
          "text",
          {
            x: n / 2,
            y: d - 8,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #6b7280)",
            style: { fontSize: y1, fontFamily: "system-ui, sans-serif" },
            children: s
          }
        ),
        /* @__PURE__ */ t.jsx(
          "text",
          {
            x: 16,
            y: 40 + p / 2,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #6b7280)",
            style: { fontSize: y1, fontFamily: "system-ui, sans-serif" },
            transform: `rotate(-90, 16, ${40 + p / 2})`,
            children: r
          }
        ),
        [0, i].filter((x) => x <= g).map((x) => /* @__PURE__ */ t.jsxs("g", { children: [
          /* @__PURE__ */ t.jsx(
            "line",
            {
              x1: s1 - 4,
              y1: 40 + p - x * v,
              x2: s1,
              y2: 40 + p - x * v,
              stroke: "var(--sp-visual-stroke, #9ca3af)",
              strokeWidth: "1"
            }
          ),
          /* @__PURE__ */ t.jsx(
            "text",
            {
              x: s1 - 8,
              y: 40 + p - x * v + 4,
              textAnchor: "end",
              fill: "var(--sp-visual-text, #374151)",
              style: { fontSize: y1, fontFamily: "system-ui, sans-serif" },
              children: x
            }
          )
        ] }, x)),
        o.map((x, m) => {
          const u = s1 + m * (f + i2), y = x.given ? x.value * v : 0, w = 40 + p - y;
          return /* @__PURE__ */ t.jsxs("g", { children: [
            x.given ? /* @__PURE__ */ t.jsx(
              "rect",
              {
                x: u,
                y: w,
                width: f,
                height: y,
                fill: "var(--sp-visual-fill, #3b82f6)",
                stroke: "var(--sp-visual-stroke, #1d4ed8)",
                strokeWidth: "1"
              }
            ) : /* @__PURE__ */ t.jsx(
              "rect",
              {
                x: u,
                y: 40,
                width: f,
                height: p,
                fill: "var(--sp-visual-bg, #f3f4f6)",
                stroke: "var(--sp-visual-stroke, #d1d5db)",
                strokeWidth: "1",
                strokeDasharray: "4 2"
              }
            ),
            /* @__PURE__ */ t.jsx(
              "text",
              {
                x: u + f / 2,
                y: 40 + p + 16,
                textAnchor: "middle",
                fill: "var(--sp-visual-text, #374151)",
                style: { fontSize: y1, fontFamily: "system-ui, sans-serif" },
                children: x.label
              }
            )
          ] }, m);
        })
      ]
    }
  );
}
const T = 24, z1 = 56, G1 = 24, o2 = 12;
function J2({ config: l, width: n, className: c }) {
  const { title: e, rows: s } = l, i = Math.max(...s.map((d) => d.value), 1), o = z1 + i * T + 24, h = G1 + s.length * T + 24, p = n != null ? Math.max(n, o) : o;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: p,
      height: h,
      viewBox: `0 0 ${p} ${h}`,
      className: c,
      "aria-hidden": !0,
      children: [
        e && /* @__PURE__ */ t.jsx(
          "text",
          {
            x: p / 2,
            y: 14,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #111827)",
            style: { fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" },
            children: e
          }
        ),
        Array.from({ length: i }, (d, f) => f + 1).map((d) => /* @__PURE__ */ t.jsx(
          "text",
          {
            x: z1 + (d - 0.5) * T,
            y: e ? G1 + 16 : 16,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #6b7280)",
            style: { fontSize: o2, fontFamily: "system-ui, sans-serif" },
            children: d
          },
          d
        )),
        s.map((d, f) => {
          const g = (e ? G1 : 0) + 24 + f * T, x = !d.given ? 0 : d.value;
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx(
              "text",
              {
                x: z1 - 8,
                y: g + T / 2 + 4,
                textAnchor: "end",
                fill: "var(--sp-visual-text, #374151)",
                style: { fontSize: o2, fontFamily: "system-ui, sans-serif" },
                children: d.label
              }
            ),
            Array.from({ length: i }, (m, u) => {
              const y = u < x, w = z1 + u * T;
              return /* @__PURE__ */ t.jsx(
                "rect",
                {
                  x: w + 1,
                  y: g + 1,
                  width: T - 2,
                  height: T - 2,
                  fill: y ? "var(--sp-visual-fill, #3b82f6)" : "var(--sp-visual-bg, #f3f4f6)",
                  stroke: "var(--sp-visual-stroke, #d1d5db)",
                  strokeWidth: "1"
                },
                u
              );
            })
          ] }, f);
        })
      ]
    }
  );
}
const N = 24, C1 = 40, K2 = 28, t4 = 20, $ = 100, t1 = 140, E1 = 56, C2 = 100, c1 = 18, r1 = 14;
function e4({ value: l, x: n, y: c, given: e }) {
  const s = e ? "var(--sp-visual-stroke, #374151)" : "var(--sp-visual-stroke, #d1d5db)", r = [], i = 5;
  let o = n;
  const h = e ? l : 0, p = Math.floor(h / 5), d = h % 5;
  for (let f = 0; f < p; f++) {
    for (let g = 0; g < 4; g++)
      r.push(
        /* @__PURE__ */ t.jsx("line", { x1: o + g * i, y1: c, x2: o + g * i, y2: c - c1, stroke: s, strokeWidth: "2" }, `${f}-v-${g}`)
      );
    r.push(
      /* @__PURE__ */ t.jsx("line", { x1: o - 2, y1: c - c1, x2: o + 4 * i + 2, y2: c, stroke: s, strokeWidth: "2" }, `${f}-d`)
    ), o += 4 * i + 10;
  }
  for (let f = 0; f < d; f++)
    r.push(
      /* @__PURE__ */ t.jsx("line", { x1: o + f * i, y1: c, x2: o + f * i, y2: c - c1, stroke: s, strokeWidth: "2" }, `r-${f}`)
    );
  return e || r.push(
    /* @__PURE__ */ t.jsx("rect", { x: n, y: c - c1, width: C2, height: c1 + 4, fill: "none", stroke: "var(--sp-visual-stroke, #d1d5db)", strokeWidth: "1", strokeDasharray: "4 2" }, "blank")
  ), /* @__PURE__ */ t.jsx("g", { children: r });
}
const l4 = N + $ + t1 + E1 + N, a2 = 14, h2 = N - 6;
function n4({ config: l, width: n = l4, className: c }) {
  const { title: e, rows: s } = l, r = e ? h2 + a2 + t4 : K2, i = N + r + s.length * C1 + N;
  return /* @__PURE__ */ t.jsxs("svg", { width: n, height: i, viewBox: `0 0 ${n} ${i}`, className: c, "aria-hidden": !0, children: [
    e && /* @__PURE__ */ t.jsx("text", { x: n / 2, y: h2, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: a2, fontWeight: 600, fontFamily: "system-ui, sans-serif" }, children: e }),
    /* @__PURE__ */ t.jsx("text", { x: $ / 2, y: r - 8, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: r1, fontWeight: 600, fontFamily: "system-ui, sans-serif" }, children: "Object" }),
    /* @__PURE__ */ t.jsx("text", { x: $ + t1 / 2, y: r - 8, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: r1, fontWeight: 600, fontFamily: "system-ui, sans-serif" }, children: "Tallies" }),
    /* @__PURE__ */ t.jsx("text", { x: $ + t1 + E1 / 2, y: r - 8, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: r1, fontWeight: 600, fontFamily: "system-ui, sans-serif" }, children: "Count" }),
    /* @__PURE__ */ t.jsx("line", { x1: N, y1: r, x2: n - N, y2: r, stroke: "var(--sp-visual-stroke, #374151)", strokeWidth: "1" }),
    s.map((o, h) => {
      const p = r + 12 + h * C1, d = p + C1 / 2 + 4, f = p + C1 / 2 + 4;
      return /* @__PURE__ */ t.jsxs("g", { children: [
        /* @__PURE__ */ t.jsx("text", { x: $ / 2, y: d, textAnchor: "middle", fill: "var(--sp-visual-text, #374151)", style: { fontSize: r1, fontFamily: "system-ui, sans-serif" }, children: o.label }),
        /* @__PURE__ */ t.jsx(e4, { value: o.value, x: $ + (t1 - C2) / 2, y: f, given: o.blank !== "tally" }),
        o.blank !== "count" ? /* @__PURE__ */ t.jsx("text", { x: $ + t1 + E1 / 2, y: d, textAnchor: "middle", fill: "var(--sp-visual-text, #374151)", style: { fontSize: r1, fontFamily: "system-ui, sans-serif" }, children: o.value }) : /* @__PURE__ */ t.jsx("rect", { x: $ + t1 + E1 / 2 - 14, y: d - 12, width: 28, height: 20, fill: "none", stroke: "var(--sp-visual-stroke, #d1d5db)", strokeWidth: "1", strokeDasharray: "3 2" })
      ] }, h);
    })
  ] });
}
const S = 36, d2 = 8, s4 = 14, A1 = 16, p2 = 44, Q = 24, i1 = 12;
function c4({ config: l, width: n, className: c }) {
  const { options: e, rows: s } = l;
  s.some((v) => v.type === "operator");
  const r = S + s4, i = p2 + s.length * r + 16, o = e.length * S + (e.length - 1) * d2, h = 36, p = (v) => {
    const x = h + Q + S + Q + h;
    return v.type === "operator" ? x + i1 + 16 + i1 + h : x;
  }, d = s.length ? Math.max(...s.map(p)) : 0, f = n ?? Math.max(280, Math.max(o, d) + 48), g = (f - o) / 2;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: f,
      height: i,
      viewBox: `0 0 ${f} ${i}`,
      className: c,
      "aria-hidden": !0,
      children: [
        e.map((v, x) => {
          const m = g + x * (S + d2);
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx(
              "rect",
              {
                x: m,
                y: 8,
                width: S,
                height: S,
                fill: "var(--sp-visual-bg, #f9fafb)",
                stroke: "var(--sp-visual-stroke, #374151)",
                strokeWidth: "1.5"
              }
            ),
            /* @__PURE__ */ t.jsx(
              "text",
              {
                x: m + S / 2,
                y: 8 + S / 2 + 5,
                textAnchor: "middle",
                fill: "var(--sp-visual-text, #111827)",
                style: { fontSize: 18, fontWeight: 600, fontFamily: "system-ui, sans-serif" },
                children: v
              }
            )
          ] }, x);
        }),
        s.map((v, x) => {
          const m = p2 + 8 + x * r, u = v.type === "operator", y = p(v), w = (f - y) / 2, F = w + h + Q, _ = w + h / 2, k = F + S + Q + h / 2, D = h + Q + S + Q + h, U = u ? w + D + i1 + 8 : 0, I = u ? w + D + i1 + 16 + i1 + h / 2 : 0;
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx("text", { x: _, y: m + S / 2 + 5, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: A1, fontFamily: "system-ui, sans-serif" }, children: v.left }),
            /* @__PURE__ */ t.jsx(
              "rect",
              {
                x: F,
                y: m,
                width: S,
                height: S,
                fill: "none",
                stroke: "var(--sp-visual-stroke, #9ca3af)",
                strokeWidth: "1.5",
                strokeDasharray: "4 2"
              }
            ),
            /* @__PURE__ */ t.jsx("text", { x: k, y: m + S / 2 + 5, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: A1, fontFamily: "system-ui, sans-serif" }, children: v.right }),
            u && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
              /* @__PURE__ */ t.jsx("text", { x: U, y: m + S / 2 + 5, textAnchor: "middle", fill: "var(--sp-visual-text, #6b7280)", style: { fontSize: A1, fontFamily: "system-ui, sans-serif" }, children: "=" }),
              /* @__PURE__ */ t.jsx("text", { x: I, y: m + S / 2 + 5, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: A1, fontFamily: "system-ui, sans-serif" }, children: v.result })
            ] })
          ] }, x);
        })
      ]
    }
  );
}
const Z = 28, d1 = 36, H1 = 8, f2 = 6, A2 = 18;
function r4(l, n, c) {
  const e = String(l).split(""), s = [];
  return e.forEach((r, i) => {
    const o = n + i * (Z + 2);
    s.push(
      /* @__PURE__ */ t.jsxs("g", { children: [
        /* @__PURE__ */ t.jsx(
          "rect",
          {
            x: o,
            y: c,
            width: Z,
            height: d1,
            fill: "var(--sp-visual-bg, #fff)",
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ t.jsx(
          "text",
          {
            x: o + Z / 2,
            y: c + d1 / 2 + 5,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #111827)",
            style: { fontSize: A2, fontFamily: "system-ui, sans-serif", fontWeight: 600 },
            children: r
          }
        )
      ] }, i)
    );
  }), s;
}
function i4(l, n, c) {
  const e = l ?? 1, s = [];
  for (let r = 0; r < e; r++) {
    const i = n + r * (Z + 2);
    s.push(
      /* @__PURE__ */ t.jsx(
        "rect",
        {
          x: i,
          y: c,
          width: Z,
          height: d1,
          fill: "none",
          stroke: "var(--sp-visual-stroke, #9ca3af)",
          strokeWidth: "1.5",
          strokeDasharray: "4 2"
        },
        r
      )
    );
  }
  return s;
}
function o4({ config: l, width: n, className: c }) {
  const { segments: e } = l;
  let s = 24;
  const r = 24, i = [];
  e.forEach((p, d) => {
    if (p.type === "number")
      r4(p.value, s, r).forEach((f, g) => i.push(/* @__PURE__ */ t.jsx("g", { children: f }, `n-${d}-${g}`))), s += String(p.value).length * (Z + 2) + H1;
    else if (p.type === "blank") {
      const f = p.digits ?? 1;
      i4(f, s, r).forEach((g, v) => i.push(/* @__PURE__ */ t.jsx("g", { children: g }, `b-${d}-${v}`))), s += f * (Z + 2) + H1;
    } else
      i.push(
        /* @__PURE__ */ t.jsx(
          "text",
          {
            x: s + f2,
            y: r + d1 / 2 + 5,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #374151)",
            style: { fontSize: A2, fontFamily: "system-ui, sans-serif" },
            children: p.char
          },
          `s-${d}`
        )
      ), s += f2 * 2 + 16 + H1;
  });
  const o = n ?? s + 24, h = r + d1 + 24;
  return /* @__PURE__ */ t.jsx("svg", { width: o, height: h, viewBox: `0 0 ${o} ${h}`, className: c, "aria-hidden": !0, children: i });
}
const a4 = 16, U1 = 12, h4 = 16, d4 = 16;
function p4({ config: l, width: n, className: c }) {
  const { options: e } = l, s = [];
  let r = 24;
  const i = 24;
  e.forEach((p) => {
    const d = Math.max(60, p.length * 12 + a4 * 2);
    s.push({ x: r, w: d }), r += d + h4;
  });
  const o = n ?? r + 24, h = i + 32 + U1 * 2;
  return /* @__PURE__ */ t.jsx("svg", { width: o, height: h, viewBox: `0 0 ${o} ${h}`, className: c, "aria-hidden": !0, children: e.map((p, d) => /* @__PURE__ */ t.jsxs("g", { children: [
    /* @__PURE__ */ t.jsx(
      "rect",
      {
        x: s[d].x,
        y: i,
        width: s[d].w,
        height: 28 + U1 * 2,
        rx: 6,
        fill: "var(--sp-visual-bg, #fff)",
        stroke: "var(--sp-visual-stroke, #374151)",
        strokeWidth: "2"
      }
    ),
    /* @__PURE__ */ t.jsx(
      "text",
      {
        x: s[d].x + s[d].w / 2,
        y: i + 14 + U1 + 5,
        textAnchor: "middle",
        fill: "var(--sp-visual-text, #111827)",
        style: { fontSize: d4, fontFamily: "system-ui, sans-serif" },
        children: p
      }
    )
  ] }, d)) });
}
const x2 = 24, F2 = 14, f4 = 18, I1 = 24, W1 = 32 + F2 * 2;
function x4({ config: l, width: n, className: c }) {
  const { items: e, title: s } = l, r = e.map((v) => Math.max(44, String(v).length * 16 + F2 * 2)), i = r.reduce((v, x) => v + x, 0) + (e.length - 1) * x2, o = n ?? Math.max(320, i + I1 * 2);
  let p = (o - i) / 2, d = I1;
  const f = [];
  s && (f.push(
    /* @__PURE__ */ t.jsx("text", { x: o / 2, y: d + 16, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" }, children: s }, "title")
  ), d += 36), e.forEach((v, x) => {
    const m = String(v), u = r[x];
    f.push(
      /* @__PURE__ */ t.jsxs("g", { children: [
        /* @__PURE__ */ t.jsx(
          "rect",
          {
            x: p,
            y: d,
            width: u,
            height: W1,
            rx: 6,
            fill: "var(--sp-visual-bg, #f9fafb)",
            stroke: "var(--sp-visual-stroke, #d1d5db)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ t.jsx(
          "text",
          {
            x: p + u / 2,
            y: d + W1 / 2 + 5,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #111827)",
            style: { fontSize: f4, fontFamily: "system-ui, sans-serif" },
            children: m
          }
        )
      ] }, x)
    ), p += u + x2;
  });
  const g = d + W1 + I1;
  return /* @__PURE__ */ t.jsx("svg", { width: o, height: g, viewBox: `0 0 ${o} ${g}`, className: c, "aria-hidden": !0, children: f });
}
const L1 = 24, O1 = 32, P1 = 22, J = 36, Y = 40, j = 32, v4 = 12, o1 = 16;
function v2({
  items: l,
  title: n,
  rule: c,
  totalW: e
}) {
  const s = [];
  let r = L1;
  n && (s.push(
    /* @__PURE__ */ t.jsx("text", { x: e / 2, y: r + 16, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" }, children: n }, "title")
  ), r += 36), c && (s.push(
    /* @__PURE__ */ t.jsx("text", { x: e / 2, y: r + 12, textAnchor: "middle", fill: "var(--sp-visual-text, #6b7280)", style: { fontSize: 12, fontFamily: "system-ui, sans-serif" }, children: c }, "rule")
  ), r += 24);
  const i = l.reduce((h, p) => h + String(p).length * 14 + O1, 0) - O1;
  let o = (e - i) / 2;
  return l.forEach((h, p) => {
    const d = String(h), f = d.length * 14;
    s.push(
      /* @__PURE__ */ t.jsx("text", { x: o + f / 2, y: r + P1 / 2 + 6, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: P1, fontFamily: "system-ui, sans-serif" }, children: d }, p)
    ), o += f + O1;
  }), { elements: s, height: r + P1 + L1 };
}
function g4({
  rows: l,
  title: n,
  totalW: c
}) {
  const e = Y, s = v4, r = 20, i = 16, o = e + s + r + s + e + s + i + s + e, h = (c - o) / 2, p = h, d = h + e + s, f = h + e + s + r + s, g = h + 2 * e + 2 * s + r, v = h + 2 * e + 2 * s + r + i + s, x = [];
  let m = L1;
  n && (x.push(
    /* @__PURE__ */ t.jsx("text", { x: c / 2, y: m + 16, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" }, children: n }, "title")
  ), m += 36), l.forEach((y, w) => {
    const F = m + w * J, _ = F + J / 2 + 4;
    y.first !== null ? x.push(/* @__PURE__ */ t.jsx("text", { x: p + Y / 2, y: _, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: o1, fontFamily: "system-ui, sans-serif" }, children: y.first }, `${w}-first`)) : x.push(/* @__PURE__ */ t.jsx("rect", { x: p + (Y - j) / 2, y: F + (J - j) / 2, width: j, height: j, fill: "none", stroke: "var(--sp-visual-stroke, #9ca3af)", strokeWidth: "1.5", strokeDasharray: "4 2" }, `${w}-first`)), x.push(/* @__PURE__ */ t.jsx("text", { x: d + 12, y: _, textAnchor: "middle", fill: "var(--sp-visual-text, #374151)", style: { fontSize: o1, fontFamily: "system-ui, sans-serif" }, children: y.op }, `${w}-op`)), y.second !== null ? x.push(/* @__PURE__ */ t.jsx("text", { x: f + Y / 2, y: _, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: o1, fontFamily: "system-ui, sans-serif" }, children: y.second }, `${w}-second`)) : x.push(/* @__PURE__ */ t.jsx("rect", { x: f + (Y - j) / 2, y: F + (J - j) / 2, width: j, height: j, fill: "none", stroke: "var(--sp-visual-stroke, #9ca3af)", strokeWidth: "1.5", strokeDasharray: "4 2" }, `${w}-second`)), x.push(/* @__PURE__ */ t.jsx("text", { x: g + 8, y: _, textAnchor: "middle", fill: "var(--sp-visual-text, #6b7280)", style: { fontSize: o1, fontFamily: "system-ui, sans-serif" }, children: "=" }, `${w}-eq`)), y.result !== null ? x.push(/* @__PURE__ */ t.jsx("text", { x: v + Y / 2, y: _, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: o1, fontFamily: "system-ui, sans-serif" }, children: y.result }, `${w}-result`)) : x.push(/* @__PURE__ */ t.jsx("rect", { x: v + (Y - j) / 2, y: F + (J - j) / 2, width: j, height: j, fill: "none", stroke: "var(--sp-visual-stroke, #9ca3af)", strokeWidth: "1.5", strokeDasharray: "4 2" }, `${w}-result`));
  });
  const u = m + l.length * J + L1;
  return { elements: x, height: u };
}
function m4({ config: l, width: n, className: c }) {
  const e = l.variant === "sequence", s = l.variant === "equations", r = n ?? 420;
  let i;
  if (s && "rows" in l)
    i = g4({ rows: l.rows, title: l.title, totalW: r });
  else if (e && "items" in l)
    i = v2({ items: l.items, title: l.title, rule: l.rule, totalW: r });
  else {
    const o = l;
    i = v2({ items: o.items ?? [], title: o.title, rule: o.rule, totalW: r });
  }
  return /* @__PURE__ */ t.jsx("svg", { width: r, height: i.height, viewBox: `0 0 ${r} ${i.height}`, className: c, "aria-hidden": !0, children: i.elements });
}
const u4 = [
  // Containers & packages
  "tin_can",
  "cereal_box",
  "bag",
  "box",
  // cuboid for shape_classify; bag is visual-only
  // Party & treats
  "party_hat",
  "balloon",
  "cupcake",
  "cookie",
  // Fruit & small items
  "apple",
  "orange",
  "marble",
  "banana",
  "pear",
  "strawberry",
  // Nature & sky
  "flower",
  "sun",
  "moon",
  "cloud",
  "tree",
  "star",
  // Animals
  "duck",
  "bird",
  "fish",
  "cat",
  "dog",
  // Vehicles
  "boat",
  "airplane",
  "toy_car",
  "bicycle",
  // Furniture
  "chair",
  "table",
  // Dining
  "cup",
  "bottle",
  // Office / school
  "book",
  "pencil",
  // Keys & lock
  "key",
  "lock",
  // Electronics
  "phone",
  "laptop",
  "camera",
  "clock",
  "lightbulb",
  // Music
  "guitar",
  // Mail & gifts
  "envelope",
  "gift",
  // Outdoor / misc
  "umbrella",
  "flag",
  "button",
  // Buildings
  "house"
], M4 = `<?xml version="1.0" encoding="iso-8859-1"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 viewBox="0 0 512 512" xml:space="preserve">\r
<path style="fill:#1565C0;" d="M375.6,484L136,485.6v-98.4c72.4,0,139.2-59.2,139.2-131.6S208.4,124.4,136,124V28h240v456h-1.2\r
	C375.2,484,375.6,484,375.6,484z"/>\r
<path style="fill:#E0E0E0;" d="M364.4,4c0,12,11.2,23.6,11.2,23.6h-240c0,0,11.6-11.6,11.6-23.6H364.4z"/>\r
<path style="fill:#E53935;" d="M136,124.4c72.4,0.4,139.2,59.2,139.2,131.6S208.4,387.2,136,387.6V364\r
	c59.6-0.4,114.4-48.4,114.4-108c0-37.2-21.6-70-52-89.6l-62,196.4V148v-23.6H136z"/>\r
<path style="fill:#FFFFFF;" d="M198,166.4c30.8,19.6,52,52.4,52,89.6c0,59.6-54.8,107.6-114.4,108v-1.2L198,166.4z"/>\r
<path style="fill:#E0E0E0;" d="M136,484h238.8c-2.4,4-10.8,16-10.8,24H146.8C147.2,496,135.6,484,136,484L136,484L136,484z"/>\r
<path d="M136,488c-2.4,0-4-1.6-4-4V384c0-2.4,1.6-4,4-4s4,1.6,4,4v100C140,486.4,138.4,488,136,488z"/>\r
<path d="M376,490c-2.4,0-4-1.6-4-4V32H140v92c0,2.4-1.6,4-4,4s-4-1.6-4-4V28c0-2.4,1.6-4,4-4h240c2.4,0,4,1.6,4,4v458\r
	C380,488,378.4,490,376,490z"/>\r
<path d="M375.6,31.6c-1.2,0-2-0.4-2.8-1.2c-0.4-0.4-10.4-10.8-12-22.4H151.2c-2,12-12,22-12.4,22.4c-1.6,1.6-4,1.6-5.6,0\r
	s-1.6-4,0-5.6c0,0,10.4-10.8,10.4-20.8c0-2.4,1.6-4,4-4h216.8c2.4,0,4,1.6,4,4c0,8.4,7.2,18,10.4,20.8c1.6,1.6,1.6,4,0,5.6\r
	C377.6,31.6,376.8,31.6,375.6,31.6z"/>\r
<path d="M364.4,512H147.6c-2.4,0-4-1.6-4-4c0-10-10.4-20.4-10.4-20.4c-1.6-1.6-1.6-4,0-5.6s4-1.6,5.6,0c0.4,0.4,10.4,10.4,12.4,22\r
	h209.6c2-10,11.2-21.6,11.2-21.6c0.8-1.2,2.4-2,4-1.6s2.8,1.2,3.6,2.8c0.8,2,0,4.4-2,5.2c0,0,0,0-0.4,0c-3.6,4.8-8.8,13.6-8.8,19.2\r
	C368.4,510.4,366.4,512,364.4,512z"/>\r
<path d="M136,390c-2.4,0-4-1.6-4-4s1.6-4,4-4c73.2,0,135.2-57.6,135.2-126s-62-126-135.2-126l0,0c-2.4,0-4-1.6-4-4s1.6-4,4-4\r
	c77.6,0,143.2,61.2,143.2,134C279.2,328.4,213.6,390,136,390z"/>\r
<path d="M136,366c-2.4,0-4-1.6-4-4s1.6-4,4-4c58.8,0,110.4-48.4,110.4-103.6c0-33.6-18.8-65.6-50.4-85.6c-2-1.2-2.4-3.6-1.2-5.6\r
	s3.6-2.4,5.6-1.2c33.6,21.2,54,56,54,92.4C254.4,314.8,200,366,136,366z"/>\r
<path d="M176.4,157.6c-0.4,0-0.8,0-1.6-0.4c-6.4-2.4-13.2-3.2-20.4-4c-6.4-0.8-12.8-1.6-19.2-3.2c-2-0.4-3.2-2-3.2-4\r
	c0-2.4,1.6-4,4-4l0,0l0,0l0,0l0,0l0,0l0,0l0,0c0.4,0,0.8,0,1.2,0c6,1.6,12.4,2.4,18.4,3.2c7.2,0.8,15.2,1.6,22.4,4.4\r
	c2,0.8,3.2,3.2,2.4,5.2C179.6,156.4,178,157.6,176.4,157.6z"/>\r
<path d="M136,390c-2.4,0-4-1.6-4-4V124c0-2.4,1.6-4,4-4s4,1.6,4,4v262C140,388,138.4,390,136,390z"/>\r
<path d="M136,489.6c-2.4,0-4-1.6-4-4s1.6-4,4-4l238.8-0.8l0,0c2.4,0,4,1.6,4,4s-1.6,4-4,4L136,489.6L136,489.6z"/>\r
</svg>`, w4 = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<path style="fill:#BC9A5E;" d="M473.816,30.118v94.655L38.339,141.601c0.055-7.694-0.15-14.211-0.153-22.206l0,0
	c0.083-61.212,49.73-110.79,110.942-110.79H452.17C464.124,8.605,473.816,18.236,473.816,30.118z"/>
<path style="fill:#916D42;" d="M466.42,25.105c3.044-2.29,7.396-0.118,7.396,3.69v13.303v82.674v287.015
	c0,8.507-7.368,15.407-13.983,20.069l-93,68.444l8.103-391.663l-4.212-11.535L466.42,25.105z"/>
<path style="fill:#CAA661;" d="M80.891,503.395c-23.399,0-42.553-19.091-42.553-42.425V122.183
	c0-23.335,19.153-42.427,42.553-42.427h268.997c23.408,0,42.556,19.092,42.556,42.427V460.97c0,23.335-19.147,42.425-42.556,42.425
	H80.891L80.891,503.395z"/>
<path style="fill:#FF4328;" d="M215.393,379.514c-59.557,0-108.277-48.579-108.277-107.949V235.58h216.55v35.984
	C323.666,330.935,274.941,379.514,215.393,379.514L215.393,379.514L215.393,379.514z"/>
<path style="fill:#7A1700;" d="M221.186,331.373c-10.475,6.028-23.988,2.418-30.033-8.023l-9.123-15.75
	c-4.489-7.75-3.641-17.164,1.371-23.97l14.852-8.694c8.528-1.077,17.305,2.887,21.857,10.747l9.123,15.749
	C235.275,311.874,231.654,325.345,221.186,331.373z"/>
<path d="M482.144,26.106C480.166,11.389,467.483,0,452.17,0H149.128C83.301,0,29.671,53.556,29.58,119.399
	c0.001,3.593,0.043,6.89,0.084,10.129c0.029,2.26,0.055,4.454,0.068,6.682v324.76c0,28.139,22.95,51.03,51.158,51.03h268.997
	c6.22,0,12.183-1.115,17.703-3.153c1.541-0.137,3.048-0.663,4.343-1.615l0.951-0.7c5.153-2.599,9.805-6.038,13.78-10.141
	l78.2-57.554c11.65-8.231,17.555-17.331,17.555-27.049V30.118v-1.322C482.421,27.874,482.325,26.974,482.144,26.106z M149.128,17.21
	H452.17c2.744,0,5.285,0.852,7.386,2.29l-80.655,60.683c-8.251-5.689-18.246-9.031-29.013-9.031H80.891
	c-9.139,0-17.717,2.414-25.149,6.619C71.761,42.116,107.6,17.21,149.128,17.21z M80.891,494.79
	c-18.719,0-33.948-15.172-33.948-33.82V122.183c0-18.649,15.229-33.821,33.948-33.821h268.997c18.72,0,33.951,15.172,33.951,33.821
	V460.97c0,18.648-15.23,33.82-33.951,33.82H80.891z M465.211,411.789c0,3.709-3.67,8.338-10.335,13.035
	c-0.048,0.034-0.096,0.069-0.144,0.103l-53.822,39.611c0.083-1.18,0.139-2.367,0.139-3.568V122.183
	c0-11.133-3.603-21.436-9.693-29.835l73.855-55.566V411.789z M333.678,421.822c0,4.752-3.852,8.605-8.605,8.605H105.709
	c-4.753,0-8.605-3.853-8.605-8.605c0-4.752,3.852-8.605,8.605-8.605h219.364C329.825,413.217,333.678,417.07,333.678,421.822z
	 M215.394,388.119c64.446,0,116.877-52.286,116.877-116.554V235.58c0-4.752-3.853-8.605-8.605-8.605H170.12l-49.154-83.794
	c-2.405-4.099-7.678-5.472-11.776-3.069c-4.099,2.405-5.473,7.677-3.069,11.776l44.046,75.087h-43.051
	c-4.753,0-8.605,3.853-8.605,8.605v35.984C98.511,335.832,150.945,388.119,215.394,388.119z M115.721,244.185h44.542l18.785,32.023
	c-1.007,0.591-1.882,1.379-2.575,2.319c-7.219,9.8-7.961,22.906-1.89,33.386l9.123,15.749c5.441,9.398,15.613,15.236,26.548,15.236
	c5.336,0,10.6-1.407,15.226-4.068c7.063-4.067,12.119-10.658,14.237-18.559c2.115-7.891,1.037-16.112-3.037-23.153l-9.122-15.749
	c-5.435-9.384-15.602-15.213-26.534-15.213c-1.283,0-2.577,0.082-3.848,0.242c-1.154,0.145-2.265,0.524-3.269,1.111l-0.006,0.004
	l-13.684-23.327h134.844v27.379c0,54.779-44.71,99.344-99.667,99.344c-54.959,0-99.673-44.566-99.673-99.344
	C115.721,271.567,115.721,244.185,115.721,244.185z M200.883,283.366c4.881-0.065,9.39,2.5,11.781,6.629l9.121,15.745
	c1.766,3.053,2.231,6.631,1.308,10.074c-0.926,3.454-3.129,6.331-6.2,8.101c-2.016,1.16-4.312,1.773-6.64,1.773
	c-4.815,0-9.279-2.548-11.654-6.651l-9.123-15.752c-2.377-4.104-2.339-9.147,0-13.241L200.883,283.366z"/>
</svg>`, y4 = `<?xml version="1.0" encoding="utf-8"?>
\r<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg version="1.1" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 64 64" xml:space="preserve">\r
<style type="text/css">\r
	.fandom_drie{fill:#BE9148;}\r
	.fandom_vier{fill:#FFC865;}\r
	.fandom_vijf{fill:#018273;}\r
	.fandom_zes{fill:#00B3AA;}\r
	.fandom_dertien{fill:#AA9991;}\r
	.fandom_veertien{fill:#EFEAE0;}\r
	.fandom_zestien{fill:#4D4D4D;}\r
	.st0{fill:#6BC4D2;}\r
	.st1{fill:#508D9B;}\r
	.st2{fill:#4B322A;}\r
	.st3{fill:#BE5652;}\r
	.st4{fill:#FF786E;}\r
	.st5{fill:#644638;}\r
	.st6{fill:#8579A3;}\r
	.st7{fill:#685683;}\r
	.st8{fill:#3A3A3A;}\r
	.st9{fill:#CCCCCC;}\r
	.st10{fill:#808080;}\r
	.st11{fill:#666666;}\r
	.st12{fill:#FFFAFA;}\r
</style>\r
<g>\r
	<g>\r
		<path class="fandom_vier" d="M32,7C18.193,7,7,18.193,7,32h50C57,18.193,45.807,7,32,7z"/>\r
		<path class="fandom_drie" d="M32,57c13.807,0,25-11.193,25-25H7C7,45.807,18.193,57,32,57z"/>\r
	</g>\r
	<g>\r
		<path class="fandom_zestien" d="M32.151,2.599c-1.857-0.217-2.933,0.885-1.353,4.318c0.631,1.47,1.216,2.496,1.426,2.851\r
			c-0.387,0.098-2.353,0.59-3.048,0.74c-0.026-0.516-0.104-1.611-0.331-3.026c-0.145-1.09-1.608-6.52,3.397-6.144\r
			c2.239,0.216,4.686,1.767,5.512,2.97c0.295,0.392,0.44,1.448,0.542,1.934c0.454,2.146,0.565,2.697,0.8,3.723\r
			c-1.033-0.214-2.149-0.381-3.324-0.424c0.183-0.873,0.339-2.037,0.398-3.143C36.257,3.712,33.151,2.7,32.151,2.599z\r
			 M16.967,36.806l-1.364-8.24c-0.025-2.933-0.099-5.343-0.251-6.539c-0.116,0.473-0.525,0.822-1.021,0.832l-0.717,0.014\r
			c-0.415,0.008-0.785-0.228-0.973-0.59c0.32,2.019,1.237,9.664,0.534,17.557c-0.448,5.029-0.622,7.467-0.688,8.642\r
			c-0.033,0.597,0.419,1.106,1.016,1.143l0.717,0.045c0.615,0.038,1.138-0.437,1.152-1.053c0.041-1.756,0.121-5.376,0.177-9.423\r
			l1.154,2.828C16.785,40.372,16.874,38.611,16.967,36.806z"/>\r
		<path class="fandom_veertien" d="M52.835,34.239C53.33,20.581,47.494,8.78,33.608,9.552\r
			c-12.377,0.688-13.265,26.607-13.265,26.607c-0.332,7.164-0.569,15.119-0.569,16.973c0,3.436,0.995,6.781,2.893,7.323\r
			s27.395-3.436,28.571-4.249c2.844-1.969,0.768-8.896,1.085-10.217C52.873,43.701,52.684,38.407,52.835,34.239z"/>\r
		<path class="fandom_zes" d="M34.628,9.517l1.452-2.022c-0.071,0.676-0.167,1.369-0.306,2.034\r
			C35.399,9.516,35.017,9.511,34.628,9.517z M43.125,4.125c0,0-1.346-0.68-2.594-0.854c-0.796-0.111-1.584,0.233-2.053,0.885\r
			l-0.495,0.689c0.15,0.483,0.751,3.647,1.113,5.12c0.415,0.086,0.777,0.198,1.17,0.309C40.92,8.436,43.125,4.125,43.125,4.125z\r
			 M15.299,9.1l0.713,8.239c0.018,0.205-0.598,4.385-0.627,4.59c-0.075,0.527-0.522,0.921-1.054,0.931l-0.717,0.014\r
			c-0.454,0.009-0.866-0.267-1.031-0.69c-0.104-0.265-1.573-3.952-1.595-4.205c-0.049-0.566-0.16-2.616,0.333-6.257\r
			c0.476-3.518,2.408-4.926,3.122-5.334c0.201,0.003,1.072,0.023,2.271,0.154C15.701,7.459,15.299,9.1,15.299,9.1z M52.835,34.239\r
			c-12.237,6.735-27.969,3.682-32.487,1.823c-0.334,7.188-0.573,15.207-0.573,17.069c0,3.436,0.995,6.781,2.893,7.323\r
			s27.395-3.436,28.571-4.249c2.844-1.969,0.768-8.896,1.085-10.217C52.873,43.701,52.684,38.375,52.835,34.239z"/>\r
		<path class="fandom_dertien" d="M26.353,11.263c0,0-5.436,2.529-7.936,13.112c-0.675,2.857-1.152,6.779-1.32,9.956\r
			c1.228,1.099,3.232,1.726,3.251,1.731c0.069-1.602,1.162-22.726,11.011-26.077C27.307,10.99,27.62,10.73,26.353,11.263z"/>\r
		<path class="fandom_vijf" d="M40.266,10.274c0.614-1.728,2.635-5.71,2.859-6.148c0.453,0.342,1.061,1.282,0.791,3.889\r
			c-0.14,1.35-0.317,2.69-0.447,3.65C42.48,11.084,41.455,10.625,40.266,10.274z M26.353,11.263\r
			c0.862-0.363,0.928-0.348,2.823-0.755c-0.024-0.476-0.098-1.459-0.287-2.719l-5.217-3.197c-0.809-0.496-1.795-0.614-2.699-0.323\r
			l-6.578,2.118C14.395,6.387,24.27,6.432,26.353,11.263z M39,25c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S41.209,25,39,25z\r
			 M16.208,52.542c0,0-0.081,4.455,2.75,6.458c2.385,1.688,4.417,1.505,4.417,1.505c-0.336,0.003-0.577-0.013-0.707-0.051\r
			c-1.899-0.542-2.893-3.888-2.893-7.323c0-1.853,0.237-9.809,0.569-16.973c0-0.007,0.001-0.041,0.004-0.096\r
			c-0.019-0.006-2.023-0.633-3.251-1.731C16.603,43.635,16.208,52.542,16.208,52.542z M51.659,40.616\r
			c1.267-0.675,0.245-2.591-1.021-1.914c-10.334,5.509-26.614,1.131-26.777,1.087c-1.386-0.382-1.959,1.711-0.576,2.092\r
			C31.416,44.134,43.765,44.827,51.659,40.616z"/>\r
	</g>\r
</g>\r
</svg>`, z4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M41.3 301.2h940.1v644.5H41.3z" fill="#845A3D" /><path d="M981.4 958.4H41.3c-7 0-12.6-5.7-12.6-12.6V301.2c0-7 5.7-12.6 12.6-12.6h940.1c7 0 12.6 5.7 12.6 12.6v644.5c0 7-5.6 12.7-12.6 12.7zM53.9 933.1h914.9V313.9H53.9v619.2z" fill="#141414" /><path d="M977.2 301.2H45.4c-1.8 0-2.8-2-1.8-3.4L201.2 71.9h620.2L979 297.8c1 1.5 0 3.4-1.8 3.4z" fill="#845A3D" /><path d="M977.2 313.9H45.4c-5.5 0-10.6-3-13.1-8-2.6-4.9-2.2-10.8 1-15.3L190.9 64.7c2.4-3.4 6.2-5.4 10.4-5.4h620.2c4.1 0 8 2 10.4 5.4l157.6 225.9c3.2 4.5 3.5 10.4 1 15.3-2.7 4.9-7.7 8-13.3 8zM65.5 288.6h891.7L814.8 84.5h-607L65.5 288.6z" fill="#141414" /><path d="M511.3 301.2V71.9" fill="#845A3D" /><path d="M511.3 313.9c-7 0-12.6-5.7-12.6-12.6V71.9c0-7 5.7-12.6 12.6-12.6S524 64.9 524 71.9v229.3c0 7-5.7 12.7-12.7 12.7z" fill="#141414" /><path d="M648.9 200.1H373.8l46.8-47.1h181.5z" fill="#E8CBB8" /><path d="M95.8 301.2h18v644.5h-18zM212 301.2h18v644.5h-18zM328.1 301.2h18v644.5h-18zM444.3 301.2h18v644.5h-18zM560.4 301.2h18v644.5h-18zM792.7 301.2h18v644.5h-18zM676.5 301.2h18v644.5h-18zM908.8 301.2h18v644.5h-18z" fill="#663C20" /><path d="M926.7 958.4H96c-37.1 0-67.3-30.2-67.3-67.3V355.9c0-37.1 30.2-67.3 67.3-67.3h830.7c37.1 0 67.3 30.2 67.3 67.3v535.2c0 37.1-30.2 67.3-67.3 67.3zM96 313.9c-23.2 0-42.1 18.9-42.1 42.1v535.2c0 23.2 18.9 42.1 42.1 42.1h830.7c23.2 0 42.1-18.9 42.1-42.1V355.9c0-23.2-18.9-42.1-42.1-42.1H96z" fill="#141414" /><path d="M676.8 561.4h-331c-24.8 0-45.1-20.3-45.1-45.1s20.3-45.1 45.1-45.1h331c24.8 0 45.1 20.3 45.1 45.1s-20.3 45.1-45.1 45.1z" fill="#26211E" /><path d="M676.8 574.1h-331c-31.9 0-57.8-25.9-57.8-57.8s25.9-57.8 57.8-57.8h331c31.9 0 57.8 25.9 57.8 57.8s-25.9 57.8-57.8 57.8z m-331-90.3c-17.9 0-32.5 14.6-32.5 32.5s14.6 32.5 32.5 32.5h331c17.9 0 32.5-14.6 32.5-32.5s-14.6-32.5-32.5-32.5h-331z" fill="#141414" /><path d="M830.1 876H730c-19.6 0-35.5-15.9-35.5-35.5V791c0-19.6 15.9-35.5 35.5-35.5h100c19.6 0 35.5 15.9 35.5 35.5v49.5c0 19.6-15.9 35.5-35.4 35.5z" fill="#D39E33" /><path d="M831.1 888.6H729c-26 0-47.1-21.1-47.1-47.1V790c0-26 21.1-47.1 47.1-47.1h102c26 0 47.1 21.1 47.1 47.1v51.5c0 26-21.1 47.1-47 47.1zM729 768.2c-12 0-21.8 9.8-21.8 21.8v51.5c0 12 9.8 21.8 21.8 21.8h102c12 0 21.8-9.8 21.8-21.8V790c0-12-9.8-21.8-21.8-21.8H729z" fill="#111111" /></svg>`, C4 = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 511.999 511.999" xml:space="preserve">
<g>
	<path style="fill:#FFA233;" d="M217.545,147.142l-46.827,90.59c42.288-17.282,87.413-44.99,124.354-89.397l-10.556-20.428
		c-8.538,4.422-18.239,6.921-28.517,6.921c-10.278,0-19.972-2.5-28.51-6.921L217.545,147.142z"/>
	<path style="fill:#F9EACD;" d="M295.071,148.335c-36.942,44.407-82.067,72.115-124.354,89.397l-61.614,119.184
		c59.116-9.132,159.956-38.21,226.257-130.643L295.071,148.335z"/>
	<path style="fill:#FFA233;" d="M335.361,226.272c-66.301,92.431-167.143,121.51-226.257,130.643l-31.466,60.871
		c0,0,184.403,3.021,281.499-145.516L335.361,226.272z"/>
	<path style="fill:#F9EACD;" d="M359.137,272.27C262.04,420.807,77.637,417.786,77.637,417.786L57.758,456.24
		c27.816,16.055,61.726,27.847,98.484,35.331c35.248-3.83,166.632-25.27,245.735-136.424L359.137,272.27z"/>
	<path style="fill:#FFA233;" d="M401.979,355.148c-79.104,111.154-210.488,132.594-245.735,136.423
		c54.549,11.124,115.364,12.759,171.805,4.796c35.55-21.159,70.918-50.947,98.926-92.866L401.979,355.148z"/>
	<path style="fill:#F9EACD;" d="M426.974,403.503c-28.008,41.919-63.376,71.706-98.926,92.866
		c47.19-6.642,91.327-19.997,126.192-40.127L426.974,403.503z"/>
	<path style="fill:#7BA9D6;" d="M284.51,127.906c19.942-10.33,33.569-31.151,33.569-55.157c0-34.288-27.791-62.078-62.08-62.078
		c-34.283,0-62.078,27.791-62.078,62.078c0,24.006,13.63,44.831,33.569,55.157c3.25,1.683,6.671,3.089,10.23,4.184
		c5.777,1.779,11.917,2.737,18.28,2.737C266.276,134.828,275.977,132.328,284.51,127.906z"/>
</g>
<g>
	<path style="fill:#000003;" d="M463.715,451.342L304.57,143.481c-0.015-0.029-0.031-0.061-0.046-0.09l-6.027-11.659
		C316.8,118.509,328.746,97,328.746,72.745C328.746,32.633,296.111,0,255.998,0c-40.111,0-72.745,32.633-72.745,72.745
		c0,24.255,11.946,45.762,30.249,58.987l-5.427,10.501c-0.017,0.029-0.031,0.059-0.046,0.09L48.284,451.342
		c-2.619,5.063-0.794,11.288,4.142,14.136c51.207,29.566,125.467,46.521,203.735,46.521c24.834,0,49.27-1.723,72.699-5.017
		c0.479-0.035,0.955-0.105,1.427-0.206c49.648-7.126,94.7-21.33,129.286-41.298C464.509,462.63,466.334,456.405,463.715,451.342z
		 M116.112,366.585c48.167-8.077,115.796-28.023,174.651-76.927c4.531-3.764,5.152-10.49,1.388-15.022
		c-3.764-4.531-10.49-5.152-15.022-1.388c-49.036,40.746-104.83,60.108-148.581,69.283l49.878-96.486
		c45.017-18.959,83.394-45.469,114.333-78.957l54.009,104.48c-38.669,56.543-94.897,96.48-167.238,118.752
		c-34.954,10.761-65.676,14.639-83.976,16.03L116.112,366.585z M279.57,141.576l2.721,5.265
		c-24.17,27.635-53.605,50.482-87.834,68.187l31.356-60.655c4.938-3.444,9.755-6.999,14.388-10.63
		c5.089,1.134,10.372,1.748,15.797,1.748c6.792,0,13.363-0.956,19.605-2.704c0.514-0.144,1.029-0.285,1.541-0.439
		c0.396-0.121,0.787-0.247,1.179-0.375C278.739,141.839,279.157,141.718,279.57,141.576z M255.998,21.334
		c28.349,0,51.413,23.064,51.413,51.411c0,20.342-11.88,37.963-29.064,46.291c-0.057,0.029-0.112,0.057-0.169,0.083
		c-3.673,1.762-7.588,3.102-11.677,3.954c-0.085,0.017-0.169,0.035-0.252,0.054c-0.715,0.144-1.438,0.271-2.162,0.385
		c-0.217,0.035-0.435,0.067-0.654,0.098c-0.645,0.094-1.294,0.179-1.948,0.247c-0.337,0.035-0.68,0.061-1.019,0.09
		c-0.566,0.05-1.134,0.1-1.707,0.131c-0.542,0.027-1.089,0.035-1.637,0.048c-0.375,0.006-0.746,0.027-1.123,0.027
		c-0.375,0-0.748-0.021-1.121-0.027c-0.548-0.013-1.096-0.02-1.64-0.048c-0.571-0.031-1.137-0.081-1.702-0.131
		c-0.341-0.029-0.684-0.054-1.023-0.09c-0.652-0.068-1.3-0.155-1.944-0.247c-0.221-0.031-0.442-0.063-0.662-0.098
		c-0.721-0.114-1.44-0.242-2.153-0.385c-0.087-0.019-0.177-0.037-0.265-0.057c-4.081-0.852-7.988-2.188-11.655-3.946
		c-0.067-0.031-0.131-0.062-0.198-0.096c-17.178-8.332-29.049-25.947-29.049-46.286C204.587,44.398,227.651,21.334,255.998,21.334z
		 M72.016,451.888l12.161-23.522c15.118-0.463,54.034-3.096,100.919-17.435c34.804-10.646,66.768-25.577,95.005-44.381
		c30.347-20.209,56.401-44.955,77.671-73.691l31.7,61.319c-35.064,46.833-80.496,75.656-112.977,91.74
		c-5.279,2.612-7.44,9.013-4.825,14.292c1.86,3.758,5.64,5.936,9.567,5.936c1.589,0,3.204-0.356,4.726-1.11
		c32.688-16.186,77.733-44.551,114.301-89.98l14.298,27.66c-23.31,33.276-53.603,61.293-90.149,83.366
		c-21.972,3.006-44.905,4.582-68.253,4.582C186.022,490.666,119.647,476.61,72.016,451.888z M375.438,476.054
		c18.845-15.551,35.598-32.958,50.09-52.128l14.455,27.962C421.092,461.694,399.262,469.816,375.438,476.054z"/>
	<path style="fill:#000003;" d="M307.532,270.274c2.842,0,5.675-1.13,7.775-3.362l0.523-0.542c4.079-4.25,3.942-11.002-0.308-15.085
		c-4.25-4.079-11.002-3.942-15.082,0.308l-0.677,0.706c-4.035,4.291-3.827,11.045,0.467,15.078
		C302.288,269.316,304.913,270.274,307.532,270.274z"/>
	<path style="fill:#000003;" d="M246.994,458.38l-0.706,0.269c-5.517,2.063-8.319,8.208-6.256,13.728
		c1.602,4.288,5.669,6.936,9.992,6.936c1.242,0,2.505-0.219,3.734-0.68l0.796-0.302c5.511-2.088,8.284-8.246,6.197-13.755
		C258.66,459.067,252.502,456.293,246.994,458.38z"/>
</g>
</svg>`, A4 = `<?xml version="1.0" encoding="utf-8"?>
\r<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 72 72" id="emoji" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g id="color">
    <polygon fill="#D22F27" points="33.9763,42.6906 34.0061,49.1497 34.0359,55.6089 28.1166,51.8019 22.1972,47.995 28.0868,45.3428"/>
    <circle cx="45" cy="27" r="23.0003" fill="#EA5A47"/>
    <path fill="#D22F27" d="M60.8265,10.549c-1.3409-1.3409-2.8082-2.477-4.3606-3.4175c5.3598,8.8471,4.2238,20.5254-3.4175,28.1667 s-19.3196,8.7774-28.1667,3.4175c0.9405,1.5525,2.0767,3.0197,3.4175,4.3606c8.9822,8.9822,23.5452,8.9822,32.5273,0 C69.8087,34.0942,69.8087,19.5312,60.8265,10.549z"/>
  </g>
  <g id="hair"/>
  <g id="skin"/>
  <g id="skin-shadow"/>
  <g id="line">
    <polyline fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2.1216" points="34,47.2098 34.01,49.1498 34.04,55.6098 28.12,51.7998 22.2,47.9998 28.09,45.3398 30.04,44.4598"/>
    <circle cx="45" cy="27" r="23.0003" fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="2"/>
    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M17.7253,65.09c0.5048,0.0395,1.0254-0.0002,1.547-0.1285c2.7035-0.6648,4.41-3.458,3.8116-6.2388"/>
    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M23.1406,58.907c-0.1631-0.4794-0.2535-0.9936-0.2582-1.5307c-0.0246-2.7839,2.2596-5.1284,5.102-5.2364"/>
  </g>
</svg>`, F4 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#BBDDF5" d="M5 21.875s1.589 5.727 2 8.482c.464 3.111 3.571 5.571 11 5.571s10.536-2.461 11-5.571c.411-2.755 2-8.482 2-8.482H5z"></path><path fill="#662113" d="M5.094 21.969c.25 1.219.694 1.994 1.344 1.594c.65-.4 1.65-.193 1.344.625c-.281.75.969 1.094 1.5.656c.509-.419 1.555-.881 1.656.062c.094.875 1.168 1.11 1.656.469c.5-.656 1.875-.394 2.125.406s1.594.688 1.969.125c.355-.533.713-.885 1.312-.885V25c.6 0 .957.373 1.312.906c.375.562 1.719.675 1.969-.125s1.625-1.062 2.125-.406c.489.641 1.562.406 1.656-.469c.101-.943 1.147-.482 1.656-.062c.531.438 1.781.094 1.5-.656c-.307-.818.694-1.025 1.344-.625c.65.4 1.094-.375 1.344-1.594H5.094z"></path><path fill="#C1694F" d="M33 18.969c0-4.919-6.731-8.906-15.033-8.906c-8.303 0-15.033 3.987-15.033 8.906c0 3.969 9 6.031 15.033 6.031S33 23 33 18.969z"></path><path d="M18 35.5a.5.5 0 0 1-.5-.5v-8.646a.5.5 0 0 1 1 0V35a.5.5 0 0 1-.5.5zm-6.699-1.268a.501.501 0 0 1-.496-.436l-1.031-7.982a.502.502 0 0 1 .432-.561a.497.497 0 0 1 .56.432l1.031 7.982a.502.502 0 0 1-.496.565zm3.179.976a.5.5 0 0 1-.498-.459l-.708-8.521a.5.5 0 1 1 .997-.082l.708 8.521a.5.5 0 0 1-.457.539l-.042.002zm-5.959-3.041a.375.375 0 0 1-.367-.301l-1.5-7.438a.374.374 0 0 1 .293-.441c.198-.048.4.09.442.293l1.5 7.438a.374.374 0 0 1-.368.449zm16.1 1.952a.5.5 0 0 1-.496-.571l1.13-7.869a.507.507 0 0 1 .566-.424a.5.5 0 0 1 .424.566l-1.13 7.869a.5.5 0 0 1-.494.429zm-3.042 1.089l-.042-.002a.5.5 0 0 1-.457-.539l.708-8.521c.022-.276.292-.474.539-.457a.5.5 0 0 1 .457.539l-.708 8.521a.499.499 0 0 1-.497.459zm5.983-3a.374.374 0 0 1-.368-.445l1.438-7.479a.374.374 0 1 1 .736.14l-1.438 7.479a.374.374 0 0 1-.368.305z" fill="#88C9F9"></path><path fill="#FFE8B6" d="M16.912-.011s1.087 1.144 2.175 1.167c2.268.049 4.355 1.315 4.355 3.506c0 0 5.261 0 5.443 4.674c0 0 2.655.045 3.263 4.672c.454 3.456-3.038 8.227-14.148 8.178c-9.795-.043-14.806-3.524-14.148-8.176c.634-4.48 4.354-4.673 4.354-4.673s-.636-5.843 6.529-5.842c0 0 .726-2.337 2.177-3.506z"></path><path fill="#FFCC4D" d="M17.91 10.504c2.936-1.108 5.623-3.115 5.533-5.841c0-.858-.327-1.568-.852-2.125c.643 2.808-3.651 6-8.399 6.506c-5.941.633-5.261-2.872-5.261-2.872l-.007.007c-.883 1.536-.717 3.159-.717 3.159c.905 2.383 5.576 2.724 9.703 1.166z"></path><path fill="#FFCC4D" d="M28.885 9.337c-.006-.143-.03-.268-.045-.402c-.116-.677-.453-1.506-.774-2.138c-.19-.265-.4-.499-.63-.702c1.109 4.426-5.563 9.749-11.93 10.982c-8.299 1.606-11.654-3.065-11.654-3.065c-.342 2.415.858 4.509 3.449 5.976c10.227 4.169 21.673-6.095 21.584-10.651z"></path><path fill="#DD2E44" d="M8.689 14.201l-1.181 1.614a1.003 1.003 0 0 1-1.398.216a1.003 1.003 0 0 1-.216-1.398l1.181-1.614a1.003 1.003 0 0 1 1.398-.216c.444.325.541.954.216 1.398z"></path><path fill="#55ACEE" d="M14.935 8.187l-1.956-.419a1.002 1.002 0 0 1-.768-1.187c.115-.538.65-.884 1.187-.768l1.956.419c.538.115.884.65.768 1.187a1.001 1.001 0 0 1-1.187.768z"></path><path fill="#77B255" d="M16.431 14.173l1.313 1.509c.361.415.317 1.05-.098 1.411a1.003 1.003 0 0 1-1.411-.098l-1.313-1.509a1.003 1.003 0 0 1 .098-1.411a1.003 1.003 0 0 1 1.411.098z"></path><path fill="#F4900C" d="M24.372 11.499l-1.871.707a1.003 1.003 0 0 1-1.289-.582a1.003 1.003 0 0 1 .582-1.289l1.871-.707a1.003 1.003 0 0 1 1.289.582a1.003 1.003 0 0 1-.582 1.289z"></path><path fill="#AA8DD8" d="M30.366 14.051l-1 1.732c-.275.476-.89.641-1.366.366a1.003 1.003 0 0 1-.366-1.366l1-1.732c.275-.476.89-.641 1.366-.366c.476.275.641.889.366 1.366z"></path></svg>`, _4 = `<?xml version="1.0" encoding="utf-8"?>
\r<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet">
\r<path d="M36.9 22.7l2.5-18.6C37 3.5 34.6 2 32 2c-2.6 0-5 1.5-7.5 2.2c-2.5.6-5.3.5-7.5 1.8s-3.6 3.8-5.4 5.6C9.8 13.4 7.3 14.8 6 17c-1.3 2.2-1.2 5-1.9 7.5C3.5 27 2 29.4 2 32c0 2.6 1.5 5 2.2 7.5c.6 2.5.5 5.3 1.8 7.5s3.8 3.6 5.6 5.4c1.8 1.8 3.1 4.3 5.4 5.6c2.2 1.3 5 1.2 7.5 1.9c2.5.6 4.9 2.1 7.5 2.1c2.6 0 5-1.5 7.5-2.2c2.5-.7 5.3-.6 7.5-1.9c2.2-1.3 3.6-3.8 5.4-5.6c1.8-1.8 4.3-3.1 5.6-5.4c1.3-2.2 1.2-5 1.9-7.5c.6-2.4 2.1-4.8 2.1-7.4c0-2.6-2.1-8.1-2.1-8.1l-23-1.2" fill="#dda85f">
\r</path>
\r<path d="M59.4 22.4c-1 .3-2.4.2-3.9-.4c-2.1-.8-3.4-2.5-3.8-4.5c-1 .3-3.4 0-5-1c-2.4-1.5-2.9-5.7-2.9-5.7c-2.7-.8-4.7-4-4.4-6.7c-2.2-.6-5-.5-7.4-.5c-2.4 0-4.6 1.4-6.8 2c-2.3.6-4.9.5-6.9 1.7s-3.3 3.5-4.9 5.1c-1.7 1.7-4 2.9-5.1 4.9c-1.2 2-1.1 4.6-1.7 6.9c-.6 2.2-2 4.4-2 6.8c0 2.4 1.4 4.6 2 6.8c.6 2.3.5 4.9 1.7 6.9s3.5 3.3 5.1 4.9c1.7 1.7 2.9 4 4.9 5.1c2 1.2 4.6 1.1 6.9 1.7c2.2.6 4.4 2 6.8 2c2.4 0 4.6-1.4 6.8-2c2.3-.6 4.9-.5 6.9-1.7s3.3-3.5 4.9-5.1c1.7-1.7 4-2.9 5.1-4.9c1.2-2 1.1-4.6 1.7-6.9c.6-2.2 3-4 3.3-6.4c.8-3.9-1.2-8.3-1.3-9" fill="#f2cb7d">
\r</path>
\r<g fill="#dda85f">
\r<path d="M50.1 10.8l-1.4 1.4l-1.3-1.4l1.3-1.3z">
\r</path>
\r<path d="M55.8 17.8l-.6.7l-.7-.7l.7-.7z">
\r</path>
\r<path d="M50.8 13.2l-.7.7l-.7-.7l.7-.7z">
\r</path>
\r<path d="M44.6 7.1l-.7.7l-.7-.7l.7-.7z">
\r</path>
\r<path d="M57.2 20.3l-.7.7l-.7-.7l.7-.7z">
\r</path>
\r<path d="M57.8 17.8l-.7.7l-.7-.7l.7-.7z">
\r</path>
\r</g>
\r<path d="M11.8 20.6c-1 1.7.5 4.8 2.5 5.7c2.9 1.2 4.6 1.4 6.4-1.7c.6-1.1 1.4-4 1.1-4.7c-.4-1-2.1-3-3.2-3c-3.1.1-6.1 2.5-6.8 3.7" fill="#6d4934">
\r</path>
\r<path d="M12.3 20.6c-.7 1.2 1.1 4.8 3.5 4.5c3.3-.4 3-7.2 1.6-7.2c-2.4 0-4.6 1.8-5.1 2.7" fill="#a37f6a">
\r</path>
\r<path d="M45.2 39.1c1.4-.4 2.4-2.9 1.8-4.4c-.9-2.3-1.8-3.3-4.4-2.6c-.9.3-3 1.4-3.2 1.9c-.3.8-.5 2.8.1 3.4c1.7 1.7 4.7 2 5.7 1.7" fill="#6d4934">
\r</path>
\r<path d="M43.8 36.7c1.1-.3 2.8-3.7 1-3.9c-3.1-.5-5.5 1-5.2 2.7c.3 1.7 3.4 1.4 4.2 1.2" fill="#a37f6a">
\r</path>
\r<path d="M24.9 44.5c-.3-1.2-2.5-2.1-3.9-1.5c-2 .8-2.9 1.5-2.2 3.8c.2.8 1.2 2.6 1.7 2.7c.7.3 2.4.4 2.9-.1c1.5-1.4 1.7-4 1.5-4.9" fill="#6d4934">
\r</path>
\r<path d="M23.2 43.6c-.2-.9-4.4.4-4 2c.8 2.7.8 3.1 1.6 3c1.5-.4 2.5-4.3 2.4-5" fill="#a37f6a">
\r</path>
\r<path d="M51.1 25.5c-1.2.3-2.1 2.5-1.5 3.9c.8 2 2.7 2.3 4.8 1.2c1.8-.9 1.9-4.1 1.4-4.7c-1.5-1.5-3.8-.6-4.7-.4" fill="#6d4934">
\r</path>
\r<path d="M50.6 26.6c-.6.7-1.1 3.5.4 3.1c2.7-.8 4.6-3.5 3.4-3.9c-1.5-.5-3.1 0-3.8.8" fill="#a37f6a">
\r</path>
\r<path fill="#6d4934" d="M22.74 16.112l1.98-1.98l1.98 1.98l-1.98 1.98z">
\r</path>
\r<g fill="#dda85f">
\r<path d="M14.706 33.483l1.979-1.98l1.98 1.979l-1.979 1.98z">
\r</path>
\r<path d="M34.698 44.811l1.98-1.98l1.98 1.98l-1.98 1.98z">
\r</path>
\r<path d="M32.038 39.289l2.687-2.687l2.687 2.687l-2.687 2.687z">
\r</path>
\r<path d="M24.696 9.827l2.687-2.687l2.687 2.687l-2.687 2.687z">
\r</path>
\r</g>
\r<g fill="#6d4934">
\r<path d="M41.122 46.347l1.98-1.98l1.98 1.98l-1.98 1.98z">
\r</path>
\r<path d="M49.076 35.215l1.98-1.98l1.98 1.98l-1.98 1.98z">
\r</path>
\r<path d="M41.812 24.637l.99-.99l.99.99l-.99.99z">
\r</path>
\r<path d="M13.726 38.266l.99-.99l.99.99l-.99.99z">
\r</path>
\r</g>
\r</svg>`, S4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M543.74 255c210.2-42.94 322.79 28.73 346.37 214C904.38 652.15 874 930.76 563 930.76q-35.73-0.9-108.27 0C178.08 903 132.15 652.15 146.43 469 170 283.73 282.6 212.06 492.8 255c5.86 1.49 15.78 1.55 20.37 0 14.83 1.54 24.71 1.48 30.57 0z" fill="#FFFFFF" /><path d="M885.45 439.64q2.73 14.16 4.66 29.34C904.38 652.15 874 930.76 563 930.76q-35.73-0.9-108.27 0c-88.34-8.86-153.15-40.47-200-85.36-20.43-72.24-23.51-150.22-18.17-218.74 23.58-185.26 136.17-256.93 346.37-214 5.86 1.49 15.78 1.55 20.37 0 14.78 1.55 24.7 1.49 30.56 0 110.33-22.54 193.77-13.5 251.57 27z" fill="#FFC6C6" /><path d="M687.43 244.66c118.81 12.08 185.2 87 202.68 224.32C904.38 652.15 874 930.76 563 930.76q-35.73-0.9-108.27 0c-58-5.82-105.92-21.46-145.22-44.24 223.8 24.26 333.76-44.77 395.87-262.59 32.82-115.12 28.75-256-18-379.27z" fill="#FF9368" /><path d="M405.59 339.46a135.21 61.95 0 1 0 270.42 0 135.21 61.95 0 1 0-270.42 0Z" fill="#FFC6C6" /><path d="M453.84 951.26l-1.15-0.12c-68.87-6.91-128.3-27.68-176.65-61.74C233 859 198.34 818 173.14 767.27c-50.37-101.34-53.43-219-47.13-299.87l0.1-1c5.83-45.76 17.1-85.6 33.52-118.42 17-33.9 39.88-61.34 68.11-81.56 31.69-22.69 70.78-36.75 116.17-41.8 44.05-4.9 95.52-1.43 153 10.31l0.93 0.21a31.48 31.48 0 0 0 9.21 0.31l3.82-1.29 4.45 0.47c17.13 1.79 22.49 0.75 23.4 0.52l0.93-0.21c57.46-11.74 108.94-15.21 153-10.31 45.39 5 84.47 19.11 116.17 41.8 28.18 20.21 51.13 47.65 68.09 81.57 16.41 32.81 27.69 72.65 33.52 118.42l0.1 1c9.32 119.51 0.32 283.71-95.45 387.23C755.77 918.74 671 951.24 563 951.24h-0.52c-23.45-0.59-59.62-0.59-107.5 0zM518 909.84c18.15 0 33.27 0.15 45.25 0.45 50.49 0 95.42-7.82 133.56-23.18 34.28-13.8 63.95-34.09 88.19-60.3 47.27-51.1 100.32-154.3 84.72-355.73-5.26-41-15.17-76.21-29.45-104.77-13.94-27.88-32.56-50.31-55.27-66.58-25.92-18.56-58.51-30.13-96.85-34.4-39.7-4.42-86.76-1.17-139.87 9.65-8 1.92-18.5 2.15-33.69 0.73a70 70 0 0 1-26.22-0.73c-53.12-10.82-100.18-14.07-139.88-9.65-38.34 4.26-70.93 15.84-96.85 34.4-22.76 16.3-41.38 38.7-55.33 66.58-14.29 28.56-24.2 63.81-29.45 104.77-3.8 49.11-2.73 96.45 3.17 140.73 6.89 51.73 20.3 97.9 39.85 137.23 47.26 95.07 130 149.31 245.83 161.24 23.58-0.28 44.41-0.44 62.29-0.44z" fill="" /><path d="M516.59 388.26c-36.82 0-73.57-14.47-109.24-43a22.53 22.53 0 1 1 28.15-35.18c55.32 44.27 106.86 44.27 162.18 0a22.53 22.53 0 1 1 28.15 35.18c-35.66 28.53-72.42 43-109.24 43z" fill="" /><path d="M518.28 363.59a22.55 22.55 0 0 1-21.66-28.77c32.47-112.64 71.48-185.13 119.27-221.62a22.53 22.53 0 1 1 27.35 35.8c-39.27 30-74 96.71-103.32 198.29a22.54 22.54 0 0 1-21.64 16.3z" fill="" /><path d="M412.75 277.52q87.12 0 157.75-78.84-70.63-78.84-157.75-78.84T255 198.68q70.62 78.84 157.75 78.84z" fill="#89D66D" /><path d="M416.86 298c-63.88 0-122.09-28.82-173-85.66l-12.24-13.67L243.85 185c50.92-56.84 109.12-85.65 173-85.65s122.09 28.82 173 85.65l12.24 13.67-12.24 13.67C538.95 269.18 480.74 298 416.86 298z m-129.48-99.32c17.84 17.55 36.49 31.25 55.63 40.81a164.13 164.13 0 0 0 147.69 0c19.14-9.57 37.79-23.26 55.63-40.81-17.84-17.55-36.49-31.25-55.63-40.81a164.13 164.13 0 0 0-147.69 0c-19.13 9.56-37.79 23.25-55.63 40.81z" fill="" /><path d="M396.72 182.16h143.35a15.36 15.36 0 0 1 15.36 15.36 15.36 15.36 0 0 1-15.36 15.36H396.72a15.36 15.36 0 0 1-15.36-15.36 15.36 15.36 0 0 1 15.36-15.36z" fill="#015200" /></svg>`, j4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M510.75072 539.4944m-472.18176 0a472.18176 472.18176 0 1 0 944.36352 0 472.18176 472.18176 0 1 0-944.36352 0Z" fill="#FF7100" /><path d="M508.78976 219.22816c-20.6848-44.63616 19.46624-107.20256 89.68704-139.74528 70.21568-32.54272 143.90784-22.7328 164.59776 21.90336L508.78976 219.22816z" fill="#30C03F" /><path d="M508.78976 219.22816c20.6848 44.63616 94.37696 54.44608 164.59776 21.90336 70.21568-32.54272 110.37184-95.104 89.68704-139.74528L508.78976 219.22816z" fill="#97CF43" /><path d="M370.32448 220.49792m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F" /><path d="M254.208 313.6768m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F" /><path d="M743.41376 281.06752m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F" /><path d="M859.53024 388.224m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F" /><path d="M767.06816 434.816m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F" /><path d="M631.59296 346.65472m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F" /><path d="M878.16704 565.26848m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F" /><path d="M504.02304 224.35328s-27.4944-173.22496-8.24832-192.47104 33.90976-12.17024 41.24672-5.49888c15.12448 13.7472-16.49664 159.47776-16.49664 178.72384 0 19.24608-8.24832 38.49216-16.50176 19.24608z" fill="#5A4530" /><path d="M460.36992 221.66016s33.19808-5.24288 54.16448 0c20.9664 5.24288 22.71232 6.9888 26.20928 12.23168 3.49184 5.24288-24.45824 3.49184-24.45824 3.49184s-19.22048-5.24288-31.44704-5.24288H463.872s-13.98272-5.23776-3.50208-10.48064z" fill="#5A4530" /></svg>`, k4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M746.666667 234.666667c21.333333 0 149.333333-21.333333 149.333333 170.666666S618.666667 938.666667 234.666667 938.666667c-42.666667 0-85.333333-21.333333-85.333334-21.333334l-21.333333-64s21.333333-85.333333 149.333333-149.333333 218.944-117.632 273.344-172.010667C593.344 489.344 661.333333 405.333333 661.333333 341.333333c0-41.770667 42.666667-85.333333 42.666667-85.333333" fill="#FFE082" /><path d="M170.666667 874.666667s149.333333-42.666667 277.333333-106.666667 405.333333-256 320-533.333333c0 0 128-21.333333 128 170.666666S618.666667 938.666667 234.666667 938.666667c-42.666667 0-85.333333-21.333333-85.333334-21.333334l21.333334-42.666666z" fill="#FFCA28" /><path d="M876.010667 297.344C836.010667 211.562667 746.666667 256 746.666667 85.333333c-64 0-106.666667 42.666667-106.666667 42.666667s64 64 64 128c42.666667 0 77.056-3.349333 80.874667 101.333333 28.842667-122.218667 91.136-59.989333 91.136-59.989333z" fill="#C0CA33" /><path d="M661.333333 341.333333s-1.344-38.677333 42.666667-85.333333 85.994667-8.661333 85.994667-8.661333l-5.12 109.994666s-18.666667-69.333333-48-71.104C675.008 282.496 661.333333 341.333333 661.333333 341.333333z" fill="#C0CA33" /><path d="M128 874.666667l21.333333 42.666666h21.333334v-42.666666l-42.666667-21.333334z" fill="#5D4037" /><path d="M746.666667 85.333333c-64 0-106.666667 42.666667-106.666667 42.666667h64l42.666667-42.666667z" fill="#827717" /></svg>`, b4 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet"><path d="M64.52 22.23c-9.49-.12-13.06 5.54-16.3 12.69c-2.48 5.47-4.33 13.61-9.49 20.63s-17.84 16.09-16.3 34.86c1.55 18.77 14.33 32.4 42.19 32.9c28.47.52 41.62-18.87 41.26-38.37c-.31-16.5-14.77-26.09-19.7-35.07c-7.53-13.72-4.64-27.43-21.66-27.64z" fill="#b7d118"></path><path d="M57.39 6.32c-.21.79 1.29 7 2.03 9.94c.98 3.9 2.14 8.86 2.93 11.26c.42 1.28 1.53 1.76 2.54 1.67c1.04-.09 2.31-.89 2.31-2.26c-.01-2.55.07-10.04.12-13.02s.39-8.99.35-9.86c-.02-.42-2.49-.86-5.4-.43c-2.93.43-4.76 2.26-4.88 2.7z" fill="#865c51"></path><path d="M55.29 37.87c-2.64-.22-3.3 3.03-4.32 7.08c-1.03 4.05-3.24 9.13-5.73 12.97c-4.22 6.52-8.54 9.94-11.18 16.37c-2.47 6-2.73 13.85 2.92 14.69c6.54.97 7.38-7.8 8.37-11.45c1.03-3.78 2.59-7.35 5.24-11.78c1.94-3.25 6.28-12.13 7.02-18.53c.76-6.49.86-9.08-2.32-9.35z" fill="#e4f57d"></path><path d="M79.31 71.94c-1.31-1.26-3.18-.7-3.96.13c-.74.78-1.34 2.61-.08 3.91c1.26 1.31 3.13.7 4.04-.17c1-.96 1.13-2.78 0-3.87z" fill="#e4dc9f"></path><path d="M84.09 74.9c-1.15 1.29-.83 3.05.09 3.83c.91.78 2.68.64 3.61-.48c1.13-1.35.44-3.05-.22-3.61c-.65-.57-2.39-.96-3.48.26z" fill="#e4dc9f"></path><path d="M91.62 78.56c-1.47 1.27-.79 3.1-.16 3.77c.87.91 2.68.85 3.59-.11c.91-.96 1.17-2.83.03-3.7c-1.12-.88-2.51-.79-3.46.04z" fill="#e4dc9f"></path><path d="M78.57 62.46c-1.04 1.14-.78 2.87.04 3.61s2.82 1.3 3.92-.35c.87-1.31.17-2.78-.61-3.44c-.83-.69-2.48-.78-3.35.18z" fill="#e4dc9f"></path><path d="M69.95 62.63c-1.23 1.39-.42 2.97.35 3.74c.87.87 2.65 1.09 3.61.04c.96-1.04.87-2.61 0-3.74c-.87-1.13-3-1.13-3.96-.04z" fill="#e4dc9f"></path><path d="M75.65 49.1c-1.13-.61-2.13.09-2.65.78c-.52.7-.48 2.18.35 2.74c.83.57 2.39.64 3.05-.48c.6-1.04.4-2.42-.75-3.04z" fill="#e4dc9f"></path></svg>`, E4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512.144 986.56a30.728 30.728 0 0 1-30.752-30.752V693.152a30.736 30.736 0 1 1 61.488 0v262.664a30.72 30.72 0 0 1-30.736 30.744z" fill="#0092D2" /><path d="M511.664 1008a30.728 30.728 0 0 1-30.752-30.752c0-119.408-167.52-220.312-365.824-220.312-17 0-30.752-13.752-30.752-30.752s13.76-30.76 30.752-30.76c239.632 0 427.304 123.8 427.304 281.824A30.72 30.72 0 0 1 511.664 1008z" fill="#0092D2" /><path d="M512.32 1008a30.728 30.728 0 0 1-30.752-30.752c0-158.024 187.744-281.824 427.336-281.824 17 0 30.752 13.76 30.752 30.76s-13.752 30.752-30.752 30.752c-198.264 0-365.84 100.904-365.84 220.312A30.736 30.736 0 0 1 512.32 1008z" fill="#0092D2" /><path d="M908.904 695.432c-157.304 0-291.848 53.576-366.032 134.968V693.152a30.736 30.736 0 0 0-30.736-30.76c-1.352 0-2.52 0.608-3.84 0.792v344.168c1.168 0.12 2.168 0.656 3.36 0.656 0.12 0 0.208-0.064 0.336-0.064 0.12 0 0.208 0.064 0.328 0.064a30.736 30.736 0 0 0 30.744-30.752c0-119.408 167.576-220.312 365.84-220.312 17 0 30.752-13.752 30.752-30.752s-13.752-30.76-30.752-30.76z" fill="#0085BF" /><path d="M253.744 247.248c-43.848 0-79.336 47.72-79.336 106.648 0 37.992 14.8 71.384 37.056 90.28 12.248 10.336 26.728 16.368 42.28 16.368l0.36-0.36c-31 30.96-22.344 89.904 19.312 131.528 26.848 26.904 60.936 40 90.04 37.6 15.944-1.392 30.48-7.336 41.472-18.328l0.184 0.432c0.024 43.784 47.808 79.336 106.672 79.336 38.072 0 71.336-14.888 90.256-37.12 10.336-12.248 16.408-26.728 16.408-42.28h0.056c10.992 11.048 25.52 17 41.448 18.376 29.136 2.344 63.176-10.752 90.096-37.664 41.624-41.624 50.272-100.528 19.28-131.52l0.896 0.088c15.56 0.032 30.032-6.032 42.28-16.336 22.288-18.92 37.064-52.28 37.064-90.272 0-58.896-35.496-106.672-79.344-106.672l0.424-0.504c10.992-11 16.936-25.504 18.32-41.416 2.344-29.136-10.752-63.216-37.6-90.072C709.68 73.688 650.816 65.008 619.824 96v-0.664C619.824 51.496 572.072 16 513.16 16c-37.992 0-71.384 14.808-90.24 37.064-10.36 12.248-16.4 26.728-16.4 42.28l-0.752-0.176c-30.992-30.96-90.936-21.144-132.56 20.544-26.848 26.848-40 60.936-37.632 90.032 1.352 15.92 7.328 30.456 18.32 41.416l-0.152 0.088z" fill="#F5B146" /><path d="M508.296 690.448c1.168 0.064 2.28 0.296 3.488 0.296 10.456 0 20.408-1.32 29.952-3.424 0.304-0.064 0.608-0.24 0.904-0.304 6.424-1.44 12.552-3.296 18.384-5.576 2.936-1.152 5.64-2.52 8.408-3.848a106.68 106.68 0 0 0 11.888-6.544c2.04-1.312 4.152-2.64 6.072-4.08 5.4-4.088 10.504-8.408 14.648-13.336 10.336-12.248 16.408-26.728 16.408-42.28h0.056c10.992 11.048 25.52 17 41.448 18.376 29.136 2.344 63.176-10.752 90.096-37.664 41.624-41.624 50.272-100.528 19.28-131.52l0.896 0.088c15.56 0.032 30.032-6.032 42.28-16.336 22.288-18.92 37.064-52.28 37.064-90.272 0-58.896-35.496-106.672-79.344-106.672l0.424-0.504c10.992-11 16.936-25.504 18.32-41.416 2.344-29.136-10.752-63.216-37.6-90.072C709.68 73.688 650.816 65.008 619.824 96v-0.664C619.824 51.496 572.072 16 513.16 16c-1.68 0-3.208 0.424-4.864 0.488v673.96z" fill="#EDA02F" /><path d="M512 353.384m-80.736 0a80.736 80.736 0 1 0 161.472 0 80.736 80.736 0 1 0-161.472 0Z" fill="#E5226B" /><path d="M508.296 273.008v160.736c1.264 0.032 2.432 0.36 3.696 0.36 44.576 0 80.744-36.128 80.744-80.72 0-44.6-36.168-80.728-80.744-80.728-1.264 0-2.432 0.328-3.696 0.352z" fill="#C9005B" /></svg>`, D4 = `<?xml version="1.0" encoding="utf-8"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">\r
<g>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M32,14.002c-9.941,0-18,8.059-18,18s8.059,18,18,18\r
		s18-8.059,18-18S41.941,14.002,32,14.002z M32,48.002c-8.837,0-16-7.164-16-16s7.163-16,16-16s16,7.164,16,16\r
		S40.837,48.002,32,48.002z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M63,31H53c-0.553,0-1,0.447-1,1s0.447,1,1,1h10\r
		c0.553,0,1-0.447,1-1S63.553,31,63,31z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M11.457,36.469l-3.863,1.035\r
		c-0.534,0.145-0.851,0.693-0.707,1.227c0.143,0.533,0.69,0.85,1.225,0.705l3.863-1.035c0.533-0.143,0.85-0.689,0.707-1.225\r
		C12.539,36.643,11.99,36.326,11.457,36.469z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M49.32,22c0.277,0.479,0.888,0.643,1.367,0.365l8.66-5\r
		c0.479-0.275,0.643-0.887,0.365-1.365c-0.275-0.479-0.887-0.643-1.365-0.365l-8.66,5C49.208,20.912,49.045,21.521,49.32,22z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M17.858,46.143c-0.39-0.391-1.023-0.389-1.414,0l-2.828,2.828\r
		c-0.391,0.391-0.39,1.025,0.001,1.414c0.39,0.391,1.022,0.391,1.413,0l2.828-2.828C18.249,47.168,18.249,46.533,17.858,46.143z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M42,14.68c0.479,0.275,1.09,0.113,1.367-0.367l5-8.66\r
		C48.644,5.174,48.48,4.562,48,4.287c-0.478-0.277-1.088-0.113-1.365,0.365l-4.999,8.662C41.358,13.793,41.522,14.402,42,14.68z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M26.824,51.318c-0.532-0.143-1.08,0.176-1.225,0.707l-1.035,3.863\r
		c-0.143,0.535,0.176,1.082,0.709,1.225c0.533,0.145,1.08-0.172,1.223-0.707l1.035-3.863C27.676,52.012,27.359,51.463,26.824,51.318\r
		z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M32,12c0.554,0,1.001-0.447,1.002-1V1c0-0.553-0.447-1-1.002-1\r
		c-0.551,0-0.998,0.447-0.999,1l0.001,10C31.002,11.553,31.449,12,32,12z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M38.402,52.025c-0.141-0.533-0.689-0.85-1.225-0.707\r
		c-0.533,0.143-0.848,0.691-0.707,1.225l1.035,3.863c0.144,0.535,0.693,0.85,1.227,0.707s0.849-0.689,0.705-1.225L38.402,52.025z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M20.637,14.312c0.275,0.479,0.887,0.643,1.363,0.367\r
		c0.48-0.277,0.645-0.887,0.368-1.367l-5-8.66C17.092,4.174,16.48,4.01,16,4.287c-0.477,0.275-0.641,0.887-0.365,1.365\r
		L20.637,14.312z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M47.558,46.141c-0.388-0.389-1.022-0.389-1.414,0\r
		c-0.391,0.391-0.388,1.025,0,1.414l2.828,2.828c0.392,0.393,1.025,0.389,1.415,0c0.391-0.391,0.391-1.021-0.001-1.414\r
		L47.558,46.141z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M4.654,17.365l8.662,4.998c0.477,0.277,1.088,0.113,1.363-0.363\r
		c0.277-0.48,0.115-1.09-0.364-1.367l-8.661-5C5.176,15.355,4.564,15.52,4.287,16C4.013,16.477,4.176,17.088,4.654,17.365z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M52.027,38.4l3.863,1.035c0.535,0.145,1.082-0.176,1.225-0.709\r
		c0.144-0.533-0.172-1.08-0.707-1.223l-3.863-1.035c-0.531-0.145-1.081,0.172-1.225,0.707C51.176,37.709,51.496,38.256,52.027,38.4z\r
		"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M12,32c0.001-0.555-0.445-1-0.998-1.002L1,31\r
		c-0.552,0-1,0.445-1,1c0.001,0.551,0.448,1,1.001,1l10.001-0.002C11.553,32.998,12.001,32.551,12,32z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M52.545,27.529l3.863-1.035c0.535-0.143,0.85-0.693,0.706-1.227\r
		c-0.142-0.531-0.688-0.848-1.224-0.705l-3.863,1.035c-0.533,0.141-0.85,0.691-0.707,1.225\r
		C51.461,27.355,52.012,27.67,52.545,27.529z"/>\r
	<circle fill-rule="evenodd" clip-rule="evenodd" fill="#F9EBB2" cx="32" cy="32" r="16"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M14.68,42c-0.275-0.48-0.886-0.645-1.365-0.369l-8.661,5.002\r
		C4.176,46.91,4.01,47.52,4.287,48c0.277,0.477,0.889,0.641,1.367,0.365l8.66-5.002C14.791,43.088,14.957,42.479,14.68,42z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M46.144,17.855c0.389,0.393,1.022,0.389,1.414,0l2.828-2.828\r
		c0.392-0.391,0.39-1.023-0.002-1.414c-0.388-0.391-1.021-0.391-1.412,0l-2.828,2.828C45.752,16.83,45.754,17.465,46.144,17.855z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M22,49.32c-0.479-0.277-1.088-0.113-1.365,0.363l-5,8.664\r
		c-0.275,0.477-0.115,1.088,0.365,1.365c0.479,0.273,1.09,0.109,1.367-0.367l4.998-8.662C22.641,50.207,22.48,49.596,22,49.32z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M37.178,12.68c0.531,0.145,1.078-0.176,1.225-0.707l1.035-3.863\r
		c0.143-0.535-0.176-1.084-0.709-1.225c-0.531-0.145-1.08,0.172-1.223,0.707l-1.035,3.863C36.324,11.986,36.645,12.535,37.178,12.68\r
		z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M32,52c-0.553-0.002-0.998,0.445-1,0.998l0.002,10.004\r
		C31.002,63.551,31.445,64,32,64c0.553,0,1-0.449,1.001-1l-0.003-10.002C32.998,52.447,32.555,52,32,52z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M25.6,11.973c0.139,0.533,0.691,0.85,1.225,0.707\r
		c0.532-0.141,0.846-0.691,0.707-1.225l-1.035-3.863c-0.145-0.535-0.693-0.852-1.227-0.707c-0.531,0.143-0.85,0.689-0.705,1.225\r
		L25.6,11.973z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M43.363,49.686C43.088,49.209,42.48,49.043,42,49.32\r
		c-0.479,0.275-0.641,0.885-0.367,1.365l5.004,8.66c0.275,0.479,0.883,0.645,1.363,0.367c0.479-0.277,0.642-0.889,0.367-1.367\r
		L43.363,49.686z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M16.443,17.855c0.387,0.395,1.023,0.391,1.414,0\r
		c0.391-0.387,0.387-1.02,0-1.414l-2.828-2.828c-0.393-0.391-1.025-0.389-1.415,0.002c-0.39,0.389-0.392,1.021,0.001,1.412\r
		L16.443,17.855z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M59.348,46.633l-8.663-4.998\r
		c-0.478-0.275-1.087-0.115-1.363,0.367c-0.278,0.477-0.112,1.086,0.364,1.363l8.664,5c0.477,0.275,1.086,0.115,1.363-0.365\r
		C59.988,47.52,59.824,46.91,59.348,46.633z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M11.974,25.598L8.11,24.562c-0.536-0.143-1.083,0.176-1.225,0.709\r
		c-0.144,0.531,0.171,1.08,0.707,1.225l3.863,1.033c0.531,0.146,1.081-0.174,1.225-0.707C12.825,26.293,12.505,25.746,11.974,25.598\r
		z"/>\r
	<path fill-rule="evenodd" clip-rule="evenodd" fill="#394240" d="M32,20.002c-0.553,0-1,0.447-1,1s0.447,1,1,1\r
		c5.522,0,10,4.477,10,10c0,0.553,0.447,1,1,1s1-0.447,1-1C44,25.375,38.627,20.002,32,20.002z"/>\r
</g>\r
</svg>`, R4 = `<?xml version="1.0" encoding="iso-8859-1"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg height="800px" width="800px" version="1.1" id="_x34_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 viewBox="0 0 512 512"  xml:space="preserve">\r
<g>\r
	<g>\r
		<path style="fill:#F4F4F5;" d="M426.655,444.491c-85.064,74.278-206.9,83.839-299.319,29.581\r
			c-22.308-13.074-42.982-29.907-60.958-50.499C56,411.723,46.93,399.058,39.085,385.82C15.143,345.045,3.539,298.958,3.784,252.953\r
			c0.49-71.582,29.989-142.754,87.026-192.6C138.776,18.433,197.855-1.096,256.69,0.047c45.597,0.817,91.03,13.973,131.069,38.733\r
			c22.063,13.564,42.41,30.724,60.305,51.153c9.724,11.114,18.386,22.799,25.822,34.974\r
			C537.623,227.785,521.117,361.878,426.655,444.491z"/>\r
		<path style="fill:#EDEDEC;" d="M107.7,89.244c99.915-87.35,248.817-74.175,333.815,23.051\r
			c84.998,97.226,75.388,243.379-24.528,330.729c-99.915,87.35-251.727,82.317-336.725-14.908S7.784,176.594,107.7,89.244z"/>\r
		<g>\r
			<path style="fill:#D8D8D8;" d="M244.029,141.49c-17.92,37.27-63.032,51.341-100.302,33.421\r
				c-37.27-17.92-53.234-61.357-35.315-98.627c17.92-37.27,62.835-54.046,100.105-36.126\r
				C245.787,58.078,261.948,104.22,244.029,141.49z"/>\r
			<path style="opacity:0.06;fill:#040000;" d="M128.086,97.65c17.92-37.27,62.835-54.046,100.105-36.126\r
				c4.127,1.984,7.994,4.316,11.586,6.942c-7.335-11.909-17.95-21.909-31.26-28.308c-37.27-17.92-82.185-1.144-100.105,36.126\r
				c-15.805,32.872-5.247,70.538,23.036,91.265C118.963,147.091,116.789,121.146,128.086,97.65z"/>\r
		</g>\r
		<path style="fill:#D8D8D8;" d="M217.121,218.367c-1.17-5.733,2.71-11.178,8.442-12.348c5.733-1.17,11.248,2.359,12.418,8.091\r
			c1.17,5.733-2.456,11.466-8.189,12.635C224.06,227.916,218.291,224.099,217.121,218.367z"/>\r
		<path style="opacity:0.5;fill:#FFFFFF;" d="M363.151,96.945c-1.17-5.733,2.71-11.178,8.442-12.348s11.248,2.359,12.418,8.091\r
			c1.17,5.733-2.456,11.466-8.189,12.636C370.089,106.493,364.32,102.677,363.151,96.945z"/>\r
		<path style="fill:#D8D8D8;" d="M282.752,398.389c8.691-7.598,21.813-6.256,29.411,2.435c7.598,8.691,6.926,21.591-1.765,29.189\r
			c-8.691,7.598-22.059,6.972-29.657-1.719C273.143,419.603,274.061,405.987,282.752,398.389z"/>\r
		<path style="opacity:0.5;fill:#FFFFFF;" d="M58.327,220.961c-1.17-5.733,2.71-11.178,8.442-12.348\r
			c5.733-1.17,11.248,2.359,12.418,8.091s-2.456,11.466-8.189,12.636C65.265,230.51,59.496,226.694,58.327,220.961z"/>\r
		<path style="fill:#D8D8D8;" d="M468.947,281.701c-3.725,36.649-37.256,62.098-73.905,58.373\r
			c-36.649-3.725-63.177-35.279-59.452-71.928c3.725-36.649,36.272-64.305,72.921-60.58\r
			C445.16,211.292,472.673,245.052,468.947,281.701z"/>\r
		<g>\r
			<path style="fill:#D8D8D8;" d="M173.239,331.136c14.631,25.328,4.867,57.294-20.461,71.925\r
				c-25.328,14.631-57.07,6.642-71.701-18.686c-14.631-25.328-6.526-58.257,18.802-72.888\r
				C125.206,296.855,158.608,305.808,173.239,331.136z"/>\r
			<path style="opacity:0.06;fill:#040000;" d="M112.818,324.329c18.464-10.666,41.21-8.787,57.855,2.82\r
				c-15.693-22.238-46.847-29.497-70.794-15.663c-25.328,14.631-33.433,47.561-18.802,72.888c4.04,6.993,9.388,12.657,15.541,16.895\r
				c-0.915-1.299-1.788-2.644-2.602-4.052C79.385,371.89,87.49,338.96,112.818,324.329z"/>\r
		</g>\r
		<path style="opacity:0.06;fill:#040000;" d="M349.701,282.093c3.725-36.649,36.272-64.305,72.921-60.579\r
			c12.217,1.242,23.415,5.824,32.783,12.735c-11.007-14.534-27.694-24.73-46.893-26.682c-36.649-3.725-69.196,23.93-72.921,60.579\r
			c-2.465,24.247,8.316,46.261,26.506,59.464C352.777,315.06,347.969,299.128,349.701,282.093z"/>\r
	</g>\r
	<path style="opacity:0.1;fill:#040000;" d="M254.81,381.707c-105.358,0-198.419-52.064-254.72-131.654\r
		c-2.703,99.72,55.552,194.334,153.936,236.742c128.773,55.507,279.648,1.534,335.155-127.239\r
		c15.267-35.419,21.657-72.747,20.288-109.416C453.162,329.68,360.13,381.707,254.81,381.707z"/>\r
</g>\r
</svg>`, V4 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\r
<path d="M16.2857 20C19.4416 20 22 17.4717 22 14.3529C22 11.8811 20.393 9.78024 18.1551 9.01498C17.8371 6.19371 15.4159 4 12.4762 4C9.32028 4 6.7619 6.52827 6.7619 9.64706C6.7619 10.3369 6.88706 10.9978 7.11616 11.6089C6.8475 11.5567 6.56983 11.5294 6.28571 11.5294C3.91878 11.5294 2 13.4256 2 15.7647C2 18.1038 3.91878 20 6.28571 20H16.2857Z" fill="#1C274C"/>\r
</svg>`, L4 = `<?xml version="1.0" encoding="utf-8"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">\r
<g>\r
	<path fill="#394240" d="M47.231,20.893C47.727,19.35,48,17.707,48,16c0-8.836-7.163-16-16-16S16,7.164,16,16\r
		c0,1.707,0.273,3.35,0.769,4.893C10.505,23.062,6,28.998,6,36c0,8.836,7.163,16,16,16c2.125,0,4.146-0.43,6-1.184V63\r
		c0,0.553,0.447,1,1,1h6c0.553,0,1-0.447,1-1V50.816C37.854,51.57,39.875,52,42,52c8.837,0,16-7.164,16-16\r
		C58,28.998,53.495,23.062,47.231,20.893z M34,62h-4V49.842c0.7-0.406,1.371-0.859,2-1.363c0.629,0.504,1.3,0.957,2,1.363V62z\r
		 M42,50c-2.913,0-5.613-0.895-7.853-2.418L40.73,41H45c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4v-4c0-0.553-0.447-1-1-1s-1,0.447-1,1\r
		v4.898L33,45.9V45V33.414l3.718-3.717c0.391-0.391,0.392-1.025,0.001-1.416s-1.038-0.375-1.429,0.016L32,31.586l-3.332-3.332\r
		c-0.391-0.391-0.934-0.301-1.324,0.09c-0.392,0.393-0.435,0.982-0.044,1.373l3.7,3.699V45v0.898l-6-5.996V35c0-0.553-0.447-1-1-1\r
		s-1,0.447-1,1v4h-4c-0.553,0-1,0.447-1,1s0.447,1,1,1h4.27l6.583,6.582C27.613,49.105,24.913,50,22,50c-7.732,0-14-6.268-14-14\r
		c0-6.871,4.952-12.572,11.48-13.762C18.541,20.359,18,18.244,18,16c0-7.732,6.268-14,14-14s14,6.268,14,14\r
		c0,2.244-0.541,4.359-1.48,6.238C51.048,23.428,56,29.129,56,36C56,43.732,49.732,50,42,50z"/>\r
	<path fill="#506C7F" d="M34,62h-4V49.842c0.7-0.406,1.371-0.859,2-1.363c0.629,0.504,1.3,0.957,2,1.363V62z"/>\r
	<path fill="#B4CCB9" d="M42,50c-2.913,0-5.613-0.895-7.853-2.418L40.73,41H45c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4v-4\r
		c0-0.553-0.447-1-1-1s-1,0.447-1,1v4.898L33,45.9V45V33.414l3.718-3.717c0.391-0.391,0.392-1.025,0.001-1.416\r
		s-1.038-0.375-1.429,0.016L32,31.586l-3.332-3.332c-0.391-0.391-0.934-0.301-1.324,0.09c-0.392,0.393-0.435,0.982-0.044,1.373\r
		l3.7,3.699V45v0.898l-6-5.996V35c0-0.553-0.447-1-1-1s-1,0.447-1,1v4h-4c-0.553,0-1,0.447-1,1s0.447,1,1,1h4.27l6.583,6.582\r
		C27.613,49.105,24.913,50,22,50c-7.732,0-14-6.268-14-14c0-6.871,4.952-12.572,11.48-13.762C18.541,20.359,18,18.244,18,16\r
		c0-7.732,6.268-14,14-14s14,6.268,14,14c0,2.244-0.541,4.359-1.48,6.238C51.048,23.428,56,29.129,56,36C56,43.732,49.732,50,42,50z\r
		"/>\r
</g>\r
</svg>`, B4 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet"><linearGradient id="IconifyId17ecdb2904d178eab7809" gradientUnits="userSpaceOnUse" x1="47.489" y1="11.504" x2="51.02" y2="45.102"><stop offset=".171" stop-color="#01ab46"></stop><stop offset=".345" stop-color="#089e42"></stop><stop offset=".671" stop-color="#1a7a37"></stop><stop offset="1" stop-color="#2f502a"></stop></linearGradient><path d="M35.84 48.65s5.84-8.38 5.42-11.61c-.42-3.24-1.55-3.94-4.79-5.07c-3.24-1.13-5.14-2.89-5.14-2.89s-2.35-11.03-2.11-12.39c.28-1.62 6.12-12.53 19.99-12.53c13.37 0 18.86 11.22 18.16 19.85c-.63 7.81-3.52 10-5.56 16.47c-2.04 6.48-3.03 10.35-3.03 10.35l-12.04 2.46l-10.07-2.18l-.83-2.46z" fill="url(#IconifyId17ecdb2904d178eab7809)"></path><path d="M53.25 96.51s.75 7.64-.02 8.57c-.78.93-12.44 3.63-13.76 4.62c-1.43 1.07-.82 3.47 2.22 6.24s5.59 3.25 7.34 2.53c2.06-.84 5.63-3.57 7.23-4.79c1.28-.98 3.2-3.06 3.46-4.73c.27-1.67-.56-11.48-.56-11.48l-5.91-.96z" fill="#ff5d10"></path><path d="M68.45 99.19s1.1 8.92.56 10c-1.41 2.82-9.47 9.16-10 11.26c-.42 1.69 3.8 5.07 8.02 5.16c5.64.13 9.17-2.1 9.57-3.33c.56-1.74-1.55-11.97-1.83-12.53s.14-15.06.14-15.06l-6.46 4.5z" fill="#ff5d10"></path><path d="M98.66 54.49s4.8-.94 4.82-4.2c.01-3.26-1.74-1.84-1.76-4.21c-.02-2.37 4.24-2.93 7.04-.94c2.21 1.57 7.26 6.68 6.98 17.29c-.38 14.41-7.92 24.95-19.79 31.47c-9.68 5.31-23.96 4.68-23.96 4.68l26.67-44.09z" fill="#5e6367"></path><path d="M85.67 55.69c2.35-.28 12.66-3.54 16.33-2.6c4.43 1.13 8.85 4.25 7.95 14.15c-1.16 12.85-10.29 20.68-14.22 22.83C88.7 93.91 81.94 94 81.94 94s1.39-38.03 3.73-38.31z" fill="#b0b0b1"></path><path d="M7.12 25.07c0 1.2 7.46 4.72 14.5 5.56s11.4-.28 11.4-.28s-1.2-3.03-1.2-5.28s1.16-7.9-.63-9.22c-1.62-1.2-2.96 1.27-3.94 1.97c-.99.7-3.8 2.67-8.17 2.82s-8.17-.56-9.71.28s-2.25 2.88-2.25 4.15z" fill="#ffbf18"></path><path d="M50.2 20.77c-.42 1.75-1.61 3.12-3.94 2.75c-2.18-.35-3.24-2.6-2.6-4.79c.5-1.73 1.79-2.9 3.97-2.53c2.5.42 2.97 2.88 2.57 4.57z" fill="#2d2b33"></path><path d="M50.92 25.57c2.47-.78 4.3-.79 4.04-2.47c-.3-1.93-3.51-1.38-5.55-.3c-2.17 1.15-4.99 3.11-3.74 4.7c1.33 1.69 3.83-1.48 5.25-1.93z" fill="#73df86"></path><path d="M33.16 51.6s2.16 9.43 12.95 7.84c7.71-1.14 13.42-4.97 13.42-4.97l.09-6.29s-5.12 3-11.26 2.91c-6.38-.09-11.92-3.38-11.92-3.38l-3.28 3.89z" fill="#ffffff"></path><path d="M26.03 69.11C25.28 89.56 40.7 99.28 65.17 99.7c27.12.47 37.61-15.44 39.23-25.43c1.69-10.45-5.07-12.67-5.07-12.67s6.76-2.82 3.73-9.5c-1.41-.28-8.35 1.57-21.54.21c-13.1-1.35-22.08.94-22.08.94s-3.28 3.57-12.67 3.1c-11.25-.56-13.42-4.97-13.42-4.97s-6.85 5.01-7.32 17.73z" fill="#84574e"></path><path d="M52.03 73.14c2.28 7.9 10.42 12.67 22.52 12.11c10.98-.51 18.96-8.17 20.27-14.92c1.43-7.34-1.55-10.14-1.55-10.14s6.34-2.3 6.34-6.76c-3.57-2.16-14.92-3.66-27.5-4.13c-8.16-.3-12.76 2.72-12.76 2.72S47.8 58.5 52.03 73.14z" fill="#b79277"></path></svg>`, T4 = `<?xml version="1.0" encoding="iso-8859-1"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg version="1.1" id="_x36_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 viewBox="0 0 512 512"  xml:space="preserve">\r
<g>\r
	<g>\r
		<polygon style="fill:#B1ADAD;" points="284.992,270.581 284.327,379.931 265.243,399.08 272.332,406.143 294.309,384.088 \r
			295,270.647 		"/>\r
		\r
			<rect x="282.764" y="395.04" transform="matrix(-0.7667 -0.642 0.642 -0.7667 292.3463 906.3292)" style="fill:#B1ADAD;" width="56.182" height="10.009"/>\r
		\r
			<rect x="273.76" y="400.408" transform="matrix(-0.3786 -0.9255 0.9255 -0.3786 34.3183 833.8669)" style="fill:#B1ADAD;" width="46.616" height="10.011"/>\r
		<polygon style="fill:#B1ADAD;" points="305.75,288.004 352.857,386.695 344.029,412.268 353.489,415.539 363.66,386.082 \r
			314.78,283.691 		"/>\r
		<polygon style="fill:#B1ADAD;" points="357.04,391.242 411.523,404.932 413.959,395.223 359.477,381.534 		"/>\r
		\r
			<rect x="352.119" y="399.072" transform="matrix(-0.7445 -0.6676 0.6676 -0.7445 385.1607 955.562)" style="fill:#B1ADAD;" width="46.629" height="10.012"/>\r
	</g>\r
	<polygon style="fill:#AAD6A9;" points="464.563,98.477 462.828,98.143 414.791,148.649 373.492,296.365 332.193,320.183 \r
		323.519,325.187 294.563,341.8 284.555,347.605 283.488,348.206 205.894,312.377 68.32,442.746 59.647,450.952 24.019,401.18 \r
		25.62,399.979 136.106,317.448 17.614,389.638 0,370.022 131.703,293.762 18.281,348.005 8.073,321.251 209.23,241.922 \r
		325.654,119.226 336.796,52.174 325.654,19.015 297.899,10.207 337.13,0 372.758,24.686 442.479,32.158 455.022,57.178 \r
		459.759,57.979 462.828,83.598 	"/>\r
	<path style="fill:#FFFFFF;" d="M420.996,80.576c-1.381,8.36-9.284,14.008-17.637,12.608c-8.36-1.368-14.002-9.285-12.621-17.638\r
		c1.388-8.359,9.291-14.008,17.644-12.614C416.748,64.32,422.384,72.224,420.996,80.576z"/>\r
	<path style="fill:#AFAFAF;" d="M413.64,78.856c-0.664,3.988-4.431,6.672-8.412,6.001c-3.987-0.651-6.672-4.417-6.007-8.399\r
		c0.665-3.98,4.424-6.672,8.412-6.007C411.607,71.122,414.298,74.882,413.64,78.856z"/>\r
	<polygon style="fill:#A9C58E;" points="368.775,182.466 299.984,287.515 239.468,295.243 208.708,266.431 242.028,279.86 \r
		283.624,231.489 256.434,276.328 296.452,273.11 	"/>\r
	<polygon style="fill:#A9C58E;" points="351.469,158.867 331.076,192.48 337.552,171.344 	"/>\r
	<polygon style="fill:#A9C58E;" points="235.891,237.157 210.897,267.52 228.711,254.417 	"/>\r
	<g>\r
		<polygon style="fill:#F6E67B;" points="512,116.758 508.731,114.89 486.246,87.468 462.828,83.598 459.759,57.979 490.85,63.116 \r
			499.724,64.584 501.992,74.258 		"/>\r
		<polygon style="fill:#EECD65;" points="486.236,87.476 462.819,83.587 464.572,98.448 487.239,102.221 508.721,114.868 		"/>\r
	</g>\r
</g>\r
</svg>`, $4 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#3B88C3" d="M32.153 24c0-1 1.523-6.212 3.047-7.735c1.522-1.523 0-3.166-1.523-3.166c-3.405 0-9.139 6.901-9.139 10.901c0 5 5.733 10.424 9.139 10.424c1.523 0 3.046-1.404 1.523-2.928C33.677 29.974 32.153 26 32.153 24z"></path><path fill="#3B88C3" d="M9.021 14.384c0-3.046 1.497-6.093 3.02-6.093c4.569 0 13.322 4.823 14.845 12.439c1.524 7.616-17.865-6.346-17.865-6.346zm4.854 18.278c1.523 1.523 4.57 3.047 7.617 3.047c3.046 0-3.111-4.189-1.523-6.092c2.18-2.617-6.094 3.045-6.094 3.045z"></path><path d="M2.071 28.727c.761-2.285.19-3.935-1.143-5.584c-1.333-1.651 3.872-1.904 5.585.381s5.713 6.281 2.158 6.22c-3.553-.065-6.6-1.017-6.6-1.017z" fill="#000000"></path><path fill="#55ACEE" d="M.168 23.488c.959.874 7.223 4.309 7.165 5.137c-.058.828-2.279-.088-3.105-.279c-1.485-.342-1.905-.598-2.317-.526c-.84.321-.554 1.201-.242 1.704c1.498 2.61 7.286 4.662 12.16 4.662c8.412 0 16.802-7.615 16.802-10.662c0-3.046-9.345-10.663-17.757-10.663C4.483 12.86.18 18.922.168 23.488z"></path><path d="M7 17a2 2 0 1 1 .001 3.999A2 2 0 0 1 7 17z" fill="#000000"></path><path fill="#269" d="M15.08 29.98a.997.997 0 0 1-.885-1.463c1.585-3.034 2.218-5.768.154-9.243a1 1 0 0 1 1.72-1.022c2.693 4.535 1.46 8.202-.102 11.191a.999.999 0 0 1-.887.537z"></path></svg>`, G4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M564.9 273.2V106.9c0-0.9-0.7-1.6-1.6-1.6-0.1 0-0.5 0-0.9 0.3L478.9 189c-6.9 6.9-17.7 8-25.8 2.5-29.2-19.5-63.3-29.8-98.5-29.8s-69.3 10.3-98.5 29.8c-8.1 5.4-18.9 4.4-25.8-2.5l-83.4-83.4c-0.4-0.3-0.8-0.3-0.9-0.3-0.9 0-1.6 0.7-1.6 1.6v166.3c0 12.9 1.2 25.8 3.5 38.6l62.4 8.3c11.2 1.5 19.1 11.8 17.6 23-1.3 10.3-10.1 17.7-20.2 17.7-0.9 0-1.8 0-2.7-0.2l-45-6c2.9 7.6 6.2 15 9.9 22.3l36-3c11.3-1 21.2 7.4 22.1 18.6 1 11.2-7.4 21.1-18.6 22.1l-14.8 1.2c3.8 4.9 7.9 9.8 12.1 14.4 40.5 44.3 93.1 68.7 148 68.7s107.5-24.4 148-68.7c4.2-4.6 8.3-9.4 12.1-14.4l-14.8-1.2c-11.2-1-19.6-10.9-18.6-22.1 1-11.3 10.8-19.6 22.1-18.6l36.1 3c3.7-7.3 7-14.7 9.9-22.3l-45 6c-0.9 0.1-1.8 0.2-2.7 0.2-10.1 0-18.9-7.5-20.2-17.7-1.5-11.2 6.4-21.5 17.6-23l62.4-8.3c2.1-12.8 3.3-25.7 3.3-38.6z m283.6 570.3c65.7-109.7 30-250.7-81.3-320.9L573.4 400.1c-11 20.7-24.6 40.2-40.6 57.7-48.4 52.9-111.6 82-178.2 82-26.5 0-52.6-4.6-77.3-13.6-0.2 6.7-0.3 13.5-0.1 20.3 1.5 55.7 16.9 110.5 44.7 158.4 2.7 4.7 3.3 9.9 2.2 14.8V856c0 11.3-9.2 20.4-20.4 20.4h-21.2c-11.7 0-21.3 9.5-21.3 21.2v21.3h104.2c11.3 0 20.4-9.2 20.4-20.4v-151c0-11.3 9.1-20.4 20.4-20.4 11.3 0 20.4 9.1 20.4 20.4v130.7h20.2c7.5-27.4 32.6-47.7 62.4-47.7h29.4c-6.5-19.5-9.9-40-9.9-60.6 0-104.8 85.2-190 190-190 11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.2 20.4-20.4 20.4-82.2 0-149.1 66.9-149.1 149.2 0 24.9 6.3 49.5 18.1 71.3 3.5 6.3 3.3 14-0.4 20.2-3.7 6.2-10.4 10-17.6 10h-60.5c-13.1 0-23.8 10.7-23.8 23.8V919h233.3c47.2 0 92.1-22.7 120.1-60.8l9.7-14.7z m33-262.4V319.5c0-9.8-3.8-19-10.7-25.9-6.9-6.9-16.2-10.8-26-10.8-20.2 0-36.7 16.5-36.7 36.7v181.6c30.2 22.5 54.8 49.8 73.4 80z m40.9-261.6v397.8c0 0.4 0 0.8-0.1 1.2 1.2 49.8-11.3 100.3-38.8 146.2-0.1 0.2-0.3 0.5-0.4 0.7-0.1 0.1-0.1 0.2-0.2 0.2-3.3 5.7-6.9 11.2-10.8 16.4-35.6 48.8-93 77.9-153.4 77.9H485c-22.3 0-40.4-18.2-40.4-40.4v-0.5h-21.4c-8.4 23.8-31.2 40.9-57.8 40.9H259.6c-21.6 0-39.2-17.6-39.2-39.3v-22.9c0-34.3 27.9-62.1 62.1-62.1h0.8v-116c-29.1-52.4-45.3-111.7-46.9-171.9-0.4-13.5 0-26.9 1.1-40.1-22.1-12.9-42.6-29.6-61-49.7-46.3-50.7-72.9-118-72.9-184.7V106.9c0-23.4 19-42.5 42.5-42.5 10.8 0 21.1 4 28.9 11.4l0.5 0.5 72.4 72.4c32.5-18.3 69.1-27.8 106.8-27.8s74.2 9.6 106.8 27.8l72.4-72.4 0.5-0.5c7.9-7.3 18.2-11.4 28.9-11.4 23.4 0 42.5 19.1 42.5 42.5v166.3c0 30.1-5.4 60.4-15.7 89.1l177.1 111.9V319.5c0-42.8 34.8-77.6 77.6-77.6 20.7 0 40.2 8.1 54.8 22.7 14.7 14.7 22.8 34.2 22.8 54.9z" fill="#663333" /><path d="M881.5 319.5v261.6c-18.5-30.2-43.2-57.5-73.4-80V319.5c0-20.2 16.5-36.7 36.7-36.7 9.8 0 19 3.8 26 10.8 6.9 6.9 10.7 16.1 10.7 25.9z" fill="#B2ABAC" /><path d="M767.2 522.6c111.3 70.3 147 211.2 81.3 320.9l-9.7 14.8c-28 38-72.9 60.8-120.1 60.8H485.4v-23.8c0-13.1 10.7-23.8 23.8-23.8h60.5c7.2 0 13.9-3.8 17.6-10 3.7-6.2 3.8-13.9 0.4-20.2-11.8-21.7-18.1-46.4-18.1-71.3 0-82.3 66.9-149.2 149.1-149.2 11.3 0 20.4-9.2 20.4-20.4 0-11.3-9.2-20.4-20.4-20.4-104.8 0-190 85.2-190 190 0 20.6 3.4 41.1 9.9 60.6h-29.4c-29.8 0-54.9 20.2-62.4 47.7h-20.2V747.5c0-11.3-9.2-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v151.1c0 11.3-9.2 20.4-20.4 20.4H261.2v-21.3c0-11.7 9.5-21.2 21.3-21.2h21.2c11.3 0 20.4-9.2 20.4-20.4V719.8c1.1-4.9 0.5-10.1-2.2-14.8-27.8-47.9-43.2-102.7-44.7-158.4-0.2-6.8-0.1-13.6 0.1-20.3 24.8 8.9 50.8 13.6 77.3 13.6 66.6 0 129.8-29.1 178.2-82 16-17.5 29.6-37 40.6-57.7l193.8 122.4z" fill="#B2ABAC" /><path d="M821.1 682.6c11 44.8 4.2 91.4-19.2 131.2-3.8 6.5-10.6 10.1-17.6 10.1-3.5 0-7.1-0.9-10.3-2.8-9.8-5.7-13-18.2-7.3-28 18-30.6 23.2-66.4 14.7-100.8-2.7-11 4-22 15-24.7 10.9-2.6 22 4.1 24.7 15z" fill="#663333" /><path d="M564.9 106.9v166.3c0 12.9-1.2 25.8-3.5 38.6L499 320c-11.2 1.5-19.1 11.8-17.6 23 1.4 10.3 10.1 17.7 20.2 17.7 0.9 0 1.8-0.1 2.7-0.2l45-6c-2.9 7.6-6.2 15-9.9 22.3l-36.1-3c-11.3-1-21.1 7.4-22.1 18.6-0.9 11.2 7.4 21.1 18.6 22.1l14.8 1.2c-3.8 4.9-7.9 9.8-12.1 14.4-40.5 44.3-93.1 68.7-148 68.7s-107.5-24.4-148-68.7c-4.2-4.6-8.3-9.4-12.1-14.4l14.8-1.2c11.2-1 19.6-10.9 18.6-22.1-0.9-11.3-10.8-19.6-22.1-18.6l-36 3c-3.7-7.3-7-14.7-9.9-22.3l45 6c0.9 0.1 1.8 0.2 2.7 0.2 10.1 0 18.9-7.5 20.2-17.7 1.5-11.2-6.4-21.5-17.6-23l-62.4-8.3c-2.3-12.8-3.5-25.7-3.5-38.6V106.9c0-0.9 0.7-1.6 1.6-1.6 0.1 0 0.5 0 0.9 0.3l83.4 83.4c6.9 6.9 17.7 8 25.8 2.5 29.2-19.5 63.3-29.8 98.5-29.8s69.3 10.3 98.5 29.8c8.1 5.4 18.9 4.4 25.8-2.5l83.4-83.4c0.4-0.3 0.8-0.3 0.9-0.3 1.1 0 1.9 0.7 1.9 1.6z" fill="#B2ABAC" /><path d="M481.4 277.9m-20 0a20 20 0 1 0 40 0 20 20 0 1 0-40 0Z" fill="#663333" /><path d="M414.5 356.4c5 8.8 1.9 20.1-6.9 25.1-7.4 4.2-15.7 6.4-24 6.4-3.4 0-6.7-0.3-10-1-6.9-1.5-13.3-4.4-18.9-8.5-5.5 4.1-11.9 7-18.8 8.5-3.3 0.7-6.7 1-10 1-8.4 0-16.7-2.2-24.1-6.4-8.8-5-11.9-16.3-6.9-25.1 5-8.9 16.3-11.9 25.1-6.9 1.8 1 4.7 2.1 8.4 1.3 4.2-0.9 7.6-3.9 8.9-8 3.1-9.6 13.5-14.9 23.2-11.8 5.8 1.9 10 6.4 11.8 11.8 1.3 4 4.7 7.1 8.9 8 3.7 0.8 6.6-0.3 8.4-1.3 8.6-5 19.9-1.9 24.9 6.9z" fill="#663333" /><path d="M227.8 277.9m-20 0a20 20 0 1 0 40 0 20 20 0 1 0-40 0Z" fill="#663333" /></svg>`, H4 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#D99E82" d="M31.034 14.374c3.508-.65 3.587-6.297-.051-6.254c-2.847.034-2.56 2.795-2.945 2.252c-.748-1.055-.989-3.769 1.862-4.894c2.461-.971 5.846.996 6.063 4.591c.139 2.302-1.297 6.554-6.453 5.846c-7.222-.991-1.983-.892 1.524-1.541z"></path><path fill="#C1694F" d="M10.321 21.935s1.016 2.352.676 8.242c-.061 1.057-.209 2.136-.242 3.022c-1.812 0-1.652 2.064-1.268 2.064h2.902c.683 0 1.893-3.438 2.212-8.209c.319-4.772-4.28-5.119-4.28-5.119zm11.89-.331s.575 3.528 3.651 6.413c.257 1.163.769 4.232.949 5.195c-1.889 0-1.282 2.047-.731 2.047h2.646c.951 0 1.092-3.442.206-7.694c-.885-4.251-6.721-5.961-6.721-5.961z"></path><path fill="#D99E82" d="M32.202 15.654c-1.253-3.752-7.214-3.628-13.997-2.765c-3.055.389-3.64-4.453-3.64-5.286c0-3.626-3.244-5.455-6.496-4.229c-.779.293-1.402 1.33-1.754 1.872c-1.977 3.037-4.658.015-4.917 2.822c-.313 3.395 1.721 4.534 5.051 4.821c1.892.163 3.459 1.095 3.871 5.044c.154 1.472-.295 5.644 2.388 7.076c.78 2.959 1.836 6.615 2.25 8.475c-2.252.476-1.341 2.179-1.341 2.179s3.151-.043 3.836-.043c.814 0 .191-5.976-.935-9.787c4.764.043 7.828-1.337 8.799-1.762c1.028 2.96 4.152 3.633 4.851 4.892c.433.78 1.878 3.383 2.001 4.496c-1.602.52-1.091 1.732-.909 2.122c1.083-.043 3.22-.043 3.498-.043c1.11 0-1.137-6.904-2.083-8.713c-1.082-2.071.781-7.419-.473-11.171z"></path><path fill="#F4C7B5" d="M16.266 24.464c.044.371.141.891.253 1.369c4.764.043 7.828-1.337 8.799-1.762c-.215-.78-.23-1.27-.171-1.538c-3.394.557-4.548 2.205-8.881 1.931zM6.449 12.889c1.892.163 2.425 1.069 2.838 5.018c.154 1.472.739 5.67 3.421 7.102c-.72-2.788-1.959-12.388-6.259-12.12z"></path><path fill="#F4C7B5" d="M3.153 6.665c-2.793 0-1.909.526-2.002 1.692c-.093 1.166-.074 2.976.776 3.929c1.127 1.262 3.858 1.266 5.215.277s-.424-5.898-3.989-5.898z"></path><path fill="#272B2B" d="M2.503 8.326c-.109.762-.494 1.192-.879 1.133C.864 9.342.232 8.372.232 7.603s.624-.963 1.392-.928c1.043.048 1.002.788.879 1.651z"></path><path fill="#662113" d="M15.167 9.026c.348 2.515-1.157 2.898-2.383 2.898s-3.054-1.25-2.748-3.77c.134-1.107.555-2.193.809-3.175c.336-1.303 1.199-1.732 1.894-1.367c1.665.874 2.203 3.797 2.428 5.414z"></path><circle fill="#292F33" cx="8.069" cy="6.675" r=".928"></circle><path fill="#C1694F" d="M19.035 12.789c.073 1.532.906 3.178 2.733 3.663c1.901.505 4.12.127 4.67-2.475c.091-.43.13-1.224.073-1.514c-2.151-.179-4.73 0-7.476.326z"></path><circle fill="#D99E82" cx="3.053" cy="10.503" r=".488"></circle><circle fill="#D99E82" cx="3.695" cy="9.804" r=".269"></circle><circle fill="#D99E82" cx="4.1" cy="10.503" r=".269"></circle></svg>`, U4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M224 453.5l13.4-117.8h152.5v-45.5h100.4V134.9h87v318.6H224" fill="#B6CDEF" /><path d="M577.3 468.5H224c-4.3 0-8.3-1.8-11.2-5-2.8-3.2-4.2-7.4-3.7-11.7L222.5 334c0.9-7.6 7.3-13.3 14.9-13.3H375v-30.5c0-8.3 6.7-15 15-15h85.4V134.9c0-8.3 6.7-15 15-15h87c8.3 0 15 6.7 15 15v318.5c-0.1 8.3-6.8 15.1-15.1 15.1z m-336.5-30h321.5V149.9h-57v140.2c0 8.3-6.7 15-15 15h-85.4v30.5c0 8.3-6.7 15-15 15H250.8l-10 87.9z" fill="#0F53A8" /><path d="M788.7 619.4H130.3V490.7c0-35.3 28.6-64 64-64h503.5l90.9 192.7z" fill="#B6CDEF" /><path d="M788.7 634.4H130.3c-8.3 0-15-6.7-15-15V490.7c0-43.5 35.4-79 79-79h503.5c5.8 0 11.1 3.3 13.6 8.6l91 192.7c2.2 4.6 1.9 10.1-0.9 14.4-2.8 4.4-7.6 7-12.8 7z m-643.4-30h619.8l-76.8-162.7h-494c-27 0-49 22-49 49v113.7z" fill="#0F53A8" /><path d="M141 865.6h637s116.4-212.8 224.8-283.7H28.6S109.3 709 141 865.6z" fill="#B6CDEF" /><path d="M778 880.6H141c-7.1 0-13.3-5-14.7-12C95.6 716.7 16.7 591.2 15.9 590c-2.9-4.6-3.1-10.5-0.5-15.3 2.6-4.8 7.7-7.8 13.1-7.8h974.3c6.6 0 12.5 4.4 14.4 10.7 1.9 6.4-0.6 13.2-6.2 16.8-104 68.2-218.7 276.3-219.8 278.4-2.6 4.8-7.7 7.8-13.2 7.8z m-624.8-30h616.1c9.8-17.2 35.1-60.6 68.2-108.8 43.5-63.3 84.2-111.8 121.6-145H54.8c8.2 14.6 19.4 35.6 31.7 61.7 21.3 45.4 49.6 114.6 66.7 192.1z" fill="#0F53A8" /><path d="M743.2 523H237.4v-44.6h484.8z" fill="#89B7F5" /><path d="M743.2 538H237.4c-8.3 0-15-6.7-15-15v-44.6c0-8.3 6.7-15 15-15h484.8c5.8 0 11.1 3.3 13.6 8.6l21.1 44.6c2.2 4.6 1.9 10.1-0.9 14.4-2.8 4.4-7.6 7-12.8 7z m-490.8-30h467.2l-6.9-14.6H252.4V508z" fill="#0F53A8" /><path d="M497 327.7h136.5v99H497z" fill="#89B7F5" /><path d="M633.5 441.7H497c-8.3 0-15-6.7-15-15v-99c0-8.3 6.7-15 15-15h136.5c8.3 0 15 6.7 15 15v99c0 8.3-6.7 15-15 15z m-121.5-30h106.5v-69H512v69z" fill="#0F53A8" /><path d="M185.6 705m-19.6 0a19.6 19.6 0 1 0 39.2 0 19.6 19.6 0 1 0-39.2 0Z" fill="#89B7F5" /><path d="M185.6 734.7c-16.3 0-29.6-13.3-29.6-29.6s13.3-29.6 29.6-29.6 29.6 13.3 29.6 29.6-13.2 29.6-29.6 29.6z m0-39.3c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#0F53A8" /><path d="M268.7 705m-19.6 0a19.6 19.6 0 1 0 39.2 0 19.6 19.6 0 1 0-39.2 0Z" fill="#89B7F5" /><path d="M268.7 734.7c-16.3 0-29.6-13.3-29.6-29.6s13.3-29.6 29.6-29.6 29.6 13.3 29.6 29.6-13.2 29.6-29.6 29.6z m0-39.3c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#0F53A8" /><path d="M351.8 705m-19.6 0a19.6 19.6 0 1 0 39.2 0 19.6 19.6 0 1 0-39.2 0Z" fill="#89B7F5" /><path d="M351.8 734.7c-16.3 0-29.6-13.3-29.6-29.6s13.3-29.6 29.6-29.6 29.6 13.3 29.6 29.6-13.2 29.6-29.6 29.6z m0-39.3c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#0F53A8" /><path d="M434.9 705m-19.6 0a19.6 19.6 0 1 0 39.2 0 19.6 19.6 0 1 0-39.2 0Z" fill="#89B7F5" /><path d="M434.9 734.7c-16.3 0-29.6-13.3-29.6-29.6s13.3-29.6 29.6-29.6 29.6 13.3 29.6 29.6-13.2 29.6-29.6 29.6z m0-39.3c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#0F53A8" /><path d="M518 705m-19.6 0a19.6 19.6 0 1 0 39.2 0 19.6 19.6 0 1 0-39.2 0Z" fill="#89B7F5" /><path d="M518 734.7c-16.3 0-29.6-13.3-29.6-29.6s13.3-29.6 29.6-29.6 29.6 13.3 29.6 29.6-13.2 29.6-29.6 29.6z m0-39.3c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#0F53A8" /><path d="M601.1 705m-19.6 0a19.6 19.6 0 1 0 39.2 0 19.6 19.6 0 1 0-39.2 0Z" fill="#89B7F5" /><path d="M601.1 734.7c-16.3 0-29.6-13.3-29.6-29.6s13.3-29.6 29.6-29.6 29.6 13.3 29.6 29.6-13.2 29.6-29.6 29.6z m0-39.3c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#0F53A8" /><path d="M684.2 705m-19.6 0a19.6 19.6 0 1 0 39.2 0 19.6 19.6 0 1 0-39.2 0Z" fill="#89B7F5" /><path d="M684.2 734.7c-16.3 0-29.6-13.3-29.6-29.6s13.3-29.6 29.6-29.6 29.6 13.3 29.6 29.6-13.2 29.6-29.6 29.6z m0-39.3c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#0F53A8" /><path d="M767.3 705m-19.6 0a19.6 19.6 0 1 0 39.2 0 19.6 19.6 0 1 0-39.2 0Z" fill="#89B7F5" /><path d="M767.3 734.7c-16.3 0-29.6-13.3-29.6-29.6s13.3-29.6 29.6-29.6S797 688.7 797 705s-13.3 29.7-29.7 29.7z m0-39.3c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#0F53A8" /></svg>`, I4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M611.474286 626.102857c77.531429 0 143.36 40.96 172.617143 100.937143 51.2 10.24 92.16 46.811429 103.862857 92.16 36.571429 7.314286 64.365714 38.034286 64.365714 73.142857 0 40.96-36.571429 74.605714-83.382857 74.605714-17.554286 0-35.108571-5.851429-48.274286-14.628571-19.017143 8.777143-40.96 14.628571-62.902857 14.628571-23.405714 0-46.811429-5.851429-65.828571-16.091428-23.405714 10.24-51.2 16.091429-78.994286 16.091428-29.257143 0-57.051429-5.851429-80.457143-16.091428-20.48 8.777143-42.422857 14.628571-67.291429 14.628571-74.605714 0-134.582857-54.125714-134.582857-121.417143 0-59.977143 48.274286-109.714286 111.177143-119.954285 27.794286-57.051429 93.622857-98.011429 169.691429-98.011429z" fill="#FEFEFE" /><path d="M868.937143 977.188571c-17.554286 0-35.108571-4.388571-49.737143-13.165714-40.96 17.554286-89.234286 17.554286-128.731429-1.462857-49.737143 19.017143-108.251429 19.017143-159.451428 0-20.48 10.24-43.885714 14.628571-67.291429 14.628571-80.457143 0-144.822857-58.514286-144.822857-131.657142 0-62.902857 48.274286-115.565714 114.102857-128.731429 33.645714-61.44 103.862857-100.937143 179.931429-100.937143s146.285714 39.497143 179.931428 102.4c51.2 11.702857 92.16 46.811429 105.325715 93.622857 39.497143 11.702857 65.828571 43.885714 65.828571 81.92-1.462857 45.348571-43.885714 83.382857-95.085714 83.382857z m-48.274286-35.108571c1.462857 0 4.388571 0 5.851429 1.462857 13.165714 8.777143 27.794286 13.165714 42.422857 13.165714 39.497143 0 73.142857-29.257143 73.142857-64.365714 0-29.257143-23.405714-55.588571-55.588571-62.902857-4.388571-1.462857-7.314286-4.388571-7.314286-7.314286-10.24-42.422857-48.274286-76.068571-96.548572-84.845714-2.925714 0-5.851429-2.925714-7.314285-5.851429-29.257143-57.051429-93.622857-95.085714-163.84-95.085714S476.891429 672.914286 447.634286 731.428571c-1.462857 2.925714-4.388571 4.388571-7.314286 5.851429-58.514286 10.24-102.4 55.588571-102.4 109.714286 0 61.44 55.588571 111.177143 124.342857 111.177143 21.942857 0 43.885714-5.851429 62.902857-14.628572 2.925714-1.462857 5.851429-1.462857 8.777143 0 48.274286 20.48 103.862857 20.48 152.137143 0 2.925714-1.462857 5.851429-1.462857 8.777143 0 36.571429 19.017143 83.382857 19.017143 119.954286 1.462857 2.925714-2.925714 4.388571-2.925714 5.851428-2.925714z" fill="#141515" /><path d="M444.708571 58.514286c-86.308571 0-160.914286 46.811429-194.56 114.102857-58.514286 10.24-103.862857 52.662857-117.028571 103.862857-40.96 8.777143-71.68 42.422857-71.68 81.92 0 46.811429 42.422857 84.845714 93.622857 84.845714 20.48 0 39.497143-5.851429 55.588572-16.091428 21.942857 10.24 45.348571 16.091429 71.68 16.091428 27.794286 0 52.662857-5.851429 74.605714-17.554285 27.794286 11.702857 57.051429 17.554286 89.234286 17.554285 32.182857 0 62.902857-7.314286 90.697142-19.017143 21.942857 11.702857 48.274286 19.017143 76.068572 19.017143 83.382857 0 152.137143-61.44 152.137143-137.508571 0-67.291429-54.125714-122.88-124.342857-134.582857C605.622857 105.325714 531.017143 58.514286 444.708571 58.514286z" fill="#7ADCFF" /><path d="M611.474286 453.485714c-26.331429 0-52.662857-5.851429-76.068572-17.554285-57.051429 23.405714-122.88 23.405714-179.931428 1.462857-45.348571 20.48-100.937143 21.942857-146.285715 1.462857-16.091429 10.24-35.108571 14.628571-55.588571 14.628571-57.051429 0-103.862857-42.422857-103.862857-95.085714 0-42.422857 30.72-78.994286 73.142857-90.697143 16.091429-52.662857 61.44-92.16 118.491429-105.325714 36.571429-70.217143 115.565714-114.102857 201.874285-114.102857 84.845714 0 163.84 43.885714 201.874286 114.102857 74.605714 14.628571 128.731429 74.605714 128.731429 143.36 0 81.92-73.142857 147.748571-162.377143 147.748571z m-76.068572-39.497143c1.462857 0 2.925714 0 4.388572 1.462858 21.942857 11.702857 46.811429 17.554286 71.68 17.554285 77.531429 0 141.897143-57.051429 141.897143-125.805714 0-61.44-48.274286-114.102857-115.565715-124.342857-2.925714 0-5.851429-2.925714-7.314285-5.851429-32.182857-65.828571-105.325714-106.788571-184.32-106.788571-80.457143 0-152.137143 42.422857-185.782858 108.251428-1.462857 2.925714-4.388571 4.388571-7.314285 5.851429-54.125714 10.24-98.011429 48.274286-109.714286 96.548571-1.462857 4.388571-4.388571 7.314286-7.314286 7.314286-38.034286 8.777143-64.365714 38.034286-64.365714 71.68 0 40.96 38.034286 74.605714 83.382857 74.605714 17.554286 0 35.108571-4.388571 49.737143-14.628571 2.925714-1.462857 7.314286-2.925714 10.24 0 42.422857 20.48 95.085714 19.017143 137.508571-1.462857 2.925714-1.462857 5.851429-1.462857 8.777143 0 54.125714 21.942857 118.491429 21.942857 172.617143-1.462857-1.462857-2.925714 0-2.925714 1.462857-2.925715z" fill="#141515" /><path d="M241.371429 509.074286L683.154286 263.314286c136.045714-76.068571 251.611429-38.034286 310.125714 108.251428 26.331429 65.828571-57.051429 124.342857-108.251429 140.434286L277.942857 713.874286c-58.514286 20.48-74.605714-14.628571-92.16-58.514286-42.422857-103.862857-23.405714-103.862857 55.588572-146.285714z" fill="#EEECF6" /><path d="M247.222857 729.965714c-43.885714 0-58.514286-39.497143-71.68-70.217143-39.497143-100.937143-24.868571-114.102857 43.885714-152.137142 5.851429-2.925714 10.24-5.851429 16.091429-8.777143l441.782857-245.76c46.811429-26.331429 92.16-39.497143 134.582857-39.497143 84.845714 0 150.674286 52.662857 190.171429 152.137143 8.777143 20.48 7.314286 42.422857-2.925714 64.365714-20.48 42.422857-71.68 76.068571-112.64 90.697143L280.868571 724.114286c-13.165714 4.388571-23.405714 5.851429-33.645714 5.851428z m564.662857-494.445714c-38.034286 0-80.457143 11.702857-124.342857 36.571429L245.76 517.851429c-5.851429 2.925714-11.702857 5.851429-16.091429 8.777142-62.902857 35.108571-70.217143 38.034286-35.108571 125.805715 14.628571 35.108571 24.868571 57.051429 52.662857 57.051428 7.314286 0 17.554286-1.462857 27.794286-5.851428l607.085714-203.337143c36.571429-11.702857 83.382857-43.885714 99.474286-78.994286 7.314286-16.091429 8.777143-32.182857 1.462857-48.274286-36.571429-89.234286-95.085714-137.508571-171.154286-137.508571z" fill="#141515" /><path d="M686.08 261.851429c124.342857-61.44 226.742857-40.96 288.182857 70.217142-23.405714 14.628571-49.737143 24.868571-78.994286 32.182858-99.474286 20.48-191.634286-23.405714-207.725714-96.548572 0-2.925714 0-4.388571-1.462857-5.851428z" fill="#90CED9" /><path d="M845.531429 378.88c-86.308571 0-155.062857-45.348571-168.228572-109.714286 0-1.462857-1.462857-4.388571-1.462857-5.851428 0-4.388571 1.462857-8.777143 5.851429-10.24 46.811429-23.405714 90.697143-35.108571 131.657142-35.108572 71.68 0 130.194286 38.034286 169.691429 109.714286 2.925714 4.388571 1.462857 10.24-2.925714 13.165714-24.868571 16.091429-52.662857 26.331429-83.382857 33.645715-16.091429 2.925714-33.645714 4.388571-51.2 4.388571z m-147.748572-111.177143c11.702857 54.125714 73.142857 90.697143 147.748572 90.697143 16.091429 0 30.72-1.462857 46.811428-4.388571 24.868571-4.388571 46.811429-13.165714 67.291429-24.868572-35.108571-59.977143-84.845714-90.697143-146.285715-90.697143-35.108571-1.462857-73.142857 8.777143-115.565714 29.257143z" fill="#141515" /><path d="M532.48 507.611429L346.697143 909.897143c102.4-68.754286 153.6-102.4 216.502857-206.262857l171.154286-285.257143-201.874286 89.234286z" fill="#AFCEE9" /><path d="M348.16 921.6c-2.925714 0-4.388571-1.462857-7.314286-2.925714-2.925714-2.925714-4.388571-7.314286-2.925714-11.702857l185.782857-402.285715c1.462857-2.925714 2.925714-4.388571 5.851429-5.851428L732.891429 409.6c4.388571-1.462857 8.777143-1.462857 11.702857 2.925714 2.925714 2.925714 2.925714 8.777143 1.462857 11.702857L573.44 709.485714C512 813.348571 457.874286 848.457143 362.788571 912.822857l-8.777142 5.851429c-2.925714 1.462857-4.388571 2.925714-5.851429 2.925714zM541.257143 516.388571l-168.228572 365.714286c81.92-55.588571 127.268571-90.697143 182.857143-182.857143l155.062857-257.462857L541.257143 516.388571z" fill="#141515" /><path d="M637.805714 286.72l-206.262857 4.388571C321.828571 294.034286 277.942857 314.514286 179.931429 365.714286l245.76 29.257143 212.114285-108.251429z" fill="#AFCEE9" /><path d="M425.691429 405.211429s-1.462857 0 0 0l-247.222858-29.257143c-4.388571 0-8.777143-4.388571-8.777142-8.777143-1.462857-4.388571 1.462857-8.777143 5.851428-11.702857 96.548571-49.737143 141.897143-73.142857 256-76.068572l206.262857-4.388571c4.388571 0 8.777143 2.925714 10.24 7.314286 1.462857 4.388571-1.462857 10.24-5.851428 11.702857l-212.114286 108.251428c-1.462857 2.925714-2.925714 2.925714-4.388571 2.925715z m-212.114286-45.348572l209.188571 24.868572 168.228572-86.308572-160.914286 4.388572c-96.548571 1.462857-141.897143 19.017143-216.502857 57.051428z" fill="#141515" /><path d="M32.182857 532.48l38.034286-19.017143c26.331429-13.165714 68.754286-8.777143 95.085714 10.24l119.954286 84.845714-106.788572 43.885715-146.285714-103.862857c-7.314286-5.851429-7.314286-13.165714 0-16.091429z" fill="#AFCEE9" /><path d="M179.931429 662.674286c-1.462857 0-4.388571 0-5.851429-1.462857L27.794286 555.885714c-7.314286-4.388571-10.24-11.702857-10.24-19.017143 0-5.851429 4.388571-11.702857 10.24-16.091428l38.034285-19.017143c27.794286-14.628571 77.531429-10.24 106.788572 10.24l119.954286 84.845714c2.925714 1.462857 4.388571 5.851429 4.388571 10.24 0 4.388571-2.925714 7.314286-5.851429 8.777143l-106.788571 43.885714c-2.925714 2.925714-4.388571 2.925714-4.388571 2.925715z m-140.434286-122.88l141.897143 99.474285 83.382857-35.108571-103.862857-76.068571c-14.628571-10.24-33.645714-16.091429-54.125715-16.091429-11.702857 0-23.405714 2.925714-30.72 7.314286l-36.571428 20.48z" fill="#141515" /><path d="M184.32 653.897143L117.028571 808.96l80.457143-27.794286 84.845715-172.617143z" fill="#EEECF6" /><path d="M117.028571 820.662857c-2.925714 0-5.851429-1.462857-7.314285-2.925714-2.925714-2.925714-2.925714-7.314286-1.462857-11.702857l65.828571-155.062857c1.462857-2.925714 2.925714-4.388571 5.851429-5.851429l99.474285-45.348571c4.388571-1.462857 8.777143-1.462857 11.702857 1.462857s4.388571 7.314286 1.462858 11.702857l-84.845715 174.08c-1.462857 2.925714-2.925714 2.925714-5.851428 4.388571L121.417143 819.2c-1.462857 0-2.925714 1.462857-4.388572 1.462857z m74.605715-159.451428l-55.588572 130.194285 54.125715-19.017143 70.217142-143.36-68.754285 32.182858z" fill="#141515" /><path d="M291.108571 566.125714c-4.388571 0-7.314286-1.462857-8.777142-5.851428-2.925714-5.851429 0-11.702857 4.388571-13.165715l393.508571-190.171428c5.851429-2.925714 11.702857 0 13.165715 4.388571 2.925714 5.851429 0 11.702857-4.388572 13.165715l-393.508571 190.171428c-1.462857 1.462857-2.925714 1.462857-4.388572 1.462857z" fill="#141515" /><path d="M882.102857 377.417143c-2.925714 0-7.314286-1.462857-8.777143-4.388572l-89.234285-140.434285c-2.925714-4.388571-1.462857-11.702857 2.925714-14.628572s11.702857-1.462857 14.628571 2.925715l89.234286 140.434285c2.925714 4.388571 1.462857 11.702857-2.925714 14.628572-1.462857 1.462857-4.388571 1.462857-5.851429 1.462857z" fill="#141515" /></svg>`, W4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M248.685714 435.931429h533.942857c90.697143 0 163.84 73.142857 163.84 163.84v163.84h-863.085714V601.234286c0-90.697143 74.605714-165.302857 165.302857-165.302857z" fill="#64B829" /><path d="M956.708571 775.314286H73.142857V601.234286c0-96.548571 78.994286-174.08 174.08-174.08h533.942857c96.548571 0 174.08 78.994286 174.08 174.08V775.314286z m-863.085714-20.48H936.228571V601.234286c0-84.845714-68.754286-153.6-153.6-153.6H248.685714c-84.845714 0-153.6 68.754286-153.6 153.6v153.6z" fill="#141515" /><path d="M430.08 765.074286H83.382857v-100.937143c23.405714-76.068571 90.697143-130.194286 169.691429-130.194286 99.474286 0 179.931429 84.845714 179.931428 190.171429 1.462857 14.628571 0 27.794286-2.925714 40.96z" fill="#B2D577" /><path d="M438.857143 775.314286H73.142857v-114.102857c26.331429-81.92 98.011429-137.508571 179.931429-137.508572 105.325714 0 190.171429 90.697143 190.171428 201.874286 0 14.628571-1.462857 27.794286-4.388571 42.422857v7.314286zM93.622857 754.834286h326.217143c1.462857-10.24 2.925714-20.48 2.925714-29.257143 0-99.474286-76.068571-179.931429-169.691428-179.931429-71.68 0-136.045714 48.274286-159.451429 121.417143v87.771429z" fill="#141515" /><path d="M946.468571 626.102857v138.971429H596.845714c-2.925714-13.165714-4.388571-26.331429-4.388571-39.497143C592.457143 614.4 677.302857 526.628571 781.165714 526.628571c71.68 0 131.657143 39.497143 165.302857 99.474286z" fill="#B2D577" /><path d="M956.708571 775.314286H588.068571l-1.462857-8.777143c-2.925714-13.165714-4.388571-27.794286-4.388571-42.422857 0-115.565714 89.234286-209.188571 198.948571-209.188572 71.68 0 137.508571 40.96 174.08 105.325715l1.462857 2.925714V775.314286z m-351.085714-20.48H936.228571V629.028571c-32.182857-57.051429-90.697143-92.16-153.6-92.16-98.011429 0-178.468571 84.845714-178.468571 188.708572-1.462857 8.777143 0 19.017143 1.462857 29.257143z" fill="#141515" /><path d="M83.382857 693.394286h861.622857v71.68H83.382857z" fill="#97CA1B" /><path d="M956.708571 775.314286H73.142857v-92.16h883.565714V775.314286z m-863.085714-20.48H936.228571v-51.2H93.622857v51.2z" fill="#141515" /><path d="M490.057143 194.56c152.137143 0 285.257143 106.788571 307.2 242.834286H247.222857c-8.777143 0-17.554286 0-26.331428 1.462857 0-136.045714 117.028571-244.297143 269.165714-244.297143z" fill="#97CA1B" /><path d="M210.651429 450.56V438.857143c0-64.365714 24.868571-125.805714 71.68-172.617143 52.662857-52.662857 127.268571-81.92 207.725714-81.92 155.062857 0 295.497143 109.714286 317.44 251.611429l1.462857 13.165714-13.165714-1.462857H247.222857c-8.777143 0-16.091429 0-24.868571 1.462857l-11.702857 1.462857zM490.057143 204.8c-76.068571 0-144.822857 26.331429-193.097143 76.068571-39.497143 39.497143-62.902857 90.697143-64.365714 146.285715H785.554286C757.76 301.348571 631.954286 204.8 490.057143 204.8z" fill="#141515" /><path d="M747.52 437.394286H263.314286c24.868571-106.788571 115.565714-184.32 229.668571-184.32 114.102857 0 215.04 77.531429 254.537143 184.32z" fill="#90CED9" /><path d="M762.148571 447.634286h-512l2.925715-13.165715c26.331429-115.565714 122.88-191.634286 239.908571-191.634285 115.565714 0 222.354286 76.068571 264.777143 191.634285l4.388571 13.165715z m-485.668571-20.48H731.428571C690.468571 327.68 595.382857 263.314286 492.982857 263.314286s-187.245714 64.365714-216.502857 163.84z" fill="#141515" /><path d="M469.577143 437.394286h-43.885714v-175.542857c13.165714-4.388571 27.794286-7.314286 43.885714-8.777143v184.32z" fill="#97CA1B" /><path d="M479.817143 447.634286h-64.365714V254.537143l7.314285-1.462857c14.628571-4.388571 29.257143-7.314286 45.348572-8.777143l11.702857-1.462857v204.8z m-42.422857-20.48h21.942857v-160.914286l-21.942857 4.388571v156.525715z" fill="#141515" /><path d="M264.777143 829.44c57.051429 0 103.862857-46.811429 103.862857-103.862857s-46.811429-103.862857-103.862857-103.862857c-57.051429 0-103.862857 46.811429-103.862857 103.862857s46.811429 103.862857 103.862857 103.862857z" fill="#A1A69C" /><path d="M264.777143 839.68c-62.902857 0-114.102857-51.2-114.102857-114.102857s51.2-114.102857 114.102857-114.102857 114.102857 51.2 114.102857 114.102857-51.2 114.102857-114.102857 114.102857z m0-209.188571c-51.2 0-93.622857 42.422857-93.622857 93.622857 0 51.2 42.422857 93.622857 93.622857 93.622857s93.622857-42.422857 93.622857-93.622857c0-51.2-42.422857-93.622857-93.622857-93.622857z" fill="#141515" /><path d="M264.777143 725.577143m-49.737143 0a49.737143 49.737143 0 1 0 99.474286 0 49.737143 49.737143 0 1 0-99.474286 0Z" fill="#DAD9B4" /><path d="M264.777143 784.091429c-32.182857 0-59.977143-26.331429-59.977143-59.977143 0-32.182857 26.331429-59.977143 59.977143-59.977143 32.182857 0 59.977143 26.331429 59.977143 59.977143s-27.794286 59.977143-59.977143 59.977143z m0-98.011429c-21.942857 0-39.497143 17.554286-39.497143 39.497143 0 21.942857 17.554286 39.497143 39.497143 39.497143 21.942857 0 39.497143-17.554286 39.497143-39.497143-1.462857-21.942857-17.554286-39.497143-39.497143-39.497143z" fill="#141515" /><path d="M773.851429 829.44c57.051429 0 103.862857-46.811429 103.862857-103.862857s-46.811429-103.862857-103.862857-103.862857c-57.051429 0-103.862857 46.811429-103.862858 103.862857s45.348571 103.862857 103.862858 103.862857z" fill="#A1A69C" /><path d="M773.851429 839.68c-62.902857 0-114.102857-51.2-114.102858-114.102857s51.2-114.102857 114.102858-114.102857 114.102857 51.2 114.102857 114.102857-51.2 114.102857-114.102857 114.102857z m0-209.188571c-51.2 0-93.622857 42.422857-93.622858 93.622857 0 51.2 42.422857 93.622857 93.622858 93.622857 51.2 0 93.622857-42.422857 93.622857-93.622857 0-51.2-42.422857-93.622857-93.622857-93.622857z" fill="#141515" /><path d="M773.851429 725.577143m-49.737143 0a49.737143 49.737143 0 1 0 99.474285 0 49.737143 49.737143 0 1 0-99.474285 0Z" fill="#DAD9B4" /><path d="M773.851429 784.091429c-32.182857 0-59.977143-26.331429-59.977143-59.977143 0-32.182857 26.331429-59.977143 59.977143-59.977143 32.182857 0 59.977143 26.331429 59.977142 59.977143-1.462857 33.645714-27.794286 59.977143-59.977142 59.977143z m0-98.011429c-21.942857 0-39.497143 17.554286-39.497143 39.497143 0 21.942857 17.554286 39.497143 39.497143 39.497143 21.942857 0 39.497143-17.554286 39.497142-39.497143-1.462857-21.942857-19.017143-39.497143-39.497142-39.497143z" fill="#141515" /><path d="M449.097143 645.12c-5.851429 0-10.24-4.388571-10.24-10.24v-144.822857c0-5.851429 4.388571-10.24 10.24-10.24s10.24 4.388571 10.24 10.24v144.822857c0 5.851429-4.388571 10.24-10.24 10.24z" fill="#141515" /><path d="M661.211429 396.434286h76.068571c7.314286 0 14.628571 5.851429 14.628571 14.628571v36.571429c0 7.314286-5.851429 14.628571-14.628571 14.628571h-76.068571c-7.314286 0-14.628571-5.851429-14.628572-14.628571V409.6c0-7.314286 7.314286-13.165714 14.628572-13.165714z" fill="#DAE483" /><path d="M737.28 471.04h-76.068571c-13.165714 0-24.868571-11.702857-24.868572-24.868571V409.6c0-13.165714 11.702857-24.868571 24.868572-24.868571h76.068571c13.165714 0 24.868571 11.702857 24.868571 24.868571v36.571429c0 13.165714-11.702857 24.868571-24.868571 24.868571z m-76.068571-64.365714c-2.925714 0-4.388571 1.462857-4.388572 4.388571v36.571429c0 2.925714 1.462857 4.388571 4.388572 4.388571h76.068571c2.925714 0 4.388571-1.462857 4.388571-4.388571V409.6c0-2.925714-1.462857-4.388571-4.388571-4.388571h-76.068571z" fill="#141515" /><path d="M43.885714 689.005714h71.68v32.182857H43.885714z" fill="#6E7377" /><path d="M117.028571 731.428571H43.885714c-5.851429 0-10.24-4.388571-10.24-10.24v-32.182857c0-5.851429 4.388571-10.24 10.24-10.24h73.142857c5.851429 0 10.24 4.388571 10.24 10.24v32.182857c0 5.851429-5.851429 10.24-10.24 10.24z m-62.902857-20.48h51.2v-11.702857H54.125714v11.702857z" fill="#141515" /><path d="M896.731429 610.011429h64.365714c10.24 0 19.017143 8.777143 19.017143 19.017142v10.24c0 10.24-8.777143 19.017143-19.017143 19.017143h-64.365714c-10.24 0-19.017143-8.777143-19.017143-19.017143V629.028571c0-11.702857 8.777143-19.017143 19.017143-19.017142z" fill="#FFE638" /><path d="M961.097143 668.525714h-64.365714c-16.091429 0-29.257143-13.165714-29.257143-29.257143V629.028571c0-16.091429 13.165714-29.257143 29.257143-29.257142h64.365714c16.091429 0 29.257143 13.165714 29.257143 29.257142v10.24c0 16.091429-13.165714 29.257143-29.257143 29.257143z m-64.365714-48.274285c-4.388571 0-8.777143 4.388571-8.777143 8.777142v10.24c0 4.388571 4.388571 8.777143 8.777143 8.777143h64.365714c4.388571 0 8.777143-4.388571 8.777143-8.777143V629.028571c0-4.388571-4.388571-8.777143-8.777143-8.777142h-64.365714z" fill="#141515" /><path d="M934.765714 560.274286m-32.182857 0a32.182857 32.182857 0 1 0 64.365714 0 32.182857 32.182857 0 1 0-64.365714 0Z" fill="#FCDD10" /><path d="M934.765714 602.697143c-23.405714 0-42.422857-19.017143-42.422857-42.422857 0-23.405714 19.017143-42.422857 42.422857-42.422857s42.422857 19.017143 42.422857 42.422857c1.462857 23.405714-19.017143 42.422857-42.422857 42.422857z m0-64.365714c-11.702857 0-21.942857 10.24-21.942857 21.942857s10.24 21.942857 21.942857 21.942857 21.942857-10.24 21.942857-21.942857-8.777143-21.942857-21.942857-21.942857z" fill="#141515" /><path d="M507.611429 361.325714c-2.925714 0-5.851429-1.462857-7.314286-2.925714-4.388571-4.388571-4.388571-10.24 0-14.628571l46.811428-46.811429c4.388571-4.388571 10.24-4.388571 14.628572 0 4.388571 4.388571 4.388571 10.24 0 14.628571l-46.811429 46.811429c-1.462857 2.925714-4.388571 2.925714-7.314285 2.925714z" fill="#141515" /><path d="M514.925714 415.451429c-2.925714 0-5.851429-1.462857-7.314285-2.925715-4.388571-4.388571-4.388571-10.24 0-14.628571l84.845714-87.771429c4.388571-4.388571 10.24-4.388571 14.628571 0 4.388571 4.388571 4.388571 10.24 0 14.628572l-84.845714 87.771428c-1.462857 2.925714-4.388571 2.925714-7.314286 2.925715z" fill="#141515" /></svg>`, O4 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#EA596E" d="M7 24c1.957 0 3.633 1.135 4.455 2.772l3.477-1.739C13.488 22.058 10.446 20 6.916 20a8.862 8.862 0 0 0-3.649.787l1.668 3.67A4.971 4.971 0 0 1 7 24zm22 0c1.467 0 2.772.643 3.688 1.648l2.897-2.635A8.884 8.884 0 0 0 28.916 20c-3.576 0-6.652 2.111-8.073 5.15l3.648 1.722C25.293 25.18 27.003 24 29 24z"></path><path fill="#292F33" d="M7 22a7 7 0 1 0 0 14a7 7 0 0 0 0-14zm0 12a5 5 0 1 1 0-10a5 5 0 0 1 0 10zm22-12a7 7 0 1 0 .001 14.001A7 7 0 0 0 29 22zm0 12a5 5 0 1 1 0-10a5 5 0 0 1 0 10z"></path><path fill="#DD2E44" d="M29.984 28.922a.98.98 0 0 0-.04-.198a1.02 1.02 0 0 0-.071-.186c-.013-.024-.015-.052-.029-.075l-7-11a1 1 0 0 0-1.381-.307a.982.982 0 0 0-.445.843H12a1 1 0 1 0 0 2h10c.027 0 .05-.014.077-.016L27.178 28H18a1 1 0 1 0 0 2h11.001a1.008 1.008 0 0 0 .44-.112c.031-.017.066-.024.097-.044c.03-.02.048-.051.075-.072a.948.948 0 0 0 .251-.297c.03-.056.055-.11.075-.172a.98.98 0 0 0 .04-.201c.004-.036.021-.066.021-.102c0-.027-.014-.051-.016-.078z"></path><path fill="#DD2E44" d="M21.581 16l-2.899 8.117l-5.929-6.775a1 1 0 1 0-1.505 1.317l6.664 7.615l-.854 2.39a1 1 0 0 0 1.884.672L23.705 16h-2.124z"></path><path fill="#DD2E44" d="M7 30a1 1 0 0 1-.893-1.447l3.062-6.106C9.186 22.419 11 19.651 11 17c0-3.242-2.293-4.043-2.316-4.051a1 1 0 1 1 .633-1.897C9.467 11.102 13 12.333 13 17c0 3.068-1.836 6.042-2.131 6.497l-2.974 5.949A.997.997 0 0 1 7 30z"></path><path fill="#292F33" d="M14.612 13.663a.927.927 0 0 1-.165-.014l-6-1a1 1 0 0 1 .329-1.973l6 1a1 1 0 0 1-.164 1.987zM26.383 17a.665.665 0 0 1-.089-.006l-5.672-.708a.708.708 0 0 1 .087-1.413c.041 0 4.067-.018 5.989-1.299a.713.713 0 0 1 .824.026a.712.712 0 0 1 .241.788l-.709 2.127a.705.705 0 0 1-.671.485z"></path><path fill="#66757F" d="M20 29a2 2 0 1 1-4 0a2 2 0 0 1 4 0z"></path></svg>`, P4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 544V64a64 64 0 0 0-64-64H320a64 64 0 0 0-64 64v480h512z" fill="#84BF56" /><path d="M256 512h512v32H256z" fill="" /><path d="M608 160m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="" /><path d="M512 288m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="" /><path d="M416 160m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="" /><path d="M608 416m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="" /><path d="M416 416m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="" /><path d="M256 992a32 32 0 1 0 64 0V672H256v320zM704 672v320a32 32 0 1 0 64 0V672h-64z" fill="#434854" /><path d="M832 640a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32v64z" fill="#84BF56" /><path d="M800 544H224a32 32 0 0 0-32 32v32a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32v-32a32 32 0 0 0-32-32z" fill="#FFFFFF" /><path d="M704 672h64v32h-64zM256 672h64v32H256z" fill="" /></svg>`, Y4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M704 405.333333h-97.770667v64H704c47.061333 0 85.333333 38.272 85.333333 85.674667 0 0.362667-3.029333 37.269333-30.4 92.010667l-7.658666 15.509333C720.597333 724.864 706.602667 746.666667 670.229333 746.666667h-64v64h64c79.466667 0 109.461333-60.949333 138.474667-119.893334l7.488-15.125333C850.730667 606.549333 853.44 558.954667 853.333333 554.666667c0-82.325333-67.008-149.333333-149.333333-149.333334z" fill="#C62828" /><path d="M532.629333 318.037333l-6.784-9.728c-2.496-4.032-24.533333-40.490667-24.533333-75.264 0-20.885333 8.021333-33.813333 13.866667-43.221333 4.650667-7.509333 7.466667-12.010667 7.466666-20.778667 0-19.157333-13.077333-44.586667-18.154666-52.778666l-6.037334-9.770667 36.181334-22.464 6.122666 9.728c2.496 4.032 24.533333 40.490667 24.533334 75.264 0 20.906667-8.021333 33.834667-13.866667 43.264-4.650667 7.488-7.466667 12.010667-7.466667 20.736 0 19.157333 13.077333 44.586667 18.154667 52.778667l6.698667 9.770666-36.181334 22.464zM426.282667 318.037333l-6.784-9.728c-2.496-4.032-24.533333-40.490667-24.533334-75.264 0-20.885333 8.021333-33.813333 13.866667-43.221333 4.650667-7.509333 7.466667-12.010667 7.466667-20.778667 0-19.157333-13.077333-44.586667-18.154667-52.778666l-6.037333-9.770667 36.181333-22.464 6.122667 9.728c2.496 4.032 24.533333 40.490667 24.533333 75.264 0 20.906667-8.021333 33.834667-13.866667 43.264-4.650667 7.488-7.466667 12.010667-7.466666 20.736 0 19.157333 13.077333 44.586667 18.154666 52.778667l6.698667 9.770666-36.181333 22.464zM319.957333 318.037333l-6.784-9.728c-2.496-4.032-24.533333-40.490667-24.533333-75.264 0-20.885333 8.021333-33.813333 13.866667-43.221333 4.650667-7.509333 7.466667-12.010667 7.466666-20.778667 0-19.157333-13.077333-44.586667-18.154666-52.778666l-6.037334-9.770667 36.181334-22.464 6.122666 9.728c2.496 4.032 24.533333 40.490667 24.533334 75.264 0 20.906667-8.021333 33.834667-13.866667 43.264-4.650667 7.488-7.466667 12.010667-7.466667 20.736 0 19.157333 13.077333 44.586667 18.154667 52.778667l6.698667 9.770666-36.181334 22.464z" fill="#BCAAA4" /><path d="M682.666667 309.333333a32 32 0 0 0-32-32h-448A32 32 0 0 0 170.666667 309.333333S170.666667 597.333333 234.666667 938.666667h384c64-341.333333 64-629.333333 64-629.333334z" fill="#F44336" /></svg>`, N4 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\r
<path opacity="0.5" d="M16.1557 3.31738L18.3344 4.62987L18.617 8.15786C18.6247 8.25408 18.6286 8.3022 18.6315 8.34785C18.737 10.0069 18.0957 11.6201 16.8963 12.7129C16.8633 12.743 16.8279 12.7741 16.7572 12.8363C16.6885 12.8968 16.6541 12.9271 16.6208 12.9571C15.4234 14.0356 14.576 15.4739 14.1945 17.0755C14.1839 17.12 14.1735 17.1656 14.1528 17.257L13.9018 18.365C13.5684 19.8367 13.4016 20.5725 13.0506 21.0359C12.5153 21.7423 11.6734 22.1191 10.8113 22.0382C10.2458 21.9851 9.6161 21.6057 8.35666 20.847L7.68411 20.4419C6.42467 19.6832 5.79495 19.3039 5.46815 18.8195C4.96988 18.0809 4.86171 17.1317 5.18044 16.2949C5.38948 15.746 5.91688 15.2274 6.97166 14.1903L7.7658 13.4094C7.83127 13.345 7.86401 13.3129 7.89565 13.281C9.03421 12.1355 9.80432 10.6507 10.1008 9.02942C10.109 8.98436 10.117 8.93816 10.1328 8.84574C10.1491 8.75076 10.1572 8.70327 10.1657 8.65842C10.473 7.02824 11.4914 5.64211 12.9212 4.90793C12.9605 4.88772 13.0024 4.86715 13.0861 4.826L16.1557 3.31738Z" fill="#1C274C"/>\r
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.8963 12.7126C17.9626 11.741 18.5878 10.3581 18.6393 8.89733L17.0427 9.42951C16.1617 9.72318 15.1919 9.55021 14.4667 8.97007C13.6329 8.30298 12.4872 8.18161 11.5321 8.65917L10.0618 9.39432L10.0207 9.41484C9.67894 10.8853 8.94327 12.2266 7.89565 13.2807C7.86401 13.3125 7.83127 13.3447 7.7658 13.4091L6.97166 14.1899C5.91688 15.227 5.38948 15.7456 5.18044 16.2945C4.86171 17.1314 4.96988 18.0805 5.46815 18.8191C5.79495 19.3035 6.42467 19.6828 7.68411 20.4415L8.35666 20.8467C9.6161 21.6054 10.2458 21.9847 10.8113 22.0378C11.6734 22.1188 12.5153 21.7419 13.0506 21.0355C13.4016 20.5722 13.5684 19.8363 13.9018 18.3646L14.1528 17.2566C14.1735 17.1653 14.1839 17.1196 14.1945 17.0751C14.576 15.4735 15.4234 14.0352 16.6208 12.9567C16.6541 12.9267 16.6885 12.8965 16.7572 12.836C16.8279 12.7737 16.8633 12.7426 16.8963 12.7126Z" fill="#1C274C"/>\r
<path d="M16.1553 3.31715L18.334 4.62964L18.7947 3.79714C18.9274 3.55722 18.9938 3.43725 18.9992 3.3188C19.0039 3.21456 18.9763 3.1114 18.9201 3.02346C18.8563 2.92353 18.7388 2.85278 18.504 2.71129L17.7136 2.23518C17.4626 2.08397 17.3371 2.00836 17.2128 2.00091C17.1036 1.99436 16.9952 2.02339 16.9038 2.08365C16.7999 2.15219 16.7289 2.28039 16.5871 2.5368L16.1553 3.31715Z" fill="#1C274C"/>\r
</svg>`, Z4 = `<?xml version="1.0" encoding="utf-8"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">\r
<g>\r
	<path fill="#F9EBB2" d="M56,62H10c-2.209,0-4-1.791-4-4s1.791-4,4-4h46V62z"/>\r
	<g>\r
		<path fill="#45AAB8" d="M6,4v49.537C7.062,52.584,8.461,52,10,52h2V2H8C6.896,2,6,2.896,6,4z"/>\r
		<path fill="#45AAB8" d="M56,2H14v50h42h2v-2V4C58,2.896,57.104,2,56,2z"/>\r
	</g>\r
	<g>\r
		<path fill="#394240" d="M60,52V4c0-2.211-1.789-4-4-4H8C5.789,0,4,1.789,4,4v54c0,3.313,2.687,6,6,6h49c0.553,0,1-0.447,1-1\r
			s-0.447-1-1-1h-1v-8C59.104,54,60,53.104,60,52z M6,4c0-1.104,0.896-2,2-2h4v50h-2c-1.539,0-2.938,0.584-4,1.537V4z M56,62H10\r
			c-2.209,0-4-1.791-4-4s1.791-4,4-4h46V62z M56,52H14V2h42c1.104,0,2,0.896,2,2v46v2H56z"/>\r
		<path fill="#394240" d="M43,26H23c-0.553,0-1,0.447-1,1s0.447,1,1,1h20c0.553,0,1-0.447,1-1S43.553,26,43,26z"/>\r
		<path fill="#394240" d="M49,20H23c-0.553,0-1,0.447-1,1s0.447,1,1,1h26c0.553,0,1-0.447,1-1S49.553,20,49,20z"/>\r
		<path fill="#394240" d="M23,16h12c0.553,0,1-0.447,1-1s-0.447-1-1-1H23c-0.553,0-1,0.447-1,1S22.447,16,23,16z"/>\r
	</g>\r
	<path opacity="0.2" fill="#231F20" d="M6,4v49.537C7.062,52.584,8.461,52,10,52h2V2H8C6.896,2,6,2.896,6,4z"/>\r
</g>\r
</svg>`, X4 = `<?xml version="1.0" encoding="iso-8859-1"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg height="800px" width="800px" version="1.1" id="_x34_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 viewBox="0 0 512 512"  xml:space="preserve">\r
<g>\r
	<g>\r
		<polygon style="fill:#FBE6B7;" points="180.006,414.017 171.785,422.16 115.097,478.926 115.019,478.926 113.923,480.023 \r
			113.844,479.945 113.375,479.474 113.297,479.474 73.6,439.701 72.895,439.074 72.19,438.29 32.494,398.671 31.867,398.046 \r
			97.95,331.961 		"/>\r
		<path style="fill:#FFFFFF;" d="M511.439,67.631c-0.627,2.739-2.036,5.402-4.15,7.516l-35.938,35.937l-7.673,7.673l-4.15,4.15\r
			c-6.264,6.264-16.599,6.264-22.941,0l-23.724-23.724L389.06,75.38c-6.342-6.341-6.342-16.676,0-22.941l4.15-4.15l7.673-7.673\r
			l9.552-9.552L436.743,4.68c2.114-2.114,4.776-3.525,7.595-4.15c5.324-1.409,11.275,0,15.425,4.15l23.724,23.803l23.802,23.722\r
			C511.439,56.355,512.848,62.305,511.439,67.631z"/>\r
		<polygon style="fill:#F9F5AB;" points="477.145,116.88 404.72,189.306 363.692,148.276 322.664,107.248 395.089,34.823 \r
			471.351,111.085 		"/>\r
		<polygon style="fill:#EA5346;" points="486.697,107.248 477.145,116.88 469.472,124.473 463.678,118.757 393.21,48.29 \r
			387.416,42.498 404.641,25.271 480.903,101.533 		"/>\r
		<polygon style="fill:#E4AC23;" points="417.874,176.072 404.72,189.306 309.901,284.123 180.006,414.017 171.785,422.16 \r
			130.835,381.134 89.808,340.105 97.95,331.961 227.845,202.067 322.664,107.248 335.818,94.095 376.846,135.122 		"/>\r
		<path style="fill:#FBE6B7;" d="M115.019,478.926l-1.096,0.314l-0.548,0.235h-0.078l-72.112,20.907\r
			c-0.078-0.157-0.157-0.237-0.157-0.392c-3.132-6.029-7.125-11.745-12.214-16.835c-5.089-5.089-10.805-9.16-16.912-12.215\r
			c-0.078-0.076-0.235-0.076-0.313-0.157l20.906-72.112l0.235-0.703l0.314-1.097l0.861,0.862L74.07,437.9l1.488,1.487l38.601,38.6\r
			L115.019,478.926z"/>\r
		<path style="fill:#595A59;" d="M41.654,499.833l-0.626,0.157l-0.078,0.078l-26.543,7.751L0,511.969l4.15-14.407l7.751-26.622\r
			l0.235-0.703c6.186,3.131,12.058,7.203,17.226,12.372C34.529,487.775,38.601,493.647,41.654,499.833z"/>\r
		<polygon style="fill:#E4AC23;" points="309.901,284.123 180.006,414.017 115.097,478.926 113.766,480.258 113.844,479.945 \r
			113.923,479.239 114.158,477.987 122.457,431.087 75.557,439.387 73.6,439.701 71.955,440.012 71.877,440.012 72.19,438.29 \r
			72.504,436.333 80.803,389.432 33.903,397.732 32.728,397.968 31.945,398.124 31.789,398.124 97.95,331.961 227.845,202.067 		"/>\r
	</g>\r
	<g>\r
		<polygon style="fill:#FBE6B7;" points="180.006,414.017 171.785,422.16 115.097,478.926 115.019,478.926 113.923,480.023 \r
			113.844,479.945 113.375,479.474 113.297,479.474 73.6,439.701 72.895,439.074 72.19,438.29 32.494,398.671 31.867,398.046 \r
			97.95,331.961 		"/>\r
		<path style="fill:#FFFFFF;" d="M511.439,67.631c-0.627,2.739-2.036,5.402-4.15,7.516l-35.938,35.937l-7.673,7.673l-4.15,4.15\r
			c-6.264,6.264-16.599,6.264-22.941,0l-23.724-23.724L389.06,75.38c-6.342-6.341-6.342-16.676,0-22.941l4.15-4.15l7.673-7.673\r
			l9.552-9.552L436.743,4.68c2.114-2.114,4.776-3.525,7.595-4.15c5.324-1.409,11.275,0,15.425,4.15l23.724,23.803l23.802,23.722\r
			C511.439,56.355,512.848,62.305,511.439,67.631z"/>\r
		<polygon style="fill:#F9F5AB;" points="477.145,116.88 404.72,189.306 363.692,148.276 322.664,107.248 395.089,34.823 \r
			471.351,111.085 		"/>\r
		<polygon style="fill:#EA5346;" points="486.697,107.248 477.145,116.88 469.472,124.473 463.678,118.757 393.21,48.29 \r
			387.416,42.498 404.641,25.271 480.903,101.533 		"/>\r
		<polygon style="fill:#E4AC23;" points="417.874,176.072 404.72,189.306 309.901,284.123 180.006,414.017 171.785,422.16 \r
			130.835,381.134 89.808,340.105 97.95,331.961 227.845,202.067 322.664,107.248 335.818,94.095 376.846,135.122 		"/>\r
		<path style="fill:#FBE6B7;" d="M115.019,478.926l-1.096,0.314l-0.548,0.235h-0.078l-72.112,20.907\r
			c-0.078-0.157-0.157-0.237-0.157-0.392c-3.132-6.029-7.125-11.745-12.214-16.835c-5.089-5.089-10.805-9.16-16.912-12.215\r
			c-0.078-0.076-0.235-0.076-0.313-0.157l20.906-72.112l0.235-0.703l0.314-1.097l0.861,0.862L74.07,437.9l1.488,1.487l38.601,38.6\r
			L115.019,478.926z"/>\r
		<path style="fill:#595A59;" d="M41.654,499.833l-0.626,0.157l-0.078,0.078l-26.543,7.751L0,511.969l4.15-14.407l7.751-26.622\r
			l0.235-0.703c6.186,3.131,12.058,7.203,17.226,12.372C34.529,487.775,38.601,493.647,41.654,499.833z"/>\r
		<polygon style="fill:#E4AC23;" points="309.901,284.123 180.006,414.017 115.097,478.926 113.766,480.258 113.844,479.945 \r
			113.923,479.239 114.158,477.987 122.457,431.087 75.557,439.387 73.6,439.701 71.955,440.012 71.877,440.012 72.19,438.29 \r
			72.504,436.333 80.803,389.432 33.903,397.732 32.728,397.968 31.945,398.124 31.789,398.124 97.95,331.961 227.845,202.067 		"/>\r
	</g>\r
	<path style="opacity:0.08;fill:#040000;" d="M480.94,101.506l26.324-26.324c6.315-6.315,6.314-16.646,0-22.961L483.5,28.457\r
		L0.016,511.941l40.964-11.888c0.056,0.11,0.124,0.215,0.178,0.325l72.172-20.943l0.49,0.49l-0.056,0.317l0.187-0.187l57.868-57.868\r
		l8.176-8.176l129.927-129.927l94.799-94.799l13.182-13.182l51.598-51.598l7.613-7.613l9.608-9.608L480.94,101.506z"/>\r
</g>\r
</svg>`, q4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M709.404444 769.706667c0 12.151467-1.797689 24.2688-5.358933 35.9424-0.443733 1.479111-0.932978 2.946844-1.422222 4.414577a123.733333 123.733333 0 0 1-116.929422 83.1488H256.170667a123.676444 123.676444 0 0 1-118.351645-87.563377 123.471644 123.471644 0 0 1-4.118755-53.327645l65.080889-455.998578a99.885511 99.885511 0 0 1 98.929777-85.663288h135.975823L699.960889 694.704356v0.022755l8.214755 57.605689c0.796444 5.757156 1.2288 11.582578 1.2288 17.373867z" fill="#DD852C" /><path d="M708.175644 752.3328l-2.025244-14.062933a113.095111 113.095111 0 0 1-3.538489 12.333511 123.744711 123.744711 0 0 1-116.929422 83.160178H337.863111c-41.961244 0-76.9024-33.1776-77.778489-75.047823a40.2432 40.2432 0 0 1 0.295822-6.382933l65.080889-455.9872a99.885511 99.885511 0 0 1 98.929778-85.663289H297.710933a99.874133 99.874133 0 0 0-98.929777 85.663289L133.688889 752.3328a123.448889 123.448889 0 0 0 48.810667 116.610844 123.676444 123.676444 0 0 0 73.659733 24.280178h329.5232a123.710578 123.710578 0 0 0 118.351644-87.563378 123.574044 123.574044 0 0 0 4.141511-53.327644z" fill="#C16D21" /><path d="M709.404444 769.706667c0 12.151467-1.797689 24.2688-5.358933 35.9424-0.443733 1.479111-34.440533 54.772622-34.440533 54.772622 39.799467-90.7264-90.271289-277.572267-90.271289-277.572267a8.487822 8.487822 0 0 0-11.480178-3.401955 8.487822 8.487822 0 0 1-11.491555-3.424711l-32.631467-60.154312a33.359644 33.359644 0 0 0-24.428089-16.952888c-54.897778-8.385422-105.3696-41.380978-133.859556-93.889423-34.645333-63.840711-27.420444-139.138844 12.3904-194.366577h55.842134L699.960889 694.692978v0.022755l8.226133 57.605689c0.785067 5.768533 1.217422 11.593956 1.217422 17.385245z" fill="#C16D21" /><path d="M939.3152 798.651733l-57.218844 94.549334-84.241067-18.102045-164.408889-302.933333-14.893511 8.044089-21.208178-39.105422-23.699911-43.690667a184.718222 184.718222 0 0 1-82.3296-25.315556 181.930667 181.930667 0 0 1-47.763911-40.766577 183.284622 183.284622 0 0 1-19.956622-29.559467c-48.310044-89.019733-15.1552-200.271644 74.023822-248.467911a183.216356 183.216356 0 0 1 118.089955-19.569778 184.615822 184.615822 0 0 1 92.103112 44.293689 182.954667 182.954667 0 0 1 38.786844 49.152c5.677511 10.467556 10.24 21.253689 13.710222 32.210489a183.250489 183.250489 0 0 1-15.439644 145.464889l44.919466 82.796089-14.893511 8.044088 46.364445 85.435734 4.4032 67.959466 54.601955 40.800712 4.425956 67.936711 54.624711 40.823466z" fill="#FFCA6C" /><path d="M674.986667 154.612622L491.3152 472.098133a182.146844 182.146844 0 0 1-47.763911-40.766577L615.708444 133.723022c20.753067 3.515733 40.846222 10.581333 59.278223 20.8896zM760.308622 259.390578l-162.963911 281.713778-23.699911-43.690667a184.718222 184.718222 0 0 1-45.556622-8.715378L707.811556 178.028089a182.954667 182.954667 0 0 1 38.786844 49.152c5.677511 10.478933 10.251378 21.253689 13.710222 32.210489z" fill="#FFEEA9" /><path d="M505.582933 258.548622a49.163378 49.072356 0 1 0 98.326756 0 49.163378 49.072356 0 1 0-98.326756 0Z" fill="#845521" /><path d="M509.622044 877.897956H256.170667a107.633778 107.633778 0 0 1-64.523378-21.276445 107.463111 107.463111 0 0 1-39.150933-55.421155 108.657778 108.657778 0 0 1-3.606756-46.705778l7.805156-54.692978a15.36 15.36 0 0 0-30.378667-4.312178l-7.805156 54.704356a139.855644 139.855644 0 0 0 4.630756 59.938133 137.853156 137.853156 0 0 0 50.232889 71.111111 138.24 138.24 0 0 0 82.796089 27.283911h253.451377a15.325867 15.325867 0 1 0 0-30.628977z" fill="" /><path d="M948.497067 786.386489L899.538489 749.795556l-3.948089-60.916623a15.291733 15.291733 0 0 0-6.109867-11.264l-48.969955-36.579555-3.948089-60.916622a15.587556 15.587556 0 0 0-1.809067-6.314667l-39.071289-71.953067 1.399467-0.762311c7.452444-4.027733 10.217244-13.312 6.189511-20.753067l-40.994133-75.537066a199.748267 199.748267 0 0 0 21.754311-85.549511 15.303111 15.303111 0 0 0-14.927645-15.689956 15.268978 15.268978 0 0 0-15.735466 14.916267 169.403733 169.403733 0 0 1-21.868089 78.825244 15.268978 15.268978 0 0 0-0.136533 14.825245l37.626311 69.3248-71.816534 38.832355-28.489955-52.508444a15.36 15.36 0 0 0-20.798578-6.166756 15.303111 15.303111 0 0 0-6.178133 20.753067l28.489955 52.508444-44.032 23.802311h-0.022755l-0.011378 0.011378-1.376711 0.762311-37.637689-69.3248a15.348622 15.348622 0 0 0-12.526933-7.9872c-58.333867-3.697778-109.750044-36.465778-137.511823-87.6544a166.616178 166.616178 0 0 1-13.334755-127.886222 166.798222 166.798222 0 0 1 74.365155-95.937422 466.158933 466.158933 0 0 1 15.121067 38.593422 63.977244 63.977244 0 0 0-20.332089 30.958933 63.852089 63.852089 0 0 0 5.108622 49.015467 64.580267 64.580267 0 0 0 87.460978 25.952711 64.398222 64.398222 0 0 0 25.998222-87.278933c-13.983289-25.793422-43.201422-38.1952-70.564977-32.210489a534.698667 534.698667 0 0 0-15.337245-38.331733 167.276089 167.276089 0 0 1 107.485867-3.8912 167.196444 167.196444 0 0 1 100.0448 81.021155 168.618667 168.618667 0 0 1 12.561066 29.536711 15.36 15.36 0 0 0 19.2512 9.989689 15.303111 15.303111 0 0 0 10.001067-19.205689 199.975822 199.975822 0 0 0-14.848-34.895644 197.677511 197.677511 0 0 0-118.272-95.789511 197.916444 197.916444 0 0 0-129.683911 5.563733 337.578667 337.578667 0 0 0-6.235022-11.320889c-25.315556-44.145778-66.901333-93.764267-121.366756-79.405511-27.932444 7.361422-39.3216 24.325689-43.952355 37.250845-13.312 37.193956 11.4688 88.826311 29.513955 119.182222h-72.385422c-56.991289 0-106.052267 42.473244-114.119111 98.816L132.790044 650.1376a15.291733 15.291733 0 0 0 15.212089 17.464889c7.509333 0 14.074311-5.506844 15.166578-13.141333l50.7904-355.9424c5.916444-41.346844 41.927111-72.521956 83.751822-72.521956h109.238045a201.557333 201.557333 0 0 0-12.606578 31.880533 196.960711 196.960711 0 0 0 15.7696 151.199289c31.470933 57.992533 88.598756 95.982933 153.975467 102.889245l40.994133 75.525689a15.337244 15.337244 0 0 0 20.798578 6.166755l1.399466-0.750933 57.890134 106.655289 7.827911 54.897777a108.270933 108.270933 0 0 1-3.595378 46.739912 107.770311 107.770311 0 0 1-103.685689 76.708977h-24.928711a15.325867 15.325867 0 1 0 0 30.6176h24.928711c61.6448 0 115.0976-39.549156 133.040356-98.4064a138.467556 138.467556 0 0 0 5.950578-37.6832l59.676444 109.966223c2.139022 3.936711 5.882311 6.735644 10.251378 7.668622l84.241066 18.102044a15.36 15.36 0 0 0 16.349867-7.054222l57.218845-94.560711a15.303111 15.303111 0 0 0-3.948089-20.1728zM584.4992 242.471822a33.792 33.792 0 0 1-13.630578 45.7728 33.905778 33.905778 0 0 1-45.863822-13.607822 33.416533 33.416533 0 0 1-2.685156-25.7024 33.564444 33.564444 0 0 1 16.327112-20.0704 33.871644 33.871644 0 0 1 45.852444 13.607822z m-178.164622-47.104c-20.798578-30.799644-46.318933-82.488889-36.852622-108.896711 2.025244-5.643378 6.599111-13.641956 22.892088-17.942755 36.215467-9.534578 68.960711 30.765511 92.319289 74.513066a197.711644 197.711644 0 0 0-58.925511 52.315022l-19.433244 0.011378z m476.478578 667.022222l-84.923734-156.478577a15.36 15.36 0 0 0-20.798578-6.178134 15.303111 15.303111 0 0 0-6.178133 20.753067l81.794845 150.744178-44.737423-9.614222L654.244978 578.332444l30.572089-16.520533 60.188444 110.933333a15.36 15.36 0 0 0 20.809956 6.166756c7.441067-4.027733 10.217244-13.312 6.178133-20.753067l-60.199822-110.921955 56.945778-30.776889 37.455644 69.006222 4.175644 64.603022c0.284444 4.471467 2.537244 8.578844 6.109867 11.264l48.969956 36.579556 3.948089 60.916622c0.284444 4.471467 2.537244 8.590222 6.109866 11.264l43.508622 32.506311-36.204088 59.790222z" fill="" /></svg>`, Q4 = `<?xml version="1.0" encoding="utf-8"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">\r
<g>\r
	<path fill="#45AAB8" d="M20,14c0-6.627,5.373-12,12-12s12,5.373,12,12v10h-4V14c0-4.418-3.582-8-8-8s-8,3.582-8,8v10h-4V14z"/>\r
	<g>\r
		<path fill="#F9EBB2" d="M10,60c0,1.104,0.896,2,2,2h40c1.104,0,2-0.896,2-2v-4H10V60z"/>\r
		<rect x="10" y="34" fill="#F9EBB2" width="44" height="20"/>\r
		<path fill="#F9EBB2" d="M52,26H12c-1.104,0-2,0.895-2,2v4h44v-4C54,26.895,53.104,26,52,26z"/>\r
	</g>\r
	<g>\r
		<path fill="#394240" d="M52,24h-6V14c0-7.732-6.268-14-14-14S18,6.268,18,14v10h-6c-2.211,0-4,1.789-4,4v32c0,2.211,1.789,4,4,4\r
			h40c2.211,0,4-1.789,4-4V28C56,25.789,54.211,24,52,24z M20,14c0-6.627,5.373-12,12-12s12,5.373,12,12v10h-4V14\r
			c0-4.418-3.582-8-8-8s-8,3.582-8,8v10h-4V14z M38,14v10H26V14c0-3.314,2.687-6,6-6S38,10.686,38,14z M54,60c0,1.104-0.896,2-2,2\r
			H12c-1.104,0-2-0.896-2-2v-4h44V60z M54,54H10V34h44V54z M54,32H10v-4c0-1.105,0.896-2,2-2h40c1.104,0,2,0.895,2,2V32z"/>\r
		<path fill="#394240" d="M29,44.979V49c0,1.656,1.343,3,3,3s3-1.344,3-3v-4.021c1.209-0.912,2-2.348,2-3.979c0-2.762-2.238-5-5-5\r
			s-5,2.238-5,5C27,42.631,27.791,44.066,29,44.979z M32,38c1.657,0,3,1.342,3,3c0,1.305-0.837,2.402-2,2.816V49\r
			c0,0.553-0.447,1-1,1s-1-0.447-1-1v-5.184c-1.163-0.414-2-1.512-2-2.816C29,39.342,30.343,38,32,38z"/>\r
	</g>\r
	<path fill="#506C7F" d="M32,38c1.657,0,3,1.342,3,3c0,1.305-0.837,2.402-2,2.816V49c0,0.553-0.447,1-1,1s-1-0.447-1-1v-5.184\r
		c-1.163-0.414-2-1.512-2-2.816C29,39.342,30.343,38,32,38z"/>\r
	<g opacity="0.15">\r
		<path d="M10,60c0,1.104,0.896,2,2,2h40c1.104,0,2-0.896,2-2v-4H10V60z"/>\r
		<path d="M52,26H12c-1.104,0-2,0.895-2,2v4h44v-4C54,26.895,53.104,26,52,26z"/>\r
	</g>\r
</g>\r
</svg>`, J4 = `<?xml version="1.0" encoding="utf-8"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">\r
<path fill="#2D2220" d="M26,7v13H15.5c-0.28,0-0.5-0.22-0.5-0.5s0.22-0.5,0.5-0.5H25V8H7v11h1.5C8.78,19,9,19.22,9,19.5\r
	S8.78,20,8.5,20H6V7H26z"/>\r
<rect x="14" y="8" fill="#FFD561" width="11" height="11"/>\r
<rect x="12" y="8" fill="#FFD561" width="1" height="11"/>\r
<rect x="10" y="8" fill="#FFD561" width="1" height="11"/>\r
<rect x="1" y="28" fill="#FFD561" width="30" height="1"/>\r
<path fill="#2D2220" d="M23,5.5C23,5.78,22.78,6,22.5,6h-8C14.22,6,14,5.78,14,5.5S14.22,5,14.5,5h8C22.78,5,23,5.22,23,5.5z"/>\r
<path fill="#2D2220" d="M30.86,26.49l-3-5c-0.061-0.101-0.141-0.19-0.23-0.26C27.85,20.94,28,20.55,28,20V7c0,0,0-2-2-2s-2,0-2,0\r
	h0.5C24.22,5,24,5.22,24,5.5S24.22,6,24.5,6H26c0.81,0,0.99,0.55,1,1v13c0,0.81-0.55,0.99-1,1H6c-0.81,0-0.99-0.55-1-1V7\r
	c0-0.81,0.55-0.99,1-1h16.5C22.779,6,23,5.78,23,5.5S22.779,5,22.5,5H6c0,0-2,0-2,2v13c0,0,0,0.66,0.38,1.22\r
	c-0.09,0.07-0.18,0.16-0.24,0.271l-3,5c-0.18,0.3-0.19,0.689-0.01,1C1.31,27.81,1.64,28,2,28h28c0.36,0,0.69-0.19,0.87-0.51\r
	C31.05,27.18,31.04,26.79,30.86,26.49z M2,27l3-5h22l3,5H2z"/>\r
<path fill="#2D2220" d="M14,19.5c0-0.276-0.224-0.5-0.5-0.5h-3c-0.276,0-0.5,0.224-0.5,0.5l0,0c0,0.276,0.224,0.5,0.5,0.5h3\r
	C13.776,20,14,19.776,14,19.5L14,19.5z"/>\r
<path fill="#2D2220" d="M19,25.5c0-0.276-0.224-0.5-0.5-0.5h-13C5.224,25,5,25.224,5,25.5l0,0C5,25.776,5.224,26,5.5,26h13\r
	C18.776,26,19,25.776,19,25.5L19,25.5z"/>\r
<path fill="#2D2220" d="M23,25.5c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276,0-0.5,0.224-0.5,0.5l0,0c0,0.276,0.224,0.5,0.5,0.5h1\r
	C22.776,26,23,25.776,23,25.5L23,25.5z"/>\r
<path fill="#2D2220" d="M27,25.5c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276,0-0.5,0.224-0.5,0.5l0,0c0,0.276,0.224,0.5,0.5,0.5h1\r
	C26.776,26,27,25.776,27,25.5L27,25.5z"/>\r
<path fill="#2D2220" d="M25,23.5c0-0.276-0.224-0.5-0.5-0.5h-9c-0.276,0-0.5,0.224-0.5,0.5l0,0c0,0.276,0.224,0.5,0.5,0.5h9\r
	C24.776,24,25,23.776,25,23.5L25,23.5z"/>\r
<path fill="#2D2220" d="M13,23.5c0-0.276-0.224-0.5-0.5-0.5h-1c-0.276,0-0.5,0.224-0.5,0.5l0,0c0,0.276,0.224,0.5,0.5,0.5h1\r
	C12.776,24,13,23.776,13,23.5L13,23.5z"/>\r
<path fill="#2D2220" d="M9,23.5C9,23.224,8.776,23,8.5,23h-1C7.224,23,7,23.224,7,23.5l0,0C7,23.776,7.224,24,7.5,24h1\r
	C8.776,24,9,23.776,9,23.5L9,23.5z"/>\r
</svg>`, K4 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M845 166l-49-13 49-13 13-48 13 48 48 13-48 13-13 49-13-49zM892 219l-18-4 18-5 5-19 4 19 19 5-19 4-4 19-5-19z" fill="#FDCD60" /><path d="M79 711l-20-5 20-5 5-20 5 20 21 5-21 5-5 21-5-21zM148 862l-33-8 33-7 7-33 8 33 33 7-33 8-8 33-7-33z" fill="#FDCD60" /><path d="M143 169m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0Z" fill="#5546CB" /><path d="M889 854a25 25 0 1 1 25-25 25 25 0 0 1-25 25z m0-36a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" fill="#5546CB" /><path d="M166 400v347a31 31 0 0 0 31 31h629a31 31 0 0 0 31-31V400z m362 358c-92 0-168-75-168-168s75-168 168-168 168 75 168 168-76 168-168 168zM858 380v-63a31 31 0 0 0-31-31H198a31 31 0 0 0-31 31v63z m-140-58h71v20h-71z" fill="#FDCD60" /><path d="M826 266h-40l-15-59H653l-15 59H198a51 51 0 0 0-51 51v430a51 51 0 0 0 51 51h628a51 51 0 0 0 51-51V317a51 51 0 0 0-51-51z m-157-39h86l10 37H660z m-471 59h628a31 31 0 0 1 31 31v63H166v-63a31 31 0 0 1 32-31z m628 492H198a31 31 0 0 1-31-31V400h691v347a31 31 0 0 1-32 31z" fill="#5546CB" /><path d="M528 443c-81 0-148 66-148 148s66 148 148 148 148-66 148-148-67-148-148-148z m0 264a116 116 0 1 1 116-117 116 116 0 0 1-116 116z" fill="#FFFFFF" /><path d="M528 423c-92 0-168 75-168 168s75 168 168 168 168-75 168-168-76-168-168-168z m0 315c-81 0-148-66-148-148s66-148 148-148 148 66 148 148-67 148-148 148z" fill="#5546CB" /><path d="M528 494a96 96 0 1 0 96 96 96 96 0 0 0-96-96z m43 81a18 18 0 1 1 18-18 18 18 0 0 1-18 18z" fill="#FF8859" /><path d="M528 474a116 116 0 1 0 116 116 116 116 0 0 0-116-116z m0 212a96 96 0 1 1 96-96 96 96 0 0 1-96 96z" fill="#5546CB" /><path d="M571 558m-18 0a18 18 0 1 0 36 0 18 18 0 1 0-36 0Z" fill="#FFFFFF" /><path d="M755 227h-86l-9 37h105l-10-37z" fill="#AFBCF3" /><path d="M718 322h71v20h-71z" fill="#5546CB" /></svg>`, t3 = `<?xml version="1.0" encoding="utf-8"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">\r
<g>\r
	<circle fill="#F76D57" cx="32" cy="32" r="26"/>\r
	<path fill="#394240" d="M32,0C14.327,0,0,14.327,0,32s14.327,32,32,32s32-14.327,32-32S49.673,0,32,0z M32,62\r
		C15.431,62,2,48.568,2,32C2,15.431,15.431,2,32,2s30,13.431,30,30C62,48.568,48.569,62,32,62z"/>\r
	<circle fill="#394240" cx="32" cy="32" r="1"/>\r
	<path fill="#394240" d="M36.931,32.688C36.962,32.461,37,32.236,37,32c0-1.631-0.792-3.064-2-3.978V14c0-1.657-1.343-3-3-3\r
		s-3,1.343-3,3v14.022c-1.208,0.913-2,2.347-2,3.978c0,2.762,2.238,5,5,5c0.235,0,0.461-0.038,0.688-0.069l8.505,8.505\r
		c1.172,1.172,3.07,1.171,4.242-0.001s1.172-3.07,0-4.242L36.931,32.688z M31,14c0-0.553,0.447-1,1-1s1,0.447,1,1v13.101\r
		C32.677,27.035,32.343,27,32,27s-0.677,0.035-1,0.101V14z M29,32c0-1.657,1.343-3,3-3s3,1.343,3,3s-1.343,3-3,3S29,33.657,29,32z\r
		 M44.021,44.021c-0.391,0.392-1.023,0.392-1.414,0.001l-7.853-7.853c0.562-0.372,1.043-0.853,1.415-1.415l7.852,7.853\r
		C44.411,42.997,44.411,43.63,44.021,44.021z"/>\r
	<path fill="#394240" d="M32,4C16.536,4,4,16.536,4,32s12.536,28,28,28s28-12.536,28-28S47.464,4,32,4z M51.075,49.66l-2.103-2.104\r
		c-0.393-0.39-1.025-0.39-1.415,0c-0.391,0.392-0.391,1.023,0,1.415l2.104,2.104c-4.409,4.085-10.235,6.657-16.66,6.9l0.001-2.974\r
		c-0.002-0.553-0.449-1-1-1c-0.554,0.001-1,0.447-1,1l-0.001,2.974c-6.425-0.243-12.251-2.814-16.66-6.898l2.104-2.104\r
		c0.39-0.392,0.39-1.024,0-1.414c-0.393-0.391-1.023-0.391-1.414,0l-2.104,2.104c-4.084-4.409-6.656-10.235-6.9-16.66h2.974\r
		c0.553-0.001,1-0.448,1-1c-0.001-0.554-0.447-1-1-1H6.025c0.243-6.425,2.814-12.252,6.898-16.661l2.104,2.104\r
		c0.391,0.391,1.023,0.391,1.414,0c0.391-0.392,0.391-1.023,0-1.414l-2.104-2.104c4.409-4.085,10.236-6.657,16.661-6.9V9\r
		c0,0.553,0.447,1,1,1s1-0.447,1-1V6.025c6.425,0.243,12.252,2.814,16.661,6.899l-2.104,2.104c-0.391,0.391-0.391,1.023,0,1.414\r
		s1.023,0.391,1.414,0l2.105-2.104c4.084,4.409,6.656,10.236,6.899,16.661H55c-0.553,0-1,0.447-1,1s0.447,1,1,1h2.975\r
		C57.731,39.425,55.16,45.251,51.075,49.66z"/>\r
	<path fill="#F9EBB2" d="M32,2C15.432,2,2,15.432,2,32s13.432,30,30,30s30-13.432,30-30S48.568,2,32,2z M32,60\r
		C16.536,60,4,47.464,4,32S16.536,4,32,4s28,12.536,28,28S47.464,60,32,60z"/>\r
	<path fill="#F9EBB2" d="M32,29c-1.657,0-3,1.343-3,3s1.343,3,3,3s3-1.343,3-3S33.657,29,32,29z M32,33c-0.553,0-1-0.447-1-1\r
		s0.447-1,1-1s1,0.447,1,1S32.553,33,32,33z"/>\r
	<g>\r
		<path fill="#45AAB8" d="M44.021,42.606l-7.852-7.853c-0.372,0.562-0.854,1.043-1.414,1.414l7.853,7.854\r
			c0.195,0.195,0.45,0.293,0.706,0.293s0.512-0.098,0.707-0.294C44.411,43.63,44.411,42.997,44.021,42.606z"/>\r
		<path fill="#45AAB8" d="M32,13c-0.553,0-1,0.447-1,1v13.101C31.323,27.035,31.657,27,32,27s0.677,0.035,1,0.101V14\r
			C33,13.447,32.553,13,32,13z"/>\r
	</g>\r
</g>\r
</svg>`, e3 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fxemoji" preserveAspectRatio="xMidYMid meet"><path fill="#FFE46A" d="M411.111 183.926c0-87.791-68.91-158.959-153.914-158.959S103.283 96.136 103.283 183.926c0 39.7 14.093 75.999 37.392 103.856h-.001l33.666 61.027c8.793 16.28 12.057 26.792 26.792 26.792h109.774c14.736 0 19.071-11.07 26.792-26.792l36.022-61.027h-.002c23.299-27.857 37.393-64.156 37.393-103.856z"></path><path fill="#FFF0B7" d="M112.805 203.285c0-90.721 68.378-165.701 157.146-177.719a150.851 150.851 0 0 0-13.319-.599c-85.004 0-153.914 71.169-153.914 158.959c0 28.89 7.469 55.974 20.512 79.319c-6.75-18.749-10.425-38.932-10.425-59.96z"></path><path fill="#FFDA00" d="M411.111 184.266c0-31.445-8.843-60.755-24.097-85.428a160.416 160.416 0 0 1 4.917 39.416c0 104.454-101.138 189.522-227.481 192.967l9.89 17.929c8.793 16.28 12.057 26.792 26.792 26.792h109.774c14.736 0 19.071-11.07 26.792-26.792l36.022-61.027h-.002c23.299-27.858 37.393-64.157 37.393-103.857z"></path><path fill="#FAAF63" d="M321.905 211.203c.149-.131.297-.251.447-.395c2.787-2.667 5.082-6.921 3.161-10.867c-7.879-16.176-31.97-21.308-49.524-15.951c-.889.271-1.751.566-2.588.885c-9.562-5.583-21.434-6.925-32.001-3.569a35.399 35.399 0 0 0-3.678 1.394c-5.785-3.38-12.552-5.066-19.294-4.414c-14.112 1.365-26.375 12.81-28.805 26.752l-1.112.688c9.617 15.541 34.93 60.071 36.552 79.233c2.045 24.174.002 89.793-.019 90.453l11.994.379c.086-2.723 2.086-66.978-.019-91.844c-.938-11.087-7.722-28.758-20.164-52.521c-5.807-11.092-11.445-20.83-14.858-26.576c2.36-7.646 9.61-13.848 17.586-14.619c2.429-.235 4.893.037 7.251.729a22.68 22.68 0 0 0-2.32 3.638c-4.047 7.935-2.356 17.898 3.933 23.176c3.725 3.125 9.137 4.276 14.127 3c4.647-1.188 8.239-4.242 9.854-8.379c1.451-3.718 1.328-8.01-.367-12.756a30.665 30.665 0 0 0-4.05-7.655a28.134 28.134 0 0 1 13.61.744c-1.715 1.975-3.027 4.173-3.89 6.556c-1.844 5.101-1.029 11.163 2.128 15.822c2.721 4.016 6.856 6.403 11.348 6.551c.15.005.301.008.45.008c3.935 0 7.67-1.692 10.562-4.797c3.397-3.647 5.126-8.71 4.624-13.544c-.319-3.073-1.412-6.079-3.172-8.867c12.236-2.223 24.205 1.911 29.383 8.186c-3.125 5.2-9.542 16.11-16.178 28.785c-12.441 23.764-19.227 41.435-20.164 52.521c-2.104 24.866-.104 89.121-.019 91.844l11.994-.379c-.021-.66-2.064-66.275-.019-90.453c1.459-17.251 22.113-55.046 33.237-73.758zm-80.657-3.171c-.279.716-1.331 1.035-1.647 1.116c-1.25.319-2.665.086-3.442-.565c-2.015-1.691-2.453-5.599-.957-8.532a11.21 11.21 0 0 1 1.85-2.583c1.611 1.828 2.892 3.926 3.707 6.208c.665 1.86.843 3.449.489 4.356zm32.19.654c-.351.375-1.065.992-1.839.976c-.831-.027-1.489-.819-1.808-1.289c-.993-1.467-1.312-3.527-.776-5.009c.618-1.71 1.811-3.109 3.203-4.235c1.55 1.751 2.501 3.634 2.688 5.434c.144 1.371-.447 3.027-1.468 4.123z"></path><path fill="#6B83A5" d="M315.932 402.701H197.897c-6.6 0-12 5.4-12 12v6.957c0 6.6 5.4 12 12 12h38.122c-11.367 4.229-23.369 14.285-23.369 25.946v4.68c9.123 10.254 17.619 28.081 33.802 28.081h21.89c12.748 0 21.804-13.762 32.836-28.081v-4.68c0-11.661-11.451-21.717-22.548-25.946h37.302c6.6 0 12-5.4 12-12v-6.957c0-6.6-5.4-12-12-12z"></path><path fill="#ABBDDB" d="M324.406 402.701H189.423c-6.6 0-12-5.4-12-12v-6.957c0-6.6 5.4-12 12-12h134.983c6.6 0 12 5.4 12 12v6.957c0 6.6-5.4 12-12 12zm-7.007 49.915v-6.957c0-6.6-5.4-12-12-12H208.43c-6.6 0-12 5.4-12 12v6.957c0 6.6 5.4 12 12 12h96.969c6.6 0 12-5.4 12-12z"></path></svg>`, l3 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fxemoji" preserveAspectRatio="xMidYMid meet"><path fill="#E2A042" d="M368.856 279.641c-10.65-15.461-32.579 5.913-56.04-17.549c-13.55-13.55 14.116-74.896-3.927-92.939s-76.983-33.68-110.664 0c-33.68 33.68-13.702 65.591-71.141 62.887c-.054-.003-.105-.002-.158-.004c-34.296-2.099-67.387 8.601-91.516 32.729c-49.44 49.44-42.529 136.51 15.437 194.475c57.966 57.966 145.035 64.877 194.475 15.437c24.037-24.037 34.75-56.969 32.755-91.127c3.145-42.388 15.935-43.534 42.762-42.762c41.346 1.191 58.667-45.686 48.017-61.147z"></path><path fill="#A36119" d="M189.917 277.972l243.66-221.056a7.2 7.2 0 0 1 9.947.224l10.172 10.172a7.2 7.2 0 0 1 .224 9.947L232.864 320.92a7.2 7.2 0 0 1-10.406.235l-32.776-32.776a7.2 7.2 0 0 1 .235-10.407z"></path><path fill="#FFE1AB" d="M176.074 378.716a13.29 13.29 0 0 1-9.427-3.905l-31.37-31.37c-5.207-5.206-5.207-13.647 0-18.854c5.207-5.207 13.648-5.207 18.854 0l31.37 31.37c5.207 5.206 5.207 13.647 0 18.854a13.294 13.294 0 0 1-9.427 3.905z"></path><path fill="#2B3B47" d="M490.941 36.671a2.32 2.32 0 0 0-3.279 0l-235.11 235.11a37.615 37.615 0 0 0-4.224-5.995L482.553 31.562a2.32 2.32 0 0 0-3.279-3.279L245.1 262.456a37.746 37.746 0 0 0-5.849-4.369L474.165 23.174a2.32 2.32 0 0 0-3.279-3.279L234.937 255.844c-13.837-6.097-30.584-3.489-41.919 7.846c-11.335 11.335-13.944 28.082-7.846 41.919l-64.254 64.254l-8.13-8.129c-4.92-4.92-13.177-3.778-16.578 2.291l-9.105 16.251a10.496 10.496 0 0 0 1.735 12.552l29.169 29.169a10.497 10.497 0 0 0 12.552 1.735l16.251-9.105c6.07-3.401 7.211-11.658 2.291-16.578l-8.13-8.13l64.55-64.55c13.628 5.518 29.825 2.752 40.875-8.299c11.05-11.05 13.816-27.248 8.299-40.875L490.941 39.951a2.319 2.319 0 0 0 0-3.28zM187.415 309.924a37.682 37.682 0 0 0 4.369 5.849l-62.479 62.479l-5.109-5.109l63.219-63.219zm-49.722 76.716l-5.109-5.109l62.53-62.53a37.634 37.634 0 0 0 5.995 4.224l-63.416 63.415z"></path><path fill="#E2A042" d="M415.308 56.464l53.476-53.476c3.983-3.983 10.441-3.983 14.425 0l24.021 24.021c3.983 3.983 3.983 10.441 0 14.425L453.754 94.91c-3.983 3.983-10.441 3.983-14.425 0l-24.021-24.021c-3.983-3.984-3.983-10.442 0-14.425z"></path><path fill="#A36119" d="M463.443 6.731c2.598 2.598 1.815 7.594-1.749 11.158c-3.564 3.564-8.56 4.348-11.158 1.749s-1.815-7.594 1.749-11.158c3.564-3.564 8.559-4.347 11.158-1.749zm-26.901 17.491c-3.564 3.564-4.348 8.56-1.749 11.158s7.594 1.815 11.158-1.749s4.348-8.56 1.749-11.158c-2.597-2.598-7.593-1.815-11.158 1.749zm-15.741 15.742c-3.564 3.564-4.348 8.56-1.749 11.158c2.598 2.598 7.594 1.815 11.158-1.749c3.564-3.564 4.348-8.56 1.749-11.158c-2.598-2.599-7.594-1.815-11.158 1.749zm72.146 9.179c-3.564 3.564-4.348 8.56-1.749 11.158c2.598 2.598 7.594 1.815 11.158-1.749c3.564-3.564 4.348-8.56 1.749-11.158s-7.594-1.815-11.158 1.749zm-15.742 15.742c-3.564 3.564-4.348 8.56-1.749 11.158s7.594 1.815 11.158-1.749c3.564-3.564 4.348-8.56 1.749-11.158c-2.598-2.599-7.593-1.815-11.158 1.749zm-15.742 15.742c-3.564 3.564-4.348 8.56-1.749 11.158c2.598 2.598 7.594 1.815 11.158-1.749s4.348-8.56 1.749-11.158c-2.598-2.599-7.593-1.816-11.158 1.749z"></path></svg>`, n3 = `<?xml version="1.0" encoding="utf-8"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">\r
<g>\r
	<path fill="#394240" d="M60,8H4c-2.211,0-4,1.789-4,4v40c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V12C64,9.789,62.211,8,60,8z\r
		 M4,10h56c1.104,0,2,0.896,2,2v2.469L32,36.754L2,14.469V12C2,10.896,2.896,10,4,10z M60,54H4c-1.104,0-2-0.896-2-2v-2.808\r
		l18.584-13.381c0.448-0.322,0.55-0.947,0.228-1.396c-0.322-0.447-0.946-0.549-1.396-0.228L2,46.729V16.961l29.403,21.842\r
		C31.581,38.935,31.79,39,32,39s0.419-0.065,0.597-0.197L62,16.961v29.768l-17.416-12.54c-0.448-0.322-1.074-0.221-1.396,0.228\r
		c-0.322,0.448-0.221,1.073,0.228,1.396L62,49.192V52C62,53.104,61.104,54,60,54z"/>\r
	<g>\r
		<path fill="#F9EBB2" d="M60,10H4c-1.104,0-2,0.896-2,2v2.469l30,22.285l30-22.285V12C62,10.896,61.104,10,60,10z"/>\r
		<path fill="#F9EBB2" d="M32,39c-0.21,0-0.419-0.065-0.597-0.197L2,16.961v29.768l17.416-12.54c0.449-0.321,1.073-0.22,1.396,0.228\r
			c0.322,0.448,0.221,1.073-0.228,1.396L2,49.192V52c0,1.104,0.896,2,2,2h56c1.104,0,2-0.896,2-2v-2.808L43.416,35.812\r
			c-0.448-0.322-0.55-0.947-0.228-1.396c0.321-0.448,0.947-0.55,1.396-0.228L62,46.729V16.961L32.597,38.803\r
			C32.419,38.935,32.21,39,32,39z"/>\r
	</g>\r
	<path opacity="0.15" fill="#231F20" d="M32,39c-0.21,0-0.419-0.065-0.597-0.197L2,16.961v29.768l17.416-12.54\r
		c0.449-0.321,1.073-0.22,1.396,0.228c0.322,0.448,0.221,1.073-0.228,1.396L2,49.192V52c0,1.104,0.896,2,2,2h56c1.104,0,2-0.896,2-2\r
		v-2.808L43.416,35.812c-0.448-0.322-0.55-0.947-0.228-1.396c0.321-0.448,0.947-0.55,1.396-0.228L62,46.729V16.961L32.597,38.803\r
		C32.419,38.935,32.21,39,32,39z"/>\r
</g>\r
</svg>`, s3 = `<?xml version="1.0" encoding="utf-8"?>\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M900.5 370.6v92.6c0 9.4-5.9 17.8-14.8 20.9l-151.9 52.2V396.5l-101.9-33.1 105.6-45.6c11.9-6.1 21.9-12 30-17.8l117.3 48c9.4 3.5 15.7 12.6 15.7 22.6z" fill="#FFD6C0" /><path d="M887.1 492.2v4.4l-12.3 4.2v-8.6z" fill="#EF4666" /><path d="M874.8 500.8v262.3l-141 54V549.2z" fill="#FF9271" /><path d="M912.8 370.6v92.6c0 14.7-9.3 27.8-23.2 32.6l-2.5 0.9v-4.4h-12.3v8.6l-141 48.4v-13L885.6 484c8.9-3.1 14.8-11.5 14.8-20.9v-92.6c0-10-6.3-19-15.7-22.5l-117.3-48c4.2-2.8 7.9-5.7 11.1-8.6l110.6 45.2c14.2 5.1 23.7 18.8 23.7 34zM771.9 213.5c12.8 17.8 17.5 32.5 14.6 44.9-2.1 9.1-8.4 17.8-19.5 26.8-8.6 6.9-20.1 14-34.8 21.5l-116.4 50.1c-3.8-20.9-24.2-38.3-53-47.2l92.2-101c14.1-19.3 33.3-30.5 54.5-31.5 17.8-1 35.6 6.1 46.2 18l16.2 18.4z" fill="#EF4666" /><path d="M769 287.5l9.6 4c-3.2 3-6.9 5.8-11.1 8.6l-3.1-1.2 4.6-11.4zM733.8 817.1v6.2h-12.4v-1.5zM733.8 536.3v12.9l-3.1 1.2-4.1-11.7zM721.4 405.5v416.3L635 854.9v-419l-58.4-22.4c21.5-9.8 36.2-24.8 39.3-42.4l105.5 34.4zM635 854.9v8.9h-12.4v-4.2z" fill="#EF4666" /><path d="M635 435.9v419l-12.3 4.7V600.2l8.4-3.1-4.3-11.6-4.1 1.5V444.3l-63.8-24.5c6.3-1.6 12.3-3.8 17.8-6.3l58.3 22.4z" fill="#EF4666" /><path d="M764.4 298.8l3.1 1.2c-8.2 5.8-18.2 11.7-30 17.8l-105.6 45.6 101.9 33.1v139.8l-7.2 2.5 4.1 11.6 3.1-1.1v267.8l-12.3 4.7V405.5l-105.6-34.3c0.4-2.2 0.6-4.7 0.6-7 0-2.5-0.2-4.9-0.7-7.3l116.4-50.1c14.7-7.5 26.2-14.6 34.8-21.5l2 2.2-4.6 11.3zM626.7 585.5l4.3 11.7-8.4 3V587z" fill="#EF4666" /><path d="M622.6 600.2v259.3l-110 42.1-123-47.4V588.5L497 632.7c6.1 2.6 12.3 3.8 18.8 3.8 5.4 0 11-1 16.3-2.8l90.5-33.5z" fill="#FF9271" /><path d="M622.6 444.3V587l-94.7 35.1c-8.5 3.1-17.7 2.8-26.1-0.7l-112.2-46.1V440.9l65.4-29.6c17 8.6 38.9 13.8 63.2 13.8 14.6 0 28.2-1.9 40.5-5.3l63.9 24.5z" fill="#FFD6C0" /><path d="M621.4 233.2l-4.7 11.4-8-3.3 8.7-9.7z" fill="#EF4666" /><path d="M781.4 205.8c15.6 21.2 21 39.3 17 55.6-2.6 10.6-8.9 20.4-19.9 30l-9.6-4-2-2.2c11.1-9 17.4-17.7 19.5-26.8 3-12.5-1.7-27.2-14.6-44.9l-16.3-18.3c-10.6-12-28.4-19-46.2-18-21.1 1-40.4 12.2-54.5 31.5l-92.2 101c-4.3-1.4-8.8-2.5-13.5-3.3l59.4-65.1 8 3.3 4.7-11.4-4-1.6 28-30.7c15.8-21.9 38.5-34.9 63.3-36.1 21.7-1.1 42.7 7.2 55.9 22.1l17 18.9zM615.7 356.9c0.5 2.3 0.7 4.8 0.7 7.3 0 2.3-0.2 4.8-0.6 7l-7.4-2.5-0.1-8.8 4.1-1.6 3.3-1.4z" fill="#EF4666" /><path d="M608.7 241.3l-59.4 65.1c-9.6-2.1-20.1-3.1-31-3.1-9.3 0-18.2 0.7-26.7 2.2l-55.4-71.7 70-24.7c8.5-3.3 17.8-3.2 26.2 0.4l76.3 31.8z" fill="#FFD6C0" /><path d="M561.1 407.6l15.4 5.9c-5.4 2.5-11.5 4.7-17.8 6.3l-2.1-0.7 4.5-11.5zM562.7 309.7l-6.8 7.5-9-8.3 2.3-2.6c4.8 0.9 9.2 2 13.5 3.4zM518.3 315.6c46.6 0 85.8 22.2 85.8 48.5 0 17.8-17.7 33.6-43.5 42.1-12.5 4.2-27 6.5-42.4 6.5-46.7 0-85.9-22.2-85.9-48.7 0-4.6 1.2-9 3.5-13.3 10.5-19.9 43.9-35.1 82.5-35.1zM506.2 209l-70 24.7-7.9-10.2 73.6-25.9c11.2-4.4 23.8-4.3 35.3 0.4l80.3 33.7-8.8 9.6-76.3-31.9c-8.4-3.6-17.7-3.7-26.2-0.4zM501.9 621.4c8.4 3.6 17.5 3.8 26.1 0.7l94.7-35.1v13.2l-90.5 33.5c-5.3 1.9-10.9 2.8-16.3 2.8-6.4 0-12.7-1.2-18.8-3.8l-107.4-44.2v-13.2l112.2 46.1zM491.6 305.5l0.1 0.1-9.8 7.5-3.7-4.8c4.4-1.1 8.8-2.1 13.4-2.8z" fill="#EF4666" /><path d="M384.3 186.8l94 121.5c-22.7 6.2-40.8 17.4-50.5 31.6l-1.6 0.7-118.4-57.4a43.9 43.9 0 0 1-24.5-33.7c-2.1-14.6 3.5-29.1 14.6-39l33.1-28.9c7.7-6.8 17.5-10 27.8-9 10.2 1 19.2 6.1 25.5 14.2zM442.5 403.4l8.5-3.8 5.1 11.2-1 0.5c-4.6-2.5-8.8-5.1-12.6-7.9z" fill="#EF4666" /><path d="M482 313.1l9.8-7.5-0.1-0.1c8.5-1.5 17.4-2.2 26.7-2.2 10.9 0 21.4 1 31 3.1l-2.3 2.6 9 8.3 6.8-7.5c28.8 8.9 49.1 26.3 53 47.2l-3.3 1.5-4.1 1.6 0.1 8.8 7.4 2.5c-3.1 17.5-17.8 32.6-39.3 42.4l-15.4-5.9-0.5-1.4c25.8-8.5 43.5-24.3 43.5-42.1 0-26.3-39.3-48.5-85.8-48.5-38.5 0-72 15.2-82.5 35.2l-1.1-0.5-4.9-11.2-2 0.9c9.8-14.2 27.8-25.4 50.5-31.6l3.5 4.4zM442.5 403.4L377.3 433v416.4l-80.8-31.1V412.2l124.2-55.6c-0.5 2.5-0.7 4.9-0.7 7.5 0 15.1 8.4 28.8 22.5 39.3zM428.3 223.5l7.9 10.2-8.1 2.9-4-11.6z" fill="#EF4666" /><path d="M451 399.6l-8.5 3.8c-14.1-10.5-22.5-24.2-22.5-39.3 0-2.6 0.2-5.1 0.7-7.5l14-6.3 1.1 0.5c-2.2 4.3-3.5 8.8-3.5 13.3 0 26.4 39.3 48.7 85.9 48.7 15.3 0 29.9-2.3 42.4-6.5l0.5 1.4-4.4 11.5 2.1 0.7c-12.3 3.5-25.9 5.3-40.5 5.3-24.3 0-46.2-5.2-63.2-13.8l1-0.5-5.1-11.3zM428.7 341.9l-5.3 11.1-1.6-0.7c1.1-4 3-7.7 5.2-11.2l1.7 0.8z" fill="#EF4666" /><path d="M426.2 340.7l1.6-0.7c-0.2 0.4-0.5 0.7-0.7 1.1l-0.9-0.4z" fill="#231815" /><path d="M426.2 340.7l0.9 0.4c-2.2 3.6-4.1 7.3-5.2 11.2l-10.4-5.1 14.7-6.5z" fill="#EF4666" /><path d="M429.7 339.1l4.9 11.2-14 6.3c0.2-1.5 0.6-3 1.1-4.3l1.6 0.7 5.3-11.1-1.6-0.9c0.2-0.4 0.5-0.7 0.7-1.1l2-0.8zM389.6 854.3v4.2h-12.3v-9.1z" fill="#EF4666" /><path d="M389.6 588.5v265.8l-12.3-4.9V584.7h2.9zM389.6 575.3v13.2l-9.4-3.8 4.7-11.4z" fill="#EF4666" /><path d="M377.3 584.7V433l65.2-29.6c3.8 2.8 8 5.4 12.6 7.9l-65.4 29.6v134.4l-4.7-2-4.7 11.4h-3zM296.5 818.3v6.9h-12.4v-11.7z" fill="#EF4666" /><path d="M296.5 412.2v406.1l-12.3-4.8v-266l4.3 1.4 3.7-11.7-8-2.5V404.1l127.3-56.9 10.4 5.1c-0.5 1.4-0.9 2.8-1.1 4.3l-124.3 55.6zM887.1 496.6v274.9L512.6 914.9l-228.9-88.3 0.4-1.4h12.4v-6.9l80.8 31.1v9.1h12.3v-4.2l123 47.4 110-42.1v4.2H635v-8.9l86.4-33.1v1.5h12.4v-6.2l141-54V500.8z" fill="#EF4666" /><path d="M292.5 289.4l-0.6-1.6c3.2 2.7 6.7 4.8 10.4 6.7l109.2 52.7-127.3 56.9v130.5L164 496.9v-0.2h-0.7l-28.3-8.9c-7.4-2.2-12.5-9-12.5-16.8V369.7c0-8.5 5.1-16.1 12.8-19.3l157.2-61z" fill="#FFD6C0" /><path d="M292.2 537.1l-3.7 11.8-4.4-1.4v-12.8zM288.1 277.9l3.8 9.9c-3.1-2.3-5.9-5.1-8.4-8.2l4.6-1.7z" fill="#EF4666" /><path d="M284.1 547.5v266l-101.5-39.1c-11.1-4.3-18.6-15.2-18.6-27.2V509.9l120.1 37.6z" fill="#FF9271" /><path d="M284.1 534.7v12.8L164 509.9v-13zM270.9 251.3c-2.5-18.8 4.4-37.5 18.8-50l33.1-28.9c10.2-9.1 23.5-13.3 37.2-12 13.6 1.2 25.7 8 34.1 18.9l34.2 44.2-4.2 1.5 4.1 11.6 8-2.8 55.4 71.7c-4.6 0.7-9 1.7-13.3 2.8l-94-121.5c-6.3-8.2-15.3-13.2-25.6-14.2-10.2-1-20.1 2.2-27.8 9l-33.1 28.9c-11.1 9.9-16.7 24.5-14.6 39 2 14.7 11.1 27.3 24.5 33.7l118.4 57.4-14.7 6.5-109.2-52.7c-3.7-1.9-7.2-4-10.4-6.7l-3.8-9.9-4.6 1.7c-6.5-7.7-11-17.6-12.5-28.2zM164 496.9v13l-12.4-3.9v-9.4h11.7z" fill="#EF4666" /><path d="M164 496.6v0.3l-0.7-0.3z" fill="#231815" /><path d="M151.6 747.2V506l12.3 3.8v237.3c0 12 7.5 22.8 18.6 27.2L284 813.4v11.7l-0.5 1.4L178 785.7c-15.6-5.9-26.4-21.5-26.4-38.5z" fill="#EF4666" /><path d="M110.2 369.7c0-13.5 8.2-25.6 20.6-30.7l152.8-59.3c2.5 3.1 5.3 5.8 8.4 8.2l0.6 1.6-157.2 61c-7.8 3.2-12.8 10.7-12.8 19.3V471c0 7.8 5.1 14.6 12.5 16.8l28.3 8.9h-11.6v9.4l-20.4-6.4c-12.6-4-21.1-15.4-21.1-28.6V369.7z" fill="#EF4666" /></svg>`, c3 = `<?xml version="1.0" encoding="utf-8"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 width="800px" height="800px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">\r
<g>\r
	<path fill="#394240" d="M35,4.145V3.002V3c0-1.656-1.343-3-3-3s-3,1.344-3,3v0.002v1.143C12.734,5.658,0,19.338,0,36c0,0,0,1,1,1\r
		s1.867-1,1.867-1c1.813-1.85,4.337-3,7.133-3c4.1,0,7.618,2.469,9.162,6c0,0,0.541,1,1.838,1s1.838-1,1.838-1\r
		c1.15-2.629,3.396-4.668,6.162-5.539V56c0,4.418,3.582,8,8,8s8-3.582,8-8c0-1.656-1.343-3-3-3s-3,1.344-3,3c0,1.104-0.896,2-2,2\r
		s-2-0.896-2-2V33.461c2.766,0.871,5.012,2.91,6.162,5.539c0,0,0.541,1,1.838,1s1.838-1,1.838-1c1.544-3.531,5.062-6,9.162-6\r
		c2.796,0,5.319,1.15,7.133,3c0,0,0.867,1,1.867,1s1-1,1-1C64,19.338,51.266,5.658,35,4.145z M31,3c0-0.553,0.447-1,1-1s1,0.447,1,1\r
		v1.025C32.667,4.016,32.335,4,32,4s-0.667,0.016-1,0.025V3z M10,31c-3.047,0-5.816,1.145-7.928,3.018\r
		C3.006,19.729,13.94,8.17,27.947,6.277C22.911,14.678,20,24.492,20,35v1.387C17.853,33.145,14.181,31,10,31z M37,60\r
		c2.209,0,4-1.791,4-4c0-0.553,0.447-1,1-1s1,0.447,1,1c0,3.312-2.687,6-6,6s-6-2.688-6-6V33.055C31.329,33.023,31.662,33,32,33\r
		s0.671,0.023,1,0.055V56C33,58.209,34.791,60,37,60z M32,31c-4.181,0-7.853,2.145-10,5.387V35c0-10.662,3.113-20.588,8.449-28.959\r
		c0.5-0.025,1.004-0.039,1.511-0.039h0.08c0.507,0,1.011,0.014,1.511,0.039C38.887,14.412,42,24.338,42,35v1.387\r
		C39.853,33.145,36.181,31,32,31z M54,31c-4.181,0-7.853,2.145-10,5.387V35c0-10.508-2.911-20.322-7.947-28.723\r
		C50.06,8.17,60.994,19.729,61.928,34.018C59.816,32.145,57.047,31,54,31z"/>\r
	<path fill="#F9EBB2" d="M31,3c0-0.553,0.447-1,1-1s1,0.447,1,1v1.025C32.667,4.016,32.335,4,32,4s-0.667,0.016-1,0.025V3z"/>\r
	<g>\r
		<path fill="#45AAB8" d="M2.072,34.018C4.184,32.145,6.953,31,10,31c4.181,0,7.853,2.145,10,5.387V35\r
			c0-10.508,2.911-20.322,7.947-28.723C13.94,8.17,3.006,19.729,2.072,34.018z"/>\r
		<path fill="#45AAB8" d="M36.053,6.277C41.089,14.678,44,24.492,44,35v1.387C46.147,33.145,49.819,31,54,31\r
			c3.047,0,5.816,1.145,7.928,3.018C60.994,19.729,50.06,8.17,36.053,6.277z"/>\r
	</g>\r
	<path fill="#B4CCB9" d="M32.04,6.002h-0.08c-0.507,0-1.011,0.014-1.511,0.039C25.113,14.412,22,24.338,22,35v1.387\r
		C24.147,33.145,27.819,31,32,31s7.853,2.145,10,5.387V35c0-10.662-3.113-20.588-8.449-28.959\r
		C33.051,6.016,32.547,6.002,32.04,6.002z"/>\r
	<path fill="#F9EBB2" d="M37,60c2.209,0,4-1.791,4-4c0-0.553,0.447-1,1-1s1,0.447,1,1c0,3.312-2.687,6-6,6s-6-2.688-6-6V33.055\r
		C31.329,33.023,31.662,33,32,33s0.671,0.023,1,0.055V56C33,58.209,34.791,60,37,60z"/>\r
</g>\r
</svg>`, r3 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\r
<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z" fill="#1C274C"/>\r
<path d="M13.3486 3.78947L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.6864 14.0159C19.3115 13.8597 19.75 13.298 19.75 12.6538V5.28673C19.75 4.50617 19.0165 3.93343 18.2592 4.12274C16.628 4.53055 14.9097 4.41393 13.3486 3.78947Z" fill="#1C274C"/>\r
</svg>`, i3 = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M255.4 31.96a224 224 0 0 0-62.1 8.96A224 224 0 0 0 40.97 318.7 224 224 0 0 0 318.7 471 224 224 0 0 0 471 193.2 224 224 0 0 0 256 31.96a224 224 0 0 0-.6 0zm-.6 38.97c80.5-.56 155.1 52.07 178.8 133.27 28.6 98-27.8 200.8-125.8 229.4-98 28.5-200.8-27.8-229.39-125.8C49.82 209.7 106.2 106.9 204.2 78.36c16.8-4.91 33.8-7.32 50.6-7.43zm.1 17.98c-15.1.11-30.5 2.29-45.7 6.73C120.6 121.5 69.84 214.1 95.69 302.7 121.5 391.3 214.1 442.1 302.8 416.3c88.6-25.9 139.4-118.5 113.5-207.1-21.4-73.4-88.5-120.83-161.4-120.29zm45 62.69c10.7.2 20.5 7.3 23.6 18 3.9 13.1-3.8 27.2-17 31-13.1 3.8-27.1-3.9-31-17-3.8-13.2 3.9-27.2 17-31 2.5-.7 5-1 7.4-1zm-.2 18c-.7 0-1.4.1-2.1.3-3.9 1.1-5.9 4.8-4.8 8.7 1.1 3.8 4.8 5.8 8.7 4.7 3.8-1.1 5.9-4.8 4.7-8.7-.9-3.1-3.5-5-6.5-5zm-124.5 17.9h1.9c10.6.2 20.4 7.3 23.5 17.9 3.9 13.2-3.8 27.2-17 31-13.1 3.9-27.1-3.8-31-17-3.8-13.1 3.9-27.1 17-31 1.9-.5 3.7-.8 5.6-.9zm1.6 17.9c-.7 0-1.4.1-2.1.3-3.9 1.1-5.9 4.9-4.8 8.7 1.1 3.8 4.9 5.9 8.7 4.8 3.8-1.2 5.9-4.9 4.8-8.7-.9-3.1-3.6-5.1-6.6-5.1zm159 69.1c10.6.2 20.5 7.3 23.6 18 3.8 13.1-3.9 27.1-17 31-13.2 3.8-27.2-3.9-31-17-3.9-13.2 3.8-27.2 17-31 2.4-.7 4.9-1.1 7.4-1zm-.8 18c-.6 0-1.1.1-1.6.3-3.8 1.1-5.9 4.8-4.8 8.6 1.2 3.9 4.9 5.9 8.7 4.8 3.9-1.1 5.9-4.8 4.8-8.7-.9-3.1-3.6-5-6.6-5h-.5zm-122.1 17.8c10.6.3 20.5 7.3 23.6 18 3.8 13.2-3.9 27.2-17 31-13.2 3.9-27.2-3.8-31-17-3.8-13.1 3.8-27.1 17-31 2.5-.7 4.9-1 7.4-1zm-.2 18c-.7 0-1.5.1-2.2.3-3.8 1.1-5.9 4.8-4.7 8.7 1.1 3.8 4.8 5.9 8.6 4.7 3.9-1.1 5.9-4.8 4.8-8.6-.9-3.2-3.5-5.1-6.5-5.1z"/></svg>`, o3 = `<?xml version="1.0" encoding="iso-8859-1"?>\r
\r
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r
<svg height="800px" width="800px" version="1.1" id="_x36_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r
	 viewBox="0 0 512 512"  xml:space="preserve">\r
<g>\r
	<g>\r
		<polygon style="fill:#E8E5B6;" points="492.176,184.586 490.633,213.753 477.228,464.553 34.772,464.553 22.748,239.751 \r
			21.367,213.753 19.824,184.586 		"/>\r
		<polygon style="fill:#7B9953;" points="495.182,464.553 493.477,493.882 18.523,493.882 17.305,473.003 16.817,464.553 		"/>\r
		<g>\r
			<g>\r
				<polygon style="fill:#90BDA2;" points="126.019,339.279 63.431,339.279 61.071,287.036 124.426,287.036 				"/>\r
				<polygon style="fill:#90BDA2;" points="127.904,401.109 66.225,401.109 63.933,350.381 126.357,350.381 				"/>\r
			</g>\r
			<g>\r
				<polygon style="fill:#90BDA2;" points="204.56,339.279 141.973,339.279 140.575,287.036 203.929,287.036 				"/>\r
				<polygon style="fill:#90BDA2;" points="205.306,401.109 143.627,401.109 142.27,350.381 204.694,350.381 				"/>\r
			</g>\r
			<g>\r
				<polygon style="fill:#90BDA2;" points="283.101,339.279 220.514,339.279 220.079,287.036 283.433,287.036 				"/>\r
				<polygon style="fill:#90BDA2;" points="282.708,401.109 221.028,401.109 220.606,350.381 283.03,350.381 				"/>\r
			</g>\r
		</g>\r
		<path style="fill:#A09255;" d="M392.544,245.69H380.65c-29.252,0-53.6,25.233-54.099,55.678l-2.692,164.089h112.298l7.147-164.089\r
			C444.631,270.922,421.796,245.69,392.544,245.69z"/>\r
		<polygon style="fill:#E0E0E0;" points="434.314,493.886 322.744,493.886 323.221,464.53 435.589,464.53 		"/>\r
		<polygon style="fill:#7B9953;" points="512,213.753 0,213.753 67.595,84.574 444.405,84.574 463.822,121.703 		"/>\r
		<g>\r
			<polygon style="fill:#E8E5B6;" points="251.613,174.756 104.642,174.756 104.074,158.426 101.555,84.574 100.255,46.715 \r
				175.081,0 229.352,33.147 251.531,46.715 251.531,84.574 			"/>\r
			<g>\r
				<polygon style="fill:#90BDA2;" points="157.973,141.819 132.026,141.819 130.436,84.592 156.715,84.592 				"/>\r
				<polygon style="fill:#90BDA2;" points="190.534,141.819 164.587,141.819 163.414,84.592 189.694,84.592 				"/>\r
				<polygon style="fill:#90BDA2;" points="223.095,141.819 197.148,141.819 196.393,84.592 222.673,84.592 				"/>\r
			</g>\r
		</g>\r
		<path style="fill:#E8E5B6;" d="M427.249,358.216c-0.327,8.109-6.945,14.66-14.783,14.66c-7.837,0-13.97-6.551-13.697-14.66\r
			c0.274-8.14,6.894-14.762,14.786-14.762S427.577,350.077,427.249,358.216z"/>\r
	</g>\r
	<polygon style="opacity:0.1;fill:#040000;" points="490.633,213.753 512,213.753 463.822,121.703 444.405,84.574 256,84.574 \r
		256,493.882 322.744,493.882 322.744,493.885 434.314,493.885 434.314,493.882 493.477,493.882 495.182,464.553 477.228,464.553 	\r
		"/>\r
</g>\r
</svg>`, a3 = "data:image/svg+xml," + encodeURIComponent(M4), h3 = "data:image/svg+xml," + encodeURIComponent(w4), d3 = "data:image/svg+xml," + encodeURIComponent(y4), p3 = "data:image/svg+xml," + encodeURIComponent(z4), f3 = "data:image/svg+xml," + encodeURIComponent(C4), x3 = "data:image/svg+xml," + encodeURIComponent(A4), v3 = "data:image/svg+xml," + encodeURIComponent(F4), g3 = "data:image/svg+xml," + encodeURIComponent(_4), m3 = "data:image/svg+xml," + encodeURIComponent(S4), u3 = "data:image/svg+xml," + encodeURIComponent(j4), M3 = "data:image/svg+xml," + encodeURIComponent(k4), w3 = "data:image/svg+xml," + encodeURIComponent(b4), y3 = "data:image/svg+xml," + encodeURIComponent(E4), z3 = "data:image/svg+xml," + encodeURIComponent(D4), C3 = "data:image/svg+xml," + encodeURIComponent(R4), A3 = "data:image/svg+xml," + encodeURIComponent(V4), F3 = "data:image/svg+xml," + encodeURIComponent(L4), _3 = "data:image/svg+xml," + encodeURIComponent(B4), S3 = "data:image/svg+xml," + encodeURIComponent(T4), j3 = "data:image/svg+xml," + encodeURIComponent($4), k3 = "data:image/svg+xml," + encodeURIComponent(G4), b3 = "data:image/svg+xml," + encodeURIComponent(H4), E3 = "data:image/svg+xml," + encodeURIComponent(U4), D3 = "data:image/svg+xml," + encodeURIComponent(I4), R3 = "data:image/svg+xml," + encodeURIComponent(W4), V3 = "data:image/svg+xml," + encodeURIComponent(O4), L3 = "data:image/svg+xml," + encodeURIComponent(P4), B3 = "data:image/svg+xml," + encodeURIComponent(Y4), T3 = "data:image/svg+xml," + encodeURIComponent(N4), $3 = "data:image/svg+xml," + encodeURIComponent(Z4), G3 = "data:image/svg+xml," + encodeURIComponent(X4), H3 = "data:image/svg+xml," + encodeURIComponent(q4), U3 = "data:image/svg+xml," + encodeURIComponent(Q4), I3 = "data:image/svg+xml," + encodeURIComponent(J4), W3 = "data:image/svg+xml," + encodeURIComponent(K4), O3 = "data:image/svg+xml," + encodeURIComponent(t3), P3 = "data:image/svg+xml," + encodeURIComponent(e3), Y3 = "data:image/svg+xml," + encodeURIComponent(l3), N3 = "data:image/svg+xml," + encodeURIComponent(n3), Z3 = "data:image/svg+xml," + encodeURIComponent(s3), X3 = "data:image/svg+xml," + encodeURIComponent(c3), q3 = "data:image/svg+xml," + encodeURIComponent(r3), Q3 = "data:image/svg+xml," + encodeURIComponent(i3), J3 = "data:image/svg+xml," + encodeURIComponent(o3), K3 = {
  tin_can: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: a3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  cereal_box: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: h3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  bag: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: d3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  box: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: p3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  party_hat: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: f3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  balloon: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: x3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  cupcake: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: v3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  cookie: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: g3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  apple: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: m3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  orange: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: u3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  banana: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: M3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  pear: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: w3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  flower: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: y3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  sun: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: z3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  moon: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: C3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  cloud: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: A3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  tree: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: F3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  duck: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: _3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  bird: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: S3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  fish: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: j3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  cat: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: k3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  dog: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: b3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  boat: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: E3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  airplane: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: D3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  toy_car: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: R3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  bicycle: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: V3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  chair: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: L3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  cup: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: B3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  bottle: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: T3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  book: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: $3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  pencil: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: G3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  key: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: H3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  lock: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: U3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  laptop: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: I3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  camera: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: W3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  clock: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: O3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  lightbulb: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: P3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  guitar: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: Y3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  envelope: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: N3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  gift: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: Z3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  umbrella: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: X3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  flag: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: q3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  button: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: Q3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) }),
  house: () => /* @__PURE__ */ t.jsx("g", { children: /* @__PURE__ */ t.jsx("image", { href: J3, x: -20, y: -20, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }) })
}, t0 = K3;
function B1(l) {
  return u4.includes(l);
}
function e0(l) {
  if (!B1(l)) return null;
  const n = t0[l];
  return n ? n() : null;
}
const l0 = 20;
function Q1({ objectId: l, x: n, y: c, size: e = 32, className: s }) {
  const r = e0(l);
  if (r == null) return null;
  const i = e / (2 * l0);
  return /* @__PURE__ */ t.jsx(
    "g",
    {
      className: s,
      transform: `translate(${n}, ${c}) scale(${i})`,
      "aria-label": l,
      children: r
    }
  );
}
const n0 = [
  "triangle_equilateral",
  "triangle_isosceles",
  "triangle_right",
  "square",
  "rectangle",
  "circle",
  "oval",
  "regular_polygon",
  "rhombus",
  "trapezoid"
], s0 = [
  "sphere",
  "cone",
  "cylinder",
  "cube",
  "rectangular_prism",
  "triangular_prism",
  "rectangular_pyramid",
  "pentagonal_pyramid",
  "hexagonal_prism"
], c0 = [...n0, ...s0];
function Y0(l) {
  return c0.includes(l);
}
const D1 = "var(--sp-stroke,  #1f2937)", r0 = "var(--sp-fill-0,  #f9fafb)", R1 = 1.5, p1 = 7, f1 = -5, i0 = (l, n) => `M${-l},${n} L${-l},${-n} L${l},${-n} L${l},${n} Z`, o0 = (l, n) => `M${-l},${-n} L${l},${-n} L${l + p1},${-n + f1} L${-l + p1},${-n + f1} Z`, a0 = (l, n) => `M${l},${-n} L${l},${n} L${l + p1},${n + f1} L${l + p1},${-n + f1} Z`, h0 = (l, n) => `translate(${-3.5}, ${2.5})`;
function d0(l, n) {
  const c = l.side / 2, e = n.filled === !0;
  return /* @__PURE__ */ t.jsx(
    "rect",
    {
      x: -c,
      y: -c,
      width: l.side,
      height: l.side,
      fill: e ? r0 : "none",
      stroke: D1,
      strokeWidth: R1
    }
  );
}
function p0(l) {
  return { width: l.side, height: l.side };
}
function f0(l, n) {
  const c = l.side / 2;
  return /* @__PURE__ */ t.jsxs("g", { transform: h0(), children: [
    /* @__PURE__ */ t.jsx("path", { d: a0(c, c), fill: "none", stroke: D1, strokeWidth: R1 }),
    /* @__PURE__ */ t.jsx("path", { d: o0(c, c), fill: "none", stroke: D1, strokeWidth: R1 }),
    /* @__PURE__ */ t.jsx("path", { d: i0(c, c), fill: "none", stroke: D1, strokeWidth: R1 })
  ] });
}
function x0(l) {
  const n = l.side;
  return { width: n + p1, height: n + Math.abs(f1) };
}
const _2 = {
  square: {
    render: (l, n) => d0(l, n),
    getBbox: (l) => p0(l)
  },
  cube: {
    render: (l, n) => f0(l),
    getBbox: (l) => x0(l)
  }
};
function v0(l) {
  return _2[l];
}
function N0(l, n) {
  _2[l] = n;
}
function Z0({
  shapeId: l,
  params: n,
  x: c,
  y: e,
  size: s = 32,
  filled: r = !1,
  className: i
}) {
  const o = v0(l);
  if (!o) return null;
  const h = o.getBbox(n), p = s / Math.max(h.width, h.height), d = { filled: r }, f = o.render(n, d);
  return /* @__PURE__ */ t.jsx(
    "g",
    {
      className: i,
      transform: `translate(${c}, ${e}) scale(${p})`,
      "aria-label": l,
      children: f
    }
  );
}
const g0 = 240, b = 12, m0 = b * 2, a1 = 16, g2 = 24;
function u0({ x: l, y: n, object: c }) {
  return B1(c) ? /* @__PURE__ */ t.jsx(Q1, { objectId: c, x: l, y: n, size: m0 }) : /* @__PURE__ */ t.jsx(
    "circle",
    {
      cx: l,
      cy: n,
      r: b,
      fill: "var(--sp-visual-fill, #3b82f6)",
      stroke: "var(--sp-visual-stroke, #1d4ed8)",
      strokeWidth: "1",
      "aria-label": c
    }
  );
}
function M0({ config: l, width: n = g0, className: c }) {
  const { groups: e, items_per_group: s, object: r } = l, i = s * (b * 2 + a1) - a1, o = e * i + (e - 1) * g2, h = Math.max(n, o + 48), p = (h - o) / 2 + i / 2 + b, d = 24 + b;
  return /* @__PURE__ */ t.jsx(
    "svg",
    {
      width: h,
      height: d + b * 2 + 16,
      viewBox: `0 0 ${h} ${d + b * 2 + 16}`,
      className: c,
      "aria-hidden": !0,
      children: Array.from({ length: e }).map(
        (f, g) => Array.from({ length: s }).map((v, x) => {
          const u = p + g * (i + g2) - (s * (b * 2 + a1) - a1) / 2 + b + x * (b * 2 + a1);
          return /* @__PURE__ */ t.jsx(u0, { x: u, y: d, object: r }, `${g}-${x}`);
        })
      )
    }
  );
}
const w0 = 200, e1 = 14, F1 = 12, y0 = 18;
function z0({ x: l, y: n, filled: c }) {
  return /* @__PURE__ */ t.jsx(
    "circle",
    {
      cx: l,
      cy: n,
      r: e1,
      fill: c ? "var(--sp-visual-fill, #3b82f6)" : "var(--sp-visual-bg, #e5e7eb)",
      stroke: "var(--sp-visual-stroke, #6b7280)",
      strokeWidth: "1"
    }
  );
}
function C0({ config: l, width: n = w0, className: c }) {
  const { fraction: e, items_shown: s, object: r } = l, i = s, o = e.split("/")[0], h = e.split("/")[1], p = h ? Math.round(parseInt(o, 10) / parseInt(h, 10) * i) : 0, d = 4, f = (n - d * (e1 * 2 + F1) + F1) / 2 + e1, g = 32 + e1;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: n,
      height: 90,
      viewBox: `0 0 ${n} 90`,
      className: c,
      "aria-hidden": !0,
      children: [
        /* @__PURE__ */ t.jsxs(
          "text",
          {
            x: n / 2,
            y: 20,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #111827)",
            style: { fontSize: y0, fontFamily: "system-ui, sans-serif" },
            children: [
              e,
              " of ",
              r,
              "s"
            ]
          }
        ),
        Array.from({ length: i }).map((v, x) => {
          const m = Math.floor(x / d), u = x % d, y = f + u * (e1 * 2 + F1), w = g + m * (e1 * 2 + F1);
          return /* @__PURE__ */ t.jsx(z0, { x: y, y: w, filled: x < p }, x);
        })
      ]
    }
  );
}
const A0 = 120;
function F0(l) {
  const n = l.split("/").map((c) => parseInt(c.trim(), 10));
  return n.length === 2 && !Number.isNaN(n[0]) && !Number.isNaN(n[1]) && n[1] !== 0 ? n[0] / n[1] : 0;
}
function _0({ config: l, width: n = A0, className: c }) {
  const { sections: e, labels: s, arrow_start: r, turn_direction: i, turn_amount: o } = l, h = n, p = h / 2 - 12, d = h / 2, f = h / 2, g = s.indexOf(r), v = F0(o), x = i === "anti-clockwise" ? 1 : -1, m = g / e * 360 + x * v * 360, u = 360 / e, F = (Math.floor((m % 360 + 360) % 360 / u) % e + 0.35) * u * Math.PI / 180, _ = p - 8, k = d + Math.sin(F) * _, D = f - Math.cos(F) * _, U = d - Math.sin(F) * 12, I = f + Math.cos(F) * 12;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: h,
      height: h,
      viewBox: `0 0 ${h} ${h}`,
      className: c,
      "aria-hidden": !0,
      children: [
        Array.from({ length: e }).map((R, E) => {
          const x1 = E / e * 360, V = (E + 1) / e * 360, L = x1 * Math.PI / 180, X = V * Math.PI / 180, W = d + p * Math.sin(L), v1 = f - p * Math.cos(L), g1 = d + p * Math.sin(X), m1 = f - p * Math.cos(X), u1 = 360 / e > 180 ? 1 : 0, M1 = `M ${d} ${f} L ${W} ${v1} A ${p} ${p} 0 ${u1} 1 ${g1} ${m1} Z`;
          return /* @__PURE__ */ t.jsx(
            "path",
            {
              d: M1,
              fill: E % 2 === 0 ? "var(--sp-visual-fill, #dbeafe)" : "var(--sp-visual-bg, #f3f4f6)",
              stroke: "var(--sp-visual-stroke, #374151)",
              strokeWidth: "1"
            },
            E
          );
        }),
        s.map((R, E) => {
          const V = (E + 0.5) / e * 360 * Math.PI / 180, L = p * 0.65, X = d + L * Math.sin(V), W = f - L * Math.cos(V);
          return /* @__PURE__ */ t.jsx(
            "text",
            {
              x: X,
              y: W,
              textAnchor: "middle",
              dominantBaseline: "middle",
              fill: "var(--sp-visual-text, #111827)",
              style: { fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" },
              children: R
            },
            E
          );
        }),
        /* @__PURE__ */ t.jsx(
          "line",
          {
            x1: U,
            y1: I,
            x2: k,
            y2: D,
            stroke: "var(--sp-visual-stroke, #dc2626)",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ t.jsx("circle", { cx: d, cy: f, r: 6, fill: "var(--sp-visual-fill, #374151)" })
      ]
    }
  );
}
const S0 = 280, K = 56, j0 = 24;
function k0(l, n, c, e) {
  const s = e / 2;
  switch (l.toLowerCase()) {
    case "triangle":
      return `M ${n} ${c - s} L ${n + s} ${c + s} L ${n - s} ${c + s} Z`;
    case "square":
      return `M ${n - s} ${c - s} h ${e} v ${e} h ${-e} Z`;
    case "pentagon":
      return `M ${Array.from({ length: 5 }, (i, o) => {
        const h = o / 5 * 2 * Math.PI - Math.PI / 2;
        return `${n + s * Math.cos(h)} ${c + s * Math.sin(h)}`;
      }).join(" L ")} Z`;
    case "hexagon":
      return `M ${Array.from({ length: 6 }, (i, o) => {
        const h = o / 6 * 2 * Math.PI - Math.PI / 6;
        return `${n + s * Math.cos(h)} ${c + s * Math.sin(h)}`;
      }).join(" L ")} Z`;
    case "rhombus":
      return `M ${n} ${c - s} L ${n + s} ${c} L ${n} ${c + s} L ${n - s} ${c} Z`;
    default:
      return `M ${n - s} ${c - s} h ${e} v ${e} h ${-e} Z`;
  }
}
function b0({ config: l, width: n = S0, className: c }) {
  const { shapes: e } = l, s = Math.ceil(Math.sqrt(e.length)), r = Math.ceil(e.length / s), i = s * K, o = r * K, h = Math.max(n, i + 32), p = o + 32, d = (h - i) / 2 + K / 2, f = 24 + K / 2;
  return /* @__PURE__ */ t.jsx(
    "svg",
    {
      width: h,
      height: p,
      viewBox: `0 0 ${h} ${p}`,
      className: c,
      "aria-hidden": !0,
      children: e.map((g, v) => {
        const x = v % s, m = Math.floor(v / s), u = d + x * K, y = f + m * K, w = k0(g, u, y, j0);
        return /* @__PURE__ */ t.jsx(
          "path",
          {
            d: w,
            fill: "var(--sp-visual-bg, #f3f4f6)",
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "2"
          },
          v
        );
      })
    }
  );
}
const E0 = 320, m2 = 44, V1 = 32;
function D0({ kind: l, x: n, y: c }) {
  const e = V1 / 2;
  switch (l.toLowerCase()) {
    case "cuboid":
      return /* @__PURE__ */ t.jsxs("g", { transform: `translate(${n}, ${c})`, children: [
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: `M ${-e} ${e} L ${-e} ${-e} L ${e} ${-e} L ${e} ${e} Z`,
            fill: "var(--sp-visual-bg, #e5e7eb)",
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: `M ${e} ${e} L ${e} ${-e} L ${e + 8} ${-e + 6} L ${e + 8} ${e + 6} Z`,
            fill: "var(--sp-visual-fill, #d1d5db)",
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: `M ${-e} ${e} L ${e} ${e} L ${e + 8} ${e + 6} L ${-e + 8} ${e + 6} Z`,
            fill: "var(--sp-visual-fill, #9ca3af)",
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "1.5"
          }
        )
      ] });
    case "cylinder":
      return /* @__PURE__ */ t.jsxs("g", { transform: `translate(${n}, ${c})`, children: [
        /* @__PURE__ */ t.jsx("ellipse", { cx: 0, cy: -e + 4, rx: e, ry: 6, fill: "var(--sp-visual-bg, #e5e7eb)", stroke: "var(--sp-visual-stroke, #374151)", strokeWidth: "1.5" }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: `M ${-e} ${-e + 4} L ${-e} ${e - 4} Q ${-e} ${e + 4} 0 ${e + 4} Q ${e} ${e + 4} ${e} ${e - 4} L ${e} ${-e + 4}`,
            fill: "none",
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "1.5"
          }
        )
      ] });
    case "cone":
      return /* @__PURE__ */ t.jsx("g", { transform: `translate(${n}, ${c})`, children: /* @__PURE__ */ t.jsx(
        "path",
        {
          d: `M 0 ${-e} L ${e} ${e} L ${-e} ${e} Z`,
          fill: "var(--sp-visual-bg, #e5e7eb)",
          stroke: "var(--sp-visual-stroke, #374151)",
          strokeWidth: "1.5"
        }
      ) });
    default:
      return /* @__PURE__ */ t.jsx(
        "rect",
        {
          x: n - e,
          y: c - e,
          width: V1,
          height: V1,
          fill: "var(--sp-visual-bg, #e5e7eb)",
          stroke: "var(--sp-visual-stroke, #374151)",
          strokeWidth: "1.5"
        }
      );
  }
}
function R0({ objectId: l, category: n, x: c, y: e }) {
  return B1(l) ? /* @__PURE__ */ t.jsx(Q1, { objectId: l, x: c, y: e, size: V1 }) : /* @__PURE__ */ t.jsx(D0, { kind: n, x: c, y: e });
}
const _1 = 80, u2 = 64, S1 = 28, M2 = 12;
function V0({ config: l, width: n = E0, className: c }) {
  const { objects: e, categories: s, correct: r } = l, i = e.length + 1, o = S1 + i * m2;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: n,
      height: o,
      viewBox: `0 0 ${n} ${o}`,
      className: c,
      "aria-hidden": !0,
      children: [
        /* @__PURE__ */ t.jsx("text", { x: _1 / 2, y: 18, textAnchor: "middle", fill: "var(--sp-visual-text, #111827)", style: { fontSize: M2, fontWeight: 600, fontFamily: "system-ui, sans-serif" }, children: "Object" }),
        s.filter((h, p, d) => d.indexOf(h) === p).map((h, p) => /* @__PURE__ */ t.jsx(
          "text",
          {
            x: _1 + (p + 0.5) * u2,
            y: 18,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #111827)",
            style: { fontSize: M2, fontWeight: 600, fontFamily: "system-ui, sans-serif" },
            children: h.charAt(0).toUpperCase() + h.slice(1)
          },
          h
        )),
        /* @__PURE__ */ t.jsx("line", { x1: 0, y1: S1, x2: n, y2: S1, stroke: "var(--sp-visual-stroke, #374151)", strokeWidth: "1" }),
        e.map((h, p) => {
          const d = r[h] ?? "", f = S1 + (p + 0.5) * m2, g = s.filter((x, m, u) => u.indexOf(x) === m), v = p === 0;
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx(R0, { objectId: h, category: d, x: _1 / 2, y: f }),
            g.map((x, m) => {
              const u = v && x === d, y = _1 + (m + 0.5) * u2;
              return /* @__PURE__ */ t.jsx("g", { children: u ? /* @__PURE__ */ t.jsx("text", { x: y, y: f + 4, textAnchor: "middle", fill: "var(--sp-visual-text, #059669)", style: { fontSize: 16, fontFamily: "system-ui, sans-serif" }, children: "✓" }) : /* @__PURE__ */ t.jsx("rect", { x: y - 10, y: f - 10, width: 20, height: 20, fill: "none", stroke: "var(--sp-visual-stroke, #d1d5db)", strokeWidth: "1" }) }, x);
            })
          ] }, h);
        })
      ]
    }
  );
}
const L0 = 280, H = 28, Y1 = 12, B0 = 24;
function T0({ x: l, y: n, object: c }) {
  return B1(c) ? /* @__PURE__ */ t.jsx(Q1, { objectId: c, x: l, y: n, size: H }) : /* @__PURE__ */ t.jsx("g", { transform: `translate(${l}, ${n})`, "aria-label": c, children: /* @__PURE__ */ t.jsx(
    "circle",
    {
      cx: 0,
      cy: 0,
      r: H / 2 - 2,
      fill: "var(--sp-visual-fill, #dc2626)",
      stroke: "var(--sp-visual-stroke, #991b1b)",
      strokeWidth: "1"
    }
  ) });
}
function $0({ config: l, width: n = L0, className: c }) {
  const { groups: e } = l, s = 24 + H / 2;
  let r = 24;
  return /* @__PURE__ */ t.jsx(
    "svg",
    {
      width: n,
      height: s + H / 2 + 16,
      viewBox: `0 0 ${n} ${s + H / 2 + 16}`,
      className: c,
      "aria-hidden": !0,
      children: e.map((i, o) => {
        const h = [];
        for (let f = 0; f < i.count; f++) {
          const g = r + f * (H + Y1);
          h.push(
            /* @__PURE__ */ t.jsx(
              T0,
              {
                x: g + H / 2,
                y: s,
                object: i.object
              },
              f
            )
          );
        }
        const p = i.count * (H + Y1) - Y1, d = /* @__PURE__ */ t.jsx("g", { children: h }, o);
        return r += p + B0, d;
      })
    }
  );
}
const G0 = 280, w2 = 40, y2 = 14;
function H0({ config: l, width: n = G0, className: c }) {
  const { items: e, total: s } = l, r = 24 + e.length * w2 + 32;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: n,
      height: r,
      viewBox: `0 0 ${n} ${r}`,
      className: c,
      "aria-hidden": !0,
      children: [
        /* @__PURE__ */ t.jsxs(
          "text",
          {
            x: n / 2,
            y: 18,
            textAnchor: "middle",
            fill: "var(--sp-visual-text, #111827)",
            style: { fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" },
            children: [
              "Total: ",
              s,
              "g"
            ]
          }
        ),
        e.map((i, o) => {
          const h = 24 + (o + 1) * w2, p = i.grams !== null ? `${i.grams}g` : "?";
          return /* @__PURE__ */ t.jsxs("g", { children: [
            /* @__PURE__ */ t.jsx(
              "text",
              {
                x: 24,
                y: h - 4,
                fill: "var(--sp-visual-text, #374151)",
                style: { fontSize: y2, fontFamily: "system-ui, sans-serif" },
                children: i.label
              }
            ),
            /* @__PURE__ */ t.jsx(
              "text",
              {
                x: n - 24,
                y: h - 4,
                textAnchor: "end",
                fill: i.grams !== null ? "var(--sp-visual-text, #374151)" : "var(--sp-visual-text, #9ca3af)",
                style: { fontSize: y2, fontFamily: "system-ui, sans-serif" },
                children: p
              }
            )
          ] }, o);
        })
      ]
    }
  );
}
const U0 = 120;
function I0({ config: l, width: n = U0, className: c }) {
  const { hours: e, minutes: s } = l, r = n, i = r / 2, o = r / 2, h = r / 2 - 12, p = (e % 12 + s / 60) * (360 / 12), d = s * (360 / 60), f = (p - 90) * Math.PI / 180, g = (d - 90) * Math.PI / 180, v = h * 0.5, x = h * 0.8, m = i + Math.cos(f) * v, u = o + Math.sin(f) * v, y = i + Math.cos(g) * x, w = o + Math.sin(g) * x;
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      width: r,
      height: r,
      viewBox: `0 0 ${r} ${r}`,
      className: c,
      "aria-hidden": !0,
      children: [
        /* @__PURE__ */ t.jsx(
          "circle",
          {
            cx: i,
            cy: o,
            r: h,
            fill: "var(--sp-visual-bg, #fefce8)",
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "2"
          }
        ),
        Array.from({ length: 12 }).map((F, _) => {
          const k = (_ * 30 - 90) * Math.PI / 180, D = i + (h - 6) * Math.cos(k), U = o + (h - 6) * Math.sin(k), I = i + h * Math.cos(k), R = o + h * Math.sin(k);
          return /* @__PURE__ */ t.jsx(
            "line",
            {
              x1: D,
              y1: U,
              x2: I,
              y2: R,
              stroke: "var(--sp-visual-stroke, #374151)",
              strokeWidth: _ % 3 === 0 ? 2 : 1
            },
            _
          );
        }),
        /* @__PURE__ */ t.jsx(
          "line",
          {
            x1: i,
            y1: o,
            x2: m,
            y2: u,
            stroke: "var(--sp-visual-stroke, #111827)",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ t.jsx(
          "line",
          {
            x1: i,
            y1: o,
            x2: y,
            y2: w,
            stroke: "var(--sp-visual-stroke, #374151)",
            strokeWidth: "2",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ t.jsx("circle", { cx: i, cy: o, r: 4, fill: "var(--sp-visual-fill, #111827)" })
      ]
    }
  );
}
const W0 = {
  number_line: V2,
  dice: G2,
  coin_display: O2,
  matching_pairs: N2,
  bar_chart: Q2,
  block_chart: J2,
  tally_chart: n4,
  option_fill: c4,
  missing_digits: o4,
  calculation_choices: p4,
  item_list: x4,
  number_pattern: m4,
  object_array: M0,
  fraction_of_set: C0,
  spinner: _0,
  shape_grid: b0,
  shape_classify: V0,
  count_objects: $0,
  weight_scale: H0,
  clock_face: I0
};
function S2({
  visualType: l,
  visualConfig: n,
  width: c,
  className: e
}) {
  if (l === "none")
    return null;
  const s = W0[l];
  if (!s)
    return null;
  const r = {
    config: n,
    width: c,
    className: e
  };
  return /* @__PURE__ */ t.jsx(s, { ...r });
}
function X0({
  question: l,
  sourceLabel: n,
  showAnswer: c = !1,
  notes: e = "",
  onNotesChange: s,
  className: r = ""
}) {
  const i = n ?? (l.exam_source_id === 1 ? `Paper 1 · Q${l.id}` : l.exam_source_id === 2 ? `Paper 2 · Q${l.id - 25}` : `Q${l.id}`);
  return /* @__PURE__ */ t.jsxs("article", { className: `sp-question-container ${r}`.trim(), "data-question-id": l.id, children: [
    /* @__PURE__ */ t.jsxs("div", { className: "sp-question-container__header", children: [
      /* @__PURE__ */ t.jsx("span", { children: i }),
      /* @__PURE__ */ t.jsx("span", { children: "·" }),
      /* @__PURE__ */ t.jsxs("span", { children: [
        l.marks,
        " mark",
        l.marks !== 1 ? "s" : ""
      ] }),
      l.difficulty && l.difficulty !== "core" && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx("span", { children: "·" }),
        /* @__PURE__ */ t.jsx("span", { children: l.difficulty })
      ] })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "sp-question-container__text", children: l.question_text }),
    /* @__PURE__ */ t.jsx("div", { className: "sp-question-container__visual", children: l.visual_type !== "none" && l.visual_config != null && /* @__PURE__ */ t.jsx(
      S2,
      {
        visualType: l.visual_type,
        visualConfig: l.visual_config
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "sp-question-container__footer", children: [
      c && l.primary_answer != null && /* @__PURE__ */ t.jsxs("div", { className: "sp-question-container__answer", children: [
        "Answer: ",
        l.primary_answer
      ] }),
      s && /* @__PURE__ */ t.jsx(
        "textarea",
        {
          className: "sp-question-container__notes",
          placeholder: "Notes…",
          value: e,
          onChange: (o) => s(o.target.value),
          "aria-label": `Notes for question ${l.id}`
        }
      )
    ] })
  ] });
}
const z2 = [
  { value: "none", description: "No visual (text-only question)" },
  { value: "number_line", description: "Number line with labelled/blank ticks" },
  { value: "dice", description: "Single die face (1–6)" },
  { value: "count_objects", description: "Groups of objects to count" },
  { value: "object_array", description: "Grid of objects (e.g. marbles)" },
  { value: "bar_chart", description: "Bar chart with optional blank bars" },
  { value: "block_chart", description: "Block chart grid (cells per row)" },
  { value: "tally_chart", description: "Tally chart table (Object | Tallies | Count)" },
  { value: "shape_grid", description: "Grid of shapes" },
  { value: "shape_classify", description: "Classify objects (cuboid, cylinder, cone)" },
  { value: "coin_display", description: "UK coin sets" },
  { value: "fraction_of_set", description: "Fraction of a set" },
  { value: "spinner", description: "Spinner with sections and arrow" },
  { value: "matching_pairs", description: "Left/right pairs to match" },
  { value: "clock_face", description: "Analog clock" },
  { value: "weight_scale", description: "Items and weights (total)" },
  { value: "option_fill", description: "Fill in the blank from options (comparison or operator rows)" },
  { value: "missing_digits", description: "Number sentence with digit/blank boxes" },
  { value: "calculation_choices", description: "Calculation options to circle/select" },
  { value: "item_list", description: "Generic list of items" },
  { value: "number_pattern", description: "Pattern recognition (sequence, continue the pattern)" }
], O0 = {
  number_line: { min: 50, max: 70, interval: 5, labelled: [50, 60, 70], blank: [55, 65] },
  dice: { value: 5 },
  count_objects: { groups: [{ object: "apple", count: 3 }, { object: "apple", count: 2 }] },
  object_array: { groups: 3, items_per_group: 3, object: "marble" },
  bar_chart: {
    title: "Animals in a pond",
    x_label: "Animal",
    y_label: "Count",
    scale: 1,
    bars: [
      { label: "duck", value: 4, given: !1 },
      { label: "frog", value: 3, given: !0 },
      { label: "fish", value: 6, given: !0 }
    ]
  },
  block_chart: {
    title: "Animals in a pond",
    rows: [
      { label: "duck", value: 4, given: !1 },
      { label: "frog", value: 3, given: !0 },
      { label: "fish", value: 6, given: !0 }
    ]
  },
  tally_chart: {
    title: "Birds in the garden",
    rows: [
      { label: "robin", value: 3 },
      { label: "blue tit", value: 5, blank: "count" },
      { label: "sparrow", value: 10 }
    ]
  },
  shape_grid: { shapes: ["pentagon", "hexagon", "square", "triangle"], task: "select_matching_sides" },
  shape_classify: {
    objects: ["box", "tin_can", "cereal_box", "party_hat"],
    categories: ["cuboid", "cylinder", "cuboid", "cone"],
    correct: { box: "cuboid", tin_can: "cylinder", cereal_box: "cuboid", party_hat: "cone" }
  },
  coin_display: { sets: { ben: ["50p", "20p", "10p", "5p"], sita: ["20p", "10p", "2p", "1p"] } },
  fraction_of_set: { fraction: "1/2", items_shown: 4, object: "car" },
  spinner: { sections: 4, labels: ["A", "B", "C", "D"], arrow_start: "A", turn_direction: "anti-clockwise", turn_amount: "1/4" },
  matching_pairs: {
    left: ["10 minutes", "11 minutes", "13 minutes", "15 minutes"],
    right: ["1st", "2nd", "3rd", "4th"],
    correct: { "10 minutes": "1st", "11 minutes": "2nd", "13 minutes": "3rd", "15 minutes": "4th" }
  },
  clock_face: { hours: 3, minutes: 15 },
  weight_scale: {
    items: [
      { label: "card", grams: 32 },
      { label: "gift", grams: 47 },
      { label: "letter", grams: null }
    ],
    total: 100
  },
  option_fill: {
    options: ["<", ">", "="],
    rows: [
      { type: "comparison", left: 21, right: 12 },
      { type: "comparison", left: 48, right: 64 },
      { type: "comparison", left: 55, right: 55 }
    ],
    correct: [">", "<", "="]
  },
  missing_digits: {
    segments: [
      { type: "number", value: 16 },
      { type: "symbol", char: "−" },
      { type: "blank", digits: 1 },
      { type: "symbol", char: "=" },
      { type: "number", value: 12 }
    ]
  },
  calculation_choices: { options: ["4+12", "12+4", "16-4", "12-4", "16-12"] },
  item_list: { items: [2, 7, 12, 17, 22], title: "Pattern +5" },
  number_pattern: { variant: "sequence", items: [2, 7, 12, 17, 22], title: "Pattern +5", rule: "+5 each time" }
};
function q0() {
  return /* @__PURE__ */ t.jsxs("div", { style: { fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 720 }, children: [
    /* @__PURE__ */ t.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, marginBottom: 8 }, children: "@sparkpack/visuals — Visualizer" }),
    /* @__PURE__ */ t.jsx("p", { style: { color: "#64748b", marginBottom: 24 }, children: "SVG renderers for maths question visuals. Each type has a typed config and optional width/className." }),
    /* @__PURE__ */ t.jsxs("section", { style: { marginBottom: 24 }, children: [
      /* @__PURE__ */ t.jsx("h2", { style: { fontSize: "1.125rem", fontWeight: 600, marginBottom: 12 }, children: "Visual types" }),
      /* @__PURE__ */ t.jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0 }, children: z2.map(({ value: l, description: n }) => /* @__PURE__ */ t.jsxs(
        "li",
        {
          style: {
            padding: "10px 12px",
            marginBottom: 6,
            background: "#f1f5f9",
            borderRadius: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          children: [
            /* @__PURE__ */ t.jsx("code", { style: { fontFamily: "monospace", fontWeight: 600 }, children: l }),
            /* @__PURE__ */ t.jsx("span", { style: { color: "#64748b", fontSize: "0.875rem" }, children: n })
          ]
        },
        l
      )) })
    ] }),
    /* @__PURE__ */ t.jsxs("section", { children: [
      /* @__PURE__ */ t.jsx("h2", { style: { fontSize: "1.125rem", fontWeight: 600, marginBottom: 12 }, children: "Example (one per type)" }),
      /* @__PURE__ */ t.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 24 }, children: z2.filter((l) => l.value !== "none").map(({ value: l }) => /* @__PURE__ */ t.jsxs(
        "div",
        {
          style: {
            padding: 16,
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            minWidth: 160
          },
          children: [
            /* @__PURE__ */ t.jsx("div", { style: { fontSize: 12, color: "#64748b", marginBottom: 8 }, children: l }),
            /* @__PURE__ */ t.jsx(
              S2,
              {
                visualType: l,
                visualConfig: O0[l]
              }
            )
          ]
        },
        l
      )) })
    ] })
  ] });
}
export {
  Q2 as BarChart,
  J2 as BlockChart,
  p4 as CalculationChoices,
  I0 as ClockFace,
  O2 as CoinDisplay,
  $0 as CountObjects,
  G2 as Dice,
  C0 as FractionOfSet,
  x4 as ItemList,
  N2 as MatchingPairs,
  o4 as MissingDigits,
  V2 as NumberLine,
  m4 as NumberPattern,
  u4 as OBJECT_IDS,
  M0 as ObjectArray,
  Q1 as ObjectDrawing,
  c4 as OptionFill,
  X0 as QuestionContainer,
  S2 as QuestionVisual,
  n0 as SHAPE_2D_IDS,
  s0 as SHAPE_3D_IDS,
  c0 as SHAPE_IDS,
  V0 as ShapeClassify,
  Z0 as ShapeDrawing,
  b0 as ShapeGrid,
  _0 as Spinner,
  n4 as TallyChart,
  q0 as VisualizerDetails,
  H0 as WeightScale,
  v0 as getShapeRenderer,
  B1 as isObjectInLibrary,
  Y0 as isShapeId,
  N0 as registerShapeRenderer
};
