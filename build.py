from pathlib import Path
import json, html
from content import *
from books import render_books, BOOKS
from lat import LAT, TREE

ROOT=Path(__file__).resolve().parent
E=html.escape

def section(id,n,eyebrow,title,lead,body):
    return f'<section class="section" id="{id}"><div class="section-head"><div class="section-no">{n}</div><div><div class="eyebrow">{eyebrow}</div><h2>{title}</h2></div></div><p class="lead">{lead}</p><div class="body-content">{body}</div></section>'

def article(a):return section(**a)

def make_map(bounds,points,label):
    x0,x1,y0,y1=bounds;w=700;h=340
    def xy(lon,lat):return ((lon-x0)/(x1-x0)*w,(y1-lat)/(y1-y0)*h)
    pieces=[]
    land=json.loads((ROOT/'land.json').read_text())
    for f in land['features']:
        polys=f['geometry']['coordinates']
        if f['geometry']['type']=='Polygon':polys=[polys]
        for poly in polys:
            for ring in poly:
                p=[xy(*c[:2]) for c in ring]
                if not p:continue
                d='M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in p)+' Z'
                pieces.append(f'<path d="{d}" class="land"/>')
    dots=[]
    for i,p in enumerate(PLACES):
        if p[0] not in points:continue
        x,y=xy(p[2],p[3])
        dots.append(f'<g data-place="{p[0]}" role="button" tabindex="0" aria-label="{E(p[1])}"><title>{E(p[1])}</title><circle class="mapdot" cx="{x:.1f}" cy="{y:.1f}" r="10"/><text x="{x:.1f}" y="{y+4:.1f}" text-anchor="middle" fill="white" font-size="11" font-weight="bold">{i+1}</text></g>')
    return f'<svg class="geography" viewBox="0 0 {w} {h}" role="img" aria-label="{label}"><defs><clipPath id="clip-{label}"><rect width="{w}" height="{h}"/></clipPath></defs><g clip-path="url(#clip-{label})">'+''.join(pieces)+''.join(dots)+'</g></svg>'

timeline='''<div class="callout gold"><b>先背事件，不先背孤立数字</b><p>313宽容，325告白，380官方；789兴学，800加冕；1524劝官，1530劝家；1559学院，1563要理；1947讲，1948印；1981办学校，1993结协会，1994法人登记。</p></div><div class="filters" role="group" aria-label="筛选历史时期">'''
for era in ['all','帝国','中世纪','宗教改革','现代','中国实践']:
    timeline+=f'<button data-era="{era}" aria-pressed="{str(era=="all").lower()}">{"全部年代" if era=="all" else era}</button>'
timeline+='</div><div class="timeline-tools"><button id="playTimeline" aria-pressed="false">▶ 播放年代</button><small id="timelineStatus" aria-live="polite">显示16个节点；点击播放后，每4.2秒定位一个节点，可随时暂停。</small></div><div class="timeline">'
for y,cat,who,where,what,hook,url in TIMELINE:
    timeline+=f'<article class="time-card" data-category="{cat}"><div class="year">{y}<small>{cat}</small></div><div><h3>{who}</h3><small>⌖ {where}</small><p>{what}</p><p class="hook">记住：{hook}</p><a class="ref" href="{E(url)}" {"" if url.startswith("#") else "target=\"_blank\" rel=\"noopener noreferrer\""}>核对来源 ↗</a></div></article>'
timeline+='''</div><h3>几个“王”放在一张表里，就不会串线</h3><div class="tablewrap"><table><thead><tr><th>人物与身份</th><th>地域</th><th>抓住哪件事</th><th>不要混淆</th></tr></thead><tbody><tr><td>君士坦丁<br>罗马皇帝</td><td>罗马帝国</td><td>313宗教宽容；325尼西亚会议</td><td>不是380年敕令的狄奥多西。</td></tr><tr><td>狄奥多西一世<br>罗马皇帝</td><td>晚期罗马帝国</td><td>380年的官方宗教规范</td><td>不是“君士坦丁宣布国教”。</td></tr><tr><td>查理曼<br>法兰克国王／后加冕皇帝</td><td>西欧；亚琛与罗马</td><td>789整顿学校；800罗马加冕</td><td>重要驻地亚琛≠加冕地点罗马。</td></tr><tr><td>腓特烈智者<br>萨克森选侯</td><td>维滕堡</td><td>1502大学；与路德相关</td><td>他也可称Frederick III；必须加上萨克森。</td></tr><tr><td>腓特烈三世<br>普法尔茨选侯</td><td>海德堡</td><td>1563要理问答</td><td>不是保护路德的萨克森选侯；二者都不宜简称“德国国王”。</td></tr></tbody></table></div><p class="source-note">这些人物是理解公共处境的历史延伸，不表示原书以诸王为叙事中心。旧约诸王只在相关经文讨论中出现，不扩展为66卷圣经课程。</p>'''

