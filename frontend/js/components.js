/* ============================================================
   HRFlow — Reusable UI Components
   Pure render functions that return HTML strings.
   ============================================================ */

const Components = {

  /* ── Stat Card ── */
  StatCard({ icon, value, label, color = 'primary' }) {
    return `
      <div class="stat-card">
        <div class="stat-icon ${color}"><i class="bi bi-${icon}"></i></div>
        <div>
          <div class="stat-value">${value}</div>
          <div class="stat-label">${label}</div>
        </div>
      </div>`;
  },

  /* ── Status Badge ── */
  StatusBadge(status) {
    const map = {
      'Completed': 'success', 'Approved': 'success', 'Active': 'success', 'Present': 'success',
      'Pending': 'warning', 'In Progress': 'warning', 'Late': 'warning',
      'Rejected': 'danger', 'Overdue': 'danger', 'Absent': 'danger', 'Redo Requested': 'danger',
      'Read': 'neutral', 'Unread': 'info', 'On Leave': 'info',
    };
    const variant = map[status] || 'neutral';
    return `<span class="badge badge-${variant}"><span class="badge-dot ${variant}"></span> ${status}</span>`;
  },

  /* ── Priority Badge ── */
  PriorityBadge(priority) {
    const map = { 'High': 'danger', 'Medium': 'warning', 'Low': 'success' };
    return `<span class="badge badge-${map[priority] || 'neutral'}">${priority}</span>`;
  },

  /* ── Back Button ── */
  BackButton(targetView, label = 'Back') {
    return `<button class="back-btn" onclick="App.navigate('${targetView}')"><i class="bi bi-arrow-left"></i> ${label}</button>`;
  },

  /* ── Empty State ── */
  EmptyState({ icon = 'inbox', title = 'No data found', message = '' }) {
    return `
      <div class="empty-state">
        <i class="bi bi-${icon}"></i>
        <h3>${title}</h3>
        ${message ? `<p>${message}</p>` : ''}
      </div>`;
  },

  /* ── Skeleton Loader ── */
  SkeletonLoader(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div style="padding: 1rem;">
          <div class="skeleton skeleton-heading"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>`;
    }
    return html;
  },

  /* ── Data Table ── */
  DataTable({ id, columns, rows, searchPlaceholder = 'Search...', filters = [], onRowClick = null }) {
    const filterHtml = filters.map(f => `
      <select class="table-filter-select" id="${id}-filter-${f.key}" onchange="Components.filterTable('${id}')">
        <option value="">${f.label}</option>
        ${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>`).join('');

    const headerHtml = columns.map(c => `<th>${c.label}</th>`).join('');

    const bodyHtml = rows.map((row, idx) => {
      const clickAttr = onRowClick ? `onclick="${onRowClick}('${row._id || idx}')" style="cursor:pointer;"` : '';
      const cells = columns.map(c => {
        if (c.render) return `<td>${c.render(row)}</td>`;
        return `<td class="${c.className || ''}">${row[c.key] || '—'}</td>`;
      }).join('');
      return `<tr ${clickAttr} data-search="${Object.values(row).join(' ').toLowerCase()}">${cells}</tr>`;
    }).join('');

    return `
      <div class="table-container" id="${id}">
        <div class="table-toolbar">
          <div class="table-search">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="${searchPlaceholder}" oninput="Components.searchTable('${id}', this.value)" />
          </div>
          <div class="table-filters">${filterHtml}</div>
        </div>
        <table class="data-table">
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${bodyHtml || `<tr><td colspan="${columns.length}">${Components.EmptyState({ icon: 'search', title: 'No records found' })}</td></tr>`}</tbody>
        </table>
      </div>`;
  },

  /* ── Table Search Helper ── */
  searchTable(tableId, query) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const q = query.toLowerCase();
    rows.forEach(row => {
      const text = row.getAttribute('data-search') || row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  },

  /* ── Table Filter Helper ── */
  filterTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const selects = table.querySelectorAll('.table-filter-select');
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      let visible = true;
      selects.forEach(sel => {
        if (sel.value) {
          const text = row.getAttribute('data-search') || row.textContent.toLowerCase();
          if (!text.includes(sel.value.toLowerCase())) visible = false;
        }
      });
      row.style.display = visible ? '' : 'none';
    });
  },

  /* ── Calendar View ── */
  CalendarView({ month, year, days, onMonthChange }) {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dayHeaders = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const firstDay = new Date(year, month, 1).getDay();

    let daysHtml = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      daysHtml += `<div class="calendar-day empty"></div>`;
    }

    const today = new Date();
    days.forEach(day => {
      const isToday = day.date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const classes = ['calendar-day'];
      if (day.status) classes.push(day.status);
      if (isToday) classes.push('today');
      if (!day.status) classes.push('empty');
      daysHtml += `<div class="${classes.join(' ')}" title="${day.status || ''}">${day.status !== undefined ? day.date : ''}</div>`;
    });

    return `
      <div class="card">
        <div class="card-body">
          <div class="calendar-header">
            <div class="calendar-nav">
              <button onclick="${onMonthChange}(-1)"><i class="bi bi-chevron-left"></i></button>
              <span class="calendar-month">${monthNames[month]} ${year}</span>
              <button onclick="${onMonthChange}(1)"><i class="bi bi-chevron-right"></i></button>
            </div>
          </div>
          <div class="calendar-grid">${daysHtml}</div>
          <div class="calendar-legend">
            <div class="calendar-legend-item"><div class="calendar-legend-dot" style="background:var(--success)"></div> Present</div>
            <div class="calendar-legend-item"><div class="calendar-legend-dot" style="background:var(--danger)"></div> Absent</div>
            <div class="calendar-legend-item"><div class="calendar-legend-dot" style="background:var(--info)"></div> Leave</div>
            <div class="calendar-legend-item"><div class="calendar-legend-dot" style="background:var(--warning)"></div> Holiday</div>
            <div class="calendar-legend-item"><div class="calendar-legend-dot" style="background:#EA580C"></div> Late</div>
          </div>
        </div>
      </div>`;
  },

  /* ── Leave Balance Card ── */
  LeaveCard({ title, icon, allocated, taken, color }) {
    const remaining = allocated - taken;
    const pct = allocated > 0 ? (taken / allocated) * 100 : 0;
    return `
      <div class="leave-card">
        <div class="leave-card-title" style="color:${color}"><i class="bi bi-${icon}"></i> ${title}</div>
        <div class="leave-stats">
          <div class="leave-stat"><div class="leave-stat-value" style="color:var(--slate-800)">${allocated}</div><div class="leave-stat-label">Allocated</div></div>
          <div class="leave-stat"><div class="leave-stat-value" style="color:${color}">${taken}</div><div class="leave-stat-label">Taken</div></div>
          <div class="leave-stat"><div class="leave-stat-value" style="color:var(--success)">${remaining}</div><div class="leave-stat-label">Remaining</div></div>
        </div>
        <div class="leave-progress"><div class="leave-progress-bar" style="width:${pct}%;background:${color}"></div></div>
      </div>`;
  },

  /* ── Mail Item ── */
  MailItem({ id, subject, from, date, priority, status, preview, onClick }) {
    return `
      <div class="mail-item ${status === 'Unread' ? 'unread' : ''}" onclick="${onClick}('${id}')">
        <div class="mail-icon" style="background:var(--primary-light);color:var(--primary)"><i class="bi bi-envelope${status === 'Unread' ? '-fill' : ''}"></i></div>
        <div class="mail-content">
          <div class="mail-subject">${subject}</div>
          <div class="mail-preview">${from} — ${preview || ''}</div>
        </div>
        <div class="mail-meta">
          <div class="mail-date">${Components.formatDate(date)}</div>
          ${Components.PriorityBadge(priority)}
        </div>
      </div>`;
  },

  /* ── Assignment Card ── */
  AssignmentCard({ id, title, dueDate, priority, status, sender, onClick }) {
    const isOverdue = new Date(dueDate) < new Date() && status !== 'Completed';
    const displayStatus = isOverdue && status !== 'Completed' ? 'Overdue' : status;
    return `
      <div class="card" style="cursor:pointer;margin-bottom:0.75rem;" onclick="${onClick}('${id}')">
        <div class="card-body" style="padding:1rem 1.25rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
            <h4 style="font-size:0.9375rem;font-weight:600;">${title}</h4>
            ${Components.StatusBadge(displayStatus)}
          </div>
          <div style="display:flex;align-items:center;gap:1rem;font-size:0.8125rem;color:var(--slate-500);">
            <span><i class="bi bi-person"></i> ${sender}</span>
            <span><i class="bi bi-calendar"></i> Due: ${Components.formatDate(dueDate)}</span>
            <span>${Components.PriorityBadge(priority)}</span>
          </div>
        </div>
      </div>`;
  },

  /* ── Modal ── */
  Modal({ id, title, body, footer = '', wide = false }) {
    return `
      <div class="modal-overlay" id="${id}">
        <div class="modal-content ${wide ? 'wide' : ''}">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" onclick="App.closeModal('${id}')"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body">${body}</div>
          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        </div>
      </div>`;
  },

  /* ── Form Input ── */
  FormInput({ id, label, type = 'text', value = '', placeholder = '', required = false, icon = '' }) {
    if (icon) {
      return `
        <div class="form-group">
          <label class="form-label" for="${id}">${label}${required ? ' *' : ''}</label>
          <div class="form-input-wrapper">
            <i class="form-input-icon bi bi-${icon}"></i>
            <input class="form-input" type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''} />
          </div>
          <div class="form-error-text">This field is required</div>
        </div>`;
    }
    return `
      <div class="form-group">
        <label class="form-label" for="${id}">${label}${required ? ' *' : ''}</label>
        <input class="form-input-no-icon" type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''} />
        <div class="form-error-text">This field is required</div>
      </div>`;
  },

  /* ── Form Select ── */
  FormSelect({ id, label, options, value = '', required = false }) {
    const optionsHtml = options.map(o => {
      const val = typeof o === 'string' ? o : o.value;
      const text = typeof o === 'string' ? o : o.label;
      return `<option value="${val}" ${val === value ? 'selected' : ''}>${text}</option>`;
    }).join('');
    return `
      <div class="form-group">
        <label class="form-label" for="${id}">${label}${required ? ' *' : ''}</label>
        <select class="form-select" id="${id}" ${required ? 'required' : ''}>
          <option value="">Select ${label.toLowerCase()}</option>
          ${optionsHtml}
        </select>
        <div class="form-error-text">Please select an option</div>
      </div>`;
  },

  /* ── Form Textarea ── */
  FormTextarea({ id, label, value = '', placeholder = '', required = false, rows = 3 }) {
    return `
      <div class="form-group">
        <label class="form-label" for="${id}">${label}${required ? ' *' : ''}</label>
        <textarea class="form-textarea" id="${id}" placeholder="${placeholder}" rows="${rows}" ${required ? 'required' : ''}>${value}</textarea>
        <div class="form-error-text">This field is required</div>
      </div>`;
  },

  /* ── Date Formatting Helper ── */
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  formatDateShort(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
};
