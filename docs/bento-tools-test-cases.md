# Test Cases: Bento Tools Website Core Flows

## Overview
- **Feature**: Bento clinical trial data portal (public exploration + cart + search + login entry)
- **Requirements Source**: `docs/bento-tools-prd.md`
- **Test Coverage**: Government banner, global stats, explore filtering, case/program drilldown, file cart + manifest, search, login entry, external links, breadcrumbs
- **Last Updated**: 2026-04-29

## Test Case Categories

### 1. Functional Tests
Test cases covering normal user flows and core functionality.

#### TC-F-001: Government warning banner blocks access until consent
- **Requirement**: REQ-001
- **Priority**: High
- **Preconditions**:
  - Browser session is fresh (no prior consent cookie/session)
- **Test Steps**:
  1. Open `https://bento-tools.org/#/home`.
  2. Observe initial screen.
  3. Click `Continue` on warning dialog.
- **Expected Results**:
  - Warning dialog appears before main content interaction.
  - Main page interaction is available only after consent.
  - Dialog closes after clicking `Continue`.
- **Postconditions**: User is on Home page with consent accepted for session.

#### TC-F-002: Persistent stats bar is visible and populated across key pages
- **Requirement**: REQ-002
- **Priority**: High
- **Preconditions**:
  - User has passed warning dialog
- **Test Steps**:
  1. Navigate to Home.
  2. Navigate to Explore.
  3. Navigate to Programs.
  4. Navigate to one Case detail page.
- **Expected Results**:
  - Stats bar is visible on each page.
  - Metrics include Programs, Arms, Cases, Samples, Assays, Files.
  - Counts are numeric and non-empty.
- **Postconditions**: None.

#### TC-F-003: Apply single facet filter updates charts and table
- **Requirement**: REQ-003
- **Priority**: High
- **Preconditions**:
  - User is on Explore page
- **Test Steps**:
  1. Expand `Program` facet.
  2. Select `TAILORx`.
  3. Observe chart and table areas.
- **Expected Results**:
  - Active filter is applied.
  - Visualizations refresh to filtered values.
  - Table reflects filtered dataset.
- **Postconditions**: Program filter remains active.

#### TC-F-004: Facet sections expand and collapse correctly
- **Requirement**: REQ-004
- **Priority**: Medium
- **Preconditions**:
  - User is on Explore page
- **Test Steps**:
  1. Click `Program` facet to expand.
  2. Click `Program` facet again to collapse.
  3. Repeat for `Arm` facet.
- **Expected Results**:
  - Facet content appears on expand.
  - Facet content hides on collapse.
  - Other page content remains stable.
- **Postconditions**: Facets returned to initial collapsed state.

#### TC-F-005: Active query tag appears and can be cleared
- **Requirement**: REQ-005
- **Priority**: High
- **Preconditions**:
  - Explore page loaded
- **Test Steps**:
  1. Apply one facet filter.
  2. Verify query tag content.
  3. Click `Clear Query`.
- **Expected Results**:
  - Query tag shows applied condition (e.g., `Program IS TAILORx`).
  - Clicking `Clear Query` removes the tag.
  - Dataset returns to pre-filter state.
- **Postconditions**: No active query tag.

#### TC-F-006: Filter options support sort by alphabetical/count mode
- **Requirement**: REQ-006
- **Priority**: Medium
- **Preconditions**:
  - A facet with multiple values is expanded
- **Test Steps**:
  1. Click `Sort alphabetically`.
  2. Record option order.
  3. Click `Sort by count`.
  4. Compare order.
- **Expected Results**:
  - Sort mode switches without page break.
  - Option order updates according to selected sort strategy.
- **Postconditions**: Last selected sort mode persists during session.

#### TC-F-007: Upload valid case set filters Explore table
- **Requirement**: REQ-007
- **Priority**: High
- **Preconditions**:
  - Valid case-set file exists in supported format
  - User is on Explore page
- **Test Steps**:
  1. Click `Upload Case Set`.
  2. Select valid file.
  3. Apply upload.
- **Expected Results**:
  - Upload is accepted.
  - Table shows only cases from uploaded set.
  - Related charts/stats update accordingly.
- **Postconditions**: Case-set filter state active.

#### TC-F-008: Data table tab switching among Cases/Samples/Files works
- **Requirement**: REQ-008
- **Priority**: High
- **Preconditions**:
  - Explore page loaded
- **Test Steps**:
  1. Click `Cases` tab.
  2. Click `Samples` tab.
  3. Click `Files` tab.
- **Expected Results**:
  - Each tab becomes active when clicked.
  - Corresponding table columns and row type update.
  - No stale data from previous tab remains visible.
- **Postconditions**: None.