mapbody='<div class="map-panel"><div class="maps"><figure>'+make_map((-135,125,0,70),['moscow','oxford','chengdu','jerusalem'],'世界学习节点')+'<figcaption>世界节点定位：数字对应下方地点。没有绘制思想传播路线，也不表示历史疆界。</figcaption></figure><figure>'+make_map((-12,40,28,60),['jerusalem','athens','rome','aachen','wittenberg','geneva','heidelberg','oxford'],'欧洲与东地中海放大')+'<figcaption>欧洲与东地中海放大。底图：Natural Earth，等经纬度示意，未标现代国界。</figcaption></figure></div><div class="place-options" role="group" aria-label="选择地点">'
for i,p in enumerate(PLACES):mapbody+=f'<button data-place="{p[0]}" aria-pressed="{str(i==0).lower()}">{i+1:02} {p[1]}</button>'
mapbody+='</div><div class="place-info" aria-live="polite"><h3 id="placeTitle">耶路撒冷 · 经文背景</h3><p id="placeText">'+PLACES[0][5]+'</p></div></div>'
mapbody+='''<h3>记地理，不只是记地图上的点</h3><div class="three"><article><span class="tag">希伯来与希腊</span><h3>应许与语言</h3><p>圣约记忆与群体敬拜，和希腊语的论辩、哲学资源相遇。遇见不等于混合，借用语言也不等于接受所有哲学前提。</p></article><article><span class="tag purple">拉丁与欧洲诸语言</span><h3>机构与读写</h3><p>修院、主教座堂、大学和地方教会形成不同教育空间。宗教改革强调圣经与要理的教导，母语学习与学术语言彼此配合。</p></article><article><span class="tag orange">英语与汉语</span><h3>恢复与转化</h3><p>现代美国的学校经验进入中国，需要考虑语言、家庭结构、师资和地域条件；不能只复制名称与课表。</p></article></div>'''

reading='''<div class="search-box"><label for="search" class="sr-only">搜索学习内容</label><input id="search" type="search" placeholder="搜索：三艺 / 腓特烈 / 恩典 / 纪律" autocomplete="off"></div><p id="searchStatus" class="source-note" aria-live="polite">输入关键词，如“三艺”“腓特烈”“恩典”。</p><ul id="searchResults"></ul><div class="two"><article><span class="tag">15分钟 · 抓住骨架</span><p>读“教育目的”→“故事线”→“年代记忆串”→“三艺”→任选一道讨论题。</p></article><article><span class="tag purple">4次共读 · 进入深处</span><p>第1次：目的与圣经；第2次：历史与地图；第3次：方法与文化；第4次：实践、评析和讨论。</p></article></div><h3>原书阅读导航</h3><p class="source-note">以下将相邻篇目合并为阅读单元，标题作简写；页码为原书正文的起始印刷页码，不是PDF页码。导航链接指向对应原文或原书入口。本文是原创导读与评析，不转载原书全文。</p>'''
for title,items in CHAPTERS:
    reading+=f'<div class="chapter-group"><h3>{title}</h3><div class="chapter-list">'
    for name,page,q,src in items:reading+=f'<a class="chapter-link" href="#source-{src}"><span><b>{name}</b><small>{q}</small></span><span class="page">p.{page}</span></a>'
    reading+='</div></div>'

memory='''<div class="callout"><b>用“人物—地域—事件—年份”四联记忆</b><p>只背年份容易串线。先说“萨克森—维滕堡—路德”，再补人物；先说“普法尔茨—海德堡—要理”，再补1563。每次复习都先回忆，再看答案。</p></div><div class="memory"><div class="eyebrow">年代回忆卡 <span id="memoryCount">1 / 16</span></div><p class="question" id="memoryQuestion"></p><div class="answer" id="memoryAnswer" hidden></div><div class="memory-controls"><button id="revealMemory" aria-controls="memoryAnswer" aria-expanded="false">查看答案</button><button id="prevMemory">← 上一张</button><button id="nextMemory">下一张 →</button><button id="shuffleMemory">随机一张</button></div></div><h3>把整本导读压缩为五个问题</h3><div class="week"><div><b>归属谁？</b><p>受造且需要救赎的人。</p></div><div><b>为何学？</b><p>爱神、求真、服事邻舍。</p></div><div><b>怎样学？</b><p>准确读、严谨想、诚实说。</p></div><div><b>谁来教？</b><p>家庭、教会、学校各尽其职。</p></div><div><b>如何检验？</b><p>知识、能力与爱中的真实成长。</p></div></div><p>复习节律建议：今天学完口述一次，明天再回忆，三天后用一张白纸画出主线，一周后向别人讲解。若记错，回到概念和地域关系，不要只把数字再念十遍。</p>'''

