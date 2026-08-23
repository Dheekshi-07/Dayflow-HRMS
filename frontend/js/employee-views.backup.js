/* ============================================================
   HRFlow — Employee View Renderers
   ============================================================ */

const EmployeeViews = {

  /* ============================================================
     EMPLOYEE DASHBOARD
     ============================================================ */

  renderDashboard(emp) {
    return `
      <div class="welcome-section">
        <h1>Welcome, ${emp.name}! 👋</h1>
        <p>
          ${emp.designation} •
          ${emp.department} Department •
          ID: ${emp.id}
        </p>
      </div>

      <!--
        IMPORTANT:
        Attendance percentage and leave balance are NOT shown here
        because those values were previously coming from MockData.
        They will only be displayed from real backend data.
      -->

      <div class="card">
        <div class="card-body">
          <div class="empty-state">
            <i class="bi bi-speedometer2"></i>
            <h3>Employee Dashboard</h3>
            <p>
              Your attendance and leave information is available
              through the Attendance and Leave Management sections.
            </p>

            <div style="
              display:flex;
              justify-content:center;
              gap:0.75rem;
              margin-top:1rem;
              flex-wrap:wrap;
            ">
              <button
                class="btn btn-primary"
                onclick="App.navigate('emp-attendance')"
              >
                <i class="bi bi-calendar-check"></i>
                View Attendance
              </button>

              <button
                class="btn btn-secondary"
                onclick="App.navigate('emp-leave')"
              >
                <i class="bi bi-calendar2-minus"></i>
                View Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },


  /* ============================================================
     EMPLOYEE PROFILE
     ============================================================ */

  renderProfile(emp) {
    return `
      ${Components.BackButton('emp-dashboard')}

      <div class="page-header">
        <div>
          <h1 class="page-title">My Profile</h1>
          <p class="page-subtitle">
            Personal and professional employee details
          </p>
        </div>

        <div class="page-actions">
          <button
            class="btn btn-primary"
            onclick="App.navigate('emp-edit-profile')"
          >
            <i class="bi bi-pencil-square"></i>
            Edit Profile
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">

          <div class="profile-header">
            <div class="profile-avatar">
              ${
                emp.avatar ||
                emp.name.substring(0, 2).toUpperCase()
              }
            </div>

            <div class="profile-info">
              <h2>${emp.name}</h2>

              <div class="profile-role">
                ${emp.designation} • ${emp.department}
              </div>

              <div class="profile-id">
                Employee ID:
                <strong>${emp.id}</strong>
              </div>
            </div>
          </div>

          <div style="
            height:1px;
            background:var(--card-border);
            margin:1.5rem 0;
          "></div>

          <div class="profile-details-grid">

            <div class="profile-detail-item">
              <span class="profile-detail-label">
                Full Name
              </span>
              <span class="profile-detail-value">
                ${emp.name}
              </span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">
                Employee ID
              </span>
              <span class="profile-detail-value">
                ${emp.id}
              </span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">
                Personal Email
              </span>
              <span class="profile-detail-value">
                ${emp.email || '-'}
              </span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">
                Work Email
              </span>
              <span class="profile-detail-value">
                ${emp.workEmail || '-'}
              </span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">
                Phone Number
              </span>
              <span class="profile-detail-value">
                ${emp.phone || '-'}
              </span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">
                Department
              </span>
              <span class="profile-detail-value">
                ${emp.department || '-'}
              </span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">
                Designation
              </span>
              <span class="profile-detail-value">
                ${emp.designation || '-'}
              </span>
            </div>

            <div class="profile-detail-item">
              <span class="profile-detail-label">
                Date of Joining
              </span>
              <span class="profile-detail-value">
                ${
                  emp.joiningDate
                    ? Components.formatDate(emp.joiningDate)
                    : '-'
                }
              </span>
            </div>

            <div
              class="profile-detail-item"
              style="grid-column:1 / -1;"
            >
              <span class="profile-detail-label">
                Residential Address
              </span>

              <span class="profile-detail-value">
                ${emp.address || '-'}
              </span>
            </div>

          </div>
        </div>
      </div>
    `;
  },


  /* ============================================================
     EDIT PROFILE
     ============================================================ */

  renderEditProfile(emp) {
    return `
      ${Components.BackButton('emp-profile')}

      <div class="page-header">
        <div>
          <h1 class="page-title">Edit Profile</h1>
          <p class="page-subtitle">
            Update your personal contact information
          </p>
        </div>
      </div>

      <div class="card">

        <div
          class="card-header"
          style="
            background:var(--warning-light);
            border-color:var(--warning-bg);
          "
        >
          <span
            style="
              font-size:0.8125rem;
              font-weight:600;
              color:var(--warning);
            "
          >
            <i class="bi bi-info-circle"></i>
            Company-assigned fields such as Employee ID,
            Designation and Department cannot be modified.
          </span>
        </div>

        <div class="card-body">

          <form
            onsubmit="EmployeeViews.handleProfileSave(event)"
          >

            <div class="grid-2">

              ${Components.FormInput({
                id:'edit-name',
                label:'Full Name',
                value:emp.name || '',
                required:true,
                icon:'person'
              })}

              ${Components.FormInput({
                id:'edit-email',
                label:'Personal Email',
                type:'email',
                value:emp.email || '',
                required:true,
                icon:'envelope'
              })}

              ${Components.FormInput({
                id:'edit-phone',
                label:'Phone Number',
                value:emp.phone || '',
                required:true,
                icon:'telephone'
              })}

              ${Components.FormInput({
                id:'edit-work-email',
                label:'Work Email',
                type:'email',
                value:emp.workEmail || '',
                required:true,
                icon:'building'
              })}

            </div>

            ${Components.FormTextarea({
              id:'edit-address',
              label:'Residential Address',
              value:emp.address || '',
              required:true,
              rows:3
            })}

            <div style="
              display:flex;
              justify-content:flex-end;
              gap:0.75rem;
              margin-top:1.5rem;
            ">

              <button
                type="button"
                class="btn btn-secondary"
                onclick="App.navigate('emp-profile')"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="btn btn-primary"
              >
                <i class="bi bi-check-lg"></i>
                Save Changes
              </button>

            </div>

          </form>
        </div>
      </div>
    `;
  },


  handleProfileSave(e) {
    e.preventDefault();

    const name =
      document.getElementById('edit-name').value;

    const email =
      document.getElementById('edit-email').value;

    const phone =
      document.getElementById('edit-phone').value;

    const workEmail =
      document.getElementById('edit-work-email').value;

    const address =
      document.getElementById('edit-address').value;

    if (
      !name ||
      !email ||
      !phone ||
      !workEmail ||
      !address
    ) {
      App.showToast(
        'Please fill out all required fields.',
        'error'
      );
      return;
    }

    App.currentUser.name = name;
    App.currentUser.email = email;
    App.currentUser.phone = phone;
    App.currentUser.workEmail = workEmail;
    App.currentUser.address = address;

    /*
      Keep existing application behaviour for profile
      until profile API integration is completed.
    */
    if (typeof App.updateUserInMockData === 'function') {
      App.updateUserInMockData(App.currentUser);
    }

    App.saveSession();

    App.showToast(
      'Profile updated successfully!',
      'success'
    );

    App.navigate('emp-profile');
  },


  /* ============================================================
     WORK HISTORY
     ============================================================ */

  renderWorkHistory(emp) {
    const history =
      MockData.getEmployeeWorkHistory(emp.id);

    const columns = [

      {
        label:'Task / Project',
        key:'title',
        className:'td-name'
      },

      {
        label:'Start Date',
        key:'startDate',
        render:r =>
          Components.formatDate(r.startDate)
      },

      {
        label:'Completion Date',
        key:'endDate',
        render:r =>
          r.endDate
            ? Components.formatDate(r.endDate)
            : 'Ongoing'
      },

      {
        label:'Time Taken',
        key:'timeTaken'
      },

      {
        label:'Status',
        key:'status',
        render:r =>
          Components.StatusBadge(r.status)
      },

      {
        label:'Action',
        key:'id',
        render:r => `
          <button
            class="btn btn-ghost btn-sm"
            onclick="EmployeeViews.showWorkDetail('${r.id}')"
          >
            <i class="bi bi-eye"></i>
            Details
          </button>
        `
      }

    ];

    return `
      ${Components.BackButton('emp-dashboard')}

      <div class="page-header">
        <div>
          <h1 class="page-title">Work History</h1>
          <p class="page-subtitle">
            Track record of your completed and ongoing projects
          </p>
        </div>
      </div>

      ${Components.DataTable({
        id:'work-history-table',
        columns,
        rows:history,
        searchPlaceholder:'Search work history...',
        filters:[
          {
            key:'status',
            label:'All Statuses',
            options:[
              'Completed',
              'In Progress'
            ]
          }
        ]
      })}
    `;
  },


  showWorkDetail(whId) {
    const history =
      MockData.getEmployeeWorkHistory(
        App.currentUser.id
      );

    const item =
      history.find(h => h.id === whId);

    if (!item) return;

    App.showModal(
      'work-detail-modal',
      item.title,
      `
        <div class="detail-row">
          <span class="detail-label">
            Task Name
          </span>
          <span class="detail-value fw-600">
            ${item.title}
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            Start Date
          </span>
          <span class="detail-value">
            ${Components.formatDate(item.startDate)}
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            Completion Date
          </span>
          <span class="detail-value">
            ${
              item.endDate
                ? Components.formatDate(item.endDate)
                : 'Ongoing'
            }
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            Time Taken
          </span>
          <span class="detail-value">
            ${item.timeTaken}
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">
            Status
          </span>
          <span class="detail-value">
            ${Components.StatusBadge(item.status)}
          </span>
        </div>

        <div
          class="detail-row"
          style="
            flex-direction:column;
            gap:0.5rem;
            margin-top:0.5rem;
          "
        >
          <span class="detail-label">
            Description
          </span>

          <span
            class="detail-value"
            style="line-height:1.5;"
          >
            ${item.description}
          </span>
        </div>
      `,
      `
        <button
          class="btn btn-secondary"
          onclick="App.closeModal('work-detail-modal')"
        >
          Close
        </button>
      `
    );
  },


  /* ============================================================
     ATTENDANCE
     REAL BACKEND DATA ONLY
     ============================================================ */

  async renderAttendance(emp) {

    try {

      const attendanceRecords =
        await API.getAttendance(emp.id);

      console.log(
        'REAL ATTENDANCE DATA:',
        attendanceRecords
      );

      const present =
        attendanceRecords.filter(
          record =>
            String(record.status).toLowerCase() ===
            'present'
        ).length;

      const late =
        attendanceRecords.filter(
          record =>
            String(record.status).toLowerCase() ===
            'late'
        ).length;

      const absent =
        attendanceRecords.filter(
          record =>
            String(record.status).toLowerCase() ===
            'absent'
        ).length;

      const total =
        attendanceRecords.length;

      const attendanceRate =
        total > 0
          ? Math.round((present / total) * 100)
          : 0;

      return `

        ${Components.BackButton('emp-dashboard')}

        <div class="page-header">

          <div>
            <h1 class="page-title">
              Attendance Overview
            </h1>

            <p class="page-subtitle">
              Track your attendance using records from the HRMS database
            </p>
          </div>

        </div>


        <div class="stats-grid">

          ${Components.StatCard({
            icon:'calendar-check',
            value:`${attendanceRate}%`,
            label:'Attendance Rate',
            color:'primary'
          })}

          ${Components.StatCard({
            icon:'check-circle',
            value:present,
            label:'Present Days',
            color:'success'
          })}

          ${Components.StatCard({
            icon:'clock-history',
            value:late,
            label:'Late Days',
            color:'warning'
          })}

          ${Components.StatCard({
            icon:'x-circle',
            value:absent,
            label:'Absent Days',
            color:'danger'
          })}

        </div>


        <div class="card mb-3">

          <div class="card-header">
            <h3 class="card-title">
              Attendance History
            </h3>
          </div>

          <div class="card-body">

            ${
              attendanceRecords.length === 0

              ? `
                <div class="empty-state">

                  <i class="bi bi-calendar-x"></i>

                  <h3>
                    No attendance records
                  </h3>

                  <p>
                    No attendance has been recorded yet.
                  </p>

                </div>
              `

              : `

                <div class="table-responsive">

                  <table class="data-table">

                    <thead>

                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Working Hours</th>
                        <th>Status</th>
                        <th>Payable Day</th>
                      </tr>

                    </thead>

                    <tbody>

                      ${attendanceRecords.map(record => `

                        <tr>

                          <td>
                            ${
                              record.attendance_date
                                ? Components.formatDate(
                                    record.attendance_date
                                  )
                                : '-'
                            }
                          </td>

                          <td>
                            ${record.check_in || '-'}
                          </td>

                          <td>
                            ${record.check_out || '-'}
                          </td>

                          <td>
                            ${
                              record.working_hours != null
                                ? `${record.working_hours} hrs`
                                : '-'
                            }
                          </td>

                          <td>
                            ${
                              Components.StatusBadge(
                                record.status
                              )
                            }
                          </td>

                          <td>
                            ${
                              record.payable_day ??
                              '-'
                            }
                          </td>

                        </tr>

                      `).join('')}

                    </tbody>

                  </table>

                </div>

              `
            }

          </div>

        </div>

      `;

    } catch (error) {

      console.error(
        'Failed to load attendance:',
        error
      );

      return `

        ${Components.BackButton('emp-dashboard')}

        <div class="card">

          <div class="card-body">

            <div class="empty-state">

              <i class="bi bi-exclamation-triangle"></i>

              <h3>
                Unable to load attendance
              </h3>

              <p>
                ${error.message}
              </p>

            </div>

          </div>

        </div>

      `;
    }
  },


  /* ============================================================
     ATTENDANCE RELOAD
     ============================================================ */

  async changeCalendarMonth(delta) {

    try {

      const attendanceRecords =
        await API.getAttendance(
          App.currentUser.id
        );

      const container =
        document.getElementById(
          'calendar-container'
        );

      if (!container) return;

      if (!attendanceRecords.length) {

        container.innerHTML = `

          <div class="card">

            <div class="card-body">

              <div class="empty-state">

                <i class="bi bi-calendar-x"></i>

                <h3>
                  No attendance records
                </h3>

                <p>
                  No attendance has been recorded yet.
                </p>

              </div>

            </div>

          </div>

        `;

        return;
      }

      container.innerHTML = `

        <div class="card">

          <div class="card-header">

            <h3 class="card-title">
              Attendance Records
            </h3>

          </div>

          <div class="card-body">

            <div class="table-responsive">

              <table class="data-table">

                <thead>

                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Working Hours</th>
                    <th>Status</th>
                    <th>Payable Day</th>
                  </tr>

                </thead>

                <tbody>

                  ${attendanceRecords.map(record => `

                    <tr>

                      <td>
                        ${
                          record.attendance_date
                            ? Components.formatDate(
                                record.attendance_date
                              )
                            : '-'
                        }
                      </td>

                      <td>
                        ${record.check_in || '-'}
                      </td>

                      <td>
                        ${record.check_out || '-'}
                      </td>

                      <td>
                        ${
                          record.working_hours != null
                            ? `${record.working_hours} hrs`
                            : '-'
                        }
                      </td>

                      <td>
                        ${
                          Components.StatusBadge(
                            record.status
                          )
                        }
                      </td>

                      <td>
                        ${
                          record.payable_day ??
                          '-'
                        }
                      </td>

                    </tr>

                  `).join('')}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      `;

    } catch (error) {

      console.error(
        'Failed to reload attendance:',
        error
      );

    }
  },


  /* ============================================================
     LEAVE MANAGEMENT
     REAL BACKEND DATA ONLY
     ============================================================ */

  async renderLeave(emp) {

    try {

      const requests =
        await API.getEmployeeLeaves(emp.id);

      console.log(
        'REAL LEAVE DATA:',
        requests
      );

      const leaveRows =
        requests.map(leave => {

          const start =
            new Date(leave.start_date);

          const end =
            new Date(leave.end_date);

          const days =
            Math.floor(
              (
                end.getTime() -
                start.getTime()
              ) /
              (1000 * 60 * 60 * 24)
            ) + 1;

          return {

            id:leave.id,

            type:
              leave.leave_type_name ||
              leave.leave_type ||
              `Leave Type #${leave.leave_type_id}`,

            startDate:
              leave.start_date,

            endDate:
              leave.end_date,

            days,

            reason:
              leave.reason || '-',

            status:
              leave.status

          };

        });


      const columns = [

        {
          label:'Leave Type',
          key:'type',
          className:'td-name'
        },

        {
          label:'Start Date',
          key:'startDate',
          render:r =>
            Components.formatDate(
              r.startDate
            )
        },

        {
          label:'End Date',
          key:'endDate',
          render:r =>
            Components.formatDate(
              r.endDate
            )
        },

        {
          label:'Days',
          key:'days'
        },

        {
          label:'Reason',
          key:'reason'
        },

        {
          label:'Status',
          key:'status',
          render:r =>
            Components.StatusBadge(
              r.status
            )
        }

      ];


      return `

        ${Components.BackButton('emp-dashboard')}

        <div class="page-header">

          <div>

            <h1 class="page-title">
              Leave Management
            </h1>

            <p class="page-subtitle">
              View your leave requests and track their status
            </p>

          </div>

          <div class="page-actions">

            <button
              class="btn btn-secondary"
              onclick="EmployeeViews.exportLeaveReport()"
            >
              <i class="bi bi-download"></i>
              Export Leave Report
            </button>

            <button
              class="btn btn-primary"
              onclick="EmployeeViews.openApplyLeaveModal()"
            >
              <i class="bi bi-plus-lg"></i>
              Apply Leave
            </button>

          </div>

        </div>


        <div class="card mb-3">

          <div class="card-header">

            <h3 class="card-title">
              Leave Requests History
            </h3>

          </div>

          <div
            class="card-body"
            style="padding:0;"
          >

            ${
              leaveRows.length > 0

              ? Components.DataTable({

                  id:'emp-leave-table',

                  columns,

                  rows:leaveRows,

                  searchPlaceholder:
                    'Search leave requests...',

                  filters:[
                    {
                      key:'status',
                      label:'All Statuses',
                      options:[
                        'Pending',
                        'Approved',
                        'Rejected'
                      ]
                    }
                  ]

                })

              : Components.EmptyState({

                  icon:'calendar-x',

                  title:'No leave requests',

                  message:
                    'You have not submitted any leave requests yet.'

                })
            }

          </div>

        </div>

      `;

    } catch (error) {

      console.error(
        'Failed to load leave data:',
        error
      );

      return `

        ${Components.BackButton('emp-dashboard')}

        <div class="card">

          <div class="card-body">

            <div class="empty-state">

              <i class="bi bi-exclamation-triangle"></i>

              <h3>
                Unable to load leave data
              </h3>

              <p>
                ${error.message}
              </p>

            </div>

          </div>

        </div>

      `;
    }
  },


  /* ============================================================
     APPLY LEAVE MODAL
     ============================================================ */

  async openApplyLeaveModal() {

    try {

      const leaveTypes =
        await API.getLeaveTypes();

      if (!leaveTypes || !leaveTypes.length) {

        App.showToast(
          'No leave types are available.',
          'error'
        );

        return;
      }


      const options =
        leaveTypes.map(type => {

          const id =
            type.id;

          const name =
            type.name ||
            type.leave_type ||
            type.type ||
            `Leave Type #${id}`;

          return `
            <option value="${id}">
              ${name}
            </option>
          `;

        }).join('');


      App.showModal(
        'apply-leave-modal',
        'Apply for Leave',
        `

          <form
            id="apply-leave-form"
            onsubmit="EmployeeViews.handleApplyLeave(event)"
          >

            <div class="form-group">

              <label
                for="leave-type"
                class="form-label"
              >
                Leave Type
              </label>

              <select
                id="leave-type"
                class="form-control"
                required
              >

                <option value="">
                  Select Leave Type
                </option>

                ${options}

              </select>

            </div>


            <div class="grid-2">

              ${Components.FormInput({
                id:'leave-start-date',
                label:'Start Date',
                type:'date',
                required:true
              })}

              ${Components.FormInput({
                id:'leave-end-date',
                label:'End Date',
                type:'date',
                required:true
              })}

            </div>


            ${Components.FormTextarea({

              id:'leave-reason',

              label:'Reason for Leave',

              placeholder:
                'Provide a clear explanation...',

              required:true

            })}


            <div style="
              display:flex;
              justify-content:flex-end;
              gap:0.75rem;
              margin-top:1.5rem;
            ">

              <button
                type="button"
                class="btn btn-secondary"
                onclick="App.closeModal('apply-leave-modal')"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="btn btn-primary"
              >
                Submit Application
              </button>

            </div>

          </form>

        `
      );

    } catch (error) {

      console.error(
        'Failed to load leave types:',
        error
      );

      App.showToast(
        'Unable to load leave types.',
        'error'
      );
    }
  },


  /* ============================================================
     SUBMIT LEAVE TO BACKEND
     ============================================================ */

  async handleApplyLeave(e) {

    e.preventDefault();

    const leaveType =
      document.getElementById(
        'leave-type'
      ).value;

    const startDate =
      document.getElementById(
        'leave-start-date'
      ).value;

    const endDate =
      document.getElementById(
        'leave-end-date'
      ).value;

    const reason =
      document.getElementById(
        'leave-reason'
      ).value.trim();


    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason
    ) {

      App.showToast(
        'Please fill in all required fields.',
        'error'
      );

      return;
    }


    if (endDate < startDate) {

      App.showToast(
        'End date cannot be before start date.',
        'error'
      );

      return;
    }


    try {

      await API.applyLeave({

        employee_id:
          App.currentUser.id,

        leave_type_id:
          Number(leaveType),

        start_date:
          startDate,

        end_date:
          endDate,

        reason:
          reason

      });


      App.closeModal(
        'apply-leave-modal'
      );

      App.showToast(
        'Leave application submitted successfully!',
        'success'
      );

      /*
        Reload the leave page so the newly-created
        backend record appears immediately.
      */
      App.navigate('emp-leave');

    } catch (error) {

      console.error(
        'Failed to submit leave:',
        error
      );

      App.showToast(
        error.message ||
        'Failed to submit leave application.',
        'error'
      );
    }
  },


  /* ============================================================
     EXPORT REAL LEAVE DATA
     ============================================================ */

  async exportLeaveReport() {

    try {

      const emp =
        App.currentUser;

      const requests =
        await API.getEmployeeLeaves(
          emp.id
        );


      let csv =
        `Leave Report for ${emp.name} (${emp.id})\n`;

      csv +=
        `Generated Date,${new Date().toLocaleDateString()}\n\n`;

      csv +=
        `ID,Leave Type,Start Date,End Date,Days,Reason,Status\n`;


      requests.forEach(leave => {

        const start =
          new Date(leave.start_date);

        const end =
          new Date(leave.end_date);

        const days =
          Math.floor(
            (
              end.getTime() -
              start.getTime()
            ) /
            (1000 * 60 * 60 * 24)
          ) + 1;


        const type =
          leave.leave_type_name ||
          leave.leave_type ||
          `Leave Type #${leave.leave_type_id}`;


        csv +=
          `"${leave.id}",` +
          `"${type}",` +
          `"${leave.start_date}",` +
          `"${leave.end_date}",` +
          `"${days}",` +
          `"${leave.reason || ''}",` +
          `"${leave.status}"\n`;

      });


      const blob =
        new Blob(
          [csv],
          { type:'text/csv' }
        );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement('a');

      a.href =
        url;

      a.download =
        `Leave_Report_${emp.id}_${new Date()
          .toISOString()
          .split('T')[0]}.csv`;

      a.click();

      URL.revokeObjectURL(url);


      App.showToast(
        'Leave report exported successfully!',
        'success'
      );

    } catch (error) {

      console.error(
        'Failed to export leave report:',
        error
      );

      App.showToast(
        'Unable to export leave report.',
        'error'
      );
    }
  },


  /* ============================================================
     WORK MAIL
     ============================================================ */

  renderWorkMail(emp) {

    const mails =
      MockData.getEmployeeMails(
        emp.id
      );

    return `

      ${Components.BackButton('emp-dashboard')}

      <div class="page-header">

        <div>

          <h1 class="page-title">
            Work Mail
          </h1>

          <p class="page-subtitle">
            Official communication and notifications from HR
          </p>

        </div>

      </div>


      <div class="card">

        <div class="card-body">

          <div class="mail-list">

            ${
              mails.length > 0

              ? mails.map(m =>
                  Components.MailItem({

                    id:m.id,

                    subject:m.subject,

                    from:m.from,

                    date:m.date,

                    priority:m.priority,

                    status:m.status,

                    preview:
                      m.message.substring(0,80),

                    onClick:
                      'EmployeeViews.openMailDetail'

                  })
                ).join('')

              : Components.EmptyState({

                  icon:'inbox',

                  title:'No work mail received'

                })
            }

          </div>

        </div>

      </div>

    `;
  },


  openMailDetail(mailId) {

    const mails =
      MockData.getEmployeeMails(
        App.currentUser.id
      );

    const mail =
      mails.find(
        m => m.id === mailId
      );

    if (!mail) return;

    mail.status = 'Read';


    App.showModal(
      'mail-detail-modal',
      mail.subject,
      `

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:1rem;
          padding-bottom:0.75rem;
          border-bottom:1px solid var(--card-border);
        ">

          <div>

            <div style="
              font-size:0.875rem;
              font-weight:600;
            ">
              From: ${mail.from}
            </div>

            <div style="
              font-size:0.75rem;
              color:var(--slate-500);
            ">
              Date:
              ${Components.formatDate(mail.date)}
            </div>

          </div>

          ${Components.PriorityBadge(mail.priority)}

        </div>


        <div style="
          white-space:pre-wrap;
          font-size:0.875rem;
          line-height:1.6;
          color:var(--slate-800);
          margin-bottom:1.5rem;
        ">
          ${mail.message}
        </div>


        <div style="
          border-top:1px solid var(--card-border);
          padding-top:1rem;
        ">

          <h4 style="
            font-size:0.8125rem;
            font-weight:600;
            margin-bottom:0.75rem;
          ">
            Action Options:
          </h4>

          <div style="
            display:flex;
            gap:0.5rem;
            flex-wrap:wrap;
          ">

            <button
              class="btn btn-success btn-sm"
              onclick="
                EmployeeViews.handleMailAction(
                  '${mail.id}',
                  'Done'
                )
              "
            >
              <i class="bi bi-check-circle"></i>
              Mark as Done
            </button>

            <button
              class="btn btn-primary btn-sm"
              onclick="
                EmployeeViews.openFeedbackModal(
                  '${mail.id}'
                )
              "
            >
              <i class="bi bi-chat-text"></i>
              Send Feedback
            </button>

            <button
              class="btn btn-warning btn-sm"
              onclick="
                EmployeeViews.openRedoModal(
                  '${mail.id}'
                )
              "
            >
              <i class="bi bi-arrow-counterclockwise"></i>
              Request Redo
            </button>

          </div>

        </div>

      `,
      `
        <button
          class="btn btn-secondary"
          onclick="
            App.closeModal('mail-detail-modal')
          "
        >
          Close
        </button>
      `,
      true
    );
  },


  handleMailAction(
    mailId,
    action,
    extra = ''
  ) {

    const mails =
      MockData.getEmployeeMails(
        App.currentUser.id
      );

    const mail =
      mails.find(
        m => m.id === mailId
      );

    if (!mail) return;


    if (action === 'Done') {

      mail.status =
        'Completed';

      if (mail.assignmentId) {

        const asn =
          MockData.assignments.find(
            a =>
              a.id === mail.assignmentId
          );

        if (asn) {
          asn.status =
            'Completed';
        }
      }

      App.showToast(
        'Work marked as Completed!',
        'success'
      );

    } else if (action === 'Feedback') {

      App.showToast(
        `Feedback sent to HR: "${extra}"`,
        'success'
      );

    } else if (action === 'Redo') {

      mail.status =
        'Redo Requested';

      if (mail.assignmentId) {

        const asn =
          MockData.assignments.find(
            a =>
              a.id === mail.assignmentId
          );

        if (asn) {
          asn.status =
            'Redo Requested';
        }
      }

      App.showToast(
        'Redo requested with reason. HR has been notified.',
        'warning'
      );
    }


    App.closeModal(
      'mail-detail-modal'
    );

    App.closeModal(
      'feedback-modal'
    );

    App.closeModal(
      'redo-modal'
    );

    App.navigate('emp-mail');
  },


  openFeedbackModal(mailId) {

    App.showModal(
      'feedback-modal',
      'Send Custom Feedback',
      `

        ${Components.FormTextarea({

          id:'feedback-text',

          label:'Your Feedback / Comment',

          placeholder:
            'Enter your response...',

          required:true

        })}


        <div style="
          display:flex;
          justify-content:flex-end;
          gap:0.5rem;
          margin-top:1rem;
        ">

          <button
            type="button"
            class="btn btn-secondary"
            onclick="
              App.closeModal('feedback-modal')
            "
          >
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-primary"
            onclick="
              EmployeeViews.submitFeedback('${mailId}')
            "
          >
            Send Feedback
          </button>

        </div>

      `
    );
  },


  submitFeedback(mailId) {

    const text =
      document.getElementById(
        'feedback-text'
      ).value;

    if (!text) {

      App.showToast(
        'Please enter your feedback.',
        'error'
      );

      return;
    }

    EmployeeViews.handleMailAction(
      mailId,
      'Feedback',
      text
    );
  },


  openRedoModal(mailId) {

    App.showModal(
      'redo-modal',
      'Request Redo / Clarification',
      `

        ${Components.FormTextarea({

          id:'redo-reason',

          label:'Reason for Redo Request',

          placeholder:
            'Explain why a redo or clarification is needed...',

          required:true

        })}


        <div style="
          display:flex;
          justify-content:flex-end;
          gap:0.5rem;
          margin-top:1rem;
        ">

          <button
            type="button"
            class="btn btn-secondary"
            onclick="
              App.closeModal('redo-modal')
            "
          >
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-warning"
            onclick="
              EmployeeViews.submitRedo('${mailId}')
            "
          >
            Submit Request
          </button>

        </div>

      `
    );
  },


  submitRedo(mailId) {

    const text =
      document.getElementById(
        'redo-reason'
      ).value;

    if (!text) {

      App.showToast(
        'Please provide a reason.',
        'error'
      );

      return;
    }

    EmployeeViews.handleMailAction(
      mailId,
      'Redo',
      text
    );
  },


  /* ============================================================
     ASSIGNMENTS
     ============================================================ */

  renderAssignments(emp) {

    const assignments =
      MockData.getEmployeeAssignments(
        emp.id
      );

    return `

      ${Components.BackButton('emp-dashboard')}

      <div class="page-header">

        <div>

          <h1 class="page-title">
            My Assignments
          </h1>

          <p class="page-subtitle">
            Work tasks assigned to you by HR and Management
          </p>

        </div>

      </div>


      <div style="
        display:flex;
        flex-direction:column;
        gap:0.75rem;
      ">

        ${
          assignments.length > 0

          ? assignments.map(a =>
              Components.AssignmentCard({

                id:a.id,

                title:a.title,

                dueDate:a.dueDate,

                priority:a.priority,

                status:a.status,

                sender:a.sender,

                onClick:
                  'EmployeeViews.openAssignmentDetail'

              })
            ).join('')

          : Components.EmptyState({

              icon:'card-checklist',

              title:'No assignments found'

            })
        }

      </div>

    `;
  },


  openAssignmentDetail(asnId) {

    const assignments =
      MockData.getEmployeeAssignments(
        App.currentUser.id
      );

    const asn =
      assignments.find(
        a => a.id === asnId
      );

    if (!asn) return;


    App.showModal(
      'assignment-detail-modal',
      asn.title,
      `

        <div class="detail-row">
          <span class="detail-label">
            Assigned By
          </span>

          <span class="detail-value fw-600">
            ${asn.sender}
          </span>
        </div>


        <div class="detail-row">
          <span class="detail-label">
            Assigned Date
          </span>

          <span class="detail-value">
            ${Components.formatDate(asn.assignedDate)}
          </span>
        </div>


        <div class="detail-row">
          <span class="detail-label">
            Due Date
          </span>

          <span class="detail-value">
            ${Components.formatDate(asn.dueDate)}
          </span>
        </div>


        <div class="detail-row">
          <span class="detail-label">
            Priority
          </span>

          <span class="detail-value">
            ${Components.PriorityBadge(asn.priority)}
          </span>
        </div>


        <div class="detail-row">
          <span class="detail-label">
            Current Status
          </span>

          <span class="detail-value">
            ${Components.StatusBadge(asn.status)}
          </span>
        </div>


        <div
          class="detail-row"
          style="
            flex-direction:column;
            gap:0.5rem;
            margin-top:0.5rem;
          "
        >

          <span class="detail-label">
            Instructions
          </span>

          <span
            class="detail-value"
            style="line-height:1.5;"
          >
            ${asn.description}
          </span>

        </div>


        <div style="
          border-top:1px solid var(--card-border);
          padding-top:1rem;
          margin-top:1rem;
        ">

          <h4 style="
            font-size:0.8125rem;
            font-weight:600;
            margin-bottom:0.75rem;
          ">
            Actions:
          </h4>

          <div style="
            display:flex;
            gap:0.5rem;
            flex-wrap:wrap;
          ">

            <button
              class="btn btn-success btn-sm"
              onclick="
                EmployeeViews.markAssignmentComplete(
                  '${asn.id}'
                )
              "
            >
              <i class="bi bi-check-lg"></i>
              Mark Completed
            </button>

            <button
              class="btn btn-primary btn-sm"
              onclick="
                EmployeeViews.openAssignmentFeedback(
                  '${asn.id}'
                )
              "
            >
              <i class="bi bi-chat-text"></i>
              Send Feedback
            </button>

            <button
              class="btn btn-warning btn-sm"
              onclick="
                EmployeeViews.openAssignmentRedo(
                  '${asn.id}'
                )
              "
            >
              <i class="bi bi-arrow-counterclockwise"></i>
              Request Redo
            </button>

          </div>

        </div>

      `,
      `
        <button
          class="btn btn-secondary"
          onclick="
            App.closeModal('assignment-detail-modal')
          "
        >
          Close
        </button>
      `,
      true
    );
  },


  markAssignmentComplete(asnId) {

    const asn =
      MockData.assignments.find(
        a => a.id === asnId
      );

    if (!asn) return;

    asn.status =
      'Completed';

    App.showToast(
      'Assignment marked as Completed!',
      'success'
    );

    App.closeModal(
      'assignment-detail-modal'
    );

    App.navigate(
      'emp-assignments'
    );
  },


  openAssignmentFeedback(asnId) {

    App.showModal(
      'asn-feedback-modal',
      'Send Assignment Feedback',
      `

        ${Components.FormTextarea({

          id:'asn-feedback-text',

          label:'Feedback / Comment',

          placeholder:
            'Provide update to HR...',

          required:true

        })}


        <div style="
          display:flex;
          justify-content:flex-end;
          gap:0.5rem;
          margin-top:1rem;
        ">

          <button
            type="button"
            class="btn btn-secondary"
            onclick="
              App.closeModal('asn-feedback-modal')
            "
          >
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-primary"
            onclick="
              EmployeeViews.submitAssignmentFeedback(
                '${asnId}'
              )
            "
          >
            Send
          </button>

        </div>

      `
    );
  },


  submitAssignmentFeedback(asnId) {

    const text =
      document.getElementById(
        'asn-feedback-text'
      ).value;

    if (!text) {

      App.showToast(
        'Please enter feedback.',
        'error'
      );

      return;
    }

    App.showToast(
      'Feedback submitted to HR!',
      'success'
    );

    App.closeModal(
      'asn-feedback-modal'
    );

    App.closeModal(
      'assignment-detail-modal'
    );
  },


  openAssignmentRedo(asnId) {

    App.showModal(
      'asn-redo-modal',
      'Request Redo / Clarification',
      `

        ${Components.FormTextarea({

          id:'asn-redo-text',

          label:'Reason for Redo Request',

          placeholder:
            'Explain why clarification or redo is required...',

          required:true

        })}


        <div style="
          display:flex;
          justify-content:flex-end;
          gap:0.5rem;
          margin-top:1rem;
        ">

          <button
            type="button"
            class="btn btn-secondary"
            onclick="
              App.closeModal('asn-redo-modal')
            "
          >
            Cancel
          </button>

          <button
            type="button"
            class="btn btn-warning"
            onclick="
              EmployeeViews.submitAssignmentRedo(
                '${asnId}'
              )
            "
          >
            Submit Request
          </button>

        </div>

      `
    );
  },


  submitAssignmentRedo(asnId) {

    const text =
      document.getElementById(
        'asn-redo-text'
      ).value;

    if (!text) {

      App.showToast(
        'Please enter a reason.',
        'error'
      );

      return;
    }

    const asn =
      MockData.assignments.find(
        a => a.id === asnId
      );

    if (asn) {
      asn.status =
        'Redo Requested';
    }

    App.showToast(
      'Redo request submitted to HR!',
      'warning'
    );

    App.closeModal(
      'asn-redo-modal'
    );

    App.closeModal(
      'assignment-detail-modal'
    );

    App.navigate(
      'emp-assignments'
    );
  }

};