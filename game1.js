const $ = (id) => document.getElementById(id);

/* =========================
   USERS (8 – 15)
========================= */
const usersEl = $("users");
let online = 11;

function updateUsers(){
  const target = Math.floor(Math.random() * 8) + 8; // 8..15
  const step = target > online ? 1 : -1;
  const ticks = Math.min(10, Math.abs(target - online));
  let i = 0;

  const t = setInterval(()=>{
    online += step;
    usersEl.textContent = String(online);
    i++;
    if(i >= ticks){
      clearInterval(t);
      online = target;
      usersEl.textContent = String(target);
    }
  }, 90);
}
setInterval(updateUsers, 2800);
updateUsers();

/* =========================
   GAME CONSTANTS
========================= */
const ROWS = 10;
const COLS = 5;

const IMG_OK = "./assets/apple.png";
const IMG_EATEN = "./assets/apple-eaten.png";

const multipliers = [
  "349.60","69.99","21.92","11.18","6.11",
  "4.02","2.41","1.93","1.54","1.23"
];

/* =========================
   ELEMENTS
========================= */
const gridArea = $("gridArea");
const attemptsEl = $("attempts");
const noticeEl = $("notice");

const showBtn = $("showBtn");
const resetBtn = $("resetBtn");

const idModal = $("idModal");
const confirmModal = $("confirmModal");

const closeIdModal = $("closeIdModal");
const cancelId = $("cancelId");
const okId = $("okId");
const accountId = $("accountId");
const idHint = $("idHint");
const verifyBtn = $("verifyBtn");
const verifyRow = $("verifyRow");

const closeConfirm = $("closeConfirm");
const yesDone = $("yesDone");
const noDone = $("noDone");

/* =========================
   STATE
========================= */
let currentId = "";
let attempts = 64;
let shown = false;
let pattern = null;

const storageKey = (id) => `felex_game1_${id}`;

/* =========================
   HELPERS
========================= */
function setNotice(text, ok){
  noticeEl.textContent = text || "";
  noticeEl.style.color = ok ? "#86efac" : "#fca5a5";
}
function clearNotice(){
  noticeEl.textContent = "";
  noticeEl.style.color = "";
}
function openModal(el){
  el.classList.add("open");
  el.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}
function closeModal(el){
  el.classList.remove("open");
  el.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}
function isValidId(id){
  return /^[0-9]{9,10}$/.test(id);
}

/* =========================
   PATTERN GENERATION
========================= */
function generatePattern(){
  const eatenByRow = [4,3,3,2,2,2,1,1,1,1];
  const p = Array.from({length: ROWS}, () => Array(COLS).fill(false));

  for(let r=0;r<ROWS;r++){
    const idx = [...Array(COLS).keys()];
    idx.sort(()=>Math.random()-0.5);
    for(let i=0;i<eatenByRow[r];i++){
      p[r][idx[i]] = true;
    }
  }
  return p;
}

/* =========================
   RENDER GRID
========================= */
function renderGrid(){
  gridArea.innerHTML = "";

  for(let r=0;r<ROWS;r++){
    const label = document.createElement("div");
    label.className = "rowLabel";
    label.textContent = "x" + multipliers[r];
    gridArea.appendChild(label);

    const row = document.createElement("div");
    row.className = "rowGrid";

    for(let c=0;c<COLS;c++){
      const token = document.createElement("div");
      token.className = "token";

      const img = document.createElement("img");
      const eaten = shown && pattern && pattern[r][c];

      img.src = eaten ? IMG_EATEN : IMG_OK;
      img.alt = eaten ? "Eaten Apple" : "Apple";
      img.loading = "lazy";

      token.appendChild(img);
      row.appendChild(token);
    }

    gridArea.appendChild(row);
  }
}

/* =========================
   STORAGE
========================= */
function loadState(id){
  const raw = localStorage.getItem(storageKey(id));
  if(!raw) return;

  try{
    const data = JSON.parse(raw);
    attempts = Number.isFinite(data.attempts) ? data.attempts : 64;
    shown = !!data.shown;
    pattern = Array.isArray(data.pattern) ? data.pattern : null;
  }catch{}
}

function saveState(){
  if(!currentId) return;
  localStorage.setItem(storageKey(currentId), JSON.stringify({ attempts, shown, pattern }));
}

/* =========================
   SHOW FLOW
========================= */
function askForId(){
  accountId.value = currentId || "";
  idHint.textContent = "";
  idHint.style.color = "";
  verifyRow.style.display = "none";
  okId.disabled = true;
  verifyBtn.disabled = false;

  openModal(idModal);
  setTimeout(()=> accountId.focus(), 50);
}

accountId.addEventListener("input", ()=>{
  accountId.value = accountId.value.replace(/\D+/g, "").slice(0, 10);
  okId.disabled = true;
  idHint.textContent = "";
  idHint.style.color = "";
});

verifyBtn.addEventListener("click", ()=>{
  const id = accountId.value.trim();

  if(!id){
    idHint.textContent = "❗ أدخل ID الحساب";
    idHint.style.color = "#fca5a5";
    okId.disabled = true;
    return;
  }

  verifyBtn.disabled = true;
  verifyRow.style.display = "flex";
  idHint.textContent = "";
  idHint.style.color = "";

  setTimeout(()=>{
    verifyRow.style.display = "none";
    verifyBtn.disabled = false;

    if(!isValidId(id)){
      idHint.textContent = "❌ ID غير صالح أو لم يربط بالكود برومو";
      idHint.style.color = "#fca5a5";
      okId.disabled = true;
      return;
    }

    idHint.textContent = "✅ تم التحقق";
    idHint.style.color = "#86efac";
    okId.disabled = false;
  }, 2000);
});

okId.addEventListener("click", ()=>{
  const id = accountId.value.trim();
  if(!isValidId(id)) return;

  currentId = id;

  loadState(currentId);
  attemptsEl.textContent = String(attempts);

  shown = true;
  pattern = generatePattern();

  saveState();
  closeModal(idModal);
  clearNotice();
  renderGrid();
});

/* =========================
   START OVER
========================= */
function startOver(){
  if(!currentId){
    setNotice("❗ اضغط Show أولاً ثم أدخل ID الحساب", false);
    return;
  }
  openModal(confirmModal);
}

yesDone.addEventListener("click", ()=>{
  closeModal(confirmModal);

  if(attempts > 0) attempts -= 1;
  attemptsEl.textContent = String(attempts);

  shown = false;
  pattern = null;

  saveState();
  renderGrid();
  setNotice("✅ تم بدء محاولة جديدة", true);
});

noDone.addEventListener("click", ()=>{
  closeModal(confirmModal);
  setNotice("يرجى إكمال الرهان السابق", false);
});

/* =========================
   CLOSE MODALS
========================= */
closeIdModal.addEventListener("click", ()=> closeModal(idModal));
cancelId.addEventListener("click", ()=> closeModal(idModal));
closeConfirm.addEventListener("click", ()=> closeModal(confirmModal));

idModal.addEventListener("click", (e)=>{ if(e.target === idModal) closeModal(idModal); });
confirmModal.addEventListener("click", (e)=>{ if(e.target === confirmModal) closeModal(confirmModal); });

document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape"){
    if(idModal.classList.contains("open")) closeModal(idModal);
    if(confirmModal.classList.contains("open")) closeModal(confirmModal);
  }
});

/* =========================
   BUTTONS
========================= */
showBtn.addEventListener("click", askForId);
resetBtn.addEventListener("click", startOver);

/* =========================
   INIT
========================= */
attemptsEl.textContent = String(attempts);
renderGrid();