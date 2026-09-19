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
const PLAIN={"workable":"Practical and able to work successfully.","esoteric":"Hard to understand because only a small group of experts usually knows it.","laudatory":"Full of praise or approval.","scathing":"Extremely harsh and strongly critical.","skeptical":"Doubtful and not easily convinced.","insofar as":"To the extent that; it means 'as far as this is true.'","recalcitrant":"Stubbornly refusing to follow rules, authority, or attempts to control behavior.","constrain":"To limit what someone or something can do.","mitigate":"To make something bad less serious or less harmful.","untenable":"Too weak to defend or continue supporting.","pedestrian":"Ordinary, dull, and not very original.","conclusive":"Strong enough to settle the question or prove the point.","intransigent":"Stubbornly refusing to change your position or compromise.","lest":"For fear that something bad might happen; used when trying to prevent it.","ostentatious":"Very showy and meant to impress other people.","pragmatic":"Practical and focused on what actually works.","obdurate":"Very stubborn and unwilling to change.","credulous":"Too willing to believe something without enough proof.","transitory":"Temporary and lasting only a short time.","fortuitous":"Happening by chance, often with a lucky result.","flimsy":"Weak and not well supported.","sporadic":"Happening only sometimes and not on a regular schedule.","loquacious":"Very talkative and likely to speak a lot.","morose":"Gloomy, unhappy, and unfriendly in mood.","deleterious":"Harmful or damaging.","malleable":"Easy to shape, change, or influence.","circumspect":"Careful and cautious before acting or speaking.","intensify":"To make something stronger or more extreme.","austere":"Very plain, strict, or without much comfort or luxury.","conventional":"Traditional and following the usual way of doing things.","caustic":"Harsh and cutting, especially in criticism.","corroborate":"To support a claim with more evidence.","deceptive":"Giving a false or misleading impression.","prolific":"Producing a lot of work, ideas, or results.","lax":"Not strict or careful enough.","oblique":"Indirect instead of clear and straightforward.","albeit":"Although or even though.","impetuous":"Acting too quickly without thinking enough first.","lenient":"Not very strict; more forgiving than expected.","calculated":"Carefully planned to produce a certain result.","ameliorate":"To make a bad situation better.","banal":"Boring because it is too common or unoriginal.","deride":"To mock or make fun of with disrespect.","exacerbate":"To make an existing problem worse.","arduous":"Very difficult and requiring a lot of effort.","whereas":"While; used to show a contrast between two things.","assiduous":"Working very hard and carefully over time.","sanguine":"Optimistic and confident that things will turn out well.","imperious":"Bossy and commanding in an arrogant way.","credible":"Believable and worthy of trust.","taciturn":"Naturally quiet and not very talkative.","tenuous":"Weak or not strongly supported.","dubious":"Doubtful or not fully believable.","laconic":"Using very few words; brief when speaking or writing.","prodigal":"Wastefully spending much more money or resources than necessary.","meticulous":"Very careful about small details.","placate":"To calm someone who is angry or upset.","pellucid":"Very clear and easy to understand.","notwithstanding":"Despite; even though something is true.","misleading":"Likely to make someone believe something that is not true.","magnanimous":"Very generous and forgiving, especially toward a rival or opponent.","bolster":"To strengthen or support.","garrulous":"Very talkative, especially more than necessary.","unwavering":"Steady and not changing.","orthodox":"Following traditional or widely accepted beliefs or methods.","erudite":"Very well educated and knowledgeable.","candid":"Honest, direct, and open.","obsequious":"Too eager to please or flatter someone powerful.","abstruse":"Very difficult to understand.","lucid":"Clear and easy to understand.","assuage":"To make an unpleasant feeling less strong.","parsimonious":"Extremely unwilling to spend money or use resources.","steadfast":"Firm, loyal, and not likely to change.","capricious":"Unpredictable and likely to change suddenly.","derivative":"Unoriginal because it copies or depends too much on earlier ideas.","repudiate":"To strongly reject or refuse to accept something.","fastidious":"Very picky and careful about details or standards.","ephemeral":"Lasting for only a very short time.","scrupulous":"Very careful to be accurate, fair, and honest.","ostensibly":"Apparently or supposedly, even though the reality may be different.","accessible":"Easy to understand, use, reach, or approach.","vacillate":"To keep changing back and forth between choices or opinions.","undermine":"To gradually weaken something.","equivocal":"Unclear and able to mean more than one thing.","deliberate":"Intentional and carefully thought out.","perfunctory":"Done with very little care or effort, just to get it done.","forthright":"Direct and honest.","anomalous":"Unusual because it does not fit the normal pattern.","ubiquitous":"Found almost everywhere.","ambivalent":"Having mixed feelings about the same thing.","indefensible":"Impossible to reasonably defend or justify.","revere":"To deeply respect or admire.","noncommittal":"Avoiding a clear opinion or firm decision.","abeyance":"A temporary pause; something is put on hold for now.","abjure":"To officially give up or strongly reject a belief or practice.","abstemious":"Not using or consuming too much, especially food or drink.","accretion":"Slow growth as small amounts are added over time.","acerbic":"Sharp and harsh in the way someone speaks or writes.","acquiesce":"To accept something even though you do not really want to argue anymore.","adroit":"Skillful and clever, especially in a difficult situation.","adulterate":"To make something less pure or lower quality by mixing in something worse.","aggrandize":"To increase someone's power, status, or importance.","alacrity":"Quick and cheerful willingness to do something.","anachronistic":"Belonging to the wrong time period and seeming out of place.","anodyne":"Harmless or unlikely to offend, but sometimes boring.","antipathy":"A strong feeling of dislike.","apposite":"Very relevant and well suited to the situation.","arcane":"Known or understood by only a small number of people.","ascetic":"Living very simply and avoiding comfort or pleasure.","attenuate":"To make something weaker or less intense.","avaricious":"Extremely greedy for money or wealth.","aver":"To state something confidently as true.","belie":"To give a false impression, or to show that something is not really true.","bombastic":"Using big, fancy language to sound more impressive than the idea really is.","brevity":"Using only a few words; being brief.","byzantine":"Extremely complicated and confusing.","cajole":"To persuade someone with gentle pressure or flattery.","candor":"Honesty and openness.","castigate":"To criticize or punish very severely.","censure":"Strong official criticism.","chicanery":"Dishonest tricks used to deceive someone.","coalesce":"To come together and form one group or whole.","cogent":"Clear, logical, and convincing.","complacent":"Too satisfied with yourself or a situation and not worried enough about possible problems.","conciliatory":"Meant to reduce disagreement or calm conflict.","concomitant":"Something that naturally happens or exists along with something else.","conjecture":"A guess or conclusion based on incomplete evidence.","contentious":"Likely to cause disagreement, or someone who likes to argue.","contrite":"Feeling truly sorry and guilty about something you did.","convoluted":"Very complicated and difficult to follow.","copious":"Existing in a large amount.","cursory":"Quick and not careful or detailed enough.","dearth":"A serious shortage or lack of something.","deference":"Respect shown by accepting another person's judgment or authority.","demur":"To hesitate, object, or show that you do not fully agree.","denigrate":"To unfairly put down or criticize someone or something.","desultory":"Lacking a clear plan, direction, or steady effort.","didactic":"Made to teach a lesson, sometimes in an overly obvious or preachy way.","diffident":"Shy and lacking confidence.","disabuse":"To correct someone's false belief.","discerning":"Good at noticing important differences and making smart judgments.","dispassionate":"Calm and fair because emotions are not controlling the judgment.","dissemble":"To hide your true feelings or intentions.","dogmatic":"Acting as if your opinion is unquestionably true and refusing to consider other views.","eclectic":"Using ideas or styles from many different sources.","efficacious":"Effective; able to produce the wanted result.","effrontery":"Shameless boldness or disrespect.","elucidate":"To explain something and make it clearer.","enervate":"To weaken someone or drain their energy.","engender":"To cause or create something.","enigmatic":"Mysterious and difficult to understand.","equanimity":"The ability to stay calm and balanced, especially under pressure.","equivocate":"To speak unclearly on purpose so you do not have to give a direct answer.","exculpate":"To show that someone is not to blame.","exigent":"Urgent and needing immediate attention.","extant":"Still existing today.","extol":"To praise very strongly.","facetious":"Joking about a serious subject in a way that may be inappropriate.","fallacious":"Based on bad or mistaken reasoning.","florid":"Too fancy, decorated, or complicated in style.","foment":"To encourage or stir up conflict or unrest.","frugal":"Careful not to waste money or resources.","germane":"Directly related to the topic.","hackneyed":"Used so often that it has become boring and unoriginal.","harangue":"A long, forceful, often angry speech.","idiosyncratic":"Unusual in a way that is specific to one person or thing.","immutable":"Unable to be changed.","impecunious":"Having very little money.","imperturbable":"Staying calm and not easily upset.","impervious":"Not affected or influenced by something.","implacable":"Impossible to calm or persuade to stop opposing something.","implicit":"Suggested or understood without being stated directly.","inchoate":"Only partly formed or developed; not fully clear yet.","incongruous":"Not fitting the situation; strangely out of place.","indolent":"Lazy and unwilling to make much effort.","ineffable":"Too powerful or unusual to fully describe in words.","inimical":"Harmful or working against someone's interests.","inscrutable":"Extremely hard to understand.","insipid":"Dull, bland, and not interesting.","insular":"Narrow-minded or cut off from outside ideas.","invective":"Harsh and insulting language.","irascible":"Easily angered.","lacuna":"A missing part or gap.","latent":"Present but hidden or not active yet.","mendacious":"Dishonest and likely to lie.","mercurial":"Changing mood or behavior very quickly and unpredictably.","modicum":"A small amount.","munificent":"Extremely generous.","myopic":"Too focused on the short term and not thinking enough about the future.","nebulous":"Vague and not clearly defined.","nonchalant":"Calm and casually unconcerned.","obfuscate":"To make something harder to understand.","onerous":"Very difficult or burdensome.","opprobrium":"Strong public criticism, shame, or disgrace.","palliate":"To make a problem less severe without fixing its main cause.","panacea":"Something claimed to solve every problem.","paradigmatic":"A very clear or typical example.","parochial":"Narrow in outlook and focused on only a small viewpoint.","pedantic":"Too focused on small rules or details, often to show off knowledge.","penchant":"A strong liking or natural tendency.","pernicious":"Very harmful, especially in a slow or hidden way.","perspicacious":"Very good at understanding difficult things quickly.","polemic":"A strong written or spoken attack on an idea or belief.","precipitate":"To cause something suddenly; it can also mean acting too quickly.","preclude":"To prevent something from happening.","prescient":"Showing knowledge of something before it happens.","proclivity":"A natural tendency to behave in a certain way.","prosaic":"Ordinary, dull, and not very imaginative.","proscribe":"To officially forbid or ban something.","pugnacious":"Eager to argue or fight.","quixotic":"Very idealistic but not realistic or practical.","recondite":"Very difficult to understand and mainly known by experts.","relegate":"To move someone or something to a lower position or level of importance.","remiss":"Careless about doing something you are responsible for.","rescind":"To officially cancel a rule, agreement, or decision.","reticent":"Quiet or unwilling to share your thoughts and feelings.","salient":"Most noticeable or important.","sardonic":"Mocking in a dry, bitter way.","soporific":"Making you sleepy or extremely bored.","spurious":"False or not genuine, even if it looks believable.","stolid":"Calm and showing very little emotion.","superfluous":"Unnecessary because there is already enough.","surreptitious":"Done secretly, usually because it may be wrong or forbidden.","sycophantic":"Giving too much praise to powerful people to gain their favor.","tacit":"Understood without being directly said.","temerity":"Bold confidence that is foolish or disrespectful.","trenchant":"Sharp, clear, and effective, especially in criticism or analysis.","truculent":"Aggressively hostile and ready to argue or fight.","venerate":"To deeply respect or admire.","vindicate":"To show that someone was not to blame, or that an idea was correct.","virulent":"Extremely harmful, hostile, or severe.","vitriolic":"Full of very bitter and angry criticism.","wry":"Using dry, clever humor, often about something unpleasant.","abrogate":"To officially cancel a law, agreement, or practice.","admonish":"To firmly warn or criticize someone.","anathema":"Something that is strongly hated or completely rejected.","apocryphal":"Widely repeated but probably not true.","approbation":"Strong approval or praise.","arrogate":"To claim a right or power that you do not really have.","canonical":"Accepted as the standard or official version.","denouement":"The final part where the main problems are resolved.","disinterested":"Fair and not influenced by personal benefit.","ecumenical":"Broad and accepting of different groups or viewpoints.","emollient":"Soothing or calming; sometimes used for words meant to reduce conflict.","exonerate":"To officially clear someone from blame.","expedient":"Useful and convenient right now, even if it may not be the best or most principled choice.","fecund":"Very fertile or highly productive.","fractious":"Irritable, argumentative, and hard to control.","gainsay":"To deny or argue against something.","glib":"Speaking smoothly but without much thought or sincerity.","grandiloquent":"Using overly fancy or grand language.","indefatigable":"Able to keep working without seeming to get tired.","ingenuous":"Honest, innocent, and straightforward.","innocuous":"Harmless and unlikely to cause damage.","moribund":"Close to disappearing, dying, or no longer functioning.","obviate":"To remove a problem or make something unnecessary.","pithy":"Brief but meaningful.","quiescent":"Quiet and inactive for now.","refractory":"Stubbornly resisting control, treatment, or change.","sagacious":"Wise and good at making judgments.","specious":"Seeming true or reasonable at first but actually wrong or misleading.","staid":"Serious, traditional, and not very exciting.","tendentious":"Strongly biased toward one side.","vitiate":"To weaken, damage, or make something less effective.","vociferous":"Loud and forceful when expressing an opinion."};
function easyDefinition(card){return PLAIN[card.w]||card.d;}


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
  $("definition").textContent=easyDefinition(c);
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