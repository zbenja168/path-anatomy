// Active Transport branding — self-contained drop-in for the "Secondary Active
// Transport" free QBanks. Ports the spinning-transporter logo mark from
// activetransport.app so every QBank carries the brand and links home.
//
// Exports:
//   <BrandBadge/> — small fixed corner pill, render once at the app root so the
//                   logo shows on every page.
//   <BrandCard/>  — full linking card with a blurb + CTA for the home page.

const AT_URL = 'https://activetransport.app';

const BLURB =
  'This free question bank is a Secondary Active Transport study tool. ' +
  'Active Transport turns your own notes, lectures, and Anki decks into ' +
  'NBME-style practice questions in seconds — on top of a 12,000-question bank.';

// Injected once; duplicate tags are harmless if it renders more than once.
function BrandStyle() {
  return (
    <style>{`
      /* The spinning transporter: a copy of activetransport.app's header mark
         (templates/_logo_mark.html + static/style.css), so the tools and the
         site show the same logo. Stepped 120-degree rotation with a dwell, and
         one substrate pumped up through the pore that leaves as product. */
      @keyframes atStepRotate {
        0%, 2%    { transform: rotate(0deg); }
        7%        { transform: rotate(90deg); }
        10%       { transform: rotate(90deg); }
        14%, 35%  { transform: rotate(120deg); }
        40%       { transform: rotate(210deg); }
        43%       { transform: rotate(210deg); }
        47%, 68%  { transform: rotate(240deg); }
        73%       { transform: rotate(330deg); }
        76%       { transform: rotate(330deg); }
        80%, 100% { transform: rotate(360deg); }
      }
      @keyframes atSubPump {
        0%   { transform: translate(0, 0) scale(1);           opacity: 0; fill: #38bdf8; }
        6%   { transform: translate(0, -2px) scale(1);        opacity: 1; fill: #38bdf8; }
        24%  { transform: translate(0, -10px) scale(1);       opacity: 1; fill: #38bdf8; }
        28%  { transform: translate(0, -16px) scale(1);       opacity: 0; fill: #38bdf8; }
        44%  { transform: translate(0, -46px) scale(1);       opacity: 0; fill: #38bdf8; }
        50%  { transform: translate(0, -58px) scale(1);       opacity: 0; fill: #f97316; }
        55%  { transform: translate(0, -66px) scale(1);       opacity: 0; fill: #f97316; }
        59%  { transform: translate(0, -72px) scale(1);       opacity: 1; fill: #f97316; }
        72%  { transform: translate(8px, -88px) scale(1);     opacity: 1; fill: #f97316; }
        86%  { transform: translate(18px, -102px) scale(1);   opacity: 1; fill: #f97316; }
        100% { transform: translate(26px, -116px) scale(0.8); opacity: 0; fill: #f97316; }
      }
      .at-mark-head { transform-box: view-box; transform-origin: 60px 35.75px; animation: atStepRotate 3.6s infinite; }
      .at-mark-sub  { fill: #38bdf8; transform-box: fill-box; transform-origin: center; animation: atSubPump 3.6s linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .at-mark-head { animation: none; }
        .at-mark-sub  { animation: none; transform: translateY(-6px); opacity: 1; }
      }
      .at-wordmark {
        background: linear-gradient(135deg, #38bdf8 0%, #22d3ee 45%, #2dd4bf 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      .at-badge { transition: transform .15s ease, box-shadow .15s ease; }
      .at-badge:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(34,211,238,0.18); }
      .at-cta { transition: background .15s ease, transform .15s ease; }
      .at-cta:hover { background: linear-gradient(135deg, #22d3ee 0%, #2dd4bf 100%); transform: translateY(-1px); }
    `}</style>
  );
}

/** The logo mark: activetransport.app's spinning transporter, at any size.
 *
 *  Same geometry and paint order as the site's templates/_logo_mark.html
 *  (viewBox 120x112, rendered 30:28): two membrane leaflets, the ring and tube
 *  of the transporter, a three-lobed head that turns in 120-degree steps, and a
 *  substrate threaded between the head's back and front lobes so it rises
 *  through the motor rather than sliding over it.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-block', width: (size * 30) / 28, height: size, flexShrink: 0 }}>
      <svg viewBox="0 0 120 112" style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}>
        <rect x="0" y="68" width="120" height="8" rx="4" fill="#475569" />
        <rect x="0" y="92" width="120" height="8" rx="4" fill="#475569" />
        <ellipse cx="60" cy="84" rx="20" ry="16" fill="#0d7f76" opacity="0.92"
                 stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.75" />
        <rect x="55" y="50" width="10" height="36" rx="5" fill="#38bdf8" opacity="0.85" />
        <g className="at-mark-head">
          <ellipse cx="60" cy="37" rx="22" ry="16" fill="#fbbf24" opacity="0.28" />
          <circle cx="60" cy="26" r="10.5" fill="#fbbf24" opacity="0.85" />
          <circle cx="43" cy="35" r="10.5" fill="#f59e0b" opacity="0.82" />
          <circle cx="77" cy="35" r="10.5" fill="#f59e0b" opacity="0.82" />
        </g>
        <circle className="at-mark-sub" cx="60" cy="112" r="4.5" />
        <g className="at-mark-head">
          <circle cx="50" cy="47" r="9" fill="#fbbf24" opacity="0.82" />
          <circle cx="70" cy="47" r="9" fill="#fbbf24" opacity="0.82" />
        </g>
      </svg>
    </span>
  );
}

// Small fixed pill, bottom-left, on every page.
export function BrandBadge() {
  return (
    <>
      <BrandStyle />
      <a
        href={AT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="at-badge"
        title="Made by Active Transport — AI NBME questions from your notes"
        style={{
          position: 'fixed', left: 16, bottom: 16, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px 7px 9px', borderRadius: 999,
          background: 'rgba(15,23,42,0.92)', border: '1px solid #334155',
          textDecoration: 'none', backdropFilter: 'blur(6px)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
        }}
      >
        <LogoMark size={22} />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span className="at-wordmark" style={{ fontSize: '0.82rem' }}>Active Transport</span>
          <span style={{ fontSize: '0.62rem', color: '#64748b' }}>AI NBME questions →</span>
        </span>
      </a>
    </>
  );
}

// Linking card for the top of the home page.
export function BrandCard() {
  return (
    <>
      <BrandStyle />
      <a
        href={AT_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
          padding: '16px 18px', borderRadius: 16, textDecoration: 'none',
          background: 'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(45,212,191,0.05))',
          border: '1px solid #1e3a44',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 auto', minWidth: 0 }}>
          <LogoMark size={34} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span className="at-wordmark" style={{ fontSize: '1.05rem' }}>Active Transport</span>
              <span style={{ fontSize: '0.7rem', color: '#5eead4', border: '1px solid #164e46', borderRadius: 999, padding: '1px 8px' }}>
                the full app
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.45 }}>{BLURB}</p>
          </div>
        </div>
        <span
          className="at-cta"
          style={{
            flexShrink: 0, alignSelf: 'center', whiteSpace: 'nowrap',
            padding: '9px 16px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600,
            color: '#0f172a', background: 'linear-gradient(135deg, #38bdf8, #2dd4bf)',
          }}
        >
          Try Active Transport →
        </span>
      </a>
    </>
  );
}
