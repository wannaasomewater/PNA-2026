import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getModel } from './idb.js';

const container = document.getElementById('viewer-container');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const backBtn = document.getElementById('back-btn');

// Сцена
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a3a);

const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(5, 3, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.5, 0);
controls.minDistance = 2;
controls.maxDistance = 15;

scene.add(new THREE.AmbientLight(0x404060, 2.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0x4488ff, 1.5);
dirLight2.position.set(-3, 2, -2);
scene.add(dirLight2);

const gridHelper = new THREE.GridHelper(12, 20, 0x444466, 0x222244);
scene.add(gridHelper);

// ========== БАЗОВЫЕ ПРИМИТИВЫ (те же что в app.js) ==========

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

    const cupGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const leftCup = new THREE.Mesh(cupGeom, mat);
    leftCup.position.set(-0.28, 0.1, 0);
    group.add(leftCup);

    const rightCup = new THREE.Mesh(cupGeom, mat);
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

// ========== КОМПЛЕКСНЫЕ СЦЕНЫ (те же что в app.js) ==========

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
        { x: 0.6, z: 0 }, { x: -0.6, z: 0 },
        { x: 0, z: 0.6 }, { x: 0, z: -0.6 },
        { x: 0.4, z: 0.4 }, { x: -0.4, z: 0.4 },
        { x: 0.4, z: -0.4 }, { x: -0.4, z: -0.4 }
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

// ========== ЦЕНТРИРОВАНИЕ МОДЕЛИ ==========

function centerModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 5 / maxDim;
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    model.position.y += size.y * scale / 2;
}

// ========== ЗАГРУЗКА МОДЕЛИ ==========

async function loadModel() {
    const params = new URLSearchParams(window.location.search);
    const modelId = params.get('model');
    const modelType = params.get('type');

    console.log('Загрузка модели:', modelId, modelType);

    if (modelType === 'user') {
        // Пользовательская модель из IndexedDB
        try {
            const model = await getModel(parseInt(modelId));
            if (model) {
                const loader = new GLTFLoader();
                const url = URL.createObjectURL(model.file);
                const gltf = await loader.loadAsync(url);
                URL.revokeObjectURL(url);
                centerModel(gltf.scene);
                scene.add(gltf.scene);
            }
        } catch (e) {
            console.error('Ошибка загрузки пользовательской модели:', e);
        }
    } else if (modelType === 'pair') {
        // Парная модель: Сервер + Терминал
        const pairScene = createServerAndClientScene(0x0E71EB, 0x444444);
        scene.add(pairScene);
    } else {
        // Предустановленные модели TeamViewer
        const colors = {
            remote_access: 0x0E71EB,
            remote_support: 0x0652B3,
            collaboration: 0x0088CC,
            iot: 0x006699
        };
        const color = colors[modelType] || 0x0E71EB;

        let modelScene;

        switch(modelType) {
            case 'remote_access':
                modelScene = createLaptopAndMonitorScene(color);
                break;
            case 'remote_support':
                modelScene = createHeadsetAndScreenScene(color);
                break;
            case 'collaboration':
                modelScene = createConnectedPeopleScene(color);
                break;
            case 'iot':
                modelScene = createIoTDevicesScene(color);
                break;
            default:
                // На всякий случай — синяя сфера
                const geom = new THREE.SphereGeometry(1, 32, 32);
                const mat = new THREE.MeshStandardMaterial({ color: 0x0E71EB, roughness: 0.4, metalness: 0.5 });
                modelScene = new THREE.Mesh(geom, mat);
        }

        scene.add(modelScene);
    }
}

// ========== УПРАВЛЕНИЕ КАМЕРОЙ ==========

zoomInBtn.addEventListener('click', () => {
    camera.position.multiplyScalar(0.85);
});

zoomOutBtn.addEventListener('click', () => {
    camera.position.multiplyScalar(1.15);
});

function setView(x, y, z) {
    camera.position.set(x, y, z);
    controls.target.set(0, 0.5, 0);
    controls.update();
}

document.getElementById('view-front').addEventListener('click', () => setView(0, 1.5, 8));
document.getElementById('view-back').addEventListener('click', () => setView(0, 1.5, -8));
document.getElementById('view-left').addEventListener('click', () => setView(-8, 1.5, 0));
document.getElementById('view-right').addEventListener('click', () => setView(8, 1.5, 0));

backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// ========== АНИМАЦИЯ ==========

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// ========== ЗАПУСК ==========

loadModel();
animate();

console.log('=== Детальный просмотр 3D-модели ===');
console.log('Используйте мышь для вращения');
console.log('Кнопки +/- для зума');
console.log('Кнопки видов для быстрой смены ракурса');
