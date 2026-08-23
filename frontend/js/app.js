/* ============================================================
   Dayflow HRMS — Main Application Controller
   Real Backend API Integration
   ============================================================ */

const App = {

  currentUser: null,
  selectedRole: 'Employee',
  currentView: 'dashboard',

  /* ============================================================
     INITIALIZATION
     ============================================================ */

  async init() {

  this.runSplashScreen(async () => {

    await this.checkSession();

  });

},

  /* ============================================================
     SPLASH SCREEN
     ============================================================ */

  runSplashScreen(callback) {

    const splash =
      document.getElementById('splash-screen');

    const bar =
      document.getElementById('splash-bar');

    if (!splash || !bar) {

      if (callback) {
        callback();
      }

      return;
    }

    let progress = 0;

    const interval =
      setInterval(() => {

        progress += 10;

        bar.style.width =
          `${progress}%`;

        if (progress >= 100) {

          clearInterval(interval);

          setTimeout(() => {

            splash.classList.add(
              'fade-out'
            );

            setTimeout(() => {

              splash.style.display =
                'none';

              if (callback) {
                callback();
              }

            }, 500);

          }, 200);

        }

      }, 40);
  },

  /* ============================================================
     SESSION MANAGEMENT
     ============================================================ */

  async checkSession() {

    const session =
      localStorage.getItem(
        'hrflow_session'
      );

    if (session) {

      try {

        this.currentUser =
  JSON.parse(session);

this.selectedRole =
  this.currentUser.role;

/*
 * Load REAL backend data before opening
 * the application.
 */
await MockData.load();

this.showAppShell();

return;

      } catch (error) {

        console.error(
          'Invalid saved session:',
          error
        );

        localStorage.removeItem(
          'hrflow_session'
        );

      }
    }

    this.showAuthScreen();
  },

  saveSession() {

    if (this.currentUser) {

      localStorage.setItem(
        'hrflow_session',
        JSON.stringify(
          this.currentUser
        )
      );

    }
  },

  clearSession() {

    this.currentUser = null;

    localStorage.removeItem(
      'hrflow_session'
    );

  },

  /* ============================================================
     AUTH SCREEN
     ============================================================ */

  showAuthScreen() {

    const authScreen =
      document.getElementById(
        'auth-screen'
      );

    const appShell =
      document.getElementById(
        'app-shell'
      );

    if (authScreen) {

      authScreen.style.display =
        'flex';

    }

    if (appShell) {

      appShell.classList.remove(
        'active'
      );

    }

    this.switchAuthMode('login');
  },

  switchAuthMode(mode) {

    const loginContainer =
      document.getElementById(
        'login-container'
      );

    const signupContainer =
      document.getElementById(
        'signup-container'
      );

    const loginBtn =
      document.getElementById(
        'mode-btn-login'
      );

    const signupBtn =
      document.getElementById(
        'mode-btn-signup'
      );

    const subtitle =
      document.getElementById(
        'auth-subtitle-text'
      );

    if (
      !loginContainer ||
      !signupContainer ||
      !loginBtn ||
      !signupBtn
    ) {

      return;

    }

    if (mode === 'signup') {

      loginContainer.style.display =
        'none';

      signupContainer.style.display =
        'block';

      loginBtn.classList.remove(
        'active'
      );

      signupBtn.classList.add(
        'active'
      );

      if (subtitle) {

        subtitle.textContent =
          'Register a new employee or HR account';

      }

    } else {

      loginContainer.style.display =
        'block';

      signupContainer.style.display =
        'none';

      loginBtn.classList.add(
        'active'
      );

      signupBtn.classList.remove(
        'active'
      );

      if (subtitle) {

        subtitle.textContent =
          'Sign in to access your employee or HR portal';

      }

    }
  },

  /* ============================================================
     ROLE SELECTION
     ============================================================ */

  setRole(role) {

    this.selectedRole =
      role;

    document
      .querySelectorAll('.role-tab')
      .forEach(tab => {

        tab.classList.remove(
          'active'
        );

      });

    if (role === 'Employee') {

      const employeeTab =
        document.getElementById(
          'role-tab-emp'
        );

      if (employeeTab) {

        employeeTab.classList.add(
          'active'
        );

      }

    } else {

      const hrTab =
        document.getElementById(
          'role-tab-hr'
        );

      if (hrTab) {

        hrTab.classList.add(
          'active'
        );

      }

    }
  },

  /* ============================================================
     PASSWORD VISIBILITY
     ============================================================ */

  togglePasswordVisibility(
    fieldId = 'login-password',
    iconId = 'password-toggle-icon'
  ) {

    const field =
      document.getElementById(
        fieldId
      );

    const icon =
      document.getElementById(
        iconId
      );

    if (!field || !icon) {
      return;
    }

    if (field.type === 'password') {

      field.type =
        'text';

      icon.className =
        'bi bi-eye-slash';

    } else {

      field.type =
        'password';

      icon.className =
        'bi bi-eye';

    }
  },

  /* ============================================================
     LOGIN — REAL BACKEND API
     ============================================================ */

  async handleLogin(event) {

    event.preventDefault();

    const usernameElement =
      document.getElementById(
        'login-username'
      );

    const passwordElement =
      document.getElementById(
        'login-password'
      );

    const errorAlert =
      document.getElementById(
        'login-error'
      );

    const button =
      document.getElementById(
        'login-submit-btn'
      );

    const username =
      usernameElement
        ? usernameElement.value.trim()
        : '';

    const password =
      passwordElement
        ? passwordElement.value.trim()
        : '';

    /* ----------------------------------------------------------
       VALIDATION
       ---------------------------------------------------------- */

    if (!username || !password) {

      if (errorAlert) {

        errorAlert.textContent =
          'Please enter both ID/email and password.';

        errorAlert.classList.add(
          'show'
        );

      }

      return;
    }

    if (errorAlert) {

      errorAlert.classList.remove(
        'show'
      );

    }

    if (button) {

      button.classList.add(
        'loading'
      );

      button.disabled =
        true;

    }

    try {

      /* --------------------------------------------------------
         CALL REAL BACKEND
         -------------------------------------------------------- */

      const response =
        await API.login(
          username,
          password
        );

      console.log(
        'Login response:',
        response
      );

      /* --------------------------------------------------------
         GET USER FROM BACKEND RESPONSE
         -------------------------------------------------------- */

      const user =
        response.user ||
        response.employee ||
        response;

      if (!user) {

        throw new Error(
          'Invalid login response from server.'
        );

      }

      /* --------------------------------------------------------
         GET ROLE
         -------------------------------------------------------- */

      const backendRole =
        (
          user.role ||
          response.role ||
          'employee'
        ).toLowerCase();

      const frontendRole =
        backendRole === 'admin' ||
        backendRole === 'hr'
          ? 'HR'
          : 'Employee';

      /* --------------------------------------------------------
         ROLE VERIFICATION
         -------------------------------------------------------- */

      if (
        this.selectedRole &&
        this.selectedRole !== frontendRole
      ) {

        throw new Error(
          `Access denied. This account belongs to the ${frontendRole} role.`
        );

      }

      /* --------------------------------------------------------
         USER NAME
         -------------------------------------------------------- */

      const firstName =
        user.first_name ||
        '';

      const lastName =
        user.last_name ||
        '';

      const fullName =
        `${firstName} ${lastName}`.trim() ||
        user.name ||
        'User';

      /* --------------------------------------------------------
         CREATE FRONTEND SESSION
         -------------------------------------------------------- */

      this.currentUser = {

        id:
          user.employee_id ||
          user.id,

        role:
          frontendRole,

        backendRole:
          backendRole,

        must_change_password:
          user.must_change_password ||
          false,

        name:
          fullName,

        email:
          user.email ||
          '',

        phone:
          user.phone ||
          '',

        address:
          user.address ||
          '',

        designation:
          user.designation ||
          '',

        department:
          user.department ||
          '',

        avatar:
          fullName
            .substring(0, 2)
            .toUpperCase()

      };

      /* --------------------------------------------------------
         SAVE SESSION
         -------------------------------------------------------- */

      this.selectedRole =
        frontendRole;

      this.saveSession();

      console.log(
        'Current user:',
        this.currentUser
      );

      /* --------------------------------------------------------
         SUCCESS MESSAGE
         -------------------------------------------------------- */

      this.showToast(
        'Login successful!',
        'success'
      );

      /* --------------------------------------------------------
         OPEN DASHBOARD
         -------------------------------------------------------- */

      setTimeout(() => {

        this.showAppShell();

      }, 300);

    } catch (error) {

      console.error(
        'Login error:',
        error
      );

      if (errorAlert) {

        errorAlert.textContent =
          error.message ||
          'Login failed. Please check your credentials.';

        errorAlert.classList.add(
          'show'
        );

      }

    } finally {

      if (button) {

        button.classList.remove(
          'loading'
        );

        button.disabled =
          false;

      }

    }
  },

  /* ============================================================
     SIGN UP
     ============================================================ */

  async handleSignUp(event) {

    event.preventDefault();

    this.showToast(
      'Registration is currently unavailable.',
      'warning'
    );

    console.log(
      'Registration API integration will be added separately.'
    );

  },

  /* ============================================================
     LOGOUT
     ============================================================ */

  logout() {

    this.clearSession();

    this.showToast(
      'Logged out successfully.',
      'info'
    );

    setTimeout(() => {

      this.showAuthScreen();

    }, 300);

  },

  /* ============================================================
     APPLICATION SHELL
     ============================================================ */

  showAppShell() {

    const authScreen =
      document.getElementById(
        'auth-screen'
      );

    const shell =
      document.getElementById(
        'app-shell'
      );

    if (authScreen) {

      authScreen.style.display =
        'none';

    }

    if (!shell) {
      return;
    }

    shell.classList.add(
      'active'
    );

    this.renderSidebar();

    this.renderHeader();

    /* ----------------------------------------------------------
       OPEN DASHBOARD BASED ON ROLE
       ---------------------------------------------------------- */

    if (
      this.currentUser &&
      this.currentUser.role === 'Employee'
    ) {

      this.navigate(
        'emp-dashboard'
      );

    } else {

      this.navigate(
        'hr-dashboard'
      );

    }

  },

  /* ============================================================
     SIDEBAR
     ============================================================ */

  renderSidebar() {

    if (!this.currentUser) {
      return;
    }

    const isEmployee =
      this.currentUser.role ===
      'Employee';

    const links =
      isEmployee

        ? [

            {
              view:
                'emp-dashboard',

              icon:
                'speedometer2',

              label:
                'Dashboard'
            },

            {
              view:
                'emp-profile',

              icon:
                'person-badge',

              label:
                'Profile'
            },

            {
              view:
                'emp-work-history',

              icon:
                'clock-history',

              label:
                'Work History'
            },

            {
              view:
                'emp-attendance',

              icon:
                'calendar-check',

              label:
                'Attendance'
            },

            {
              view:
                'emp-leave',

              icon:
                'calendar2-minus',

              label:
                'Leave'
            },

            {
              view:
                'emp-mail',

              icon:
                'envelope',

              label:
                'Work Mail'
            },

            {
              view:
                'emp-assignments',

              icon:
                'card-checklist',

              label:
                'Assignments'
            }

          ]

        : [

            {
              view:
                'hr-dashboard',

              icon:
                'speedometer2',

              label:
                'Dashboard'
            },

            {
              view:
                'hr-profile',

              icon:
                'person-badge',

              label:
                'Profile'
            },

            {
              view:
                'hr-employees',

              icon:
                'people',

              label:
                'Employees'
            },

            {
              view:
                'hr-assignments',

              icon:
                'card-checklist',

              label:
                'Assignments'
            },

            {
              view:
                'hr-work-mail',

              icon:
                'envelope',

              label:
                'Work Mail'
            },

            {
              view:
                'hr-leave',

              icon:
                'calendar2-minus',

              label:
                'Leave Requests'
            },

            {
              view:
                'hr-permission-mail',

              icon:
                'file-earmark-text',

              label:
                'Permission Mail'
            },

            {
              view:
                'hr-reports',

              icon:
                'bar-chart-line',

              label:
                'Reports'
            },

            {
              view:
                'hr-settings',

              icon:
                'gear',

              label:
                'Settings'
            }

          ];

    const linksHTML =
      links
        .map(link => `

          <button
            class="sidebar-link ${
              this.currentView ===
              link.view
                ? 'active'
                : ''
            }"
            onclick="App.navigate('${link.view}')"
          >

            <i class="bi bi-${link.icon}"></i>

            <span>
              ${link.label}
            </span>

          </button>

        `)
        .join('');

    const sidebarNav =
      document.getElementById(
        'sidebar-nav'
      );

    if (sidebarNav) {

      sidebarNav.innerHTML = `

        <div class="sidebar-label">

          ${
            isEmployee
              ? 'Employee Portal'
              : 'HR Management'
          }

        </div>

        ${linksHTML}

      `;

    }

    /* ----------------------------------------------------------
       SIDEBAR USER
       ---------------------------------------------------------- */

    const avatar =
      document.getElementById(
        'sidebar-user-avatar'
      );

    const name =
      document.getElementById(
        'sidebar-user-name'
      );

    const role =
      document.getElementById(
        'sidebar-user-role'
      );

    if (avatar) {

      avatar.textContent =
        this.currentUser.avatar ||
        this.currentUser.name
          .substring(0, 2)
          .toUpperCase();

    }

    if (name) {

      name.textContent =
        this.currentUser.name;

    }

    if (role) {

      role.textContent =
        `${this.currentUser.role} • ${this.currentUser.id}`;

    }

  },

  /* ============================================================
     HEADER
     ============================================================ */

  renderHeader() {

    if (!this.currentUser) {
      return;
    }

    const avatar =
      document.getElementById(
        'topbar-avatar'
      );

    const name =
      document.getElementById(
        'topbar-name'
      );

    const role =
      document.getElementById(
        'topbar-role'
      );

    if (avatar) {

      avatar.textContent =
        this.currentUser.avatar ||
        this.currentUser.name
          .substring(0, 2)
          .toUpperCase();

    }

    if (name) {

      name.textContent =
        this.currentUser.name;

    }

    if (role) {

      role.textContent =
        this.currentUser.designation ||
        this.currentUser.role;

    }

  },

  /* ============================================================
     MOBILE SIDEBAR
     ============================================================ */

  toggleMobileSidebar() {

    const sidebar =
      document.getElementById(
        'sidebar'
      );

    const overlay =
      document.getElementById(
        'sidebar-overlay'
      );

    if (sidebar) {

      sidebar.classList.toggle(
        'open'
      );

    }

    if (overlay) {

      overlay.classList.toggle(
        'show'
      );

    }

  },

  closeMobileSidebar() {

    const sidebar =
      document.getElementById(
        'sidebar'
      );

    const overlay =
      document.getElementById(
        'sidebar-overlay'
      );

    if (sidebar) {

      sidebar.classList.remove(
        'open'
      );

    }

    if (overlay) {

      overlay.classList.remove(
        'show'
      );

    }

  },

  /* ============================================================
     NAVIGATION
     ============================================================ */

  async navigate(viewId) {

    if (!this.currentUser) {
      return;
    }

    const isEmployeeView =
      viewId.startsWith(
        'emp-'
      );

    const isHRView =
      viewId.startsWith(
        'hr-'
      );

    /* ----------------------------------------------------------
       EMPLOYEE → HR PROTECTION
       ---------------------------------------------------------- */

    if (
      this.currentUser.role ===
        'Employee' &&
      isHRView
    ) {

      this.showToast(
        'Access Denied. You do not have permission to view HR pages.',
        'error'
      );

      return;

    }

    /* ----------------------------------------------------------
       HR → EMPLOYEE PROTECTION
       ---------------------------------------------------------- */

    if (
      this.currentUser.role ===
        'HR' &&
      isEmployeeView
    ) {

      this.showToast(
        'Access Denied. Please use HR portal features.',
        'error'
      );

      return;

    }

    this.currentView =
      viewId;

    this.closeMobileSidebar();

    this.renderSidebar();

    const viewport =
      document.getElementById(
        'page-viewport'
      );

    if (!viewport) {
      return;
    }

    window.scrollTo(
      0,
      0
    );

    /* ----------------------------------------------------------
       BREADCRUMB
       ---------------------------------------------------------- */

    const breadcrumb =
      document.getElementById(
        'topbar-breadcrumb-title'
      );

    const titleMap = {

      'emp-dashboard':
        'Employee Dashboard',

      'emp-profile':
        'My Profile',

      'emp-edit-profile':
        'Edit Profile',

      'emp-work-history':
        'Work History',

      'emp-attendance':
        'Attendance Overview',

      'emp-leave':
        'Leave Management',

      'emp-mail':
        'Work Mail',

      'emp-assignments':
        'My Assignments',

      'hr-dashboard':
        'HR Dashboard',

      'hr-profile':
        'HR Profile',

      'hr-employees':
        'Employees Directory',

      'hr-employee-details':
        'Employee Profile Details',

      'hr-assignments':
        'Assignment Management',

      'hr-work-mail':
        'Work Mail Management',

      'hr-leave':
        'Leave Requests',

      'hr-permission-mail':
        'Permission Mail',

      'hr-reports':
        'Reports & Analytics',

      'hr-settings':
        'System Settings'

    };

    if (breadcrumb) {

      breadcrumb.textContent =
        titleMap[viewId] ||
        'Dashboard';

    }

    /* ----------------------------------------------------------
       RENDER SELECTED VIEW
       ---------------------------------------------------------- */

    let html = '';

    const employee =
      this.currentUser;

    switch (viewId) {

      case 'emp-dashboard':

        html =
          EmployeeViews.renderDashboard(
            employee
          );

        break;

      case 'emp-profile':

        html =
          EmployeeViews.renderProfile(
            employee
          );

        break;

      case 'emp-edit-profile':

        html =
          EmployeeViews.renderEditProfile(
            employee
          );

        break;

      case 'emp-work-history':

        html =
          EmployeeViews.renderWorkHistory(
            employee
          );

        break;

      case 'emp-attendance':

        html =
          EmployeeViews.renderAttendance(
            employee
          );

        break;

      case 'emp-leave':

        html =
          await EmployeeViews.renderLeave(
            employee
          );

        break;

      case 'emp-mail':

        html =
          EmployeeViews.renderWorkMail(
            employee
          );

        break;

      case 'emp-assignments':

        html =
          EmployeeViews.renderAssignments(
            employee
          );

        break;

      case 'hr-dashboard':

        html =
          HRViews.renderDashboard(
            employee
          );

        break;

      case 'hr-profile':

        html =
          HRViews.renderProfile(
            employee
          );

        break;

      case 'hr-employees':

        html =
          HRViews.renderEmployees();

        break;

      case 'hr-employee-details':

        html =
          HRViews.renderEmployeeDetails();

        break;

      case 'hr-assignments':

        html =
          HRViews.renderAssignments();

        break;

      case 'hr-work-mail':

        html =
          HRViews.renderWorkMail();

        break;

      case 'hr-leave':

        html =
          HRViews.renderLeaveManagement();

        break;

      case 'hr-permission-mail':

        html =
          HRViews.renderPermissionMail();

        break;

      case 'hr-reports':

        html =
          HRViews.renderReports();

        break;

      case 'hr-settings':

        html =
          HRViews.renderSettings();

        break;

      default:

        html =
          Components.EmptyState({
            title:
              'Page not found'
          });

    }

      viewport.innerHTML =
          await html;

    /* ----------------------------------------------------------
       EXISTING CHARTS
       
       NOTE:
       These still use MockData for now.
       We will replace them with real API data next.
       ---------------------------------------------------------- */

    setTimeout(() => {

      if (
        viewId ===
          'emp-attendance' &&
        typeof Charts !==
          'undefined'
      ) {

        if (
          typeof MockData !==
            'undefined' &&
          MockData.getAttendance
        ) {

          const data =
            MockData.getAttendance(
              employee.id
            );

          Charts.renderMonthlyAttendance(
            'chart-monthly-attendance',
            data
          );

          Charts.renderYearlyAttendance(
            'chart-yearly-attendance',
            data
          );

        }

      }

      else if (
        viewId ===
          'hr-dashboard' &&
        typeof Charts !==
          'undefined'
      ) {

        Charts.renderHRAttendanceOverview(
          'chart-hr-attendance'
        );

        if (
          typeof MockData !==
            'undefined' &&
          MockData.getEmployees
        ) {

          Charts.renderDepartmentChart(
            'chart-hr-dept',
            MockData.getEmployees()
          );

        }

      }

    }, 100);

  },

  /* ============================================================
     MODAL MANAGER
     ============================================================ */

  showModal(
    id,
    title,
    body,
    footer = '',
    wide = false
  ) {

    this.closeModal(
      id
    );

    if (
      typeof Components ===
        'undefined' ||
      !Components.Modal
    ) {

      console.error(
        'Components.Modal is not available.'
      );

      return;

    }

    const modalHTML =
      Components.Modal({

        id,
        title,
        body,
        footer,
        wide

      });

    const container =
      document.getElementById(
        'modal-root'
      );

    if (!container) {
      return;
    }

    container.insertAdjacentHTML(
      'beforeend',
      modalHTML
    );

    setTimeout(() => {

      const modal =
        document.getElementById(
          id
        );

      if (modal) {

        modal.classList.add(
          'active'
        );

      }

    }, 10);

  },

  /* ============================================================
     CLOSE MODAL
     ============================================================ */

  closeModal(id) {

    const modal =
      document.getElementById(
        id
      );

    if (!modal) {
      return;
    }

    modal.classList.remove(
      'active'
    );

    setTimeout(() => {

      if (modal) {
        modal.remove();
      }

    }, 300);

  },

  /* ============================================================
     TOAST NOTIFICATIONS
     ============================================================ */

  showToast(
    message,
    type = 'info'
  ) {

    const container =
      document.getElementById(
        'toast-root'
      );

    if (!container) {
      return;
    }

    const toast =
      document.createElement(
        'div'
      );

    toast.className =
      `toast ${type}`;

    const iconMap = {

      success:
        'check-circle-fill',

      error:
        'exclamation-triangle-fill',

      warning:
        'exclamation-circle-fill',

      info:
        'info-circle-fill'

    };

    toast.innerHTML = `

      <i class="toast-icon bi bi-${
        iconMap[type] ||
        'info-circle-fill'
      }"></i>

      <span class="toast-message">
        ${message}
      </span>

      <button
        class="toast-close"
        onclick="this.parentElement.remove()"
      >

        <i class="bi bi-x"></i>

      </button>

    `;

    container.appendChild(
      toast
    );

    setTimeout(() => {

      toast.classList.add(
        'fade-out'
      );

      setTimeout(() => {

        toast.remove();

      }, 300);

    }, 3500);

  },

  /* ============================================================
     LEGACY MOCK DATA COMPATIBILITY
     
     This function is kept temporarily because some existing
     profile-edit code may still call it.
     
     We will remove this after all pages are connected
     directly to the backend API.
     ============================================================ */

  updateUserInMockData(
    updatedUser
  ) {

    if (
      typeof MockData ===
        'undefined' ||
      !MockData.users
    ) {

      return;

    }

    const index =
      MockData.users.findIndex(
        user =>
          user.id ===
          updatedUser.id
      );

    if (index !== -1) {

      MockData.users[index] = {

        ...MockData.users[index],

        ...updatedUser

      };

    }

  }

};


/* ============================================================
   GLOBAL APPLICATION INITIALIZATION
   ============================================================ */

document.addEventListener(
  'DOMContentLoaded',
  async () => {

    console.log(
      'Dayflow HRMS starting...'
    );

    try {

      if (
        typeof MockData !== 'undefined' &&
        typeof MockData.initialize === 'function'
      ) {

        await MockData.initialize();

        console.log(
          'Real backend data loaded successfully.'
        );

      }

    } catch (error) {

      console.error(
        'Failed to load backend data:',
        error
      );

    }

    App.init();
  }
);