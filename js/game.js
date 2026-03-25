// Game Logic Module

// Trail particles array
let trailParticles = [];
let trailTimer = 0;
let cameraTilt = 0;
let targetCameraTilt = 0;

const TRAIL_COLORS = {
    default: 0x00ffff,
    shield: 0x00ff00,
    boost: 0xffff00,
    slowmo: 0x0088ff,
    magnet: 0xff00ff
};

function getActiveTrailColor() {
    for (const type of POWERUP_TYPES) {
        if (game.powerups[type] && game.powerups[type].active) {
            return TRAIL_COLORS[type];
        }
    }
    return TRAIL_COLORS.default;
}

function checkCollision(obj1, obj2, distance = 3) {
    const dx = obj1.position.x - obj2.position.x;
    const dz = obj1.position.z - obj2.position.z;
    return Math.sqrt(dx * dx + dz * dz) < distance;
}

function gameOver() {
    game.isRunning = false;
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = Math.floor(game.score);
    
    for (let i = 0; i < 50; i++) {
        createParticle(game.player.position.clone(), 0xff4400);
    }
}

function resetGame() {
    game.enemies.forEach(e => scene.remove(e));
    game.enemies = [];
    
    game.powerupItems.forEach(p => scene.remove(p));
    game.powerupItems = [];
    
    game.particles.forEach(p => scene.remove(p));
    game.particles = [];
    
    // Clear trail particles
    trailParticles.forEach(p => scene.remove(p));
    trailParticles = [];
    
    game.score = 0;
    game.speed = game.baseSpeed;
    game.lives = INITIAL_LIVES;
    game.currentLane = 1;
    game.targetX = 0;
    game.enemySpawnTimer = 0;
    game.powerupSpawnTimer = 0;
    
    Object.keys(game.powerups).forEach(key => {
        game.powerups[key].active = false;
        game.powerups[key].count = 3;
        document.getElementById(`${key}-icon`).classList.remove('active');
        if (game.powerupTimers[key]) {
            clearTimeout(game.powerupTimers[key]);
        }
    });
    
    updatePowerupUI();
    
    scene.remove(game.player);
    createPlayer();
    
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('start-screen').style.display = 'none';
    
    game.isRunning = true;
}

// Particle System
function createParticle(position, color) {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const particle = new THREE.Mesh(geometry, material);
    
    particle.position.copy(position);
    particle.userData = {
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            Math.random() * 10 + 5,
            (Math.random() - 0.5) * 15
        ),
        life: 1.0
    };
    
    scene.add(particle);
    game.particles.push(particle);
}

// Trail particle system for player (tire effect)
function createTrailParticle(x, z, color) {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.9
    });
    const particle = new THREE.Mesh(geometry, material);
    
    // Position closer to center of truck, behind it
    particle.position.set(
        x + (Math.random() - 0.5) * 0.3,
        0.5, // Low to the ground
        z - 1.5 // Behind the truck
    );
    
    particle.userData = {
        life: 1.0,
        velocityX: (Math.random() - 0.5) * 3,
        velocityZ: 2 + Math.random() * 2 // Flow backward toward camera
    };
    
    scene.add(particle);
    trailParticles.push(particle);
}

function updateTrailParticles(deltaTime) {
    // Spawn new trail particles at tire positions
    trailTimer += deltaTime;
    if (trailTimer > 0.04 && game.isRunning) { // Spawn every 40ms
        if (game.player) {
            const trailColor = getActiveTrailColor();
            // Closer tire positions (closer to center)
            const offset = 1.0; // Tires closer together
            // Left tire
            createTrailParticle(
                game.player.position.x - offset,
                game.player.position.z,
                trailColor
            );
            // Right tire
            createTrailParticle(
                game.player.position.x + offset,
                game.player.position.z,
                trailColor
            );
        }
        trailTimer = 0;
    }
    
    // Update existing trail particles
    for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        
        // Fade out
        p.userData.life -= deltaTime * 1.2;
        p.material.opacity = p.userData.life * 0.9;
        
        // Move backward toward camera
        p.position.z += p.userData.velocityZ * deltaTime;
        p.position.x += p.userData.velocityX * deltaTime;
        
        // Shrink as it fades
        const scale = p.userData.life * 1.0;
        p.scale.set(scale, scale * 0.4, scale); // Flatten more
        
        if (p.userData.life <= 0 || p.position.z > 20) {
            scene.remove(p);
            trailParticles.splice(i, 1);
        }
    }
}

