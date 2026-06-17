const API_BASE = 'http://localhost:8833/api';

let currentFloor = 1;
let roomsData = [];
let schedulesData = [];
let currentScheduleId = null;
let selectedSeatAdminRoom = null;
let currentSelectedDate = null;

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayDate() {
  return formatDate(new Date());
}

function displayCurrentDate() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  document.getElementById('currentDate').textContent = now.toLocaleDateString('zh-CN', options);
}

async function apiGet(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    return await res.json();
  } catch (err) {
    console.error('API请求失败:', err);
    return { success: false, message: '网络错误' };
  }
}

async function apiPost(endpoint, data) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error('API请求失败:', err);
    return { success: false, message: '网络错误' };
  }
}

async function apiPut(endpoint, data) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error('API请求失败:', err);
    return { success: false, message: '网络错误' };
  }
}

async function apiDelete(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    console.error('API请求失败:', err);
    return { success: false, message: '网络错误' };
  }
}

async function loadRooms() {
  const result = await apiGet('/rooms');
  if (result.success) {
    roomsData = result.data;
    return roomsData;
  }
  return [];
}

async function loadSchedules(date, roomId) {
  let endpoint = '/schedules';
  const params = [];
  if (date) params.push(`date=${date}`);
  if (roomId) params.push(`roomId=${roomId}`);
  if (params.length > 0) endpoint += '?' + params.join('&');
  
  const result = await apiGet(endpoint);
  if (result.success) {
    schedulesData = result.data;
    return schedulesData;
  }
  return [];
}

function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const tabId = tab.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      document.getElementById(`tab-${tabId}`).classList.add('active');
      
      if (tabId === 'statistics') {
        loadStatistics();
      } else if (tabId === 'admin') {
        loadAdminData();
      }
    });
  });
}

function initFloorButtons() {
  const buttons = document.querySelectorAll('.floor-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFloor = parseInt(btn.dataset.floor);
      renderFloorPlan();
    });
  });
}

function getRoomSchedulesToday(roomId) {
  const today = getTodayDate();
  return schedulesData.filter(s => s.roomId === roomId && s.date === today);
}

function getRoomRegisteredToday(roomId) {
  const todaySchedules = getRoomSchedulesToday(roomId);
  return todaySchedules.reduce((sum, s) => sum + s.registered, 0);
}

function renderFloorPlan() {
  const floorRooms = roomsData.filter(r => r.floor === currentFloor);
  const container = document.getElementById('floorPlan');
  
  if (floorRooms.length === 0) {
    container.innerHTML = '<p class="placeholder-tip">该楼层暂无会场</p>';
    return;
  }
  
  let html = '<div class="room-cards-grid">';
  
  floorRooms.forEach(room => {
    const registeredToday = getRoomRegisteredToday(room.id);
    const percentage = ((registeredToday / room.capacity) * 100).toFixed(1);
    const todaySchedules = getRoomSchedulesToday(room.id);
    
    let progressClass = 'low';
    if (percentage > 80) progressClass = 'high';
    else if (percentage > 50) progressClass = 'medium';
    
    const typeMap = { large: '大型报告厅', medium: '中型报告厅', small: '小型研讨室' };
    
    html += `
      <div class="room-card" onclick="showRoomDetail('${room.id}')">
        <div class="room-card-header">
          <h3>${room.name}</h3>
          <span class="room-type-tag ${room.type}">${typeMap[room.type]}</span>
        </div>
        <div class="room-info-row">
          <span>容纳人数</span>
          <span>${room.capacity} 人</span>
        </div>
        <div class="room-info-row">
          <span>今日会议</span>
          <span>${todaySchedules.length} 场</span>
        </div>
        <div class="room-progress">
          <div class="progress-bar">
            <div class="progress-fill ${progressClass}" style="width: ${percentage}%"></div>
          </div>
          <div class="room-info-row" style="margin-top: 6px;">
            <span>今日报名</span>
            <span>${registeredToday} / ${room.capacity} (${percentage}%)</span>
          </div>
        </div>
        <p class="room-desc">${room.description}</p>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

async function showRoomDetail(roomId) {
  const room = roomsData.find(r => r.id === roomId);
  if (!room) return;
  
  const result = await apiGet(`/rooms/${roomId}/seats`);
  if (!result.success) {
    alert('获取座位信息失败');
    return;
  }
  
  const seatLayout = result.data;
  
  const modalHtml = `
    <div class="modal show room-detail-modal" id="roomDetailModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>🪑 ${room.name} - 座位布局</h3>
          <button class="modal-close" onclick="closeModal('roomDetailModal')">×</button>
        </div>
        <div class="modal-body">
          <div class="seat-detail-container">
            <div class="stage">主讲台</div>
            <div class="seat-grid">
              ${seatLayout.map(row => `
                <div class="seat-row">
                  <span class="row-label">${String.fromCharCode(65 + row[0].row)}</span>
                  ${row.map(seat => `
                    <div class="seat ${seat.status}" title="${seat.label}${seat.name ? ' - ' + seat.name : ''}" data-seat="${seat.id}">
                      ${seat.col + 1}
                    </div>
                  `).join('')}
                  <span class="row-label">${String.fromCharCode(65 + row[0].row)}</span>
                </div>
              `).join('')}
            </div>
            <div class="legend-items" style="display: flex; gap: 20px; margin-top: 16px;">
              <div class="legend-item"><span class="legend-color available"></span>可用</div>
              <div class="legend-item"><span class="legend-color occupied"></span>已占</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer.firstElementChild);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    if (modalId === 'roomDetailModal' || modalId === 'resultModal') {
    }
  }
}

