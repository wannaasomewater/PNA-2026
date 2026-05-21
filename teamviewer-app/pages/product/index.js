import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.session = null;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `<div id="product-page"></div>`;
    }

    async getData() {
        try {
            const response = await fetch(`/sessions/${this.id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Сеанс не найден');
                }
                throw new Error(`HTTP ошибка: ${response.status}`);
            }

            this.session = await response.json();
            this.renderProduct();

        } catch (error) {
            console.error('Ошибка загрузки:', error);
            const container = this.pageRoot;
            if (container) {
                container.innerHTML += `<div class="alert alert-danger">${error.message}</div>`;
            }
        }
    }

    renderProduct() {
        if (!this.session) return;

        const productData = {
            id: this.session.id,
            src: this.getImageForStatus(this.session.status),
            title: this.session.deviceName,
            text: `
                <strong>Пользователь:</strong> ${this.session.user}<br>
                <strong>IP-адрес:</strong> ${this.session.ipAddress}<br>
                <strong>Время сеанса:</strong> ${this.session.sessionTime}<br>
                <strong>Статус:</strong> ${this.formatStatus(this.session.status)}
            `
        };

        const product = new ProductComponent(this.pageRoot);
        product.render(productData);
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

    formatStatus(status) {
        const statusMap = {
            'connected': 'Подключён',
            'waiting': 'Ожидание',
            'disconnected': 'Отключён'
        };
        return statusMap[status] || status;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        this.getData();
    }
}
