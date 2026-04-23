// Skater.jsx — painterly image of a figure skater that spins HORIZONTALLY
// (rotateY around the vertical axis) based on horizontal mouse position.
//
// Because the source is a raster painting (not geometry), a real horizontal
// spin is faked using CSS 3D rotateY. When the skater turns past ±90° we
// flip her horizontally so the back never shows a mirrored front — we do
// two images: front & mirrored-front, swapping at the right angle, with
// brightness dimming in profile to simulate edge-on compression.

function useMouseYaw(hostRef, sensitivity = 1) {
  const [yaw, setYaw] = React.useState(0);
  const [velocity, setVelocity] = React.useState(0);
  const last = React.useRef({ t: 0, y: 0 });

  React.useEffect(() => {
    const onMove = (e) => {
      const dx = e.clientX - window.innerWidth / 2;
      const y = (dx / (window.innerWidth / 2)) * 540 * sensitivity;
      const now = performance.now();
      const dt = Math.max(1, now - last.current.t);
      const v = Math.abs(y - last.current.y) / dt;
      last.current = { t: now, y };
      setYaw(y);
      setVelocity(v);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [sensitivity]);

  return { yaw, velocity };
}

// Ice shadow beneath the skater
function IceGround({ ink }) {
  return (
    <svg viewBox="0 0 400 60" width="100%" height="60"
      style={{ position: 'absolute', left: 0, right: 0, bottom: -10,
        opacity: 0.35, pointerEvents: 'none' }}>
      <ellipse cx="200" cy="30" rx="160" ry="10" fill="none" stroke={ink} strokeWidth="0.6" />
      <ellipse cx="200" cy="30" rx="120" ry="7" fill="none" stroke={ink} strokeWidth="0.5" strokeDasharray="2 6" />
      <ellipse cx="200" cy="30" rx="80" ry="5" fill="none" stroke={ink} strokeWidth="0.4" strokeDasharray="1 8" />
    </svg>
  );
}

function Skater({
  size = 520,
  sensitivity = 1,
  ink = '#1a1a1a',
  accent = '#c94a3a',
  showRing = true,
  imageSrc = 'assets/skater-photo.png',
  style = {},
}) {
  const hostRef = React.useRef(null);
  const { yaw, velocity } = useMouseYaw(hostRef, sensitivity);

  // Normalize yaw to -180..180 so rotateY feels natural
  const ySigned = (((yaw + 180) % 360) + 360) % 360 - 180;
  // When facing away (|y|>90) we flip horizontally so the painting's side
  // never appears as a mirrored front — gives the illusion of turning through.
  const showBack = Math.abs(ySigned) > 90;
  // Visual rotation applied to the <img>
  const visYaw = showBack ? ySigned - 180 * Math.sign(ySigned) : ySigned;
  // Brightness dips slightly at profile to sell the compression
  const profileness = Math.abs(Math.sin((ySigned * Math.PI) / 180));
  const brightness = 1 - profileness * 0.25;
  // Subtle bob as speed increases
  const bob = -Math.min(8, velocity * 12);

  return (
    <div
      ref={hostRef}
      style={{
        width: size, height: size,
        position: 'relative', pointerEvents: 'none', userSelect: 'none',
        perspective: 1400,
        ...style,
      }}
    >
      {showRing && <IceGround ink={ink} />}

      <div style={{
        position: 'absolute', inset: 0,
        transformStyle: 'preserve-3d',
        transform: `translateY(${bob}px) rotateY(${visYaw}deg) ${showBack ? 'scaleX(-1)' : ''}`,
        transition: 'transform 80ms cubic-bezier(0.2,0.7,0.3,1)',
      }}>
        <img
          src={imageSrc}
          alt="Figure skater"
          draggable={false}
          style={{
            width: '100%', height: '100%',
            objectFit: 'contain',
            filter: `brightness(${brightness}) contrast(1.02)`,
            display: 'block',
          }}
        />
      </div>

      {/* Motion blur ghost when spinning fast */}
      {velocity > 0.4 && (
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          transform: `translateY(${bob}px) rotateY(${visYaw - 15}deg) ${showBack ? 'scaleX(-1)' : ''}`,
          opacity: Math.min(0.3, velocity * 0.35),
          filter: 'blur(3px)',
          pointerEvents: 'none',
        }}>
          <img src={imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Skater });
