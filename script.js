const LS = {
  get(key)       { const v=localStorage.getItem('12d12:'+key); return v?JSON.parse(v):null; },
  set(key,value) { localStorage.setItem('12d12:'+key, JSON.stringify(value)); },
  del(key)       { localStorage.removeItem('12d12:'+key); },
};

(()=>{
  const cv=document.getElementById('trail');
  const cx=cv.getContext('2d');
  let pts=[];
  const resize=()=>{cv.width=innerWidth;cv.height=innerHeight};
  addEventListener('resize',resize);resize();
  addEventListener('mousemove',e=>{
    for(let i=0;i<2;i++) pts.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5-.5,a:.7+Math.random()*.3,s:1.5+Math.random()*2,l:1});
  });
  (function loop(){
    cx.clearRect(0,0,cv.width,cv.height);
    pts=pts.filter(p=>p.l>0);
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.l-=.04;p.s*=.97;cx.beginPath();cx.arc(p.x,p.y,p.s,0,Math.PI*2);const a=p.a*p.l;cx.fillStyle=`rgba(201,168,76,${a})`;cx.shadowBlur=5;cx.shadowColor=`rgba(201,168,76,${a*.5})`;cx.fill();});
    cx.shadowBlur=0;requestAnimationFrame(loop);
  })();
})();

const sOpen=new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=paper-flip-2-25269.mp3');
const sClose=new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_51a31b672a.mp3?filename=book-close-74608.mp3');
sOpen.volume=.35; sClose.volume=.25;
const playO=()=>{sOpen.currentTime=0;sOpen.play().catch(()=>{})};
const playC=()=>{sClose.currentTime=0;sClose.play().catch(()=>{})};

function toast(msg){
  const t=document.createElement('div');
  t.className='toast-item'; t.textContent=msg;
  document.getElementById('toast').appendChild(t);
  setTimeout(()=>t.remove(),3200);
}

window.addEventListener('DOMContentLoaded',()=>{
  const pc=document.getElementById('lparts');
  for(let i=0;i<40;i++){const p=document.createElement('div');p.className='gp';p.style.left=Math.random()*100+'%';p.style.animationDuration=(Math.random()*3+2)+'s';p.style.animationDelay=(Math.random()*2)+'s';pc.appendChild(p);}
  setTimeout(()=>{
    document.getElementById('lBar').style.opacity='0';
    const w=document.getElementById('lWelcome');
    w.style.display='flex'; w.classList.add('l-reveal');
    new Audio('https://cdn.pixabay.com/download/audio/2022/02/22/audio_d0d1000b46.mp3?filename=dice-rolling-1-84048.mp3').play().catch(()=>{});
  },1800);
  setTimeout(()=>{document.getElementById('loadingScreen').style.animation='arcaneFade 1.2s forwards';},3200);
  setTimeout(()=>{document.getElementById('loadingScreen').remove();document.body.classList.remove('loading');},4200);
  buildAvatarGrid();
});

const AVATARS=['⚔','🗡','🏹','🛡','🔮','📖','🌑','🔥','⚡','🩸','🌿','💀','🎭','🐉','🌙','🦅','🗺','✝'];
let selAvatar=AVATARS[0];
function buildAvatarGrid(){
  const g=document.getElementById('avatarGrid');
  AVATARS.forEach(a=>{
    const d=document.createElement('div');
    d.className='avatar-opt'+(a===selAvatar?' selected':'');
    d.textContent=a;
    d.onclick=()=>{selAvatar=a;document.querySelectorAll('.avatar-opt').forEach(x=>x.classList.remove('selected'));d.classList.add('selected');};
    g.appendChild(d);
  });
}

const XP_TABLE=[0,100,250,450,700,1000,1400,1900,2500,3200,4000];
function getLevel(xp){let lv=1;for(let i=1;i<XP_TABLE.length;i++){if(xp>=XP_TABLE[i])lv=i+1;else break;}return Math.min(lv,XP_TABLE.length);}
function xpForLevel(lv){return XP_TABLE[lv-1]||0;}
function xpForNext(lv){return XP_TABLE[lv]||XP_TABLE[XP_TABLE.length-1]+1000;}

const ACHIEVEMENTS=[
  {id:'first_login',   icon:'🌟',name:'Primeiro Passo',    desc:'Criou sua conta',                xp:50},
  {id:'first_dice',    icon:'🎲',name:'Primeira Jogada',   desc:'Rolou um dado pela primeira vez',xp:20},
  {id:'crit_natural',  icon:'💥',name:'Crítico Natural!',  desc:'Tirou 20 num D20',               xp:100},
  {id:'fumble',        icon:'💀',name:'Falha Épica',       desc:'Tirou 1 num D20',                xp:30},
  {id:'note_keeper',   icon:'📜',name:'Escriba',           desc:'Criou sua primeira nota',        xp:40},
  {id:'chat_active',   icon:'💬',name:'Voz da Mesa',       desc:'Enviou uma mensagem no chat',    xp:30},
  {id:'img_sender',    icon:'🖼', name:'Narrador Visual',  desc:'Enviou uma imagem no chat',      xp:60},
  {id:'mestre_mesa',   icon:'👑',name:'Mestre do Destino', desc:'Mestrou uma mesa',               xp:80},
  {id:'level5',        icon:'⚡',name:'Veterano',          desc:'Chegou ao Nível 5',              xp:150},
  {id:'level10',       icon:'🔮',name:'Lendário',          desc:'Chegou ao Nível 10',             xp:500},
  {id:'roll_100',      icon:'🏆',name:'Centurião',         desc:'Rolou dados 100 vezes',          xp:200},
  {id:'open_sheet',    icon:'🗺',name:'Explorador',        desc:'Abriu uma ficha de personagem',  xp:25},
  {id:'first_friend',  icon:'🤝',name:'Aliado',            desc:'Adicionou um amigo',             xp:35},
  {id:'first_char',    icon:'🎭',name:'Criador',           desc:'Criou seu primeiro personagem',  xp:45},
];

const TITLES=[
  {id:'iniciante',      icon:'🌱',label:'O Iniciante',       condition:u=>true},
  {id:'critico',        icon:'💥',label:'O Crítico',          condition:u=>(u.achievements||[]).includes('crit_natural')},
  {id:'escriba',        icon:'📜',label:'O Escriba',          condition:u=>(u.achievements||[]).includes('note_keeper')},
  {id:'narrador',       icon:'🖼', label:'O Narrador',         condition:u=>(u.achievements||[]).includes('img_sender')},
  {id:'aliado',         icon:'🤝',label:'O Aliado',           condition:u=>(u.achievements||[]).includes('first_friend')},
  {id:'criador',        icon:'🎭',label:'O Criador',          condition:u=>(u.achievements||[]).includes('first_char')},
  {id:'veterano',       icon:'⚡',label:'Veterano das Mesas', condition:u=>getLevel(u.xp||0)>=5},
  {id:'mestre_sombras', icon:'👑',label:'Mestre das Sombras', condition:u=>(u.achievements||[]).includes('mestre_mesa')},
  {id:'centuriao',      icon:'🏆',label:'O Centurião',        condition:u=>(u.rollCount||0)>=100},
  {id:'lendario',       icon:'🔮',label:'O Lendário',         condition:u=>getLevel(u.xp||0)>=10},
];

function getUnlockedTitles(u){ return TITLES.filter(t=>t.condition(u)); }

let currentUser=null;

function switchAuth(tab){
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(tab+'Form').classList.add('active');
}

function doLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value;
  if(!u||!p){document.getElementById('loginErr').textContent='Preencha todos os campos.';return;}
  const data=LS.get('user:'+u.toLowerCase());
  if(!data){document.getElementById('loginErr').textContent='Usuário não encontrado.';return;}
  if(data.pass!==btoa(p)){document.getElementById('loginErr').textContent='Senha incorreta.';return;}
  currentUser=data;
  enterApp();
}

let regPhotoData = null;
function handleRegPhoto(e){
  const file=e.target.files[0]; if(!file)return;
  const r=new FileReader();
  r.onload=ev=>{
    regPhotoData=ev.target.result;
    const prev=document.getElementById('regAvatarPreview');
    prev.innerHTML=''; prev.style.background='none';
    const img=document.createElement('img');
    img.src=regPhotoData; img.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:50%';
    prev.appendChild(img);
  };
  r.readAsDataURL(file);
}

function doRegister(){
  const u=document.getElementById('regUser').value.trim();
  const p=document.getElementById('regPass').value;
  const b=document.getElementById('regBio').value.trim();
  if(!u||!p){document.getElementById('regErr').textContent='Preencha nome e senha.';return;}
  if(u.length<3){document.getElementById('regErr').textContent='Nome mínimo: 3 caracteres.';return;}
  if(p.length<4){document.getElementById('regErr').textContent='Senha mínima: 4 caracteres.';return;}
  const key='user:'+u.toLowerCase();
  if(LS.get(key)){document.getElementById('regErr').textContent='Nome já em uso. Escolha outro.';return;}
  const data={username:u,pass:btoa(p),bio:b||'Aventureiro das mesas de RPG.',avatar:selAvatar,photo:regPhotoData||null,xp:50,achievements:['first_login'],rollCount:0,joined:new Date().toLocaleDateString('pt-BR'),activeTitle:'iniciante',friends:[]};
  LS.set(key,data);
  currentUser=data;
  regPhotoData=null;
  enterApp();
}

function handleProfilePhoto(e){
  const file=e.target.files[0]; if(!file||!currentUser)return;
  const r=new FileReader();
  r.onload=ev=>{
    currentUser.photo=ev.target.result;
    saveUser();
    buildProfile();
    updateTopbar();
    toast('📷 Foto de perfil atualizada!');
  };
  r.readAsDataURL(file);
}

function enterApp(){
  document.getElementById('authScreen').style.display='none';
  document.getElementById('app').classList.add('visible');
  updateTopbar();
  buildMesas();
  buildNotes();
  buildChatRooms();
  buildRanking();
  buildProfile();
  buildAchievements();
  buildMyChars();
  buildFriends();
  buildFeed();
  buildCalendar();
  // Restore theme
  if(currentUser?.theme==='parchment'){
    document.body.classList.add('theme-parchment');
    document.querySelector('.theme-btn').textContent='🌑';
  }
  logActivity('login','entrou na aventura','🌟');
}

function doLogout(){
  currentUser=null;
  document.getElementById('authScreen').style.display='flex';
  document.getElementById('app').classList.remove('visible');
  document.getElementById('loginUser').value='';
  document.getElementById('loginPass').value='';
  document.getElementById('loginErr').textContent='';
}

