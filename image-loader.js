// Image Loader - PNG画像の読み込みとビルボードスプライト生成
import * as THREE from 'three';

export class ImageLoader {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.loadedTextures = new Map();
    }

    async loadImage(imagePath) {
        // キャッシュチェック
        if (this.loadedTextures.has(imagePath)) {
            return this.loadedTextures.get(imagePath);
        }

        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                imagePath,
                (texture) => {
                    // テクスチャ設定
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;

                    this.loadedTextures.set(imagePath, texture);
                    resolve(texture);
                },
                undefined,
                (error) => {
                    console.error('Failed to load image:', imagePath, error);
                    reject(error);
                }
            );
        });
    }

    createBillboardSprite(texture, scale = 1) {
        // スプライトマテリアル作成
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
            depthTest: true,
            depthWrite: false
        });

        // スプライト作成
        const sprite = new THREE.Sprite(material);

        // アスペクト比を維持してスケール設定
        let aspect = 1;
        if (texture.image && texture.image.width && texture.image.height) {
            aspect = texture.image.width / texture.image.height;
        } else {
            console.warn('Texture image not fully loaded, using default aspect ratio 1:1');
        }

        sprite.scale.set(scale * aspect, scale, 1);

        // ユーザーデータ
        sprite.userData = {
            autoRotate: false,
            originalScale: scale
        };

        return sprite;
    }

    async createCharacterSprite(imagePath, scale = 1) {
        try {
            const texture = await this.loadImage(imagePath);
            const sprite = this.createBillboardSprite(texture, scale);
            return sprite;
        } catch (error) {
            console.error('Failed to create character sprite:', error);
            throw error;
        }
    }

    clearCache() {
        this.loadedTextures.forEach(texture => {
            texture.dispose();
        });
        this.loadedTextures.clear();
    }
}
