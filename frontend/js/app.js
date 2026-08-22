/* ============================================================
   HRFlow — Main Application Controller
   Routing, Auth, Navigation, Session, Toast, and Modal Manager
   ============================================================ */

const App = {
  currentUser: null,
  selectedRole: 'Employee',
  currentView: 'dashboard',

  init() {
    this.runSplashScreen(() => {
      this.checkSession();
    });
  },

  /* ── Splash Screen ── */
  runSplashScreen(callback) {
    const splash = document.getElementById('splash-screen');
    const bar = document.getElementById('splash-bar');
    if (!splash || !bar) {
      if (callback) callback();
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      bar.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          splash.classList.add('fade-out');
          setTimeout(() => {
            splash.style.display = 'none';
            if (callback) callback();
          }, 500);
        }, 200);
      }
    }, 40);
  },

  /* ── Session Check ── */
  checkSession() {
    const session = localStorage.getItem('hrflow_session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
        this.selectedRole = this.currentUser.role;
        this.showAppShell();
        return;
      } catch (e) {
        localStorage.removeItem('hrflow_session');
      }
    }
    this.showAuthScreen();
  },

  saveSession() {
    if (this.currentUser) {
      localStorage.setItem('hrflow_session', JSON.stringify(this.currentUser));
    }
  },

  /* ── Authentication & Sign Up ── */
  showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app-shell').classList.remove('active');
    this.switchAuthMode('login');
  },

  switchAuthMode(mode) {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const loginBtn = document.getElementById('mode-btn-login');
    const signupBtn = document.getElementById('mode-btn-signup');
    const subtitle = document.getElementById('auth-subtitle-text');

    if (mode === 'signup') {
      loginContainer.style.display = 'none';
      signupContainer.style.display = 'block';
      loginBtn.classList.remove('active');
      signupBtn.classList.add('active');
      subtitle.textContent = 'Register a new employee or HR account';
    } else {
      loginContainer.style.display = 'block';
      signupContainer.style.display = 'none';
      loginBtn.classList.add('active');
      signupBtn.classList.remove('active');
      subtitle.textContent = 'Sign in to access your employee or HR portal';
    }
  },

  setRole(role) {
    this.selectedRole = role;
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    if (role === 'Employee') {
      document.getElementById('role-tab-emp').classList.add('active');
    } else {
      document.getElementById('role-tab-hr').classList.add('active');
    }

    // Update login credentials hint
    const userField = document.getElementById('login-username');
    const passField = document.getElementById('login-password');
    if (userField && passField) {
      if (role === 'Employee') {
        userField.value = 'OIRASH20230003';
        passField.value = 'emp123';
      } else {
        userField.value = 'OIANKR20220001';
        passField.value = 'hr123';
      }
    }
  },

  setDemoCreds(userId, password, role) {
    this.switchAuthMode('login');
    this.setRole(role);
    document.getElementById('login-username').value = userId;
    document.getElementById('login-password').value = password;
  },

  togglePasswordVisibility(fieldId = 'login-password', iconId = 'password-toggle-icon') {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    if (field && icon) {
      if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'bi bi-eye-slash';
      } else {
        field.type = 'password';
        icon.className = 'bi bi-eye';
      }
    }
  },

  handleSignUp(e) {
    e.preventDefault();
    const firstName = document.getElementById('signup-firstname').value.trim();
    const lastName = document.getElementById('signup-lastname').value.trim();
    const role = document.getElementById('signup-role').value;
    const department = document.getElementById('signup-department').value;
    const designation = document.getElementById('signup-designation').value.trim();
    const joiningYear = parseInt(document.getElementById('signup-year').value) || 2026;
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errorAlert = document.getElementById('signup-error');
    const btn = document.getElementById('signup-submit-btn');

    if (!firstName || !lastName || !email || !password || !designation) {
      errorAlert.textContent = 'Please fill out all required fields.';
      errorAlert.classList.add('show');
      return;
    }

    if (password !== confirmPassword) {
      errorAlert.textContent = 'Passwords do not match! Please check and try again.';
      errorAlert.classList.add('show');
      return;
    }

    errorAlert.classList.remove('show');
    btn.classList.add('loading');

    setTimeout(() => {
      btn.classList.remove('loading');

      // Create new user in MockData
      const newUser = MockData.registerUser({
        firstName, lastName, role, department, designation, joiningYear, email, phone, password
      });

      // Show success modal with generated User ID
      this.showModal('signup-success-modal', 'Registration Successful! 🎉', `
        <div class="text-center" style="padding: 1rem 0;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--success-bg);color:var(--success);display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1rem;">
            <i class="bi bi-person-check-fill"></i>
          </div>
          <h3 style="font-size:1.25rem;font-weight:700;color:var(--slate-900);margin-bottom:0.5rem;">Welcome, ${newUser.name}!</h3>
          <p style="font-size:0.875rem;color:var(--slate-500);margin-bottom:1.5rem;">Your account has been created. Here is your official Login ID:</p>
          
          <div style="background:#09090B;border:1px dashed var(--primary);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1.5rem;">
            <div style="font-size:0.75rem;font-weight:600;color:var(--slate-400);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.25rem;">Your Generated User ID</div>
            <div style="font-size:1.75rem;font-weight:800;color:var(--primary);letter-spacing:2px;">${newUser.id}</div>
          </div>

          <p style="font-size:0.8125rem;color:var(--slate-400);">Please save this ID to sign in to your dashboard.</p>
        </div>
      `, `
        <button class="btn btn-primary btn-block" onclick="App.proceedToLoginWithUser('${newUser.id}', '${newUser.password}', '${newUser.role}')">Proceed to Sign In <i class="bi bi-arrow-right"></i></button>
      `);

    }, 600);
  },

  proceedToLoginWithUser(userId, password, role) {
    this.closeModal('signup-success-modal');
    this.switchAuthMode('login');
    this.setDemoCreds(userId, password, role);
    this.showToast(`ID ${userId} filled! Click Sign In to enter your portal.`, 'success');
  },


  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorAlert = document.getElementById('login-error');
    const btn = document.getElementById('login-submit-btn');

    if (!username || !password) {
      errorAlert.textContent = 'Please enter both ID/email and password.';
      errorAlert.classList.add('show');
      return;
    }

    errorAlert.classList.remove('show');
    btn.classList.add('loading');

    setTimeout(() => {
      btn.classList.remove('loading');

      // Check credentials in MockData
      const user = MockData.users.find(u => (u.id === username || u.email === username) && u.password === password);

      if (!user) {
        errorAlert.textContent = 'Invalid login credentials. Please check your ID and password.';
        errorAlert.classList.add('show');
        return;
      }

      if (user.role !== this.selectedRole) {
        errorAlert.textContent = `Access denied. Selected user belongs to ${user.role} role.`;
        errorAlert.classList.add('show');
        return;
      }

      this.currentUser = user;
      this.saveSession();
      this.showToast(`Welcome back, ${user.name}!`, 'success');
      this.showAppShell();
    }, 600);
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('hrflow_session');
    this.showToast('Logged out successfully.', 'info');
    this.showAuthScreen();
  },

  /* ── App Shell & Navigation ── */
  showAppShell() {
    document.getElementById('auth-screen').style.display = 'none';
    const shell = document.getElementById('app-shell');
    shell.classList.add('active');

    this.renderSidebar();
    this.renderHeader();

    // Default dashboard based on role
    if (this.currentUser.role === 'Employee') {
      this.navigate('emp-dashboard');
    } else {
      this.navigate('hr-dashboard');
    }
  },

  renderSidebar() {
    const isEmp = this.currentUser.role === 'Employee';
    const links = isEmp ? [
      { view: 'emp-dashboard', icon: 'speedometer2', label: 'Dashboard' },
      { view: 'emp-profile', icon: 'person-badge', label: 'Profile' },
      { view: 'emp-work-history', icon: 'clock-history', label: 'Work History' },
      { view: 'emp-attendance', icon: 'calendar-check', label: 'Attendance' },
      { view: 'emp-leave', icon: 'calendar2-minus', label: 'Leave' },
      { view: 'emp-mail', icon: 'envelope', label: 'Work Mail', badge: MockData.getEmployeeMails(this.currentUser.id).filter(m => m.status === 'Unread').length },
      { view: 'emp-assignments', icon: 'card-checklist', label: 'Assignments' },
    ] : [
      { view: 'hr-dashboard', icon: 'speedometer2', label: 'Dashboard' },
      { view: 'hr-profile', icon: 'person-badge', label: 'Profile' },
      { view: 'hr-employees', icon: 'people', label: 'Employees' },
      { view: 'hr-assignments', icon: 'card-checklist', label: 'Assignments' },
      { view: 'hr-work-mail', icon: 'envelope', label: 'Work Mail' },
      { view: 'hr-leave', icon: 'calendar2-minus', label: 'Leave Requests', badge: MockData.getPendingLeaveRequests().length },
      { view: 'hr-permission-mail', icon: 'file-earmark-text', label: 'Permission Mail', badge: MockData.getPendingPermissions().length },
      { view: 'hr-reports', icon: 'bar-chart-line', label: 'Reports' },
      { view: 'hr-settings', icon: 'gear', label: 'Settings' },
    ];

    const linksHtml = links.map(l => `
      <button class="sidebar-link ${this.currentView === l.view ? 'active' : ''}" onclick="App.navigate('${l.view}')">
        <i class="bi bi-${l.icon}"></i>
        <span>${l.label}</span>
        ${l.badge ? `<span class="badge-count">${l.badge}</span>` : ''}
      </button>
    `).join('');

    const sidebarNav = document.getElementById('sidebar-nav');
    if (sidebarNav) {
      sidebarNav.innerHTML = `
        <div class="sidebar-label">${isEmp ? 'Employee Portal' : 'HR Management'}</div>
        ${linksHtml}`;
    }

    // Sidebar footer user
    const avatar = document.getElementById('sidebar-user-avatar');
    const name = document.getElementById('sidebar-user-name');
    const role = document.getElementById('sidebar-user-role');
    if (avatar) avatar.textContent = this.currentUser.avatar || this.currentUser.name.substring(0, 2);
    if (name) name.textContent = this.currentUser.name;
    if (role) role.textContent = `${this.currentUser.role} • ${this.currentUser.id}`;
  },

  renderHeader() {
    const avatar = document.getElementById('topbar-avatar');
    const name = document.getElementById('topbar-name');
    const role = document.getElementById('topbar-role');
    if (avatar) avatar.textContent = this.currentUser.avatar || this.currentUser.name.substring(0, 2);
    if (name) name.textContent = this.currentUser.name;
    if (role) role.textContent = this.currentUser.designation || this.currentUser.role;
  },

  toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  },

  /* ── Router Guard & Navigation ── */
  navigate(viewId) {
    // Role-based Route Guard
    const isEmpView = viewId.startsWith('emp-');
    const isHRView = viewId.startsWith('hr-');

    if (this.currentUser.role === 'Employee' && isHRView) {
      this.showToast('Access Denied. You do not have permission to view HR pages.', 'error');
      return;
    }
    if (this.currentUser.role === 'HR' && isEmpView) {
      this.showToast('Access Denied. Please use HR portal features.', 'error');
      return;
    }

    this.currentView = viewId;
    this.closeMobileSidebar();
    this.renderSidebar();

    const viewport = document.getElementById('page-viewport');
    if (!viewport) return;

    // Scroll to top
    window.scrollTo(0, 0);

    // Breadcrumb title
    const breadcrumb = document.getElementById('topbar-breadcrumb-title');
    const titleMap = {
      'emp-dashboard': 'Employee Dashboard',
      'emp-profile': 'My Profile',
      'emp-edit-profile': 'Edit Profile',
      'emp-work-history': 'Work History',
      'emp-attendance': 'Attendance Overview',
      'emp-leave': 'Leave Management',
      'emp-mail': 'Work Mail',
      'emp-assignments': 'My Assignments',
      'hr-dashboard': 'HR Dashboard',
      'hr-profile': 'HR Profile',
      'hr-employees': 'Employees Directory',
      'hr-employee-details': 'Employee Profile Details',
      'hr-assignments': 'Assignment Management',
      'hr-work-mail': 'Work Mail Management',
      'hr-leave': 'Leave Requests',
      'hr-permission-mail': 'Permission Mail',
      'hr-reports': 'Reports & Analytics',
      'hr-settings': 'System Settings',
    };

    if (breadcrumb) breadcrumb.textContent = titleMap[viewId] || 'Dashboard';

    // Render View Content
    let html = '';
    const emp = this.currentUser;

    switch (viewId) {
      case 'emp-dashboard': html = EmployeeViews.renderDashboard(emp); break;
      case 'emp-profile': html = EmployeeViews.renderProfile(emp); break;
      case 'emp-edit-profile': html = EmployeeViews.renderEditProfile(emp); break;
      case 'emp-work-history': html = EmployeeViews.renderWorkHistory(emp); break;
      case 'emp-attendance': html = EmployeeViews.renderAttendance(emp); break;
      case 'emp-leave': html = EmployeeViews.renderLeave(emp); break;
      case 'emp-mail': html = EmployeeViews.renderWorkMail(emp); break;
      case 'emp-assignments': html = EmployeeViews.renderAssignments(emp); break;

      case 'hr-dashboard': html = HRViews.renderDashboard(emp); break;
      case 'hr-profile': html = HRViews.renderProfile(emp); break;
      case 'hr-employees': html = HRViews.renderEmployees(); break;
      case 'hr-employee-details': html = HRViews.renderEmployeeDetails(); break;
      case 'hr-assignments': html = HRViews.renderAssignments(); break;
      case 'hr-work-mail': html = HRViews.renderWorkMail(); break;
      case 'hr-leave': html = HRViews.renderLeaveManagement(); break;
      case 'hr-permission-mail': html = HRViews.renderPermissionMail(); break;
      case 'hr-reports': html = HRViews.renderReports(); break;
      case 'hr-settings': html = HRViews.renderSettings(); break;

      default: html = Components.EmptyState({ title: 'Page not found' });
    }

    viewport.innerHTML = html;

    // Trigger Chart renders if relevant
    setTimeout(() => {
      if (viewId === 'emp-attendance') {
        const data = MockData.getAttendance(emp.id);
        Charts.renderMonthlyAttendance('chart-monthly-attendance', data);
        Charts.renderYearlyAttendance('chart-yearly-attendance', data);
      } else if (viewId === 'hr-dashboard') {
        Charts.renderHRAttendanceOverview('chart-hr-attendance');
        Charts.renderDepartmentChart('chart-hr-dept', MockData.getEmployees());
      }
    }, 100);
  },

  /* ── Modal Manager ── */
  showModal(id, title, body, footer = '', wide = false) {
    this.closeModal(id); // Remove any existing
    const modalHtml = Components.Modal({ id, title, body, footer, wide });
    const container = document.getElementById('modal-root');
    container.insertAdjacentHTML('beforeend', modalHtml);
    setTimeout(() => {
      const modal = document.getElementById(id);
      if (modal) modal.classList.add('active');
    }, 10);
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  },

  /* ── Toast Notifications ── */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-root');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
      success: 'check-circle-fill',
      error: 'exclamation-triangle-fill',
      warning: 'exclamation-circle-fill',
      info: 'info-circle-fill'
    };

    toast.innerHTML = `
      <i class="toast-icon bi bi-${iconMap[type] || 'info-circle-fill'}"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()"><i class="bi bi-x"></i></button>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  updateUserInMockData(updatedUser) {
    const idx = MockData.users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      MockData.users[idx] = { ...MockData.users[idx], ...updatedUser };
    }
  }
};

// Global App Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
