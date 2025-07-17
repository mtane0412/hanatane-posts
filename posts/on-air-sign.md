---
title: 配信に連動するON AIRランプを作った
slug: on-air-sign
status: published
visibility: public
tags:
  - 技術の話
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec13b
ghost_updated_at: '2024-09-03T14:15:19.000Z'
published_at: '2024-09-01T22:00:48.000Z'
feature_image: >-
  https://hanatane.net/content/images/2024/09/tanenobu_Neon_sign_on_the_wall_with_the_words_ON_AIR_Illustra_e66722bc-c85f-44c0-a2ae-e7a525fc31ef_3.png
custom_excerpt: MaBeee + Raspberry Pi 5 + Firebotを使った配信に連動するON AIRランプを作った話
---
## 配信してるかどうか分かりづらい問題

今は住民一人だけなこともあり、以前と変わらずTwitch配信を続けています。そん中、住民から「デスクトップPCの前にいるときに配信しているのかしていないのかわからないから、用があっても声を掛けづらいことがある」との声が挙がりました。声をかけられると困る配信(というのもあまりないだろうけど)のときは事前に伝えるつもりなので、基本的にいつでも声をかけてもらってもいいというスタイルなのだけど、確かに分かりづらいし、なんとなく話しかけたいけど配信中だったら後でいいみたいな微妙な塩梅のときもありそうです。

というわけで、配信中か否かがわかる仕組みを導入することにしました。

## ON AIRランプをMaBeee + Raspberry Piで操作する

こういうとき真っ先に思い浮かぶのは、テレビとかラジオとかにありそうなON AIRランプですね。調べるとAmazonで数千円で入手できるっぽい。

