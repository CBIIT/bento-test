# Product Requirements Document: Website Exploration Findings

**Version**: 1.0  
**Date**: 2026-04-29  
**Website URL**: https://bento-tools.org/#/home  
**Author**: Product Owner / QA Analyst  

---

## Executive Summary

Bento is an NCI (National Cancer Institute) open-source data sharing platform built on the Bento Framework. It enables researchers to explore, analyze, and visualize clinical trial data sets. The instance explored hosts data from the **TAILORx clinical trial** (NCT00310180), a landmark breast cancer study with 1,000 cases, 1,000 samples, 1 assay, and 1,004 associated files.

**What the website does**: Provides a structured, browsable interface for navigating clinical trial data — cases, samples, files, and programs — with faceted filtering, interactive data visualizations, a file cart system for downloading manifests, and a search experience.

**Likely users**: Cancer researchers, bioinformaticians, clinicians, and data scientists who need to access and analyze NCI clinical trial datasets.

**Core flows explored**:
1. Home page overview and navigation
2. Explore page with faceted filtering and donut chart visualizations
3. Case detail drilldown
4. Programs listing and program detail
5. Global search with autocomplete
6. File cart (My Files / Selected Files)
7. Login / identity provider selection

**Major observations**:
- The platform is functional and well-structured for read-only data exploration.
- A government warning banner appears on first load requiring consent acknowledgment.
- Login is supported via Google, Login.gov, and NIH iTrust — authenticated flows could not be explored without credentials.
- Two HTTP 500 errors were observed during navigation (Programs page load, File Cart page load), indicating potential backend fragility.
- The search is case-sensitive in its autocomplete behavior and restricted to known entity IDs.
- The "DOWNLOAD MANIFEST" button is always enabled even when the cart is empty.

---

## Product Context

### Current Experience

Bento presents a clean, government-compliant data portal for TAILORx clinical trial data. Users can:
- Browse aggregate statistics across programs, arms, cases, samples, assays, and files.
- Filter cases using 12+ facets including Program, Arm, Diagnosis, Recurrence Score, Tumor Size, Chemotherapy, Tumor Grade, ER/PR Status, Endocrine Therapy, Menopause Status, and Age.
- View interactive donut charts that update as filters are applied.
- Drill into case, sample, and program detail pages.
- Search across entity types (Cases, Samples, Files, Programs, Studies) with autocomplete.
- Add files to a cart and download a manifest CSV.
- Log in using federated identity providers.

### Product Goals

1. Enable authorized users to discover and access NCI clinical trial datasets.
2. Support data exploration without requiring login for read-only browsing.
3. Provide interactive filtering and visualization to help researchers identify cohorts.
4. Enable downloading of file manifests for downstream analysis.
5. Serve as a reference implementation of the Bento open-source framework.

### Exploration Scope

- Home page (landing, stats banner, navigation CTAs)
- Explore page (faceted filtering, data visualization, case/sample/file tabs, data table)
- Case detail page (BENTO-CASE-1013342)
- Programs page (listing table)
- Program detail page (TAILORx / NCT00310180)
- Global search (autocomplete and results page with category tabs)
- File cart (Cart > Selected Files)
- Login page (identity provider selection)
- About dropdown (Bento, Resources, GraphQL)

### Limitations

- Authentication was not completed; all authenticated flows (post-login dashboard, file download) are untested.
- Only one program (TAILORx) is present, limiting testing of multi-program scenarios.
- File download and manifest generation were not executed.
- Mobile/responsive behavior was not tested.
- The GraphQL endpoint (`#/graphql`) was not explored in depth.
- Two backend 500 errors were observed but root cause was not confirmed.

---

## Core User Flows

### Flow 1: Home Page Navigation

**User Goal**: Understand what Bento offers and navigate to a core area of interest.

**Steps Explored**:
1. Navigated to `https://bento-tools.org/#/home`.
2. Dismissed the Government Warning Banner by clicking "Continue".
3. Observed the hero section with headline "Explore, Analyze, Visualize Clinical Trial Data Sets".
4. Observed the stats bar displaying: 1 Program, 4 Arms, 1000 Cases, 1000 Samples, 1004 Files.
5. Observed three content cards: Programs ("View"), Resources ("Read More"), Cases ("Explore").
6. Observed the Bento Framework info section with "Read More" link.
7. Confirmed top navigation: HOME, EXPLORE, PROGRAMS, ABOUT (dropdown), LOGIN, Files cart badge.

