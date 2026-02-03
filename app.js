// Main Application - すべてのモジュールを統合

import { SceneManager } from './scene-manager.js?v=3';
import { ImageLoader } from './image-loader.js?v=3';
import { UIController } from './ui-controller.js?v=3';

class ARCharacterApp {
    constructor() {
        this.sceneManager = null;
        this.imageLoader = null;
        this.uiController = null;
        this.placedSprites = [];

        this.init();
    }

    async init() {
        try {
            console.log('App: Starting initialization...');

            // UI Controller初期化
            this.uiController = new UIController();
            console.log('App: UI Controller initialized');

            // コンテナ取得
            const container = document.getElementById('ar-container');
            if (!container) throw new Error('AR Container not found');

            // Scene Manager初期化 (WebXR対応)
            this.sceneManager = new SceneManager(container);
            console.log('App: Scene Manager initialized');

            // 平面検出状態の監視 (これが漏れていた修正)
            if (this.sceneManager.setReticleVisibilityCallback) {
                this.sceneManager.setReticleVisibilityCallback((visible) => {
                    this.uiController.setPlaceButtonState(visible);
                });
            } else {
                console.error('SceneManager.setReticleVisibilityCallback is missing!');
            }

            // Image Loader初期化
            this.imageLoader = new ImageLoader();
            console.log('App: Image Loader initialized');

            // イベントリスナー設定
            this.setupEventListeners();
            console.log('App: Event listeners set up');

            // ローディング画面を非表示
            setTimeout(() => {
                this.uiController.hideLoading();
            }, 1000);

            console.log('AR App Initialized with WebXR');

        } catch (error) {
            console.error('Initialization error:', error);
            // ユーザーに見えるアラートに変更
            alert('App Init Error: ' + error.message);
            if (this.uiController && this.uiController.showError) {
                this.uiController.showError(error.message);
            }
        }
    }

    setupEventListeners() {
        // 配置ボタン
        this.uiController.onPlaceClick(() => this.placeCharacter());

        // クリアボタン
        this.uiController.onClearClick(() => this.clearAllCharacters());

        // WebXRでは、画面タップ(セッション内入力)は 'select' イベントとして処理するのが一般的だが、
        // dom-overlayを使っているため、HTML要素へのクリックイベントも取れる。
        // ここでは、ar-containerへのクリック/タッチで配置を実行するものとする。

        const container = document.getElementById('ar-container');

        // タッチ終了時に配置を試みる
        container.addEventListener('click', () => {
            // UI操作との重複を防ぐため、少し制御が必要かもしれないが、
            // dom-overlay設定によりボタン類は優先されるはず。
            this.placeCharacter();
        });
    }

    async placeCharacter() {
        try {
            const characterName = this.uiController.getSelectedCharacter();
            const rotation = this.uiController.getRotation();
            const scale = this.uiController.getScale();

            // キャラクター画像のパス
            const imagePath = `assets/characters/${characterName}.png`;

            // スプライト作成
            const sprite = await this.imageLoader.createCharacterSprite(imagePath, scale);

            // 回転設定(Y軸)
            sprite.material.rotation = (rotation * Math.PI) / 180;

            // シーンに追加 (レチクルが表示されていれば配置成功)
            const success = this.sceneManager.addCharacter(sprite);

            if (success) {
                this.placedSprites.push(sprite);
                console.log('Character placed:', characterName);
            } else {
                console.log('Cannot place character: Reticle not visible');
                // ユーザーにフィードバックした方が親切かも
            }

        } catch (error) {
            console.error('Failed to place character:', error);
            this.uiController.showError('キャラクターの配置に失敗しました');
        }
    }

    clearAllCharacters() {
        this.sceneManager.clearAllCharacters();
        this.placedSprites = [];
        console.log('All characters cleared');
    }
}

// アプリケーション起動
window.addEventListener('DOMContentLoaded', () => {
    new ARCharacterApp();
});
