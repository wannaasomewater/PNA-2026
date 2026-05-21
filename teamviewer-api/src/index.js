const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const sessionsRouter = require('./routes/sessions');
const sessionsService = require('./services/sessionsService');
const swaggerSpec = require('./swagger/swagger');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/sessions.json');

sessionsService.init(DATA_FILE_PATH);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/sessions', sessionsRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
    if (!req.path.startsWith('/sessions') && !req.path.startsWith('/api-docs')) {
        return;
    }
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
    console.log(`Swagger документация: http://localhost:${PORT}/api-docs`);
    console.log(`Фронтенд доступен по адресу http://localhost:${PORT}`);
});
