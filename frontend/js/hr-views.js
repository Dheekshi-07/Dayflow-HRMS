/* ============================================================
   HRFlow — HR View Renderers
   ============================================================ */

const HRViews = {

  /* ── HR Dashboard ── */
  renderDashboard(hr) {
    const stats = MockData.getTodayStats();
    const employees = MockData.getEmployees();

    return `
      <div class="welcome-section">
        <h1>HR Management Dashboard 🏢</h1>
        <p>Welcome back, ${hr.name} • ${hr.designation}</p>
      </div>

      <div class="stats-grid">
        ${Components.StatCard({ icon: 'people-fill', value: stats.total, label: 'Total Employees', color: 'primary' })}
        ${Components.StatCard({ icon: 'person-check-fill', value: stats.present, label: "Today's Present", color: 'success' })}
        ${Components.StatCard({ icon: 'person-x-fill', value: stats.absent, label: "Today's Absent", color: 'danger' })}
        ${Components.StatCard({ icon: 'calendar-event-fill', value: stats.onLeave, label: 'Employees on Leave', color: 'info' })}
        ${Components.StatCard({ icon: 'clock-fill', value: stats.pendingLeaves, label: 'Pending Leave Requests', color: 'warning' })}
        ${Components.StatCard({ icon: 'card-checklist', value: stats.pendingAssignments, label: 'Pending Assignments', color: 'primary' })}
      </div>

      <div class="grid-2 mb-3">
        <div class="card">
          <div class="card-header"><h3 class="card-title"><i class="bi bi-bar-chart-line text-primary"></i> Attendance Overview</h3></div>
          <div class="card-body"><div class="chart-container"><canvas id="chart-hr-attendance"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title"><i class="bi bi-pie-chart text-primary"></i> Department Distribution</h3></div>
          <div class="card-body"><div class="chart-container"><canvas id="chart-hr-dept"></canvas></div></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Employee Quick Directory</h3>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('hr-employees')">View All Directory</button>
        </div>
        <div class="card-body" style="padding:0;">
          ${Components.DataTable({
            id: 'hr-dash-emp-table',
            columns: [
              { label: 'Employee ID', key: 'id', className: 'td-name' },
              { label: 'Name', key: 'name' },
              { label: 'Department', key: 'department' },
              { label: 'Designation', key: 'designation' },
              { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status || 'Active') },
              { label: 'Action', key: 'id', render: r => `<button class="btn btn-ghost btn-sm" onclick="HRViews.openEmployeeDetails('${r.id}')"><i class="bi bi-eye"></i> View</button>` }
            ],
            rows: employees.slice(0, 5),
            searchPlaceholder: 'Search employee...'
          })}
        </div>
      </div>`;
  },

  /* ── HR Profile View ── */
  renderProfile(hr) {
    return `
      ${Components.BackButton('hr-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">HR Profile</h1>
          <p class="page-subtitle">Your administrator account profile</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="HRViews.openEditProfileModal()"><i class="bi bi-pencil-square"></i> Edit Profile</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="profile-header">
            <div class="profile-avatar">${hr.avatar || 'HR'}</div>
            <div class="profile-info">
              <h2>${hr.name}</h2>
              <div class="profile-role">${hr.designation} • ${hr.department}</div>
              <div class="profile-id">HR ID: <strong>${hr.id}</strong></div>
            </div>
          </div>

          <div style="height:1px;background:var(--card-border);margin:1.5rem 0;"></div>

          <div class="profile-details-grid">
            <div class="profile-detail-item"><span class="profile-detail-label">Full Name</span><span class="profile-detail-value">${hr.name}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">HR ID</span><span class="profile-detail-value">${hr.id}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Personal Email</span><span class="profile-detail-value">${hr.email}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Work Email</span><span class="profile-detail-value">${hr.workEmail}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Phone Number</span><span class="profile-detail-value">${hr.phone}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Department</span><span class="profile-detail-value">${hr.department}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Designation</span><span class="profile-detail-value">${hr.designation}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Date of Joining</span><span class="profile-detail-value">${Components.formatDate(hr.joiningDate)}</span></div>
            <div class="profile-detail-item" style="grid-column:1 / -1;"><span class="profile-detail-label">Office Address</span><span class="profile-detail-value">${hr.address}</span></div>
          </div>
        </div>
      </div>`;
  },

  openEditProfileModal() {
    const hr = App.currentUser;
    App.showModal('hr-edit-profile-modal', 'Edit HR Profile', `
      <form id="hr-edit-profile-form" onsubmit="HRViews.handleSaveProfile(event)">
        ${Components.FormInput({ id: 'hr-edit-name', label: 'Full Name', value: hr.name, required: true })}
        ${Components.FormInput({ id: 'hr-edit-email', label: 'Personal Email', type: 'email', value: hr.email, required: true })}
        ${Components.FormInput({ id: 'hr-edit-phone', label: 'Phone Number', value: hr.phone, required: true })}
        ${Components.FormInput({ id: 'hr-edit-work-email', label: 'Work Email', type: 'email', value: hr.workEmail, required: true })}
        ${Components.FormTextarea({ id: 'hr-edit-address', label: 'Office Address', value: hr.address, required: true })}
        <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
          <button type="button" class="btn btn-secondary" onclick="App.closeModal('hr-edit-profile-modal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    `);
  },

  handleSaveProfile(e) {
    e.preventDefault();
    App.currentUser.name = document.getElementById('hr-edit-name').value;
    App.currentUser.email = document.getElementById('hr-edit-email').value;
    App.currentUser.phone = document.getElementById('hr-edit-phone').value;
    App.currentUser.workEmail = document.getElementById('hr-edit-work-email').value;
    App.currentUser.address = document.getElementById('hr-edit-address').value;

    App.updateUserInMockData(App.currentUser);
    App.saveSession();
    App.closeModal('hr-edit-profile-modal');
    App.showToast('HR profile updated successfully!', 'success');
    App.navigate('hr-profile');
  },

  /* ── Employees Page ── */
  renderEmployees() {
    const employees = MockData.getEmployees();
    const depts = [...new Set(employees.map(e => e.department))];

    const columns = [
      { label: 'Employee ID', key: 'id', className: 'td-name' },
      { label: 'Name', key: 'name' },
      { label: 'Department', key: 'department' },
      { label: 'Designation', key: 'designation' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status || 'Active') },
      { label: 'Action', key: 'id', render: r => `<button class="btn btn-ghost btn-sm" onclick="HRViews.openEmployeeDetails('${r.id}')"><i class="bi bi-eye"></i> Details</button>` }
    ];

    return `
      ${Components.BackButton('hr-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Employees Directory</h1>
          <p class="page-subtitle">Search, filter, and view detailed employee information</p>
        </div>
      </div>

      ${Components.DataTable({
        id: 'hr-employees-table',
        columns,
        rows: employees,
        searchPlaceholder: 'Search employee by ID, name, email...',
        filters: [
          { key: 'department', label: 'All Departments', options: depts },
          { key: 'status', label: 'All Statuses', options: ['Active', 'On Leave'] }
        ]
      })}`;
  },

  /* ── Employee Details for HR ── */
  selectedEmpId: null,
  openEmployeeDetails(empId) {
    this.selectedEmpId = empId;
    App.navigate('hr-employee-details');
  },

  renderEmployeeDetails() {
    const emp = MockData.getUserById(this.selectedEmpId || 'OIRASH20230003');
    if (!emp) return Components.EmptyState({ icon: 'person-x', title: 'Employee not found' });

    const assignments = MockData.getEmployeeAssignments(emp.id);
    const leaveRequests = MockData.getEmployeeLeaveRequests(emp.id);
    const workHistory = MockData.getEmployeeWorkHistory(emp.id);
    const leaveBalance = MockData.getEmployeeLeaveBalance(emp.id);

    return `
      ${Components.BackButton('hr-employees', 'Back to Employees')}
      <div class="page-header">
        <div>
          <h1 class="page-title">${emp.name}</h1>
          <p class="page-subtitle">Employee Profile & Management Overview</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="HRViews.openAssignWorkForEmp('${emp.id}')"><i class="bi bi-plus-lg"></i> Assign Work</button>
          <button class="btn btn-secondary" onclick="HRViews.openSendMailModal('${emp.id}')"><i class="bi bi-envelope"></i> Send Work Mail</button>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <div class="profile-header">
            <div class="profile-avatar">${emp.avatar || emp.name.substring(0, 2)}</div>
            <div class="profile-info">
              <h2>${emp.name}</h2>
              <div class="profile-role">${emp.designation} • ${emp.department}</div>
              <div class="profile-id">Employee ID: <strong>${emp.id}</strong></div>
            </div>
            <div style="margin-left:auto;">${Components.StatusBadge(emp.status || 'Active')}</div>
          </div>

          <div style="height:1px;background:var(--card-border);margin:1.5rem 0;"></div>

          <div class="profile-details-grid">
            <div class="profile-detail-item"><span class="profile-detail-label">Email</span><span class="profile-detail-value">${emp.email}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Work Email</span><span class="profile-detail-value">${emp.workEmail}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Phone</span><span class="profile-detail-value">${emp.phone}</span></div>
            <div class="profile-detail-item"><span class="profile-detail-label">Joining Date</span><span class="profile-detail-value">${Components.formatDate(emp.joiningDate)}</span></div>
            <div class="profile-detail-item" style="grid-column:1 / -1;"><span class="profile-detail-label">Address</span><span class="profile-detail-value">${emp.address}</span></div>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button class="tab-btn active" onclick="HRViews.switchTab('tab-assignments', this)">Assignments (${assignments.length})</button>
        <button class="tab-btn" onclick="HRViews.switchTab('tab-leave', this)">Leave Requests (${leaveRequests.length})</button>
        <button class="tab-btn" onclick="HRViews.switchTab('tab-history', this)">Work History (${workHistory.length})</button>
      </div>

      <div id="tab-assignments" class="tab-content active">
        <div class="card">
          <div class="card-body">
            ${assignments.length > 0
              ? assignments.map(a => Components.AssignmentCard({
                  id: a.id, title: a.title, dueDate: a.dueDate, priority: a.priority,
                  status: a.status, sender: a.sender, onClick: 'EmployeeViews.openAssignmentDetail'
                })).join('')
              : Components.EmptyState({ icon: 'card-checklist', title: 'No assignments for this employee' })
            }
          </div>
        </div>
      </div>

      <div id="tab-leave" class="tab-content">
        <div class="leave-grid">
          ${Components.LeaveCard({ title: 'Paid Leave', icon: 'wallet2', allocated: leaveBalance.paid.allocated, taken: leaveBalance.paid.taken, color: '#4F46E5' })}
          ${Components.LeaveCard({ title: 'Unpaid Leave', icon: 'file-earmark-break', allocated: leaveBalance.unpaid.allocated, taken: leaveBalance.unpaid.taken, color: '#D97706' })}
          ${Components.LeaveCard({ title: 'Sick Leave', icon: 'bandaid', allocated: leaveBalance.sick.allocated, taken: leaveBalance.sick.taken, color: '#DC2626' })}
        </div>
      </div>

      <div id="tab-history" class="tab-content">
        <div class="card">
          <div class="card-body" style="padding:0;">
            ${Components.DataTable({
              id: 'hr-emp-detail-history-table',
              columns: [
                { label: 'Task Name', key: 'title', className: 'td-name' },
                { label: 'Start Date', key: 'startDate', render: r => Components.formatDate(r.startDate) },
                { label: 'End Date', key: 'endDate', render: r => r.endDate ? Components.formatDate(r.endDate) : 'Ongoing' },
                { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status) }
              ],
              rows: workHistory,
              searchPlaceholder: 'Search history...'
            })}
          </div>
        </div>
      </div>`;
  },

  switchTab(tabId, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const content = document.getElementById(tabId);
    if (content) content.classList.add('active');
  },

  /* ── HR Assignment System ── */
  renderAssignments() {
    const assignments = MockData.assignments;
    const employees = MockData.getEmployees();

    return `
      ${Components.BackButton('hr-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Assignment Management</h1>
          <p class="page-subtitle">Assign work tasks to employees and track completion status</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="HRViews.openNewAssignmentModal()"><i class="bi bi-plus-lg"></i> Create New Assignment</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          ${Components.DataTable({
            id: 'hr-assignments-table',
            columns: [
              { label: 'Assignment Title', key: 'title', className: 'td-name' },
              { label: 'Assigned To', key: 'empName' },
              { label: 'Assigned Date', key: 'assignedDate', render: r => Components.formatDate(r.assignedDate) },
              { label: 'Due Date', key: 'dueDate', render: r => Components.formatDate(r.dueDate) },
              { label: 'Priority', key: 'priority', render: r => Components.PriorityBadge(r.priority) },
              { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status) }
            ],
            rows: assignments,
            searchPlaceholder: 'Search assignment by title, employee...',
            filters: [{ key: 'status', label: 'All Statuses', options: ['Pending', 'In Progress', 'Completed', 'Redo Requested'] }]
          })}
        </div>
      </div>`;
  },

  openNewAssignmentModal(preselectEmpId = '') {
    const employees = MockData.getEmployees();
    const empOptions = employees.map(e => ({ value: e.id, label: `${e.name} (${e.id} - ${e.department})` }));

    App.showModal('new-asn-modal', 'Create New Work Assignment', `
      <form id="new-asn-form" onsubmit="HRViews.handleSendAssignment(event)">
        ${Components.FormSelect({ id: 'asn-emp-id', label: 'Select Employee', options: empOptions, value: preselectEmpId, required: true })}
        ${Components.FormInput({ id: 'asn-title', label: 'Assignment Title', placeholder: 'e.g. Q3 Performance Report', required: true })}
        ${Components.FormTextarea({ id: 'asn-desc', label: 'Instructions / Description', placeholder: 'Provide detailed instructions...', required: true })}
        <div class="grid-2">
          ${Components.FormInput({ id: 'asn-due-date', label: 'Due Date', type: 'date', required: true })}
          ${Components.FormSelect({ id: 'asn-priority', label: 'Priority Level', options: ['High', 'Medium', 'Low'], value: 'Medium', required: true })}
        </div>
        ${Components.FormInput({ id: 'asn-file', label: 'Attach File / Script URL (Optional)', placeholder: 'e.g. document_spec.pdf' })}

        <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="App.closeModal('new-asn-modal')">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="bi bi-send"></i> Send Assignment</button>
        </div>
      </form>
    `, '', true);
  },

  openAssignWorkForEmp(empId) {
    this.openNewAssignmentModal(empId);
  },

  handleSendAssignment(e) {
    e.preventDefault();
    const empId = document.getElementById('asn-emp-id').value;
    const title = document.getElementById('asn-title').value;
    const desc = document.getElementById('asn-desc').value;
    const dueDate = document.getElementById('asn-due-date').value;
    const priority = document.getElementById('asn-priority').value;

    if (!empId || !title || !desc || !dueDate) {
      App.showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emp = MockData.getUserById(empId);
    if (!emp) {
      App.showToast('Selected employee not found!', 'error');
      return;
    }

    const newAsn = {
      id: `ASN00${MockData.assignments.length + 1}`,
      empId: emp.id,
      empName: emp.name,
      title,
      description: desc,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      priority,
      status: 'Pending',
      sender: App.currentUser.name
    };

    MockData.assignments.unshift(newAsn);

    // Also automatically create Work Mail for employee
    const newMail = {
      id: `WM00${MockData.workMails.length + 1}`,
      empId: emp.id,
      from: App.currentUser.name,
      to: emp.name,
      subject: `New Assignment: ${title}`,
      message: `Dear ${emp.name},\n\nYou have been assigned a new task: "${title}".\n\nInstructions:\n${desc}\n\nDue Date: ${dueDate}\nPriority: ${priority}\n\nPlease review and complete by the due date.`,
      date: new Date().toISOString().split('T')[0],
      priority,
      status: 'Unread',
      requiresAction: true,
      assignmentId: newAsn.id
    };

    MockData.workMails.unshift(newMail);

    App.closeModal('new-asn-modal');
    App.showToast(`Assignment sent successfully to ${emp.name}'s Work Mail!`, 'success');
    App.navigate('hr-assignments');
  },

  /* ── HR Work Mail Management ── */
  renderWorkMail() {
    const mails = MockData.workMails;

    return `
      ${Components.BackButton('hr-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Work Mail Management</h1>
          <p class="page-subtitle">Monitor employee communications and task completions</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          ${Components.DataTable({
            id: 'hr-work-mail-table',
            columns: [
              { label: 'Recipient Employee', key: 'to', className: 'td-name' },
              { label: 'Subject', key: 'subject' },
              { label: 'Date', key: 'date', render: r => Components.formatDate(r.date) },
              { label: 'Priority', key: 'priority', render: r => Components.PriorityBadge(r.priority) },
              { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status) },
              { label: 'Actions', key: 'id', render: r => `
                <button class="btn btn-success btn-sm" onclick="HRViews.approveMailTask('${r.id}')" title="Approve Task"><i class="bi bi-check-lg"></i> Approve</button>
                <button class="btn btn-primary btn-sm" onclick="HRViews.openHRFeedbackModal('${r.id}')" title="Send Feedback"><i class="bi bi-chat-text"></i></button>
                <button class="btn btn-warning btn-sm" onclick="HRViews.openHRRedoModal('${r.id}')" title="Request Redo"><i class="bi bi-arrow-counterclockwise"></i></button>`
              }
            ],
            rows: mails,
            searchPlaceholder: 'Search mail by employee, subject...'
          })}
        </div>
      </div>`;
  },

  approveMailTask(mailId) {
    const mail = MockData.workMails.find(m => m.id === mailId);
    if (mail) {
      mail.status = 'Completed';
      if (mail.assignmentId) {
        const asn = MockData.assignments.find(a => a.id === mail.assignmentId);
        if (asn) asn.status = 'Completed';
      }
      App.showToast(`Task for "${mail.to}" marked as Approved! Confirmation sent.`, 'success');
      App.navigate('hr-work-mail');
    }
  },

  openHRFeedbackModal(mailId) {
    App.showModal('hr-feedback-modal', 'Send HR Feedback to Employee', `
      ${Components.FormTextarea({ id: 'hr-feedback-text', label: 'HR Feedback / Instructions', placeholder: 'Write feedback for the employee...', required: true })}
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
        <button type="button" class="btn btn-secondary" onclick="App.closeModal('hr-feedback-modal')">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="HRViews.submitHRFeedback('${mailId}')">Send Feedback Mail</button>
      </div>
    `);
  },

  submitHRFeedback(mailId) {
    const text = document.getElementById('hr-feedback-text').value;
    if (!text) { App.showToast('Please enter feedback.', 'error'); return; }
    App.showToast('Feedback sent to employee!', 'success');
    App.closeModal('hr-feedback-modal');
  },

  openHRRedoModal(mailId) {
    App.showModal('hr-redo-modal', 'Request Employee to Redo Task', `
      ${Components.FormTextarea({ id: 'hr-redo-reason', label: 'Reason & Redo Instructions', placeholder: 'Explain what needs to be redone...', required: true })}
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
        <button type="button" class="btn btn-secondary" onclick="App.closeModal('hr-redo-modal')">Cancel</button>
        <button type="button" class="btn btn-warning" onclick="HRViews.submitHRRedo('${mailId}')">Send Redo Request</button>
      </div>
    `);
  },

  submitHRRedo(mailId) {
    const text = document.getElementById('hr-redo-reason').value;
    if (!text) { App.showToast('Please enter redo instructions.', 'error'); return; }
    const mail = MockData.workMails.find(m => m.id === mailId);
    if (mail) {
      mail.status = 'Redo Requested';
      if (mail.assignmentId) {
        const asn = MockData.assignments.find(a => a.id === mail.assignmentId);
        if (asn) asn.status = 'Redo Requested';
      }
    }
    App.showToast('Redo request sent to employee!', 'warning');
    App.closeModal('hr-redo-modal');
    App.navigate('hr-work-mail');
  },

  openSendMailModal(empId) {
    const emp = MockData.getUserById(empId);
    if (!emp) return;

    App.showModal('send-mail-modal', `Send Work Mail to ${emp.name}`, `
      <form onsubmit="HRViews.handleSendDirectMail(event, '${emp.id}')">
        ${Components.FormInput({ id: 'direct-mail-subject', label: 'Subject', placeholder: 'e.g. Policy Update', required: true })}
        ${Components.FormSelect({ id: 'direct-mail-priority', label: 'Priority', options: ['High', 'Medium', 'Low'], value: 'Medium', required: true })}
        ${Components.FormTextarea({ id: 'direct-mail-body', label: 'Message Body', placeholder: 'Enter your message...', required: true })}
        <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
          <button type="button" class="btn btn-secondary" onclick="App.closeModal('send-mail-modal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Send Mail</button>
        </div>
      </form>
    `);
  },

  handleSendDirectMail(e, empId) {
    e.preventDefault();
    const emp = MockData.getUserById(empId);
    const subject = document.getElementById('direct-mail-subject').value;
    const priority = document.getElementById('direct-mail-priority').value;
    const message = document.getElementById('direct-mail-body').value;

    const newMail = {
      id: `WM00${MockData.workMails.length + 1}`,
      empId: emp.id,
      from: App.currentUser.name,
      to: emp.name,
      subject,
      message,
      date: new Date().toISOString().split('T')[0],
      priority,
      status: 'Unread',
      requiresAction: false
    };

    MockData.workMails.unshift(newMail);
    App.closeModal('send-mail-modal');
    App.showToast(`Work mail sent to ${emp.name}!`, 'success');
  },

  /* ── HR Leave Management ── */
  renderLeaveManagement() {
    const requests = MockData.leaveRequests;

    return `
      ${Components.BackButton('hr-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Leave Requests Management</h1>
          <p class="page-subtitle">Review, approve, or reject employee leave applications</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          ${Components.DataTable({
            id: 'hr-leave-requests-table',
            columns: [
              { label: 'Employee', key: 'empName', className: 'td-name' },
              { label: 'Leave Type', key: 'type' },
              { label: 'Start Date', key: 'startDate', render: r => Components.formatDate(r.startDate) },
              { label: 'End Date', key: 'endDate', render: r => Components.formatDate(r.endDate) },
              { label: 'Days', key: 'days' },
              { label: 'Reason', key: 'reason' },
              { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status) },
              { label: 'Action', key: 'id', render: r => r.status === 'Pending' ? `
                <div class="td-actions">
                  <button class="btn btn-success btn-sm" onclick="HRViews.approveLeave('${r.id}')"><i class="bi bi-check-lg"></i> Approve</button>
                  <button class="btn btn-danger btn-sm" onclick="HRViews.openRejectLeaveModal('${r.id}')"><i class="bi bi-x-lg"></i> Reject</button>
                </div>` : '<span style="font-size:0.75rem;color:var(--slate-400);">Actioned</span>'
              }
            ],
            rows: requests,
            searchPlaceholder: 'Search request by employee, type...',
            filters: [{ key: 'status', label: 'All Statuses', options: ['Pending', 'Approved', 'Rejected'] }]
          })}
        </div>
      </div>`;
  },

  approveLeave(reqId) {
    const req = MockData.leaveRequests.find(r => r.id === reqId);
    if (req) {
      req.status = 'Approved';
      // Deduct from balance
      const bal = MockData.getEmployeeLeaveBalance(req.empId);
      if (req.type.includes('Paid')) bal.paid.taken += req.days;
      else if (req.type.includes('Sick')) bal.sick.taken += req.days;
      else if (req.type.includes('Unpaid')) bal.unpaid.taken += req.days;

      App.showToast(`Leave request for ${req.empName} approved! Auto-notification sent.`, 'success');
      App.navigate('hr-leave');
    }
  },

  openRejectLeaveModal(reqId) {
    App.showModal('reject-leave-modal', 'Reject Leave Request', `
      ${Components.FormTextarea({ id: 'rejection-reason', label: 'Rejection Reason', placeholder: 'Provide reason for rejection...', required: true })}
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
        <button type="button" class="btn btn-secondary" onclick="App.closeModal('reject-leave-modal')">Cancel</button>
        <button type="button" class="btn btn-danger" onclick="HRViews.submitRejectLeave('${reqId}')">Reject Request</button>
      </div>
    `);
  },

  submitRejectLeave(reqId) {
    const reason = document.getElementById('rejection-reason').value;
    if (!reason) { App.showToast('Please enter a rejection reason.', 'error'); return; }
    const req = MockData.leaveRequests.find(r => r.id === reqId);
    if (req) {
      req.status = 'Rejected';
      req.rejectionReason = reason;
      App.showToast(`Leave request for ${req.empName} rejected. Notification sent.`, 'warning');
      App.closeModal('reject-leave-modal');
      App.navigate('hr-leave');
    }
  },

  /* ── Permission Mail Page ── */
  renderPermissionMail() {
    const requests = MockData.permissionRequests;

    return `
      ${Components.BackButton('hr-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Permission Mail</h1>
          <p class="page-subtitle">Review short-term permissions (early leave, late arrival, WFH)</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          ${Components.DataTable({
            id: 'hr-permissions-table',
            columns: [
              { label: 'Employee', key: 'empName', className: 'td-name' },
              { label: 'Type', key: 'type' },
              { label: 'Date', key: 'date', render: r => Components.formatDate(r.date) },
              { label: 'Time / Duration', key: 'time' },
              { label: 'Reason', key: 'reason' },
              { label: 'Status', key: 'status', render: r => Components.StatusBadge(r.status) },
              { label: 'Action', key: 'id', render: r => r.status === 'Pending' ? `
                <div class="td-actions">
                  <button class="btn btn-success btn-sm" onclick="HRViews.approvePermission('${r.id}')"><i class="bi bi-check-lg"></i> Approve</button>
                  <button class="btn btn-danger btn-sm" onclick="HRViews.rejectPermission('${r.id}')"><i class="bi bi-x-lg"></i> Reject</button>
                </div>` : '<span style="font-size:0.75rem;color:var(--slate-400);">Actioned</span>'
              }
            ],
            rows: requests,
            searchPlaceholder: 'Search permissions...'
          })}
        </div>
      </div>`;
  },

  approvePermission(prId) {
    const pr = MockData.permissionRequests.find(p => p.id === prId);
    if (pr) {
      pr.status = 'Approved';
      App.showToast(`Permission for ${pr.empName} approved!`, 'success');
      App.navigate('hr-permission-mail');
    }
  },

  rejectPermission(prId) {
    const pr = MockData.permissionRequests.find(p => p.id === prId);
    if (pr) {
      pr.status = 'Rejected';
      App.showToast(`Permission for ${pr.empName} rejected.`, 'warning');
      App.navigate('hr-permission-mail');
    }
  },

  /* ── HR Reports ── */
  renderReports() {
    return `
      ${Components.BackButton('hr-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">Reports & Analytics</h1>
          <p class="page-subtitle">Export organization-wide HR performance reports</p>
        </div>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-body" style="text-align:center;padding:2rem 1.5rem;">
            <i class="bi bi-file-earmark-spreadsheet" style="font-size:2.5rem;color:var(--primary);margin-bottom:1rem;display:inline-block;"></i>
            <h3>Attendance Report</h3>
            <p style="font-size:0.8125rem;color:var(--slate-500);margin:0.5rem 0 1.5rem;">Full monthly attendance records across all departments.</p>
            <button class="btn btn-primary btn-block" onclick="HRViews.exportReport('Attendance')"><i class="bi bi-download"></i> Export Excel</button>
          </div>
        </div>

        <div class="card">
          <div class="card-body" style="text-align:center;padding:2rem 1.5rem;">
            <i class="bi bi-calendar2-minus" style="font-size:2.5rem;color:var(--warning);margin-bottom:1rem;display:inline-block;"></i>
            <h3>Leave Report</h3>
            <p style="font-size:0.8125rem;color:var(--slate-500);margin:0.5rem 0 1.5rem;">Summary of all leave balances, applications, and approvals.</p>
            <button class="btn btn-warning btn-block" onclick="HRViews.exportReport('Leave')"><i class="bi bi-download"></i> Export Excel</button>
          </div>
        </div>

        <div class="card">
          <div class="card-body" style="text-align:center;padding:2rem 1.5rem;">
            <i class="bi bi-card-checklist" style="font-size:2.5rem;color:var(--success);margin-bottom:1rem;display:inline-block;"></i>
            <h3>Assignments Report</h3>
            <p style="font-size:0.8125rem;color:var(--slate-500);margin:0.5rem 0 1.5rem;">Completion rates and overdue task metrics across teams.</p>
            <button class="btn btn-success btn-block" onclick="HRViews.exportReport('Assignments')"><i class="bi bi-download"></i> Export Excel</button>
          </div>
        </div>
      </div>`;
  },

  exportReport(type) {
    let csv = `${type} Report - HRFlow\nGenerated Date,${new Date().toLocaleDateString()}\n\n`;
    if (type === 'Attendance') {
      csv += "Employee ID,Name,Department,Attendance %\n";
      MockData.getEmployees().forEach(e => {
        csv += `"${e.id}","${e.name}","${e.department}","94%"\n`;
      });
    } else if (type === 'Leave') {
      csv += "Employee ID,Name,Paid Taken,Sick Taken,Unpaid Taken\n";
      MockData.getEmployees().forEach(e => {
        const b = MockData.getEmployeeLeaveBalance(e.id);
        csv += `"${e.id}","${e.name}","${b.paid.taken}","${b.sick.taken}","${b.unpaid.taken}"\n`;
      });
    } else if (type === 'Assignments') {
      csv += "Assignment ID,Title,Employee,Due Date,Status\n";
      MockData.assignments.forEach(a => {
        csv += `"${a.id}","${a.title}","${a.empName}","${a.dueDate}","${a.status}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HR_${type}_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    App.showToast(`${type} Report exported successfully!`, 'success');
  },

  /* ── HR Settings ── */
  renderSettings() {
    return `
      ${Components.BackButton('hr-dashboard')}
      <div class="page-header">
        <div>
          <h1 class="page-title">HR System Settings</h1>
          <p class="page-subtitle">Configure application policies and role management</p>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header"><h3 class="card-title">Leave Allocations</h3></div>
        <div class="card-body">
          <div class="grid-3">
            ${Components.FormInput({ id: 'set-paid', label: 'Annual Paid Leaves', type: 'number', value: '20' })}
            ${Components.FormInput({ id: 'set-sick', label: 'Annual Sick Leaves', type: 'number', value: '12' })}
            ${Components.FormInput({ id: 'set-unpaid', label: 'Annual Unpaid Leaves', type: 'number', value: '10' })}
          </div>
          <button class="btn btn-primary" onclick="App.showToast('Leave policies updated!','success')">Save Settings</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="card-title">System Preferences</h3></div>
        <div class="card-body">
          <div class="form-check mb-2">
            <input type="checkbox" id="pref-email-notif" checked />
            <label for="pref-email-notif">Enable automatic email notifications for leave requests</label>
          </div>
          <div class="form-check mb-2">
            <input type="checkbox" id="pref-auto-reminder" checked />
            <label for="pref-auto-reminder">Send assignment due date reminders 2 days prior</label>
          </div>
          <button class="btn btn-primary" onclick="App.showToast('System preferences saved!','success')">Save Preferences</button>
        </div>
      </div>`;
  }
};
