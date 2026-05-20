const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (deviceName) => {
    const sessions = fileService.readData(dataFilePath);
    if (deviceName) {
        return sessions.filter(session =>
            session.deviceName.toLowerCase().includes(deviceName.toLowerCase())
        );
    }
    return sessions;
};

const findOne = (id) => {
    const sessions = fileService.readData(dataFilePath);
    return sessions.find(session => session.id === id);
};

const create = (sessionData) => {
    const sessions = fileService.readData(dataFilePath);
    const newId = sessions.length > 0
        ? Math.max(...sessions.map(s => s.id)) + 1
        : 1;

    const newSession = { id: newId, ...sessionData };
    sessions.push(newSession);
    fileService.writeData(dataFilePath, sessions);

    return newSession;
};

const update = (id, sessionData) => {
    const sessions = fileService.readData(dataFilePath);
    const index = sessions.findIndex(s => s.id === id);

    if (index === -1) return null;

    sessions[index] = { ...sessions[index], ...sessionData };
    fileService.writeData(dataFilePath, sessions);

    return sessions[index];
};

const remove = (id) => {
    const sessions = fileService.readData(dataFilePath);
    const filteredSessions = sessions.filter(s => s.id !== id);

    if (filteredSessions.length === sessions.length) {
        return false;
    }

    fileService.writeData(dataFilePath, filteredSessions);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
