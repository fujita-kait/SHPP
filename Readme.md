# Smart House Prototyping Platform (SHPP)

Rev. 0.1: 2017.02.20

## 1. Overview
SHPPはWeb APIでECHONET Lite(EL)機器を制御できるECHONET Liteのコントローラである。実装はNode-REDを利用している。SHPPはUIを持たず、Web APIのみである。Reference実装としてsampleのWeb APLを提供している。

## 2. Web API

### 2.1 Device List 関連

- Directory: /EL/deviceList
- Description:  
　SHPPは起動時と updateDeviceList コマンド受信時にLAN内のEL機器探索を行う。SHPPがEL deviceを発見するとdevice nameを作成し、device nameをkeyとしてIP addressとEOJ(3byte)を"deviceList"に登録する。device nameは機器種名（例：一般照明は "Lighting"）の後に "\_" と1から始まる数字を付加して作成する（例： "Lighting_1"）。device nameを利用することで、ユーザーはEL機器のIP addressやEOJを意識することなく機器制御が行える。機器種名は "deviceNameTable.json" で定義されている。  
　"getDeviceNames"を実行すると、SHPPが認識している device name のlistを取得できる。サンプルを以下に示す。  

```
Sample response of "getDeviceNames"
  "Controller_1",
  "Refrigerator_1",
  "Lighting_1",
  "AirConditioner_1",
  "Controller_2",
  "PowerDistributionBoard_1",
  "ElectricWaterHeater_1"
```

　SHPPを起動した状態で別のLANに接続を変更した場合は、"clearDeviceList" と "updateDeviceList" を実行してSHPP内のリストを更新する必要がある。

- Functions

| function name(func=) | description | parameter | return value |
|:------:|:------------:|:------------:|:------------:|
| getDeviceNames | Device List内のdevice nameを全て取得する | none | a list of deviceNames |
| clearDeviceList | Device Listを初期化する(deviceList = {}) | none | none |
| updateDeviceList | Device Listを更新する(send GET D6) | none | none |

- Sample:

	> /EL/deviceList?func=getDeviceNames  
	> /EL/deviceList?func=clearDeviceList  
	> /EL/deviceList?func=updateDeviceList


### 2.2 機器制御 関連

- Directory: /EL/deviceControl
- Description:  
　機器制御命令には、機器の状態を取得する "get" 命令と、機器の動作状態を変更する "set" 命令がある。"get"命令を実行すると値を取得できる。"set"命令はパラメータを付加して送る。機器が"set"命令を受信すると"ACK"が返ってくる。以下の説明でEOJやEPCはECHONET Liteで規定された値である。機器制御の詳細を確認するためにはこれらの値を利用してECHONET Liteの仕様書を参照すること。
　
- format
	> /EL/deviceControl?device=\<device\_name>&func=\<function\_name>&param=\<data>

- Samples:
	> /EL/deviceControl?device=AirConditioner\_1&func=getOperatingStatus  
	> /EL/deviceControl?device=AirConditioner\_1&func=setOperatingStatus&param=on

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
| カラー灯モード時RGB設定(0xC0) | getColorSetting | RGB value(HEX data 3byte) ex.:ff0000(red) |
| カラー灯モード時RGB設定(0xC0) | setColorSetting | Color Name(defined as CSS color):   red, lime, green, blue, white, black, cyan, magenta, yellow,   or RGB value(HEX data 3byte) ex.:ff0000(red) |

- Samples:

	> /EL/deviceControl?device=Lighting\_1&func= setColorSetting&param=red   
	> /EL/deviceControl?device=Lighting\_1&func= setColorSetting&param=ff0000   
	

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
以下の "colorNameTable.json"を読み込み、objectに変換後、Global変数(deviceNameTable)として実装する。色の名前と値の表記方法はCSSでの定義を参考にした。

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
| deviceName(key) | string | device name(primary key) | AirConditioner_1 |
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
