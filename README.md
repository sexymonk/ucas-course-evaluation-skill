# 国科大课程评价

一个用于国科大/中国科学院大学课程评价和教师评价流程的 Codex skill。它面向浏览器中已登录的评教页面，帮助识别待评价行、填写中文主观题、在用户明确要求时选择最高客观评价，并在验证码和最终提交前停下交给用户确认。

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

把 `skills/ucas-course-evaluation` 复制到你的 Codex skills 目录。

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

只要中文文本：

```text
使用 $ucas-course-evaluation，给我两段教师评价中文主观题，我自己复制粘贴。
```

浏览器辅助填写：

```text
使用 $ucas-course-evaluation，帮我处理国科大教师评价页面。客观题按最高评价，主观题用中文，验证码和最终提交我自己来。
```

课程评价文本：

```text
使用 $ucas-course-evaluation，给我课程评价的中文优点评价和建议，语气简洁积极。
```

## 行为边界

- 不绕过、不识别、不自动提交验证码。
- 不读取 Cookie、密码、浏览器本地存储或无关标签页。
- 不覆盖已经显示为已保存或已修改的评价行，除非用户明确要求修改。
- 不默认选择最高评分；只有用户明确要求“最高评价/最佳评价”时才这样做。
- 最终提交前如目标行、语言或提交意图不明确，应先确认。

## 维护建议

- 页面字段变化时，优先更新 `SKILL.md` 中的动态识别策略，不要记录个人化字段值。
- 如果只需文本生成，保持 skill 不依赖浏览器工具。
- 如果加入脚本，避免保存真实页面内容或评教结果。
