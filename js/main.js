// Main Entry Point Module
async function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000010, 50, 250);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, -10);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000010);
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    // Clock
    clock = new THREE.Clock();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333344, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 20, 10);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x00ffff, 1, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
    
    // Stars background
    stars = createStars();
    scene.add(stars);
    
    // Road
    road = createRoad();
    scene.add(road);
    
    // Setup input
    setupInputListeners();
    
    // Button listeners
    document.getElementById('start-btn').addEventListener('click', () => {
        resetGame();
    });
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        resetGame();
    });
    
    // Window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Load models then start
    await loadModels();
    animate();
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
