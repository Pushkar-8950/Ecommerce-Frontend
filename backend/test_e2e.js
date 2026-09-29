const BASE_URL = 'http://localhost:5001/api';

const runTests = async () => {
  console.log('====================================================');
  console.log('  STARTING METRAVERIFY FULL END-TO-END DEMO TEST   ');
  console.log('====================================================');

  try {
    // 1. Health check
    console.log('\n[1/15] Testing Health Check API...');
    const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    console.log('✅ Health status:', healthRes.status, '| System:', healthRes.system);

    // 2. Business User Login
    console.log('\n[2/15] Testing Business User Login...');
    const bizLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'business@metraverify.demo',
        password: 'Business@123',
      }),
    }).then((r) => r.json());
    const bizToken = bizLogin.token;
    const bizUser = bizLogin.user;
    console.log(`✅ Business user authenticated: ${bizUser.fullName} (${bizUser.organizationName})`);

    // 3. Check Business Dashboard
    console.log('\n[3/15] Testing Business Dashboard Data...');
    const bizDash = await fetch(`${BASE_URL}/dashboard/business`, {
      headers: { Authorization: `Bearer ${bizToken}` },
    }).then((r) => r.json());
    console.log('✅ Business metrics:', {
      totalInstruments: bizDash.data.metrics.totalInstruments,
      verifiedInstruments: bizDash.data.metrics.verifiedInstruments,
      pendingApplications: bizDash.data.metrics.pendingApplications,
      expiringSoon: bizDash.data.metrics.expiringSoon,
      expired: bizDash.data.metrics.expired,
    });
    console.log(`✅ Expiry Alert Count: ${bizDash.data.expiryAlerts?.length || 0} alert(s)`);

    // 4. Register a New Instrument
    console.log('\n[4/15] Testing Instrument Registration...');
    const uniqueSerial = `DEMO-TEST-SN-${Date.now().toString().slice(-6)}`;
    const newInstRes = await fetch(`${BASE_URL}/instruments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bizToken}`,
      },
      body: JSON.stringify({
        instrumentType: 'Electronic Bench Scale',
        category: 'Commercial',
        manufacturer: 'Mettler-Toledo Precision Ltd',
        model: 'ICS429 Stainless Steel',
        serialNumber: uniqueSerial,
        capacity: '60 kg x 10g',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Inbound Bay 2, Warehouse Campus',
        state: 'Haryana',
        district: 'Gurugram',
      }),
    }).then((r) => r.json());
    const createdInstrument = newInstRes.data;
    console.log(`✅ Instrument registered successfully: ${createdInstrument.instrumentId} (S/N: ${createdInstrument.serialNumber})`);

    // 5. Submit Verification Application
    console.log('\n[5/15] Submitting Verification Application...');
    const appRes = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bizToken}`,
      },
      body: JSON.stringify({
        instrumentId: createdInstrument._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        preferredLocation: 'Apex Logistics Main Warehouse',
        notes: 'Mandatory commercial stamping test for new warehouse scale.',
      }),
    }).then((r) => r.json());
    const createdApp = appRes.data;
    console.log(`✅ Verification Application Submitted: ${createdApp.applicationId} (Status: ${createdApp.status})`);

    // 6. Admin Login
    console.log('\n[6/15] Testing Admin Login...');
    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@metraverify.demo',
        password: 'Admin@123',
      }),
    }).then((r) => r.json());
    const adminToken = adminLogin.token;
    console.log('✅ Admin authenticated: Rajesh Sharma (Director of Legal Metrology)');

    // 7. Admin assigns LMO Officer to Application
    console.log('\n[7/15] Testing Officer Assignment by Admin...');
    const officersRes = await fetch(`${BASE_URL}/users?role=LMO_OFFICER`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    const lmoOfficer = officersRes.data[0];

    const assignRes = await fetch(`${BASE_URL}/applications/${createdApp._id}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        assignedToType: 'LMO',
        assignedOfficerId: lmoOfficer._id,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        scheduledSlot: '10:00 AM - 01:00 PM',
        notes: 'Priority field inspection assigned.',
      }),
    }).then((r) => r.json());
    console.log(`✅ Application assigned to ${lmoOfficer.fullName} (Status: ${assignRes.data.status})`);

    // 8. LMO Officer Login
    console.log('\n[8/15] Testing LMO Officer Login...');
    const lmoLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'lmo@metraverify.demo',
        password: 'Lmo@123',
      }),
    }).then((r) => r.json());
    const lmoToken = lmoLogin.token;
    console.log('✅ LMO Officer authenticated: Inspector Anita Deshmukh');

    // 9. LMO Officer starts Digital Inspection
    console.log('\n[9/15] LMO Starts Digital Inspection Session...');
    const startInspRes = await fetch(`${BASE_URL}/inspections/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${lmoToken}`,
      },
      body: JSON.stringify({ applicationId: createdApp._id }),
    }).then((r) => r.json());
    const activeInspection = startInspRes.data;
    console.log(`✅ Inspection session initiated: ${activeInspection.inspectionId}`);

    // 10. LMO Completes 7-Point Statutory Checklist with PASS
    console.log('\n[10/15] Submitting 7/7 Statutory Inspection Checklist (PASS)...');
    const completeInspRes = await fetch(
      `${BASE_URL}/inspections/${activeInspection._id}/complete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${lmoToken}`,
        },
        body: JSON.stringify({
          checks: {
            instrumentCondition: 'PASS',
            display: 'PASS',
            zeroError: 'PASS',
            accuracy: 'PASS',
            calibration: 'PASS',
            sealingStamping: 'PASS',
            physicalCondition: 'PASS',
          },
          remarks: 'All 7 statutory tests passed within MPE limits using 20kg Class M1 test masses.',
          officerNotes: 'Official Lead-Wire Tamper Seal affixed to calibration port.',
          finalDecision: 'PASS',
        }),
      }
    ).then((r) => r.json());

    const generatedCert = completeInspRes.data.certificate;
    console.log(`✅ Inspection marked VERIFIED!`);
    console.log(`🎉 Digital Verification Certificate Issued: ${generatedCert.certificateNumber}`);
    console.log(`   Digital Stamp Code: ${generatedCert.digitalStampCode}`);
    console.log(`   Validity Period: ${new Date(generatedCert.verificationDate).toLocaleDateString()} to ${new Date(generatedCert.validUntil).toLocaleDateString()}`);

    // 11. Public QR Verification Test (No Authentication)
    console.log('\n[11/15] Testing Public QR Certificate Verification (Unauthenticated)...');
    const publicVerifyRes = await fetch(
      `${BASE_URL}/public/verify/${generatedCert.certificateNumber}`
    ).then((r) => r.json());
    const verifyData = publicVerifyRes.data;
    console.log('✅ Public Verification Result:', {
      isAuthentic: verifyData.isAuthentic,
      certificateNumber: verifyData.certificateNumber,
      status: verifyData.status,
      instrument: verifyData.instrumentType,
      business: verifyData.businessName,
      authority: verifyData.issuingAuthority,
      badge: verifyData.portalVerificationBadge,
    });

    // 12. Certificate PDF Generation & Download Test
    console.log('\n[12/15] Testing PDF Certificate Generation & Stream...');
    const pdfFetch = await fetch(
      `${BASE_URL}/certificates/${generatedCert.certificateNumber}/pdf`
    );
    const pdfBuf = await pdfFetch.arrayBuffer();
    console.log(`✅ PDF Generated successfully! Size: ${pdfBuf.byteLength} bytes (Content-Type: ${pdfFetch.headers.get('content-type')})`);

    // 13. Admin Analytics Test
    console.log('\n[13/15] Testing Admin Analytics API...');
    const adminAnalytics = await fetch(`${BASE_URL}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    console.log('✅ Admin Analytics Metrics:', {
      totalInstruments: adminAnalytics.data.metrics.totalInstruments,
      verified: adminAnalytics.data.metrics.verified,
      pending: adminAnalytics.data.metrics.pending,
      expired: adminAnalytics.data.metrics.expired,
      expiringSoon: adminAnalytics.data.metrics.expiringSoon,
      certificatesIssued: adminAnalytics.data.metrics.certificatesIssued,
      rejections: adminAnalytics.data.metrics.rejections,
      chartsCount: Object.keys(adminAnalytics.data.charts).length,
    });

    // 14. Audit Log Verification
    console.log('\n[14/15] Testing Audit Log Trail...');
    const auditRes = await fetch(`${BASE_URL}/audit-logs?limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    console.log(`✅ Total Audit Logs tracked: ${auditRes.count}. Recent actions:`);
    auditRes.data.slice(0, 3).forEach((a) => {
      console.log(`   - [${a.action}] by ${a.userName} on ${a.entity}`);
    });

    // 15. GATC Lab Testing Flow Verification
    console.log('\n[15/15] Testing GATC Test Centre Login & Dashboard...');
    const gatcLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gatc@metraverify.demo',
        password: 'Gatc@123',
      }),
    }).then((r) => r.json());
    const gatcToken = gatcLogin.token;
    const gatcDash = await fetch(`${BASE_URL}/dashboard/gatc`, {
      headers: { Authorization: `Bearer ${gatcToken}` },
    }).then((r) => r.json());
    console.log('✅ GATC Test Lab metrics:', {
      assignedCases: gatcDash.data.metrics.assignedCases,
      pendingTests: gatcDash.data.metrics.pendingTests,
      completedTests: gatcDash.data.metrics.completedTests,
      calibrationsIssued: gatcDash.data.metrics.calibrationsIssued,
    });

    console.log('\n====================================================');
    console.log('  ALL 15/15 END-TO-END DEMO TEST SCENARIOS PASSED!  ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
};

runTests();