function updateParticles(deltaTime) {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const p = game.particles[i];
        
        p.userData.velocity.y -= 20 * deltaTime;
        p.position.add(p.userData.velocity.clone().multiplyScalar(deltaTime));
        p.userData.life -= deltaTime * 2;
        
        if (p.userData.life <= 0 || p.position.y < 0) {
            scene.remove(p);
            game.particles.splice(i, 1);
        }
    }
}

// Main Game Loop
function updateGame(deltaTime) {
    if (!game.isRunning) return;
    
    // Handle keyboard/touch input
    handleInput();
    
    // Gradual speed increase based on score (only if not using boost or slowmo)
    if (!game.powerups.boost.active && !game.powerups.slowmo.active) {
        const level = Math.floor(game.score / 400);
        game.speed = game.baseSpeed + level * 4;
    }
    
    // Update score
    game.score += game.speed * deltaTime * 0.5;
    document.getElementById('score').textContent = Math.floor(game.score);
    document.getElementById('speed').textContent = Math.floor(game.speed * 3.6);
    
    // Move player to target lane
    const moveSpeed = 15 * deltaTime;
    const dx = game.targetX - game.player.position.x;
    if (Math.abs(dx) > 0.1) {
        game.player.position.x += dx * moveSpeed;
        targetCameraTilt = dx * 0.03;
    } else {
        game.player.position.x = game.targetX;
        targetCameraTilt = 0;
    }
    
    // Smooth camera tilt
    cameraTilt += (targetCameraTilt - cameraTilt) * 5 * deltaTime;
    camera.rotation.z = cameraTilt;
    
    // Update trail particles
    updateTrailParticles(deltaTime);
    
    // Update particles
    updateParticles(deltaTime);
    
    // Update road decorations
    updateRoadDecorations(deltaTime);
    
    // Spawn enemies based on level
    game.enemySpawnTimer += deltaTime;
    const level = Math.floor(game.score / 400);
    const spawnInterval = Math.max(0.5, 2.5 - level * 0.2);
    const maxEnemies = 20;
    const enemyCount = Math.min(15, 1 + Math.floor(level * 1.4));
    if (game.enemySpawnTimer > spawnInterval && game.enemies.length < maxEnemies) {
        for (let i = 0; i < enemyCount; i++) {
            spawnEnemy();
        }
        game.enemySpawnTimer = 0;
    }
    
    // Spawn power-ups
    game.powerupSpawnTimer += deltaTime;
    if (game.powerupSpawnTimer > 3) {
        spawnPowerup();
        game.powerupSpawnTimer = 0;
    }
    
    // Update enemies
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const enemy = game.enemies[i];
        enemy.position.z += game.speed * deltaTime * 0.5;
        
        if (checkCollision(game.player, enemy, 2.8)) {
            if (game.powerups.shield.active) {
                for (let j = 0; j < 15; j++) {
                    createParticle(enemy.position.clone(), 0x00ff88);
                }
                scene.remove(enemy);
                game.enemies.splice(i, 1);
                game.score += 100;
            } else {
                gameOver();
                return;
            }
        }
        
        if (enemy.position.z > 25) {
            scene.remove(enemy);
            game.enemies.splice(i, 1);
            game.score += 15;
        }
    }
    
    // Update power-up items
    for (let i = game.powerupItems.length - 1; i >= 0; i--) {
        const powerup = game.powerupItems[i];
        powerup.position.z += game.speed * deltaTime * 0.5;
        powerup.rotation.y += powerup.userData.rotationSpeed;
        powerup.rotation.x += powerup.userData.rotationSpeed * 0.5;
        
        if (game.powerups.magnet.active) {
            const dx = game.player.position.x - powerup.position.x;
            powerup.position.x += dx * 0.15;
        }
        
        if (checkCollision(game.player, powerup, 2.2)) {
            game.powerups[powerup.userData.type].count++;
            updatePowerupUI();
            const particleColor = POWERUP_COLORS[powerup.userData.type] || 0xff00ff;
            for (let j = 0; j < 15; j++) {
                createParticle(powerup.position.clone(), particleColor);
            }

            scene.remove(powerup);
            game.powerupItems.splice(i, 1);
        } else if (powerup.position.z > 25) {
            scene.remove(powerup);
            game.powerupItems.splice(i, 1);
        }
    }
    
    // Move stars background
    stars.position.z += game.speed * deltaTime * 0.3;
    if (stars.position.z > 100) {
        stars.position.z = 0;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    const deltaTime = Math.min(clock.getDelta(), 0.1);
    
    updateGame(deltaTime);
    
    renderer.render(scene, camera);
}
