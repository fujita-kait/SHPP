## SHPP 進捗
2017.01.11

- エアコン、照明（色指定以外）、空気清浄機の実装が完了
- 電動ブラインドは実装中
- 照明のsetColorSettingのdataはcolorNameTableの値（red, greenなど）またはCSSのRGB値表記（FF0000など）
	- この実装はまだ
- node-red起動直後にgetDeviceNamesを送ると、返事が帰らない

2017.01.26

- colorNameTable.jsonを読み込む
- LightingのgetColorSettingの戻り値を CSS format #xxxxxx (RGB HEX)に変更
- LightingのsetColorSettingのparameterにCSS format #xxxxxx (RGB HEX)を追加
- LightingのsetColorSettingのparameterのcolor nameの扱いにcolorNameTable.jsonを利用

2017.01.27
- エアコン,空気清浄機,照明,ブラインド実装完了

2017.01.30

- Client側でDeviceNamesの取得を確認
- DeviceNamesのformatを、現在の"[xxx,xxx,xxx]"からxxx,xxx,xxxに変更したい

2017.01.31

- getDeviceNamesのreply formatを修正。array of stringからarrayに。 
 - 修正前: ["Lighting_1","AirConditioner_1","Lighting_2"]
 - 修正後: Lighting_1,AirConditioner_1,Lighting_2

2017.02.08

- ClientのsampleとしてAirConditioner_04.htmlを作成
	- MacのBrowserでは正常に動作する。
	- DropBoxでiPhone上で動作させると、httpで外部にアクセスしていない
	- httpのアクセスを相対パスに変更してNodeRED実装したところ、正常動作することを確認
	- ただし、iPhone上の描画が小さくて、ピンチアウトが必要
- 今後の課題
	- エアコン以外のリモコン画面の作成
	- iPhoneを想定した画面作成
	- deviceNamesからボタンを作成し、そこからリモコン画面への遷移
	- 機器情報をJSONで読み込み、リモコン画面をJavaScriptで動的に作成

2017.02.09

- ClientのsampleとしてAirConditioner_05.htmlを作成
	- iPhoneの画面サイズに対応し、Node-REDのtemplate対応した
- ClientのsampleとしてLighting_01.htmlを作成
- Menu_01.html 受信したdeviceNamesをもとにボタンを作成。ボタンをクリックするとリモコン画面が表示される。作成開始。

2017.02.13

- Menu_02.htmlで
	- XHR通信でdeviceNamesを受け取り、メニューのボタンをダイナミックに作成
	- ボタンをクリックするとエアコンや照明のリモコンが表示される（staticなHTMLがLighting_1, AirConditioner_1毎に用意してある）
- ボタンクリックでdeviceName("Lighting_1, AirConditioner_1)をNode-REDに渡し、それをもとにHTMLが送られるように修正中
	- 修正中のHTMLはLighting.html
	- Node-RED上で、deviceNameがJavaScriptでハンドリングできることを確認中

2017.02.14

- Menu_03.htmlで
	- メニューのボタンをクリックするとダイナミックにデバイス（エアコンと照明）のリモコン画面を表示する
	- AirCleanerのリモコン画面を作成 -> 未チェック
	- ElectricBlindのリモコン画面を作成中
	- SourceTreeのチュートリアルを試しているところ

2017.02.14

- ElectricBlind.html動作確認
- AirCleaner.htmlはまだ動作確認をしていない

2017.02.17

- AirCleaner.html 動作確認済み
- Refrigerator.html 動作確認済み
- deviceControl/GeneralLighting.js のsetColorSettingのparamがHEXの場合のbug fix