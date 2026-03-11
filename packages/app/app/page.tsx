"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const BUBBLES = [
  { emoji: "⚡", x: 8,  y: 15, size: 56, delay: 0,   duration: 6  },
  { emoji: "🏆", x: 88, y: 10, size: 48, delay: 0.8, duration: 7  },
  { emoji: "🎯", x: 5,  y: 65, size: 44, delay: 1.5, duration: 5  },
  { emoji: "🌟", x: 92, y: 60, size: 52, delay: 0.3, duration: 8  },
  { emoji: "🎉", x: 18, y: 85, size: 40, delay: 2.1, duration: 6.5},
  { emoji: "🔥", x: 80, y: 80, size: 46, delay: 1.0, duration: 7.5},
  { emoji: "💡", x: 50, y: 6,  size: 42, delay: 1.7, duration: 5.5},
  { emoji: "🎮", x: 72, y: 22, size: 38, delay: 2.5, duration: 9  },
  { emoji: "📣", x: 28, y: 20, size: 36, delay: 0.5, duration: 6.8},
];

const STATS = [
  { value: "30s",   label: "to create a game" },
  { value: "∞",     label: "questions per class" },
  { value: "100%",  label: "projector-ready" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* ── Keyframes ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        :root {
          --yellow:  #FFE234;
          --orange:  #FF7A1A;
          --pink:    #FF3D77;
          --purple:  #3B1F5E;
          --cream:   #FFF8E7;
        }

        /* floating bubbles */
        @keyframes floatBubble {
          0%,100% { transform: translateY(0px) rotate(-4deg) scale(1);   }
          33%      { transform: translateY(-18px) rotate(6deg) scale(1.08); }
          66%      { transform: translateY(8px) rotate(-2deg) scale(0.95);  }
        }

        /* title pop-in */
        @keyframes titlePop {
          0%   { transform: rotate(-4deg) scale(0.6); opacity: 0; }
          70%  { transform: rotate(-4deg) scale(1.06); opacity: 1; }
          100% { transform: rotate(-4deg) scale(1);   opacity: 1; }
        }

        /* shimmer sweep across the title */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* pulsing glow ring behind logo */
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(255,226,52,0.4), 0 0 0 0px rgba(255,61,119,0.3); }
          50%       { box-shadow: 0 0 0 28px rgba(255,226,52,0), 0 0 0 50px rgba(255,61,119,0); }
        }

        /* slide-up reveal for nav items */
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* wiggle on CTA hover */
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1.04); }
          25%       { transform: rotate(-2deg) scale(1.05); }
          75%       { transform: rotate(2deg)  scale(1.05); }
        }

        /* background shimmer particles */
        @keyframes drift {
          0%   { transform: translateY(0) translateX(0);   opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(40px); opacity: 0; }
        }

        /* stat card pop */
        @keyframes statPop {
          from { transform: scale(0.8) translateY(20px); opacity: 0; }
          to   { transform: scale(1) translateY(0);      opacity: 1; }
        }

        /* bounce arrow */
        @keyframes bounceX {
          0%,100% { transform: translateX(0); }
          50%      { transform: translateX(5px); }
        }

        .sp-title-wrap {
          animation: titlePop 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        .sp-shimmer-text {
          background: linear-gradient(
            120deg,
            var(--yellow) 0%,
            var(--orange) 30%,
            #fff 50%,
            var(--orange) 70%,
            var(--pink)   100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .sp-cta-btn:hover  { animation: wiggle 0.4s ease-in-out infinite; }
        .sp-arrow          { animation: bounceX 1s ease-in-out infinite; }

        .sp-stat-card { animation: statPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      {/* ── Background Drift Particles ─────────────────────────── */}
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0,
      }}>
        {mounted && Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 7.3 + 3) % 100}%`,
            bottom: `-10px`,
            width:  `${6 + (i % 4) * 3}px`,
            height: `${6 + (i % 4) * 3}px`,
            borderRadius: "50%",
            background: i % 3 === 0 ? "var(--yellow)" : i % 3 === 1 ? "var(--pink)" : "var(--orange)",
            opacity: 0,
            animation: `drift ${10 + (i * 1.3) % 8}s ${(i * 0.9) % 6}s linear infinite`,
          }} />
        ))}
      </div>

      <main style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        background: "radial-gradient(ellipse at 30% 20%, #5c2d8e 0%, #3B1F5E 40%, #1a0d33 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Grid overlay */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Glow orbs */}
        <div aria-hidden="true" style={{ position: "absolute", top: "-10%", left: "-5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,122,26,0.25) 0%, transparent 70%)", filter: "blur(40px)", zIndex: 0 }} />
        <div aria-hidden="true" style={{ position: "absolute", bottom: "5%",  right: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,119,0.2) 0%, transparent 70%)", filter: "blur(50px)", zIndex: 0 }} />

        {/* Floating Emoji Bubbles */}
        {BUBBLES.map(({ emoji, x, y, size, delay, duration }) => (
          <div
            key={emoji}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: `${x}%`,
              top:  `${y}%`,
              fontSize: `${size}px`,
              lineHeight: 1,
              userSelect: "none",
              animation: `floatBubble ${duration}s ${delay}s ease-in-out infinite`,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
              zIndex: 1,
              display: mounted ? "block" : "none",
            }}
          >
            {emoji}
          </div>
        ))}

        {/* ── Main Content ────────────────────────────────────── */}
        <div style={{
          position: "relative", zIndex: 2,
          width: "100%", maxWidth: "680px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "36px",
          textAlign: "center",
        }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,226,52,0.15)",
            border: "1px solid rgba(255,226,52,0.4)",
            borderRadius: "100px",
            padding: "6px 16px",
            animation: "slideUp 0.5s 0.1s both",
          }}>
            <span style={{ fontSize: "14px" }}>⚡</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--yellow)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Classroom Game Engine
            </span>
          </div>

          {/* Logo */}
          <div className="sp-title-wrap" style={{
            display: "inline-block",
            rotate: "-4deg",
            padding: "12px 32px 12px 28px",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            borderRadius: "24px",
            border: "2px solid rgba(255,255,255,0.1)",
            animation: "titlePop 0.7s cubic-bezier(0.34,1.56,0.64,1) both, ringPulse 2.5s 1s ease-in-out infinite",
          }}>
            <h1 style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "clamp(4rem, 14vw, 7rem)",
              fontWeight: 700,
              lineHeight: 1,
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              <span className="sp-shimmer-text">Spark</span>
              <span style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f7e8ff 60%, #c9a0ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Pack</span>
            </h1>
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "rgba(255,248,231,0.85)",
            maxWidth: "500px",
            lineHeight: 1.6,
            margin: 0,
            animation: "slideUp 0.5s 0.3s both",
          }}>
            Projector-ready quiz shows your class will <em style={{ color: "var(--yellow)", fontStyle: "normal", fontWeight: 700 }}>actually get excited about</em> — bold visuals, TV game-show energy, zero setup headaches.
          </p>

          {/* Stat Cards */}
          <div style={{
            display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center",
          }}>
            {STATS.map(({ value, label }, i) => (
              <div
                key={label}
                className="sp-stat-card"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  padding: "14px 20px",
                  minWidth: "120px",
                  animationDelay: `${0.45 + i * 0.1}s`,
                }}
              >
                <div style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: i === 0 ? "var(--yellow)" : i === 1 ? "var(--orange)" : "#c9a0ff",
                  lineHeight: 1,
                }}>{value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,248,231,0.6)", marginTop: "4px", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
            animation: "slideUp 0.5s 0.6s both",
            width: "100%",
          }}>
            {/* Primary CTA */}
            <Link href="/generate" style={{ textDecoration: "none" }}>
              <button
                className="sp-cta-btn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  padding: "18px 40px",
                  background: "linear-gradient(135deg, var(--yellow) 0%, var(--orange) 100%)",
                  border: "none",
                  borderRadius: "100px",
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  fontWeight: 700,
                  fontFamily: "'Fredoka', sans-serif",
                  color: "#2a0f4a",
                  cursor: "pointer",
                  boxShadow: "0 8px 0 #7a3300, 0 12px 40px rgba(255,122,26,0.5)",
                  transition: "transform 0.1s, box-shadow 0.1s",
                  letterSpacing: "0.02em",
                }}
                onMouseDown={e => { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = "0 4px 0 #7a3300, 0 6px 20px rgba(255,122,26,0.4)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 0 #7a3300, 0 12px 40px rgba(255,122,26,0.5)"; }}
              >
                <span>🎮</span>
                <span>Create a Game</span>
                <span className="sp-arrow" style={{ fontSize: "1.2em" }}>→</span>
              </button>
            </Link>

            {/* Secondary CTA */}
            <Link href="/join" style={{ textDecoration: "none" }}>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 28px",
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "100px",
                fontSize: "0.95rem",
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "rgba(255,248,231,0.9)",
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              >
                <span>🔑</span>
                <span>Join with a code</span>
              </button>
            </Link>

            <p style={{
              fontSize: "12px",
              color: "rgba(255,232,190,0.5)",
              margin: 0,
            }}>
              No account needed to join · Free for teachers
            </p>
          </div>

        </div>
      </main>
    </>
  );
}