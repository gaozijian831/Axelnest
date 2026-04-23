/* Axelnest components */
const { useState, useEffect, useMemo, useRef } = React;

function Nav({ page, setPage }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "competitions", label: "Competitions" },
    { id: "tickets", label: "Tickets" },
    { id: "apparel", label: "Apparel" },
    { id: "about", label: "About" },
  ];
  return (
    <nav className="nav">
      <div className="brand" onClick={() => setPage("home")} style={{cursor:"pointer"}}>
        <span>Axelnest<span className="dot"></span></span>
        <em>a home for figure skaters</em>
      </div>
      <div className="nav-links">
        {items.map(it => (
          <button
            key={it.id}
            className={page === it.id ? "active" : ""}
            onClick={() => { setPage(it.id); window.scrollTo({top:0, behavior:"smooth"}); }}
          >{it.label}</button>
        ))}
      </div>
    </nav>
  );
}

function Hero({ setPage }) {
  return (
    <section className="hero-section" data-screen-label="Home · Hero">
      <div className="hero-text">
        <div className="hero-eyebrow">Est. 2026 · For skaters & their families</div>
        <h1 className="hero-title">
          Where the <em>quiet ones</em><br/>
          belong.
        </h1>
        <p className="hero-sub">
          Competitions, rinks, and resources — built by skating parents, for skating families.
          A warm rink-side lobby in a sport too often flying under the radar.
        </p>
        <div className="hero-cta">
          <button className="btn primary" onClick={() => setPage("competitions")}>
            Find a competition <span className="arrow">→</span>
          </button>
          <button className="btn" onClick={() => setPage("tickets")}>
            Buy tickets
          </button>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <span className="line"></span>
      </div>
    </section>
  );
}

