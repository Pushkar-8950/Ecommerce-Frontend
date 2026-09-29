import mongoose from 'mongoose';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import User from '../models/User.js';
import Instrument from '../models/Instrument.js';
import VerificationApplication from '../models/VerificationApplication.js';
import Inspection from '../models/Inspection.js';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import GATC from '../models/GATC.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/metraverify';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected.');

    console.log('[Seed] Purging existing demo collections...');
    await Promise.all([
      User.deleteMany({}),
      Instrument.deleteMany({}),
      VerificationApplication.deleteMany({}),
      Inspection.deleteMany({}),
      Certificate.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
      GATC.deleteMany({}),
    ]);
    console.log('[Seed] Collections cleared.');

    // 1. Create Users
    console.log('[Seed] Creating demo users...');
    const usersData = [
      // P0 Demo Accounts
      {
        fullName: 'Rajesh Sharma (Admin)',
        email: 'admin@metraverify.demo',
        password: 'Admin@123',
        phone: '+91 98101 22334',
        role: 'ADMIN',
        organizationName: 'Legal Metrology Department, HQ',
        address: 'Vikas Bhawan, IP Estate',
        state: 'Delhi',
        district: 'Central Delhi',
        designation: 'Director of Legal Metrology',
      },
      {
        fullName: 'Vikram Malhotra',
        email: 'business@metraverify.demo',
        password: 'Business@123',
        phone: '+91 98711 55667',
        role: 'BUSINESS_USER',
        organizationName: 'Apex Logistics & Agro Warehousing Pvt Ltd',
        address: 'Plot 45, Udyog Vihar Phase 4',
        state: 'Haryana',
        district: 'Gurugram',
      },
      {
        fullName: 'Inspector Anita Deshmukh',
        email: 'lmo@metraverify.demo',
        password: 'Lmo@123',
        phone: '+91 99200 44556',
        role: 'LMO_OFFICER',
        organizationName: 'Delhi Legal Metrology Circle 2',
        address: 'District Administrative Complex, Okhla',
        state: 'Delhi',
        district: 'South Delhi',
        designation: 'Senior Legal Metrology Officer',
        department: 'Department of Weights & Measures, Delhi',
      },
      {
        fullName: 'Dr. Sandeep Vardhan',
        email: 'gatc@metraverify.demo',
        password: 'Gatc@123',
        phone: '+91 98290 88990',
        role: 'GATC',
        organizationName: 'National Calibration & Metrology Test Centre',
        address: 'RIICO Industrial Area, Mansarovar',
        state: 'Rajasthan',
        district: 'Jaipur',
        designation: 'Lead Metrologist & Centre Head',
      },
      // Additional Realistic Users
      {
        fullName: 'Suresh Singhania',
        email: 'suresh.retail@metraverify.demo',
        password: 'Business@123',
        phone: '+91 98112 33445',
        role: 'BUSINESS_USER',
        organizationName: 'Singhania Jewellers & Bullion Mart',
        address: 'Dariba Kalan, Chandni Chowk',
        state: 'Delhi',
        district: 'North Delhi',
      },
      {
        fullName: 'Harpreet Singh Dhillon',
        email: 'harpreet.fuels@metraverify.demo',
        password: 'Business@123',
        phone: '+91 98880 12345',
        role: 'BUSINESS_USER',
        organizationName: 'Dhillon Highway Petroleum & Energy Hub',
        address: 'GT Karnal Road, NH-44',
        state: 'Haryana',
        district: 'Panipat',
      },
      {
        fullName: 'Pradeep Goel',
        email: 'pradeep.mandi@metraverify.demo',
        password: 'Business@123',
        phone: '+91 94140 77889',
        role: 'BUSINESS_USER',
        organizationName: 'Kisan Krishi Grain Mandi Weighing Depot',
        address: 'Anaj Mandi, Sector 9',
        state: 'Haryana',
        district: 'Karnal',
      },
      {
        fullName: 'Rameshwar Prasad Yadav',
        email: 'rameshwar.mills@metraverify.demo',
        password: 'Business@123',
        phone: '+91 94500 22334',
        role: 'BUSINESS_USER',
        organizationName: 'Avadh Sugar & Heavy Agro Industries',
        address: 'Industrial Area, Transport Nagar',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
      },
      {
        fullName: 'Officer Manoj K. Verma',
        email: 'manoj.lmo@metraverify.demo',
        password: 'Lmo@123',
        phone: '+91 98188 99887',
        role: 'LMO_OFFICER',
        organizationName: 'Gurugram Weights & Measures Sub-division',
        address: 'Mini Secretariat, Civil Lines',
        state: 'Haryana',
        district: 'Gurugram',
        designation: 'Assistant Controller, Legal Metrology',
        department: 'Government of Haryana',
      },
      {
        fullName: 'Inspector Priya Saxena',
        email: 'priya.lmo@metraverify.demo',
        password: 'Lmo@123',
        phone: '+91 97110 33221',
        role: 'LMO_OFFICER',
        organizationName: 'Noida Industrial Metrology Enforcement Wing',
        address: 'Sector 6 Administrative Block',
        state: 'Uttar Pradesh',
        district: 'Gautam Buddha Nagar',
        designation: 'Legal Metrology Officer (Commercial)',
        department: 'Government of Uttar Pradesh',
      },
      {
        fullName: 'Alwar Precision Testing Lab',
        email: 'alwar.gatc@metraverify.demo',
        password: 'Gatc@123',
        phone: '+91 94141 99881',
        role: 'GATC',
        organizationName: 'Alwar Regional Instrument Testing Laboratory',
        address: 'MIA Extension, Alwar',
        state: 'Rajasthan',
        district: 'Alwar',
        designation: 'GATC Technical Director',
      },
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seed] ${createdUsers.length} users created.`);

    const adminUser = createdUsers[0];
    const bizUser1 = createdUsers[1]; // Apex Logistics
    const lmo1 = createdUsers[2];      // Anita Deshmukh
    const gatc1 = createdUsers[3];     // Dr. Sandeep
    const bizJewel = createdUsers[4];  // Singhania
    const bizFuel = createdUsers[5];   // Dhillon Fuels
    const bizMandi = createdUsers[6];  // Kisan Krishi
    const bizSugar = createdUsers[7];  // Avadh Sugar
    const lmo2 = createdUsers[8];      // Manoj Verma
    const lmo3 = createdUsers[9];      // Priya Saxena

    // 2. Create GATC Centres
    console.log('[Seed] Creating GATC facilities...');
    await GATC.create([
      {
        centreName: 'National Calibration & Metrology Test Centre',
        centreCode: 'GATC-RAJ-01',
        state: 'Rajasthan',
        district: 'Jaipur',
        address: 'RIICO Industrial Area, Mansarovar, Jaipur - 302020',
        accreditationNo: 'NABL/LM/TC/2024/098',
        contactPerson: 'Dr. Sandeep Vardhan',
        phone: '+91 98290 88990',
        email: 'gatc@metraverify.demo',
        active: true,
      },
      {
        centreName: 'Alwar Regional Instrument Testing Laboratory',
        centreCode: 'GATC-RAJ-02',
        state: 'Rajasthan',
        district: 'Alwar',
        address: 'MIA Extension, Alwar - 301030',
        accreditationNo: 'NABL/LM/TC/2023/112',
        contactPerson: 'Er. Kailash Meena',
        phone: '+91 94141 99881',
        email: 'alwar.gatc@metraverify.demo',
        active: true,
      },
      {
        centreName: 'Delhi Flow Meter & Fuel Calibration Facility',
        centreCode: 'GATC-DEL-03',
        state: 'Delhi',
        district: 'South West Delhi',
        address: 'Bijwasan Terminal Road, New Delhi',
        accreditationNo: 'NABL/LM/TC/2025/044',
        contactPerson: 'Ms. Sunita Rao',
        phone: '+91 98110 88776',
        email: 'delhi.flow@gatc.demo',
        active: true,
      },
    ]);

    // 3. Create 15 Realistic Instruments
    console.log('[Seed] Registering instruments...');
    const now = new Date();
    const addDays = (d, days) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };

    const instrumentsData = [
      // 1. Valid Electronic Weighbridge (Apex Logistics)
      {
        instrumentId: 'INS-2026-000101',
        instrumentType: 'Electronic Weighbridge',
        category: 'Industrial',
        manufacturer: 'Essae-Teraoka Ltd',
        model: 'WB-60T Pitless',
        serialNumber: 'ESS-2024-WB-9912',
        capacity: '60 Metric Tonnes x 10kg',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Warehouse Bay 3, Udyog Vihar Phase 4',
        state: 'Haryana',
        district: 'Gurugram',
        owner: bizUser1._id,
        purchaseDate: new Date('2024-03-10'),
        lastVerificationDate: new Date('2026-04-15'),
        nextVerificationDueDate: addDays(now, 200), // Valid
        status: 'VERIFIED',
      },
      // 2. Expiring Soon Weighing Scale (Apex Logistics) -> 18 days left!
      {
        instrumentId: 'INS-2026-000102',
        instrumentType: 'Platform Scale',
        category: 'Commercial',
        manufacturer: 'Avery India',
        model: 'Avery Heavy Platform E-300',
        serialNumber: 'AVY-2023-PS-4431',
        capacity: '300 kg x 50g',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Loading Dock Alpha, Apex Logistics Depot',
        state: 'Haryana',
        district: 'Gurugram',
        owner: bizUser1._id,
        purchaseDate: new Date('2023-08-14'),
        lastVerificationDate: addDays(now, -347),
        nextVerificationDueDate: addDays(now, 18), // EXPIRING SOON!
        status: 'VERIFIED',
      },
      // 3. Expired Counter Scale (Apex Logistics) -> 12 days ago
      {
        instrumentId: 'INS-2026-000103',
        instrumentType: 'Counter Scale',
        category: 'Commercial',
        manufacturer: 'Eagle Scales (Phoenix)',
        model: 'Eagle Precision Digital DS-30',
        serialNumber: 'EAG-2022-CS-1190',
        capacity: '30 kg x 2g',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Billing Counter 1, Apex Dispatch Hub',
        state: 'Haryana',
        district: 'Gurugram',
        owner: bizUser1._id,
        purchaseDate: new Date('2022-11-20'),
        lastVerificationDate: addDays(now, -377),
        nextVerificationDueDate: addDays(now, -12), // EXPIRED!
        status: 'EXPIRED',
      },
      // 4. Pending Verification Application (Apex Logistics)
      {
        instrumentId: 'INS-2026-000104',
        instrumentType: 'Non-automatic Weighing Instrument',
        category: 'Commercial',
        manufacturer: 'Mettler Toledo India',
        model: 'BBA231 Multi-range',
        serialNumber: 'MT-2025-NA-7721',
        capacity: '150 kg x 20g',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Sorting Conveyor Line 2, Udyog Vihar',
        state: 'Haryana',
        district: 'Gurugram',
        owner: bizUser1._id,
        purchaseDate: new Date('2025-06-01'),
        status: 'PENDING_VERIFICATION',
      },
      // 5. Newly Registered (Apex Logistics)
      {
        instrumentId: 'INS-2026-000105',
        instrumentType: 'Spring Balance / Crane Scale',
        category: 'Industrial',
        manufacturer: 'Sansui Weighing Systems',
        model: 'OCS-5T Wireless Crane Scale',
        serialNumber: 'SAN-2026-CR-0023',
        capacity: '5000 kg x 2kg',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Overhead Gantry, Warehouse Bay 1',
        state: 'Haryana',
        district: 'Gurugram',
        owner: bizUser1._id,
        purchaseDate: new Date('2026-08-10'),
        status: 'REGISTERED',
      },
      // 6. Precision Gold Balance (Singhania Jewellers) - VALID
      {
        instrumentId: 'INS-2026-000106',
        instrumentType: 'Precision Gold Balance',
        category: 'Jewellery / Precision',
        manufacturer: 'Sartorius India',
        model: 'Entris II Analytical Class II',
        serialNumber: 'SAR-2025-GLD-8822',
        capacity: '620 g x 1 mg',
        accuracyClass: 'Class II (High)',
        locationAddress: 'Main Showroom Counter A, Dariba Kalan',
        state: 'Delhi',
        district: 'North Delhi',
        owner: bizJewel._id,
        purchaseDate: new Date('2025-01-10'),
        lastVerificationDate: new Date('2026-02-14'),
        nextVerificationDueDate: addDays(now, 140),
        status: 'VERIFIED',
      },
      // 7. Electronic Carat Balance (Singhania Jewellers) - EXPIRING SOON (8 days left)
      {
        instrumentId: 'INS-2026-000107',
        instrumentType: 'Electronic Carat Balance',
        category: 'Jewellery / Precision',
        manufacturer: 'Shimadzu Corp',
        model: 'AUW220D Dual-range Micro',
        serialNumber: 'SHI-2024-CRT-4040',
        capacity: '220 ct x 0.001 ct',
        accuracyClass: 'Class I (Special)',
        locationAddress: 'Gemstone Evaluation Chamber, Chandni Chowk',
        state: 'Delhi',
        district: 'North Delhi',
        owner: bizJewel._id,
        purchaseDate: new Date('2024-05-18'),
        lastVerificationDate: addDays(now, -357),
        nextVerificationDueDate: addDays(now, 8), // 8 days left!
        status: 'VERIFIED',
      },
      // 8. Fuel Dispensing Unit 1 (Dhillon Fuels) - VALID
      {
        instrumentId: 'INS-2026-000108',
        instrumentType: 'Fuel Dispenser (Petrol / MS)',
        category: 'Petroleum',
        manufacturer: 'Tokheim India Ltd',
        model: 'Quantium 510 Multi-hose',
        serialNumber: 'TOK-2024-PET-6651',
        capacity: '50 Litres/min',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Island No. 1, GT Karnal Road Retail Outlet',
        state: 'Haryana',
        district: 'Panipat',
        owner: bizFuel._id,
        purchaseDate: new Date('2024-02-22'),
        lastVerificationDate: new Date('2026-05-10'),
        nextVerificationDueDate: addDays(now, 225),
        status: 'VERIFIED',
      },
      // 9. Fuel Dispenser Unit 2 (Dhillon Fuels) - SCHEDULED
      {
        instrumentId: 'INS-2026-000109',
        instrumentType: 'Fuel Dispenser (High Speed Diesel)',
        category: 'Petroleum',
        manufacturer: 'Gilbarco Veeder-Root',
        model: 'Horizon High Flow Diesel',
        serialNumber: 'GIL-2023-DSL-1204',
        capacity: '80 Litres/min',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Heavy Truck Fueling Bay 2, NH-44',
        state: 'Haryana',
        district: 'Panipat',
        owner: bizFuel._id,
        purchaseDate: new Date('2023-10-15'),
        status: 'SCHEDULED',
      },
      // 10. Heavy Agricultural Weighbridge (Kisan Mandi) - VALID
      {
        instrumentId: 'INS-2026-000110',
        instrumentType: 'Electronic Weighbridge',
        category: 'Industrial',
        manufacturer: 'Avery India',
        model: 'BridgeMont Steel Deck 80T',
        serialNumber: 'AVY-2024-AGR-8831',
        capacity: '80 Metric Tonnes x 10kg',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Gate No. 2 Inbound, New Grain Market',
        state: 'Haryana',
        district: 'Karnal',
        owner: bizMandi._id,
        purchaseDate: new Date('2024-04-01'),
        lastVerificationDate: new Date('2026-03-20'),
        nextVerificationDueDate: addDays(now, 175),
        status: 'VERIFIED',
      },
      // 11. Grain Hopper Scale (Kisan Mandi) - UNDER_INSPECTION
      {
        instrumentId: 'INS-2026-000111',
        instrumentType: 'Automatic Gravimetric Filling Instrument',
        category: 'Industrial',
        manufacturer: 'Chronos BTH India',
        model: 'E-55 Bagging System',
        serialNumber: 'CHR-2025-HOP-3301',
        capacity: '50 kg Bagging Unit',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Silo Packaging Shed 4, Karnal',
        state: 'Haryana',
        district: 'Karnal',
        owner: bizMandi._id,
        purchaseDate: new Date('2025-02-10'),
        status: 'UNDER_INSPECTION',
      },
      // 12. Sugar Mill Bagasse Weighbridge (Avadh Sugar) - VALID
      {
        instrumentId: 'INS-2026-000112',
        instrumentType: 'Electronic Weighbridge',
        category: 'Industrial',
        manufacturer: 'Essae-Teraoka Ltd',
        model: 'WB-100T Heavy Modular',
        serialNumber: 'ESS-2023-WB-5502',
        capacity: '100 Metric Tonnes x 20kg',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Cane Weighment Entry Point 1',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        owner: bizSugar._id,
        purchaseDate: new Date('2023-09-05'),
        lastVerificationDate: new Date('2026-01-18'),
        nextVerificationDueDate: addDays(now, 112),
        status: 'VERIFIED',
      },
      // 13. Heavy Liquid Sugar Flow Meter (Avadh Sugar) - REJECTED
      {
        instrumentId: 'INS-2026-000113',
        instrumentType: 'Industrial Coriolis Flow Meter',
        category: 'Industrial',
        manufacturer: 'Endress+Hauser India',
        model: 'Promass F 300 High Viscosity',
        serialNumber: 'EH-2024-FLW-9191',
        capacity: '200 Tonnes/hour',
        accuracyClass: 'Class II (High)',
        locationAddress: 'Molasses Pipeline Manifold, Transport Nagar',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        owner: bizSugar._id,
        purchaseDate: new Date('2024-07-20'),
        status: 'REJECTED',
      },
      // 14. Retail Supermarket Barcode Scale (Delhi Retail) - VALID
      {
        instrumentId: 'INS-2026-000114',
        instrumentType: 'Electronic Weighing Instrument',
        category: 'Retail',
        manufacturer: 'DIGI Teraoka',
        model: 'SM-5300 PC Scale with Printer',
        serialNumber: 'DIG-2025-RT-1144',
        capacity: '15 kg x 5g',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Fresh Produce Section, Select Citywalk',
        state: 'Delhi',
        district: 'South Delhi',
        owner: bizUser1._id,
        purchaseDate: new Date('2025-04-12'),
        lastVerificationDate: new Date('2026-05-02'),
        nextVerificationDueDate: addDays(now, 218),
        status: 'VERIFIED',
      },
      // 15. Medical Baby Scale (Healthcare Clinic) - EXPIRING SOON (24 days)
      {
        instrumentId: 'INS-2026-000115',
        instrumentType: 'Electronic Infant Weighing Scale',
        category: 'Healthcare',
        manufacturer: 'Seca Medical Scales',
        model: 'Seca 728 High Precision Class III',
        serialNumber: 'SEC-2024-MED-0988',
        capacity: '20 kg x 5g',
        accuracyClass: 'Class III (Medium)',
        locationAddress: 'Pediatrics Wing, Apollo Clinic DLF',
        state: 'Haryana',
        district: 'Gurugram',
        owner: bizUser1._id,
        purchaseDate: new Date('2024-09-01'),
        lastVerificationDate: addDays(now, -341),
        nextVerificationDueDate: addDays(now, 24), // 24 days left!
        status: 'VERIFIED',
      },
    ];

    const createdInstruments = [];
    for (const inst of instrumentsData) {
      const created = await Instrument.create(inst);
      createdInstruments.push(created);
    }
    console.log(`[Seed] ${createdInstruments.length} instruments registered.`);

    // 4. Create 12 Applications
    console.log('[Seed] Generating verification applications...');
    const applicationsData = [
      // 1. Completed & Certified: Apex Weighbridge (INS-2026-000101)
      {
        applicationId: 'APP-2026-001001',
        instrument: createdInstruments[0]._id,
        owner: bizUser1._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: new Date('2026-04-10'),
        preferredLocation: 'On-site Industrial Premise',
        notes: 'Annual verification required for new 60T pitless weighbridge.',
        status: 'CERTIFICATE_ISSUED',
        assignedToType: 'LMO',
        assignedOfficer: lmo1._id,
        scheduledDate: new Date('2026-04-15'),
        scheduledSlot: '10:00 AM - 01:00 PM',
        timeline: [
          { status: 'SUBMITTED', title: 'Application Submitted', comments: 'Initial application submitted online.', updatedBy: bizUser1._id, updatedByName: bizUser1.fullName, timestamp: new Date('2026-04-05') },
          { status: 'SCHEDULED', title: 'Inspection Scheduled', comments: 'Assigned to Inspector Anita Deshmukh.', updatedBy: adminUser._id, updatedByName: adminUser.fullName, timestamp: new Date('2026-04-08') },
          { status: 'INSPECTION', title: 'Digital Inspection Passed', comments: 'On-site test weights and eccentric load tests passed.', updatedBy: lmo1._id, updatedByName: lmo1.fullName, timestamp: new Date('2026-04-15') },
          { status: 'CERTIFICATE_ISSUED', title: 'Certificate Issued & Stamped', comments: 'Certificate CERT-2026-001001 digitally generated.', updatedBy: lmo1._id, updatedByName: lmo1.fullName, timestamp: new Date('2026-04-15') },
        ],
      },
      // 2. Completed & Certified: Singhania Gold Balance (INS-2026-000106)
      {
        applicationId: 'APP-2026-001002',
        instrument: createdInstruments[5]._id,
        owner: bizJewel._id,
        applicationType: 'RE_VERIFICATION',
        preferredDate: new Date('2026-02-10'),
        preferredLocation: 'Jewellery Showroom Bench',
        notes: 'Class II high-precision scale mandatory bullion verification.',
        status: 'CERTIFICATE_ISSUED',
        assignedToType: 'LMO',
        assignedOfficer: lmo1._id,
        scheduledDate: new Date('2026-02-14'),
        scheduledSlot: '11:00 AM - 01:00 PM',
        timeline: [
          { status: 'SUBMITTED', title: 'Application Submitted', comments: 'Re-verification request for Class II balance.', updatedBy: bizJewel._id, updatedByName: bizJewel.fullName, timestamp: new Date('2026-02-05') },
          { status: 'SCHEDULED', title: 'Scheduled with LMO', comments: 'Inspector Anita Deshmukh assigned.', updatedBy: adminUser._id, updatedByName: adminUser.fullName, timestamp: new Date('2026-02-08') },
          { status: 'CERTIFICATE_ISSUED', title: 'Digital Certificate Issued', comments: 'Standard F1 weights calibration verified.', updatedBy: lmo1._id, updatedByName: lmo1.fullName, timestamp: new Date('2026-02-14') },
        ],
      },
      // 3. Completed & Certified: Dhillon Fuel Dispenser (INS-2026-000108)
      {
        applicationId: 'APP-2026-001003',
        instrument: createdInstruments[7]._id,
        owner: bizFuel._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: new Date('2026-05-08'),
        status: 'CERTIFICATE_ISSUED',
        assignedToType: 'LMO',
        assignedOfficer: lmo2._id,
        scheduledDate: new Date('2026-05-10'),
        scheduledSlot: '02:00 PM - 05:00 PM',
        timeline: [
          { status: 'SUBMITTED', title: 'Application Submitted', comments: 'Fuel nozzle calibration request.', updatedBy: bizFuel._id, updatedByName: bizFuel.fullName, timestamp: new Date('2026-05-01') },
          { status: 'CERTIFICATE_ISSUED', title: 'Certificate Issued', comments: '5L & 10L volumetric prover test passed within +/-0.3% error limit.', updatedBy: lmo2._id, updatedByName: lmo2.fullName, timestamp: new Date('2026-05-10') },
        ],
      },
      // 4. Completed & Certified: Kisan Mandi Weighbridge (INS-2026-000110)
      {
        applicationId: 'APP-2026-001004',
        instrument: createdInstruments[9]._id,
        owner: bizMandi._id,
        applicationType: 'RE_VERIFICATION',
        preferredDate: new Date('2026-03-18'),
        status: 'CERTIFICATE_ISSUED',
        assignedToType: 'LMO',
        assignedOfficer: lmo2._id,
        scheduledDate: new Date('2026-03-20'),
        scheduledSlot: '09:00 AM - 12:00 PM',
        timeline: [
          { status: 'CERTIFICATE_ISSUED', title: 'Stamping Verified', comments: 'Karnal mandi weighbridge certified.', updatedBy: lmo2._id, updatedByName: lmo2.fullName, timestamp: new Date('2026-03-20') },
        ],
      },
      // 5. Completed & Certified: Avadh Sugar Mill (INS-2026-000112)
      {
        applicationId: 'APP-2026-001005',
        instrument: createdInstruments[11]._id,
        owner: bizSugar._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: new Date('2026-01-15'),
        status: 'CERTIFICATE_ISSUED',
        assignedToType: 'LMO',
        assignedOfficer: lmo3._id,
        scheduledDate: new Date('2026-01-18'),
        scheduledSlot: '10:00 AM - 02:00 PM',
        timeline: [
          { status: 'CERTIFICATE_ISSUED', title: 'Certificate Issued', comments: 'Heavy 100T weighbridge verification completed.', updatedBy: lmo3._id, updatedByName: lmo3.fullName, timestamp: new Date('2026-01-18') },
        ],
      },
      // 6. Completed & Certified: Supermarket Scale (INS-2026-000114)
      {
        applicationId: 'APP-2026-001006',
        instrument: createdInstruments[13]._id,
        owner: bizUser1._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: new Date('2026-05-01'),
        status: 'CERTIFICATE_ISSUED',
        assignedToType: 'LMO',
        assignedOfficer: lmo1._id,
        scheduledDate: new Date('2026-05-02'),
        scheduledSlot: '11:00 AM - 01:00 PM',
        timeline: [
          { status: 'CERTIFICATE_ISSUED', title: 'Verified and Stamped', comments: 'Digital barcode scale passed all tests.', updatedBy: lmo1._id, updatedByName: lmo1.fullName, timestamp: new Date('2026-05-02') },
        ],
      },
      // 7. Expiring Soon Instrument's Earlier Application: Platform Scale (INS-2026-000102)
      {
        applicationId: 'APP-2026-001007',
        instrument: createdInstruments[1]._id,
        owner: bizUser1._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: addDays(now, -350),
        status: 'CERTIFICATE_ISSUED',
        assignedToType: 'LMO',
        assignedOfficer: lmo1._id,
        scheduledDate: addDays(now, -347),
        timeline: [
          { status: 'CERTIFICATE_ISSUED', title: 'Certificate Issued (Expiring Soon)', comments: 'Valid for 1 year.', updatedBy: lmo1._id, updatedByName: lmo1.fullName, timestamp: addDays(now, -347) },
        ],
      },
      // 8. Expired Instrument's Past Application: Counter Scale (INS-2026-000103)
      {
        applicationId: 'APP-2026-001008',
        instrument: createdInstruments[2]._id,
        owner: bizUser1._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: addDays(now, -380),
        status: 'CERTIFICATE_ISSUED',
        assignedToType: 'LMO',
        assignedOfficer: lmo1._id,
        scheduledDate: addDays(now, -377),
        timeline: [
          { status: 'CERTIFICATE_ISSUED', title: 'Past Certificate Issued', comments: 'Stamping validity lapsed.', updatedBy: lmo1._id, updatedByName: lmo1.fullName, timestamp: addDays(now, -377) },
        ],
      },
      // 9. Rejected Application: Liquid Sugar Flow Meter (INS-2026-000113)
      {
        applicationId: 'APP-2026-001009',
        instrument: createdInstruments[12]._id,
        owner: bizSugar._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: new Date('2026-07-25'),
        status: 'REJECTED',
        assignedToType: 'GATC',
        assignedOfficer: gatc1._id,
        scheduledDate: new Date('2026-07-28'),
        rejectionReason: 'Flow meter zero repeatability exceeded Maximum Permissible Error (MPE) by +1.8%. Recalibration required.',
        timeline: [
          { status: 'SUBMITTED', title: 'Submitted', comments: 'Lab calibration application.', updatedBy: bizSugar._id, updatedByName: bizSugar.fullName, timestamp: new Date('2026-07-20') },
          { status: 'SCHEDULED', title: 'Scheduled for GATC Test', comments: 'Assigned to National Calibration Centre.', updatedBy: adminUser._id, updatedByName: adminUser.fullName, timestamp: new Date('2026-07-22') },
          { status: 'REJECTED', title: 'Verification Failed', comments: 'Coriolis tube drift observed. MPE failed.', updatedBy: gatc1._id, updatedByName: gatc1.fullName, timestamp: new Date('2026-07-28') },
        ],
      },
      // 10. Currently UNDER INSPECTION: Grain Hopper Scale (INS-2026-000111)
      {
        applicationId: 'APP-2026-001010',
        instrument: createdInstruments[10]._id,
        owner: bizMandi._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: addDays(now, -1),
        status: 'INSPECTION',
        assignedToType: 'LMO',
        assignedOfficer: lmo2._id,
        scheduledDate: now,
        scheduledSlot: '10:00 AM - 01:00 PM',
        timeline: [
          { status: 'SUBMITTED', title: 'Application Submitted', comments: 'Automatic filling scale test.', updatedBy: bizMandi._id, updatedByName: bizMandi.fullName, timestamp: addDays(now, -5) },
          { status: 'SCHEDULED', title: 'Scheduled with Officer Manoj Verma', comments: 'Inspector scheduled on-site.', updatedBy: adminUser._id, updatedByName: adminUser.fullName, timestamp: addDays(now, -2) },
          { status: 'INSPECTION', title: 'Inspection in Progress', comments: 'Officer currently on premises conducting gravimetric tests.', updatedBy: lmo2._id, updatedByName: lmo2.fullName, timestamp: now },
        ],
      },
      // 11. SCHEDULED: Fuel Dispenser Unit 2 (INS-2026-000109)
      {
        applicationId: 'APP-2026-001011',
        instrument: createdInstruments[8]._id,
        owner: bizFuel._id,
        applicationType: 'RE_VERIFICATION',
        preferredDate: addDays(now, 2),
        status: 'SCHEDULED',
        assignedToType: 'LMO',
        assignedOfficer: lmo2._id,
        scheduledDate: addDays(now, 2),
        scheduledSlot: '11:00 AM - 02:00 PM',
        timeline: [
          { status: 'SUBMITTED', title: 'Application Submitted', comments: 'Periodic diesel pump stamping.', updatedBy: bizFuel._id, updatedByName: bizFuel.fullName, timestamp: addDays(now, -3) },
          { status: 'SCHEDULED', title: 'Assigned to Inspector Manoj Verma', comments: 'Scheduled for field visit.', updatedBy: adminUser._id, updatedByName: adminUser.fullName, timestamp: addDays(now, -1) },
        ],
      },
      // 12. PENDING / SUBMITTED: Mettler Toledo Scale (INS-2026-000104) -> Ready for Admin demo assignment!
      {
        applicationId: 'APP-2026-001012',
        instrument: createdInstruments[3]._id,
        owner: bizUser1._id,
        applicationType: 'NEW_VERIFICATION',
        preferredDate: addDays(now, 4),
        preferredLocation: 'Apex Logistics Main Sorting Facility',
        notes: 'New multi-range sorting scale installed. Urgent verification requested for commercial operations.',
        status: 'SUBMITTED',
        timeline: [
          { status: 'SUBMITTED', title: 'Application Submitted', comments: 'Awaiting Admin review and Officer assignment.', updatedBy: bizUser1._id, updatedByName: bizUser1.fullName, timestamp: now },
        ],
      },
    ];

    const createdApps = [];
    for (const app of applicationsData) {
      const created = await VerificationApplication.create(app);
      createdApps.push(created);
    }
    console.log(`[Seed] ${createdApps.length} applications created.`);

    // 5. Create Inspections (8 inspections)
    console.log('[Seed] Recording inspections...');
    const inspectionsData = [
      // 1. Apex Weighbridge Inspection (Passed 7/7)
      {
        inspectionId: 'INSP-2026-000001',
        application: createdApps[0]._id,
        instrument: createdInstruments[0]._id,
        officer: lmo1._id,
        officerType: 'LMO_OFFICER',
        checks: {
          instrumentCondition: 'PASS',
          display: 'PASS',
          zeroError: 'PASS',
          accuracy: 'PASS',
          calibration: 'PASS',
          sealingStamping: 'PASS',
          physicalCondition: 'PASS',
        },
        passedChecks: 7,
        totalChecks: 7,
        remarks: 'All 7/7 statutory checks passed. Eccentricity test within 0.1% error band.',
        officerNotes: 'Lead wire security seal LM-SEAL-2026-NCT-9942 stamped onto load cell junction box.',
        finalResult: 'VERIFIED',
        completedAt: new Date('2026-04-15'),
      },
      // 2. Singhania Gold Balance Inspection (Passed 7/7)
      {
        inspectionId: 'INSP-2026-000002',
        application: createdApps[1]._id,
        instrument: createdInstruments[5]._id,
        officer: lmo1._id,
        officerType: 'LMO_OFFICER',
        checks: {
          instrumentCondition: 'PASS',
          display: 'PASS',
          zeroError: 'PASS',
          accuracy: 'PASS',
          calibration: 'PASS',
          sealingStamping: 'PASS',
          physicalCondition: 'PASS',
        },
        passedChecks: 7,
        totalChecks: 7,
        remarks: 'Analytical Class II accuracy verified with Class F1 certified test masses.',
        officerNotes: 'Anti-tamper holographic sticker applied to calibration button.',
        finalResult: 'VERIFIED',
        completedAt: new Date('2026-02-14'),
      },
      // 3. Dhillon Fuel Dispenser Inspection (Passed 7/7)
      {
        inspectionId: 'INSP-2026-000003',
        application: createdApps[2]._id,
        instrument: createdInstruments[7]._id,
        officer: lmo2._id,
        officerType: 'LMO_OFFICER',
        checks: {
          instrumentCondition: 'PASS',
          display: 'PASS',
          zeroError: 'PASS',
          accuracy: 'PASS',
          calibration: 'PASS',
          sealingStamping: 'PASS',
          physicalCondition: 'PASS',
        },
        passedChecks: 7,
        totalChecks: 7,
        remarks: 'Delivered exactly 10.015 Litres on 10L standard conical measure. Well within +/-25ml MPE.',
        officerNotes: 'Pulsar totalizer wire stamped with copper seal.',
        finalResult: 'VERIFIED',
        completedAt: new Date('2026-05-10'),
      },
      // 4. Kisan Mandi Weighbridge (Passed 7/7)
      {
        inspectionId: 'INSP-2026-000004',
        application: createdApps[3]._id,
        instrument: createdInstruments[9]._id,
        officer: lmo2._id,
        officerType: 'LMO_OFFICER',
        checks: {
          instrumentCondition: 'PASS',
          display: 'PASS',
          zeroError: 'PASS',
          accuracy: 'PASS',
          calibration: 'PASS',
          sealingStamping: 'PASS',
          physicalCondition: 'PASS',
        },
        passedChecks: 7,
        totalChecks: 7,
        remarks: '80T steel deck level confirmed, 20T verified test weights positioned.',
        finalResult: 'VERIFIED',
        completedAt: new Date('2026-03-20'),
      },
      // 5. Avadh Sugar Mill (Passed 7/7)
      {
        inspectionId: 'INSP-2026-000005',
        application: createdApps[4]._id,
        instrument: createdInstruments[11]._id,
        officer: lmo3._id,
        officerType: 'LMO_OFFICER',
        checks: {
          instrumentCondition: 'PASS',
          display: 'PASS',
          zeroError: 'PASS',
          accuracy: 'PASS',
          calibration: 'PASS',
          sealingStamping: 'PASS',
          physicalCondition: 'PASS',
        },
        passedChecks: 7,
        totalChecks: 7,
        remarks: 'Heavy agro weighbridge verified. Sealing stamped.',
        finalResult: 'VERIFIED',
        completedAt: new Date('2026-01-18'),
      },
      // 6. Supermarket Scale (Passed 7/7)
      {
        inspectionId: 'INSP-2026-000006',
        application: createdApps[5]._id,
        instrument: createdInstruments[13]._id,
        officer: lmo1._id,
        officerType: 'LMO_OFFICER',
        checks: {
          instrumentCondition: 'PASS',
          display: 'PASS',
          zeroError: 'PASS',
          accuracy: 'PASS',
          calibration: 'PASS',
          sealingStamping: 'PASS',
          physicalCondition: 'PASS',
        },
        passedChecks: 7,
        totalChecks: 7,
        remarks: 'Dual-interval price computing scale verified.',
        finalResult: 'VERIFIED',
        completedAt: new Date('2026-05-02'),
      },
      // 7. Liquid Sugar Flow Meter (Failed 5/7 -> REJECTED)
      {
        inspectionId: 'INSP-2026-000007',
        application: createdApps[8]._id,
        instrument: createdInstruments[12]._id,
        officer: gatc1._id,
        officerType: 'GATC',
        checks: {
          instrumentCondition: 'PASS',
          display: 'PASS',
          zeroError: 'FAIL',
          accuracy: 'FAIL',
          calibration: 'FAIL',
          sealingStamping: 'PENDING',
          physicalCondition: 'PASS',
        },
        passedChecks: 3,
        totalChecks: 7,
        remarks: 'Failed calibration & accuracy criteria. Coriolis density tube drift observed.',
        officerNotes: 'Rejected under Rule 14. Instrument must undergo factory recalibration before re-inspection.',
        finalResult: 'REJECTED',
        completedAt: new Date('2026-07-28'),
      },
      // 8. Currently In-Progress Inspection: Grain Hopper Scale
      {
        inspectionId: 'INSP-2026-000008',
        application: createdApps[9]._id,
        instrument: createdInstruments[10]._id,
        officer: lmo2._id,
        officerType: 'LMO_OFFICER',
        checks: {
          instrumentCondition: 'PASS',
          display: 'PASS',
          zeroError: 'PASS',
          accuracy: 'PENDING',
          calibration: 'PENDING',
          sealingStamping: 'PENDING',
          physicalCondition: 'PASS',
        },
        passedChecks: 3,
        totalChecks: 7,
        remarks: 'Initial physical checks completed. Waiting for 50kg standard test weights.',
        finalResult: 'IN_PROGRESS',
      },
    ];

    const createdInspections = [];
    for (const insp of inspectionsData) {
      const created = await Inspection.create(insp);
      createdInspections.push(created);
    }
    console.log(`[Seed] ${createdInspections.length} inspections created.`);

    // Link inspections back to applications
    for (let i = 0; i < createdInspections.length; i++) {
      const insp = createdInspections[i];
      await VerificationApplication.findByIdAndUpdate(insp.application, {
        inspection: insp._id,
      });
    }

    // 6. Generate 8 Digital Certificates with QR Codes
    console.log('[Seed] Generating digital verification certificates...');
    const certificatesToCreate = [
      // 1. Apex 60T Pitless Weighbridge (VALID)
      {
        certNum: 'CERT-2026-001001',
        inst: createdInstruments[0],
        app: createdApps[0],
        insp: createdInspections[0],
        owner: bizUser1,
        vDate: new Date('2026-04-15'),
        validUntil: addDays(new Date('2026-04-15'), 365),
        officer: lmo1,
        status: 'VALID',
        authority: 'Office of Controller of Legal Metrology, NCT of Delhi',
      },
      // 2. Singhania Gold Balance (VALID)
      {
        certNum: 'CERT-2026-001002',
        inst: createdInstruments[5],
        app: createdApps[1],
        insp: createdInspections[1],
        owner: bizJewel,
        vDate: new Date('2026-02-14'),
        validUntil: addDays(new Date('2026-02-14'), 365),
        officer: lmo1,
        status: 'VALID',
        authority: 'Office of Controller of Legal Metrology, NCT of Delhi',
      },
      // 3. Dhillon Fuel Dispenser (VALID)
      {
        certNum: 'CERT-2026-001003',
        inst: createdInstruments[7],
        app: createdApps[2],
        insp: createdInspections[2],
        owner: bizFuel,
        vDate: new Date('2026-05-10'),
        validUntil: addDays(new Date('2026-05-10'), 365),
        officer: lmo2,
        status: 'VALID',
        authority: 'Legal Metrology Department, Government of Haryana',
      },
      // 4. Kisan Mandi Weighbridge (VALID)
      {
        certNum: 'CERT-2026-001004',
        inst: createdInstruments[9],
        app: createdApps[3],
        insp: createdInspections[3],
        owner: bizMandi,
        vDate: new Date('2026-03-20'),
        validUntil: addDays(new Date('2026-03-20'), 365),
        officer: lmo2,
        status: 'VALID',
        authority: 'Legal Metrology Department, Government of Haryana',
      },
      // 5. Avadh Sugar Mill (VALID)
      {
        certNum: 'CERT-2026-001005',
        inst: createdInstruments[11],
        app: createdApps[4],
        insp: createdInspections[4],
        owner: bizSugar,
        vDate: new Date('2026-01-18'),
        validUntil: addDays(new Date('2026-01-18'), 365),
        officer: lmo3,
        status: 'VALID',
        authority: 'Weights & Measures Directorate, Uttar Pradesh',
      },
      // 6. Supermarket Scale (VALID)
      {
        certNum: 'CERT-2026-001006',
        inst: createdInstruments[13],
        app: createdApps[5],
        insp: createdInspections[5],
        owner: bizUser1,
        vDate: new Date('2026-05-02'),
        validUntil: addDays(new Date('2026-05-02'), 365),
        officer: lmo1,
        status: 'VALID',
        authority: 'Office of Controller of Legal Metrology, NCT of Delhi',
      },
      // 7. Apex Platform Scale (EXPIRING SOON - 18 days left)
      {
        certNum: 'CERT-2025-000844',
        inst: createdInstruments[1],
        app: createdApps[6],
        insp: createdInspections[0],
        owner: bizUser1,
        vDate: addDays(now, -347),
        validUntil: addDays(now, 18), // 18 days remaining
        officer: lmo1,
        status: 'EXPIRING_SOON',
        authority: 'Legal Metrology Department, Government of Haryana',
      },
      // 8. Apex Counter Scale (EXPIRED - 12 days ago)
      {
        certNum: 'CERT-2025-000412',
        inst: createdInstruments[2],
        app: createdApps[7],
        insp: createdInspections[0],
        owner: bizUser1,
        vDate: addDays(now, -377),
        validUntil: addDays(now, -12), // Expired 12 days ago
        officer: lmo1,
        status: 'EXPIRED',
        authority: 'Legal Metrology Department, Government of Haryana',
      },
    ];

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';

    for (const c of certificatesToCreate) {
      const verifyUrl = `${frontendBase}/verify/${c.certNum}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 256,
      });

      const certDoc = await Certificate.create({
        certificateNumber: c.certNum,
        instrument: c.inst._id,
        instrumentId: c.inst.instrumentId,
        application: c.app._id,
        applicationId: c.app.applicationId,
        inspection: c.insp ? c.insp._id : undefined,
        owner: c.owner._id,
        businessName: c.owner.organizationName || c.owner.fullName,
        ownerName: c.owner.fullName,
        instrumentType: c.inst.instrumentType,
        category: c.inst.category,
        manufacturer: c.inst.manufacturer,
        model: c.inst.model,
        serialNumber: c.inst.serialNumber,
        capacity: c.inst.capacity,
        accuracyClass: c.inst.accuracyClass,
        verificationDate: c.vDate,
        validUntil: c.validUntil,
        verifiedBy: c.officer._id,
        verifiedByName: c.officer.fullName,
        verifiedByDesignation: c.officer.designation || 'Legal Metrology Officer',
        issuingAuthority: c.authority,
        state: c.inst.state,
        district: c.inst.district,
        status: c.status,
        qrCodeDataUrl: qrDataUrl,
        verificationUrl: verifyUrl,
        digitalStampCode: `LM-STAMP-${c.certNum.slice(-6)}`,
      });

      // Update instrument active certificate and dates
      await Instrument.findByIdAndUpdate(c.inst._id, {
        activeCertificate: certDoc._id,
        lastVerificationDate: c.vDate,
        nextVerificationDueDate: c.validUntil,
      });

      // Update application certificate reference
      await VerificationApplication.findByIdAndUpdate(c.app._id, {
        certificate: certDoc._id,
      });
    }
    console.log(`[Seed] 8 digital certificates created with verified QR codes.`);

    // 7. Create 10 In-App Notifications
    console.log('[Seed] Generating notification alerts...');
    const notificationsData = [
      {
        user: bizUser1._id,
        title: 'Expiry Alert: Re-verification Due in 18 Days',
        message: 'Your instrument INS-2026-000102 (Platform Scale) requires periodic re-verification before expiry.',
        type: 'EXPIRY_ALERT',
        relatedEntity: { entityType: 'Instrument', entityId: 'INS-2026-000102' },
        isRead: false,
      },
      {
        user: bizUser1._id,
        title: 'CRITICAL: Instrument Stamping Expired',
        message: 'Instrument INS-2026-000103 (Counter Scale) expired 12 days ago. Using unverified scales in commercial transactions violates Section 24 of Legal Metrology Act.',
        type: 'EXPIRY_ALERT',
        relatedEntity: { entityType: 'Instrument', entityId: 'INS-2026-000103' },
        isRead: false,
      },
      {
        user: bizUser1._id,
        title: 'Verification Certificate Issued',
        message: 'Digital Certificate CERT-2026-001001 is now ready for your 60T Electronic Weighbridge.',
        type: 'CERTIFICATE_ISSUED',
        relatedEntity: { entityType: 'Certificate', entityId: 'CERT-2026-001001' },
        isRead: true,
      },
      {
        user: bizUser1._id,
        title: 'Application Submitted: APP-2026-001012',
        message: 'Your verification request for Mettler Toledo sorting scale is under review by the department.',
        type: 'APPLICATION_UPDATE',
        relatedEntity: { entityType: 'Application', entityId: 'APP-2026-001012' },
        isRead: false,
      },
      {
        user: lmo1._id,
        title: 'New Case Assigned: APP-2026-001001',
        message: 'You have been assigned to verify 60T Weighbridge for Apex Logistics in Gurugram.',
        type: 'ASSIGNMENT',
        relatedEntity: { entityType: 'Application', entityId: 'APP-2026-001001' },
        isRead: true,
      },
      {
        user: lmo2._id,
        title: 'Inspection Scheduled Today: APP-2026-001010',
        message: 'Inspection for Grain Hopper Scale at Kisan Mandi Karnal scheduled for today at 10:00 AM.',
        type: 'ASSIGNMENT',
        relatedEntity: { entityType: 'Application', entityId: 'APP-2026-001010' },
        isRead: false,
      },
      {
        user: bizJewel._id,
        title: 'Carat Balance Expiry Alert',
        message: 'Your high precision carat balance INS-2026-000107 expires in 8 days. Please schedule re-verification.',
        type: 'EXPIRY_ALERT',
        relatedEntity: { entityType: 'Instrument', entityId: 'INS-2026-000107' },
        isRead: false,
      },
      {
        user: bizSugar._id,
        title: 'Verification Notice: Recalibration Required',
        message: 'Flow Meter INS-2026-000113 did not pass zero-error limits during testing. Rectification required.',
        type: 'INSPECTION_RESULT',
        relatedEntity: { entityType: 'Application', entityId: 'APP-2026-001009' },
        isRead: false,
      },
      {
        user: gatc1._id,
        title: 'Calibration Test Case Assigned',
        message: 'Industrial Coriolis Flow Meter case referred to National Calibration Centre for standard bench testing.',
        type: 'ASSIGNMENT',
        relatedEntity: { entityType: 'Application', entityId: 'APP-2026-001009' },
        isRead: true,
      },
      {
        user: adminUser._id,
        title: 'Monthly Verification Compliance Summary',
        message: '84% of scheduled inspections in Delhi and Haryana completed on time for the current cycle.',
        type: 'SYSTEM',
        isRead: true,
      },
    ];

    await Notification.insertMany(notificationsData);
    console.log(`[Seed] 10 notifications generated.`);

    // 8. Generate 22 Audit Logs
    console.log('[Seed] Generating tamper-evident audit logs...');
    const auditLogsData = [
      {
        action: 'USER_REGISTERED',
        user: adminUser._id,
        userName: adminUser.fullName,
        userRole: adminUser.role,
        entity: 'User',
        entityId: adminUser._id.toString(),
        details: { email: adminUser.email, role: 'ADMIN' },
        timestamp: new Date('2026-01-01'),
      },
      {
        action: 'USER_REGISTERED',
        user: bizUser1._id,
        userName: bizUser1.fullName,
        userRole: bizUser1.role,
        entity: 'User',
        entityId: bizUser1._id.toString(),
        details: { company: 'Apex Logistics', email: bizUser1.email },
        timestamp: new Date('2026-01-10'),
      },
      {
        action: 'INSTRUMENT_CREATED',
        user: bizUser1._id,
        userName: bizUser1.fullName,
        userRole: bizUser1.role,
        entity: 'Instrument',
        entityId: 'INS-2026-000101',
        details: { type: 'Electronic Weighbridge', capacity: '60 Metric Tonnes' },
        timestamp: new Date('2026-04-01'),
      },
      {
        action: 'APPLICATION_SUBMITTED',
        user: bizUser1._id,
        userName: bizUser1.fullName,
        userRole: bizUser1.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001001',
        details: { type: 'NEW_VERIFICATION', instrumentId: 'INS-2026-000101' },
        timestamp: new Date('2026-04-05'),
      },
      {
        action: 'APPLICATION_ASSIGNED',
        user: adminUser._id,
        userName: adminUser.fullName,
        userRole: adminUser.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001001',
        details: { assignedOfficer: lmo1.fullName, date: '2026-04-15' },
        timestamp: new Date('2026-04-08'),
      },
      {
        action: 'INSPECTION_STARTED',
        user: lmo1._id,
        userName: lmo1.fullName,
        userRole: lmo1.role,
        entity: 'Inspection',
        entityId: 'INSP-2026-000001',
        details: { applicationId: 'APP-2026-001001' },
        timestamp: new Date('2026-04-15T10:15:00Z'),
      },
      {
        action: 'INSPECTION_COMPLETED',
        user: lmo1._id,
        userName: lmo1.fullName,
        userRole: lmo1.role,
        entity: 'Inspection',
        entityId: 'INSP-2026-000001',
        details: { passedCount: 7, total: 7, outcome: 'VERIFIED' },
        timestamp: new Date('2026-04-15T11:45:00Z'),
      },
      {
        action: 'CERTIFICATE_ISSUED',
        user: lmo1._id,
        userName: lmo1.fullName,
        userRole: lmo1.role,
        entity: 'Certificate',
        entityId: 'CERT-2026-001001',
        details: { instrumentId: 'INS-2026-000101', validUntil: '2027-04-15' },
        timestamp: new Date('2026-04-15T11:50:00Z'),
      },
      {
        action: 'APPLICATION_SUBMITTED',
        user: bizJewel._id,
        userName: bizJewel.fullName,
        userRole: bizJewel.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001002',
        details: { type: 'RE_VERIFICATION', instrumentId: 'INS-2026-000106' },
        timestamp: new Date('2026-02-05'),
      },
      {
        action: 'CERTIFICATE_ISSUED',
        user: lmo1._id,
        userName: lmo1.fullName,
        userRole: lmo1.role,
        entity: 'Certificate',
        entityId: 'CERT-2026-001002',
        details: { certificateNumber: 'CERT-2026-001002', owner: 'Singhania Jewellers' },
        timestamp: new Date('2026-02-14'),
      },
      {
        action: 'APPLICATION_SUBMITTED',
        user: bizFuel._id,
        userName: bizFuel.fullName,
        userRole: bizFuel.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001003',
        details: { type: 'NEW_VERIFICATION', instrumentId: 'INS-2026-000108' },
        timestamp: new Date('2026-05-01'),
      },
      {
        action: 'CERTIFICATE_ISSUED',
        user: lmo2._id,
        userName: lmo2.fullName,
        userRole: lmo2.role,
        entity: 'Certificate',
        entityId: 'CERT-2026-001003',
        details: { dispenserNozzle: 'Petrol MS Nozzle 1' },
        timestamp: new Date('2026-05-10'),
      },
      {
        action: 'APPLICATION_SUBMITTED',
        user: bizMandi._id,
        userName: bizMandi.fullName,
        userRole: bizMandi.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001004',
        details: { mandieLocation: 'Karnal Anaj Mandi' },
        timestamp: new Date('2026-03-15'),
      },
      {
        action: 'CERTIFICATE_ISSUED',
        user: lmo2._id,
        userName: lmo2.fullName,
        userRole: lmo2.role,
        entity: 'Certificate',
        entityId: 'CERT-2026-001004',
        details: { certificateNumber: 'CERT-2026-001004' },
        timestamp: new Date('2026-03-20'),
      },
      {
        action: 'APPLICATION_SUBMITTED',
        user: bizSugar._id,
        userName: bizSugar.fullName,
        userRole: bizSugar.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001009',
        details: { type: 'NEW_VERIFICATION', instrumentId: 'INS-2026-000113' },
        timestamp: new Date('2026-07-20'),
      },
      {
        action: 'APPLICATION_ASSIGNED',
        user: adminUser._id,
        userName: adminUser.fullName,
        userRole: adminUser.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001009',
        details: { assignedGATC: 'National Calibration & Metrology Test Centre' },
        timestamp: new Date('2026-07-22'),
      },
      {
        action: 'INSPECTION_COMPLETED',
        user: gatc1._id,
        userName: gatc1.fullName,
        userRole: gatc1.role,
        entity: 'Inspection',
        entityId: 'INSP-2026-000007',
        details: { outcome: 'REJECTED', reason: 'Zero repeatability error exceeded MPE' },
        timestamp: new Date('2026-07-28'),
      },
      {
        action: 'APPLICATION_ASSIGNED',
        user: adminUser._id,
        userName: adminUser.fullName,
        userRole: adminUser.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001010',
        details: { assignedOfficer: lmo2.fullName, scheduledDate: now },
        timestamp: addDays(now, -2),
      },
      {
        action: 'INSPECTION_STARTED',
        user: lmo2._id,
        userName: lmo2.fullName,
        userRole: lmo2.role,
        entity: 'Inspection',
        entityId: 'INSP-2026-000008',
        details: { location: 'Kisan Mandi Karnal' },
        timestamp: now,
      },
      {
        action: 'APPLICATION_SUBMITTED',
        user: bizUser1._id,
        userName: bizUser1.fullName,
        userRole: bizUser1.role,
        entity: 'VerificationApplication',
        entityId: 'APP-2026-001012',
        details: { instrumentId: 'INS-2026-000104' },
        timestamp: now,
      },
      {
        action: 'STATUS_CHANGED',
        user: adminUser._id,
        userName: adminUser.fullName,
        userRole: adminUser.role,
        entity: 'Instrument',
        entityId: 'INS-2026-000103',
        details: { oldStatus: 'VERIFIED', newStatus: 'EXPIRED', reason: 'Validity period elapsed without re-stamping' },
        timestamp: addDays(now, -12),
      },
      {
        action: 'STATUS_CHANGED',
        user: adminUser._id,
        userName: adminUser.fullName,
        userRole: adminUser.role,
        entity: 'Instrument',
        entityId: 'INS-2026-000102',
        details: { alert: 'EXPIRING_SOON', daysRemaining: 18 },
        timestamp: addDays(now, -1),
      },
    ];

    await AuditLog.insertMany(auditLogsData);
    console.log(`[Seed] 22 audit logs generated.`);

    console.log('===========================================================');
    console.log('METRAVERIFY DATABASE SEEDED SUCCESSFULLY!');
    console.log('Demo Credentials Ready:');
    console.log('1. ADMIN:    admin@metraverify.demo    / Admin@123');
    console.log('2. BUSINESS: business@metraverify.demo / Business@123');
    console.log('3. LMO:      lmo@metraverify.demo      / Lmo@123');
    console.log('4. GATC:     gatc@metraverify.demo     / Gatc@123');
    console.log('Public Verification route: /verify/CERT-2026-001001');
    console.log('===========================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