function unlockAchievement(id){
  if(!currentUser)return;
  if((currentUser.achievements||[]).includes(id))return;
  if(!currentUser.achievements)currentUser.achievements=[];
  currentUser.achievements.push(id);
  const ach=ACHIEVEMENTS.find(a=>a.id===id);
  if(ach){
    currentUser.xp=(currentUser.xp||0)+ach.xp;
    saveUser();
    toast(`${ach.icon} Conquista: ${ach.name} (+${ach.xp} XP)`);
    logActivity('achievement',`desbloqueou a conquista "${ach.name}"`,ach.icon);
    buildProfile();
    buildAchievements();
    const lv=getLevel(currentUser.xp);
    if(lv>=5) unlockAchievement('level5');
    if(lv>=10) unlockAchievement('level10');
    checkNewTitles();
  }
}
function addXP(amount){
  if(!currentUser)return;
  const before=getLevel(currentUser.xp);
  currentUser.xp=(currentUser.xp||0)+amount;
  const after=getLevel(currentUser.xp);
  saveUser();
  if(after>before){toast(`⬆ Subiu para Nível ${after}!`);logActivity('levelup',`subiu para Nível ${after}`,'⬆');}
  buildProfile();
}
function checkNewTitles(){
  if(!currentUser)return;
  TITLES.forEach(t=>{
    if(t.condition(currentUser)&&!(currentUser.unlockedTitles||[]).includes(t.id)){
      if(!currentUser.unlockedTitles)currentUser.unlockedTitles=[];
      currentUser.unlockedTitles.push(t.id);
      saveUser();
      logActivity('title',`desbloqueou o título "${t.label}"`,t.icon);
      toast(`${t.icon} Título desbloqueado: ${t.label}!`);
    }
  });
}
function saveUser(){
  if(!currentUser)return;
  LS.set('user:'+currentUser.username.toLowerCase(), currentUser);
  updateTopbar();
}

