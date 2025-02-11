// アイコン画像定数
const baseUrl = "https://pjsekai.sega.jp/assets/img/special/dl/sns_icon/icon_unite";
const iconmap = new Map()
iconmap.set("一歌", "01_1_ichika");
iconmap.set("咲希", "01_2_saki");
iconmap.set("穂波", "01_3_honami");
iconmap.set("志歩", "01_4_shiho");
iconmap.set("Lミク", "01_5_miku");
iconmap.set("Lルカ", "01_6_luka");
iconmap.set("みのり", "02_1_minori");
iconmap.set("遥", "02_2_haruka");
iconmap.set("愛莉", "02_3_airi");
iconmap.set("雫", "02_4_shizuku");
iconmap.set("Mミク", "02_5_miku");
iconmap.set("Mリン", "02_6_rin");
iconmap.set("こはね", "03_1_kohane");
iconmap.set("杏", "03_2_an");
iconmap.set("彰人", "03_3_akito");
iconmap.set("冬弥", "03_4_toya");
iconmap.set("Vミク", "03_5_miku");
iconmap.set("Vレン", "03_6_len");
iconmap.set("Vメイコ", "03_7_meiko");
iconmap.set("司", "04_1_tsukasa");
iconmap.set("えむ", "04_2_emu");
iconmap.set("寧々", "04_3_nene");
iconmap.set("類", "04_4_rui");
iconmap.set("Wミク", "04_5_miku");
iconmap.set("Wカイト", "04_6_kaito");
iconmap.set("奏", "05_1_kanade");
iconmap.set("まふゆ", "05_2_mafuyu");
iconmap.set("絵名", "05_3_ena");
iconmap.set("瑞希", "05_4_mizuki");
iconmap.set("Nミク", "05_5_miku");

// カテゴリ用定数
const categories = new Set([
    "すべて",
    "一般/すべて", "一般/ベッド", "一般/テーブル", "一般/チェア", "一般/棚", "一般/観葉植物", "一般/家電", "一般/その他",
    "小物/すべて", "小物/家電", "小物/その他",
    "壁掛け", "ディスプレイ", "ぬいぐるみ", "キャンバス",
    "壁", "床", "ラグ", "家", "道", "柵"
]);

// シリーズ用定数
const series = new Set([
    "公園", "ガーデン", "ナチュラル", "シンプルポップキッチン", "クリーンパウダールーム",
    "素朴な和室", "キッズルーム", "カジュアル", "キュート", "フレンチスタイル",
    "トレーニングルーム", "音楽スタジオ","イベント会場", "ゲームセンター", "ぽかぽかなピクニック",
    "天文学者の研究室", "きらめく流星ルーム", "かがやくクローバールーム", "鮮やかなユニゾンルーム", "はじけるクラウンルーム",
    "ひび割れたハートルーム", "はじまりのメロディルーム", "月が見える旅館", "旅人のキャンプ",
    "Leo/need", "MORE MORE JUMP！", "Vivid BAD SQUAD", "ワンダーランズ×ショウタイム", "25時、ナイトコードで。", "バーチャル・シンガー"
]);