discussion='<button id="answersToggle" aria-expanded="true">暂藏答案，先自行思考</button>'
for i,(q,a,app) in enumerate(QUESTIONS):
    discussion+=f'<article class="qa"><h3>{i+1:02} · {q}</h3><div class="qa-answer"><p><b>分析：</b>{a}</p><p class="application"><b>进一步操练：</b>{app}</p></div></article>'

sources='<div class="callout gold"><b>怎样辨认本页不同层次的内容</b><p><b>延伸阅读：</b>以下含前期中文文集研究的资料，不是Clark与Jain全书的来源。<b>历史延伸：</b>时间线附事件来源。<b>神学评析与实践：</b>本导读的原创归纳与应用，不冒充作者原话或信条直接条款。</p></div><ol class="source-list">'
for id,name,desc,url in SOURCES:sources+=f'<li id="source-{id}"><b>{name}</b><p>{desc}</p><a href="{E(url)}" target="_blank" rel="noopener noreferrer">打开来源 ↗</a></li>'
sources+='''</ol><p class="source-note">历史节点另附大学、学校、协会与史料机构链接。地理底图由Natural Earth公开数据绘制：<a href="https://www.naturalearthdata.com/about/terms-of-use/">Public domain</a>。页面未收录原书PDF或大段正文。时间线是精选教育史节点，不是完整教会史；概略年代、争议与事件性质已尽量区分。资料核对：2026-10-12。</p>'''

bookart='''<svg class="hero-art" viewBox="0 0 360 360" role="img" aria-label="语言、思考、表达围绕圣言与恩典的学习图"><circle cx="180" cy="180" r="159" fill="none" stroke="#c3d9b750"/><circle cx="180" cy="180" r="127" fill="none" stroke="#c3d9b730" stroke-dasharray="3 8"/><g class="orb"><circle cx="180" cy="21" r="6" fill="#dacd96"/><circle cx="42" cy="259" r="4" fill="#a7caaa"/><circle cx="318" cy="259" r="4" fill="#b89cd7"/></g><path d="M84 123Q130 108 180 133Q230 108 276 123V248Q223 231 180 256Q133 231 84 248Z" fill="#e5e7cd"/><path d="M180 133V256" stroke="#91a68d" stroke-width="2"/><path d="M104 152L158 159M104 170L158 177M104 188L150 195M202 159L256 152M202 177L256 170M202 195L247 188" stroke="#899e84" stroke-width="3"/><rect x="127" y="218" width="106" height="30" rx="15" fill="#d4c48a"/><text x="180" y="238" font-size="12" text-anchor="middle" fill="#214b3b">圣言 · 恩典</text><text x="180" y="75" text-anchor="middle" fill="#e2e8d1" font-size="15">读得准确</text><text x="78" y="298" text-anchor="middle" fill="#e2e8d1" font-size="15">想得清楚</text><text x="280" y="298" text-anchor="middle" fill="#e2e8d1" font-size="15">说得合宜</text></svg>'''

parts=[section('reading','00','阅读路径 · 内容导航','把一本书，读成一张可使用的知识地图','正文默认展开。目录可隐藏；历史节点可筛选，讨论答案可暂藏。',reading)]
for a in ARTICLES:
    if a['id']=='biblical':
        parts.append(section('timeline','04','年代 · 人物 · 记忆','记住转折，就记住时间','从帝国处境到地方课堂：先辨事件性质，再把年份挂上去。',timeline))
        parts.append(section('geography','05','地理 · 语言 · 区域文化','把人物放回他真实生活的地方','点击地图数字或地点按钮，查看地域与教育问题的联系。',mapbody))
    parts.append(article(a))
parts += [article(a) for a in ARTICLES_MORE]
parts += [section('memory','15','主动回忆 · 长期记忆','合上答案，才开始真正记住','不求一次背完；每轮记住几个关键关系，再补充年代。',memory),section('discussion','16','共读讨论 · 答案分析','从“我赞成”，走向“我能说明为什么”','十二个问题，帮助家庭、教师和小组把阅读变成可检验的判断。',discussion),section('sources','18','来源 · 阅读边界','延伸来源与阅读边界','本书主读来源已在专题中列明。以下保留历史、认信和其他书籍的延伸资料。',sources)]
parts.insert(-1,section('book-library','17','主题书目馆 · 中文版本 · 原创评析','沿着问题，找到下一本书','31项核心与关联书目：从古代阅读传统，到现代学校实践，再回到汉语与改革宗对话。',render_books()))
# Main reading now follows Clark/Jain; retain broad historical and bibliographic extensions.
retained=[p for p in parts if any(f'id="{id}"' in p[:100] for id in ['timeline','geography','memory','book-library','sources'])]
parts=[article(a) for a in LAT]+retained
for i in range(len(parts)):
    import re
    parts[i]=re.sub(r'(<div class="section-no">).*?(</div>)',lambda m:m[1]+f'{i+1:02}'+m[2],parts[i],count=1)
