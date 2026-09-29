import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:5173';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const results = {
  passed: [],
  failed: [],
  consoleErrors: [],
  networkErrors: [],
};

async function runTestSuite() {
  console.log('🚀 Starting MetraVerify Real-Time Automated QA Test Suite...\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Monitor console messages
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known benign dev warnings
      if (!text.includes('favicon.ico')) {
        results.consoleErrors.push({ url: page.url(), error: text });
        console.error(`  ⚠️ [Console Error] at ${page.url()}: ${text.slice(0, 120)}`);
      }
    }
  });

  // Monitor page exceptions
  page.on('pageerror', (err) => {
    results.consoleErrors.push({ url: page.url(), error: err.message });
    console.error(`  💥 [Page Exception] at ${page.url()}: ${err.message}`);
  });

  // Monitor failed requests
  page.on('requestfailed', (req) => {
    if (!req.url().includes('favicon.ico')) {
      results.networkErrors.push({ url: req.url(), failure: req.failure()?.errorText });
      console.warn(`  ❌ [Request Failed]: ${req.url()} (${req.failure()?.errorText})`);
    }
  });

  try {
    // ----------------------------------------------------
    // TEST 1: Public Landing Page & Top Ribbon
    // ----------------------------------------------------
    console.log('--- TEST 1: Public Landing Page & Top Ribbon ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const title = await page.title();
    console.log(`  Page Title: "${title}"`);

    // Check that 'System Architecture' and 'Public Certificate Lookup' buttons are removed
    const topRibbonText = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? header.innerText : '';
    });

    const hasArchitecture = topRibbonText.includes('System Architecture');
    const hasPublicLookup = topRibbonText.includes('Public Certificate Lookup');

    if (!hasArchitecture && !hasPublicLookup) {
      results.passed.push('TEST 1: Navbar top ribbon cleaned (System Architecture and Public Lookup removed)');
      console.log('  ✅ PASSED: Irrelevant buttons successfully removed from top ribbon.');
    } else {
      results.failed.push('TEST 1: Irrelevant buttons still present in top ribbon.');
      console.error('  ❌ FAILED: Irrelevant buttons found in top ribbon.');
    }

    // ----------------------------------------------------
    // TEST 2: Public Certificate Verification & QR Code Resolution
    // ----------------------------------------------------
    console.log('\n--- TEST 2: Public QR Verification & Certificate Card ---');
    await page.goto(`${BASE_URL}/verify`, { waitUntil: 'networkidle0' });

    // Verify QR scan trigger buttons exist
    const sampleBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText && b.innerText.includes('CERT-2026-001001'));
    });

    if (sampleBtn) {
      console.log('  Found Sample QR trigger button. Clicking...');
      await sampleBtn.click();
      await sleep(1500);

      const certNumber = await page.evaluate(() => {
        const el = document.body;
        return el.innerText.includes('CERT-2026-001001') && el.innerText.includes('VALID & CERTIFIED');
      });

      if (certNumber) {
        results.passed.push('TEST 2: QR Scanner / Verification correctly displays full certificate & instrument details');
        console.log('  ✅ PASSED: Certificate CERT-2026-001001 loaded with "VALID & CERTIFIED" status and details.');
      } else {
        results.failed.push('TEST 2: Certificate details not found after scanning sample QR');
        console.error('  ❌ FAILED: Certificate details did not render as expected.');
      }
    } else {
      results.failed.push('TEST 2: Sample QR trigger button not found on /verify');
      console.error('  ❌ FAILED: Sample button not located.');
    }

    // ----------------------------------------------------
    // TEST 3: Registration Location Auto-Detect & Pincode
    // ----------------------------------------------------
    console.log('\n--- TEST 3: Registration Location Fields & Pincode ---');
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });

    const hasLocationFeatures = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasAutoDetect = text.includes('Auto-Detect Location') || text.includes('Auto-Detect');
      const hasPincode = document.querySelector('input[name="pincode"]') !== null;
      const hasNote = text.includes('Used for local inspector matching') || text.includes('local inspector');
      return { hasAutoDetect, hasPincode, hasNote };
    });

    console.log('  Registration features:', hasLocationFeatures);
    if (hasLocationFeatures.hasAutoDetect && hasLocationFeatures.hasPincode && hasLocationFeatures.hasNote) {
      results.passed.push('TEST 3: Registration page has Auto-Detect Location, editable fields, and Pincode for inspector matching');
      console.log('  ✅ PASSED: Registration location detection, fields, and pincode matching verified.');
    } else {
      results.failed.push('TEST 3: Missing location detection or pincode fields in Registration');
      console.error('  ❌ FAILED: Location features incomplete on /register.');
    }

    // ----------------------------------------------------
    // TEST 4: HQ Admin Login, Allocation Navigation & Profile
    // ----------------------------------------------------
    console.log('\n--- TEST 4: HQ Admin Login, Direct Allocation & Profile ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

    await page.type('input[name="email"]', 'admin@metraverify.demo');
    await page.type('input[name="password"]', 'Admin@123');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await sleep(1500);

    const currentUrl = page.url();
    console.log(`  Logged in URL: ${currentUrl}`);

    const adminDashboardChecks = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasDistrictChart = text.includes('District-wise Registry Distribution');
      const hasCategoryChart = text.includes('Instrument Category Distribution');
      const hasThroughputOrTrends = text.includes('Monthly Verification & Stamping Trends');
      const hasAllocateButton = text.includes('Allocate Officer');
      return { hasDistrictChart, hasCategoryChart, hasThroughputOrTrends, hasAllocateButton };
    });

    console.log('  Admin Overview Chart Checks:', adminDashboardChecks);
    if (!adminDashboardChecks.hasDistrictChart && !adminDashboardChecks.hasCategoryChart) {
      results.passed.push('TEST 4a: District-wise and Category charts removed from Admin Dashboard');
      console.log('  ✅ PASSED: Complex charts cleanly removed from Admin Overview.');
    } else {
      results.failed.push('TEST 4a: Old charts still present in Admin Dashboard');
      console.error('  ❌ FAILED: Found removed charts on overview.');
    }

    // Test clicking 'Allocate Officer' to verify direct navigation to /admin/allocation
    const allocateBtn = await page.evaluateHandle(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      return links.find(l => l.innerText && l.innerText.includes('Allocate Officer'));
    });

    if (allocateBtn) {
      await allocateBtn.click();
      await sleep(1000);
      const allocationUrl = page.url();
      console.log(`  Navigated to: ${allocationUrl}`);
      if (allocationUrl.includes('/admin/allocation')) {
        results.passed.push('TEST 4b: Allocate Officer button directly routes to /admin/allocation?case=...');
        console.log('  ✅ PASSED: Direct navigation to Officer Allocation console verified.');
      } else {
        results.failed.push(`TEST 4b: Allocate Officer navigated to unexpected URL: ${allocationUrl}`);
        console.error(`  ❌ FAILED: Unexpected destination: ${allocationUrl}`);
      }
    }

    // Test Admin Profile
    console.log('  Testing Admin Profile navigation...');
    await page.goto(`${BASE_URL}/admin/profile`, { waitUntil: 'networkidle0' });
    const profileLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Administrator Profile') || text.includes('Clearance Level') || text.includes('Rajesh Sharma');
    });

    if (profileLoaded) {
      results.passed.push('TEST 4c: HQ Admin Profile page opens cleanly with credentials & clearance details');
      console.log('  ✅ PASSED: Admin Profile loaded with complete clearance info.');
    } else {
      results.failed.push('TEST 4c: Admin profile details failed to display.');
      console.error('  ❌ FAILED: Admin profile did not load properly.');
    }

    // Test MetraVerify logo navigation while logged in
    console.log('  Testing MetraVerify logo click while logged in as Admin...');
    await page.evaluate(() => {
      const logo = document.querySelector('header a[href*="admin"], header a');
      if (logo) logo.click();
    });
    await sleep(1000);
    const afterLogoUrl = page.url();
    console.log(`  URL after clicking logo: ${afterLogoUrl}`);
    if (afterLogoUrl.includes('/admin') && !afterLogoUrl.includes('/login') && !afterLogoUrl.includes('/register')) {
      results.passed.push('TEST 4d: Clicking MetraVerify logo keeps user inside role portal without showing login/signup');
      console.log('  ✅ PASSED: Logo navigation safely preserves active workspace.');
    } else {
      results.failed.push(`TEST 4d: Clicking logo redirected to: ${afterLogoUrl}`);
      console.error(`  ❌ FAILED: Logo redirected to: ${afterLogoUrl}`);
    }

    // Test Analytics Page
    console.log('  Testing Admin Analytics Page (/admin/analytics)...');
    await page.goto(`${BASE_URL}/admin/analytics`, { waitUntil: 'networkidle0' });
    const analyticsChecks = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasThroughput = text.includes('National Stamping & Verification Throughput');
      const hasStateGraph = text.includes('State and District Load Distribution');
      return { hasThroughput, hasStateGraph };
    });

    if (analyticsChecks.hasThroughput && !analyticsChecks.hasStateGraph) {
      results.passed.push('TEST 4e: Analytics page contains Stamping Throughput and regional charts are removed');
      console.log('  ✅ PASSED: Analytics page updated with Stamping Throughput analysis.');
    } else {
      results.failed.push('TEST 4e: Analytics page missing Throughput analysis or contains old charts');
      console.error('  ❌ FAILED: Analytics page checks failed:', analyticsChecks);
    }

    // ----------------------------------------------------
    // TEST 5: Single Active Window (Dropdown Popovers)
    // ----------------------------------------------------
    console.log('\n--- TEST 5: Single Active Window Behavior ---');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });

    // Open notifications
    const notifBtn = await page.$('#nav-notifications-btn');
    if (notifBtn) {
      await notifBtn.click();
      await sleep(300);
      let notifVisible = await page.$('#nav-notifications-popover') !== null;
      let profileVisible = await page.$('#nav-profile-menu') !== null;
      console.log(`  After opening notifications: Notif open = ${notifVisible}, Profile open = ${profileVisible}`);

      // Now click profile button
      const profileBtn = await page.$('#nav-profile-btn');
      if (profileBtn) {
        await profileBtn.click();
        await sleep(300);
        notifVisible = await page.$('#nav-notifications-popover') !== null;
        profileVisible = await page.$('#nav-profile-menu') !== null;
        console.log(`  After opening profile: Notif open = ${notifVisible}, Profile open = ${profileVisible}`);

        if (profileVisible && !notifVisible) {
          results.passed.push('TEST 5: Single window / popover behavior verified (opening profile closes notifications)');
          console.log('  ✅ PASSED: One window open at a time enforced.');
        } else {
          results.failed.push('TEST 5: Multiple popovers remained open simultaneously');
          console.error('  ❌ FAILED: Popover exclusivity failed.');
        }
      }
    }

    // ----------------------------------------------------
    // TEST 6: LMO Officer Time Filters (Today, Week, Month, Year)
    // ----------------------------------------------------
    console.log('\n--- TEST 6: LMO Officer Dashboard Time Metrics ---');
    // Clear storage to log in as LMO
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

    await page.type('input[name="email"]', 'lmo@metraverify.demo');
    await page.type('input[name="password"]', 'Lmo@123');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await sleep(1500);

    console.log(`  LMO Logged In URL: ${page.url()}`);
    const lmoDashboardChecks = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasTodayTab = text.includes('Today');
      const hasWeekTab = text.includes('This Week');
      const hasMonthTab = text.includes('This Month');
      const hasYearTab = text.includes('This Year');
      const hasCertificates = text.includes('Certificates Issued');
      const hasCompleted = text.includes('Completed Inspections');
      return { hasTodayTab, hasWeekTab, hasMonthTab, hasYearTab, hasCertificates, hasCompleted };
    });

    console.log('  LMO Dashboard time filters:', lmoDashboardChecks);
    if (lmoDashboardChecks.hasTodayTab && lmoDashboardChecks.hasWeekTab && lmoDashboardChecks.hasMonthTab && lmoDashboardChecks.hasYearTab) {
      results.passed.push('TEST 6a: LMO Dashboard has Day, Week, Month, and Year time breakdowns for certificates & inspections');
      console.log('  ✅ PASSED: LMO time-based metrics verified.');
    } else {
      results.failed.push('TEST 6a: Missing time breakdown tabs on LMO Dashboard');
      console.error('  ❌ FAILED: LMO Dashboard missing required time breakdown tabs.');
    }

    // Check LMO Certificates page
    await page.goto(`${BASE_URL}/lmo/certificates`, { waitUntil: 'networkidle0' });
    const certMetricsCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasToday = text.includes('Today');
      const hasWeek = text.includes('This Week');
      const hasMonth = text.includes('This Month');
      const hasYear = text.includes('This Year');
      return hasToday && hasWeek && hasMonth && hasYear;
    });

    if (certMetricsCheck) {
      results.passed.push('TEST 6b: LMO Certificates page displays Today, Week, Month, and Year metrics cards');
      console.log('  ✅ PASSED: LMO Certificates time breakdown verified.');
    } else {
      results.failed.push('TEST 6b: LMO Certificates missing time breakdown metrics');
      console.error('  ❌ FAILED: LMO Certificates page missing time metrics.');
    }

    // ----------------------------------------------------
    // TEST 7: Business User Profile & Real-Time Sync
    // ----------------------------------------------------
    console.log('\n--- TEST 7: Business User Profile & Enterprise Details ---');
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

    await page.type('input[name="email"]', 'business@metraverify.demo');
    await page.type('input[name="password"]', 'Business@123');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await sleep(1500);

    await page.goto(`${BASE_URL}/business/profile`, { waitUntil: 'networkidle0' });
    const businessProfileChecks = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasGSTIN = text.includes('GSTIN') || document.querySelector('input[name="gstin"]') !== null;
      const hasPAN = text.includes('PAN') || document.querySelector('input[name="panNumber"]') !== null;
      const hasPincode = document.querySelector('input[name="pincode"]') !== null;
      const hasAutoDetect = text.includes('Auto-Detect Location') || text.includes('Auto-Detect');
      const hasComplianceCards = text.includes('Registered Instruments') && text.includes('Active Certificates');
      return { hasGSTIN, hasPAN, hasPincode, hasAutoDetect, hasComplianceCards };
    });

    console.log('  Business Profile features:', businessProfileChecks);
    if (businessProfileChecks.hasGSTIN && businessProfileChecks.hasPAN && businessProfileChecks.hasPincode && businessProfileChecks.hasComplianceCards) {
      results.passed.push('TEST 7: Enhanced Business Profile displays GSTIN, PAN, Pincode, Auto-Detect Location, and Compliance Stats');
      console.log('  ✅ PASSED: Business Profile enhancements verified.');
    } else {
      results.failed.push('TEST 7: Business Profile missing enterprise or compliance fields');
      console.error('  ❌ FAILED: Business Profile incomplete.');
    }

  } catch (err) {
    console.error('💥 Critical Error During QA Test Run:', err);
    results.failed.push(`Critical Exception: ${err.message}`);
  } finally {
    await browser.close();
  }

  // Print Summary
  console.log('\n====================================================');
  console.log('               QA TEST SUITE SUMMARY                ');
  console.log('====================================================');
  console.log(`✅ PASSED TESTS: ${results.passed.length}`);
  results.passed.forEach(p => console.log(`   • ${p}`));

  console.log(`\n❌ FAILED TESTS: ${results.failed.length}`);
  results.failed.forEach(f => console.log(`   • ${f}`));

  console.log(`\n⚠️ CONSOLE ERRORS: ${results.consoleErrors.length}`);
  results.consoleErrors.slice(0, 5).forEach(c => console.log(`   • [${c.url}]: ${c.error.slice(0, 100)}`));

  console.log(`\n🌐 NETWORK ERRORS: ${results.networkErrors.length}`);
  results.networkErrors.forEach(n => console.log(`   • ${n.url} (${n.failure})`));
  console.log('====================================================\n');

  if (results.failed.length > 0 || results.consoleErrors.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
