let rooms = [
  {
    id: 'room-1',
    name: '大报告厅',
    type: 'large',
    capacity: 300,
    rows: 15,
    cols: 20,
    floor: 1,
    description: '可容纳300人的大型报告厅，配备专业音响和投影设备'
  },
  {
    id: 'room-2',
    name: '小报告厅',
    type: 'medium',
    capacity: 100,
    rows: 10,
    cols: 10,
    floor: 1,
    description: '可容纳100人的中型报告厅，适合分会场报告'
  },
  {
    id: 'room-3',
    name: '研讨室A',
    type: 'small',
    capacity: 30,
    rows: 5,
    cols: 6,
    floor: 2,
    description: '小型研讨室，适合小组讨论和工作坊'
  },
  {
    id: 'room-4',
    name: '研讨室B',
    type: 'small',
    capacity: 30,
    rows: 5,
    cols: 6,
    floor: 2,
    description: '小型研讨室，适合小组讨论和工作坊'
  },
  {
    id: 'room-5',
    name: '研讨室C',
    type: 'small',
    capacity: 20,
    rows: 4,
    cols: 5,
    floor: 2,
    description: '小型研讨室，适合专题研讨'
  }
];

let schedules = [
  {
    id: 'sched-1',
    roomId: 'room-1',
    title: '人工智能前沿学术峰会',
    speaker: '张明教授',
    speakerAffiliation: '清华大学',
    date: '2026-06-17',
    startTime: '09:00',
    endTime: '11:00',
    topic: 'AI大模型发展趋势',
    description: '探讨大语言模型的最新进展与未来发展方向',
    registered: 245,
    status: 'open',
    isTemporary: false
  },
  {
    id: 'sched-2',
    roomId: 'room-1',
    title: '量子计算研讨会',
    speaker: '李华研究员',
    speakerAffiliation: '中科院',
    date: '2026-06-17',
    startTime: '14:00',
    endTime: '17:00',
    topic: '量子计算与密码学',
    description: '量子计算对现代密码学的影响及应对策略',
    registered: 180,
    status: 'open',
    isTemporary: false
  },
  {
    id: 'sched-3',
    roomId: 'room-2',
    title: '生物信息学论坛',
    speaker: '王芳教授',
    speakerAffiliation: '北京大学',
    date: '2026-06-17',
    startTime: '09:30',
    endTime: '11:30',
    topic: '基因组学与精准医疗',
    description: '基因组数据在精准医疗中的应用',
    registered: 85,
    status: 'open',
    isTemporary: false
  },
  {
    id: 'sched-4',
    roomId: 'room-2',
    title: '新能源技术峰会',
    speaker: '陈刚教授',
    speakerAffiliation: '浙江大学',
    date: '2026-06-18',
    startTime: '14:00',
    endTime: '16:00',
    topic: '储能技术新进展',
    description: '下一代储能技术的突破与挑战',
    registered: 67,
    status: 'open',
    isTemporary: false
  },
  {
    id: 'sched-5',
    roomId: 'room-3',
    title: '机器学习工作坊',
    speaker: '刘博士',
    speakerAffiliation: '微软亚洲研究院',
    date: '2026-06-17',
    startTime: '10:00',
    endTime: '12:00',
    topic: '深度学习实战',
    description: '动手实践深度学习模型训练与调优',
    registered: 28,
    status: 'open',
    isTemporary: false
  },
  {
    id: 'sched-6',
    roomId: 'room-3',
    title: '数据科学圆桌讨论',
    speaker: '多位专家',
    speakerAffiliation: '各高校',
    date: '2026-06-19',
    startTime: '09:00',
    endTime: '11:00',
    topic: '数据科学人才培养',
    description: '探讨数据科学领域的人才培养模式',
    registered: 15,
    status: 'open',
    isTemporary: false
  },
  {
    id: 'sched-7',
    roomId: 'room-4',
    title: '区块链技术沙龙',
    speaker: '赵工程师',
    speakerAffiliation: '蚂蚁集团',
    date: '2026-06-19',
    startTime: '14:00',
    endTime: '16:00',
    topic: '联盟链应用实践',
    description: '联盟链在企业级应用中的实践经验分享',
    registered: 22,
    status: 'open',
    isTemporary: false
  },
  {
    id: 'sched-8',
    roomId: 'room-5',
    title: '云计算专题研讨',
    speaker: '孙架构师',
    speakerAffiliation: '阿里云',
    date: '2026-06-19',
    startTime: '10:00',
    endTime: '11:30',
    topic: '云原生架构设计',
    description: '云原生架构的最佳实践与设计模式',
    registered: 20,
    status: 'full',
    isTemporary: false
  }
];

let registrations = [
  {
    id: 'reg-1',
    scheduleId: 'sched-1',
    name: '王小明',
    email: 'wangxm@example.com',
    affiliation: '复旦大学',
    researchDirection: '自然语言处理',
    seatNo: 'A-01',
    registeredAt: '2026-06-10 10:30:00'
  },
  {
    id: 'reg-2',
    scheduleId: 'sched-1',
    name: '李小红',
    email: 'lixh@example.com',
    affiliation: '上海交大',
    researchDirection: '计算机视觉',
    seatNo: 'A-02',
    registeredAt: '2026-06-10 11:00:00'
  }
];

let seatLayouts = {};

function initSeatLayouts() {
  rooms.forEach(room => {
    const layout = [];
    for (let r = 0; r < room.rows; r++) {
      const row = [];
      for (let c = 0; c < room.cols; c++) {
        const rowLabel = String.fromCharCode(65 + r);
        const colLabel = (c + 1).toString().padStart(2, '0');
        row.push({
          id: `${rowLabel}-${colLabel}`,
          row: r,
          col: c,
          label: `${rowLabel}${colLabel}`,
          status: 'available'
        });
      }
      layout.push(row);
    }
    seatLayouts[room.id] = layout;
  });
}