function renderScheduleList(schedules) {
  const container = document.getElementById('scheduleList');
  
  if (schedules.length === 0) {
    container.innerHTML = '<p class="placeholder-tip">暂无会议排期</p>';
    return;
  }
  
  const statusMap = {
    open: { text: '报名中', class: 'open' },
    full: { text: '已满员', class: 'full' },
    closed: { text: '已关闭', class: 'closed' }
  };
  
  let html = '';
  schedules.forEach(sched => {
    const room = roomsData.find(r => r.id === sched.roomId);
    const status = statusMap[sched.status] || statusMap.open;
    const percentage = room ? ((sched.registered / room.capacity) * 100).toFixed(1) : 0;
    
    html += `
      <div class="schedule-item">
        <div class="schedule-item-header">
          <h3 class="schedule-title">${sched.title}${sched.isTemporary ? '<span class="temp-badge">临时场次</span>' : ''}</h3>
          <span class="schedule-status ${status.class}">${status.text}</span>
        </div>
        <div class="schedule-meta">
          <span>📅 ${sched.date}</span>
          <span>⏰ ${sched.startTime} - ${sched.endTime}</span>
          <span>🏢 ${room ? room.name : '未知会场'}</span>
        </div>
        <p class="schedule-speaker">👤 ${sched.speaker} · ${sched.speakerAffiliation || '未知单位'}</p>
        <p class="schedule-speaker" style="color: #1890ff;">📌 主题：${sched.topic || '暂无'}</p>
        <p class="schedule-desc">${sched.description || '暂无描述'}</p>
        <div class="schedule-footer">
          <div class="seats-info">
            <div class="seats-count">剩余席位: <strong>${room ? (room.capacity - sched.registered) : 0}</strong> / ${room ? room.capacity : 0} 座</div>
            <div class="mini-progress">
              <div class="mini-progress-fill" style="width: ${percentage}%"></div>
            </div>
          </div>
          <button class="btn-primary" onclick="openRegisterModal('${sched.id}')" ${sched.status === 'full' ? 'disabled' : ''}>
            ${sched.status === 'full' ? '已满员' : '立即报名'}
          </button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function initScheduleFilters() {
  const dateFilter = document.getElementById('dateFilter');
  const roomFilter = document.getElementById('roomFilter');
  
  const today = getTodayDate();
  dateFilter.value = today;
  currentSelectedDate = today;
  
  roomsData.forEach(room => {
    const option = document.createElement('option');
    option.value = room.id;
    option.textContent = room.name;
    roomFilter.appendChild(option);
  });
  
  const refreshSchedules = async () => {
    const date = dateFilter.value;
    const roomId = roomFilter.value;
    currentSelectedDate = date;
    const schedules = await loadSchedules(date, roomId);
    renderScheduleList(schedules);
  };
  
  dateFilter.addEventListener('change', refreshSchedules);
  roomFilter.addEventListener('change', refreshSchedules);
  
  refreshSchedules();
}

async function openRegisterModal(scheduleId) {
  currentScheduleId = scheduleId;
  const result = await apiGet(`/schedules/${scheduleId}`);
  
  if (!result.success) {
    alert('获取会议信息失败');
    return;
  }
  
  const sched = result.data;
  const room = roomsData.find(r => r.id === sched.roomId);
  
  const infoHtml = `
    <h4>${sched.title}</h4>
    <p>📅 ${sched.date} ${sched.startTime} - ${sched.endTime}</p>
    <p>🏢 ${room ? room.name : '未知会场'}</p>
    <p>👤 ${sched.speaker} · ${sched.speakerAffiliation || ''}</p>
    <p>💺 剩余席位: ${room ? (room.capacity - sched.registered) : 0} / ${room ? room.capacity : 0}</p>
  `;
  
  document.getElementById('meetingInfo').innerHTML = infoHtml;
  document.getElementById('registerForm').reset();
  document.getElementById('registerModal').classList.add('show');
}

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const result = await apiPost(`/schedules/${currentScheduleId}/register`, data);
    
    document.getElementById('registerModal').classList.remove('show');
    showResultModal(result.success, result);
    refreshAllData();
  });
}

function showResultModal(success, data) {
  const modal = document.getElementById('resultModal');
  const titleEl = document.getElementById('resultTitle');
  const contentEl = document.getElementById('resultContent');
  
  if (success) {
    titleEl.textContent = '🎉 报名成功';
    const reg = data.data;
    contentEl.innerHTML = `
      <div class="result-success">
        <div class="result-icon">✅</div>
        <h4>报名成功！</h4>
        <div class="ticket-info">
          <p><strong>姓名：</strong>${reg.name}</p>
          <p><strong>邮箱：</strong>${reg.email}</p>
          <p><strong>研究方向：</strong>${reg.researchDirection}</p>
          <p><strong>座位号：</strong>${reg.seatNo}</p>
          <p><strong>报名时间：</strong>${new Date(reg.registeredAt).toLocaleString('zh-CN')}</p>
        </div>
        <p style="margin-top: 16px; font-size: 13px;">请准时参加会议，祝您学术交流愉快！</p>
      </div>
    `;
  } else {
    titleEl.textContent = '❌ 报名失败';
    contentEl.innerHTML = `
      <div class="result-fail">
        <div class="result-icon">😔</div>
        <h4>报名失败</h4>
        <p>${data.message || '未知错误'}</p>
      </div>
    `;
  }
  
  modal.classList.add('show');
}

async function loadStatistics() {
  const result = await apiGet('/statistics');
  if (!result.success) return;
  
  const stats = result.data;
  
  document.getElementById('statTotalSched').textContent = stats.totalSchedules;
  document.getElementById('statTotalReg').textContent = stats.totalRegistrations;
  document.getElementById('statTotalCap').textContent = stats.totalCapacity;
  
  const rate = stats.totalCapacity > 0 ? ((stats.totalRegistrations / stats.totalCapacity) * 100).toFixed(1) : 0;
  document.getElementById('statRate').textContent = rate + '%';
  
  renderRankingList(stats.scheduleStats);
  renderRoomStats(stats.roomStats);
}

function renderRankingList(scheduleStats) {
  const container = document.getElementById('rankingList');
  
  if (scheduleStats.length === 0) {
    container.innerHTML = '<p class="placeholder-tip">暂无数据</p>';
    return;
  }
  
  let html = '';
  scheduleStats.slice(0, 10).forEach((item, index) => {
    const rankClass = index === 0 ? 'top1' : index === 1 ? 'top2' : index === 2 ? 'top3' : 'other';
    
    html += `
      <div class="ranking-item">
        <div class="ranking-num ${rankClass}">${index + 1}</div>
        <div class="ranking-info">
          <div class="ranking-title">${item.title}</div>
          <div class="ranking-sub">${item.roomName} · ${item.date} ${item.time}</div>
        </div>
        <div class="ranking-bar-container">
          <div class="ranking-bar">
            <div class="ranking-bar-fill" style="width: ${item.percentage}%"></div>
          </div>
          <div class="ranking-percent">${item.registered}/${item.capacity} (${item.percentage}%)</div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function renderRoomStats(roomStats) {
  const container = document.getElementById('roomStatsGrid');
  
  const typeMap = { large: '大型', medium: '中型', small: '小型' };
  
  let html = '';
  roomStats.forEach(room => {
    html += `
      <div class="room-stat-card">
        <h4>${room.name}</h4>
        <div class="room-stat-row">
          <span>类型</span>
          <span>${typeMap[room.type] || room.type}</span>
        </div>
        <div class="room-stat-row">
          <span>容量</span>
          <span>${room.capacity} 人</span>
        </div>
        <div class="room-stat-row">
          <span>会议场次</span>
          <span>${room.scheduleCount} 场</span>
        </div>
        <div class="room-stat-row">
          <span>累计报名</span>
          <span>${room.totalRegistered} 人</span>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

async function loadAdminData() {
  const adminRoomSelect = document.getElementById('adminRoomSelect');
  const seatAdminRoom = document.getElementById('seatAdminRoom');
  
  if (adminRoomSelect.options.length <= 1) {
    roomsData.forEach(room => {
      const opt1 = document.createElement('option');
      opt1.value = room.id;
      opt1.textContent = room.name;
      adminRoomSelect.appendChild(opt1);
      
      const opt2 = document.createElement('option');
      opt2.value = room.id;
      opt2.textContent = room.name;
      seatAdminRoom.appendChild(opt2);
    });
  }
  
  const schedules = await loadSchedules();
  renderAdminScheduleList(schedules);
  
  seatAdminRoom.addEventListener('change', async (e) => {
    const roomId = e.target.value;
    selectedSeatAdminRoom = roomId;
    if (roomId) {
      await renderAdminSeatLayout(roomId);
    } else {
      document.getElementById('seatAdminLayout').innerHTML = '<p class="placeholder-tip">请先选择会场查看座位布局</p>';
    }
  });
}

async function renderAdminSeatLayout(roomId) {
  const result = await apiGet(`/rooms/${roomId}/seats`);
  if (!result.success) return;
  
  const seatLayout = result.data;
  const room = roomsData.find(r => r.id === roomId);
  
  const container = document.getElementById('seatAdminLayout');
  
  let html = '<div class="seat-layout-container">';
  html += `<div class="stage">主讲台 - ${room.name}</div>`;
  html += '<div class="seat-grid">';
  
  seatLayout.forEach(row => {
    html += `<div class="seat-row">`;
    html += `<span class="row-label">${String.fromCharCode(65 + row[0].row)}</span>`;
    
    row.forEach(seat => {
      const title = seat.name ? `${seat.label} - ${seat.name}` : seat.label;
      html += `
        <div class="seat ${seat.status}" 
             title="${title}" 
             data-seat-id="${seat.id}"
             onclick="toggleAdminSeat('${seat.id}')">
          ${seat.col + 1}
        </div>
      `;
    });
    
    html += `<span class="row-label">${String.fromCharCode(65 + row[0].row)}</span>`;
    html += '</div>';
  });
  
  html += '</div>';
  html += '<div class="legend-items" style="display: flex; gap: 20px; margin-top: 16px;">';
  html += '<div class="legend-item"><span class="legend-color available"></span>可用</div>';
  html += '<div class="legend-item"><span class="legend-color occupied"></span>已占用</div>';
  html += '<span style="font-size: 12px; color: #999;">点击座位可切换状态</span>';
  html += '</div></div>';
  
  container.innerHTML = html;
}

async function toggleAdminSeat(seatId) {
  if (!selectedSeatAdminRoom) return;
  
  const seatEl = document.querySelector(`[data-seat-id="${seatId}"]`);
  if (!seatEl) return;
  
  const isOccupied = seatEl.classList.contains('occupied');
  const newStatus = isOccupied ? 'available' : 'occupied';
  
  const result = await apiPut(`/rooms/${selectedSeatAdminRoom}/seats/${seatId}`, {
    status: newStatus
  });
  
  if (result.success) {
    seatEl.classList.remove('available', 'occupied');
    seatEl.classList.add(newStatus);
    if (newStatus === 'available') {
      seatEl.title = result.data.label;
    }
  }
}

function renderAdminScheduleList(schedules) {
  const container = document.getElementById('adminScheduleList');
  
  if (schedules.length === 0) {
    container.innerHTML = '<p class="placeholder-tip">暂无会议</p>';
    return;
  }
  
  let html = '';
  schedules.forEach(sched => {
    const room = roomsData.find(r => r.id === sched.roomId);
    
    html += `
      <div class="admin-schedule-item">
        <div class="admin-sched-info">
          <div class="admin-sched-title">
            ${sched.title}
            ${sched.isTemporary ? '<span class="temp-badge">临时场次</span>' : ''}
          </div>
          <div class="admin-sched-meta">
            📅 ${sched.date} ${sched.startTime}-${sched.endTime} · 
            🏢 ${room ? room.name : '未知'} · 
            👥 已报名 ${sched.registered} 人 · 
            状态: ${sched.status === 'open' ? '报名中' : sched.status === 'full' ? '已满' : '关闭'}
          </div>
        </div>
        <div class="admin-sched-actions">
          <button class="btn-secondary" onclick="toggleScheduleStatus('${sched.id}')">
            ${sched.status === 'open' ? '关闭报名' : '开启报名'}
          </button>
          <button class="btn-danger" onclick="deleteSchedule('${sched.id}')">删除</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

async function toggleScheduleStatus(scheduleId) {
  const sched = schedulesData.find(s => s.id === scheduleId);
  if (!sched) return;
  
  const newStatus = sched.status === 'open' ? 'closed' : 'open';
  const result = await apiPut(`/schedules/${scheduleId}`, { status: newStatus });
  
  if (result.success) {
    const schedules = await loadSchedules();
    renderAdminScheduleList(schedules);
  } else {
    alert('操作失败: ' + result.message);
  }
}

async function deleteSchedule(scheduleId) {
  if (!confirm('确定要删除这个会议吗？')) return;
  
  const result = await apiDelete(`/schedules/${scheduleId}`);
  if (result.success) {
    const schedules = await loadSchedules();
    renderAdminScheduleList(schedules);
    alert('删除成功');
  } else {
    alert('删除失败: ' + result.message);
  }
}

function initAddScheduleForm() {
  const form = document.getElementById('addScheduleForm');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const result = await apiPost('/schedules', data);
    
    if (result.success) {
      alert('临时场次添加成功！');
      form.reset();
      const schedules = await loadSchedules();
      renderAdminScheduleList(schedules);
      refreshAllData();
    } else {
      alert('添加失败: ' + result.message);
    }
  });
}

async function updateQuickInfo() {
  const today = getTodayDate();
  const todaySchedules = schedulesData.filter(s => s.date === today);
  const todayMeetings = todaySchedules.length;
  const totalRegistrations = schedulesData.reduce((sum, s) => sum + s.registered, 0);
  const totalRooms = roomsData.length;
  const totalSeats = roomsData.reduce((sum, r) => sum + r.capacity, 0);
  
  document.getElementById('todayMeetings').textContent = todayMeetings;
  document.getElementById('totalRegistrations').textContent = totalRegistrations;
  document.getElementById('totalRooms').textContent = totalRooms;
  document.getElementById('totalSeats').textContent = totalSeats;
}

async function refreshAllData() {
  await loadRooms();
  await loadSchedules();
  renderFloorPlan();
  updateQuickInfo();
  
  const dateFilter = document.getElementById('dateFilter');
  const roomFilter = document.getElementById('roomFilter');
  if (dateFilter && roomFilter) {
    const schedules = await loadSchedules(dateFilter.value, roomFilter.value);
    renderScheduleList(schedules);
  }
}

async function init() {
  displayCurrentDate();
  
  await loadRooms();
  await loadSchedules();
  
  initTabs();
  initFloorButtons();
  renderFloorPlan();
  updateQuickInfo();
  
  initScheduleFilters();
  initRegisterForm();
  initAddScheduleForm();
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal') && e.target.id !== 'registerModal' && e.target.id !== 'resultModal') {
    e.target.classList.remove('show');
  }
});

document.getElementById('registerModal')?.addEventListener?.('click', (e) => {
  if (e.target.id === 'registerModal') {
    e.target.classList.remove('show');
  }
});

document.getElementById('resultModal')?.addEventListener?.('click', (e) => {
  if (e.target.id === 'resultModal') {
    e.target.classList.remove('show');
  }
});
