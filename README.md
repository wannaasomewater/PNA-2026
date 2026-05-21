# Лабораторная работа №6

## Оглавление

1. [Цель лабораторной работы](#1-цель-лабораторной-работы)
2. [Часть 1. Замена XMLHttpRequest на fetch](#2-часть-1-замена-xmlhttprequest-на-fetch)
3. [Часть 2. Сборка клиентской части через Vite](#3-часть-2-сборка-клиентской-части-через-vite)
4. [Часть 3. Раздача статики с бэкенда](#4-часть-3-раздача-статики-с-бэкенда)
5. [Скриншоты работающего приложения](#5-скриншоты-работающего-приложения)
6. [Итоговая структура проекта](#6-итоговая-структура-проекта)
7. [Вывод](#7-вывод)


## 1. Цель лабораторной работы

Лабораторная работа состоит из двух частей:

**Часть 1.** Замена механизма взаимодействия с API: в прошлой лабораторной работе использовался XMLHttpRequest, в этой - современный метод fetch с использованием промисов и async/await.

**Часть 2.** Сборка клиентской части приложения с помощью системы сборки Vite и раздача фронтенда в качестве статики с бэкенда для устранения проблем с CORS.


## 2. Часть 1. Замена XMLHttpRequest на fetch

В 5 лабораторной работе использовался XMLHttpRequest через самописный модуль ajax.js.

**Файл modules/ajax.js (удален):**

```javascript
export class Ajax {
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
                callback(data, xhr.status);
            }
        };
    }
}

export const ajax = new Ajax();
```

**Файл modules/sessionsUrls.js (удален):**

```javascript
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
```

**Использование в pages/main/index.js (5 лаба):**

```javascript
import { ajax } from "../../modules/ajax.js";
import { sessionsUrls } from "../../modules/sessionsUrls.js";

getData() {
    ajax.get(sessionsUrls.getSessions(), (data, status) => {
        if (status === 200 && data) {
            this.sessions = data;
            this.renderCards();
        }
    });
}
```

В 6 лабораторной работе используется встроенная функция fetch с async/await, а файлы ajax.js и sessionsUrls.js удалены.

**Файл pages/main/index.js (6 лаба):**

```javascript
async getData() {
    this.showDebugMessage('Загрузка данных с сервера (fetch)...');

    try {
        const url = '/sessions';
        this.showDebugMessage(`Запрос к: ${url}`);

        const response = await fetch(url);
        this.showDebugMessage(`Статус ответа: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }

        const data = await response.json();
        this.showDebugMessage(`Получено сеансов: ${data.length}`);
        this.sessions = data;
        this.renderCards();

    } catch (error) {
        const errorMsg = `Ошибка: ${error.message}`;
        this.showDebugMessage(errorMsg, true);
        console.error('Ошибка загрузки:', error);
    }
}
```

**Файл pages/product/index.js (6 лаба):**

```javascript
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
```

**Ключевые отличия fetch от XMLHttpRequest:**

| Характеристика | XMLHttpRequest (5 лаба) | fetch (6 лаба) |
|----------------|--------------------------|----------------|
| Необходимость отдельного файла | Да (ajax.js) | Нет (встроен в браузер) |
| Необходимость хранения URL | Да (sessionsUrls.js) | Нет (относительные пути) |
| Обработка ответа | Коллбеки (callback) | Промисы / async await |
| Парсинг JSON | Вручную JSON.parse() | Автоматически response.json() |
| Обработка ошибок | Проверка status в коллбеке | try/catch |

---

## 3. Часть 2. Сборка клиентской части через Vite

**Установка Vite:**

```bash
cd teamviewer-app
npm install -D vite
```

**Файл vite.config.js:**

```javascript
export default {
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
};
```

**Файл package.json (измененная часть):**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

**Команды для работы:**

| Команда | Назначение |
|---------|------------|
| npm run dev | Запуск dev сервера для разработки (порт 5173) |
| npm run build | Сборка проекта в папку public |
| npm run preview | Предпросмотр собранного проекта |

---

## 4. Часть 3. Раздача статики с бэкенда

**Файл teamviewer-api/src/index.js (добавленный код):**

```javascript
const path = require('path');

// Раздача статики из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Все остальные GET запросы отдаём index.html (для SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

**Процесс сборки и раздачи:**

```bash
# 1. Собрать фронтенд
cd teamviewer-app
npm run build

# 2. Скопировать папку public в бэкенд
cp -r public/* ../teamviewer-api/src/public/

# 3. Запустить бэкенд
cd ../teamviewer-api
npm run dev
```

**Результат:** Фронтенд доступен по адресу http://localhost:3000 (на том же порту, что и API). CORS больше не требуется.


## 5. Итоговая структура проекта

```
PNA-2026/
├── teamviewer-api/
│   ├── src/
│   │   ├── data/
│   │   │   └── sessions.json
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── assets/
│   │   ├── routes/
│   │   │   └── sessions.js
│   │   ├── controllers/
│   │   │   └── sessionsController.js
│   │   ├── services/
│   │   │   ├── fileService.js
│   │   │   └── sessionsService.js
│   │   └── index.js
│   └── package.json
│
└── teamviewer-app/
    ├── components/
    │   ├── product-card/
    │   │   └── index.js
    │   ├── product/
    │   │   └── index.js
    │   └── back-button/
    │       └── index.js
    ├── pages/
    │   ├── main/
    │   │   └── index.js
    │   └── product/
    │       └── index.js
    ├── index.html
    ├── main.js
    ├── vite.config.js
    ├── package.json
    └── package-lock.json
```

## 6. Вывод

В ходе выполнения лабораторной работы №6:

1. Заменили устаревший XMLHttpRequest на современный fetch с использованием промисов и async/await.

2. Удалены вспомогательные файлы ajax.js и sessionsUrls.js, так как fetch является встроенной функцией браузера и не требует оберток.

3. Настроена сборка клиентской части с помощью Vite.

4. Настроена раздача собранного фронтенда в качестве статики с бэкенда, что позволило избавиться от проблем с CORS.

5. Фронтенд и бэкенд теперь работают на одном порту (3000), что является правильной практикой для production окружения.
