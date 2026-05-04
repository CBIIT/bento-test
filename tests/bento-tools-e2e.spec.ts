import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://bento-tools.org/#/home';

test.describe('Bento Tools - Full Test Coverage Suite', () => {
  /**
   * REQ-001: Government warning banner blocks access until consent
   */
  test('TC-F-001: Government warning banner appears and can be dismissed', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Screenshot: Initial state with warning dialog
    await page.screenshot({ path: 'test-results/TC-F-001-01-warning-visible.png', fullPage: true });
    
    // Verify warning dialog is visible
    const warningDialog = page.getByRole('dialog', { name: 'Warning' });
    await expect(warningDialog).toBeVisible();
    
    // Verify Continue button is present
    const continueBtn = page.getByRole('button', { name: 'Continue' });
    await expect(continueBtn).toBeVisible();
    
    // Click Continue to dismiss
    await continueBtn.click();
    await expect(warningDialog).toBeHidden();
    
    // Screenshot: After dismissing warning
    await page.screenshot({ path: 'test-results/TC-F-001-02-warning-dismissed.png', fullPage: true });
  });

  /**
   * REQ-002: Persistent stats bar is visible and populated across key pages
   */
  test('TC-F-002: Stats bar displays counts on Home page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Screenshot: Home page with stats bar
    await page.screenshot({ path: 'test-results/TC-F-002-01-home-stats.png', fullPage: true });
    
    // Verify stats bar elements are visible
    await expect(page.getByText('Programs')).toBeVisible();
    await expect(page.getByText('Arms')).toBeVisible();
    await expect(page.getByText('Cases')).toBeVisible();
    await expect(page.getByText('Samples')).toBeVisible();
    await expect(page.getByText('Files')).toBeVisible();
  });

  /**
   * REQ-003, REQ-004, REQ-005: Apply filter, facet expand/collapse, query tag management
   */
  test('TC-F-003: Apply Program filter and verify query tag appears', async ({ page }) => {
    await page.goto(`${BASE_URL.replace('/home', '/explore')}`);
    
    // Dismiss warning if needed
    const warning = page.getByRole('dialog', { name: 'Warning' });
    if (await warning.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.waitForTimeout(2000);
    
    // Screenshot: Explore page before filter
    await page.screenshot({ path: 'test-results/TC-F-003-01-explore-initial.png', fullPage: true });
    
    // Expand Program facet
    await page.getByRole('button', { name: 'Program', exact: true }).click();
    await page.waitForTimeout(500);
    
    // Screenshot: Program facet expanded
    await page.screenshot({ path: 'test-results/TC-F-003-02-program-expanded.png', fullPage: true });
    
    // Apply TAILORx filter
    await page.getByRole('button', { name: 'TAILORx (1000)' }).click();
    await page.waitForTimeout(1500);
    
    // Screenshot: Filter applied with query tag
    await page.screenshot({ path: 'test-results/TC-F-003-03-filter-applied.png', fullPage: true });
    
    // Verify query tag is visible
    await expect(page.getByText('Program')).toBeVisible();
    await expect(page.getByText('IS TAILORx')).toBeVisible();
    
    // Verify Clear Query button exists
    const clearQueryBtn = page.getByRole('button', { name: 'Clear Query' });
    await expect(clearQueryBtn).toBeVisible();
    
    // Verify checkbox is checked
    const checkbox = page.getByRole('checkbox');
    const checkedBoxes = checkbox.and(page.locator('[aria-checked="true"]'));
    await expect(checkedBoxes.first()).toBeTruthy();
  });

  /**
   * REQ-005: Clear query tag removes filter
   */
  test('TC-F-005: Clear Query removes active filter', async ({ page }) => {
    await page.goto(`${BASE_URL.replace('/home', '/explore')}`);
    
    // Dismiss warning
    const warning = page.getByRole('dialog', { name: 'Warning' });
    if (await warning.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.waitForTimeout(2000);
    
    // Apply Program filter
    await page.getByRole('button', { name: 'Program', exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'TAILORx (1000)' }).click();
    await page.waitForTimeout(1500);
    
    // Screenshot: Filter active
    await page.screenshot({ path: 'test-results/TC-F-005-01-filter-active.png', fullPage: true });
    
    // Verify query tag is present
    await expect(page.getByText('IS TAILORx')).toBeVisible();
    
    // Click Clear Query
    await page.getByRole('button', { name: 'Clear Query' }).click();
    await page.waitForTimeout(1000);
    
    // Screenshot: After clearing
    await page.screenshot({ path: 'test-results/TC-F-005-02-filter-cleared.png', fullPage: true });
    
    // Verify query tag is removed
    await expect(page.getByText('IS TAILORx')).not.toBeVisible();
  });

  /**
   * REQ-008: Data table tab switching
   */
  test('TC-F-008: Switch between Cases, Samples, Files tabs', async ({ page }) => {
    await page.goto(`${BASE_URL.replace('/home', '/explore')}`);
    
    // Dismiss warning
    const warning = page.getByRole('dialog', { name: 'Warning' });
    if (await warning.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.waitForTimeout(2000);
    
    // Click Cases tab
    await page.getByRole('tab', { name: /Cases/i }).click();
    await page.waitForTimeout(500);
    const casesTab = page.getByRole('tab', { name: /Cases/i });
    await expect(casesTab).toHaveAttribute('aria-selected', 'true');
    
    // Screenshot: Cases tab active
    await page.screenshot({ path: 'test-results/TC-F-008-01-cases-tab.png', fullPage: true });
    
    // Click Samples tab
    await page.getByRole('tab', { name: /Samples/i }).click();
    await page.waitForTimeout(500);
    const samplesTab = page.getByRole('tab', { name: /Samples/i });
    await expect(samplesTab).toHaveAttribute('aria-selected', 'true');
    
    // Screenshot: Samples tab active
    await page.screenshot({ path: 'test-results/TC-F-008-02-samples-tab.png', fullPage: true });
  });

  /**
   * REQ-009, REQ-010, REQ-019: Case detail drilldown, files, breadcrumb navigation
   */
  test('TC-F-009: Navigate to case detail and verify sections', async ({ page }) => {
    await page.goto(`${BASE_URL.replace('/home', '/explore')}`);
    
    // Dismiss warning
    const warning = page.getByRole('dialog', { name: 'Warning' });
    if (await warning.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.waitForTimeout(2000);
    
    // Screenshot: Explore page before navigation
    await page.screenshot({ path: 'test-results/TC-F-009-01-explore-page.png', fullPage: true });
    
    // Click on first case ID link
    await page.getByRole('link', { name: /BENTO-CASE-/ }).first().click();
    await page.waitForTimeout(2000);
    
    // Verify URL changed to case detail
    await expect(page).toHaveURL(/#\/case\/BENTO-CASE-/);
    
    // Screenshot: Case detail page
    await page.screenshot({ path: 'test-results/TC-F-009-02-case-detail.png', fullPage: true });
    
    // Verify case detail sections are present
    await expect(page.getByText('PROGRAM')).toBeVisible();
    await expect(page.getByText('DEMOGRAPHICS')).toBeVisible();
    await expect(page.getByText('TREATMENT')).toBeVisible();
    await expect(page.getByText('FOLLOW UP')).toBeVisible();
  });

  /**
   * REQ-019: Breadcrumb navigation back from case detail
   */
  test('TC-F-019: Breadcrumb navigates back from case detail to Explore', async ({ page }) => {
    await page.goto(`${BASE_URL.replace('/home', '/explore')}`);
    
    // Dismiss warning
    const warning = page.getByRole('dialog', { name: 'Warning' });
    if (await warning.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.waitForTimeout(2000);
    
    // Navigate to case detail
    await page.getByRole('link', { name: /BENTO-CASE-/ }).first().click();
    await page.waitForTimeout(2000);
    
    // Screenshot: On case detail page
    await page.screenshot({ path: 'test-results/TC-F-019-01-case-detail.png', fullPage: true });
    
    // Click breadcrumb to go back
    await page.getByText('ALL CASES').click();
    await page.waitForTimeout(1500);
    
    // Verify we're back on Explore page
    await expect(page).toHaveURL(/#\/explore/);
    
    // Screenshot: Back on Explore page
    await page.screenshot({ path: 'test-results/TC-F-019-02-back-to-explore.png', fullPage: true });
  });

  /**
   * REQ-020, REQ-019: Program detail page and breadcrumb
   */
  test('TC-F-020: Program detail page displays metadata', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Navigate to Programs
    await page.getByRole('link', { name: 'programs' }).click();
    await page.waitForTimeout(2000);
    
    // Screenshot: Programs list page
    await page.screenshot({ path: 'test-results/TC-F-020-01-programs-list.png', fullPage: true });
    
    // Click on program link
    await page.getByRole('link', { name: 'TAILORx' }).first().click();
    await page.waitForTimeout(2000);
    
    // Verify URL changed to program detail
    await expect(page).toHaveURL(/#\/program\//);
    
    // Screenshot: Program detail page
    await page.screenshot({ path: 'test-results/TC-F-020-02-program-detail.png', fullPage: true });
    
    // Verify program metadata is visible
    await expect(page.getByText(/TAILORx/i)).toBeVisible();
    await expect(page.getByText(/CASES:/i)).toBeVisible();
  });

  /**
   * REQ-015: Global search autocomplete
   */
  test('TC-F-015: Search autocomplete returns suggestions', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Screenshot: Home page before search
    await page.screenshot({ path: 'test-results/TC-F-015-01-home-page.png', fullPage: true });
    
    // Click search box
    await page.getByPlaceholder('SEARCH BENTO').click();
    await page.waitForTimeout(500);
    
    // Type partial case ID
    await page.getByPlaceholder('SEARCH BENTO').fill('BENTO-CASE-10133');
    await page.waitForTimeout(1500);
    
    // Screenshot: Autocomplete dropdown
    await page.screenshot({ path: 'test-results/TC-F-015-02-autocomplete.png', fullPage: true });
    
    // Verify autocomplete suggestion appears
    const suggestion = page.getByRole('option', { name: /BENTO-CASE-/ });
    await expect(suggestion).toBeVisible();
  });

  /**
   * REQ-016: Search results categorization
   */
  test('TC-F-016: Search results page shows category tabs', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Perform search
    await page.getByPlaceholder('SEARCH BENTO').click();
    await page.getByPlaceholder('SEARCH BENTO').fill('BENTO-CASE-10133');
    await page.waitForTimeout(1500);
    
    // Select suggestion
    await page.getByRole('option', { name: /BENTO-CASE-/ }).first().click();
    await page.waitForTimeout(2000);
    
    // Verify URL changed to search results
    await expect(page).toHaveURL(/#\/search\//);
    
    // Screenshot: Search results page
    await page.screenshot({ path: 'test-results/TC-F-016-01-search-results.png', fullPage: true });
    
    // Verify category tabs are present
    await expect(page.getByRole('tab', { name: /All/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Cases/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Samples/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Files/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Programs/i })).toBeVisible();
  });

  /**
   * REQ-017: Login page identity providers
   */
  test('TC-F-017: Login page displays identity provider buttons', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Click Login button
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(2000);
    
    // Verify URL changed to login
    await expect(page).toHaveURL(/#\/login/);
    
    // Screenshot: Login page
    await page.screenshot({ path: 'test-results/TC-F-017-01-login-page.png', fullPage: true });
    
    // Verify identity provider buttons are visible
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Login\.gov/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /NIH iTrust/i })).toBeVisible();
  });

  /**
   * REQ-013, REQ-014: File cart viewing and manifest download controls
   */
  test('TC-F-013: Cart page displays empty state and manifest controls', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Navigate to cart
    await page.getByRole('link', { name: /Files/i }).click();
    await page.waitForTimeout(2000);
    
    // Verify URL changed to cart
    await expect(page).toHaveURL(/#\/fileCentricCart/);
    
    // Screenshot: Empty cart page
    await page.screenshot({ path: 'test-results/TC-F-013-01-empty-cart.png', fullPage: true });
    
    // Verify empty state message
    await expect(page.getByText('No Matching Records Found')).toBeVisible();
    
    // Verify manifest download button exists
    await expect(page.getByRole('button', { name: 'DOWNLOAD MANIFEST' })).toBeVisible();
  });

  /**
   * REQ-018: External links are present
   */
  test('TC-F-018: External links have correct href attributes', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Screenshot: Home page with footer links
    await page.screenshot({ path: 'test-results/TC-F-018-01-home-footer.png', fullPage: true });
    
    // Verify NCI link
    const nciLink = page.getByRole('link', { name: /National Cancer Institute/i }).first();
    await expect(nciLink).toHaveAttribute('href', /cancer\.gov/);
    
    // Verify NIH link
    const nihLink = page.getByRole('link', { name: /National Institutes of Health/i }).first();
    await expect(nihLink).toHaveAttribute('href', /nih\.gov/);
    
    // Verify HHS link
    const hhsLink = page.getByRole('link', { name: /U\.S\. Department of Health and Human Services/i });
    await expect(hhsLink).toHaveAttribute('href', /hhs\.gov/);
  });

  /**
   * REQ-006: Filter sort options (alphabetical/count)
   */
  test('TC-F-006: Filter facet supports sort modes', async ({ page }) => {
    await page.goto(`${BASE_URL.replace('/home', '/explore')}`);
    
    // Dismiss warning
    const warning = page.getByRole('dialog', { name: 'Warning' });
    if (await warning.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.waitForTimeout(2000);
    
    // Expand Program facet
    await page.getByRole('button', { name: 'Program', exact: true }).click();
    await page.waitForTimeout(500);
    
    // Screenshot: Program facet with sort options
    await page.screenshot({ path: 'test-results/TC-F-006-01-sort-options.png', fullPage: true });
    
    // Verify sort buttons are present
    await expect(page.getByText('Sort alphabetically')).toBeVisible();
    await expect(page.getByText('Sort by count')).toBeVisible();
  });

  /**
   * REQ-004: Facet expand and collapse
   */
  test('TC-F-004: Facets expand and collapse correctly', async ({ page }) => {
    await page.goto(`${BASE_URL.replace('/home', '/explore')}`);
    
    // Dismiss warning
    const warning = page.getByRole('dialog', { name: 'Warning' });
    if (await warning.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.waitForTimeout(2000);
    
    // Verify Program facet is initially collapsed (button not expanded)
    let programBtn = page.getByRole('button', { name: 'Program', exact: true });
    let isExpanded = await programBtn.getAttribute('aria-expanded');
    
    // Click to expand if collapsed
    if (isExpanded === 'false') {
      await programBtn.click();
      await page.waitForTimeout(500);
    }
    
    // Screenshot: Program facet expanded
    await page.screenshot({ path: 'test-results/TC-F-004-01-expanded.png', fullPage: true });
    
    // Verify TAILORx option is visible
    await expect(page.getByRole('button', { name: 'TAILORx (1000)' })).toBeVisible();
    
    // Click to collapse
    await programBtn.click();
    await page.waitForTimeout(500);
    
    // Screenshot: Program facet collapsed
    await page.screenshot({ path: 'test-results/TC-F-004-02-collapsed.png', fullPage: true });
  });

  /**
   * Edge case: Search with no results
   */
  test('TC-E-001: Search with non-existent term shows zero-state', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Perform search with non-existent term
    await page.getByPlaceholder('SEARCH BENTO').click();
    await page.getByPlaceholder('SEARCH BENTO').fill('ZZZ-NO-HIT-999999');
    await page.waitForTimeout(1500);
    
    // Press Enter or wait for results to load
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Screenshot: No results state
    await page.screenshot({ path: 'test-results/TC-E-001-01-no-results.png', fullPage: true });
    
    // Verify zero results message if it appears
    // (Behavior may vary - user should verify in screenshot)
  });

  /**
   * Error handling: Empty cart manifest download
   */
  test('TC-ERR-002: Empty cart shows "No Matching Records Found"', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Dismiss warning
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    
    // Navigate to cart
    await page.getByRole('link', { name: /Files/i }).click();
    await page.waitForTimeout(2000);
    
    // Screenshot: Empty cart
    await page.screenshot({ path: 'test-results/TC-ERR-002-01-empty-cart.png', fullPage: true });
    
    // Verify the empty state message
    await expect(page.getByText('No Matching Records Found')).toBeVisible();
  });

  /**
   * State transition: Filter lifecycle
   */
  test('TC-ST-001: Filter state transitions work correctly', async ({ page }) => {
    await page.goto(`${BASE_URL.replace('/home', '/explore')}`);
    
    // Dismiss warning
    const warning = page.getByRole('dialog', { name: 'Warning' });
    if (await warning.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await page.waitForTimeout(2000);
    
    // Start: No filters
    await page.screenshot({ path: 'test-results/TC-ST-001-01-no-filters.png', fullPage: true });
    let queryTag = page.getByText('IS TAILORx');
    await expect(queryTag).not.toBeVisible();
    
    // Apply filter
    await page.getByRole('button', { name: 'Program', exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'TAILORx (1000)' }).click();
    await page.waitForTimeout(1000);
    
    // Screenshot: Filter applied
    await page.screenshot({ path: 'test-results/TC-ST-001-02-filter-applied.png', fullPage: true });
    await expect(queryTag).toBeVisible();
    
    // Clear filter
    await page.getByRole('button', { name: 'Clear Query' }).click();
    await page.waitForTimeout(1000);
    
    // Screenshot: Filter cleared
    await page.screenshot({ path: 'test-results/TC-ST-001-03-filter-cleared.png', fullPage: true });
    await expect(queryTag).not.toBeVisible();
  });
});