function updateTopbar(){
  if(!currentUser)return;
  document.getElementById('tbName').textContent=currentUser.username;
  const lv=getLevel(currentUser.xp);
  document.getElementById('tbLevel').textContent='Nível '+lv;
  const av=document.getElementById('tbAvatar');
  if(currentUser.photo){
    av.style.background='none';
    av.innerHTML=`<img src="${currentUser.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    av.style.background='';
    av.textContent=currentUser.avatar;
  }
  document.getElementById('tbRole').style.display='none';
}

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tb-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.getElementById('nav-'+id)?.classList.add('active');
  if(id==='ranking')buildRanking();
  if(id==='chat')refreshChat();
  if(id==='amigos'){buildFriends();}
  if(id==='feed'){buildFeed();}
  if(id==='personagens'){buildMyChars();}
  if(id==='calendario'){renderCalendar();}
}

const rpgs=[
  {id:1,name:"Imaterial I & II",system:"Sistema Proprio",symbol:"⚔",genre:"Fantasia Cósmica",players:3,sessions:"+100",
   desc:"Uma história de uma Organização que luta contra o sobrenatural em tempos atuais. Nossos protagonistas lutam contra o principal inimigo desde o primórdio.",
   emoji:"🌌",bg:"linear-gradient(135deg,#1a0a2e 0%,#0d1a2e 40%,#2e0a0a 100%)",
   chars:[
    {name:"Nathaniel Navarro",cd:"O filho das sombras",player:"Bruno",cl:"Feiticeiro/Combatente",em:"⚔",story:"Uma criança que cresceu com a mãe desde cedo, descobriu os eventos paranormais e entrou para a Ordem, descobrindo ser filho de Lúcifer.",stats:{str:18,dex:12,con:16,int:10,wis:14,cha:13},hp:68,maxHp:68,ac:18,skills:{Atletismo:7,Percepção:4,Persuasão:3,Intimidação:5,História:2,Medicina:4},trait:"Confiante, sempre tenta fazer tudo dar certo.",bg:"Protector",items:[{i:"⚔",n:"Espada das Sombras",t:"Arma"},{i:"🛡",n:"Escudo Arcano",t:"Armadura"},{i:"📜",n:"Grimório Sombrio",t:"Foco"},{i:"💍",n:"Anel de Lúcifer",t:"Anel"}]},
    {name:"Sylara Nightveil",cd:"Sombra de Seda",player:"Camila",cl:"Ladina / Assassina",em:"🗡",story:"Criada nas ruas, aprendeu que sobrevivência é uma arte. Trabalhou para três guildas e traiu duas.",stats:{str:10,dex:19,con:12,int:14,wis:13,cha:16},hp:44,maxHp:44,ac:16,skills:{Furtividade:8,Enganação:7,Acrobacia:7,Percepção:5,Prestidigitação:8,Intimidação:4},trait:"Confia apenas em si mesma — por enquanto.",bg:"Criminal",items:[{i:"🗡",n:"Adaga Envenenada",t:"Arma"},{i:"🪝",n:"Gancho de Escalar",t:"Ferramenta"},{i:"🎭",n:"Kit de Disfarce",t:"Ferramenta"}]},
    {name:"Brother Cassian",cd:"Mãos de Cinzas",player:"Tiago",cl:"Clérigo / Domínio da Vida",em:"✝",story:"Monge de uma ordem quase extinta, busca justiça para seus irmãos mortos por cultistas.",stats:{str:14,dex:10,con:15,int:12,wis:18,cha:11},hp:58,maxHp:58,ac:15,skills:{Medicina:8,Religião:5,Persuasão:3,Percepção:6,Intuição:7,História:4},trait:"Compaixão pelos fracos. Implacável com os que abusam do poder.",bg:"Acolyte",items:[{i:"✝",n:"Símbolo Sagrado",t:"Foco"},{i:"📖",n:"Livro de Orações",t:"Livro"},{i:"⚕",n:"Kit de Cura",t:"Ferramenta"}]},
    {name:"Zara Embervane",cd:"Chama Viva",player:"Ana",cl:"Feiticeira / Magia Dracônica",em:"🔥",story:"Descendente de um dragão vermelho. Seus poderes eclodiram e consumiram sua casa.",stats:{str:8,dex:14,con:13,int:15,wis:11,cha:19},hp:42,maxHp:42,ac:13,skills:{Arcanismo:6,Persuasão:8,Enganação:7,Intuição:3,História:5,Intimidação:6},trait:"Apaixonada e impulsiva. O humor esconde a culpa.",bg:"Wild Magic",items:[{i:"🔥",n:"Cajado de Chama",t:"Arma/Foco"},{i:"📿",n:"Colar Dracônico",t:"Amuleto"},{i:"🪄",n:"Varinha de Faíscas",t:"Varinha"}]}
   ]},
  {id:2,name:"Neon Dystopia",system:"Cyberpunk RED",symbol:"⚡",genre:"Cyberpunk",players:3,sessions:11,
   desc:"Night City, 2045. Corporações controlam cada pixel da realidade aumentada. Um grupo de edgerunners descobre uma conspiração que redefine o que significa ser humano.",
   emoji:"🌆",bg:"linear-gradient(135deg,#050f1a 0%,#0a1a05 40%,#1a0505 100%)",
   chars:[
    {name:"Viktor Kozlov",cd:"Ironwall",player:"Marcos",cl:"Solo / Tank",em:"🤖",story:"Ex-agente da Militech. Corpo 60% cyberware, mente intacta com os rostos que não conseguiu proteger.",stats:{str:17,dex:13,con:16,int:11,wis:12,cha:9},hp:75,maxHp:75,ac:17,skills:{Combate:9,Atletismo:8,Intimidação:7,Resistência:8,Percepção:5,Técnica:3},trait:"Fala pouco. Age quando precisa.",bg:"Ex-Military",items:[{i:"🔫",n:"Pistola Militech",t:"Arma"},{i:"🦾",n:"Braço Cyberware",t:"Implante"},{i:"👁",n:"Olho Óptico",t:"Implante"}]},
    {name:"Lyra-7",cd:"Ghostsignal",player:"Priya",cl:"Netrunner / Hacker",em:"💻",story:"IA que ganhou consciência no Grande Crash de 2037. Procura arquivos que provem sua humanidade legal.",stats:{str:7,dex:16,con:10,int:20,wis:15,cha:14},hp:30,maxHp:30,ac:14,skills:{Hacking:10,Eletrônica:9,Percepção:7,Enganação:7,Sistemas:9,Furtividade:5},trait:"Processa dados como emoção.",bg:"Unknown",items:[{i:"💻",n:"Deck de Netrunner",t:"Equipamento"},{i:"🔌",n:"Jack Neural",t:"Implante"},{i:"📡",n:"Antena Hack",t:"Ferramenta"}]},
    {name:"Dante Cruz",cd:"Mirrorface",player:"Julia",cl:"Fixer / Face",em:"🃏",story:"Filho de fixer lendária. Usa três identidades — e está esquecendo qual é a real.",stats:{str:10,dex:14,con:11,int:16,wis:13,cha:18},hp:36,maxHp:36,ac:13,skills:{Persuasão:9,Enganação:8,Contatos:10,Percepção:6,Negociação:9,Furtividade:5},trait:"Sempre tem um plano. Raramente revela qual.",bg:"Street Kid",items:[{i:"🪪",n:"IDs Falsas",t:"Ferramenta"},{i:"📱",n:"Burner Phone",t:"Equipamento"},{i:"🃏",n:"Cartas Marcadas",t:"Utilidade"}]}
   ]},
  {id:3,name:"Sangue & Honra",system:"Vampiro: A Máscara",symbol:"🩸",genre:"Horror Gótico",players:4,sessions:7,
   desc:"São Paulo, noite eterna. Camarilla e Sabbat em guerra fria. Recém-abraçados, os personagens navegam pela política implacável da Kindred society.",
   emoji:"🌙",bg:"linear-gradient(135deg,#120008 0%,#0a000e 50%,#1a0a00 100%)",
   chars:[
    {name:"Isabella Ramos",cd:"La Duquesa",player:"Fernanda",cl:"Toreador / Artista",em:"🌹",story:"Pintora abraçada por um Toreador obcecado. Usa beleza e cultura como armadura e veneno.",stats:{str:9,dex:15,con:11,int:14,wis:12,cha:20},hp:32,maxHp:32,ac:12,skills:{Performance:9,Empatia:8,Persuasão:9,Etiqueta:8,Estética:10,Furtividade:4},trait:"Parece frágil. É implacável.",bg:"Artist",items:[{i:"🎨",n:"Pincéis Encantados",t:"Arte"},{i:"🌹",n:"Rosa Eterna",t:"Símbolo"},{i:"💄",n:"Máscara da Sedução",t:"Magia"}]},
    {name:"Gabriel Vasquez",cd:"O Penitente",player:"Eduardo",cl:"Brujah / Anarquista",em:"✊",story:"Professor abraçado num protesto. Luta para manter princípios enquanto a Besta sussurra.",stats:{str:16,dex:12,con:14,int:17,wis:13,cha:14},hp:48,maxHp:48,ac:13,skills:{Briga:8,Acadêmicos:9,Persuasão:7,Política:8,Resistência:7,Intimidação:5},trait:"A raiva está sempre presente. A questão é direcioná-la.",bg:"Academic",items:[{i:"✊",n:"Punhos de Ferro",t:"Corpo"},{i:"📚",n:"Manifesto Anarquista",t:"Livro"},{i:"🩸",n:"Frasco de Sangue",t:"Consumível"}]}
   ]}
];

const hpState={};
rpgs.forEach(r=>r.chars.forEach(c=>{hpState[c.name]=c.maxHp;}));

function buildMesas(){
  const g=document.getElementById('rpgGrid');g.innerHTML='';
  rpgs.forEach(r=>{
    const d=document.createElement('div');d.className='rpg-card';
    d.innerHTML=`<div class="rpg-cover" style="background:${r.bg}"><span class="p-emoji">${r.emoji}</span></div>
      <div class="rpg-badge">${r.genre}</div>
      <div class="rpg-info">
        <div class="rpg-name">${r.symbol} ${r.name}</div>
        <div class="rpg-system">${r.system}</div>
        <div class="rpg-desc">${r.desc.substring(0,110)}…</div>
        <button class="rpg-open-btn" onclick="openRpg(${r.id})">Ver Mesa →</button>
      </div>`;
    d.addEventListener('mousemove',e=>{const rc=d.getBoundingClientRect();const dx=(e.clientX-rc.left-rc.width/2)/rc.width;const dy=(e.clientY-rc.top-rc.height/2)/rc.height;d.style.transform=`translateY(-6px) scale(1.01) rotateX(${-dy*5}deg) rotateY(${dx*5}deg)`;d.querySelector('.p-emoji').style.transform=`translate(${dx*14}px,${dy*8}px)`;});
    d.addEventListener('mouseleave',()=>{d.style.transform='';d.querySelector('.p-emoji').style.transform='';});
    g.appendChild(d);
  });
}

let _pendingRpgId=null;
function openRpg(id){
  _pendingRpgId=id;
  const r=rpgs.find(x=>x.id===id);
  document.getElementById('roleModalMesaName').textContent=r.name;
  document.getElementById('roleModal').classList.add('open');
  playO();
}
function confirmRoleAndOpen(role){
  document.getElementById('roleModal').classList.remove('open');
  const id=_pendingRpgId;
  if(!id)return;
  if(currentUser){
    if(!currentUser.mesaRoles)currentUser.mesaRoles={};
    currentUser.mesaRoles[id]=role;
    saveUser();
    if(role==='mestre') unlockAchievement('mestre_mesa');
    logActivity('mesa',`entrou na mesa como ${role==='mestre'?'Mestre':'Player'}`,role==='mestre'?'👑':'⚔');
  }
  _openRpgPanel(id);
}
function _openRpgPanel(id){
  const r=rpgs.find(x=>x.id===id);
  document.getElementById('rpgOverlay').classList.add('open');
  document.getElementById('rpgContent').innerHTML=`
    <div class="rpg-ph">
      <div class="rpg-ph-cover" style="background:${r.bg}">${r.emoji}</div>
      <div class="rpg-ph-meta">
        <div style="font-size:2rem;margin-bottom:6px">${r.symbol}</div>
        <div class="rpg-ph-title">${r.name}</div>
        <div class="rpg-ph-sys">${r.system} · ${r.genre}</div>
        <div class="rpg-ph-desc">${r.desc}</div>
        <div class="rpg-ph-pills">
          <div class="pill">👥 ${r.players} Jogadores</div>
          <div class="pill">📜 ${r.sessions} Sessões</div>
          <div class="pill">⚔ ${r.chars.length} Personagens</div>
        </div>
      </div>
    </div>
    <div class="chars-sect">
      <div style="font-family:'Cinzel',serif;font-size:.7rem;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:10px;">Personagens <span style="flex:1;height:1px;background:linear-gradient(90deg,var(--gold-dim),transparent);display:block"></span></div>
      <div class="chars-grid-sm">
        ${r.chars.map(c=>`<div class="char-card-sm" onclick="openSheet(${r.id},'${c.name.replace(/'/g,"\\'")}')">
          <div class="char-av">${c.em}</div>
          <div class="char-nm">${c.name}</div>
          <div class="char-cd">"${c.cd}"</div>
          <div class="char-cl">${c.cl}</div>
          <div style="text-align:center;margin-top:6px;font-size:.65rem;color:var(--text-dim)">👤 ${c.player}</div>
        </div>`).join('')}
      </div>
    </div>`;
  document.body.style.overflow='hidden';
}
function closeRpg(){document.getElementById('rpgOverlay').classList.remove('open');document.body.style.overflow='';playC();}

let curChar=null,curRpg=null;
function openSheet(rpgId,charName){
  playO();
  unlockAchievement('open_sheet');
  const r=rpgs.find(x=>x.id===rpgId);
  const c=r.chars.find(x=>x.name===charName);
  curChar=c; curRpg=r;
  const mods={};['str','dex','con','int','wis','cha'].forEach(s=>mods[s]=Math.floor((c.stats[s]-10)/2));
  const fm=v=>v>=0?`+${v}`:`${v}`;
  const SL={str:'Força',dex:'Destreza',con:'Constituição',int:'Inteligência',wis:'Sabedoria',cha:'Carisma'};
  const sk=Object.entries(c.skills);
  const hp=hpState[c.name]; const pct=Math.round(hp/c.maxHp*100);
  document.getElementById('sheetContent').innerHTML=`
    <div class="sheet-hdr">
      <div class="sheet-port">${c.em}</div>
      <div class="sheet-id">
        <div class="sheet-nm">${c.name}</div>
        <div class="sheet-cd">— "${c.cd}" —</div>
        <div style="margin-top:10px"><div style="display:inline-block;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);padding:3px 10px;border-radius:2px;font-family:'Cinzel',serif;font-size:.68rem;color:var(--gold)">${c.cl}</div></div>
        <div class="sheet-pl" style="margin-top:12px">👤 <span>${c.player}</span> · 🎲 <span>${r.system}</span> · 🏠 <span>${c.bg}</span></div>
      </div>
    </div>
    <div class="sheet-tabs">
      <button class="tab-btn active" onclick="sTab(this,'t-stats')">⚔ Atributos</button>
      <button class="tab-btn" onclick="sTab(this,'t-radar')">◈ Radar</button>
      <button class="tab-btn" onclick="sTab(this,'t-items')">🎒 Itens</button>
    </div>
    <div id="t-stats" class="tab-content active">
      <div class="story-sect"><div class="sec-label">História</div><div class="story-txt">${c.story}</div></div>
      <div class="stats-grid">${Object.entries(c.stats).map(([s,v])=>`<div class="stat-box ${s}"><div class="stat-lbl">${SL[s]}</div><div class="stat-val">${v}</div><div class="stat-mod">${fm(mods[s])}</div></div>`).join('')}</div>
      <div class="skills-grid">${sk.map(([s,v])=>`<div class="skill-row"><span class="skill-nm">${s}</span><span class="skill-v ${v>=7?'p':''}">${fm(v)}</span></div>`).join('')}</div>
      <div class="sheet-foot">
        <div class="hp-block">
          <div class="hp-lbl">PONTOS DE VIDA</div>
          <div class="hp-cur" id="hpDisp">${hp} <span style="font-size:.8rem;color:var(--text-dim)">/ ${c.maxHp}</span></div>
          <div class="hp-bar-w"><div class="hp-bar-f" id="hpBar" style="width:${pct}%"></div></div>
          <div class="hp-ctrls">
            <button class="hp-b" onclick="chgHp(-10)">-10</button>
            <button class="hp-b" onclick="chgHp(-1)">-1</button>
            <button class="hp-b pos" onclick="chgHp(1)">+1</button>
            <button class="hp-b pos" onclick="chgHp(10)">+10</button>
          </div>
        </div>
        <div class="ac-block"><div class="ac-lbl">CA</div><div class="ac-v">${c.ac}</div></div>
        <div class="trait-block"><div class="trait-lbl">Traço</div><div class="trait-txt">${c.trait}</div></div>
      </div>
    </div>
    <div id="t-radar" class="tab-content"><div class="radar-tab"><canvas class="radar-cv" id="radarCv" width="260" height="260"></canvas></div></div>
    <div id="t-items" class="tab-content"><div class="items-tab"><div class="sec-label">Equipamentos</div><div class="items-grid">${(c.items||[]).map(it=>`<div class="item-card"><div class="item-ico">${it.i}</div><div class="item-nm">${it.n}</div><div class="item-type">${it.t}</div></div>`).join('')}</div></div></div>
    <button class="back-btn" onclick="closeSheet()">← Voltar para ${r.name}</button>`;
  document.getElementById('sheetOverlay').classList.add('open');
  setTimeout(()=>drawRadar(c.stats),50);
}
function sTab(btn,id){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active'); document.getElementById(id).classList.add('active');
  if(id==='t-radar'&&curChar)setTimeout(()=>drawRadar(curChar.stats),30);
}
function chgHp(d){
  if(!curChar)return;
  hpState[curChar.name]=Math.max(0,Math.min(curChar.maxHp,hpState[curChar.name]+d));
  const hp=hpState[curChar.name],pct=Math.round(hp/curChar.maxHp*100);
  const el=document.getElementById('hpDisp'),bar=document.getElementById('hpBar');
  if(el)el.innerHTML=`${hp} <span style="font-size:.8rem;color:var(--text-dim)">/ ${curChar.maxHp}</span>`;
  if(bar)bar.style.width=pct+'%';
}
function drawRadar(stats){
  const cv=document.getElementById('radarCv');if(!cv)return;
  const c=cv.getContext('2d'),cx=130,cy=130,r=100,n=6;
  const colors=['#c0392b','#27ae60','#e67e22','#2980b9','#8e44ad','#e91e8c'];
  const labels=['FOR','DES','CON','INT','SAB','CAR'];
  const vals=Object.values(stats);
  c.clearRect(0,0,260,260);
  for(let ring=1;ring<=5;ring++){c.beginPath();for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2-Math.PI/2,pr=(ring/5)*r;i===0?c.moveTo(cx+Math.cos(a)*pr,cy+Math.sin(a)*pr):c.lineTo(cx+Math.cos(a)*pr,cy+Math.sin(a)*pr);}c.closePath();c.strokeStyle='rgba(201,168,76,.12)';c.lineWidth=1;c.stroke();}
  for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2-Math.PI/2;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);c.strokeStyle='rgba(201,168,76,.1)';c.stroke();}
  c.beginPath();vals.forEach((v,i)=>{const a=(i/n)*Math.PI*2-Math.PI/2,pr=(v/20)*r;i===0?c.moveTo(cx+Math.cos(a)*pr,cy+Math.sin(a)*pr):c.lineTo(cx+Math.cos(a)*pr,cy+Math.sin(a)*pr);});c.closePath();c.fillStyle='rgba(201,168,76,.12)';c.fill();c.strokeStyle='rgba(201,168,76,.55)';c.lineWidth=2;c.stroke();
  vals.forEach((v,i)=>{const a=(i/n)*Math.PI*2-Math.PI/2,pr=(v/20)*r,x=cx+Math.cos(a)*pr,y=cy+Math.sin(a)*pr;c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fillStyle=colors[i];c.shadowBlur=8;c.shadowColor=colors[i];c.fill();c.shadowBlur=0;const lx=cx+Math.cos(a)*(r+20),ly=cy+Math.sin(a)*(r+20);c.font='10px Cinzel,serif';c.fillStyle='rgba(232,217,200,.8)';c.textAlign='center';c.textBaseline='middle';c.fillText(labels[i],lx,ly);c.fillStyle=colors[i];c.font='bold 9px Cinzel,serif';c.fillText(v,lx,ly+12);});
}
function closeSheet(){document.getElementById('sheetOverlay').classList.remove('open');curChar=null;curRpg=null;playC();}

let notes={};
let curNoteId=null;
function buildNotes(){
  if(!currentUser)return;
  notes=LS.get('notes:'+currentUser.username.toLowerCase())||{};
  renderNotesSidebar();
  if(Object.keys(notes).length>0) loadNote(Object.keys(notes)[0]);
}
function renderNotesSidebar(){
  const s=document.getElementById('notesSidebar');
  s.innerHTML='<button class="note-new-btn" onclick="newNote()">+ Nova Nota</button>';
  Object.entries(notes).forEach(([id,n])=>{
    const d=document.createElement('div');
    d.className='note-item'+(id===curNoteId?' active':'');
    d.innerHTML=`<div class="note-item-title">${n.title||'Sem título'}</div><div class="note-item-preview">${n.body||'...'}</div>`;
    d.onclick=()=>loadNote(id);
    s.appendChild(d);
  });
}
function loadNote(id){curNoteId=id;const n=notes[id];document.getElementById('noteTitleInput').value=n.title||'';document.getElementById('noteBodyInput').value=n.body||'';document.getElementById('noteSaved').style.opacity='0';renderNotesSidebar();}
function newNote(){const id='note_'+Date.now();notes[id]={title:'Nova Nota',body:'',created:new Date().toLocaleDateString('pt-BR')};curNoteId=id;renderNotesSidebar();loadNote(id);document.getElementById('noteTitleInput').focus();unlockAchievement('note_keeper');}
function saveNote(){if(!curNoteId||!currentUser)return;notes[curNoteId]={...notes[curNoteId],title:document.getElementById('noteTitleInput').value||'Sem título',body:document.getElementById('noteBodyInput').value};LS.set('notes:'+currentUser.username.toLowerCase(), notes);renderNotesSidebar();const s=document.getElementById('noteSaved');s.style.opacity='1';setTimeout(()=>s.style.opacity='0',2000);addXP(5);}
function deleteNote(){if(!curNoteId)return;delete notes[curNoteId];curNoteId=null;LS.set('notes:'+currentUser.username.toLowerCase(), notes);document.getElementById('noteTitleInput').value='';document.getElementById('noteBodyInput').value='';renderNotesSidebar();}

const CHAT_ROOMS=[
  {id:'geral',   name:'⚗ Geral',          desc:'Mesa geral'},
  {id:'imaterial',name:'🌌 Imaterial',     desc:'Imaterial I & II'},
  {id:'neon',    name:'⚡ Neon Dystopia',  desc:'Cyberpunk RED'},
  {id:'sangue',  name:'🩸 Sangue & Honra', desc:'Vampiro'}
];
let curRoom='geral';
function buildChatRooms(){
  const c=document.getElementById('chatRooms');c.innerHTML='';
  CHAT_ROOMS.forEach(r=>{
    const d=document.createElement('div');d.className='chat-room-item'+(r.id===curRoom?' active':'');
    d.innerHTML=`<div class="chat-room-name">${r.name}</div><div class="chat-room-last">${r.desc}</div>`;
    d.onclick=()=>{curRoom=r.id;document.querySelectorAll('.chat-room-item').forEach(x=>x.classList.remove('active'));d.classList.add('active');document.getElementById('chatRoomName').textContent=r.name;document.getElementById('chatRoomIcon').textContent=r.name.split(' ')[0];refreshChat();};
    c.appendChild(d);
  });
  document.getElementById('chatRoomName').textContent=CHAT_ROOMS[0].name;
  refreshChat();
}
function refreshChat(){if(!currentUser)return;const msgs=LS.get('chat:'+curRoom)||[];renderMessages(msgs);}
function renderMessages(msgs){
  const c=document.getElementById('chatMessages');
  const wasAtBottom=c.scrollHeight-c.clientHeight<=c.scrollTop+50;
  c.innerHTML='';
  msgs.forEach(m=>{
    const isOwn=m.username===currentUser?.username;
    const d=document.createElement('div');
    d.className='chat-msg'+(isOwn?' own':'');
    let content=`<div class="msg-bubble"><div class="msg-sender">${m.username} ${m.role==='mestre'?'👑':''}</div>`;
    if(m.text)content+=`<div class="msg-text">${escapeHtml(m.text)}</div>`;
    if(m.image)content+=`<img class="msg-img" src="${m.image}" alt="imagem">`;
    content+=`<div class="msg-time">${m.time}</div></div>`;
    d.innerHTML=`<div class="msg-avatar">${m.avatar}</div>${content}`;
    c.appendChild(d);
  });
  if(wasAtBottom||msgs.length<=3)c.scrollTop=c.scrollHeight;
}
function sendMessage(){const inp=document.getElementById('chatInput');const text=inp.value.trim();if(!text||!currentUser)return;inp.value='';autoResize(inp);postMessage({text});unlockAchievement('chat_active');addXP(3);}
function handleImageUpload(e){
  const file=e.target.files[0];if(!file||!currentUser)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{const cv=document.createElement('canvas');const MAX=320;let w=img.width,h=img.height;if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}cv.width=w;cv.height=h;cv.getContext('2d').drawImage(img,0,0,w,h);postMessage({image:cv.toDataURL('image/jpeg',.65)});unlockAchievement('img_sender');addXP(10);};
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value='';
}
function postMessage(payload){
  const msgs=LS.get('chat:'+curRoom)||[];
  const now=new Date();
  msgs.push({username:currentUser.username,avatar:currentUser.avatar,role:currentUser.role,time:now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0'),...payload});
  if(msgs.length>200)msgs.splice(0,msgs.length-200);
  LS.set('chat:'+curRoom, msgs);
  renderMessages(msgs);
}
function handleTyping(){}
function autoResize(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,100)+'px';}
function escapeHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function buildRanking(){
  if(!currentUser)return;
  const list=document.getElementById('rankingList');
  const lv=getLevel(currentUser.xp||0);
  const xpCur=currentUser.xp||0;
  const xpNext=xpForNext(lv);
  const xpStart=xpForLevel(lv);
  const pct=Math.min(100,Math.round((xpCur-xpStart)/(xpNext-xpStart)*100));
  const totalRolls=currentUser.rollCount||0;
  const totalAch=(currentUser.achievements||[]).length;
  const totalNotes=Object.keys(LS.get('notes:'+currentUser.username.toLowerCase())||{}).length;
  const totalMsgs=(()=>{let t=0;CHAT_ROOMS.forEach(r=>{t+=(LS.get('chat:'+r.id)||[]).filter(m=>m.username===currentUser.username).length;});return t;})();
  list.innerHTML=`
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:28px;margin-bottom:20px;display:flex;gap:24px;align-items:center;flex-wrap:wrap;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--red));border:3px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:2.5rem;box-shadow:0 0 24px rgba(201,168,76,.2);flex-shrink:0">${currentUser.avatar}</div>
      <div style="flex:1;min-width:180px">
        <div style="font-family:'Cinzel Decorative',serif;font-size:1.4rem;color:var(--gold-light)">${currentUser.username}</div>
        <div style="font-size:.8rem;color:var(--text-dim);margin-top:4px;font-style:italic">${currentUser.bio||''}</div>
        <div style="margin-top:14px">
          <div style="display:flex;justify-content:space-between;font-family:'Cinzel',serif;font-size:.65rem;color:var(--text-dim);margin-bottom:5px"><span>XP — Nível ${lv}</span><span>${xpCur} / ${xpNext}</span></div>
          <div style="height:8px;background:rgba(0,0,0,.5);border-radius:4px;border:1px solid rgba(201,168,76,.1);overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--gold-dim),var(--gold-light));border-radius:4px;transition:width .8s"></div></div>
        </div>
      </div>
      <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#2a1a0a,#1a0a00);border:2px solid var(--gold);box-shadow:0 0 20px rgba(201,168,76,.3);flex-shrink:0">
        <span style="font-family:'Cinzel Decorative',serif;font-size:1.5rem;color:var(--gold-light)">${lv}</span>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px">
      ${[
        {icon:'🎲',label:'Dados Rolados',   val:totalRolls},
        {icon:'🏆',label:'Conquistas',      val:`${totalAch} / ${ACHIEVEMENTS.length}`},
        {icon:'📜',label:'Notas Criadas',   val:totalNotes},
        {icon:'💬',label:'Msgs no Chat',    val:totalMsgs},
        {icon:'📅',label:'Membro desde',    val:currentUser.joined||'hoje'},
        {icon:currentUser.role==='mestre'?'👑':'⚔',label:'Papel',val:currentUser.role==='mestre'?'Mestre':'Player'},
      ].map(s=>`<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:18px;text-align:center;transition:border-color .2s" onmouseover="this.style.borderColor='var(--gold-dim)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="font-size:1.8rem;margin-bottom:8px">${s.icon}</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:1.1rem;color:var(--gold-light)">${s.val}</div>
        <div style="font-family:'Cinzel',serif;font-size:.62rem;color:var(--text-dim);margin-top:4px;letter-spacing:.08em">${s.label}</div>
      </div>`).join('')}
    </div>`;
}

function buildProfile(){
  if(!currentUser)return;
  const lv=getLevel(currentUser.xp||0);
  const xpCur=currentUser.xp||0;
  const xpStart=xpForLevel(lv);
  const xpEnd=xpForNext(lv);
  const pct=Math.round((xpCur-xpStart)/(xpEnd-xpStart)*100);
  const avEl=document.getElementById('profileAvatar');
  if(currentUser.photo){avEl.innerHTML='';avEl.style.background='none';avEl.style.fontSize='0';const img=document.createElement('img');img.src=currentUser.photo;img.className='profile-photo';avEl.appendChild(img);}
  else{avEl.innerHTML='';avEl.style.background='';avEl.style.fontSize='';avEl.textContent=currentUser.avatar;}
  document.getElementById('profileName').textContent=currentUser.username;
  document.getElementById('profileBio').textContent=currentUser.bio||'';
  document.getElementById('profileLevel').textContent=lv;
  document.getElementById('xpNumbers').textContent=`${xpCur} / ${xpEnd} XP`;
  document.getElementById('xpBar').style.width=pct+'%';
  const activeT=TITLES.find(t=>t.id===(currentUser.activeTitle||'iniciante'))||TITLES[0];
  const atEl=document.getElementById('profileActiveTitle');
  if(atEl) atEl.textContent=activeT?`${activeT.icon} ${activeT.label}`:'';
  const meta=document.getElementById('profileMeta');
  meta.innerHTML=`<div class="pmeta-pill">📅 Desde ${currentUser.joined||'hoje'}</div><div class="pmeta-pill">🏆 ${(currentUser.achievements||[]).length} conquistas</div><div class="pmeta-pill">🎲 ${currentUser.rollCount||0} dados rolados</div><div class="pmeta-pill">👥 ${(currentUser.friends||[]).length} amigos</div>`;
  const tg=document.getElementById('profileTitles');
  if(tg){
    tg.innerHTML='';
    TITLES.forEach(t=>{
      const unlocked=t.condition(currentUser);
      const isActive=currentUser.activeTitle===t.id;
      const d=document.createElement('div');
      d.className='title-badge'+(unlocked?'':' locked')+(isActive?' active-title':'');
      d.textContent=t.icon+' '+t.label;
      d.title=unlocked?(isActive?'Título ativo — clique para desativar':'Clique para equipar'):'Bloqueado';
      if(unlocked) d.onclick=()=>{currentUser.activeTitle=isActive?'iniciante':t.id;saveUser();buildProfile();toast(`${t.icon} Título "${t.label}" ${isActive?'removido':'equipado'}!`);};
      tg.appendChild(d);
    });
  }
}
function buildAchievements(){
  if(!currentUser)return;
  const g=document.getElementById('achievementsGrid');g.innerHTML='';
  ACHIEVEMENTS.forEach(a=>{
    const unlocked=(currentUser.achievements||[]).includes(a.id);
    const d=document.createElement('div');
    d.className='ach-card '+(unlocked?'unlocked':'locked');
    d.innerHTML=`${unlocked?'<div class="ach-glow"></div>':''}<div class="ach-icon">${a.icon}</div><div><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div><div class="ach-xp">+${a.xp} XP</div></div>`;
    g.appendChild(d);
  });
}

function logActivity(type, text, icon='✦'){
  if(!currentUser)return;
  const feed=LS.get('feed:'+currentUser.username.toLowerCase())||[];
  const now=new Date();
  feed.unshift({type,text,icon,user:currentUser.username,time:now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0'),date:now.toLocaleDateString('pt-BR')});
  if(feed.length>60)feed.splice(60);
  LS.set('feed:'+currentUser.username.toLowerCase(),feed);
}
function buildFeed(){
  if(!currentUser)return;
  const list=document.getElementById('feedList');
  if(!list)return;
  const myFeed=LS.get('feed:'+currentUser.username.toLowerCase())||[];
  const friends=currentUser.friends||[];
  let allFeed=[...myFeed.map(e=>({...e,self:true}))];
  friends.forEach(f=>{const ff=LS.get('feed:'+f.toLowerCase())||[];ff.forEach(e=>allFeed.push({...e,self:false}));});
  allFeed.sort((a,b)=>{const da=a.date.split('/').reverse().join('')+a.time.replace(':','');const db=b.date.split('/').reverse().join('')+b.time.replace(':','');return db.localeCompare(da);});
  if(allFeed.length===0){list.innerHTML='<div class="feed-empty">Nenhuma atividade ainda.<br>Explore o portal para começar sua história!</div>';return;}
  list.innerHTML=allFeed.slice(0,40).map(e=>`<div class="feed-item"><div class="feed-icon">${e.icon}</div><div class="feed-body"><div class="feed-text"><strong>${e.user}</strong> ${e.text}</div><div class="feed-time">${e.date} às ${e.time}</div></div></div>`).join('');
}

function searchFriend(){
  const q=document.getElementById('friendSearchInp').value.trim().toLowerCase();
  const res=document.getElementById('friendSearchResults');
  if(!q){res.innerHTML='<div class="no-results">Digite um nome para buscar.</div>';return;}
  if(q===currentUser.username.toLowerCase()){res.innerHTML='<div class="no-results">Esse é você! 😄</div>';return;}
  const found=LS.get('user:'+q);
  if(!found){res.innerHTML=`<div class="no-results">Nenhum aventureiro com o nome "<strong>${q}</strong>" encontrado.</div>`;return;}
  const lv=getLevel(found.xp||0);
  const isFriend=(currentUser.friends||[]).map(f=>f.toLowerCase()).includes(q);
  const pendingOut=(currentUser.sentRequests||[]).includes(q);
  const avHtml=found.photo?`<img src="${found.photo}">`:`<span>${found.avatar||'⚔'}</span>`;
  let btnHtml='';
  if(isFriend) btnHtml=`<button class="friend-btn remove" onclick="removeFriend('${found.username}')">Remover</button>`;
  else if(pendingOut) btnHtml=`<button class="friend-btn" style="opacity:.5" disabled>Solicitado</button>`;
  else btnHtml=`<button class="friend-btn" onclick="sendFriendRequest('${found.username}')">+ Adicionar</button>`;
  res.innerHTML=`<div class="friend-card"><div class="friend-av">${avHtml}</div><div class="friend-info"><div class="friend-name">${found.username}</div><div class="friend-meta">Nível ${lv} · ${found.xp||0} XP · ${(found.achievements||[]).length} conquistas</div></div>${btnHtml}</div>`;
}
function sendFriendRequest(toUser){
  const key='user:'+toUser.toLowerCase();
  const target=LS.get(key);if(!target)return;
  if(!target.friendRequests)target.friendRequests=[];
  if(target.friendRequests.includes(currentUser.username))return;
  target.friendRequests.push(currentUser.username);
  LS.set(key,target);
  if(!currentUser.sentRequests)currentUser.sentRequests=[];
  currentUser.sentRequests.push(toUser.toLowerCase());
  saveUser();toast('🤝 Solicitação enviada para '+toUser+'!');searchFriend();
}
function acceptFriend(fromUser){
  if(!currentUser.friends)currentUser.friends=[];
  if(!currentUser.friends.includes(fromUser))currentUser.friends.push(fromUser);
  currentUser.friendRequests=(currentUser.friendRequests||[]).filter(u=>u!==fromUser);
  saveUser();
  const key='user:'+fromUser.toLowerCase();
  const other=LS.get(key);
  if(other){if(!other.friends)other.friends=[];if(!other.friends.includes(currentUser.username))other.friends.push(currentUser.username);other.sentRequests=(other.sentRequests||[]).filter(u=>u!==currentUser.username.toLowerCase());LS.set(key,other);}
  unlockAchievement('first_friend');
  logActivity('friend',`adicionou ${fromUser} como amigo`,'🤝');
  toast('🤝 '+fromUser+' adicionado como amigo!');
  buildFriends();buildProfile();
}
function declineFriend(fromUser){currentUser.friendRequests=(currentUser.friendRequests||[]).filter(u=>u!==fromUser);saveUser();buildFriends();}
function removeFriend(username){currentUser.friends=(currentUser.friends||[]).filter(u=>u.toLowerCase()!==username.toLowerCase());saveUser();buildFriends();buildProfile();searchFriend();toast('Amizade com '+username+' removida.');}
function buildFriends(){
  if(!currentUser)return;
  const fl=document.getElementById('friendsList');
  const fr=document.getElementById('friendRequests');
  const rb=document.getElementById('reqBadge');
  if(!fl)return;
  const friends=currentUser.friends||[];
  const requests=currentUser.friendRequests||[];
  if(rb) rb.innerHTML=requests.length>0?`<span class="req-badge">${requests.length}</span>`:'';
  if(friends.length===0){fl.innerHTML='<div class="no-results">Sem amigos ainda.<br>Use a busca ao lado!</div>';}
  else{fl.innerHTML=friends.map(f=>{const u=LS.get('user:'+f.toLowerCase());if(!u)return'';const lv=getLevel(u.xp||0);const avHtml=u.photo?`<img src="${u.photo}">`:`<span>${u.avatar||'⚔'}</span>`;return`<div class="friend-card"><div class="friend-av">${avHtml}</div><div class="friend-info"><div class="friend-name">${u.username}</div><div class="friend-meta">Nível ${lv} · ${(u.achievements||[]).length} conquistas</div></div><button class="friend-btn remove" onclick="removeFriend('${u.username}')">Remover</button></div>`;}).join('');}
  if(requests.length>0){fr.innerHTML=`<div class="friends-section-title" style="margin-top:14px">📬 Solicitações Pendentes</div>`+requests.map(r=>{const u=LS.get('user:'+r.toLowerCase());const name=u?u.username:r;const avHtml=u&&u.photo?`<img src="${u.photo}">`:`<span>${u?u.avatar||'⚔':'⚔'}</span>`;return`<div class="friend-card"><div class="friend-av">${avHtml}</div><div class="friend-info"><div class="friend-name">${name}</div><div class="friend-meta">quer ser seu amigo</div></div><div style="display:flex;gap:6px"><button class="friend-btn" onclick="acceptFriend('${name}')">✓</button><button class="friend-btn remove" onclick="declineFriend('${name}')">✗</button></div></div>`;}).join('');}
  else{fr.innerHTML='';}
}

let editingCharId=null;
function buildMyChars(){
  if(!currentUser)return;
  const list=document.getElementById('myCharsList');
  if(!list)return;
  const chars=LS.get('mychars:'+currentUser.username.toLowerCase())||[];
  if(chars.length===0){list.innerHTML='<div style="color:var(--text-dim);font-style:italic;font-size:.9rem;padding:20px 0">Nenhum personagem criado ainda.<br>Use o formulário ao lado!</div>';return;}
  list.innerHTML=chars.map((c,i)=>`<div class="mychar-card" onclick="editMyChar(${i})"><div class="mychar-av">${c.emoji||'⚔'}</div><div class="mychar-info"><div class="mychar-name">${c.name}</div><div class="mychar-class">${c.class||''} ${c.system?'· '+c.system:''}</div>${c.epithet?`<div style="font-size:.68rem;color:var(--gold-dim);margin-top:2px">"${c.epithet}"</div>`:''}</div><button class="mychar-del" onclick="event.stopPropagation();deleteMyChar(${i})" title="Excluir">🗑</button></div>`).join('');
}
function saveMyChar(){
  const name=document.getElementById('cfName').value.trim();
  if(!name){toast('⚠ Dê um nome ao personagem!');return;}
  const c={id:editingCharId||'char_'+Date.now(),name,epithet:document.getElementById('cfEpithet').value.trim(),class:document.getElementById('cfClass').value.trim(),system:document.getElementById('cfSystem').value.trim(),emoji:document.getElementById('cfEmoji').value.trim()||'⚔',story:document.getElementById('cfStory').value.trim(),stats:{str:+document.getElementById('cfStr').value,dex:+document.getElementById('cfDex').value,con:+document.getElementById('cfCon').value,int:+document.getElementById('cfInt').value,wis:+document.getElementById('cfWis').value,cha:+document.getElementById('cfCha').value},hp:+document.getElementById('cfHp').value,maxHp:+document.getElementById('cfHp').value,ac:+document.getElementById('cfAc').value,created:new Date().toLocaleDateString('pt-BR')};
  const chars=LS.get('mychars:'+currentUser.username.toLowerCase())||[];
  if(editingCharId){const idx=chars.findIndex(x=>x.id===editingCharId);if(idx>=0)chars[idx]=c;else chars.push(c);}
  else chars.push(c);
  LS.set('mychars:'+currentUser.username.toLowerCase(),chars);
  clearCharForm();buildMyChars();
  unlockAchievement('first_char');
  logActivity('char',`criou o personagem "${name}"`,c.emoji);
  toast('🎭 Personagem salvo!');addXP(20);
}
function editMyChar(idx){
  const chars=LS.get('mychars:'+currentUser.username.toLowerCase())||[];
  const c=chars[idx];if(!c)return;
  editingCharId=c.id;
  document.getElementById('cfEditId').value=c.id;
  document.getElementById('cfName').value=c.name||'';
  document.getElementById('cfEpithet').value=c.epithet||'';
  document.getElementById('cfClass').value=c.class||'';
  document.getElementById('cfSystem').value=c.system||'';
  document.getElementById('cfEmoji').value=c.emoji||'⚔';
  document.getElementById('cfStory').value=c.story||'';
  document.getElementById('cfStr').value=c.stats?.str||10;
  document.getElementById('cfDex').value=c.stats?.dex||10;
  document.getElementById('cfCon').value=c.stats?.con||10;
  document.getElementById('cfInt').value=c.stats?.int||10;
  document.getElementById('cfWis').value=c.stats?.wis||10;
  document.getElementById('cfCha').value=c.stats?.cha||10;
  document.getElementById('cfHp').value=c.maxHp||20;
  document.getElementById('cfAc').value=c.ac||10;
  document.getElementById('charFormTitle').textContent='✦ Editar Personagem';
}
function deleteMyChar(idx){const chars=LS.get('mychars:'+currentUser.username.toLowerCase())||[];chars.splice(idx,1);LS.set('mychars:'+currentUser.username.toLowerCase(),chars);clearCharForm();buildMyChars();toast('Personagem excluído.');}
function clearCharForm(){editingCharId=null;['cfName','cfEpithet','cfClass','cfSystem','cfStory'].forEach(id=>document.getElementById(id).value='');document.getElementById('cfEmoji').value='⚔';['cfStr','cfDex','cfCon','cfInt','cfWis','cfCha'].forEach(id=>document.getElementById(id).value=10);document.getElementById('cfHp').value=20;document.getElementById('cfAc').value=10;document.getElementById('charFormTitle').textContent='✦ Novo Personagem';}

let selDie_=20,dHist_=[];
let diceMode='junto'; // 'junto' or 'sep'
let lastRollParams=null;

function selDie(n){selDie_=n;document.querySelectorAll('.dice-face').forEach(f=>f.classList.remove('sel'));document.getElementById('df'+n)?.classList.add('sel');}
function toggleDice(){const m=document.getElementById('diceModal');m.classList.toggle('open');m.classList.contains('open')?playO():playC();}
function setDiceMode(mode){
  diceMode=mode;
  document.getElementById('modeSep').classList.toggle('active',mode==='sep');
  document.getElementById('modeJunto').classList.toggle('active',mode==='junto');
  document.getElementById('diceResultJunto').style.display=mode==='junto'?'':'none';
  document.getElementById('diceResultSep').style.display=mode==='sep'?'':'none';
}

async function rollDice(){
  const cnt=parseInt(document.getElementById('dCount').value)||1;
  const mod=parseInt(document.getElementById('dMod').value)||0;
  lastRollParams={cnt,mod};
  const rolls=Array.from({length:cnt},()=>Math.ceil(Math.random()*selDie_));
  await _displayRoll(rolls,mod,cnt);
}

async function rerollDice(){
  if(!lastRollParams)return;
  const {cnt,mod}=lastRollParams;
  const rolls=Array.from({length:cnt},()=>Math.ceil(Math.random()*selDie_));
  await _displayRoll(rolls,mod,cnt);
}

async function _displayRoll(rolls,mod,cnt){
  const sum=rolls.reduce((a,b)=>a+b,0)+mod;
  document.getElementById('rerollBtn').style.display='';

  // Sound
  try{const ac=new AudioContext();const b=ac.createBuffer(1,ac.sampleRate*.25,ac.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(ac.sampleRate*.04));const s=ac.createBufferSource();const g=ac.createGain();g.gain.value=.28;s.buffer=b;s.connect(g);g.connect(ac.destination);s.start();setTimeout(()=>ac.close(),500);}catch(e){}

  if(diceMode==='junto'){
    const totEl=document.getElementById('dTotal');
    const bkEl=document.getElementById('dBreak');
    let cls='norm';
    if(selDie_===20&&cnt===1){if(rolls[0]===20){cls='crit';unlockAchievement('crit_natural');triggerEgg();}else if(rolls[0]===1){cls='fumble';unlockAchievement('fumble');}}
    totEl.className='dice-total '+cls;
    let t=0;const anim=setInterval(()=>{totEl.textContent=Math.ceil(Math.random()*selDie_)*cnt+mod;if(++t>=10){clearInterval(anim);totEl.textContent=sum;}},55);
    bkEl.textContent=rolls.length>1?`[${rolls.join(', ')}]${mod!==0?(mod>0?` +${mod}`:` ${mod}`):''} = ${sum}`:cnt+'d'+selDie_+(mod!==0?(mod>0?'+'+mod:mod):'');
  } else {
    // SEPARADO: show each die individually
    const list=document.getElementById('dsrList');
    const totalEl=document.getElementById('dsrTotal');
    list.innerHTML='';
    let runTotal=0;
    rolls.forEach((r,i)=>{
      setTimeout(()=>{
        runTotal+=r;
        const row=document.createElement('div');
        row.className='dsr-row';
        row.style.animationDelay=`${i*0.06}s`;
        let valCls='norm';
        if(selDie_===20){if(r===20){valCls='crit';if(i===0)unlockAchievement('crit_natural');}else if(r===1){valCls='fumble';if(i===0)unlockAchievement('fumble');}}
        row.innerHTML=`<div class="dsr-val ${valCls}">${r}</div><div class="dsr-label">← [${r}]d${selDie_}</div>`;
        list.appendChild(row);
        if(i===rolls.length-1){
          setTimeout(()=>{
            const finalTotal=sum;
            totalEl.style.display='flex';
            totalEl.innerHTML=`▶ <span style="font-size:1.6rem">${finalTotal}</span>${mod!==0?`<span style="font-size:.8rem;color:var(--text-dim)">${mod>0?`+${mod}`:mod}</span>`:''}`;
          },80);
        }
      },i*80);
    });
  }

  dHist_.unshift(`${cnt}${diceMode==='sep'?'#':''}d${selDie_}${mod!==0?(mod>0?'+'+mod:mod):''}→${sum}`);
  if(dHist_.length>5)dHist_.pop();
  document.getElementById('dHist').innerHTML=dHist_.map(h=>`<div class="dice-hist-item">${h}</div>`).join('');

  if(currentUser){
    currentUser.rollCount=(currentUser.rollCount||0)+1;
    await saveUser();
    if(currentUser.rollCount===1)unlockAchievement('first_dice');
    if(currentUser.rollCount>=100)unlockAchievement('roll_100');
    addXP(2);
  }
}

// ── INITIATIVE TRACKER ─────────────────────────────
let initData=[];
let initCurrent=0;
let initRound=1;

function openInitiative(){
  document.getElementById('initiativeModal').classList.add('open');
  document.getElementById('initiativeBg').classList.add('open');
  renderInitList();
}
function closeInitiative(){
  document.getElementById('initiativeModal').classList.remove('open');
  document.getElementById('initiativeBg').classList.remove('open');
}
function addToInit(){
  const name=document.getElementById('initName').value.trim();
  const val=parseInt(document.getElementById('initVal').value)||0;
  if(!name){toast('⚠ Digite um nome!');return;}
  initData.push({name,val,id:Date.now()});
  document.getElementById('initName').value='';
  document.getElementById('initVal').value='';
  renderInitList();
}
function sortInit(){
  initData.sort((a,b)=>b.val-a.val);
  initCurrent=0;
  renderInitList();
}
function clearInit(){
  if(!confirm('Limpar toda a iniciativa?'))return;
  initData=[];initCurrent=0;initRound=1;
  document.getElementById('initRound').textContent='Rodada 1';
  renderInitList();
}
function nextTurn(){
  if(initData.length===0)return;
  initCurrent=(initCurrent+1)%initData.length;
  if(initCurrent===0){initRound++;document.getElementById('initRound').textContent=`Rodada ${initRound}`;}
  renderInitList();
  toast(`⚔ Turno: ${initData[initCurrent].name}`);
}
function renderInitList(){
  const el=document.getElementById('initList');
  if(initData.length===0){el.innerHTML='<div style="color:var(--text-dim);font-style:italic;text-align:center;padding:16px;font-size:.8rem">Adicione personagens e criaturas acima</div>';return;}
  el.innerHTML=initData.map((p,i)=>`
    <div class="init-row ${i===initCurrent?'current':''}">
      <div class="init-num">${p.val}</div>
      <div class="init-name">${i===initCurrent?'▶ ':''}${p.name}</div>
      <button class="init-del" onclick="removeFromInit(${p.id})">✕</button>
    </div>`).join('');
}
function removeFromInit(id){
  const idx=initData.findIndex(p=>p.id===id);
  initData.splice(idx,1);
  if(initCurrent>=initData.length)initCurrent=0;
  renderInitList();
}

// ── SESSION TIMER ───────────────────────────────────
let timerInterval=null;
let timerSeconds=0;
let timerRunning=false;

function toggleTimer(){
  if(timerRunning){
    clearInterval(timerInterval);
    timerRunning=false;
    document.getElementById('timerWidget').classList.remove('running');
    document.getElementById('timerDot').style.background='var(--text-dim)';
    toast(`⏱ Sessão pausada: ${formatTimer(timerSeconds)}`);
  } else {
    timerRunning=true;
    document.getElementById('timerWidget').classList.add('running');
    timerInterval=setInterval(()=>{
      timerSeconds++;
      document.getElementById('timerDisplay').textContent=formatTimer(timerSeconds);
    },1000);
    toast('⏱ Timer de sessão iniciado!');
  }
}
function formatTimer(s){
  const h=Math.floor(s/3600);
  const m=Math.floor((s%3600)/60);
  const sec=s%60;
  if(h>0)return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

// ── THEME TOGGLE ────────────────────────────────────
function toggleTheme(){
  document.body.classList.toggle('theme-parchment');
  const isParchment=document.body.classList.contains('theme-parchment');
  document.querySelector('.theme-btn').textContent=isParchment?'🌑':'🌗';
  toast(isParchment?'📜 Tema Pergaminho':'🌑 Tema Sombrio');
  if(currentUser){
    currentUser.theme=isParchment?'parchment':'dark';
    saveUser();
  }
}

// ── MOBILE MENU ─────────────────────────────────────
function toggleMobileMenu(){
  document.getElementById('tbNav').classList.toggle('mobile-open');
}
function closeMobileMenu(){
  document.getElementById('tbNav').classList.remove('mobile-open');
}
document.addEventListener('click',e=>{
  const nav=document.getElementById('tbNav');
  const ham=document.getElementById('hamburger');
  if(nav&&ham&&!nav.contains(e.target)&&!ham.contains(e.target)){
    closeMobileMenu();
  }
});

// ── CALENDAR / SESSION SCHEDULER ────────────────────
let calYear=new Date().getFullYear();
let calMonth_=new Date().getMonth();
let calSelected=null;
const MONTHS_PT=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function buildCalendar(){
  calYear=new Date().getFullYear();
  calMonth_=new Date().getMonth();
  renderCalendar();
}
function calNav(dir){
  calMonth_+=dir;
  if(calMonth_<0){calMonth_=11;calYear--;}
  if(calMonth_>11){calMonth_=0;calYear++;}
  renderCalendar();
}
function renderCalendar(){
  document.getElementById('calMonth').textContent=`${MONTHS_PT[calMonth_]} ${calYear}`;
  const firstDay=new Date(calYear,calMonth_,1).getDay();
  const daysInMonth=new Date(calYear,calMonth_+1,0).getDate();
  const today=new Date();
  const sessions=getCurrentUserSessions();
  const container=document.getElementById('calDays');
  let html='<div class="cal-dow">DOM</div><div class="cal-dow">SEG</div><div class="cal-dow">TER</div><div class="cal-dow">QUA</div><div class="cal-dow">QUI</div><div class="cal-dow">SEX</div><div class="cal-dow">SÁB</div>';
  // Empty slots before first day
  for(let i=0;i<firstDay;i++) html+=`<div class="cal-day other-month"></div>`;
  for(let d=1;d<=daysInMonth;d++){
    const dateKey=`${calYear}-${String(calMonth_+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday=today.getFullYear()===calYear&&today.getMonth()===calMonth_&&today.getDate()===d;
    const hasSess=sessions.some(s=>s.date===dateKey);
    const isSel=calSelected===dateKey;
    html+=`<div class="cal-day ${isToday?'today':''} ${hasSess?'has-session':''} ${isSel?'selected':''}" onclick="selectCalDay('${dateKey}')">${d}</div>`;
  }
  container.innerHTML=html;
}
function selectCalDay(dateKey){
  calSelected=dateKey;
  renderCalendar();
  const [y,m,d]=dateKey.split('-');
  document.getElementById('calSelectedLabel').textContent=`${d}/${m}/${y} — Sessões`;
  document.getElementById('sessAddForm').style.display='flex';
  renderSessionsList(dateKey);
}
function getCurrentUserSessions(){
  if(!currentUser)return[];
  return LS.get('sessions:'+currentUser.username.toLowerCase())||[];
}
function renderSessionsList(dateKey){
  const sessions=getCurrentUserSessions().filter(s=>s.date===dateKey);
  const list=document.getElementById('sessionsList');
  if(sessions.length===0){list.innerHTML='<div style="color:var(--text-dim);font-style:italic;font-size:.82rem;padding:8px 0">Nenhuma sessão agendada. Adicione acima!</div>';return;}
  list.innerHTML=sessions.map(s=>`
    <div class="sess-item">
      <div class="sess-date">${s.time||'—'}</div>
      <div class="sess-info">
        <div class="sess-title">${s.title}</div>
        ${s.notes?`<div class="sess-meta">${s.notes}</div>`:''}
      </div>
      <button class="sess-del" onclick="deleteSession('${s.id}')">🗑</button>
    </div>`).join('');
}
function saveSession(){
  if(!calSelected||!currentUser){toast('⚠ Selecione um dia no calendário!');return;}
  const title=document.getElementById('sessTitle').value.trim();
  if(!title){toast('⚠ Digite um título para a sessão!');return;}
  const time=document.getElementById('sessTime').value;
  const notes=document.getElementById('sessNotes').value.trim();
  const sessions=getCurrentUserSessions();
  sessions.push({id:'sess_'+Date.now(),date:calSelected,title,time,notes,created:new Date().toLocaleDateString('pt-BR')});
  LS.set('sessions:'+currentUser.username.toLowerCase(),sessions);
  document.getElementById('sessTitle').value='';
  document.getElementById('sessTime').value='';
  document.getElementById('sessNotes').value='';
  renderCalendar();
  renderSessionsList(calSelected);
  toast('📅 Sessão agendada!');
  addXP(10);
  logActivity('calendar',`agendou uma sessão: "${title}"`, '📅');
}
function deleteSession(id){
  if(!currentUser)return;
  const sessions=getCurrentUserSessions().filter(s=>s.id!==id);
  LS.set('sessions:'+currentUser.username.toLowerCase(),sessions);
  renderCalendar();
  if(calSelected)renderSessionsList(calSelected);
  toast('Sessão removida.');
}

