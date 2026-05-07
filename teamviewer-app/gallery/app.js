import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { openDB, saveModel, getAllModels, deleteModel } from './idb.js';

const gallery = document.getElementById('gallery');
const fileInput = document.getElementById('file-input');
const uploadSubmit = document.getElementById('upload-submit');
const fileNameSpan = document.getElementById('file-name');
let selectedFile = null;

const connectionSolutions = [
    {
        connection_id: 1,
        connection_name: "Удаленный доступ",
        connection_description: "Безопасное подключение к устройствам",
        connection_type: "remote_access",
        base_color: 0x0E71EB,
        geometry_type: "laptop_and_monitor"  // ноутбук подключается к удалённому ПК
    },
    {
        connection_id: 2,
        connection_name: "Удаленная поддержка",
        connection_description: "ИТ-поддержка клиентов и сотрудников",
        connection_type: "remote_support",
        base_color: 0x0652B3,
        geometry_type: "headset_and_screen"  // гарнитура оператора + экран
    },
    {
        connection_id: 3,
        connection_name: "Совместная работа",
        connection_description: "Командное взаимодействие онлайн",
        connection_type: "collaboration",
        base_color: 0x0088CC,
        geometry_type: "connected_people"  // несколько фигур вокруг стола
    },
    {
        connection_id: 4,
        connection_name: "Управление IoT",
        connection_description: "Контроль устройств интернета вещей",
        connection_type: "iot",
        base_color: 0x006699,
        geometry_type: "iot_devices"  // микросхема + датчики вокруг
    }
];

const pairedSolutions = [
    {
        pair_id: 5,
        pair_name: "Сервер + Терминал",
        pair_description: "Полная инфраструктура подключения",
        pair_type: "combined",
        first_color: 0x0E71EB,
        second_color: 0x444444,
        pair_geometries: ["server_rack", "thin_client"]
    }
];

function findActiveConnections(connectionsArray) {
    let activeConnections = [];
    let i = 0;
    do {
        if (connectionsArray[i] && connectionsArray[i].connection_type !== 'combined') {
            activeConnections.push(connectionsArray[i]);
        }
        i++;
    } while (i < connectionsArray.length);
    return activeConnections;
}

function generateConnectionCode(connectionName) {
    const prefix = 'TV-';
    const namePart = connectionName.replace(/\s+/g, '').toUpperCase().slice(0, 4);
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return prefix + namePart + '-' + randomPart;
}

const remoteSession = {
    session_id: null,
    session_name: '',
    is_active: false,
    start_time: null,
    connection_code: ''
};

function initSession(connectionName) {
    remoteSession.session_id = Date.now();
    remoteSession.session_name = connectionName;
    remoteSession.is_active = true;
    remoteSession.start_time = new Date().toISOString();
    remoteSession.connection_code = generateConnectionCode(connectionName);
    return remoteSession;
}

const connectionHistory = [];

function addToHistory(session) {
    connectionHistory.push({...session});
    if (connectionHistory.length > 10) {
        connectionHistory.shift();
    }
    return connectionHistory;
}


function createLaptop(color, x, y, z) {
    const group = new THREE.Group();

    const baseGeom = new THREE.BoxGeometry(1.2, 0.06, 0.8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.8 });
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.set(0, 0, 0);
    group.add(base);

    const screenGeom = new THREE.BoxGeometry(1.2, 0.7, 0.04);
    const screenMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.2, metalness: 0.3, emissive: color, emissiveIntensity: 0.4 });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 0.35, -0.38);
    screen.rotation.x = -0.3;
    group.add(screen);

    const frameGeom = new THREE.BoxGeometry(1.28, 0.78, 0.02);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.3, metalness: 0.9 });
    const frame = new THREE.Mesh(frameGeom, frameMat);
    frame.position.set(0, 0.35, -0.4);
    frame.rotation.x = -0.3;
    group.add(frame);

    group.position.set(x, y, z);
    return group;
}

