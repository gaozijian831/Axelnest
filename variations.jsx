// Three editorial welcome page variations for Axelnest.com
// All share the Skater silhouette but differ in composition/rhythm.

// ── Shared small bits ────────────────────────────────────────
function Divider({ color = 'currentColor', opacity = 0.2, style = {} }) {
  return <div style={{ height: 1, background: color, opacity, ...style }} />;
}

function GridOverlay({ show, cols = 12, color = '#1a1a1a' }) {
  if (!show) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(to right, ${color}08 0, ${color}08 1px, transparent 1px, transparent calc(100%/${cols}))`,
        mixBlendMode: 'multiply',
      }}
    />
  );
}

// Color presets — match the warm stone + ink + terracotta palette
// Backgrounds that respond to the "background" tweak
function bgStyle(kind, ink) {
  if (kind === 'solid') return { background: '#efeae0' };
  if (kind === 'gradient') {
    return {
      background: 'radial-gradient(ellipse at 70% 40%, #f5f0e6 0%, #eae3d4 55%, #d9cfbc 100%)',
    };
  }
  // 'ice' — subtle horizontal striations suggesting ice surface
  return {
    background: `
      linear-gradient(180deg, #f2ede3 0%, #ebe4d6 100%),
      repeating-linear-gradient(180deg, transparent 0, transparent 3px, ${ink}04 3px, ${ink}04 4px)
    `,
    backgroundBlendMode: 'multiply',
  };
}

// ── VARIATION 1 ─────────────────────────────────────────────
// "Editorial Column" — serif display left, skater right, strict grid
function V1_EditorialColumn({ tweaks }) {
  const { accent, sensitivity, skaterSize, background, headline, showGrid } = tweaks;
  const ink = '#1a1a1a';
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
      color: ink,
      ...bgStyle(background, ink),
      overflow: 'hidden',
    }}>
      <GridOverlay show={showGrid} />

      {/* Nav */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '28px 48px',
        fontFamily: '"Inter", sans-serif',
        fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500,
      }}>
        <div style={{ fontFamily: '"Italiana", serif', fontSize: 22, letterSpacing: 4, textTransform: 'none' }}>
          AXELNEST
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          <span>Events</span>
          <span>Skaters</span>
          <span>Journal</span>
          <span style={{ opacity: 0.5 }}>Log in</span>
        </div>
      </nav>

      {/* Left column — text */}
      <div style={{
        position: 'absolute', top: '50%', left: 72, transform: 'translateY(-50%)',
        width: 560,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: ink, opacity: 0.55, marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ width: 24, height: 1, background: ink, opacity: 0.4 }} />
          Vol. VII — Winter Calendar 2026
        </div>

        <h1 style={{
          fontFamily: '"Italiana", serif',
          fontSize: 108, lineHeight: 0.95, fontWeight: 400,
          margin: 0, letterSpacing: -1.5,
          textWrap: 'balance',
        }}>
          {headline.split('\n').map((line, i) => (
            <div key={i} style={i === 1 ? { fontStyle: 'italic', paddingLeft: 80, color: accent } : {}}>
              {line}
            </div>
          ))}
        </h1>

        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: 15, lineHeight: 1.65, fontWeight: 400,
          maxWidth: 400, marginTop: 40, marginBottom: 0,
          color: ink, opacity: 0.75,
        }}>
          A quiet archive for the figure skating world — competitions, choreography, and the long silence between jumps. Move your cursor; she spins.
        </p>

        <div style={{ marginTop: 48, display: 'flex', gap: 14, alignItems: 'center' }}>
          <button style={{
            fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500,
            background: ink, color: '#f2ede3', border: 'none', padding: '16px 28px', borderRadius: 0,
            cursor: 'pointer',
          }}>
            The Winter Series →
          </button>
          <button style={{
            fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500,
            background: 'transparent', color: ink, border: 'none', padding: '16px 8px', cursor: 'pointer',
          }}>
            Read the journal
          </button>
        </div>
      </div>

      {/* Right — skater */}
      <div style={{
        position: 'absolute', top: '50%', right: 120, transform: 'translateY(-50%)',
      }}>
        <Skater size={skaterSize} sensitivity={sensitivity} ink={ink} accent={accent} showRing pivotOnBlade />
      </div>

      {/* Bottom — US event strip (clickable) */}
      <div style={{
        position: 'absolute', bottom: 32, left: 72, right: 72,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28,
        fontFamily: '"Inter", sans-serif', fontSize: 12,
        pointerEvents: 'auto',
      }}>
        {US_EVENTS.map((ev) => (
          <EventTeaser key={ev.slug} ev={ev} accent={accent} />
        ))}
      </div>

      {/* Page-number detail */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        fontFamily: '"Italiana", serif', fontSize: 14, letterSpacing: 8,
        opacity: 0.4,
      }}>— 001 —</div>
    </div>
  );
}

function EventTeaser({ ev, accent }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={`event.html?e=${ev.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', color: 'inherit', textDecoration: 'none',
        cursor: 'pointer', maxWidth: 200,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 180ms cubic-bezier(.2,.7,.3,1)',
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.55, marginBottom: 6 }}>
        {ev.dateShort} · {ev.city.split(',')[0]}
      </div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 19, lineHeight: 1.2 }}>
        {ev.event}
      </div>
      <div style={{
        marginTop: 10, height: 1, background: accent,
        width: hover ? 100 : 40,
        transition: 'width 260ms cubic-bezier(.2,.7,.3,1)',
      }} />
    </a>
  );
}

