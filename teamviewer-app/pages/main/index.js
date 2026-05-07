import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `
                <div id="main-page">
                    <div class="header-section rounded-3">
                        <h1>Решения для удаленного подключения</h1>
                        <p>Безопасный удаленный доступ, поддержка и совместная работа для всех</p>
                    </div>
                    <div class="d-flex flex-wrap justify-content-center gap-4" id="cards-container"></div>
                </div>
            `
        )
    }

    getData() {
        return [
            {
                id: 1,
                src: "https://img.freepik.com/free-vector/remote-access-concept-illustration_114360-1213.jpg",
                title: "Удаленный доступ",
                text: "Подключайтесь к любому устройству безопасно из любой точки мира"
            },
            {
                id: 2,
                src: "https://img.freepik.com/free-vector/call-center-concept-illustration_114360-8710.jpg",
                title: "Удаленная поддержка",
                text: "Предоставляйте мгновенную ИТ-поддержку клиентам и сотрудникам"
            },
            {
                id: 3,
                src: "https://img.freepik.com/free-vector/teamwork-concept-illustration_114360-678.jpg",
                title: "Совместная работа",
                text: "Работайте вместе в реальном времени с интегрированными инструментами"
            },
            {
                id: 4,
                src: "https://img.freepik.com/free-vector/iot-internet-things-concept-illustration_114360-5416.jpg",
                title: "Управление IoT",
                text: "Отслеживайте и управляйте устройствами IoT в вашей сети"
            },
            {
                id: 5,
                src: "https://img.freepik.com/free-vector/enterprise-resource-planning-concept-illustration_114360-8660.jpg",
                title: "Корпоративные решения",
                text: "Масштабируемые решения для развертывания на уровне предприятия"
            },
            {
                id: 6,
                src: "https://img.freepik.com/free-vector/augmented-reality-concept-illustration_114360-7600.jpg",
                title: "Дополненная реальность",
                text: "Удаленная помощь с AR-технологиями для полевых сотрудников"
            }
        ]
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;

        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const data = this.getData()
        const cardsContainer = document.getElementById('cards-container')

        data.forEach((item) => {
            const productCard = new ProductCardComponent(cardsContainer)
            productCard.render(item, this.clickCard.bind(this))
        })
    }
}
