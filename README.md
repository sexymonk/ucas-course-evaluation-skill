# 国科大课程评价

一个用于国科大/中国科学院大学课程评价和教师评价的全自动 Codex skill。它面向浏览器中已登录的评教页面，自动识别待评价课程和教师，自动选择最高客观评价，自动填写中文主观题，自动保存/提交，并自动检查结果状态。

## 脱敏说明

本仓库不包含：

- 个人账号、登录态、Cookie、验证码或截图
- 具体课程编号、教师姓名、一次性评教链接
- 本机插件路径、扩展 ID 或历史操作日志
- 某次页面里观察到的固定表单项清单

表单字段、按钮文案和页面结构可能变化，实际使用时应从当前页面动态读取。

## 目录结构

```text
.
├── README.md
└── skills/
    └── ucas-course-evaluation/
        ├── SKILL.md
        └── agents/
            └── openai.yaml
```

这种结构适合把单个 skill 放进独立仓库发布，也方便以后扩展多个 skills。

## 安装

把 `skills/ucas-course-evaluation` 安装到你的 Codex skills 目录。

Windows 示例：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex\skills" | Out-Null
Copy-Item -Recurse -Force ".\skills\ucas-course-evaluation" "$env:USERPROFILE\.codex\skills\ucas-course-evaluation"
```

macOS/Linux 示例：

```bash
mkdir -p ~/.codex/skills
cp -R skills/ucas-course-evaluation ~/.codex/skills/
```

如果 Codex 已经运行，重启或刷新 skills 后再使用。

## 使用示例

全自动课程和教师评价：

```text
使用 $ucas-course-evaluation，全自动完成国科大课程评价和教师评价，都给最高评价，主观题用中文。
```

只处理当前打开的评教页：

```text
使用 $ucas-course-evaluation，处理当前浏览器里的国科大评教页面，待评价的课程和教师全部自动完成。
```

## 任务执行方式

这个 skill 的全自动能力依赖一个可控且已登录的浏览器执行通道：

- Chrome 插件：优先使用。适合接管用户已经登录的 Chrome 评教标签页，稳定性最好。
- Computer Use：Chrome 插件不可用时可作为桌面自动化兜底，通过视觉、鼠标和键盘操作已打开的浏览器页面，速度和稳定性通常弱于 Chrome 插件。
- in-app Browser：只有在该浏览器里能够完成国科大登录并进入评教系统时可用，不能直接复用用户 Chrome 的登录态。
- 无浏览器控制能力：不能执行全自动网页评价任务，应报告缺少执行通道。

## 自动化策略

- 自动接管已登录浏览器中的国科大评教页面。
- 自动识别待评价课程、待评价教师和已完成项目。
- 自动跳过已经完成的评价行。
- 自动为客观题选择最高评价。
- 自动为主观题填写简洁、积极、中文评价。
- 自动点击保存/提交按钮。
- 自动读取保存后的页面状态，确认待评价行是否变为已完成。
- 自动处理课程评价和教师评价两个入口，直到没有待评价项目。

## 自动化边界

- 不读取 Cookie、密码、浏览器本地存储或无关标签页。
- 不覆盖已经显示为已保存或已修改的评价行，除非用户明确要求重新修改。
- 不绕过、不识别、不自动提交验证码或其他人机验证；出现这类校验时判定为自动化阻塞并停止。
- 不保存真实页面内容、截图或评教结果到仓库。
- 没有 Chrome 插件、Computer Use 或可登录的 in-app Browser 时，不能声称已经完成网页自动化。

## 维护建议

- 页面字段变化时，优先更新 `SKILL.md` 中的动态识别策略，不要记录个人化字段值。
- 如果加入脚本，保持脚本只处理当前浏览器页面，不落盘保存个人评教数据。
- 如果站点新增人机验证，不应加入绕过逻辑，应把它作为自动化阻塞条件处理。