**Key UI Elements and Locators**:

| UI Element | Purpose | Suggested Playwright Locator |
|---|---|---|
| Government Warning Dialog | Privacy/security consent | `page.getByRole('dialog', { name: 'Warning' })` |
| Continue Button | Dismiss warning and proceed | `page.getByRole('button', { name: 'Continue' })` |
| EXPLORE THE SITE Button | Primary CTA to Explore | `page.getByRole('button', { name: 'EXPLORE THE SITE' })` |
| SEARCH BENTO Input | Global search | `page.getByPlaceholder('SEARCH BENTO')` |
| Navigation: Explore | Go to Explore page | `page.getByRole('link', { name: 'explore', exact: true })` |
| Navigation: Programs | Go to Programs page | `page.getByRole('link', { name: 'programs' })` |
| Navigation: About (dropdown) | Open About submenu | `page.getByRole('button', { name: 'about' })` |
| Login Button | Navigate to Login | `page.getByRole('button', { name: 'Login' })` |
| Files Cart Link | Navigate to file cart | `page.getByRole('link', { name: /cart_logo/ })` |
| Stats Bar | Summary counts | `page.getByText('Cases').first()` |

**Expected Behavior**:
Warning banner should appear once per session, consent click dismisses it and the home page content loads fully. The hero, stats bar, content cards, and footer should be visible.

**Observed Behavior**:
Warning banner appeared as expected. All home page sections loaded correctly including the stats bar with accurate counts (1 Programs, 4 Arms, 1000 Cases, 1000 Samples, 1004 Files). Navigation links were all functional.

**Issues / Risks**:
- The Warning Banner references government-specific language; users unfamiliar with government portals may be confused or alarmed.
- Alt text on provider logos in the login page shows "alt coming" — indicates placeholder text still in use.

---

### Flow 2: Explore Page — Faceted Filtering and Data Visualization

**User Goal**: Narrow down cases using filters and visualize the distribution across categories.

**Steps Explored**:
1. Clicked the "explore" link in the main navigation.
2. Observed the top entity summary bar (1000 Cases, 1000 Samples, 1 Assays, 1004 Files).
3. Expanded the PROGRAM filter in the left sidebar.
4. Observed the "TAILORx (1000)" checkbox option.
5. Clicked the TAILORx checkbox to apply the filter.
6. Observed the active query tag "Program IS TAILORx" appear.
7. Scrolled down through multiple donut charts: Programs and Arms, Diagnosis, Recurrence Score, Tumor Size, Chemotherapy, Endocrine Therapy.
8. Scrolled further to see the data table with tabs: Cases (1000), Samples (1000).
9. Observed the table columns: Case ID, Program Code, Program ID, Arm, Diagnosis.
10. Observed "ADD ALL FILES" and "ADD SELECTED FILES" action buttons.
11. Observed pagination: 1-10 OF 1000, ROWS PER PAGE: 10.

**Key UI Elements and Locators**:

| UI Element | Purpose | Suggested Playwright Locator |
|---|---|---|
| Entity Summary Bar | Shows filtered aggregate counts | `page.getByText('1000').first()` |
| Clear All Filtered Selections | Resets all filters | `page.getByText('Clear all filtered selections')` |
| PROGRAM Filter Button | Expands/collapses Program facet | `page.getByRole('button', { name: 'Program', exact: true })` |
| TAILORx Checkbox | Filters by program | `page.getByRole('button', { name: 'TAILORx (1000)' })` |
| ARM Filter | Expands Arm facet | `page.getByRole('button', { name: 'Arm', exact: true })` |
| DIAGNOSIS Filter | Expands Diagnosis facet | `page.getByRole('button', { name: 'Diagnosis', exact: true })` |
| COLLAPSE VIEW Toggle | Toggles chart visibility | `page.getByText('COLLAPSE VIEW')` |
| Cases Tab | Shows cases table | `page.getByRole('tab', { name: /Cases/ })` |
| Samples Tab | Shows samples table | `page.getByRole('tab', { name: /Samples/ })` |
| ADD ALL FILES Button | Adds all filtered files to cart | `page.getByRole('button', { name: 'ADD ALL FILES' })` |
| Upload Case Set | Upload a list of case IDs | `page.getByRole('button', { name: /Upload Case Set/ })` |
| Cases search input | Filter by case ID | `page.getByPlaceholder('e.g. BENTO-CASE-06, BENTO-CASE-22')` |