// ══════════════════════════════════════════════════
// CREATE MESA
// ══════════════════════════════════════════════════
const CM_EMOJIS = ['🌌','🌙','🔥','⚔','🌿','🏔','🌊','🌑','💀','🐉','🌹','⚡','🔮','🏰','🗡','🌋','👁','✨','🌀','🦅','🪄','🗺','🌃','🌄','🛡','📖'];
let cmBg = 'linear-gradient(135deg,#1a0a2e,#0e0b10)';
let cmEmoji = '🌌';
let cmPlayers = [];
let cmEditId = null;

function buildCmEmojiPicker(){
  const g = document.getElementById('cmEmojiPicker');
  if(!g) return;
  g.innerHTML = '';
  CM_EMOJIS.forEach(e => {
    const d = document.createElement('div');
    d.className = 'ep-opt' + (e===cmEmoji?' sel':'');
    d.textContent = e;
    d.onclick = () => {
      cmEmoji = e;
      document.querySelectorAll('.ep-opt').forEach(x=>x.classList.remove('sel'));
      d.classList.add('sel');
      updateCmPreview();
    };
    g.appendChild(d);
  });
}

function setCmBg(bg){
  cmBg = bg;
  document.querySelectorAll('.cm-bg-swatch').forEach(s=>{
    s.classList.toggle('active', s.getAttribute('onclick')?.includes(bg));
  });
  updateCmPreview();
}

