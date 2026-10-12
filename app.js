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
let memoryIndex=0;function renderMemory(){const t=DATA.recall[memoryIndex];$('#memoryCount').textContent=(memoryIndex+1)+' / '+DATA.recall.length;$('#memoryQuestion').textContent=t[0];$('#memoryAnswer').textContent=t[1];$('#memoryAnswer').hidden=true;$('#revealMemory').textContent='查看答案';$('#revealMemory').setAttribute('aria-expanded','false')}
$('#revealMemory').addEventListener('click',()=>{const a=$('#memoryAnswer');a.hidden=!a.hidden;$('#revealMemory').textContent=a.hidden?'查看答案':'收起答案';$('#revealMemory').setAttribute('aria-expanded',String(!a.hidden))});
$('#nextMemory').addEventListener('click',()=>{memoryIndex=(memoryIndex+1)%DATA.recall.length;renderMemory()});$('#prevMemory').addEventListener('click',()=>{memoryIndex=(memoryIndex+DATA.recall.length-1)%DATA.recall.length;renderMemory()});$('#shuffleMemory').addEventListener('click',()=>{memoryIndex=(memoryIndex+1+Math.floor(Math.random()*(DATA.recall.length-1)))%DATA.recall.length;renderMemory()});renderMemory();
$('#answersToggle')?.addEventListener('click',()=>{const hide=$('#answersToggle').getAttribute('aria-expanded')==='true';$$('.qa-answer').forEach(x=>x.hidden=hide);$('#answersToggle').setAttribute('aria-expanded',String(!hide));$('#answersToggle').textContent=hide?'展开全部答案':'暂藏答案，先自行思考'});
const learnTexts=['定位：说出作者、地域、原作年和中译年。将一本书挂在时间线上，先知道它在回应谁。','提问：先用一个问题读一章。分清作者的主张、证据与推论，把陌生词写成自己的话。','分辨：用圣经与认信审察神学主张，用历史与课堂证据审察事实判断。不要把有用的方法提升为信仰义务。','复述：合上书，用一分钟说明观点、一项保留和一个实践。明天、三天后、一周后再回忆。'];
let learnIndex=0,learnTimer=null;function learnStep(i){learnIndex=i;$$('[data-learn]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.learn)===i)));$('#learnText').textContent=learnTexts[i]}
function stopLearn(){clearInterval(learnTimer);learnTimer=null;$('#learnPlay').textContent='▶ 播放记忆路径';$('#learnPlay').setAttribute('aria-pressed','false')}
$$('[data-learn]').forEach(b=>b.addEventListener('click',()=>{stopLearn();learnStep(Number(b.dataset.learn))}));
$('#learnPlay').addEventListener('click',()=>{if(learnTimer){stopLearn();return}learnStep(0);$('#learnPlay').textContent='Ⅱ 暂停';$('#learnPlay').setAttribute('aria-pressed','true');learnTimer=setInterval(()=>{if(learnIndex===3){stopLearn();return}learnStep(learnIndex+1)},5000)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopLearn()});
const searchSections=sections.filter(s=>s.id!=='reading'&&s.id!=='sources');
$('#search').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase(),out=$('#searchResults');out.replaceChildren();if(q.length<1){$('#searchStatus').textContent='输入关键词，如“三艺”“课程”“恩典”。';return}const results=searchSections.filter(s=>s.textContent.toLowerCase().includes(q));$('#searchStatus').textContent='找到 '+results.length+' 个相关章节';results.forEach(s=>{const li=document.createElement('li'),a=document.createElement('a');a.href='#'+s.id;a.textContent=s.querySelector('h2').textContent;li.append(a);out.append(li)})});
let treeIndex=0,treeTimer=null;
function treeStep(i){treeIndex=i;$$('[data-tree]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.tree)===i)));$('#treeDetail').textContent=DATA.tree[i][3]}
function stopTree(){clearInterval(treeTimer);treeTimer=null;$('#treePlay').textContent='▶ 沿树读一遍';$('#treePlay').setAttribute('aria-pressed','false')}
$$('[data-tree]').forEach(b=>b.addEventListener('click',()=>{stopTree();treeStep(Number(b.dataset.tree))}));
$('#treePlay').addEventListener('click',()=>{if(treeTimer){stopTree();return}treeStep(0);$('#treePlay').textContent='Ⅱ 暂停';$('#treePlay').setAttribute('aria-pressed','true');treeTimer=setInterval(()=>{if(treeIndex>=DATA.tree.length-1){stopTree();return}treeStep(treeIndex+1)},5000)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTree()});
$('#latAnswers').addEventListener('click',()=>{const hide=$('#latAnswers').getAttribute('aria-expanded')==='true';$$('.lat-answer').forEach(p=>p.hidden=hide);$('#latAnswers').setAttribute('aria-expanded',String(!hide));$('#latAnswers').textContent=hide?'展开本书讨论答案':'暂藏本书讨论答案'});
})();
