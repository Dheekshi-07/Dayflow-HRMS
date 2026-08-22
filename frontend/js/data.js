/* ============================================================
   HRFlow — Mock Data Layer
   Realistic sample data for all pages. Structured for easy
   replacement with real API responses.
   ============================================================ */

const MockData = {

  /* ── Users ──
     Format for ID: OI + First Name 2 letters + Last Name 2 letters + Year of joining + 4-digit serial
  */
  users: [
    {
      id: 'OIANKR20220001', password: 'hr123', name: 'Ananya Krishnan', role: 'HR',
      email: 'ananya.krishnan@hrflow.com', workEmail: 'ananya.k@hrflow.internal',
      phone: '+91 98765 43210', department: 'Human Resources', designation: 'HR Manager',
      joiningDate: '2022-03-15', address: '42, MG Road, Bengaluru, Karnataka 560001',
      avatar: 'AK'
    },
    {
      id: 'OIVIME20230002', password: 'hr123', name: 'Vikram Mehta', role: 'HR',
      email: 'vikram.mehta@hrflow.com', workEmail: 'vikram.m@hrflow.internal',
      phone: '+91 98765 43211', department: 'Human Resources', designation: 'HR Executive',
      joiningDate: '2023-01-10', address: '15, Residency Road, Bengaluru, Karnataka 560025',
      avatar: 'VM'
    },
    {
      id: 'OIRASH20230003', password: 'emp123', name: 'Rahul Sharma', role: 'Employee',
      email: 'rahul.sharma@hrflow.com', workEmail: 'rahul.s@hrflow.internal',
      phone: '+91 87654 32100', department: 'Engineering', designation: 'Software Engineer',
      joiningDate: '2023-06-01', address: '78, Koramangala, Bengaluru, Karnataka 560034',
      avatar: 'RS', status: 'Active'
    },
    {
      id: 'OIPRPA20230004', password: 'emp123', name: 'Priya Patel', role: 'Employee',
      email: 'priya.patel@hrflow.com', workEmail: 'priya.p@hrflow.internal',
      phone: '+91 87654 32101', department: 'Design', designation: 'UI/UX Designer',
      joiningDate: '2023-08-15', address: '23, Indiranagar, Bengaluru, Karnataka 560038',
      avatar: 'PP', status: 'Active'
    },
    {
      id: 'OIARNA20220005', password: 'emp123', name: 'Arjun Nair', role: 'Employee',
      email: 'arjun.nair@hrflow.com', workEmail: 'arjun.n@hrflow.internal',
      phone: '+91 87654 32102', department: 'Engineering', designation: 'Senior Developer',
      joiningDate: '2022-11-20', address: '56, HSR Layout, Bengaluru, Karnataka 560102',
      avatar: 'AN', status: 'Active'
    },
    {
      id: 'OISNGU20230006', password: 'emp123', name: 'Sneha Gupta', role: 'Employee',
      email: 'sneha.gupta@hrflow.com', workEmail: 'sneha.g@hrflow.internal',
      phone: '+91 87654 32103', department: 'Marketing', designation: 'Marketing Manager',
      joiningDate: '2023-02-01', address: '89, Whitefield, Bengaluru, Karnataka 560066',
      avatar: 'SG', status: 'Active'
    },
    {
      id: 'OIDERE20230007', password: 'emp123', name: 'Deepak Reddy', role: 'Employee',
      email: 'deepak.reddy@hrflow.com', workEmail: 'deepak.r@hrflow.internal',
      phone: '+91 87654 32104', department: 'Finance', designation: 'Financial Analyst',
      joiningDate: '2023-04-10', address: '34, Jayanagar, Bengaluru, Karnataka 560041',
      avatar: 'DR', status: 'Active'
    },
    {
      id: 'OIKAIY20230008', password: 'emp123', name: 'Kavya Iyer', role: 'Employee',
      email: 'kavya.iyer@hrflow.com', workEmail: 'kavya.i@hrflow.internal',
      phone: '+91 87654 32105', department: 'Engineering', designation: 'QA Engineer',
      joiningDate: '2023-09-01', address: '12, BTM Layout, Bengaluru, Karnataka 560076',
      avatar: 'KI', status: 'Active'
    },
    {
      id: 'OIROJO20240009', password: 'emp123', name: 'Rohan Joshi', role: 'Employee',
      email: 'rohan.joshi@hrflow.com', workEmail: 'rohan.j@hrflow.internal',
      phone: '+91 87654 32106', department: 'Sales', designation: 'Sales Executive',
      joiningDate: '2024-01-15', address: '67, Electronic City, Bengaluru, Karnataka 560100',
      avatar: 'RJ', status: 'Active'
    },
    {
      id: 'OIMEBO20240010', password: 'emp123', name: 'Meera Bose', role: 'Employee',
      email: 'meera.bose@hrflow.com', workEmail: 'meera.b@hrflow.internal',
      phone: '+91 87654 32107', department: 'Design', designation: 'Graphic Designer',
      joiningDate: '2024-03-01', address: '45, Marathahalli, Bengaluru, Karnataka 560037',
      avatar: 'MB', status: 'On Leave'
    }
  ],

  /* ── Attendance (for current logged-in employee — use OIRASH20230003 as default) ── */
  getAttendance(empId) {
    // Generate realistic attendance for the last 12 months
    const statuses = ['present', 'present', 'present', 'present', 'present', 'absent', 'late', 'leave', 'holiday'];
    const months = [];
    const now = new Date();

    for (let m = 0; m < 12; m++) {
      const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const days = [];
      let present = 0, absent = 0, late = 0, leave = 0, holiday = 0;

      for (let d = 1; d <= daysInMonth; d++) {
        const dayDate = new Date(date.getFullYear(), date.getMonth(), d);
        const dow = dayDate.getDay();
        let status;

        if (dow === 0 || dow === 6) {
          status = 'holiday';
        } else if (dayDate > now) {
          status = '';
        } else {
          const rand = Math.random();
          if (rand < 0.72) status = 'present';
          else if (rand < 0.82) status = 'late';
          else if (rand < 0.90) status = 'leave';
          else status = 'absent';
        }

        if (status === 'present') present++;
        else if (status === 'absent') absent++;
        else if (status === 'late') late++;
        else if (status === 'leave') leave++;
        else if (status === 'holiday') holiday++;

        days.push({ date: d, status });
      }

      months.push({
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        days,
        summary: { present, absent, late, leave, holiday, total: daysInMonth }
      });
    }

    return months;
  },

  /* ── Leave Balances ── */
  leaveBalances: {
    OIRASH20230003: { paid: { allocated: 20, taken: 5 }, unpaid: { allocated: 10, taken: 2 }, sick: { allocated: 12, taken: 3 } },
    OIPRPA20230004: { paid: { allocated: 20, taken: 8 }, unpaid: { allocated: 10, taken: 0 }, sick: { allocated: 12, taken: 1 } },
    OIARNA20220005: { paid: { allocated: 20, taken: 12 }, unpaid: { allocated: 10, taken: 3 }, sick: { allocated: 12, taken: 5 } },
    OISNGU20230006: { paid: { allocated: 20, taken: 3 }, unpaid: { allocated: 10, taken: 1 }, sick: { allocated: 12, taken: 2 } },
    OIDERE20230007: { paid: { allocated: 20, taken: 6 }, unpaid: { allocated: 10, taken: 0 }, sick: { allocated: 12, taken: 4 } },
    OIKAIY20230008: { paid: { allocated: 20, taken: 2 }, unpaid: { allocated: 10, taken: 1 }, sick: { allocated: 12, taken: 0 } },
    OIROJO20240009: { paid: { allocated: 15, taken: 4 }, unpaid: { allocated: 10, taken: 2 }, sick: { allocated: 12, taken: 1 } },
    OIMEBO20240010: { paid: { allocated: 15, taken: 7 }, unpaid: { allocated: 10, taken: 3 }, sick: { allocated: 12, taken: 2 } },
  },

  /* ── Leave Requests ── */
  leaveRequests: [
    { id: 'LR001', empId: 'OIRASH20230003', empName: 'Rahul Sharma', type: 'Paid Leave', startDate: '2026-08-25', endDate: '2026-08-27', days: 3, reason: 'Family function in Jaipur', status: 'Pending', appliedDate: '2026-08-20' },
    { id: 'LR002', empId: 'OIPRPA20230004', empName: 'Priya Patel', type: 'Sick Leave', startDate: '2026-08-18', endDate: '2026-08-19', days: 2, reason: 'Fever and cold', status: 'Approved', appliedDate: '2026-08-17' },
    { id: 'LR003', empId: 'OIARNA20220005', empName: 'Arjun Nair', type: 'Unpaid Leave', startDate: '2026-09-01', endDate: '2026-09-05', days: 5, reason: 'Personal travel abroad', status: 'Pending', appliedDate: '2026-08-19' },
    { id: 'LR004', empId: 'OISNGU20230006', empName: 'Sneha Gupta', type: 'Paid Leave', startDate: '2026-08-10', endDate: '2026-08-12', days: 3, reason: 'Wedding anniversary celebration', status: 'Approved', appliedDate: '2026-08-05' },
    { id: 'LR005', empId: 'OIDERE20230007', empName: 'Deepak Reddy', type: 'Sick Leave', startDate: '2026-08-15', endDate: '2026-08-15', days: 1, reason: 'Dental appointment', status: 'Rejected', appliedDate: '2026-08-14', rejectionReason: 'Please reschedule to a non-working day or use comp-off' },
    { id: 'LR006', empId: 'OIMEBO20240010', empName: 'Meera Bose', type: 'Paid Leave', startDate: '2026-08-22', endDate: '2026-08-29', days: 6, reason: 'Vacation', status: 'Approved', appliedDate: '2026-08-10' },
    { id: 'LR007', empId: 'OIKAIY20230008', empName: 'Kavya Iyer', type: 'Paid Leave', startDate: '2026-09-10', endDate: '2026-09-12', days: 3, reason: 'Family visit to Chennai', status: 'Pending', appliedDate: '2026-08-21' },
  ],

  /* ── Work History ── */
  workHistory: {
    OIRASH20230003: [
      { id: 'WH001', title: 'API Gateway Migration', startDate: '2026-07-01', endDate: '2026-07-20', timeTaken: '15 days', status: 'Completed', description: 'Migrated legacy REST endpoints to new API gateway with rate limiting and authentication.' },
      { id: 'WH002', title: 'Dashboard Analytics Module', startDate: '2026-06-10', endDate: '2026-06-28', timeTaken: '14 days', status: 'Completed', description: 'Built real-time analytics dashboard with Chart.js and WebSocket integration.' },
      { id: 'WH003', title: 'User Authentication Refactor', startDate: '2026-05-15', endDate: '2026-06-05', timeTaken: '16 days', status: 'Completed', description: 'Refactored authentication system to support OAuth2 and SSO integration.' },
      { id: 'WH004', title: 'Performance Optimization Sprint', startDate: '2026-08-01', endDate: null, timeTaken: 'In Progress', status: 'In Progress', description: 'Optimizing database queries and implementing caching layer for improved response times.' },
    ],
    OIPRPA20230004: [
      { id: 'WH005', title: 'Mobile App Redesign', startDate: '2026-07-10', endDate: '2026-08-05', timeTaken: '20 days', status: 'Completed', description: 'Complete redesign of mobile application UI following new brand guidelines.' },
      { id: 'WH006', title: 'Design System v2.0', startDate: '2026-06-01', endDate: '2026-06-25', timeTaken: '19 days', status: 'Completed', description: 'Created comprehensive design system with 50+ components and detailed documentation.' },
    ],
    OIARNA20220005: [
      { id: 'WH007', title: 'Microservices Architecture', startDate: '2026-05-01', endDate: '2026-07-15', timeTaken: '55 days', status: 'Completed', description: 'Led migration from monolithic to microservices architecture across 8 services.' },
      { id: 'WH008', title: 'CI/CD Pipeline Setup', startDate: '2026-07-20', endDate: '2026-08-10', timeTaken: '16 days', status: 'Completed', description: 'Set up automated CI/CD pipelines with testing, linting, and deployment stages.' },
    ]
  },

  /* ── Assignments ── */
  assignments: [
    { id: 'ASN001', empId: 'OIRASH20230003', empName: 'Rahul Sharma', title: 'Q3 Code Review Sprint', description: 'Review all pending pull requests for the payment module and provide detailed feedback.', assignedDate: '2026-08-18', dueDate: '2026-08-25', priority: 'High', status: 'In Progress', sender: 'Ananya Krishnan' },
    { id: 'ASN002', empId: 'OIRASH20230003', empName: 'Rahul Sharma', title: 'Security Audit Documentation', description: 'Prepare documentation for the upcoming security audit covering all API endpoints.', assignedDate: '2026-08-15', dueDate: '2026-08-30', priority: 'Medium', status: 'Pending', sender: 'Ananya Krishnan' },
    { id: 'ASN003', empId: 'OIPRPA20230004', empName: 'Priya Patel', title: 'Landing Page Redesign', description: 'Create new mockups for the company landing page following the updated brand guidelines.', assignedDate: '2026-08-10', dueDate: '2026-08-22', priority: 'High', status: 'Completed', sender: 'Vikram Mehta' },
    { id: 'ASN004', empId: 'OIARNA20220005', empName: 'Arjun Nair', title: 'Database Migration Plan', description: 'Prepare a detailed migration plan for moving from PostgreSQL to CockroachDB.', assignedDate: '2026-08-20', dueDate: '2026-09-05', priority: 'High', status: 'Pending', sender: 'Ananya Krishnan' },
    { id: 'ASN005', empId: 'OISNGU20230006', empName: 'Sneha Gupta', title: 'Q3 Marketing Report', description: 'Compile the Q3 marketing performance report including ROI analysis and campaign metrics.', assignedDate: '2026-08-12', dueDate: '2026-08-28', priority: 'Medium', status: 'In Progress', sender: 'Ananya Krishnan' },
    { id: 'ASN006', empId: 'OIRASH20230003', empName: 'Rahul Sharma', title: 'Onboarding Guide Update', description: 'Update the developer onboarding guide with the latest tools and processes.', assignedDate: '2026-08-05', dueDate: '2026-08-15', priority: 'Low', status: 'Completed', sender: 'Vikram Mehta' },
    { id: 'ASN007', empId: 'OIDERE20230007', empName: 'Deepak Reddy', title: 'Budget Forecast Model', description: 'Build a budget forecast model for FY2027 with multiple scenarios.', assignedDate: '2026-08-19', dueDate: '2026-09-10', priority: 'High', status: 'Pending', sender: 'Ananya Krishnan' },
    { id: 'ASN008', empId: 'OIKAIY20230008', empName: 'Kavya Iyer', title: 'Regression Test Suite', description: 'Develop an automated regression test suite for the checkout flow.', assignedDate: '2026-08-16', dueDate: '2026-09-01', priority: 'Medium', status: 'In Progress', sender: 'Vikram Mehta' },
  ],

  /* ── Work Mail ── */
  workMails: [
    { id: 'WM001', empId: 'OIRASH20230003', from: 'Ananya Krishnan', to: 'Rahul Sharma', subject: 'Q3 Sprint Planning', message: 'Hi Rahul,\n\nPlease review the Q3 sprint planning document shared in the project channel and confirm your availability for the sprint kickoff meeting scheduled for Monday.\n\nAlso, please ensure all pending code reviews are completed by EOD Friday.\n\nBest regards,\nAnanya', date: '2026-08-21', priority: 'High', status: 'Unread', requiresAction: true, assignmentId: 'ASN001' },
    { id: 'WM002', empId: 'OIRASH20230003', from: 'Vikram Mehta', to: 'Rahul Sharma', subject: 'Updated Leave Policy', message: 'Dear Rahul,\n\nPlease note the updated leave policy effective September 1st. Key changes include:\n\n1. Flexible work-from-home options extended to 3 days/week\n2. Additional 2 days of mental health leave\n3. Updated comp-off calculation method\n\nPlease acknowledge receipt of this policy update.\n\nRegards,\nVikram', date: '2026-08-20', priority: 'Medium', status: 'Read', requiresAction: false },
    { id: 'WM003', empId: 'OIRASH20230003', from: 'Ananya Krishnan', to: 'Rahul Sharma', subject: 'Training Session: Cloud Architecture', message: 'Hi Rahul,\n\nYou have been enrolled in the Cloud Architecture training session scheduled for next week. Please complete the pre-requisite module before the session.\n\nDetails:\n- Date: August 28, 2026\n- Time: 10:00 AM - 12:30 PM\n- Mode: Online (Teams)\n\nPlease confirm your attendance.\n\nThanks,\nAnanya', date: '2026-08-19', priority: 'Low', status: 'Read', requiresAction: true },
    { id: 'WM004', empId: 'OIPRPA20230004', from: 'Vikram Mehta', to: 'Priya Patel', subject: 'Design Review Meeting', message: 'Hi Priya,\n\nPlease prepare the design assets for the landing page redesign review meeting. We need both mobile and desktop versions ready.\n\nMeeting: August 23, 2026 at 3:00 PM\n\nThanks,\nVikram', date: '2026-08-21', priority: 'High', status: 'Unread', requiresAction: true, assignmentId: 'ASN003' },
    { id: 'WM005', empId: 'OIARNA20220005', from: 'Ananya Krishnan', to: 'Arjun Nair', subject: 'Architecture Review Required', message: 'Hi Arjun,\n\nWe need your input on the proposed architecture changes for the notification service. Please review the RFC document and provide your feedback by Friday.\n\nThanks,\nAnanya', date: '2026-08-20', priority: 'Medium', status: 'Read', requiresAction: true },
    { id: 'WM006', empId: 'OIRASH20230003', from: 'Ananya Krishnan', to: 'Rahul Sharma', subject: 'Performance Review Schedule', message: 'Hi Rahul,\n\nYour bi-annual performance review has been scheduled. Please prepare your self-assessment document and submit it before the review date.\n\nReview Date: September 5, 2026\nReviewer: Ananya Krishnan\n\nPlease acknowledge.\n\nBest,\nAnanya', date: '2026-08-18', priority: 'High', status: 'Read', requiresAction: true },
  ],

  /* ── Permission Requests ── */
  permissionRequests: [
    { id: 'PR001', empId: 'OIRASH20230003', empName: 'Rahul Sharma', type: 'Early Leave', date: '2026-08-22', time: '3:00 PM', reason: 'Doctor appointment for regular checkup', status: 'Pending', appliedDate: '2026-08-21' },
    { id: 'PR002', empId: 'OISNGU20230006', empName: 'Sneha Gupta', type: 'Late Arrival', date: '2026-08-23', time: '11:00 AM', reason: 'Vehicle breakdown, using public transport', status: 'Approved', appliedDate: '2026-08-22' },
    { id: 'PR003', empId: 'OIKAIY20230008', empName: 'Kavya Iyer', type: 'Work From Home', date: '2026-08-24', time: 'Full Day', reason: 'Internet installation at new apartment', status: 'Pending', appliedDate: '2026-08-22' },
    { id: 'PR004', empId: 'OIROJO20240009', empName: 'Rohan Joshi', type: 'Early Leave', date: '2026-08-20', time: '4:00 PM', reason: 'Need to pick up parents from airport', status: 'Rejected', appliedDate: '2026-08-19', rejectionReason: 'Critical client meeting at 4:30 PM that day' },
    { id: 'PR005', empId: 'OIDERE20230007', empName: 'Deepak Reddy', type: 'Late Arrival', date: '2026-08-25', time: '10:30 AM', reason: 'Bank work - loan documentation', status: 'Pending', appliedDate: '2026-08-22' },
  ],

  /* ── Helper Methods ── */
  getEmployees() {
    return this.users.filter(u => u.role === 'Employee');
  },

  getHRUsers() {
    return this.users.filter(u => u.role === 'HR');
  },

  getUserById(id) {
    return this.users.find(u => u.id === id);
  },

  getEmployeeAssignments(empId) {
    return this.assignments.filter(a => a.empId === empId);
  },

  getEmployeeMails(empId) {
    return this.workMails.filter(m => m.empId === empId);
  },

  getEmployeeLeaveRequests(empId) {
    return this.leaveRequests.filter(lr => lr.empId === empId);
  },

  getEmployeeWorkHistory(empId) {
    return this.workHistory[empId] || [];
  },

  getEmployeeLeaveBalance(empId) {
    return this.leaveBalances[empId] || { paid: { allocated: 20, taken: 0 }, unpaid: { allocated: 10, taken: 0 }, sick: { allocated: 12, taken: 0 } };
  },

  getPendingLeaveRequests() {
    return this.leaveRequests.filter(lr => lr.status === 'Pending');
  },

  getPendingPermissions() {
    return this.permissionRequests.filter(pr => pr.status === 'Pending');
  },

  getPendingAssignments() {
    return this.assignments.filter(a => a.status === 'Pending');
  },

  getTodayStats() {
    const employees = this.getEmployees();
    const onLeave = this.leaveRequests.filter(lr => {
      const today = new Date().toISOString().split('T')[0];
      return lr.status === 'Approved' && lr.startDate <= today && lr.endDate >= today;
    });
    return {
      total: employees.length,
      present: employees.length - 2,
      absent: 1,
      onLeave: onLeave.length || 1,
      pendingLeaves: this.getPendingLeaveRequests().length,
      pendingAssignments: this.getPendingAssignments().length
    };
  },

  registerUser(data) {
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const role = data.role;
    const year = data.joiningYear || new Date().getFullYear();

    const fn2 = (firstName.substring(0, 2) || 'XX').toUpperCase();
    const ln2 = (lastName.substring(0, 2) || 'XX').toUpperCase();
    const serial = String(this.users.length + 1).padStart(4, '0');

    // Generated ID format: OI + First2 + Last2 + Year + Serial
    const generatedId = `OI${fn2}${ln2}${year}${serial}`;
    const fullName = `${firstName} ${lastName}`;

    const newUser = {
      id: generatedId,
      password: data.password,
      name: fullName,
      role: role,
      email: data.email,
      workEmail: `${firstName.toLowerCase()}.${lastName.substring(0, 1).toLowerCase()}@hrflow.internal`,
      phone: data.phone || '+91 99999 00000',
      department: data.department || (role === 'HR' ? 'Human Resources' : 'Engineering'),
      designation: data.designation || (role === 'HR' ? 'HR Associate' : 'Junior Developer'),
      joiningDate: `${year}-01-15`,
      address: data.address || 'Bengaluru, Karnataka',
      avatar: (firstName[0] + lastName[0]).toUpperCase(),
      status: 'Active'
    };

    this.users.push(newUser);

    // Initialize leave balance
    this.leaveBalances[generatedId] = {
      paid: { allocated: 20, taken: 0 },
      unpaid: { allocated: 10, taken: 0 },
      sick: { allocated: 12, taken: 0 }
    };

    // Initialize empty work history
    this.workHistory[generatedId] = [];

    return newUser;
  }
};

