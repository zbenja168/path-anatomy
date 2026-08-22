// Active Transport branding — self-contained drop-in for the "Secondary Active
// Transport" free QBanks. Ports the channel/particle logo mark from
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
      /* Substrate rises through the transporter, the way it does in the
         full loading scene — bottom to top, not top to bottom. */
      @keyframes atMarkSub {
        0%   { bottom: -8%; opacity: 0; transform: translateX(-50%) scale(0.7); }
        20%  { opacity: 1; }
        75%  { opacity: 1; }
        100% { bottom: 86%; opacity: 0; transform: translateX(-50%) scale(0.5); }
      }
      @keyframes atMarkHead {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50%      { transform: translateX(-50%) scale(1.12); }
      }
      .at-mark-sub  { transform: translateX(-50%); animation: atMarkSub 2.6s ease-in infinite; }
      .at-mark-head { transform: translateX(-50%); animation: atMarkHead 2.6s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .at-mark-sub  { animation: none; bottom: 40%; opacity: 1; }
        .at-mark-head { animation: none; }
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

/** The transporter, abbreviated to a logo mark.
 *
 *  Same scene as the loading animation, reduced to what survives at 22px: two
 *  leaflets of membrane, the transporter spanning them, its head above, and
 *  substrate moving up through it. The old mark was a static channel with a
 *  green dot; this is the same object doing its job.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  const u = size / 28; // scale factor relative to the 28px reference mark
  const leaflet = (offset: number) => ({
    position: 'absolute' as const,
    left: 0,
    top: `calc(50% + ${offset * u}px)`,
    transform: 'translateY(-50%)',
    width: '100%',
    height: 2 * u,
    background: '#475569',
    borderRadius: 1,
  });
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0 }}>
      {/* the two leaflets of the bilayer */}
      <span style={leaflet(-5)} />
      <span style={leaflet(5)} />
      {/* transporter body, spanning both leaflets the way a real one does */}
      <span
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 8 * u, height: 15 * u, background: '#0d7f76',
          borderLeft: `${1.6 * u}px solid #22d3ee`, borderRight: `${1.6 * u}px solid #22d3ee`,
          borderRadius: 2 * u, zIndex: 1,
        }}
      />
      {/* the head, where the work shows — turning, as in the full scene */}
      <span
        className="at-mark-head"
        style={{
          position: 'absolute', left: '50%', top: 2 * u,
          width: 9 * u, height: 9 * u, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #fde68a, #fbbf24 60%, #f59e0b)',
          boxShadow: `0 0 ${4 * u}px rgba(251,191,36,0.6)`, zIndex: 2,
        }}
      />
      {/* substrate carried up through the transporter */}
      <span
        className="at-mark-sub"
        style={{
          position: 'absolute', left: '50%',
          width: 4 * u, height: 4 * u, borderRadius: '50%',
          background: '#38bdf8', boxShadow: `0 0 ${3 * u}px #38bdf8`, zIndex: 3,
        }}
      />
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
