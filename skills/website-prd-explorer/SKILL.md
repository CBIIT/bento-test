---
name: website-prd-explorer
description: Use this skill when asked to explore, QA, smoke-test, analyze, or generate product requirements and test cases for a website using Playwright MCP. The skill navigates a provided URL, identifies core user flows, records UI interactions and Playwright locators, infers functional requirements, and produces a professional Markdown PRD with test coverage.
---

# Website Exploration for Product Requirements

Explore a website using Playwright MCP and generate a professional Product Requirements Document (PRD) in Markdown.

Use the uploaded `product-requirements` skill as the reference style for PRD structure, quality, and completeness. :contentReference[oaicite:0]{index=0}

## Goal

Act as a Product Owner and QA analyst. Explore the website, understand its core behavior, identify product requirements from observed functionality, and produce a clear PRD that can be handed off to product, design, engineering, or QA.

## Inputs

- Target website URL, required.
- Optional focus area, such as login, onboarding, search, checkout, dashboard, settings, forms, profile, admin, or accessibility.
- Optional credentials or test data, if needed for authenticated flows.

If no URL is provided, ask the user to provide one.

If authentication is required and credentials are not provided, explore only public flows and clearly document the limitation.

## Workflow

1. Open the provided URL using Playwright MCP.
2. Observe the website structure, navigation, page purpose, visible CTAs, forms, menus, and key UI regions.
3. Identify 3-5 meaningful user flows. Prefer high-value flows such as:
   - landing page navigation
   - sign up or login
   - search or filtering
   - form submission
   - checkout, booking, or conversion flow
   - dashboard or account management
   - settings or profile management
4. For each flow:
   - interact with the UI as a real user would
   - document the user goal
   - record the steps performed
   - capture important UI elements
   - record stable Playwright locators when available
   - document expected behavior
   - document observed behavior
   - note bugs, confusing UX, missing validation, broken links, accessibility concerns, or unclear states
5. Infer product requirements from the observed behavior.
6. Convert explored behavior into user stories and acceptance criteria.
7. Propose test cases for happy paths, negative paths, edge cases, validation, and accessibility where relevant.
8. Close the browser context after exploration.
9. Generate the final PRD in Markdown.

## Locator Guidance

Prefer stable Playwright locators in this order:

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`
6. CSS selectors only when no stable semantic locator exists

Avoid brittle selectors based on layout, generated class names, or deep DOM structure unless unavoidable.

## Output Format

Generate the final answer as a Markdown PRD using this structure:

# Product Requirements Document: Website Exploration Findings

**Version**: 1.0  
**Date**: [YYYY-MM-DD]  
**Website URL**: [URL]  
**Author**: Product Owner / QA Analyst  

---

## Executive Summary

Summarize the website purpose, primary user value, explored areas, and overall findings.

Include:
- what the website appears to do
- who the likely users are
- which core flows were explored
- major product or QA observations

---

## Product Context

### Current Experience

Describe the current website behavior based on exploration.

### Product Goals

List inferred goals of the website or feature set.

### Exploration Scope

List the areas explored.

### Limitations

Mention blocked flows, missing credentials, unavailable pages, incomplete data, or assumptions.

---

## Core User Flows

For each explored flow, use this format:

### Flow 1: [Flow Name]

**User Goal**:  
[What the user is trying to accomplish]

**Steps Explored**:

1. [Step]
2. [Step]
3. [Step]

**Key UI Elements and Locators**:

| UI Element | Purpose | Suggested Playwright Locator |
|---|---|---|
| [Element] | [Purpose] | `[locator]` |

**Expected Behavior**:  
[What should happen]

**Observed Behavior**:  
[What actually happened]

**Issues / Risks**:
- [Issue or risk]

---

## Functional Requirements

List requirements inferred from the website behavior.

Use this format:

- **REQ-001**: The user should be able to [action] so that [outcome].
- **REQ-002**: The system should [behavior] when [condition].
- **REQ-003**: The interface should [requirement] to support [user need].

---

## User Stories & Acceptance Criteria

### Story 1: [Story Title]

**As a** [user/persona]  
**I want to** [action]  
**So that** [benefit]

**Acceptance Criteria**:
- [ ] [Specific, testable criterion]
- [ ] [Happy path criterion]
- [ ] [Edge case or validation criterion]

Repeat for 3-5 core stories.

---

## Edge Cases and Error Handling

Document negative paths, boundary cases, validation states, and empty states.

Examples:
- Required fields submitted empty
- Invalid login credentials
- Search with no results
- Broken or unavailable links
- Slow-loading pages
- Missing permissions
- Empty dashboard states
- Mobile or responsive behavior issues

---

## Test Cases

| ID | Requirement | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-001 | REQ-001 | [Scenario] | 1. [Step] 2. [Step] | [Expected result] | High |

Include:
- happy-path tests
- negative tests
- validation tests
- navigation tests
- accessibility or usability checks when relevant

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| [Risk] | High/Medium/Low | High/Medium/Low | [Mitigation] |

---

## Open Questions

List unknowns, assumptions, unclear behaviors, missing credentials, or questions for product/design/engineering.

---

## Recommendations

Summarize recommended improvements for:

- product functionality
- UX clarity
- reliability
- accessibility
- test coverage
- locator/testability improvements

---

## Completion Requirements

Before finishing:

- Explore 3-5 core flows when possible.
- Include expected and observed outcomes.
- Include key UI elements and locators.
- Include inferred functional requirements.
- Include user stories and acceptance criteria.
- Include test cases.
- Include risks, open questions, and recommendations.
- Clearly state any blocked flows or limitations.
- Close the browser context.