function createMonitor(color, x, y, z) {
    const group = new THREE.Group();

    const standGeom = new THREE.CylinderGeometry(0.15, 0.2, 0.5, 8);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.8 });
    const stand = new THREE.Mesh(standGeom, standMat);
    stand.position.set(0, 0.25, 0);
    group.add(stand);

    const baseGeom = new THREE.CylinderGeometry(0.25, 0.3, 0.1, 16);
    const base = new THREE.Mesh(baseGeom, standMat);
    base.position.set(0, 0.05, 0);
    group.add(base);

    const screenGeom = new THREE.BoxGeometry(1.0, 0.6, 0.05);
    const screenMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.2, metalness: 0.3, emissive: color, emissiveIntensity: 0.5 });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 0.7, 0);
    group.add(screen);

    const frameGeom = new THREE.BoxGeometry(1.1, 0.7, 0.03);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.9 });
    const frame = new THREE.Mesh(frameGeom, frameMat);
    frame.position.set(0, 0.7, 0);
    group.add(frame);

    group.position.set(x, y, z);
    return group;
}

function createHeadset(color, x, y, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.5 });

    const bandGeom = new THREE.TorusGeometry(0.3, 0.04, 8, 16, Math.PI);
    const band = new THREE.Mesh(bandGeom, mat);
    band.position.set(0, 0.2, 0);
    group.add(band);

    const leftCupGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const leftCup = new THREE.Mesh(leftCupGeom, mat);
    leftCup.position.set(-0.28, 0.1, 0);
    group.add(leftCup);

    const rightCup = new THREE.Mesh(leftCupGeom, mat);
    rightCup.position.set(0.28, 0.1, 0);
    group.add(rightCup);

    const micGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
    const mic = new THREE.Mesh(micGeom, new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.7 }));
    mic.position.set(0.25, 0.0, 0.1);
    mic.rotation.z = 0.5;
    group.add(mic);

    group.position.set(x, y, z);
    return group;
}

function createPerson(color, x, y, z, scale = 1) {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc99, roughness: 0.8, metalness: 0.1 });
    const clothMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.6, metalness: 0.2 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.3 });

    const bodyGeom = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 8);
    const body = new THREE.Mesh(bodyGeom, clothMat);
    body.position.set(0, 0.4, 0);
    group.add(body);

    const headGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const head = new THREE.Mesh(headGeom, skinMat);
    head.position.set(0, 0.85, 0);
    group.add(head);

    const armGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
    const leftArm = new THREE.Mesh(armGeom, clothMat);
    leftArm.position.set(-0.25, 0.5, 0);
    leftArm.rotation.z = 0.3;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, clothMat);
    rightArm.position.set(0.25, 0.5, 0);
    rightArm.rotation.z = -0.3;
    group.add(rightArm);

    group.scale.setScalar(scale);
    group.position.set(x, y, z);
    return group;
}

function createServerRack(color, x, y, z) {
    const group = new THREE.Group();
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.9 });
    const serverMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.5, emissive: color, emissiveIntensity: 0.2 });

    const rackGeom = new THREE.BoxGeometry(0.6, 1.5, 0.8);
    const rack = new THREE.Mesh(rackGeom, rackMat);
    rack.position.set(0, 0.75, 0);
    group.add(rack);

    for (let i = 0; i < 3; i++) {
        const serverGeom = new THREE.BoxGeometry(0.5, 0.3, 0.7);
        const server = new THREE.Mesh(serverGeom, serverMat);
        server.position.set(0, 0.3 + i * 0.4, 0.35);
        group.add(server);

        const ledGeom = new THREE.SphereGeometry(0.02, 8, 8);
        const ledMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.2, emissive: 0x00ff00, emissiveIntensity: 1 });
        const led = new THREE.Mesh(ledGeom, ledMat);
        led.position.set(0.2, 0.3 + i * 0.4, 0.7);
        group.add(led);
    }

    group.position.set(x, y, z);
    return group;
}