**Expected Behavior**:
Applying a filter should update the donut charts, entity summary bar, and data table in real time to reflect the filtered subset. The query tag should appear showing the active filter.

**Observed Behavior**:
All filters and charts updated correctly after applying the TAILORx filter. The query tag "Program IS TAILORx" appeared. Donut chart tooltips showed individual segment counts and labels. The data table updated correctly. Counts remained at 1000 since TAILORx is the only program.

**Issues / Risks**:
- With only one program in the dataset, filter interactions are limited; no cross-program filtering was testable.
- The sidebar has 12+ filter facets; on smaller viewports, usability could degrade.
- "Sort alphabetically" and "Sort by count" options appear in filter sections but functionality was not validated.

---

### Flow 3: Case Detail Page

**User Goal**: View detailed clinical and demographic information for a specific case.

**Steps Explored**:
1. From the Explore page data table, clicked on case ID "BENTO-CASE-1013342".
2. Observed the case detail page loading at `#/case/BENTO-CASE-1013342`.
3. The entity summary bar updated to show 1 Case, 1 Sample, 1 Assay, 1 File.
4. Observed the detail sections: PROGRAM, DEMOGRAPHICS, TREATMENT, FOLLOW UP.
5. Scrolled down to the files table showing associated file: `1025_OncotypeDXqRTPCR.txt` (qRT-PCR output, txt, 316 Bytes).
6. Observed "ADD SELECTED FILES" button (disabled when no checkboxes selected).
7. Observed breadcrumb "ALL CASES /" for navigation back to the full list.

**Key UI Elements and Locators**:

| UI Element | Purpose | Suggested Playwright Locator |
|---|---|---|
| Case ID Heading | Identifies the case | `page.getByText('BENTO-CASE-1013342')` |
| ALL CASES Breadcrumb | Navigate back to explore | `page.getByText('ALL CASES')` |
| Program Section | Shows assigned program and arm | `page.getByText('PROGRAM').first()` |
| Demographics Section | Patient demographic info | `page.getByText('DEMOGRAPHICS')` |
| Treatment Section | Treatment regimen info | `page.getByText('TREATMENT')` |
| Follow Up Section | DFS/recurrence outcomes | `page.getByText('FOLLOW UP')` |
| Files Table | Lists associated files | `page.getByRole('table')` |
| ADD SELECTED FILES | Adds selected files to cart | `page.getByRole('button', { name: 'ADD SELECTED FILES' })` |

**Expected Behavior**:
Case detail page should display all available clinical metadata for the selected case, with a linked files table. Selecting a file checkbox should enable "ADD SELECTED FILES".

**Observed Behavior**:
All fields populated correctly. Observed data included: Gender (Female), Race (White), Ethnicity (Not Hispanic or Latino), Age at Enrollment (49), Menopause Status (Premenopausal), Vital Status (Alive), Primary Surgical Procedure (Tumorectomy), Endocrine Therapy (Tam & AI), and follow-up outcomes. The file table showed one associated file with all expected metadata columns.

**Issues / Risks**:
- Some field values show "Not Reported" for certain diagnoses — potential data quality or display issue.
- "ADD SELECTED FILES" remains greyed out when no file is checked; no visual hint or tooltip explains this to new users.

---

### Flow 4: Programs Listing and Program Detail

**User Goal**: Browse available research programs and view program-level metadata and statistics.

**Steps Explored**:
1. Clicked "programs" in the navigation.
2. Observed the Programs table with columns: Program Code, Program ID, Program Name, Start Date, End Date, PubMed ID, Number of Arms, Associated Cases.
3. Observed one program: TAILORx / NCT00310180, 2006–2018, PubMed ID 29860917, 4 Arms, 1000 Cases.
4. Clicked the TAILORx link to view the program detail page.
5. Observed the program detail page at `#/program/NCT00310180`.
6. Observed PROGRAM, PROGRAM NAME, PROGRAM ID, PROGRAM DESCRIPTION sections.
7. Observed the DIAGNOSIS donut chart and NUMBER OF FILES section.
8. Observed "CASES: 1000" indicator and breadcrumb "ALL PROGRAMS".

