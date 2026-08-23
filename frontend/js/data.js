/*
 * ============================================================
 * DAYFLOW HRMS - REAL API DATA LAYER
 * ============================================================
 *
 * This file keeps the existing "MockData" name so the existing
 * frontend views do not need to be rewritten immediately.
 *
 * IMPORTANT:
 * The data is NO LONGER generated from mock/static data.
 * All supported HRMS data comes from FastAPI.
 *
 * Backend:
 * http://127.0.0.1:8000
 * ============================================================
 */

const MockData = {

    // ------------------------------------------------------------
    // CACHE
    // ------------------------------------------------------------

    users: [],
    employees: [],

    attendance: [],
    leaveRequests: [],
    leaveTypes: [],

    payrolls: {},
    documents: {},

    /*
     * These modules do NOT currently exist in your FastAPI backend.
     *
     * We keep empty arrays so old frontend code does not crash.
     * We DO NOT put fake records into them.
     */
    assignments: [],
    workMails: [],
    permissionRequests: [],

    currentUser: null,

    initialized: false,


    // ============================================================
    // INITIALIZATION
    // ============================================================

    async load() {

        console.log("Dayflow: Loading real backend data...");

        this.currentUser =
            JSON.parse(
                localStorage.getItem(
                    "dayflow_current_user"
                ) || "null"
            );

        try {

            /*
             * Load employees from backend.
             *
             * This endpoint requires admin access in your backend.
             */
            if (
                this.currentUser &&
                this.currentUser.role &&
                this.currentUser.role.toLowerCase() === "admin"
            ) {

                try {

                    this.employees =
                        await API.getEmployees();

                } catch (error) {

                    console.warn(
                        "Could not load admin employee list:",
                        error.message
                    );

                    this.employees = [];
                }

            } else {

                /*
                 * Employee users do not have permission to call
                 * /api/admin/employees.
                 *
                 * Load the currently logged-in employee instead.
                 */
                if (
                    this.currentUser &&
                    this.currentUser.employee_id
                ) {

                    try {

                        const employee =
                            await API.getEmployee(
                                this.currentUser.employee_id
                            );

                        this.employees = [
                            employee
                        ];

                    } catch (error) {

                        console.warn(
                            "Could not load current employee:",
                            error.message
                        );

                        this.employees = [];
                    }
                }
            }


            // ----------------------------------------------------
            // LOAD LEAVE TYPES
            // ----------------------------------------------------

            try {

                this.leaveTypes =
                    await API.getLeaveTypes();

            } catch (error) {

                console.warn(
                    "Could not load leave types:",
                    error.message
                );

                this.leaveTypes = [];
            }


            // ----------------------------------------------------
            // LOAD CURRENT USER DATA
            // ----------------------------------------------------

            if (
                this.currentUser &&
                this.currentUser.employee_id
            ) {

                await this.loadEmployeeData(
                    this.currentUser.employee_id
                );
            }


            this.initialized = true;

            console.log(
                "Dayflow: Real backend data loaded successfully."
            );

            return this;

        } catch (error) {

            console.error(
                "Dayflow data initialization failed:",
                error
            );

            /*
             * Do not crash the whole application.
             */
            this.initialized = true;

            return this;
        }
    },


    /*
     * Some existing code calls initialize()
     * instead of load().
     */
    async initialize() {
        return this.load();
    },


    // ============================================================
    // LOAD EMPLOYEE-SPECIFIC DATA
    // ============================================================

    async loadEmployeeData(employeeId) {

        if (!employeeId) {
            return;
        }


        // --------------------------------------------------------
        // ATTENDANCE
        // --------------------------------------------------------

        try {

            const records =
                await API.getAttendance(
                    employeeId
                );

            this.attendance =
                Array.isArray(records)
                    ? records
                    : [];

        } catch (error) {

            console.warn(
                "Could not load attendance:",
                error.message
            );

            this.attendance = [];
        }


        // --------------------------------------------------------
        // LEAVES
        // --------------------------------------------------------

        try {

            const leaves =
                await API.getEmployeeLeaves(
                    employeeId
                );

            this.leaveRequests =
                Array.isArray(leaves)
                    ? leaves
                    : [];

        } catch (error) {

            console.warn(
                "Could not load leave requests:",
                error.message
            );

            this.leaveRequests = [];
        }


        // --------------------------------------------------------
        // PAYROLL
        // --------------------------------------------------------

        try {

            const payroll =
                await API.getPayroll(
                    employeeId
                );

            this.payrolls[employeeId] =
                payroll;

        } catch (error) {

            /*
             * Payroll may not exist yet.
             * That is not an application error.
             */
            console.warn(
                "Payroll not available:",
                error.message
            );

            this.payrolls[employeeId] = null;
        }


        // --------------------------------------------------------
        // DOCUMENTS
        // --------------------------------------------------------

        try {

            const documents =
                await API.getDocuments(
                    employeeId
                );

            this.documents[employeeId] =
                Array.isArray(documents)
                    ? documents
                    : [];

        } catch (error) {

            console.warn(
                "Could not load documents:",
                error.message
            );

            this.documents[employeeId] = [];
        }
    },


    // ============================================================
    // EMPLOYEES
    // ============================================================

    getEmployees() {

        return this.employees || [];
    },


    getUserById(employeeId) {

        if (!employeeId) {
            return null;
        }

        /*
         * Backend uses employee_id such as:
         *
         * OIJOSM20260001
         *
         * The old frontend sometimes used "id".
         */
        return this.employees.find(
            employee =>
                employee.employee_id === employeeId ||
                employee.id === employeeId
        ) || null;
    },


    async refreshEmployees() {

        if (
            this.currentUser &&
            this.currentUser.role &&
            this.currentUser.role.toLowerCase() === "admin"
        ) {

            this.employees =
                await API.getEmployees();

        }

        return this.employees;
    },


    // ============================================================
    // ATTENDANCE
    // ============================================================

    getAttendance(employeeId) {

        /*
         * If employee ID is provided and it is not the currently
         * cached employee, loadEmployeeData() must be called
         * asynchronously by the caller.
         *
         * Existing frontend code expects this function to be
         * synchronous, so return the current cache here.
         */

        if (
            employeeId &&
            this.currentUser &&
            employeeId ===
                this.currentUser.employee_id
        ) {

            return this.attendance || [];
        }

        return [];
    },


    async refreshAttendance(employeeId) {

        if (!employeeId) {
            return [];
        }

        try {

            const records =
                await API.getAttendance(
                    employeeId
                );

            this.attendance =
                Array.isArray(records)
                    ? records
                    : [];

            return this.attendance;

        } catch (error) {

            console.error(
                "Attendance loading failed:",
                error
            );

            this.attendance = [];

            return [];
        }
    },


    // ============================================================
    // WORK HISTORY
    // ============================================================

    getEmployeeWorkHistory(employeeId) {

        /*
         * Attendance is the available backend equivalent of
         * employee work history.
         */

        if (
            this.currentUser &&
            employeeId ===
                this.currentUser.employee_id
        ) {

            return (this.attendance || []).map(
                record => ({

                    id: record.id,

                    employee_id:
                        record.employee_id,

                    date:
                        record.attendance_date,

                    attendance_date:
                        record.attendance_date,

                    check_in:
                        record.check_in,

                    check_out:
                        record.check_out,

                    working_hours:
                        record.working_hours,

                    status:
                        record.status,

                    payable_day:
                        record.payable_day
                })
            );
        }

        return [];
    },


    // ============================================================
    // LEAVES
    // ============================================================

    getEmployeeLeaveRequests(employeeId) {

        if (
            this.currentUser &&
            employeeId ===
                this.currentUser.employee_id
        ) {

            return this.leaveRequests || [];
        }

        return [];
    },


    async refreshLeaveRequests(employeeId) {

        if (!employeeId) {
            return [];
        }

        try {

            const leaves =
                await API.getEmployeeLeaves(
                    employeeId
                );

            this.leaveRequests =
                Array.isArray(leaves)
                    ? leaves
                    : [];

            return this.leaveRequests;

        } catch (error) {

            console.error(
                "Leave loading failed:",
                error
            );

            this.leaveRequests = [];

            return [];
        }
    },


    getLeaveTypes() {

        return this.leaveTypes || [];
    },


    /*
     * Your backend does not currently have a leave-balance
     * endpoint.
     *
     * Therefore we calculate the number of approved leave
     * records rather than inventing a fake balance.
     */
    getEmployeeLeaveBalance(employeeId) {

        const leaves =
            this.getEmployeeLeaveRequests(
                employeeId
            );

        const approved =
            leaves.filter(
                leave =>
                    String(leave.status).toLowerCase() ===
                    "approved"
            );

        const balance = {};

        approved.forEach(
            leave => {

                const type =
                    String(
                        leave.leave_type_id
                    );

                if (!balance[type]) {
                    balance[type] = 0;
                }

                balance[type]++;
            }
        );

        return balance;
    },


    // ============================================================
    // PAYROLL
    // ============================================================

    getPayroll(employeeId) {

        return (
            this.payrolls[employeeId] ||
            null
        );
    },


    async refreshPayroll(employeeId) {

        if (!employeeId) {
            return null;
        }

        try {

            const payroll =
                await API.getPayroll(
                    employeeId
                );

            this.payrolls[employeeId] =
                payroll;

            return payroll;

        } catch (error) {

            console.warn(
                "Payroll loading failed:",
                error.message
            );

            this.payrolls[employeeId] =
                null;

            return null;
        }
    },


    // ============================================================
    // DOCUMENTS
    // ============================================================

    getEmployeeDocuments(employeeId) {

        return (
            this.documents[employeeId] ||
            []
        );
    },


    async refreshDocuments(employeeId) {

        if (!employeeId) {
            return [];
        }

        try {

            const documents =
                await API.getDocuments(
                    employeeId
                );

            this.documents[employeeId] =
                Array.isArray(documents)
                    ? documents
                    : [];

            return this.documents[employeeId];

        } catch (error) {

            console.warn(
                "Documents loading failed:",
                error.message
            );

            this.documents[employeeId] =
                [];

            return [];
        }
    },


    // ============================================================
    // TODAY'S ATTENDANCE STATISTICS
    // ============================================================

    getTodayStats() {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        const records =
            this.attendance || [];

        const todayRecords =
            records.filter(
                record =>
                    record.attendance_date === today
            );

        let present = 0;
        let absent = 0;
        let checkedIn = 0;
        let checkedOut = 0;

        todayRecords.forEach(
            record => {

                const status =
                    String(
                        record.status || ""
                    ).toLowerCase();

                if (
                    status === "present"
                ) {
                    present++;
                }

                if (
                    status === "absent"
                ) {
                    absent++;
                }

                if (
                    record.check_in
                ) {
                    checkedIn++;
                }

                if (
                    record.check_out
                ) {
                    checkedOut++;
                }
            }
        );

        return {
            present,
            absent,
            checkedIn,
            checkedOut,
            total: todayRecords.length
        };
    },


    // ============================================================
    // UPDATE CURRENT USER
    // ============================================================

    updateUserInMockData(user) {

        if (!user) {
            return;
        }

        this.currentUser =
            user;

        /*
         * Keep localStorage synchronized.
         */
        localStorage.setItem(
            "dayflow_current_user",
            JSON.stringify(user)
        );

        /*
         * Do NOT add fake users.
         *
         * The real employee comes from the backend.
         */
    },


    // ============================================================
    // LEGACY METHODS
    // ============================================================

    getUserByEmail(email) {

        return this.employees.find(
            employee =>
                employee.email === email
        ) || null;
    },


    // ============================================================
    // UNSUPPORTED MODULES
    // ============================================================
    /*
     * Your current FastAPI backend does NOT provide endpoints for:
     *
     * - assignments
     * - work mails
     * - permission requests
     *
     * Therefore these are intentionally EMPTY.
     *
     * We do not create fake data.
     */


    getEmployeeAssignments() {
        return [];
    },


    getEmployeeMails() {
        return [];
    },


    // ============================================================
    // ADMIN DATA
    // ============================================================

    async getAllLeaves() {

        try {

            const leaves =
                await API.getAllLeaves();

            return Array.isArray(leaves)
                ? leaves
                : [];

        } catch (error) {

            console.error(
                "Could not load all leave requests:",
                error
            );

            return [];
        }
    },


    async getAdminEmployees() {

        try {

            const employees =
                await API.getEmployees();

            this.employees =
                Array.isArray(employees)
                    ? employees
                    : [];

            return this.employees;

        } catch (error) {

            console.error(
                "Could not load employees:",
                error
            );

            return [];
        }
    }
};


// ============================================================
// GLOBAL
// ============================================================

window.MockData = MockData;