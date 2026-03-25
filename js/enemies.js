// Enemies Module
function createFallbackEnemy() {
    const group = new THREE.Group();
    
    const bodyGeometry = new THREE.BoxGeometry(2.8, 1.6, 5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a3a,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x111122,
        emissiveIntensity: 0.4
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.3;
    group.add(body);
    
    // Red accent stripes
    const stripeGeometry = new THREE.BoxGeometry(0.1, 1.2, 4.5);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 1.5 });
    
    const leftStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    leftStripe.position.set(-1.4, 1.3, 0);
    group.add(leftStripe);
    
    const rightStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
    rightStripe.position.set(1.4, 1.3, 0);
    group.add(rightStripe);
    
    // Glowing eyes
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3 });
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.1), eyeMaterial);
    leftEye.position.set(-0.6, 1.8, -2.55);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.1), eyeMaterial);
    rightEye.position.set(0.6, 1.8, -2.55);
    group.add(rightEye);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.5, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 });
    
    [[-1.5, 0.45, -1.5], [1.5, 0.45, -1.5], [-1.5, 0.45, 1.5], [1.5, 0.45, 1.5]].forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
    });
    
    return group;
}

function spawnEnemy() {
    let enemy;
    if (usingEnemyModel && window.enemyModel) {
        // Clone enemy model WITHOUT color changes - keep original texture
        enemy = window.enemyModel.clone();
        enemy.position.set(LANES[Math.floor(Math.random() * 3)], 0, -150);
    } else {
        enemy = createFallbackEnemy();
        enemy.position.set(LANES[Math.floor(Math.random() * 3)], 0, -150);
    }
    scene.add(enemy);
    game.enemies.push(enemy);
}