**Key UI Elements and Locators**:

| UI Element | Purpose | Suggested Playwright Locator |
|---|---|---|
| Programs Table | Lists all programs | `page.getByRole('grid')` |
| TAILORx Link | Navigate to program detail | `page.getByRole('link', { name: 'TAILORx' })` |
| PubMed ID External Link | Opens PubMed in new tab | `page.getByRole('link', { name: '29860917' })` |
| Program Code Heading | Identifies the program | `page.getByText('Program : TAILORx')` |
| ALL PROGRAMS Breadcrumb | Return to program list | `page.getByText('ALL PROGRAMS')` |
| CASES Count | Shows total associated cases | `page.getByText('CASES: 1000')` |
| Associated Cases Number | Link back to filtered explore | `page.getByRole('link', { name: '1000' })` |

**Expected Behavior**:
Programs page should list all programs in a sortable table with metadata. Clicking a program should open its detail page with summary statistics and charts.

**Observed Behavior**:
Programs page loaded correctly with one program entry. The sortable table headers were functional. The program detail page showed all sections. A console error (HTTP 500) appeared on loading the Programs page, though it did not prevent the page from rendering.

**Issues / Risks**:
- HTTP 500 error on Programs page load suggests a backend endpoint failure; potential data completeness issue.
- With only one program, sorting and pagination cannot be meaningfully validated.
- The PubMed ID link opens an external site without a warning or `target="_blank"` attribution notice.

---

### Flow 5: Global Search

**User Goal**: Search for a specific entity (case, program, file) across the entire dataset.

**Steps Explored**:
1. Clicked the "SEARCH BENTO" search box in the top header.
2. Typed "BENTO-CASE-10133" into the field.
3. Observed a dropdown autocomplete suggestion: "BENTO-CASE-1013342".
4. Clicked the autocomplete option.
5. Observed navigation to the search results page at `#/search/BENTO-CASE-1013342`.
6. Observed category tabs: All 1, Cases 1, Samples 0, Files 0, Programs 0, Studies 0, Data Model 0, About 0.
7. Observed the result card showing: CASE badge, case ID link, Program ID link, Diagnosis, Age.

**Key UI Elements and Locators**:

| UI Element | Purpose | Suggested Playwright Locator |
|---|---|---|
| Search Input | Global entity search | `page.getByPlaceholder('SEARCH BENTO')` |
| Autocomplete Dropdown | Suggests matching entities | `page.getByRole('listbox')` |
| Autocomplete Option | Select a suggestion | `page.getByRole('option', { name: 'BENTO-CASE-1013342' })` |
| All Tab | Shows all results | `page.getByRole('tab', { name: /All/ })` |
| Cases Tab | Filters results to Cases | `page.getByRole('tab', { name: /Cases/ })` |
| Result Item Link | Navigate to entity detail | `page.getByRole('link', { name: 'BENTO-CASE-1013342' })` |

**Expected Behavior**:
Search should return autocomplete suggestions as the user types, covering all entity types. The results page should show categorized results with summary data for each match.

**Observed Behavior**:
Autocomplete worked correctly and returned a matching case suggestion. The results page rendered correctly showing 1 result across the "All" and "Cases" tabs. Other tabs (Samples, Files, Programs, Studies, Data Model, About) showed 0 results for this specific search term.

**Issues / Risks**:
- Search appears to require knowing partial entity IDs — no full-text search for clinical terms (e.g., "breast cancer") was observed.
- No "no results" handling was tested for completely unknown search terms.
- "Data Model" and "About" search categories are unusual — unclear what content they cover.

---

## Functional Requirements

