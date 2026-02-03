// AR Manager - カメラアクセスと平面検出の管理

export class ARManager {
    constructor(videoElement) {
        this.video = videoElement;
        this.stream = null;
        this.isARSupported = this.checkARSupport();
    }

    checkARSupport() {
        // WebXR AR サポートチェック
        if ('xr' in navigator) {
            return true;
        }

        // カメラアクセスのサポートチェック
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    async startCamera() {
        try {
            // カメラストリームを取得
            const constraints = {
                video: {
                    facingMode: 'environment', // 背面カメラ
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;

            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });
        } catch (error) {
            console.error('Failed to access camera:', error);
            throw new Error('カメラへのアクセスに失敗しました。HTTPSで接続していることを確認してください。');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    // 簡易的な平面検出(タップ位置を平面として扱う)
    detectPlane(x, y) {
        // 実際のAR平面検出はWebXR Device APIが必要
        // ここでは簡易的にタップ位置を返す
        return {
            x: x,
            y: y,
            detected: true
        };
    }

    // カメラの状態取得
    getCameraState() {
        return {
            isActive: this.stream !== null,
            isSupported: this.isARSupported
        };
    }
}
