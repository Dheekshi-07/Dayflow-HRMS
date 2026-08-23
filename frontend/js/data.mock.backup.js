/* ============================================================
   Dayflow HRMS — REAL API DATA LAYER
   ------------------------------------------------------------
   This file replaces the old MockData layer.

   Frontend components can continue using:
     MockData.getEmployees()
     MockData.getUserById()
     MockData.getEmployeeAssignments()
     MockData.getEmployeeMails()
     MockData.getEmployeeLeaveRequests()
     MockData.getEmployeeLeaveBalance()
     MockData.getAttendance()
     etc.

   Data is loaded from the FastAPI backend.
   ============================================================ */

const MockData = {

  API_BASE_URL: "http://127.0.0.1:8000",

  /* ----------------------------------------------------------
     Internal cache
     ---------------------------------------------------------- */

  cache: {
    employees: [],
    attendance: {},
    leaves: {},
    leaveTypes: [],
    payroll: {},
    documents: {},
    assignments: [],
    mails: [],
    permissions: []
  },

  /* ----------------------------------------------------------
     Generic API request
     ---------------------------------------------------------- */

  async request(endpoint, options = {}) {

    const response = await fetch(
      `${this.API_BASE_URL}${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        ...options
      }
    );

    let data = {};

    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {

      throw new Error(
        data.detail ||
        `API request failed: ${response.status}`
      );
    }

    return data;
  },


  /* ==========================================================
     EMPLOYEES
     ========================================================== */

  async loadEmployees() {

    try {

      const data =
        await this.request(
          "/api/admin/employees"
        );

      this.cache.employees =
        Array.isArray(data)
          ? data
          : (
              data.employees ||
              data.items ||
              []
            );

      return this.cache.employees;

    } catch (error) {

      console.error(
        "Failed to load employees:",
        error
      );

      return [];
    }
  },


  getEmployees() {

    return this.cache.employees.filter(
      employee =>
        employee.role === "employee" ||
        employee.role === "Employee" ||
        !employee.role
    );
  },


  getHRUsers() {

    return this.cache.employees.filter(
      employee =>
        employee.role === "hr" ||
        employee.role === "HR" ||
        employee.role === "admin" ||
        employee.role === "Admin"
    );
  },


  getUserById(id) {

    return this.cache.employees.find(
      employee =>
        employee.employee_id === id ||
        employee.id === id
    );
  },


  /* Convert backend employee into the format
     existing frontend views expect. */

  normalizeEmployee(employee) {

    if (!employee) return null;

    const firstName =
      employee.first_name ||
      "";

    const lastName =
      employee.last_name ||
      "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return {

      ...employee,

      id:
        employee.employee_id ||
        employee.id,

      employee_id:
        employee.employee_id ||
        employee.id,

      name:
        fullName ||
        employee.name ||
        "Unknown Employee",

      email:
        employee.email ||
        "",

      phone:
        employee.phone ||
        "",

      department:
        employee.department ||
        "",

      designation:
        employee.designation ||
        "",

      joiningDate:
        employee.joining_date ||
        employee.joiningDate ||
        "",

      address:
        employee.address ||
        "",

      avatar:
        (
          (firstName[0] || "") +
          (lastName[0] || "")
        ).toUpperCase(),

      status:
        employee.status ||
        "Active",

      role:
        employee.role || "employee"
    };
  },


  getNormalizedEmployees() {

    return this.cache.employees
      .map(employee =>
        this.normalizeEmployee(employee)
      )
      .filter(Boolean);
  },


  getNormalizedEmployeeById(id) {

    const employee =
      this.cache.employees.find(
        employee =>
          employee.employee_id === id ||
          employee.id === id
      );

    return this.normalizeEmployee(employee);
  },


  /* ==========================================================
     ATTENDANCE
     ========================================================== */

  async loadAttendance(employeeId) {

    try {

      const data =
        await this.request(
          `/api/attendance/${employeeId}`
        );

      this.cache.attendance[employeeId] =
        Array.isArray(data)
          ? data
          : (
              data.attendance ||
              data.items ||
              []
            );

      return this.cache.attendance[employeeId];

    } catch (error) {

      console.error(
        "Failed to load attendance:",
        error
      );

      return [];
    }
  },


  getAttendance(employeeId) {

    return this.cache.attendance[employeeId] || [];
  },


  async checkIn(employeeId) {

    const result =
      await this.request(
        `/api/attendance/check-in/${employeeId}`,
        {
          method: "POST"
        }
      );

    await this.loadAttendance(employeeId);

    return result;
  },


  async checkOut(employeeId) {

    const result =
      await this.request(
        `/api/attendance/check-out/${employeeId}`,
        {
          method: "PUT"
        }
      );

    await this.loadAttendance(employeeId);

    return result;
  },


  /* ==========================================================
     LEAVE TYPES
     ========================================================== */

  async loadLeaveTypes() {

    try {

      const data =
        await this.request(
          "/api/leave/types"
        );

      this.cache.leaveTypes =
        Array.isArray(data)
          ? data
          : (
              data.leave_types ||
              data.items ||
              []
            );

      return this.cache.leaveTypes;

    } catch (error) {

      console.error(
        "Failed to load leave types:",
        error
      );

      return [];
    }
  },


  getLeaveTypes() {

    return this.cache.leaveTypes;
  },


  /* ==========================================================
     LEAVE REQUESTS
     ========================================================== */

  async loadEmployeeLeaves(employeeId) {

    try {

      const data =
        await this.request(
          `/api/leave/employee/${employeeId}`
        );

      this.cache.leaves[employeeId] =
        Array.isArray(data)
          ? data
          : (
              data.leaves ||
              data.items ||
              []
            );

      return this.cache.leaves[employeeId];

    } catch (error) {

      console.error(
        "Failed to load employee leaves:",
        error
      );

      return [];
    }
  },


  getEmployeeLeaveRequests(employeeId) {

    return this.cache.leaves[employeeId] || [];
  },


  async loadAllLeaves() {

    try {

      const data =
        await this.request(
          "/api/leave/all"
        );

      return Array.isArray(data)
        ? data
        : (
            data.leaves ||
            data.items ||
            []
          );

    } catch (error) {

      console.error(
        "Failed to load all leaves:",
        error
      );

      return [];
    }
  },


  async applyLeave(data) {

    const result =
      await this.request(
        "/api/leave/",
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );

    return result;
  },


  async approveLeave(leaveId) {

    return await this.request(
      `/api/leave/${leaveId}/approve`,
      {
        method: "PUT"
      }
    );
  },


  async rejectLeave(
    leaveId,
    data
  ) {

    return await this.request(
      `/api/leave/${leaveId}/reject`,
      {
        method: "PUT",
        body: JSON.stringify(data)
      }
    );
  },


  /* ----------------------------------------------------------
     Leave balance

     NOTE:
     Your current backend has leave requests/types,
     but not a dedicated leave-balance endpoint.

     Therefore calculate balance from real leave records.
     ---------------------------------------------------------- */

  getEmployeeLeaveBalance(employeeId) {

    const leaves =
      this.getEmployeeLeaveRequests(
        employeeId
      );

    const balance = {

      paid: {
        allocated: 20,
        taken: 0
      },

      unpaid: {
        allocated: 10,
        taken: 0
      },

      sick: {
        allocated: 12,
        taken: 0
      }
    };


    leaves
      .filter(
        leave =>
          String(
            leave.status || ""
          ).toLowerCase() === "approved"
      )
      .forEach(leave => {

        const type =
          String(
            leave.leave_type ||
            leave.type ||
            leave.leave_type_name ||
            ""
          ).toLowerCase();

        const start =
          new Date(
            leave.start_date ||
            leave.startDate
          );

        const end =
          new Date(
            leave.end_date ||
            leave.endDate
          );

        if (
          isNaN(start) ||
          isNaN(end)
        ) {
          return;
        }

        const days =
          Math.floor(
            (
              end - start
            ) /
            (
              1000 *
              60 *
              60 *
              24
            )
          ) + 1;


        if (
          type.includes("paid")
        ) {

          balance.paid.taken += days;

        } else if (
          type.includes("unpaid")
        ) {

          balance.unpaid.taken += days;

        } else if (
          type.includes("sick")
        ) {

          balance.sick.taken += days;
        }

      });

    return balance;
  },


  /* ==========================================================
     PAYROLL
     ========================================================== */

  async loadPayroll(employeeId) {

    try {

      const data =
        await this.request(
          `/api/payroll/employee/${employeeId}`
        );

      this.cache.payroll[employeeId] =
        data;

      return data;

    } catch (error) {

      console.error(
        "Failed to load payroll:",
        error
      );

      return null;
    }
  },


  getPayroll(employeeId) {

    return (
      this.cache.payroll[employeeId] ||
      null
    );
  },


  /* ==========================================================
     DOCUMENTS
     ========================================================== */

  async loadDocuments(employeeId) {

    try {

      const data =
        await this.request(
          `/api/documents/employee/${employeeId}`
        );

      this.cache.documents[employeeId] =
        Array.isArray(data)
          ? data
          : (
              data.documents ||
              data.items ||
              []
            );

      return this.cache.documents[employeeId];

    } catch (error) {

      console.error(
        "Failed to load documents:",
        error
      );

      return [];
    }
  },


  getDocuments(employeeId) {

    return (
      this.cache.documents[employeeId] ||
      []
    );
  },


  /* ==========================================================
     ASSIGNMENTS
     ==========================================================

     IMPORTANT:
     Your current FastAPI backend DOES NOT contain an
     assignment table/router.

     So we intentionally return an empty array instead
     of fake data.

     Once assignment API is added, this section can directly
     connect to it.
     ========================================================== */

  getEmployeeAssignments(employeeId) {

    return this.cache.assignments.filter(
      assignment =>
        assignment.employee_id === employeeId ||
        assignment.empId === employeeId
    );
  },


  getPendingAssignments() {

    return this.cache.assignments.filter(
      assignment =>
        String(
          assignment.status || ""
        ).toLowerCase() === "pending"
    );
  },


  /* ==========================================================
     WORK MAIL
     ==========================================================

     Your backend currently has NO mail model/router.

     Therefore we return real empty DB state instead
     of showing fake messages.
     ========================================================== */

  getEmployeeMails(employeeId) {

    return this.cache.mails.filter(
      mail =>
        mail.employee_id === employeeId ||
        mail.empId === employeeId
    );
  },


  /* ==========================================================
     WORK HISTORY
     ==========================================================

     No work-history backend table currently exists.
     ========================================================== */

  getEmployeeWorkHistory(employeeId) {

    return [];
  },


  /* ==========================================================
     PERMISSIONS
     ========================================================== */

  getPendingPermissions() {

    return this.cache.permissions.filter(
      permission =>
        String(
          permission.status || ""
        ).toLowerCase() === "pending"
    );
  },


  /* ==========================================================
     HR DASHBOARD STATS
     ========================================================== */

  getTodayStats() {

    const employees =
      this.getNormalizedEmployees();

    return {

      total:
        employees.length,

      present: 0,

      absent: 0,

      onLeave: 0,

      pendingLeaves: 0,

      pendingAssignments:
        this.getPendingAssignments().length
    };
  },


  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  async initialize() {

    console.log(
      "Loading real data from Dayflow API..."
    );

    try {

      await Promise.all([
        this.loadEmployees(),
        this.loadLeaveTypes()
      ]);

      /* Normalize employees so existing frontend
         code can continue using emp.id, emp.name etc. */

      this.cache.employees =
        this.getNormalizedEmployees();

      console.log(
        "Real employee data loaded:",
        this.cache.employees.length
      );

      return true;

    } catch (error) {

      console.error(
        "Failed to initialize API data:",
        error
      );

      return false;
    }
  }
};


/* ============================================================
   Make globally available
   ============================================================ */

window.MockData = MockData;