function createThinClient(color, x, y, z) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.8 });
    const screenMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.2, metalness: 0.3, emissive: color, emissiveIntensity: 0.3 });

    const standGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 8);
    const stand = new THREE.Mesh(standGeom, bodyMat);
    stand.position.set(0, 0.15, 0);
    group.add(stand);

    const bodyGeom = new THREE.BoxGeometry(0.5, 0.35, 0.08);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(0, 0.45, 0);
    group.add(body);

    const screenGeom = new THREE.BoxGeometry(0.4, 0.25, 0.02);
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 0.45, 0.05);
    group.add(screen);

    group.position.set(x, y, z);
    return group;
}

function createIoTDevice(color, x, y, z, type = 'sensor') {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.5 });

    if (type === 'sensor') {
        const bodyGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8);
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.set(0, 0.15, 0);
        group.add(body);

        const antennaGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
        const antenna = new THREE.Mesh(antennaGeom, new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.9 }));
        antenna.position.set(0, 0.4, 0);
        group.add(antenna);
    } else {
        const chipGeom = new THREE.BoxGeometry(0.3, 0.08, 0.3);
        const chip = new THREE.Mesh(chipGeom, bodyMat);
        chip.position.set(0, 0.04, 0);
        group.add(chip);

        const pinMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2, metalness: 0.9 });
        for (let i = -1; i <= 1; i += 0.5) {
            const pinGeom = new THREE.BoxGeometry(0.03, 0.08, 0.03);
            const pin = new THREE.Mesh(pinGeom, pinMat);
            pin.position.set(i, -0.08, 0.16);
            group.add(pin);

            const pin2 = new THREE.Mesh(pinGeom, pinMat);
            pin2.position.set(i, -0.08, -0.16);
            group.add(pin2);
        }
    }

    group.position.set(x, y, z);
    return group;
}


function createLaptopAndMonitorScene(color) {
    const group = new THREE.Group();

    const laptop = createLaptop(color, -0.8, 0, 0);
    group.add(laptop);

    const monitor = createMonitor(color, 0.8, 0, 0);
    group.add(monitor);

    const lineGeom = new THREE.CylinderGeometry(0.02, 0.02, 1.6, 8);
    const lineMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.2, emissive: color, emissiveIntensity: 0.5 });
    const line = new THREE.Mesh(lineGeom, lineMat);
    line.rotation.z = Math.PI / 2;
    line.position.set(0, 0.5, 0);
    group.add(line);

    const dotGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const dot1 = new THREE.Mesh(dotGeom, lineMat);
    dot1.position.set(-0.8, 0.5, 0);
    group.add(dot1);

    const dot2 = new THREE.Mesh(dotGeom, lineMat);
    dot2.position.set(0.8, 0.5, 0);
    group.add(dot2);

    return group;
}

function createHeadsetAndScreenScene(color) {
    const group = new THREE.Group();

    const screen = createMonitor(color, -0.6, 0, 0);
    screen.scale.set(0.8, 0.8, 0.8);
    group.add(screen);

    const headset = createHeadset(color, 0.5, 0.5, 0);
    group.add(headset);

    const operator = createPerson(0x2255aa, 0.5, 0, 0, 0.8);
    group.add(operator);

    return group;
}

function createConnectedPeopleScene(color) {
    const group = new THREE.Group();

    const tableGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 24);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.5, metalness: 0.3 });
    const table = new THREE.Mesh(tableGeom, tableMat);
    table.position.set(0, 0.3, 0);
    group.add(table);

    const colors = [0x2255aa, 0xaa2255, 0x22aa55, 0xaa5522];
    const angles = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

    colors.forEach((col, i) => {
        const person = createPerson(col, Math.cos(angles[i]) * 0.9, 0, Math.sin(angles[i]) * 0.9, 0.8);
        person.rotation.y = -angles[i] + Math.PI;
        group.add(person);
    });

    const lineMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.2, emissive: color, emissiveIntensity: 0.4, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 4; i++) {
        const nextI = (i + 1) % 4;
        const midX = (Math.cos(angles[i]) + Math.cos(angles[nextI])) * 0.9;
        const midZ = (Math.sin(angles[i]) + Math.sin(angles[nextI])) * 0.9;

        const lineGeom = new THREE.SphereGeometry(0.04, 8, 8);
        const line = new THREE.Mesh(lineGeom, lineMat);
        line.position.set(midX, 0.9, midZ);
        group.add(line);
    }

    return group;
}

