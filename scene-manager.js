// Scene Manager - Three.jsシーンのセットアップと管理

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.characters = [];
        
        this.init();
    }
    
    init() {
        // シーンの作成
        this.scene = new THREE.Scene();
        
        // カメラの設定
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // レンダラーの設定
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // ライティング
        this.setupLighting();
        
        // リサイズハンドラ
        window.addEventListener('resize', () => this.onResize());
        
        // アニメーションループ開始
        this.animate();
    }
    
    setupLighting() {
        // 環境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // ディレクショナルライト
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);
        
        // ポイントライト(アクセント)
        const pointLight = new THREE.PointLight(0x8b5cf6, 0.5);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
    }
    
    addCharacter(sprite) {
        this.characters.push(sprite);
        this.scene.add(sprite);
    }
    
    removeCharacter(sprite) {
        const index = this.characters.indexOf(sprite);
        if (index > -1) {
            this.characters.splice(index, 1);
            this.scene.remove(sprite);
        }
    }
    
    clearAllCharacters() {
        this.characters.forEach(sprite => {
            this.scene.remove(sprite);
        });
        this.characters = [];
    }
    
    getCharacters() {
        return this.characters;
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // キャラクターのアニメーション(ゆっくり回転)
        this.characters.forEach(sprite => {
            if (sprite.userData.autoRotate) {
                sprite.rotation.y += 0.005;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // レイキャスト用
    getIntersects(x, y) {
        const mouse = new THREE.Vector2(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1
        );
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        // 仮想平面との交差判定
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -3);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);
        
        return intersectPoint;
    }
}
