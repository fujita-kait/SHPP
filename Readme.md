# Smart House Prototyping Platform (SHPP)

## 1. Overview
Web APIを持ったECHONET Lite controller。Node-REDを利用。

## 2. Web API

### 2.1 Device List 関連

- Directory: /EL/deviceList
- Abstract:<br>　SPPがEL deviceを発見すると、device nameを作成し、IP addressとEOJ(3byte)の組み合わせを"deviceList"に登録する。device nameは機器種名の後に "\_" と1から始まる数字を付加して作成する（例えば一般照明の場合は "Lighting_1"）。機器制御はdevice nameを利用することで、ユーザーはEL deviceのIP addressやEOJを意識する必要がなくなる。機器種名は "deviceNameTable" で定義されている。<br>
　"getDeviceNames"を実行すると、device nameを配列で取得できる。以下のサンプルを参照のこと。<br>
　通常の操作では"clearDeviceList"や"updateDeviceList"を使う必要はない。SPPが接続するネットワークを変更した場合は"clearDeviceList"と"updateDeviceList"を実行する。

```
Sample response of "getDeviceNames"
[
  "Controller_1",
  "Refrigerator_1",
  "Lighting_1",
  "AirConditioner_1",
  "Controller_2",
  "PowerDistributionBoard_1",
  "ElectricWaterHeater_1"
]
```



- Functions

| function name(func=) | description | parameter | return value |
|:------:|:------------:|:------------:|:------------:|
| getDeviceNames | Device List内のdevice nameを全て取得する | none | [deviceName] |
| clearDeviceList | Device Listを初期化する(deviceList = {}) | none | none |
| updateDeviceList | Device Listを更新する(send GET D6) | none | none |

- Sample:
	- /EL/deviceList?func=getDeviceNames
	- /EL/deviceList?func=clearDeviceList
	- /EL/deviceList?func=updateDeviceList




### 2.2 機器制御 関連

- Directory: /EL/deviceControl
- format

	> /EL/deviceControl?device=\<device\_name>&func=\<function\_name>&param=\<data>

- Samples:
	> /EL/deviceControl?device=AirConditioner_1&func=getOperatingStatus

	> /EL/deviceControl?device=AirConditioner_1&func=setOperatingStatus&param=on

#### 2.2.1 温度センサ(DeviceName=TemperatureSensor, EOJ=0x0011)

|  機能(EPC)     | function_name                         | data |
|:-------------:|:-------------------------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus |  on, off |
| 温度計測値(0xE0)| getTemperature                        |  NumericData(signed) ℃ |

#### 2.2.2 湿度センサ(DeviceName=HumiditySensor, EOJ=0x0012)

|  機能(EPC)     | function_name                         | data |
|:-------------:|:-------------------------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus |  on, off |
| 相対湿度計測値(0xE0)| getHumidity                        |  NumericData(unsigned) % |

#### 2.2.3 気圧センサ(DeviceName=AirPressureSensor, EOJ=0x002D)

|  機能(EPC)     | function_name                         | data |
|:-------------:|:-------------------------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus |  on, off |
| 気圧計測値(0xE0)| getAirPressure                        |  NumericData(unsigned) hPa |

#### 2.2.2 エアコン(DeviceName=AirConditioner, EOJ=0x0130)

|  機能(EPC)   | function_name         | data |
|:-----------:|:---------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus    |  on, off |
| 風量設定(0xA0)| getAirFlowLevel, setAirFlowLevel |  auto, L1, L2, ... L8 |
| 運転モード設定(0xB0)| getOperatingMode, setOperatingMode |  auto, cooling, heating, dehumidification, ventilation, other |
| 温度設定値(0xB3)| getTargetTemperature, setTargetTemperature |  NumericData(unsigned)℃ |
| 室内温度計測値(0xBB)| getRoomTemperature |  NumericData(unsigned)℃ |

#### 2.2.3 空気清浄機(DeviceName= AirCleaner, EOJ=0x0135)

|  機能(EPC)   | function_name         | data |
|:-----------:|:---------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus    |  on, off |
| 風量設定(0xA0) | getAirFlowLevel, setAirFlowLevel | auto, L1, L2, ... L8 |

#### 2.2.4 電動ブラインド(DeviceName= ElectricBlind, EOJ=0x0260)

|  機能(EPC)   | function_name         | data |
|:-----------:|:---------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus    |  on, off |
| 開閉動作設定(0xE0) | getBlindStatus, setBlindStatus | open, close, stop |
| 開度レベル設定(0xE1) | getOpenRate, setOpenRate | NumericData(0〜100)% |
| ブラインド角度設定値(0xE2) | getBlindAngle, setBlindAngle | NumericData(0〜180)degree |

#### 2.2.5 一般照明(DeviceName= Lighting, EOJ=0x0290)