#### TC-F-009: Case ID drilldown opens full case detail view
- **Requirement**: REQ-009
- **Priority**: High
- **Preconditions**:
  - Explore table has at least one case row
- **Test Steps**:
  1. Click a case ID link.
  2. Observe case detail sections.
- **Expected Results**:
  - Navigation to `#/case/{id}` succeeds.
  - PROGRAM, DEMOGRAPHICS, TREATMENT, FOLLOW UP sections are present.
  - Values render without missing layout blocks.
- **Postconditions**: User remains on case detail page.

#### TC-F-010: Associated files on case page are navigable
- **Requirement**: REQ-010
- **Priority**: High
- **Preconditions**:
  - Case detail page with associated files available
- **Test Steps**:
  1. Scroll to associated files table.
  2. Click file name or relevant row action.
- **Expected Results**:
  - File row metadata is visible (name/type/format/size/etc.).
  - File link/action is interactive and routes correctly.
- **Postconditions**: None.

#### TC-F-011: Add selected files to cart from table selection
- **Requirement**: REQ-011
- **Priority**: High
- **Preconditions**:
  - At least one selectable file row exists
- **Test Steps**:
  1. Select one file checkbox.
  2. Click `ADD SELECTED FILES`.
  3. Open cart page.
- **Expected Results**:
  - Header file badge increments.
  - Selected file appears in cart listing.
- **Postconditions**: Cart contains selected file.

#### TC-F-012: Add all filtered files to cart in one action
- **Requirement**: REQ-012
- **Priority**: High
- **Preconditions**:
  - Explore filters applied to a known subset
- **Test Steps**:
  1. Click `ADD ALL FILES`.
  2. Open cart page.
- **Expected Results**:
  - All files in current filtered scope are added.
  - Cart count reflects expected total.
- **Postconditions**: Cart populated with filtered set.

#### TC-F-013: Cart page displays full selected-file metadata
- **Requirement**: REQ-013
- **Priority**: High
- **Preconditions**:
  - Cart contains at least one file
- **Test Steps**:
  1. Navigate to `#/fileCentricCart`.
  2. Inspect table columns and values.
- **Expected Results**:
  - Columns include Name, Type, Association, Description, Format, Size, Case ID, Study Code.
  - Rows render correctly and are sortable/usable.
- **Postconditions**: None.

#### TC-F-014: Manifest download with description succeeds
- **Requirement**: REQ-014
- **Priority**: High
- **Preconditions**:
  - Cart has at least one file
- **Test Steps**:
  1. Enter text in manifest description field.
  2. Click `DOWNLOAD MANIFEST`.
  3. Inspect downloaded CSV.
- **Expected Results**:
  - CSV file downloads successfully.
  - CSV contains selected file entries.
  - Description is accepted without validation error.
- **Postconditions**: Manifest available locally.

#### TC-F-015: Partial-ID search returns autocomplete suggestions
- **Requirement**: REQ-015
- **Priority**: High
- **Preconditions**:
  - User is on any page with global search bar
- **Test Steps**:
  1. Enter partial case ID (e.g., `BENTO-CASE-10133`).
  2. Observe autocomplete dropdown.
  3. Click one suggestion.
- **Expected Results**:
  - Matching suggestion list appears.
  - Selection navigates to results page for selected term.
- **Postconditions**: Search results page open.

#### TC-F-016: Search results tabs categorize by entity type
- **Requirement**: REQ-016
- **Priority**: High
- **Preconditions**:
  - Search results page loaded
- **Test Steps**:
  1. Observe tab strip.
  2. Click each category tab: All/Cases/Samples/Files/Programs/Studies/Data Model/About.
- **Expected Results**:
  - All required categories are present.
  - Tab counts and result list update per selected category.
- **Postconditions**: None.

#### TC-F-017: Login page provides all required identity providers
- **Requirement**: REQ-017
- **Priority**: High
- **Preconditions**:
  - User not authenticated
- **Test Steps**:
  1. Click header `Login`.
  2. Verify provider buttons shown.
  3. Click one provider button (in non-prod or mock environment).
- **Expected Results**:
  - Buttons for Google, Login.gov, NIH iTrust are visible.
  - Provider flow initiation starts without UI crash.
- **Postconditions**: Redirect initiated or blocked by test environment policy.

#### TC-F-018: External links from portal contexts are reachable
- **Requirement**: REQ-018
- **Priority**: Medium
- **Preconditions**:
  - Home and Programs pages available
- **Test Steps**:
  1. Click PubMed link from program row.
  2. Click NCI/NIH/HHS footer links.
  3. Verify HTTP status and destination host.
- **Expected Results**:
  - Links navigate to expected official resources.
  - No broken-link or malformed URL issues.
- **Postconditions**: Browser may open external pages/tabs.

