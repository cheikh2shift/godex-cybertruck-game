// Road Module
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
