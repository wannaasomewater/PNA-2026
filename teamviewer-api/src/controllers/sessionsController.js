const sessionsService = require('../services/sessionsService');

const getAllSessions = (req, res) => {
    const { deviceName } = req.query;
    const sessions = sessionsService.findAll(deviceName);
    res.json(sessions);
};

const getSessionById = (req, res) => {
    const id = parseInt(req.params.id);
    const session = sessionsService.findOne(id);

    if (!session) {
        return res.status(404).json({ error: 'Сеанс удалённого доступа не найден' });
    }

    res.json(session);
};

const createSession = (req, res) => {
    const { deviceName, user, status, sessionTime, ipAddress } = req.body;

    if (!deviceName || !user || !status || !sessionTime || !ipAddress) {
        return res.status(400).json({ error: 'Все поля обязательны: deviceName, user, status, sessionTime, ipAddress' });
    }

    const newSession = sessionsService.create({ deviceName, user, status, sessionTime, ipAddress });
    res.status(201).json(newSession);
};

const updateSession = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedSession = sessionsService.update(id, req.body);

    if (!updatedSession) {
        return res.status(404).json({ error: 'Сеанс не найден' });
    }

    res.json(updatedSession);
};

const deleteSession = (req, res) => {
    const id = parseInt(req.params.id);
    const success = sessionsService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Сеанс не найден' });
    }

    res.status(204).send();
};

module.exports = {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession
};
