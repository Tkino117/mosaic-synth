## エンドポイント定義
api/dev/active-users/         : ユーザー一覧（ipは匿名）
api/dev/active-users/number   : アクティブユーザー数
api/dev/active-users/update   : アクティブユーザーを更新
**未実装**
api/new-play/             : 新規接続
api/music/:      : 次に再生する音楽を取得
api/music/                : 音楽一覧 & 再生中の音楽

## 設計
・MVCモデルで設計
・model -> view -> controller の順に依存させ、app.ts でインスタンスの作成と依存性注入を行う
・リクエストを受けたら、index.ts -> 他Router -> controllerの何れか -> 必要に応じてmodel という流れで処理

## クラス
- app.ts : ミドルウェア作成 & サーバー起動
- controller
  - activeUserController.ts : アクティブユーザの管理を担うクラス。ユーザー処理するときはここ！
- model
  - activeUserModel.ts : Userクラスの定義、User一覧（map）の管理
  - music
    - PResourcePool.ts   : 優先度を持ったリソースの管理ができる。汎用的に作ったけど MusicPart の管理を想定
    - musicRepository.ts : Musicクラスの定義、Music の一覧を管理。
- routes
  - AbstractRouter.ts   : Routerの原型となる抽象クラス。他Router(index.ts含む)はすべてこれを継承する
  - index.ts            : / を処理する一番根元のクラス
  - activeUserRouter.ts : api/dev/active-user/ 以下を処理するクラス

## HOW TO
### 新しいルートの作り方
0. (ActiveUserRouter が参考になる)
1. AbstractRouterを継承したクラスを作る
2. constructor() に
   super();
   this.initialize();  // 内部ではinitializeRoute()が呼ばれる
   とかく。
3. initializeRoute()にルートごとの処理を書いていく。(this.router.get() や this.router.use() などを使用するべし)
4. index.ts に追加する。activeUserRouterと同じように、フィールド・コンストラクタ・initializeRoutes()の中身を設定すればOK。

### 新しいMusicの作り方
1. musicRepository の constructor() で行う。

### 次やること
musicRepositoryを作ったので、musicModelを作り、コントローラに持たせる

### やることリスト

・ユーザーと渡した音楽の紐づけ

・新たなユーザーが api/new-playに来たとき
　controller -> model のリストに追加・変更
  次の音楽idを返す

・10秒ごと
　controller -> model のリストを更新（60秒接続されていない人を削除）

・api/active-users/number-of-player
