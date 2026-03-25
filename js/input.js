// Input Handler Module
const keys = {
    left: false,
    right: false,
    shield: false,
    boost: false,
    slowmo: false,
    magnet: false
};

function handleInput() {
    // Movement
    if (keys.left && game.currentLane > 0) {
        game.currentLane--;
        game.targetX = LANES[game.currentLane];
        keys.left = false;
    }
    
    if (keys.right && game.currentLane < 2) {
        game.currentLane++;
        game.targetX = LANES[game.currentLane];
        keys.right = false;
    }
    
    // Power-ups
    if (keys.shield) {
        activatePowerup('shield');
        keys.shield = false;
    }
    
    if (keys.boost) {
        activatePowerup('boost');
        keys.boost = false;
    }
    
    if (keys.slowmo) {
        activatePowerup('slowmo');
        keys.slowmo = false;
    }
    
    if (keys.magnet) {
        activatePowerup('magnet');
        keys.magnet = false;
    }
}

function setupInputListeners() {
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                keys.left = true;
                break;
            case 'arrowright':
            case 'd':
                keys.right = true;
                break;
            case 's':
                keys.shield = true;
                break;
            case 'b':
                keys.boost = true;
                break;
            case 'w':
                keys.slowmo = true;
                break;
            case 'm':
                keys.magnet = true;
                break;
        }
    });
    
    // Touch controls for mobile
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        
        if (diff > 50 && game.currentLane < 2) {
            game.currentLane++;
            game.targetX = LANES[game.currentLane];
        } else if (diff < -50 && game.currentLane > 0) {
            game.currentLane--;
            game.targetX = LANES[game.currentLane];
        }
    });
}