- **REQ-001**: The system should display a Government Warning Banner on first page load that requires explicit user consent before allowing access.
- **REQ-002**: The user should be able to view aggregate counts (Programs, Arms, Cases, Samples, Assays, Files) on a persistent stats bar visible across all pages.
- **REQ-003**: The user should be able to apply one or more facet filters on the Explore page so that the data visualizations and tables update dynamically to reflect filtered results.
- **REQ-004**: The user should be able to expand and collapse individual filter facets to manage sidebar space.
- **REQ-005**: The system should display the active filter state as a query tag with a "Clear Query" option.
- **REQ-006**: The user should be able to sort filter options alphabetically or by count.
- **REQ-007**: The user should be able to upload a case set file to filter the Explore view by a predefined list of case IDs.
- **REQ-008**: The user should be able to switch between Cases, Samples, and Files tabs in the data table at the bottom of the Explore page.
- **REQ-009**: The user should be able to drill into a case detail page showing demographic, program, treatment, and follow-up information.
- **REQ-010**: The user should be able to view and navigate to associated files from the case detail page.
- **REQ-011**: The user should be able to select individual files from any data table and add them to a file cart.
- **REQ-012**: The user should be able to add all filtered files to the cart with a single action.
- **REQ-013**: The user should be able to view the file cart listing all selected files with metadata (Name, Type, Association, Description, Format, Size, Case ID, Study Code).
- **REQ-014**: The user should be able to enter a description and download a manifest CSV from the file cart.
- **REQ-015**: The user should be able to search for entities by partial ID with autocomplete suggestions.
- **REQ-016**: The search results page should categorize results by entity type (Cases, Samples, Files, Programs, Studies, Data Model, About).
- **REQ-017**: The user should be able to log in using Google, Login.gov, or NIH iTrust identity providers.
- **REQ-018**: The interface should provide links to external resources (PubMed, HHS, NIH, NCI, GitHub release notes) in relevant contexts.
- **REQ-019**: The system should display a breadcrumb trail on detail pages to enable back navigation.
- **REQ-020**: The interface should display program-level detail pages including metadata, case counts, and diagnosis distributions.

---

## User Stories & Acceptance Criteria

### Story 1: Cohort Filtering

**As a** cancer researcher  
**I want to** filter clinical trial cases by multiple attributes (program, diagnosis, arm, treatment)  
**So that** I can identify a patient cohort relevant to my research question

**Acceptance Criteria**:
- [ ] Left sidebar displays all available filter facets collapsed by default.
- [ ] Clicking a facet label expands it to show available values with case counts.
- [ ] Selecting a filter value applies it and updates the donut charts and data table immediately.
- [ ] The active filter appears as a query tag above the data table.
- [ ] Multiple filters can be applied simultaneously across different facets.
- [ ] "Clear all filtered selections" removes all active filters and resets the view.
- [ ] The entity summary bar reflects the filtered case/sample/file counts.

---

### Story 2: Case Detail Drilldown

**As a** clinical data analyst  
**I want to** view detailed metadata for a specific case  
**So that** I can verify case eligibility and understand associated data files

**Acceptance Criteria**:
- [ ] Clicking a case ID in any table navigates to the case detail page.
- [ ] Case detail page displays PROGRAM, DEMOGRAPHICS, TREATMENT, and FOLLOW UP sections.
- [ ] All demographic fields (Gender, Race, Ethnicity, Age, Menopause Status, Vital Status) are displayed.
- [ ] All treatment fields (Primary Surgical Procedure, Chemotherapy, Endocrine Therapy) are displayed.
- [ ] Associated files are listed in a table with File Name, Format, Association, Description, File Type, and Size.
- [ ] "ALL CASES" breadcrumb navigates back to the Explore page.
- [ ] The entity summary bar updates to reflect counts for the single case.

---

### Story 3: File Cart and Manifest Download

**As a** bioinformatician  
**I want to** select files of interest and download a manifest  
**So that** I can retrieve the files using an external download tool

**Acceptance Criteria**:
- [ ] Checkboxes appear on every file row in data tables.
- [ ] Selecting one or more file checkboxes enables the "ADD SELECTED FILES" button.
- [ ] "ADD ALL FILES" adds all currently filtered files to the cart without individual selection.
- [ ] The Files cart badge in the header increments when files are added.
- [ ] The Cart page shows all selected files with full metadata.
- [ ] Individual files can be removed from the cart.
- [ ] A description text area is available before downloading the manifest.
- [ ] "DOWNLOAD MANIFEST" generates and downloads a CSV file.
- [ ] If the cart is empty, "DOWNLOAD MANIFEST" is disabled or prompts the user.

