const $ = (id) => document.getElementById(id);

/* =========================
   Matrix (نفس أسلوبك)
========================= */
const canvas = $("matrix");
const ctx = canvas.getContext("2d");

const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@*+-=<>[]{}()/\\;:.,";
let fontSize = 14, columns = 0, drops = [];
let densityBoost = 3, fadeAlpha = 0.06, speedMin = 1, speedMax = 3;

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

/* =========================
   Users Counter
========================= */
const usersEl = $("users");
let online = 58;

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

/* =========================
   Modal: Password -> ID
========================= */
const msgEl = $("msg");
const modal = $("modal");

const modalTitle = $("modalTitle");
const modalGame = $("modalGame");

const stepPass = $("stepPass");
const stepId = $("stepId");

const gamePass = $("gamePass");
const passHint = $("passHint");
const confirmPass = $("confirmPass");
const cancelPass = $("cancelPass");

const accountId = $("accountId");
const idHint = $("idHint");
const verifyIdBtn = $("verifyIdBtn");
const verifyRow = $("verifyRow");

const closeModalBtn = $("closeModal");

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

let expectedPass = "";
let goTo = "";

// ✅ لمنع الضغط المتكرر أثناء التحميل
let verifying = false;

function openModal(gameName, pass, go){
  expectedPass = pass;
  goTo = go;

  modalTitle.textContent = "ENTER PASSWORD";
  modalGame.textContent = gameName;

  // Reset UI
  stepPass.style.display = "";
  stepId.style.display = "none";

  passHint.textContent = "";
  passHint.style.color = "";
  idHint.textContent = "";
  idHint.style.color = "";

  gamePass.value = "";
  accountId.value = "";
  verifyRow.style.display = "none";
  verifyIdBtn.disabled = false;

  verifying = false;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");

  setTimeout(()=> gamePass.focus(), 30);
}

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");

  expectedPass = "";
  goTo = "";
  verifying = false;
}

function gotoIdStep(){
  modalTitle.textContent = "ENTER ACCOUNT ID";
  stepPass.style.display = "none";
  stepId.style.display = "";
  setTimeout(()=> accountId.focus(), 30);
}

/* Step 1: password */
function confirmPassword(){
  const entered = gamePass.value.trim();

  if(!entered){
    passHint.textContent = "❗ أدخل كلمة السر";
    passHint.style.color = "#fca5a5";
    return;
  }
  if(entered !== expectedPass){
    passHint.textContent = "❌ كلمة السر غير صحيحة";
    passHint.style.color = "#fca5a5";
    shake();
    return;
  }

  passHint.textContent = "✅ كلمة السر صحيحة";
  passHint.style.color = "#86efac";
  setTimeout(gotoIdStep, 250);
}

/* Step 2: ID verify */
function isValidId(val){
  // 9 أو 10 أرقام فقط
  return /^[0-9]{9,10}$/.test(val);
}

// فلترة مباشرة: يسمح بالأرقام فقط أثناء الكتابة
accountId.addEventListener("input", ()=>{
  accountId.value = accountId.value.replace(/\D+/g, "").slice(0, 10);
});

function verifyId(){
  if(verifying) return; // ✅ منع تكرار التشغيل

  const id = accountId.value.trim();
  idHint.textContent = "";
  idHint.style.color = "";

  if(!id){
    idHint.textContent = "❗ أدخل ID الحساب";
    idHint.style.color = "#fca5a5";
    return;
  }

  verifying = true;

  // Loading 2 seconds
  verifyIdBtn.disabled = true;
  verifyRow.style.display = "flex";

  setTimeout(()=>{
    verifyRow.style.display = "none";
    verifyIdBtn.disabled = false;

    if(!isValidId(id)){
      idHint.textContent = "❌ ID غير صالح أو لم يربط بالكود برومو";
      idHint.style.color = "#fca5a5";
      shake();
      verifying = false;
      return;
    }

    idHint.textContent = "✅ تم التحقق بنجاح";
    idHint.style.color = "#86efac";
    setMsg("✅ تم فتح اللعبة بنجاح", true);

    // ✅ الإصلاح هنا: خزّن الوجهة قبل closeModal
    setTimeout(()=>{
      const dest = goTo;  // ✅
      closeModal();
      location.href = dest;
    }, 350);

  }, 2000);
}

/* Buttons events */
document.querySelectorAll(".game-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    openModal(btn.dataset.game, btn.dataset.pass, btn.dataset.go);
  });
});

confirmPass.addEventListener("click", confirmPassword);
verifyIdBtn.addEventListener("click", verifyId);

cancelPass.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e)=>{
  if(e.target === modal) closeModal();
});

document.addEventListener("keydown", (e)=>{
  if(!modal.classList.contains("open")) return;

  if(e.key === "Escape") closeModal();

  if(e.key === "Enter"){
    // إذا خطوة كلمة السر ظاهرة
    if(stepPass.style.display !== "none") confirmPassword();
    else verifyId();
  }
});