"""Original conceptual explanations and accessible, self-contained learning visuals."""
from lat import table

RELATIONS = [
('方向','敬虔与神学','我向谁负责，凭什么判断？','敬虔关乎人实际的归属、爱与敬畏；神学关乎按照启示认识上帝及其作为。两者互相联系，却不是同一件事。正确术语可以被虚假地使用，真诚热情也可能需要纠正。'),
('参与','体育与乐教','身体和情感怎样参与认识？','学习并非只有概念处理。行动、节奏、注意、故事与审美，使学习者真实参与；但体验的强烈程度不是真理的尺度。好的参与要能够接受解释、证据和伦理判断的纠正。'),
('工具','三艺与四艺','怎样使理解更准确、更可检验？','语言使意义可以陈述与讨论，数量使关系可以比较、推演与测量。工具提高认识的可靠性，不自动规定使用工具的善恶目的。会证明与愿意诚实，相关却不相同。'),
('整合','哲学与呼召','知识彼此有什么关系，怎样进入生活？','哲学追问对象、原因、善与目的；呼召使学习面对具体责任。整合不是给各科套一层相同术语，而是说明不同认识怎样共同帮助人更真实、更公义地行动。')]

def relation_visual():
    s='<h3>关系图：四类问题，共同贯穿学习</h3><p>以下是本站为理解本书而归纳的四类问题，不是作者另列的四阶段。它们同时参与教育；点击任一节点，查看区别与联系。</p><div class="relation-grid" role="group" aria-label="教育关系的四类问题">'
    for i,(label,parts,q,detail) in enumerate(RELATIONS):
        s+=f'<button class="relation-node" data-relation="{i}" aria-pressed="{str(i==0).lower()}"><span class="visual-kicker">{i+1:02} · {label}</span><b>{parts}</b><span>{q}</span></button>'
    s+='</div><p class="visual-detail" id="relationDetail" aria-live="polite">'+RELATIONS[0][3]+'</p>'
    s+='<h3>三种关系，不要画成同一种箭头</h3>'+table(['关系','例子','不能误解成'],[
    ('支持关系','充足休息与注意力，可以支持阅读。','休息充分就必然理解正确。'),
    ('规范关系','诚实要求我们报告不符合预期的数据。','诚实本身会告诉我们实验数值。'),
    ('发展关系','反复解释理由，使表达逐步精确。','到了某个年龄便自然获得推理能力。')])
    s+='<p>树图的力量在于提醒各部分相联，局限在于容易让人想象出必然向上的成长。教学中应保留失败、修订、差异与恩典：根基需要不断滋养，成熟不沿统一速度发生，学习成果也不是救恩保证。</p>'
    return s

ART_STEPS=[
('文法','把对象说清楚','先分清音高、响度、时值、频率与弦长。若把“声音更高”误说成“声音更响”，后面的推理就会在不同问题之间滑动。'),
('逻辑','把条件说完整','提出假设：在张力和线密度相同、采用理想弦模型时，弦长越短，基频越高。条件不是小字附注，而是判断能否成立的一部分。'),
('修辞','向听者说明理由','向同学解释为什么缩短弦长会改变音高，并说明这是模型内的关系。避免只用“很明显”代替理由。'),
('算术','比较数量比例','若参考弦长为100，缩短到50，相对基频为2；缩短到75，相对基频为4/3。长度比与频率比方向相反。'),
('几何','在长度中看见关系','用等长线段分割、比较一半与四分之三；让分数不只停留在符号里。图形呈现关系，但图形本身不证明全部物理条件。'),
('天文','比较模型与观测的方法','这里借用的是观测、数量与模型之间的思考方式，不把弦实验冒称天文学内容。若要真正加入天文，应另设天体现象的观测任务。'),
('音乐','让比例回到聆听','比较同音与八度等关系，把数量理解与听觉经验对照。模型不包含音色、演奏技巧与全部审美判断；懂比例也不能代替共同演唱。')]

def arts_visual():
    s='<h3>互动实验：弦长改变，频率怎样改变</h3><p>这是理想弦模型的学习示意：假定张力与线密度不变，基频与弦长成反比。拖动滑块，比较两个量。页面不播放声音；图中波动是定性的动态提示，动画速度不代表真实声频。</p>'
    s+='''<div class="string-lab"><label for="stringLength">相对弦长：<output id="lengthOutput" for="stringLength">100</output></label><input id="stringLength" type="range" min="25" max="100" value="100" step="1"><div class="string-stage"><div id="stringLine" class="string-line"><span></span></div></div><div class="ratio-results"><div><small>弦长比 L / L₀</small><strong id="lengthRatio">1.00</strong></div><div><small>基频比 f / f₀</small><strong id="frequencyRatio">1.00</strong></div><div><small>模型关系</small><strong>f / f₀ = L₀ / L</strong></div></div><p id="stringExplanation" aria-live="polite">参考长度100：相对基频为1。</p><button id="stringMotion" aria-pressed="false">▶ 播放波动示意</button></div>'''
    s+='<h3>同一任务怎样联系七艺：逐项检验，不强行凑齐</h3><p>以声音任务作演示。七艺有各自的对象，跨学科不是让所有科目都出场；下例尤其标明天文联系的限度。</p><div class="arts-switches" role="group" aria-label="选择自由技艺">'
    for i,(name,title,detail) in enumerate(ART_STEPS):s+=f'<button data-art="{i}" aria-pressed="{str(i==0).lower()}">{i+1} · {name}</button>'
    s+='</div><div class="visual-detail" aria-live="polite"><b id="artTitle">'+ART_STEPS[0][1]+'</b><p id="artDetail">'+ART_STEPS[0][2]+'</p></div>'
    return s

