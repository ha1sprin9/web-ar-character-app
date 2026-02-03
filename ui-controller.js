// UI Controller - DOM操作とイベントリスナー管理

export class UIController {
    constructor() {
        // Elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.helpModal = document.getElementById('help-modal');
        this.helpBtn = document.getElementById('help-btn');
        this.closeHelpBtn = document.getElementById('close-help-btn');
        this.placeBtn = document.getElementById('place-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.rotationSlider = document.getElementById('rotation');
        this.scaleSlider = document.getElementById('scale');

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

                this.selectedCharacter = target.dataset.char;
                console.log('Selected:', this.selectedCharacter);
            });
        });

        // ヘルプボタン
        this.helpBtn.addEventListener('click', () => this.toggleHelp());
        this.closeHelpBtn.addEventListener('click', () => this.toggleHelp());

        // UI切り替えボタン (存在チェック)
        if (this.toggleUiBtn) {
            this.toggleUiBtn.addEventListener('click', () => this.toggleUI());
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
        if (enabled) {
            this.placeBtn.disabled = false;
            this.placeBtn.classList.remove('disabled');
            this.placeBtn.style.opacity = '1';
            this.placeBtn.querySelector('span').textContent = '📍 配置する';
        } else {
            this.placeBtn.disabled = true;
            this.placeBtn.classList.add('disabled');
            this.placeBtn.style.opacity = '0.5';
            this.placeBtn.querySelector('span').textContent = '🔍 平面を探して...';
        }
    }

    onPlaceClick(callback) {
        this.placeBtn.addEventListener('click', callback);
    }

    onClearClick(callback) {
        this.clearBtn.addEventListener('click', callback);
    }

    toggleHelp() {
        this.helpModal.classList.toggle('hidden');
    }

    showError(message) {
        alert(message);
    }

    hideLoading() {
        this.loadingScreen.classList.add('hidden');
    }

    getSelectedCharacter() {
        return this.selectedCharacter;
    }

    getRotation() {
        return parseFloat(this.rotationSlider.value);
    }

    getScale() {
        return parseFloat(this.scaleSlider.value);
    }
}
