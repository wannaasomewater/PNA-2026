import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { ajax } from "../../modules/ajax.js";
import { sessionsUrls } from "../../modules/sessionsUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.sessions = [];
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page">
                <div class="header-section rounded-3">
                    <h1>Активные сеансы удалённого доступа</h1>
                    <p>Мониторинг подключений в реальном времени</p>
                </div>
                <div id="debug-info" class="alert alert-info mx-4" style="display: none;"></div>
                <div class="d-flex flex-wrap justify-content-center gap-4" id="cards-container"></div>
            </div>
        `;
    }

    showDebugMessage(message, isError = false) {
        const debugDiv = document.getElementById('debug-info');
        if (debugDiv) {
            debugDiv.style.display = 'block';
            debugDiv.className = isError ? 'alert alert-danger mx-4' : 'alert alert-info mx-4';
            debugDiv.innerHTML = message;
        }
    }

    getData() {
        this.showDebugMessage('Загрузка данных с сервера...');

        const url = sessionsUrls.getSessions();
        this.showDebugMessage(`Запрос к: ${url}`);

        ajax.get(url, (data, status) => {
            this.showDebugMessage(`Статус ответа: ${status}`);

            if (status === 200 && data) {
                this.showDebugMessage(`Получено сеансов: ${data.length}`);
                this.sessions = data;
                this.renderCards();
            } else {
                const errorMsg = `Ошибка: статус ${status}<br>Данные: ${JSON.stringify(data)}`;
                this.showDebugMessage(errorMsg, true);
                console.error('Ошибка загрузки:', status, data);
            }
        });
    }

    renderCards() {
        const cardsContainer = document.getElementById('cards-container');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';

        if (this.sessions.length === 0) {
            cardsContainer.innerHTML = '<div class="alert alert-warning">Нет активных сеансов</div>';
            return;
        }

        this.sessions.forEach((session) => {
            const cardData = {
                id: session.id,
                src: this.getImageForStatus(session.status),
                title: session.deviceName,
                text: `Пользователь: ${session.user} | Время: ${session.sessionTime} | IP: ${session.ipAddress}`
            };

            const productCard = new ProductCardComponent(cardsContainer);
            productCard.render(cardData, this.clickCard.bind(this));
        });
    }

    getImageForStatus(status) {
        switch(status) {
            case 'connected':
                return 'https://img.freepik.com/free-vector/remote-access-concept-illustration_114360-1213.jpg';
            case 'waiting':
                return 'https://img.freepik.com/free-vector/customer-support-concept-illustration_114360-6886.jpg';
            default:
                return 'https://img.freepik.com/free-vector/teamwork-concept-illustration_114360-678.jpg';
        }
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.getData();
    }
}
