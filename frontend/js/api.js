const API_BASE_URL = "http://127.0.0.1:8000";

const API = {

    async request(endpoint, options = {}) {

        const currentUser = JSON.parse(
            localStorage.getItem("dayflow_current_user") || "null"
        );

        const headers = {
            "Content-Type": "application/json",
            ...(options.headers || {})
        };

        // Send the logged-in employee ID to the backend
        if (currentUser?.employee_id) {
            headers["X-Employee-ID"] = currentUser.employee_id;
        }

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );

        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            throw new Error(
                data.detail ||
                `Request failed: ${response.status}`
            );
        }

        return data;
    },


    // ============================================================
    // AUTH
    // ============================================================

    async login(loginId, password) {

        const result = await this.request(
            "/api/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    login_id: loginId,
                    password: password
                })
            }
        );

        const user = {
            id: result.employee_id,
            employee_id: result.employee_id,
            role: result.role,

            first_name: result.first_name,
            last_name: result.last_name,

            name: `${result.first_name || ""} ${result.last_name || ""}`.trim(),

            email: result.email,
            phone: result.phone,
            address: result.address,
            designation: result.designation,
            department: result.department,

            must_change_password:
                result.must_change_password
        };

        localStorage.setItem(
            "dayflow_current_user",
            JSON.stringify(user)
        );

        return result;
    },


    register(data) {
        return this.request(
            "/api/auth/register",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    changePassword(data) {
        return this.request(
            "/api/auth/change-password",
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
    },


    logout() {
        localStorage.removeItem("dayflow_current_user");
    },


    getCurrentUser() {
        return JSON.parse(
            localStorage.getItem("dayflow_current_user") || "null"
        );
    },


    // ============================================================
    // EMPLOYEES
    // ============================================================

    getEmployees() {
        return this.request(
            "/api/admin/employees"
        );
    },


    getEmployee(employeeId) {
        return this.request(
            `/api/employees/${employeeId}`
        );
    },


    createEmployee(data) {
        return this.request(
            "/api/employees/",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    updateEmployee(employeeId, data) {
        return this.request(
            `/api/employees/${employeeId}`,
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
    },


    deleteEmployee(employeeId) {
        return this.request(
            `/api/admin/employees/${employeeId}`,
            {
                method: "DELETE"
            }
        );
    },


    // ============================================================
    // ATTENDANCE
    // ============================================================

    checkIn(employeeId) {
        return this.request(
            `/api/attendance/check-in/${employeeId}`,
            {
                method: "POST"
            }
        );
    },


    checkOut(employeeId) {
        return this.request(
            `/api/attendance/check-out/${employeeId}`,
            {
                method: "PUT"
            }
        );
    },


    getAttendance(employeeId) {
        return this.request(
            `/api/attendance/${employeeId}`
        );
    },


    // ============================================================
    // LEAVE
    // ============================================================

    getLeaveTypes() {
        return this.request(
            "/api/leave/types"
        );
    },


    applyLeave(data) {
        return this.request(
            "/api/leave/",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    getEmployeeLeaves(employeeId) {
        return this.request(
            `/api/leave/employee/${employeeId}`
        );
    },


    getAllLeaves() {
        return this.request(
            "/api/admin/leaves"
        );
    },


    approveLeave(leaveId, data = {}) {
        return this.request(
            `/api/leave/${leaveId}/approve`,
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
    },


    rejectLeave(leaveId, data = {}) {
        return this.request(
            `/api/leave/${leaveId}/reject`,
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
    },


    // ============================================================
    // PAYROLL
    // ============================================================

    getPayroll(employeeId) {
        return this.request(
            `/api/payroll/employee/${employeeId}`
        );
    },


    updatePayroll(employeeId, data) {
        return this.request(
            `/api/payroll/employee/${employeeId}`,
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
    },


    createPayroll(data) {
        return this.request(
            "/api/payroll/",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    // ============================================================
    // DOCUMENTS
    // ============================================================

    getDocuments(employeeId) {
        return this.request(
            `/api/documents/employee/${employeeId}`
        );
    },


    uploadDocument(data) {
        return this.request(
            "/api/documents/",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    },


    // ============================================================
    // HEALTH
    // ============================================================

    health() {
        return this.request(
            "/api/health"
        );
    }
};


window.API = API;