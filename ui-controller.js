// UI Controller - ユーザーインターフェースの制御

export class UIController {
    constructor() {
        this.selectedCharacter = 'character1';
        this.rotation = 0;
        this.scale = 1.0;

        this.initElements();
        this.attachEventListeners();
    }

    initElements() {
        // Elements
        this.helpBtn = document.getElementById('help-btn');
        this.helpModal = document.getElementById('help-modal');
        this.closeModal = document.getElementById('close-modal');
        this.placeBtn = document.getElementById('place-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.rotationSlider = document.getElementById('rotation-slider');
        this.rotationValue = document.getElementById('rotation-value');
        this.scaleSlider = document.getElementById('scale-slider');
        this.scaleValue = document.getElementById('scale-value');
        this.characterBtns = document.querySelectorAll('.character-btn');
        this.loadingScreen = document.getElementById('loading-screen');
    }

    attachEventListeners() {
        // Help modal
        this.helpBtn.addEventListener('click', () => this.showHelp());
        this.closeModal.addEventListener('click', () => this.hideHelp());
        this.helpModal.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.hideHelp();
            }
        });

        // Rotation slider
        this.rotationSlider.addEventListener('input', (e) => {
            this.rotation = parseInt(e.target.value);
            this.rotationValue.textContent = `${this.rotation}°`;
        });

        // Scale slider
        this.scaleSlider.addEventListener('input', (e) => {
            this.scale = parseFloat(e.target.value);
            this.scaleValue.textContent = `${this.scale.toFixed(1)}x`;
        });

        // Character selection
        this.characterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.characterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCharacter = btn.dataset.character;
            });
        });
    }

    showHelp() {
        this.helpModal.classList.remove('hidden');
    }

    hideHelp() {
        this.helpModal.classList.add('hidden');
    }

    hideLoading() {
        this.loadingScreen.classList.add('hidden');
    }

    showLoading() {
        this.loadingScreen.classList.remove('hidden');
    }

    onPlaceClick(callback) {
        this.placeBtn.addEventListener('click', callback);
    }

    onClearClick(callback) {
        this.clearBtn.addEventListener('click', callback);
    }

    getSelectedCharacter() {
        return this.selectedCharacter;
    }

    getRotation() {
        return this.rotation;
    }

    getScale() {
        return this.scale;
    }

    showError(message) {
        alert(message);
    }

    showSuccess(message) {
        console.log('Success:', message);
    }
}
