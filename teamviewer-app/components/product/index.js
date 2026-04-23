export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="product-detail-card card mb-3 mx-auto" style="max-width: 800px; margin-top: 20px;">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${data.src}" class="img-fluid w-100" alt="${data.title}" style="min-height: 400px;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body p-4">
                                <span class="badge mb-3">Решение TeamViewer</span>
                                <h5 class="card-title mt-3" style="font-size: 2rem;">${data.title}</h5>
                                <p class="card-text mt-4" style="font-size: 1.1rem;">${data.text}</p>
                                <hr class="my-4">
                                <h6 class="fw-bold">Ключевые особенности:</h6>
                                <ul class="feature-list">
                                    <li>Сквозное шифрование</li>
                                    <li>Кроссплатформенная совместимость</li>
                                    <li>Техническая поддержка 24/7</li>
                                    <li>Простое развертывание</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
    }

    render(data) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
    }
}