initSeatLayouts();

function getRooms() {
  return rooms;
}

function getRoomById(id) {
  return rooms.find(r => r.id === id);
}

function getSchedules(date, roomId) {
  let result = [...schedules];
  if (date) {
    result = result.filter(s => s.date === date);
  }
  if (roomId) {
    result = result.filter(s => s.roomId === roomId);
  }
  return result.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}

function getScheduleById(id) {
  return schedules.find(s => s.id === id);
}

function addSchedule(scheduleData) {
  const room = getRoomById(scheduleData.roomId);
  if (!room) {
    throw new Error('会议室不存在');
  }
  
  const newSchedule = {
    id: 'sched-' + Date.now(),
    ...scheduleData,
    registered: 0,
    status: 'open',
    isTemporary: true
  };
  
  const conflict = schedules.some(s => 
    s.roomId === newSchedule.roomId && 
    s.date === newSchedule.date &&
    s.id !== newSchedule.id &&
    ((newSchedule.startTime >= s.startTime && newSchedule.startTime < s.endTime) ||
     (newSchedule.endTime > s.startTime && newSchedule.endTime <= s.endTime) ||
     (newSchedule.startTime <= s.startTime && newSchedule.endTime >= s.endTime))
  );
  
  if (conflict) {
    throw new Error('该时段会议室已被占用');
  }
  
  schedules.push(newSchedule);
  return newSchedule;
}

function updateSchedule(id, updates) {
  const idx = schedules.findIndex(s => s.id === id);
  if (idx === -1) return null;
  schedules[idx] = { ...schedules[idx], ...updates };
  return schedules[idx];
}

function deleteSchedule(id) {
  const idx = schedules.findIndex(s => s.id === id);
  if (idx === -1) return false;
  schedules.splice(idx, 1);
  return true;
}

function registerForSchedule(scheduleId, registrationData) {
  const schedule = getScheduleById(scheduleId);
  if (!schedule) {
    throw new Error('会议不存在');
  }
  
  const room = getRoomById(schedule.roomId);
  
  if (schedule.status === 'full') {
    throw new Error('该会议报名人数已满');
  }
  
  const seatLayout = seatLayouts[schedule.roomId];
  let assignedSeat = null;
  
  for (let r = 0; r < seatLayout.length && !assignedSeat; r++) {
    for (let c = 0; c < seatLayout[r].length && !assignedSeat; c++) {
      if (seatLayout[r][c].status === 'available') {
        assignedSeat = seatLayout[r][c];
      }
    }
  }
  
  if (!assignedSeat) {
    schedule.status = 'full';
    throw new Error('该会议座位已满');
  }
  
  const registration = {
    id: 'reg-' + Date.now(),
    scheduleId,
    ...registrationData,
    seatNo: assignedSeat.label,
    registeredAt: new Date().toISOString()
  };
  
  registrations.push(registration);
  schedule.registered += 1;
  
  assignedSeat.status = 'occupied';
  assignedSeat.registrationId = registration.id;
  assignedSeat.name = registration.name;
  
  if (schedule.registered >= room.capacity) {
    schedule.status = 'full';
  }
  
  return registration;
}

function getRegistrations(scheduleId) {
  if (scheduleId) {
    return registrations.filter(r => r.scheduleId === scheduleId);
  }
  return registrations;
}

function getSeatLayout(roomId) {
  return seatLayouts[roomId] || null;
}

function updateSeatStatus(roomId, seatId, status, registrationId, name) {
  const layout = seatLayouts[roomId];
  if (!layout) return null;
  
  for (let r = 0; r < layout.length; r++) {
    for (let c = 0; c < layout[r].length; c++) {
      if (layout[r][c].id === seatId) {
        layout[r][c].status = status;
        if (registrationId) layout[r][c].registrationId = registrationId;
        if (name) layout[r][c].name = name;
        if (status === 'available') {
          delete layout[r][c].registrationId;
          delete layout[r][c].name;
        }
        return layout[r][c];
      }
    }
  }
  return null;
}

function getStatistics() {
  const totalSchedules = schedules.length;
  const totalRegistrations = schedules.reduce((sum, s) => sum + s.registered, 0);
  
  const scheduleStats = schedules.map(s => {
    const room = getRoomById(s.roomId);
    const percentage = room ? ((s.registered / room.capacity) * 100).toFixed(1) : 0;
    return {
      id: s.id,
      title: s.title,
      roomName: room ? room.name : '未知',
      date: s.date,
      time: `${s.startTime}-${s.endTime}`,
      registered: s.registered,
      capacity: room ? room.capacity : 0,
      percentage: parseFloat(percentage),
      status: s.status
    };
  }).sort((a, b) => b.percentage - a.percentage);
  
  const totalCapacity = scheduleStats.reduce((sum, s) => sum + s.capacity, 0);
  
  const roomStats = rooms.map(room => {
    const roomSchedules = schedules.filter(s => s.roomId === room.id);
    const totalRegistered = roomSchedules.reduce((sum, s) => sum + s.registered, 0);
    return {
      id: room.id,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      scheduleCount: roomSchedules.length,
      totalRegistered
    };
  });
  
  return {
    totalSchedules,
    totalRegistrations,
    totalCapacity,
    scheduleStats,
    roomStats
  };
}

module.exports = {
  getRooms,
  getRoomById,
  getSchedules,
  getScheduleById,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  registerForSchedule,
  getRegistrations,
  getSeatLayout,
  updateSeatStatus,
  getStatistics
};