CYCLE=[
('目标','学生将会做什么？','把“培养逻辑”改成“能从一段短文中指出主张与两条理由”。目标越清楚，教师越能看见需要支持的地方。'),
('任务','通过什么行动学习？','选择难度适当的文本，先示范一次，再让学生独立尝试。任务必须真正要求目标能力，不能只要求抄写结论。'),
('证据','什么显示理解发生？','观察学生选取的理由是否支持主张，是否遗漏关键条件。不要用字数、整洁度或完成速度替代理解。'),
('反馈','下一次怎样改进？','指出一条有效的理由和一个需要修订的关联，让学生改写。教师也根据共同困难调整解释与材料，再进入下一轮。')]

def cycle_visual():
    s='<h3>课程闭环：目标—任务—证据—反馈</h3><p>点击任一步，或播放一轮。四步正文始终显示，动画只提示当前关系；最后回到新的目标。</p><div class="cycle-grid">'
    for i,(name,q,detail) in enumerate(CYCLE):s+=f'<article class="cycle-card" data-cycle-card="{i}"><button data-cycle="{i}" aria-pressed="{str(i==0).lower()}"><span>{i+1:02}</span> {name}</button><b>{q}</b><p>{detail}</p></article>'
    s+='</div><div class="cycle-controls"><button id="cyclePlay" aria-pressed="false">▶ 播放一轮</button><span id="cycleStatus" aria-live="polite">第1步：目标。先说清希望学生学会什么。</span></div>'
    s+='<h3>失败也能成为证据，但不能被浪漫化</h3><p>错误使教师看见思路，却不会仅因发生就自动带来成长。有效的反馈要让学生知道错在哪里、为什么错、下一步怎样做，并有机会重新尝试。反复失败而没有支持，不叫“磨炼”；及时成功而没有理解，也不叫“掌握”。</p>'
    return s

ARGUMENT = '''<h3>用一条论证链读全书，而不只背名词</h3><ol class="argument-chain"><li><b>人不是纯粹的信息容器。</b><p>他以身体生活，在关系中学习，带着爱与惧怕作判断。教育若只看知识数量，就遗漏了学习者。</p></li><li><b>因此，认识能力不能独自承担全部教养。</b><p>准确阅读、严谨证明与清楚表达不可少，但这些能力也能被错误的爱使用。工具需要方向，方向也需要具体能力来承担。</p></li><li><b>所以，学习应在更大的生活与思想结构中展开。</b><p>本书的敬虔、体育、乐教、七艺、哲学和神学，提供检查这种广度的范式。这里的“所以”支持整体性要求，并不证明该范式是唯一可行的课程制度。</p></li><li><b>但整体框架仍然不是自动奏效的方法。</b><p>从范式走到课堂，还需要文本选择、教师能力、合适难度、反馈与资源取舍；这些决定应当接受实际学习证据的检验。</p></li><li><b>最后，教育的责任与教育的限度必须同时承认。</b><p>人应忠心教导，却不能制造恩典。这个界限不是少做事的借口，而是拒绝扮演救主、拒绝以学生表现衡量其终极价值。</p></li></ol><p class="source-note">这条论证链是本站对本书范式的原创分析，不是原书逐段摘要。其中关于课程唯一性与教育限度的判断，属于本站的改革宗辨析。</p>'''

DISTINCTIONS = '''<h3>深一层：五组词，必须同时把握联系与区别</h3>''' + table(['词组','联系','关键区别'],[
('知识与智慧','智慧需要真实知识，不能建立在任意想象上。','知识回答许多“是什么”；智慧还涉及判断何时、为何、为谁而行动。'),
('习惯与德性','稳定练习可以支持合宜行为。','行为重复不自动证明动机与目的正确；熟练欺骗也是一种习惯。'),
('权威与证据','教师的经验和职分使指导成为可能。','职分不使每个事实判断无误；成熟权威能够公开订正。'),
('兴趣与爱','兴趣可以开启注意，爱可以使人持续投入。','即时喜欢不等于对象值得追求；爱有时包含耐心完成不轻松的责任。'),
('整合与混同','不同学科可共同理解一个问题。','不同对象与方法仍有边界；神学不替代实验，实验也不能独自规定应当。')])

def enrich(items):
    items['sec-lat']['body'] += ARGUMENT
    items['lat-tree']['body'] += relation_visual()
    items['lat-part-two']['body'] += arts_visual()
    items['curriculum-design']['body'] += cycle_visual()
    items['lat-confessional']['body'] += DISTINCTIONS
