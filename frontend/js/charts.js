/* ============================================================
   HRFlow — Chart.js Configurations
   Dark Mode Presets for Black & Grey Theme
   ============================================================ */

const Charts = {
  instances: {},

  /* ── Shared defaults (Dark Mode) ── */
  defaults: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
          color: '#A1A1AA',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#27272A',
        titleColor: '#FAFAFA',
        bodyColor: '#A1A1AA',
        borderColor: '#3F3F46',
        borderWidth: 1,
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    }
  },

  /* ── Destroy existing chart on canvas ── */
  destroy(canvasId) {
    if (this.instances[canvasId]) {
      this.instances[canvasId].destroy();
      delete this.instances[canvasId];
    }
  },

  /* ── Monthly Attendance Bar Chart ── */
  renderMonthlyAttendance(canvasId, monthData) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = monthData.map(m => m.month.substring(0, 3));
    const present = monthData.map(m => m.summary.present);
    const absent = monthData.map(m => m.summary.absent);
    const late = monthData.map(m => m.summary.late);

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.reverse(),
        datasets: [
          {
            label: 'Present',
            data: present.reverse(),
            backgroundColor: '#10B981',
            borderRadius: 4,
            barPercentage: 0.7
          },
          {
            label: 'Absent',
            data: absent.reverse(),
            backgroundColor: '#EF4444',
            borderRadius: 4,
            barPercentage: 0.7
          },
          {
            label: 'Late',
            data: late.reverse(),
            backgroundColor: '#F59E0B',
            borderRadius: 4,
            barPercentage: 0.7
          }
        ]
      },
      options: {
        ...this.defaults,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#71717A', font: { family: 'Inter', size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#27272A' },
            ticks: { color: '#71717A', font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
  },

  /* ── Yearly Attendance Line Chart ── */
  renderYearlyAttendance(canvasId, monthData) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = monthData.map(m => m.month.substring(0, 3));
    const attendance = monthData.map(m => {
      const workingDays = m.summary.total - m.summary.holiday;
      return workingDays > 0 ? Math.round((m.summary.present / workingDays) * 100) : 0;
    });

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.reverse(),
        datasets: [{
          label: 'Attendance %',
          data: attendance.reverse(),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#3B82F6',
          pointBorderWidth: 2,
          pointBorderColor: '#18181B'
        }]
      },
      options: {
        ...this.defaults,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#71717A', font: { family: 'Inter', size: 11 } }
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: '#27272A' },
            ticks: {
              color: '#71717A',
              font: { family: 'Inter', size: 11 },
              callback: v => v + '%'
            }
          }
        }
      }
    });
  },

  /* ── Department Distribution Doughnut ── */
  renderDepartmentChart(canvasId, employees) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const deptCount = {};
    employees.forEach(e => {
      deptCount[e.department] = (deptCount[e.department] || 0) + 1;
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(deptCount),
        datasets: [{
          data: Object.values(deptCount),
          backgroundColor: colors.slice(0, Object.keys(deptCount).length),
          borderWidth: 2,
          borderColor: '#18181B',
          hoverOffset: 6
        }]
      },
      options: {
        ...this.defaults,
        cutout: '65%',
        plugins: {
          ...this.defaults.plugins,
          legend: {
            ...this.defaults.plugins.legend,
            position: 'right'
          }
        }
      }
    });
  },

  /* ── Leave Usage Pie Chart ── */
  renderLeaveChart(canvasId, balance) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Paid Leave', 'Unpaid Leave', 'Sick Leave', 'Remaining'],
        datasets: [{
          data: [
            balance.paid.taken,
            balance.unpaid.taken,
            balance.sick.taken,
            (balance.paid.allocated - balance.paid.taken) + (balance.unpaid.allocated - balance.unpaid.taken) + (balance.sick.allocated - balance.sick.taken)
          ],
          backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444', '#27272A'],
          borderWidth: 2,
          borderColor: '#18181B',
          hoverOffset: 6
        }]
      },
      options: {
        ...this.defaults,
        plugins: {
          ...this.defaults.plugins,
          legend: {
            ...this.defaults.plugins.legend,
            position: 'bottom'
          }
        }
      }
    });
  },

  /* ── HR Attendance Overview ── */
  renderHRAttendanceOverview(canvasId) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const presentData = [85, 88, 82, 90, 87, 92, 89, 86];
    const absentData = [8, 6, 10, 5, 7, 4, 6, 8];

    this.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Avg. Present',
            data: presentData,
            backgroundColor: '#10B981',
            borderRadius: 4,
            barPercentage: 0.6
          },
          {
            label: 'Avg. Absent',
            data: absentData,
            backgroundColor: '#EF4444',
            borderRadius: 4,
            barPercentage: 0.6
          }
        ]
      },
      options: {
        ...this.defaults,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#71717A', font: { family: 'Inter', size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#27272A' },
            ticks: {
              color: '#71717A',
              font: { family: 'Inter', size: 11 },
              callback: v => v + '%'
            }
          }
        }
      }
    });
  }
};
