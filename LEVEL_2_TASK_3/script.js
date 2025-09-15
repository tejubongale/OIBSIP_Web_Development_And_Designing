/* ====== Storage & Model ====== */
const STORAGE_KEY = "sanchit.todo.v2";
const PROFILE_KEY = "sanchit.profile";

const el = {
  text: document.getElementById("taskText"),
  time: document.getElementById("taskTime"),
  add:  document.getElementById("addBtn"),
  pending: document.getElementById("pendingList"),
  completed: document.getElementById("completedList"),
  toast: document.getElementById("toast"),
  profilePic: document.getElementById("profilePic"),
  profileName: document.getElementById("profileName"),
  editProfile: document.getElementById("editProfile")
};

let tasks = load();
let profile = loadProfile();

/* ====== Profile ====== */
function saveProfile(){
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
function loadProfile(){
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {name:"Sanchit", pic:"https://via.placeholder.com/40"}; }
  catch { return {name:"Sanchit", pic:"https://via.placeholder.com/40"}; }
}
function renderProfile(){
  el.profileName.textContent = profile.name;
  el.profilePic.src = profile.pic;
}
el.editProfile.addEventListener("click", ()=>{
  const newName = prompt("Enter your name:", profile.name);
  if (newName) profile.name = newName.trim();

  const newPic = prompt("Enter profile image URL (or leave empty):", profile.pic);
  if (newPic) profile.pic = newPic;

  saveProfile(); renderProfile(); toast("Profile updated");
});

/* ====== Utils ====== */
const fmt = (ms) => {
  if (!ms) return "No time";
  const d = new Date(ms);
  return d.toLocaleString([], {year:"numeric", month:"numeric", day:"numeric", hour:"numeric", minute:"2-digit"});
};
function uid(){ return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function load(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function toast(msg){
  el.toast.textContent = msg;
  el.toast.classList.add("show");
  setTimeout(() => el.toast.classList.remove("show"), 1800);
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c])); }

/* ====== Render ====== */
function render(){
  el.pending.innerHTML = "";
  el.completed.innerHTML = "";

  tasks
    .sort((a,b) => (a.completed - b.completed) || (a.dueAt||Infinity) - (b.dueAt||Infinity))
    .forEach(t => {
      const li = document.createElement("li");
      li.className = "task" + (t.completed ? " completed" : "");
      li.dataset.id = t.id;
      li.innerHTML = `
        <div class="info">
          <p class="title">${escapeHtml(t.text)}</p>
          <div class="meta">
            <span class="badge"><i class="fa-regular fa-clock"></i>${fmt(t.dueAt)}</span>
            <span class="badge"><i class="fa-regular fa-calendar-plus"></i>Added: ${fmt(t.createdAt)}</span>
            ${t.alarmEnabled && t.dueAt ? `<span class="badge"><i class="fa-solid fa-bell"></i>Alarm on</span>`:``}
          </div>
        </div>
        <div class="actions">
          ${t.completed
            ? `<button class="icon-btn gray" data-action="uncomplete"><i class="fa-solid fa-rotate-left"></i></button>`
            : `<button class="icon-btn green" data-action="complete"><i class="fa-solid fa-check"></i></button>`}
          <button class="icon-btn blue" data-action="edit"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn red" data-action="delete"><i class="fa-solid fa-trash"></i></button>
          <button class="icon-btn gray" data-action="toggleAlarm"><i class="fa-solid fa-bell${t.alarmEnabled ? "" : "-slash"}"></i></button>
        </div>
      `;
      (t.completed ? el.completed : el.pending).appendChild(li);
    });
}

/* ====== CRUD ====== */
function addTask(){
  const text = el.text.value.trim();
  const due = el.time.value ? new Date(el.time.value).getTime() : null;
  if (!text){ el.text.focus(); toast("Please type a task"); return; }
  if (due && isNaN(due)){ toast("Invalid date/time"); return; }

  const t = { id: uid(), text, createdAt: Date.now(), dueAt: due, completed: false, alarmEnabled: !!due, alerted: false };
  tasks.push(t);
  save(); render();

  el.text.value = ""; el.time.value = "";
  toast("Task added");
}

function handleAction(e){
  const btn = e.target.closest("button[data-action]"); if (!btn) return;
  const li = e.target.closest(".task"); const id = li?.dataset.id;
  const t = tasks.find(x => x.id === id); if (!t) return;
  const act = btn.dataset.action;

  if (act === "complete"){ t.completed = true; save(); render(); toast("Completed ✅"); }
  if (act === "uncomplete"){ t.completed = false; save(); render(); }
  if (act === "delete"){ tasks = tasks.filter(x => x.id !== id); save(); render(); toast("Task deleted"); }
  if (act === "edit"){
    const newText = prompt("Edit task:", t.text);
    if (newText && newText.trim()){
      t.text = newText.trim();
      const newTime = prompt("Edit date/time (YYYY-MM-DDTHH:mm)", t.dueAt ? new Date(t.dueAt).toISOString().slice(0,16) : "");
      if (newTime !== null){
        t.dueAt = newTime ? new Date(newTime).getTime() : null;
        t.alarmEnabled = !!t.dueAt;
        t.alerted = false;
      }
      save(); render(); toast("Task updated");
    }
  }
  if (act === "toggleAlarm"){ t.alarmEnabled = !t.alarmEnabled; if (t.alarmEnabled) t.alerted = false; save(); render(); }
}

/* ====== Alarms ====== */
function requestNotificationPermission(){ if ("Notification" in window && Notification.permission==="default"){ Notification.requestPermission(); } }
requestNotificationPermission();

function beep(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    o.start(); setTimeout(()=>{ g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2); o.stop(ctx.currentTime + 0.25); ctx.close(); }, 220);
  }catch(e){}
}
function notify(title, body){ if ("Notification" in window && Notification.permission==="granted"){ new Notification(title,{body,icon:"https://cdn-icons-png.flaticon.com/512/1041/1041916.png"}); } }
function checkAlarms(){
  const now = Date.now(); let changed=false;
  tasks.forEach(t=>{
    if (!t.completed && t.alarmEnabled && t.dueAt && !t.alerted && now >= t.dueAt){
      t.alerted=true; beep(); notify("⏰ Task Reminder", t.text); toast("⏰ Reminder: "+t.text); changed=true;
    }
  });
  if (changed) save();
}
setInterval(checkAlarms, 1000);

/* ====== Events ====== */
el.add.addEventListener("click", addTask);
el.text.addEventListener("keydown", (e)=>{ if(e.key==="Enter") addTask(); });
el.pending.addEventListener("click", handleAction);
el.completed.addEventListener("click", handleAction);

/* First render */
render(); renderProfile();
