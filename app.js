const $ = (id) => document.getElementById(id);

const canvas = $("matrix");
const ctx = canvas.getContext("2d");

const usersEl = $("users");
const promoEl = $("promo");
const copyBtn = $("copyBtn");
const copyHint = $("copyHint");
const uidEl = $("uid");
const pwdEl = $("pwd");
const msgEl = $("msg");
const loginBtn = $("loginBtn");

let online = 58;

/* ===== Matrix GREEN (VERY DENSE + FAST) ===== */
const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@*+-=<>[]{}()/\\;:.,";
let fontSize = 14;
let columns = 0;
let drops = [];
let densityBoost = 3;
let fadeAlpha = 0.06;
let speedMin = 1;
let speedMax = 3;

function resize(){
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr,0,0,dpr,0,0);

  fontSize = window.innerWidth < 420 ? 12 : 14;
  columns = Math.floor(window.innerWidth / fontSize);
  drops = Array.from({length: columns}, () => ({
    y: Math.floor(Math.random() * (window.innerHeight / fontSize)),
    v: Math.floor(Math.random() * (speedMax - speedMin + 1)) + speedMin
  }));
}
window.addEventListener("resize", resize);
resize();

function drawMatrix(){
  ctx.fillStyle = `rgba(5, 6, 10, ${fadeAlpha})`;
  ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
  ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

  for(let i=0;i<drops.length;i++){
    const x = i*fontSize;

    for(let k=0;k<densityBoost;k++){
      const t = chars[Math.floor(Math.random()*chars.length)];
      const y = (drops[i].y + k) * fontSize;

      if(Math.random() > 0.987){
        ctx.fillStyle = "#eafff3";
      }else{
        ctx.fillStyle = "#00ff66";
      }
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

/* ===== Users Counter ===== */
function updateUsers(){
  const target = Math.floor(Math.random()*19)+50; // 50-68
  const step = target > online ? 1 : -1;
  const ticks = Math.min(10, Math.abs(target-online));
  let i=0;

  const t = setInterval(()=>{
    online += step;
    usersEl.textContent = String(online);
    i++;
    if(i>=ticks){
      clearInterval(t);
      online = target;
      usersEl.textContent = String(target);
    }
  }, 70);
}
setInterval(updateUsers,3000);
updateUsers();

/* ===== Copy Promo ===== */
copyBtn.addEventListener("click", async ()=>{
  try{
    await navigator.clipboard.writeText(promoEl.value);
    copyHint.textContent = "✅ تم نسخ كود البرومو";
    copyHint.style.color = "#86efac";
  }catch{
    promoEl.select();
    document.execCommand("copy");
    copyHint.textContent = "✅ تم النسخ";
    copyHint.style.color = "#86efac";
  }finally{
    setTimeout(()=>{
      copyHint.textContent = "";
      copyHint.style.color = "";
    }, 1400);
  }
});

/* ===== Messages ===== */
function setMsg(text, ok){
  msgEl.textContent = text;
  msgEl.style.color = ok ? "#86efac" : "#fca5a5";
}
function shake(){
  const card = document.querySelector(".card");
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
}

/* ===== Login (Static) ===== */
function login(){
  const id = uidEl.value.trim();
  const pw = pwdEl.value.trim();

  if(id !== "04112007"){
    setMsg("❌ ID غير مرتبط بالكود برومو", false);
    shake();
    return;
  }
  if(pw !== "McGHp5F7"){
    setMsg("❌ كلمة السر الخاصة بالبوت خاطئة", false);
    shake();
    return;
  }

  setMsg("✅ تم التحقق بنجاح", true);
  setTimeout(()=> (location.href="page2.html"), 700);
}

loginBtn.addEventListener("click", login);
document.addEventListener("keydown", (e)=>{
  if(e.key === "Enter") login();
});