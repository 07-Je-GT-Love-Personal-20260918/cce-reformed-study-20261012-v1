(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}},read=k=>{try{return localStorage.getItem(k)}catch{return null}};
const mobile=matchMedia('(max-width:800px)');
const tocButton=$('#tocToggle');
function toc(show){document.body.classList.toggle('toc-hidden',!show);tocButton.setAttribute('aria-expanded',String(show));tocButton.textContent=show?'隐藏目录':'显示目录'}
toc(!mobile.matches);tocButton.addEventListener('click',()=>toc(document.body.classList.contains('toc-hidden')));
document.addEventListener('keydown',e=>{if(e.key==='Escape')toc(false)});
if(read('cce-theme')==='dark')document.body.classList.add('dark');
function themeLabel(){$('#themeToggle').textContent=document.body.classList.contains('dark')?'☀ 浅色':'☾ 深色'}themeLabel();
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');save('cce-theme',document.body.classList.contains('dark')?'dark':'light');themeLabel()});
let font=Number(read('cce-font'))||17;font=Math.max(16,Math.min(21,font));if(read('cce-font'))document.documentElement.style.setProperty('--body-size',font+'px');
$('#fontToggle').addEventListener('click',()=>{font=font>=21?16:font+1;document.documentElement.style.setProperty('--body-size',font+'px');save('cce-font',String(font));$('#fontToggle').textContent='字 '+font});
const sections=$$('main .section');const nav=$('#toc');
sections.forEach(s=>{const h=s.querySelector('h2');const a=document.createElement('a');a.href='#'+s.id;a.textContent=h.textContent;a.dataset.depth='1';nav.append(a);s.querySelectorAll('h3,h4,h5').forEach((h,i)=>{if(h.closest('.time-card,.qa,.source-list,.place-info,.chapter-group'))return;h.id=h.id||s.id+'-sub-'+i;const b=document.createElement('a');b.href='#'+h.id;b.textContent=h.textContent;b.className='sub depth-'+(Number(h.tagName.slice(1))-1);b.dataset.depth=String(Number(h.tagName.slice(1))-1);nav.append(b)})});
$('#tocDepth').addEventListener('change',e=>{$$('#toc a').forEach(a=>a.hidden=Number(a.dataset.depth)>Number(e.target.value))});
const bookCards=$$('.book-card');
function filterBooks(){const q=$('#bookSearch').value.trim().toLowerCase(),lang=$('#bookLanguage').value;bookCards.forEach(c=>c.hidden=!(c.textContent.toLowerCase().includes(q)&&(lang==='all'||c.dataset.cn===lang)));$$('.book-category').forEach(c=>c.hidden=!Array.from(c.querySelectorAll('.book-card')).some(b=>!b.hidden));$('#bookStatus').textContent='显示 '+bookCards.filter(c=>!c.hidden).length+' / '+bookCards.length+' 项书目。';}
function resetBooks(){$('#bookSearch').value='';$('#bookLanguage').value='all';filterBooks()}
$('#bookSearch').addEventListener('input',filterBooks);$('#bookLanguage').addEventListener('change',filterBooks);$('#bookReset').addEventListener('click',resetBooks);resetBooks();
nav.addEventListener('click',e=>{const a=e.target.closest('a');if(a){const t=document.getElementById(a.getAttribute('href').slice(1));if(t&&t.closest('.book-category'))resetBooks()}});
nav.addEventListener('click',e=>{if(e.target.closest('a')&&mobile.matches)toc(false)});
const links=$$('#toc>a:not(.sub)');
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('current',a.hash==='#'+e.target.id))}})},{rootMargin:'-15% 0px -70% 0px'});sections.forEach(s=>observer.observe(s))}
function progress(){const h=document.documentElement;const d=h.scrollHeight-h.clientHeight;$('#progress').style.width=(d>0?100*h.scrollTop/d:0)+'%'}window.addEventListener('scroll',progress,{passive:true});progress();
$('#backtop').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'}));
let timer=null,index=-1;const cards=$$('.time-card');
function stop(){clearInterval(timer);timer=null;$('#playTimeline').textContent='▶ 播放年代';$('#playTimeline').setAttribute('aria-pressed','false')}
$$('[data-era]').forEach(b=>b.addEventListener('click',()=>{stop();$$('[data-era]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));cards.forEach(c=>{c.hidden=b.dataset.era!=='all'&&c.dataset.category!==b.dataset.era;c.classList.remove('playing')});$('#timelineStatus').textContent='显示 '+cards.filter(c=>!c.hidden).length+' 个节点'}));
$('#playTimeline').addEventListener('click',()=>{if(timer){stop();return}const visible=cards.filter(c=>!c.hidden);index=-1;function tick(){cards.forEach(c=>c.classList.remove('playing'));index++;if(index>=visible.length){stop();return}const c=visible[index];c.classList.add('playing');$('#timelineStatus').textContent=c.querySelector('.year').childNodes[0].textContent+' · '+c.querySelector('h3').textContent;c.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})}tick();timer=setInterval(tick,4200);$('#playTimeline').textContent='Ⅱ 暂停播放';$('#playTimeline').setAttribute('aria-pressed','true')});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
function place(id){const p=DATA.places.find(p=>p[0]===id);if(!p)return;$('#placeTitle').textContent=p[1]+' · '+p[4];$('#placeText').textContent=p[5];$$('[data-place]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.place===id))})}
$$('[data-place]').forEach(b=>{b.addEventListener('click',()=>place(b.dataset.place));if(b.tagName.toLowerCase()==='g')b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();place(b.dataset.place)}})});
let memoryIndex=0;function renderMemory(){const t=DATA.timeline[memoryIndex];$('#memoryCount').textContent=(memoryIndex+1)+' / '+DATA.timeline.length;$('#memoryQuestion').textContent=t[2]+'：哪一年？在哪里？';$('#memoryAnswer').textContent=t[0]+' · '+t[3]+'。'+t[4]+' 记忆钩子：'+t[5];$('#memoryAnswer').hidden=true;$('#revealMemory').textContent='查看答案';$('#revealMemory').setAttribute('aria-expanded','false')}
$('#revealMemory').addEventListener('click',()=>{const a=$('#memoryAnswer');a.hidden=!a.hidden;$('#revealMemory').textContent=a.hidden?'查看答案':'收起答案';$('#revealMemory').setAttribute('aria-expanded',String(!a.hidden))});
$('#nextMemory').addEventListener('click',()=>{memoryIndex=(memoryIndex+1)%DATA.timeline.length;renderMemory()});$('#prevMemory').addEventListener('click',()=>{memoryIndex=(memoryIndex+DATA.timeline.length-1)%DATA.timeline.length;renderMemory()});$('#shuffleMemory').addEventListener('click',()=>{memoryIndex=(memoryIndex+1+Math.floor(Math.random()*(DATA.timeline.length-1)))%DATA.timeline.length;renderMemory()});renderMemory();
$('#answersToggle').addEventListener('click',()=>{const hide=$('#answersToggle').getAttribute('aria-expanded')==='true';$$('.qa-answer').forEach(x=>x.hidden=hide);$('#answersToggle').setAttribute('aria-expanded',String(!hide));$('#answersToggle').textContent=hide?'展开全部答案':'暂藏答案，先自行思考'});
const learnTexts=['定位：说出作者、地域、原作年和中译年。将一本书挂在时间线上，先知道它在回应谁。','提问：先用一个问题读一章。分清作者的主张、证据与推论，把陌生词写成自己的话。','分辨：用圣经与认信审察神学主张，用历史与课堂证据审察事实判断。不要把有用的方法提升为信仰义务。','复述：合上书，用一分钟说明观点、一项保留和一个实践。明天、三天后、一周后再回忆。'];
let learnIndex=0,learnTimer=null;function learnStep(i){learnIndex=i;$$('[data-learn]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.learn)===i)));$('#learnText').textContent=learnTexts[i]}
function stopLearn(){clearInterval(learnTimer);learnTimer=null;$('#learnPlay').textContent='▶ 播放记忆路径';$('#learnPlay').setAttribute('aria-pressed','false')}
$$('[data-learn]').forEach(b=>b.addEventListener('click',()=>{stopLearn();learnStep(Number(b.dataset.learn))}));
$('#learnPlay').addEventListener('click',()=>{if(learnTimer){stopLearn();return}learnStep(0);$('#learnPlay').textContent='Ⅱ 暂停';$('#learnPlay').setAttribute('aria-pressed','true');learnTimer=setInterval(()=>{if(learnIndex===3){stopLearn();return}learnStep(learnIndex+1)},5000)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopLearn()});
const searchSections=sections.filter(s=>s.id!=='reading'&&s.id!=='sources');
$('#search').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase(),out=$('#searchResults');out.replaceChildren();if(q.length<1){$('#searchStatus').textContent='输入关键词，如“三艺”“腓特烈”“恩典”。';return}const results=searchSections.filter(s=>s.textContent.toLowerCase().includes(q));$('#searchStatus').textContent='找到 '+results.length+' 个相关章节';results.forEach(s=>{const li=document.createElement('li'),a=document.createElement('a');a.href='#'+s.id;a.textContent=s.querySelector('h2').textContent;li.append(a);out.append(li)})});
})();
