---
name: ucas-course-evaluation
description: Use when Codex should fully automate 中国科学院大学 or 国科大 course selection system course and teacher evaluations through an available logged-in controllable browser, including Chrome plugin control, Computer Use desktop automation, or a logged-in in-app Browser; covers discovering pending rows, selecting best objective ratings, filling Chinese subjective answers, saving/submitting forms, verifying completion, and stopping on missing browser-control capability, login, permission, captcha, or anti-automation blockers.
---

# 国科大课程评价

## Overview

Fully automate UCAS/国科大 course and teacher evaluation pages in the user's logged-in browser session. The default automation goal is to finish all pending course and teacher evaluations with highest objective ratings and concise Chinese subjective answers, then verify that no pending evaluation rows remain.

## Public-Safe Scope

- Do not include personal course IDs, teacher names, screenshots, session URLs, local file paths, extension IDs, or one-off operation logs in reusable instructions.
- Treat form field names and page wording as unstable. Discover them from the current page instead of hard-coding values from a past session.
- Do not inspect cookies, passwords, browser local storage, or unrelated tabs.
- Do not save real evaluation page content, screenshots, captcha images, or submitted results into the skill repository.

## Execution Modes

Choose the execution channel before opening forms:

1. Chrome plugin / Chrome-control: prefer this when the user has an already logged-in Chrome tab, because it can claim the existing tab and interact with form elements directly.
2. Computer Use: use this as the desktop fallback when browser plugins are unavailable or broken but a logged-in browser window is visible. Operate by visual inspection, mouse, and keyboard, then verify state after each save.
3. In-app Browser: use only if the UCAS login can be completed in that browser. Do not assume it shares the user's Chrome cookies or login state.
4. No browser-control capability: the full automation task cannot be executed. Report the missing execution channel instead of claiming completion.

## Full-Automation Workflow

1. Select an execution mode from the `Execution Modes` section and confirm a controllable logged-in evaluation page is available.
2. Claim or focus the already-open evaluation tab when available. Do not guess tab IDs; choose by visible title, URL, and recency from the browser tool's tab list, or by visual confirmation in Computer Use.
3. Read the course/teacher evaluation navigation and identify both evaluation entry points.
4. For each entry point, read the table or page body and classify rows:
   - completed rows: saved/modified/completed action state
   - pending rows: action links such as `evaluate`
5. For every pending row, open the evaluation form, fill all required objective and subjective fields, save/submit the form, and verify the returned state.
6. Continue across course and teacher evaluation pages until the current semester has no pending course or teacher evaluation rows.
7. Report a compact completion summary with counts for completed, skipped, and blocked items.

## Objective Items

Select the highest option for every objective item by default. This is usually the first/best satisfaction column or a radio value such as `5`.

Use real form interaction instead of direct DOM mutation when possible:

```js
await tab.playwright.locator('input[type="radio"][name="CURRENT_ITEM_NAME"][value="5"]').setChecked(true, {
  force: true,
  timeoutMs: 60000
});
```

Derive current radio group names from the page before filling. A robust pattern is:

1. collect unique names from visible or attached `input[type="radio"]`
2. identify the best option per group from value, column position, label, or checked-state semantics
3. set each group once
4. verify every required radio group has a selected value

Work in small chunks if the browser bridge is slow, and inspect page state before retrying after any timeout.

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

If the page has different subjective prompts, map the positive/praise template to prompts asking for likes, strengths, gains, or overall comments, and map the suggestion template to prompts asking for opinions, improvements, or suggestions.

## Text Entry Reliability

If normal textarea filling or paste-like entry fails, click the textarea and type the full Chinese string through the browser-control text input capability. Avoid per-character key presses for Chinese text because some browser bridges treat Chinese characters as invalid key names.

After typing, read the textarea values or form state to verify that required subjective fields are filled.

## Save And Completion Verification

After all required fields are filled:

1. locate the save/submit button by role, text, value, or form structure
2. click it once
3. handle ordinary confirmation dialogs if they are part of the form save flow
4. wait for navigation, modal feedback, or page text changes
5. verify success from signals such as saved status, success messages, or the row action changing from pending to completed

If a save appears to time out, inspect the current page before retrying because the action may have succeeded.

## Blockers

Stop the automation and report the blocker if any of these appear:

- login expired or permission denied
- captcha or other human-verification challenge
- anti-automation interstitial
- no Chrome plugin, Computer Use, in-app Browser, or equivalent browser-control tool is available
- ambiguous duplicate target rows that cannot be safely distinguished
- form validation failure with no discoverable missing field

Do not bypass, solve, or automate around captchas or other human-verification challenges.

## Troubleshooting

- UCAS pages and browser-control plugins can be slow; use generous timeouts such as `60000` to `120000` ms.
- Browser telemetry or network timeout noise does not always mean the page action failed. Judge by returned page text and form state.
- If a command partially succeeds before timing out, inspect the page before retrying.
- Preserve the logged-in session and ignore unrelated tabs.
