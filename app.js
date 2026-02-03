// Main Application - すべてのモジュールを統合

import { SceneManager } from './scene-manager.js';
import { ImageLoader } from './image-loader.js';
import { ARManager } from './ar-manager.js';
import { UIController } from './ui-controller.js';

class ARCharacterApp {
    constructor() {
        this.sceneManager = null;
        this.imageLoader = null;
        this.arManager = null;
        this.uiController = null;
        this.currentSprite = null;
        this.placedSprites = [];

        this.init();
    }

    async init() {
        try {
            // UI Controller初期化
            this.uiController = new UIController();

            // Canvas取得
            const canvas = document.getElementById('ar-canvas');
            const video = document.getElementById('camera-video');

            // Scene Manager初期化
            this.sceneManager = new SceneManager(canvas);

            // Image Loader初期化
            this.imageLoader = new ImageLoader();

            // AR Manager初期化
            this.arManager = new ARManager(video);

            // カメラ起動
            await this.arManager.startCamera();

            // イベントリスナー設定
            this.setupEventListeners();

            // ローディング画面を非表示
            setTimeout(() => {
                this.uiController.hideLoading();
            }, 1000);

        } catch (error) {
            console.error('Initialization error:', error);
            this.uiController.showError(error.message);
        }
    }

    setupEventListeners() {
        // 配置ボタン
        this.uiController.onPlaceClick(() => this.placeCharacterAtCenter());

        // クリアボタン
        this.uiController.onClearClick(() => this.clearAllCharacters());

        // キャンバスクリック(タップ)
        const canvas = document.getElementById('ar-canvas');
        canvas.addEventListener('click', (e) => this.onCanvasClick(e));

        // タッチイベント(モバイル対応)
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            this.onCanvasClick({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        });
    }

    async onCanvasClick(event) {
        try {
            const character = this.uiController.getSelectedCharacter();
            const rotation = this.uiController.getRotation();
            const scale = this.uiController.getScale();

            // 交差点を取得
            const intersect = this.sceneManager.getIntersects(
                event.clientX,
                event.clientY
            );

            if (intersect) {
                await this.placeCharacter(intersect, character, rotation, scale);
            }
        } catch (error) {
            console.error('Failed to place character:', error);
            this.uiController.showError('キャラクターの配置に失敗しました');
        }
    }

    async placeCharacterAtCenter() {
        try {
            const character = this.uiController.getSelectedCharacter();
            const rotation = this.uiController.getRotation();
            const scale = this.uiController.getScale();

            // 画面中央に配置
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const intersect = this.sceneManager.getIntersects(centerX, centerY);

            if (intersect) {
                await this.placeCharacter(intersect, character, rotation, scale);
            }
        } catch (error) {
            console.error('Failed to place character at center:', error);
            this.uiController.showError('キャラクターの配置に失敗しました');
        }
    }

    async placeCharacter(position, characterName, rotation, scale) {
        // キャラクター画像のパス
        const imagePath = `assets/characters/${characterName}.png`;

        // スプライト作成
        const sprite = await this.imageLoader.createCharacterSprite(imagePath, scale);

        // 位置設定
        sprite.position.copy(position);

        // 回転設定(Y軸)
        sprite.material.rotation = (rotation * Math.PI) / 180;

        // シーンに追加
        this.sceneManager.addCharacter(sprite);
        this.placedSprites.push(sprite);

        console.log('Character placed:', characterName, 'at', position);
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
