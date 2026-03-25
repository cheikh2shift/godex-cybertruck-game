// Road Module
let roadDecorations = [];

function createTree(x, z) {
    const tree = new THREE.Group();
    
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 6);
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a1a0a,
        metalness: 0.2,
        roughness: 0.9
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5;
    tree.add(trunk);
    
    const foliageGeometry = new THREE.ConeGeometry(2, 6, 6);
    const foliageMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x003311,
        metalness: 0.3,
        roughness: 0.7,
        emissive: 0x001100,
        emissiveIntensity: 0.3
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 5;
    tree.add(foliage);
    
    const neonGeometry = new THREE.RingGeometry(1.5, 1.7, 6);
    const neonMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2,
        side: THREE.DoubleSide
    });
    const neon = new THREE.Mesh(neonGeometry, neonMaterial);
    neon.rotation.x = -Math.PI / 2;
    neon.position.y = 0.1;
    tree.add(neon);
    
    tree.position.set(x, 0, z);
    tree.userData = { originalZ: z };
    
    return tree;
}

function createBuilding(x, z) {
    const building = new THREE.Group();
    
    const height = 8 + Math.random() * 15;
    const width = 3 + Math.random() * 2;
    
    const bodyGeometry = new THREE.BoxGeometry(width, height, width);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x111122,
        metalness: 0.8,
        roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = height / 2;
    building.add(body);
    
    for (let i = 0; i < 3; i++) {
        const lightGeometry = new THREE.BoxGeometry(width * 0.8, 0.3, 0.1);
        const colors = [0xff0066, 0x00ffff, 0xff00ff];
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: colors[Math.floor(Math.random() * 3)],
            emissive: colors[Math.floor(Math.random() * 3)],
            emissiveIntensity: 2
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(0, 2 + i * 3, width / 2 + 0.05);
        building.add(light);
    }
    
    building.position.set(x, 0, z);
    building.userData = { originalZ: z };
    
    return building;
}

function createRoadDecorations() {
    roadDecorations = [];
    
    for (let i = 0; i < 40; i++) {
        const z = -180 + i * 10 + (Math.random() - 0.5) * 5;
        const side = Math.random() > 0.5 ? 1 : -1;
        const x = side * (10 + Math.random() * 8);
        
        let decoration;
        if (Math.random() > 0.4) {
            decoration = createTree(x, z);
        } else {
            decoration = createBuilding(x, z);
        }
        
        scene.add(decoration);
        roadDecorations.push(decoration);
    }
}

function updateRoadDecorations(deltaTime) {
    roadDecorations.forEach(decoration => {
        decoration.position.z += game.speed * deltaTime * 0.5;
        
        if (decoration.position.z > 30) {
            decoration.position.z = -180 + (Math.random() - 0.5) * 10;
        }
    });
}

function createRoad() {
    const roadGroup = new THREE.Group();
    
    // Main road surface
    const roadGeometry = new THREE.PlaneGeometry(16, 200);
    const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a15,
        metalness: 0.3,
        roughness: 0.8
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -50);
    roadGroup.add(road);
    
    // Lane dividers
    for (let i = -1; i <= 1; i++) {
        const laneGeometry = new THREE.PlaneGeometry(0.15, 200);
        const laneMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.4
        });
        const lane = new THREE.Mesh(laneGeometry, laneMaterial);
        lane.rotation.x = -Math.PI / 2;
        lane.position.set(i * 2, 0.03, -50);
        roadGroup.add(lane);
    }
    
    // Edge glow strips
    const edgeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1
    });
    
    const leftEdge = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 200), edgeMaterial);
    leftEdge.position.set(-7.5, 0.15, -50);
    roadGroup.add(leftEdge);
    
    const rightEdge = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 200), edgeMaterial);
    rightEdge.position.set(7.5, 0.15, -50);
    roadGroup.add(rightEdge);
    
    return roadGroup;
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 400;
        positions[i + 1] = Math.random() * 100 + 20;
        positions[i + 2] = (Math.random() - 0.5) * 400;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    return new THREE.Points(starGeometry, starMaterial);
}