![](https://hanatane.net/content/images/2024/09/image.png)

[今回購入したやつ](https://amzn.to/3z51uDN)

今回購入したのは[ALFOTOというところのやつ](https://amzn.to/3Mr5zW3)で、ポイントは電源がUSBと乾電池(単3×3本)に両対応しているところ。特にスマート化しなくても乾電池動作なら配線とかを考えなくて済むのでこれだけで結構便利そう。

オンエアランプを何らか制御しようと思ったときに1番に思いつくのは電源にスマートプラグを用いるものですが、色々調べるうちに下の記事を見つけました。

[

家庭内でビデオ通話中を知らせる仕組みを作る - Qiita

動機テレワーク時代。夫婦揃ってそれぞれの仕事においてビデオ通話なんてことをやっている日々ではあるが、こんなことは無いだろうか?ビデオ通話中なのに近くで声を出してしまった。ドア閉めて部屋に入って…

![](https://cdn.qiita.com/assets/favicons/public/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f.png)Qiitaooharabucyou

![](https://qiita-user-contents.imgix.net/https%3A%2F%2Fcdn.qiita.com%2Fassets%2Fpublic%2Farticle-ogp-background-412672c5f0600ab9a64263b751f1bc81.png?ixlib=rb-4.0.0&w=1200&mark64=aHR0cHM6Ly9xaWl0YS11c2VyLWNvbnRlbnRzLmltZ2l4Lm5ldC9-dGV4dD9peGxpYj1yYi00LjAuMCZ3PTk3MiZoPTM3OCZ0eHQ9JUU1JUFFJUI2JUU1JUJBJUFEJUU1JTg2JTg1JUUzJTgxJUE3JUUzJTgzJTkzJUUzJTgzJTg3JUUzJTgyJUFBJUU5JTgwJTlBJUU4JUE5JUIxJUU0JUI4JUFEJUUzJTgyJTkyJUU3JTlGJUE1JUUzJTgyJTg5JUUzJTgxJTlCJUUzJTgyJThCJUU0JUJCJTk1JUU3JUI1JTg0JUUzJTgxJUJGJUUzJTgyJTkyJUU0JUJEJTlDJUUzJTgyJThCJnR4dC1hbGlnbj1sZWZ0JTJDdG9wJnR4dC1jb2xvcj0lMjMxRTIxMjEmdHh0LWZvbnQ9SGlyYWdpbm8lMjBTYW5zJTIwVzYmdHh0LXNpemU9NTYmcz1hYzY3MjE0ZWJjNDk2OWJiNjk1ZDNiM2NiNzAyZGZiNw&mark-x=142&mark-y=57&blend64=aHR0cHM6Ly9xaWl0YS11c2VyLWNvbnRlbnRzLmltZ2l4Lm5ldC9-dGV4dD9peGxpYj1yYi00LjAuMCZoPTc2Jnc9NzcwJnR4dD0lNDBvb2hhcmFidWN5b3UmdHh0LWNvbG9yPSUyMzFFMjEyMSZ0eHQtZm9udD1IaXJhZ2lubyUyMFNhbnMlMjBXNiZ0eHQtc2l6ZT0zNiZ0eHQtYWxpZ249bGVmdCUyQ3RvcCZzPTgxN2E3NmRiMzg0MTBkY2YzNTU0MWU0NzAxMzc0ZDhk&blend-x=142&blend-y=436&blend-mode=normal&txt64=aW4g44Kz44OH44Ki44Or5qCq5byP5Lya56S-&txt-width=770&txt-clip=end%2Cellipsis&txt-color=%231E2121&txt-font=Hiragino%20Sans%20W6&txt-size=36&txt-x=156&txt-y=536&s=cc67fa41bc8b861c078c679024449e35)

](https://qiita.com/ooharabucyou/items/ec4f8efd9a11c8b84e2c)

この記事で乾電池動作できるランプとBluetooth制御できる[MaBeee](https://amzn.to/3XqLuW5)というIoT乾電池を知りました。乾電池を制御できるとなると色々応用ができそうなので、今回ぜひ試してみたくなりました。

このMaBeeeは元々プログラミング教育用の教材として展開されているようなのですが、公式が提供しているSDKがiOSとAndroidのみで、さらに開発者が趣味で開発したMacAppがあるのみという状況です。Linuxで動作すれば手持ちのRaspberry Pi 5でとりあえず試せるので非常に助かるんだけどなーと思いながらググったら先人のコードが見つかりました。

[

GitHub - sunaga-lab/mabeee-python: MaBeeeをLinux+Python3から使用するサンプル

MaBeeeをLinux+Python3から使用するサンプル. Contribute to sunaga-lab/mabeee-python development by creating an account on GitHub.

![](https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg)GitHubsunaga-lab

![](https://opengraph.githubassets.com/10c09fde40c8cc7a642c41b87e49eff96b0bbc78d1d4699fd4c1314df6a6d8b5/sunaga-lab/mabeee-python)

](https://github.com/sunaga-lab/mabeee-python)

実際に試したらうまく動作しました。ありがたい。

> pi5からオンエアランプ制御でけた。  
> あとはFirebotあたりに仕込めばOK [pic.twitter.com/meCCIUpMwO](https://t.co/meCCIUpMwO)
> 
> — たねのぶ (@mtane0412) [August 26, 2024](https://twitter.com/mtane0412/status/1828084717708804121?ref_src=twsrc%5Etfw)

他のプログラムから制御できるようにしたいのでHTTPサーバーでリクエストを受けるようにしました。このあたりは今はChatGPTがサクっと書いてくれるので非常に助かります。

工夫しどころとして、`http://pi5のローカルアドレス:5000/control`にMaBeeeのMacアドレスとPWMの値をペイロードにしてPOSTリクエストをして任意のMaBeeを操作できるように少し汎用性を持たせてあります。あとはBluetooth通信が不安定なときのために何回かリトライもさせるようにしました。

```python
import time
from flask import Flask, request, jsonify
from bluepy import btle

app = Flask(__name__)

def connect(mac_addr, retries=3, delay=5):
    for attempt in range(retries):
        try:
            peripheral = btle.Peripheral()
            peripheral.connect(mac_addr, btle.ADDR_TYPE_RANDOM)
            return peripheral
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                raise e

def write_pwm(peripheral, value):
    PWM_HANDLE = 17
    PWM_INDEX = 1
    data = bytearray(peripheral.readCharacteristic(PWM_HANDLE))
    data[PWM_INDEX] = value
    peripheral.writeCharacteristic(17, bytes(data), True)

@app.route('/control', methods=['POST'])
def control_device():
    data = request.json
    if 'mac_addr' not in data or 'pwm_value' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    mac_addr = data['mac_addr']
    pwm_value = int(data['pwm_value'])

    if not (0 <= pwm_value <= 100):
        return jsonify({'error': 'PWM value must be between 0 and 100'}), 400

    try:
        peripheral = connect(mac_addr)
        write_pwm(peripheral, pwm_value)
        peripheral.disconnect()
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## FirebotからPi5経由でオンオフさせる

さて、今回の全体構成は以下のような感じです。

![](https://hanatane.net/content/images/2024/09/------subscribe.png)

さて、Pi5から直接Twitchの配信状況を取得するという方法もありますが、結局のところ僕は配信中には[Firebot](https://firebot.app/)を使用しているので、Firebotで配信開始/終了のイベントをサブスクライブする構成にしました。Firebotは他の有名どころのTwitch Chatbotと比べると明らかにノーコードツール寄りで基本何でもできて便利です。

今回の目的はPC前にいるときの配信状況の可視化なのでこれでいいですが、例えば出先で配信しているときも光らせたいみたいな状況であれば、Pi5で制御したほうがいいと思います。(Firebotを常時起動しているような環境を除く)

Firebotの方でも使いまわししやすいようにPreset Effect ListでMaBeee操作のEffectを作っておきます。引数にMacアドレスとPWMをもたせるようにすることでFirebotからも呼び出しやすくなります。pi5のIPアドレスは固定化しておきましょう。(加えて僕はルーターの静的DNSでローカルドメインを割り振りました。便利〜。)

![](https://hanatane.net/content/images/2024/09/image-5.png)

mac\_addrとpwm\_valueを引数に持つPreset Effect Listを作成。

![](https://hanatane.net/content/images/2024/09/image-6.png)

あとは好きなタイミングでMaBeeeの操作を呼び出します。今回は配信開始時に点灯、配信終了時に消灯という設定です。

![](https://hanatane.net/content/images/2024/09/image-3.png)

mac\_addrはMaBeeeのMacアドレス

こんな感じで配信に連動したON AIRランプが出来上がりました。1番難しいプログラム部分もChatGPTに書かせてるのでかなりハードル低くなってるように感じます。

## 気づき

-   MaBeeeは単3の中に単4電池を入れて動作するが、規格の違う電池を直列で使用すると液漏れのリスクが高まるらしいので[スペーサー](https://amzn.to/3T8QNqw)を導入して単4で統一させた。
-   Pi5内蔵のBluetoothおよびMaBeeeのBluetoothも相当弱く、機器の影響をモロに受ける。壁を挟んだり、MaBeeeとPi5の間にWifiアクセスポイントがあるだけでほぼ繋がらなくなった。
-   これを改善するためにLinux動作したというレビューのある[外付けBluetoothアダプタ](https://amzn.to/3XbKeF3)を試してみたが、これもかなり不安定。[どうやら最新カーネルでPi5のときにだけ非常に不安定になるバグがあるらしい](https://github.com/raspberrypi/linux/issues/6141)。今回は面倒なので内蔵BTでやることにした。
-   上記のような状況なので、MaBeeを使う場合は現実的には近距離にMaBeee操作の母艦マシンを置くことになる。今回は稼働中のPi5でやったが、Raspberry Pi Zero 2 Wだったり安価なマイコンとかでいい気がする。
-   配線に問題がなければスマートプラグのほうが安定かつ安価にできるはず。

今回使ったもの

-   [MaBeee](https://amzn.to/3XqLuW5)
-   [ALFOTO ON AIR ライト](https://amzn.to/3Mr5zW3)
-   [BLUE LOTUS 電池スペーサー BL-224-ZU (10本)](https://amzn.to/47e2q5w)