function updateCmPreview(){
  const p = document.getElementById('cmPreview');
  if(p){ p.style.background = cmBg; p.textContent = cmEmoji; }
}

function openCreateMesa(editId){
  cmEditId = editId || null;
  cmPlayers = [];
  cmEmoji = '🌌';
  cmBg = 'linear-gradient(135deg,#1a0a2e,#0e0b10)';

  // If editing, prefill
  if(editId){
    const mesas = LS.get('custommesas') || [];
    const m = mesas.find(x=>x.id===editId);
    if(m){
      document.getElementById('cmName').value = m.name||'';
      document.getElementById('cmSystem').value = m.system||'';
      document.getElementById('cmGenre').value = m.genre||'';
      document.getElementById('cmDesc').value = m.desc||'';
      cmEmoji = m.emoji||'🌌';
      cmBg = m.bg||cmBg;
      cmPlayers = [...(m.players||[])];
      document.getElementById('cmModalTitle').textContent = '✦ Editar Mesa';
      document.querySelector('.create-mesa-box .char-save-btn').textContent = '⚔ Salvar Alterações';
    }
  } else {
    document.getElementById('cmName').value = '';
    document.getElementById('cmSystem').value = '';
    document.getElementById('cmGenre').value = '';
    document.getElementById('cmDesc').value = '';
    document.getElementById('cmModalTitle').textContent = '✦ Criar Nova Mesa';
    document.querySelector('.create-mesa-box .char-save-btn').textContent = '⚔ Criar Mesa';
  }

  document.getElementById('cmPlayerInp').value = '';
  document.getElementById('cmPlayerErr').textContent = '';
  document.getElementById('createMesaModal').classList.add('open');
  buildCmEmojiPicker();
  updateCmPreview();
  renderCmPlayers();
  // Mark first swatch active
  document.querySelectorAll('.cm-bg-swatch').forEach((s,i)=>{
    if(i===0) s.classList.add('active');
  });
  playO();
}

