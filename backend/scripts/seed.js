const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const Client = require('../models/Client');
const Order = require('../models/Order');
const Script = require('../models/Script');
const Creator = require('../models/Creator');
const Shoot = require('../models/Shoot');
const Video = require('../models/Video');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const CreatorPayout = require('../models/CreatorPayout');
const Task = require('../models/Task');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing database collections...');
    await User.deleteMany({});
    await Client.deleteMany({});
    await Order.deleteMany({});
    await Script.deleteMany({});
    await Creator.deleteMany({});
    await Shoot.deleteMany({});
    await Video.deleteMany({});
    await Payment.deleteMany({});
    await Expense.deleteMany({});
    await CreatorPayout.deleteMany({});
    await Task.deleteMany({});
    await SupportTicket.deleteMany({});
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const ownerUser = await User.create({
      name: 'Elena Rostova (Owner)',
      email: 'owner@leadyfy.com',
      password: 'Password123!',
      role: 'OWNER',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    });

    const adminUser = await User.create({
      name: 'Marcus Vance (Ops Admin)',
      email: 'admin@leadyfy.com',
      password: 'Password123!',
      role: 'ADMIN',
      phone: '+1 (555) 018-9922',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    });

    const employeeUser = await User.create({
      name: 'Sarah Connor (Senior Editor)',
      email: 'employee@leadyfy.com',
      password: 'Password123!',
      role: 'EMPLOYEE',
      phone: '+1 (555) 017-4411',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    });

    console.log('[Seed] Creating clients...');
    const clientsData = [
      {
        clientName: 'Aura Skincare Inc.',
        companyName: 'Aura Beauty Labs LLC',
        email: 'client@leadyfy.com', // Demo client user binds here
        phone: '+1 (555) 432-8811',
        whatsApp: '+1 (555) 432-8811',
        businessName: 'Aura Glow Skincare',
        industry: 'Beauty & Cosmetics',
        gstTaxId: 'TAX-US-99281',
        assignedEmployee: employeeUser._id,
        source: 'Paid Meta Ads',
        status: 'Active',
        brandAssets: {
          logoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
          brandGuidelines: 'https://drive.google.com/file/d/aura-guidelines/view',
          driveFolder: 'https://drive.google.com/drive/folders/aura-brand-kit',
        },
      },
      {
        clientName: 'FitFuel Nutrition',
        companyName: 'FitFuel Global Corp',
        email: 'growth@fitfuel.io',
        phone: '+1 (555) 912-3004',
        whatsApp: '+1 (555) 912-3004',
        businessName: 'FitFuel Supplements',
        industry: 'Health & Fitness',
        gstTaxId: 'TAX-US-88120',
        assignedEmployee: adminUser._id,
        source: 'Inbound Organic',
        status: 'Active',
      },
      {
        clientName: 'Velox Apparel',
        companyName: 'Velox Streetwear Ltd',
        email: 'marketing@veloxapparel.com',
        phone: '+1 (555) 881-2299',
        whatsApp: '+1 (555) 881-2299',
        businessName: 'Velox Athleisure',
        industry: 'E-commerce Fashion',
        gstTaxId: 'TAX-US-77182',
        assignedEmployee: employeeUser._id,
        source: 'Referral',
        status: 'Active',
      },
      {
        clientName: 'Zenith Tech Hardware',
        companyName: 'Zenith Innovations Inc',
        email: 'media@zenithtech.co',
        phone: '+1 (555) 662-1100',
        whatsApp: '+1 (555) 662-1100',
        businessName: 'Zenith Gadgets',
        industry: 'Consumer Tech',
        gstTaxId: 'TAX-US-66100',
        assignedEmployee: adminUser._id,
        source: 'LinkedIn Outreach',
        status: 'Active',
      },
      {
        clientName: 'Luminary Home & Living',
        companyName: 'Luminary Retail Group',
        email: 'ops@luminaryhome.com',
        phone: '+1 (555) 773-4411',
        whatsApp: '+1 (555) 773-4411',
        businessName: 'Luminary Decor',
        industry: 'Home & Lifestyle',
        gstTaxId: 'TAX-US-55441',
        assignedEmployee: employeeUser._id,
        source: 'Google Search',
        status: 'Onboarding',
      },
      {
        clientName: 'KetoBite Snacks',
        companyName: 'KetoBite Foods Ltd',
        email: 'hello@ketobite.com',
        phone: '+1 (555) 229-8833',
        whatsApp: '+1 (555) 229-8833',
        businessName: 'KetoBite',
        industry: 'Food & Beverage',
        gstTaxId: 'TAX-US-33299',
        assignedEmployee: adminUser._id,
        source: 'Paid Meta Ads',
        status: 'Active',
      },
      {
        clientName: 'Pulse Audio',
        companyName: 'Pulse Soundlabs Corp',
        email: 'press@pulseaudio.com',
        phone: '+1 (555) 441-9922',
        whatsApp: '+1 (555) 441-9922',
        businessName: 'Pulse Earbuds',
        industry: 'Audio Tech',
        gstTaxId: 'TAX-US-11992',
        assignedEmployee: employeeUser._id,
        source: 'Cold Email',
        status: 'On Hold',
      },
      {
        clientName: 'Nova Hydration',
        companyName: 'Nova Beverage Co',
        email: 'contact@novahydrate.com',
        phone: '+1 (555) 880-1122',
        whatsApp: '+1 (555) 880-1122',
        businessName: 'Nova Electrolytes',
        industry: 'Health & Fitness',
        gstTaxId: 'TAX-US-22110',
        assignedEmployee: adminUser._id,
        source: 'Instagram DM',
        status: 'Lead',
      },
    ];

    const createdClients = await Client.insertMany(clientsData);
    const auraClient = createdClients[0]; // Bound to client demo user

    // Create client portal demo user bound to Aura Skincare
    const clientUser = await User.create({
      name: 'Sophia Sterling (Aura Client)',
      email: 'client@leadyfy.com',
      password: 'Password123!',
      role: 'CLIENT',
      phone: '+1 (555) 432-8811',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      clientId: auraClient._id,
    });

    console.log('[Seed] Creating creators...');
    const creatorsData = [
      {
        name: 'Chloe Bennett',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        gender: 'Female',
        ageGroup: '18-25',
        languages: ['English', 'Spanish'],
        location: 'Los Angeles, CA',
        niches: ['Skincare', 'Beauty', 'Fashion'],
        contact: { email: 'chloe@ugc.com', phone: '+1 (555) 123-4567', instagram: '@chloe.ugc' },
        rates: { perVideo: 180, perShoot: 550 },
        bankInfo: { accountName: 'Chloe Bennett', accountNumber: '8819-2201-9921', bankName: 'Chase Bank', upiId: 'chloe@upi' },
        availability: 'Available',
      },
      {
        name: 'Jordan Rivera',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        gender: 'Male',
        ageGroup: '26-35',
        languages: ['English'],
        location: 'Miami, FL',
        niches: ['Fitness', 'Supplements', 'Tech'],
        contact: { email: 'jordan@fitcreator.com', phone: '+1 (555) 234-5678', instagram: '@jordan_fits' },
        rates: { perVideo: 200, perShoot: 600 },
        bankInfo: { accountName: 'Jordan Rivera', accountNumber: '7721-0012-4412', bankName: 'Bank of America', upiId: 'jordan@upi' },
        availability: 'Booked',
      },
      {
        name: 'Maya Lin',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        gender: 'Female',
        ageGroup: '18-25',
        languages: ['English', 'Mandarin'],
        location: 'New York, NY',
        niches: ['Consumer Tech', 'Lifestyle', 'Fashion'],
        rates: { perVideo: 190, perShoot: 580 },
        availability: 'Available',
      },
      {
        name: 'Alex Vance',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        gender: 'Male',
        ageGroup: '26-35',
        languages: ['English'],
        location: 'Austin, TX',
        niches: ['Food & Beverage', 'Lifestyle'],
        rates: { perVideo: 160, perShoot: 500 },
        availability: 'Available',
      },
      {
        name: 'Zoe Kravitz-Smith',
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
        gender: 'Female',
        ageGroup: '26-35',
        languages: ['English', 'French'],
        location: 'Chicago, IL',
        niches: ['Home & Lifestyle', 'Beauty'],
        rates: { perVideo: 175, perShoot: 520 },
        availability: 'Booked',
      },
      {
        name: 'Liam Hayes',
        photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
        gender: 'Male',
        ageGroup: '18-25',
        languages: ['English'],
        location: 'Denver, CO',
        niches: ['Fitness', 'Outdoor', 'Tech'],
        rates: { perVideo: 150, perShoot: 480 },
        availability: 'Available',
      },
      {
        name: 'Samantha Gomez',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        gender: 'Female',
        ageGroup: '26-35',
        languages: ['Spanish', 'English'],
        location: 'San Diego, CA',
        niches: ['Beauty', 'Health'],
        rates: { perVideo: 185, perShoot: 560 },
        availability: 'Unavailable',
      },
      {
        name: 'David Kim',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        gender: 'Male',
        ageGroup: '18-25',
        languages: ['Korean', 'English'],
        location: 'Seattle, WA',
        niches: ['Gaming', 'Consumer Tech'],
        rates: { perVideo: 195, perShoot: 590 },
        availability: 'Available',
      },
    ];

    const createdCreators = await Creator.insertMany(creatorsData);

    console.log('[Seed] Creating orders / packages...');
    const ordersData = [
      {
        client: createdClients[0]._id, // Aura Skincare
        packageName: '10 UGC Video Growth Bundle',
        contractedVideoCount: 10,
        pricing: 3500,
        gstTax: 350,
        totalInvoiceAmount: 3850,
        amountReceived: 3850,
        outstandingBalance: 0,
        startDate: new Date('2026-09-01'),
        dueDate: new Date('2026-09-30'),
        assignedTeam: [ownerUser._id, employeeUser._id],
        status: 'In Production',
      },
      {
        client: createdClients[1]._id, // FitFuel Nutrition
        packageName: '15 UGC Viral Pack',
        contractedVideoCount: 15,
        pricing: 5200,
        gstTax: 520,
        totalInvoiceAmount: 5720,
        amountReceived: 3000,
        outstandingBalance: 2720,
        startDate: new Date('2026-09-05'),
        dueDate: new Date('2026-10-05'),
        assignedTeam: [adminUser._id],
        status: 'In Production',
      },
      {
        client: createdClients[2]._id, // Velox Apparel
        packageName: '8 Apparel Showcase Ads',
        contractedVideoCount: 8,
        pricing: 2800,
        gstTax: 280,
        totalInvoiceAmount: 3080,
        amountReceived: 3080,
        outstandingBalance: 0,
        startDate: new Date('2026-09-10'),
        dueDate: new Date('2026-10-10'),
        assignedTeam: [employeeUser._id],
        status: 'In Production',
      },
      {
        client: createdClients[3]._id, // Zenith Tech
        packageName: '5 Unboxing & Review Series',
        contractedVideoCount: 5,
        pricing: 2200,
        gstTax: 220,
        totalInvoiceAmount: 2420,
        amountReceived: 1000,
        outstandingBalance: 1420,
        startDate: new Date('2026-09-12'),
        dueDate: new Date('2026-10-12'),
        assignedTeam: [adminUser._id],
        status: 'In Production',
      },
      {
        client: createdClients[4]._id, // Luminary Home
        packageName: '10 Lifestyle Transformation Pack',
        contractedVideoCount: 10,
        pricing: 3600,
        gstTax: 360,
        totalInvoiceAmount: 3960,
        amountReceived: 0,
        outstandingBalance: 3960,
        startDate: new Date('2026-09-15'),
        dueDate: new Date('2026-10-15'),
        assignedTeam: [employeeUser._id],
        status: 'Onboarding',
      },
      {
        client: createdClients[5]._id, // KetoBite
        packageName: '12 Snack Recipe Shorts',
        contractedVideoCount: 12,
        pricing: 4000,
        gstTax: 400,
        totalInvoiceAmount: 4400,
        amountReceived: 4400,
        outstandingBalance: 0,
        startDate: new Date('2026-08-15'),
        dueDate: new Date('2026-09-15'),
        assignedTeam: [adminUser._id],
        status: 'Completed',
      },
      {
        client: createdClients[6]._id, // Pulse Audio
        packageName: '6 Sound Test Clips',
        contractedVideoCount: 6,
        pricing: 2100,
        gstTax: 210,
        totalInvoiceAmount: 2310,
        amountReceived: 1000,
        outstandingBalance: 1310,
        startDate: new Date('2026-09-02'),
        dueDate: new Date('2026-10-02'),
        assignedTeam: [employeeUser._id],
        status: 'On Hold',
      },
      {
        client: createdClients[7]._id, // Nova Hydration
        packageName: '10 Hydration Challenge Ads',
        contractedVideoCount: 10,
        pricing: 3200,
        gstTax: 320,
        totalInvoiceAmount: 3520,
        amountReceived: 0,
        outstandingBalance: 3520,
        startDate: new Date('2026-09-18'),
        dueDate: new Date('2026-10-18'),
        assignedTeam: [adminUser._id],
        status: 'New',
      },
    ];

    const createdOrders = await Order.insertMany(ordersData);

    console.log('[Seed] Creating scripts...');
    const scriptsData = [
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        videoNumber: 1,
        title: 'Morning Skincare Routine Hook',
        writer: ownerUser._id,
        creator: createdCreators[0]._id,
        language: 'English',
        scriptText: 'HOOK: Stop wasting $200 on serums until you try this multi-peptide formula! BODY: Apply 3 drops every morning for instant glass skin.',
        referenceLinks: ['https://tiktok.com/@skincare_ref1'],
        deadline: new Date('2026-09-22'),
        revisionCount: 0,
        status: 'Approved',
      },
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        videoNumber: 2,
        title: 'Hydration Glow Testimonial',
        writer: ownerUser._id,
        creator: createdCreators[0]._id,
        language: 'English',
        scriptText: 'HOOK: My skin felt like sandpaper until day 3 of using Aura Glow. BODY: Show before and after closeups with soft ring light.',
        deadline: new Date('2026-09-24'),
        revisionCount: 1,
        status: 'Sent to Client',
      },
      {
        client: createdClients[1]._id,
        order: createdOrders[1]._id,
        videoNumber: 1,
        title: 'Pre-Workout Energy Burst Unboxing',
        writer: adminUser._id,
        creator: createdCreators[1]._id,
        language: 'English',
        scriptText: 'HOOK: 3 grams of pure beta-alanine without the crash! WATCH THIS. BODY: Mix scoop into ice cold shaker, gulp, and hit heavy deadlifts.',
        deadline: new Date('2026-09-23'),
        status: 'Ready for Shoot',
      },
      {
        client: createdClients[1]._id,
        order: createdOrders[1]._id,
        videoNumber: 2,
        title: 'Fat Loss Snack Swap',
        writer: adminUser._id,
        creator: createdCreators[1]._id,
        language: 'English',
        scriptText: 'HOOK: Swap out your sugary protein bars for FitFuel crispies.',
        status: 'In Review',
      },
      {
        client: createdClients[2]._id,
        order: createdOrders[2]._id,
        videoNumber: 1,
        title: 'Oversized Hoodie Outfit Transition',
        writer: employeeUser._id,
        creator: createdCreators[2]._id,
        language: 'English',
        scriptText: 'HOOK: How to style heavy fleece streetwear in 3 seconds.',
        status: 'Approved',
      },
      {
        client: createdClients[3]._id,
        order: createdOrders[3]._id,
        videoNumber: 1,
        title: 'Noise Cancelling Headphones Flight Test',
        writer: adminUser._id,
        creator: createdCreators[7]._id,
        language: 'English',
        scriptText: 'HOOK: Loud plane engine sound cutout demonstration.',
        status: 'Sent to Client',
      },
      {
        client: createdClients[4]._id,
        order: createdOrders[4]._id,
        videoNumber: 1,
        title: 'Minimalist Apartment Makeover',
        writer: employeeUser._id,
        creator: createdCreators[4]._id,
        language: 'English',
        scriptText: 'HOOK: Turn a dull bedroom into a 5-star hotel room with Luminary lamps.',
        status: 'Draft',
      },
      {
        client: createdClients[5]._id,
        order: createdOrders[5]._id,
        videoNumber: 1,
        title: 'Low Carb Chocolate Fudge Recipe',
        writer: adminUser._id,
        creator: createdCreators[3]._id,
        language: 'English',
        scriptText: 'HOOK: Only 2g net carbs per bar! Secret ingredient revealed.',
        status: 'Approved',
      },
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        videoNumber: 3,
        title: 'Dermatologist Reacts Style UGC',
        writer: ownerUser._id,
        creator: createdCreators[6]._id,
        language: 'English',
        scriptText: 'HOOK: Is this viral serum actually doctor approved?',
        status: 'Revision Required',
      },
      {
        client: createdClients[2]._id,
        order: createdOrders[2]._id,
        videoNumber: 2,
        title: 'Gym to Street Style Vlog',
        writer: employeeUser._id,
        creator: createdCreators[2]._id,
        language: 'English',
        scriptText: 'HOOK: One outfit for leg day and coffee run.',
        status: 'Assigned',
      },
    ];

    const createdScripts = await Script.insertMany(scriptsData);

    console.log('[Seed] Creating shoots...');
    const shootsData = [
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        date: new Date('2026-09-20T10:00:00'),
        time: '10:00 AM',
        location: 'Studio A (Natural Sunlit Bathroom Set)',
        creator: createdCreators[0]._id,
        cameraman: 'David Ross',
        shootManager: adminUser._id,
        approvedScripts: [createdScripts[0]._id],
        specialNotes: 'Bring extra ring lights and macro lens for skin texture shots.',
        status: 'Confirmed',
        preShootChecklist: { scriptApproved: true, creatorConfirmed: true, locationPermission: true, clientProductReceived: true, teamBriefing: true },
      },
      {
        client: createdClients[1]._id,
        order: createdOrders[1]._id,
        date: new Date('2026-09-21T14:30:00'),
        time: '02:30 PM',
        location: 'Metro Gym Downtown',
        creator: createdCreators[1]._id,
        cameraman: 'In-house Tech',
        shootManager: employeeUser._id,
        approvedScripts: [createdScripts[2]._id],
        specialNotes: 'Verify gym permission pass upon arrival.',
        status: 'Scheduled',
        preShootChecklist: { scriptApproved: true, creatorConfirmed: true, locationPermission: true, clientProductReceived: true, teamBriefing: false },
      },
      {
        client: createdClients[2]._id,
        order: createdOrders[2]._id,
        date: new Date('2026-09-18T11:00:00'),
        time: '11:00 AM',
        location: 'Urban Alleyway Loft',
        creator: createdCreators[2]._id,
        cameraman: 'Sarah Connor',
        shootManager: ownerUser._id,
        approvedScripts: [createdScripts[4]._id],
        status: 'Completed',
        preShootChecklist: { scriptApproved: true, creatorConfirmed: true, locationPermission: true, clientProductReceived: true, teamBriefing: true },
        postShootVerification: { footageUploaded: true, rawFileVerified: true, reshootRequired: false },
      },
      {
        client: createdClients[3]._id,
        order: createdOrders[3]._id,
        date: new Date('2026-09-22T09:00:00'),
        time: '09:00 AM',
        location: 'Tech Sound Chamber Studio',
        creator: createdCreators[7]._id,
        cameraman: 'In-house Tech',
        shootManager: adminUser._id,
        approvedScripts: [createdScripts[5]._id],
        status: 'Scheduled',
      },
      {
        client: createdClients[5]._id,
        order: createdOrders[5]._id,
        date: new Date('2026-09-10T15:00:00'),
        time: '03:00 PM',
        location: 'Gourmet Kitchen Studio',
        creator: createdCreators[3]._id,
        cameraman: 'Sarah Connor',
        shootManager: employeeUser._id,
        status: 'Completed',
      },
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        date: new Date('2026-09-25T13:00:00'),
        time: '01:00 PM',
        location: 'Beachside Villa Set',
        creator: createdCreators[6]._id,
        cameraman: 'In-house Tech',
        shootManager: adminUser._id,
        status: 'Scheduled',
      },
      {
        client: createdClients[4]._id,
        order: createdOrders[4]._id,
        date: new Date('2026-09-28T10:00:00'),
        time: '10:00 AM',
        location: 'Luminary Showroom Studio',
        creator: createdCreators[4]._id,
        cameraman: 'David Ross',
        shootManager: employeeUser._id,
        status: 'Scheduled',
      },
      {
        client: createdClients[6]._id,
        order: createdOrders[6]._id,
        date: new Date('2026-09-14T11:00:00'),
        time: '11:00 AM',
        location: 'Acoustic Studio B',
        creator: createdCreators[5]._id,
        cameraman: 'In-house Tech',
        shootManager: adminUser._id,
        status: 'Reshoot Required',
        specialNotes: 'Audio background static observed on mic line 2.',
      },
    ];

    const createdShoots = await Shoot.insertMany(shootsData);

    console.log('[Seed] Creating 15 pipeline video cards across 9 stages...');
    const videosData = [
      // 1. Script Approved
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        script: createdScripts[0]._id,
        creator: createdCreators[0]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 1,
        title: 'Aura Glow Morning Serum Hook',
        thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/aura-video-1/view',
        status: 'Script Approved',
        urgency: 'Normal',
        deadline: new Date('2026-09-26'),
      },
      // 2. Shoot Pending
      {
        client: createdClients[1]._id,
        order: createdOrders[1]._id,
        script: createdScripts[2]._id,
        creator: createdCreators[1]._id,
        shoot: createdShoots[1]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 1,
        title: 'FitFuel Pre-Workout Burst',
        thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/fitfuel-v1/view',
        status: 'Shoot Pending',
        urgency: 'Due Tomorrow',
        deadline: new Date('2026-09-22'),
      },
      // 3. Raw Footage Received
      {
        client: createdClients[2]._id,
        order: createdOrders[2]._id,
        script: createdScripts[4]._id,
        creator: createdCreators[2]._id,
        shoot: createdShoots[2]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 1,
        title: 'Velox Hoodie Outfit Transition',
        thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/velox-raw-footage/view',
        status: 'Raw Footage Received',
        urgency: 'Due Today',
        deadline: new Date('2026-09-21'),
      },
      // 4. Video Editing
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        script: createdScripts[1]._id,
        creator: createdCreators[0]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 2,
        title: 'Hydration Glow Testimonial Edit',
        thumbnail: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/aura-v2-draft/view',
        status: 'Video Editing',
        urgency: 'Due Today',
        deadline: new Date('2026-09-21'),
      },
      // 5. Internal QA
      {
        client: createdClients[3]._id,
        order: createdOrders[3]._id,
        script: createdScripts[5]._id,
        creator: createdCreators[7]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 1,
        title: 'Zenith Headphones Noise Cancellation Cut',
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/zenith-v1-qa/view',
        status: 'Internal QA',
        urgency: 'Normal',
        deadline: new Date('2026-09-24'),
      },
      // 6. Client Review (Aura client login can test reviewing this!)
      {
        client: createdClients[0]._id, // Aura Skincare (Client Portal)
        order: createdOrders[0]._id,
        script: createdScripts[0]._id,
        creator: createdCreators[0]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 3,
        title: 'Peptide Serum 3-Day Transformation',
        thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/aura-v3-review-draft/view',
        status: 'Client Review',
        urgency: 'Normal',
        deadline: new Date('2026-09-23'),
        feedbackLog: [
          {
            user: 'Marcus Vance',
            userRole: 'ADMIN',
            feedback: 'Passed internal QA review. Audio normalized and color graded.',
            timestamp: new Date('2026-09-19T09:00:00'),
          },
        ],
      },
      // 7. Revision
      {
        client: createdClients[1]._id,
        order: createdOrders[1]._id,
        creator: createdCreators[1]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 2,
        title: 'FitFuel Protein Crisp Crunch Sound Edit',
        thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/fitfuel-v2-revision/view',
        status: 'Revision',
        revisionCount: 1,
        urgency: 'Overdue',
        deadline: new Date('2026-09-18'),
        feedbackLog: [
          {
            user: 'FitFuel Client',
            userRole: 'CLIENT',
            feedback: 'Please amplify the crisp sound effect at 0:04 and make the end CTA button brighter red.',
            timestamp: new Date('2026-09-18T16:20:00'),
            priority: 'Urgent',
          },
        ],
      },
      // 8. Final Approved
      {
        client: createdClients[2]._id,
        order: createdOrders[2]._id,
        creator: createdCreators[2]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 2,
        title: 'Velox Winter Parka Outfit Reel',
        thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/velox-v2-approved/view',
        finalDeliveryLink: 'https://drive.google.com/file/d/velox-v2-approved/view',
        status: 'Final Approved',
        urgency: 'Completed',
      },
      // 9. Delivered
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        creator: createdCreators[0]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 4,
        title: 'Aura Cleanser Texture Close Up',
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/aura-v4-delivered/view',
        finalDeliveryLink: 'https://drive.google.com/file/d/aura-v4-delivered/view',
        status: 'Delivered',
        urgency: 'Completed',
      },
      {
        client: createdClients[5]._id,
        order: createdOrders[5]._id,
        creator: createdCreators[3]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 1,
        title: 'KetoBite Chocolate Fudge Short 1',
        thumbnail: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=600&q=80',
        finalDeliveryLink: 'https://drive.google.com/file/d/ketobite-v1-delivered/view',
        status: 'Delivered',
        urgency: 'Completed',
      },
      {
        client: createdClients[5]._id,
        order: createdOrders[5]._id,
        creator: createdCreators[3]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 2,
        title: 'KetoBite Chocolate Fudge Short 2',
        thumbnail: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
        finalDeliveryLink: 'https://drive.google.com/file/d/ketobite-v2-delivered/view',
        status: 'Delivered',
        urgency: 'Completed',
      },
      {
        client: createdClients[1]._id,
        order: createdOrders[1]._id,
        creator: createdCreators[1]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 3,
        title: 'FitFuel Electrolyte Shaker Testimonial',
        thumbnail: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/fitfuel-v3/view',
        status: 'Video Editing',
        urgency: 'Due Tomorrow',
        deadline: new Date('2026-09-22'),
      },
      {
        client: createdClients[3]._id,
        order: createdOrders[3]._id,
        creator: createdCreators[7]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 2,
        title: 'Zenith Wireless Earbuds Mic Test',
        thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/zenith-v2/view',
        status: 'Internal QA',
        urgency: 'Normal',
      },
      {
        client: createdClients[4]._id,
        order: createdOrders[4]._id,
        creator: createdCreators[4]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 1,
        title: 'Luminary Smart Ambient Light Setup',
        thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/luminary-v1/view',
        status: 'Raw Footage Received',
        urgency: 'Normal',
      },
      {
        client: createdClients[2]._id,
        order: createdOrders[2]._id,
        creator: createdCreators[2]._id,
        assignedEditor: employeeUser._id,
        videoNumber: 3,
        title: 'Velox Streetwear Denim Jacket Reel',
        thumbnail: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=600&q=80',
        driveLink: 'https://drive.google.com/file/d/velox-v3/view',
        status: 'Delivered',
        finalDeliveryLink: 'https://drive.google.com/file/d/velox-v3-delivered/view',
        urgency: 'Completed',
      },
    ];

    const createdVideos = await Video.insertMany(videosData);

    console.log('[Seed] Creating financial payments...');
    await Payment.insertMany([
      {
        client: createdClients[0]._id,
        order: createdOrders[0]._id,
        invoiceAmount: 3850,
        amountReceived: 3850,
        pendingBalance: 0,
        paymentDate: new Date('2026-09-02'),
        method: 'Bank Transfer',
        transactionRef: 'WIRE-AURA-9921',
        notes: 'Full advance payment for 10 UGC Growth Bundle',
        status: 'Paid',
      },
      {
        client: createdClients[1]._id,
        order: createdOrders[1]._id,
        invoiceAmount: 5720,
        amountReceived: 3000,
        pendingBalance: 2720,
        paymentDate: new Date('2026-09-05'),
        method: 'Credit Card',
        transactionRef: 'CC-FITFUEL-4412',
        notes: '50% deposit for 15 UGC Viral Pack',
        status: 'Partially Paid',
      },
      {
        client: createdClients[2]._id,
        order: createdOrders[2]._id,
        invoiceAmount: 3080,
        amountReceived: 3080,
        pendingBalance: 0,
        paymentDate: new Date('2026-09-10'),
        method: 'Stripe',
        transactionRef: 'STRIPE-VELOX-1109',
        notes: '100% full invoice clearance',
        status: 'Paid',
      },
    ]);

    console.log('[Seed] Creating agency expenses...');
    await Expense.insertMany([
      {
        category: 'Salaries',
        amount: 8500,
        user: ownerUser._id,
        userName: ownerUser.name,
        date: new Date('2026-09-01'),
        notes: 'Monthly video production team payroll',
      },
      {
        category: 'Studio',
        amount: 1800,
        user: adminUser._id,
        userName: adminUser.name,
        date: new Date('2026-09-05'),
        notes: 'Studio A monthly lease & lighting gear rental',
      },
      {
        category: 'Equipment',
        amount: 1200,
        user: employeeUser._id,
        userName: employeeUser.name,
        date: new Date('2026-09-10'),
        notes: 'Wireless lavalier microphones & Sony FX3 battery packs',
      },
    ]);

    console.log('[Seed] Creating creator payouts...');
    await CreatorPayout.insertMany([
      {
        creator: createdCreators[0]._id,
        order: createdOrders[0]._id,
        video: createdVideos[0]._id,
        videoCount: 2,
        contractedRate: 180,
        totalPayout: 360,
        paymentDate: new Date('2026-09-12'),
        reference: 'PAYOUT-CHLOE-001',
        status: 'Paid',
      },
      {
        creator: createdCreators[1]._id,
        order: createdOrders[1]._id,
        video: createdVideos[1]._id,
        videoCount: 2,
        contractedRate: 200,
        totalPayout: 400,
        paymentDate: new Date('2026-09-15'),
        reference: 'PAYOUT-JORDAN-002',
        status: 'Approved',
      },
      {
        creator: createdCreators[2]._id,
        order: createdOrders[2]._id,
        video: createdVideos[2]._id,
        videoCount: 1,
        contractedRate: 190,
        totalPayout: 190,
        paymentDate: new Date('2026-09-19'),
        reference: 'PAYOUT-MAYA-003',
        status: 'Pending',
      },
    ]);

    console.log('[Seed] Creating tasks...');
    await Task.insertMany([
      {
        title: 'Review Aura Skincare Script #2 Revisions',
        description: 'Check script line 12 for compliance with skincare SPF claims.',
        assignee: ownerUser._id,
        priority: 'Urgent',
        deadline: new Date('2026-09-20'),
        status: 'In Progress',
      },
      {
        title: 'Confirm Gym Location for FitFuel Shoot',
        description: 'Call Metro Gym manager to verify filming clearance.',
        assignee: employeeUser._id,
        priority: 'High',
        deadline: new Date('2026-09-21'),
        status: 'To Do',
      },
      {
        title: 'Export Final Render for Velox Hoodie Reel',
        description: 'Ensure 4K 9:16 vertical render format for Instagram Reels.',
        assignee: employeeUser._id,
        priority: 'Medium',
        deadline: new Date('2026-09-22'),
        status: 'Done',
      },
    ]);

    console.log('[Seed] Creating support tickets...');
    await SupportTicket.insertMany([
      {
        client: createdClients[0]._id,
        subject: 'Can we add 2 extra TikTok hook variations?',
        description: 'Hi Leadyfy team! Our marketing director wants to test 2 additional hooks for video #3.',
        priority: 'High',
        status: 'In Progress',
        assignedEmployee: adminUser._id,
        createdBy: clientUser._id,
      },
      {
        client: createdClients[1]._id,
        subject: 'Request invoice receipt copy for accounting',
        description: 'Please send PDF receipt for the $3,000 partial payment made on Sep 5.',
        priority: 'Medium',
        status: 'Resolved',
        assignedEmployee: adminUser._id,
      },
    ]);

    console.log('[Seed] Creating initial notifications & activity logs...');
    await Notification.insertMany([
      {
        roleTarget: 'ALL',
        title: 'Welcome to LEADYFY OS',
        message: 'Platform initialized with demo clients, pipeline videos, and financial data.',
        type: 'success',
        link: '/dashboard',
      },
      {
        roleTarget: 'CLIENT',
        title: 'New Video Ready for Review',
        message: 'Aura Cleanser video #3 is now ready for your review in the portal.',
        type: 'info',
        link: '/client-portal',
      },
    ]);

    await ActivityLog.insertMany([
      {
        userName: ownerUser.name,
        userRole: 'OWNER',
        action: 'SYSTEM_SEED',
        entity: 'System',
        details: 'Initialized full system database with demo datasets.',
        timestamp: new Date(),
      },
    ]);

    console.log('✅ [Seed Success] Leadyfy OS database populated successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS READY:');
    console.log('Owner:    owner@leadyfy.com    / Password123!');
    console.log('Admin:    admin@leadyfy.com    / Password123!');
    console.log('Employee: employee@leadyfy.com / Password123!');
    console.log('Client:   client@leadyfy.com   / Password123!');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
