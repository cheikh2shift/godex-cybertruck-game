// Model Loader Module

// Load OBJ model
function loadOBJModel(path, isPlayer = false) {
    return new Promise((resolve) => {
        const loader = new THREE.OBJLoader();
        
        const mtlPath = path.replace('.obj', '.mtl');
        
        function processObject(object) {
            object.traverse((child) => {
                if (child.isMesh) {
                    if (child.material && !child.material.map) {
                        child.material.color.setHex(isPlayer ? 0xcccccc : 0x333344);
                    }
                    if (!child.material.map) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: isPlayer ? 0xcccccc : 0x333344,
                            metalness: 0.9,
                            roughness: 0.1,
                            emissive: isPlayer ? 0x222222 : 0x111122,
                            emissiveIntensity: 0.4
                        });
                    }
                }
            });
            
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Player: scale 5.8, enemies: scale 18
            const baseScale = isPlayer ? 5.8 : 18;
            const targetScale = baseScale / maxDim;
            
            object.scale.setScalar(targetScale);
            object.position.sub(center.multiplyScalar(targetScale));
            
            // Player positioned above road and rotated 180 degrees
            object.position.y = isPlayer ? 12 : 0;
            
            // Rotate player 180 degrees around Y axis
            if (isPlayer) {
                object.rotation.y = Math.PI;
            }
            
            resolve(object);
        }
        
        // Try loading with MTL first
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load(
            mtlPath,
            (materials) => {
                materials.preload();
                loader.setMaterials(materials);
                loader.load(path, processObject, undefined, () => {
                    loader.load(path, processObject);
                });
            },
            undefined,
            () => {
                // No MTL, load without textures
                loader.load(path, processObject);
            }
        );
    });
}

async function loadModels() {
    const loadingEl = document.getElementById('loading');
    const statusEl = document.getElementById('model-status');
    
    try {
        statusEl.textContent = 'Loading player model...';
        // Using Tesla Cybertruck OBJ model
        const playerModel = await loadOBJModel('uploads_files_6336105_Tesla_Cybertruck.obj', true);
        if (playerModel) {
            game.playerModel = playerModel;
            usingPlayerModel = true;
            statusEl.textContent = 'Player model loaded!';
        } else {
            statusEl.textContent = 'Using fallback player...';
        }
    } catch (e) {
        console.log('Player model load failed:', e);
        statusEl.textContent = 'Using fallback player...';
    }
    
    try {
        statusEl.textContent = 'Loading enemy model...';
        const enemyModel = await loadOBJModel('64-truck/untitled_quardfaced.obj', false);
        if (enemyModel) {
            window.enemyModel = enemyModel;
            usingEnemyModel = true;
            statusEl.textContent = 'Enemy model loaded!';
        }
    } catch (e) {
        console.log('Enemy model load failed:', e);
    }
    
    loadingEl.style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
}