#### TC-F-019: Breadcrumbs navigate back to parent listing pages
- **Requirement**: REQ-019
- **Priority**: Medium
- **Preconditions**:
  - User on Case detail and Program detail pages
- **Test Steps**:
  1. Click `ALL CASES` on case detail.
  2. Navigate to Program detail.
  3. Click `ALL PROGRAMS`.
- **Expected Results**:
  - Case breadcrumb returns to Explore/listing context.
  - Program breadcrumb returns to Programs list.
- **Postconditions**: None.

#### TC-F-020: Program detail page shows metadata and distributions
- **Requirement**: REQ-020
- **Priority**: High
- **Preconditions**:
  - Programs page has at least one row
- **Test Steps**:
  1. Click a program code link.
  2. Inspect program detail content.
- **Expected Results**:
  - Program metadata (name/id/description) is visible.
  - Case counts and diagnosis distribution chart are present.
- **Postconditions**: None.

### 2. Edge Case Tests
Test cases covering boundary conditions and unusual inputs.

#### TC-E-001: Search with non-existent term shows explicit zero-state
- **Requirement**: REQ-016
- **Priority**: Medium
- **Preconditions**:
  - Search bar available
- **Test Steps**:
  1. Search random token (e.g., `ZZZ-NO-HIT-123456`).
  2. Open each search category tab.
- **Expected Results**:
  - Zero results are clearly shown in All and category tabs.
  - No stale previous result is displayed.
- **Postconditions**: None.

#### TC-E-002: Multi-facet filtering to zero records handles empty visuals
- **Requirement**: REQ-003, REQ-005
- **Priority**: Medium
- **Preconditions**:
  - Explore page loaded
- **Test Steps**:
  1. Apply intentionally conflicting filters.
  2. Observe charts/table/query tags.
- **Expected Results**:
  - System shows 0-result state gracefully.
  - No chart rendering crash.
  - Query tags still accurately represent active conditions.
- **Postconditions**: Filters remain active until cleared.

#### TC-E-003: Cart pagination boundary with large selected set
- **Requirement**: REQ-013
- **Priority**: Low
- **Preconditions**:
  - Cart has > 1 page of files
- **Test Steps**:
  1. Navigate cart pages forward/backward.
  2. Change rows per page.
- **Expected Results**:
  - Pagination boundaries are correct.
  - No duplicate or missing rows when switching pages.
- **Postconditions**: None.

#### TC-E-004: Manifest description boundary values
- **Requirement**: REQ-014
- **Priority**: Medium
- **Preconditions**:
  - Cart has files
- **Test Steps**:
  1. Enter minimum description (1 char).
  2. Enter long description near max allowed length.
  3. Use special characters and unicode.
  4. Download manifest for each case.
- **Expected Results**:
  - Inputs within limits are accepted.
  - Out-of-range input triggers clear validation message.
  - No encoding corruption in output.
- **Postconditions**: None.

### 3. Error Handling Tests
Test cases covering error scenarios and failure modes.

#### TC-ERR-001: Invalid case-set upload is rejected with actionable message
- **Requirement**: REQ-007
- **Priority**: High
- **Preconditions**:
  - Invalid upload file prepared (wrong extension/format)
- **Test Steps**:
  1. Open `Upload Case Set`.
  2. Upload invalid file.
- **Expected Results**:
  - Upload fails gracefully.
  - User sees clear error message describing required format.
  - Existing filters/data remain unchanged.
- **Postconditions**: No new case-set filter applied.

#### TC-ERR-002: Empty cart download attempt is blocked or warned
- **Requirement**: REQ-014
- **Priority**: High
- **Preconditions**:
  - Cart is empty
- **Test Steps**:
  1. Open cart.
  2. Click `DOWNLOAD MANIFEST`.
- **Expected Results**:
  - Action is blocked, or warning is shown.
  - No invalid/empty manifest is silently generated.
- **Postconditions**: Cart remains empty.

#### TC-ERR-003: Backend 5xx during Programs load shows resilient UI
- **Requirement**: REQ-020
- **Priority**: High
- **Preconditions**:
  - Test environment can simulate 500 on program-related API
- **Test Steps**:
  1. Trigger program page load with mocked 500.
  2. Observe user-facing behavior.
- **Expected Results**:
  - App does not crash.
  - User sees retryable error state or partial-data notice.
  - Navigation remains usable.
- **Postconditions**: None.

#### TC-ERR-004: External link unavailable/network failure handled safely
- **Requirement**: REQ-018
- **Priority**: Low
- **Preconditions**:
  - Network rules can simulate target host unavailable
- **Test Steps**:
  1. Click an external link while target is blocked.
- **Expected Results**:
  - Failure does not break current app session.
  - User can continue interaction in source page.
- **Postconditions**: None.

