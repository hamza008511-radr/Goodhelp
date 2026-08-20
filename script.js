// ===== CONFIG =====
const ADMIN_PASSWORD = "Aa102030";

// ===== DRAWER (hamburger menu) =====
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');

function openDrawer(){ drawer.classList.add('open'); drawerOverlay.classList.add('open'); }
function closeDrawer(){ drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }
menuBtn.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

// ===== HERO SCROLL CROSSFADE =====
// bg-a (image 1) fades out into bg-b (image 2) as the hero is scrolled past.
const bgB = document.querySelector('.bg-b');
const hero = document.getElementById('hero');
window.addEventListener('scroll', () => {
  const heroHeight = hero.offsetHeight;
  const scrolled = window.scrollY;
  const progress = Math.min(Math.max(scrolled / heroHeight, 0), 1);
  bgB.style.opacity = progress;
});

// ===== DATA STORE (localStorage) =====
// NOTE: this stores content in the visitor's own browser. It's fine for a
// single-admin demo, but if you want edits to appear for every visitor,
// this eventually needs a small backend (e.g. Supabase) instead.
const STORE_KEY = 'goodhelp_data_v1';

function loadData(){
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) return JSON.parse(raw);
  return {
    about: document.getElementById('aboutText').textContent.trim(),
    contact: document.getElementById('contactText').textContent.trim(),
    links: { fb: '#', wa: '#', email: 'info@example.com', ig: '#' },
    people: []
  };
}
function saveData(data){ localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
let data = loadData();

function renderAll(){
  document.getElementById('aboutText').textContent = data.about;
  document.getElementById('contactText').textContent = data.contact;
  document.getElementById('fbLink').href = data.links.fb || '#';
  document.getElementById('waLink').href = data.links.wa || '#';
  document.getElementById('emailLink').href = 'mailto:' + (data.links.email || '');
  document.getElementById('igLink').href = data.links.ig || '#';

  const grid = document.getElementById('teamGrid');
  const empty = document.getElementById('teamEmpty');
  grid.innerHTML = '';
  if (data.people.length === 0){
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    data.people.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'person-card';
      card.innerHTML = `
        <div class="person-photo"><img src="${p.photo || 'images/placeholder.jpg'}" alt="${p.name}"></div>
        <div class="person-body">
          <div class="person-name">${p.name}</div>
          <div class="person-role">${p.role || ''}</div>
          <p class="person-bio">${p.bio || ''}</p>
        </div>`;
      grid.appendChild(card);
    });
  }
}
renderAll();

// ===== ADMIN LOGIN =====
const openAdmin = document.getElementById('openAdmin');
const adminOverlay = document.getElementById('adminOverlay');
const closeLogin = document.getElementById('closeLogin');
const adminPass = document.getElementById('adminPass');
const submitLogin = document.getElementById('submitLogin');
const loginError = document.getElementById('loginError');
const panelOverlay = document.getElementById('panelOverlay');
const closePanel = document.getElementById('closePanel');
const logoutBtn = document.getElementById('logoutBtn');

openAdmin.addEventListener('click', () => {
  closeDrawer();
  adminOverlay.classList.add('open');
  adminPass.value = '';
  loginError.classList.remove('show');
  adminPass.focus();
});
closeLogin.addEventListener('click', () => adminOverlay.classList.remove('open'));

function tryLogin(){
  if (adminPass.value === ADMIN_PASSWORD){
    adminOverlay.classList.remove('open');
    openPanel();
  } else {
    loginError.classList.add('show');
  }
}
submitLogin.addEventListener('click', tryLogin);
adminPass.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryLogin(); });

function openPanel(){
  document.getElementById('aboutEdit').value = data.about;
  document.getElementById('contactEdit').value = data.contact;
  document.getElementById('fbEdit').value = data.links.fb || '';
  document.getElementById('waEdit').value = data.links.wa || '';
  document.getElementById('emailEdit').value = data.links.email || '';
  document.getElementById('igEdit').value = data.links.ig || '';
  renderPersonList();
  panelOverlay.classList.add('open');
}
closePanel.addEventListener('click', () => panelOverlay.classList.remove('open'));
logoutBtn.addEventListener('click', () => panelOverlay.classList.remove('open'));

// ===== ADMIN TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ===== SAVE: ABOUT / CONTACT / LINKS =====
document.getElementById('saveAboutBtn').addEventListener('click', () => {
  data.about = document.getElementById('aboutEdit').value.trim();
  saveData(data); renderAll();
});
document.getElementById('saveContactBtn').addEventListener('click', () => {
  data.contact = document.getElementById('contactEdit').value.trim();
  saveData(data); renderAll();
});
document.getElementById('saveLinksBtn').addEventListener('click', () => {
  data.links = {
    fb: document.getElementById('fbEdit').value.trim(),
    wa: document.getElementById('waEdit').value.trim(),
    email: document.getElementById('emailEdit').value.trim(),
    ig: document.getElementById('igEdit').value.trim()
  };
  saveData(data); renderAll();
});

// ===== ADD / REMOVE PERSON =====
document.getElementById('addPersonBtn').addEventListener('click', () => {
  const name = document.getElementById('personName').value.trim();
  if (!name) return;
  data.people.push({
    name,
    role: document.getElementById('personRole').value.trim(),
    bio: document.getElementById('personBio').value.trim(),
    photo: document.getElementById('personPhoto').value.trim()
  });
  saveData(data);
  document.getElementById('personName').value = '';
  document.getElementById('personRole').value = '';
  document.getElementById('personBio').value = '';
  document.getElementById('personPhoto').value = '';
  renderAll();
  renderPersonList();
});

function renderPersonList(){
  const list = document.getElementById('personList');
  list.innerHTML = '';
  data.people.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'existing-item';
    row.innerHTML = `<span>${p.name}</span><button data-i="${i}">Remove</button>`;
    row.querySelector('button').addEventListener('click', () => {
      data.people.splice(i, 1);
      saveData(data); renderAll(); renderPersonList();
    });
    list.appendChild(row);
  });
}
