// Model Loader Module

// Load DAE (Collada) model
function loadDAEModel(path, isPlayer = false) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.ColladaLoader();
        
        loader.load(
            path,
            (collada) => {
                const object = collada.scene;
                
                object.traverse((child) => {
                    if (child.isMesh) {
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(mat => {
                                    mat.metalness = 0.9;
                                    mat.roughness = 0.1;
                                });
                            } else {
                                child.material.metalness = 0.9;
                                child.material.roughness = 0.1;
                            }
                        }
                    }
                });
                
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const targetScale = 5 / maxDim;
                
                object.scale.setScalar(targetScale);
                object.position.sub(center.multiplyScalar(targetScale));
                object.position.y = isPlayer ? 9 : 0;
                
                resolve(object);
            },
            undefined,
            (error) => {
                console.error('Error loading DAE:', path, error);
                reject(error);
            }
        );
    });
}

// Load OBJ model
function loadOBJModel(path, isPlayer = false) {
    return new Promise((resolve) => {
        const loader = new THREE.OBJLoader();
        
        const mtlPath = path.replace('.obj', '.mtl');
        const hasMtl = !isPlayer;
        
        function processObject(object) {
            object.traverse((child) => {
                if (child.isMesh) {
                    if (child.material && !child.material.map) {
                        child.material.color.setHex(isPlayer ? 0x333333 : 0x333344);
                    }
                    if (!child.material.map) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: isPlayer ? 0x333333 : 0x333344,
                            metalness: 0.9,
                            roughness: 0.1,
                            emissive: 0x111122,
                            emissiveIntensity: 0.4
                        });
                    }
                }
            });
            
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Scale: player gets base 5 + 0.8 bonus, enemies get 18
            const baseScale = isPlayer ? 5.8 : 18;
            const targetScale = baseScale / maxDim;
            
            object.scale.setScalar(targetScale);
            object.position.sub(center.multiplyScalar(targetScale));
            // Player raised higher above road
            object.position.y = isPlayer ? 12 : 0;
            
            resolve(object);
        }
        
        if (hasMtl) {
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
                    loader.load(path, processObject);
                }
            );
        } else {
            loader.load(path, processObject);
        }
    });
}

async function loadModels() {
    const loadingEl = document.getElementById('loading');
    const statusEl = document.getElementById('model-status');
    
    try {
        statusEl.textContent = 'Loading player model...';
        // Using OBJ model with increased scale and height
        const playerModel = await loadOBJModel('72-24-c4/C4/C4.obj', true);
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