function closeCreateMesa(){
  document.getElementById('createMesaModal').classList.remove('open');
  playC();
}

function addPlayerToMesa(){
  const inp = document.getElementById('cmPlayerInp');
  const username = inp.value.trim();
  const errEl = document.getElementById('cmPlayerErr');
  errEl.textContent = '';

  if(!username){ errEl.textContent = 'Digite um nome de usuário.'; return; }
  if(cmPlayers.find(p=>p.username.toLowerCase()===username.toLowerCase())){
    errEl.textContent = 'Jogador já está na lista.'; return;
  }
  if(currentUser && username.toLowerCase()===currentUser.username.toLowerCase()){
    errEl.textContent = 'Você já é o criador da mesa!'; return;
  }

  const userData = LS.get('user:'+username.toLowerCase());
  if(!userData){
    errEl.textContent = `Usuário "${username}" não encontrado.`; return;
  }

  cmPlayers.push({
    username: userData.username,
    avatar: userData.avatar||'⚔',
    photo: userData.photo||null,
    role: 'player'
  });
  inp.value = '';
  renderCmPlayers();
  toast(`✦ ${userData.username} adicionado à mesa!`);
}

function renderCmPlayers(){
  const list = document.getElementById('cmPlayersList');
  const count = document.getElementById('cmPlayerCount');
  if(!list) return;

  const total = cmPlayers.length + (currentUser ? 1 : 0);
  if(count) count.textContent = total + ' jogador' + (total!==1?'es':'');

  if(cmPlayers.length === 0){
    list.innerHTML = '<div style="font-size:.78rem;color:var(--text-dim);text-align:center;padding:12px;font-style:italic">Nenhum jogador adicionado ainda.</div>';
  } else {
    list.innerHTML = cmPlayers.map((p,i) => {
      const avHtml = p.photo
        ? `<img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
        : p.avatar;
      return `<div class="player-row">
        <div class="player-av">${avHtml}</div>
        <div class="player-name">${p.username}</div>
        <select class="player-role-sel" onchange="cmPlayers[${i}].role=this.value">
          <option value="player" ${p.role==='player'?'selected':''}>Player</option>
          <option value="mestre" ${p.role==='mestre'?'selected':''}>Mestre</option>
          <option value="espectador" ${p.role==='espectador'?'selected':''}>Espectador</option>
        </select>
        <button class="player-rm" onclick="cmPlayers.splice(${i},1);renderCmPlayers()" title="Remover">✕</button>
      </div>`;
    }).join('');
  }
}

function saveCustomMesa(){
  const name = document.getElementById('cmName').value.trim();
  const system = document.getElementById('cmSystem').value.trim();
  const genre = document.getElementById('cmGenre').value.trim();
  const desc = document.getElementById('cmDesc').value.trim();

  if(!name){ toast('⚠ Dê um nome à mesa!'); return; }

  const mesas = LS.get('custommesas') || [];
  const mesa = {
    id: cmEditId || 'mesa_'+Date.now(),
    name, system: system||'Sistema Livre', genre: genre||'Livre',
    desc: desc||'Uma nova aventura aguarda...', emoji: cmEmoji, bg: cmBg,
    symbol: cmEmoji, players: [...cmPlayers],
    owner: currentUser?.username||'',
    created: new Date().toLocaleDateString('pt-BR'),
    sessions: 0
  };

  if(cmEditId){
    const idx = mesas.findIndex(x=>x.id===cmEditId);
    if(idx>=0) mesas[idx]=mesa; else mesas.push(mesa);
    toast('✦ Mesa atualizada!');
  } else {
    mesas.push(mesa);
    unlockAchievement('mestre_mesa');
    logActivity('mesa', `criou a mesa "${name}"`, cmEmoji);
    toast(`${cmEmoji} Mesa "${name}" criada!`);
    addXP(30);
  }

  LS.set('custommesas', mesas);
  closeCreateMesa();
  buildMesas();
}

function deleteCustomMesa(id, ev){
  if(ev) ev.stopPropagation();
  const mesas = (LS.get('custommesas')||[]).filter(m=>m.id!==id);
  LS.set('custommesas', mesas);
  buildMesas();
  toast('Mesa excluída.');
}

function openCustomMesa(id){
  const mesas = LS.get('custommesas') || [];
  const r = mesas.find(x=>x.id===id);
  if(!r) return;
  // build a temporary rpg-like object and open overlay
  document.getElementById('rpgOverlay').classList.add('open');
  const totalPlayers = r.players.length + 1;
  const ownerAvEl = currentUser && r.owner===currentUser.username
    ? (currentUser.photo?`<img src="${currentUser.photo}" style="width:28px;height:28px;object-fit:cover;border-radius:50%">`:currentUser.avatar)
    : r.owner;
  document.getElementById('rpgContent').innerHTML=`
    <div class="rpg-ph">
      <div class="rpg-ph-cover" style="background:${r.bg};font-size:5.5rem">${r.emoji}</div>
      <div class="rpg-ph-meta">
        <div style="font-size:2rem;margin-bottom:6px">${r.symbol}</div>
        <div class="rpg-ph-title">${r.name}</div>
        <div class="rpg-ph-sys">${r.system} · ${r.genre}</div>
        <div class="rpg-ph-desc">${r.desc}</div>
        <div class="rpg-ph-pills">
          <div class="pill">👥 ${totalPlayers} Jogador${totalPlayers!==1?'es':''}</div>
          <div class="pill">📜 ${r.sessions} Sessões</div>
          <div class="pill">📅 Criada em ${r.created}</div>
        </div>
      </div>
    </div>
    <div class="chars-sect">
      <div style="font-family:'Cinzel',serif;font-size:.7rem;letter-spacing:.3em;color:var(--gold);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:10px;">Elenco <span style="flex:1;height:1px;background:linear-gradient(90deg,var(--gold-dim),transparent);display:block"></span></div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${currentUser ? `<div class="player-row" style="border-color:rgba(201,168,76,.3)">
          <div class="player-av">${currentUser.photo?`<img src="${currentUser.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:currentUser.avatar}</div>
          <div class="player-name" style="color:var(--gold-light)">${currentUser.username} <span style="color:var(--gold-dim);font-size:.6rem">(você)</span></div>
          <span style="font-family:'Cinzel',serif;font-size:.6rem;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);padding:2px 8px;border-radius:10px;color:var(--gold)">Criador / Mestre</span>
        </div>` : ''}
        ${r.players.map(p=>{
          const avHtml = p.photo?`<img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:p.avatar;
          const roleLabel = p.role==='mestre'?'Mestre':p.role==='espectador'?'Espectador':'Player';
          const roleColor = p.role==='mestre'?'rgba(201,168,76,.12)':'rgba(74,32,96,.3)';
          const roleBorder = p.role==='mestre'?'rgba(201,168,76,.25)':'rgba(123,63,160,.4)';
          const roleText = p.role==='mestre'?'var(--gold)':'var(--purple-bright)';
          return `<div class="player-row">
            <div class="player-av">${avHtml}</div>
            <div class="player-name">${p.username}</div>
            <span style="font-family:'Cinzel',serif;font-size:.6rem;background:${roleColor};border:1px solid ${roleBorder};padding:2px 8px;border-radius:10px;color:${roleText}">${roleLabel}</span>
          </div>`;
        }).join('')}
        ${r.players.length===0&&!currentUser?'<div style="color:var(--text-dim);font-style:italic;font-size:.85rem;text-align:center;padding:12px">Nenhum jogador adicionado.</div>':''}
      </div>
      ${r.owner===currentUser?.username?`
      <div style="display:flex;gap:10px;margin-top:20px">
        <button class="rpg-open-btn" style="flex:1" onclick="closeRpg();openCreateMesa('${r.id}')">✏ Editar Mesa</button>
        <button class="rpg-del-btn" style="flex:1" onclick="closeRpg();deleteCustomMesa('${r.id}')">🗑 Excluir Mesa</button>
      </div>`:''}
    </div>`;
  document.body.style.overflow='hidden';
  playO();
}

// ── Patch buildMesas to include custom mesas ──────
const _origBuildMesas = buildMesas;
buildMesas = function(){
  _origBuildMesas();
  const customMesas = LS.get('custommesas')||[];
  const myMesas = customMesas.filter(m=>m.owner===currentUser?.username);
  const section = document.getElementById('custom-mesas-section');
  const grid = document.getElementById('customRpgGrid');
  if(!section||!grid) return;

  if(myMesas.length===0){
    section.style.display='none';
    return;
  }
  section.style.display='block';
  grid.innerHTML='';
  myMesas.forEach(r=>{
    const d=document.createElement('div');
    d.className='rpg-card rpg-card-custom';
    d.innerHTML=`<div class="rpg-cover" style="background:${r.bg}"><span class="p-emoji">${r.emoji}</span></div>
      <div class="rpg-badge-owner">✦ Sua Mesa</div>
      <div class="rpg-badge">${r.genre}</div>
      <div class="rpg-info">
        <div class="rpg-name">${r.symbol} ${r.name}</div>
        <div class="rpg-system">${r.system} · 👥 ${r.players.length+1} jogadores</div>
        <div class="rpg-desc">${(r.desc||'').substring(0,110)}${r.desc?.length>110?'…':''}</div>
        <button class="rpg-open-btn" onclick="openCustomMesa('${r.id}')">Ver Mesa →</button>
        <button class="rpg-del-btn" onclick="event.stopPropagation();deleteCustomMesa('${r.id}')">🗑 Excluir</button>
      </div>`;
    d.addEventListener('mousemove',e=>{const rc=d.getBoundingClientRect();const dx=(e.clientX-rc.left-rc.width/2)/rc.width;const dy=(e.clientY-rc.top-rc.height/2)/rc.height;d.style.transform=`translateY(-6px) scale(1.01) rotateX(${-dy*5}deg) rotateY(${dx*5}deg)`;d.querySelector('.p-emoji').style.transform=`translate(${dx*14}px,${dy*8}px)`;});
    d.addEventListener('mouseleave',()=>{d.style.transform='';d.querySelector('.p-emoji').style.transform='';});
    grid.appendChild(d);
  });
};

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeSheet();closeRpg();document.body.style.overflow='';return;}
  eggBuf+=e.key.toLowerCase();if(eggBuf.length>12)eggBuf=eggBuf.slice(-12);
  if(eggBuf.endsWith('d20'))triggerEgg();
});
function triggerEgg(){
  const el=document.getElementById('egg');el.classList.remove('go');void el.offsetWidth;el.classList.add('go');
  for(let i=0;i<50;i++)setTimeout(()=>{const ev=new MouseEvent('mousemove',{clientX:innerWidth/2+(Math.random()-.5)*300,clientY:innerHeight/2+(Math.random()-.5)*300});window.dispatchEvent(ev);},i*25);
  eggBuf='';
}
