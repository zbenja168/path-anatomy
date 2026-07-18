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
      @keyframes atParticle {
        0%   { top: -2px; opacity: 0; }
        15%  { opacity: 1; }
        50%  { top: 50%;  opacity: 1; }
        85%  { opacity: 1; }
        100% { top: 100%; opacity: 0; }
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

export function LogoMark({ size = 28 }: { size?: number }) {
  const u = size / 28; // scale factor relative to the 28px reference mark
  const bar = (offset: number) => ({
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
      <span style={bar(-5)} />
      <span style={bar(0)} />
      <span style={bar(5)} />
      {/* channel protein */}
      <span
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 8 * u, height: 14 * u, background: '#0f172a',
          borderLeft: `${2 * u}px solid #22d3ee`, borderRight: `${2 * u}px solid #22d3ee`,
          borderRadius: 2, zIndex: 1,
        }}
      />
      {/* particle transported through the channel */}
      <span
        style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          width: 5 * u, height: 5 * u, borderRadius: '50%',
          background: '#22c55e', boxShadow: '0 0 4px #22c55e', zIndex: 2,
          animation: 'atParticle 2s ease-in-out infinite',
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
