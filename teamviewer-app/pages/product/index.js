import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData() {
        const productsData = {
            1: {
                id: 1,
                src: "https://img.freepik.com/free-vector/remote-access-concept-illustration_114360-1213.jpg",
                title: "Удаленный доступ",
                text: "Подключайтесь к любому устройству безопасно из любой точки мира. TeamViewer обеспечивает бесшовное подключение со сквозным шифрованием."
            },
            2: {
                id: 2,
                src: "https://img.freepik.com/free-vector/customer-support-concept-illustration_114360-6886.jpg",
                title: "Удаленная поддержка",
                text: "Предоставляйте мгновенную ИТ-поддержку клиентам и сотрудникам. Решайте проблемы быстрее с помощью наших инструментов удаленной поддержки."
            },
            3: {
                id: 3,
                src: "https://img.freepik.com/free-vector/teamwork-concept-illustration_114360-678.jpg",
                title: "Совместная работа",
                text: "Работайте вместе в реальном времени с интегрированными инструментами. Делитесь экранами, передавайте файлы и общайтесь без усилий."
            },
            4: {
                id: 4,
                src: "https://img.freepik.com/free-vector/iot-internet-things-concept-illustration_114360-5416.jpg",
                title: "Управление IoT",
                text: "Отслеживайте и управляйте устройствами IoT в вашей сети. Обеспечьте безопасность и работоспособность подключенных устройств 24/7."
            },
            5: {
                id: 5,
                src: "https://img.freepik.com/free-vector/enterprise-resource-planning-concept-illustration_114360-8660.jpg",
                title: "Корпоративные решения",
                text: "Масштабируемые решения для развертывания на уровне предприятия. Централизованное управление и расширенные функции безопасности."
            },
            6: {
                id: 6,
                src: "https://img.freepik.com/free-vector/augmented-reality-concept-illustration_114360-7600.jpg",
                title: "Дополненная реальность",
                text: "Удаленная помощь с AR-технологиями для полевых сотрудников. Трансформируйте подход к решению сложных технических задач."
            }
        };

        return productsData[this.id] || productsData[1];
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
        return (
            `
                <div id="product-page"></div>
            `
        )
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        const data = this.getData()
        const product = new ProductComponent(this.pageRoot)
        product.render(data)
    }
}
