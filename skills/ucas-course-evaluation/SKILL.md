---
name: ucas-course-evaluation
description: Use when Codex helps with 中国科学院大学 or 国科大 course selection system course/teacher evaluations, including browser-assisted form filling, Chinese subjective-answer wording, preserving completed rows, selecting best objective ratings only when explicitly requested, and stopping safely for captcha or final user submission.
---

# 国科大课程评价

## Overview

Assist with UCAS/国科大 course or teacher evaluation pages in the user's logged-in browser session. Keep the workflow privacy-preserving and reviewable: do not store account data, do not inspect cookies or passwords, and leave captcha/final submission to the user unless the user clearly asks for a permitted browser action.

## Public-Safe Scope

- Do not include personal course IDs, teacher names, screenshots, session URLs, local file paths, extension IDs, or one-off operation logs in reusable instructions.
- Treat form field names and page wording as unstable. Discover them from the current page instead of hard-coding values from a past session.
- If the user says they already edited or submitted a row manually, do not revisit that row.
- If the user only wants wording, stop browser automation and provide copyable Chinese text.

## Workflow

1. Use the available browser or Chrome-control capability for authenticated pages because the session usually depends on the user's browser login.
2. Prefer claiming an already-open evaluation tab. Do not guess tab IDs; choose by visible title, URL, and recency from the browser tool's tab list.
3. Read the table or page body before acting. Treat saved/modified rows as completed and action links such as `evaluate` as pending.
4. Fill only the requested pending course or teacher form.
5. Re-read the page after each save attempt to confirm whether the row changed to a completed state.

## Objective Items

When the user explicitly asks for the best evaluation, select the highest option for every objective item, usually the first/best satisfaction column or a radio value such as `5`.

Use real form interaction instead of direct DOM mutation when possible:

```js
await tab.playwright.locator('input[type="radio"][name="CURRENT_ITEM_NAME"][value="5"]').setChecked(true, {
  force: true,
  timeoutMs: 60000
});
```

Derive current radio group names from the page. Work in small chunks if the browser bridge is slow, and inspect page state before retrying after any timeout.

## Subjective Answers

Use Chinese by default. Keep text positive, concise, and suitable for required fields. Do not invent detailed facts that the user did not provide.

Teacher praise:

```text
老师授课认真负责，讲解清晰，能够结合课程内容进行启发式讲授，课堂效果很好。
```

Teacher suggestion:

```text
暂无明显建议，整体教学安排合理，内容充实，学习收获较大。
```

Course praise:

```text
课程内容充实，重点清晰，理论与应用结合较好，对理解相关知识帮助很大。
```

Course suggestion:

```text
暂无明显建议，整体课程安排合理，学习收获较大。
```

## Text Entry Reliability

If normal textarea filling or paste-like entry fails, click the textarea and type the full Chinese string through the browser-control text input capability. Avoid per-character key presses for Chinese text because some browser bridges treat Chinese characters as invalid key names.

After typing, read the textarea values or page text if verification is needed.

## Captcha And Submit Boundary

Do not bypass, solve, or automate around captchas. When a captcha appears, leave the page ready and ask the user to enter it or finish submission.

Before any final save/submit action, verify with the user if there is ambiguity about the target row, the subjective-answer language, or whether the user wants browser automation to continue. Never overwrite completed rows unless the user explicitly requests a modification.

## Troubleshooting

- UCAS pages and browser-control plugins can be slow; use generous timeouts such as `60000` to `120000` ms.
- Browser telemetry or network timeout noise does not always mean the page action failed. Judge by returned page text and form state.
- If a command partially succeeds before timing out, inspect the page before retrying.
- Preserve the logged-in session and ignore unrelated tabs.