function Competitions({ onOpen, compact=false }) {
  const [filter, setFilter] = useState("All");
  const states = useMemo(() => {
    return ["All", ...Array.from(new Set(window.COMPETITIONS.map(c => c.state)))];
  }, []);
  const list = filter === "All" ? window.COMPETITIONS : window.COMPETITIONS.filter(c => c.state === filter);
  return (
    <section className="section" data-screen-label={compact ? "Home · Competitions" : "Competitions page"}>
      <div className="section-wrap">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Upcoming · Club competitions</span>
            <h2 className="section-title">Competitions<br/><em>across the States.</em></h2>
          </div>
          <p className="section-desc">
            Curated non-qualifying competitions from skating clubs nationwide. Tap a card for the full schedule, officials, and travel notes from parents who've been there.
          </p>
        </div>
        <div className="comp-filters">
          {states.map(s => (
            <button key={s} className={"chip " + (filter===s?"active":"")} onClick={() => setFilter(s)}>
              {s === "All" ? "All states" : s}
            </button>
          ))}
        </div>
        <div className="comp-grid">
          {list.map(c => (
            <CompCard key={c.id} comp={c} onClick={() => onOpen(c)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompCard({ comp, onClick }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
    e.currentTarget.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
  };
  return (
    <article className="comp-card" onClick={onClick} onMouseMove={onMove}>
      <div className="comp-card-top">
        <div className="comp-date">{comp.dateShort} · 2026</div>
        <div className={"comp-status " + comp.status}>
          {comp.status === "open" ? "Registration open" : "Closing soon"}
        </div>
      </div>
      <h3 className="comp-name">{comp.name}</h3>
      <div className="comp-meta">
        <div className="row"><span className="k">Club</span><span className="v">{comp.club}</span></div>
        <div className="row"><span className="k">Venue</span><span className="v">{comp.venue}</span></div>
        <div className="row"><span className="k">City</span><span className="v">{comp.city}</span></div>
        <div className="row"><span className="k">Register</span><span className="v">by {comp.registerBy}</span></div>
      </div>
    </article>
  );
}

function CompModal({ comp, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!comp) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-hero">
          <div className="modal-eyebrow">
            <span>{comp.dateLong}</span>
            <span>·</span>
            <span>{comp.level}</span>
          </div>
          <h2 className="modal-title">{comp.name}</h2>
          <div className="modal-basics">
            <div className="item">
              <div className="label">Host Club</div>
              <div>{comp.club}</div>
            </div>
            <div className="item">
              <div className="label">Venue</div>
              <div>{comp.venue}</div>
            </div>
            <div className="item">
              <div className="label">Location</div>
              <div>{comp.city}</div>
            </div>
            <div className="item">
              <div className="label">Register by</div>
              <div>{comp.registerBy}</div>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-main">
            <div className="block">
              <h4 className="block-title">About this event</h4>
              <p style={{color:"var(--fg-1)", lineHeight:1.7, fontSize:15, margin:0, fontWeight:300}}>
                {comp.description}
              </p>
            </div>

            <div className="block">
              <h4 className="block-title">Schedule</h4>
              <div>
                {comp.schedule.map((s, i) => (
                  <div className="schedule-row" key={i}>
                    <div className="schedule-day">{s.day}</div>
                    <div>
                      <span className="schedule-event">{s.event}</span>
                      {s.sub && <span className="sub">{s.sub}</span>}
                    </div>
                    <div className="schedule-time">{s.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="block">
              <h4 className="block-title">Levels & groups</h4>
              <div className="level-grid">
                {comp.levels.map((l, i) => (
                  <div className="level-tag" key={i}>
                    <span>{l.name}</span>
                    <span className="num">{l.count} entries</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="block">
              <h4 className="block-title">Past years</h4>
              <div className="gallery">
                {comp.past.map((y) => (
                  <div className="ph" key={y}>Photos · {y}</div>
                ))}
              </div>
              <p style={{color:"var(--fg-3)", fontSize:12, marginTop:14, fontFamily:"var(--font-mono)", letterSpacing:"0.1em"}}>
                Results archive → link placeholder
              </p>
            </div>

            <div className="cta-row">
              <a href={comp.registerLink} className="btn primary">Register now <span className="arrow">→</span></a>
              <button className="btn">Add to calendar</button>
            </div>
          </div>

          <aside className="modal-side">
            <div className="block">
              <h4 className="block-title">Officials</h4>
              {comp.officials.map((o, i) => (
                <div className="official-row" key={i}>
                  <span className="official-role">{o.role}</span>
                  <span className="official-name">{o.name}</span>
                </div>
              ))}
            </div>

            <div className="block">
              <h4 className="block-title">Parent notes</h4>
              {comp.logistics.map((t, i) => (
                <div className="tip" key={i}>
                  <span className="tip-label">{t.label}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tickets ---------- */
function Tickets() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);  // selected rink (object)
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = React.useRef(null);

  const matches = useMemo(() => {
    if (!q.trim()) return [];
    const query = q.trim().toLowerCase();
    return window.RINKS
      .filter(r => (r.name + " " + r.city + " " + r.state + " " + r.event).toLowerCase().includes(query))
      .slice(0, 50);
  }, [q]);

  React.useEffect(() => { setHighlighted(0); }, [q]);

  function highlightMatch(text, query) {
    if (!query) return text;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <React.Fragment>
        {text.slice(0, idx)}
        <mark>{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </React.Fragment>
    );
  }

  function selectRink(r) {
    setSelected(r);
    setQ("");
    setFocused(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e) {
    if (!matches.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, matches.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const r = matches[highlighted];
      if (r) {
        setSelected(r);
        setQ("");
        setFocused(false);
        window.open(r.link, "_blank", "noopener,noreferrer");
      }
    }
    else if (e.key === "Escape") { setQ(""); setFocused(false); inputRef.current?.blur(); }
  }

  const showDropdown = focused && q.trim().length > 0;

  return (
    <div data-screen-label="Tickets page">
      <div className="tickets-head">
        <span className="section-eyebrow">Tickets · Across the U.S.</span>
        <h1 className="section-title">Find a rink.<br/><em>Buy tickets.</em></h1>
        <p className="section-desc">
          Search {window.RINKS.length}+ rinks — competition venues, training centers, and community rec centers across all 50 states.
        </p>
      </div>

      <div className="rink-search">
        <div className="search-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7"/>
            <path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search rinks, cities, states, or events..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          {showDropdown && (
            <div className="search-dropdown">
              {matches.length === 0 ? (
                <div className="search-empty">No rinks match "{q}"</div>
              ) : (
                <React.Fragment>
                  <div className="search-hint">{matches.length} result{matches.length !== 1 ? "s" : ""} — ↑↓ to navigate · Enter to select</div>
                  {matches.map((r, i) => (
                    <a
                      key={r.id}
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={"search-option " + (i === highlighted ? "highlighted" : "")}
                      onMouseEnter={() => setHighlighted(i)}
                      onMouseDown={(e) => {
                        // Left-click: also mark it as selected so the pin shows when user returns.
                        if (e.button === 0) {
                          setSelected(r);
                          setQ("");
                          setFocused(false);
                        }
                      }}
                    >
                      <div>
                        <div className="so-name">{highlightMatch(r.name, q)}</div>
                        <div className="so-city">{highlightMatch(r.city, q)}</div>
                      </div>
                      <div className="so-meta">
                        <span className="date">{r.date}</span>
                        ${r.priceFrom}–${r.priceTo}
                        <span className="so-go">Buy <span className="arrow">↗</span></span>
                      </div>
                    </a>
                  ))}
                </React.Fragment>
              )}
            </div>
          )}
          {!showDropdown && (
            <div className="search-stats">
              {selected
                ? <span>Showing <strong style={{color:"var(--gold)"}}>{selected.name}</strong> — <a href="#" onClick={e => { e.preventDefault(); setSelected(null); }} style={{color:"var(--fg-2)", textDecoration:"underline"}}>clear</a></span>
                : <span>{window.RINKS.length} rinks in database · 50 states</span>
              }
            </div>
          )}
        </div>
      </div>

      <div className="map-area">
        <div className="map">
          {selected && (
            <a
              key={selected.id}
              href={selected.link}
              target="_blank"
              rel="noopener noreferrer"
              className="map-pin active"
              style={{ left: selected.x + "%", top: selected.y + "%", opacity: 1 }}
            >
              <div className="map-tooltip map-tooltip-rich">
                <div className="mt-name">{selected.name}</div>
                <div className="mt-city">{selected.city.toUpperCase()}</div>
                <div className="mt-buy">Buy tickets <span>↗</span></div>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Apparel placeholder ---------- */
function Apparel() {
  return (
    <div className="apparel-wrap" data-screen-label="Apparel page">
      <div className="apparel-inner">
        <div className="apparel-eyebrow">Coming Soon</div>
        <h1 className="apparel-title">Competition <em>apparel.</em></h1>
        <p className="apparel-desc">
          A curated selection of dresses, warm-ups, and accessories built for competition days.
          We're working with small designers and skating families to launch soon.
        </p>
        <button className="btn primary">Join the waitlist <span className="arrow">→</span></button>
        <div className="apparel-placeholders">
          <div className="dress-placeholder">Dress · Image</div>
          <div className="dress-placeholder">Warm-up · Image</div>
          <div className="dress-placeholder">Accessory · Image</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <div className="about-wrap" data-screen-label="About page">
      <span className="section-eyebrow">About Axelnest</span>
      <h1 className="about-mission">
        A quiet sport deserves a <em>loud home.</em><br/>
        <span className="gold">This is ours.</span>
      </h1>

      <div className="about-grid">
        <div className="about-label">Why we built it</div>
        <div className="about-body">
          <p>
            We're parents of two figure skaters. Most mornings start before sunrise, most weekends
            end at a rink two states away, and most families like ours are doing this quietly, without the
            budgets, the sponsors, or the spotlights that other sports take for granted.
          </p>
          <p>
            Figure skating is a small sport. Information is scattered across club websites, Facebook groups,
            and tattered paper handouts passed around the lobby. Travel logistics are improvised.
            Competition ticketing is a scavenger hunt. The sport asks enormous things of its kids and
            their families, and gives very little back in return.
          </p>
          <p>
            Axelnest is our small answer. A single place for skating families to find the next
            competition, buy a ticket, and feel seen. A home — for the early-morning families,
            the rink-drive families, the patch-dress families. For every kid who is quietly brilliant
            out on the ice.
          </p>
        </div>
      </div>

      <div className="about-contact">
        <div className="item">
          <span className="label">Contact</span>
          <span className="value">hello@axelnest.com</span>
        </div>
        <div className="item">
          <span className="label">Based in</span>
          <span className="value">United States</span>
        </div>
        <div className="item">
          <span className="label">Founded</span>
          <span className="value">2026</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tweaks ---------- */
function TweaksPanel({ show, onClose, tweaks, setTweaks }) {
  const set = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    try {
      window.parent.postMessage({type: '__edit_mode_set_keys', edits: {[k]: v}}, '*');
    } catch(e){}
  };
  return (
    <div className={"tweaks-panel " + (show ? "show" : "")}>
      <h3>
        Tweaks
        <button className="close" onClick={onClose}>×</button>
      </h3>

      <div className="tweak-row">
        <label>Color mode <span className="val">{tweaks.colorMode}</span></label>
        <div className="opts">
          <button className={tweaks.colorMode==="dark"?"active":""} onClick={()=>set("colorMode","dark")}>Dark</button>
          <button className={tweaks.colorMode==="light"?"active":""} onClick={()=>set("colorMode","light")}>Light</button>
        </div>
      </div>

      <div className="tweak-row">
        <label>Font style <span className="val">{tweaks.fontStyle}</span></label>
        <div className="opts">
          <button className={tweaks.fontStyle==="serif"?"active":""} onClick={()=>set("fontStyle","serif")}>Serif</button>
          <button className={tweaks.fontStyle==="sans"?"active":""} onClick={()=>set("fontStyle","sans")}>Sans</button>
        </div>
      </div>

      <div className="tweak-row">
        <label>Primary hue <span className="val">{tweaks.primaryHue}°</span></label>
        <input type="range" min="200" max="300" value={tweaks.primaryHue} onChange={e=>set("primaryHue", +e.target.value)} />
      </div>

      <div className="tweak-row">
        <label>Background depth <span className="val">{tweaks.primaryLightness}%</span></label>
        <input type="range" min="8" max="30" value={tweaks.primaryLightness} onChange={e=>set("primaryLightness", +e.target.value)} />
      </div>

      <div className="tweak-row">
        <label>Gold accent <span className="val">{tweaks.accentEnabled?"on":"off"}</span></label>
        <div className="opts">
          <button className={tweaks.accentEnabled?"active":""} onClick={()=>set("accentEnabled", true)}>On</button>
          <button className={!tweaks.accentEnabled?"active":""} onClick={()=>set("accentEnabled", false)}>Off</button>
        </div>
      </div>

      <div className="tweak-row">
        <label>Particle density <span className="val">{tweaks.particleDensity}</span></label>
        <input type="range" min="0" max="200" value={tweaks.particleDensity} onChange={e=>set("particleDensity", +e.target.value)} />
      </div>

      <div className="tweak-row">
        <label>Hero figure scale <span className="val">{tweaks.heroScale.toFixed(2)}</span></label>
        <input type="range" min="0.6" max="1.4" step="0.05" value={tweaks.heroScale} onChange={e=>set("heroScale", +e.target.value)} />
      </div>

      <div className="tweak-row">
        <label>Hero X offset <span className="val">{tweaks.heroOffsetX}%</span></label>
        <input type="range" min="-30" max="30" value={tweaks.heroOffsetX} onChange={e=>set("heroOffsetX", +e.target.value)} />
      </div>
    </div>
  );
}

Object.assign(window, { Nav, Hero, Competitions, CompCard, CompModal, Tickets, Apparel, About, TweaksPanel });
