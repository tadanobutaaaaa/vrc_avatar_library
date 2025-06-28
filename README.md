# フォルダーにサムネイルをつける VRC-Avatar-Library

### 🔗 各種リンク

<div align="center">

[![Booth Store](https://img.shields.io/badge/🛒_Booth-Download_App-orange?style=for-the-badge&logo=&logoColor=white)](https://tadanobutaaaaa.booth.pm/items/6511883)
[![Chrome Extension](https://img.shields.io/badge/🧩_Chrome_Store-Install_Extension-blue?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/vrc-avatar-library/fhjadoafaejfgjcpafnoaopkpbbjganm)
[![Qiita Article](https://img.shields.io/badge/📝_Qiita-Read_Article-green?style=for-the-badge&logo=qiita&logoColor=white)](https://qiita.com/tadanobutaaaaa/items/1a0216df69e3aaa5e418)

</div>

> [!IMPORTANT]  
> **⚠️ デスクトップアプリ + Chrome拡張機能の両方が必須です**  
> 🖥️**デスクトップアプリ**と🧩**Chrome拡張機能**の両方がないと動作しません。必ず両方をダウンロード・インストールしてください。

### ✨ 概要
**VRC-Avatar-Library**は、VRChatユーザーのためのデスクトップアプリケーションです。
Boothで購入したアバター商品のフォルダに、**商品のサムネイル画像を自動でアイコンとして設定**し、アバターライブラリを視覚的に整理できます。

### 📖 開発経緯
VRChatユーザーの間で「Boothで購入したアバターのフォルダが分かりにくい」という課題がありました。

**きっかけ**は、X（旧Twitter）で手動でフォルダにサムネイルを設定する方法を紹介している投稿を見たことでした。実際に試してみると、**視認性が劇的に向上**し、アバター管理が格段に楽になりました。

しかし、**手動での作業は非常に手間**がかかります：
- 🖼️ Boothページからサムネイル画像を保存
- 🔄 画像をICO形式に変換  
- 📁 各フォルダに個別に設定

**「この作業を自動化できないだろうか？」**

そんな想いから生まれたのが、この**VRC-Avatar-Library**です。Chrome拡張機能とデスクトップアプリを連携させることで、ワンクリックでフォルダにサムネイルを設定できる環境を実現しました。

### 🚀 主な機能
- 📁 **自動フォルダアイコン設定**: Booth商品のサムネイルをフォルダアイコンに自動変換
- 🔗 **Chrome拡張機能連携**: ブラウザから直接処理を開始可能
- ⚡ **リアルタイム処理表示**: WebSocketによる処理状況のリアルタイム更新
- 🛠️ **簡単セットアップ**: 直感的なUI設計で初心者でも安心

### 💻 技術仕様
- [アプリ](https://github.com/tadanobutaaaaa/vrc_avatar_library)
    - **フロントエンド**<br/> 
    [![React](https://img.shields.io/badge/-React-696969.svg?logo=react&style=for-the-badge)](https://ja.react.dev)
    [![JavaScript](https://img.shields.io/badge/-Javascript-DBBB34.svg?logo=javascript&style=for-the-badge)](https://developer.mozilla.org/ja/docs/Web/JavaScript)
    - **UI**<br />
    [![Chakra UI](https://img.shields.io/badge/-Chakra%20ui-008080.svg?logo=chakraui&style=for-the-badge)](https://chakra-ui.com/)
    [![Lucide](https://img.shields.io/badge/-lucide-1A202C.svg?logo=lucide&style=for-the-badge)](https://lucide.dev/)
    - **バックエンド** <br />
    [![Go](https://img.shields.io/badge/-Go-76E1FE.svg?logo=go&style=for-the-badge)](https://go.dev/)
    [![Wails](https://img.shields.io/badge/-wails-D52C2D.svg?logo=wails&style=for-the-badge)](https://wails.io/)
    [![Gin](https://img.shields.io/badge/-gin-F4E511.svg?logo=gin&style=for-the-badge)](https://gin-gonic.com/)
***
- [Chrome拡張機能](https://github.com/tadanobutaaaaa/vrc-avatar-library-extension)
    - **フレームワーク**<br/> 
    [![React](https://img.shields.io/badge/-React-696969.svg?logo=react&style=for-the-badge)](https://ja.react.dev)
    [![Plasmo](https://img.shields.io/badge/-plasmo-080808.svg?logo=&style=for-the-badge)](https://www.plasmo.com)
    - **UI**<br />
    [![React Toastify](https://img.shields.io/badge/-React_toastify-66DBFB.svg?logo=&style=for-the-badge)](https://fkhadra.github.io/react-toastify/)
    - **プログラミング言語** <br />
    [![TypeScript](https://img.shields.io/badge/-Typescript-84a2d4.svg?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/)

## 📸 スクリーンショット

<div align="center">

### 🎯 メイン画面
![VRC Avatar Library メイン画面](readme_images/home.png)

メイン画面では、アプリやChrome拡張機能の詳しい使い方を知ることができます。

### ⚙️ 設定画面  
![設定画面](readme_images/folderSetting.png)

設定画面では、フォルダのパスを指定してアプリの動作を設定することができます。 

</div>