---

### Story 4: Global Search

**As a** researcher  
**I want to** search for cases, programs, or files by identifier  
**So that** I can quickly navigate to a specific entity without browsing filters

**Acceptance Criteria**:
- [ ] The search input is available on every page in the header.
- [ ] Typing at least 3 characters shows autocomplete suggestions.
- [ ] Clicking a suggestion navigates to the search results page with that query.
- [ ] Search results are categorized by entity type (All, Cases, Samples, Files, Programs, Studies, Data Model, About).
- [ ] Clicking a result link navigates to the entity detail page.
- [ ] Searching for a non-existent term shows "0 Results" across all tabs.
- [ ] Pressing Enter submits the search to the results page.

---

### Story 5: Login via Identity Provider

**As an** authorized researcher  
**I want to** log in using my institutional or government credentials  
**So that** I can access protected data or download files

**Acceptance Criteria**:
- [ ] Clicking "Login" navigates to the login selection page.
- [ ] Three identity provider options are presented: Google, Login.gov, NIH iTrust.
- [ ] Each provider button has a visible, correctly rendered logo.
- [ ] Clicking a provider initiates the OAuth/SAML redirect flow.
- [ ] After successful authentication, the user is redirected back to the application.
- [ ] The "Login" button in the header changes to show the user's identity after login.
- [ ] Unauthenticated users can still browse and explore the site.

---

## Edge Cases and Error Handling

- **Empty File Cart**: The Cart page correctly shows "No Matching Records Found" when no files are selected. However, "DOWNLOAD MANIFEST" is enabled even with an empty cart — clicking it may produce an empty or invalid CSV.
- **Search with No Results**: Behavior when searching for a completely unknown term (e.g., random string) was not confirmed; zero-state UX should be validated.
- **All Filters Applied**: Applying filters that result in 0 cases should gracefully handle empty states in donut charts and the data table.
- **Single-Value Filter Facets**: TAILORx is the only program, so multi-program filter interaction cannot be tested.
- **Upload Case Set with Invalid File**: Behavior when uploading a malformed or wrong-format file was not tested.
- **HTTP 500 Errors**: Backend 500 errors were observed on Programs page and File Cart page loads. Pages still rendered, but partial data loads may occur.
- **Login with Invalid Credentials**: OAuth redirect failures or access-denied states were not tested.
- **Browser Back Navigation**: Back-navigation from case detail to explore may not preserve the previous filter state.
- **Pagination Boundary**: Navigating to page 100 of 1000 cases (last page) edge case was not tested.
- **Slow Network / Loading States**: The stats bar shows a loading animation (progressbar) during initial load. Extended loading states on slow connections were not tested.

---

## Test Cases

