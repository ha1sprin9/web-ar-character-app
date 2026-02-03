// UI Controller - DOM操作とイベントリスナー管理

export class UIController {
    constructor() {
        // Elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.helpModal = document.getElementById('help-modal');
        this.helpBtn = document.getElementById('help-btn');
        this.closeHelpBtn = document.getElementById('close-modal'); // ID修正
        this.placeBtn = document.getElementById('place-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.rotationSlider = document.getElementById('rotation-slider'); // ID修正
        this.scaleSlider = document.getElementById('scale-slider'); // ID修正

        // Character Selection
        this.characterBtns = document.querySelectorAll('.character-btn');
        this.selectedCharacter = 'character1'; // Default

        // UI Toggle
        this.toggleUiBtn = document.getElementById('toggle-ui-btn');

        this.setupEventListeners();

        // 初期状態: 配置ボタン無効
        this.setPlaceButtonState(false);
    }

    setupEventListeners() {
        // キャラクター選択
        this.characterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all
                this.characterBtns.forEach(b => b.classList.remove('active'));

                // Add active to clicked (handle image click inside btn)
                const target = e.target.closest('.character-btn');
                target.classList.add('active');

                this.selectedCharacter = target.dataset.character; // data-character -> data-character修正
                console.log('Selected:', this.selectedCharacter);
            });
        });

        // ヘルプボタン
        if (this.helpBtn) {
            this.helpBtn.addEventListener('click', () => this.toggleHelp());
        }
        if (this.closeHelpBtn) {
            this.closeHelpBtn.addEventListener('click', () => this.toggleHelp());
        }

        // UI切り替えボタン
        if (this.toggleUiBtn) {
            this.toggleUiBtn.addEventListener('click', () => this.toggleUI());
        }

        // スライダーイベント (値表示更新用)
        if (this.rotationSlider) {
            this.rotationSlider.addEventListener('input', (e) => {
                const val = document.getElementById('rotation-value');
                if (val) val.textContent = `${e.target.value}°`;
            });
        }
        if (this.scaleSlider) {
            this.scaleSlider.addEventListener('input', (e) => {
                const val = document.getElementById('scale-value');
                if (val) val.textContent = `${e.target.value}x`;
            });
        }
    }

    toggleUI() {
        document.body.classList.toggle('ui-hidden');
        const isHidden = document.body.classList.contains('ui-hidden');
        if (this.toggleUiBtn) {
            this.toggleUiBtn.style.opacity = isHidden ? '0.5' : '1';
        }
    }

    // 配置ボタンの有効/無効化
    setPlaceButtonState(enabled) {
        if (!this.placeBtn) return;

        if (enabled) {
            this.placeBtn.disabled = false;
            this.placeBtn.classList.remove('disabled');
            this.placeBtn.style.opacity = '1';
            const span = this.placeBtn.querySelector('span');
            if (span) span.textContent = '📍';
            // テキストノードだけ置換するのは面倒なので、CSSで制御するか、簡易的に
            // this.placeBtn.innerHTML = '<span>📍</span> 配置する'; 
            // と書き換える手もあるが、イベントリスナーが消える可能性があるため
            // テキストのみ変更する実装が望ましいが、ここでは簡易実装にとどめる
        } else {
            this.placeBtn.disabled = true;
            this.placeBtn.classList.add('disabled');
            this.placeBtn.style.opacity = '0.5';
            const span = this.placeBtn.querySelector('span');
            if (span) span.textContent = '🔍';
        }
    }

    onPlaceClick(callback) {
        if (this.placeBtn) {
            this.placeBtn.addEventListener('click', callback);
        }
    }

    onClearClick(callback) {
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', callback);
        }
    }

    toggleHelp() {
        if (this.helpModal) {
            this.helpModal.classList.toggle('hidden');
        }
    }

    showError(message) {
        alert(message);
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }

    getSelectedCharacter() {
        return this.selectedCharacter;
    }

    getRotation() {
        return this.rotationSlider ? parseFloat(this.rotationSlider.value) : 0;
    }

    getScale() {
        return this.scaleSlider ? parseFloat(this.scaleSlider.value) : 1;
    }
}