function createIoTDevicesScene(color) {
    const group = new THREE.Group();

    const chip = createIoTDevice(color, 0, 0.3, 0, 'chip');
    group.add(chip);

    const sensorPositions = [
        { x: 0.6, z: 0 },
        { x: -0.6, z: 0 },
        { x: 0, z: 0.6 },
        { x: 0, z: -0.6 },
        { x: 0.4, z: 0.4 },
        { x: -0.4, z: 0.4 },
        { x: 0.4, z: -0.4 },
        { x: -0.4, z: -0.4 }
    ];

    sensorPositions.forEach(pos => {
        const sensor = createIoTDevice(0x44aacc, pos.x, 0.15, pos.z, 'sensor');
        group.add(sensor);
    });

    return group;
}

function createServerAndClientScene(color1, color2) {
    const group = new THREE.Group();

    const server = createServerRack(color1, -1.2, 0, 0);
    group.add(server);

    const client = createThinClient(color2, 1.2, 0, 0);
    group.add(client);

    const lineGeom = new THREE.CylinderGeometry(0.02, 0.02, 2.4, 8);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x0E71EB, roughness: 0.2, emissive: 0x0E71EB, emissiveIntensity: 0.5 });
    const line = new THREE.Mesh(lineGeom, lineMat);
    line.rotation.z = Math.PI / 2;
    line.position.set(0, 0.5, 0);
    group.add(line);

    return group;
}

// 3д мини превью

function createMiniPreview(container, geometryType, color, color2 = null, pairGeometries = null) {
    const width = container.clientWidth || 300;
    const height = 200;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a3a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3, 2, 5);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x404060, 2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x4488ff, 1);
    dirLight2.position.set(-3, 2, -2);
    scene.add(dirLight2);

    // создаем сцену в зависимости от типа
    let modelGroup;

    if (pairGeometries) {
        modelGroup = createServerAndClientScene(color, color2);
    } else {
        switch(geometryType) {
            case 'laptop_and_monitor':
                modelGroup = createLaptopAndMonitorScene(color);
                break;
            case 'headset_and_screen':
                modelGroup = createHeadsetAndScreenScene(color);
                break;
            case 'connected_people':
                modelGroup = createConnectedPeopleScene(color);
                break;
            case 'iot_devices':
                modelGroup = createIoTDevicesScene(color);
                break;
            default:
                modelGroup = new THREE.Group();
                modelGroup.add(new THREE.Mesh(
                    new THREE.SphereGeometry(0.5, 16, 16),
                    new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.5 })
                ));
        }
    }

    scene.add(modelGroup);

    // сетка
    const gridHelper = new THREE.GridHelper(6, 10, 0x444466, 0x222244);
    scene.add(gridHelper);

    renderer.render(scene, camera);

    return { scene, camera, renderer };
}

// создание карточки

