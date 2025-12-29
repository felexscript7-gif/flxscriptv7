const $ = (id) => document.getElementById(id);

/* =========================
   Matrix (نفس صفحاتك)
========================= */
(function matrix(){
  const canvas = $("matrix");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  if(!ctx) return;

  const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@*+-=<>[]{}()/\\;:.,";
  let fontSize = 14, columns = 0, drops = [];
  let densityBoost = 3, fadeAlpha = 0.06, speedMin = 1, speedMax = 3;

  function resize(){
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontSize = window.innerWidth < 420 ? 12 : 14;
    columns = Math.floor(window.innerWidth / fontSize);

    drops = Array.from({ length: columns }, () => ({
      y: Math.floor(Math.random() * (window.innerHeight / fontSize)),
      v: Math.floor(Math.random() * (speedMax - speedMin + 1)) + speedMin
    }));
  }

  window.addEventListener("resize", resize);
  resize();

  function drawMatrix(){
    ctx.fillStyle = `rgba(5, 6, 10, ${fadeAlpha})`;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

    for(let i=0; i<drops.length; i++){
      const x = i * fontSize;

      for(let k=0; k<densityBoost; k++){
        const t = chars[Math.floor(Math.random() * chars.length)];
        const y = (drops[i].y + k) * fontSize;
        ctx.fillStyle = (Math.random() > 0.987) ? "#eafff3" : "#00ff66";
        ctx.fillText(t, x, y);
      }

      drops[i].y += drops[i].v;

      if(drops[i].y * fontSize > window.innerHeight && Math.random() > 0.70){
        drops[i].y = 0;
        drops[i].v = Math.floor(Math.random() * (speedMax - speedMin + 1)) + speedMin;
      }
    }

    requestAnimationFrame(drawMatrix);
  }

  drawMatrix();
})();

/* =========================
   Users Counter (8 - 15)
========================= */
(function usersCounter(){
  const usersEl = $("users");
  if(!usersEl) return;

  let online = Math.floor(Math.random() * 8) + 8; // 8..15
  usersEl.textContent = String(online);

  function nextTarget(){
    return Math.floor(Math.random() * 8) + 8; // 8..15
  }

  function animateTo(target){
    const step = target > online ? 1 : -1;

    const timer = setInterval(() => {
      if(online === target){
        clearInterval(timer);
        return;
      }
      online += step;
      usersEl.textContent = String(online);
    }, 90);
  }

  setInterval(() => {
    const target = nextTarget();
    animateTo(target);
  }, 2800);
})();