searchbox='<div class="search-box"><label for="search" class="sr-only">搜索本页</label><input id="search" type="search" placeholder="搜索：诗性知识 / 七艺 / 神学 / 恩典"></div><p id="searchStatus" class="source-note" aria-live="polite"></p><ul id="searchResults"></ul>'
parts[0]=parts[0].replace('<div class="body-content">','<div class="body-content">'+searchbox,1)
TITLE='自由教育传统｜基督教古典教育哲学深读'
css=(ROOT/'styles.css').read_text();js=(ROOT/'app.js').read_text()
data=json.dumps({'places':PLACES,'timeline':TIMELINE,'tree':TREE},ensure_ascii=False).replace('</','<\\/')
output=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="《自由教育传统：基督教古典教育哲学》深读：教育之树、四部分、七艺、哲学神学、改革宗辨析与课堂案例。"><meta name="theme-color" content="#153e38"><title>{TITLE}｜2026-10-13 v3</title><style>{css}</style></head><body><a class="skip" href="#main">跳到正文</a><header class="topbar"><div class="top-inner"><a class="brand" href="#top"><span class="brand-mark">Cc</span><span><strong>基督教古典教育</strong><small>A REFORMED READING ATLAS</small></span></a><div class="toolbar"><button id="fontToggle" class="font-button" aria-label="调整正文字号">字 A+</button><button id="themeToggle">☾ 深色</button><button id="tocToggle" aria-controls="sidebar" aria-expanded="true">隐藏目录</button></div></div><div class="progress-track"><div id="progress"></div></div></header><div class="layout"><aside id="sidebar" aria-label="详细目录"><div class="toc-label">CONTENTS / 学习目录</div><label class="toc-depth-label">目录深度 <select id="tocDepth"><option value="4">四级 · 全部</option><option value="3">三级 · 到书名</option><option value="2">二级 · 到类别</option><option value="1">一级 · 大纲</option></select></label><nav id="toc"></nav><p class="source-note">17个学习区段<br>31项主题书目<br>16个年代节点<br>10个地理位置<br>10道本书讨论</p></aside><main id="main"><div class="hero" id="top"><div class="hero-grid"><div><div class="eyebrow">READ · THINK · SPEAK · LIVE</div><h1>自由教育传统<br><em>从教育之树<br>到真实课堂</em></h1><p>重点研读 Kevin Clark 与 Ravi Jain 的《自由教育传统：基督教古典教育哲学》。<br>循着敬虔、身体、乐教、七艺、哲学与神学，理解一个人如何学习、判断与服事。</p><div class="hero-links"><a href="#sec-lat">开始深入阅读 ↗</a><a href="#timeline">先理清人物与年代</a><a href="#book-library">浏览31项主题书目</a></div></div>{bookart}</div><div class="hero-meta"><span>主读：The Liberal Arts Tradition</span><span>Kevin Clark · Ravi Jain</span><span>导读更新：2026.10.13 · v3</span></div></div><div class="read-route"><span>◎ 本书框架与目录</span><span>⌖ 历史核对</span><span>◇ 改革宗评析</span><span>✦ 家庭与课堂应用</span></div><noscript><div class="callout">正文与答案均可完整阅读；搜索、目录生成、地图选择和回忆卡需要启用JavaScript。你仍可使用浏览器页面查找。</div></noscript>{''.join(parts)}<footer class="footer"><b>学习不是拥有更多答案，而是更忠实地面对真理。</b><p>原创学习导读 · 不替代原著 · 没有66卷逐卷课程 · 所有核心内容与图形均内嵌，下载后可离线阅读。来源链接需要联网。</p><p>源码：<a href="https://github.com/07-Je-GT-Love-Personal-20260918/{SLUG}">{SLUG}</a></p></footer></main></div><button id="backtop" class="backtop" aria-label="返回顶部">↑</button><script>const DATA={data};</script><script>{js}</script></body></html>'''
(ROOT/'public').mkdir(exist_ok=True)
(ROOT/'public/index.html').write_text(output)
(ROOT/'docs').mkdir(exist_ok=True)
(ROOT/'docs/index.html').write_text(output)
(ROOT/'docs/.nojekyll').touch()
print(json.dumps({'html_bytes':len(output.encode()),'sections':len(parts),'timeline':len(TIMELINE),'discussion':10},ensure_ascii=False))
