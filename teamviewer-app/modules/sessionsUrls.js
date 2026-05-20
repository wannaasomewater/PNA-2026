export class SessionsUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getSessions() {
        return `${this.baseUrl}/sessions`;
    }

    getSessionById(id) {
        return `${this.baseUrl}/sessions/${id}`;
    }
}

export const sessionsUrls = new SessionsUrls();