// ── VARIATION 2 ─────────────────────────────────────────────
// "Centered Cinema" — skater dead-center, massive layered wordmark,
// meta info at the four corners like an editorial cover
function V2_CenteredCinema({ tweaks }) {
  const { accent, sensitivity, skaterSize, background, headline, showGrid } = tweaks;
  const ink = '#141414';
  const lines = headline.split('\n');
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      fontFamily: '"Inter", sans-serif', color: ink,
      ...bgStyle(background, ink),
      overflow: 'hidden',
    }}>
      <GridOverlay show={showGrid} />

      {/* Corner meta */}
      <div style={{ position: 'absolute', top: 32, left: 40, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: 1, opacity: 0.7 }}>
        AXELNEST<br />
        ━━━━━━<br />
        EST. MMXXVI
      </div>
      <div style={{ position: 'absolute', top: 32, right: 40, textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: 1, opacity: 0.7 }}>
        N 60°10'  E 024°56'<br />
        HEL · −4°C<br />
        20:14 LT
      </div>
      <div style={{ position: 'absolute', bottom: 32, left: 40, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: 1, opacity: 0.7 }}>
        ISSUE 07<br />
        WINTER <span style={{ color: accent }}>●</span> SPRING 2026
      </div>
      <div style={{ position: 'absolute', bottom: 32, right: 40, textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: 1, opacity: 0.7 }}>
        <a href={`event.html?e=${US_EVENTS[0].slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          Next → {US_EVENTS[0].code}<br />
          <span style={{ color: accent }}>{US_EVENTS[0].event} · {US_EVENTS[0].city.split(',')[0]} ↗</span>
        </a>
      </div>

      {/* Huge background wordmark */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        fontFamily: '"Italiana", serif',
        fontSize: 360, fontWeight: 400, lineHeight: 0.82,
        color: ink, opacity: 0.06, whiteSpace: 'nowrap',
        pointerEvents: 'none',
        letterSpacing: -8,
      }}>
        {lines[0] || headline}
      </div>

      {/* Skater centered */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
      }}>
        <Skater size={skaterSize} sensitivity={sensitivity} ink={ink} accent={accent} showRing pivotOnBlade />
      </div>

      {/* Overlaid headline — below skater */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: '18%',
        textAlign: 'center',
        fontFamily: '"Italiana", serif',
      }}>
        <div style={{ fontSize: 11, letterSpacing: 6, textTransform: 'uppercase', opacity: 0.6, marginBottom: 16, fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
          — A Figure Skating Quarterly —
        </div>
        <div style={{ fontSize: 64, fontStyle: 'italic', color: accent, lineHeight: 1 }}>
          {lines[1] || 'on axis.'}
        </div>
      </div>

      {/* Thin framing rule */}
      <div style={{ position: 'absolute', inset: 20, border: `1px solid ${ink}`, opacity: 0.15, pointerEvents: 'none' }} />
    </div>
  );
}

// ── VARIATION 3 ─────────────────────────────────────────────
// "Magazine Grid" — broken 3-column layout with events integrated
function V3_MagazineGrid({ tweaks }) {
  const { accent, sensitivity, skaterSize, background, headline, showGrid } = tweaks;
  const ink = '#181411';
  const lines = headline.split('\n');
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      fontFamily: '"Inter", sans-serif', color: ink,
      ...bgStyle(background, ink),
      overflow: 'hidden',
    }}>
      <GridOverlay show={showGrid} cols={12} />

      {/* masthead strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54,
        borderBottom: `1px solid ${ink}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: 1,
      }}>
        <span style={{ opacity: 0.7 }}>axelnest.com</span>
        <div style={{ fontFamily: '"Italiana", serif', fontSize: 20, letterSpacing: 6 }}>AXELNEST</div>
        <span style={{ opacity: 0.7 }}>20.04.2026 · N°07</span>
      </div>

      {/* 12-col grid container */}
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, bottom: 0,
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'auto 1fr auto',
        columnGap: 24, rowGap: 0,
        padding: '32px 32px 24px',
      }}>
        {/* TL — kicker */}
        <div style={{ gridColumn: '1 / 4', gridRow: '1 / 2' }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.6 }}>
            Feature 01 —— the spin
          </div>
          <p style={{
            fontFamily: '"Cormorant Garamond", serif', fontSize: 16, lineHeight: 1.5,
            marginTop: 18, marginBottom: 0, opacity: 0.85, textWrap: 'pretty',
          }}>
            The scratch spin rotates at up to 300 revolutions per minute. At that speed the blade cuts a circle smaller than a euro coin.
          </p>
          <div style={{ marginTop: 24, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: accent, fontWeight: 500 }}>
            Read essay →
          </div>
        </div>

        {/* CENTER — huge headline + skater */}
        <div style={{ gridColumn: '4 / 10', gridRow: '1 / 3', position: 'relative', paddingTop: 8 }}>
          <h1 style={{
            fontFamily: '"Italiana", serif', fontWeight: 400,
            fontSize: 140, lineHeight: 0.9, margin: 0, textAlign: 'center',
            letterSpacing: -2,
          }}>
            {lines[0] || headline}
          </h1>
          {lines[1] && (
            <div style={{
              fontFamily: '"Italiana", serif', fontStyle: 'italic',
              fontSize: 64, lineHeight: 1, textAlign: 'center',
              color: accent, marginTop: -6,
            }}>
              {lines[1]}
            </div>
          )}
          {/* Skater overlays the headline */}
          <div style={{
            position: 'absolute', left: '50%', top: '56%', transform: 'translate(-50%, -50%)',
          }}>
            <Skater size={skaterSize} sensitivity={sensitivity} ink={ink} accent={accent} showRing pivotOnBlade />
          </div>
        </div>

        {/* TR — dateline / weather of the ice */}
        <div style={{ gridColumn: '10 / 13', gridRow: '1 / 2', textAlign: 'right' }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.6 }}>
            Surface report
          </div>
          <div style={{ fontFamily: '"Italiana", serif', fontSize: 54, lineHeight: 1, marginTop: 10 }}>
            −4°
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            Helsinki Ice Hall · Rink 2<br />
            Humidity 43% · Hardness 7.1
          </div>
        </div>

        {/* Bottom row — events calendar */}
        <div style={{ gridColumn: '1 / 13', gridRow: '3 / 4', marginTop: 16 }}>
          <div style={{
            borderTop: `1px solid ${ink}33`,
            paddingTop: 16,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: 2, textTransform: 'uppercase', opacity: 0.55,
              gridColumn: '1 / 2',
            }}>
              Upcoming<br />Competitions →
            </div>
            {US_EVENTS.slice(0, 3).map((ev) => (
              <EventRow key={ev.slug} ev={ev} accent={accent} ink={ink} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventRow({ ev, accent, ink }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={`event.html?e=${ev.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', color: 'inherit', textDecoration: 'none',
        cursor: 'pointer',
        borderLeft: `2px solid ${hover ? accent : ink + '22'}`,
        paddingLeft: 14,
        transition: 'border-color 180ms, transform 180ms',
        transform: hover ? 'translateX(3px)' : 'translateX(0)',
      }}
    >
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: 1, color: accent }}>
        {ev.code} · {ev.city.split(',')[0].toUpperCase()}
      </div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 20, lineHeight: 1.15, marginTop: 6 }}>
        {ev.event}
      </div>
      <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>
        {ev.note}
      </div>
    </a>
  );
}

Object.assign(window, { V1_EditorialColumn, V2_CenteredCinema, V3_MagazineGrid });