#### TC-ERR-005: Identity provider authentication denial returns controlled state
- **Requirement**: REQ-017
- **Priority**: High
- **Preconditions**:
  - IdP test account or mock flow that returns `access_denied`
- **Test Steps**:
  1. Start login with one provider.
  2. Deny consent at provider page.
  3. Return to app.
- **Expected Results**:
  - App shows clear login failure/cancel message.
  - User remains unauthenticated without broken UI.
- **Postconditions**: Session remains public/anonymous.

### 4. State Transition Tests
Test cases covering state changes and workflows.

#### TC-ST-001: Filter state transition lifecycle on Explore page
- **Requirement**: REQ-003, REQ-004, REQ-005
- **Priority**: High
- **Preconditions**:
  - Explore page loaded
- **Test Steps**:
  1. Start with no filters.
  2. Expand facet and apply filter.
  3. Add second filter.
  4. Remove one filter.
  5. Clear all filters.
- **Expected Results**:
  - State transitions occur in valid order.
  - Counts/charts/table stay consistent at each transition.
- **Postconditions**: Returned to unfiltered state.

#### TC-ST-002: File selection to cart badge transition
- **Requirement**: REQ-011, REQ-012, REQ-013
- **Priority**: High
- **Preconditions**:
  - Files available in Explore or case page
- **Test Steps**:
  1. Observe initial file badge count.
  2. Add one selected file.
  3. Add all filtered files.
  4. Remove one file in cart.
- **Expected Results**:
  - Badge count transitions correctly after each action.
  - Cart contents mirror badge count and selected set.
- **Postconditions**: Cart state matches last action.

#### TC-ST-003: Search input -> suggestion -> categorized results transition
- **Requirement**: REQ-015, REQ-016
- **Priority**: Medium
- **Preconditions**:
  - Global search available
- **Test Steps**:
  1. Enter partial ID.
  2. Select suggestion.
  3. Switch categories.
  4. Open result detail and navigate back.
- **Expected Results**:
  - Transition path is stable with no lost query.
  - Returning from detail preserves the searched term context.
- **Postconditions**: Search results page retained.

#### TC-ST-004: Detail breadcrumb back-navigation transition
- **Requirement**: REQ-019, REQ-020
- **Priority**: Medium
- **Preconditions**:
  - User can open case/program detail pages
- **Test Steps**:
  1. Open program detail from Programs list.
  2. Use breadcrumb back.
  3. Open case detail from Explore.
  4. Use breadcrumb back.
- **Expected Results**:
  - Correct parent context is restored for each entity type.
  - No navigation loop or wrong route.
- **Postconditions**: User returns to list views.

## Test Coverage Matrix

| Requirement ID | Test Cases | Coverage Status |
|---------------|------------|-----------------|
| REQ-001 | TC-F-001 | ✓ Complete |
| REQ-002 | TC-F-002 | ✓ Complete |
| REQ-003 | TC-F-003, TC-E-002, TC-ST-001 | ✓ Complete |
| REQ-004 | TC-F-004, TC-ST-001 | ✓ Complete |
| REQ-005 | TC-F-005, TC-E-002, TC-ST-001 | ✓ Complete |
| REQ-006 | TC-F-006 | ✓ Complete |
| REQ-007 | TC-F-007, TC-ERR-001 | ✓ Complete |
| REQ-008 | TC-F-008 | ✓ Complete |
| REQ-009 | TC-F-009 | ✓ Complete |
| REQ-010 | TC-F-010 | ✓ Complete |
| REQ-011 | TC-F-011, TC-ST-002 | ✓ Complete |
| REQ-012 | TC-F-012, TC-ST-002 | ✓ Complete |
| REQ-013 | TC-F-013, TC-E-003, TC-ST-002 | ✓ Complete |
| REQ-014 | TC-F-014, TC-E-004, TC-ERR-002 | ✓ Complete |
| REQ-015 | TC-F-015, TC-ST-003 | ✓ Complete |
| REQ-016 | TC-F-016, TC-E-001, TC-ST-003 | ✓ Complete |
| REQ-017 | TC-F-017, TC-ERR-005 | ✓ Complete |
| REQ-018 | TC-F-018, TC-ERR-004 | ✓ Complete |
| REQ-019 | TC-F-019, TC-ST-004 | ✓ Complete |
| REQ-020 | TC-F-020, TC-ERR-003, TC-ST-004 | ✓ Complete |

## Notes
- This suite is requirement-driven and intentionally includes both currently observed behavior and resilience tests for known risks (e.g., intermittent 5xx, empty-cart manifest behavior).
- OAuth success-path completion depends on test credentials/environment and may require IdP sandbox setup.
- Case-set upload test requires confirmed input format contract from product/backend teams.
