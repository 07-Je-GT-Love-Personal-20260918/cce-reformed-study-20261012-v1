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
function tocEntry(id,title,path){const a=document.createElement('a'),n=document.createElement('span'),t=document.createElement('span');a.href='#'+id;a.dataset.number=path;a.dataset.depth=String(path.split('.').length);if(a.dataset.depth!=='1')a.className='sub depth-'+a.dataset.depth;n.className='toc-number';n.textContent=path;t.className='toc-text';t.textContent=title;a.append(n,t);nav.append(a)}
sections.forEach((s,index)=>{const root=String(index+1),stack=[{level:2,path:root,children:0}];tocEntry(s.id,s.querySelector('h2').textContent,root);s.querySelectorAll('h3,h4,h5').forEach((h,i)=>{if(h.closest('.time-card,.qa,.source-list,.place-info,.chapter-group'))return;const level=Number(h.tagName.slice(1));while(stack.length>1&&stack.at(-1).level>=level)stack.pop();const parent=stack.at(-1),path=parent.path+'.'+(++parent.children);stack.push({level,path,children:0});h.id=h.id||s.id+'-sub-'+i;tocEntry(h.id,h.textContent,path);const badge=document.createElement('span');badge.className='heading-number';badge.textContent=path+' ';h.prepend(badge)})});
const tocLinks=$$('#toc a'),collapsed=new Set();
for(const a of tocLinks){const row=document.createElement('div');row.className='toc-row';a.before(row);row.append(a);const path=a.dataset.number,children=tocLinks.filter(x=>x.dataset.number.startsWith(path+'.'));if(children.length){const b=document.createElement('button');b.className='toc-fold';b.dataset.branch=path;b.textContent='▾';b.setAttribute('aria-expanded','true');b.setAttribute('aria-label','折叠 '+a.textContent);b.addEventListener('click',()=>{collapsed.has(path)?collapsed.delete(path):collapsed.add(path);renderToc()});row.append(b)}}
function renderToc(){const depth=Number($('#tocDepth').value);for(const a of tocLinks){const path=a.dataset.number,hide=Number(a.dataset.depth)>depth||[...collapsed].some(p=>path.startsWith(p+'.'));a.hidden=hide;a.parentElement.hidden=hide}$$('.toc-fold').forEach(b=>{const shut=collapsed.has(b.dataset.branch);b.textContent=shut?'▸':'▾';b.setAttribute('aria-expanded',String(!shut));b.setAttribute('aria-label',(shut?'展开 ':'折叠 ')+b.previousElementSibling.textContent)})}
$('#tocDepth').addEventListener('change',renderToc);
$('#tocCollapse').addEventListener('click',()=>{$$('.toc-fold').forEach(b=>{if(b.dataset.branch.includes('.'))collapsed.add(b.dataset.branch)});renderToc()});
$('#tocExpand').addEventListener('click',()=>{collapsed.clear();$('#tocDepth').value='4';renderToc()});
function headerVisible(show){document.body.classList.toggle('header-hidden',!show);$('#pageHeader').hidden=!show;$('#headerShow').hidden=show;save('cce-header-hidden',String(!show));window.requestAnimationFrame(()=>measureHeader())}
function measureHeader(){document.documentElement.style.setProperty('--header-height',document.body.classList.contains('header-hidden')?'0px':$('#pageHeader').getBoundingClientRect().height+'px')}
$('#headerHide').addEventListener('click',()=>{headerVisible(false);$('#headerShow').focus()});$('#headerShow').addEventListener('click',()=>{headerVisible(true);$('#headerHide').focus()});
const grip=$('#tocResize');let dragging=false;
function maxWidth(){return Math.max(220,Math.min(520,window.innerWidth-(mobile.matches?28:360)))}
function setWidth(value){const width=Math.max(220,Math.min(maxWidth(),value));document.documentElement.style.setProperty('--nav',width+'px');grip.setAttribute('aria-valuenow',String(Math.round(width)));grip.setAttribute('aria-valuemax',String(maxWidth()));save('cce-nav-width',String(width))}
setWidth(Number(read('cce-nav-width'))||265);
grip.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;grip.setPointerCapture(e.pointerId);document.body.classList.add('resizing');e.preventDefault()});grip.addEventListener('pointermove',e=>{if(dragging)setWidth(e.clientX)});
function stopResize(){dragging=false;document.body.classList.remove('resizing')}
grip.addEventListener('pointerup',stopResize);grip.addEventListener('pointercancel',stopResize);grip.addEventListener('lostpointercapture',stopResize);
grip.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();setWidth(e.key==='Home'?220:e.key==='End'?maxWidth():Number(grip.getAttribute('aria-valuenow'))+(e.key==='ArrowRight'?20:-20))});
window.addEventListener('resize',()=>{setWidth(Number(grip.getAttribute('aria-valuenow')));measureHeader()});
if('ResizeObserver'in window)new ResizeObserver(measureHeader).observe($('#pageHeader'));
headerVisible(read('cce-header-hidden')!=='true');
const bookCards=$$('.book-card');
function filterBooks(){const q=$('#bookSearch').value.trim().toLowerCase(),lang=$('#bookLanguage').value;bookCards.forEach(c=>c.hidden=!(c.textContent.toLowerCase().includes(q)&&(lang==='all'||c.dataset.cn===lang)));$$('.book-category').forEach(c=>c.hidden=!Array.from(c.querySelectorAll('.book-card')).some(b=>!b.hidden));$('#bookStatus').textContent='显示 '+bookCards.filter(c=>!c.hidden).length+' / '+bookCards.length+' 项书目。';}
function resetBooks(){$('#bookSearch').value='';$('#bookLanguage').value='all';filterBooks()}
$('#bookSearch').addEventListener('input',filterBooks);$('#bookLanguage').addEventListener('change',filterBooks);$('#bookReset').addEventListener('click',resetBooks);resetBooks();
nav.addEventListener('click',e=>{const a=e.target.closest('a');if(a){const t=document.getElementById(a.getAttribute('href').slice(1));if(t&&t.closest('.book-category'))resetBooks()}});
nav.addEventListener('click',e=>{if(e.target.closest('a')&&mobile.matches)toc(false)});
const links=$$('#toc a:not(.sub)');
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
$$('[data-relation]').forEach(b=>b.addEventListener('click',()=>{$$('[data-relation]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#relationDetail').textContent=DATA.relations[Number(b.dataset.relation)][3]}));
$$('[data-art]').forEach(b=>b.addEventListener('click',()=>{$$('[data-art]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const a=DATA.arts[Number(b.dataset.art)];$('#artTitle').textContent=a[1];$('#artDetail').textContent=a[2]}));
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
$('#stringLength').addEventListener('input',e=>{const length=Number(e.target.value);$('#lengthOutput').textContent=String(length);$('#lengthRatio').textContent=(length/100).toFixed(2);$('#frequencyRatio').textContent=(100/length).toFixed(2);$('#stringLine').style.width=length+'%';$('#stringExplanation').textContent='相对弦长'+length+'：基频为参考值的'+(100/length).toFixed(2)+'倍。条件：张力与线密度不变。'});
function stopString(){$('#stringLine').classList.remove('is-playing');$('#stringMotion').setAttribute('aria-pressed','false');$('#stringMotion').textContent=reduced.matches?'已按系统偏好减少动态':'▶ 播放波动示意'}
$('#stringMotion').addEventListener('click',()=>{if(reduced.matches||$('#stringLine').classList.contains('is-playing')){stopString();return}$('#stringLine').classList.add('is-playing');$('#stringMotion').setAttribute('aria-pressed','true');$('#stringMotion').textContent='Ⅱ 暂停波动示意'});
let cycleIndex=0,cycleTimer=null;
function cycleStep(i){cycleIndex=i;$$('[data-cycle]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.cycle)===i)));$$('[data-cycle-card]').forEach(c=>c.classList.toggle('is-active',Number(c.dataset.cycleCard)===i));$('#cycleStatus').textContent='第'+(i+1)+'步：'+DATA.cycle[i][0]+'。'+DATA.cycle[i][1]}
function stopCycle(){clearInterval(cycleTimer);cycleTimer=null;$('#cyclePlay').textContent='▶ 播放一轮';$('#cyclePlay').setAttribute('aria-pressed','false')}
$$('[data-cycle]').forEach(b=>b.addEventListener('click',()=>{stopCycle();cycleStep(Number(b.dataset.cycle))}));
$('#cyclePlay').addEventListener('click',()=>{if(cycleTimer){stopCycle();return}cycleStep(0);$('#cyclePlay').textContent='Ⅱ 暂停';$('#cyclePlay').setAttribute('aria-pressed','true');cycleTimer=setInterval(()=>{if(cycleIndex===3){stopCycle();$('#cycleStatus').textContent='一轮完成：根据反馈修订下一轮目标。';return}cycleStep(cycleIndex+1)},5000)});
cycleStep(0);if(reduced.matches)stopString();
reduced.addEventListener?.('change',()=>{if(reduced.matches)stopString()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopCycle();stopString()}});
let pathIndex=0,pathTimer=null;
const pathNames=['定向：为何学习？','参与：怎样进入？','辨明：怎样判断？','承担：怎样生活？'];
function pathStep(i){pathIndex=i;$$('[data-path-card]').forEach(c=>c.classList.toggle('is-active',Number(c.dataset.pathCard)===i));$$('[data-path]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.path)===i)));$('#pathStatus').textContent=pathNames[i]}
function stopPath(){clearInterval(pathTimer);pathTimer=null;$('#memoryPath').classList.remove('playing');$('#pathPlay').textContent='▶ 播放四问';$('#pathPlay').setAttribute('aria-pressed','false')}
$$('[data-path]').forEach(b=>b.addEventListener('click',()=>{stopPath();pathStep(Number(b.dataset.path))}));
$('#pathPlay').addEventListener('click',()=>{if(pathTimer){stopPath();return}pathStep(0);$('#memoryPath').classList.add('playing');$('#pathPlay').textContent='Ⅱ 暂停';$('#pathPlay').setAttribute('aria-pressed','true');pathTimer=setInterval(()=>{if(pathIndex===3){stopPath();$('#pathStatus').textContent='一轮完成。暂藏提示，举例复述四问。';return}pathStep(pathIndex+1)},5000)});
$('#pathRecall').addEventListener('click',()=>{const hide=$('#pathRecall').getAttribute('aria-expanded')==='true';$$('.path-hint').forEach(p=>p.hidden=hide);$('#pathRecall').setAttribute('aria-expanded',String(!hide));$('#pathRecall').textContent=hide?'显示提示，核对理解':'暂藏提示，自行复述'});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPath()});pathStep(0);
})();
