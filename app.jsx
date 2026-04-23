/* Axelnest — App root */
const { useState, useEffect } = React;

function App() {
  const [page, setPage] = useState(() => localStorage.getItem("axn_page") || "home");
  const [comp, setComp] = useState(null);
  const [tweaks, setTweaks] = useState(window.__TWEAKS__);
  const [tweaksOn, setTweaksOn] = useState(false);

  useEffect(() => { localStorage.setItem("axn_page", page); }, [page]);

  // Apply tweaks to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--hue", tweaks.primaryHue);
    root.style.setProperty("--bg-0", `oklch(${tweaks.primaryLightness/100} 0.04 ${tweaks.primaryHue})`);
    root.style.setProperty("--accent-opacity", tweaks.accentEnabled ? "1" : "0");
    root.dataset.mode = tweaks.colorMode;
    root.dataset.font = tweaks.fontStyle;
    if (window.__syncParticles) window.__syncParticles(tweaks.particleDensity);
    // hero position/scale
    const hero = document.getElementById("heroFigure");
    if (hero) {
      hero.style.setProperty("--hero-scale", tweaks.heroScale);
      hero.style.setProperty("--hero-offset-x", tweaks.heroOffsetX + "%");
      const y = window.scrollY;
      const fade = Math.max(0, 1 - y / 800);
      const shift = y * 0.15;
      hero.style.transform = `translate(calc(-50% + ${tweaks.heroOffsetX}%), calc(-50% - ${shift}px)) scale(${tweaks.heroScale * (1 - y * 0.0003)})`;
      hero.style.opacity = 0.15 + fade * 0.85;
    }
    // accent gold toggle
    if (!tweaks.accentEnabled) {
      root.style.setProperty("--gold", "oklch(0.82 0.08 230)");
      root.style.setProperty("--gold-soft", "oklch(0.72 0.06 230)");
    } else {
      root.style.setProperty("--gold", "oklch(0.82 0.12 80)");
      root.style.setProperty("--gold-soft", "oklch(0.72 0.10 80)");
    }
  }, [tweaks]);

  // Edit mode bridge
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === "__activate_edit_mode") setTweaksOn(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOn(false);
    };
    window.addEventListener("message", onMsg);
    try { window.parent.postMessage({type: "__edit_mode_available"}, "*"); } catch(_){}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Hide hero figure on non-home pages (keep it as fixed background only on home)
  useEffect(() => {
    const hero = document.getElementById("heroFigure");
    if (!hero) return;
    hero.style.display = page === "home" ? "block" : "none";
  }, [page]);

  return (
    <>
      <Nav page={page} setPage={setPage} />

      {page === "home" && (
        <div className="page">
          <Hero setPage={setPage} />
          <Competitions onOpen={setComp} compact />
        </div>
      )}

      {page === "competitions" && (
        <div className="page" style={{paddingTop: 80}}>
          <Competitions onOpen={setComp} />
        </div>
      )}

      {page === "tickets" && (
        <div className="page">
          <Tickets />
        </div>
      )}

      {page === "apparel" && (
        <div className="page">
          <Apparel />
        </div>
      )}

      {page === "about" && (
        <div className="page">
          <About />
        </div>
      )}

      <footer className="foot">
        <div className="brand-mark">Axelnest<span className="dot">.</span></div>
        <div>© 2026 · Built by skating parents, for skating families</div>
      </footer>

      {comp && <CompModal comp={comp} onClose={() => setComp(null)} />}

      <TweaksPanel show={tweaksOn} onClose={() => setTweaksOn(false)} tweaks={tweaks} setTweaks={setTweaks} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
