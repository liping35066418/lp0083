const express = require('express');
const path = require('path');

const app = express();
const PORT = 3833;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`学术会议管理系统前端界面已启动: http://localhost:${PORT}`);
});
