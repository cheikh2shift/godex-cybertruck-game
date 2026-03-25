// Player Module - Creates the Cybertruck player
function createCybertruck() {
    const group = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(2.8, 1.6, 5.2);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.95,
        roughness: 0.05,
        emissive: 0x222222,
        emissiveIntensity: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.3;
    group.add(body);
    
    // Roof
    const roofGeometry = new THREE.BoxGeometry(2.6, 0.9, 3.2);
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 0.9,
        roughness: 0.1
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 2.4, -0.3);
    group.add(roof);
    
    // Windows (dark tint)
    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x001122,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    // Front window
    const frontWindowGeometry = new THREE.BoxGeometry(2.4, 0.7, 0.1);
    const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
    frontWindow.position.set(0, 2.2, -1.85);
    frontWindow.rotation.x = -0.3;
    group.add(frontWindow);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.3
    });
    
    const wheelPositions = [
        [-1.5, 0.45, -1.5], [1.5, 0.45, -1.5],
        [-1.5, 0.45, 1.5], [1.5, 0.45, 1.5]
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        group.add(wheel);
    });
    
    // Neon accents
    const accentPositions = [
        [1.41, 0.8, 0], [-1.41, 0.8, 0],
        [0, 0.1, -2.61], [0, 0.1, 2.61]
    ];
    
    accentPositions.forEach(pos => {
        const accentGeometry = new THREE.BoxGeometry(
            pos[0] !== 0 ? 0.02 : 2.5,
            0.02,
            pos[2] !== 0 ? 0.02 : 2.5
        );
        const accentMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 2
        });
        const accent = new THREE.Mesh(accentGeometry, accentMaterial);
        accent.position.set(...pos);
        group.add(accent);
    });
    
    // Ring accents
    const ringPositions = [[-1.4, 0.3, 0], [1.4, 0.3, 0]];
    ringPositions.forEach(pos => {
        const ringGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(pos[0] > 0 ? pos[0] + 0.2 : pos[0] - 0.2, pos[1], pos[2]);
        ring.rotation.y = Math.PI / 2;
        group.add(ring);
    });
    
    // Headlights
    const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 3 });
    const leftHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.1), headlightMaterial);
    leftHeadlight.position.set(-0.6, 1.1, -2.55);
    group.add(leftHeadlight);
    
    const rightHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.1), headlightMaterial);
    rightHeadlight.position.set(0.6, 1.1, -2.55);
    group.add(rightHeadlight);
    
    // Tail lights
    const tailMaterial = new THREE.MeshBasicMaterial({ color: 0xff0030, emissive: 0xff0030, emissiveIntensity: 2.5 });
    const leftTail = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.1), tailMaterial);
    leftTail.position.set(-0.6, 1.1, 2.55);
    group.add(leftTail);
    
    const rightTail = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.1), tailMaterial);
    rightTail.position.set(0.6, 1.1, 2.55);
    group.add(rightTail);
    
    // Light bar
    const lightBarMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2 });
    const lightBar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 4.5), lightBarMaterial);
    lightBar.position.set(0, 3.1, 0);
    group.add(lightBar);
    
    group.position.set(0, 0, 5);
    group.scale.set(0.85, 0.85, 0.85);
    
    return group;
}

function createPlayer() {
    if (usingPlayerModel && game.playerModel) {
        game.player = game.playerModel.clone();
        game.player.position.set(0, 0, 5);
    } else {
        game.player = createCybertruck();
    }
    scene.add(game.player);
    game.playerModel = game.player;
    game.speed = game.baseSpeed;
}
