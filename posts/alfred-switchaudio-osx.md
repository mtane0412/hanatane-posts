---
title: AlfredでMacの音声を切り替える
slug: alfred-switchaudio-osx
status: published
visibility: public
tags:
  - 技術の話
  - Alfred
  - '#Import 2025-03-18 13:46'
authors:
  - たねのぶ
ghost_id: 67d97940caff7b00011ec12c
ghost_updated_at: '2024-02-06T13:27:40.000Z'
published_at: '2024-02-06T13:27:40.000Z'
feature_image: >-
  https://hanatane.net/content/images/2024/02/tanenobu_a_man_who_wears_a_bowler_hat_with_a_purple_ribbon_is_l_91d58dce-418a-4635-bc4c-d7ecdd75edb3.png
custom_excerpt: AlfredでMacの音声を切り替えるAlfred Workflowを作った
---
BeatsFitProを使ってるのですが、BluetoothイヤホンをMacで使っているときにうっかりBluetoothマイクがオンになるとレイテンシー重視のコーデックに切り替わって音質がめちゃくちゃ悪くなります。

なのでマイクを使う前にMacbookの内蔵マイクに切り替えるのですが、毎回メニューバー→Soundをoption+クリック→マイクを選択というのがとても面倒です。さらにH1の強みを活かして頻繁に接続を切り替えるので、切り替わる度にマイクが変わってしまいます。デフォルトで内蔵マイクを使うように設定できればいいのですが…。

というわけで回避策はないかと調べたら[switchaudio-osx](https://github.com/deweller/switchaudio-osx)というコマンドラインツールがありました。あとはこれをAlfredで実行するだけでいいじゃんということで、誰かやってないかと思ったやっぱりありました。

[

GitHub - alexlafroscia/alfred-switch-audio-source: Alfred workflow to switch audio device

Alfred workflow to switch audio device. Contribute to alexlafroscia/alfred-switch-audio-source development by creating an account on GitHub.

![](https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg)GitHubalexlafroscia

![](https://opengraph.githubassets.com/8a85c221ae047f618f11238b21371a56bf10ee540e845e3494290ead7f7828b8/alexlafroscia/alfred-switch-audio-source)

](https://github.com/alexlafroscia/alfred-switch-audio-source)

しかしうまく動きません。どうも内部的にPython2を使っているのが原因っぽいです。workaroundもいくつかありそうでしたが、やりたいことはシンプルなので例のごとくChatGPTにApple Scriptを書いてもらって実装しました。

[

GitHub - mtane0412/alfred-switch-audio-osx: Alfredでswitchaudio-osxを使うworkflow

Alfredでswitchaudio-osxを使うworkflow. Contribute to mtane0412/alfred-switch-audio-osx development by creating an account on GitHub.

![](https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg)GitHubmtane0412

![](https://opengraph.githubassets.com/3da736257ddd40205cbb46c93fe0668c9878f0ad12e92c9661819b0fd1fbc9eb/mtane0412/alfred-switch-audio-osx)

](https://github.com/mtane0412/alfred-switch-audio-osx)

![動作している様子](https://hanatane.net/content/images/2024/02/3697a11d444ba6663dad7321e1afdda3-1.gif)

個人的にめちゃくちゃ便利になりました。

Alfredは開発のしやすさでPythonとかNodeを中身で使うことがありますが、それぞれの言語のバージョンで次第に使えなくなるworkflowが多い印象です。Apple ScriptはApple謹製なのでそれらに比べると長く使えるんじゃないかなーという思うのですが、実際のところどうなんでしょうね。
