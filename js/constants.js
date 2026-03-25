// Game Constants and State
const LANE_WIDTH = 4;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
const INITIAL_LIVES = 3;

const game = {
    score: 0,
    speed: 0,
    baseSpeed: 30,
    isRunning: false,
    lives: INITIAL_LIVES,
    currentLane: 1,
    targetX: 0,
    player: null,
    playerModel: null,
    enemies: [],
    powerupItems: [],
    particles: [],
    enemySpawnTimer: 0,
    powerupSpawnTimer: 0,
    powerupTimers: {},
    powerups: {
        shield: { active: false, count: 3 },
        boost: { active: false, count: 3 },
        slowmo: { active: false, count: 3 },
        magnet: { active: false, count: 3 }
    }
};

// Scene globals
let scene, camera, renderer, clock;
let road, stars = [];
let usingPlayerModel = false;
let usingEnemyModel = false;