| ID | Requirement | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-001 | REQ-001 | Government Warning Banner on first load | 1. Open `https://bento-tools.org/#/home` in a fresh session. 2. Observe dialog. | A modal dialog titled "Warning" appears with privacy/security text and a "Continue" button. | High |
| TC-002 | REQ-001 | Dismiss warning banner | 1. With Warning dialog visible, click "Continue". | Dialog closes and home page is fully visible. | High |
| TC-003 | REQ-002 | Stats bar visible across pages | 1. Navigate to Home. 2. Navigate to Explore. 3. Navigate to Programs. | Stats bar showing counts is visible on all pages. | Medium |
| TC-004 | REQ-003 | Apply Program filter | 1. Go to `#/explore`. 2. Expand PROGRAM facet. 3. Click TAILORx checkbox. | Donut charts update, query tag "Program IS TAILORx" appears, data table shows 1000 cases. | High |
| TC-005 | REQ-005 | Clear all filters | 1. Apply at least one filter on Explore. 2. Click "Clear all filtered selections". | All active filters removed, charts and table reset to unfiltered state. | High |
| TC-006 | REQ-009 | Navigate to case detail | 1. On Explore page, click any Case ID link in the table. | Navigates to `#/case/{case-id}` page with all metadata sections visible. | High |
| TC-007 | REQ-010 | Files table on case detail | 1. Open case detail for BENTO-CASE-1013342. 2. Scroll to files table. | Files table shows 1 file: `1025_OncotypeDXqRTPCR.txt`, with correct metadata. | High |
| TC-008 | REQ-011 | Add selected file to cart | 1. On case detail, check the file checkbox. 2. Click "ADD SELECTED FILES". | File cart count increments; file appears in Cart > Selected Files. | High |
| TC-009 | REQ-012 | Add all files from Explore | 1. Go to Explore, apply a filter. 2. Click "ADD ALL FILES". | All files matching the current filter are added to the cart. | High |
| TC-010 | REQ-013 | View file cart | 1. Navigate to `#/fileCentricCart`. | Cart page shows all previously added files with complete metadata columns. | High |
| TC-011 | REQ-014 | Download manifest from cart | 1. Add at least one file to cart. 2. Enter description in text area. 3. Click "DOWNLOAD MANIFEST". | A CSV manifest file is downloaded with file metadata. | High |
| TC-012 | REQ-014 | Download manifest from empty cart | 1. Navigate to `#/fileCentricCart` with no files added. 2. Click "DOWNLOAD MANIFEST". | User is prompted to add files first, or button is disabled, or empty CSV is downloaded with warning. | Medium |
| TC-013 | REQ-015 | Search autocomplete | 1. Click search box. 2. Type "BENTO-CASE-10133". | Autocomplete dropdown shows "BENTO-CASE-1013342" as a suggestion. | High |
| TC-014 | REQ-016 | Search results page tabs | 1. Select "BENTO-CASE-1013342" from autocomplete. | Results page shows tabs: All 1, Cases 1, Samples 0, Files 0, Programs 0. | Medium |
| TC-015 | REQ-017 | Login page identity providers | 1. Click "Login" in navigation. | Login page shows three buttons: Google, Login.gov, NIH iTrust with respective logos. | High |
| TC-016 | REQ-018 | PubMed external link from Programs | 1. Go to Programs page. 2. Click PubMed ID "29860917". | New tab/window opens to PubMed article page for ID 29860917. | Medium |
| TC-017 | REQ-019 | Breadcrumb navigation on case detail | 1. Open any case detail. 2. Click "ALL CASES" breadcrumb. | Returns to Explore page (ideally restoring previous filter state). | Medium |
| TC-018 | REQ-020 | Program detail page | 1. Go to Programs. 2. Click TAILORx link. | Program detail page shows program metadata, case count, and DIAGNOSIS donut chart. | High |
| TC-019 | REQ-003 | Explore filter: multiple facets | 1. Apply PROGRAM filter. 2. Also expand ARM and apply one arm. | Both filters are active simultaneously; counts update to reflect both constraints. | High |
| TC-020 | REQ-007 | Upload case set | 1. On Explore, click "UPLOAD CASE SET". 2. Upload a valid text file with case IDs. | Cases matching uploaded IDs are shown in the filtered data table. | Medium |
| TC-021 | — | HTTP 500 on Programs page | 1. Navigate to Programs page. 2. Check browser network panel or console. | No 500 error should occur; all data loads successfully. | High |
| TC-022 | — | Login provider logo alt text | 1. Go to Login page. 2. Inspect provider button images. | All provider logos have meaningful alt text (not "alt coming"). | Low |
| TC-023 | — | Search with empty input | 1. Click search and press Enter without typing. | No navigation occurs, or user is prompted to enter a search term. | Medium |
| TC-024 | — | Filter sort by count | 1. Expand a filter facet. 2. Click "Sort by count". | Filter options reorder by descending count. | Low |
| TC-025 | — | Collapse View toggle on Explore | 1. On Explore page, click "COLLAPSE VIEW" toggle. | Donut chart panels collapse, increasing table view space. | Low |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Backend 500 errors on Programs and File Cart pages | Medium | High | Investigate and fix the failing API endpoints; add backend health monitoring and error boundaries on the frontend. |
| Login OAuth flow failures | Medium | High | Test all three identity providers end-to-end; ensure redirect URIs and client configs are correct in production. |
| Empty cart manifest download produces invalid output | Medium | Medium | Add validation: disable the DOWNLOAD MANIFEST button when cart is empty, or show a toast/alert. |
| Search restricted to ID-based lookup only | High | Medium | Consider adding full-text search for clinical terms (diagnosis, program name, arm description) to improve discoverability. |
| Provider logo alt text showing "alt coming" | High | Low | Replace placeholder alt text with correct descriptive text for accessibility compliance. |
| Google Identity deprecation warnings in console | High | Low | Migrate to updated Google Identity Services (GIS) library per the linked migration guide. |
| Filter state not preserved on browser back navigation | Medium | Medium | Implement URL-based filter state (query parameters) so filters survive back/forward navigation. |
| Single-program dataset limits testing | High | Medium | Use a staging environment with multiple programs to validate multi-program filtering behavior. |
| iframe sandbox `allow-scripts + allow-same-origin` warning | Low | Medium | Review embedded iframe configurations; separate script and same-origin permissions where possible. |
| Mobile/responsive usability | Unknown | High | Conduct responsive testing at common breakpoints (768px, 375px); the 12-facet sidebar may be unusable on small screens. |