function createCard(solution, isUserModel = false, modelData = null) {
    const card = document.createElement('div');
    card.className = 'card';

    const canvasContainer = document.createElement('div');
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '200px';
    card.appendChild(canvasContainer);

    const info = document.createElement('div');
    info.className = 'card-info';

    let targetParams;

    if (isUserModel) {
        info.innerHTML = `
            <h3>${modelData.modelName}</h3>
            <p>Пользовательская модель</p>
        `;
        targetParams = `model=${modelData.modelId}&type=user`;
    } else if (solution.pair_id) {
        info.innerHTML = `
            <h3>${solution.pair_name}</h3>
            <p>${solution.pair_description}</p>
        `;
        targetParams = `model=${solution.pair_id}&type=pair`;
    } else {
        info.innerHTML = `
            <h3>${solution.connection_name}</h3>
            <p>${solution.connection_description}</p>
        `;
        targetParams = `model=${solution.connection_id}&type=${solution.connection_type}`;
    }

    card.appendChild(info);

    setTimeout(() => {
        if (isUserModel && modelData) {
            loadGLBPreview(canvasContainer, modelData.fileData);
        } else if (solution.pair_id) {
            createMiniPreview(canvasContainer, null, solution.first_color, solution.second_color, solution.pair_geometries);
        } else {
            createMiniPreview(canvasContainer, solution.geometry_type, solution.base_color);
        }
    }, 100);

    card.addEventListener('click', () => {
        window.location.href = `detail.html?${targetParams}`;
    });

    return card;
}

// загрузка GLB превью

async function loadGLBPreview(container, fileData) {
    const width = container.clientWidth || 300;
    const height = 200;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a3a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x404060, 2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const gridHelper = new THREE.GridHelper(6, 10, 0x444466, 0x222244);
    scene.add(gridHelper);

    try {
        const loader = new GLTFLoader();
        const url = URL.createObjectURL(fileData);
        const gltf = await loader.loadAsync(url);
        URL.revokeObjectURL(url);

        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        gltf.scene.scale.setScalar(scale);
        gltf.scene.position.sub(center.multiplyScalar(scale));
        gltf.scene.position.y += size.y * scale / 2;

        scene.add(gltf.scene);
    } catch (e) {
        console.error('Ошибка загрузки GLB:', e);
        container.innerHTML = '<div class="fallback-icon">🧩</div>';
    }

    renderer.render(scene, camera);
}

// ========== ЗАГРУЗКА ПОЛЬЗОВАТЕЛЬСКИХ МОДЕЛЕЙ ==========

async function loadUserModels() {
    try {
        const models = await getAllModels();
        models.forEach(model => {
            const card = createCard(null, true, {
                modelId: model.id,
                modelName: model.name,
                fileData: model.file
            });
            gallery.appendChild(card);
        });
    } catch (e) {
        console.error('Ошибка загрузки моделей:', e);
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

async function initGallery() {
    gallery.innerHTML = '';

    connectionSolutions.forEach(solution => {
        gallery.appendChild(createCard(solution));
    });

    pairedSolutions.forEach(solution => {
        gallery.appendChild(createCard(solution));
    });

    await loadUserModels();

    // Демонстрация функций ДЗ
    console.log('=== ДЗ Часть 1 (Вариант 16) ===');

    const active = findActiveConnections(connectionSolutions);
    console.log('1. Активные подключения (do-while):', active.map(c => c.connection_name));

    const code = generateConnectionCode('Удаленный доступ');
    console.log('2. Код подключения (строка):', code);

    const session = initSession('Удаленный доступ');
    console.log('3. Сессия (объект):', session);

    addToHistory(session);
    console.log('4. История (массив):', connectionHistory);
}

// ========== ОБРАБОТЧИКИ ==========

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
        selectedFile = file;
        fileNameSpan.textContent = file.name;
        uploadSubmit.disabled = false;
    } else {
        selectedFile = null;
        fileNameSpan.textContent = 'Неверный формат';
        uploadSubmit.disabled = true;
    }
});

uploadSubmit.addEventListener('click', async () => {
    if (!selectedFile) return;
    try {
        await saveModel(selectedFile.name, selectedFile);
        alert('Модель загружена!');
        selectedFile = null;
        fileInput.value = '';
        fileNameSpan.textContent = 'Файл не выбран';
        uploadSubmit.disabled = true;
        initGallery();
    } catch (e) {
        console.error('Ошибка:', e);
        alert('Ошибка загрузки');
    }
});

initGallery();
