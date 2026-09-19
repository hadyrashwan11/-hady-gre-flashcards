const DATA=window.GRE_WORDS,LEARNED_COUNT=window.GRE_LEARNED_COUNT;
const STORE="hadyGreProgressV4",SESSION_STORE="hadyGreSessionV1";
let state=JSON.parse(localStorage.getItem(STORE)||"{}");

// Migrate older saved progress if this browser has it.
for(const oldKey of ["hadyGreProgressV3","hadyGreProgressV2"]){
  try{
    const old=JSON.parse(localStorage.getItem(oldKey)||"{}");
    for(const [word,status] of Object.entries(old)){
      if(!state[word]&&(status==="known"||status==="learning")) state[word]=status;
    }
  }catch{}
}
localStorage.setItem(STORE,JSON.stringify(state));

let savedSession={};
try{savedSession=JSON.parse(localStorage.getItem(SESSION_STORE)||"{}")}catch{}
let mode=["all","learned","new","learning","known","unseen"].includes(savedSession.mode)?savedSession.mode:"all";
let deck=[],index=0,touchX=null;
const $=id=>document.getElementById(id);

function sh(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function baseDeck(){return[...sh(DATA.filter(x=>x.g==="learned").slice()),...sh(DATA.filter(x=>x.g==="new").slice())]}
function deckFor(m){
  if(m==="all") return baseDeck();
  if(m==="learned") return sh(DATA.filter(x=>x.g==="learned").slice());
  if(m==="new") return sh(DATA.filter(x=>x.g==="new").slice());
  if(m==="learning") return sh(DATA.filter(x=>state[x.w]==="learning").slice());
  if(m==="known") return sh(DATA.filter(x=>state[x.w]==="known").slice());
  return sh(DATA.filter(x=>!state[x.w]).slice());
}
function saveSession(){
  const lastWord=deck.length?deck[index].w:null;
  localStorage.setItem(SESSION_STORE,JSON.stringify({mode,lastWord}));
}
function setMode(m,restoreWord=null){
  mode=m;
  document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===m));
  deck=deckFor(m);
  index=0;
  if(restoreWord){
    const found=deck.findIndex(x=>x.w===restoreWord);
    if(found>=0) index=found;
  }
  saveSession();
  render();
}
function stats(){
  const k=DATA.filter(x=>state[x.w]==="known").length;
  const l=DATA.filter(x=>state[x.w]==="learning").length;
  const u=DATA.length-k-l;
  $("summary").textContent=DATA.length+" total words · "+LEARNED_COUNT+" previously studied · "+(DATA.length-LEARNED_COUNT)+" additional";
  $("knownSummary").textContent=k+" known · "+l+" learning";
  $("knownFilter").textContent="Known ("+k+")";
  $("learningFilter").textContent="Still learning ("+l+")";
  $("unseenFilter").textContent="Unseen ("+u+")";
  $("progress").style.width=(100*k/DATA.length)+"%";
}
function render(){
  $("card").classList.remove("flipped");
  if(!deck.length){
    $("word").textContent="No cards here";
    $("definition").textContent=mode==="learning"?"Mark words Still learning and they will collect here.":"Try another filter.";
    $("counter").textContent="";
    $("frontStatus").textContent="";
    $("markKnown").textContent="I know this";
    $("markLearning").textContent="Still learning";
    stats();saveSession();return;
  }
  const c=deck[index],s=state[c.w];
  $("word").textContent=c.w;
  $("definition").textContent=c.d;
  $("counter").textContent=(index+1)+" / "+deck.length;
  $("frontStatus").textContent=s==="known"?"Known":s==="learning"?"Still learning":c.g==="learned"?"Already learned":"New word";
  $("markKnown").textContent=s==="known"?"✓ Known":"I know this";
  $("markLearning").textContent=s==="learning"?"✓ Still learning":"Still learning";
  $("markKnown").setAttribute("aria-pressed",s==="known"?"true":"false");
  $("markLearning").setAttribute("aria-pressed",s==="learning"?"true":"false");
  stats();saveSession();
}
function save(){localStorage.setItem(STORE,JSON.stringify(state));stats();saveSession()}
function next(){if(deck.length){index=(index+1)%deck.length;render()}}
function prev(){if(deck.length){index=(index-1+deck.length)%deck.length;render()}}
$("scene").onclick=()=>$("card").classList.toggle("flipped");
$("next").onclick=e=>{e.preventDefault();next()};
$("prev").onclick=e=>{e.preventDefault();prev()};
$("markKnown").onclick=()=>{
  if(!deck.length)return;
  const w=deck[index].w;
  state[w]="known";
  save();
  if(mode==="learning"||mode==="unseen"){deck.splice(index,1);if(index>=deck.length)index=Math.max(0,deck.length-1);render()}else next();
};
$("markLearning").onclick=()=>{
  if(!deck.length)return;
  const w=deck[index].w;
  state[w]="learning";
  save();
  if(mode==="known"||mode==="unseen"){deck.splice(index,1);if(index>=deck.length)index=Math.max(0,deck.length-1);render()}else next();
};
$("shuffle").onclick=()=>{sh(deck);index=0;render()};
$("session25").onclick=()=>{
  let p=DATA.filter(x=>state[x.w]==="learning");
  p=[...p,...DATA.filter(x=>!state[x.w]&&x.g==="new"),...DATA.filter(x=>!state[x.w]&&x.g==="learned")];
  deck=sh([...new Map(p.map(x=>[x.w,x])).values()]).slice(0,25);
  mode="session";index=0;
  document.querySelectorAll("[data-mode]").forEach(b=>b.classList.remove("active"));
  render();
};
document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$("search").oninput=e=>{
  const q=e.target.value.trim().toLowerCase();
  if(!q){setMode(["all","learned","new","learning","known","unseen"].includes(mode)?mode:"all");return}
  deck=DATA.filter(x=>x.w.toLowerCase().includes(q));index=0;render();
};
$("scene").addEventListener("touchstart",e=>{touchX=e.changedTouches[0].clientX},{passive:true});
$("scene").addEventListener("touchend",e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(dx)>55)(dx<0?next:prev)()},{passive:true});
document.onkeydown=e=>{if(e.key==="ArrowRight")next();else if(e.key==="ArrowLeft")prev();else if(e.key===" "){e.preventDefault();$("card").classList.toggle("flipped")}};
for(const el of [$("scene"),$("next"),$("prev"),$("markKnown"),$("markLearning"),$("shuffle"),$("session25")]){
  el.addEventListener("dblclick",e=>e.preventDefault());
  el.addEventListener("gesturestart",e=>e.preventDefault(),{passive:false});
}

setMode(mode,savedSession.lastWord||null);