|  機能(EPC)   | function_name         | data |
|:-----------:|:---------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus    |  on, off |
| 照度レベル設定(0xB0) | getBrightness, setBrightness    | NumericData(0〜100)% |
| 点灯モード設定(0xB6) | getLightingMode, setLightingMode  | auto, normal, night, color |
| カラー灯モード時RGB設定(0xC0) | getColorSetting | RGB value(HEX data 3byte) ex.:FF0000(red)) |
| カラー灯モード時RGB設定(0xC0) | setColorSetting | red, lime, green, blue, white, black, cyan, magenta, yellow, or RGB value(HEX data 3byte) |

#### 2.2.6 単機能照明(DeviceName= SimpleLighting, EOJ=0x0291)

|  機能(EPC)   | function_name         | data |
|:-----------:|:---------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus    |  on, off |
| 照度レベル設定(0xB0) | getBrightness, setBrightness    | NumericData(0〜100)% |

#### 2.2.7 冷凍冷蔵庫(DeviceName= Refrigerator, EOJ=0x03B7)

|  機能(EPC)   | function_name         | data |
|:-----------:|:---------------------:|:------------:|
| 動作状態(0x80) | getOperatingStatus, setOperatingStatus    |  on, off |
| ドア開閉状態(0xB0) | getDoorStatus    | open, close |

## 3. 実装

### 3.1 Constant
定数が記述されたfileを "./node-red" directoryに置くと、file read nodeでreadできる。起動時に定数fileを読み込むには、inject nodeをrepeat設定（interval = 24hours, check "Inject once at start?")としてfile read nodeにトリガーをかける。読み込んだデータはmsg.payloadで出力されるので、function nodeで受け取り、global setすることでglobalな定数として扱える。

#### Device Name Table
以下の "deviceNameTable.json"を読み込み、objectに変換後、Global変数(deviceNameTable)として実装する。

```JSON
{
	"0x0011":"TemperatureSensor",
	"0x0012":"HumiditySensor",
	"0x002D":"AirPressureSensor",
	"0x0130":"AirConditioner",
	"0x0135":"AirCleaner",
	"0x0260":"ElectricBlind",
	"0x026B":"ElectricWaterHeater",
	"0x0272":"QuickWaterHeater",
	"0x0279":"PVPowerConditioner",
	"0x027A":"HotWaterHeatSource",
	"0x027B":"FloorHeater",
	"0x027C":"FuelCell",
	"0x027D":"StorageBattery",
	"0x027E":"EVChargerDischarger",
	"0x0288":"SmartMeter",
	"0x028A":"HVSmartMeter",
	"0x0290":"Lighting",
	"0x0291":"SimpleLighting",
	"0x02A1":"EVCharger",
	"0x03B7":"Refrigerator",
	"0x05FF":"Controller"
}
```

#### Color Name Table
以下の "colorNameTable.json"を読み込み、objectに変換後、Global変数(deviceNameTable)として実装する。色の名前と値の表記方法はCSSを参考にした。

```JSON
{
	"black":"000000",
	"red":"FF0000",
	"lime":"00FF00",
	"blue":"0000FF",
	"yellow":"FFFF00",
	"aqua":"00FFFF",
	"cyan":"00FFFF",
	"magenta":"FF00FF",
	"white":"FFFFFF",
	"green":"008000",
}
```


### 3.2 Device List DB

ネットワーク上のECHONET Lite機器の情報をDevice List DBと呼び、Global変数(deviceList)として実装する

| column name | data type | description | sample |
|:------:|:------------:|:------------:|:------------:|
| deviceName | string | device name(primary key) | AirConditioner_1 |
| ip | string | ip address | 192.168.31.2 |
| eoj | [Int, Int] | EOJ | [0x0130, 1] |

Sample:

```JavaScript
deviceList = 
{
	"AirConditioner_1":{"ip":"192.168.31.2", "eoj":[0x0130, 1]},
	"AirConditioner_2":{"ip":"192.168.31.3", "eoj":[0x0130, 1]},
	"AirConditioner_3":{"ip":"192.168.31.4", "eoj":[0x0130, 1]},
	"Lighting_1":{"ip":"192.168.31.5", "eoj":[0x0290, 1]},
	"Lighting_2":{"ip":"192.168.31.5", "eoj":[0x0290, 2]}
}
```
method

```
function setDevice(ip, eoj){
	// DBを(ip, eoj)で検索し、すでに登録済みであればfalseを返す
	// 新規の場合はdeviceNameを作成し、DBに登録し、trueを返す
	return result;
}
```

```
function getDeviceNames(){
	// DBを検索し、deviceNameをarrayで返す
	return [deviceName];
}
```

```
function getDeviceInfo(deviceName){
	// DBをdeviceNameで検索し、ipとeojをobjectで返す。
	// 存在しない場合はnullを返す
	return {ip:"ip address", eoj:[Int, Int]};
}
```

### 3.3 Get_Res受信時の処理

ネットワーク上のECHONET Lite機器の情報をDevice List DBと呼び、Global変数(deviceList)として実装する


## 4. 進捗
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

