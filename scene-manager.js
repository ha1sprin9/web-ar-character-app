// Scene Manager - Three.jsシーンのセットアップと管理
import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

export class SceneManager {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.characters = [];
        this.reticle = null;
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;
        this.onReticleVisibilityChange = null;
        this.isReticleVisible = false;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            20
        );

        // レンダラー設定
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true; // WebXR有効化

        // 既存のキャンバスがあれば置換、なければ追加
        const existingCanvas = this.container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.replaceWith(this.renderer.domElement);
        } else {
            this.container.appendChild(this.renderer.domElement);
        }

        // ARボタン追加
        // domOverlay: UI要素（#ui-controlsなど）をARモードでも表示させるための設定
        const arButton = ARButton.createButton(this.renderer, {
            requiredFeatures: ['hit-test'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: { root: document.body }
        });
        document.body.appendChild(arButton);

        // ライティング
        this.setupLighting();

        // レチクル(平面検出マーカー)作成
        this.createReticle();

        // リサイズ
        window.addEventListener('resize', () => this.onResize());

        // アニメーションループ (WebXRではrenderer.setAnimationLoopを使用)
        this.renderer.setAnimationLoop((timestamp, frame) => this.render(timestamp, frame));
    }

    setupLighting() {
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        hemisphereLight.position.set(0.5, 1, 0.25);
        this.scene.add(hemisphereLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 0);
        this.scene.add(directionalLight);
    }

    createReticle() {
        const geometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
        const material = new THREE.MeshBasicMaterial();
        this.reticle = new THREE.Mesh(geometry, material);
        this.reticle.matrixAutoUpdate = false;
        this.reticle.visible = false;
        this.scene.add(this.reticle);
    }

    // キャラクター追加
    addCharacter(sprite) {
        if (this.reticle.visible) {
            // レチクルの位置に配置
            sprite.position.setFromMatrixPosition(this.reticle.matrix);

            // ビルボードなので回転制御はsprite自体がカメラを向く
            // ただしY軸回転のみに制限したい場合などは別途対応が必要

            this.characters.push(sprite);
            this.scene.add(sprite);
            return true;
        }
        return false;
    }

    clearAllCharacters() {
        this.characters.forEach(sprite => this.scene.remove(sprite));
        this.characters = [];
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(timestamp, frame) {
        if (frame) {
            const referenceSpace = this.renderer.xr.getReferenceSpace();
            const session = this.renderer.xr.getSession();

            if (this.hitTestSourceRequested === false) {
                session.requestReferenceSpace('viewer').then((referenceSpace) => {
                    session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                        this.hitTestSource = source;
                    });
                });

                session.addEventListener('end', () => {
                    this.hitTestSourceRequested = false;
                    this.hitTestSource = null;
                });

                this.hitTestSourceRequested = true;
            }

            if (this.hitTestSource) {
                const hitTestResults = frame.getHitTestResults(this.hitTestSource);

                if (hitTestResults.length > 0) {
                    const hit = hitTestResults[0];
                    // 'local' spaceではなくhitTestの結果のspaceを使用
                    // 通常 ARButtonで 'local-floor' か 'viewer' が設定される
                    // ここでは getReferenceSpace() で取得した space を使用

                    // 注意: getPoseの引数は baseSpace です
                    const pose = hit.getPose(referenceSpace);

                    this.reticle.visible = true;
                    this.reticle.matrix.fromArray(pose.transform.matrix);
                } else {
                    this.reticle.visible = false;
                }

                // 状態変化の通知
                if (this.isReticleVisible !== this.reticle.visible) {
                    this.isReticleVisible = this.reticle.visible;
                    if (this.onReticleVisibilityChange) {
                        this.onReticleVisibilityChange(this.isReticleVisible);
                    }
                }
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}
