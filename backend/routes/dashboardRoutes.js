import express from 'express';
import Instrument from '../models/Instrument.js';
import VerificationApplication from '../models/VerificationApplication.js';
import Certificate from '../models/Certificate.js';
import Inspection from '../models/Inspection.js';
import User from '../models/User.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { calculateExpiryStatus } from '../services/expiryService.js';

const router = express.Router();

// @route   GET /api/dashboard/business
// @desc    Metrics & chart data for Business User dashboard
// @access  Private (BUSINESS_USER, ADMIN)
router.get('/business', protect, async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const instruments = await Instrument.find({ owner: ownerId });
    const applications = await VerificationApplication.find({ owner: ownerId })
      .populate('instrument')
      .populate('assignedOfficer', 'fullName designation')
      .sort({ createdAt: -1 });
    const certificates = await Certificate.find({ owner: ownerId }).sort({
      verificationDate: -1,
    });

    let verifiedCount = 0;
    let pendingCount = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;
    let registeredCount = 0;

    const expiringSoonList = [];

    instruments.forEach((inst) => {
      if (inst.status === 'VERIFIED') {
        verifiedCount++;
      } else if (
        inst.status === 'PENDING_VERIFICATION' ||
        inst.status === 'SCHEDULED' ||
        inst.status === 'UNDER_INSPECTION'
      ) {
        pendingCount++;
      } else if (inst.status === 'EXPIRED') {
        expiredCount++;
      } else if (inst.status === 'REGISTERED') {
        registeredCount++;
      }

      if (inst.nextVerificationDueDate) {
        const exp = calculateExpiryStatus(inst.nextVerificationDueDate);
        if (exp.status === 'EXPIRING_SOON') {
          expiringSoonCount++;
          expiringSoonList.push({
            instrumentId: inst.instrumentId,
            instrumentType: inst.instrumentType,
            model: inst.model,
            serialNumber: inst.serialNumber,
            nextVerificationDueDate: inst.nextVerificationDueDate,
            daysRemaining: exp.daysRemaining,
          });
        } else if (exp.status === 'EXPIRED' && inst.status !== 'EXPIRED') {
          expiredCount++;
        }
      }
    });

    const statusDistribution = [
      { name: 'Verified', value: verifiedCount, color: '#059669' },
      { name: 'Pending Verification', value: pendingCount, color: '#d97706' },
      { name: 'Registered (New)', value: registeredCount, color: '#3b82f6' },
      { name: 'Expiring Soon', value: expiringSoonCount, color: '#f59e0b' },
      { name: 'Expired', value: expiredCount, color: '#ef4444' },
    ].filter((item) => item.value > 0);

    // Monthly verification trends
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyActivity = monthNames.map((month, idx) => {
      const appCount = applications.filter((app) => {
        const d = new Date(app.createdAt);
        return d.getMonth() === idx && d.getFullYear() === currentYear;
      }).length;

      const certCount = certificates.filter((c) => {
        const d = new Date(c.verificationDate);
        return d.getMonth() === idx && d.getFullYear() === currentYear;
      }).length;

      return {
        month,
        applications: appCount,
        verifications: certCount,
      };
    });

    res.json({
      success: true,
      data: {
        metrics: {
          totalInstruments: instruments.length,
          verifiedInstruments: verifiedCount,
          pendingApplications: applications.filter(
            (a) => !['VERIFIED', 'REJECTED', 'CERTIFICATE_ISSUED'].includes(a.status)
          ).length,
          expiringSoon: expiringSoonCount,
          expired: expiredCount,
          totalCertificates: certificates.length,
        },
        expiryAlerts: expiringSoonList,
        statusDistribution,
        monthlyActivity,
        recentApplications: applications.slice(0, 5),
        recentCertificates: certificates.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/lmo
// @desc    Metrics & assigned inspections for LMO Officer dashboard
// @access  Private (LMO_OFFICER, ADMIN)
router.get(
  '/lmo',
  protect,
  authorizeRoles('LMO_OFFICER', 'ADMIN'),
  async (req, res, next) => {
    try {
      const officerId = req.user._id;

      // Applications assigned to officer
      const assignedApps = await VerificationApplication.find({
        $or: [{ assignedOfficer: officerId }, { status: 'SUBMITTED' }],
      })
        .populate('instrument')
        .populate('owner', 'fullName email organizationName phone address district state')
        .sort({ scheduledDate: 1, createdAt: -1 });

      const inspections = await Inspection.find({ officer: officerId });
      const certificates = await Certificate.find({ verifiedBy: officerId });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaysInspections = assignedApps.filter((app) => {
        if (!app.scheduledDate) return false;
        const d = new Date(app.scheduledDate);
        return d >= today && d < tomorrow;
      });

      const pendingInspections = assignedApps.filter((app) =>
        ['SCHEDULED', 'INSPECTION', 'SUBMITTED', 'UNDER_REVIEW'].includes(app.status)
      );

      const completedInspections = inspections.filter(
        (insp) => insp.finalResult === 'VERIFIED' || insp.finalResult === 'REJECTED'
      );

      res.json({
        success: true,
        data: {
          metrics: {
            todaysInspections: todaysInspections.length,
            pendingInspections: pendingInspections.length,
            completedInspections: completedInspections.length,
            certificatesIssued: certificates.length,
          },
          assignedApplications: assignedApps,
          recentInspections: inspections.slice(0, 5),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/dashboard/gatc
// @desc    Metrics & test batches for GATC portal
// @access  Private (GATC, ADMIN)
router.get('/gatc', protect, authorizeRoles('GATC', 'ADMIN'), async (req, res, next) => {
  try {
    const gatcId = req.user._id;

    const assignedApps = await VerificationApplication.find({
      $or: [{ assignedOfficer: gatcId }, { assignedToType: 'GATC' }],
    })
      .populate('instrument')
      .populate('owner', 'fullName email organizationName phone')
      .sort({ createdAt: -1 });

    const inspections = await Inspection.find({ officer: gatcId });
    const certificates = await Certificate.find({ verifiedBy: gatcId });

    res.json({
      success: true,
      data: {
        metrics: {
          assignedCases: assignedApps.length,
          pendingTests: assignedApps.filter((a) => a.status === 'SCHEDULED' || a.status === 'INSPECTION').length,
          completedTests: inspections.filter((i) => i.finalResult !== 'IN_PROGRESS').length,
          calibrationsIssued: certificates.length,
        },
        assignedApplications: assignedApps,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/dashboard/admin
// @desc    High-level metrics and comprehensive analytics for Admin
// @access  Private (ADMIN)
router.get('/admin', protect, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const [instruments, applications, certificates, inspections, users] =
      await Promise.all([
        Instrument.find().populate('owner', 'organizationName fullName'),
        VerificationApplication.find().populate('instrument').populate('owner'),
        Certificate.find(),
        Inspection.find(),
        User.find(),
      ]);

    let verifiedCount = 0;
    let pendingCount = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;

    instruments.forEach((inst) => {
      if (inst.status === 'VERIFIED') verifiedCount++;
      if (['PENDING_VERIFICATION', 'SCHEDULED', 'UNDER_INSPECTION'].includes(inst.status)) {
        pendingCount++;
      }
      if (inst.status === 'EXPIRED') expiredCount++;

      if (inst.nextVerificationDueDate) {
        const exp = calculateExpiryStatus(inst.nextVerificationDueDate);
        if (exp.status === 'EXPIRING_SOON') expiringSoonCount++;
        if (exp.status === 'EXPIRED' && inst.status !== 'EXPIRED') expiredCount++;
      }
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const applicationsThisMonth = applications.filter(
      (a) => new Date(a.createdAt) >= startOfMonth
    ).length;

    const rejections = inspections.filter((i) => i.finalResult === 'REJECTED').length;

    // Chart 1: Verification status breakdown
    const statusDistribution = [
      { name: 'Verified', value: verifiedCount, color: '#059669' },
      { name: 'Pending Inspection', value: pendingCount, color: '#d97706' },
      { name: 'Expiring Soon', value: expiringSoonCount, color: '#f59e0b' },
      { name: 'Expired', value: expiredCount, color: '#ef4444' },
      { name: 'Newly Registered', value: instruments.filter((i) => i.status === 'REGISTERED').length, color: '#3b82f6' },
    ];

    // Chart 2: Monthly application and certificate trend
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = now.getFullYear();
    const monthlyTrends = monthNames.map((month, idx) => {
      const apps = applications.filter((a) => {
        const d = new Date(a.createdAt);
        return d.getMonth() === idx && d.getFullYear() === currentYear;
      }).length;

      const certs = certificates.filter((c) => {
        const d = new Date(c.verificationDate);
        return d.getMonth() === idx && d.getFullYear() === currentYear;
      }).length;

      return { month, applications: apps, certificates: certs };
    });

    // Chart 3: Instrument types
    const typeMap = {};
    instruments.forEach((inst) => {
      typeMap[inst.instrumentType] = (typeMap[inst.instrumentType] || 0) + 1;
    });
    const instrumentTypes = Object.entries(typeMap).map(([name, count]) => ({
      name,
      count,
    }));

    // Chart 4: District distribution
    const districtMap = {};
    instruments.forEach((inst) => {
      const d = inst.district || 'Other';
      districtMap[d] = (districtMap[d] || 0) + 1;
    });
    const districtDistribution = Object.entries(districtMap).map(([district, count]) => ({
      district,
      count,
    }));

    res.json({
      success: true,
      data: {
        metrics: {
          totalInstruments: instruments.length,
          verified: verifiedCount,
          pending: pendingCount,
          expired: expiredCount,
          expiringSoon: expiringSoonCount,
          applicationsThisMonth,
          certificatesIssued: certificates.length,
          rejections,
          totalUsers: users.length,
          officersCount: users.filter((u) => u.role === 'LMO_OFFICER').length,
          gatcCount: users.filter((u) => u.role === 'GATC').length,
        },
        charts: {
          statusDistribution,
          monthlyTrends,
          instrumentTypes,
          districtDistribution,
        },
        recentApplications: applications.slice(0, 6),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
