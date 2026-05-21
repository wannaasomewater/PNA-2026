(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();class a{constructor(t){this.parent=t}getHTML(t){return`
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="${t.src}" alt="${t.title}">
                    <div class="card-body">
                        <h5 class="card-title">${t.title}</h5>
                        <p class="card-text">${t.text}</p>
                        <button class="btn btn-primary w-100" id="click-card-${t.id}" data-id="${t.id}">
                            Подробнее
                        </button>
                    </div>
                </div>
            `}addListeners(t,e){document.getElementById(`click-card-${t.id}`).addEventListener("click",e)}render(t,e){const r=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",r),this.addListeners(t,e)}}class d{constructor(t){this.parent=t}getHTML(t){return`
                <div class="product-detail-card card mb-3 mx-auto" style="max-width: 800px; margin-top: 20px;">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${t.src}" class="img-fluid w-100" alt="${t.title}" style="min-height: 400px;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body p-4">
                                <span class="badge mb-3">Решение TeamViewer</span>
                                <h5 class="card-title mt-3" style="font-size: 2rem;">${t.title}</h5>
                                <p class="card-text mt-4" style="font-size: 1.1rem;">${t.text}</p>
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
            `}render(t){const e=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",e)}}class l{constructor(t){this.parent=t}addListeners(t){document.getElementById("back-button").addEventListener("click",t)}getHTML(){return`
                <div class="mb-4">
                    <button id="back-button" class="btn btn-outline-primary" type="button">
                        ← Назад к решениям
                    </button>
                </div>
            `}render(t){const e=this.getHTML();this.parent.insertAdjacentHTML("beforeend",e),this.addListeners(t)}}class u{constructor(t,e){this.parent=t,this.id=e,this.session=null}get pageRoot(){return document.getElementById("product-page")}getHTML(){return'<div id="product-page"></div>'}async getData(){try{const t=await fetch(`/sessions/${this.id}`);if(!t.ok)throw t.status===404?new Error("Сеанс не найден"):new Error(`HTTP ошибка: ${t.status}`);this.session=await t.json(),this.renderProduct()}catch(t){console.error("Ошибка загрузки:",t);const e=this.pageRoot;e&&(e.innerHTML+=`<div class="alert alert-danger">${t.message}</div>`)}}renderProduct(){if(!this.session)return;const t={id:this.session.id,src:this.getImageForStatus(this.session.status),title:this.session.deviceName,text:`
                <strong>Пользователь:</strong> ${this.session.user}<br>
                <strong>IP-адрес:</strong> ${this.session.ipAddress}<br>
                <strong>Время сеанса:</strong> ${this.session.sessionTime}<br>
                <strong>Статус:</strong> ${this.formatStatus(this.session.status)}
            `};new d(this.pageRoot).render(t)}getImageForStatus(t){switch(t){case"connected":return"https://img.freepik.com/free-vector/remote-access-concept-illustration_114360-1213.jpg";case"waiting":return"https://img.freepik.com/free-vector/customer-support-concept-illustration_114360-6886.jpg";default:return"https://img.freepik.com/free-vector/teamwork-concept-illustration_114360-678.jpg"}}formatStatus(t){return{connected:"Подключён",waiting:"Ожидание",disconnected:"Отключён"}[t]||t}clickBack(){new c(this.parent).render()}render(){this.parent.innerHTML="";const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),new l(this.pageRoot).render(this.clickBack.bind(this)),this.getData()}}class c{constructor(t){this.parent=t,this.sessions=[]}get pageRoot(){return document.getElementById("main-page")}getHTML(){return`
            <div id="main-page">
                <div class="header-section rounded-3">
                    <h1>Активные сеансы удалённого доступа</h1>
                    <p>Мониторинг подключений в реальном времени</p>
                </div>
                <div id="debug-info" class="alert alert-info mx-4" style="display: none;"></div>
                <div class="d-flex flex-wrap justify-content-center gap-4" id="cards-container"></div>
            </div>
        `}showDebugMessage(t,e=!1){const r=document.getElementById("debug-info");r&&(r.style.display="block",r.className=e?"alert alert-danger mx-4":"alert alert-info mx-4",r.innerHTML=t)}async getData(){this.showDebugMessage("Загрузка данных с сервера (fetch)...");try{const t="/sessions";this.showDebugMessage(`Запрос к: ${t}`);const e=await fetch(t);if(this.showDebugMessage(`Статус ответа: ${e.status}`),!e.ok)throw new Error(`HTTP ошибка: ${e.status}`);const r=await e.json();this.showDebugMessage(`Получено ${r.length} сеансов`),this.sessions=r,this.renderCards()}catch(t){const e=`Ошибка: ${t.message}`;this.showDebugMessage(e,!0),console.error("Ошибка загрузки:",t)}}renderCards(){const t=document.getElementById("cards-container");if(t){if(t.innerHTML="",this.sessions.length===0){t.innerHTML='<div class="alert alert-warning">Нет активных сеансов</div>';return}this.sessions.forEach(e=>{const r={id:e.id,src:this.getImageForStatus(e.status),title:e.deviceName,text:`Пользователь: ${e.user} | Время: ${e.sessionTime} | IP: ${e.ipAddress}`};new a(t).render(r,this.clickCard.bind(this))})}}getImageForStatus(t){switch(t){case"connected":return"https://img.freepik.com/free-vector/remote-access-concept-illustration_114360-1213.jpg";case"waiting":return"https://img.freepik.com/free-vector/customer-support-concept-illustration_114360-6886.jpg";default:return"https://img.freepik.com/free-vector/teamwork-concept-illustration_114360-678.jpg"}}clickCard(t){const e=t.target.dataset.id;new u(this.parent,e).render()}render(){this.parent.innerHTML="";const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),this.getData()}}const g=document.getElementById("root"),h=new c(g);h.render();
