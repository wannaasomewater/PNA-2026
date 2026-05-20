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

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Swagger UI (вариант 16)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/sessions', sessionsRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
    console.log(`Swagger документация: http://localhost:${PORT}/api-docs`);
});
