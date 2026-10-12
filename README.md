# 基督教古典教育｜从圣约到课堂

《基督教古典教育》（2018年第二次修订版）原创深度导读，2026-10-12 v2。
以王怡、苏炳森等人的文集为入口，区分原书观点、历史事实与欧陆改革宗评析。
不含66卷圣经逐卷课程，不转载原著全文。

## 访问地址

- GitHub Pages：https://07-je-gt-love-personal-20260918.github.io/cce-reformed-study-20261012-v1/
- Surge：https://cce-reformed-study-20261012-v1.surge.sh/
- Vercel：https://cce-reformed-study-20261012-v1.vercel.app/
- 源码仓库：https://github.com/07-Je-GT-Love-Personal-20260918/cce-reformed-study-20261012-v1

部署状态以实际访问结果为准。

## 内容与功能

19个区段、31项主题书目，16个年代节点，10个地理位置，12道附分析的讨论题。
包括原书导航、故事线、诸王辨析、圣经与圣约神学、六份认信对照、三艺七艺、家庭课堂实践、办学判断与来源。
四级目录可隐藏及调整深度、书名作者搜索、中文版本筛选、四步读书动画、章节搜索、年代筛选与播放、地图节点、回忆卡、答案切换、深浅主题、字号调整。
正文默认展开；主文件包含全部CSS、JavaScript与SVG，离线可阅读，查证外链需联网。

## 持续修改

Python 3标准库即可构建，无第三方构建依赖：

```sh
python3 build.py
```

- `content.py`：中文导读、讨论题、历史和地理数据。
- `books.py`：31项书目、版本证据、原创问题与评析。未核实目录不伪造；参考译名不当正式书名。
- `styles.css`：响应式样式与低动态偏好支持。
- `app.js`：客户端交互，不向服务器传送读者输入。
- `land.json`：Natural Earth公开地理数据。
- `build.py`：生成内嵌资源的完整HTML，同时更新`public/`和`docs/`。
- `public/index.html`：Vercel和Surge使用。
- `docs/index.html`：GitHub Pages使用；`docs/.nojekyll`禁用Jekyll处理。

修改后重新运行构建，再一起提交源文件和生成文件。
GitHub Pages使用main分支的/docs，推送后自动更新。
Vercel本次通过已授权API直接发布静态文件，生产站已上线。GitHub集成尚未授权此仓库，因此尚无推送自动部署；可在Vercel中补上GitHub集成，或继续从同一项目发布public目录。
Surge用已登录的CLI执行 `surge publish public cce-reformed-study-20261012-v1.surge.sh` 更新。
三个平台保持相同slug，内容更新时不要另换域名。

## 资料与验证

来源链接位于HTML中，历史节点各附独立依据。课表、案例、记忆句和教育应用是本导读原创，不能冒充原书或信条原文。
Natural Earth地图数据为public domain，地理示意不代表历史疆界。
已检查HTML锚点、重复ID、JavaScript执行，以及目录、主题、搜索、地图、时间筛选、回忆卡和答案切换。
当前执行环境没有获准使用的浏览器渲染工具，因此尚未完成真实手机/桌面截图的重叠与溢出检查。
响应式断点覆盖380、800和1150像素，并为宽表提供局部滚动。

不在源码、提交记录、网页或公开日志中保存账号密码或访问令牌。
