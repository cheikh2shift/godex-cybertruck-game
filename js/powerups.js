// Power-ups Module
const POWERUP_TYPES = ['shield', 'boost', 'slowmo', 'magnet'];
const POWERUP_COLORS = {
    shield: 0x00ff00,
    boost: 0xffff00,
    slowmo: 0x0088ff,
    magnet: 0xff00ff
};

function spawnPowerup() {
    const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
    const color = POWERUP_COLORS[type];
    
    const geometry = new THREE.OctahedronGeometry(0.8);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });
    
    const powerup = new THREE.Mesh(geometry, material);
    powerup.position.set(LANES[Math.floor(Math.random() * 3)], 1.5, -100);
    powerup.userData = {
        type: type,
        rotationSpeed: 1 + Math.random()
    };
    
    scene.add(powerup);
    game.powerupItems.push(powerup);
}

function activatePowerup(type) {
    if (game.powerups[type].count <= 0) return;
    
    game.powerups[type].count--;
    game.powerups[type].active = true;
    
    document.getElementById(`${type}-icon`).classList.add('active');
    updatePowerupUI();
    
    // Clear existing timer
    if (game.powerupTimers[type]) {
        clearTimeout(game.powerupTimers[type]);
    }
    
    // Apply power-up effects
    switch(type) {
        case 'shield':
            if (game.playerModel) {
                game.playerModel.traverse(child => {
                    if (child.material && child.material.emissive) {
                        child.material.emissive = new THREE.Color(0x00ff00);
                        child.material.emissiveIntensity = 0.8;
                    }
                });
            }
            break;
        case 'boost':
            game.speed = game.baseSpeed * 1.8;
            break;
        case 'slowmo':
            game.speed = game.baseSpeed * 0.25;
            break;
    }
    
    // Set duration
    game.powerupTimers[type] = setTimeout(() => {
        deactivatePowerup(type);
    }, 5000);
}

function deactivatePowerup(type) {
    game.powerups[type].active = false;
    document.getElementById(`${type}-icon`).classList.remove('active');
    
    switch(type) {
        case 'shield':
            if (game.playerModel) {
                game.playerModel.traverse(child => {
                    if (child.material && child.material.emissive) {
                        child.material.emissive = new THREE.Color(0x000000);
                        child.material.emissiveIntensity = 0;
                    }
                });
            }
            break;
        case 'boost':
        case 'slowmo':
            game.speed = game.baseSpeed;
            break;
    }
}

function updatePowerupUI() {
    Object.keys(game.powerups).forEach(key => {
        const icon = document.getElementById(`${key}-icon`);
        const countSpan = icon.querySelector('.count');
        countSpan.textContent = game.powerups[key].count;
    });
}
