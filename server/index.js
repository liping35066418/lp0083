const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
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
} = require('./data');

const app = express();
const PORT = 8833;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '会议管理系统服务正常运行' });
});

app.get('/api/rooms', (req, res) => {
  try {
    const rooms = getRooms();
    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/rooms/:id', (req, res) => {
  try {
    const room = getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: '会议室不存在' });
    }
    res.json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/rooms/:id/seats', (req, res) => {
  try {
    const layout = getSeatLayout(req.params.id);
    if (!layout) {
      return res.status(404).json({ success: false, message: '会议室不存在' });
    }
    res.json({ success: true, data: layout });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/rooms/:roomId/seats/:seatId', (req, res) => {
  try {
    const { status, registrationId, name } = req.body;
    const seat = updateSeatStatus(req.params.roomId, req.params.seatId, status, registrationId, name);
    if (!seat) {
      return res.status(404).json({ success: false, message: '座位不存在' });
    }
    res.json({ success: true, data: seat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/schedules', (req, res) => {
  try {
    const { date, roomId } = req.query;
    const schedules = getSchedules(date, roomId);
    res.json({ success: true, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/schedules/:id', (req, res) => {
  try {
    const schedule = getScheduleById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: '会议不存在' });
    }
    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/schedules', (req, res) => {
  try {
    const newSchedule = addSchedule(req.body);
    res.json({ success: true, data: newSchedule });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/api/schedules/:id', (req, res) => {
  try {
    const updated = updateSchedule(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: '会议不存在' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/schedules/:id', (req, res) => {
  try {
    const deleted = deleteSchedule(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: '会议不存在' });
    }
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/schedules/:id/register', (req, res) => {
  try {
    const registration = registerForSchedule(req.params.id, req.body);
    res.json({ success: true, data: registration });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/schedules/:id/registrations', (req, res) => {
  try {
    const registrations = getRegistrations(req.params.id);
    res.json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/registrations', (req, res) => {
  try {
    const registrations = getRegistrations();
    res.json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/statistics', (req, res) => {
  try {
    const stats = getStatistics();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`学术会议管理系统后端服务已启动: http://localhost:${PORT}`);
});
