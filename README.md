# Web AR Character Display

カメラ映像からAR平面を検出してキャラクター画像を表示するWebアプリケーション

![Demo](https://img.shields.io/badge/Status-Demo-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
[![Deploy to GitHub Pages](https://github.com/ha1sprin9/web-ar-character-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/ha1sprin9/web-ar-character-app/actions/workflows/deploy.yml)

## 🌟 Features

- 📱 **モバイル対応**: iOS Safari、Android Chromeで動作
- 🎨 **モダンUI**: グラスモーフィズムを使用したプレミアムデザイン
- 🎭 **キャラクター配置**: タップでキャラクターを自由に配置
- 🔄 **リアルタイム調整**: 回転・スケールをスライダーで調整
- 📸 **カメラAR**: デバイスカメラを使用したAR体験

## 🚀 Demo

[**ここをクリックしてデモを開く**](https://ha1sprin9.github.io/web-ar-character-app/)
(スマホでアクセスしてください)

## 🛠️ Tech Stack

- **Three.js** - 3Dレンダリング
- **WebRTC** - カメラアクセス
- **Vanilla JavaScript** - フレームワークレス
- **CSS3** - モダンスタイリング

## 📋 Requirements

- HTTPS接続(カメラアクセスに必須)
- モダンブラウザ:
  - iOS Safari 11+
  - Android Chrome 67+
  - Desktop Chrome/Edge (WebGL対応)

## 🏃 Getting Started

### ローカル開発

```bash
# HTTPサーバー起動
npx -y http-server -p 8080

# ブラウザで開く
# http://localhost:8080
```

### スマホ実機テスト(推奨)

カメラアクセスにはHTTPSが必須です。ngrokを使用してHTTPSトンネルを作成します。

```bash
# ターミナル1: ローカルサーバー起動
npx -y http-server -p 8080

# ターミナル2: ngrokでHTTPSトンネル作成
npx -y ngrok http 8080
```

ngrokが表示するHTTPS URL(例: `https://xxxx.ngrok-free.app`)をスマホのブラウザで開きます。

## 📖 Usage

1. **カメラ許可**: ブラウザのカメラアクセス許可を承認
2. **キャラクター選択**: 表示したいキャラクターを選択
3. **配置**: 画面をタップまたは「キャラクターを配置」ボタンをクリック
4. **調整**: スライダーで回転・スケールを調整
5. **クリア**: 「クリア」ボタンで全キャラクターを削除

## 📁 Project Structure

```
web-ar-character-app/
├── index.html              # メインHTML
├── style.css               # スタイルシート
├── app.js                  # メインアプリケーション
├── scene-manager.js        # Three.jsシーン管理
├── image-loader.js         # 画像読み込み
├── ar-manager.js           # カメラ・AR管理
├── ui-controller.js        # UI制御
├── assets/
│   └── characters/         # キャラクター画像
│       └── character1.png
└── README.md
```

## 🎨 Adding Custom Characters

1. PNG画像(透過背景推奨)を`assets/characters/`に配置
2. `index.html`のキャラクター選択セクションにボタンを追加:

```html
<button class="character-btn" data-character="your-character">
    <img src="assets/characters/your-character.png" alt="Your Character">
    <span>Your Character</span>
</button>
```

## 🐛 Troubleshooting

### カメラにアクセスできない
- HTTPS接続を使用しているか確認
- ブラウザのカメラ許可設定を確認
- ngrokを使用してHTTPSトンネルを作成

### キャラクターが表示されない
- ブラウザのコンソールでエラーを確認
- 画像パスが正しいか確認
- ブラウザがWebGLをサポートしているか確認

## 📝 License

MIT License

## 🙏 Acknowledgments

- Three.js - 3Dライブラリ
- ngrok - HTTPSトンネリング

---

Made with ❤️ for AR enthusiasts
