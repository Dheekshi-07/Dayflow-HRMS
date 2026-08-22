/* ============================================================
   HRFlow — Employee View Renderers
   ============================================================ */

const EmployeeViews = {

  /* ── Employee Dashboard ── */
  renderDashboard(emp) {
    const assignments = MockData.getEmployeeAssignments(emp.id);
    const mails = MockData.getEmployeeMails(emp.id);
    const leaves = MockData.getEmployeeLeaveBalance(emp.id);
    const unreadCount = mails.filter(m => m.status === 'Unread').length;
    const pendingASN = assignments.filter(a => a.status !== 'Completed').length;
    const remainingLeave = (leaves.paid.allocated - leaves.paid.taken) + (leaves.sick.allocated - leaves.sick.taken);

    return `
      <div class="welcome-section">
        <h1>Welcome, ${emp.name}! 👋</h1>
        <p>${emp.designation} • ${emp.department} Department • ID: ${emp.id}</p>
      </div>

      <div class="stats-grid">
        ${Components.StatCard({ icon: 'calendar-check', value: '94%', label: 'Monthly Attendance', color: 'success' })}
        ${Components.StatCard({ icon: 'calendar2-minus', value: remainingLeave, label: 'Leaves Available', color: 'info' })}
        ${Components.StatCard({ icon: 'card-checklist', value: pendingASN, label: 'Pending Assignments', color: 'warning' })}
        ${Components.StatCard({ icon: 'envelope', value: unreadCount, label: 'Unread Work Mails', color: 'danger' })}
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="bi bi-card-checklist text-primary"></i> Current Assignments</h3>
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('emp-assignments')">View All</button>
          </div>
          <div class="card-body">
            ${assignments.length > 0
              ? assignments.slice(0, 3).map(a => Components.AssignmentCard({
                  id: a.id, title: a.title, dueDate: a.dueDate, priority: a.priority,
                  status: a.status, sender: a.sender, onClick: 'EmployeeViews.openAssignmentDetail'
                })).join('')
              : Components.EmptyState({ icon: 'check-circle', title: 'No pending assignments' })
            }
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="bi bi-envelope text-primary"></i> Pending Work Mail</h3>
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('emp-mail')">View Inbox</button>
          </div>
          <div class="card-body">
            <div class="mail-list">
              ${mails.length > 0
                ? mails.slice(0, 3).map(m => Components.MailItem({
                    id: m.id, subject: m.subject, from: m.from, date: m.date,
                    priority: m.priority, status: m.status, preview: m.message.substring(0, 50),
                    onClick: 'EmployeeViews.openMailDetail'
                  })).join('')
                : Components.EmptyState({ icon: 'inbox', title: 'Inbox empty' })
              }
            </div>
          </div>
        </div>
      </div>`;
  },

  /* ── Employee Profile View ── */
  renderProfile(emp) {
    return `
      ${Components.BackButton('emp-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">My Profile</h1>
          <p class="page-subtitle">Personal and professional employee details</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="App.navigate('emp-edit-profile')"><i class="bi bi-pencil-square"></i> Edit Profile</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="profile-header">
            <div class="profile-avatar">${emp.avatar || emp.name.substring(0, 2).toUpperCase()}</div>
            <div class="profile-info">
              <h2>${emp.name}</h2>
              <div class="profile-role">${emp.designation} • ${emp.department}</div>
              <div class="profile-id">Employee ID: <strong>${emp.id}</strong></div>
            </div>
          </div>

          <div style="height: 1px; background: var(--card-border); margin: 1.5rem 0;"></div>

          <div class="profile-details-grid">
            <div class="profile-detail-item"><span class="profile-detail-label">Full Name</span><span class="profile-detail-value">${emp.name}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Employee ID</span><span class="profile-detail-value">${emp.id}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Personal Email</span><span class="profile-detail-value">${emp.email}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Work Email</span><span class="profile-detail-value">${emp.workEmail}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Phone Number</span><span class="profile-detail-value">${emp.phone}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Department</span><span class="profile-detail-value">${emp.department}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Designation</span><span class="profile-detail-value">${emp.designation}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Date of Joining</span><span class="profile-detail-value">${Components.formatDate(emp.joiningDate)}</span></div>
            <div class="profile-detail-item" style="grid-column: 1 / -1;"><span class="profile-detail-label">Residential Address</span><span class="profile-detail-value">${emp.address}</span></div>
          </div>
        </div>
      </div>`;
  },

  /* ── Edit Profile View ── */
  renderEditProfile(emp) {
    return `
      ${Components.BackButton('emp-profile')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Edit Profile</h1>
          <p class="page-subtitle">Update your personal contact information</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header" style="background: var(--warning-light); border-color: var(--warning-bg);">
          <span style="font-size:0.8125rem; font-weight:600; color:var(--warning);"><i class="bi bi-info-circle"></i> Profile is currently in Edit Mode. Company-assigned fields (ID, Designation, Department) cannot be modified.</span>
        </div>
        <div class="card-body">
          <form onsubmit="EmployeeViews.handleProfileSave(event)">
            <div class="grid-2">
              ${Components.FormInput({ id: 'edit-name', label: 'Full Name', value: emp.name, required: true, icon: 'person' })}
              ${Components.FormInput({ id: 'edit-email', label: 'Personal Email', type: 'email', value: emp.email, required: true, icon: 'envelope' })}
              ${Components.FormInput({ id: 'edit-phone', label: 'Phone Number', value: emp.phone, required: true, icon: 'telephone' })}
              ${Components.FormInput({ id: 'edit-work-email', label: 'Work Email', type: 'email', value: emp.workEmail, required: true, icon: 'building' })}
            </div>
            ${Components.FormTextarea({ id: 'edit-address', label: 'Residential Address', value: emp.address, required: true, rows: 3 })}

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
              <button type="button" class="btn btn-secondary" onclick="App.navigate('emp-profile')">Cancel</button>
              <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i> Save Changes</button>
            </div>
          </form>
        </div>
      </div>`;
  },

  handleProfileSave(e) {
    e.preventDefault();
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    const workEmail = document.getElementById('edit-work-email').value;
    const address = document.getElementById('edit-address').value;

    if (!name || !email || !phone || !workEmail || !address) {
      App.showToast('Please fill out all required fields.', 'error');
      return;
    }

    App.currentUser.name = name;
    App.currentUser.email = email;
    App.currentUser.phone = phone;
    App.currentUser.workEmail = workEmail;
    App.currentUser.address = address;

    App.updateUserInMockData(App.currentUser);
    App.saveSession();
    App.showToast('Profile updated successfully!', 'success');
    App.navigate('emp-profile');
  },

  /* ── Work History View ── */
  renderWorkHistory(emp) {
    const history = MockData.getEmployeeWorkHistory(emp.id);
    const columns = [
      { label: 'Task / Project', key: 'title', className: 'td-name' },
      { label: 'Start Date', key: 'startDate', render: r => Components.formatDate(r.startDate) },
      { label: 'Completion Date', key: 'endDate', render: r => r.endDate ? Components.formatDate(r.endDate) : 'Ongoing' },
      { label: 'Time Taken', key: 'timeTaken' },
      { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status) },
      { label: 'Action', key: 'id', render: r => `<button class="btn btn-ghost btn-sm" onclick="EmployeeViews.showWorkDetail('${r.id}')"><i class="bi bi-eye"></i> Details</button>` }
    ];

    return `
      ${Components.BackButton('emp-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Work History</h1>
          <p class="page-subtitle">Track record of your completed and ongoing projects</p>
        </div>
      </div>

      ${Components.DataTable({
        id: 'work-history-table',
        columns,
        rows: history,
        searchPlaceholder: 'Search work history...',
        filters: [{ key: 'status', label: 'All Statuses', options: ['Completed', 'In Progress'] }]
      })}`;
  },

  showWorkDetail(whId) {
    const history = MockData.getEmployeeWorkHistory(App.currentUser.id);
    const item = history.find(h => h.id === whId);
    if (!item) return;

    App.showModal('work-detail-modal', item.title, `
      <div class="detail-row"><span class="detail-label">Task Name</span><span class="detail-value fw-600">${item.title}</span></div>
      <div class="detail-row"><span class="detail-label">Start Date</span><span class="detail-value">${Components.formatDate(item.startDate)}</span></div>
      <div class="detail-row"><span class="detail-label">Completion Date</span><span class="detail-value">${item.endDate ? Components.formatDate(item.endDate) : 'Ongoing'}</span></div>
      <div class="detail-row"><span class="detail-label">Time Taken</span><span class="detail-value">${item.timeTaken}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">${Components.StatusBadge(item.status)}</span></div>
      <div class="detail-row" style="flex-direction:column;gap:0.5rem;margin-top:0.5rem;"><span class="detail-label">Description</span><span class="detail-value" style="line-height:1.5;">${item.description}</span></div>
    `, `<button class="btn btn-secondary" onclick="App.closeModal('work-detail-modal')">Close</button>`);
  },

  /* ── Attendance View ── */
  renderAttendance(emp) {
    const attendanceData = MockData.getAttendance(emp.id);
    const currentMonth = attendanceData[0];
    const s = currentMonth.summary;
    const workingDays = s.total - s.holiday;
    const pct = workingDays > 0 ? Math.round((s.present / workingDays) * 100) : 0;

    return `
      ${Components.BackButton('emp-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Attendance Overview</h1>
          <p class="page-subtitle">Track your daily presence, leaves, and attendance statistics</p>
        </div>
      </div>

      <div class="stats-grid">
        ${Components.StatCard({ icon: 'calendar-check', value: `${pct}%`, label: 'Attendance Rate', color: 'primary' })}
        ${Components.StatCard({ icon: 'check-circle', value: s.present, label: 'Present Days', color: 'success' })}
        ${Components.StatCard({ icon: 'clock-history', value: s.late, label: 'Late Days', color: 'warning' })}
        ${Components.StatCard({ icon: 'x-circle', value: s.absent, label: 'Absent Days', color: 'danger' })}
      </div>

      <div class="grid-2 mb-3">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Monthly Breakdown</h3></div>
          <div class="card-body"><div class="chart-container"><canvas id="chart-monthly-attendance"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Yearly Trend</h3></div>
          <div class="card-body"><div class="chart-container"><canvas id="chart-yearly-attendance"></canvas></div></div>
        </div>
      </div>

      <div id="calendar-container">
        ${Components.CalendarView({
          month: currentMonth.monthIndex,
          year: currentMonth.year,
          days: currentMonth.days,
          onMonthChange: 'EmployeeViews.changeCalendarMonth'
        })}
      </div>`;
  },

  calendarMonthOffset: 0,
  changeCalendarMonth(delta) {
    this.calendarMonthOffset += delta;
    if (this.calendarMonthOffset < 0) this.calendarMonthOffset = 11;
    if (this.calendarMonthOffset > 11) this.calendarMonthOffset = 0;
    const attendanceData = MockData.getAttendance(App.currentUser.id);
    const m = attendanceData[this.calendarMonthOffset] || attendanceData[0];
    const container = document.getElementById('calendar-container');
    if (container) {
      container.innerHTML = Components.CalendarView({
        month: m.monthIndex,
        year: m.year,
        days: m.days,
        onMonthChange: 'EmployeeViews.changeCalendarMonth'
      });
    }
  },

  /* ── Leave View ── */
  renderLeave(emp) {
    const balance = MockData.getEmployeeLeaveBalance(emp.id);
    const requests = MockData.getEmployeeLeaveRequests(emp.id);

    const columns = [
      { label: 'Leave Type', key: 'type', className: 'td-name' },
      { label: 'Start Date', key: 'startDate', render: r => Components.formatDate(r.startDate) },
      { label: 'End Date', key: 'endDate', render: r => Components.formatDate(r.endDate) },
      { label: 'Days', key: 'days' },
      { label: 'Reason', key: 'reason' },
      { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status) }
    ];

    return `
      ${Components.BackButton('emp-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Leave Management</h1>
          <p class="page-subtitle">View balances, submit leave applications, and track requests</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="EmployeeViews.exportLeaveReport()"><i class="bi bi-download"></i> Export Leave Report</button>
          <button class="btn btn-primary" onclick="EmployeeViews.openApplyLeaveModal()"><i class="bi bi-plus-lg"></i> Apply Leave</button>
        </div>
      </div>

      <div class="leave-grid">
        ${Components.LeaveCard({ title: 'Paid Leave', icon: 'wallet2', allocated: balance.paid.allocated, taken: balance.paid.taken, color: '#4F46E5' })}
        ${Components.LeaveCard({ title: 'Unpaid Leave', icon: 'file-earmark-break', allocated: balance.unpaid.allocated, taken: balance.unpaid.taken, color: '#D97706' })}
        ${Components.LeaveCard({ title: 'Sick Leave', icon: 'bandaid', allocated: balance.sick.allocated, taken: balance.sick.taken, color: '#DC2626' })}
      </div>

      <div class="card mb-3">
        <div class="card-header"><h3 class="card-title">Leave Requests History</h3></div>
        <div class="card-body" style="padding:0;">
          ${Components.DataTable({
            id: 'emp-leave-table',
            columns,
            rows: requests,
            searchPlaceholder: 'Search leave requests...',
            filters: [{ key: 'status', label: 'All Statuses', options: ['Pending', 'Approved', 'Rejected'] }]
          })}
        </div>
      </div>`;
  },

  openApplyLeaveModal() {
    App.showModal('apply-leave-modal', 'Apply for Leave', `
      <form id="apply-leave-form" onsubmit="EmployeeViews.handleApplyLeave(event)">
        ${Components.FormSelect({ id: 'leave-type', label: 'Leave Type', options: ['Paid Leave', 'Unpaid Leave', 'Sick Leave'], required: true })}
        <div class="grid-2">
          ${Components.FormInput({ id: 'leave-start-date', label: 'Start Date', type: 'date', required: true })}
          ${Components.FormInput({ id: 'leave-end-date', label: 'End Date', type: 'date', required: true })}
        </div>
        ${Components.FormTextarea({ id: 'leave-reason', label: 'Reason for Leave', placeholder: 'Provide a clear explanation...', required: true })}
        ${Components.FormInput({ id: 'leave-attachment', label: 'Optional Attachment (URL/Filename)', placeholder: 'e.g. medical_certificate.pdf' })}
        <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="App.closeModal('apply-leave-modal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit Application</button>
        </div>
      </form>
    `);
  },

  handleApplyLeave(e) {
    e.preventDefault();
    const type = document.getElementById('leave-type').value;
    const startDate = document.getElementById('leave-start-date').value;
    const endDate = document.getElementById('leave-end-date').value;
    const reason = document.getElementById('leave-reason').value;

    if (!type || !startDate || !endDate || !reason) {
      App.showToast('Please fill in all required fields.', 'error');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest = {
      id: `LR00${MockData.leaveRequests.length + 1}`,
      empId: App.currentUser.id,
      empName: App.currentUser.name,
      type, startDate, endDate, days: diffDays, reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    MockData.leaveRequests.unshift(newRequest);
    App.closeModal('apply-leave-modal');
    App.showToast('Leave application submitted successfully!', 'success');
    App.navigate('emp-leave');
  },

  exportLeaveReport() {
    const emp = App.currentUser;
    const requests = MockData.getEmployeeLeaveRequests(emp.id);
    let csv = `Leave Report for ${emp.name} (${emp.id})\nGenerated Date,${new Date().toLocaleDateString()}\n\nID,Leave Type,Start Date,End Date,Days,Reason,Status\n`;

    requests.forEach(r => {
      csv += `"${r.id}","${r.type}","${r.startDate}","${r.endDate}","${r.days}","${r.reason}","${r.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Leave_Report_${emp.id}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    App.showToast('Leave report exported as CSV/Excel spreadsheet!', 'success');
  },

  /* ── Work Mail View ── */
  renderWorkMail(emp) {
    const mails = MockData.getEmployeeMails(emp.id);

    return `
      ${Components.BackButton('emp-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Work Mail</h1>
          <p class="page-subtitle">Official communication and notifications from HR</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="mail-list">
            ${mails.length > 0
              ? mails.map(m => Components.MailItem({
                  id: m.id, subject: m.subject, from: m.from, date: m.date,
                  priority: m.priority, status: m.status, preview: m.message.substring(0, 80),
                  onClick: 'EmployeeViews.openMailDetail'
                })).join('')
              : Components.EmptyState({ icon: 'inbox', title: 'No work mail received' })
            }
          </div>
        </div>
      </div>`;
  },

  openMailDetail(mailId) {
    const mails = MockData.getEmployeeMails(App.currentUser.id);
    const mail = mails.find(m => m.id === mailId);
    if (!mail) return;

    mail.status = 'Read';

    App.showModal('mail-detail-modal', mail.subject, `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--card-border);">
        <div>
          <div style="font-size:0.875rem;font-weight:600;">From: ${mail.from}</div>
          <div style="font-size:0.75rem;color:var(--slate-500);">Date: ${Components.formatDate(mail.date)}</div>
        </div>
        ${Components.PriorityBadge(mail.priority)}
      </div>

      <div style="white-space:pre-wrap;font-size:0.875rem;line-height:1.6;color:var(--slate-800);margin-bottom:1.5rem;">
        ${mail.message}
      </div>

      <div style="border-top:1px solid var(--card-border);padding-top:1rem;">
        <h4 style="font-size:0.8125rem;font-weight:600;margin-bottom:0.75rem;">Action Options:</h4>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-success btn-sm" onclick="EmployeeViews.handleMailAction('${mail.id}', 'Done')"><i class="bi bi-check-circle"></i> Mark as Done</button>
          <button class="btn btn-primary btn-sm" onclick="EmployeeViews.openFeedbackModal('${mail.id}')"><i class="bi bi-chat-text"></i> Send Feedback</button>
          <button class="btn btn-warning btn-sm" onclick="EmployeeViews.openRedoModal('${mail.id}')"><i class="bi bi-arrow-counterclockwise"></i> Request Redo</button>
        </div>
      </div>
    `, `<button class="btn btn-secondary" onclick="App.closeModal('mail-detail-modal')">Close</button>`, true);
  },

  handleMailAction(mailId, action, extra = '') {
    const mails = MockData.getEmployeeMails(App.currentUser.id);
    const mail = mails.find(m => m.id === mailId);
    if (!mail) return;

    if (action === 'Done') {
      mail.status = 'Completed';
      if (mail.assignmentId) {
        const asn = MockData.assignments.find(a => a.id === mail.assignmentId);
        if (asn) asn.status = 'Completed';
      }
      App.showToast('Work marked as Completed! Confirmation sent to HR.', 'success');
    } else if (action === 'Feedback') {
      App.showToast(`Feedback sent to HR: "${extra}"`, 'success');
    } else if (action === 'Redo') {
      mail.status = 'Redo Requested';
      if (mail.assignmentId) {
        const asn = MockData.assignments.find(a => a.id === mail.assignmentId);
        if (asn) asn.status = 'Redo Requested';
      }
      App.showToast('Redo requested with reason. HR has been notified.', 'warning');
    }

    App.closeModal('mail-detail-modal');
    App.closeModal('feedback-modal');
    App.closeModal('redo-modal');
    App.navigate('emp-mail');
  },

  openFeedbackModal(mailId) {
    App.showModal('feedback-modal', 'Send Custom Feedback', `
      ${Components.FormTextarea({ id: 'feedback-text', label: 'Your Feedback / Comment', placeholder: 'Enter your response...', required: true })}
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
        <button type="button" class="btn btn-secondary" onclick="App.closeModal('feedback-modal')">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="EmployeeViews.submitFeedback('${mailId}')">Send Feedback</button>
      </div>
    `);
  },

  submitFeedback(mailId) {
    const text = document.getElementById('feedback-text').value;
    if (!text) { App.showToast('Please enter your feedback.', 'error'); return; }
    EmployeeViews.handleMailAction(mailId, 'Feedback', text);
  },

  openRedoModal(mailId) {
    App.showModal('redo-modal', 'Request Redo / Clarification', `
      ${Components.FormTextarea({ id: 'redo-reason', label: 'Reason for Redo Request', placeholder: 'Explain why a redo or clarification is needed...', required: true })}
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
        <button type="button" class="btn btn-secondary" onclick="App.closeModal('redo-modal')">Cancel</button>
        <button type="button" class="btn btn-warning" onclick="EmployeeViews.submitRedo('${mailId}')">Submit Request</button>
      </div>
    `);
  },

  submitRedo(mailId) {
    const text = document.getElementById('redo-reason').value;
    if (!text) { App.showToast('Please provide a reason.', 'error'); return; }
    EmployeeViews.handleMailAction(mailId, 'Redo', text);
  },

  /* ── Assignments View ── */
  renderAssignments(emp) {
    const assignments = MockData.getEmployeeAssignments(emp.id);

    return `
      ${Components.BackButton('emp-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">My Assignments</h1>
          <p class="page-subtitle">Work tasks assigned to you by HR and Management</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        ${assignments.length > 0
          ? assignments.map(a => Components.AssignmentCard({
              id: a.id, title: a.title, dueDate: a.dueDate, priority: a.priority,
              status: a.status, sender: a.sender, onClick: 'EmployeeViews.openAssignmentDetail'
            })).join('')
          : Components.EmptyState({ icon: 'card-checklist', title: 'No assignments found' })
        }
      </div>`;
  },

  openAssignmentDetail(asnId) {
    const assignments = MockData.getEmployeeAssignments(App.currentUser.id);
    const asn = assignments.find(a => a.id === asnId);
    if (!asn) return;

    App.showModal('assignment-detail-modal', asn.title, `
      <div class="detail-row"><span class="detail-label">Assigned By</span><span class="detail-value fw-600">${asn.sender}</span></div>
      <div class="detail-row"><span class="detail-label">Assigned Date</span><span class="detail-value">${Components.formatDate(asn.assignedDate)}</span></div>
      <div class="detail-row"><span class="detail-label">Due Date</span><span class="detail-value">${Components.formatDate(asn.dueDate)}</span></div>
      <div class="detail-row"><span class="detail-label">Priority</span><span class="detail-value">${Components.PriorityBadge(asn.priority)}</span></div>
      <div class="detail-row"><span class="detail-label">Current Status</span><span class="detail-value">${Components.StatusBadge(asn.status)}</span></div>
      <div class="detail-row" style="flex-direction:column;gap:0.5rem;margin-top:0.5rem;"><span class="detail-label">Instructions</span><span class="detail-value" style="line-height:1.5;">${asn.description}</span></div>

      <div style="border-top:1px solid var(--card-border);padding-top:1rem;margin-top:1rem;">
        <h4 style="font-size:0.8125rem;font-weight:600;margin-bottom:0.75rem;">Actions:</h4>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-success btn-sm" onclick="EmployeeViews.markAssignmentComplete('${asn.id}')"><i class="bi bi-check-lg"></i> Mark Completed</button>
          <button class="btn btn-primary btn-sm" onclick="EmployeeViews.openAssignmentFeedback('${asn.id}')"><i class="bi bi-chat-text"></i> Send Feedback</button>
          <button class="btn btn-warning btn-sm" onclick="EmployeeViews.openAssignmentRedo('${asn.id}')"><i class="bi bi-arrow-counterclockwise"></i> Request Redo</button>
        </div>
      </div>
    `, `<button class="btn btn-secondary" onclick="App.closeModal('assignment-detail-modal')">Close</button>`, true);
  },

  markAssignmentComplete(asnId) {
    const asn = MockData.assignments.find(a => a.id === asnId);
    if (asn) {
      asn.status = 'Completed';
      App.showToast('Assignment marked as Completed!', 'success');
      App.closeModal('assignment-detail-modal');
      App.navigate('emp-assignments');
    }
  },

  openAssignmentFeedback(asnId) {
    App.showModal('asn-feedback-modal', 'Send Assignment Feedback', `
      ${Components.FormTextarea({ id: 'asn-feedback-text', label: 'Feedback / Comment', placeholder: 'Provide update to HR...', required: true })}
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
        <button type="button" class="btn btn-secondary" onclick="App.closeModal('asn-feedback-modal')">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="EmployeeViews.submitAssignmentFeedback('${asnId}')">Send</button>
      </div>
    `);
  },

  submitAssignmentFeedback(asnId) {
    const text = document.getElementById('asn-feedback-text').value;
    if (!text) { App.showToast('Please enter feedback.', 'error'); return; }
    App.showToast('Feedback submitted to HR!', 'success');
    App.closeModal('asn-feedback-modal');
    App.closeModal('assignment-detail-modal');
  },

  openAssignmentRedo(asnId) {
    App.showModal('asn-redo-modal', 'Request Redo / Clarification', `
      ${Components.FormTextarea({ id: 'asn-redo-text', label: 'Reason for Redo Request', placeholder: 'Explain why clarification or redo is required...', required: true })}
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
        <button type="button" class="btn btn-secondary" onclick="App.closeModal('asn-redo-modal')">Cancel</button>
        <button type="button" class="btn btn-warning" onclick="EmployeeViews.submitAssignmentRedo('${asnId}')">Submit Request</button>
      </div>
    `);
  },

  submitAssignmentRedo(asnId) {
    const text = document.getElementById('asn-redo-text').value;
    if (!text) { App.showToast('Please enter a reason.', 'error'); return; }
    const asn = MockData.assignments.find(a => a.id === asnId);
    if (asn) asn.status = 'Redo Requested';
    App.showToast('Redo request submitted to HR!', 'warning');
    App.closeModal('asn-redo-modal');
    App.closeModal('assignment-detail-modal');
    App.navigate('emp-assignments');
  }
};