---

## Open Questions

1. **Authentication post-login**: What additional functionality is available to authenticated users beyond public browsing? Can authenticated users download files directly or only manifests?
2. **File download mechanism**: After downloading the manifest CSV, how do users actually retrieve the files? Is there a separate download tool or API?
3. **"Data Model" and "About" search categories**: What content is indexed under these categories in the search results?
4. **Case Set Upload format**: What is the expected file format and schema for the "UPLOAD CASE SET" feature?
5. **GraphQL Playground**: Is the `#/graphql` page a public GraphQL explorer? What schema and queries does it expose?
6. **Multi-program support**: Is the TAILORx dataset the only program hosted, or will additional programs be added?
7. **500 errors on Programs and Cart pages**: Are these transient network errors or consistent backend failures? What API endpoints are failing?
8. **Manifest CSV schema**: What columns does the downloaded manifest CSV contain?
9. **Filter URL persistence**: Are filter states encoded in the URL? If not, is deep-linking to filtered views planned?
10. **Accessibility compliance level**: What WCAG level is targeted? The placeholder alt texts and some contrast/label issues suggest WCAG 2.1 AA may not be fully met.

---

## Recommendations

### Product Functionality
- Add full-text search for clinical terms (diagnosis type, treatment, etc.) in addition to entity ID search.
- Enable file download directly from the manifest rather than requiring an external tool.
- Implement URL-based filter state to support bookmarking and sharing filtered views.
- Disable "DOWNLOAD MANIFEST" when the cart is empty and provide a user-facing message.

### UX Clarity
- Replace "alt coming" placeholder alt text on login provider logos with actual descriptive text.
- Add a tooltip or helper text explaining the "ADD SELECTED FILES" button is only enabled after selecting a file checkbox.
- Provide a visual indicator or toast notification when files are successfully added to the cart.
- The government Warning Banner language could be made friendlier for non-government users.

### Reliability
- Investigate and resolve the HTTP 500 errors on Programs and File Cart page loads.
- Add frontend error boundaries so 500 errors do not silently fail or affect page rendering.
- Migrate from deprecated Google Identity library to the current GIS library.
- Review iframe sandbox configuration to resolve `allow-scripts + allow-same-origin` warning.

### Accessibility
- Fix all provider logo alt texts from "alt coming" to descriptive values.
- Ensure all interactive elements have ARIA labels (especially icon-only buttons).
- Test keyboard navigation through the filter sidebar and data tables.
- Validate color contrast ratios on the blue/teal color scheme against WCAG 2.1 AA 4.5:1 standard.

### Test Coverage
- Add E2E tests for the complete file add-to-cart → manifest download flow.
- Add tests for the Upload Case Set feature with valid and invalid file inputs.
- Add tests for the login flows using mock OAuth redirects.
- Validate all three identity provider buttons in the login flow.
- Test filter state preservation on browser back/forward navigation.

### Locator / Testability Improvements
- Add `data-testid` attributes to key interactive elements (filter checkboxes, chart segments, cart action buttons) for stable test targeting.
- Ensure all dynamic elements (loading spinners, query tags) have accessible ARIA roles or labels.
- Add unique `id` attributes to table rows to enable precise row-level test assertions.
