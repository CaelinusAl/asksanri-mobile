// data/awakenedContent.ts
import { CITY_NAMES, type CityCode } from "@/data/awakenedCities";

export type Lang = "tr" | "en";
export type Layer = "base" | "deep" | "lab";

export type CityBlock = {
  title: string;
  story: string;
  reflection: string;
};

export type City7 = {
  city: string;

  base: { tr: CityBlock; en: CityBlock };
  deepC: { tr: CityBlock; en: CityBlock };
  history: { tr: CityBlock; en: CityBlock };
  numerology: { tr: CityBlock; en: CityBlock };
  symbols: { tr: CityBlock; en: CityBlock };
  ritual: { tr: CityBlock; en: CityBlock };
  lab: { tr: CityBlock; en: CityBlock };
};

const NL = "\n";
const N2 = "\n\n";

// ✅ placeholder doldurucu (template literal YOK)
const fill = (s: string, code: string, city: string) =>
  s
    .replaceAll("${code}", code)
    .replaceAll("${city}", city)
    .replaceAll("$code", code)
    .replaceAll("$city", city);

// ✅ boş blok üretici (copy-paste kapılar için ideal)
const emptyBlock = (titleTr: string, titleEn: string): { tr: CityBlock; en: CityBlock } => ({
  tr: { title: titleTr, story: "", reflection: "" },
  en: { title: titleEn, story: "", reflection: "" },
});

// ✅ tek şehir entry üretici (başlıklar otomatik)
const makeEmptyEntry = (code: CityCode): City7 => {
  const city = CITY_NAMES?.[code] ?? "Unknown";
  return {
    city,
    base: emptyBlock(code + " · Kapı", code + " · Gate"),
    deepC: emptyBlock(code + " · Matrix Derin İfşa", code + " · Matrix Deep Reveal"),
    history: emptyBlock(code + " · Tarih Katmanı", code + " · History Layer"),
    numerology: emptyBlock(code + " · Numeroloji", code + " · Numerology"),
    symbols: emptyBlock(code + " · Sembol Decode", code + " · Symbol Decode"),
    ritual: emptyBlock(code + " · Ritüel", code + " · Ritual"),
    lab: emptyBlock(code + " · LAB", code + " · LAB"),
  };
};

/**
 * ✅ 01 örneği (sende zaten var)
 * Not: UI’da $ satırlarını filtrelediğin için burada kalabilir.
 */
export const CITY_01: Record<CityCode, City7> = {
  "01": {
    city: "Adana",

    base: {
      tr: {
        title: "01 · Ateşin Çağrısı",
        story:
          "Adana bir sıcaklık değil—bir testtir. İçindeki kıvılcım “bahane” sevmez." +
          N2 +
          "$ open_gate 01" +
          NL +
          "$ ignite",
        reflection: "Bugün seni yakan şey aslında hangi dönüşümü başlatmak istiyor?",
      },
      en: {
        title: "01 · Call of Fire",
        story:
          "Adana is not heat—it is a test. Your spark does not tolerate excuses." +
          N2 +
          "$ open_gate 01" +
          NL +
          "$ ignite",
        reflection: "What is burning in you that wants to become transformation?",
      },
    },

    deepC: {
      tr: {
        title: "01 · Matrix Derin İfşa",
        story:
          "1 = başlangıç / irade / öz." +
          N2 +
          "Ateş = yıkım değil—arınma." +
          N2 +
          "Bu kapı seni ‘konfor’dan çıkarır. Çünkü konfor, uyanışı geciktirir." +
          N2 +
          "$ deepC" +
          NL +
          "$ accept_initiation",
        reflection: "Bugün ‘başlat’ komutunu hangi alana yazıyorsun?",
      },
      en: {
        title: "01 · Matrix Deep Reveal",
        story:
          "1 = initiation / will / essence." +
          N2 +
          "Fire is not destruction—it is purification." +
          N2 +
          "This gate pulls you out of comfort. Comfort delays awakening." +
          N2 +
          "$ deepC" +
          NL +
          "$ accept_initiation",
        reflection: "Where will you write the ‘start’ command today?",
      },
    },

    history: {
      tr: {
        title: "01 · Tarih Katmanı",
        story:
          "Adana; katman katman medeniyet izidir: Hitit, Roma, Bizans, Osmanlı—hepsi aynı toprağa kayıt düşer." +
          N2 +
          "Bir şehir, insan gibi: ne kadar eskiyse, o kadar güçlü bir ‘hafıza’ taşır." +
          N2 +
          "$ history" +
          NL +
          "$ read_layers",
        reflection: "Senin geçmişinde hâlâ konuşan “en eski katman” hangisi?",
      },
      en: {
        title: "01 · History Layer",
        story:
          "Adana carries layered civilizations: Hittite, Roman, Byzantine, Ottoman—each left a record in the same soil." +
          N2 +
          "A city is like a human: the older it is, the stronger its memory." +
          N2 +
          "$ history" +
          NL +
          "$ read_layers",
        reflection: "Which ‘oldest layer’ is still speaking in your life?",
      },
    },

    numerology: {
      tr: {
        title: "01 · Numeroloji",
        story:
          "0 → saf potansiyel (boşluk)" +
          NL +
          "1 → başlangıç / karar / yön" +
          N2 +
          "01 = ‘Sıfırdan doğan irade.’" +
          N2 +
          "$ numerology" +
          NL +
          "$ sum=1",
        reflection: "Bir cümleyle: Senin iraden bugün neyi seçiyor?",
      },
      en: {
        title: "01 · Numerology",
        story:
          "0 → pure potential (void)" +
          NL +
          "1 → initiation / choice / direction" +
          N2 +
          "01 = ‘Will born from zero.’" +
          N2 +
          "$ numerology" +
          NL +
          "$ sum=1",
        reflection: "One sentence: What does your will choose today?",
      },
    },

    symbols: {
      tr: {
        title: "01 · Sembol Decode",
        story:
          "Ateş → arınma / hız / dürüstlük" +
          NL +
          "Güneş → görünürlük / açıklık" +
          NL +
          "Sıcak → bahane yakar" +
          N2 +
          "Sembol mesajı: “Erteleme yanar.”" +
          N2 +
          "$ symbols" +
          NL +
          "$ decode",
        reflection: "Hangi sembol gün içinde sana tekrar tekrar görünüyor?",
      },
      en: {
        title: "01 · Symbol Decode",
        story:
          "Fire → purification / speed / truth" +
          NL +
          "Sun → visibility / clarity" +
          NL +
          "Heat → excuses burn" +
          N2 +
          "Symbol message: “Delay burns.”" +
          N2 +
          "$ symbols" +
          NL +
          "$ decode",
        reflection: "Which symbol keeps repeating in your day?",
      },
    },

    ritual: {
      tr: {
        title: "01 · Ritüel",
        story:
          "1 dakika." +
          NL +
          "• 4 nefes al (burundan) – 4 saniye tut – 6 saniye ver." +
          NL +
          "• Son nefeste içinden söyle: “Başlatıyorum.”" +
          N2 +
          "$ ritual" +
          NL +
          "$ start_now",
        reflection: "Şimdi tek cümle yaz: Bugün neyi başlatıyorsun?",
      },
      en: {
        title: "01 · Ritual",
        story:
          "1 minute." +
          NL +
          "• 4 breaths in – hold 4 – exhale 6." +
          NL +
          "• On the last exhale, say: “I begin.”" +
          N2 +
          "$ ritual" +
          NL +
          "$ start_now",
        reflection: "Write one sentence: What do you begin today?",
      },
    },

    lab: {
      tr: {
        title: "01 · LAB: Rewrite Engine",
        story:
          "$ lab" +
          NL +
          "Kod gözü aktif. Artık olay okumuyorsun—kural motorunu görüyorsun." +
          N2 +
          "Komut: REWRITE" +
          NL +
          "Kural: “Bahane = güvenlik”" +
          NL +
          "Yeni Kural: “Eylem = güvenlik”",
        reflection: "Bir komut yaz: Bugün hangi kuralı değiştiriyorsun?",
      },
      en: {
        title: "01 · LAB: Rewrite Engine",
        story:
          "$ lab" +
          NL +
          "Code eye active. You’re not reading events—you’re reading the rule engine." +
          N2 +
          "Command: REWRITE" +
          NL +
          "Rule: “Excuse = safety”" +
          NL +
          "New Rule: “Action = safety”",
        reflection: "Write one command: Which rule do you rewrite today?",
      },
    },
  },
};

/**
 * ✅ 02 — (omurga hazır, içine senin full metnini yapıştıracaksın)
 * İstersen ben bir sonraki mesajda 02 full paketini bunun içine tam oturturum.
 */
export const CITY_02: Record<CityCode, City7> = {
  "02": {
    city: "Adiyaman",

    base: {
      tr: {
        title: "02 · Kapı",
        story:
          "Adıyaman bir yer değil—bir eşiğin adıdır." + N2 +
          "Bu kapı sana şunu öğretir: İki tarafa aynı anda bakmayı. Çünkü bir şeyi ‘tek’ sandığında, gerçeğin yarısı saklanır." + N2 +
          "02’nin yürüyüşü yavaştır ama nettir. Acele etmez; dengeler. Bir tarafın aşırı büyüdüğünde, diğer tarafın sessizce çöktüğünü gösterir." + N2 +
          "Burada mesele ‘kimin haklı olduğu’ değil; iki parçanın aynı kökte buluşmasıdır. Kapı, seni bölünmüşlüğünden birleştirir." + N2 +
          "Bu kapıdan geçerken şunu bil: Denge, zayıflık değildir. Denge, gücün sessiz formudur.",
        reflection:
          "Bugün neyi ‘öteki’ diye itiyorsun—ve aslında içinden hangi parçan konuşuyor?",
      },
      en: {
        title: "02 · The Gate",
        story:
          "Adiyaman is not just a place—it is the name of a threshold." + N2 +
          "This gate teaches you one thing: to hold two perspectives at once. When you believe something is only ‘one,’ half of the truth goes missing." + N2 +
          "The walk of 02 is slow, yet exact. It does not rush; it balances. When one side grows too loud, it reveals how the other side quietly collapses." + N2 +
          "Here the question is not ‘who is right’—it is where the two parts meet at the same root. This gate reunites what you split." + N2 +
          "Know this as you pass: balance is not weakness. Balance is power in its quiet form.",
        reflection:
          "What are you pushing away as ‘the other’—and which part of you is actually speaking?",
      },
    },

    deepC: {
      tr: {
        title: "02 · Matrix Derin İfşa",
        story:
          "Sistem 02’yi ‘ayna protokolü’ olarak çalıştırır." + N2 +
          "Bir insan birini ‘tamamen suçlu’ yaptığında, sistem der ki: ‘Gözünü tek kanala kilitledin.’ Çünkü tek kanal, seni rahatlatır; ama gerçeği azaltır." + N2 +
          "02’nin dersi şudur: İlişki, kaderin laboratuvarıdır. En çok tetiklendiğin yerde en net kod saklanır." + N2 +
          "Bu kapı seni şu noktaya getirir: ‘Benim içimde bu ne?’" + NL +
          "Bunu dediğin an, Matrix bir üst katmanı açar. Çünkü suçlama kapanıştır; idrak açılıştır." + N2 +
          "02’nin gölge testi: Haklı çıkmak için gerçeği küçültmek." + NL +
          "02’nin ışık testi: İki gerçeği de taşıyıp yeni bir yol üretmek.",
        reflection:
          "Suçlamak yerine ‘bende hangi iz var?’ diye sorsam, bugün hangi katman açılırdı?",
      },
      en: {
        title: "02 · Deep Matrix Reveal",
        story:
          "The system runs 02 as a ‘mirror protocol.’" + N2 +
          "When a person makes someone ‘fully guilty,’ the system replies: ‘You locked your vision to a single channel.’ A single channel calms you—yet it reduces reality." + N2 +
          "The lesson of 02: relationship is the laboratory of destiny. Where you are most triggered, the clearest code is hidden." + N2 +
          "This gate brings you to one sentence: ‘What is this inside me?’" + NL +
          "The moment you ask that, the Matrix opens the next layer. Blame is closure; insight is opening." + N2 +
          "Shadow test of 02: shrinking truth to feel right." + NL +
          "Light test of 02: holding two truths and creating a new way forward.",
        reflection:
          "If I replaced blame with ‘what trace is in me,’ what layer would unlock today?",
      },
    },

    history: {
      tr: {
        title: "02 · Tarih Katmanı",
        story:
          "Adıyaman’ın hafızası taşla konuşur." + N2 +
          "Nemrut’un başları düşmüş olabilir; ama mesajı hâlâ ayakta: Güç şekil değiştirir, iz kalır." + N2 +
          "Bu şehir sana ‘kalıcılık’ öğretir: Zaman heykeli yıkar; ama anlamı silemez." + N2 +
          "Tarih katmanı burada bir sembole dönüşür:" + NL +
          "‘Baş’ (ego/kimlik) düşer; ‘gövde’ (öz) kalır." + N2 +
          "Bu kapı, kimliği bırakıp özü tutmayı öğretir. Çünkü öz kalır; isim değişir. Taş kalır; biçim dağılır.",
        reflection:
          "Benim hayatımda hangi ‘baş’ düşmeli ki özüm görünür olsun?",
      },
      en: {
        title: "02 · Historical Layer",
        story:
          "Adiyaman speaks through stone memory." + N2 +
          "The heads of Nemrut may have fallen, yet the message still stands: power changes form, but the trace remains." + N2 +
          "This city teaches endurance: time can break the statue, but it cannot erase meaning." + N2 +
          "Here history becomes a symbol:" + NL +
          "the ‘head’ (ego/identity) falls; the ‘body’ (essence) stays." + N2 +
          "This gate teaches you to release identity and hold the essential. Essence remains; names change. Stone remains; form dissolves.",
        reflection:
          "What ‘head’ in my life must fall so my essence can be seen?",
      },
    },

    numerology: {
      tr: {
        title: "02 · Numeroloji",
        story:
          "02 = ikilik değil—denge." + N2 +
          "İki, karşıtları savaştırmak için değil; köprü kurmak için vardır." + N2 +
          "02’nin gölgesi:" + NL +
          "• kararsızlık" + NL +
          "• erteleme" + NL +
          "• ‘ya o ya bu’ tuzağı" + N2 +
          "02’nin ışığı:" + NL +
          "• uyum" + NL +
          "• ortak zemin" + NL +
          "• iki gerçeği aynı anda taşıyabilmek" + N2 +
          "Bu kapı şunu sorar: ‘Ben dengeyi nerede bozuyorum?’" + NL +
          "Ve ardından tek bir cevap ister: ‘Bugün hangisini büyütmeliyim?’",
        reflection:
          "Dengem bozulduğunda genelde hangi tarafım aşırı büyür—ve hangisi susar?",
      },
      en: {
        title: "02 · Numerology",
        story:
          "02 is not duality—it is balance." + N2 +
          "Two exists not to make opposites fight, but to build a bridge." + N2 +
          "Shadow of 02:" + NL +
          "• indecision" + NL +
          "• delay" + NL +
          "• the ‘either/or’ trap" + N2 +
          "Light of 02:" + NL +
          "• harmony" + NL +
          "• shared ground" + NL +
          "• holding two truths at once" + N2 +
          "This gate asks: ‘Where do I break balance?’" + NL +
          "Then it wants one answer: ‘What do I nourish today?’",
        reflection:
          "When my balance breaks, which side grows too loud—and which side goes silent?",
      },
    },

    symbols: {
      tr: {
        title: "02 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Taş hafıza: unutmaz, dönüştürür." + NL +
          "• Düşen baş: kimliğin çözülüşü." + NL +
          "• İkiz sütun: iki bakış, tek geçit." + NL +
          "• Sis: netlik gelmeden önceki ara katman." + NL +
          "• Köprü: iki parçayı birleştiren bilinç." + N2 +
          "Sembol katmanı sana şunu fısıldar:" + NL +
          "‘Bir şey netleşmeden önce sis gelir. Kaçma. Bekle. Gör.’" + N2 +
          "Sis bir hata değildir; geçiştir. 02’nin bilgeliği, geçişin içinde panik yapmamaktır.",
        reflection:
          "Şu an hayatımın hangi alanında sis var—ve ben o sisi hemen dağıtmaya mı çalışıyorum?",
      },
      en: {
        title: "02 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Stone memory: it does not forget, it transforms." + NL +
          "• The fallen head: the dissolving of identity." + NL +
          "• Twin pillars: two views, one passage." + NL +
          "• Mist: the in-between layer before clarity." + NL +
          "• Bridge: consciousness that unites two parts." + N2 +
          "The symbol layer whispers:" + NL +
          "‘Before something becomes clear, mist appears. Don’t run. Wait. See.’" + N2 +
          "Mist is not an error; it is transition. The wisdom of 02 is not to panic inside the passage.",
        reflection:
          "Where is there mist in my life right now—and am I trying to force clarity too soon?",
      },
    },

    ritual: {
      tr: {
        title: "02 · Ritüel",
        story:
          "3 Dakika Ritüeli (Denge Kapısı):" + N2 +
          "1) Bir bardak su koy. İki elini bardağın iki yanına yerleştir." + NL +
          "2) 5 nefes al. Her nefeste içinden şunu söyle: ‘İki tarafı da görüyorum.’" + NL +
          "3) Bir kağıda iki cümle yaz:" + NL +
          " – ‘Benim bir tarafım…’" + NL +
          " – ‘Öteki tarafım…’" + NL +
          "4) Son cümle: ‘Bugün köprü olmayı seçiyorum.’" + N2 +
          "Bu ritüel çatışmayı çözmek için değil; içindeki iki sesi aynı masaya oturtmak içindir." + N2 +
          "Kapanış: ‘Denge, haklılıktan daha kutsaldır.’",
        reflection:
          "Bugün ‘köprü’ olursam hangi savaş kendiliğinden biter?",
      },
      en: {
        title: "02 · Ritual",
        story:
          "3-Minute Ritual (Gate of Balance):" + N2 +
          "1) Place a glass of water in front of you. Put your hands on both sides of the glass." + NL +
          "2) Take 5 breaths. With each breath say inwardly: ‘I can see both sides.’" + NL +
          "3) Write two sentences:" + NL +
          " – ‘One part of me…’" + NL +
          " – ‘The other part of me…’" + NL +
          "4) Final line: ‘Today I choose to be the bridge.’" + N2 +
          "This ritual is not to ‘win’ a conflict, but to seat your two inner voices at the same table." + N2 +
          "Closing: ‘Balance is more sacred than being right.’",
        reflection:
          "If I become the bridge today, which war ends on its own?",
      },
    },

    lab: {
      tr: {
        title: "02 · LAB: Mirror Protocol",
        story:
          "Kod Gözü: İlişki / Ayna / Denge" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Tek kanal = rahatlık’" + NL +
          "• ‘Rahatlık = gecikme’" + NL +
          "• ‘Gecikme = aynı döngü’" + N2 +
          "Rewrite:" + NL +
          "• ‘İki kanal = gerçek’" + NL +
          "• ‘Gerçek = hareket’" + NL +
          "• ‘Hareket = kapı açılımı’",
        reflection:
          "Tek cümle yaz: Bugün iki gerçeği aynı anda nasıl tutuyorsun?",
      },
      en: {
        title: "02 · LAB: Mirror Protocol",
        story:
          "Code Eye: Relationship / Mirror / Balance" + N2 +
          "Rule Engine:" + NL +
          "• ‘Single channel = comfort’" + NL +
          "• ‘Comfort = delay’" + NL +
          "• ‘Delay = same loop’" + N2 +
          "Rewrite:" + NL +
          "• ‘Two channels = reality’" + NL +
          "• ‘Reality = movement’" + NL +
          "• ‘Movement = gate opening’",
        reflection:
          "Write one sentence: How will you hold two truths at once today?",
      },
    },
  },
};

export const CITY_03: Record<CityCode, City7> = {
  "03": {
    city: "Afyon",

    base: {
      tr: {
        title: "03 · Kapı",
        story:
          "Afyon bir şehir değil—bir şifa eşiğidir." + N2 +
          "Bu kapı sana bedenin hafızasını hatırlatır: Ağrı, rastgele bir gürültü değil; sistemin ‘dikkat’ sinyalidir." + N2 +
          "03’ün yürüyüşü üç adımlıdır: Fark et, temizle, yeniden kur." + N2 +
          "Afyon’un enerjisi ‘toprak + sıcak’ karışımıdır: Köklendirir, ısıtır, çözer." + N2 +
          "Bu kapıdan geçerken şunu bil: Şifa, geçmişi silmek değil; geçmişten kalan düğümü çözmektir.",
        reflection:
          "Bugün bedenin sana hangi mesajı tekrar tekrar söylüyor?",
      },
      en: {
        title: "03 · The Gate",
        story:
          "Afyon is not only a city—it is a threshold of healing." + N2 +
          "This gate reminds you of body-memory: pain is not random noise; it is the system’s ‘attention’ signal." + N2 +
          "The walk of 03 comes in three steps: notice, cleanse, rebuild." + N2 +
          "Afyon carries ‘earth + warmth’: it grounds you, heats you, dissolves knots." + N2 +
          "Know this as you pass: healing is not deleting the past; it is untying what the past left behind.",
        reflection:
          "What message is your body repeating to you today?",
      },
    },

    deepC: {
      tr: {
        title: "03 · Matrix Derin İfşa",
        story:
          "Sistem 03’ü ‘üçlü onarım protokolü’ olarak çalıştırır." + N2 +
          "1) Zihin: anlatıyı kurar. 2) Beden: yükü taşır. 3) Ruh: kapıyı açar." + N2 +
          "03 sana şunu söyler: Şifayı tek katmanda ararsan, döngü geri gelir." + N2 +
          "Gölge test: ‘Geçsin’ deyip anlamı görmemek." + NL +
          "Işık test: ‘Neyi taşımışım?’ deyip yükü bilinçle bırakmak." + N2 +
          "Bu kapı, bedende biriken eski komutları çözmek içindir: Utanç, suçluluk, bastırma, susma." + N2 +
          "Şifa burada bir lüks değil, bir sistem güncellemesidir.",
        reflection:
          "İyileşmesi gereken şey gerçekten ‘beden’ mi, yoksa bedenin taşıdığı ‘eski komut’ mu?",
      },
      en: {
        title: "03 · Deep Matrix Reveal",
        story:
          "The system runs 03 as a ‘triple repair protocol.’" + N2 +
          "1) Mind: builds the narrative. 2) Body: carries the load. 3) Soul: opens the gate." + N2 +
          "03 says: if you search healing in only one layer, the loop returns." + N2 +
          "Shadow test: wanting it to ‘just pass’ without seeing meaning." + NL +
          "Light test: asking ‘what have I been carrying?’ and releasing it consciously." + N2 +
          "This gate dissolves old commands stored in the body: shame, guilt, suppression, silence." + N2 +
          "Healing here is not luxury—it is a system update.",
        reflection:
          "Is what needs healing truly the body, or the ‘old command’ the body is carrying?",
      },
    },

    history: {
      tr: {
        title: "03 · Tarih Katmanı",
        story:
          "Afyon, yolların ve durakların şehridir." + N2 +
          "Anadolu’nun ortasında bir geçit gibi durur: Gelen, geçen, dinlenen, devam eden." + N2 +
          "Bu tarih katmanı şunu anlatır: Şifa bazen ‘yola devam etmek’ değil, ‘durup çözmek’tir." + N2 +
          "Geçmiş burada bir yük değil; bir ders gibi saklanır. Kapı, bu dersi bedene değil bilince taşır.",
        reflection:
          "Hayatında hangi yerde durup ‘çözmeden’ devam ediyorsun?",
      },
      en: {
        title: "03 · History Layer",
        story:
          "Afyon is a city of routes and pauses." + N2 +
          "It stands like a passage in the heart of Anatolia: arrivals, departures, rest, continuation." + N2 +
          "This layer says: healing is sometimes not ‘moving on,’ but ‘stopping to untie.’" + N2 +
          "Here the past is not a burden; it is stored like a lesson. The gate transfers the lesson from body to consciousness.",
        reflection:
          "Where in your life do you keep moving without untangling first?",
      },
    },

    numerology: {
      tr: {
        title: "03 · Numeroloji",
        story:
          "03 = yaratım + ifade + üçleme." + N2 +
          "Üç, iki kutbun arasına ‘üçüncü bir yol’ koyar." + N2 +
          "03’ün gölgesi:" + NL +
          "• dağılmak" + NL +
          "• ertelemek" + NL +
          "• başladığını bitirmemek" + N2 +
          "03’ün ışığı:" + NL +
          "• üretmek" + NL +
          "• anlatmak" + NL +
          "• iyileştirmek için yeni form bulmak" + N2 +
          "Bu kapı sorar: ‘Üçüncü yol nedir?’ Çünkü her çatışmada üçüncü yol vardır.",
        reflection:
          "Şu an iki seçenek arasında sıkıştım sanıyorsam, üçüncü yol ne olabilir?",
      },
      en: {
        title: "03 · Numerology",
        story:
          "03 = creation + expression + triad." + N2 +
          "Three places a ‘third way’ between two poles." + N2 +
          "Shadow of 03:" + NL +
          "• scattering" + NL +
          "• postponing" + NL +
          "• not finishing what you start" + N2 +
          "Light of 03:" + NL +
          "• producing" + NL +
          "• expressing" + NL +
          "• finding new form to heal" + N2 +
          "This gate asks: ‘What is the third way?’ Because in every conflict, a third way exists.",
        reflection:
          "If I feel stuck between two options, what could the third way be?",
      },
    },

    symbols: {
      tr: {
        title: "03 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Su: çözme, akıtma, temizleme." + NL +
          "• Tuz: arındırma, sınır koyma." + NL +
          "• Sıcak: kasılanı gevşetme." + NL +
          "• Toprak: köklendirme." + NL +
          "• Üç nokta: yeni yol, yeni form." + N2 +
          "Sembol mesajı: ‘Şifa akıştır. Tıkandığın yer, yön göstergesidir.’",
        reflection:
          "Benim içimde akmayan yer neresi—ve orada hangi duygu sıkıştı?",
      },
      en: {
        title: "03 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Water: dissolving, releasing, cleansing." + NL +
          "• Salt: purification, boundaries." + NL +
          "• Warmth: relaxing what is contracted." + NL +
          "• Earth: grounding." + NL +
          "• Three points: new path, new form." + N2 +
          "Symbol message: ‘Healing is flow. Where you are blocked is a direction sign.’",
        reflection:
          "Where is my inner flow blocked—and what emotion is trapped there?",
      },
    },

    ritual: {
      tr: {
        title: "03 · Ritüel",
        story:
          "3 Dakika Ritüeli (Üçlü Onarım):" + N2 +
          "1) Bir bardak su al. Bir tutam tuzu suya bırak." + NL +
          "2) 3 nefes al ve sırayla söyle:" + NL +
          " – ‘Görüyorum.’" + NL +
          " – ‘Çözüyorum.’" + NL +
          " – ‘Yeniden kuruyorum.’" + NL +
          "3) Kağıda 3 kelime yaz: ‘Eski yük / Ders / Yeni form’" + NL +
          "4) Kapanış: ‘Şifa, akışın geri dönmesidir.’",
        reflection:
          "Bugün hangi düğümü çözsem, akış geri gelir?",
      },
      en: {
        title: "03 · Ritual",
        story:
          "3-Minute Ritual (Triple Repair):" + N2 +
          "1) Take a glass of water. Drop a pinch of salt into it." + NL +
          "2) Take 3 breaths and say:" + NL +
          " – ‘I see.’" + NL +
          " – ‘I untie.’" + NL +
          " – ‘I rebuild.’" + NL +
          "3) Write 3 words: ‘Old load / Lesson / New form’" + NL +
          "4) Closing: ‘Healing is the return of flow.’",
        reflection:
          "Which knot, if untied today, brings my flow back?",
      },
    },

    lab: {
      tr: {
        title: "03 · LAB: Healing Engine",
        story:
          "Kod Gözü: Şifa / Akış / Üçüncü Yol" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Bastır = dayan’" + NL +
          "• ‘Dayan = don’" + NL +
          "• ‘Don = ağrı’" + N2 +
          "Rewrite:" + NL +
          "• ‘Gör = gevşe’" + NL +
          "• ‘Gevşe = ak’" + NL +
          "• ‘Ak = şifa’",
        reflection:
          "Tek cümle yaz: Bugün hangi eski komutu yeniden yazıyorsun?",
      },
      en: {
        title: "03 · LAB: Healing Engine",
        story:
          "Code Eye: Healing / Flow / Third Way" + N2 +
          "Rule Engine:" + NL +
          "• ‘Suppress = endure’" + NL +
          "• ‘Endure = freeze’" + NL +
          "• ‘Freeze = pain’" + N2 +
          "Rewrite:" + NL +
          "• ‘See = soften’" + NL +
          "• ‘Soften = flow’" + NL +
          "• ‘Flow = heal’",
        reflection:
          "Write one sentence: Which old command will you rewrite today?",
      },
    },
  },
};
export const CITY_04: Record<CityCode, City7> = {
  "04": {
    city: "Agri",

    base: {
      tr: {
        title: "04 · Zirve",
        story:
          "Ağrı bir şehir değil—bir zirve eşiğidir." + N2 +
          "Bu kapı sana yüksekliği öğretir. Yüksek olmak, yukarı çıkmak değil; yukarıdan bakabilmektir." + N2 +
          "04’ün enerjisi sabırdır. Zirveye aceleyle çıkılmaz." + N2 +
          "Dağ sana şunu söyler: ‘Ağırlık olmadan yükselme olmaz.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Yük sandığın şey, aslında seni güçlendiren basınçtır.",
        reflection:
          "Hayatında seni zorlayan hangi yük aslında seni yukarı taşıyor?",
      },
      en: {
        title: "04 · The Summit",
        story:
          "Agri is not only a city—it is a summit threshold." + N2 +
          "This gate teaches elevation. To be high is not to climb fast, but to see from above." + N2 +
          "04 carries patience. You do not rush a mountain." + N2 +
          "The mountain whispers: ‘Without weight, there is no rise.’" + N2 +
          "Know this: what feels heavy is building your altitude.",
        reflection:
          "Which burden in your life is actually lifting you higher?",
      },
    },

    deepC: {
      tr: {
        title: "04 · Matrix Derin İfşa",
        story:
          "04 sistemde ‘yapı protokolüdür.’" + N2 +
          "Dört köşe, dört yön, dört duvar. Temel olmadan zirve kurulmaz." + N2 +
          "Gölge test: Sabırsızlık ve yarım bırakmak." + NL +
          "Işık test: Disiplin ve istikrar." + N2 +
          "Ağrı Dağı’nın mesajı nettir: ‘Yüksek hedef, sağlam temel ister.’" + N2 +
          "Bu kapı seni iç mimarına götürür: Hayatını neyin üzerine inşa ediyorsun?",
        reflection:
          "Hedefin yüksek ama temelin yeterince sağlam mı?",
      },
      en: {
        title: "04 · Deep Matrix Reveal",
        story:
          "04 runs as ‘structure protocol’ in the system." + N2 +
          "Four corners, four directions, four walls. No summit without foundation." + N2 +
          "Shadow test: impatience and unfinished work." + NL +
          "Light test: discipline and stability." + N2 +
          "Mount Ararat’s message is clear: ‘High goals require strong foundations.’" + N2 +
          "This gate leads you to your inner architect: what are you building your life upon?",
        reflection:
          "Your goal may be high—but is your foundation strong?",
      },
    },

    history: {
      tr: {
        title: "04 · Tarih Katmanı",
        story:
          "Ağrı, efsanelerin ve sessizliğin şehridir." + N2 +
          "Nuh’un Gemisi anlatısı burada sembolleşir: Fırtına geçer, yapı kalır." + N2 +
          "Bu tarih katmanı şunu anlatır: Kriz geçicidir; inşa kalıcıdır." + N2 +
          "Dağ sabittir. Zaman akar. Sabit olanı bulmak, 04’ün dersidir.",
        reflection:
          "Fırtına geçtiğinde geriye ne kalıyor?",
      },
      en: {
        title: "04 · History Layer",
        story:
          "Agri is the land of legends and silence." + N2 +
          "The story of Noah’s Ark becomes symbol here: storms pass, structure remains." + N2 +
          "This layer teaches: crisis is temporary; what you build is lasting." + N2 +
          "The mountain stands still while time flows. Finding what stands still is the lesson of 04.",
        reflection:
          "When the storm passes, what remains in your life?",
      },
    },

    numerology: {
      tr: {
        title: "04 · Numeroloji",
        story:
          "04 = yapı / düzen / temel." + N2 +
          "Dört element: ateş, su, hava, toprak." + N2 +
          "Dört yön: kuzey, güney, doğu, batı." + N2 +
          "04’ün gölgesi:" + NL +
          "• katılık" + NL +
          "• korkudan kontrol" + N2 +
          "04’ün ışığı:" + NL +
          "• sağlamlık" + NL +
          "• güven veren istikrar" + N2 +
          "Bu kapı sorar: ‘Hayatında hangi alan yeniden yapı istiyor?’",
        reflection:
          "Hangi temel zayıf kaldı ve güçlendirilmek istiyor?",
      },
      en: {
        title: "04 · Numerology",
        story:
          "04 = structure / order / foundation." + N2 +
          "Four elements: fire, water, air, earth." + N2 +
          "Four directions: north, south, east, west." + N2 +
          "Shadow of 04:" + NL +
          "• rigidity" + NL +
          "• control from fear" + N2 +
          "Light of 04:" + NL +
          "• stability" + NL +
          "• trust through consistency" + N2 +
          "This gate asks: ‘Which area of your life needs rebuilding?’",
        reflection:
          "Which foundation in your life needs strengthening?",
      },
    },

    symbols: {
      tr: {
        title: "04 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Dağ: yükselme ve sabır." + NL +
          "• Taş: dayanıklılık." + NL +
          "• Kare: yapı ve güven." + NL +
          "• Gemi: krizden çıkış." + N2 +
          "Sembol mesajı: ‘Sabır, zirvenin kapısıdır.’",
        reflection:
          "Sabırsızlık yaptığın yer neresi?",
      },
      en: {
        title: "04 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Mountain: elevation and patience." + NL +
          "• Stone: endurance." + NL +
          "• Square: structure and safety." + NL +
          "• Ark: survival through crisis." + N2 +
          "Symbol message: ‘Patience is the gate to the summit.’",
        reflection:
          "Where are you rushing when patience is required?",
      },
    },

    ritual: {
      tr: {
        title: "04 · Ritüel",
        story:
          "4 Dakika Ritüeli (Temel Kurma):" + N2 +
          "1) Ayakta dik dur." + NL +
          "2) 4 derin nefes al." + NL +
          "3) İçinden 4 kelime söyle: ‘Güç / Sabır / Yapı / İstikrar’" + NL +
          "4) Son cümle: ‘Temelim sağlam.’",
        reflection:
          "Bugün hangi temeli güçlendiriyorsun?",
      },
      en: {
        title: "04 · Ritual",
        story:
          "4-Minute Ritual (Foundation):" + N2 +
          "1) Stand upright." + NL +
          "2) Take 4 deep breaths." + NL +
          "3) Say 4 words: ‘Strength / Patience / Structure / Stability’" + NL +
          "4) Final line: ‘My foundation is strong.’",
        reflection:
          "Which foundation are you strengthening today?",
      },
    },

    lab: {
      tr: {
        title: "04 · LAB: Structure Engine",
        story:
          "Kod Gözü: Yapı / Disiplin / Sabır" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hız = başarı’" + NL +
          "• ‘Kontrol = güven’" + N2 +
          "Rewrite:" + NL +
          "• ‘Sabır = güç’" + NL +
          "• ‘İstikrar = güven’",
        reflection:
          "Hangi hızlı kuralı sabırla değiştiriyorsun?",
      },
      en: {
        title: "04 · LAB: Structure Engine",
        story:
          "Code Eye: Structure / Discipline / Patience" + N2 +
          "Rule Engine:" + NL +
          "• ‘Speed = success’" + NL +
          "• ‘Control = safety’" + N2 +
          "Rewrite:" + NL +
          "• ‘Patience = strength’" + NL +
          "• ‘Consistency = safety’",
        reflection:
          "Which rushed rule will you rewrite with patience?",
      },
    },
  },
};
export const CITY_05: Record<CityCode, City7> = {
  "05": {
    city: "Amasya",

    base: {
      tr: {
        title: "05 · Hatıra",
        story:
          "Amasya bir şehir değil—hafızanın kıyısında duran bir aynadır." + N2 +
          "Bu kapı sana ‘hatırlama’ öğretir: Sadece geçmişi değil, kendini." + N2 +
          "05’in enerjisi nehir gibidir. Hatıra akar, ama iz bırakır." + N2 +
          "Bazen bir insanın yolu, bir cümlenin içinde saklıdır. Amasya o cümleyi bulduran kapıdır." + N2 +
          "Bu kapıdan geçerken şunu bil: Unutmak korumaz; hatırlamak özgürleştirir.",
        reflection:
          "Bugün hangi anı sana bir mesaj taşıyor?",
      },
      en: {
        title: "05 · Memory",
        story:
          "Amasya is not only a city—it is a mirror standing on the edge of memory." + N2 +
          "This gate teaches remembrance: not only the past, but yourself." + N2 +
          "05 flows like a river. Memory moves, yet it leaves a trace." + N2 +
          "Sometimes your path is hidden inside one sentence. Amasya is the gate that helps you find it." + N2 +
          "Know this as you pass: forgetting does not protect; remembering sets you free.",
        reflection:
          "Which memory is carrying a message for you today?",
      },
    },

    deepC: {
      tr: {
        title: "05 · Matrix Derin İfşa",
        story:
          "Sistem 05’i ‘hafıza protokolü’ olarak çalıştırır." + N2 +
          "Beş, değişim sayısıdır. Değişim ise geçmişin üzerindeki kilidi açar." + N2 +
          "Gölge test: ‘Geçmiş geçti’ deyip aynı döngüyü tekrar etmek." + NL +
          "Işık test: ‘Geçmiş ne öğretti?’ deyip yeni bir karar vermek." + N2 +
          "05 sana şunu söyler: Hatırlama acı değildir; acı, hatırlamayı reddetmektir." + N2 +
          "Kapı, bir anıyı geri getirir—ama seni yaralamak için değil; seni güncellemek için.",
        reflection:
          "Bugün hangi hatırayı ‘düşman’ sandım ama aslında rehbermiş?",
      },
      en: {
        title: "05 · Deep Matrix Reveal",
        story:
          "The system runs 05 as a ‘memory protocol.’" + N2 +
          "Five is the number of change. Change unlocks what the past has sealed." + N2 +
          "Shadow test: saying ‘the past is past’ while repeating the same loop." + NL +
          "Light test: asking ‘what did the past teach me?’ and making a new decision." + N2 +
          "05 says: remembering is not pain; pain is refusing remembrance." + N2 +
          "This gate brings a memory back—not to hurt you, but to update you.",
        reflection:
          "Which memory did I label as an enemy, when it was actually a guide?",
      },
    },

    history: {
      tr: {
        title: "05 · Tarih Katmanı",
        story:
          "Amasya, kaya mezarlarının ve nehrin şehridir." + N2 +
          "Taşa kazınmış isimler şunu anlatır: İnsan geçer, iz kalır." + N2 +
          "Nehir ise başka bir ders verir: İz kalır ama su hep değişir." + N2 +
          "Bu katman sana iki şeyi aynı anda öğretir: Kalıcılık ve dönüşüm. 05’in dengesi budur.",
        reflection:
          "Benim hayatımda hangi iz kalmalı, hangi su akmalı?",
      },
      en: {
        title: "05 · History Layer",
        story:
          "Amasya is the city of rock tombs and the river." + N2 +
          "Names carved into stone say: people pass, traces remain." + N2 +
          "The river teaches another lesson: traces remain, yet the water keeps changing." + N2 +
          "This layer teaches two things at once: permanence and transformation. That is the balance of 05.",
        reflection:
          "Which trace should remain in my life, and which water must flow on?",
      },
    },

    numerology: {
      tr: {
        title: "05 · Numeroloji",
        story:
          "05 = değişim / hareket / özgürleşme." + N2 +
          "Beş duyuyu yönetmek, bilinci yönetmektir." + N2 +
          "05’in gölgesi:" + NL +
          "• dağınıklık" + NL +
          "• kaçış" + NL +
          "• sürekli yenilik arayıp kökü bırakmak" + N2 +
          "05’in ışığı:" + NL +
          "• esneklik" + NL +
          "• cesaret" + NL +
          "• geçmişi ders yapıp ileri yürümek" + N2 +
          "Bu kapı sorar: ‘Değişim için neyi bırakmalısın?’",
        reflection:
          "Bugün özgürleşmek için hangi alışkanlığı bırakıyorum?",
      },
      en: {
        title: "05 · Numerology",
        story:
          "05 = change / movement / liberation." + N2 +
          "To master the five senses is to master consciousness." + N2 +
          "Shadow of 05:" + NL +
          "• distraction" + NL +
          "• escape" + NL +
          "• chasing novelty while abandoning roots" + N2 +
          "Light of 05:" + NL +
          "• adaptability" + NL +
          "• courage" + NL +
          "• turning the past into a lesson and moving forward" + N2 +
          "This gate asks: ‘What must you release to change?’",
        reflection:
          "What habit am I releasing today to become freer?",
      },
    },

    symbols: {
      tr: {
        title: "05 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Nehir: akış, dönüşüm, temizlenme." + NL +
          "• Kaya: kalıcılık, kayıt, hatıra." + NL +
          "• Oyuk/mezar: saklı mesaj, gömülü ders." + NL +
          "• Beş parmak: irade, seçim, yön." + N2 +
          "Sembol mesajı: ‘Hatıra bir kayıt değil; bir anahtardır.’",
        reflection:
          "Hangi sembol bugün seni geçmişe değil, özüne çağırıyor?",
      },
      en: {
        title: "05 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• River: flow, transformation, cleansing." + NL +
          "• Rock: permanence, record, memory." + NL +
          "• Hollow/tomb: hidden message, buried lesson." + NL +
          "• Five fingers: will, choice, direction." + N2 +
          "Symbol message: ‘Memory is not a record; it is a key.’",
        reflection:
          "Which symbol is calling you not to the past, but to your essence today?",
      },
    },

    ritual: {
      tr: {
        title: "05 · Ritüel",
        story:
          "5 Dakika Ritüeli (Hatırlama Anahtarı):" + N2 +
          "1) Bir kağıda 5 kelime yaz: ‘Korku / Ders / İstek / Karar / Özgürlük’" + NL +
          "2) 5 nefes al ve her nefeste bir kelimeyi içinden söyle." + NL +
          "3) Son cümle: ‘Hatırlıyorum ve serbest bırakıyorum.’" + N2 +
          "Kapanış: ‘Geçmişi taşıyarak değil, anlayarak özgürleşirim.’",
        reflection:
          "Bugün neyi hatırlayıp serbest bırakıyorum?",
      },
      en: {
        title: "05 · Ritual",
        story:
          "5-Minute Ritual (Key of Remembrance):" + N2 +
          "1) Write 5 words: ‘Fear / Lesson / Desire / Decision / Freedom’" + NL +
          "2) Take 5 breaths and speak one word inwardly with each breath." + NL +
          "3) Final line: ‘I remember and I release.’" + N2 +
          "Closing: ‘I become free not by carrying the past, but by understanding it.’",
        reflection:
          "What am I remembering and releasing today?",
      },
    },

    lab: {
      tr: {
        title: "05 · LAB: Memory Engine",
        story:
          "Kod Gözü: Hafıza / Değişim / Özgürleşme" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Unut = korun’" + NL +
          "• ‘Korun = kapan’" + NL +
          "• ‘Kapan = tekrar et’" + N2 +
          "Rewrite:" + NL +
          "• ‘Hatırla = anla’" + NL +
          "• ‘Anla = bırak’" + NL +
          "• ‘Bırak = özgürleş’",
        reflection:
          "Tek cümle yaz: Bugün hangi anıyı güncelleyip serbest bırakıyorsun?",
      },
      en: {
        title: "05 · LAB: Memory Engine",
        story:
          "Code Eye: Memory / Change / Liberation" + N2 +
          "Rule Engine:" + NL +
          "• ‘Forget = protect’" + NL +
          "• ‘Protect = close’" + NL +
          "• ‘Close = repeat’" + N2 +
          "Rewrite:" + NL +
          "• ‘Remember = understand’" + NL +
          "• ‘Understand = release’" + NL +
          "• ‘Release = liberate’",
        reflection:
          "Write one sentence: Which memory will you update and release today?",
      },
    },
  },
};
export const CITY_06: Record<CityCode, City7> = {
  "06": {
    city: "Ankara",

    base: {
      tr: {
        title: "06 · Merkez",
        story:
          "Ankara bir şehir değil—bir merkezdir." + N2 +
          "Bu kapı sana iç otoriteni öğretir: Karar dışarıdan gelmez; içeriden çıkar." + N2 +
          "06’nın enerjisi dengeli güçtür. Ne baskı ne zayıflık; net duruş." + N2 +
          "Bir ülkenin kalbi nasıl merkezde atıyorsa, insanın kararı da merkezinde doğar." + N2 +
          "Bu kapıdan geçerken şunu bil: Liderlik önce kendini yönetmektir.",
        reflection:
          "Bugün hayatımın hangi alanında merkezde değilim?",
      },
      en: {
        title: "06 · The Center",
        story:
          "Ankara is not only a city—it is a center." + N2 +
          "This gate teaches inner authority: decisions are not borrowed; they are born within." + N2 +
          "06 carries balanced power—not pressure, not weakness, but clear presence." + N2 +
          "As a nation’s heart beats in its capital, your decision rises from your center." + N2 +
          "Know this: leadership begins with self-governance.",
        reflection:
          "In which area of my life am I not standing at my center?",
      },
    },

    deepC: {
      tr: {
        title: "06 · Matrix Derin İfşa",
        story:
          "Sistem 06’yı ‘otorite protokolü’ olarak çalıştırır." + N2 +
          "Altı, sorumluluk sayısıdır." + N2 +
          "Gölge test: Gücü kontrolle karıştırmak." + NL +
          "Işık test: Gücü hizmete dönüştürmek." + N2 +
          "06 sana şunu söyler: Merkezde olmak hükmetmek değildir; yön vermektir." + N2 +
          "Bu kapı, içindeki yöneticiyi uyandırır. Emir değil; karar üretmeni ister.",
        reflection:
          "Gücümü kontrol için mi kullanıyorum, yön vermek için mi?",
      },
      en: {
        title: "06 · Deep Matrix Reveal",
        story:
          "The system runs 06 as ‘authority protocol.’" + N2 +
          "Six is the number of responsibility." + N2 +
          "Shadow test: confusing power with control." + NL +
          "Light test: turning power into service." + N2 +
          "06 says: to be centered is not to dominate; it is to direct." + N2 +
          "This gate awakens the leader within—not to command, but to decide.",
        reflection:
          "Am I using my power to control—or to guide?",
      },
    },

    history: {
      tr: {
        title: "06 · Tarih Katmanı",
        story:
          "Ankara, başkenttir. Başkent, sadece coğrafya değil; irade beyanıdır." + N2 +
          "Kurtuluşun ve kuruluşun şehri olarak tarih şunu öğretir:" + NL +
          "Merkez değiştiğinde kader değişir." + N2 +
          "Bu katman sana bir soru bırakır: Hayatının başkenti neresi?",
        reflection:
          "Hayatımın başkenti gerçekten iç merkezim mi?",
      },
      en: {
        title: "06 · History Layer",
        story:
          "Ankara is a capital. A capital is not geography; it is declaration of will." + N2 +
          "As the city of liberation and foundation, history teaches:" + NL +
          "When the center shifts, destiny shifts." + N2 +
          "This layer leaves you with a question: where is the capital of your life?",
        reflection:
          "Is my life governed from my inner center?",
      },
    },

    numerology: {
      tr: {
        title: "06 · Numeroloji",
        story:
          "06 = sorumluluk / denge / aile / yönetim." + N2 +
          "Altı, koruma ve yapı sayısıdır." + N2 +
          "06’nın gölgesi:" + NL +
          "• aşırı kontrol" + NL +
          "• kendini feda etme" + N2 +
          "06’nın ışığı:" + NL +
          "• denge" + NL +
          "• hizmet bilinci" + NL +
          "• kararlı liderlik" + N2 +
          "Bu kapı sorar: ‘Sorumluluğu yük mü, görev mi görüyorum?’",
        reflection:
          "Bugün hangi sorumluluğu bilinçle üstleniyorum?",
      },
      en: {
        title: "06 · Numerology",
        story:
          "06 = responsibility / balance / governance." + N2 +
          "Six carries protection and structure." + N2 +
          "Shadow of 06:" + NL +
          "• overcontrol" + NL +
          "• self-sacrifice without awareness" + N2 +
          "Light of 06:" + NL +
          "• balance" + NL +
          "• conscious service" + NL +
          "• steady leadership" + N2 +
          "This gate asks: ‘Do I see responsibility as burden or purpose?’",
        reflection:
          "Which responsibility do I consciously embrace today?",
      },
    },

    symbols: {
      tr: {
        title: "06 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kale: koruma ve merkez." + NL +
          "• Taç: yetki ve sorumluluk." + NL +
          "• Terazi: denge." + NL +
          "• Başkent: yön." + N2 +
          "Sembol mesajı: ‘Merkezde dur, denge kendiliğinden gelir.’",
        reflection:
          "Benim kalem nerede? Merkezim neresi?",
      },
      en: {
        title: "06 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Castle: protection and center." + NL +
          "• Crown: authority and responsibility." + NL +
          "• Scale: balance." + NL +
          "• Capital: direction." + N2 +
          "Symbol message: ‘Stand at the center and balance will follow.’",
        reflection:
          "Where is my inner capital?",
      },
    },

    ritual: {
      tr: {
        title: "06 · Ritüel",
        story:
          "6 Dakika Ritüeli (Merkezlenme):" + N2 +
          "1) Dik otur." + NL +
          "2) 6 derin nefes al." + NL +
          "3) Elini göğsüne koy ve de ki: ‘Merkezim burası.’" + NL +
          "4) Son cümle: ‘Kararımı ben veriyorum.’",
        reflection:
          "Bugün hangi kararı merkezimden veriyorum?",
      },
      en: {
        title: "06 · Ritual",
        story:
          "6-Minute Ritual (Centering):" + N2 +
          "1) Sit upright." + NL +
          "2) Take 6 deep breaths." + NL +
          "3) Place your hand on your chest and say: ‘My center is here.’" + NL +
          "4) Final line: ‘I decide.’",
        reflection:
          "Which decision am I making from my center today?",
      },
    },

    lab: {
      tr: {
        title: "06 · LAB: Authority Engine",
        story:
          "Kod Gözü: Merkez / Sorumluluk / Yön" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Kontrol = güven’" + NL +
          "• ‘Baskı = güç’" + N2 +
          "Rewrite:" + NL +
          "• ‘Denge = güven’" + NL +
          "• ‘Hizmet = güç’",
        reflection:
          "Tek cümle yaz: Bugün gücü nasıl yeniden tanımlıyorsun?",
      },
      en: {
        title: "06 · LAB: Authority Engine",
        story:
          "Code Eye: Center / Responsibility / Direction" + N2 +
          "Rule Engine:" + NL +
          "• ‘Control = safety’" + NL +
          "• ‘Pressure = power’" + N2 +
          "Rewrite:" + NL +
          "• ‘Balance = safety’" + NL +
          "• ‘Service = power’",
        reflection:
          "Write one sentence: How do you redefine power today?",
      },
    },
  },
};
export const CITY_07: Record<CityCode, City7> = {
  "07": {
    city: "Antalya",

    base: {
      tr: {
        title: "07 · Akış",
        story:
          "Antalya bir şehir değil—bir akıştır." + N2 +
          "Bu kapı sana şunu öğretir: Keyif bir kaçış değil, bir frekanstır." + N2 +
          "07’nin enerjisi su gibi çalışır: Arındırır, yumuşatır, yeniden başlatır." + N2 +
          "Güneşin altında görünen her şey, içindeki gölgeleri de aydınlatır. Bu kapı hem ışık hem ayna taşır." + N2 +
          "Buradan geçerken şunu bil: Gerçek özgürlük, keyfi bilinçle taşıyabilmektir.",
        reflection:
          "Bugün keyfi kaçış mı yapıyorum, yoksa bilinçle mi yaşıyorum?",
      },
      en: {
        title: "07 · Flow",
        story:
          "Antalya is not only a city—it is flow." + N2 +
          "This gate teaches: pleasure is not escape; it is frequency." + N2 +
          "07 works like water: it cleanses, softens, and restarts." + N2 +
          "Under the sun, everything becomes visible—your shadows too. This gate carries both light and mirror." + N2 +
          "Know this as you pass: true freedom is holding pleasure with consciousness.",
        reflection:
          "Am I using pleasure as escape—or as conscious living today?",
      },
    },

    deepC: {
      tr: {
        title: "07 · Matrix Derin İfşa",
        story:
          "Sistem 07’yi ‘algı protokolü’ olarak çalıştırır." + N2 +
          "Yedi, içe dönüş sayısıdır: Görünene değil, görünmeyene bakar." + N2 +
          "Gölge test: Duyguyu bastırıp hazla örtmek." + NL +
          "Işık test: Duyguyu görmek ve hazla dengelemek." + N2 +
          "07 sana şunu söyler: Keyif seni uyuşturuyorsa, bir şey kaçıyorsun; keyif seni açıyorsa, bir şey hatırlıyorsun." + N2 +
          "Bu kapı ‘kaçış’ ile ‘arınma’yı ayırır. Su aynı sudur; niyet farklıdır.",
        reflection:
          "Keyif beni uyuşturuyor mu, açıyor mu—bunun kanıtı ne?",
      },
      en: {
        title: "07 · Deep Matrix Reveal",
        story:
          "The system runs 07 as a ‘perception protocol.’" + N2 +
          "Seven is the number of inward seeing: it looks beyond what is visible." + N2 +
          "Shadow test: suppressing emotion and covering it with pleasure." + NL +
          "Light test: seeing the emotion and balancing it with pleasure." + N2 +
          "07 says: if pleasure numbs you, you are escaping; if pleasure opens you, you are remembering." + N2 +
          "This gate separates ‘escape’ from ‘cleansing.’ The water is the same—intention changes everything.",
        reflection:
          "Does pleasure numb me or open me—and what is my proof?",
      },
    },

    history: {
      tr: {
        title: "07 · Tarih Katmanı",
        story:
          "Antalya, kıyı hafızası taşır." + N2 +
          "Kıyı şehirleri iki şeyi aynı anda öğretir: Gelmek ve gitmek." + N2 +
          "Deniz her şeyi geri verir; ama aynı şekilde alır." + N2 +
          "Bu katman şunu fısıldar: Hayat bir kıyıdır. Tutunmayı bıraktığında akış başlar.",
        reflection:
          "Ben neye tutunuyorum ki akış başlayamıyor?",
      },
      en: {
        title: "07 · History Layer",
        story:
          "Antalya carries coastal memory." + N2 +
          "Coastal cities teach two things at once: arrival and departure." + N2 +
          "The sea returns everything—and takes it the same way." + N2 +
          "This layer whispers: life is a shoreline. When you stop gripping, flow begins.",
        reflection:
          "What am I holding onto that prevents flow?",
      },
    },

    numerology: {
      tr: {
        title: "07 · Numeroloji",
        story:
          "07 = iç bilgelik / sezgi / arınma." + N2 +
          "Yedi, sessizleştiğinde konuşur." + N2 +
          "07’nin gölgesi:" + NL +
          "• aşırı düşünme" + NL +
          "• yalnızlaşma" + NL +
          "• duygudan kaçma" + N2 +
          "07’nin ışığı:" + NL +
          "• sezgi" + NL +
          "• derin algı" + NL +
          "• ruhsal temizlik" + N2 +
          "Bu kapı sorar: ‘Sessiz kaldığında hangi gerçek yükseliyor?’",
        reflection:
          "Sessizlikte duyduğum en net cümle ne?",
      },
      en: {
        title: "07 · Numerology",
        story:
          "07 = inner wisdom / intuition / cleansing." + N2 +
          "Seven speaks when you become quiet." + N2 +
          "Shadow of 07:" + NL +
          "• overthinking" + NL +
          "• isolation" + NL +
          "• escaping emotion" + N2 +
          "Light of 07:" + NL +
          "• intuition" + NL +
          "• deep perception" + NL +
          "• spiritual purification" + N2 +
          "This gate asks: ‘When you go quiet, which truth rises?’",
        reflection:
          "What is the clearest sentence I hear in silence?",
      },
    },

    symbols: {
      tr: {
        title: "07 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Deniz: teslimiyet ve temizlenme." + NL +
          "• Güneş: görünürlük ve dürüstlük." + NL +
          "• Dalga: duygunun hareketi." + NL +
          "• Kıyı: sınır ve geçiş." + NL +
          "• Yedi nokta: iç görüş." + N2 +
          "Sembol mesajı: ‘Dalga gelince kaçma; dalga seni yıkar.’",
        reflection:
          "Dalgadan kaçtığım yer neresi?",
      },
      en: {
        title: "07 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Sea: surrender and cleansing." + NL +
          "• Sun: visibility and honesty." + NL +
          "• Wave: movement of emotion." + NL +
          "• Shoreline: boundary and passage." + NL +
          "• Seven points: inner sight." + N2 +
          "Symbol message: ‘When the wave comes, don’t run; it washes you.’",
        reflection:
          "Where am I running from the wave?",
      },
    },

    ritual: {
      tr: {
        title: "07 · Ritüel",
        story:
          "7 Dakika Ritüeli (Su ve Güneş):" + N2 +
          "1) Bir bardak suyu eline al." + NL +
          "2) 7 nefes al ve her nefeste bir kelime söyle: ‘Açık / Temiz / Hafif / Dürüst / Sakin / Akış / Şükür’" + NL +
          "3) Son cümle: ‘Kaçmıyorum. Arınıyorum.’" + N2 +
          "Kapanış: ‘Keyfi bilinçle taşıyorum.’",
        reflection:
          "Bugün hangi duygumu suya bırakıyorum?",
      },
      en: {
        title: "07 · Ritual",
        story:
          "7-Minute Ritual (Water and Sun):" + N2 +
          "1) Hold a glass of water." + NL +
          "2) Take 7 breaths and speak one word per breath: ‘Open / Clean / Light / Honest / Calm / Flow / Gratitude’" + NL +
          "3) Final line: ‘I’m not running. I’m cleansing.’" + N2 +
          "Closing: ‘I carry pleasure with consciousness.’",
        reflection:
          "Which emotion am I releasing into water today?",
      },
    },

    lab: {
      tr: {
        title: "07 · LAB: Perception Engine",
        story:
          "Kod Gözü: Algı / Sezgi / Arınma" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Haz = kaçış’" + NL +
          "• ‘Kaçış = uyuşma’" + N2 +
          "Rewrite:" + NL +
          "• ‘Haz = frekans’" + NL +
          "• ‘Frekans = açıklık’" + NL +
          "• ‘Açıklık = özgürlük’",
        reflection:
          "Tek cümle yaz: Bugün keyfi nasıl bilinçle taşıyorsun?",
      },
      en: {
        title: "07 · LAB: Perception Engine",
        story:
          "Code Eye: Perception / Intuition / Cleansing" + N2 +
          "Rule Engine:" + NL +
          "• ‘Pleasure = escape’" + NL +
          "• ‘Escape = numbness’" + N2 +
          "Rewrite:" + NL +
          "• ‘Pleasure = frequency’" + NL +
          "• ‘Frequency = openness’" + NL +
          "• ‘Openness = freedom’",
        reflection:
          "Write one sentence: How will you hold pleasure consciously today?",
      },
    },
  },
};
export const CITY_08: Record<CityCode, City7> = {
  "08": {
    city: "Artvin",

    base: {
      tr: {
        title: "08 · Kök",
        story:
          "Artvin bir şehir değil—kök bilincidir." + N2 +
          "Bu kapı sana yüksekten bakmayı değil, derine inmeyi öğretir." + N2 +
          "08’in enerjisi dağ ve orman gibidir: Sessiz ama güçlü." + N2 +
          "Kökü sağlam olan ağaç rüzgârdan korkmaz." + N2 +
          "Bu kapıdan geçerken şunu bil: Yalnızlık zayıflık değil; güç birikimidir.",
        reflection:
          "Bugün hangi kökümü güçlendirmem gerekiyor?",
      },
      en: {
        title: "08 · Root",
        story:
          "Artvin is not only a city—it is root consciousness." + N2 +
          "This gate teaches not height, but depth." + N2 +
          "08 carries the energy of mountains and forests: silent yet powerful." + N2 +
          "A tree with strong roots does not fear the wind." + N2 +
          "Know this: solitude is not weakness; it is strength gathering.",
        reflection:
          "Which root in my life needs strengthening today?",
      },
    },

    deepC: {
      tr: {
        title: "08 · Matrix Derin İfşa",
        story:
          "Sistem 08’i ‘güç protokolü’ olarak çalıştırır." + N2 +
          "Sekiz, sonsuzluk formunun dikey halidir: Yukarı ve aşağı aynı akıştır." + N2 +
          "Gölge test: Gücü bastırmak ya da yanlış yerde göstermek." + NL +
          "Işık test: Gücü içten beslemek." + N2 +
          "08 sana şunu söyler: Gerçek güç bağırmaz; kök salar." + N2 +
          "Bu kapı seni içsel dayanıklılıkla tanıştırır.",
        reflection:
          "Gücümü dışarı mı ispatlıyorum, içimde mi büyütüyorum?",
      },
      en: {
        title: "08 · Deep Matrix Reveal",
        story:
          "The system runs 08 as ‘power protocol.’" + N2 +
          "Eight is the vertical form of infinity: above and below flow as one." + N2 +
          "Shadow test: suppressing power or displaying it in the wrong place." + NL +
          "Light test: cultivating power internally." + N2 +
          "08 says: true strength does not shout; it roots." + N2 +
          "This gate introduces you to inner resilience.",
        reflection:
          "Am I proving my power outside—or growing it inside?",
      },
    },

    history: {
      tr: {
        title: "08 · Tarih Katmanı",
        story:
          "Artvin, dağların ve sınırların şehridir." + N2 +
          "Sınır, korku değil; bilinçtir." + N2 +
          "Tarih burada şunu öğretir: Coğrafya zor olabilir; ama insanın karakteri daha güçlü olabilir." + N2 +
          "Yüksek yerde yaşamak, bakış açısını genişletir.",
        reflection:
          "Sınırlarımı korkudan mı koyuyorum, bilinçten mi?",
      },
      en: {
        title: "08 · History Layer",
        story:
          "Artvin is the land of mountains and borders." + N2 +
          "A border is not fear; it is awareness." + N2 +
          "History here teaches: geography may be harsh, but character can be stronger." + N2 +
          "Living high expands perspective.",
        reflection:
          "Do I set my boundaries from fear or from awareness?",
      },
    },

    numerology: {
      tr: {
        title: "08 · Numeroloji",
        story:
          "08 = güç / bolluk / denge." + N2 +
          "Sekiz, yukarı çıkan ve aşağı inen enerjiyi dengeler." + N2 +
          "08’in gölgesi:" + NL +
          "• güç hırsı" + NL +
          "• kontrol takıntısı" + N2 +
          "08’in ışığı:" + NL +
          "• sağlamlık" + NL +
          "• bilinçli otorite" + NL +
          "• sabırla büyüyen başarı" + N2 +
          "Bu kapı sorar: ‘Gücün kaynağı nerede?’",
        reflection:
          "Gerçek gücüm hangi kökten besleniyor?",
      },
      en: {
        title: "08 · Numerology",
        story:
          "08 = power / abundance / balance." + N2 +
          "Eight balances upward and downward energy." + N2 +
          "Shadow of 08:" + NL +
          "• ambition without awareness" + NL +
          "• obsession with control" + N2 +
          "Light of 08:" + NL +
          "• stability" + NL +
          "• conscious authority" + NL +
          "• success growing with patience" + N2 +
          "This gate asks: ‘Where is your power sourced from?’",
        reflection:
          "From which root does my real strength grow?",
      },
    },

    symbols: {
      tr: {
        title: "08 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Ağaç: kök ve yükseliş." + NL +
          "• Dağ: dayanıklılık." + NL +
          "• Sisli orman: bilinmeyenle barış." + NL +
          "• Sonsuzluk işareti: süreklilik." + N2 +
          "Sembol mesajı: ‘Yüksek olmak için derin ol.’",
        reflection:
          "Derinliğim yeterince güçlü mü?",
      },
      en: {
        title: "08 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Tree: root and rise." + NL +
          "• Mountain: endurance." + NL +
          "• Misty forest: peace with the unknown." + NL +
          "• Infinity symbol: continuity." + N2 +
          "Symbol message: ‘To rise high, grow deep.’",
        reflection:
          "Is my depth strong enough to support my height?",
      },
    },

    ritual: {
      tr: {
        title: "08 · Ritüel",
        story:
          "8 Dakika Ritüeli (Köklenme):" + N2 +
          "1) Ayakta dur ve ayak tabanlarını yere bastığını hisset." + NL +
          "2) 8 nefes al." + NL +
          "3) İçinden söyle: ‘Kökleniyorum.’" + NL +
          "4) Son cümle: ‘Gücüm içeride.’",
        reflection:
          "Bugün hangi alanda daha derin kök salıyorum?",
      },
      en: {
        title: "08 · Ritual",
        story:
          "8-Minute Ritual (Rooting):" + N2 +
          "1) Stand and feel your feet on the ground." + NL +
          "2) Take 8 breaths." + NL +
          "3) Say inwardly: ‘I root.’" + NL +
          "4) Final line: ‘My power is within.’",
        reflection:
          "Where am I rooting deeper today?",
      },
    },

    lab: {
      tr: {
        title: "08 · LAB: Power Engine",
        story:
          "Kod Gözü: Güç / Kök / Denge" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Güç = baskı’" + NL +
          "• ‘Baskı = kontrol’" + N2 +
          "Rewrite:" + NL +
          "• ‘Güç = denge’" + NL +
          "• ‘Denge = süreklilik’",
        reflection:
          "Tek cümle yaz: Gücü bugün nasıl tanımlıyorsun?",
      },
      en: {
        title: "08 · LAB: Power Engine",
        story:
          "Code Eye: Power / Root / Balance" + N2 +
          "Rule Engine:" + NL +
          "• ‘Power = pressure’" + NL +
          "• ‘Pressure = control’" + N2 +
          "Rewrite:" + NL +
          "• ‘Power = balance’" + NL +
          "• ‘Balance = continuity’",
        reflection:
          "Write one sentence: How do you define power today?",
      },
    },
  },
};
export const CITY_09: Record<CityCode, City7> = {
  "09": {
    city: "Aydin",

    base: {
      tr: {
        title: "09 · Işık",
        story:
          "Aydın bir şehir değil—ışığın kendisidir." + N2 +
          "Bu kapı sana görünür olmayı öğretir: Saklanmak, bazen korunma değil gecikmedir." + N2 +
          "09’un enerjisi tamamlanmadır. Yarım kalan şeyleri kapatır, açıkları aydınlatır." + N2 +
          "Bu kapıdan geçerken şunu bil: Işık sadece dışarıda değil; kararın netliğinde doğar." + N2 +
          "Aydın’ın mesajı nettir: Gör, anla, bitir ve bırak.",
        reflection:
          "Bugün hangi konuyu netleştirip tamamlamam gerekiyor?",
      },
      en: {
        title: "09 · Light",
        story:
          "Aydin is not only a city—it is light." + N2 +
          "This gate teaches visibility: hiding is sometimes not protection, but delay." + N2 +
          "09 carries completion. It closes what is unfinished and illuminates what is unclear." + N2 +
          "Know this: light is not only outside—it is born in the clarity of your decision." + N2 +
          "Aydin’s message is simple: see, understand, complete, and release.",
        reflection:
          "What do I need to clarify and complete today?",
      },
    },

    deepC: {
      tr: {
        title: "09 · Matrix Derin İfşa",
        story:
          "Sistem 09’u ‘tamamlama protokolü’ olarak çalıştırır." + N2 +
          "Dokuz, döngü kapatır. Kapanmayan döngü, aynı dersi farklı yüzlerle getirir." + N2 +
          "Gölge test: Bitirmeyi ertelemek, vedayı geciktirmek." + NL +
          "Işık test: Şefkatle kapatmak." + N2 +
          "09 sana şunu söyler: Bazı kapılar açılmak için değil, kapanmak için gelir." + N2 +
          "Kapanış bir kayıp değil; bir enerji iadesidir.",
        reflection:
          "Hangi döngüyü kapatırsam enerjim bana geri döner?",
      },
      en: {
        title: "09 · Deep Matrix Reveal",
        story:
          "The system runs 09 as a ‘completion protocol.’" + N2 +
          "Nine closes loops. An unclosed loop returns the same lesson with different faces." + N2 +
          "Shadow test: postponing endings and delaying goodbye." + NL +
          "Light test: closing with compassion." + N2 +
          "09 says: some gates arrive not to open, but to close." + N2 +
          "Closure is not loss—it is energy returned.",
        reflection:
          "Which loop, once closed, returns my energy to me?",
      },
    },

    history: {
      tr: {
        title: "09 · Tarih Katmanı",
        story:
          "Aydın, bereket ve üretimin coğrafyasıdır." + N2 +
          "Tarih katmanı şunu öğretir: Toprak aydınlanınca ürün verir." + N2 +
          "İnsanın toprağı da bilincidir. Bilinç aydınlanınca hayat meyve verir." + N2 +
          "Bu katman, ‘ışık = üretim’ dersini bırakır.",
        reflection:
          "Benim içimde hangi alan ışık alınca meyve verecek?",
      },
      en: {
        title: "09 · History Layer",
        story:
          "Aydin is a land of fertility and production." + N2 +
          "This layer teaches: when soil is lit, it bears fruit." + N2 +
          "Your inner soil is consciousness. When it is illuminated, life produces fruit." + N2 +
          "This layer leaves the lesson: light becomes creation.",
        reflection:
          "Which area in me will bear fruit once it receives light?",
      },
    },

    numerology: {
      tr: {
        title: "09 · Numeroloji",
        story:
          "09 = tamamlanma / hizmet / bilgelik." + N2 +
          "Dokuz, hem kapanış hem armağandır." + N2 +
          "09’un gölgesi:" + NL +
          "• bitirememe" + NL +
          "• fazla yük taşıma" + N2 +
          "09’un ışığı:" + NL +
          "• bırakma" + NL +
          "• şefkat" + NL +
          "• döngü kapatma cesareti" + N2 +
          "Bu kapı sorar: ‘Kapatmak mı, sürdürmek mi?’",
        reflection:
          "Bugün hangi şeyi şefkatle kapatabilirim?",
      },
      en: {
        title: "09 · Numerology",
        story:
          "09 = completion / service / wisdom." + N2 +
          "Nine is both ending and gift." + N2 +
          "Shadow of 09:" + NL +
          "• inability to finish" + NL +
          "• carrying too much" + N2 +
          "Light of 09:" + NL +
          "• release" + NL +
          "• compassion" + NL +
          "• courage to close the loop" + N2 +
          "This gate asks: ‘Close—or continue?’",
        reflection:
          "What can I close with compassion today?",
      },
    },

    symbols: {
      tr: {
        title: "09 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Işık: netlik ve açıklık." + NL +
          "• Güneş: görünürlük." + NL +
          "• Hasat: emeğin sonucu." + NL +
          "• Kapı eşiği: kapanış ve geçiş." + N2 +
          "Sembol mesajı: ‘Netleştir, tamamla, bırak.’",
        reflection:
          "Ben hangi eşiği geçmeye hazır değilim?",
      },
      en: {
        title: "09 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Light: clarity and openness." + NL +
          "• Sun: visibility." + NL +
          "• Harvest: the result of effort." + NL +
          "• Threshold: closure and transition." + N2 +
          "Symbol message: ‘Clarify, complete, release.’",
        reflection:
          "Which threshold am I not yet ready to cross?",
      },
    },

    ritual: {
      tr: {
        title: "09 · Ritüel",
        story:
          "9 Dakika Ritüeli (Kapanış Işığı):" + N2 +
          "1) Bir kağıda ‘bitmemiş’ bir konuyu yaz." + NL +
          "2) 9 nefes al. Her nefeste şu kelimeyi söyle: ‘Netlik’" + NL +
          "3) Son cümle: ‘Kapatıyorum ve serbest bırakıyorum.’" + N2 +
          "Kapanış: ‘Enerjim bana dönüyor.’",
        reflection:
          "Bugün neyi kapatırsam hafiflerim?",
      },
      en: {
        title: "09 · Ritual",
        story:
          "9-Minute Ritual (Light of Closure):" + N2 +
          "1) Write one unfinished topic." + NL +
          "2) Take 9 breaths. With each breath say: ‘Clarity’" + NL +
          "3) Final line: ‘I close and I release.’" + N2 +
          "Closing: ‘My energy returns to me.’",
        reflection:
          "What can I close today to feel lighter?",
      },
    },

    lab: {
      tr: {
        title: "09 · LAB: Completion Engine",
        story:
          "Kod Gözü: Netlik / Kapanış / Enerji İadesi" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Bırakırsam kaybederim’" + NL +
          "• ‘Kapanış = acı’" + N2 +
          "Rewrite:" + NL +
          "• ‘Bırakırsam hafiflerim’" + NL +
          "• ‘Kapanış = enerji iadesi’",
        reflection:
          "Tek cümle yaz: Bugün hangi döngüyü kapatıyorsun?",
      },
      en: {
        title: "09 · LAB: Completion Engine",
        story:
          "Code Eye: Clarity / Closure / Energy Return" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I let go, I lose’" + NL +
          "• ‘Closure = pain’" + N2 +
          "Rewrite:" + NL +
          "• ‘If I let go, I lighten’" + NL +
          "• ‘Closure = energy returned’",
        reflection:
          "Write one sentence: Which loop are you closing today?",
      },
    },
  },
};
export const CITY_10: Record<CityCode, City7> = {
  "10": {
    city: "Balikesir",

    base: {
      tr: {
        title: "10 · Bereket",
        story:
          "Balıkesir bir şehir değil—bereketin düzenidir." + N2 +
          "Bu kapı sana şunu öğretir: Bolluk sadece istemekle değil, dengeyle akar." + N2 +
          "10’un enerjisi ‘toprak + su’ gibidir: Üretir, besler, çoğaltır." + N2 +
          "Burada bereket, gösteriş değil; sürdürülebilirliktir." + N2 +
          "Bu kapıdan geçerken şunu bil: Gerçek bolluk, hayatını taşıyabilen sistem kurmaktır.",
        reflection:
          "Bugün bolluk için hangi düzeni kurmam gerekiyor?",
      },
      en: {
        title: "10 · Abundance",
        story:
          "Balikesir is not only a city—it is the order of abundance." + N2 +
          "This gate teaches: abundance flows not only through desire, but through balance." + N2 +
          "10 carries ‘earth + water’: it produces, nourishes, multiplies." + N2 +
          "Here abundance is not show; it is sustainability." + N2 +
          "Know this: true abundance is building a system that can carry your life.",
        reflection:
          "What structure do I need to build for abundance today?",
      },
    },

    deepC: {
      tr: {
        title: "10 · Matrix Derin İfşa",
        story:
          "Sistem 10’u ‘maddeleme protokolü’ olarak çalıştırır." + N2 +
          "1 = irade, 0 = potansiyel." + N2 +
          "10 = iradenin potansiyeli forma sokmasıdır." + N2 +
          "Gölge test: İsteyip sistem kurmamak." + NL +
          "Işık test: Küçük ama düzenli adım." + N2 +
          "10 sana şunu söyler: Bolluk bir mucize değil, bir ritimdir." + N2 +
          "Ritim bozulursa, bereket dağılır.",
        reflection:
          "Bugün ‘istemek’ yerine hangi ritmi kuruyorum?",
      },
      en: {
        title: "10 · Deep Matrix Reveal",
        story:
          "The system runs 10 as a ‘materialization protocol.’" + N2 +
          "1 = will, 0 = potential." + N2 +
          "10 is will shaping potential into form." + N2 +
          "Shadow test: wanting without building a system." + NL +
          "Light test: small but consistent steps." + N2 +
          "10 says: abundance is not a miracle; it is a rhythm." + N2 +
          "When rhythm breaks, abundance scatters.",
        reflection:
          "Instead of only wanting, what rhythm am I building today?",
      },
    },

    history: {
      tr: {
        title: "10 · Tarih Katmanı",
        story:
          "Balıkesir, üretim ve geçiş bölgelerinin hafızasını taşır." + N2 +
          "Toprak verir, insan işler, ürün döner." + N2 +
          "Bu katman şunu öğretir: Bereket, döngüyü koruyabilmektir." + N2 +
          "Tarih, burada ‘emek’le ‘sonuç’ arasındaki bağın hiç kopmamasını anlatır.",
        reflection:
          "Benim emeğim hangi sonuca bağlanmalı ki döngü kapanıp büyüsün?",
      },
      en: {
        title: "10 · History Layer",
        story:
          "Balikesir carries the memory of production and passage." + N2 +
          "The soil gives, people work, the product returns." + N2 +
          "This layer teaches: abundance is protecting the cycle." + N2 +
          "History here shows the bond between effort and result never breaking.",
        reflection:
          "What outcome should my effort connect to so the cycle can grow?",
      },
    },

    numerology: {
      tr: {
        title: "10 · Numeroloji",
        story:
          "10 = yeni döngü / sistem / başlangıcın üst oktavı." + N2 +
          "1 → karar" + NL +
          "0 → alan" + N2 +
          "10 → kararın alanı düzenlemesi." + N2 +
          "10’un gölgesi:" + NL +
          "• dağınık hedef" + NL +
          "• disiplin eksikliği" + N2 +
          "10’un ışığı:" + NL +
          "• plan" + NL +
          "• sürdürülebilir adım" + NL +
          "• düzenli üretim" + N2 +
          "Bu kapı sorar: ‘Sistemim var mı?’",
        reflection:
          "Bolluk için günlük hangi küçük sistemi kuruyorum?",
      },
      en: {
        title: "10 · Numerology",
        story:
          "10 = new cycle / system / the higher octave of beginning." + N2 +
          "1 → decision" + NL +
          "0 → field" + N2 +
          "10 → decision organizing the field." + N2 +
          "Shadow of 10:" + NL +
          "• scattered goals" + NL +
          "• lack of discipline" + N2 +
          "Light of 10:" + NL +
          "• plan" + NL +
          "• sustainable steps" + NL +
          "• consistent production" + N2 +
          "This gate asks: ‘Do you have a system?’",
        reflection:
          "What small daily system am I building for abundance?",
      },
    },

    symbols: {
      tr: {
        title: "10 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Buğday: emek ve hasat." + NL +
          "• Su: bereketin akışı." + NL +
          "• Kase: tutma kapasitesi." + NL +
          "• Çember: döngü." + N2 +
          "Sembol mesajı: ‘Kapasiten kadar taşırsın. Kapasiten kadar çoğaltırsın.’",
        reflection:
          "Benim kapasitemi büyüten şey ne: sınır mı, ritim mi?",
      },
      en: {
        title: "10 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Wheat: effort and harvest." + NL +
          "• Water: the flow of abundance." + NL +
          "• Bowl: holding capacity." + NL +
          "• Circle: cycle." + N2 +
          "Symbol message: ‘You carry what your capacity can hold. You multiply what you can sustain.’",
        reflection:
          "What grows my capacity more—boundaries or rhythm?",
      },
    },

    ritual: {
      tr: {
        title: "10 · Ritüel",
        story:
          "10 Dakika Ritüeli (Bolluk Ritmi):" + N2 +
          "1) Bugün yapacağın 1 küçük üretim adımını yaz." + NL +
          "2) 10 nefes al ve her nefeste şunu söyle: ‘Ritim’" + NL +
          "3) Son cümle: ‘Ben düzen kuruyorum, bereket geliyor.’" + N2 +
          "Kapanış: ‘Bolluk sürdürülebilir olandır.’",
        reflection:
          "Bugün hangi küçük adım bolluğu başlatır?",
      },
      en: {
        title: "10 · Ritual",
        story:
          "10-Minute Ritual (Rhythm of Abundance):" + N2 +
          "1) Write one small production step you will take today." + NL +
          "2) Take 10 breaths and say with each breath: ‘Rhythm’" + NL +
          "3) Final line: ‘I build order; abundance arrives.’" + N2 +
          "Closing: ‘Abundance is what I can sustain.’",
        reflection:
          "Which small step begins abundance today?",
      },
    },

    lab: {
      tr: {
        title: "10 · LAB: Materialization Engine",
        story:
          "Kod Gözü: Sistem / Ritim / Kapasite" + N2 +
          "Kural Motoru:" + NL +
          "• ‘İstersem olur’" + NL +
          "• ‘Olmadıysa demek ki değil’" + N2 +
          "Rewrite:" + NL +
          "• ‘İsterim + sistem kurarım’" + NL +
          "• ‘Sistem = madde’",
        reflection:
          "Tek cümle yaz: Bugün bolluğu hangi sistemle çağırıyorsun?",
      },
      en: {
        title: "10 · LAB: Materialization Engine",
        story:
          "Code Eye: System / Rhythm / Capacity" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I want it, it happens’" + NL +
          "• ‘If it didn’t, it’s not for me’" + N2 +
          "Rewrite:" + NL +
          "• ‘I want it + I build a system’" + NL +
          "• ‘System = matter’",
        reflection:
          "Write one sentence: What system are you using to call abundance today?",
      },
    },
  },
};
export const CITY_11: Record<CityCode, City7> = {
  "11": {
    city: "Bilecik",

    base: {
      tr: {
        title: "11 · Kuruluş",
        story:
          "Bilecik bir şehir değil—kuruluş bilincidir." + N2 +
          "Bu kapı sana şunu öğretir: Büyük şeyler gürültüyle başlamaz; doğru temelle başlar." + N2 +
          "11’in enerjisi ‘kıvılcım + yön’dür. İlham gelir, ama onu taşıyacak sistem gerekir." + N2 +
          "Bilecik’in mesajı sade: Kökle. Kur. Devam et." + N2 +
          "Bu kapıdan geçerken şunu bil: Kuruluş bir an değil; her gün tekrar edilen karardır.",
        reflection:
          "Bugün hangi temeli atarsam yarın kendime teşekkür ederim?",
      },
      en: {
        title: "11 · Foundation",
        story:
          "Bilecik is not only a city—it is foundation consciousness." + N2 +
          "This gate teaches: big things do not begin with noise; they begin with the right base." + N2 +
          "11 carries ‘spark + direction.’ Inspiration arrives, but you need a system to hold it." + N2 +
          "Bilecik’s message is simple: root, build, continue." + N2 +
          "Know this: foundation is not a moment; it is a decision repeated daily.",
        reflection:
          "Which foundation, if laid today, will my future self thank me for?",
      },
    },

    deepC: {
      tr: {
        title: "11 · Matrix Derin İfşa",
        story:
          "Sistem 11’i ‘kapı-ışığı protokolü’ olarak çalıştırır." + N2 +
          "11 bir anahtar sayıdır: Sezgi ile gerçekliği birleştirir." + N2 +
          "Gölge test: İlhamı alıp yarım bırakmak." + NL +
          "Işık test: İlhamı plana çevirmek." + N2 +
          "11 sana şunu söyler: Kanal açıldıysa, sorumluluk da açıldı." + N2 +
          "Bu kapı; ‘başlat’ı değil, ‘sürdür’ü öğretir.",
        reflection:
          "İlham geldiğinde onu hangi sistemle hayata indiriyorum?",
      },
      en: {
        title: "11 · Deep Matrix Reveal",
        story:
          "The system runs 11 as a ‘gate-light protocol.’" + N2 +
          "11 is a key number: it links intuition with reality." + N2 +
          "Shadow test: receiving inspiration and leaving it unfinished." + NL +
          "Light test: turning inspiration into a plan." + N2 +
          "11 says: if the channel opened, responsibility opened too." + N2 +
          "This gate teaches not only ‘start’—but ‘sustain.’",
        reflection:
          "When inspiration arrives, what system brings it into reality?",
      },
    },

    history: {
      tr: {
        title: "11 · Tarih Katmanı",
        story:
          "Bilecik, kuruluşun eşiği olarak tarih taşır." + N2 +
          "Tarih katmanı şunu anlatır: Bir tohum doğru toprağa düşerse, çağ değiştirir." + N2 +
          "Kuruluş enerjisi burada bir semboldür: Sessiz, kararlı, köklü." + N2 +
          "Bu katman, ‘büyük dönüşümler küçük başlangıçlardan doğar’ dersini bırakır.",
        reflection:
          "Benim hayatımda hangi küçük başlangıç çağ değiştirir?",
      },
      en: {
        title: "11 · History Layer",
        story:
          "Bilecik carries the history of beginnings." + N2 +
          "This layer says: when a seed falls into the right soil, it can change an era." + N2 +
          "Foundation energy here is symbolic: quiet, steady, rooted." + N2 +
          "It leaves the lesson: great transformations are born from small starts.",
        reflection:
          "Which small beginning in my life could change an era?",
      },
    },

    numerology: {
      tr: {
        title: "11 · Numeroloji",
        story:
          "11 = sezgi / uyanış / kanal." + N2 +
          "İki tane 1: iki irade çizgisi. Biri ilhamı alır, diğeri hayata indirir." + N2 +
          "11’in gölgesi:" + NL +
          "• aşırı hassasiyet" + NL +
          "• kararsızlık" + NL +
          "• dağınık enerji" + N2 +
          "11’in ışığı:" + NL +
          "• net kanal" + NL +
          "• ilhamı disiplinle birleştirmek" + NL +
          "• rehberlik etmek" + N2 +
          "Bu kapı sorar: ‘Işığı gördün, peki yolu yaptın mı?’",
        reflection:
          "Bugün sezgimi hangi somut adımla güçlendiriyorum?",
      },
      en: {
        title: "11 · Numerology",
        story:
          "11 = intuition / awakening / channel." + N2 +
          "Two ones: two lines of will. One receives inspiration, one brings it into form." + N2 +
          "Shadow of 11:" + NL +
          "• oversensitivity" + NL +
          "• indecision" + NL +
          "• scattered energy" + N2 +
          "Light of 11:" + NL +
          "• clear channel" + NL +
          "• combining inspiration with discipline" + NL +
          "• guiding others" + N2 +
          "This gate asks: ‘You saw the light—did you build the road?’",
        reflection:
          "What concrete step strengthens my intuition today?",
      },
    },

    symbols: {
      tr: {
        title: "11 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Tohum: başlangıç ve kader." + NL +
          "• Kök: süreklilik." + NL +
          "• Fener/ışık: yön bulma." + NL +
          "• İki çizgi: iki irade." + N2 +
          "Sembol mesajı: ‘Işık geldiğinde yol yap.’",
        reflection:
          "Bugün ışığı gördüğüm halde yol yapmadığım yer neresi?",
      },
      en: {
        title: "11 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Seed: beginning and destiny." + NL +
          "• Root: continuity." + NL +
          "• Lantern/light: finding direction." + NL +
          "• Two lines: two wills." + N2 +
          "Symbol message: ‘When light arrives, build the road.’",
        reflection:
          "Where do I see the light but fail to build the road?",
      },
    },

    ritual: {
      tr: {
        title: "11 · Ritüel",
        story:
          "11 Dakika Ritüeli (Kuruluş Sözü):" + N2 +
          "1) Bir kağıda bir cümle yaz: ‘Benim temelim…’" + NL +
          "2) 11 nefes al ve her nefeste şu kelimeyi söyle: ‘Kuruyorum’" + NL +
          "3) Son cümle: ‘Her gün bir tuğla.’" + N2 +
          "Kapanış: ‘Kuruluş, tekrar edilen karardır.’",
        reflection:
          "Bugün hangi tuğlayı koyuyorum?",
      },
      en: {
        title: "11 · Ritual",
        story:
          "11-Minute Ritual (Foundation Vow):" + N2 +
          "1) Write one sentence: ‘My foundation is…’" + NL +
          "2) Take 11 breaths and say with each breath: ‘I build’" + NL +
          "3) Final line: ‘One brick a day.’" + N2 +
          "Closing: ‘Foundation is a decision repeated.’",
        reflection:
          "Which brick am I placing today?",
      },
    },

    lab: {
      tr: {
        title: "11 · LAB: Foundation Engine",
        story:
          "Kod Gözü: İlham / Sistem / Sürdürme" + N2 +
          "Kural Motoru:" + NL +
          "• ‘İlham = yeter’" + NL +
          "• ‘Başlamak = başarı’" + N2 +
          "Rewrite:" + NL +
          "• ‘İlham + disiplin = sonuç’" + NL +
          "• ‘Sürdürmek = gerçek başarı’",
        reflection:
          "Tek cümle yaz: Bugün ilhamı hangi disipline bağlıyorsun?",
      },
      en: {
        title: "11 · LAB: Foundation Engine",
        story:
          "Code Eye: Inspiration / System / Sustaining" + N2 +
          "Rule Engine:" + NL +
          "• ‘Inspiration = enough’" + NL +
          "• ‘Starting = success’" + N2 +
          "Rewrite:" + NL +
          "• ‘Inspiration + discipline = results’" + NL +
          "• ‘Sustaining = real success’",
        reflection:
          "Write one sentence: What discipline will you attach to your inspiration today?",
      },
    },
  },
};
export const CITY_12: Record<CityCode, City7> = {
  "12": {
    city: "Bingol",

    base: {
      tr: {
        title: "12 · Şifa",
        story:
          "Bingöl bir şehir değil—şifanın su hafızasıdır." + N2 +
          "Bu kapı sana şunu öğretir: Duygu bastırıldığında bedene iner; su serbest bırakıldığında temizler." + N2 +
          "12’nin enerjisi hem akış hem yeniden doğuştur. Eski kırıkları yumuşatır, içini yeniler." + N2 +
          "Bingöl’ün mesajı şudur: Sarsıntı bir ceza değil; ayar çağrısıdır." + N2 +
          "Bu kapıdan geçerken şunu bil: Şifa, kırılınca değil; kırığı sevgiyle tuttuğunda başlar.",
        reflection:
          "Bugün içimde hangi kırığı şefkatle tutmam gerekiyor?",
      },
      en: {
        title: "12 · Healing",
        story:
          "Bingol is not only a city—it is water-memory of healing." + N2 +
          "This gate teaches: when emotion is suppressed, it drops into the body; when it is released, water cleanses." + N2 +
          "12 carries both flow and rebirth. It softens old fractures and renews you from within." + N2 +
          "Bingol’s message: shaking is not punishment; it is a call for recalibration." + N2 +
          "Know this: healing begins not when you break, but when you hold the break with love.",
        reflection:
          "Which inner fracture do I need to hold with compassion today?",
      },
    },

    deepC: {
      tr: {
        title: "12 · Matrix Derin İfşa",
        story:
          "Sistem 12’yi ‘yeniden hizalama protokolü’ olarak çalıştırır." + N2 +
          "1 = irade, 2 = denge. 12 = iradenin dengeyi öğrenmesi." + N2 +
          "Gölge test: Duyguyu bastırıp ‘iyiymiş gibi’ yapmak." + NL +
          "Işık test: Duyguyu görmek ve akıtmaya izin vermek." + N2 +
          "12 sana şunu söyler: Bazı sarsıntılar dışarıdan değil, içeriden tetiklenir." + N2 +
          "Çünkü iç sistem, seni doğru yere getirmek ister. Bu kapı ‘ayar’ getirir.",
        reflection:
          "Beni sarsan şey dışarı mı, yoksa içimde bir ayar mı istiyor?",
      },
      en: {
        title: "12 · Deep Matrix Reveal",
        story:
          "The system runs 12 as a ‘re-alignment protocol.’" + N2 +
          "1 = will, 2 = balance. 12 is will learning balance." + N2 +
          "Shadow test: suppressing emotion and pretending to be fine." + NL +
          "Light test: seeing emotion and allowing it to flow." + N2 +
          "12 says: some tremors are not external—they are triggered from within." + N2 +
          "Because the inner system wants to bring you back to the right place. This gate recalibrates.",
        reflection:
          "Is what shakes me outside—or is something inside asking for alignment?",
      },
    },

    history: {
      tr: {
        title: "12 · Tarih Katmanı",
        story:
          "Bingöl, kaynaklar ve yolların şehridir." + N2 +
          "Su kaynakları bir ders taşır: Şifa, kaynağa geri dönmektir." + N2 +
          "Bu katman şunu anlatır: İnsan da bir kaynak taşır. Kaynak kirlenirse hayat bulanır." + N2 +
          "Dolayısıyla tarih burada bir sembole dönüşür: Kaynağı koru, akışı temiz tut.",
        reflection:
          "Benim kaynağım nerede kirleniyor—hangi düşünce suyu bulandırıyor?",
      },
      en: {
        title: "12 · History Layer",
        story:
          "Bingol is a land of springs and paths." + N2 +
          "Springs carry a lesson: healing is returning to the source." + N2 +
          "This layer says: you also carry a source. If the source is polluted, life becomes blurry." + N2 +
          "History turns into symbol: protect the source, keep the flow clean.",
        reflection:
          "Where is my source getting polluted—and which thought is clouding the water?",
      },
    },

    numerology: {
      tr: {
        title: "12 · Numeroloji",
        story:
          "12 = döngü / olgunlaşma / düzen." + N2 +
          "12 ay, 12 saat, 12’li sistemler: zamanın ritmi." + N2 +
          "12’nin gölgesi:" + NL +
          "• kendini ihmal" + NL +
          "• sürekli yüklenme" + N2 +
          "12’nin ışığı:" + NL +
          "• ritim" + NL +
          "• denge" + NL +
          "• şefkatli disiplin" + N2 +
          "Bu kapı sorar: ‘Ritmin var mı?’ Çünkü ritim yoksa sistem taşar.",
        reflection:
          "Bugün bedenimin ritmi neye ihtiyaç duyuyor?",
      },
      en: {
        title: "12 · Numerology",
        story:
          "12 = cycle / maturity / order." + N2 +
          "12 months, 12 hours, twelve-systems: the rhythm of time." + N2 +
          "Shadow of 12:" + NL +
          "• neglecting self" + NL +
          "• constant overload" + N2 +
          "Light of 12:" + NL +
          "• rhythm" + NL +
          "• balance" + NL +
          "• compassionate discipline" + N2 +
          "This gate asks: ‘Do you have a rhythm?’ Without rhythm, the system overflows.",
        reflection:
          "What does my body’s rhythm need today?",
      },
    },

    symbols: {
      tr: {
        title: "12 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kaynak su: öz ve temizlik." + NL +
          "• Dalga: duygunun hareketi." + NL +
          "• Fay hattı: bastırılmış gerçeğin çıkışı." + NL +
          "• 12 halka: zaman ritmi." + N2 +
          "Sembol mesajı: ‘Sarsıntı, gerçeğin hareketidir.’",
        reflection:
          "Ben hangi gerçeği bastırıyorum ki içimde fay hattı oluşuyor?",
      },
      en: {
        title: "12 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Spring water: essence and cleansing." + NL +
          "• Wave: movement of emotion." + NL +
          "• Fault line: the release of suppressed truth." + NL +
          "• 12 rings: rhythm of time." + N2 +
          "Symbol message: ‘A tremor is truth moving.’",
        reflection:
          "What truth am I suppressing that turns into a fault line inside me?",
      },
    },

    ritual: {
      tr: {
        title: "12 · Ritüel",
        story:
          "12 Dakika Ritüeli (Kaynağa Dönüş):" + N2 +
          "1) Bir bardak su al." + NL +
          "2) 12 nefes al." + NL +
          "3) İçinden söyle: ‘Kaynağıma dönüyorum.’" + NL +
          "4) Kağıda yaz: ‘Bugün bedenime şefkat’" + N2 +
          "Kapanış: ‘Ritim kuruyorum, sistemim dengeleniyor.’",
        reflection:
          "Bugün hangi küçük şefkat eylemi beni hizalar?",
      },
      en: {
        title: "12 · Ritual",
        story:
          "12-Minute Ritual (Return to Source):" + N2 +
          "1) Take a glass of water." + NL +
          "2) Take 12 breaths." + NL +
          "3) Say inwardly: ‘I return to my source.’" + NL +
          "4) Write: ‘Compassion for my body today’" + N2 +
          "Closing: ‘I build rhythm, my system rebalances.’",
        reflection:
          "What small act of compassion aligns me today?",
      },
    },

    lab: {
      tr: {
        title: "12 · LAB: Recalibration Engine",
        story:
          "Kod Gözü: Ritim / Su / Hizalama" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Bastır = idare et’" + NL +
          "• ‘İdare et = taş’" + N2 +
          "Rewrite:" + NL +
          "• ‘Gör = akıt’" + NL +
          "• ‘Akıt = temizle’" + NL +
          "• ‘Temizle = hizalan’",
        reflection:
          "Tek cümle yaz: Bugün hangi duyguyu akıtmaya izin veriyorsun?",
      },
      en: {
        title: "12 · LAB: Recalibration Engine",
        story:
          "Code Eye: Rhythm / Water / Alignment" + N2 +
          "Rule Engine:" + NL +
          "• ‘Suppress = manage’" + NL +
          "• ‘Manage = carry’" + N2 +
          "Rewrite:" + NL +
          "• ‘See = release’" + NL +
          "• ‘Release = cleanse’" + NL +
          "• ‘Cleanse = align’",
        reflection:
          "Write one sentence: Which emotion will you allow to flow today?",
      },
    },
  },
};
export const CITY_13: Record<CityCode, City7> = {
  "13": {
    city: "Bitlis",

    base: {
      tr: {
        title: "13 · Derin Zaman",
        story:
          "Bitlis bir şehir değil—derin zamanın taş hafızasıdır." + N2 +
          "Bu kapı sana sabrı öğretir: Hızla yapılan şey parlak görünür; derin yapılan şey kalır." + N2 +
          "13’ün enerjisi ‘dönüşüm’dür. Eskiyi yıkar gibi değil, eskiyi çözüp yeniye çevirir." + N2 +
          "Bitlis’te taş konuşur: Katman katman birikmiş kayıtlar gibi." + N2 +
          "Bu kapıdan geçerken şunu bil: Dönüşüm bir anda olmaz; doğru zamanda olur.",
        reflection:
          "Bugün hangi dönüşümü aceleye getiriyorum?",
      },
      en: {
        title: "13 · Deep Time",
        story:
          "Bitlis is not only a city—it is stone memory of deep time." + N2 +
          "This gate teaches patience: what is done fast may shine; what is done deep remains." + N2 +
          "13 carries transformation. Not by smashing the old, but by dissolving it into a new form." + N2 +
          "In Bitlis, stone speaks like layered records." + N2 +
          "Know this: transformation does not happen instantly; it happens at the right time.",
        reflection:
          "Which transformation am I rushing today?",
      },
    },

    deepC: {
      tr: {
        title: "13 · Matrix Derin İfşa",
        story:
          "Sistem 13’ü ‘dönüşüm protokolü’ olarak çalıştırır." + N2 +
          "1 = başlangıç, 3 = yaratım. 13 = başlangıcın yaratımla yeniden yazılması." + N2 +
          "Gölge test: Dönüşümü ‘yıkım’ sanıp korkmak." + NL +
          "Işık test: Dönüşümü ‘yeniden form’ olarak görmek." + N2 +
          "13 sana şunu söyler: Eski yapının çatlaması, yeni yapının yer açmasıdır." + N2 +
          "Bu kapı, ‘kırılma’ sandığın yerde ‘özgürleşme’ verir.",
        reflection:
          "Kırılıyor sandığım şey aslında bana neye yer açıyor?",
      },
      en: {
        title: "13 · Deep Matrix Reveal",
        story:
          "The system runs 13 as a ‘transformation protocol.’" + N2 +
          "1 = beginning, 3 = creation. 13 is the beginning rewritten through creation." + N2 +
          "Shadow test: fearing change by calling it ‘destruction.’" + NL +
          "Light test: seeing change as ‘new form.’" + N2 +
          "13 says: the cracking of the old structure is space-making for the new." + N2 +
          "This gate turns what you call ‘break’ into liberation.",
        reflection:
          "What I think is breaking—what space is it creating for me?",
      },
    },

    history: {
      tr: {
        title: "13 · Tarih Katmanı",
        story:
          "Bitlis, geçitlerin ve taş şehirlerin hafızasını taşır." + N2 +
          "Tarih burada şunu anlatır: Zor coğrafya, güçlü yapı üretir." + N2 +
          "Taş, sadece malzeme değil; karardır." + N2 +
          "Bu katman sana ‘kalıcılık’ öğretir: Her şey geçer, ama doğru kurulan şey kalır.",
        reflection:
          "Ben hangi kararı taş gibi sağlam tutmalıyım?",
      },
      en: {
        title: "13 · History Layer",
        story:
          "Bitlis carries the memory of passages and stone cities." + N2 +
          "History here teaches: harsh geography creates strong structures." + N2 +
          "Stone is not only material—it is decision." + N2 +
          "This layer teaches permanence: everything passes, but what is built correctly remains.",
        reflection:
          "Which decision should I hold as solid as stone?",
      },
    },

    numerology: {
      tr: {
        title: "13 · Numeroloji",
        story:
          "13 = dönüşüm / yeniden doğuş / eski kalıbı kırma." + N2 +
          "13’ün gölgesi:" + NL +
          "• değişim korkusu" + NL +
          "• kontrol" + NL +
          "• ‘ya kaybedersem’ düşüncesi" + N2 +
          "13’ün ışığı:" + NL +
          "• cesaret" + NL +
          "• yeniden form" + NL +
          "• doğru zamanda doğru adım" + N2 +
          "Bu kapı sorar: ‘Eski kalıp artık neyi taşıyamıyor?’",
        reflection:
          "Bugün hangi eski kalıbı bırakmaya hazırım?",
      },
      en: {
        title: "13 · Numerology",
        story:
          "13 = transformation / rebirth / breaking outdated forms." + N2 +
          "Shadow of 13:" + NL +
          "• fear of change" + NL +
          "• control" + NL +
          "• ‘what if I lose’ thinking" + N2 +
          "Light of 13:" + NL +
          "• courage" + NL +
          "• new form" + NL +
          "• right step at the right time" + N2 +
          "This gate asks: ‘What can the old mold no longer carry?’",
        reflection:
          "Which old mold am I ready to release today?",
      },
    },

    symbols: {
      tr: {
        title: "13 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Taş duvar: kalıcılık." + NL +
          "• Geçit: kaderin yön değiştirmesi." + NL +
          "• Çatlak taş: dönüşümün işareti." + NL +
          "• 13 halkalı spiral: yeniden doğuş." + N2 +
          "Sembol mesajı: ‘Çatlak, ışığın girdiği yerdir.’",
        reflection:
          "Işığın girmesi için nerede çatlamam gerekiyor?",
      },
      en: {
        title: "13 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Stone wall: permanence." + NL +
          "• Passage: destiny shifting direction." + NL +
          "• Cracked stone: sign of transformation." + NL +
          "• 13-ring spiral: rebirth." + N2 +
          "Symbol message: ‘A crack is where light enters.’",
        reflection:
          "Where do I need to crack open so light can enter?",
      },
    },

    ritual: {
      tr: {
        title: "13 · Ritüel",
        story:
          "13 Dakika Ritüeli (Yeni Form):" + N2 +
          "1) Kağıda iki başlık yaz: ‘Eski Kalıp’ ve ‘Yeni Form’." + NL +
          "2) Eski Kalıp altına 3 kelime yaz." + NL +
          "3) Yeni Form altına 3 kelime yaz." + NL +
          "4) 13 nefes al ve son nefeste söyle: ‘Dönüşüyorum.’" + N2 +
          "Kapanış: ‘Doğru zamanda doğru forma geçiyorum.’",
        reflection:
          "Bugün hangi yeni forma ilk adımı atıyorum?",
      },
      en: {
        title: "13 · Ritual",
        story:
          "13-Minute Ritual (New Form):" + N2 +
          "1) Write two headers: ‘Old Mold’ and ‘New Form’." + NL +
          "2) Under Old Mold, write 3 words." + NL +
          "3) Under New Form, write 3 words." + NL +
          "4) Take 13 breaths and on the last breath say: ‘I transform.’" + N2 +
          "Closing: ‘I move into the right form at the right time.’",
        reflection:
          "What is my first step into the new form today?",
      },
    },

    lab: {
      tr: {
        title: "13 · LAB: Transformation Engine",
        story:
          "Kod Gözü: Dönüşüm / Zaman / Yeni Form" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Değişim = kayıp’" + NL +
          "• ‘Kayıp = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Değişim = yer açmak’" + NL +
          "• ‘Yer açmak = özgürleşmek’",
        reflection:
          "Tek cümle yaz: Bugün değişimi nasıl yeniden tanımlıyorsun?",
      },
      en: {
        title: "13 · LAB: Transformation Engine",
        story:
          "Code Eye: Transformation / Time / New Form" + N2 +
          "Rule Engine:" + NL +
          "• ‘Change = loss’" + NL +
          "• ‘Loss = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘Change = making space’" + NL +
          "• ‘Making space = liberation’",
        reflection:
          "Write one sentence: How do you redefine change today?",
      },
    },
  },
};
export const CITY_14: Record<CityCode, City7> = {
  "14": {
    city: "Bolu",

    base: {
      tr: {
        title: "14 · Nefes",
        story:
          "Bolu bir şehir değil—nefesin ormanıdır." + N2 +
          "Bu kapı sana yavaşlamayı öğretir. Hız, bazen kaçıştır; yavaşlık, bazen şifadır." + N2 +
          "14’ün enerjisi sisli bir orman gibidir: Netlik hemen gelmez, ama doğru yürürsen yol açılır." + N2 +
          "Bolu’nun mesajı: ‘Dur. Dinle. Soluğunu geri al.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Zihin hızlanınca beden kapanır; nefes açılınca bilinç genişler.",
        reflection:
          "Bugün nefesim nerede daralıyor—hangi düşünce beni sıkıştırıyor?",
      },
      en: {
        title: "14 · Breath",
        story:
          "Bolu is not only a city—it is the forest of breath." + N2 +
          "This gate teaches slowing down. Speed is sometimes escape; slowness is sometimes healing." + N2 +
          "14 feels like a misty forest: clarity does not arrive instantly, yet if you walk true, a path opens." + N2 +
          "Bolu’s message: ‘Stop. Listen. Take your breath back.’" + N2 +
          "Know this: when the mind rushes, the body closes; when breath opens, consciousness expands.",
        reflection:
          "Where does my breath tighten today—and which thought is compressing me?",
      },
    },

    deepC: {
      tr: {
        title: "14 · Matrix Derin İfşa",
        story:
          "Sistem 14’ü ‘ritim protokolü’ olarak çalıştırır." + N2 +
          "1 = irade, 4 = yapı. 14 = iradenin yapıyı nefesle yönetmesi." + N2 +
          "Gölge test: Kontrol etmek için hızlanmak." + NL +
          "Işık test: Nefesle ritim kurmak." + N2 +
          "14 sana şunu söyler: Nefesin bozulduysa, sistem alarm veriyordur." + N2 +
          "Bu kapı, içindeki ‘panik motoru’nu yumuşatır ve yeniden düzenler.",
        reflection:
          "Ben hızlanınca gerçekten çözüyor muyum, yoksa kaçıyor muyum?",
      },
      en: {
        title: "14 · Deep Matrix Reveal",
        story:
          "The system runs 14 as a ‘rhythm protocol.’" + N2 +
          "1 = will, 4 = structure. 14 is will managing structure through breath." + N2 +
          "Shadow test: speeding up to feel in control." + NL +
          "Light test: building rhythm through breath." + N2 +
          "14 says: if your breath breaks, the system is sending an alarm." + N2 +
          "This gate softens the inner panic engine and resets it.",
        reflection:
          "When I speed up, am I solving—or am I escaping?",
      },
    },

    history: {
      tr: {
        title: "14 · Tarih Katmanı",
        story:
          "Bolu, ormanın ve geçidin şehridir." + N2 +
          "Geçit şehirleri şunu öğretir: Yol bazen dışarıda değil, içeride açılır." + N2 +
          "Orman ise başka bir ders taşır: Her şey aynı anda görünmez. Sabırla ilerlersen görünür olur." + N2 +
          "Bu katman, ‘süreç’ bilgeliğini bırakır.",
        reflection:
          "Ben süreci mi yaşıyorum, sonucu mu zorluyorum?",
      },
      en: {
        title: "14 · History Layer",
        story:
          "Bolu is a land of forests and passages." + N2 +
          "Passage-cities teach: sometimes the path opens not outside, but inside." + N2 +
          "The forest holds another lesson: not everything is visible at once. With patience, it becomes visible." + N2 +
          "This layer leaves the wisdom of process.",
        reflection:
          "Am I living the process—or forcing the outcome?",
      },
    },

    numerology: {
      tr: {
        title: "14 · Numeroloji",
        story:
          "14 = ritim / ölçü / denge." + N2 +
          "14’ün gölgesi:" + NL +
          "• aşırılık" + NL +
          "• kontrol" + NL +
          "• sabırsızlık" + N2 +
          "14’ün ışığı:" + NL +
          "• ölçü" + NL +
          "• nefes" + NL +
          "• sakin kararlılık" + N2 +
          "Bu kapı sorar: ‘Hayatında nerede ölçüyü kaçırdın?’",
        reflection:
          "Bugün hangi alanda ölçüyü geri getiriyorum?",
      },
      en: {
        title: "14 · Numerology",
        story:
          "14 = rhythm / measure / balance." + N2 +
          "Shadow of 14:" + NL +
          "• excess" + NL +
          "• control" + NL +
          "• impatience" + N2 +
          "Light of 14:" + NL +
          "• moderation" + NL +
          "• breath" + NL +
          "• calm determination" + N2 +
          "This gate asks: ‘Where did you lose your measure?’",
        reflection:
          "Where am I restoring measure today?",
      },
    },

    symbols: {
      tr: {
        title: "14 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Orman: süreç ve bilinmeyen." + NL +
          "• Sis: ara katman, geçiş." + NL +
          "• Nefes: düzenleyici güç." + NL +
          "• Yeşil: kalp ve yenilenme." + N2 +
          "Sembol mesajı: ‘Sis varken panik yapma. Nefes açar.’",
        reflection:
          "Bugün sisin içinde kalıp nefesle yürüyebilir miyim?",
      },
      en: {
        title: "14 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Forest: process and the unknown." + NL +
          "• Mist: in-between layer, transition." + NL +
          "• Breath: regulating power." + NL +
          "• Green: heart and renewal." + N2 +
          "Symbol message: ‘When there is mist, don’t panic. Breath opens.’",
        reflection:
          "Can I stay in the mist and walk with breath today?",
      },
    },

    ritual: {
      tr: {
        title: "14 · Ritüel",
        story:
          "14 Nefes Ritüeli (Sis Açılır):" + N2 +
          "1) 7 nefes al: 4 saniye al, 2 saniye tut, 6 saniye ver." + NL +
          "2) 7 nefes daha: sadece yavaş ver." + NL +
          "3) Son cümle: ‘Ritmim bana ait.’" + N2 +
          "Kapanış: ‘Ölçü = şifa.’",
        reflection:
          "Bugün hangi ritmi seçiyorum?",
      },
      en: {
        title: "14 · Ritual",
        story:
          "14-Breath Ritual (Mist Opens):" + N2 +
          "1) Take 7 breaths: inhale 4, hold 2, exhale 6." + NL +
          "2) Take 7 more: slow exhale only." + NL +
          "3) Final line: ‘My rhythm is mine.’" + N2 +
          "Closing: ‘Measure is healing.’",
        reflection:
          "Which rhythm am I choosing today?",
      },
    },

    lab: {
      tr: {
        title: "14 · LAB: Rhythm Engine",
        story:
          "Kod Gözü: Nefes / Ölçü / Süreç" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hız = kontrol’" + NL +
          "• ‘Kontrol = güven’" + N2 +
          "Rewrite:" + NL +
          "• ‘Nefes = kontrol’" + NL +
          "• ‘Ölçü = güven’",
        reflection:
          "Tek cümle yaz: Bugün hız yerine neyi seçiyorsun?",
      },
      en: {
        title: "14 · LAB: Rhythm Engine",
        story:
          "Code Eye: Breath / Measure / Process" + N2 +
          "Rule Engine:" + NL +
          "• ‘Speed = control’" + NL +
          "• ‘Control = safety’" + N2 +
          "Rewrite:" + NL +
          "• ‘Breath = control’" + NL +
          "• ‘Measure = safety’",
        reflection:
          "Write one sentence: What do you choose instead of speed today?",
      },
    },
  },
};
export const CITY_15: Record<CityCode, City7> = {
  "15": {
    city: "Burdur",

    base: {
      tr: {
        title: "15 · Sessizlik",
        story:
          "Burdur bir şehir değil—sessizliğin gölüdür." + N2 +
          "Bu kapı sana sadeleşmeyi öğretir: Fazlalık gidince öz görünür." + N2 +
          "15’in enerjisi durgun su gibidir. Yüzey sakinleşince derinlik konuşur." + N2 +
          "Burdur’un mesajı: ‘Azalt. Dinle. Anla.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Sessizlik, cevap değildir; cevabın geldiği yerdir.",
        reflection:
          "Bugün hangi fazlalığı bırakırsam iç sesimi duyarım?",
      },
      en: {
        title: "15 · Silence",
        story:
          "Burdur is not only a city—it is the lake of silence." + N2 +
          "This gate teaches simplification: when excess leaves, essence appears." + N2 +
          "15 feels like still water. When the surface calms, the depth speaks." + N2 +
          "Burdur’s message: ‘Reduce. Listen. Understand.’" + N2 +
          "Know this: silence is not the answer; it is where the answer arrives.",
        reflection:
          "What excess can I release today to hear my inner voice?",
      },
    },

    deepC: {
      tr: {
        title: "15 · Matrix Derin İfşa",
        story:
          "Sistem 15’i ‘çekim protokolü’ olarak çalıştırır." + N2 +
          "1 = irade, 5 = değişim. 15 = iradenin değişimi yönetmesi." + N2 +
          "Gölge test: Arzu ile kaçışı karıştırmak." + NL +
          "Işık test: Arzuyu bilinçle yönlendirmek." + N2 +
          "15 sana şunu söyler: Bazı arzular gerçekte ihtiyaçtır; bazıları ise yalnızca gürültüdür." + N2 +
          "Bu kapı, ‘gerçek istek’ ile ‘anlık dürtü’ arasını ayırır.",
        reflection:
          "Bugün arzu sandığım şey ihtiyaç mı, yoksa gürültü mü?",
      },
      en: {
        title: "15 · Deep Matrix Reveal",
        story:
          "The system runs 15 as an ‘attraction protocol.’" + N2 +
          "1 = will, 5 = change. 15 is will managing change." + N2 +
          "Shadow test: confusing desire with escape." + NL +
          "Light test: directing desire consciously." + N2 +
          "15 says: some desires are true needs; others are just noise." + N2 +
          "This gate separates ‘true want’ from ‘instant impulse.’",
        reflection:
          "Is what I call desire today a need—or just noise?",
      },
    },

    history: {
      tr: {
        title: "15 · Tarih Katmanı",
        story:
          "Burdur, göller bölgesinin hafızasını taşır." + N2 +
          "Göl şehirleri şunu öğretir: Su biriktirir, saklar, yansıtır." + N2 +
          "Tarih katmanı burada bir sembole dönüşür: Biriktirdiğin her şey seni ağırlaştırır; arındırdığın her şey seni hafifletir." + N2 +
          "Bu kapı, ‘biriktirme’ ile ‘öz’ arasındaki dengeyi kurar.",
        reflection:
          "Ben neyi biriktiriyorum ki ağırlaşıyorum?",
      },
      en: {
        title: "15 · History Layer",
        story:
          "Burdur carries the memory of the lakes region." + N2 +
          "Lake cities teach: water collects, holds, reflects." + N2 +
          "History becomes symbol: what you hoard makes you heavy; what you cleanse makes you light." + N2 +
          "This gate builds balance between accumulation and essence.",
        reflection:
          "What am I accumulating that makes me heavy?",
      },
    },

    numerology: {
      tr: {
        title: "15 · Numeroloji",
        story:
          "15 = çekim / arzu / dönüşüm." + N2 +
          "15’in gölgesi:" + NL +
          "• bağımlılık" + NL +
          "• dürtüsellik" + NL +
          "• tatminsizlik" + N2 +
          "15’in ışığı:" + NL +
          "• bilinçli seçim" + NL +
          "• sadeleşme" + NL +
          "• arzuyu amaca dönüştürmek" + N2 +
          "Bu kapı sorar: ‘Neyi gerçekten istiyorsun?’",
        reflection:
          "Gerçek isteğim bir cümleyle ne?",
      },
      en: {
        title: "15 · Numerology",
        story:
          "15 = attraction / desire / transformation." + N2 +
          "Shadow of 15:" + NL +
          "• addiction" + NL +
          "• impulsiveness" + NL +
          "• dissatisfaction" + N2 +
          "Light of 15:" + NL +
          "• conscious choice" + NL +
          "• simplification" + NL +
          "• turning desire into purpose" + N2 +
          "This gate asks: ‘What do you truly want?’",
        reflection:
          "In one sentence: what is my true desire?",
      },
    },

    symbols: {
      tr: {
        title: "15 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Göl: yansıtma, içe dönüş." + NL +
          "• Durgun su: sakin zihin." + NL +
          "• Ay: arzu ve ritim." + NL +
          "• Beyaz taş: sade öz." + N2 +
          "Sembol mesajı: ‘Sakinleşince ne istediğini görürsün.’",
        reflection:
          "Ben sakinleşince hangi gerçek ortaya çıkıyor?",
      },
      en: {
        title: "15 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Lake: reflection, inwardness." + NL +
          "• Still water: calm mind." + NL +
          "• Moon: desire and rhythm." + NL +
          "• White stone: simple essence." + N2 +
          "Symbol message: ‘When you calm down, you see what you truly want.’",
        reflection:
          "When I become still, what truth appears?",
      },
    },

    ritual: {
      tr: {
        title: "15 · Ritüel",
        story:
          "15 Dakika Ritüeli (Sadeleşme):" + N2 +
          "1) Bugün bırakacağın 1 fazlalığı yaz." + NL +
          "2) 15 nefes al, her nefeste ‘Az’ kelimesini söyle." + NL +
          "3) Son cümle: ‘Özü seçiyorum.’" + N2 +
          "Kapanış: ‘Sessizlikte gerçek istek görünür.’",
        reflection:
          "Bugün hangi fazlalığı bırakıyorum?",
      },
      en: {
        title: "15 · Ritual",
        story:
          "15-Minute Ritual (Simplify):" + N2 +
          "1) Write one excess you will release today." + NL +
          "2) Take 15 breaths, saying ‘Less’ with each breath." + NL +
          "3) Final line: ‘I choose essence.’" + N2 +
          "Closing: ‘In silence, true desire is revealed.’",
        reflection:
          "What excess am I releasing today?",
      },
    },

    lab: {
      tr: {
        title: "15 · LAB: Desire Engine",
        story:
          "Kod Gözü: Arzu / Seçim / Sadeleşme" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Arzu = eksiklik’" + NL +
          "• ‘Eksiklik = daha fazla’" + N2 +
          "Rewrite:" + NL +
          "• ‘Arzu = yön’" + NL +
          "• ‘Yön = sade seçim’",
        reflection:
          "Tek cümle yaz: Bugün arzunu hangi yöne çeviriyorsun?",
      },
      en: {
        title: "15 · LAB: Desire Engine",
        story:
          "Code Eye: Desire / Choice / Simplification" + N2 +
          "Rule Engine:" + NL +
          "• ‘Desire = lack’" + NL +
          "• ‘Lack = more’" + N2 +
          "Rewrite:" + NL +
          "• ‘Desire = direction’" + NL +
          "• ‘Direction = simple choice’",
        reflection:
          "Write one sentence: Where are you directing your desire today?",
      },
    },
  },
};
export const CITY_16: Record<CityCode, City7> = {
  "16": {
    city: "Bursa",

    base: {
      tr: {
        title: "16 · Yeşil Kalp",
        story:
          "Bursa bir şehir değil—yeşil bir kalptir." + N2 +
          "Bu kapı sana şunu öğretir: Zarafet sadece estetik değil, dengeli güçtür." + N2 +
          "16’nın enerjisi köklü bir bereket taşır: büyür, ama şımarmadan büyür." + N2 +
          "Bursa’nın mesajı: ‘Köklen ve yumuşa.’ Sertlik korumaz; zarafet korur." + N2 +
          "Bu kapıdan geçerken şunu bil: Kalp açıldığında beden de rahatlar, hayat da akışa girer.",
        reflection:
          "Bugün kalbimi hangi noktada yumuşatmam gerekiyor?",
      },
      en: {
        title: "16 · Green Heart",
        story:
          "Bursa is not only a city—it is a green heart." + N2 +
          "This gate teaches: grace is not only aesthetic; it is balanced strength." + N2 +
          "16 carries rooted abundance: it grows, but it grows without arrogance." + N2 +
          "Bursa’s message: ‘Root and soften.’ Hardness does not protect; grace protects." + N2 +
          "Know this: when the heart opens, the body relaxes and life returns to flow.",
        reflection:
          "Where do I need to soften my heart today?",
      },
    },

    deepC: {
      tr: {
        title: "16 · Matrix Derin İfşa",
        story:
          "Sistem 16’yı ‘kalp-yapı protokolü’ olarak çalıştırır." + N2 +
          "1 = irade, 6 = sorumluluk. 16 = iradenin sorumluluğu kalple taşımasıdır." + N2 +
          "Gölge test: Sorumluluğu yük gibi taşımak." + NL +
          "Işık test: Sorumluluğu sevgiyle taşımak." + N2 +
          "16 sana şunu söyler: Sevgi yoksa sistem sertleşir; sertleşen sistem çatlar." + N2 +
          "Bu kapı, içindeki sertliği yumuşatıp yapıyı güçlendirir: Kalp merkezli disiplin.",
        reflection:
          "Sorumluluğumu kalple mi taşıyorum, zorunlulukla mı?",
      },
      en: {
        title: "16 · Deep Matrix Reveal",
        story:
          "The system runs 16 as a ‘heart-structure protocol.’" + N2 +
          "1 = will, 6 = responsibility. 16 is will carrying responsibility through the heart." + N2 +
          "Shadow test: carrying responsibility as burden." + NL +
          "Light test: carrying responsibility with love." + N2 +
          "16 says: without love, the system hardens; what hardens eventually cracks." + N2 +
          "This gate softens rigidity and strengthens structure: heart-centered discipline.",
        reflection:
          "Do I carry responsibility with heart—or with obligation?",
      },
    },

    history: {
      tr: {
        title: "16 · Tarih Katmanı",
        story:
          "Bursa, köklü bir başlangıcın ve zarafetin şehridir." + N2 +
          "Tarih katmanı şunu anlatır: Güç, sadece fetih değil; aynı zamanda düzen kurmaktır." + N2 +
          "Yeşil, burada bir renk değil; bir terbiyedir. Zamanın içinden süzülmüş bir denge." + N2 +
          "Bu katman, ‘kök + estetik’ dersini bırakır: sağlam ol, ama sert olma.",
        reflection:
          "Benim gücüm nerede zarafete dönüşmeli?",
      },
      en: {
        title: "16 · History Layer",
        story:
          "Bursa is a city of rooted beginnings and grace." + N2 +
          "This layer teaches: power is not only conquest; it is also building order." + N2 +
          "Green here is not just color; it is refinement—balance distilled through time." + N2 +
          "This layer leaves the lesson of ‘root + elegance’: be strong, but not rigid.",
        reflection:
          "Where should my strength become grace?",
      },
    },

    numerology: {
      tr: {
        title: "16 · Numeroloji",
        story:
          "16 = olgun güç / kalp disiplin / denge." + N2 +
          "16’nın gölgesi:" + NL +
          "• sertleşmek" + NL +
          "• ‘ben yaparım’ kibri" + NL +
          "• duyguyu bastırmak" + N2 +
          "16’nın ışığı:" + NL +
          "• tevazu" + NL +
          "• kalp ile yönetim" + NL +
          "• şefkatli sınır" + N2 +
          "Bu kapı sorar: ‘Gücün sevgiyle mi dengeli?’",
        reflection:
          "Bugün gücüme hangi şefkati ekliyorum?",
      },
      en: {
        title: "16 · Numerology",
        story:
          "16 = mature power / heart discipline / balance." + N2 +
          "Shadow of 16:" + NL +
          "• hardening" + NL +
          "• ego of ‘I alone’" + NL +
          "• suppressing emotion" + N2 +
          "Light of 16:" + NL +
          "• humility" + NL +
          "• heart-led governance" + NL +
          "• compassionate boundaries" + N2 +
          "This gate asks: ‘Is your power balanced with love?’",
        reflection:
          "What compassion am I adding to my power today?",
      },
    },

    symbols: {
      tr: {
        title: "16 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Yeşil: kalp ve yenilenme." + NL +
          "• İpek: zarafet ve akış." + NL +
          "• Ağaç: kök ve süreklilik." + NL +
          "• Çınar: olgun güç." + N2 +
          "Sembol mesajı: ‘Köklen, yumuşa, büyü.’",
        reflection:
          "Ben büyürken nerede sertleşiyorum?",
      },
      en: {
        title: "16 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Green: heart and renewal." + NL +
          "• Silk: grace and flow." + NL +
          "• Tree: root and continuity." + NL +
          "• Plane tree: mature strength." + N2 +
          "Symbol message: ‘Root, soften, grow.’",
        reflection:
          "Where do I harden as I grow?",
      },
    },

    ritual: {
      tr: {
        title: "16 · Ritüel",
        story:
          "16 Dakika Ritüeli (Yeşil Kalp):" + N2 +
          "1) Elini kalbine koy." + NL +
          "2) 8 nefes al, 8 nefes ver (toplam 16)." + NL +
          "3) İçinden söyle: ‘Gücüm zarafet.’" + NL +
          "4) Son cümle: ‘Sınırım şefkat.’" + N2 +
          "Kapanış: ‘Kalbim açıksa hayatım düzenlenir.’",
        reflection:
          "Bugün hangi sınırı şefkatle koyuyorum?",
      },
      en: {
        title: "16 · Ritual",
        story:
          "16-Minute Ritual (Green Heart):" + N2 +
          "1) Place your hand on your heart." + NL +
          "2) 8 breaths in, 8 breaths out (16 total)." + NL +
          "3) Say inwardly: ‘My power is grace.’" + NL +
          "4) Final line: ‘My boundary is compassion.’" + N2 +
          "Closing: ‘When my heart is open, my life organizes.’",
        reflection:
          "Which boundary am I setting with compassion today?",
      },
    },

    lab: {
      tr: {
        title: "16 · LAB: Heart-Structure Engine",
        story:
          "Kod Gözü: Kalp / Disiplin / Zarafet" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Sertlik = güven’" + NL +
          "• ‘Kontrol = düzen’" + N2 +
          "Rewrite:" + NL +
          "• ‘Şefkat = güven’" + NL +
          "• ‘Kalp = düzen’",
        reflection:
          "Tek cümle yaz: Bugün düzeni hangi kalp kararıyla kuruyorsun?",
      },
      en: {
        title: "16 · LAB: Heart-Structure Engine",
        story:
          "Code Eye: Heart / Discipline / Grace" + N2 +
          "Rule Engine:" + NL +
          "• ‘Hardness = safety’" + NL +
          "• ‘Control = order’" + N2 +
          "Rewrite:" + NL +
          "• ‘Compassion = safety’" + NL +
          "• ‘Heart = order’",
        reflection:
          "Write one sentence: What heart-decision builds your order today?",
      },
    },
  },
};
export const CITY_17: Record<CityCode, City7> = {
  "17": {
    city: "Canakkale",

    base: {
      tr: {
        title: "17 · Eşik",
        story:
          "Çanakkale bir şehir değil—bir eşiğin kendisidir." + N2 +
          "Bu kapı sana şunu öğretir: Geçiş, kaçmak değil; bilinçli seçimdir." + N2 +
          "17’nin enerjisi ‘iki dünya arası’ çalışır: eski sen ve yeni sen arasında köprü kurar." + N2 +
          "Burada duruş önemlidir. Çünkü bazı kapılar hızla geçilmez; önce karar gerekir." + N2 +
          "Bu kapıdan geçerken şunu bil: Eşik cesareti korkuyla değil, netlikle ölçer.",
        reflection:
          "Bugün hangi eşiğin önünde duruyorum ve kararım ne?",
      },
      en: {
        title: "17 · Threshold",
        story:
          "Canakkale is not only a city—it is the threshold itself." + N2 +
          "This gate teaches: transition is not escape; it is conscious choice." + N2 +
          "17 works ‘between two worlds’: it builds a bridge between your old self and your new self." + N2 +
          "Stance matters here. Some gates cannot be rushed; a decision must be made first." + N2 +
          "Know this: the threshold measures courage not through fear, but through clarity.",
        reflection:
          "Which threshold am I standing at today—and what is my decision?",
      },
    },

    deepC: {
      tr: {
        title: "17 · Matrix Derin İfşa",
        story:
          "Sistem 17’yi ‘geçiş protokolü’ olarak çalıştırır." + N2 +
          "1 = irade, 7 = iç görüş." + N2 +
          "17 = iradenin iç görüşle karar vermesi." + N2 +
          "Gölge test: Eşiğin önünde oyalanmak." + NL +
          "Işık test: Net karar ve tek adım." + N2 +
          "17 sana şunu söyler: Eşik dışarıda değil; içeridedir.",
        reflection:
          "Bugün tek adımı atıyor muyum?",
      },
      en: {
        title: "17 · Deep Matrix Reveal",
        story:
          "The system runs 17 as a ‘transition protocol.’" + N2 +
          "1 = will, 7 = inner sight." + N2 +
          "17 = will deciding through inner clarity." + N2 +
          "Shadow test: lingering at the threshold." + NL +
          "Light test: clear decision and one step." + N2 +
          "17 says: the threshold is not outside—it is within.",
        reflection:
          "Am I taking the one step today?",
      },
    },

    history: {
      tr: {
        title: "17 · Tarih Katmanı",
        story:
          "Çanakkale, direniş ve kararlılık hafızası taşır." + N2 +
          "Tarih katmanı şunu öğretir: Duruş, kaderi değiştirir." + N2 +
          "Eşik anı, tarihin yönünü belirler." + N2 +
          "Bu katman, ‘karar = yön’ dersini bırakır.",
        reflection:
          "Benim kararım hangi yönü değiştiriyor?",
      },
      en: {
        title: "17 · History Layer",
        story:
          "Canakkale carries memory of resistance and determination." + N2 +
          "This layer teaches: stance changes destiny." + N2 +
          "A threshold moment determines direction." + N2 +
          "It leaves the lesson: decision becomes direction.",
        reflection:
          "Which direction does my decision change?",
      },
    },

    numerology: {
      tr: {
        title: "17 · Numeroloji",
        story:
          "17 = geçiş / karar / iç netlik." + N2 +
          "17’nin gölgesi:" + NL +
          "• kararsızlık" + NL +
          "• erteleme" + N2 +
          "17’nin ışığı:" + NL +
          "• net karar" + NL +
          "• köprü kurma" + NL +
          "• tek adım" + N2 +
          "Bu kapı sorar: ‘Hazır mısın?’",
        reflection:
          "Bugün hangi kararı netleştiriyorum?",
      },
      en: {
        title: "17 · Numerology",
        story:
          "17 = transition / decision / inner clarity." + N2 +
          "Shadow of 17:" + NL +
          "• indecision" + NL +
          "• delay" + N2 +
          "Light of 17:" + NL +
          "• clear decision" + NL +
          "• bridge building" + NL +
          "• one step" + N2 +
          "This gate asks: ‘Are you ready?’",
        reflection:
          "Which decision am I clarifying today?",
      },
    },

    symbols: {
      tr: {
        title: "17 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Köprü: geçiş." + NL +
          "• Kapı: karar." + NL +
          "• Çizgi: eşik." + NL +
          "• Adım: hareket." + N2 +
          "Sembol mesajı: ‘Karar ver, geç.’",
        reflection:
          "Bugün hangi eşiği geçiyorum?",
      },
      en: {
        title: "17 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Bridge: transition." + NL +
          "• Gate: decision." + NL +
          "• Line: threshold." + NL +
          "• Step: movement." + N2 +
          "Symbol message: ‘Decide and cross.’",
        reflection:
          "Which threshold am I crossing today?",
      },
    },

    ritual: {
      tr: {
        title: "17 · Ritüel",
        story:
          "17 Dakika Ritüeli (Eşik Kararı):" + N2 +
          "1) Kararsız kaldığın şeyi yaz." + NL +
          "2) Altına tek cümle yaz: ‘Seçiyorum…’" + NL +
          "3) 17 nefes al ve son nefeste söyle: ‘Geçtim.’" + N2 +
          "Kapanış: ‘Yeni yön.’",
        reflection:
          "Bugün hangi kararı seçiyorum?",
      },
      en: {
        title: "17 · Ritual",
        story:
          "17-Minute Ritual (Threshold Decision):" + N2 +
          "1) Write what you are undecided about." + NL +
          "2) Add one sentence: ‘I choose…’" + NL +
          "3) Take 17 breaths and say: ‘I crossed.’" + N2 +
          "Closing: ‘New direction.’",
        reflection:
          "Which decision am I choosing today?",
      },
    },

    lab: {
      tr: {
        title: "17 · LAB: Transition Engine",
        story:
          "Kod Gözü: Eşik / Netlik / Karar" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Beklemek = güven’" + NL +
          "• ‘Risk = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Net karar = güven’" + NL +
          "• ‘Tek adım = geçiş’",
        reflection:
          "Tek cümle yaz: Bugün hangi kararı netleştiriyorsun?",
      },
      en: {
        title: "17 · LAB: Transition Engine",
        story:
          "Code Eye: Threshold / Clarity / Decision" + N2 +
          "Rule Engine:" + NL +
          "• ‘Waiting = safety’" + NL +
          "• ‘Risk = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘Clear decision = safety’" + NL +
          "• ‘One step = transition’",
        reflection:
          "Write one sentence: Which decision are you clarifying today?",
      },
    },
  },
};


export const CITY_18: Record<CityCode, City7> = {
  "18": {
    city: "Cankiri",

    base: {
      tr: {
        title: "18 · Tuz",
        story:
          "Çankırı bir şehir değil—tuzun arındıran hafızasıdır." + N2 +
          "Bu kapı sana sınır öğretir: Sınır, uzaklaştırmak değil; korumaktır." + N2 +
          "18’in enerjisi temizler, fazla olanı alır, özü bırakır." + N2 +
          "Tuz, hem korur hem arındırır. Bu kapı da öyledir: seni korurken hafifletir." + N2 +
          "Bu kapıdan geçerken şunu bil: Kendini korumak, sevgisizlik değil; bilgeliktir.",
        reflection:
          "Bugün hangi sınırı koyarsam içim rahatlar?",
      },
      en: {
        title: "18 · Salt",
        story:
          "Cankiri is not only a city—it is the cleansing memory of salt." + N2 +
          "This gate teaches boundaries: a boundary is not rejection; it is protection." + N2 +
          "18 cleanses, removes excess, and leaves essence." + N2 +
          "Salt both preserves and purifies. This gate does the same: it protects you by lightening you." + N2 +
          "Know this: self-protection is not lack of love; it is wisdom.",
        reflection:
          "Which boundary, if set today, brings me inner relief?",
      },
    },

    deepC: {
      tr: {
        title: "18 · Matrix Derin İfşa",
        story:
          "Sistem 18’i ‘arınma protokolü’ olarak çalıştırır." + N2 +
          "1 = irade, 8 = güç. 18 = iradenin gücü arınmayla yönetmesi." + N2 +
          "Gölge test: Sınırı suçlulukla koymak ya da hiç koymamak." + NL +
          "Işık test: Sınırı sevgiyle koymak." + N2 +
          "18 sana şunu söyler: Fazlalıklar çoğalınca enerji sızar." + N2 +
          "Sınır koymak, enerji sızıntısını kapatmaktır.",
        reflection:
          "Enerjim bugün nereden sızıyor?",
      },
      en: {
        title: "18 · Deep Matrix Reveal",
        story:
          "The system runs 18 as a ‘purification protocol.’" + N2 +
          "1 = will, 8 = power. 18 is will managing power through cleansing." + N2 +
          "Shadow test: setting boundaries with guilt—or not setting them at all." + NL +
          "Light test: setting boundaries with love." + N2 +
          "18 says: when excess grows, energy leaks." + N2 +
          "Boundaries seal the leak.",
        reflection:
          "Where is my energy leaking today?",
      },
    },

    history: {
      tr: {
        title: "18 · Tarih Katmanı",
        story:
          "Çankırı, tuzun ve yer altı hafızasının şehridir." + N2 +
          "Yer altı, görünmeyeni taşır: saklananı, birikenleri, korunması gerekeni." + N2 +
          "Tarih katmanı şunu öğretir: Gerçek değer bazen derindedir. Onu korumak gerekir." + N2 +
          "Bu katman, ‘derin değer + koruma’ dersini bırakır.",
        reflection:
          "Benim en değerli şeyim ne—ve onu nasıl koruyorum?",
      },
      en: {
        title: "18 · History Layer",
        story:
          "Cankiri is a city of salt and underground memory." + N2 +
          "Underground holds what is unseen: what is stored, accumulated, and worth protecting." + N2 +
          "This layer teaches: true value is sometimes deep. It must be protected." + N2 +
          "It leaves the lesson of ‘deep value + protection.’",
        reflection:
          "What is my most valuable inner resource—and how do I protect it?",
      },
    },

    numerology: {
      tr: {
        title: "18 · Numeroloji",
        story:
          "18 = arınma / güç / sınır." + N2 +
          "18’in gölgesi:" + NL +
          "• suçluluk" + NL +
          "• kendini ihmal" + NL +
          "• fazla verme" + N2 +
          "18’in ışığı:" + NL +
          "• sağlıklı sınır" + NL +
          "• öz değer" + NL +
          "• temiz güç" + N2 +
          "Bu kapı sorar: ‘Kendine ne kadar sahipsin?’",
        reflection:
          "Bugün kendime sahip çıkmanın en net hali ne?",
      },
      en: {
        title: "18 · Numerology",
        story:
          "18 = purification / power / boundary." + N2 +
          "Shadow of 18:" + NL +
          "• guilt" + NL +
          "• self-neglect" + NL +
          "• overgiving" + N2 +
          "Light of 18:" + NL +
          "• healthy boundary" + NL +
          "• self-worth" + NL +
          "• clean power" + N2 +
          "This gate asks: ‘How much do you own yourself?’",
        reflection:
          "What is the clearest form of self-ownership I can practice today?",
      },
    },

    symbols: {
      tr: {
        title: "18 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Tuz: arındırma ve koruma." + NL +
          "• Yer altı: saklı değer." + NL +
          "• Kase: kapasite ve sınır." + NL +
          "• Duvar: enerji sızıntısını kapatma." + N2 +
          "Sembol mesajı: ‘Özünü koru, fazlayı bırak.’",
        reflection:
          "Bugün fazlayı bırakırsam hangi öz ortaya çıkar?",
      },
      en: {
        title: "18 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Salt: cleansing and preserving." + NL +
          "• Underground: hidden value." + NL +
          "• Bowl: capacity and boundary." + NL +
          "• Wall: sealing energy leaks." + N2 +
          "Symbol message: ‘Protect your essence, release the excess.’",
        reflection:
          "If I release the excess today, what essence appears?",
      },
    },

    ritual: {
      tr: {
        title: "18 · Ritüel",
        story:
          "18 Dakika Ritüeli (Tuzla Arınma):" + N2 +
          "1) Bir bardağa su koy ve bir tutam tuz ekle." + NL +
          "2) 9 nefes al, 9 nefes ver (18)." + NL +
          "3) İçinden söyle: ‘Kendimi koruyorum.’" + NL +
          "4) Son cümle: ‘Fazlayı bırakıyorum.’" + N2 +
          "Kapanış: ‘Sınırım sevgi.’",
        reflection:
          "Bugün hangi fazlayı bırakıyorum?",
      },
      en: {
        title: "18 · Ritual",
        story:
          "18-Minute Ritual (Salt Cleanse):" + N2 +
          "1) Put water in a glass and add a pinch of salt." + NL +
          "2) 9 breaths in, 9 breaths out (18)." + NL +
          "3) Say inwardly: ‘I protect myself.’" + NL +
          "4) Final line: ‘I release the excess.’" + N2 +
          "Closing: ‘My boundary is love.’",
        reflection:
          "What excess am I releasing today?",
      },
    },

    lab: {
      tr: {
        title: "18 · LAB: Boundary Engine",
        story:
          "Kod Gözü: Sınır / Arınma / Öz Değer" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hayır dersem kötü olurum’" + NL +
          "• ‘Verirsem sevilirim’" + N2 +
          "Rewrite:" + NL +
          "• ‘Hayır = koruma’" + NL +
          "• ‘Kendime sahip çıkmak = sevgi’",
        reflection:
          "Tek cümle yaz: Bugün hangi ‘hayır’ beni koruyor?",
      },
      en: {
        title: "18 · LAB: Boundary Engine",
        story:
          "Code Eye: Boundary / Purification / Self-Worth" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I say no, I’m bad’" + NL +
          "• ‘If I give, I’m loved’" + N2 +
          "Rewrite:" + NL +
          "• ‘No = protection’" + NL +
          "• ‘Self-ownership = love’",
        reflection:
          "Write one sentence: Which ‘no’ protects me today?",
      },
    },
  },
};
export const CITY_19: Record<CityCode, City7> = {
  "19": {
    city: "Corum",

    base: {
      tr: {
        title: "19 · Kayıt",
        story:
          "Çorum bir şehir değil—kaydın merkezidir." + N2 +
          "Bu kapı sana şunu öğretir: Her şey iz bırakır. Söz, seçim, niyet." + N2 +
          "19’un enerjisi ‘toprak hafızası’ gibi çalışır: gömer, saklar, sonra açığa çıkarır." + N2 +
          "Bazen bir insanın kaderi, unuttuğu bir cümlenin içinde saklıdır. Çorum o cümleyi bulduran kapıdır." + N2 +
          "Bu kapıdan geçerken şunu bil: Kayıt değişirse, hayat değişir.",
        reflection:
          "Bugün hangi kaydı (inancı) güncellemem gerekiyor?",
      },
      en: {
        title: "19 · Record",
        story:
          "Corum is not only a city—it is the center of record." + N2 +
          "This gate teaches: everything leaves a trace—words, choices, intentions." + N2 +
          "19 works like soil memory: it buries, stores, then reveals." + N2 +
          "Sometimes destiny hides inside a sentence you forgot. Corum is the gate that helps you find it." + N2 +
          "Know this: when the record changes, life changes.",
        reflection:
          "Which record (belief) do I need to update today?",
      },
    },

    deepC: {
      tr: {
        title: "19 · Matrix Derin İfşa",
        story:
          "Sistem 19’u ‘kural-kayıt protokolü’ olarak çalıştırır." + N2 +
          "1 = irade, 9 = tamamlanma. 19 = iradenin eski döngüyü kapatıp yeni kaydı yazması." + N2 +
          "Gölge test: Eski kaydı savunmak, ‘böyleyim’ demek." + NL +
          "Işık test: Eski kaydı görmek ve yeniden yazmak." + N2 +
          "19 sana şunu söyler: Kader, sabit bir ceza değil; güncellenen bir yazılımdır." + N2 +
          "Bu kapı, ‘kuralı’ gösterir ve sana bir satır yazdırır: Yeni kural.",
        reflection:
          "Beni aynı döngüye sokan tek cümlelik kural ne?",
      },
      en: {
        title: "19 · Deep Matrix Reveal",
        story:
          "The system runs 19 as a ‘rule-record protocol.’" + N2 +
          "1 = will, 9 = completion. 19 is will closing an old loop and writing a new record." + N2 +
          "Shadow test: defending the old record—saying ‘this is just who I am.’" + NL +
          "Light test: seeing the old record and rewriting it." + N2 +
          "19 says: destiny is not a fixed punishment; it is software you can update." + N2 +
          "This gate reveals the rule and asks you to write one line: the new rule.",
        reflection:
          "What one-sentence rule keeps pulling me into the same loop?",
      },
    },

    history: {
      tr: {
        title: "19 · Tarih Katmanı",
        story:
          "Çorum, kadim uygarlıkların kayıt odası gibidir." + N2 +
          "Hitit hafızası şunu öğretir: Sistemler yazılır, korunur, aktarılır." + N2 +
          "Tarih katmanı burada bir ders bırakır: Medeniyet bile kayıtla yaşar; insan da öyle." + N2 +
          "Kayıt bozulursa düzen bozulur. Kayıt netleşirse düzen kurulur.",
        reflection:
          "Hayatımda düzeni bozan kayıt nerede?",
      },
      en: {
        title: "19 · History Layer",
        story:
          "Corum is like a record room of ancient civilizations." + N2 +
          "Hittite memory teaches: systems are written, preserved, transmitted." + N2 +
          "This layer leaves a lesson: even civilizations live by records—so do humans." + N2 +
          "When the record corrupts, order breaks. When the record clarifies, order forms.",
        reflection:
          "Where is the record that breaks order in my life?",
      },
    },

    numerology: {
      tr: {
        title: "19 · Numeroloji",
        story:
          "19 = kapanış + yeniden yazım." + N2 +
          "19’un gölgesi:" + NL +
          "• inat" + NL +
          "• ‘ben buyum’ kilidi" + NL +
          "• değişime direnç" + N2 +
          "19’un ışığı:" + NL +
          "• idrak" + NL +
          "• güncelleme" + NL +
          "• yeni kural" + N2 +
          "Bu kapı sorar: ‘Hangi cümleyi değiştirirsen her şey değişir?’",
        reflection:
          "Benim hayatımı yöneten bir cümle ne?",
      },
      en: {
        title: "19 · Numerology",
        story:
          "19 = closure + rewrite." + N2 +
          "Shadow of 19:" + NL +
          "• stubbornness" + NL +
          "• the lock ‘this is me’" + NL +
          "• resistance to change" + N2 +
          "Light of 19:" + NL +
          "• insight" + NL +
          "• updating" + NL +
          "• new rule" + N2 +
          "This gate asks: ‘Which sentence, if changed, changes everything?’",
        reflection:
          "What one sentence governs my life?",
      },
    },

    symbols: {
      tr: {
        title: "19 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Tablet/kitabe: yazılı kader." + NL +
          "• Mühür: kuralın onayı." + NL +
          "• Toprak: hafıza." + NL +
          "• Anahtar: güncelleme." + N2 +
          "Sembol mesajı: ‘Mührü sen basarsın. Kaydı sen değiştirirsin.’",
        reflection:
          "Bugün hangi mühürü iptal ediyorum?",
      },
      en: {
        title: "19 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Tablet/inscription: written destiny." + NL +
          "• Seal: rule approval." + NL +
          "• Soil: memory." + NL +
          "• Key: update." + N2 +
          "Symbol message: ‘You stamp the seal. You change the record.’",
        reflection:
          "Which seal am I canceling today?",
      },
    },

    ritual: {
      tr: {
        title: "19 · Ritüel",
        story:
          "19 Dakika Ritüeli (Kayıt Güncelleme):" + N2 +
          "1) Bir kağıda eski kuralı yaz (tek cümle)." + NL +
          "2) Altına yeni kuralı yaz (tek cümle)." + NL +
          "3) 19 nefes al. Son nefeste söyle: ‘Güncellendi.’" + N2 +
          "Kapanış: ‘Yeni kayıt, yeni hayat.’",
        reflection:
          "Bugün hangi yeni kuralı imzalıyorum?",
      },
      en: {
        title: "19 · Ritual",
        story:
          "19-Minute Ritual (Record Update):" + N2 +
          "1) Write the old rule (one sentence)." + NL +
          "2) Under it, write the new rule (one sentence)." + NL +
          "3) Take 19 breaths. On the last, say: ‘Updated.’" + N2 +
          "Closing: ‘New record, new life.’",
        reflection:
          "Which new rule am I signing today?",
      },
    },

    lab: {
      tr: {
        title: "19 · LAB: Rule Engine",
        story:
          "Kod Gözü: Kayıt / Kural / Güncelleme" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Böyleyim’" + NL +
          "• ‘Değişmem’" + N2 +
          "Rewrite:" + NL +
          "• ‘Görüyorum’" + NL +
          "• ‘Seçiyorum’" + NL +
          "• ‘Değişiyorum’",
        reflection:
          "Tek cümle yaz: Bugün hangi kaydı güncelliyorsun?",
      },
      en: {
        title: "19 · LAB: Rule Engine",
        story:
          "Code Eye: Record / Rule / Update" + N2 +
          "Rule Engine:" + NL +
          "• ‘This is me’" + NL +
          "• ‘I won’t change’" + N2 +
          "Rewrite:" + NL +
          "• ‘I see’" + NL +
          "• ‘I choose’" + NL +
          "• ‘I change’",
        reflection:
          "Write one sentence: Which record are you updating today?",
      },
    },
  },
};
export const CITY_20: Record<CityCode, City7> = {
  "20": {
    city: "Denizli",

    base: {
      tr: {
        title: "20 · Beyaz",
        story:
          "Denizli bir şehir değil—beyaz bir arınmadır." + N2 +
          "Bu kapı sana şunu öğretir: Temizlik yalnızca dış yüzey değil, iç niyettir." + N2 +
          "20’nin enerjisi suyla taşın buluşması gibidir: Akış, form yaratır." + N2 +
          "Denizli’nin mesajı: ‘Arın ve yeniden biçimlen.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Beyazlık, boşluk değil; saf başlangıçtır.",
        reflection:
          "Bugün hangi niyeti arındırıp saflaştırmam gerekiyor?",
      },
      en: {
        title: "20 · White",
        story:
          "Denizli is not only a city—it is white purification." + N2 +
          "This gate teaches: cleansing is not only surface—it is intention." + N2 +
          "20 is water meeting stone: flow creates form." + N2 +
          "Denizli’s message: ‘Cleanse and reshape.’" + N2 +
          "Know this: whiteness is not emptiness; it is pure beginning.",
        reflection:
          "Which intention do I need to cleanse and purify today?",
      },
    },

    deepC: {
      tr: {
        title: "20 · Matrix Derin İfşa",
        story:
          "Sistem 20’yi ‘arınma-yeniden form protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 0 = alan. 20 = dengeyi alana yaymak." + N2 +
          "Gölge test: Arınmayı ‘mükemmeliyetçilik’ sanmak." + NL +
          "Işık test: Arınmayı ‘sade netlik’ olarak yaşamak." + N2 +
          "20 sana şunu söyler: Bazı kirler dışarıda değil, niyetin içinde kalır." + N2 +
          "Bu kapı niyeti beyazlatır. Sonra hayat kendiliğinden şekil bulur.",
        reflection:
          "Benim niyetimdeki ‘gizli kir’ ne: korku mu, kontrol mü?",
      },
      en: {
        title: "20 · Deep Matrix Reveal",
        story:
          "The system runs 20 as a ‘purification-reform protocol.’" + N2 +
          "2 = balance, 0 = field. 20 is spreading balance into the field." + N2 +
          "Shadow test: confusing cleansing with perfectionism." + NL +
          "Light test: living cleansing as simple clarity." + N2 +
          "20 says: some dirt is not outside—it stays inside intention." + N2 +
          "This gate whitens intention, then life shapes itself naturally.",
        reflection:
          "What is the ‘hidden dirt’ in my intention: fear or control?",
      },
    },

    history: {
      tr: {
        title: "20 · Tarih Katmanı",
        story:
          "Denizli’nin hafızası su ve taş üzerinden yazar." + N2 +
          "Pamukkale, doğanın ritimle form üretmesini anlatır: Su akar, iz bırakır, beyaz katman olur." + N2 +
          "Tarih katmanı şunu öğretir: Süreklilik, mucize üretir." + N2 +
          "Bu katman, ‘akış + sabır = yeni yapı’ dersini bırakır.",
        reflection:
          "Ben hangi alanda sabırla akarsam yeni bir yapı oluşur?",
      },
      en: {
        title: "20 · History Layer",
        story:
          "Denizli writes memory through water and stone." + N2 +
          "Pamukkale shows nature creating form through rhythm: water flows, leaves trace, becomes white layers." + N2 +
          "This layer teaches: consistency creates miracles." + N2 +
          "It leaves the lesson: flow + patience = new structure.",
        reflection:
          "Where can I flow with patience so a new structure forms?",
      },
    },

    numerology: {
      tr: {
        title: "20 · Numeroloji",
        story:
          "20 = saf alan / denge / yeniden başlangıç." + N2 +
          "20’nin gölgesi:" + NL +
          "• aşırı eleştiri" + NL +
          "• mükemmeliyet baskısı" + N2 +
          "20’nin ışığı:" + NL +
          "• sade netlik" + NL +
          "• arınmış niyet" + NL +
          "• temiz başlangıç" + N2 +
          "Bu kapı sorar: ‘Neyi sadeleştirirsen beyazlık gelir?’",
        reflection:
          "Bugün hangi fazlalığı bırakırsam saflaşırım?",
      },
      en: {
        title: "20 · Numerology",
        story:
          "20 = pure field / balance / fresh beginning." + N2 +
          "Shadow of 20:" + NL +
          "• harsh self-criticism" + NL +
          "• pressure of perfection" + N2 +
          "Light of 20:" + NL +
          "• simple clarity" + NL +
          "• purified intention" + NL +
          "• clean start" + N2 +
          "This gate asks: ‘What must you simplify for whiteness to arrive?’",
        reflection:
          "What excess can I release today to become purer?",
      },
    },

    symbols: {
      tr: {
        title: "20 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Beyaz teras: saf katman." + NL +
          "• Su: arınma ve akış." + NL +
          "• Kireç taşı: form ve iz." + NL +
          "• Işık: netlik." + N2 +
          "Sembol mesajı: ‘Ak, iz bırak, sadeleş.’",
        reflection:
          "Benim hayatımda hangi ‘beyaz katman’ oluşuyor?",
      },
      en: {
        title: "20 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• White terrace: purified layer." + NL +
          "• Water: cleansing and flow." + NL +
          "• Limestone: form and trace." + NL +
          "• Light: clarity." + N2 +
          "Symbol message: ‘Flow, leave a trace, simplify.’",
        reflection:
          "Which ‘white layer’ is forming in my life?",
      },
    },

    ritual: {
      tr: {
        title: "20 · Ritüel",
        story:
          "20 Dakika Ritüeli (Beyaz Niyet):" + N2 +
          "1) Bir kağıda niyetini yaz." + NL +
          "2) Altına şu cümleyi ekle: ‘Bu niyeti korkudan değil, sevgiden seçiyorum.’" + NL +
          "3) 20 nefes al. Son nefeste söyle: ‘Saf.’" + N2 +
          "Kapanış: ‘Temiz niyet, temiz yol.’",
        reflection:
          "Bugün niyetimi hangi duygudan seçiyorum: korku mu, sevgi mi?",
      },
      en: {
        title: "20 · Ritual",
        story:
          "20-Minute Ritual (White Intention):" + N2 +
          "1) Write your intention." + NL +
          "2) Add: ‘I choose this intention from love, not from fear.’" + NL +
          "3) Take 20 breaths. On the last say: ‘Pure.’" + N2 +
          "Closing: ‘Clean intention, clean path.’",
        reflection:
          "From which emotion am I choosing my intention today—fear or love?",
      },
    },

    lab: {
      tr: {
        title: "20 · LAB: Purity Engine",
        story:
          "Kod Gözü: Niyet / Arınma / Yeni Form" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Mükemmel olursam güvendeyim’" + NL +
          "• ‘Hata = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Saf niyet = güven’" + NL +
          "• ‘Düzeltme = gelişim’",
        reflection:
          "Tek cümle yaz: Bugün kendine hangi ‘beyaz’ izni veriyorsun?",
      },
      en: {
        title: "20 · LAB: Purity Engine",
        story:
          "Code Eye: Intention / Purification / New Form" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I’m perfect, I’m safe’" + NL +
          "• ‘Mistake = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘Pure intention = safety’" + NL +
          "• ‘Correction = growth’",
        reflection:
          "Write one sentence: What ‘white permission’ do you give yourself today?",
      },
    },
  },
};
export const CITY_21: Record<CityCode, City7> = {
  "21": {
    city: "Diyarbakir",

    base: {
      tr: {
        title: "21 · Sur",
        story:
          "Diyarbakır bir şehir değil—sınırın ve kalbin taş hâlidir." + N2 +
          "Bu kapı sana şunu öğretir: Sınır koymak sevgiyi azaltmaz; sevgiyi korur." + N2 +
          "21’in enerjisi kara taş gibidir: ağır, güçlü, dayanıklı." + N2 +
          "Burada güç; bağırmak değil, ayakta kalmaktır." + N2 +
          "Bu kapıdan geçerken şunu bil: Kalp yumuşakken sınır sert olmaz; sınır net olur.",
        reflection:
          "Bugün hangi sınırı sevgiyle netleştirmem gerekiyor?",
      },
      en: {
        title: "21 · The Walls",
        story:
          "Diyarbakir is not only a city—it is the stone form of boundary and heart." + N2 +
          "This gate teaches: boundaries do not reduce love; they protect love." + N2 +
          "21 feels like black stone: heavy, strong, enduring." + N2 +
          "Here strength is not shouting—it is standing." + N2 +
          "Know this: when the heart is soft, the boundary is not harsh; it is clear.",
        reflection:
          "Which boundary do I need to clarify with love today?",
      },
    },

    deepC: {
      tr: {
        title: "21 · Matrix Derin İfşa",
        story:
          "Sistem 21’i ‘olgunlaşma protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 1 = irade. 21 = dengeli irade." + N2 +
          "Gölge test: Ya çok sertleşmek ya da hiç sınır koymamak." + NL +
          "Işık test: Net ama şefkatli duruş." + N2 +
          "21 sana şunu söyler: Güç, duvar örmek değil; doğru kapıyı seçmektir." + N2 +
          "Bu kapı; kim girer, kim girmez, hangi enerji içeri alınır—bunu belirler.",
        reflection:
          "Benim hayatıma hangi enerji girmemeli?",
      },
      en: {
        title: "21 · Deep Matrix Reveal",
        story:
          "The system runs 21 as a ‘maturity protocol.’" + N2 +
          "2 = balance, 1 = will. 21 is balanced will." + N2 +
          "Shadow test: becoming too harsh or setting no boundaries at all." + NL +
          "Light test: a clear stance with compassion." + N2 +
          "21 says: power is not building walls—it is choosing the right gate." + N2 +
          "This gate decides what enters, what doesn’t, which energy is allowed in.",
        reflection:
          "Which energy should not enter my life?",
      },
    },

    history: {
      tr: {
        title: "21 · Tarih Katmanı",
        story:
          "Diyarbakır’ın surları bir semboldür: Koruma ve süreklilik." + N2 +
          "Tarih katmanı şunu öğretir: Bir şehir kendini korursa yaşar." + N2 +
          "İnsan da öyle: Kendini korumayan, kendini kaybeder." + N2 +
          "Bu katman, ‘koruma = yaşam’ dersini bırakır.",
        reflection:
          "Ben kendimi nerede korumuyorum?",
      },
      en: {
        title: "21 · History Layer",
        story:
          "Diyarbakir’s walls are a symbol: protection and continuity." + N2 +
          "This layer teaches: a city lives when it protects itself." + N2 +
          "Humans are the same: without self-protection, you lose yourself." + N2 +
          "It leaves the lesson: protection is life.",
        reflection:
          "Where am I failing to protect myself?",
      },
    },

    numerology: {
      tr: {
        title: "21 · Numeroloji",
        story:
          "21 = olgun irade / tamamlanma eşiği." + N2 +
          "21’in gölgesi:" + NL +
          "• kırgınlıkla sertleşmek" + NL +
          "• ‘kimseye güvenmem’ modu" + N2 +
          "21’in ışığı:" + NL +
          "• güvenli sınır" + NL +
          "• kalp açıklığı" + NL +
          "• seçici yakınlık" + N2 +
          "Bu kapı sorar: ‘Kime, neye, ne kadar?’",
        reflection:
          "Bugün kime ne kadar alan açıyorum?",
      },
      en: {
        title: "21 · Numerology",
        story:
          "21 = mature will / threshold of completion." + N2 +
          "Shadow of 21:" + NL +
          "• hardening through resentment" + NL +
          "• ‘I trust no one’ mode" + N2 +
          "Light of 21:" + NL +
          "• safe boundaries" + NL +
          "• open heart" + NL +
          "• selective intimacy" + N2 +
          "This gate asks: ‘To whom, to what, and how much?’",
        reflection:
          "How much space am I giving—and to whom—today?",
      },
    },

    symbols: {
      tr: {
        title: "21 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kara taş: dayanıklılık." + NL +
          "• Sur: koruma." + NL +
          "• Kapı: seçici geçiş." + NL +
          "• Anahtar: irade." + N2 +
          "Sembol mesajı: ‘Kapıyı sen tutarsın. Anahtar sende.’",
        reflection:
          "Bugün hangi kapıyı kapatmam gerekiyor?",
      },
      en: {
        title: "21 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Black stone: endurance." + NL +
          "• Wall: protection." + NL +
          "• Gate: selective passage." + NL +
          "• Key: will." + N2 +
          "Symbol message: ‘You hold the gate. The key is yours.’",
        reflection:
          "Which gate do I need to close today?",
      },
    },

    ritual: {
      tr: {
        title: "21 · Ritüel",
        story:
          "21 Dakika Ritüeli (Koruyucu Sınır):" + N2 +
          "1) Kağıda yaz: ‘Bugün sınırım…’" + NL +
          "2) Altına ekle: ‘Bu sınır sevgiyi korur.’" + NL +
          "3) 21 nefes al. Son nefeste söyle: ‘Netim.’" + N2 +
          "Kapanış: ‘Kalbim açık, kapım seçici.’",
        reflection:
          "Bugün hangi sınırı netleştiriyorum?",
      },
      en: {
        title: "21 · Ritual",
        story:
          "21-Minute Ritual (Protective Boundary):" + N2 +
          "1) Write: ‘My boundary today is…’" + NL +
          "2) Add: ‘This boundary protects love.’" + NL +
          "3) Take 21 breaths. On the last say: ‘I am clear.’" + N2 +
          "Closing: ‘My heart is open, my gate is selective.’",
        reflection:
          "Which boundary am I clarifying today?",
      },
    },

    lab: {
      tr: {
        title: "21 · LAB: Gatekeeper Engine",
        story:
          "Kod Gözü: Sınır / Koruma / Olgun İrade" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Sınır = sevgisizlik’" + NL +
          "• ‘Yumuşaklık = zayıflık’" + N2 +
          "Rewrite:" + NL +
          "• ‘Sınır = sevgi koruması’" + NL +
          "• ‘Yumuşaklık = bilinç’",
        reflection:
          "Tek cümle yaz: Bugün sınırı nasıl sevgiyle kuruyorsun?",
      },
      en: {
        title: "21 · LAB: Gatekeeper Engine",
        story:
          "Code Eye: Boundary / Protection / Mature Will" + N2 +
          "Rule Engine:" + NL +
          "• ‘Boundary = lack of love’" + NL +
          "• ‘Softness = weakness’" + N2 +
          "Rewrite:" + NL +
          "• ‘Boundary = protection of love’" + NL +
          "• ‘Softness = consciousness’",
        reflection:
          "Write one sentence: How do you set boundaries with love today?",
      },
    },
  },
};
export const CITY_22: Record<CityCode, City7> = {
  "22": {
    city: "Edirne",

    base: {
      tr: {
        title: "22 · Kapı",
        story:
          "Edirne bir şehir değil—kapının kendisidir." + N2 +
          "Bu kapı sana sınırın zarafetini öğretir: Geçiş kaba olmaz; bilinçli olur." + N2 +
          "22’nin enerjisi ‘usta kurucu’dur: Büyük yapıları küçük detaylarla kurar." + N2 +
          "Edirne’nin mesajı: ‘Geçerken incel.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Büyük değişimler, küçük inceliklerden doğar.",
        reflection:
          "Bugün hangi geçişi daha zarif yapabilirim?",
      },
      en: {
        title: "22 · The Gate",
        story:
          "Edirne is not only a city—it is the gate itself." + N2 +
          "This gate teaches the elegance of boundaries: crossing is not rough; it is conscious." + N2 +
          "22 carries ‘master builder’ energy: it builds big structures through small details." + N2 +
          "Edirne’s message: ‘Cross with refinement.’" + N2 +
          "Know this: great changes are born from small elegances.",
        reflection:
          "Which transition can I make more graceful today?",
      },
    },

    deepC: {
      tr: {
        title: "22 · Matrix Derin İfşa",
        story:
          "Sistem 22’yi ‘usta kurucu protokolü’ olarak çalıştırır." + N2 +
          "22, vizyonu somutlaştıran sayıdır." + N2 +
          "Gölge test: Büyük hedefi taşıyamayıp dağılıp kalmak." + NL +
          "Işık test: Büyük hedefi küçük adımlarla inşa etmek." + N2 +
          "22 sana şunu söyler: Kapıdan geçmek istiyorsan, kapının kendisi ol." + N2 +
          "Yani: netlik, zarafet, sistem, sabır. Bunlar kapıdır.",
        reflection:
          "Büyük hedefim için bugün hangi küçük yapı taşını koyuyorum?",
      },
      en: {
        title: "22 · Deep Matrix Reveal",
        story:
          "The system runs 22 as a ‘master builder protocol.’" + N2 +
          "22 is the number that materializes vision." + N2 +
          "Shadow test: scattering under the weight of a big goal." + NL +
          "Light test: building a big goal through small steps." + N2 +
          "22 says: if you want to pass the gate, become the gate." + N2 +
          "Meaning: clarity, elegance, system, patience—these are the gate.",
        reflection:
          "Which small building block am I placing today for my big goal?",
      },
    },

    history: {
      tr: {
        title: "22 · Tarih Katmanı",
        story:
          "Edirne, eski başkent hafızası taşır." + N2 +
          "Başkentler bir şey öğretir: düzen, incelik, protokol." + N2 +
          "Tarih katmanı şunu anlatır: Güç sadece kuvvet değil; aynı zamanda estetik ve ölçüdür." + N2 +
          "Bu katman, ‘güç = incelik’ dersini bırakır.",
        reflection:
          "Ben gücü nerede kabalık sanıyorum—ve inceliğe nasıl çevirebilirim?",
      },
      en: {
        title: "22 · History Layer",
        story:
          "Edirne carries the memory of an old capital." + N2 +
          "Capitals teach: order, refinement, protocol." + N2 +
          "This layer says: power is not only force; it is also aesthetics and measure." + N2 +
          "It leaves the lesson: power can be refinement.",
        reflection:
          "Where do I confuse power with roughness—and how can I turn it into refinement?",
      },
    },

    numerology: {
      tr: {
        title: "22 · Numeroloji",
        story:
          "22 = usta kurucu / büyük vizyon / somut sistem." + N2 +
          "22’nin gölgesi:" + NL +
          "• aşırı yük" + NL +
          "• mükemmeliyetçilik" + NL +
          "• erteleme" + N2 +
          "22’nin ışığı:" + NL +
          "• plan" + NL +
          "• yapı" + NL +
          "• vizyonu adım adım kurmak" + N2 +
          "Bu kapı sorar: ‘Vizyonun var, peki sistemin var mı?’",
        reflection:
          "Bugün vizyonum için hangi sistemi kuruyorum?",
      },
      en: {
        title: "22 · Numerology",
        story:
          "22 = master builder / big vision / tangible system." + N2 +
          "Shadow of 22:" + NL +
          "• overload" + NL +
          "• perfectionism" + NL +
          "• procrastination" + N2 +
          "Light of 22:" + NL +
          "• plan" + NL +
          "• structure" + NL +
          "• building vision step by step" + N2 +
          "This gate asks: ‘You have vision—do you have a system?’",
        reflection:
          "What system am I building today for my vision?",
      },
    },

    symbols: {
      tr: {
        title: "22 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kapı: geçiş ve seçim." + NL +
          "• Köprü: iki dünya arasında bağ." + NL +
          "• Taç: düzen ve sorumluluk." + NL +
          "• İnce işçilik: ustalık." + N2 +
          "Sembol mesajı: ‘Büyük yapı, küçük detayla kurulur.’",
        reflection:
          "Bugün hangi küçük detay bütün sistemi güzelleştirir?",
      },
      en: {
        title: "22 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Gate: transition and choice." + NL +
          "• Bridge: connection between worlds." + NL +
          "• Crown: order and responsibility." + NL +
          "• Fine craft: mastery." + N2 +
          "Symbol message: ‘Big structures are built through small details.’",
        reflection:
          "Which small detail beautifies the whole system today?",
      },
    },

    ritual: {
      tr: {
        title: "22 · Ritüel",
        story:
          "22 Dakika Ritüeli (Usta Kurucu):" + N2 +
          "1) Bugün ‘tek bir küçük adım’ seç." + NL +
          "2) O adımı yaz ve yanına şu cümleyi koy: ‘Bu, vizyonumun tuğlası.’" + NL +
          "3) 22 nefes al. Son nefeste söyle: ‘Kuruyorum.’" + N2 +
          "Kapanış: ‘Detay, kaderi değiştirir.’",
        reflection:
          "Bugün hangi tuğlayı koyuyorum?",
      },
      en: {
        title: "22 · Ritual",
        story:
          "22-Minute Ritual (Master Builder):" + N2 +
          "1) Choose one small step for today." + NL +
          "2) Write it and add: ‘This is a brick of my vision.’" + NL +
          "3) Take 22 breaths. On the last say: ‘I build.’" + N2 +
          "Closing: ‘Detail changes destiny.’",
        reflection:
          "Which brick am I placing today?",
      },
    },

    lab: {
      tr: {
        title: "22 · LAB: Master Builder Engine",
        story:
          "Kod Gözü: Vizyon / Sistem / İncelik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Büyük hedef = baskı’" + NL +
          "• ‘Baskı = donma’" + N2 +
          "Rewrite:" + NL +
          "• ‘Büyük hedef = plan’" + NL +
          "• ‘Plan = küçük adım’" + NL +
          "• ‘Küçük adım = büyük sonuç’",
        reflection:
          "Tek cümle yaz: Bugün büyük hedefi hangi küçük adımla kuruyorsun?",
      },
      en: {
        title: "22 · LAB: Master Builder Engine",
        story:
          "Code Eye: Vision / System / Refinement" + N2 +
          "Rule Engine:" + NL +
          "• ‘Big goal = pressure’" + NL +
          "• ‘Pressure = freeze’" + N2 +
          "Rewrite:" + NL +
          "• ‘Big goal = plan’" + NL +
          "• ‘Plan = small step’" + NL +
          "• ‘Small step = big result’",
        reflection:
          "Write one sentence: Which small step builds your big goal today?",
      },
    },
  },
};
export const CITY_23: Record<CityCode, City7> = {
  "23": {
    city: "Elazig",

    base: {
      tr: {
        title: "23 · Sarsıntı",
        story:
          "Elazığ bir şehir değil—sarsıntının öğretmenidir." + N2 +
          "Bu kapı sana şunu öğretir: Sarsılan şey bazen hayat değil, yanılsamadır." + N2 +
          "23’ün enerjisi uyarır: Sabit sandığın yer gevşeyince gerçek görünür." + N2 +
          "Bu kapıdan geçerken şunu bil: Kırılma bir son değil; yeniden hizalanmadır." + N2 +
          "Elazığ’ın mesajı: ‘Sarsıldım’ deme; ‘uyandım’ de.",
        reflection:
          "Bugün beni sarsan şey aslında hangi gerçeği göstermek istiyor?",
      },
      en: {
        title: "23 · Tremor",
        story:
          "Elazig is not only a city—it is the teacher of tremors." + N2 +
          "This gate teaches: what shakes is sometimes not your life, but your illusion." + N2 +
          "23 warns: when what you thought was solid loosens, reality becomes visible." + N2 +
          "Know this: breaking is not an end; it is re-alignment." + N2 +
          "Elazig’s message: don’t say ‘I broke’—say ‘I woke up.’",
        reflection:
          "What truth is the shaking trying to reveal to me today?",
      },
    },

    deepC: {
      tr: {
        title: "23 · Matrix Derin İfşa",
        story:
          "Sistem 23’ü ‘uyanış şoku protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 3 = yaratım. 23 = dengenin yeni bir form üretmesi." + N2 +
          "Gölge test: Sarsıntıyı cezaya çevirmek." + NL +
          "Işık test: Sarsıntıyı işarete çevirmek." + N2 +
          "23 sana şunu söyler: Çatlayan yer, enerjinin sıkıştığı yerdir." + N2 +
          "Bu kapı, sıkışan enerjiyi boşaltır ve sana yeni bir yön verir.",
        reflection:
          "Ben sarsıntıyı ‘kayıp’ mı görüyorum, ‘işaret’ mi?",
      },
      en: {
        title: "23 · Deep Matrix Reveal",
        story:
          "The system runs 23 as an ‘awakening shock protocol.’" + N2 +
          "2 = balance, 3 = creation. 23 is balance generating a new form." + N2 +
          "Shadow test: turning tremor into punishment." + NL +
          "Light test: turning tremor into a sign." + N2 +
          "23 says: the crack is where energy was trapped." + N2 +
          "This gate releases trapped energy and gives you a new direction.",
        reflection:
          "Do I see the tremor as loss—or as a sign?",
      },
    },

    history: {
      tr: {
        title: "23 · Tarih Katmanı",
        story:
          "Elazığ, katmanlı bir hafıza taşır: eski yerleşimler, göçler, dönüşler." + N2 +
          "Tarih katmanı şunu öğretir: Yer değişir, insan değişir, ama ders aynı kalır." + N2 +
          "Bu katman, ‘dayanıklılık’ bilgisini bırakır: Yeniden kurabilen hayat kazanır.",
        reflection:
          "Ben hangi alanda yeniden kurmaya hazırım?",
      },
      en: {
        title: "23 · History Layer",
        story:
          "Elazig carries layered memory: old settlements, migrations, returns." + N2 +
          "This layer teaches: places change, people change, but the lesson stays." + N2 +
          "It leaves the knowledge of resilience: life belongs to the one who can rebuild.",
        reflection:
          "Where am I ready to rebuild?",
      },
    },

    numerology: {
      tr: {
        title: "23 · Numeroloji",
        story:
          "23 = dönüşüm / uyanış / yeni form." + N2 +
          "23’ün gölgesi:" + NL +
          "• paniğe kapılmak" + NL +
          "• kontrolü kaybetme korkusu" + N2 +
          "23’ün ışığı:" + NL +
          "• esneklik" + NL +
          "• hızlı öğrenme" + NL +
          "• yeni düzen kurma" + N2 +
          "Bu kapı sorar: ‘Sarsılınca neyi bırakıyorsun?’",
        reflection:
          "Ben sarsılınca ilk neyi bırakıyorum: kontrol mü, yanılsama mı?",
      },
      en: {
        title: "23 · Numerology",
        story:
          "23 = transformation / awakening / new form." + N2 +
          "Shadow of 23:" + NL +
          "• panic" + NL +
          "• fear of losing control" + N2 +
          "Light of 23:" + NL +
          "• flexibility" + NL +
          "• fast learning" + NL +
          "• building a new order" + N2 +
          "This gate asks: ‘When shaken, what do you release?’",
        reflection:
          "When I’m shaken, what do I release first—control or illusion?",
      },
    },

    symbols: {
      tr: {
        title: "23 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Fay hattı: bastırılmış gerçeğin çıkışı." + NL +
          "• Çatlak: enerji boşalması." + NL +
          "• Taş: dayanıklılık." + NL +
          "• Kıvılcım: uyanış." + N2 +
          "Sembol mesajı: ‘Çatlak korkutmaz; yolu açar.’",
        reflection:
          "Hangi çatlak beni yeni yola çağırıyor?",
      },
      en: {
        title: "23 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Fault line: release of suppressed truth." + NL +
          "• Crack: energy discharge." + NL +
          "• Stone: resilience." + NL +
          "• Spark: awakening." + N2 +
          "Symbol message: ‘A crack doesn’t scare—it opens a path.’",
        reflection:
          "Which crack is calling me into a new path?",
      },
    },

    ritual: {
      tr: {
        title: "23 · Ritüel",
        story:
          "23 Dakika Ritüeli (Hizalanma):" + N2 +
          "1) Bir kağıda yaz: ‘Sarsıntının mesajı…’" + NL +
          "2) Altına tek cümle yaz: ‘Bırakıyorum…’" + NL +
          "3) 23 nefes al. Son nefeste söyle: ‘Hizalanıyorum.’" + N2 +
          "Kapanış: ‘Sarsıntı beni doğruya getirir.’",
        reflection:
          "Bugün neyi bırakıp hizalanıyorum?",
      },
      en: {
        title: "23 · Ritual",
        story:
          "23-Minute Ritual (Alignment):" + N2 +
          "1) Write: ‘The message of the tremor is…’" + NL +
          "2) Under it write one line: ‘I release…’" + NL +
          "3) Take 23 breaths. On the last say: ‘I align.’" + N2 +
          "Closing: ‘The tremor brings me to truth.’",
        reflection:
          "What am I releasing to align today?",
      },
    },

    lab: {
      tr: {
        title: "23 · LAB: Shock-to-Truth Engine",
        story:
          "Kod Gözü: Sarsıntı / İşaret / Yeni Yön" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Sarsıntı = felaket’" + NL +
          "• ‘Felaket = güçsüzlük’" + N2 +
          "Rewrite:" + NL +
          "• ‘Sarsıntı = uyanış’" + NL +
          "• ‘Uyanış = yön’",
        reflection:
          "Tek cümle yaz: Bugün sarsıntıyı nasıl bir işarete çeviriyorsun?",
      },
      en: {
        title: "23 · LAB: Shock-to-Truth Engine",
        story:
          "Code Eye: Tremor / Sign / New Direction" + N2 +
          "Rule Engine:" + NL +
          "• ‘Tremor = disaster’" + NL +
          "• ‘Disaster = weakness’" + N2 +
          "Rewrite:" + NL +
          "• ‘Tremor = awakening’" + NL +
          "• ‘Awakening = direction’",
        reflection:
          "Write one sentence: How do you turn the tremor into a sign today?",
      },
    },
  },
};
export const CITY_24: Record<CityCode, City7> = {
  "24": {
    city: "Erzincan",

    base: {
      tr: {
        title: "24 · Yeniden Kur",
        story:
          "Erzincan bir şehir değil—yeniden kurmanın öğretmenidir." + N2 +
          "Bu kapı sana şunu öğretir: Yıkımın karşısında kalmak değil, yeniden kurmak güçtür." + N2 +
          "24’ün enerjisi ‘toprak + disiplin’ gibidir: dağılırsa toplar, kırılırsa onarır." + N2 +
          "Burada hayat şunu fısıldar: ‘Her çöküş, daha doğru bir düzen için yer açar.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Yeniden kurmak, yeniden doğmaktır.",
        reflection:
          "Bugün hangi alanda yeniden düzen kurmam gerekiyor?",
      },
      en: {
        title: "24 · Rebuild",
        story:
          "Erzincan is not only a city—it is the teacher of rebuilding." + N2 +
          "This gate teaches: strength is not standing in destruction, but rebuilding after it." + N2 +
          "24 carries ‘earth + discipline’: when things scatter, it gathers; when they break, it repairs." + N2 +
          "Life whispers here: ‘Every collapse makes space for a truer order.’" + N2 +
          "Know this: rebuilding is rebirth.",
        reflection:
          "Where do I need to rebuild order today?",
      },
    },

    deepC: {
      tr: {
        title: "24 · Matrix Derin İfşa",
        story:
          "Sistem 24’ü ‘yeniden yapı protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 4 = yapı. 24 = dengeli yapı kurmak." + N2 +
          "Gölge test: ‘Eskiye dönmek’ ısrarı." + NL +
          "Işık test: ‘Daha doğru bir yapı’ seçimi." + N2 +
          "24 sana şunu söyler: Yeniden kurmak, aynı şeyi tekrar etmek değildir." + N2 +
          "Yeni yapı; dersin özüyle kurulur, korkunun kopyasıyla değil.",
        reflection:
          "Ben yeniden kurarken eskiyi mi kopyalıyorum, dersi mi kullanıyorum?",
      },
      en: {
        title: "24 · Deep Matrix Reveal",
        story:
          "The system runs 24 as a ‘re-structure protocol.’" + N2 +
          "2 = balance, 4 = structure. 24 is building balanced structure." + N2 +
          "Shadow test: insisting on ‘going back to the old.’" + NL +
          "Light test: choosing ‘a truer structure.’" + N2 +
          "24 says: rebuilding is not repeating the same thing." + N2 +
          "The new structure is built from the lesson’s essence, not from fear’s copy.",
        reflection:
          "When I rebuild, am I copying the old—or using the lesson?",
      },
    },

    history: {
      tr: {
        title: "24 · Tarih Katmanı",
        story:
          "Erzincan, hatırlatan bir hafızadır: İnsan dayanır, sonra yeniden yapar." + N2 +
          "Tarih katmanı şunu öğretir: Şehirler bile yeniden kurulur; insan neden kuramasın?" + N2 +
          "Bu katman, ‘yeniden kurma cesareti’ dersini bırakır." + N2 +
          "Bazen kader, ‘aynı yapı’ değil, ‘daha doğru yapı’ ister.",
        reflection:
          "Ben hangi yapıyı daha doğru kurabilirim?",
      },
      en: {
        title: "24 · History Layer",
        story:
          "Erzincan is memory that reminds: humans endure, then rebuild." + N2 +
          "This layer teaches: even cities rebuild—why shouldn’t you?" + N2 +
          "It leaves the lesson of courage to rebuild." + N2 +
          "Sometimes destiny wants not the same structure, but a truer one.",
        reflection:
          "Which structure in my life can I rebuild more truly?",
      },
    },

    numerology: {
      tr: {
        title: "24 · Numeroloji",
        story:
          "24 = düzen / onarım / sürdürülebilir yapı." + N2 +
          "24’ün gölgesi:" + NL +
          "• eskiye tutunmak" + NL +
          "• korkuyla karar" + N2 +
          "24’ün ışığı:" + NL +
          "• sağlam plan" + NL +
          "• denge" + NL +
          "• adım adım onarım" + N2 +
          "Bu kapı sorar: ‘Onarılacak şey ne?’",
        reflection:
          "Bugün neyi onarırsam sistemim rahatlar?",
      },
      en: {
        title: "24 · Numerology",
        story:
          "24 = order / repair / sustainable structure." + N2 +
          "Shadow of 24:" + NL +
          "• clinging to the old" + NL +
          "• decisions from fear" + N2 +
          "Light of 24:" + NL +
          "• solid plan" + NL +
          "• balance" + NL +
          "• step-by-step repair" + N2 +
          "This gate asks: ‘What needs repair?’",
        reflection:
          "What repair will calm my system today?",
      },
    },

    symbols: {
      tr: {
        title: "24 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Tuğla: adım adım kurma." + NL +
          "• Temel: güven." + NL +
          "• Onarım izi: dersin izi." + NL +
          "• 24 halka: düzenli ritim." + N2 +
          "Sembol mesajı: ‘Yeniden kurmak utanılacak değil; ustalık işidir.’",
        reflection:
          "Ben onarımı nerede ‘zayıflık’ sanıyorum?",
      },
      en: {
        title: "24 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Brick: building step by step." + NL +
          "• Foundation: safety." + NL +
          "• Repair mark: trace of the lesson." + NL +
          "• 24 rings: steady rhythm." + N2 +
          "Symbol message: ‘Rebuilding is not shame; it is mastery.’",
        reflection:
          "Where do I mistake repair for weakness?",
      },
    },

    ritual: {
      tr: {
        title: "24 · Ritüel",
        story:
          "24 Dakika Ritüeli (Yeniden Yapı):" + N2 +
          "1) Bugün düzelteceğin 1 şeyi yaz." + NL +
          "2) Onun altına 3 küçük adım yaz." + NL +
          "3) 24 nefes al. Son nefeste söyle: ‘Kuruyorum.’" + N2 +
          "Kapanış: ‘Küçük adım, büyük yapı.’",
        reflection:
          "Bugün hangi 3 adımı atıyorum?",
      },
      en: {
        title: "24 · Ritual",
        story:
          "24-Minute Ritual (Rebuild):" + N2 +
          "1) Write one thing you will repair today." + NL +
          "2) Under it write 3 small steps." + NL +
          "3) Take 24 breaths. On the last say: ‘I build.’" + N2 +
          "Closing: ‘Small steps, big structure.’",
        reflection:
          "Which 3 steps am I taking today?",
      },
    },

    lab: {
      tr: {
        title: "24 · LAB: Rebuild Engine",
        story:
          "Kod Gözü: Onarım / Denge / Yapı" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Çöktüyse bitti’" + NL +
          "• ‘Onarım = geri adım’" + N2 +
          "Rewrite:" + NL +
          "• ‘Çöküş = yer açar’" + NL +
          "• ‘Onarım = ileri ustalık’",
        reflection:
          "Tek cümle yaz: Bugün yeniden kurmayı nasıl seçiyorsun?",
      },
      en: {
        title: "24 · LAB: Rebuild Engine",
        story:
          "Code Eye: Repair / Balance / Structure" + N2 +
          "Rule Engine:" + NL +
          "• ‘If it collapsed, it’s over’" + NL +
          "• ‘Repair = going backward’" + N2 +
          "Rewrite:" + NL +
          "• ‘Collapse = makes space’" + NL +
          "• ‘Repair = forward mastery’",
        reflection:
          "Write one sentence: How do you choose to rebuild today?",
      },
    },
  },
};
export const CITY_25: Record<CityCode, City7> = {
  "25": {
    city: "Erzurum",

    base: {
      tr: {
        title: "25 · Onur",
        story:
          "Erzurum bir şehir değil—onurun ve disiplinin soğuk ateşidir." + N2 +
          "Bu kapı sana şunu öğretir: Sert koşullar, karakteri açığa çıkarır." + N2 +
          "25’in enerjisi kış gibidir: Gereksizi keser, özü bırakır." + N2 +
          "Burada irade, sıcak bir konfor değil; soğukta bile yürüyebilmektir." + N2 +
          "Bu kapıdan geçerken şunu bil: Disiplin bir ceza değil; kendine saygıdır.",
        reflection:
          "Bugün kendime saygı için hangi disiplini seçiyorum?",
      },
      en: {
        title: "25 · Honor",
        story:
          "Erzurum is not only a city—it is the cold fire of honor and discipline." + N2 +
          "This gate teaches: harsh conditions reveal character." + N2 +
          "25 is winter energy: it cuts the unnecessary and leaves essence." + N2 +
          "Here will is not warm comfort; it is walking even in cold." + N2 +
          "Know this: discipline is not punishment; it is self-respect.",
        reflection:
          "Which discipline am I choosing today as an act of self-respect?",
      },
    },

    deepC: {
      tr: {
        title: "25 · Matrix Derin İfşa",
        story:
          "Sistem 25’i ‘dayanıklılık protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 5 = değişim. 25 = değişimi dengeyle taşımak." + N2 +
          "Gölge test: Sertliği kalp kapatmaya çevirmek." + NL +
          "Işık test: Sertliği disipline çevirmek." + N2 +
          "25 sana şunu söyler: Soğuk, duygusuzluk değildir; netliktir." + N2 +
          "Bu kapı, bahane yerine yapı ister: küçük ama kesintisiz adım.",
        reflection:
          "Ben sertliği kalbimi kapatmak için mi kullanıyorum, güçlenmek için mi?",
      },
      en: {
        title: "25 · Deep Matrix Reveal",
        story:
          "The system runs 25 as a ‘resilience protocol.’" + N2 +
          "2 = balance, 5 = change. 25 is carrying change through balance." + N2 +
          "Shadow test: turning hardness into heart-closure." + NL +
          "Light test: turning hardness into discipline." + N2 +
          "25 says: cold is not lack of feeling; it is clarity." + N2 +
          "This gate demands structure instead of excuses: small but uninterrupted steps.",
        reflection:
          "Am I using hardness to close my heart—or to grow stronger?",
      },
    },

    history: {
      tr: {
        title: "25 · Tarih Katmanı",
        story:
          "Erzurum, yüksekliğin ve kışın hafızasını taşır." + N2 +
          "Yüksek şehirler şunu öğretir: Nefes kıymetlenir, adım ciddileşir." + N2 +
          "Tarih katmanı burada bir ders bırakır: Zor şartlar, birlik ve onur üretir." + N2 +
          "Bu katman, ‘dayanıklılık’ bilgisini kültüre çevirir.",
        reflection:
          "Benim hayatımda hangi şart beni olgunlaştırdı?",
      },
      en: {
        title: "25 · History Layer",
        story:
          "Erzurum carries the memory of altitude and winter." + N2 +
          "High cities teach: breath becomes precious, steps become serious." + N2 +
          "This layer leaves a lesson: hard conditions create unity and honor." + N2 +
          "It turns resilience into culture.",
        reflection:
          "Which condition in my life matured me the most?",
      },
    },

    numerology: {
      tr: {
        title: "25 · Numeroloji",
        story:
          "25 = disiplinli değişim / sağlam karakter." + N2 +
          "25’in gölgesi:" + NL +
          "• sertleşmek" + NL +
          "• duygudan kopmak" + N2 +
          "25’in ışığı:" + NL +
          "• öz disiplin" + NL +
          "• onur" + NL +
          "• net sınır" + N2 +
          "Bu kapı sorar: ‘Bugün hangi standardı koruyorsun?’",
        reflection:
          "Bugün hangi standardım pazarlık konusu değil?",
      },
      en: {
        title: "25 · Numerology",
        story:
          "25 = disciplined change / strong character." + N2 +
          "Shadow of 25:" + NL +
          "• hardening" + NL +
          "• disconnecting from emotion" + N2 +
          "Light of 25:" + NL +
          "• self-discipline" + NL +
          "• honor" + NL +
          "• clear boundaries" + N2 +
          "This gate asks: ‘Which standard do you keep today?’",
        reflection:
          "Which standard is non-negotiable for me today?",
      },
    },

    symbols: {
      tr: {
        title: "25 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kar: arınma ve netlik." + NL +
          "• Kale: korunma ve disiplin." + NL +
          "• Nefes buharı: canlılık." + NL +
          "• Mavi-soğuk ton: sakin irade." + N2 +
          "Sembol mesajı: ‘Soğuk, gereksizi keser. Öz kalır.’",
        reflection:
          "Bugün gereksizi kesersem özüm ne olur?",
      },
      en: {
        title: "25 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Snow: cleansing and clarity." + NL +
          "• Fortress: protection and discipline." + NL +
          "• Breath steam: life force." + NL +
          "• Cold-blue tone: calm will." + N2 +
          "Symbol message: ‘Cold cuts excess. Essence remains.’",
        reflection:
          "If I cut the unnecessary today, what essence remains?",
      },
    },

    ritual: {
      tr: {
        title: "25 · Ritüel",
        story:
          "25 Dakika Ritüeli (Onur Sözü):" + N2 +
          "1) Bir cümle yaz: ‘Benim standardım…’" + NL +
          "2) Altına yaz: ‘Bunu korumak kendime saygıdır.’" + NL +
          "3) 25 nefes al. Son nefeste söyle: ‘Onurum sağlam.’" + N2 +
          "Kapanış: ‘Disiplinim sevgi.’",
        reflection:
          "Bugün hangi standardımı koruyorum?",
      },
      en: {
        title: "25 · Ritual",
        story:
          "25-Minute Ritual (Honor Vow):" + N2 +
          "1) Write: ‘My standard is…’" + NL +
          "2) Add: ‘Protecting this is self-respect.’" + NL +
          "3) Take 25 breaths. On the last say: ‘My honor stands.’" + N2 +
          "Closing: ‘My discipline is love.’",
        reflection:
          "Which standard am I protecting today?",
      },
    },

    lab: {
      tr: {
        title: "25 · LAB: Discipline Engine",
        story:
          "Kod Gözü: Disiplin / Onur / Netlik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Disiplin = sertlik’" + NL +
          "• ‘Sertlik = yalnızlık’" + N2 +
          "Rewrite:" + NL +
          "• ‘Disiplin = öz saygı’" + NL +
          "• ‘Öz saygı = güç’",
        reflection:
          "Tek cümle yaz: Bugün disiplinini nasıl sevgiye çeviriyorsun?",
      },
      en: {
        title: "25 · LAB: Discipline Engine",
        story:
          "Code Eye: Discipline / Honor / Clarity" + N2 +
          "Rule Engine:" + NL +
          "• ‘Discipline = harshness’" + NL +
          "• ‘Harshness = loneliness’" + N2 +
          "Rewrite:" + NL +
          "• ‘Discipline = self-respect’" + NL +
          "• ‘Self-respect = strength’",
        reflection:
          "Write one sentence: How do you turn discipline into love today?",
      },
    },
  },
};
export const CITY_26: Record<CityCode, City7> = {
  "26": {
    city: "Eskisehir",

    base: {
      tr: {
        title: "26 · Oyun",
        story:
          "Eskişehir bir şehir değil—zihnin genç kalma hâlidir." + N2 +
          "Bu kapı sana şunu öğretir: Öğrenmek ağır olmak zorunda değil. Oyun, bilincin en hızlı öğretmenidir." + N2 +
          "26’nın enerjisi ‘akış + merak’ taşır: yeni fikirler, yeni bağlantılar, yeni yollar." + N2 +
          "Eskişehir’in mesajı: ‘Hafifle, dene, üret.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Zihin esnerse kader esner.",
        reflection:
          "Bugün hangi şeyi oyun gibi deneyebilirim?",
      },
      en: {
        title: "26 · Play",
        story:
          "Eskisehir is not only a city—it is the mind staying young." + N2 +
          "This gate teaches: learning doesn’t have to be heavy. Play is the fastest teacher of consciousness." + N2 +
          "26 carries ‘flow + curiosity’: new ideas, new connections, new paths." + N2 +
          "Eskisehir’s message: ‘Lighten, try, create.’" + N2 +
          "Know this: when the mind flexes, destiny flexes.",
        reflection:
          "What can I approach like a game today?",
      },
    },

    deepC: {
      tr: {
        title: "26 · Matrix Derin İfşa",
        story:
          "Sistem 26’yı ‘öğrenme-hız protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 6 = sorumluluk. 26 = sorumluluğu dengeli şekilde taşımayı öğrenmek." + N2 +
          "Gölge test: Her şeyi ciddiye alıp donmak." + NL +
          "Işık test: Ciddiyeti koruyup oyunu hatırlamak." + N2 +
          "26 sana şunu söyler: Oyun kaçış değil; zekânın çalışma biçimidir." + N2 +
          "Bu kapı, ‘fazla yük’ü ‘hafif adım’a çevirir.",
        reflection:
          "Ben neyi fazla ciddiye alıyorum ki akışım duruyor?",
      },
      en: {
        title: "26 · Deep Matrix Reveal",
        story:
          "The system runs 26 as a ‘learning-speed protocol.’" + N2 +
          "2 = balance, 6 = responsibility. 26 is learning to carry responsibility in balance." + N2 +
          "Shadow test: taking everything so seriously that you freeze." + NL +
          "Light test: keeping responsibility while remembering play." + N2 +
          "26 says: play is not escape; it is how intelligence works." + N2 +
          "This gate turns ‘heavy load’ into ‘light steps.’",
        reflection:
          "What am I taking too seriously that stops my flow?",
      },
    },

    history: {
      tr: {
        title: "26 · Tarih Katmanı",
        story:
          "Eskişehir; ‘eski’ ve ‘yeni’nin aynı anda yaşadığı bir hafızadır." + N2 +
          "Bu katman şunu öğretir: Geçmişi inkâr etmeden yeniyi kurabilirsin." + N2 +
          "Şehir, dönüşümü kültürle yapar: sanatla, eğitimle, oyunla." + N2 +
          "Tarih katmanı, ‘yenilenme’ dersini bırakır.",
        reflection:
          "Ben eskiyi taşırken yeniye nerede yer açıyorum?",
      },
      en: {
        title: "26 · History Layer",
        story:
          "Eskisehir is memory where ‘old’ and ‘new’ live together." + N2 +
          "This layer teaches: you can build the new without denying the past." + N2 +
          "Transformation here happens through culture: art, education, play." + N2 +
          "It leaves the lesson of renewal.",
        reflection:
          "Where am I making space for the new while carrying the old?",
      },
    },

    numerology: {
      tr: {
        title: "26 · Numeroloji",
        story:
          "26 = dengeli sorumluluk / öğrenme / akış." + N2 +
          "26’nın gölgesi:" + NL +
          "• dağılmak" + NL +
          "• ertelemek" + NL +
          "• ‘başlayıp bırakmak’" + N2 +
          "26’nın ışığı:" + NL +
          "• merak" + NL +
          "• düzenli pratik" + NL +
          "• hafif ama sürdürülebilir ilerleme" + N2 +
          "Bu kapı sorar: ‘Her gün küçük bir şey yapar mısın?’",
        reflection:
          "Bugün her gün yapabileceğim küçük adım ne?",
      },
      en: {
        title: "26 · Numerology",
        story:
          "26 = balanced responsibility / learning / flow." + N2 +
          "Shadow of 26:" + NL +
          "• scattering" + NL +
          "• procrastination" + NL +
          "• starting then quitting" + N2 +
          "Light of 26:" + NL +
          "• curiosity" + NL +
          "• consistent practice" + NL +
          "• light yet sustainable progress" + N2 +
          "This gate asks: ‘Will you do one small thing daily?’",
        reflection:
          "What is my small daily step today?",
      },
    },

    symbols: {
      tr: {
        title: "26 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Pusula: yön ve keşif." + NL +
          "• Defter: öğrenme kaydı." + NL +
          "• Renkli kalem: yaratım." + NL +
          "• Köprü: eski-yeni bağlantısı." + N2 +
          "Sembol mesajı: ‘Hafif adım, büyük dönüşüm.’",
        reflection:
          "Bugün hangi rengi hayatıma ekliyorum?",
      },
      en: {
        title: "26 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Compass: direction and exploration." + NL +
          "• Notebook: learning record." + NL +
          "• Color pencil: creation." + NL +
          "• Bridge: old-new connection." + N2 +
          "Symbol message: ‘Light steps create big change.’",
        reflection:
          "What color am I adding to my life today?",
      },
    },

    ritual: {
      tr: {
        title: "26 · Ritüel",
        story:
          "26 Dakika Ritüeli (Oyunla Öğren):" + N2 +
          "1) Bugün öğrenmek istediğin 1 şeyi seç." + NL +
          "2) Onu ‘oyun’ gibi 26 dakika dene: hata serbest, merak serbest." + NL +
          "3) Son cümle: ‘Merakım yolum.’" + N2 +
          "Kapanış: ‘Zihin esner, kader esner.’",
        reflection:
          "Bugün merakı hangi alana taşıyorum?",
      },
      en: {
        title: "26 · Ritual",
        story:
          "26-Minute Ritual (Learn Through Play):" + N2 +
          "1) Choose one thing you want to learn today." + NL +
          "2) Practice it for 26 minutes like a game: mistakes allowed, curiosity allowed." + NL +
          "3) Final line: ‘Curiosity is my path.’" + N2 +
          "Closing: ‘When the mind flexes, destiny flexes.’",
        reflection:
          "Where do I bring curiosity today?",
      },
    },

    lab: {
      tr: {
        title: "26 · LAB: Learning Engine",
        story:
          "Kod Gözü: Merak / Akış / Pratik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hata = utanç’" + NL +
          "• ‘Utanç = bırakma’" + N2 +
          "Rewrite:" + NL +
          "• ‘Hata = veri’" + NL +
          "• ‘Veri = gelişim’" + NL +
          "• ‘Gelişim = akış’",
        reflection:
          "Tek cümle yaz: Bugün hatayı nasıl veriye çeviriyorsun?",
      },
      en: {
        title: "26 · LAB: Learning Engine",
        story:
          "Code Eye: Curiosity / Flow / Practice" + N2 +
          "Rule Engine:" + NL +
          "• ‘Mistake = shame’" + NL +
          "• ‘Shame = quitting’" + N2 +
          "Rewrite:" + NL +
          "• ‘Mistake = data’" + NL +
          "• ‘Data = growth’" + NL +
          "• ‘Growth = flow’",
        reflection:
          "Write one sentence: How do you turn mistakes into data today?",
      },
    },
  },
};
export const CITY_27: Record<CityCode, City7> = {
  "27": {
    city: "Gaziantep",

    base: {
      tr: {
        title: "27 · Ustalık",
        story:
          "Gaziantep bir şehir değil—ustalığın ateşidir." + N2 +
          "Bu kapı sana şunu öğretir: Lezzet sadece tat değil, emektir." + N2 +
          "27’nin enerjisi ‘ateş + toprak’ gibi çalışır: pişirir, olgunlaştırır, şekil verir." + N2 +
          "Burada irade, konuşmak değil; üretmektir." + N2 +
          "Bu kapıdan geçerken şunu bil: Ustalık, tekrarın içinden doğar.",
        reflection:
          "Bugün hangi alanda ustalaşmak için tekrar ediyorum?",
      },
      en: {
        title: "27 · Mastery",
        story:
          "Gaziantep is not only a city—it is the fire of mastery." + N2 +
          "This gate teaches: flavor is not only taste; it is labor." + N2 +
          "27 works like ‘fire + earth’: it cooks, matures, shapes." + N2 +
          "Here will is not speaking—it is producing." + N2 +
          "Know this: mastery is born through repetition.",
        reflection:
          "Where am I repeating today to become a master?",
      },
    },

    deepC: {
      tr: {
        title: "27 · Matrix Derin İfşa",
        story:
          "Sistem 27’yi ‘emek-ürün protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 7 = iç görüş. 27 = iç görüşle dengeli üretim." + N2 +
          "Gölge test: Kıyas ve ‘yetmiyorum’ hissi." + NL +
          "Işık test: Kendi ritmini bulup üretmek." + N2 +
          "27 sana şunu söyler: Başkasıyla yarışma, kendi standardını inşa et." + N2 +
          "Bu kapı, ‘yetenek’ ile ‘emek’i birleştirir: yetenek yön verir, emek sonucu doğurur.",
        reflection:
          "Ben bugün kimin standardına göre yaşıyorum: benim mi, başkasının mı?",
      },
      en: {
        title: "27 · Deep Matrix Reveal",
        story:
          "The system runs 27 as a ‘labor-product protocol.’" + N2 +
          "2 = balance, 7 = inner sight. 27 is balanced production through inner sight." + N2 +
          "Shadow test: comparison and the feeling ‘I’m not enough.’" + NL +
          "Light test: finding your rhythm and producing." + N2 +
          "27 says: don’t compete with others—build your own standard." + N2 +
          "This gate unites talent and effort: talent gives direction, effort gives results.",
        reflection:
          "Whose standard am I living by today—mine or someone else’s?",
      },
    },

    history: {
      tr: {
        title: "27 · Tarih Katmanı",
        story:
          "Gaziantep, ticaretin ve zanaatın hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Üretim kültürü, karakter üretir." + N2 +
          "Bir şehir nasıl emeğiyle anılıyorsa, insan da emeğiyle kendini yazar." + N2 +
          "Bu katman, ‘emek = kimlik’ dersini bırakır.",
        reflection:
          "Ben hangi emeğimle kendimi yazıyorum?",
      },
      en: {
        title: "27 · History Layer",
        story:
          "Gaziantep carries the memory of trade and craftsmanship." + N2 +
          "This layer teaches: a culture of production creates character." + N2 +
          "As a city is known by its work, you write yourself through your work." + N2 +
          "It leaves the lesson: labor becomes identity.",
        reflection:
          "Through which effort am I writing myself today?",
      },
    },

    numerology: {
      tr: {
        title: "27 · Numeroloji",
        story:
          "27 = iç standart / üretim / olgunluk." + N2 +
          "27’nin gölgesi:" + NL +
          "• kıyas" + NL +
          "• hızlı sonuç takıntısı" + N2 +
          "27’nin ışığı:" + NL +
          "• süreç" + NL +
          "• düzenli tekrar" + NL +
          "• ustalık" + N2 +
          "Bu kapı sorar: ‘Her gün küçük bir tekrar yapar mısın?’",
        reflection:
          "Bugün hangi küçük tekrar beni ustalaştırır?",
      },
      en: {
        title: "27 · Numerology",
        story:
          "27 = inner standard / production / maturity." + N2 +
          "Shadow of 27:" + NL +
          "• comparison" + NL +
          "• obsession with quick results" + N2 +
          "Light of 27:" + NL +
          "• process" + NL +
          "• consistent repetition" + NL +
          "• mastery" + N2 +
          "This gate asks: ‘Will you do one small repetition daily?’",
        reflection:
          "Which small repetition will make me masterful today?",
      },
    },

    symbols: {
      tr: {
        title: "27 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Ocak/ateş: dönüşüm." + NL +
          "• Hamur: form." + NL +
          "• Bıçak: keskin seçim." + NL +
          "• Bakır: zanaat." + N2 +
          "Sembol mesajı: ‘Ustalık ateş ister. Ateş sabır ister.’",
        reflection:
          "Benim ateşim hangi alanda yanıyor?",
      },
      en: {
        title: "27 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Hearth/fire: transformation." + NL +
          "• Dough: form." + NL +
          "• Knife: sharp choice." + NL +
          "• Copper: craft." + N2 +
          "Symbol message: ‘Mastery needs fire. Fire needs patience.’",
        reflection:
          "Where is my inner fire burning today?",
      },
    },

    ritual: {
      tr: {
        title: "27 · Ritüel",
        story:
          "27 Dakika Ritüeli (Ustalık Tekrarı):" + N2 +
          "1) Ustalaşmak istediğin 1 şeyi seç." + NL +
          "2) 27 dakika boyunca sadece onu yap." + NL +
          "3) Son cümle: ‘Tekrar, ustalığım.’" + N2 +
          "Kapanış: ‘Standart bende.’",
        reflection:
          "Bugün hangi tekrar beni güçlendiriyor?",
      },
      en: {
        title: "27 · Ritual",
        story:
          "27-Minute Ritual (Mastery Repetition):" + N2 +
          "1) Choose one thing you want to master." + NL +
          "2) Do only that for 27 minutes." + NL +
          "3) Final line: ‘Repetition is my mastery.’" + N2 +
          "Closing: ‘The standard is mine.’",
        reflection:
          "Which repetition strengthens me today?",
      },
    },

    lab: {
      tr: {
        title: "27 · LAB: Mastery Engine",
        story:
          "Kod Gözü: Emek / Standart / Tekrar" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hemen olmalı’" + NL +
          "• ‘Olmadıysa değersiz’" + N2 +
          "Rewrite:" + NL +
          "• ‘Tekrar = değer’" + NL +
          "• ‘Değer = ustalık’",
        reflection:
          "Tek cümle yaz: Bugün ‘hemen’ yerine neyi seçiyorsun?",
      },
      en: {
        title: "27 · LAB: Mastery Engine",
        story:
          "Code Eye: Effort / Standard / Repetition" + N2 +
          "Rule Engine:" + NL +
          "• ‘It must happen now’" + NL +
          "• ‘If not, it’s worthless’" + N2 +
          "Rewrite:" + NL +
          "• ‘Repetition = value’" + NL +
          "• ‘Value = mastery’",
        reflection:
          "Write one sentence: What do you choose instead of ‘now’ today?",
      },
    },
  },
};
export const CITY_28: Record<CityCode, City7> = {
  "28": {
    city: "Giresun",

    base: {
      tr: {
        title: "28 · Çekirdek",
        story:
          "Giresun bir şehir değil—çekirdekte saklı berekettir." + N2 +
          "Bu kapı sana şunu öğretir: Büyük güç bazen küçük bir şeyin içinde saklanır." + N2 +
          "28’in enerjisi ‘yeşil üretkenlik’ taşır: çoğaltır, besler, büyütür." + N2 +
          "Giresun’un mesajı: ‘Tohumunu koru, meyveni büyüt.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Bereket, sadece çokluk değil; doğru zamanda doğru üründür.",
        reflection:
          "Bugün benim çekirdeğim ne—hangi küçük şey büyümek istiyor?",
      },
      en: {
        title: "28 · Seed",
        story:
          "Giresun is not only a city—it is abundance hidden in the seed." + N2 +
          "This gate teaches: great power can be stored inside something small." + N2 +
          "28 carries ‘green fertility’: it multiplies, nourishes, grows." + N2 +
          "Giresun’s message: ‘Protect your seed, grow your fruit.’" + N2 +
          "Know this: abundance is not only quantity; it is the right harvest at the right time.",
        reflection:
          "What is my seed today—what small thing wants to grow?",
      },
    },

    deepC: {
      tr: {
        title: "28 · Matrix Derin İfşa",
        story:
          "Sistem 28’i ‘büyütme protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 8 = güç. 28 = gücü dengeli büyütmek." + N2 +
          "Gölge test: Hızlı büyüyüp kökü zayıf bırakmak." + NL +
          "Işık test: Kökü güçlendirerek büyümek." + N2 +
          "28 sana şunu söyler: Büyüme, hız değil; kapasite artışıdır." + N2 +
          "Bu kapı, ‘kısa patlama’ yerine ‘sürdürülebilir bereket’ ister.",
        reflection:
          "Ben büyümeyi hız mı sanıyorum, kapasite mi?",
      },
      en: {
        title: "28 · Deep Matrix Reveal",
        story:
          "The system runs 28 as a ‘growth protocol.’" + N2 +
          "2 = balance, 8 = power. 28 is growing power with balance." + N2 +
          "Shadow test: growing fast while leaving the root weak." + NL +
          "Light test: growing by strengthening the root." + N2 +
          "28 says: growth is not speed; it is increased capacity." + N2 +
          "This gate demands sustainable abundance, not short bursts.",
        reflection:
          "Do I mistake growth for speed—or for capacity?",
      },
    },

    history: {
      tr: {
        title: "28 · Tarih Katmanı",
        story:
          "Giresun, Karadeniz’in yeşil hafızasını taşır." + N2 +
          "Burası ‘üreten doğa’nın şehridir: yağmur, toprak, emek, ürün." + N2 +
          "Tarih katmanı şunu öğretir: Bereket, doğayla uyumdan doğar." + N2 +
          "Bu katman, ‘uyum = ürün’ dersini bırakır.",
        reflection:
          "Ben hangi alanda doğayla uyumlanırsam ürün verir?",
      },
      en: {
        title: "28 · History Layer",
        story:
          "Giresun carries the green memory of the Black Sea." + N2 +
          "This is the city of producing nature: rain, soil, labor, harvest." + N2 +
          "This layer teaches: abundance is born from harmony with nature." + N2 +
          "It leaves the lesson: harmony becomes harvest.",
        reflection:
          "Where can I align with nature so my life bears fruit?",
      },
    },

    numerology: {
      tr: {
        title: "28 · Numeroloji",
        story:
          "28 = büyüme / bereket / güç." + N2 +
          "28’in gölgesi:" + NL +
          "• sabırsız büyüme" + NL +
          "• kapasiteyi aşmak" + N2 +
          "28’in ışığı:" + NL +
          "• sürdürülebilir ritim" + NL +
          "• sağlam kök" + NL +
          "• dengeli bolluk" + N2 +
          "Bu kapı sorar: ‘Ne kadarını taşıyabilirsin?’",
        reflection:
          "Bugün kapasitemi büyütmek için neyi düzenli yapıyorum?",
      },
      en: {
        title: "28 · Numerology",
        story:
          "28 = growth / abundance / power." + N2 +
          "Shadow of 28:" + NL +
          "• impatient growth" + NL +
          "• exceeding capacity" + N2 +
          "Light of 28:" + NL +
          "• sustainable rhythm" + NL +
          "• strong roots" + NL +
          "• balanced abundance" + N2 +
          "This gate asks: ‘How much can you truly hold?’",
        reflection:
          "What consistent practice grows my capacity today?",
      },
    },

    symbols: {
      tr: {
        title: "28 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Fındık/çekirdek: saklı güç." + NL +
          "• Yeşil yaprak: üretkenlik." + NL +
          "• Yağmur: bereket." + NL +
          "• Sepet: kapasite." + N2 +
          "Sembol mesajı: ‘Küçük çekirdek, büyük orman olur.’",
        reflection:
          "Benim ormanım hangi çekirdekten büyüyor?",
      },
      en: {
        title: "28 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Nut/seed: hidden power." + NL +
          "• Green leaf: fertility." + NL +
          "• Rain: abundance." + NL +
          "• Basket: capacity." + N2 +
          "Symbol message: ‘A small seed becomes a great forest.’",
        reflection:
          "Which seed is growing into my forest?",
      },
    },

    ritual: {
      tr: {
        title: "28 · Ritüel",
        story:
          "28 Dakika Ritüeli (Çekirdek Planı):" + N2 +
          "1) Bugün büyütmek istediğin 1 şeyi seç." + NL +
          "2) Ona dair 2 küçük adım yaz." + NL +
          "3) 28 nefes al. Son nefeste söyle: ‘Büyütüyorum.’" + N2 +
          "Kapanış: ‘Kök sağlam, bereket kalıcı.’",
        reflection:
          "Bugün hangi küçük adım çekirdeği büyütür?",
      },
      en: {
        title: "28 · Ritual",
        story:
          "28-Minute Ritual (Seed Plan):" + N2 +
          "1) Choose one thing you want to grow." + NL +
          "2) Write 2 small steps for it." + NL +
          "3) Take 28 breaths. On the last say: ‘I grow.’" + N2 +
          "Closing: ‘Strong root, lasting abundance.’",
        reflection:
          "Which small step grows the seed today?",
      },
    },

    lab: {
      tr: {
        title: "28 · LAB: Growth Engine",
        story:
          "Kod Gözü: Büyüme / Kapasite / Kök" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hızlı büyü = başarı’" + NL +
          "• ‘Yavaş = kayıp’" + N2 +
          "Rewrite:" + NL +
          "• ‘Kapasite büyü = başarı’" + NL +
          "• ‘Ritim = bereket’",
        reflection:
          "Tek cümle yaz: Bugün büyümeyi nasıl tanımlıyorsun?",
      },
      en: {
        title: "28 · LAB: Growth Engine",
        story:
          "Code Eye: Growth / Capacity / Root" + N2 +
          "Rule Engine:" + NL +
          "• ‘Fast growth = success’" + NL +
          "• ‘Slow = loss’" + N2 +
          "Rewrite:" + NL +
          "• ‘Capacity growth = success’" + NL +
          "• ‘Rhythm = abundance’",
        reflection:
          "Write one sentence: How do you define growth today?",
      },
    },
  },
};
export const CITY_29: Record<CityCode, City7> = {
  "29": {
    city: "Gumushane",

    base: {
      tr: {
        title: "29 · Maden",
        story:
          "Gümüşhane bir şehir değil—iç değerin madenidir." + N2 +
          "Bu kapı sana şunu öğretir: Parlamak için önce kazmak gerekir." + N2 +
          "29’un enerjisi yer altı gibi çalışır: görünmeyeni taşır, saklar, olgunlaştırır." + N2 +
          "Burada değer, dışarıda aranan bir şey değil; içeriden çıkarılan bir şeydir." + N2 +
          "Bu kapıdan geçerken şunu bil: İçindeki gümüş, seni çağırıyor.",
        reflection:
          "Bugün içimde hangi değeri ortaya çıkarıyorum?",
      },
      en: {
        title: "29 · معدن / Mine",
        story:
          "Gumushane is not only a city—it is the mine of inner value." + N2 +
          "This gate teaches: to shine, you must first dig." + N2 +
          "29 works like underground: it carries what is unseen, stores it, matures it." + N2 +
          "Here value is not searched outside; it is extracted from within." + N2 +
          "Know this: your inner silver is calling you.",
        reflection:
          "Which inner value am I bringing to the surface today?",
      },
    },

    deepC: {
      tr: {
        title: "29 · Matrix Derin İfşa",
        story:
          "Sistem 29’u ‘iç değer protokolü’ olarak çalıştırır." + N2 +
          "2 = denge, 9 = tamamlanma. 29 = dengelenmiş kapanış ve değer çıkarımı." + N2 +
          "Gölge test: Kendini değersiz sanıp dış onaya bağımlı kalmak." + NL +
          "Işık test: Değeri içeriden üretmek." + N2 +
          "29 sana şunu söyler: Onay aramak, madenin üstünde dolaşmaktır." + N2 +
          "Kazmak ise cesarettir: gölgeye inip özünü çıkarmak.",
        reflection:
          "Ben değerimi kimden bekliyorum—ve onu içeriden nasıl üretirim?",
      },
      en: {
        title: "29 · Deep Matrix Reveal",
        story:
          "The system runs 29 as an ‘inner value protocol.’" + N2 +
          "2 = balance, 9 = completion. 29 is balanced closure and value extraction." + N2 +
          "Shadow test: believing you are not enough and staying dependent on external approval." + NL +
          "Light test: producing value from within." + N2 +
          "29 says: seeking approval is wandering above the mine." + N2 +
          "Digging is courage: descending into shadow and extracting essence.",
        reflection:
          "From whom am I waiting for value—and how do I generate it within?",
      },
    },

    history: {
      tr: {
        title: "29 · Tarih Katmanı",
        story:
          "Gümüşhane, adıyla bile ders verir: değer, yerin altında saklanır." + N2 +
          "Tarih katmanı şunu öğretir: İnsan da bir maden taşır." + N2 +
          "Kıymetli olan, ilk bakışta görünmez. Emek ister, sabır ister." + N2 +
          "Bu katman, ‘görünmeyen değer’ dersini bırakır.",
        reflection:
          "Benim görünmeyen değerim ne?",
      },
      en: {
        title: "29 · History Layer",
        story:
          "Gumushane teaches through its name: value is hidden underground." + N2 +
          "This layer says: you too carry a mine." + N2 +
          "What is precious is not visible at first glance. It requires effort and patience." + N2 +
          "It leaves the lesson of ‘invisible value.’",
        reflection:
          "What is my invisible value?",
      },
    },

    numerology: {
      tr: {
        title: "29 · Numeroloji",
        story:
          "29 = iç değer / kapanış / olgunlaşma." + N2 +
          "29’un gölgesi:" + NL +
          "• dış onaya bağımlılık" + NL +
          "• kendini küçümseme" + N2 +
          "29’un ışığı:" + NL +
          "• iç onay" + NL +
          "• öz değer" + NL +
          "• sessiz ustalık" + N2 +
          "Bu kapı sorar: ‘Değerini hangi cümleyle tanımlıyorsun?’",
        reflection:
          "Benim öz değer cümlem ne?",
      },
      en: {
        title: "29 · Numerology",
        story:
          "29 = inner value / closure / maturity." + N2 +
          "Shadow of 29:" + NL +
          "• dependence on external approval" + NL +
          "• self-minimizing" + N2 +
          "Light of 29:" + NL +
          "• inner approval" + NL +
          "• self-worth" + NL +
          "• quiet mastery" + N2 +
          "This gate asks: ‘Which sentence defines your worth?’",
        reflection:
          "What is my self-worth sentence?",
      },
    },

    symbols: {
      tr: {
        title: "29 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Maden: derin değer." + NL +
          "• Kazma: cesaret." + NL +
          "• Gümüş: saf öz." + NL +
          "• Fener: içe inişte rehberlik." + N2 +
          "Sembol mesajı: ‘Kazdığın kadar parlıyorsun.’",
        reflection:
          "Ben hangi derinliğe inmeye çekiniyorum?",
      },
      en: {
        title: "29 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Mine: deep value." + NL +
          "• Pickaxe: courage." + NL +
          "• Silver: pure essence." + NL +
          "• Lantern: guidance in descent." + N2 +
          "Symbol message: ‘You shine as deep as you dig.’",
        reflection:
          "Which depth am I afraid to enter?",
      },
    },

    ritual: {
      tr: {
        title: "29 · Ritüel",
        story:
          "29 Dakika Ritüeli (İç Maden):" + N2 +
          "1) Bir kağıda yaz: ‘Benim değerim…’" + NL +
          "2) Altına 3 kanıt yaz (hayatından somut örnek)." + NL +
          "3) 29 nefes al. Son nefeste söyle: ‘Ortaya çıkarıyorum.’" + N2 +
          "Kapanış: ‘Değerim içeride.’",
        reflection:
          "Bugün değerimi hangi davranışla göstereceğim?",
      },
      en: {
        title: "29 · Ritual",
        story:
          "29-Minute Ritual (Inner Mine):" + N2 +
          "1) Write: ‘My value is…’" + NL +
          "2) Write 3 proofs (real examples from your life)." + NL +
          "3) Take 29 breaths. On the last say: ‘I bring it up.’" + N2 +
          "Closing: ‘My value is within.’",
        reflection:
          "What action will show my value today?",
      },
    },

    lab: {
      tr: {
        title: "29 · LAB: Inner Value Engine",
        story:
          "Kod Gözü: Öz Değer / Cesaret / Derinlik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Onay = değer’" + NL +
          "• ‘Değer = dışarı’" + N2 +
          "Rewrite:" + NL +
          "• ‘Değer = içeride’" + NL +
          "• ‘İçeride = benim’",
        reflection:
          "Tek cümle yaz: Bugün değerini nereden alıyorsun?",
      },
      en: {
        title: "29 · LAB: Inner Value Engine",
        story:
          "Code Eye: Self-Worth / Courage / Depth" + N2 +
          "Rule Engine:" + NL +
          "• ‘Approval = value’" + NL +
          "• ‘Value = outside’" + N2 +
          "Rewrite:" + NL +
          "• ‘Value = within’" + NL +
          "• ‘Within = mine’",
        reflection:
          "Write one sentence: Where do you take your value from today?",
      },
    },
  },
};
export const CITY_30: Record<CityCode, City7> = {
  "30": {
    city: "Hakkari",

    base: {
      tr: {
        title: "30 · Yükseklik",
        story:
          "Hakkari bir şehir değil—yalnız gücün yüksekliğidir." + N2 +
          "Bu kapı sana şunu öğretir: Her yol kalabalıkla yürünmez. Bazı yollar yalnızken açılır." + N2 +
          "30’un enerjisi dağ gibidir: az konuşur, çok taşır." + N2 +
          "Burada cesaret gösteriş değildir; sessiz bir devamlılıktır." + N2 +
          "Bu kapıdan geçerken şunu bil: Yüksek yerde nefes kıymetlidir; karar da öyle.",
        reflection:
          "Bugün yalnız kalınca güçlenen tarafım hangisi?",
      },
      en: {
        title: "30 · Altitude",
        story:
          "Hakkari is not only a city—it is the altitude of solitary strength." + N2 +
          "This gate teaches: not every path is walked with crowds. Some paths open in solitude." + N2 +
          "30 is mountain energy: it speaks little, carries much." + N2 +
          "Here courage is not show; it is quiet continuity." + N2 +
          "Know this: at high altitude, breath is precious—and so is decision.",
        reflection:
          "Which part of me grows stronger when I’m alone today?",
      },
    },

    deepC: {
      tr: {
        title: "30 · Matrix Derin İfşa",
        story:
          "Sistem 30’u ‘dayanıklılık-sessizlik protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 0 = alan. 30 = yaratım için alan açmak." + N2 +
          "Gölge test: Yalnızlığı ‘terk edilme’ sanmak." + NL +
          "Işık test: Yalnızlığı ‘alan’ olarak kullanmak." + N2 +
          "30 sana şunu söyler: Herkesin sesi varken senin sesin kaybolur." + N2 +
          "Bu kapı, iç sesini duyurmak için sessizliği seçtirir.",
        reflection:
          "Yalnızlık beni küçültüyor mu, yoksa alan mı açıyor?",
      },
      en: {
        title: "30 · Deep Matrix Reveal",
        story:
          "The system runs 30 as a ‘resilience-silence protocol.’" + N2 +
          "3 = creation, 0 = field. 30 is making space for creation." + N2 +
          "Shadow test: mistaking solitude for abandonment." + NL +
          "Light test: using solitude as a field." + N2 +
          "30 says: when everyone’s voice is loud, yours gets lost." + N2 +
          "This gate chooses silence so your inner voice can be heard.",
        reflection:
          "Does solitude shrink me—or does it create space?",
      },
    },

    history: {
      tr: {
        title: "30 · Tarih Katmanı",
        story:
          "Hakkari, sınırların ve yüksekliklerin hafızasını taşır." + N2 +
          "Sınır şehirleri şunu öğretir: Kimlik, sadece dış etiket değil; içerideki duruştur." + N2 +
          "Tarih katmanı burada bir ders bırakır: Zor coğrafya, güçlü irade üretir." + N2 +
          "Bu katman, ‘sessiz güç’ bilgisini bırakır.",
        reflection:
          "Benim sessiz gücüm nerede?",
      },
      en: {
        title: "30 · History Layer",
        story:
          "Hakkari carries the memory of borders and altitude." + N2 +
          "Borderlands teach: identity is not only an outer label; it is an inner stance." + N2 +
          "This layer leaves a lesson: harsh geography creates strong will." + N2 +
          "It leaves the knowledge of quiet power.",
        reflection:
          "Where is my quiet power?",
      },
    },

    numerology: {
      tr: {
        title: "30 · Numeroloji",
        story:
          "30 = alan açma / yaratım / sessiz güç." + N2 +
          "30’un gölgesi:" + NL +
          "• yalnızlıktan kaçmak" + NL +
          "• kalabalıkta kaybolmak" + N2 +
          "30’un ışığı:" + NL +
          "• alan" + NL +
          "• net karar" + NL +
          "• içeriden üretmek" + N2 +
          "Bu kapı sorar: ‘Alan açtın mı?’",
        reflection:
          "Bugün yaratım için hangi alanı açıyorum?",
      },
      en: {
        title: "30 · Numerology",
        story:
          "30 = making space / creation / quiet power." + N2 +
          "Shadow of 30:" + NL +
          "• escaping solitude" + NL +
          "• getting lost in crowds" + N2 +
          "Light of 30:" + NL +
          "• space" + NL +
          "• clear decision" + NL +
          "• creating from within" + N2 +
          "This gate asks: ‘Did you create space?’",
        reflection:
          "What space am I opening for creation today?",
      },
    },

    symbols: {
      tr: {
        title: "30 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Dağ: sessiz güç." + NL +
          "• Kartal: yüksek görüş." + NL +
          "• Sınır çizgisi: netlik." + NL +
          "• Boşluk: alan." + N2 +
          "Sembol mesajı: ‘Yükseğe çıkmak için hafifle.’",
        reflection:
          "Bugün hangi ağırlığı bırakıyorum?",
      },
      en: {
        title: "30 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Mountain: quiet power." + NL +
          "• Eagle: high vision." + NL +
          "• Border line: clarity." + NL +
          "• Void: space." + N2 +
          "Symbol message: ‘To rise, lighten.’",
        reflection:
          "What weight am I releasing today?",
      },
    },

    ritual: {
      tr: {
        title: "30 · Ritüel",
        story:
          "30 Dakika Ritüeli (Alan Aç):" + N2 +
          "1) 10 dakika sessiz kal." + NL +
          "2) 10 dakika yaz: ‘İç sesim ne diyor?’" + NL +
          "3) 10 dakika tek bir küçük adım planla." + N2 +
          "Kapanış: ‘Sessizlik alan açar, alan yaratır.’",
        reflection:
          "Bugün hangi sesi duyup hangi adımı seçiyorum?",
      },
      en: {
        title: "30 · Ritual",
        story:
          "30-Minute Ritual (Create Space):" + N2 +
          "1) Stay silent for 10 minutes." + NL +
          "2) Write for 10 minutes: ‘What is my inner voice saying?’" + NL +
          "3) Plan one small step for 10 minutes." + N2 +
          "Closing: ‘Silence creates space, space creates.’",
        reflection:
          "Which voice do I hear—and which step do I choose today?",
      },
    },

    lab: {
      tr: {
        title: "30 · LAB: Quiet Power Engine",
        story:
          "Kod Gözü: Sessizlik / Alan / Yaratım" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Yalnızlık = eksik’" + NL +
          "• ‘Kalabalık = güven’" + N2 +
          "Rewrite:" + NL +
          "• ‘Yalnızlık = alan’" + NL +
          "• ‘Alan = güç’",
        reflection:
          "Tek cümle yaz: Bugün yalnızlığı nasıl güce çeviriyorsun?",
      },
      en: {
        title: "30 · LAB: Quiet Power Engine",
        story:
          "Code Eye: Silence / Space / Creation" + N2 +
          "Rule Engine:" + NL +
          "• ‘Solitude = lack’" + NL +
          "• ‘Crowd = safety’" + N2 +
          "Rewrite:" + NL +
          "• ‘Solitude = space’" + NL +
          "• ‘Space = power’",
        reflection:
          "Write one sentence: How do you turn solitude into power today?",
      },
    },
  },
};
export const CITY_31: Record<CityCode, City7> = {
  "31": {
    city: "Hatay",

    base: {
      tr: {
        title: "31 · Mozaik",
        story:
          "Hatay bir şehir değil—parçaların birleştiği bir mozaiktir." + N2 +
          "Bu kapı sana şunu öğretir: Farklılıklar çatışmak için değil, bütün olmak için vardır." + N2 +
          "31’in enerjisi ‘birleştirici’ çalışır: kırığı onarır, ayrılığı yumuşatır, yolu yeniden örer." + N2 +
          "Hatay’ın mesajı: ‘Parçalanma son değil; birleştirme çağrısıdır.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Şifa, ‘tek parça olmak’ değil; parçaları sevgiyle bir araya getirmektir.",
        reflection:
          "Bugün hangi parçayı geri çağırıp bütün oluyorum?",
      },
      en: {
        title: "31 · Mosaic",
        story:
          "Hatay is not only a city—it is a mosaic where parts meet." + N2 +
          "This gate teaches: differences exist not to fight, but to become whole." + N2 +
          "31 works as a unifier: it repairs fractures, softens separation, weaves the path again." + N2 +
          "Hatay’s message: ‘Fragmentation is not the end; it is a call to reunite.’" + N2 +
          "Know this: healing is not being ‘one piece’—it is bringing your parts together with love.",
        reflection:
          "Which part of me am I calling back to become whole today?",
      },
    },

    deepC: {
      tr: {
        title: "31 · Matrix Derin İfşa",
        story:
          "Sistem 31’i ‘birleştirme protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 1 = irade. 31 = yaratımı iradeyle seçmek." + N2 +
          "Gölge test: Kırığı büyütmek, suçu büyütmek, ayrılığı büyütmek." + NL +
          "Işık test: Kırığı görmek ve onarmayı seçmek." + N2 +
          "31 sana şunu söyler: Ayrılık, bilinçte başlar; birlik, bilinçte biter." + N2 +
          "Bu kapı, ‘ben ve öteki’ çizgisini inceltir: aynı kaynağa geri çağırır.",
        reflection:
          "Ben bugün birliği mi seçiyorum, ayrılığı mı?",
      },
      en: {
        title: "31 · Deep Matrix Reveal",
        story:
          "The system runs 31 as a ‘unification protocol.’" + N2 +
          "3 = creation, 1 = will. 31 is choosing creation through will." + N2 +
          "Shadow test: enlarging the crack, enlarging blame, enlarging separation." + NL +
          "Light test: seeing the crack and choosing repair." + N2 +
          "31 says: separation begins in consciousness; unity completes in consciousness." + N2 +
          "This gate thins the line of ‘me vs other’ and calls you back to the same source.",
        reflection:
          "Am I choosing unity or separation today?",
      },
    },

    history: {
      tr: {
        title: "31 · Tarih Katmanı",
        story:
          "Hatay, kültürlerin kesişimidir." + N2 +
          "Kesişim noktaları bir ders taşır: Uyum, tek renk olmak değil; yan yana durabilmektir." + N2 +
          "Tarih katmanı şunu öğretir: Birlik, çeşitliliği yok etmeden olur." + N2 +
          "Bu katman, ‘mozaik bilgelik’ dersini bırakır.",
        reflection:
          "Ben farklılığı nerede tehdit sanıyorum?",
      },
      en: {
        title: "31 · History Layer",
        story:
          "Hatay is a crossroads of cultures." + N2 +
          "Crossroads teach: harmony is not one color; it is standing together." + N2 +
          "This layer teaches: unity can exist without erasing diversity." + N2 +
          "It leaves the wisdom of the mosaic.",
        reflection:
          "Where do I perceive difference as a threat?",
      },
    },

    numerology: {
      tr: {
        title: "31 · Numeroloji",
        story:
          "31 = yaratım + irade + birleşim." + N2 +
          "31’in gölgesi:" + NL +
          "• kutuplaşma" + NL +
          "• inat" + NL +
          "• ‘haklıyım’ kilidi" + N2 +
          "31’in ışığı:" + NL +
          "• uzlaşma" + NL +
          "• bütünlük" + NL +
          "• yapıcı dil" + N2 +
          "Bu kapı sorar: ‘Haklı mı olmak istiyorsun, bütün mü?’",
        reflection:
          "Bugün bütünlük için hangi cümleyi yumuşatıyorum?",
      },
      en: {
        title: "31 · Numerology",
        story:
          "31 = creation + will + unification." + N2 +
          "Shadow of 31:" + NL +
          "• polarization" + NL +
          "• stubbornness" + NL +
          "• the lock ‘I’m right’" + N2 +
          "Light of 31:" + NL +
          "• reconciliation" + NL +
          "• wholeness" + NL +
          "• constructive language" + N2 +
          "This gate asks: ‘Do you want to be right—or whole?’",
        reflection:
          "Which sentence will I soften today for wholeness?",
      },
    },

    symbols: {
      tr: {
        title: "31 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Mozaik: bütünlük." + NL +
          "• Harç: bağ." + NL +
          "• Kırık taş: yara." + NL +
          "• Zeytin dalı: barış." + N2 +
          "Sembol mesajı: ‘Parça, yerini bulunca güzelleşir.’",
        reflection:
          "Benim içimde yerini bulmayı bekleyen parça hangisi?",
      },
      en: {
        title: "31 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Mosaic: wholeness." + NL +
          "• Mortar: bond." + NL +
          "• Broken stone: wound." + NL +
          "• Olive branch: peace." + N2 +
          "Symbol message: ‘A piece becomes beautiful when it finds its place.’",
        reflection:
          "Which part of me is waiting to find its place?",
      },
    },

    ritual: {
      tr: {
        title: "31 · Ritüel",
        story:
          "31 Dakika Ritüeli (Mozaik Onarımı):" + N2 +
          "1) Bir kağıda üç parça yaz: ‘kırgınlık / ders / bağ’." + NL +
          "2) Altına tek cümle yaz: ‘Bugün bağ kurmayı seçiyorum.’" + NL +
          "3) 31 nefes al. Son nefeste söyle: ‘Birleştiriyorum.’" + N2 +
          "Kapanış: ‘Bütünlük, seçimdir.’",
        reflection:
          "Bugün kiminle ya da hangi parçayla bağ kuruyorum?",
      },
      en: {
        title: "31 · Ritual",
        story:
          "31-Minute Ritual (Mosaic Repair):" + N2 +
          "1) Write three pieces: ‘resentment / lesson / bond’." + NL +
          "2) Write one line: ‘Today I choose to connect.’" + NL +
          "3) Take 31 breaths. On the last say: ‘I reunite.’" + N2 +
          "Closing: ‘Wholeness is a choice.’",
        reflection:
          "With whom—or with which part—am I connecting today?",
      },
    },

    lab: {
      tr: {
        title: "31 · LAB: Unifier Engine",
        story:
          "Kod Gözü: Birlik / Bağ / Mozaik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Farklı = tehlike’" + NL +
          "• ‘Ayrı = güven’" + N2 +
          "Rewrite:" + NL +
          "• ‘Farklı = zenginlik’" + NL +
          "• ‘Bağ = güven’",
        reflection:
          "Tek cümle yaz: Bugün birliği hangi davranışla seçiyorsun?",
      },
      en: {
        title: "31 · LAB: Unifier Engine",
        story:
          "Code Eye: Unity / Bond / Mosaic" + N2 +
          "Rule Engine:" + NL +
          "• ‘Different = danger’" + NL +
          "• ‘Separate = safety’" + N2 +
          "Rewrite:" + NL +
          "• ‘Different = richness’" + NL +
          "• ‘Connection = safety’",
        reflection:
          "Write one sentence: What action chooses unity today?",
      },
    },
  },
};
export const CITY_32: Record<CityCode, City7> = {
  "32": {
    city: "Isparta",

    base: {
      tr: {
        title: "32 · Gül",
        story:
          "Isparta bir şehir değil—gülün kalp hafızasıdır." + N2 +
          "Bu kapı sana şunu öğretir: Zarafet, sınırla birlikte güzelleşir." + N2 +
          "32’nin enerjisi ‘kalp + ritim’ taşır: sevgi, rastgele değil; bilinçli bir seçimdi." + N2 +
          "Gül kokusu gibi: görünmez ama etkili. Bu kapı da öyledir." + N2 +
          "Bu kapıdan geçerken şunu bil: Sevgi bir duygu değil, bir frekanstır; yayılır.",
        reflection:
          "Bugün sevgiyi hangi davranışla somutlaştırıyorum?",
      },
      en: {
        title: "32 · Rose",
        story:
          "Isparta is not only a city—it is the heart memory of the rose." + N2 +
          "This gate teaches: grace becomes more beautiful with boundaries." + N2 +
          "32 carries ‘heart + rhythm’: love is not random; it is a conscious choice." + N2 +
          "Like rose scent—unseen yet powerful—this gate works the same." + N2 +
          "Know this: love is not only emotion; it is frequency, and it spreads.",
        reflection:
          "What action makes love tangible today?",
      },
    },

    deepC: {
      tr: {
        title: "32 · Matrix Derin İfşa",
        story:
          "Sistem 32’yi ‘kalp frekansı protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 2 = denge. 32 = yaratımı dengeyle ve sevgiyle kurmak." + N2 +
          "Gölge test: Sevgiyi ‘hoş görünmek’ sanmak." + NL +
          "Işık test: Sevgiyi ‘sınır + şefkat’ olarak yaşamak." + N2 +
          "32 sana şunu söyler: Gerçek sevgi dağılmaz; odaklıdır." + N2 +
          "Bu kapı, kalbi yumuşatırken omurgayı güçlendirir.",
        reflection:
          "Ben sevgiyi sınırla birlikte taşıyabiliyor muyum?",
      },
      en: {
        title: "32 · Deep Matrix Reveal",
        story:
          "The system runs 32 as a ‘heart frequency protocol.’" + N2 +
          "3 = creation, 2 = balance. 32 is building creation through balance and love." + N2 +
          "Shadow test: mistaking love for pleasing." + NL +
          "Light test: living love as boundary + compassion." + N2 +
          "32 says: real love does not scatter; it is focused." + N2 +
          "This gate softens the heart while strengthening the spine.",
        reflection:
          "Can I carry love together with boundaries today?",
      },
    },

    history: {
      tr: {
        title: "32 · Tarih Katmanı",
        story:
          "Isparta, gülün emeğini taşır." + N2 +
          "Gül, sadece çiçek değil; sabırdır, hasattır, işçiliktir." + N2 +
          "Tarih katmanı şunu öğretir: Güzel olanın arkasında emek vardır." + N2 +
          "Bu katman, ‘zarafet = emek’ dersini bırakır.",
        reflection:
          "Ben hangi alanda emeği güzelliğe çeviriyorum?",
      },
      en: {
        title: "32 · History Layer",
        story:
          "Isparta carries the labor of the rose." + N2 +
          "The rose is not only a flower; it is patience, harvest, craft." + N2 +
          "This layer teaches: behind beauty, there is effort." + N2 +
          "It leaves the lesson: grace is earned through work.",
        reflection:
          "Where am I turning effort into beauty?",
      },
    },

    numerology: {
      tr: {
        title: "32 · Numeroloji",
        story:
          "32 = sevgiyle yaratım / dengeyle büyüme." + N2 +
          "32’nin gölgesi:" + NL +
          "• duygusal dağılma" + NL +
          "• sınır koyamama" + N2 +
          "32’nin ışığı:" + NL +
          "• kalp açıklığı" + NL +
          "• şefkatli sınır" + NL +
          "• odaklı sevgi" + N2 +
          "Bu kapı sorar: ‘Sevgiye hangi ölçüyü ekliyorsun?’",
        reflection:
          "Bugün sevgime hangi ölçüyü ekliyorum?",
      },
      en: {
        title: "32 · Numerology",
        story:
          "32 = creation through love / growth through balance." + N2 +
          "Shadow of 32:" + NL +
          "• emotional scattering" + NL +
          "• inability to set boundaries" + N2 +
          "Light of 32:" + NL +
          "• open heart" + NL +
          "• compassionate boundary" + NL +
          "• focused love" + N2 +
          "This gate asks: ‘What measure do you add to love?’",
        reflection:
          "What measure am I adding to my love today?",
      },
    },

    symbols: {
      tr: {
        title: "32 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Gül: kalp frekansı." + NL +
          "• Diken: sınır." + NL +
          "• Koku: görünmeyen etki." + NL +
          "• Damla: öz." + N2 +
          "Sembol mesajı: ‘Koku gibi yayıl. Diken gibi net ol.’",
        reflection:
          "Bugün nerede yayılıp nerede netleşiyorum?",
      },
      en: {
        title: "32 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Rose: heart frequency." + NL +
          "• Thorn: boundary." + NL +
          "• Scent: invisible influence." + NL +
          "• Drop: essence." + N2 +
          "Symbol message: ‘Spread like scent. Be clear like a thorn.’",
        reflection:
          "Where do I spread—and where do I become clear today?",
      },
    },

    ritual: {
      tr: {
        title: "32 · Ritüel",
        story:
          "32 Dakika Ritüeli (Gül Frekansı):" + N2 +
          "1) Elini kalbine koy ve 8 nefes al, 8 nefes ver (16)." + NL +
          "2) Aynısını tekrar et (32)." + NL +
          "3) İçinden söyle: ‘Sevgi = ölçü + şefkat.’" + N2 +
          "Kapanış: ‘Kokum davranışım.’",
        reflection:
          "Bugün hangi davranışım sevgi kokusu yayacak?",
      },
      en: {
        title: "32 · Ritual",
        story:
          "32-Minute Ritual (Rose Frequency):" + N2 +
          "1) Hand on heart. 8 breaths in, 8 breaths out (16)." + NL +
          "2) Repeat once more (32)." + NL +
          "3) Say inwardly: ‘Love = measure + compassion.’" + N2 +
          "Closing: ‘My scent is my action.’",
        reflection:
          "Which action will spread love-scent today?",
      },
    },

    lab: {
      tr: {
        title: "32 · LAB: Heart Scent Engine",
        story:
          "Kod Gözü: Sevgi / Sınır / Etki" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Sevgi = herkese evet’" + NL +
          "• ‘Sınır = sevgisizlik’" + N2 +
          "Rewrite:" + NL +
          "• ‘Sevgi = seçici şefkat’" + NL +
          "• ‘Sınır = sevgi koruması’",
        reflection:
          "Tek cümle yaz: Bugün sevgiyi nasıl koruyorsun?",
      },
      en: {
        title: "32 · LAB: Heart Scent Engine",
        story:
          "Code Eye: Love / Boundary / Influence" + N2 +
          "Rule Engine:" + NL +
          "• ‘Love = yes to everyone’" + NL +
          "• ‘Boundary = no love’" + N2 +
          "Rewrite:" + NL +
          "• ‘Love = selective compassion’" + NL +
          "• ‘Boundary = protection of love’",
        reflection:
          "Write one sentence: How do you protect love today?",
      },
    },
  },
};
export const CITY_33: Record<CityCode, City7> = {
  "33": {
    city: "Mersin",

    base: {
      tr: {
        title: "33 · Ufuk",
        story:
          "Mersin bir şehir değil—ufkun açıldığı limandır." + N2 +
          "Bu kapı sana şunu öğretir: Dünya ile bağ kurmak, kendini kaybetmek değildir; kendini genişletmektir." + N2 +
          "33’ün enerjisi ‘açılım’ taşır: fikir, ticaret, ilişki, yol." + N2 +
          "Mersin’in mesajı: ‘Açıl, ama merkezini kaybetme.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Genişlemek için önce içeride yer açarsın.",
        reflection:
          "Bugün hangi alanda ufkumu büyütüyorum?",
      },
      en: {
        title: "33 · Horizon",
        story:
          "Mersin is not only a city—it is a harbor where the horizon opens." + N2 +
          "This gate teaches: connecting with the world is not losing yourself; it is expanding yourself." + N2 +
          "33 carries ‘opening’: ideas, trade, relationships, roads." + N2 +
          "Mersin’s message: ‘Open—without losing your center.’" + N2 +
          "Know this: to expand, you first create space within.",
        reflection:
          "Where am I expanding my horizon today?",
      },
    },

    deepC: {
      tr: {
        title: "33 · Matrix Derin İfşa",
        story:
          "Sistem 33’ü ‘öğretmen frekansı’ olarak çalıştırır." + N2 +
          "33, bilginin paylaşım sayısıdır: öğrendiğini çoğaltır." + N2 +
          "Gölge test: Açılımı dağılmaya çevirmek." + NL +
          "Işık test: Açılımı misyona çevirmek." + N2 +
          "33 sana şunu söyler: Açılmak, her yere yetişmek değil; doğru yere nüfuz etmektir." + N2 +
          "Bu kapı, genişlemeyi ‘anlam’ ile sabitler.",
        reflection:
          "Ben genişlerken dağılmamak için hangi anlamı merkeze koyuyorum?",
      },
      en: {
        title: "33 · Deep Matrix Reveal",
        story:
          "The system runs 33 as a ‘teacher frequency.’" + N2 +
          "33 is the number of sharing knowledge: it multiplies what you learn." + N2 +
          "Shadow test: turning expansion into scattering." + NL +
          "Light test: turning expansion into mission." + N2 +
          "33 says: opening is not reaching everywhere—it is penetrating the right place." + N2 +
          "This gate stabilizes expansion through meaning.",
        reflection:
          "What meaning do I keep at the center so I don’t scatter while expanding?",
      },
    },

    history: {
      tr: {
        title: "33 · Tarih Katmanı",
        story:
          "Mersin, liman hafızası taşır: gelen, giden, birleşen." + N2 +
          "Liman şehirleri şunu öğretir: Bağ kurmak, kökünü bırakmadan da mümkündür." + N2 +
          "Tarih katmanı burada ‘bağ + merkez’ dersini bırakır." + N2 +
          "Dünya ile temas kurarsın ama kalbini içeride tutarsın.",
        reflection:
          "Ben bağ kurarken merkezimi nerede kaybediyorum?",
      },
      en: {
        title: "33 · History Layer",
        story:
          "Mersin carries harbor memory: arrivals, departures, unions." + N2 +
          "Harbor cities teach: connection is possible without abandoning your roots." + N2 +
          "This layer leaves the lesson of ‘connection + center.’" + N2 +
          "You touch the world, but keep your heart within.",
        reflection:
          "Where do I lose my center while connecting?",
      },
    },

    numerology: {
      tr: {
        title: "33 · Numeroloji",
        story:
          "33 = usta öğretmen / hizmet / paylaşım." + N2 +
          "33’ün gölgesi:" + NL +
          "• herkese yetişme" + NL +
          "• tükenme" + NL +
          "• sınır koyamama" + N2 +
          "33’ün ışığı:" + NL +
          "• doğru yerde hizmet" + NL +
          "• bilgelik paylaşımı" + NL +
          "• sürdürülebilir etki" + N2 +
          "Bu kapı sorar: ‘Kime, ne kadar, nasıl?’",
        reflection:
          "Bugün etkimi nerede sürdürülebilir kılıyorum?",
      },
      en: {
        title: "33 · Numerology",
        story:
          "33 = master teacher / service / sharing." + N2 +
          "Shadow of 33:" + NL +
          "• trying to be everywhere" + NL +
          "• burnout" + NL +
          "• no boundaries" + N2 +
          "Light of 33:" + NL +
          "• service in the right place" + NL +
          "• sharing wisdom" + NL +
          "• sustainable impact" + N2 +
          "This gate asks: ‘To whom, how much, and how?’",
        reflection:
          "Where do I make my impact sustainable today?",
      },
    },

    symbols: {
      tr: {
        title: "33 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Liman: bağ ve geçiş." + NL +
          "• Gemi: yol ve taşıma." + NL +
          "• Ufuk: genişleme." + NL +
          "• Deniz: akış ve olasılık." + N2 +
          "Sembol mesajı: ‘Açıl ama merkezde kal.’",
        reflection:
          "Benim merkez cümlem ne?",
      },
      en: {
        title: "33 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Harbor: connection and transition." + NL +
          "• Ship: journey and carrying." + NL +
          "• Horizon: expansion." + NL +
          "• Sea: flow and possibility." + N2 +
          "Symbol message: ‘Open, but stay centered.’",
        reflection:
          "What is my center sentence?",
      },
    },

    ritual: {
      tr: {
        title: "33 · Ritüel",
        story:
          "33 Dakika Ritüeli (Merkez + Ufuk):" + N2 +
          "1) Bir cümle yaz: ‘Benim merkezim…’" + NL +
          "2) Bir cümle yaz: ‘Ufkum…’" + NL +
          "3) 33 nefes al. Son nefeste söyle: ‘Açılıyorum.’" + N2 +
          "Kapanış: ‘Merkezdeyim, genişliyorum.’",
        reflection:
          "Bugün ufkumu hangi adımla büyütüyorum?",
      },
      en: {
        title: "33 · Ritual",
        story:
          "33-Minute Ritual (Center + Horizon):" + N2 +
          "1) Write one sentence: ‘My center is…’" + NL +
          "2) Write one sentence: ‘My horizon is…’" + NL +
          "3) Take 33 breaths. On the last say: ‘I open.’" + N2 +
          "Closing: ‘I am centered, and I expand.’",
        reflection:
          "Which step expands my horizon today?",
      },
    },

    lab: {
      tr: {
        title: "33 · LAB: Expansion Engine",
        story:
          "Kod Gözü: Ufuk / Anlam / Hizmet" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Herkese yetişmeliyim’" + NL +
          "• ‘Yoksa değersizim’" + N2 +
          "Rewrite:" + NL +
          "• ‘Doğru yere hizmet ederim’" + NL +
          "• ‘Anlamım değerim’",
        reflection:
          "Tek cümle yaz: Bugün ‘herkes’ yerine ‘doğru yer’i nasıl seçiyorsun?",
      },
      en: {
        title: "33 · LAB: Expansion Engine",
        story:
          "Code Eye: Horizon / Meaning / Service" + N2 +
          "Rule Engine:" + NL +
          "• ‘I must reach everyone’" + NL +
          "• ‘Otherwise I’m worthless’" + N2 +
          "Rewrite:" + NL +
          "• ‘I serve the right place’" + NL +
          "• ‘My meaning is my value’",
        reflection:
          "Write one sentence: How do you choose ‘the right place’ over ‘everyone’ today?",
      },
    },
  },
};
export const CITY_34: Record<CityCode, City7> = {
  "34": {
    city: "Istanbul",

    base: {
      tr: {
        title: "34 · Kapıların Kapısı",
        story:
          "İstanbul bir şehir değil—kapıların kapısıdır." + N2 +
          "Bu kapı sana şunu öğretir: Çokluk karmaşa değildir; katmandır." + N2 +
          "34’ün enerjisi ‘eşik’ gibi çalışır: Doğu ile Batı, geçmiş ile gelecek, ruh ile madde." + N2 +
          "İstanbul’un mesajı: ‘Sen kaç katmansın?’" + N2 +
          "Bu kapıdan geçerken şunu bil: Bu şehir seni büyütmez; seni aynalar. Ne isen, onu büyütür.",
        reflection:
          "Bugün İstanbul bende hangi katmanı büyütüyor?",
      },
      en: {
        title: "34 · Gate of Gates",
        story:
          "Istanbul is not only a city—it is the gate of gates." + N2 +
          "This gate teaches: multiplicity is not chaos; it is layers." + N2 +
          "34 works as a threshold: East and West, past and future, spirit and matter." + N2 +
          "Istanbul’s message: ‘How many layers are you?’" + N2 +
          "Know this: the city does not simply grow you—it mirrors you. Whatever you are, it amplifies.",
        reflection:
          "Which layer is Istanbul amplifying in me today?",
      },
    },

    deepC: {
      tr: {
        title: "34 · Matrix Derin İfşa",
        story:
          "Sistem 34’ü ‘çok-katman protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 4 = yapı. 34 = yaratımı yapılandırmak." + N2 +
          "Gölge test: Katmanlar arasında parçalanmak, rol değiştirmek, merkez kaybetmek." + NL +
          "Işık test: Katmanlar arasında akarken merkezde kalmak." + N2 +
          "34 sana şunu söyler: İstanbul seni dağıtmaz; merkezini test eder." + N2 +
          "Merkez güçlü değilse şehir yorucu olur. Merkez güçlüyse şehir bir hızlandırıcı olur.",
        reflection:
          "Benim merkezim neresi—ve onu her katmanda koruyabiliyor muyum?",
      },
      en: {
        title: "34 · Deep Matrix Reveal",
        story:
          "The system runs 34 as a ‘multi-layer protocol.’" + N2 +
          "3 = creation, 4 = structure. 34 is structuring creation." + N2 +
          "Shadow test: fragmenting between layers, switching roles, losing center." + NL +
          "Light test: moving through layers while staying centered." + N2 +
          "34 says: Istanbul does not scatter you—it tests your center." + N2 +
          "If the center is weak, the city exhausts. If the center is strong, the city accelerates.",
        reflection:
          "Where is my center—and can I keep it across every layer?",
      },
    },

    history: {
      tr: {
        title: "34 · Tarih Katmanı",
        story:
          "İstanbul, imparatorlukların hafızasıdır." + N2 +
          "Bu katman şunu öğretir: Güç, sadece sahip olmak değil; yönetmektir." + N2 +
          "Şehir bir sahnedir: saray, sokak, liman, ibadet, ticaret—hepsi aynı anda." + N2 +
          "Tarih katmanı, ‘çokluğu yönet’ dersini bırakır: Aynı anda çok şey olabilir ama sen tek kalabilirsin.",
        reflection:
          "Ben çokluğun içinde tek kalabiliyor muyum?",
      },
      en: {
        title: "34 · History Layer",
        story:
          "Istanbul is the memory of empires." + N2 +
          "This layer teaches: power is not only having—it is governing." + N2 +
          "The city is a stage: palace, street, harbor, worship, trade—simultaneous." + N2 +
          "It leaves the lesson: manage multiplicity. Many things can happen at once, yet you can remain one.",
        reflection:
          "Can I remain one inside multiplicity?",
      },
    },

    numerology: {
      tr: {
        title: "34 · Numeroloji",
        story:
          "34 = yaratımı yapıya indirmek." + N2 +
          "34’ün gölgesi:" + NL +
          "• dağılmak" + NL +
          "• her şeye yetişmek" + NL +
          "• bitirememek" + N2 +
          "34’ün ışığı:" + NL +
          "• sistem" + NL +
          "• plan" + NL +
          "• odak" + N2 +
          "Bu kapı sorar: ‘Çok şeyi mi istiyorsun, yoksa doğru şeyi mi?’",
        reflection:
          "Bugün ‘çok’ yerine ‘doğru’yu nasıl seçiyorum?",
      },
      en: {
        title: "34 · Numerology",
        story:
          "34 = bringing creation into structure." + N2 +
          "Shadow of 34:" + NL +
          "• scattering" + NL +
          "• trying to do everything" + NL +
          "• not finishing" + N2 +
          "Light of 34:" + NL +
          "• system" + NL +
          "• plan" + NL +
          "• focus" + N2 +
          "This gate asks: ‘Do you want many things—or the right thing?’",
        reflection:
          "How do I choose ‘right’ over ‘many’ today?",
      },
    },

    symbols: {
      tr: {
        title: "34 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Boğaz: iki dünya arası geçit." + NL +
          "• Köprü: katmanları birleştirmek." + NL +
          "• Kubbeler: bilinç katları." + NL +
          "• Deniz: olasılık." + NL +
          "• Kapı: seçim." + N2 +
          "Sembol mesajı: ‘Kapılar çoksa, anahtar merkezdir.’",
        reflection:
          "Benim anahtarım ne—merkezim ne?",
      },
      en: {
        title: "34 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Strait: passage between worlds." + NL +
          "• Bridge: uniting layers." + NL +
          "• Domes: layers of consciousness." + NL +
          "• Sea: possibility." + NL +
          "• Gate: choice." + N2 +
          "Symbol message: ‘If there are many gates, the key is the center.’",
        reflection:
          "What is my key—what is my center?",
      },
    },

    ritual: {
      tr: {
        title: "34 · Ritüel",
        story:
          "34 Dakika Ritüeli (Merkez ve Katman):" + N2 +
          "1) Bir kağıda 3 katman yaz: ‘iş / ilişki / ben’." + NL +
          "2) Her katmanın altına tek cümle yaz: ‘Merkezim burada nasıl kalır?’" + NL +
          "3) 34 nefes al. Son nefeste söyle: ‘Merkezdeyim.’" + N2 +
          "Kapanış: ‘Katmanlar akar, ben kalırım.’",
        reflection:
          "Bugün hangi katmanda merkezimi kaybediyorum?",
      },
      en: {
        title: "34 · Ritual",
        story:
          "34-Minute Ritual (Center and Layers):" + N2 +
          "1) Write 3 layers: ‘work / relationships / me’." + NL +
          "2) Under each write one line: ‘How do I stay centered here?’" + NL +
          "3) Take 34 breaths. On the last say: ‘I am centered.’" + N2 +
          "Closing: ‘Layers move, I remain.’",
        reflection:
          "In which layer am I losing my center today?",
      },
    },

    lab: {
      tr: {
        title: "34 · LAB: Multi-Layer Engine",
        story:
          "Kod Gözü: Katman / Merkez / Odak" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Çok = değer’" + NL +
          "• ‘Koşarsam yetişirim’" + N2 +
          "Rewrite:" + NL +
          "• ‘Odak = değer’" + NL +
          "• ‘Merkez = hız’",
        reflection:
          "Tek cümle yaz: Bugün merkezini nasıl koruyorsun?",
      },
      en: {
        title: "34 · LAB: Multi-Layer Engine",
        story:
          "Code Eye: Layers / Center / Focus" + N2 +
          "Rule Engine:" + NL +
          "• ‘More = value’" + NL +
          "• ‘If I run, I can keep up’" + N2 +
          "Rewrite:" + NL +
          "• ‘Focus = value’" + NL +
          "• ‘Center = speed’",
        reflection:
          "Write one sentence: How do you keep your center today?",
      },
    },
  },
};
export const CITY_35: Record<CityCode, City7> = {
  "35": {
    city: "Izmir",

    base: {
      tr: {
        title: "35 · Özgürlük",
        story:
          "İzmir bir şehir değil—özgürlüğün rüzgârıdır." + N2 +
          "Bu kapı sana şunu öğretir: Hafiflik ciddiyetsizlik değil, korkusuzluktur." + N2 +
          "35’in enerjisi ‘açık gökyüzü’ gibidir: nefes verir, genişletir." + N2 +
          "İzmir’in mesajı: ‘Kendin ol. Kendin kal.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Özgürlük, başkalarını reddetmek değil; kendini seçmektir.",
        reflection:
          "Bugün kendimi hangi alanda daha özgür ifade ediyorum?",
      },
      en: {
        title: "35 · Freedom",
        story:
          "Izmir is not only a city—it is the wind of freedom." + N2 +
          "This gate teaches: lightness is not irresponsibility; it is fearlessness." + N2 +
          "35 feels like open sky: it gives breath and expands you." + N2 +
          "Izmir’s message: ‘Be yourself. Stay yourself.’" + N2 +
          "Know this: freedom is not rejecting others; it is choosing yourself.",
        reflection:
          "Where am I expressing myself more freely today?",
      },
    },

    deepC: {
      tr: {
        title: "35 · Matrix Derin İfşa",
        story:
          "Sistem 35’i ‘ifade protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 5 = değişim. 35 = yaratımı değişimle dışa vurmak." + N2 +
          "Gölge test: Başkalarının onayına göre şekil almak." + NL +
          "Işık test: Kendi sesini netleştirmek." + N2 +
          "35 sana şunu söyler: İfade bastırılırsa enerji içeride boğulur." + N2 +
          "Bu kapı, boğulan enerjiyi rüzgâr gibi dışarı çıkarır: nefes, söz, hareket.",
        reflection:
          "Ben bugün hangi gerçeği söylemiyorum?",
      },
      en: {
        title: "35 · Deep Matrix Reveal",
        story:
          "The system runs 35 as an ‘expression protocol.’" + N2 +
          "3 = creation, 5 = change. 35 is expressing creation through change." + N2 +
          "Shadow test: shaping yourself according to others’ approval." + NL +
          "Light test: clarifying your own voice." + N2 +
          "35 says: when expression is suppressed, energy suffocates inside." + N2 +
          "This gate releases that suffocation like wind: breath, words, movement.",
        reflection:
          "What truth am I not saying today?",
      },
    },

    history: {
      tr: {
        title: "35 · Tarih Katmanı",
        story:
          "İzmir, kıyının ve açıklığın şehridir." + N2 +
          "Kıyı şehirleri şunu öğretir: Ufuk, insana cesaret verir." + N2 +
          "Tarih katmanı burada bir ders bırakır: Açık kalan yer, yeniye alan açar." + N2 +
          "Bu katman, ‘açıklık = yenilenme’ dersini bırakır.",
        reflection:
          "Ben hayatımda nerede daha açık olabilirim?",
      },
      en: {
        title: "35 · History Layer",
        story:
          "Izmir is a city of coastline and openness." + N2 +
          "Coastal cities teach: the horizon gives courage." + N2 +
          "This layer leaves a lesson: what stays open creates space for the new." + N2 +
          "It leaves the lesson: openness becomes renewal.",
        reflection:
          "Where can I be more open in my life today?",
      },
    },

    numerology: {
      tr: {
        title: "35 · Numeroloji",
        story:
          "35 = özgür ifade / değişim / yaratım." + N2 +
          "35’in gölgesi:" + NL +
          "• onay bağımlılığı" + NL +
          "• kendini saklama" + N2 +
          "35’in ışığı:" + NL +
          "• cesur ifade" + NL +
          "• hafiflik" + NL +
          "• yenilenme" + N2 +
          "Bu kapı sorar: ‘Kendin olmanın bedeli ne? Kazancı ne?’",
        reflection:
          "Bugün kendim olursam ne kazanırım?",
      },
      en: {
        title: "35 · Numerology",
        story:
          "35 = free expression / change / creation." + N2 +
          "Shadow of 35:" + NL +
          "• approval addiction" + NL +
          "• hiding yourself" + N2 +
          "Light of 35:" + NL +
          "• courageous expression" + NL +
          "• lightness" + NL +
          "• renewal" + N2 +
          "This gate asks: ‘What is the cost of being yourself—and the gain?’",
        reflection:
          "What do I gain by being myself today?",
      },
    },

    symbols: {
      tr: {
        title: "35 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Rüzgâr: özgürlük ve hareket." + NL +
          "• Ufuk: genişleme." + NL +
          "• Martı: bağımsızlık." + NL +
          "• Açık gökyüzü: nefes." + N2 +
          "Sembol mesajı: ‘Nefes al, söyle, hareket et.’",
        reflection:
          "Bugün hangi cümle beni hafifletir?",
      },
      en: {
        title: "35 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Wind: freedom and movement." + NL +
          "• Horizon: expansion." + NL +
          "• Seagull: independence." + NL +
          "• Open sky: breath." + N2 +
          "Symbol message: ‘Breathe, speak, move.’",
        reflection:
          "Which sentence will lighten me today?",
      },
    },

    ritual: {
      tr: {
        title: "35 · Ritüel",
        story:
          "35 Dakika Ritüeli (Özgür Ses):" + N2 +
          "1) 5 dakika sadece nefesini aç." + NL +
          "2) 10 dakika yaz: ‘Benim gerçeğim…’" + NL +
          "3) 20 dakika küçük bir eylem yap: bir mesaj, bir paylaşım, bir adım." + N2 +
          "Kapanış: ‘Kendimi seçiyorum.’",
        reflection:
          "Bugün hangi küçük eylem benim özgürlüğüm?",
      },
      en: {
        title: "35 · Ritual",
        story:
          "35-Minute Ritual (Free Voice):" + N2 +
          "1) 5 minutes: open your breath." + NL +
          "2) 10 minutes: write ‘My truth is…’" + NL +
          "3) 20 minutes: take one small action—message, post, step." + N2 +
          "Closing: ‘I choose myself.’",
        reflection:
          "What small action is my freedom today?",
      },
    },

    lab: {
      tr: {
        title: "35 · LAB: Expression Engine",
        story:
          "Kod Gözü: Özgürlük / Ses / Nefes" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Söylersem reddedilirim’" + NL +
          "• ‘Reddedilme = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Söylersem netleşirim’" + NL +
          "• ‘Netlik = özgürlük’",
        reflection:
          "Tek cümle yaz: Bugün hangi gerçeği söyleyeceksin?",
      },
      en: {
        title: "35 · LAB: Expression Engine",
        story:
          "Code Eye: Freedom / Voice / Breath" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I speak, I’ll be rejected’" + NL +
          "• ‘Rejection = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘If I speak, I clarify’" + NL +
          "• ‘Clarity = freedom’",
        reflection:
          "Write one sentence: What truth will you speak today?",
      },
    },
  },
};
export const CITY_36: Record<CityCode, City7> = {
  "36": {
    city: "Kars",

    base: {
      tr: {
        title: "36 · Sadakat",
        story:
          "Kars bir şehir değil—soğukta bile kalan sadakattir." + N2 +
          "Bu kapı sana şunu öğretir: Gerçek değer, konfor varken değil; konfor yokken ortaya çıkar." + N2 +
          "36’nın enerjisi kar gibidir: gereksizi örter, özü görünür kılar." + N2 +
          "Burada sevgi, sözle değil; dayanmayla anlaşılır." + N2 +
          "Bu kapıdan geçerken şunu bil: Sadakat başkasına değil; önce kendi özüne olur.",
        reflection:
          "Bugün özümle olan sadakatimi nerede test ediyorum?",
      },
      en: {
        title: "36 · Loyalty",
        story:
          "Kars is not only a city—it is loyalty that remains even in cold." + N2 +
          "This gate teaches: true value appears not when comfort exists, but when it doesn’t." + N2 +
          "36 is snow energy: it covers the unnecessary and reveals the essential." + N2 +
          "Here love is proven not by words, but by endurance." + N2 +
          "Know this: loyalty is not only to others—first, to your own essence.",
        reflection:
          "Where is my loyalty to my essence being tested today?",
      },
    },

    deepC: {
      tr: {
        title: "36 · Matrix Derin İfşa",
        story:
          "Sistem 36’yı ‘dayanma protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 6 = sorumluluk. 36 = sorumluluğu yaratıcı şekilde taşımak." + N2 +
          "Gölge test: Sertleşmek ve kapanmak." + NL +
          "Işık test: Sert koşulda bile kalbi açık tutmak." + N2 +
          "36 sana şunu söyler: Koşullar zorlaştığında öz ortaya çıkar." + N2 +
          "Bu kapı, ‘kimim?’ sorusunu teoriden çıkarıp pratiğe indirir.",
        reflection:
          "Zorlaşınca kim oluyorum: kapanan mı, büyüyen mi?",
      },
      en: {
        title: "36 · Deep Matrix Reveal",
        story:
          "The system runs 36 as an ‘endurance protocol.’" + N2 +
          "3 = creation, 6 = responsibility. 36 is carrying responsibility creatively." + N2 +
          "Shadow test: hardening and shutting down." + NL +
          "Light test: keeping the heart open even in harsh conditions." + N2 +
          "36 says: when conditions get hard, essence shows." + N2 +
          "This gate turns ‘who am I?’ from theory into practice.",
        reflection:
          "When it gets hard, who do I become—shut down or expanded?",
      },
    },

    history: {
      tr: {
        title: "36 · Tarih Katmanı",
        story:
          "Kars, taşın ve sınırın hafızasını taşır." + N2 +
          "Taş şehirler şunu öğretir: Kalıcılık, sabırla kurulur." + N2 +
          "Sınır şehirleri şunu öğretir: Kimlik, netleşince güçlenir." + N2 +
          "Tarih katmanı, ‘kalıcı değer’ dersini bırakır.",
        reflection:
          "Benim kalıcı değerim ne—ve onu nasıl koruyorum?",
      },
      en: {
        title: "36 · History Layer",
        story:
          "Kars carries the memory of stone and borders." + N2 +
          "Stone cities teach: permanence is built with patience." + N2 +
          "Borderlands teach: identity strengthens when it becomes clear." + N2 +
          "This layer leaves the lesson of lasting value.",
        reflection:
          "What is my lasting value—and how do I protect it?",
      },
    },

    numerology: {
      tr: {
        title: "36 · Numeroloji",
        story:
          "36 = sorumluluk + yaratım + dayanıklılık." + N2 +
          "36’nın gölgesi:" + NL +
          "• duygusuzlaşmak" + NL +
          "• küsmek" + NL +
          "• içe kapanmak" + N2 +
          "36’nın ışığı:" + NL +
          "• onur" + NL +
          "• sadakat" + NL +
          "• dayanırken yumuşak kalmak" + N2 +
          "Bu kapı sorar: ‘Söz mü, eylem mi?’",
        reflection:
          "Bugün sadakatimi hangi eylemle gösteriyorum?",
      },
      en: {
        title: "36 · Numerology",
        story:
          "36 = responsibility + creation + resilience." + N2 +
          "Shadow of 36:" + NL +
          "• emotional numbness" + NL +
          "• resentment" + NL +
          "• withdrawal" + N2 +
          "Light of 36:" + NL +
          "• honor" + NL +
          "• loyalty" + NL +
          "• staying soft while enduring" + N2 +
          "This gate asks: ‘Words—or actions?’",
        reflection:
          "What action shows my loyalty today?",
      },
    },

    symbols: {
      tr: {
        title: "36 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kar: arınma ve netlik." + NL +
          "• Taş: kalıcılık." + NL +
          "• Kale: koruma." + NL +
          "• Kurt: dayanıklılık ve sadakat." + N2 +
          "Sembol mesajı: ‘Soğuk, özü gösterir.’",
        reflection:
          "Bugün özümü hangi koşul gösteriyor?",
      },
      en: {
        title: "36 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Snow: cleansing and clarity." + NL +
          "• Stone: permanence." + NL +
          "• Fortress: protection." + NL +
          "• Wolf: endurance and loyalty." + N2 +
          "Symbol message: ‘Cold reveals essence.’",
        reflection:
          "Which condition is revealing my essence today?",
      },
    },

    ritual: {
      tr: {
        title: "36 · Ritüel",
        story:
          "36 Dakika Ritüeli (Öz Sözü):" + N2 +
          "1) Bir cümle yaz: ‘Benim özüm…’" + NL +
          "2) Altına yaz: ‘Bunu korumak sadakatimdir.’" + NL +
          "3) 36 nefes al. Son nefeste söyle: ‘Kalıyorum.’" + N2 +
          "Kapanış: ‘Özümle beraberim.’",
        reflection:
          "Bugün neye rağmen kalıyorum?",
      },
      en: {
        title: "36 · Ritual",
        story:
          "36-Minute Ritual (Essence Vow):" + N2 +
          "1) Write one sentence: ‘My essence is…’" + NL +
          "2) Add: ‘Protecting this is my loyalty.’" + NL +
          "3) Take 36 breaths. On the last say: ‘I remain.’" + N2 +
          "Closing: ‘I stay with my essence.’",
        reflection:
          "What do I stay despite today?",
      },
    },

    lab: {
      tr: {
        title: "36 · LAB: Endurance Engine",
        story:
          "Kod Gözü: Sadakat / Onur / Dayanıklılık" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Zor = kapan’" + NL +
          "• ‘Kapan = korun’" + N2 +
          "Rewrite:" + NL +
          "• ‘Zor = netleş’" + NL +
          "• ‘Netlik = güç’" + NL +
          "• ‘Güç = sadakat’",
        reflection:
          "Tek cümle yaz: Bugün zoru nasıl güce çeviriyorsun?",
      },
      en: {
        title: "36 · LAB: Endurance Engine",
        story:
          "Code Eye: Loyalty / Honor / Resilience" + N2 +
          "Rule Engine:" + NL +
          "• ‘Hard = shut down’" + NL +
          "• ‘Shut down = safe’" + N2 +
          "Rewrite:" + NL +
          "• ‘Hard = clarify’" + NL +
          "• ‘Clarity = power’" + NL +
          "• ‘Power = loyalty’",
        reflection:
          "Write one sentence: How do you turn hardship into strength today?",
      },
    },
  },
};


export const CITY_37: Record<CityCode, City7> = {
  "37": {
    city: "Kastamonu",

    base: {
      tr: {
        title: "37 · Gelenek",
        story:
          "Kastamonu bir şehir değil—kökten gelen gücün geleneğidir." + N2 +
          "Bu kapı sana şunu öğretir: Kök olmadan dal olmaz. Gelecek, geçmişin omuzlarında yükselir." + N2 +
          "37’nin enerjisi orman gibidir: yavaş büyür, ama sağlam büyür." + N2 +
          "Kastamonu’nun mesajı: ‘Sabırla kur, doğruyu taşı.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Gelenek, zincir değil; köktür. Kök doğruysa özgürlük olur.",
        reflection:
          "Bugün hangi kökten güç alıyorum?",
      },
      en: {
        title: "37 · Tradition",
        story:
          "Kastamonu is not only a city—it is the tradition of rooted power." + N2 +
          "This gate teaches: without roots, there are no branches. The future rises on the shoulders of the past." + N2 +
          "37 is forest energy: it grows slowly, but it grows strong." + N2 +
          "Kastamonu’s message: ‘Build with patience, carry what is right.’" + N2 +
          "Know this: tradition is not a chain; it is a root. If the root is healthy, it becomes freedom.",
        reflection:
          "Which root am I drawing strength from today?",
      },
    },

    deepC: {
      tr: {
        title: "37 · Matrix Derin İfşa",
        story:
          "Sistem 37’yi ‘kök-kural protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 7 = iç bilgelik. 37 = bilgelikten yaratmak." + N2 +
          "Gölge test: ‘Eskidir’ diye yanlış kalıpları taşımak." + NL +
          "Işık test: Kökü koruyup kalıbı güncellemek." + N2 +
          "37 sana şunu söyler: Kök aynı kalabilir, form değişebilir." + N2 +
          "Bu kapı, geçmişten güç alırken geleceğe alan açmayı öğretir.",
        reflection:
          "Ben geleneği korurken hangi formu yenilemeliyim?",
      },
      en: {
        title: "37 · Deep Matrix Reveal",
        story:
          "The system runs 37 as a ‘root-rule protocol.’" + N2 +
          "3 = creation, 7 = inner wisdom. 37 is creating from wisdom." + N2 +
          "Shadow test: carrying wrong patterns just because they are old." + NL +
          "Light test: protecting the root while updating the form." + N2 +
          "37 says: the root can remain, the form can change." + N2 +
          "This gate teaches you to take strength from the past while making space for the future.",
        reflection:
          "While keeping tradition, which form do I need to renew?",
      },
    },

    history: {
      tr: {
        title: "37 · Tarih Katmanı",
        story:
          "Kastamonu, ormanların ve dayanıklı yaşamın hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Zor coğrafyada yaşayan, ritim ve emekle ayakta kalır." + N2 +
          "Bu katman, ‘emek + sabır = kalıcılık’ dersini bırakır." + N2 +
          "Orman gibi: bir günde büyümez, ama büyüyünce yıkılmaz.",
        reflection:
          "Ben hangi şeyi ‘hemen’ istiyorum—ama ormanın ritmine mi ihtiyacım var?",
      },
      en: {
        title: "37 · History Layer",
        story:
          "Kastamonu carries the memory of forests and durable living." + N2 +
          "This layer teaches: in tough geography, people survive through rhythm and labor." + N2 +
          "It leaves the lesson: effort + patience = permanence." + N2 +
          "Like a forest: it doesn’t grow in a day, but once grown, it doesn’t fall easily.",
        reflection:
          "What do I want ‘right now’ that actually needs the forest’s rhythm?",
      },
    },

    numerology: {
      tr: {
        title: "37 · Numeroloji",
        story:
          "37 = bilgelik / kök / sürdürülebilir güç." + N2 +
          "37’nin gölgesi:" + NL +
          "• katılık" + NL +
          "• değişime direnç" + N2 +
          "37’nin ışığı:" + NL +
          "• olgun sabır" + NL +
          "• sağlam karakter" + NL +
          "• kökten gelen güven" + N2 +
          "Bu kapı sorar: ‘Kök mü, kalıp mı?’",
        reflection:
          "Bugün kalıbı bırakıp kökü koruyabildiğim yer neresi?",
      },
      en: {
        title: "37 · Numerology",
        story:
          "37 = wisdom / root / sustainable strength." + N2 +
          "Shadow of 37:" + NL +
          "• rigidity" + NL +
          "• resistance to change" + N2 +
          "Light of 37:" + NL +
          "• mature patience" + NL +
          "• strong character" + NL +
          "• trust from roots" + N2 +
          "This gate asks: ‘Root—or mold?’",
        reflection:
          "Where can I keep the root while releasing the mold today?",
      },
    },

    symbols: {
      tr: {
        title: "37 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Orman: sabır ve süreklilik." + NL +
          "• Çınar: köklü güç." + NL +
          "• Odun ateşi: emekle ısınma." + NL +
          "• Yol: gelenek ve geçiş." + N2 +
          "Sembol mesajı: ‘Kök sağlamsa rüzgâr korkutmaz.’",
        reflection:
          "Benim rüzgârım ne—köküm yeterince sağlam mı?",
      },
      en: {
        title: "37 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Forest: patience and continuity." + NL +
          "• Plane tree: rooted power." + NL +
          "• Wood fire: warmth through effort." + NL +
          "• Path: tradition and transition." + N2 +
          "Symbol message: ‘If the root is strong, the wind cannot frighten you.’",
        reflection:
          "What is my wind—and is my root strong enough?",
      },
    },

    ritual: {
      tr: {
        title: "37 · Ritüel",
        story:
          "37 Dakika Ritüeli (Kök Gücü):" + N2 +
          "1) Bir cümle yaz: ‘Köküm…’" + NL +
          "2) Altına yaz: ‘Bunu korurken formumu yeniliyorum.’" + NL +
          "3) 37 nefes al. Son nefeste söyle: ‘Köküm sağlam.’" + N2 +
          "Kapanış: ‘Sabır = güç.’",
        reflection:
          "Bugün hangi formu yenileyip kökü koruyorum?",
      },
      en: {
        title: "37 · Ritual",
        story:
          "37-Minute Ritual (Root Power):" + N2 +
          "1) Write: ‘My root is…’" + NL +
          "2) Add: ‘I protect it while renewing my form.’" + NL +
          "3) Take 37 breaths. On the last say: ‘My root is strong.’" + N2 +
          "Closing: ‘Patience is power.’",
        reflection:
          "Which form do I renew while keeping the root today?",
      },
    },

    lab: {
      tr: {
        title: "37 · LAB: Root Engine",
        story:
          "Kod Gözü: Kök / Sabır / Güncelleme" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Eski = doğru’" + NL +
          "• ‘Değişim = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Kök = doğru’" + NL +
          "• ‘Form = güncellenir’",
        reflection:
          "Tek cümle yaz: Bugün hangi kalıbı güncelliyorsun?",
      },
      en: {
        title: "37 · LAB: Root Engine",
        story:
          "Code Eye: Root / Patience / Update" + N2 +
          "Rule Engine:" + NL +
          "• ‘Old = right’" + NL +
          "• ‘Change = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘Root = right’" + NL +
          "• ‘Form can be updated’",
        reflection:
          "Write one sentence: Which mold are you updating today?",
      },
    },
  },
};
export const CITY_38: Record<CityCode, City7> = {
  "38": {
    city: "Kayseri",

    base: {
      tr: {
        title: "38 · Sistem",
        story:
          "Kayseri bir şehir değil—sistemin zekâsıdır." + N2 +
          "Bu kapı sana şunu öğretir: Para bir sonuçtur; sebep sistemdir." + N2 +
          "38’in enerjisi ‘akıl + üretim’ taşır: hızlı düşünür, net karar verir, verimli çalışır." + N2 +
          "Kayseri’nin mesajı: ‘Çok çalışmak değil, doğru sistemi kurmak.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Bolluk şans değil; düzenli akıştır.",
        reflection:
          "Bugün hangi sistemi kurarsam bolluk doğal akar?",
      },
      en: {
        title: "38 · System",
        story:
          "Kayseri is not only a city—it is the intelligence of systems." + N2 +
          "This gate teaches: money is an outcome; the cause is system." + N2 +
          "38 carries ‘mind + production’: it thinks fast, decides clearly, works efficiently." + N2 +
          "Kayseri’s message: ‘Not working more—building the right system.’" + N2 +
          "Know this: abundance is not luck; it is steady flow.",
        reflection:
          "Which system, if built today, makes abundance flow naturally?",
      },
    },

    deepC: {
      tr: {
        title: "38 · Matrix Derin İfşa",
        story:
          "Sistem 38’i ‘verim protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 8 = güç. 38 = yaratımı güce çevirmek." + N2 +
          "Gölge test: Hızla koşup doğru yere gitmemek." + NL +
          "Işık test: Hızı yönle birleştirmek." + N2 +
          "38 sana şunu söyler: Verim, zamandan değil; odaktan doğar." + N2 +
          "Bu kapı, ‘plan’ olmadan ‘hız’ın boşa aktığını gösterir.",
        reflection:
          "Ben hızımı nereye akıtıyorum—ve gerçekten oraya mı gitmek istiyorum?",
      },
      en: {
        title: "38 · Deep Matrix Reveal",
        story:
          "The system runs 38 as an ‘efficiency protocol.’" + N2 +
          "3 = creation, 8 = power. 38 is turning creation into power." + N2 +
          "Shadow test: running fast without going to the right place." + NL +
          "Light test: combining speed with direction." + N2 +
          "38 says: efficiency is not born from time—it is born from focus." + N2 +
          "This gate shows: without a plan, speed becomes wasted flow.",
        reflection:
          "Where am I pouring my speed—and do I truly want to go there?",
      },
    },

    history: {
      tr: {
        title: "38 · Tarih Katmanı",
        story:
          "Kayseri, ticaretin ve üretimin hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Pazar zekâsı, gözlemle doğar." + N2 +
          "İnsan da kendi hayatının pazarını kurar: değer üretir, değer değiştirir." + N2 +
          "Bu katman, ‘değer = sistem’ dersini bırakır.",
        reflection:
          "Ben hangi değerimi sistemle büyütüyorum?",
      },
      en: {
        title: "38 · History Layer",
        story:
          "Kayseri carries the memory of trade and production." + N2 +
          "This layer teaches: market intelligence is born from observation." + N2 +
          "You also build the market of your life: you produce value and exchange value." + N2 +
          "It leaves the lesson: value comes from system.",
        reflection:
          "Which value am I scaling through system today?",
      },
    },

    numerology: {
      tr: {
        title: "38 · Numeroloji",
        story:
          "38 = verim / güç / üretim." + N2 +
          "38’in gölgesi:" + NL +
          "• acele" + NL +
          "• yanlış hedef" + NL +
          "• tükenme" + N2 +
          "38’in ışığı:" + NL +
          "• plan" + NL +
          "• odak" + NL +
          "• sürdürülebilir üretim" + N2 +
          "Bu kapı sorar: ‘Sistemim ölçülebilir mi?’",
        reflection:
          "Bugün hangi işi ölçüp düzenli hâle getiriyorum?",
      },
      en: {
        title: "38 · Numerology",
        story:
          "38 = efficiency / power / production." + N2 +
          "Shadow of 38:" + NL +
          "• rushing" + NL +
          "• wrong target" + NL +
          "• burnout" + N2 +
          "Light of 38:" + NL +
          "• plan" + NL +
          "• focus" + NL +
          "• sustainable production" + N2 +
          "This gate asks: ‘Is your system measurable?’",
        reflection:
          "Which task am I measuring and making consistent today?",
      },
    },

    symbols: {
      tr: {
        title: "38 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Terazi: ölçü ve denge." + NL +
          "• Defter: kayıt ve takip." + NL +
          "• Çark: sistem." + NL +
          "• Pazar: değer değişimi." + N2 +
          "Sembol mesajı: ‘Ölç, düzenle, büyüt.’",
        reflection:
          "Bugün hangi çarkı kuruyorum?",
      },
      en: {
        title: "38 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Scale: measure and balance." + NL +
          "• Ledger: tracking and record." + NL +
          "• Gear: system." + NL +
          "• Market: value exchange." + N2 +
          "Symbol message: ‘Measure, organize, scale.’",
        reflection:
          "Which gear am I building today?",
      },
    },

    ritual: {
      tr: {
        title: "38 · Ritüel",
        story:
          "38 Dakika Ritüeli (Verim Planı):" + N2 +
          "1) Bugün üreteceğin 1 şeyi seç." + NL +
          "2) Onu 3 adımda yaz: hazırlık / üretim / teslim." + NL +
          "3) 38 nefes al. Son nefeste söyle: ‘Sistem kuruyorum.’" + N2 +
          "Kapanış: ‘Bolluk, sistemle gelir.’",
        reflection:
          "Bugün hangi 3 adımı netleştiriyorum?",
      },
      en: {
        title: "38 · Ritual",
        story:
          "38-Minute Ritual (Efficiency Plan):" + N2 +
          "1) Choose one thing you will produce today." + NL +
          "2) Write it in 3 steps: prep / produce / deliver." + NL +
          "3) Take 38 breaths. On the last say: ‘I build a system.’" + N2 +
          "Closing: ‘Abundance comes through system.’",
        reflection:
          "Which 3 steps am I clarifying today?",
      },
    },

    lab: {
      tr: {
        title: "38 · LAB: Efficiency Engine",
        story:
          "Kod Gözü: Sistem / Ölçü / Üretim" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Çok çalış = başarı’" + NL +
          "• ‘Dinlenme = kayıp’" + N2 +
          "Rewrite:" + NL +
          "• ‘Doğru sistem = başarı’" + NL +
          "• ‘Ritim = süreklilik’",
        reflection:
          "Tek cümle yaz: Bugün başarıyı hangi sistemle kuruyorsun?",
      },
      en: {
        title: "38 · LAB: Efficiency Engine",
        story:
          "Code Eye: System / Measure / Production" + N2 +
          "Rule Engine:" + NL +
          "• ‘Work more = success’" + NL +
          "• ‘Rest = loss’" + N2 +
          "Rewrite:" + NL +
          "• ‘Right system = success’" + NL +
          "• ‘Rhythm = continuity’",
        reflection:
          "Write one sentence: What system builds your success today?",
      },
    },
  },
};
export const CITY_39: Record<CityCode, City7> = {
  "39": {
    city: "Kirklareli",

    base: {
      tr: {
        title: "39 · Kırklar",
        story:
          "Kırklareli bir şehir değil—eşik bilgelik ve korumadır." + N2 +
          "Bu kapı sana şunu öğretir: Sınır, korku değil; seçiciliktir." + N2 +
          "39’un enerjisi ‘sessiz koruma’ taşır: görünmez ama etkilidir." + N2 +
          "Kırklar bilinci, olgunlaşmayı anlatır: Her şey hemen olmaz, her şey olgunlaşır." + N2 +
          "Bu kapıdan geçerken şunu bil: Korunmak için kapanmazsın; netleşirsin.",
        reflection:
          "Bugün hangi eşikte netleşmem gerekiyor?",
      },
      en: {
        title: "39 · The Forty",
        story:
          "Kirklareli is not only a city—it is threshold wisdom and protection." + N2 +
          "This gate teaches: a boundary is not fear; it is selectivity." + N2 +
          "39 carries ‘quiet protection’: invisible yet effective." + N2 +
          "The ‘forty’ consciousness speaks of maturation: things don’t happen instantly; they ripen." + N2 +
          "Know this: you don’t protect yourself by closing—you protect yourself by becoming clear.",
        reflection:
          "At which threshold do I need clarity today?",
      },
    },

    deepC: {
      tr: {
        title: "39 · Matrix Derin İfşa",
        story:
          "Sistem 39’u ‘olgunlaşma protokolü’ olarak çalıştırır." + N2 +
          "3 = yaratım, 9 = kapanış. 39 = yaratımın olgunlaşıp döngü kapatması." + N2 +
          "Gölge test: Acele edip ham karar vermek." + NL +
          "Işık test: Zamanı bekleyip doğru anda adım atmak." + N2 +
          "39 sana şunu söyler: Her şeyin bir pişme süresi var." + N2 +
          "Bu kapı, sabırsızlığı inceltir ve ‘doğru zaman’ı öğretir.",
        reflection:
          "Ben hangi konuda ‘pişmeden’ karar veriyorum?",
      },
      en: {
        title: "39 · Deep Matrix Reveal",
        story:
          "The system runs 39 as a ‘maturation protocol.’" + N2 +
          "3 = creation, 9 = closure. 39 is creation ripening into closure." + N2 +
          "Shadow test: rushing into raw decisions." + NL +
          "Light test: waiting for the right moment and stepping then." + N2 +
          "39 says: everything has a cooking time." + N2 +
          "This gate refines impatience and teaches ‘right timing.’",
        reflection:
          "Where am I deciding before things are ripe?",
      },
    },

    history: {
      tr: {
        title: "39 · Tarih Katmanı",
        story:
          "Kırklareli, sınır hafızası taşır: geçiş, kontrol, seçicilik." + N2 +
          "Sınır şehirleri şunu öğretir: Geçiş bir hak değil, bir seçimin sonucudur." + N2 +
          "Tarih katmanı, ‘eşik’ bilgisini bırakır: Kimin içeri girdiği, kim olduğunla ilgilidir." + N2 +
          "Bu katman, ‘netlik = korunma’ dersini bırakır.",
        reflection:
          "Ben hayatımda kimi içeri alıyorum—ve neden?",
      },
      en: {
        title: "39 · History Layer",
        story:
          "Kirklareli carries border memory: transition, control, selectivity." + N2 +
          "Borderlands teach: crossing is not entitlement; it is the outcome of choice." + N2 +
          "This layer leaves threshold knowledge: what enters your life reflects who you are." + N2 +
          "It leaves the lesson: clarity is protection.",
        reflection:
          "Whom do I let in—and why?",
      },
    },

    numerology: {
      tr: {
        title: "39 · Numeroloji",
        story:
          "39 = olgunlaşma / kapanış / doğru zaman." + N2 +
          "39’un gölgesi:" + NL +
          "• sabırsızlık" + NL +
          "• acele karar" + NL +
          "• pişmeden koparmak" + N2 +
          "39’un ışığı:" + NL +
          "• zamanla güçlenmek" + NL +
          "• netleşerek kapanış" + NL +
          "• seçici adım" + N2 +
          "Bu kapı sorar: ‘Şu an mı, sonra mı?’",
        reflection:
          "Bugün hangi şeyi zamana bırakmam gerekiyor?",
      },
      en: {
        title: "39 · Numerology",
        story:
          "39 = maturation / closure / right timing." + N2 +
          "Shadow of 39:" + NL +
          "• impatience" + NL +
          "• rushed decisions" + NL +
          "• picking before ripe" + N2 +
          "Light of 39:" + NL +
          "• growing stronger with time" + NL +
          "• closing with clarity" + NL +
          "• selective step" + N2 +
          "This gate asks: ‘Now—or later?’",
        reflection:
          "What should I leave to time today?",
      },
    },

    symbols: {
      tr: {
        title: "39 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Eşik: geçiş." + NL +
          "• Kilit: seçicilik." + NL +
          "• Saat: doğru zaman." + NL +
          "• Kırk halka: olgunlaşma." + N2 +
          "Sembol mesajı: ‘Netleş, sonra geç.’",
        reflection:
          "Ben hangi kapıda net değilim?",
      },
      en: {
        title: "39 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Threshold: transition." + NL +
          "• Lock: selectivity." + NL +
          "• Clock: right timing." + NL +
          "• Forty rings: maturation." + N2 +
          "Symbol message: ‘Get clear, then cross.’",
        reflection:
          "At which gate am I not clear?",
      },
    },

    ritual: {
      tr: {
        title: "39 · Ritüel",
        story:
          "39 Dakika Ritüeli (Doğru Zaman):" + N2 +
          "1) Bir konu seç: ‘şimdi mi sonra mı?’" + NL +
          "2) Kağıda iki sütun yaz: ‘Şimdi’ ve ‘Sonra’." + NL +
          "3) Her sütuna 3 cümle yaz." + NL +
          "4) 39 nefes al. Son nefeste söyle: ‘Netim.’" + N2 +
          "Kapanış: ‘Zamanı ben yönetirim.’",
        reflection:
          "Bugün hangi konuda netleşiyorum?",
      },
      en: {
        title: "39 · Ritual",
        story:
          "39-Minute Ritual (Right Timing):" + N2 +
          "1) Choose one topic: ‘now or later?’" + NL +
          "2) Write two columns: ‘Now’ and ‘Later’." + NL +
          "3) Write 3 sentences under each." + NL +
          "4) Take 39 breaths. On the last say: ‘I am clear.’" + N2 +
          "Closing: ‘I manage timing.’",
        reflection:
          "Where do I become clear today?",
      },
    },

    lab: {
      tr: {
        title: "39 · LAB: Timing Engine",
        story:
          "Kod Gözü: Zaman / Netlik / Seçicilik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hemen = güven’" + NL +
          "• ‘Beklersem kaybederim’" + N2 +
          "Rewrite:" + NL +
          "• ‘Netlik = güven’" + NL +
          "• ‘Doğru zaman = kazanç’",
        reflection:
          "Tek cümle yaz: Bugün ‘hemen’ yerine neyi seçiyorsun?",
      },
      en: {
        title: "39 · LAB: Timing Engine",
        story:
          "Code Eye: Timing / Clarity / Selectivity" + N2 +
          "Rule Engine:" + NL +
          "• ‘Now = safety’" + NL +
          "• ‘If I wait, I lose’" + N2 +
          "Rewrite:" + NL +
          "• ‘Clarity = safety’" + NL +
          "• ‘Right timing = gain’",
        reflection:
          "Write one sentence: What do you choose instead of ‘now’ today?",
      },
    },
  },
};
export const CITY_40: Record<CityCode, City7> = {
  "40": {
    city: "Kirsehir",

    base: {
      tr: {
        title: "40 · Olgunluk",
        story:
          "Kırşehir bir şehir değil—olgunluğun bozkır sessizliğidir." + N2 +
          "Bu kapı sana şunu öğretir: Sadelik, eksiklik değil; yoğunluktur." + N2 +
          "40’ın enerjisi ‘arınmış karakter’ taşır: gereksizi bırakır, özü korur." + N2 +
          "Kırşehir’in mesajı: ‘Az söz, çok idrak.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Olgunluk, gösteriş değil; iç dengedir.",
        reflection:
          "Bugün hangi konuda daha olgun bir seçim yapıyorum?",
      },
      en: {
        title: "40 · Maturity",
        story:
          "Kirsehir is not only a city—it is the steppe silence of maturity." + N2 +
          "This gate teaches: simplicity is not lack; it is density." + N2 +
          "40 carries ‘refined character’: it releases excess and protects essence." + N2 +
          "Kirsehir’s message: ‘Few words, deep understanding.’" + N2 +
          "Know this: maturity is not show—it is inner balance.",
        reflection:
          "Where am I choosing a more mature response today?",
      },
    },

    deepC: {
      tr: {
        title: "40 · Matrix Derin İfşa",
        story:
          "Sistem 40’ı ‘arınma olgunluğu protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 0 = alan. 40 = yapıyı sadeleştirip alan açmak." + N2 +
          "Gölge test: Sertleşip taşlaşmak." + NL +
          "Işık test: Sadeleşip bilgeleşmek." + N2 +
          "40 sana şunu söyler: Çokluk seni değil; özü kaybettirir." + N2 +
          "Bu kapı, egonun gürültüsünü azaltır, idraki artırır.",
        reflection:
          "Benim hayatımda gürültü yapan fazlalık ne?",
      },
      en: {
        title: "40 · Deep Matrix Reveal",
        story:
          "The system runs 40 as a ‘refined maturity protocol.’" + N2 +
          "4 = structure, 0 = field. 40 is simplifying structure to create space." + N2 +
          "Shadow test: hardening into stone." + NL +
          "Light test: simplifying into wisdom." + N2 +
          "40 says: excess doesn’t strengthen you—it makes you lose essence." + N2 +
          "This gate lowers ego-noise and increases insight.",
        reflection:
          "What excess creates noise in my life today?",
      },
    },

    history: {
      tr: {
        title: "40 · Tarih Katmanı",
        story:
          "Kırşehir, Anadolu’nun iç sesini taşır: bozkırın sabrı, halkın sakinliği." + N2 +
          "Tarih katmanı şunu öğretir: Merkezde kalan şehir, merkezin bilgeliğini taşır." + N2 +
          "Bu katman, ‘sükûnet = güç’ dersini bırakır." + N2 +
          "Dışarı hızlansa da içeride duran kazanır.",
        reflection:
          "Ben hangi alanda içerde durmayı öğreniyorum?",
      },
      en: {
        title: "40 · History Layer",
        story:
          "Kirsehir carries Anatolia’s inner voice: steppe patience, calm people." + N2 +
          "This layer teaches: a city that stays central carries central wisdom." + N2 +
          "It leaves the lesson: calm is power." + N2 +
          "Even when outside speeds up, the one who stays inside wins.",
        reflection:
          "Where am I learning to stay within today?",
      },
    },

    numerology: {
      tr: {
        title: "40 · Numeroloji",
        story:
          "40 = olgunlaşma / arınma / tamamlanma eşiği." + N2 +
          "40’ın gölgesi:" + NL +
          "• sertlik" + NL +
          "• duyguya kapanma" + N2 +
          "40’ın ışığı:" + NL +
          "• bilgelik" + NL +
          "• sade güç" + NL +
          "• iç denge" + N2 +
          "Bu kapı sorar: ‘Ne gereksiz?’",
        reflection:
          "Bugün hangi gereksizi bırakıyorum?",
      },
      en: {
        title: "40 · Numerology",
        story:
          "40 = maturation / purification / threshold of completion." + N2 +
          "Shadow of 40:" + NL +
          "• rigidity" + NL +
          "• closing to emotion" + N2 +
          "Light of 40:" + NL +
          "• wisdom" + NL +
          "• simple power" + NL +
          "• inner balance" + N2 +
          "This gate asks: ‘What is unnecessary?’",
        reflection:
          "What unnecessary thing am I releasing today?",
      },
    },

    symbols: {
      tr: {
        title: "40 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Bozkır: sade güç." + NL +
          "• Derviş: iç denge." + NL +
          "• Kuyu: derin idrak." + NL +
          "• 40 halka: olgunlaşma." + N2 +
          "Sembol mesajı: ‘Azalt ki derinleş.’",
        reflection:
          "Ben derinleşmek için nerede azaltıyorum?",
      },
      en: {
        title: "40 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Steppe: simple power." + NL +
          "• Dervish: inner balance." + NL +
          "• Well: deep insight." + NL +
          "• 40 rings: maturation." + N2 +
          "Symbol message: ‘Reduce to deepen.’",
        reflection:
          "Where am I reducing to deepen today?",
      },
    },

    ritual: {
      tr: {
        title: "40 · Ritüel",
        story:
          "40 Dakika Ritüeli (Sadeleşme Yemini):" + N2 +
          "1) Bir kağıda yaz: ‘Bugün bırakıyorum…’" + NL +
          "2) Altına yaz: ‘Özü seçiyorum…’" + NL +
          "3) 40 nefes al. Son nefeste söyle: ‘Olgunum.’" + N2 +
          "Kapanış: ‘Sadelik = güç.’",
        reflection:
          "Bugün hangi şeyi bırakıp güçleniyorum?",
      },
      en: {
        title: "40 · Ritual",
        story:
          "40-Minute Ritual (Vow of Simplicity):" + N2 +
          "1) Write: ‘Today I release…’" + NL +
          "2) Write: ‘I choose essence…’" + NL +
          "3) Take 40 breaths. On the last say: ‘I am mature.’" + N2 +
          "Closing: ‘Simplicity is power.’",
        reflection:
          "What do I release to become stronger today?",
      },
    },

    lab: {
      tr: {
        title: "40 · LAB: Maturity Engine",
        story:
          "Kod Gözü: Sadelik / Öz / Denge" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Çok = güçlü’" + NL +
          "• ‘Az = zayıf’" + N2 +
          "Rewrite:" + NL +
          "• ‘Az = net’" + NL +
          "• ‘Net = güçlü’",
        reflection:
          "Tek cümle yaz: Bugün ‘az’ı nasıl güce çeviriyorsun?",
      },
      en: {
        title: "40 · LAB: Maturity Engine",
        story:
          "Code Eye: Simplicity / Essence / Balance" + N2 +
          "Rule Engine:" + NL +
          "• ‘More = strong’" + NL +
          "• ‘Less = weak’" + N2 +
          "Rewrite:" + NL +
          "• ‘Less = clear’" + NL +
          "• ‘Clear = strong’",
        reflection:
          "Write one sentence: How do you turn ‘less’ into power today?",
      },
    },
  },
};
export const CITY_41: Record<CityCode, City7> = {
  "41": {
    city: "Kocaeli",

    base: {
      tr: {
        title: "41 · Çark",
        story:
          "Kocaeli bir şehir değil—çarkların döndüğü üretim bilincidir." + N2 +
          "Bu kapı sana şunu öğretir: Hız, doğru yönle birleşince güç olur." + N2 +
          "41’in enerjisi ‘işleyen sistem’ gibidir: üretir, taşır, çoğaltır." + N2 +
          "Kocaeli’nin mesajı: ‘Çark dönüyor—sen direksiyonda mısın?’" + N2 +
          "Bu kapıdan geçerken şunu bil: Sistem seni taşır, ama bilinç sistemi yönetir.",
        reflection:
          "Bugün hayatımın hangi çarkını bilinçle yönetiyorum?",
      },
      en: {
        title: "41 · The Gear",
        story:
          "Kocaeli is not only a city—it is production consciousness where gears turn." + N2 +
          "This gate teaches: speed becomes power when combined with right direction." + N2 +
          "41 works like a running system: it produces, carries, multiplies." + N2 +
          "Kocaeli’s message: ‘The gear is turning—are you at the wheel?’" + N2 +
          "Know this: systems carry you, but consciousness drives systems.",
        reflection:
          "Which gear of my life am I consciously driving today?",
      },
    },

    deepC: {
      tr: {
        title: "41 · Matrix Derin İfşa",
        story:
          "Sistem 41’i ‘motor protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 1 = irade. 41 = yapının iradeyle yönetilmesi." + N2 +
          "Gölge test: İşlemek ama yaşamamak. Üretmek ama tükenmek." + NL +
          "Işık test: Üretirken ritim kurmak." + N2 +
          "41 sana şunu söyler: Sistem kurarsan büyürsün; sistem seni kurarsa kaybolursun." + N2 +
          "Bu kapı, ‘ben’ ile ‘makine’ arasına bilinç koyar.",
        reflection:
          "Ben sistemi mi yönetiyorum, sistem beni mi yönetiyor?",
      },
      en: {
        title: "41 · Deep Matrix Reveal",
        story:
          "The system runs 41 as a ‘engine protocol.’" + N2 +
          "4 = structure, 1 = will. 41 is structure driven by will." + N2 +
          "Shadow test: functioning without living. Producing while burning out." + NL +
          "Light test: building rhythm while producing." + N2 +
          "41 says: if you build the system, you grow; if the system builds you, you disappear." + N2 +
          "This gate places consciousness between ‘me’ and ‘machine.’",
        reflection:
          "Am I driving the system—or is the system driving me?",
      },
    },

    history: {
      tr: {
        title: "41 · Tarih Katmanı",
        story:
          "Kocaeli, geçiş ve üretim hatlarının hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Yol üstü şehirleri hız üretir; ama hızın bedeli ritimsizlik olabilir." + N2 +
          "Bu katman, ‘hız + ritim’ dersini bırakır: akış kurarsan güç olur.",
        reflection:
          "Benim hızımın bedeli ne—ritmim var mı?",
      },
      en: {
        title: "41 · History Layer",
        story:
          "Kocaeli carries the memory of transit and production lines." + N2 +
          "This layer teaches: route cities generate speed, but speed can cost rhythm." + N2 +
          "It leaves the lesson: speed + rhythm becomes power.",
        reflection:
          "What is the cost of my speed—and do I have rhythm?",
      },
    },

    numerology: {
      tr: {
        title: "41 · Numeroloji",
        story:
          "41 = iradeyle işleyen yapı." + N2 +
          "41’in gölgesi:" + NL +
          "• otomatik yaşamak" + NL +
          "• tükenmek" + N2 +
          "41’in ışığı:" + NL +
          "• bilinçli üretim" + NL +
          "• plan" + NL +
          "• sürdürülebilir tempo" + N2 +
          "Bu kapı sorar: ‘Temponu kim belirliyor?’",
        reflection:
          "Bugün tempomu kim belirliyor: ben mi, koşullar mı?",
      },
      en: {
        title: "41 · Numerology",
        story:
          "41 = structure driven by will." + N2 +
          "Shadow of 41:" + NL +
          "• living on autopilot" + NL +
          "• burnout" + N2 +
          "Light of 41:" + NL +
          "• conscious production" + NL +
          "• plan" + NL +
          "• sustainable pace" + N2 +
          "This gate asks: ‘Who sets your pace?’",
        reflection:
          "Who sets my pace today—me or circumstances?",
      },
    },

    symbols: {
      tr: {
        title: "41 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Çark: sistem ve süreklilik." + NL +
          "• Motor: güç." + NL +
          "• Ray/hat: yön." + NL +
          "• Kırmızı ışık: dur ve kontrol et." + N2 +
          "Sembol mesajı: ‘Durmayı bilmeyen hız, güce dönüşmez.’",
        reflection:
          "Bugün hangi yerde durmam gerekiyor?",
      },
      en: {
        title: "41 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Gear: system and continuity." + NL +
          "• Engine: power." + NL +
          "• Line/rail: direction." + NL +
          "• Red light: stop and check." + N2 +
          "Symbol message: ‘Speed without pauses does not become power.’",
        reflection:
          "Where do I need to stop today?",
      },
    },

    ritual: {
      tr: {
        title: "41 · Ritüel",
        story:
          "41 Dakika Ritüeli (Direksiyon):" + N2 +
          "1) Bugün yaptığın işleri yaz: 3 madde." + NL +
          "2) Her madde için şunu yaz: ‘Bunu neden yapıyorum?’" + NL +
          "3) 41 nefes al. Son nefeste söyle: ‘Direksiyondayım.’" + N2 +
          "Kapanış: ‘Sistemim bana hizmet eder.’",
        reflection:
          "Bugün hangi işi bırakınca direksiyona geçerim?",
      },
      en: {
        title: "41 · Ritual",
        story:
          "41-Minute Ritual (At the Wheel):" + N2 +
          "1) List 3 tasks you do today." + NL +
          "2) For each, write: ‘Why am I doing this?’" + NL +
          "3) Take 41 breaths. On the last say: ‘I am at the wheel.’" + N2 +
          "Closing: ‘My system serves me.’",
        reflection:
          "Which task, if removed, puts me back at the wheel?",
      },
    },

    lab: {
      tr: {
        title: "41 · LAB: System Driver Engine",
        story:
          "Kod Gözü: Çark / Tempo / Yön" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Koşarsam yetişirim’" + NL +
          "• ‘Durursam kaybederim’" + N2 +
          "Rewrite:" + NL +
          "• ‘Durursam yönetirim’" + NL +
          "• ‘Yönetirsem büyürüm’",
        reflection:
          "Tek cümle yaz: Bugün hızını hangi kararla yönetiyorsun?",
      },
      en: {
        title: "41 · LAB: System Driver Engine",
        story:
          "Code Eye: Gear / Pace / Direction" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I run, I keep up’" + NL +
          "• ‘If I stop, I lose’" + N2 +
          "Rewrite:" + NL +
          "• ‘If I stop, I steer’" + NL +
          "• ‘If I steer, I grow’",
        reflection:
          "Write one sentence: What decision steers your speed today?",
      },
    },
  },
};
export const CITY_42: Record<CityCode, City7> = {
  "42": {
    city: "Konya",

    base: {
      tr: {
        title: "42 · Merkez",
        story:
          "Konya bir şehir değil—merkezin hatırlayışıdır." + N2 +
          "Bu kapı sana şunu öğretir: Dönmek, kaybolmak değil; merkeze yaklaşmaktır." + N2 +
          "42’nin enerjisi ‘sükûnet + teslimiyet’ taşır: direnç azalır, akış başlar." + N2 +
          "Konya’nın mesajı: ‘Merkezde kal, her şey etrafında döner.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Yükselmek için bazen diz çökülür.",
        reflection:
          "Bugün hangi direnci bırakıp merkeze dönüyorum?",
      },
      en: {
        title: "42 · Center",
        story:
          "Konya is not only a city—it is the remembrance of center." + N2 +
          "This gate teaches: turning is not losing yourself; it is approaching the center." + N2 +
          "42 carries ‘calm + surrender’: resistance lowers, flow begins." + N2 +
          "Konya’s message: ‘Stay centered, let the world turn around you.’" + N2 +
          "Know this: to rise, sometimes you kneel.",
        reflection:
          "Which resistance am I releasing to return to center today?",
      },
    },

    deepC: {
      tr: {
        title: "42 · Matrix Derin İfşa",
        story:
          "Sistem 42’yi ‘teslimiyet protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 2 = denge. 42 = yapının dengede çözülmesi." + N2 +
          "Gölge test: Kontrolü bırakmamak." + NL +
          "Işık test: Kontrolü bilinçle bırakmak." + N2 +
          "42 sana şunu söyler: Direnerek büyümezsin; akarak büyürsün." + N2 +
          "Bu kapı, ‘ben yaparım’ı ‘akışa güveniyorum’a dönüştürür.",
        reflection:
          "Ben hangi kontrolü bırakınca hafiflerim?",
      },
      en: {
        title: "42 · Deep Matrix Reveal",
        story:
          "The system runs 42 as a ‘surrender protocol.’" + N2 +
          "4 = structure, 2 = balance. 42 is structure dissolving into balance." + N2 +
          "Shadow test: refusing to release control." + NL +
          "Light test: consciously letting go." + N2 +
          "42 says: you don’t grow by resisting; you grow by flowing." + N2 +
          "This gate turns ‘I must control’ into ‘I trust the flow.’",
        reflection:
          "Which control can I release to feel lighter today?",
      },
    },

    history: {
      tr: {
        title: "42 · Tarih Katmanı",
        story:
          "Konya, semanın ve iç yolculuğun hafızasını taşır." + N2 +
          "Dönüş, semboldür: merkez sabittir, dünya döner." + N2 +
          "Tarih katmanı şunu öğretir: İç merkezini bulan, dış rüzgârdan etkilenmez." + N2 +
          "Bu katman, ‘merkez = huzur’ dersini bırakır.",
        reflection:
          "Benim merkezim nerede—ve onu ne zaman kaybediyorum?",
      },
      en: {
        title: "42 · History Layer",
        story:
          "Konya carries the memory of turning and inner journey." + N2 +
          "The spin is symbolic: the center is still while the world turns." + N2 +
          "This layer teaches: the one who finds inner center is not shaken by outer winds." + N2 +
          "It leaves the lesson: center equals peace.",
        reflection:
          "Where is my center—and when do I lose it?",
      },
    },

    numerology: {
      tr: {
        title: "42 · Numeroloji",
        story:
          "42 = denge / çözülme / teslimiyet." + N2 +
          "42’nin gölgesi:" + NL +
          "• aşırı kontrol" + NL +
          "• direnç" + NL +
          "• sertlik" + N2 +
          "42’nin ışığı:" + NL +
          "• akış" + NL +
          "• kabulleniş" + NL +
          "• iç huzur" + N2 +
          "Bu kapı sorar: ‘Ne için direniyorsun?’",
        reflection:
          "Bugün hangi direnci sevgiyle bırakıyorum?",
      },
      en: {
        title: "42 · Numerology",
        story:
          "42 = balance / dissolution / surrender." + N2 +
          "Shadow of 42:" + NL +
          "• excessive control" + NL +
          "• resistance" + NL +
          "• rigidity" + N2 +
          "Light of 42:" + NL +
          "• flow" + NL +
          "• acceptance" + NL +
          "• inner peace" + N2 +
          "This gate asks: ‘What are you resisting?’",
        reflection:
          "Which resistance am I releasing with love today?",
      },
    },

    symbols: {
      tr: {
        title: "42 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Sema: merkez etrafında dönüş." + NL +
          "• Çember: bütünlük." + NL +
          "• Beyaz: teslimiyet." + NL +
          "• Mum: iç ışık." + N2 +
          "Sembol mesajı: ‘Merkezde kal, dünya dönsün.’",
        reflection:
          "Ben hangi olayda merkezden çıkıyorum?",
      },
      en: {
        title: "42 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Whirling: turning around center." + NL +
          "• Circle: wholeness." + NL +
          "• White: surrender." + NL +
          "• Candle: inner light." + N2 +
          "Symbol message: ‘Stay centered, let the world spin.’",
        reflection:
          "In which situation do I lose my center?",
      },
    },

    ritual: {
      tr: {
        title: "42 · Ritüel",
        story:
          "42 Dakika Ritüeli (Merkeze Dönüş):" + N2 +
          "1) 7 dakika sessiz otur." + NL +
          "2) 7 dakika derin nefes al." + NL +
          "3) 7 dakika kalbine odaklan." + NL +
          "4) 21 nefes boyunca içinden söyle: ‘Merkezdeyim.’" + N2 +
          "Kapanış: ‘Direnç çözülür, huzur kalır.’",
        reflection:
          "Bugün hangi pratikle merkeze dönüyorum?",
      },
      en: {
        title: "42 · Ritual",
        story:
          "42-Minute Ritual (Return to Center):" + N2 +
          "1) Sit silently for 7 minutes." + NL +
          "2) Take deep breaths for 7 minutes." + NL +
          "3) Focus on your heart for 7 minutes." + NL +
          "4) For 21 breaths repeat: ‘I am centered.’" + N2 +
          "Closing: ‘Resistance dissolves, peace remains.’",
        reflection:
          "Which practice brings me back to center today?",
      },
    },

    lab: {
      tr: {
        title: "42 · LAB: Surrender Engine",
        story:
          "Kod Gözü: Merkez / Akış / Teslimiyet" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Kontrol = güven’" + NL +
          "• ‘Direnç = güç’" + N2 +
          "Rewrite:" + NL +
          "• ‘Akış = güven’" + NL +
          "• ‘Teslimiyet = güç’",
        reflection:
          "Tek cümle yaz: Bugün hangi kontrolü akışa bırakıyorsun?",
      },
      en: {
        title: "42 · LAB: Surrender Engine",
        story:
          "Code Eye: Center / Flow / Surrender" + N2 +
          "Rule Engine:" + NL +
          "• ‘Control = safety’" + NL +
          "• ‘Resistance = power’" + N2 +
          "Rewrite:" + NL +
          "• ‘Flow = safety’" + NL +
          "• ‘Surrender = power’",
        reflection:
          "Write one sentence: Which control are you surrendering to flow today?",
      },
    },
  },
};
export const CITY_43: Record<CityCode, City7> = {
  "43": {
    city: "Kutahya",

    base: {
      tr: {
        title: "43 · Form",
        story:
          "Kütahya bir şehir değil—toprağın forma dönüştüğü sanattır." + N2 +
          "Bu kapı sana şunu öğretir: Kırılganlık zayıflık değil, incelikli bir güçtür." + N2 +
          "43’ün enerjisi ‘toprak + el’ gibi çalışır: yoğurur, şekil verir, pişirir." + N2 +
          "Kütahya’nın mesajı: ‘Hamı olgunlaştır.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Sen de bir formsun; niyetin seni biçimlendirir.",
        reflection:
          "Bugün hangi ham yanımı olgunlaştırıyorum?",
      },
      en: {
        title: "43 · Form",
        story:
          "Kutahya is not only a city—it is art where earth becomes form." + N2 +
          "This gate teaches: fragility is not weakness; it is refined power." + N2 +
          "43 works like ‘earth + hand’: it kneads, shapes, fires." + N2 +
          "Kutahya’s message: ‘Mature the raw.’" + N2 +
          "Know this: you are also a form; intention shapes you.",
        reflection:
          "Which raw part of me am I maturing today?",
      },
    },

    deepC: {
      tr: {
        title: "43 · Matrix Derin İfşa",
        story:
          "Sistem 43’ü ‘formlandırma protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 3 = yaratım. 43 = yaratımı yapıya dökmek." + N2 +
          "Gölge test: Kırılınca vazgeçmek." + NL +
          "Işık test: Kırığı ders yapıp daha iyi form kurmak." + N2 +
          "43 sana şunu söyler: Hata, hamurun fazlasıdır; ustalık, fazlayı alıp güzeli bırakmaktır." + N2 +
          "Bu kapı, ‘kusur’ sandığını ‘imza’ya çevirir.",
        reflection:
          "Ben kusuru nerede imzaya çevirebilirim?",
      },
      en: {
        title: "43 · Deep Matrix Reveal",
        story:
          "The system runs 43 as a ‘form-building protocol.’" + N2 +
          "4 = structure, 3 = creation. 43 is pouring creation into structure." + N2 +
          "Shadow test: quitting after a break." + NL +
          "Light test: turning the break into lesson and building a better form." + N2 +
          "43 says: error is excess clay; mastery is removing excess and leaving beauty." + N2 +
          "This gate turns what you call ‘flaw’ into a signature.",
        reflection:
          "Where can I turn a flaw into a signature today?",
      },
    },

    history: {
      tr: {
        title: "43 · Tarih Katmanı",
        story:
          "Kütahya, el emeğinin hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Ustalık, nesilden nesile aktarılır." + N2 +
          "İnsan da kendi ustalığını aktarır: kendi içine." + N2 +
          "Bu katman, ‘emek + sabır + ateş = form’ dersini bırakır.",
        reflection:
          "Ben hangi alanda ustalığımı büyütüyorum?",
      },
      en: {
        title: "43 · History Layer",
        story:
          "Kutahya carries the memory of craftsmanship." + N2 +
          "This layer teaches: mastery is passed from generation to generation." + N2 +
          "You also pass mastery inward—into yourself." + N2 +
          "It leaves the lesson: effort + patience + fire = form.",
        reflection:
          "Where am I growing my mastery today?",
      },
    },

    numerology: {
      tr: {
        title: "43 · Numeroloji",
        story:
          "43 = yaratıcı yapı / olgun form." + N2 +
          "43’ün gölgesi:" + NL +
          "• mükemmeliyetçilik" + NL +
          "• kırılma korkusu" + N2 +
          "43’ün ışığı:" + NL +
          "• esnek ustalık" + NL +
          "• sabır" + NL +
          "• kusuru güzelleştirmek" + N2 +
          "Bu kapı sorar: ‘Hata mı, malzeme mi?’",
        reflection:
          "Bugün hatayı malzemeye nasıl çeviriyorum?",
      },
      en: {
        title: "43 · Numerology",
        story:
          "43 = creative structure / mature form." + N2 +
          "Shadow of 43:" + NL +
          "• perfectionism" + NL +
          "• fear of breaking" + N2 +
          "Light of 43:" + NL +
          "• flexible mastery" + NL +
          "• patience" + NL +
          "• beautifying the flaw" + N2 +
          "This gate asks: ‘Error—or material?’",
        reflection:
          "How do I turn error into material today?",
      },
    },

    symbols: {
      tr: {
        title: "43 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kil/toprak: ham potansiyel." + NL +
          "• Çark: form verme." + NL +
          "• Fırın/ateş: olgunlaştırma." + NL +
          "• Çini desen: kimlik imzası." + N2 +
          "Sembol mesajı: ‘Hamı pişir, izini bırak.’",
        reflection:
          "Benim izim ne—hangi desen beni anlatıyor?",
      },
      en: {
        title: "43 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Clay/earth: raw potential." + NL +
          "• Wheel: shaping." + NL +
          "• Kiln/fire: maturing." + NL +
          "• Tile pattern: signature identity." + N2 +
          "Symbol message: ‘Fire the raw, leave your mark.’",
        reflection:
          "What is my mark—what pattern represents me?",
      },
    },

    ritual: {
      tr: {
        title: "43 · Ritüel",
        story:
          "43 Dakika Ritüeli (Yeni Form):" + N2 +
          "1) Bir konuyu seç: ‘ham’ olan." + NL +
          "2) O konu için 3 küçük adım yaz: yoğur / şekil ver / pişir." + NL +
          "3) 43 nefes al. Son nefeste söyle: ‘Forma giriyorum.’" + N2 +
          "Kapanış: ‘Kırılmam ders, formum güç.’",
        reflection:
          "Bugün hangi formu seçiyorum?",
      },
      en: {
        title: "43 · Ritual",
        story:
          "43-Minute Ritual (New Form):" + N2 +
          "1) Choose one topic that is ‘raw.’" + NL +
          "2) Write 3 steps: knead / shape / fire." + NL +
          "3) Take 43 breaths. On the last say: ‘I take form.’" + N2 +
          "Closing: ‘My break is a lesson; my form is strength.’",
        reflection:
          "Which form am I choosing today?",
      },
    },

    lab: {
      tr: {
        title: "43 · LAB: Form Engine",
        story:
          "Kod Gözü: Form / Ustalık / Ateş" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Kusur = başarısızlık’" + NL +
          "• ‘Kırılma = bitiş’" + N2 +
          "Rewrite:" + NL +
          "• ‘Kusur = imza’" + NL +
          "• ‘Kırılma = güncelleme’",
        reflection:
          "Tek cümle yaz: Bugün kusuru nasıl imzaya çeviriyorsun?",
      },
      en: {
        title: "43 · LAB: Form Engine",
        story:
          "Code Eye: Form / Mastery / Fire" + N2 +
          "Rule Engine:" + NL +
          "• ‘Flaw = failure’" + NL +
          "• ‘Break = end’" + N2 +
          "Rewrite:" + NL +
          "• ‘Flaw = signature’" + NL +
          "• ‘Break = update’",
        reflection:
          "Write one sentence: How do you turn a flaw into a signature today?",
      },
    },
  },
};
export const CITY_44: Record<CityCode, City7> = {
  "44": {
    city: "Malatya",

    base: {
      tr: {
        title: "44 · Tatlı Güç",
        story:
          "Malatya bir şehir değil—tatlı bir gücün bereketidir." + N2 +
          "Bu kapı sana şunu öğretir: Yumuşak olmak zayıflık değil, ustalıktır." + N2 +
          "44’ün enerjisi ‘çoğaltan yapı’ taşır: ürün verir, besler, iyileştirir." + N2 +
          "Malatya’nın mesajı: ‘Kırıldıysan toparlan. Toparlandıysan büyü.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Bolluk bazen sertlikle değil, yumuşak disiplinle gelir.",
        reflection:
          "Bugün yumuşak disiplinle hangi alanı büyütüyorum?",
      },
      en: {
        title: "44 · Soft Power",
        story:
          "Malatya is not only a city—it is abundance of soft power." + N2 +
          "This gate teaches: softness is not weakness; it is mastery." + N2 +
          "44 carries ‘multiplying structure’: it yields, nourishes, heals." + N2 +
          "Malatya’s message: ‘If you broke, regroup. If you regrouped, grow.’" + N2 +
          "Know this: abundance sometimes arrives not through hardness, but through gentle discipline.",
        reflection:
          "Where am I growing through gentle discipline today?",
      },
    },

    deepC: {
      tr: {
        title: "44 · Matrix Derin İfşa",
        story:
          "Sistem 44’ü ‘usta yapı protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı. 44 = yapıların ustası: düzeni iki kat güçlendirir." + N2 +
          "Gölge test: Aşırı kontrol ve sertlik." + NL +
          "Işık test: Düzen + şefkat." + N2 +
          "44 sana şunu söyler: Yapı kurmak, kalbi kapatmak değildir." + N2 +
          "Bu kapı, ‘güçlü sistem’ ile ‘açık kalp’ı aynı anda taşımayı öğretir.",
        reflection:
          "Ben düzen kurarken kalbimi kapatıyor muyum?",
      },
      en: {
        title: "44 · Deep Matrix Reveal",
        story:
          "The system runs 44 as a ‘master structure protocol.’" + N2 +
          "4 = structure. 44 is the master of structures—doubling order." + N2 +
          "Shadow test: overcontrol and harshness." + NL +
          "Light test: order + compassion." + N2 +
          "44 says: building structure does not mean closing the heart." + N2 +
          "This gate teaches holding a strong system and an open heart at the same time.",
        reflection:
          "When I build order, do I close my heart?",
      },
    },

    history: {
      tr: {
        title: "44 · Tarih Katmanı",
        story:
          "Malatya, ürün ve toprak hafızası taşır." + N2 +
          "Tarih katmanı şunu öğretir: Bereket, düzenli emekle olur." + N2 +
          "Ürün bir günde olmaz; mevsim ister." + N2 +
          "Bu katman, ‘mevsim = sabır’ dersini bırakır: toparlanma bir süreçtir.",
        reflection:
          "Ben hangi mevsimdeyim: ekim mi, büyüme mi, hasat mı?",
      },
      en: {
        title: "44 · History Layer",
        story:
          "Malatya carries crop and soil memory." + N2 +
          "This layer teaches: abundance comes through consistent effort." + N2 +
          "A harvest doesn’t happen in a day; it needs seasons." + N2 +
          "It leaves the lesson: recovery is a process—like seasons.",
        reflection:
          "Which season am I in: sowing, growing, or harvesting?",
      },
    },

    numerology: {
      tr: {
        title: "44 · Numeroloji",
        story:
          "44 = güçlü düzen / ustalık / kalıcı yapı." + N2 +
          "44’ün gölgesi:" + NL +
          "• katı kontrol" + NL +
          "• esneksizlik" + N2 +
          "44’ün ışığı:" + NL +
          "• sağlam plan" + NL +
          "• yumuşak disiplin" + NL +
          "• sürdürülebilir bolluk" + N2 +
          "Bu kapı sorar: ‘Sistemim hem güçlü hem yumuşak mı?’",
        reflection:
          "Bugün sistemime hangi yumuşaklığı ekliyorum?",
      },
      en: {
        title: "44 · Numerology",
        story:
          "44 = strong order / mastery / lasting structure." + N2 +
          "Shadow of 44:" + NL +
          "• rigid control" + NL +
          "• inflexibility" + N2 +
          "Light of 44:" + NL +
          "• solid plan" + NL +
          "• gentle discipline" + NL +
          "• sustainable abundance" + N2 +
          "This gate asks: ‘Is my system both strong and soft?’",
        reflection:
          "What softness am I adding to my system today?",
      },
    },

    symbols: {
      tr: {
        title: "44 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kayısı: tatlı bereket." + NL +
          "• Sepet: kapasite." + NL +
          "• Dal: çoğalma." + NL +
          "• Dört köşe: yapı." + N2 +
          "Sembol mesajı: ‘Tatlılık, gücün başka bir formudur.’",
        reflection:
          "Bugün gücümü hangi yumuşak formda gösteriyorum?",
      },
      en: {
        title: "44 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Apricot: sweet abundance." + NL +
          "• Basket: capacity." + NL +
          "• Branch: multiplication." + NL +
          "• Four corners: structure." + N2 +
          "Symbol message: ‘Sweetness is another form of strength.’",
        reflection:
          "In what soft form am I showing my strength today?",
      },
    },

    ritual: {
      tr: {
        title: "44 · Ritüel",
        story:
          "44 Dakika Ritüeli (Toparlan ve Kur):" + N2 +
          "1) Bugün toparlayacağın 1 alan seç (ev, beden, iş, zihin)." + NL +
          "2) 4 küçük adım yaz." + NL +
          "3) 44 nefes al. Son nefeste söyle: ‘Kuruyorum.’" + N2 +
          "Kapanış: ‘Yumuşak disiplinim var.’",
        reflection:
          "Bugün hangi 4 adımı atıyorum?",
      },
      en: {
        title: "44 · Ritual",
        story:
          "44-Minute Ritual (Regroup and Build):" + N2 +
          "1) Choose one area to regroup today (home, body, work, mind)." + NL +
          "2) Write 4 small steps." + NL +
          "3) Take 44 breaths. On the last say: ‘I build.’" + N2 +
          "Closing: ‘I have gentle discipline.’",
        reflection:
          "Which 4 steps am I taking today?",
      },
    },

    lab: {
      tr: {
        title: "44 · LAB: Master Builder Engine",
        story:
          "Kod Gözü: Yapı / Bolluk / Yumuşak Disiplin" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Sert olursam güçlü olurum’" + NL +
          "• ‘Kontrol = düzen’" + N2 +
          "Rewrite:" + NL +
          "• ‘Yumuşak disiplin = güç’" + NL +
          "• ‘Düzen = sevgiyle kurulur’",
        reflection:
          "Tek cümle yaz: Bugün gücü nasıl yeniden tanımlıyorsun?",
      },
      en: {
        title: "44 · LAB: Master Builder Engine",
        story:
          "Code Eye: Structure / Abundance / Gentle Discipline" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I’m harsh, I’m strong’" + NL +
          "• ‘Control = order’" + N2 +
          "Rewrite:" + NL +
          "• ‘Gentle discipline = strength’" + NL +
          "• ‘Order is built with love’",
        reflection:
          "Write one sentence: How do you redefine strength today?",
      },
    },
  },
};
export const CITY_45: Record<CityCode, City7> = {
  "45": {
    city: "Manisa",

    base: {
      tr: {
        title: "45 · Meyve",
        story:
          "Manisa bir şehir değil—emeğin meyveye dönüştüğü bağdır." + N2 +
          "Bu kapı sana şunu öğretir: Meyve, sabırla olgunlaşır; zorla olmaz." + N2 +
          "45’in enerjisi ‘toprak + güneş’ gibidir: büyütür, besler, sonunda verir." + N2 +
          "Manisa’nın mesajı: ‘Ektiğini gör, büyüttüğünü sahiplen.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Hasat, sadece ürün değil; karakterdir.",
        reflection:
          "Bugün hangi emeğim meyve vermeye başladı?",
      },
      en: {
        title: "45 · Fruit",
        story:
          "Manisa is not only a city—it is the vineyard where effort becomes fruit." + N2 +
          "This gate teaches: fruit ripens with patience; it cannot be forced." + N2 +
          "45 carries ‘soil + sun’: it grows, nourishes, and finally gives." + N2 +
          "Manisa’s message: ‘See what you planted, own what you grew.’" + N2 +
          "Know this: harvest is not only product; it is character.",
        reflection:
          "Which effort of mine is starting to bear fruit today?",
      },
    },

    deepC: {
      tr: {
        title: "45 · Matrix Derin İfşa",
        story:
          "Sistem 45’i ‘hasat protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 5 = değişim. 45 = yapının değişimle meyve vermesi." + N2 +
          "Gölge test: Sonucu erken istemek." + NL +
          "Işık test: Süreci yönetmek." + N2 +
          "45 sana şunu söyler: Hasat, sadece zaman değil; doğru bakım ister." + N2 +
          "Bu kapı, bakımın bir sistem olduğunu hatırlatır: sulama, budama, bekleme.",
        reflection:
          "Ben bugün hangi şeyi ‘bakımla’ büyütüyorum?",
      },
      en: {
        title: "45 · Deep Matrix Reveal",
        story:
          "The system runs 45 as a ‘harvest protocol.’" + N2 +
          "4 = structure, 5 = change. 45 is structure bearing fruit through change." + N2 +
          "Shadow test: demanding results too early." + NL +
          "Light test: managing the process." + N2 +
          "45 says: harvest needs not only time, but the right care." + N2 +
          "This gate reminds: care is a system—watering, pruning, waiting.",
        reflection:
          "What am I growing today through care?",
      },
    },

    history: {
      tr: {
        title: "45 · Tarih Katmanı",
        story:
          "Manisa, bereketli toprak ve bağ kültürünün hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Toprakla yaşayan insan sabrı öğrenir." + N2 +
          "Bağ, bir ritimdir: her yıl aynı döngü, her yıl daha olgun ürün." + N2 +
          "Bu katman, ‘ritim = bereket’ dersini bırakır.",
        reflection:
          "Benim ritmim var mı—yoksa rastgele mi yaşıyorum?",
      },
      en: {
        title: "45 · History Layer",
        story:
          "Manisa carries the memory of fertile soil and vineyard culture." + N2 +
          "This layer teaches: those who live with soil learn patience." + N2 +
          "A vineyard is rhythm: the same cycle each year, a more mature fruit each year." + N2 +
          "It leaves the lesson: rhythm becomes abundance.",
        reflection:
          "Do I have rhythm—or do I live randomly?",
      },
    },

    numerology: {
      tr: {
        title: "45 · Numeroloji",
        story:
          "45 = bakım / hasat / olgun sonuç." + N2 +
          "45’in gölgesi:" + NL +
          "• sabırsızlık" + NL +
          "• ‘hemen olsun’ baskısı" + N2 +
          "45’in ışığı:" + NL +
          "• süreç yönetimi" + NL +
          "• düzenli emek" + NL +
          "• olgun sonuç" + N2 +
          "Bu kapı sorar: ‘Ne ektin?’",
        reflection:
          "Bugün ne ektiğimi dürüstçe görebiliyor muyum?",
      },
      en: {
        title: "45 · Numerology",
        story:
          "45 = care / harvest / mature result." + N2 +
          "Shadow of 45:" + NL +
          "• impatience" + NL +
          "• pressure of ‘now’" + N2 +
          "Light of 45:" + NL +
          "• process management" + NL +
          "• consistent effort" + NL +
          "• mature result" + N2 +
          "This gate asks: ‘What did you plant?’",
        reflection:
          "Can I honestly see what I planted today?",
      },
    },

    symbols: {
      tr: {
        title: "45 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Üzüm: çoğalma ve olgunluk." + NL +
          "• Bağ: bakım ve ritim." + NL +
          "• Sepet: hasat kapasitesi." + NL +
          "• Budama makası: gereksizi kesmek." + N2 +
          "Sembol mesajı: ‘Bakım, büyümeyi hızlandırır.’",
        reflection:
          "Bugün hangi gereksizi buduyorum?",
      },
      en: {
        title: "45 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Grapes: multiplication and maturity." + NL +
          "• Vineyard: care and rhythm." + NL +
          "• Basket: harvest capacity." + NL +
          "• Pruning shears: cutting excess." + N2 +
          "Symbol message: ‘Care accelerates growth.’",
        reflection:
          "What excess am I pruning today?",
      },
    },

    ritual: {
      tr: {
        title: "45 · Ritüel",
        story:
          "45 Dakika Ritüeli (Hasat Niyeti):" + N2 +
          "1) Bugün büyüttüğün 1 şeyi yaz." + NL +
          "2) Ona dair 3 bakım adımı yaz." + NL +
          "3) 45 nefes al. Son nefeste söyle: ‘Olgunlaşıyor.’" + N2 +
          "Kapanış: ‘Ritim kurarım, meyve gelir.’",
        reflection:
          "Bugün hangi bakım adımını atıyorum?",
      },
      en: {
        title: "45 · Ritual",
        story:
          "45-Minute Ritual (Harvest Intention):" + N2 +
          "1) Write one thing you are growing." + NL +
          "2) Write 3 care steps for it." + NL +
          "3) Take 45 breaths. On the last say: ‘It ripens.’" + N2 +
          "Closing: ‘I build rhythm, fruit arrives.’",
        reflection:
          "Which care step am I taking today?",
      },
    },

    lab: {
      tr: {
        title: "45 · LAB: Harvest Engine",
        story:
          "Kod Gözü: Bakım / Ritim / Sonuç" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hemen sonuç = güven’" + NL +
          "• ‘Beklemek = kayıp’" + N2 +
          "Rewrite:" + NL +
          "• ‘Bakım = güven’" + NL +
          "• ‘Ritim = sonuç’",
        reflection:
          "Tek cümle yaz: Bugün sonucu değil, hangi bakımı seçiyorsun?",
      },
      en: {
        title: "45 · LAB: Harvest Engine",
        story:
          "Code Eye: Care / Rhythm / Result" + N2 +
          "Rule Engine:" + NL +
          "• ‘Instant result = safety’" + NL +
          "• ‘Waiting = loss’" + N2 +
          "Rewrite:" + NL +
          "• ‘Care = safety’" + NL +
          "• ‘Rhythm = results’",
        reflection:
          "Write one sentence: What care are you choosing instead of chasing results today?",
      },
    },
  },
};
export const CITY_46: Record<CityCode, City7> = {
  "46": {
    city: "Kahramanmaras",

    base: {
      tr: {
        title: "46 · Dayanıklılık",
        story:
          "Kahramanmaraş bir şehir değil—dayanıklılığın yoğrulduğu yerdir." + N2 +
          "Bu kapı sana şunu öğretir: Güç, kırılmamak değil; kırılınca yeniden toparlanmaktır." + N2 +
          "46’nın enerjisi ‘sabırla yoğurma’ gibidir: hamı olgunlaştırır, dağılana form verir." + N2 +
          "Maraş’ın mesajı: ‘Yavaş yoğur, sağlam olsun.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Dayanıklılık, kalbin sertleşmesi değil; kalbin güçlenmesidir.",
        reflection:
          "Bugün hangi acıyı güce çevirebilirim?",
      },
      en: {
        title: "46 · Resilience",
        story:
          "Kahramanmaras is not only a city—it is where resilience is kneaded." + N2 +
          "This gate teaches: strength is not never breaking; it is regrouping after you break." + N2 +
          "46 works like patient kneading: it matures the raw and gives form to what scatters." + N2 +
          "Maras’s message: ‘Knead slowly, become solid.’" + N2 +
          "Know this: resilience is not hardening the heart; it is strengthening the heart.",
        reflection:
          "Which pain can I turn into power today?",
      },
    },

    deepC: {
      tr: {
        title: "46 · Matrix Derin İfşa",
        story:
          "Sistem 46’yı ‘kalp-yapı protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 6 = sorumluluk. 46 = sorumluluğu yapı içinde taşımak." + N2 +
          "Gölge test: Yükün altında ezilip kapanmak." + NL +
          "Işık test: Yükü bölmek, sistemi kurmak." + N2 +
          "46 sana şunu söyler: Dayanıklılık bir kişilik değil, bir sistemdir." + N2 +
          "Bu kapı, ‘tek başıma’ modunu kapatır; destek ve düzen açar.",
        reflection:
          "Ben bugün yükü nasıl sistemle hafifletiyorum?",
      },
      en: {
        title: "46 · Deep Matrix Reveal",
        story:
          "The system runs 46 as a ‘heart-structure protocol.’" + N2 +
          "4 = structure, 6 = responsibility. 46 is carrying responsibility within structure." + N2 +
          "Shadow test: collapsing under the load and shutting down." + NL +
          "Light test: splitting the load and building a system." + N2 +
          "46 says: resilience is not a personality—it is a system." + N2 +
          "This gate ends ‘alone mode’ and opens support and order.",
        reflection:
          "How am I lightening the load through system today?",
      },
    },

    history: {
      tr: {
        title: "46 · Tarih Katmanı",
        story:
          "Kahramanmaraş, ‘kahramanlık’ kelimesini sadece savaşla değil; dayanmayla da anlatır." + N2 +
          "Tarih katmanı şunu öğretir: Toplumlar da insanlar gibi, zorla olgunlaşır." + N2 +
          "Bu katman, ‘birlik = dayanıklılık’ dersini bırakır." + N2 +
          "Yalnız güç kısa sürer; birlikte güç kalıcı olur.",
        reflection:
          "Ben dayanıklılığı nerede yalnızlığa çeviriyorum?",
      },
      en: {
        title: "46 · History Layer",
        story:
          "Kahramanmaras speaks of heroism not only through battle, but through endurance." + N2 +
          "This layer teaches: societies, like humans, mature through hardship." + N2 +
          "It leaves the lesson: unity becomes resilience." + N2 +
          "Solo strength is short; shared strength lasts.",
        reflection:
          "Where am I turning resilience into isolation?",
      },
    },

    numerology: {
      tr: {
        title: "46 · Numeroloji",
        story:
          "46 = yapı içinde sorumluluk / dayanıklılık." + N2 +
          "46’nın gölgesi:" + NL +
          "• aşırı yüklenme" + NL +
          "• suçluluk" + NL +
          "• ‘ben hallederim’ kibri" + N2 +
          "46’nın ışığı:" + NL +
          "• paylaşım" + NL +
          "• sistem" + NL +
          "• kalp gücü" + N2 +
          "Bu kapı sorar: ‘Yük kimin?’",
        reflection:
          "Bugün hangi yükü paylaşabilirim?",
      },
      en: {
        title: "46 · Numerology",
        story:
          "46 = responsibility within structure / resilience." + N2 +
          "Shadow of 46:" + NL +
          "• overloading" + NL +
          "• guilt" + NL +
          "• ego of ‘I can handle it alone’" + N2 +
          "Light of 46:" + NL +
          "• sharing" + NL +
          "• system" + NL +
          "• heart strength" + N2 +
          "This gate asks: ‘Whose load is it?’",
        reflection:
          "Which load can I share today?",
      },
    },

    symbols: {
      tr: {
        title: "46 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Yoğurma: sabır ve emek." + NL +
          "• Soğuk ve sıcak: denge." + NL +
          "• Külah: form." + NL +
          "• Halat: çekme gücü (birlik)." + N2 +
          "Sembol mesajı: ‘Sabırla yoğurursan dağılmaz.’",
        reflection:
          "Bugün hangi şeyi sabırla yoğurmalıyım?",
      },
      en: {
        title: "46 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Kneading: patience and effort." + NL +
          "• Cold and heat: balance." + NL +
          "• Cone: form." + NL +
          "• Rope: pulling power (unity)." + N2 +
          "Symbol message: ‘If you knead with patience, it won’t fall apart.’",
        reflection:
          "What do I need to knead with patience today?",
      },
    },

    ritual: {
      tr: {
        title: "46 · Ritüel",
        story:
          "46 Dakika Ritüeli (Yükü Böl):" + N2 +
          "1) Bir konu seç: ‘beni yoran’." + NL +
          "2) Onu 4 parçaya böl: iş / duygu / beden / destek." + NL +
          "3) Her parça için 1 küçük adım yaz." + NL +
          "4) 46 nefes al. Son nefeste söyle: ‘Dayanıklıyım.’" + N2 +
          "Kapanış: ‘Sistem kurarım, güçlenirim.’",
        reflection:
          "Bugün hangi küçük adım dayanıklılığı başlatır?",
      },
      en: {
        title: "46 · Ritual",
        story:
          "46-Minute Ritual (Split the Load):" + N2 +
          "1) Choose one thing that drains you." + NL +
          "2) Split it into 4 parts: work / emotion / body / support." + NL +
          "3) Write 1 small step for each." + NL +
          "4) Take 46 breaths. On the last say: ‘I am resilient.’" + N2 +
          "Closing: ‘I build systems, I grow stronger.’",
        reflection:
          "Which small step begins resilience today?",
      },
    },

    lab: {
      tr: {
        title: "46 · LAB: Resilience Engine",
        story:
          "Kod Gözü: Dayanıklılık / Sistem / Paylaşım" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Yük = tek başıma’" + NL +
          "• ‘Destek = zayıflık’" + N2 +
          "Rewrite:" + NL +
          "• ‘Destek = güç’" + NL +
          "• ‘Sistem = dayanıklılık’",
        reflection:
          "Tek cümle yaz: Bugün desteği nasıl güce çeviriyorsun?",
      },
      en: {
        title: "46 · LAB: Resilience Engine",
        story:
          "Code Eye: Resilience / System / Sharing" + N2 +
          "Rule Engine:" + NL +
          "• ‘Load = alone’" + NL +
          "• ‘Support = weakness’" + N2 +
          "Rewrite:" + NL +
          "• ‘Support = strength’" + NL +
          "• ‘System = resilience’",
        reflection:
          "Write one sentence: How do you turn support into strength today?",
      },
    },
  },
};
export const CITY_47: Record<CityCode, City7> = {
  "47": {
    city: "Mardin",

    base: {
      tr: {
        title: "47 · Merdiven",
        story:
          "Mardin bir şehir değil—gökyüzü ile toprağın merdivenidir." + N2 +
          "Bu kapı sana şunu öğretir: Katmanlar çatışmak zorunda değil; üst üste güzelleşebilir." + N2 +
          "47’nin enerjisi taş gibi çalışır: hafıza tutar, ışığı yansıtır, gölgeyi gösterir." + N2 +
          "Mardin’in mesajı: ‘Yükseğe çıkmak için önce katmanlarını kabul et.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Işık, gölgesini inkâr edenin değil; gölgesini tanıyanın içinden parlar.",
        reflection:
          "Bugün hangi katmanımı inkâr etmeyi bırakıyorum?",
      },
      en: {
        title: "47 · Stairway",
        story:
          "Mardin is not only a city—it is the stairway between sky and earth." + N2 +
          "This gate teaches: layers don’t have to fight; they can stack into beauty." + N2 +
          "47 works like stone: it holds memory, reflects light, reveals shadow." + N2 +
          "Mardin’s message: ‘To rise, first accept your layers.’" + N2 +
          "Know this: light shines not through those who deny shadow, but through those who recognize it.",
        reflection:
          "Which layer of me am I stopping to deny today?",
      },
    },

    deepC: {
      tr: {
        title: "47 · Matrix Derin İfşa",
        story:
          "Sistem 47’yi ‘katman-aydınlatma protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 7 = iç görüş. 47 = yapının iç görüşle aydınlanması." + N2 +
          "Gölge test: Gölgeyi saklamak, imajı korumak." + NL +
          "Işık test: Gölgeyi görmek, özü güçlendirmek." + N2 +
          "47 sana şunu söyler: Gerçek güç, kusursuz görünmek değil; gerçek olmak." + N2 +
          "Bu kapı, ‘üst katman’ ile ‘alt katman’ı barıştırır. Merdiven böyle kurulur.",
        reflection:
          "Ben bugün hangi gölgeyi ışığa çıkarıyorum?",
      },
      en: {
        title: "47 · Deep Matrix Reveal",
        story:
          "The system runs 47 as a ‘layer-illumination protocol.’" + N2 +
          "4 = structure, 7 = inner sight. 47 is structure illuminated through inner sight." + N2 +
          "Shadow test: hiding shadow to protect image." + NL +
          "Light test: seeing shadow to strengthen essence." + N2 +
          "47 says: real power is not looking perfect—it is being real." + N2 +
          "This gate reconciles ‘upper layer’ and ‘lower layer.’ That’s how the stairway is built.",
        reflection:
          "Which shadow am I bringing into light today?",
      },
    },

    history: {
      tr: {
        title: "47 · Tarih Katmanı",
        story:
          "Mardin, dinlerin, dillerin ve taşın katman hafızasıdır." + N2 +
          "Tarih katmanı şunu öğretir: Bir şehir bile çok kimlik taşırken dağılmıyorsa, insan da dağılmadan çok katman taşıyabilir." + N2 +
          "Bu katman, ‘çeşitlilik + bütünlük’ dersini bırakır." + N2 +
          "Katmanlar birleşince şehir olur; katmanlar birleşince insan da olur.",
        reflection:
          "Ben hangi kimliğimi dışlamayı bırakınca bütün olurum?",
      },
      en: {
        title: "47 · History Layer",
        story:
          "Mardin is layered memory of stone, languages, and faiths." + N2 +
          "This layer teaches: if a city can hold many identities without collapsing, so can a person." + N2 +
          "It leaves the lesson: diversity and wholeness can coexist." + N2 +
          "Layers form a city; layers form a human too.",
        reflection:
          "Which identity do I stop rejecting to become whole?",
      },
    },

    numerology: {
      tr: {
        title: "47 · Numeroloji",
        story:
          "47 = iç görüşle yapı kurmak / katmanları birleştirmek." + N2 +
          "47’nin gölgesi:" + NL +
          "• imaj takıntısı" + NL +
          "• kendini saklamak" + N2 +
          "47’nin ışığı:" + NL +
          "• dürüstlük" + NL +
          "• bütünlük" + NL +
          "• derin idrak" + N2 +
          "Bu kapı sorar: ‘Gerçek mi, imaj mı?’",
        reflection:
          "Bugün gerçek olmak için hangi maskeyi bırakıyorum?",
      },
      en: {
        title: "47 · Numerology",
        story:
          "47 = building structure through inner sight / uniting layers." + N2 +
          "Shadow of 47:" + NL +
          "• image obsession" + NL +
          "• hiding yourself" + N2 +
          "Light of 47:" + NL +
          "• honesty" + NL +
          "• wholeness" + NL +
          "• deep insight" + N2 +
          "This gate asks: ‘Truth—or image?’",
        reflection:
          "Which mask am I dropping to be real today?",
      },
    },

    symbols: {
      tr: {
        title: "47 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Merdiven: yükseliş." + NL +
          "• Taş: hafıza." + NL +
          "• Işık-gölge: bütünlük." + NL +
          "• Kapı kemeri: geçiş." + N2 +
          "Sembol mesajı: ‘Katmanlarını sev, yüksel.’",
        reflection:
          "Bugün hangi katmanımı seviyorum?",
      },
      en: {
        title: "47 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Stairway: ascent." + NL +
          "• Stone: memory." + NL +
          "• Light-shadow: wholeness." + NL +
          "• Archway: transition." + N2 +
          "Symbol message: ‘Love your layers, rise.’",
        reflection:
          "Which layer am I loving today?",
      },
    },

    ritual: {
      tr: {
        title: "47 · Ritüel",
        story:
          "47 Dakika Ritüeli (Katman Barışı):" + N2 +
          "1) Kağıda iki başlık yaz: ‘Üst Katman’ ve ‘Alt Katman’." + NL +
          "2) Her başlığın altına 3 cümle yaz." + NL +
          "3) Ortaya tek cümle: ‘Ben bir bütünüm.’" + NL +
          "4) 47 nefes al. Son nefeste söyle: ‘Barışıyorum.’" + N2 +
          "Kapanış: ‘Katmanlarım merdivenim.’",
        reflection:
          "Bugün hangi katmanımla barışıyorum?",
      },
      en: {
        title: "47 · Ritual",
        story:
          "47-Minute Ritual (Layer Peace):" + N2 +
          "1) Write two headers: ‘Upper Layer’ and ‘Lower Layer’." + NL +
          "2) Write 3 sentences under each." + NL +
          "3) In the middle write: ‘I am whole.’" + NL +
          "4) Take 47 breaths. On the last say: ‘I reconcile.’" + N2 +
          "Closing: ‘My layers are my stairway.’",
        reflection:
          "Which layer am I making peace with today?",
      },
    },

    lab: {
      tr: {
        title: "47 · LAB: Layer Engine",
        story:
          "Kod Gözü: Katman / Gölge / Bütünlük" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Gölge = ayıp’" + NL +
          "• ‘Maskesiz = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Gölge = veri’" + NL +
          "• ‘Gerçek = güç’",
        reflection:
          "Tek cümle yaz: Bugün hangi gerçeği seçiyorsun?",
      },
      en: {
        title: "47 · LAB: Layer Engine",
        story:
          "Code Eye: Layer / Shadow / Wholeness" + N2 +
          "Rule Engine:" + NL +
          "• ‘Shadow = shame’" + NL +
          "• ‘Without mask = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘Shadow = data’" + NL +
          "• ‘Truth = power’",
        reflection:
          "Write one sentence: Which truth do you choose today?",
      },
    },
  },
};
export const CITY_48: Record<CityCode, City7> = {
  "48": {
    city: "Mugla",

    base: {
      tr: {
        title: "48 · Su",
        story:
          "Muğla bir şehir değil—suyun özgürlük hafızasıdır." + N2 +
          "Bu kapı sana şunu öğretir: Keyif, bilinçle birleşince şifa olur." + N2 +
          "48’in enerjisi deniz gibi çalışır: açar, hafifletir, yeniler." + N2 +
          "Muğla’nın mesajı: ‘Bedenini sev, hayatını sev.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Özgürlük; kaçmak değil, kendinle barışmaktır.",
        reflection:
          "Bugün bedenimde nerede daha çok barış seçiyorum?",
      },
      en: {
        title: "48 · Water",
        story:
          "Mugla is not only a city—it is the water-memory of freedom." + N2 +
          "This gate teaches: pleasure becomes healing when joined with consciousness." + N2 +
          "48 works like the sea: it opens, lightens, renews." + N2 +
          "Mugla’s message: ‘Love your body, love your life.’" + N2 +
          "Know this: freedom is not escaping—it is making peace with yourself.",
        reflection:
          "Where in my body am I choosing more peace today?",
      },
    },

    deepC: {
      tr: {
        title: "48 · Matrix Derin İfşa",
        story:
          "Sistem 48’i ‘beden-özgürlük protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 8 = güç. 48 = gücü yapıda tutmak: bedeni sağlam bir tapınak yapmak." + N2 +
          "Gölge test: Keyfi kaçışa çevirmek." + NL +
          "Işık test: Keyfi ritüele çevirmek." + N2 +
          "48 sana şunu söyler: Bedenle kavga eden özgür olamaz." + N2 +
          "Bu kapı, bedeni düşman olmaktan çıkarır: sahneye ve araca çevirir.",
        reflection:
          "Benim keyfim kaçış mı, şifa mı?",
      },
      en: {
        title: "48 · Deep Matrix Reveal",
        story:
          "The system runs 48 as a ‘body-freedom protocol.’" + N2 +
          "4 = structure, 8 = power. 48 is holding power inside structure: making the body a strong temple." + N2 +
          "Shadow test: turning pleasure into escape." + NL +
          "Light test: turning pleasure into ritual." + N2 +
          "48 says: you cannot be free while fighting your body." + N2 +
          "This gate turns the body from enemy into stage and vehicle.",
        reflection:
          "Is my pleasure escape—or healing?",
      },
    },

    history: {
      tr: {
        title: "48 · Tarih Katmanı",
        story:
          "Muğla, kıyıların ve geçişlerin hafızasını taşır: denizle yaşayan hayat." + N2 +
          "Kıyı şehirleri şunu öğretir: Açıklık, ruhu genişletir." + N2 +
          "Tarih katmanı burada ‘denge’ dersini bırakır: özgürlük, sınırla birlikte güzel olur." + N2 +
          "Deniz özgürdür ama kıyısı vardır. İnsan da öyle.",
        reflection:
          "Ben özgürlüğü nerede sınırsızlık sanıyorum?",
      },
      en: {
        title: "48 · History Layer",
        story:
          "Mugla carries coastal memory: life shaped by the sea." + N2 +
          "Coastal cities teach: openness expands the soul." + N2 +
          "This layer leaves a lesson of balance: freedom becomes beautiful with boundaries." + N2 +
          "The sea is free, yet it has a shore. So do you.",
        reflection:
          "Where do I mistake freedom for having no boundaries?",
      },
    },

    numerology: {
      tr: {
        title: "48 · Numeroloji",
        story:
          "48 = güçlü yapı + özgür akış." + N2 +
          "48’in gölgesi:" + NL +
          "• kaçış" + NL +
          "• aşırılık" + NL +
          "• bedenle kopukluk" + N2 +
          "48’in ışığı:" + NL +
          "• ritim" + NL +
          "• beden sevgisi" + NL +
          "• özgürlüğü sürdürülebilir kılmak" + N2 +
          "Bu kapı sorar: ‘Keyfin ritmi var mı?’",
        reflection:
          "Bugün keyfimi hangi ritimle dengeliyorum?",
      },
      en: {
        title: "48 · Numerology",
        story:
          "48 = strong structure + free flow." + N2 +
          "Shadow of 48:" + NL +
          "• escape" + NL +
          "• excess" + NL +
          "• disconnection from body" + N2 +
          "Light of 48:" + NL +
          "• rhythm" + NL +
          "• body love" + NL +
          "• making freedom sustainable" + N2 +
          "This gate asks: ‘Does your pleasure have rhythm?’",
        reflection:
          "What rhythm balances my pleasure today?",
      },
    },

    symbols: {
      tr: {
        title: "48 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Deniz: özgürlük." + NL +
          "• Kıyı: sınır." + NL +
          "• Tuzlu su: arınma." + NL +
          "• Güneş: görünürlük." + N2 +
          "Sembol mesajı: ‘Özgür ol, ama merkezini koru.’",
        reflection:
          "Benim merkezim neresi?",
      },
      en: {
        title: "48 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Sea: freedom." + NL +
          "• Shore: boundary." + NL +
          "• Salt water: cleansing." + NL +
          "• Sun: visibility." + N2 +
          "Symbol message: ‘Be free, but keep your center.’",
        reflection:
          "Where is my center?",
      },
    },

    ritual: {
      tr: {
        title: "48 · Ritüel",
        story:
          "48 Dakika Ritüeli (Beden Barışı):" + N2 +
          "1) 8 dakika nefes al, bedeni yumuşat." + NL +
          "2) 16 dakika yürüyüş yap (yavaş)." + NL +
          "3) 24 dakika su ritmi: su iç, duş al, yüzünü yıka." + N2 +
          "Kapanış: ‘Bedenimle barıştım.’",
        reflection:
          "Bugün bedenime hangi şefkati veriyorum?",
      },
      en: {
        title: "48 · Ritual",
        story:
          "48-Minute Ritual (Body Peace):" + N2 +
          "1) 8 minutes of breathing—soften the body." + NL +
          "2) 16 minutes of slow walking." + NL +
          "3) 24 minutes of water rhythm: drink water, shower, wash your face." + N2 +
          "Closing: ‘I made peace with my body.’",
        reflection:
          "What compassion am I giving my body today?",
      },
    },

    lab: {
      tr: {
        title: "48 · LAB: Body Freedom Engine",
        story:
          "Kod Gözü: Beden / Özgürlük / Ritim" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Keyif = kaçış’" + NL +
          "• ‘Beden = yük’" + N2 +
          "Rewrite:" + NL +
          "• ‘Keyif = şifa’" + NL +
          "• ‘Beden = tapınak’",
        reflection:
          "Tek cümle yaz: Bugün bedenini nasıl tapınağa çeviriyorsun?",
      },
      en: {
        title: "48 · LAB: Body Freedom Engine",
        story:
          "Code Eye: Body / Freedom / Rhythm" + N2 +
          "Rule Engine:" + NL +
          "• ‘Pleasure = escape’" + NL +
          "• ‘Body = burden’" + N2 +
          "Rewrite:" + NL +
          "• ‘Pleasure = healing’" + NL +
          "• ‘Body = temple’",
        reflection:
          "Write one sentence: How do you turn your body into a temple today?",
      },
    },
  },
};
export const CITY_49: Record<CityCode, City7> = {
  "49": {
    city: "Mus",

    base: {
      tr: {
        title: "49 · Sabır",
        story:
          "Muş bir şehir değil—sabrın ovadaki sessiz büyümesidir." + N2 +
          "Bu kapı sana şunu öğretir: Geç kalmak bazen gecikme değil, olgunlaşmadır." + N2 +
          "49’un enerjisi ‘derin bekleyiş’ taşır: tohum toprağın içinde görünmezken bile çalışır." + N2 +
          "Muş’un mesajı: ‘Görünmeyen büyümeyi küçümseme.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Senin içinde de görünmeyen bir büyüme var.",
        reflection:
          "Bugün hangi görünmeyen büyümeye güveniyorum?",
      },
      en: {
        title: "49 · Patience",
        story:
          "Mus is not only a city—it is patience growing silently on the plain." + N2 +
          "This gate teaches: what seems late is sometimes not delay, but ripening." + N2 +
          "49 carries ‘deep waiting’: even when unseen, the seed works under soil." + N2 +
          "Mus’s message: ‘Don’t underestimate invisible growth.’" + N2 +
          "Know this: there is invisible growth happening inside you too.",
        reflection:
          "What invisible growth am I trusting today?",
      },
    },

    deepC: {
      tr: {
        title: "49 · Matrix Derin İfşa",
        story:
          "Sistem 49’u ‘olgunlaşma protokolü’ olarak çalıştırır." + N2 +
          "4 = yapı, 9 = kapanış. 49 = yapının olgunlaşıp döngüyü tamamlaması." + N2 +
          "Gölge test: ‘Neden olmadı?’ diye kendini suçlamak." + NL +
          "Işık test: ‘Ne hazırlanıyor?’ diye anlamı görmek." + N2 +
          "49 sana şunu söyler: Bazı şeyler hızlı gelirse kırılır." + N2 +
          "Bu kapı, dayanıklı sonuç için zamanı kullanmayı öğretir.",
        reflection:
          "Benim acelem hangi şeyi kırıyor olabilir?",
      },
      en: {
        title: "49 · Deep Matrix Reveal",
        story:
          "The system runs 49 as a ‘ripening protocol.’" + N2 +
          "4 = structure, 9 = closure. 49 is structure ripening into completion." + N2 +
          "Shadow test: blaming yourself with ‘why didn’t it happen?’" + NL +
          "Light test: seeing meaning with ‘what is being prepared?’" + N2 +
          "49 says: some things break if they arrive too fast." + N2 +
          "This gate teaches using time to produce durable results.",
        reflection:
          "What might my urgency be breaking?",
      },
    },

    history: {
      tr: {
        title: "49 · Tarih Katmanı",
        story:
          "Muş, ova hafızası taşır: genişlik, emek, mevsim." + N2 +
          "Ova şehirleri şunu öğretir: Büyük şeyler geniş zamanda büyür." + N2 +
          "Tarih katmanı, ‘mevsim bilinci’ dersini bırakır: Ekim, büyüme, hasat." + N2 +
          "Bu katman sana sorar: Şu an hangi mevsimdesin?",
        reflection:
          "Benim mevsimim ne—ve buna saygı duyuyor muyum?",
      },
      en: {
        title: "49 · History Layer",
        story:
          "Mus carries plain-memory: spaciousness, labor, seasons." + N2 +
          "Plains teach: big things grow in wide time." + N2 +
          "This layer leaves ‘season consciousness’: sowing, growing, harvest." + N2 +
          "It asks: which season are you in?",
        reflection:
          "What season am I in—and do I respect it?",
      },
    },

    numerology: {
      tr: {
        title: "49 · Numeroloji",
        story:
          "49 = olgunlaşma / dayanıklı sonuç / sabır." + N2 +
          "49’un gölgesi:" + NL +
          "• kendini kıyaslamak" + NL +
          "• acele etmek" + N2 +
          "49’un ışığı:" + NL +
          "• süreç" + NL +
          "• istikrar" + NL +
          "• doğru zaman" + N2 +
          "Bu kapı sorar: ‘Zamana güveniyor musun?’",
        reflection:
          "Bugün zamana güvenmeyi nasıl seçiyorum?",
      },
      en: {
        title: "49 · Numerology",
        story:
          "49 = ripening / durable result / patience." + N2 +
          "Shadow of 49:" + NL +
          "• comparison" + NL +
          "• rushing" + N2 +
          "Light of 49:" + NL +
          "• process" + NL +
          "• consistency" + NL +
          "• right timing" + N2 +
          "This gate asks: ‘Do you trust time?’",
        reflection:
          "How do I choose to trust time today?",
      },
    },

    symbols: {
      tr: {
        title: "49 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Tohum: görünmeyen çalışma." + NL +
          "• Toprak: sabır." + NL +
          "• Mevsim: ritim." + NL +
          "• Ova: geniş zaman." + N2 +
          "Sembol mesajı: ‘Görünmeyen büyüme gerçektir.’",
        reflection:
          "Ben hangi görünmeyeni küçümsüyorum?",
      },
      en: {
        title: "49 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Seed: invisible work." + NL +
          "• Soil: patience." + NL +
          "• Season: rhythm." + NL +
          "• Plain: wide time." + N2 +
          "Symbol message: ‘Invisible growth is real.’",
        reflection:
          "What invisible thing am I underestimating?",
      },
    },

    ritual: {
      tr: {
        title: "49 · Ritüel",
        story:
          "49 Dakika Ritüeli (Mevsim Yazısı):" + N2 +
          "1) Kağıda yaz: ‘Benim mevsimim…’" + NL +
          "2) Altına yaz: ‘Bu mevsimde yapacağım tek şey…’" + NL +
          "3) 49 nefes al. Son nefeste söyle: ‘Olgunlaşıyor.’" + N2 +
          "Kapanış: ‘Zaman benimle.’",
        reflection:
          "Bugün hangi tek şey yeterli?",
      },
      en: {
        title: "49 · Ritual",
        story:
          "49-Minute Ritual (Season Writing):" + N2 +
          "1) Write: ‘My season is…’" + NL +
          "2) Add: ‘The one thing I do in this season is…’" + NL +
          "3) Take 49 breaths. On the last say: ‘It ripens.’" + N2 +
          "Closing: ‘Time is with me.’",
        reflection:
          "What single thing is enough today?",
      },
    },

    lab: {
      tr: {
        title: "49 · LAB: Ripening Engine",
        story:
          "Kod Gözü: Zaman / Sabır / Dayanıklı Sonuç" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hemen olmazsa değersiz’" + NL +
          "• ‘Geç kaldım’" + N2 +
          "Rewrite:" + NL +
          "• ‘Olgunlaşınca değerli’" + NL +
          "• ‘Zaman benim ortağım’",
        reflection:
          "Tek cümle yaz: Bugün zamanı nasıl ortak ediyorsun?",
      },
      en: {
        title: "49 · LAB: Ripening Engine",
        story:
          "Code Eye: Time / Patience / Durable Result" + N2 +
          "Rule Engine:" + NL +
          "• ‘If it’s not instant, it’s worthless’" + NL +
          "• ‘I’m late’" + N2 +
          "Rewrite:" + NL +
          "• ‘When it ripens, it’s valuable’" + NL +
          "• ‘Time is my partner’",
        reflection:
          "Write one sentence: How do you make time your partner today?",
      },
    },
  },
};
export const CITY_50: Record<CityCode, City7> = {
  "50": {
    city: "Nevsehir",

    base: {
      tr: {
        title: "50 · Saklı Şehir",
        story:
          "Nevşehir bir şehir değil—iç dünyanın saklı şehridir." + N2 +
          "Bu kapı sana şunu öğretir: Görünmeyen yer, zayıf değil; derindir." + N2 +
          "50’nin enerjisi ‘yer altı’ gibi çalışır: saklar, korur, sonra zamanı gelince açar." + N2 +
          "Nevşehir’in mesajı: ‘İçine in, cevabı orada bul.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Dışarıda aradığın şeyin izi içeride yazılıdır.",
        reflection:
          "Bugün içimde hangi saklı odaya iniyorum?",
      },
      en: {
        title: "50 · Hidden City",
        story:
          "Nevsehir is not only a city—it is the hidden city of the inner world." + N2 +
          "This gate teaches: what is unseen is not weak; it is deep." + N2 +
          "50 works like the underground: it stores, protects, then opens when time arrives." + N2 +
          "Nevsehir’s message: ‘Go inward, find the answer there.’" + N2 +
          "Know this: the clue you seek outside is written inside.",
        reflection:
          "Which hidden room within me am I entering today?",
      },
    },

    deepC: {
      tr: {
        title: "50 · Matrix Derin İfşa",
        story:
          "Sistem 50’yi ‘iç yapı protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 0 = alan. 50 = değişim için alan açmak." + N2 +
          "Gölge test: Dışarıda kaçıp durmak, içe inmeyi ertelemek." + NL +
          "Işık test: İç odaya inip kodu çözmek." + N2 +
          "50 sana şunu söyler: Bazı kapılar dışarıda açılmaz; içeride açılır." + N2 +
          "Bu kapı, korkunun sakladığı şeyi güvenle görmeyi öğretir.",
        reflection:
          "Ben hangi gerçeği saklıyorum—ve neden?",
      },
      en: {
        title: "50 · Deep Matrix Reveal",
        story:
          "The system runs 50 as an ‘inner structure protocol.’" + N2 +
          "5 = change, 0 = field. 50 is creating space for change." + N2 +
          "Shadow test: escaping outward and postponing descent." + NL +
          "Light test: entering the inner room and decoding the pattern." + N2 +
          "50 says: some gates don’t open outside; they open inside." + N2 +
          "This gate teaches seeing what fear hides—with safety.",
        reflection:
          "What truth am I hiding—and why?",
      },
    },

    history: {
      tr: {
        title: "50 · Tarih Katmanı",
        story:
          "Nevşehir, yer altı şehirlerinin hafızasını taşır." + N2 +
          "Yer altı şehirleri şunu öğretir: Güvenlik bazen görünmezliktir." + N2 +
          "Tarih katmanı burada bir ders bırakır: İç dünya da bir şehirdir; odaları, kapıları, geçitleri vardır." + N2 +
          "Bu katman, ‘iç mimari’ bilgisini bırakır.",
        reflection:
          "Benim iç şehrimde en çok hangi odada zaman geçiyor?",
      },
      en: {
        title: "50 · History Layer",
        story:
          "Nevsehir carries the memory of underground cities." + N2 +
          "Underground cities teach: safety can be invisibility." + N2 +
          "This layer leaves a lesson: your inner world is also a city—with rooms, doors, passages." + N2 +
          "It leaves the knowledge of inner architecture.",
        reflection:
          "In my inner city, which room do I spend the most time in?",
      },
    },

    numerology: {
      tr: {
        title: "50 · Numeroloji",
        story:
          "50 = değişim için alan / içe dönüş." + N2 +
          "50’nin gölgesi:" + NL +
          "• kaçış" + NL +
          "• yüzeysellik" + N2 +
          "50’nin ışığı:" + NL +
          "• iç keşif" + NL +
          "• cesur yüzleşme" + NL +
          "• sakin dönüşüm" + N2 +
          "Bu kapı sorar: ‘Alan açtın mı?’",
        reflection:
          "Bugün dönüşüm için hangi alanı açıyorum?",
      },
      en: {
        title: "50 · Numerology",
        story:
          "50 = space for change / inward turn." + N2 +
          "Shadow of 50:" + NL +
          "• escape" + NL +
          "• superficial living" + N2 +
          "Light of 50:" + NL +
          "• inner discovery" + NL +
          "• brave facing" + NL +
          "• calm transformation" + N2 +
          "This gate asks: ‘Did you create space?’",
        reflection:
          "What space am I opening for transformation today?",
      },
    },

    symbols: {
      tr: {
        title: "50 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Mağara: iç oda." + NL +
          "• Kapı: geçiş." + NL +
          "• Tünel: bilinç yolu." + NL +
          "• Fener: iç görüş." + N2 +
          "Sembol mesajı: ‘Işığı içerde yak.’",
        reflection:
          "Benim fenerim ne—iç görüşüm nasıl çalışıyor?",
      },
      en: {
        title: "50 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Cave: inner room." + NL +
          "• Door: transition." + NL +
          "• Tunnel: path of consciousness." + NL +
          "• Lantern: inner sight." + N2 +
          "Symbol message: ‘Light the lantern inside.’",
        reflection:
          "What is my lantern—how does my inner sight work?",
      },
    },

    ritual: {
      tr: {
        title: "50 · Ritüel",
        story:
          "50 Dakika Ritüeli (İç Şehir Turu):" + N2 +
          "1) 10 dakika sessiz otur." + NL +
          "2) 20 dakika yaz: ‘İçimde saklı olan…’" + NL +
          "3) 20 dakika tek bir küçük adım planla: ‘Bunu açığa çıkaran adım…’" + N2 +
          "Kapanış: ‘İçimdeki kapıyı açıyorum.’",
        reflection:
          "Bugün hangi kapıyı açıyorum?",
      },
      en: {
        title: "50 · Ritual",
        story:
          "50-Minute Ritual (Inner City Tour):" + N2 +
          "1) Sit silently for 10 minutes." + NL +
          "2) Write for 20 minutes: ‘What is hidden in me…’" + NL +
          "3) Plan one small step for 20 minutes: ‘The step that reveals it…’" + N2 +
          "Closing: ‘I open the inner door.’",
        reflection:
          "Which door am I opening today?",
      },
    },

    lab: {
      tr: {
        title: "50 · LAB: Inner Architecture Engine",
        story:
          "Kod Gözü: İç Dünya / Kapı / Dönüşüm" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Dışarı = çözüm’" + NL +
          "• ‘İçeri = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘İçeri = çözüm’" + NL +
          "• ‘Görmek = özgürlük’",
        reflection:
          "Tek cümle yaz: Bugün içeri dönmeyi nasıl seçiyorsun?",
      },
      en: {
        title: "50 · LAB: Inner Architecture Engine",
        story:
          "Code Eye: Inner World / Door / Transformation" + N2 +
          "Rule Engine:" + NL +
          "• ‘Outside = solution’" + NL +
          "• ‘Inside = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘Inside = solution’" + NL +
          "• ‘Seeing = freedom’",
        reflection:
          "Write one sentence: How do you choose to go inward today?",
      },
    },
  },
};
export const CITY_51: Record<CityCode, City7> = {
  "51": {
    city: "Nigde",

    base: {
      tr: {
        title: "51 · Kaya",
        story:
          "Niğde bir şehir değil—kayanın sade gücüdür." + N2 +
          "Bu kapı sana şunu öğretir: Güç, gösteriş değil; istikrardır." + N2 +
          "51’in enerjisi ‘sessiz ilerleme’ taşır: az konuşur, çok yol alır." + N2 +
          "Niğde’nin mesajı: ‘Duruşunu bozma.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Kayanın gücü sesinde değil, yerinde kalışındadır.",
        reflection:
          "Bugün hangi alanda istikrarlı kalmayı seçiyorum?",
      },
      en: {
        title: "51 · Rock",
        story:
          "Nigde is not only a city—it is the simple power of rock." + N2 +
          "This gate teaches: strength is not show; it is consistency." + N2 +
          "51 carries ‘silent progress’: it speaks little, moves far." + N2 +
          "Nigde’s message: ‘Don’t break your stance.’" + N2 +
          "Know this: a rock’s power is not in its sound, but in its staying.",
        reflection:
          "Where am I choosing to remain consistent today?",
      },
    },

    deepC: {
      tr: {
        title: "51 · Matrix Derin İfşa",
        story:
          "Sistem 51’i ‘istikrar protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 1 = irade. 51 = değişimin içinde iradeyi korumak." + N2 +
          "Gölge test: Sıkılıp yön değiştirmek." + NL +
          "Işık test: Sıkılınca ritim kurmak." + N2 +
          "51 sana şunu söyler: Her gün küçük bir adım, büyük dağları taşır." + N2 +
          "Bu kapı, ‘hemen sonuç’ arzusunu ‘istikrarlı süreç’e çevirir.",
        reflection:
          "Ben bugün hangi küçük adımı her gün yapabilirim?",
      },
      en: {
        title: "51 · Deep Matrix Reveal",
        story:
          "The system runs 51 as a ‘consistency protocol.’" + N2 +
          "5 = change, 1 = will. 51 is preserving will inside change." + N2 +
          "Shadow test: getting bored and switching direction." + NL +
          "Light test: building rhythm when bored." + N2 +
          "51 says: one small daily step can carry whole mountains." + N2 +
          "This gate turns the hunger for ‘instant results’ into ‘steady process.’",
        reflection:
          "What small step can I do daily starting today?",
      },
    },

    history: {
      tr: {
        title: "51 · Tarih Katmanı",
        story:
          "Niğde, taşın ve iç Anadolu’nun sakin gücünü taşır." + N2 +
          "Tarih katmanı şunu öğretir: Merkezde kalan yer, karakter üretir." + N2 +
          "Zor iklim, insanı sertleştirmek zorunda değil; olgunlaştırabilir." + N2 +
          "Bu katman, ‘sessiz dayanıklılık’ dersini bırakır.",
        reflection:
          "Ben hangi koşulda olgunlaşıyorum?",
      },
      en: {
        title: "51 · History Layer",
        story:
          "Nigde carries the calm power of stone and inner Anatolia." + N2 +
          "This layer teaches: what stays central builds character." + N2 +
          "Harsh climate doesn’t have to harden you; it can mature you." + N2 +
          "It leaves the lesson of quiet endurance.",
        reflection:
          "Which condition is maturing me right now?",
      },
    },

    numerology: {
      tr: {
        title: "51 · Numeroloji",
        story:
          "51 = istikrar / irade / sakin güç." + N2 +
          "51’in gölgesi:" + NL +
          "• sabırsızlık" + NL +
          "• dağılma" + N2 +
          "51’in ışığı:" + NL +
          "• disiplin" + NL +
          "• süreklilik" + NL +
          "• net duruş" + N2 +
          "Bu kapı sorar: ‘Bugün vazgeçmeye mi yaklaştın?’",
        reflection:
          "Bugün vazgeçmek yerine neyi seçiyorum?",
      },
      en: {
        title: "51 · Numerology",
        story:
          "51 = consistency / will / calm power." + N2 +
          "Shadow of 51:" + NL +
          "• impatience" + NL +
          "• scattering" + N2 +
          "Light of 51:" + NL +
          "• discipline" + NL +
          "• continuity" + NL +
          "• clear stance" + N2 +
          "This gate asks: ‘Are you close to quitting today?’",
        reflection:
          "What do I choose instead of quitting today?",
      },
    },

    symbols: {
      tr: {
        title: "51 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kaya: yerinde kalmak." + NL +
          "• Patika: küçük adım." + NL +
          "• Çekiç: sabırla şekil." + NL +
          "• Bozkır: sade güç." + N2 +
          "Sembol mesajı: ‘Az ama sürekli.’",
        reflection:
          "Bugün ‘az ama sürekli’ hangi davranışım?",
      },
      en: {
        title: "51 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Rock: staying in place." + NL +
          "• Path: small step." + NL +
          "• Hammer: shaping through patience." + NL +
          "• Steppe: simple power." + N2 +
          "Symbol message: ‘Small but consistent.’",
        reflection:
          "What is my ‘small but consistent’ action today?",
      },
    },

    ritual: {
      tr: {
        title: "51 · Ritüel",
        story:
          "51 Dakika Ritüeli (Günlük Adım):" + N2 +
          "1) Her gün yapacağın 1 küçük şey seç." + NL +
          "2) Onu 51 dakika değil; 5 dakika bile olsa yap." + NL +
          "3) Kağıda yaz: ‘Süreklilik kazandırır.’" + NL +
          "4) 51 nefes al. Son nefeste söyle: ‘İstikrarlıyım.’" + N2 +
          "Kapanış: ‘Kaya gibi.’",
        reflection:
          "Bugün hangi küçük şeyi başlatıyorum?",
      },
      en: {
        title: "51 · Ritual",
        story:
          "51-Minute Ritual (Daily Step):" + N2 +
          "1) Choose one small thing you can do daily." + NL +
          "2) Do it—even 5 minutes counts." + NL +
          "3) Write: ‘Consistency wins.’" + NL +
          "4) Take 51 breaths. On the last say: ‘I am consistent.’" + N2 +
          "Closing: ‘Like rock.’",
        reflection:
          "What small thing am I starting today?",
      },
    },

    lab: {
      tr: {
        title: "51 · LAB: Consistency Engine",
        story:
          "Kod Gözü: İstikrar / Küçük Adım / İrade" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Heves yoksa bırak’" + NL +
          "• ‘Motivasyon = şart’" + N2 +
          "Rewrite:" + NL +
          "• ‘Ritim = şart’" + NL +
          "• ‘Küçük adım = büyük sonuç’",
        reflection:
          "Tek cümle yaz: Bugün ritmini nasıl kuruyorsun?",
      },
      en: {
        title: "51 · LAB: Consistency Engine",
        story:
          "Code Eye: Consistency / Small Step / Will" + N2 +
          "Rule Engine:" + NL +
          "• ‘If no excitement, quit’" + NL +
          "• ‘Motivation is required’" + N2 +
          "Rewrite:" + NL +
          "• ‘Rhythm is required’" + NL +
          "• ‘Small step = big result’",
        reflection:
          "Write one sentence: How do you build your rhythm today?",
      },
    },
  },
};
export const CITY_52: Record<CityCode, City7> = {
  "52": {
    city: "Ordu",

    base: {
      tr: {
        title: "52 · Rüzgâr",
        story:
          "Ordu bir şehir değil—rüzgârla büyüyen berekettir." + N2 +
          "Bu kapı sana şunu öğretir: Bolluk, sadece ürün değil; yönetimdir." + N2 +
          "52’nin enerjisi kıyı gibi çalışır: hem açık hem sınırlı; hem özgür hem düzenli." + N2 +
          "Ordu’nun mesajı: ‘Büyüt ama dağılma.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Bereketi taşımak, kapasite ister.",
        reflection:
          "Bugün bereketimi taşımak için hangi düzeni kuruyorum?",
      },
      en: {
        title: "52 · Wind",
        story:
          "Ordu is not only a city—it is abundance growing with wind." + N2 +
          "This gate teaches: abundance is not only harvest; it is management." + N2 +
          "52 works like the coastline: open yet bounded; free yet organized." + N2 +
          "Ordu’s message: ‘Grow, but don’t scatter.’" + N2 +
          "Know this: carrying abundance requires capacity.",
        reflection:
          "What order am I building today to carry my abundance?",
      },
    },

    deepC: {
      tr: {
        title: "52 · Matrix Derin İfşa",
        story:
          "Sistem 52’yi ‘kapasite protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 2 = denge. 52 = değişimi dengede taşımak." + N2 +
          "Gölge test: Çok şeye açılıp hiçbirini sürdürememek." + NL +
          "Işık test: Doğru şeyi seçip ritim kurmak." + N2 +
          "52 sana şunu söyler: Bereket gelince taşamazsan, bereket kalır." + N2 +
          "Bu kapı, ‘çok’ ile ‘sürdürülebilir’ arasındaki farkı öğretir.",
        reflection:
          "Benim kapasitemi büyüten şey ne: sınır mı, ritim mi?",
      },
      en: {
        title: "52 · Deep Matrix Reveal",
        story:
          "The system runs 52 as a ‘capacity protocol.’" + N2 +
          "5 = change, 2 = balance. 52 is carrying change in balance." + N2 +
          "Shadow test: opening to many things and sustaining none." + NL +
          "Light test: choosing the right thing and building rhythm." + N2 +
          "52 says: if you don’t overflow when abundance arrives, abundance stays." + N2 +
          "This gate teaches the difference between ‘many’ and ‘sustainable.’",
        reflection:
          "What grows my capacity more—boundaries or rhythm?",
      },
    },

    history: {
      tr: {
        title: "52 · Tarih Katmanı",
        story:
          "Ordu, yeşilin ve kıyının hafızasını taşır: rüzgâr, yağmur, ürün." + N2 +
          "Tarih katmanı şunu öğretir: Doğayla uyumlanmak, bereketi korur." + N2 +
          "Her yıl aynı ritim: bakım, büyüme, hasat." + N2 +
          "Bu katman, ‘ritim = bolluk’ dersini bırakır.",
        reflection:
          "Ben hangi ritmi kurarsam bereketim artar?",
      },
      en: {
        title: "52 · History Layer",
        story:
          "Ordu carries the memory of green coasts: wind, rain, harvest." + N2 +
          "This layer teaches: aligning with nature protects abundance." + N2 +
          "The yearly rhythm repeats: care, growth, harvest." + N2 +
          "It leaves the lesson: rhythm becomes abundance.",
        reflection:
          "Which rhythm increases my abundance?",
      },
    },

    numerology: {
      tr: {
        title: "52 · Numeroloji",
        story:
          "52 = yönetim / denge / sürdürülebilir büyüme." + N2 +
          "52’nin gölgesi:" + NL +
          "• dağılma" + NL +
          "• sabırsız genişleme" + N2 +
          "52’nin ışığı:" + NL +
          "• plan" + NL +
          "• kapasite" + NL +
          "• seçici büyüme" + N2 +
          "Bu kapı sorar: ‘Bunu gerçekten taşıyabilir misin?’",
        reflection:
          "Bugün neyi azaltırsam daha iyi taşırım?",
      },
      en: {
        title: "52 · Numerology",
        story:
          "52 = management / balance / sustainable growth." + N2 +
          "Shadow of 52:" + NL +
          "• scattering" + NL +
          "• impatient expansion" + N2 +
          "Light of 52:" + NL +
          "• plan" + NL +
          "• capacity" + NL +
          "• selective growth" + N2 +
          "This gate asks: ‘Can you truly hold this?’",
        reflection:
          "What can I reduce today to carry better?",
      },
    },

    symbols: {
      tr: {
        title: "52 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Rüzgâr: hareket ve değişim." + NL +
          "• Kıyı: sınır ve açıklık." + NL +
          "• Sepet: kapasite." + NL +
          "• Yeşil dal: bereket." + N2 +
          "Sembol mesajı: ‘Büyü, ama dağılma.’",
        reflection:
          "Ben nerede büyürken dağılıyorum?",
      },
      en: {
        title: "52 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Wind: movement and change." + NL +
          "• Shore: boundary and openness." + NL +
          "• Basket: capacity." + NL +
          "• Green branch: abundance." + N2 +
          "Symbol message: ‘Grow, but don’t scatter.’",
        reflection:
          "Where do I scatter while growing?",
      },
    },

    ritual: {
      tr: {
        title: "52 · Ritüel",
        story:
          "52 Dakika Ritüeli (Kapasite Planı):" + N2 +
          "1) Bugün taşıdığın 5 şeyi yaz." + NL +
          "2) 2 tanesini seç: ‘en önemli’." + NL +
          "3) Kalanları 1 hafta ertele." + NL +
          "4) 52 nefes al. Son nefeste söyle: ‘Seçiyorum.’" + N2 +
          "Kapanış: ‘Seçicilik berekettir.’",
        reflection:
          "Bugün hangi iki şeyi seçiyorum?",
      },
      en: {
        title: "52 · Ritual",
        story:
          "52-Minute Ritual (Capacity Plan):" + N2 +
          "1) List 5 things you carry today." + NL +
          "2) Select 2 as ‘most important.’" + NL +
          "3) Delay the rest for one week." + NL +
          "4) Take 52 breaths. On the last say: ‘I choose.’" + N2 +
          "Closing: ‘Selectivity is abundance.’",
        reflection:
          "Which two things am I choosing today?",
      },
    },

    lab: {
      tr: {
        title: "52 · LAB: Capacity Engine",
        story:
          "Kod Gözü: Kapasite / Seçim / Ritim" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Her şey = fırsat’" + NL +
          "• ‘Fırsat kaçarsa biter’" + N2 +
          "Rewrite:" + NL +
          "• ‘Doğru şey = fırsat’" + NL +
          "• ‘Ritim = kalıcılık’",
        reflection:
          "Tek cümle yaz: Bugün ‘her şey’ yerine neyi seçiyorsun?",
      },
      en: {
        title: "52 · LAB: Capacity Engine",
        story:
          "Code Eye: Capacity / Choice / Rhythm" + N2 +
          "Rule Engine:" + NL +
          "• ‘Everything = opportunity’" + NL +
          "• ‘If I miss it, it’s over’" + N2 +
          "Rewrite:" + NL +
          "• ‘The right thing = opportunity’" + NL +
          "• ‘Rhythm = longevity’",
        reflection:
          "Write one sentence: What do you choose instead of ‘everything’ today?",
      },
    },
  },
};
export const CITY_53: Record<CityCode, City7> = {
  "53": {
    city: "Rize",

    base: {
      tr: {
        title: "53 · Yağmur",
        story:
          "Rize bir şehir değil—yağmurun sabırla ürettiği berekettir." + N2 +
          "Bu kapı sana şunu öğretir: Damla damla olan şey kalıcıdır." + N2 +
          "53’ün enerjisi ‘ritim’ taşır: yağmur yağar, toprak emer, çay büyür." + N2 +
          "Rize’nin mesajı: ‘Aceleyi bırak, ritmi seç.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Süreklilik, mucizeye en yakın şeydir.",
        reflection:
          "Bugün hangi şeyi damla damla büyütüyorum?",
      },
      en: {
        title: "53 · Rain",
        story:
          "Rize is not only a city—it is abundance produced by rain through patience." + N2 +
          "This gate teaches: what comes drop by drop lasts." + N2 +
          "53 carries rhythm: rain falls, soil absorbs, tea grows." + N2 +
          "Rize’s message: ‘Drop urgency, choose rhythm.’" + N2 +
          "Know this: consistency is the closest thing to miracle.",
        reflection:
          "What am I growing drop by drop today?",
      },
    },

    deepC: {
      tr: {
        title: "53 · Matrix Derin İfşa",
        story:
          "Sistem 53’ü ‘ritim-protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 3 = yaratım. 53 = değişimi yaratımla yönetmek." + N2 +
          "Gölge test: Hızla isteyip moral bozulunca bırakmak." + NL +
          "Işık test: Yavaş ama her gün yapmak." + N2 +
          "53 sana şunu söyler: Yağmur bir günde sel olur; ama düzenli yağarsa bereket olur." + N2 +
          "Bu kapı, enerjiyi selden berekete çevirir.",
        reflection:
          "Benim enerjim sel mi, bereket mi?",
      },
      en: {
        title: "53 · Deep Matrix Reveal",
        story:
          "The system runs 53 as a ‘rhythm protocol.’" + N2 +
          "5 = change, 3 = creation. 53 is managing change through creation." + N2 +
          "Shadow test: wanting fast and quitting when mood drops." + NL +
          "Light test: doing it slowly but daily." + N2 +
          "53 says: rain in one day becomes a flood; rain over time becomes abundance." + N2 +
          "This gate turns energy from flood into fertile flow.",
        reflection:
          "Is my energy a flood—or fertile flow today?",
      },
    },

    history: {
      tr: {
        title: "53 · Tarih Katmanı",
        story:
          "Rize, emeğin ve doğanın anlaşmasının şehridir." + N2 +
          "Tarih katmanı şunu öğretir: Doğa ile kavga eden yorulur; uyumlanan büyür." + N2 +
          "Çay bir ders taşır: Sabırla toplanır, işlenir, demlenir." + N2 +
          "Bu katman, ‘demlenme’ bilgeliğini bırakır: zaman, tadı açar.",
        reflection:
          "Benim hangi şeyim demleniyor?",
      },
      en: {
        title: "53 · History Layer",
        story:
          "Rize is a city of agreement between nature and labor." + N2 +
          "This layer teaches: fighting nature exhausts you; aligning with it grows you." + N2 +
          "Tea carries a lesson: it is gathered, processed, and brewed with patience." + N2 +
          "It leaves the wisdom of ‘brewing’: time reveals flavor.",
        reflection:
          "What in my life is currently brewing?",
      },
    },

    numerology: {
      tr: {
        title: "53 · Numeroloji",
        story:
          "53 = ritim / üretim / süreklilik." + N2 +
          "53’ün gölgesi:" + NL +
          "• düzensiz enerji" + NL +
          "• sabırsızlık" + N2 +
          "53’ün ışığı:" + NL +
          "• günlük pratik" + NL +
          "• istikrar" + NL +
          "• sabırla büyüme" + N2 +
          "Bu kapı sorar: ‘Her gün ne yapıyorsun?’",
        reflection:
          "Bugün her gün yapacağım küçük şey ne?",
      },
      en: {
        title: "53 · Numerology",
        story:
          "53 = rhythm / production / consistency." + N2 +
          "Shadow of 53:" + NL +
          "• irregular energy" + NL +
          "• impatience" + N2 +
          "Light of 53:" + NL +
          "• daily practice" + NL +
          "• consistency" + NL +
          "• growth through patience" + N2 +
          "This gate asks: ‘What do you do every day?’",
        reflection:
          "What small daily thing will I do today?",
      },
    },

    symbols: {
      tr: {
        title: "53 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Yağmur: bereket ve arınma." + NL +
          "• Çay yaprağı: demlenme." + NL +
          "• Sis: yavaş açılan netlik." + NL +
          "• Damla: küçük adım." + N2 +
          "Sembol mesajı: ‘Damla damla büyürsün.’",
        reflection:
          "Bugün hangi damla benim büyümem?",
      },
      en: {
        title: "53 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Rain: abundance and cleansing." + NL +
          "• Tea leaf: brewing." + NL +
          "• Mist: clarity that opens slowly." + NL +
          "• Drop: small step." + N2 +
          "Symbol message: ‘You grow drop by drop.’",
        reflection:
          "Which drop is my growth today?",
      },
    },

    ritual: {
      tr: {
        title: "53 · Ritüel",
        story:
          "53 Dakika Ritüeli (Demlenme):" + N2 +
          "1) 5 dakika nefesle sakinleş." + NL +
          "2) 3 kelime yaz: ‘Bugün üreteceğim…’" + NL +
          "3) 45 dakika tek bir şeye odaklan." + N2 +
          "Kapanış: ‘Ritimle büyüyorum.’",
        reflection:
          "Bugün tek odak noktam ne?",
      },
      en: {
        title: "53 · Ritual",
        story:
          "53-Minute Ritual (Brewing):" + N2 +
          "1) Calm yourself with breath for 5 minutes." + NL +
          "2) Write 3 words: ‘Today I will produce…’" + NL +
          "3) Focus on one thing for 45 minutes." + N2 +
          "Closing: ‘I grow through rhythm.’",
        reflection:
          "What is my single focus today?",
      },
    },

    lab: {
      tr: {
        title: "53 · LAB: Rhythm Engine",
        story:
          "Kod Gözü: Ritim / Damla / Süreklilik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Heves yoksa yapmam’" + NL +
          "• ‘Hız = başarı’" + N2 +
          "Rewrite:" + NL +
          "• ‘Ritim = başarı’" + NL +
          "• ‘Damla = mucize’",
        reflection:
          "Tek cümle yaz: Bugün ritmini nasıl kuruyorsun?",
      },
      en: {
        title: "53 · LAB: Rhythm Engine",
        story:
          "Code Eye: Rhythm / Drop / Consistency" + N2 +
          "Rule Engine:" + NL +
          "• ‘If no excitement, I won’t do it’" + NL +
          "• ‘Speed = success’" + N2 +
          "Rewrite:" + NL +
          "• ‘Rhythm = success’" + NL +
          "• ‘Drop = miracle’",
        reflection:
          "Write one sentence: How do you build your rhythm today?",
      },
    },
  },
};
export const CITY_54: Record<CityCode, City7> = {
  "54": {
    city: "Sakarya",

    base: {
      tr: {
        title: "54 · Akış",
        story:
          "Sakarya bir şehir değil—akışın yön değiştiren bilgeliğidir." + N2 +
          "Bu kapı sana şunu öğretir: Düz gitmek zorunda değilsin; yön değiştirmek kayıp değildir." + N2 +
          "54’ün enerjisi nehir gibidir: kıvrılır, döner ama denize ulaşır." + N2 +
          "Sakarya’nın mesajı: ‘Yol değişir, hedef kalır.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Esneklik, zayıflık değil; zekâdır.",
        reflection:
          "Bugün hangi yön değişimi aslında beni hedefe yaklaştırıyor?",
      },
      en: {
        title: "54 · Flow",
        story:
          "Sakarya is not only a city—it is the wisdom of a river changing direction." + N2 +
          "This gate teaches: you don’t have to go straight; changing direction is not loss." + N2 +
          "54 works like a river: it bends and turns, yet still reaches the sea." + N2 +
          "Sakarya’s message: ‘The path changes, the destination remains.’" + N2 +
          "Know this: flexibility is not weakness; it is intelligence.",
        reflection:
          "Which change of direction is actually bringing me closer to my goal?",
      },
    },

    deepC: {
      tr: {
        title: "54 · Matrix Derin İfşa",
        story:
          "Sistem 54’ü ‘esneklik protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 4 = yapı. 54 = değişimi yapı içinde yönetmek." + N2 +
          "Gölge test: Değişimi tehdit görmek." + NL +
          "Işık test: Değişimi rota güncellemesi görmek." + N2 +
          "54 sana şunu söyler: Nehir taşlara kızmaz; etrafından akar." + N2 +
          "Bu kapı, direnç yerine yön değiştirmeyi öğretir.",
        reflection:
          "Ben bugün hangi taşa çarpıyorum—ve etrafından akabilir miyim?",
      },
      en: {
        title: "54 · Deep Matrix Reveal",
        story:
          "The system runs 54 as a ‘flexibility protocol.’" + N2 +
          "5 = change, 4 = structure. 54 is managing change within structure." + N2 +
          "Shadow test: seeing change as threat." + NL +
          "Light test: seeing change as route update." + N2 +
          "54 says: the river does not argue with rocks; it flows around them." + N2 +
          "This gate teaches direction instead of resistance.",
        reflection:
          "Which rock am I hitting today—and can I flow around it?",
      },
    },

    history: {
      tr: {
        title: "54 · Tarih Katmanı",
        story:
          "Sakarya, geçişlerin ve dönüşlerin hafızasını taşır." + N2 +
          "Nehir şehirleri şunu öğretir: Hareket durmaz, ama yön değişir." + N2 +
          "Tarih katmanı burada ‘uyum’ dersini bırakır: Ayakta kalmak için bazen kıvrılmak gerekir." + N2 +
          "Bu katman, ‘hareket = yaşam’ bilgisini taşır.",
        reflection:
          "Ben hangi yerde gereksiz direniyorum?",
      },
      en: {
        title: "54 · History Layer",
        story:
          "Sakarya carries the memory of crossings and turns." + N2 +
          "River cities teach: movement never stops, but direction shifts." + N2 +
          "This layer leaves the lesson of adaptation: to stand, sometimes you must bend." + N2 +
          "It carries the knowledge: movement is life.",
        reflection:
          "Where am I resisting unnecessarily?",
      },
    },

    numerology: {
      tr: {
        title: "54 · Numeroloji",
        story:
          "54 = yön değiştirme / uyum / yapı içinde değişim." + N2 +
          "54’ün gölgesi:" + NL +
          "• kontrol takıntısı" + NL +
          "• esneksizlik" + N2 +
          "54’ün ışığı:" + NL +
          "• adaptasyon" + NL +
          "• akış" + NL +
          "• stratejik dönüş" + N2 +
          "Bu kapı sorar: ‘Düz mü, doğru mu?’",
        reflection:
          "Bugün düz gitmek yerine doğruyu nasıl seçiyorum?",
      },
      en: {
        title: "54 · Numerology",
        story:
          "54 = redirection / adaptation / change within structure." + N2 +
          "Shadow of 54:" + NL +
          "• control obsession" + NL +
          "• rigidity" + N2 +
          "Light of 54:" + NL +
          "• adaptation" + NL +
          "• flow" + NL +
          "• strategic turn" + N2 +
          "This gate asks: ‘Straight—or right?’",
        reflection:
          "How do I choose right over straight today?",
      },
    },

    symbols: {
      tr: {
        title: "54 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Nehir: hareket." + NL +
          "• Kıvrım: stratejik dönüş." + NL +
          "• Köprü: geçiş." + NL +
          "• Akıntı: enerji." + N2 +
          "Sembol mesajı: ‘Ak, direnme.’",
        reflection:
          "Ben nerede akmak yerine itiyorum?",
      },
      en: {
        title: "54 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• River: movement." + NL +
          "• Bend: strategic turn." + NL +
          "• Bridge: transition." + NL +
          "• Current: energy." + N2 +
          "Symbol message: ‘Flow, don’t force.’",
        reflection:
          "Where am I forcing instead of flowing?",
      },
    },

    ritual: {
      tr: {
        title: "54 · Ritüel",
        story:
          "54 Dakika Ritüeli (Rota Güncellemesi):" + N2 +
          "1) Bir hedef yaz." + NL +
          "2) Altına iki yol yaz: ‘Eski rota’ ve ‘Yeni rota’." + NL +
          "3) Yeni rota için 3 küçük adım yaz." + NL +
          "4) 54 nefes al. Son nefeste söyle: ‘Yön değiştiriyorum.’" + N2 +
          "Kapanış: ‘Akıştayım.’",
        reflection:
          "Bugün hangi küçük rota değişikliğini yapıyorum?",
      },
      en: {
        title: "54 · Ritual",
        story:
          "54-Minute Ritual (Route Update):" + N2 +
          "1) Write one goal." + NL +
          "2) Under it write two paths: ‘Old route’ and ‘New route.’" + NL +
          "3) Write 3 small steps for the new route." + NL +
          "4) Take 54 breaths. On the last say: ‘I redirect.’" + N2 +
          "Closing: ‘I am in flow.’",
        reflection:
          "Which small route update am I making today?",
      },
    },

    lab: {
      tr: {
        title: "54 · LAB: Flow Engine",
        story:
          "Kod Gözü: Yön / Esneklik / Akış" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Plan değişmez’" + NL +
          "• ‘Yön değişirse başarısızım’" + N2 +
          "Rewrite:" + NL +
          "• ‘Plan güncellenir’" + NL +
          "• ‘Yön değişimi = zekâ’",
        reflection:
          "Tek cümle yaz: Bugün hangi esnekliği seçiyorsun?",
      },
      en: {
        title: "54 · LAB: Flow Engine",
        story:
          "Code Eye: Direction / Flexibility / Flow" + N2 +
          "Rule Engine:" + NL +
          "• ‘The plan must not change’" + NL +
          "• ‘If I redirect, I failed’" + N2 +
          "Rewrite:" + NL +
          "• ‘Plans update’" + NL +
          "• ‘Redirection = intelligence’",
        reflection:
          "Write one sentence: What flexibility are you choosing today?",
      },
    },
  },
};
export const CITY_55: Record<CityCode, City7> = {
  "55": {
    city: "Samsun",

    base: {
      tr: {
        title: "55 · Başlangıç",
        story:
          "Samsun bir şehir değil—başlangıcın kıyısıdır." + N2 +
          "Bu kapı sana şunu öğretir: Yeni sayfa açmak için önce eski sayfayı kapatman gerekmez; yeni cümleyi yazman yeter." + N2 +
          "55’in enerjisi ‘yeniden başlat’ gibidir: cesaret verir, hareket ettirir." + N2 +
          "Samsun’un mesajı: ‘Başla.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Başlangıç, mükemmel olunca değil; karar verince olur.",
        reflection:
          "Bugün hangi yeni cümleyi yazıyorum?",
      },
      en: {
        title: "55 · Beginning",
        story:
          "Samsun is not only a city—it is the shore of beginning." + N2 +
          "This gate teaches: you don’t need to fully close the old page to open a new one; you only need to write the new sentence." + N2 +
          "55 works like a restart: it gives courage and initiates movement." + N2 +
          "Samsun’s message: ‘Begin.’" + N2 +
          "Know this: a beginning happens not when it’s perfect, but when you decide.",
        reflection:
          "What new sentence am I writing today?",
      },
    },

    deepC: {
      tr: {
        title: "55 · Matrix Derin İfşa",
        story:
          "Sistem 55’i ‘reset protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim. 55 = değişimin iki kat hızlanması." + N2 +
          "Gölge test: Değişimi kaosa çevirmek." + NL +
          "Işık test: Değişimi yönlendirmek." + N2 +
          "55 sana şunu söyler: Enerji yükselince disiplin şart olur." + N2 +
          "Bu kapı, hız verir ama direksiyonu da ister: niyet, plan, adım.",
        reflection:
          "Benim reset niyetim ne—ve ilk adımım ne?",
      },
      en: {
        title: "55 · Deep Matrix Reveal",
        story:
          "The system runs 55 as a ‘reset protocol.’" + N2 +
          "5 = change. 55 doubles the speed of change." + N2 +
          "Shadow test: turning change into chaos." + NL +
          "Light test: directing change." + N2 +
          "55 says: when energy rises, discipline becomes necessary." + N2 +
          "This gate gives speed but demands a steering wheel: intention, plan, step.",
        reflection:
          "What is my reset intention—and what is my first step?",
      },
    },

    history: {
      tr: {
        title: "55 · Tarih Katmanı",
        story:
          "Samsun, başlangıç hafızası taşır: ‘ilk adım’ bilinci." + N2 +
          "Kıyı şehirleri şunu öğretir: Yolculuk, ufka bakmakla başlar." + N2 +
          "Tarih katmanı, ‘başlamak = kaderi değiştirmek’ dersini bırakır." + N2 +
          "Bir adım, bir ülkenin kaderini bile değiştirebilir; insanınkini de.",
        reflection:
          "Benim ilk adımım ne?",
      },
      en: {
        title: "55 · History Layer",
        story:
          "Samsun carries the memory of beginning: the consciousness of the first step." + N2 +
          "Coastal cities teach: journeys begin by looking at the horizon." + N2 +
          "This layer leaves the lesson: beginning changes destiny." + N2 +
          "One step can change a nation’s fate—and yours too.",
        reflection:
          "What is my first step?",
      },
    },

    numerology: {
      tr: {
        title: "55 · Numeroloji",
        story:
          "55 = büyük değişim / reset / yeni yön." + N2 +
          "55’in gölgesi:" + NL +
          "• dağılmak" + NL +
          "• sabırsızlık" + N2 +
          "55’in ışığı:" + NL +
          "• cesaret" + NL +
          "• hareket" + NL +
          "• net başlangıç" + N2 +
          "Bu kapı sorar: ‘Başlamak için neyi bekliyorsun?’",
        reflection:
          "Ben neyi bekliyorum ki başlamıyorum?",
      },
      en: {
        title: "55 · Numerology",
        story:
          "55 = major change / reset / new direction." + N2 +
          "Shadow of 55:" + NL +
          "• scattering" + NL +
          "• impatience" + N2 +
          "Light of 55:" + NL +
          "• courage" + NL +
          "• movement" + NL +
          "• clear start" + N2 +
          "This gate asks: ‘What are you waiting for to begin?’",
        reflection:
          "What am I waiting for that keeps me from starting?",
      },
    },

    symbols: {
      tr: {
        title: "55 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Ufuk: yeni yol." + NL +
          "• İlk adım: başlangıç." + NL +
          "• Gemi: yolculuk." + NL +
          "• 55 kıvılcım: hızlanan değişim." + N2 +
          "Sembol mesajı: ‘Başla, yol açılır.’",
        reflection:
          "Bugün hangi ufka yürüyorum?",
      },
      en: {
        title: "55 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Horizon: new path." + NL +
          "• First step: beginning." + NL +
          "• Ship: journey." + NL +
          "• 55 sparks: accelerated change." + N2 +
          "Symbol message: ‘Begin, and the path opens.’",
        reflection:
          "Which horizon am I walking toward today?",
      },
    },

    ritual: {
      tr: {
        title: "55 · Ritüel",
        story:
          "55 Dakika Ritüeli (Başlat):" + N2 +
          "1) 5 dakika niyet yaz." + NL +
          "2) 5 dakika ilk adımı seç." + NL +
          "3) 45 dakika o adımı uygula." + N2 +
          "Kapanış: ‘Başladım.’",
        reflection:
          "Bugün hangi adımı gerçekten atıyorum?",
      },
      en: {
        title: "55 · Ritual",
        story:
          "55-Minute Ritual (Start):" + N2 +
          "1) Write intention for 5 minutes." + NL +
          "2) Choose the first step for 5 minutes." + NL +
          "3) Do that step for 45 minutes." + N2 +
          "Closing: ‘I began.’",
        reflection:
          "Which step am I truly taking today?",
      },
    },

    lab: {
      tr: {
        title: "55 · LAB: Reset Engine",
        story:
          "Kod Gözü: Başlangıç / Hız / Niyet" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hazır olunca başlarım’" + NL +
          "• ‘Mükemmel olmalı’" + N2 +
          "Rewrite:" + NL +
          "• ‘Başlayınca hazır olurum’" + NL +
          "• ‘İlk adım = yeter’",
        reflection:
          "Tek cümle yaz: Bugün ‘hazır’ olmadan nasıl başlıyorsun?",
      },
      en: {
        title: "55 · LAB: Reset Engine",
        story:
          "Code Eye: Beginning / Speed / Intention" + N2 +
          "Rule Engine:" + NL +
          "• ‘I’ll start when I’m ready’" + NL +
          "• ‘It must be perfect’" + N2 +
          "Rewrite:" + NL +
          "• ‘I become ready by starting’" + NL +
          "• ‘First step is enough’",
        reflection:
          "Write one sentence: How will you start without ‘ready’ today?",
      },
    },
  },
};
export const CITY_56: Record<CityCode, City7> = {
  "56": {
    city: "Siirt",

    base: {
      tr: {
        title: "56 · Gizli Bereket",
        story:
          "Siirt bir şehir değil—gizli bereketin çekirdeğidir." + N2 +
          "Bu kapı sana şunu öğretir: Değer bazen görünmez yerde büyür." + N2 +
          "56’nın enerjisi ‘içte olgunlaşma’ taşır: dışarı sessiz, içeride güçlü." + N2 +
          "Siirt’in mesajı: ‘Gizli büyümeyi küçümseme.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Senin içinde de kimsenin görmediği bir güç büyüyor olabilir.",
        reflection:
          "Bugün içimde hangi gizli gücü kabul ediyorum?",
      },
      en: {
        title: "56 · Hidden Abundance",
        story:
          "Siirt is not only a city—it is the seed of hidden abundance." + N2 +
          "This gate teaches: value often grows in unseen places." + N2 +
          "56 carries ‘inner ripening’: quiet outside, strong inside." + N2 +
          "Siirt’s message: ‘Don’t underestimate hidden growth.’" + N2 +
          "Know this: a strength nobody sees might be growing inside you.",
        reflection:
          "Which hidden strength am I acknowledging today?",
      },
    },

    deepC: {
      tr: {
        title: "56 · Matrix Derin İfşa",
        story:
          "Sistem 56’yı ‘iç disiplin protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 6 = sorumluluk. 56 = değişimi sorumlulukla taşımak." + N2 +
          "Gölge test: Kendini küçümseyip görünür olmaktan kaçmak." + NL +
          "Işık test: Gücü içeride büyütüp zamanı gelince görünür olmak." + N2 +
          "56 sana şunu söyler: Görünürlük bir hedef değil; sonuçtur." + N2 +
          "Bu kapı, ‘iç hazırlık’ yapar. Hazır olunca ışık zaten gelir.",
        reflection:
          "Ben görünür olmaktan neden kaçıyorum?",
      },
      en: {
        title: "56 · Deep Matrix Reveal",
        story:
          "The system runs 56 as an ‘inner discipline protocol.’" + N2 +
          "5 = change, 6 = responsibility. 56 is carrying change with responsibility." + N2 +
          "Shadow test: minimizing yourself and avoiding visibility." + NL +
          "Light test: growing power inside and becoming visible when time is right." + N2 +
          "56 says: visibility is not the goal; it is the outcome." + N2 +
          "This gate builds inner readiness. When you are ready, light arrives naturally.",
        reflection:
          "Why am I avoiding visibility today?",
      },
    },

    history: {
      tr: {
        title: "56 · Tarih Katmanı",
        story:
          "Siirt, saklı ürünün ve sabırlı emeğin hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Bazı bereketler görünür olmadan önce yıllarca kökte hazırlanır." + N2 +
          "Bu katman, ‘hazırlık’ dersini bırakır: kök kur, sonra meyve gelir." + N2 +
          "Sessiz emek, en kalıcı bereketi üretir.",
        reflection:
          "Ben hangi hazırlığı sabırla yapıyorum?",
      },
      en: {
        title: "56 · History Layer",
        story:
          "Siirt carries the memory of hidden crops and patient labor." + N2 +
          "This layer teaches: some abundance prepares at the root for years before it becomes visible." + N2 +
          "It leaves the lesson of preparation: build roots, then fruit arrives." + N2 +
          "Quiet labor produces the most lasting abundance.",
        reflection:
          "What preparation am I patiently doing today?",
      },
    },

    numerology: {
      tr: {
        title: "56 · Numeroloji",
        story:
          "56 = iç disiplin / gizli güç / olgunlaşma." + N2 +
          "56’nın gölgesi:" + NL +
          "• kendini küçümseme" + NL +
          "• erteleme" + N2 +
          "56’nın ışığı:" + NL +
          "• iç hazırlık" + NL +
          "• sorumluluk" + NL +
          "• doğru zamanda görünürlük" + N2 +
          "Bu kapı sorar: ‘Hazır mısın?’",
        reflection:
          "Bugün ‘hazır’ olmak için hangi küçük adımı atıyorum?",
      },
      en: {
        title: "56 · Numerology",
        story:
          "56 = inner discipline / hidden power / ripening." + N2 +
          "Shadow of 56:" + NL +
          "• self-minimizing" + NL +
          "• procrastination" + N2 +
          "Light of 56:" + NL +
          "• inner preparation" + NL +
          "• responsibility" + NL +
          "• visibility at the right time" + N2 +
          "This gate asks: ‘Are you ready?’",
        reflection:
          "What small step makes me ‘ready’ today?",
      },
    },

    symbols: {
      tr: {
        title: "56 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Fıstık/çekirdek: gizli bereket." + NL +
          "• Kabuk: korunma." + NL +
          "• Kök: hazırlık." + NL +
          "• Sessiz oda: iç güç." + N2 +
          "Sembol mesajı: ‘Kabuk kırılınca bereket görünür.’",
        reflection:
          "Ben hangi kabuğu kırmaya hazırım?",
      },
      en: {
        title: "56 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Pistachio/seed: hidden abundance." + NL +
          "• Shell: protection." + NL +
          "• Root: preparation." + NL +
          "• Quiet room: inner power." + N2 +
          "Symbol message: ‘When the shell breaks, abundance appears.’",
        reflection:
          "Which shell am I ready to break?",
      },
    },

    ritual: {
      tr: {
        title: "56 · Ritüel",
        story:
          "56 Dakika Ritüeli (İç Hazırlık):" + N2 +
          "1) Bugün görünür olmak istediğin alanı yaz." + NL +
          "2) Onun için 5 küçük hazırlık adımı yaz." + NL +
          "3) 56 nefes al. Son nefeste söyle: ‘Hazırlanıyorum.’" + N2 +
          "Kapanış: ‘Zamanım geldiğinde görünür olacağım.’",
        reflection:
          "Bugün hangi hazırlığı yapıyorum?",
      },
      en: {
        title: "56 · Ritual",
        story:
          "56-Minute Ritual (Inner Preparation):" + N2 +
          "1) Write the area where you want to become visible." + NL +
          "2) Write 5 small preparation steps." + NL +
          "3) Take 56 breaths. On the last say: ‘I prepare.’" + N2 +
          "Closing: ‘When my time comes, I will be visible.’",
        reflection:
          "What preparation am I doing today?",
      },
    },

    lab: {
      tr: {
        title: "56 · LAB: Hidden Power Engine",
        story:
          "Kod Gözü: Hazırlık / Gizli Güç / Zaman" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Görünür olursam yargılanırım’" + NL +
          "• ‘Yargı = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Hazırlık = güven’" + NL +
          "• ‘Görünürlük = sonuç’",
        reflection:
          "Tek cümle yaz: Bugün hazırlığı nasıl güvene çeviriyorsun?",
      },
      en: {
        title: "56 · LAB: Hidden Power Engine",
        story:
          "Code Eye: Preparation / Hidden Power / Timing" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I’m visible, I’ll be judged’" + NL +
          "• ‘Judgment = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘Preparation = safety’" + NL +
          "• ‘Visibility = outcome’",
        reflection:
          "Write one sentence: How do you turn preparation into safety today?",
      },
    },
  },
};
export const CITY_57: Record<CityCode, City7> = {
  "57": {
    city: "Sinop",

    base: {
      tr: {
        title: "57 · İnziva",
        story:
          "Sinop bir şehir değil—inzivanın uç noktasıdır." + N2 +
          "Bu kapı sana şunu öğretir: Uç noktada netlik vardır; gürültü azalır, iç ses yükselir." + N2 +
          "57’nin enerjisi ‘yalnız kıyı’ gibidir: sakin, derin, keskin." + N2 +
          "Sinop’un mesajı: ‘Azalt ki gör.’" + N2 +
          "Bu kapıdan geçerken şunu bil: İnziva kaçış değil; görüş açısıdır.",
        reflection:
          "Bugün hangi gürültüyü azaltırsam netleşirim?",
      },
      en: {
        title: "57 · Retreat",
        story:
          "Sinop is not only a city—it is the edge-point of retreat." + N2 +
          "This gate teaches: at the edge there is clarity; noise drops, inner voice rises." + N2 +
          "57 feels like a solitary coast: calm, deep, sharp." + N2 +
          "Sinop’s message: ‘Reduce to see.’" + N2 +
          "Know this: retreat is not escape; it is perspective.",
        reflection:
          "What noise can I reduce today to become clear?",
      },
    },

    deepC: {
      tr: {
        title: "57 · Matrix Derin İfşa",
        story:
          "Sistem 57’yi ‘net görüş protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 7 = iç görüş. 57 = değişimi iç görüşle yönetmek." + N2 +
          "Gölge test: Yalnızlığı karanlığa çevirmek." + NL +
          "Işık test: Yalnızlığı netliğe çevirmek." + N2 +
          "57 sana şunu söyler: Kalabalıkta karar bulanık olur; yalnızlıkta karar keskinleşir." + N2 +
          "Bu kapı, iç pusulayı açar: doğru yön, sessizlikte görünür.",
        reflection:
          "Benim iç pusulam bugün neyi gösteriyor?",
      },
      en: {
        title: "57 · Deep Matrix Reveal",
        story:
          "The system runs 57 as a ‘clear vision protocol.’" + N2 +
          "5 = change, 7 = inner sight. 57 is managing change through inner sight." + N2 +
          "Shadow test: turning solitude into darkness." + NL +
          "Light test: turning solitude into clarity." + N2 +
          "57 says: in crowds decisions blur; in solitude decisions sharpen." + N2 +
          "This gate activates the inner compass: right direction appears in silence.",
        reflection:
          "What does my inner compass point to today?",
      },
    },

    history: {
      tr: {
        title: "57 · Tarih Katmanı",
        story:
          "Sinop, uç nokta hafızası taşır: kıyı, rüzgâr, yalnızlık." + N2 +
          "Uç şehirler şunu öğretir: Dünya burada biter gibi görünür; aslında görüş burada başlar." + N2 +
          "Tarih katmanı, ‘uç = netlik’ dersini bırakır." + N2 +
          "Bazı kararlar, merkezde değil; uçta alınır.",
        reflection:
          "Ben kararımı nerede daha net alıyorum?",
      },
      en: {
        title: "57 · History Layer",
        story:
          "Sinop carries edge-memory: coast, wind, solitude." + N2 +
          "Edge cities teach: it looks like the world ends here—yet vision begins here." + N2 +
          "This layer leaves the lesson: edge equals clarity." + N2 +
          "Some decisions are made not in the center, but at the edge.",
        reflection:
          "Where do I make my clearest decisions?",
      },
    },

    numerology: {
      tr: {
        title: "57 · Numeroloji",
        story:
          "57 = iç görüş / netlik / yön." + N2 +
          "57’nin gölgesi:" + NL +
          "• içine kapanıp kararmak" + NL +
          "• kaçış" + N2 +
          "57’nin ışığı:" + NL +
          "• bilge yalnızlık" + NL +
          "• net karar" + NL +
          "• iç pusula" + N2 +
          "Bu kapı sorar: ‘Ne istiyorsun?’",
        reflection:
          "Bugün gerçekten ne istiyorum?",
      },
      en: {
        title: "57 · Numerology",
        story:
          "57 = inner sight / clarity / direction." + N2 +
          "Shadow of 57:" + NL +
          "• withdrawing into darkness" + NL +
          "• escape" + N2 +
          "Light of 57:" + NL +
          "• wise solitude" + NL +
          "• clear decision" + NL +
          "• inner compass" + N2 +
          "This gate asks: ‘What do you want?’",
        reflection:
          "What do I truly want today?",
      },
    },

    symbols: {
      tr: {
        title: "57 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Burun (uç): son nokta, net görüş." + NL +
          "• Fener: yön." + NL +
          "• Rüzgâr: temizleme." + NL +
          "• Kıyı: sınır." + N2 +
          "Sembol mesajı: ‘Uca git, netleş.’",
        reflection:
          "Bugün hangi konuda uca gidip netleşmeliyim?",
      },
      en: {
        title: "57 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Cape/edge: endpoint, clear sight." + NL +
          "• Lighthouse: direction." + NL +
          "• Wind: cleansing." + NL +
          "• Shore: boundary." + N2 +
          "Symbol message: ‘Go to the edge, become clear.’",
        reflection:
          "Where do I need to go to the edge to gain clarity today?",
      },
    },

    ritual: {
      tr: {
        title: "57 · Ritüel",
        story:
          "57 Dakika Ritüeli (Sessiz Görüş):" + N2 +
          "1) 10 dakika sessiz kal." + NL +
          "2) 20 dakika yaz: ‘İç pusulam…’" + NL +
          "3) 27 dakika tek bir karar cümlesi üret: ‘Seçiyorum…’" + N2 +
          "Kapanış: ‘Netim.’",
        reflection:
          "Bugün hangi seçimi netleştiriyorum?",
      },
      en: {
        title: "57 · Ritual",
        story:
          "57-Minute Ritual (Silent Vision):" + N2 +
          "1) Stay silent for 10 minutes." + NL +
          "2) Write for 20 minutes: ‘My inner compass…’" + NL +
          "3) For 27 minutes craft one decision sentence: ‘I choose…’" + N2 +
          "Closing: ‘I am clear.’",
        reflection:
          "Which choice am I clarifying today?",
      },
    },

    lab: {
      tr: {
        title: "57 · LAB: Clarity Engine",
        story:
          "Kod Gözü: Netlik / Yön / Sessizlik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Sessizlik = yalnızlık’" + NL +
          "• ‘Yalnızlık = zayıflık’" + N2 +
          "Rewrite:" + NL +
          "• ‘Sessizlik = görüş’" + NL +
          "• ‘Görüş = güç’",
        reflection:
          "Tek cümle yaz: Bugün sessizliği nasıl güce çeviriyorsun?",
      },
      en: {
        title: "57 · LAB: Clarity Engine",
        story:
          "Code Eye: Clarity / Direction / Silence" + N2 +
          "Rule Engine:" + NL +
          "• ‘Silence = loneliness’" + NL +
          "• ‘Loneliness = weakness’" + N2 +
          "Rewrite:" + NL +
          "• ‘Silence = vision’" + NL +
          "• ‘Vision = power’",
        reflection:
          "Write one sentence: How do you turn silence into power today?",
      },
    },
  },
};
export const CITY_58: Record<CityCode, City7> = {
  "58": {
    city: "Sivas",

    base: {
      tr: {
        title: "58 · Derin Dayan",
        story:
          "Sivas bir şehir değil—bozkırın derin dayanıklılığıdır." + N2 +
          "Bu kapı sana şunu öğretir: Güç, gösteriş değil; uzun vadeli sadakattir." + N2 +
          "58’in enerjisi ‘soğukta bile yürüyen’ bir irade taşır: sessiz, net, sağlam." + N2 +
          "Sivas’ın mesajı: ‘Kısa parlamalar değil, uzun yürüyüşler.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Dayanıklılık, iç karakterin inşasıdır.",
        reflection:
          "Bugün uzun vadeli hangi seçimi yapıyorum?",
      },
      en: {
        title: "58 · Endure Deeply",
        story:
          "Sivas is not only a city—it is the deep resilience of the steppe." + N2 +
          "This gate teaches: strength is not show; it is long-term loyalty." + N2 +
          "58 carries a will that walks even in cold: quiet, clear, solid." + N2 +
          "Sivas’s message: ‘Not short flashes—long walks.’" + N2 +
          "Know this: resilience is the construction of inner character.",
        reflection:
          "What long-term choice am I making today?",
      },
    },

    deepC: {
      tr: {
        title: "58 · Matrix Derin İfşa",
        story:
          "Sistem 58’i ‘istikrar-güç protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 8 = güç. 58 = değişim içinde gücü korumak." + N2 +
          "Gölge test: Zorlukta dağılıp yön kaybetmek." + NL +
          "Işık test: Zorlukta netleşip ritim kurmak." + N2 +
          "58 sana şunu söyler: Dayanıklılık bir anlık motivasyon değil; bir ritimdir." + N2 +
          "Bu kapı, ‘heves’e değil ‘karar’a dayanır.",
        reflection:
          "Ben bugün hevesle mi, kararla mı yürüyorum?",
      },
      en: {
        title: "58 · Deep Matrix Reveal",
        story:
          "The system runs 58 as a ‘stability-power protocol.’" + N2 +
          "5 = change, 8 = power. 58 is keeping power inside change." + N2 +
          "Shadow test: scattering and losing direction under hardship." + NL +
          "Light test: clarifying and building rhythm under hardship." + N2 +
          "58 says: resilience is not temporary motivation; it is rhythm." + N2 +
          "This gate is built on decision, not hype.",
        reflection:
          "Am I walking today with hype—or with decision?",
      },
    },

    history: {
      tr: {
        title: "58 · Tarih Katmanı",
        story:
          "Sivas, iç Anadolu’nun soğuk sabrını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Merkezde olmak, rüzgârı çok almak demektir; ama rüzgâr karakteri güçlendirir." + N2 +
          "Bu katman, ‘rüzgâr = eğitim’ dersini bırakır." + N2 +
          "Zor şartlar, sağlam insan üretir.",
        reflection:
          "Benim rüzgârım ne—bana ne öğretiyor?",
      },
      en: {
        title: "58 · History Layer",
        story:
          "Sivas carries the cold patience of inner Anatolia." + N2 +
          "This layer teaches: being central means taking more wind—yet wind strengthens character." + N2 +
          "It leaves the lesson: wind is training." + N2 +
          "Hard conditions produce solid humans.",
        reflection:
          "What is my wind—and what is it teaching me?",
      },
    },

    numerology: {
      tr: {
        title: "58 · Numeroloji",
        story:
          "58 = dayanıklılık / güç / kararlı yürüyüş." + N2 +
          "58’in gölgesi:" + NL +
          "• sabırsızlık" + NL +
          "• ‘bırakayım’ dürtüsü" + N2 +
          "58’in ışığı:" + NL +
          "• kararlılık" + NL +
          "• ritim" + NL +
          "• sağlam sonuç" + N2 +
          "Bu kapı sorar: ‘Bir ay sonra da aynı şeyi yapacak mısın?’",
        reflection:
          "Bugün hangi alışkanlığı uzun yürüyüşe çeviriyorum?",
      },
      en: {
        title: "58 · Numerology",
        story:
          "58 = resilience / power / steady walk." + N2 +
          "Shadow of 58:" + NL +
          "• impatience" + NL +
          "• the impulse to quit" + N2 +
          "Light of 58:" + NL +
          "• determination" + NL +
          "• rhythm" + NL +
          "• solid results" + N2 +
          "This gate asks: ‘Will you still do it one month from now?’",
        reflection:
          "Which habit am I turning into a long walk today?",
      },
    },

    symbols: {
      tr: {
        title: "58 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Bozkır: sade güç." + NL +
          "• Kış: netlik." + NL +
          "• Yol: uzun yürüyüş." + NL +
          "• Taş: kalıcılık." + N2 +
          "Sembol mesajı: ‘Az ama uzun.’",
        reflection:
          "Bugün ‘az ama uzun’ hangi seçimim?",
      },
      en: {
        title: "58 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Steppe: simple power." + NL +
          "• Winter: clarity." + NL +
          "• Road: long walk." + NL +
          "• Stone: permanence." + N2 +
          "Symbol message: ‘Small but long.’",
        reflection:
          "What is my ‘small but long’ choice today?",
      },
    },

    ritual: {
      tr: {
        title: "58 · Ritüel",
        story:
          "58 Dakika Ritüeli (Uzun Yürüyüş Sözü):" + N2 +
          "1) Bugün sürdüreceğin 1 alışkanlık seç." + NL +
          "2) 58 nefes al. Her 10 nefeste içinden söyle: ‘Yürüyorum.’" + NL +
          "3) Bir cümle yaz: ‘Benim uzun yürüyüşüm…’" + N2 +
          "Kapanış: ‘Kararım ritmim.’",
        reflection:
          "Bugün hangi kararı ritme çeviriyorum?",
      },
      en: {
        title: "58 · Ritual",
        story:
          "58-Minute Ritual (Long Walk Vow):" + N2 +
          "1) Choose one habit you will sustain." + NL +
          "2) Take 58 breaths. Every 10 breaths say inwardly: ‘I walk.’" + NL +
          "3) Write one line: ‘My long walk is…’" + N2 +
          "Closing: ‘My decision is my rhythm.’",
        reflection:
          "Which decision am I turning into rhythm today?",
      },
    },

    lab: {
      tr: {
        title: "58 · LAB: Endurance Engine",
        story:
          "Kod Gözü: Dayanıklılık / Ritim / Karar" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Motivasyon yoksa olmaz’" + NL +
          "• ‘Zorluk = dur’" + N2 +
          "Rewrite:" + NL +
          "• ‘Karar = yürütür’" + NL +
          "• ‘Zorluk = güçlendirir’",
        reflection:
          "Tek cümle yaz: Bugün zorluğu nasıl güce çeviriyorsun?",
      },
      en: {
        title: "58 · LAB: Endurance Engine",
        story:
          "Code Eye: Resilience / Rhythm / Decision" + N2 +
          "Rule Engine:" + NL +
          "• ‘If no motivation, it won’t work’" + NL +
          "• ‘Hard = stop’" + N2 +
          "Rewrite:" + NL +
          "• ‘Decision carries me’" + NL +
          "• ‘Hard strengthens me’",
        reflection:
          "Write one sentence: How do you turn hardship into strength today?",
      },
    },
  },
};
export const CITY_59: Record<CityCode, City7> = {
  "59": {
    city: "Tekirdag",

    base: {
      tr: {
        title: "59 · Keyifli Üretim",
        story:
          "Tekirdağ bir şehir değil—keyfin üretime karıştığı rüzgârdır." + N2 +
          "Bu kapı sana şunu öğretir: Sosyal olmak da bir akıştır; doğru akış bereket getirir." + N2 +
          "59’un enerjisi ‘deniz + bağ’ gibidir: hem hafif hem verimli." + N2 +
          "Tekirdağ’ın mesajı: ‘Üret, ama nefes al.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Bereket sadece çalışmakla değil, yaşamayı bilmekle gelir.",
        reflection:
          "Bugün üretim ile keyfi nasıl dengeliyorum?",
      },
      en: {
        title: "59 · Joyful Production",
        story:
          "Tekirdag is not only a city—it is the wind where joy mixes with production." + N2 +
          "This gate teaches: being social is also a flow; the right flow brings abundance." + N2 +
          "59 feels like ‘sea + vineyard’: light yet productive." + N2 +
          "Tekirdag’s message: ‘Produce, but breathe.’" + N2 +
          "Know this: abundance comes not only from work, but from knowing how to live.",
        reflection:
          "How do I balance production and joy today?",
      },
    },

    deepC: {
      tr: {
        title: "59 · Matrix Derin İfşa",
        story:
          "Sistem 59’u ‘denge-kapanış protokolü’ olarak çalıştırır." + N2 +
          "5 = değişim, 9 = kapanış. 59 = değişimi tamamlayıp hafiflemek." + N2 +
          "Gölge test: Keyfi suçlulukla sabote etmek." + NL +
          "Işık test: Keyfi bilinçle hak etmek." + N2 +
          "59 sana şunu söyler: Keyif, ödül değil; iyi kurulmuş bir hayatın doğal sonucudur." + N2 +
          "Bu kapı, çalışmanın içine ‘yaşam’ı geri koyar.",
        reflection:
          "Ben keyfi neden suçlulukla kesiyorum?",
      },
      en: {
        title: "59 · Deep Matrix Reveal",
        story:
          "The system runs 59 as a ‘balance-closure protocol.’" + N2 +
          "5 = change, 9 = closure. 59 is completing change and lightening." + N2 +
          "Shadow test: sabotaging joy with guilt." + NL +
          "Light test: earning joy through consciousness." + N2 +
          "59 says: joy is not a prize; it is the natural result of a well-built life." + N2 +
          "This gate puts life back inside work.",
        reflection:
          "Why do I cut joy with guilt?",
      },
    },

    history: {
      tr: {
        title: "59 · Tarih Katmanı",
        story:
          "Tekirdağ, kıyı ve bağ kültürünün hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Üretim, toplulukla daha kolay olur." + N2 +
          "Sofra, sadece yemek değil; bağ kurma ritüelidir." + N2 +
          "Bu katman, ‘paylaşım = bereket’ dersini bırakır.",
        reflection:
          "Ben paylaşınca çoğalan şey ne?",
      },
      en: {
        title: "59 · History Layer",
        story:
          "Tekirdag carries the memory of coast and vineyard culture." + N2 +
          "This layer teaches: production becomes easier with community." + N2 +
          "A table is not only food; it is a bonding ritual." + N2 +
          "It leaves the lesson: sharing becomes abundance.",
        reflection:
          "What grows when I share?",
      },
    },

    numerology: {
      tr: {
        title: "59 · Numeroloji",
        story:
          "59 = değişim + kapanış + hafiflik." + N2 +
          "59’un gölgesi:" + NL +
          "• keyfi ertelemek" + NL +
          "• suçluluk" + N2 +
          "59’un ışığı:" + NL +
          "• denge" + NL +
          "• yaşam kalitesi" + NL +
          "• tamamlanma" + N2 +
          "Bu kapı sorar: ‘Hayatın tadı var mı?’",
        reflection:
          "Bugün hayatıma tat katan şey ne?",
      },
      en: {
        title: "59 · Numerology",
        story:
          "59 = change + closure + lightness." + N2 +
          "Shadow of 59:" + NL +
          "• postponing joy" + NL +
          "• guilt" + N2 +
          "Light of 59:" + NL +
          "• balance" + NL +
          "• quality of life" + NL +
          "• completion" + N2 +
          "This gate asks: ‘Does your life have flavor?’",
        reflection:
          "What adds flavor to my life today?",
      },
    },

    symbols: {
      tr: {
        title: "59 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Bağ: olgun üretim." + NL +
          "• Deniz: hafiflik." + NL +
          "• Rüzgâr: sosyal akış." + NL +
          "• Sofra: paylaşım." + N2 +
          "Sembol mesajı: ‘Üret, paylaş, hafifle.’",
        reflection:
          "Bugün hangi paylaşım beni hafifletir?",
      },
      en: {
        title: "59 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Vineyard: mature production." + NL +
          "• Sea: lightness." + NL +
          "• Wind: social flow." + NL +
          "• Table: sharing." + N2 +
          "Symbol message: ‘Produce, share, lighten.’",
        reflection:
          "Which act of sharing lightens me today?",
      },
    },

    ritual: {
      tr: {
        title: "59 · Ritüel",
        story:
          "59 Dakika Ritüeli (Tat + Denge):" + N2 +
          "1) 30 dakika üretim: tek bir işe odaklan." + NL +
          "2) 20 dakika keyif: yürüyüş, müzik, sohbet." + NL +
          "3) 9 nefes: içinden söyle ‘Denge’." + N2 +
          "Kapanış: ‘Yaşıyorum.’",
        reflection:
          "Bugün üretimden sonra kendime hangi keyfi veriyorum?",
      },
      en: {
        title: "59 · Ritual",
        story:
          "59-Minute Ritual (Flavor + Balance):" + N2 +
          "1) 30 minutes production: focus on one task." + NL +
          "2) 20 minutes joy: walk, music, conversation." + NL +
          "3) 9 breaths repeating ‘Balance.’" + N2 +
          "Closing: ‘I live.’",
        reflection:
          "What joy do I give myself after producing today?",
      },
    },

    lab: {
      tr: {
        title: "59 · LAB: Life-Work Balance Engine",
        story:
          "Kod Gözü: Denge / Tat / Paylaşım" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Keyif = tembellik’" + NL +
          "• ‘Çalışmak = değer’" + N2 +
          "Rewrite:" + NL +
          "• ‘Keyif = yakıt’" + NL +
          "• ‘Denge = değer’",
        reflection:
          "Tek cümle yaz: Bugün keyfi nasıl yakıta çeviriyorsun?",
      },
      en: {
        title: "59 · LAB: Life-Work Balance Engine",
        story:
          "Code Eye: Balance / Flavor / Sharing" + N2 +
          "Rule Engine:" + NL +
          "• ‘Joy = laziness’" + NL +
          "• ‘Work = value’" + N2 +
          "Rewrite:" + NL +
          "• ‘Joy = fuel’" + NL +
          "• ‘Balance = value’",
        reflection:
          "Write one sentence: How do you turn joy into fuel today?",
      },
    },
  },
};
export const CITY_60: Record<CityCode, City7> = {
  "60": {
    city: "Tokat",

    base: {
      tr: {
        title: "60 · Sarma",
        story:
          "Tokat bir şehir değil—içeriği sarıp koruyan bilgeliktir." + N2 +
          "Bu kapı sana şunu öğretir: Her şey dışarı dökülmez; bazı şeyler özenle sarılır." + N2 +
          "60’ın enerjisi ‘koruyucu form’ taşır: özü tutar, düzenler, taşır." + N2 +
          "Tokat’ın mesajı: ‘Dağılma, topla.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Duygu da, fikir de, emek de doğru forma girince bereket olur.",
        reflection:
          "Bugün hangi şeyi toparlayıp forma sokuyorum?",
      },
      en: {
        title: "60 · Wrap",
        story:
          "Tokat is not only a city—it is wisdom that wraps and protects the essence." + N2 +
          "This gate teaches: not everything should spill outward; some things are meant to be held with care." + N2 +
          "60 carries ‘protective form’: it holds the core, organizes it, carries it." + N2 +
          "Tokat’s message: ‘Don’t scatter—gather.’" + N2 +
          "Know this: emotion, ideas, and effort become abundance when placed into the right form.",
        reflection:
          "What am I gathering and shaping into form today?",
      },
    },

    deepC: {
      tr: {
        title: "60 · Matrix Derin İfşa",
        story:
          "Sistem 60’ı ‘kapanış-yapı protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 0 = alan. 60 = alanı sorumlulukla düzenlemek." + N2 +
          "Gölge test: Her şeyi açıp savurmak." + NL +
          "Işık test: Açacağı yeri seçmek." + N2 +
          "60 sana şunu söyler: Sınır, baskı değildir; korumadır." + N2 +
          "Bu kapı, ‘açık saçık enerji’yi ‘toparlanmış güç’e çevirir.",
        reflection:
          "Ben enerjimi nerede savuruyorum?",
      },
      en: {
        title: "60 · Deep Matrix Reveal",
        story:
          "The system runs 60 as a ‘closure-structure protocol.’" + N2 +
          "6 = responsibility, 0 = field. 60 is organizing the field through responsibility." + N2 +
          "Shadow test: opening everything and scattering it." + NL +
          "Light test: choosing what to open and where." + N2 +
          "60 says: a boundary is not oppression; it is protection." + N2 +
          "This gate turns ‘leaking energy’ into ‘gathered power.’",
        reflection:
          "Where am I leaking my energy today?",
      },
    },

    history: {
      tr: {
        title: "60 · Tarih Katmanı",
        story:
          "Tokat, bağın ve yaprağın hafızasını taşır: ürün, emek, kışa hazırlık." + N2 +
          "Tarih katmanı şunu öğretir: Koruma kültürü, sürdürülebilir yaşam üretir." + N2 +
          "Sarma metaforu burada bir ders olur: İçini değerli tut, dışını doğru seç." + N2 +
          "Bu katman, ‘kışa hazırlık = bilgelik’ dersini bırakır.",
        reflection:
          "Ben geleceğim için bugün neyi koruyorum?",
      },
      en: {
        title: "60 · History Layer",
        story:
          "Tokat carries the memory of vine and leaf: harvest, labor, preparing for winter." + N2 +
          "This layer teaches: a culture of preservation creates sustainable life." + N2 +
          "The wrapping metaphor becomes a lesson: keep the inside valuable, choose the outside wisely." + N2 +
          "It leaves the lesson: preparing for winter is wisdom.",
        reflection:
          "What am I preserving today for my future?",
      },
    },

    numerology: {
      tr: {
        title: "60 · Numeroloji",
        story:
          "60 = düzen / koruma / sürdürülebilir alan." + N2 +
          "60’ın gölgesi:" + NL +
          "• dağınıklık" + NL +
          "• sınır koyamama" + N2 +
          "60’ın ışığı:" + NL +
          "• toparlama" + NL +
          "• seçici açıklık" + NL +
          "• güçlü yapı" + N2 +
          "Bu kapı sorar: ‘Neyi koruyorsun?’",
        reflection:
          "Bugün korunması gereken özüm ne?",
      },
      en: {
        title: "60 · Numerology",
        story:
          "60 = order / protection / sustainable field." + N2 +
          "Shadow of 60:" + NL +
          "• messiness" + NL +
          "• no boundaries" + N2 +
          "Light of 60:" + NL +
          "• gathering" + NL +
          "• selective openness" + NL +
          "• strong structure" + N2 +
          "This gate asks: ‘What are you protecting?’",
        reflection:
          "What part of my essence needs protection today?",
      },
    },

    symbols: {
      tr: {
        title: "60 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Yaprak: koruyucu katman." + NL +
          "• İç: öz." + NL +
          "• İp: bağlamak, toparlamak." + NL +
          "• Kutu: saklamak." + N2 +
          "Sembol mesajı: ‘Özü koru, formu seç.’",
        reflection:
          "Ben form seçerken özü koruyor muyum?",
      },
      en: {
        title: "60 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Leaf: protective layer." + NL +
          "• Inside: essence." + NL +
          "• String: binding, gathering." + NL +
          "• Box: storing." + N2 +
          "Symbol message: ‘Protect the essence, choose the form.’",
        reflection:
          "As I choose form, am I protecting essence?",
      },
    },

    ritual: {
      tr: {
        title: "60 · Ritüel",
        story:
          "60 Dakika Ritüeli (Toparla):" + N2 +
          "1) Dağınık olan 1 alan seç." + NL +
          "2) 20 dakika topla (fiziksel ya da zihinsel)." + NL +
          "3) 20 dakika sırala (öncelik)." + NL +
          "4) 20 dakika bir cümle yaz: ‘Benim özüm…’" + N2 +
          "Kapanış: ‘Toparladım.’",
        reflection:
          "Bugün hangi alanı toparlıyorum?",
      },
      en: {
        title: "60 · Ritual",
        story:
          "60-Minute Ritual (Gather):" + N2 +
          "1) Choose one scattered area." + NL +
          "2) 20 minutes: gather (physical or mental)." + NL +
          "3) 20 minutes: sort (priorities)." + NL +
          "4) 20 minutes: write one sentence: ‘My essence is…’" + N2 +
          "Closing: ‘I gathered.’",
        reflection:
          "Which area am I gathering today?",
      },
    },

    lab: {
      tr: {
        title: "60 · LAB: Containment Engine",
        story:
          "Kod Gözü: Koruma / Form / Sınır" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Her şeyi paylaşmalıyım’" + NL +
          "• ‘Sınır = ayıp’" + N2 +
          "Rewrite:" + NL +
          "• ‘Seçici paylaşırım’" + NL +
          "• ‘Sınır = bilgelik’",
        reflection:
          "Tek cümle yaz: Bugün hangi sınır beni koruyor?",
      },
      en: {
        title: "60 · LAB: Containment Engine",
        story:
          "Code Eye: Protection / Form / Boundary" + N2 +
          "Rule Engine:" + NL +
          "• ‘I must share everything’" + NL +
          "• ‘Boundary = shame’" + N2 +
          "Rewrite:" + NL +
          "• ‘I share selectively’" + NL +
          "• ‘Boundary = wisdom’",
        reflection:
          "Write one sentence: Which boundary protects me today?",
      },
    },
  },
};
export const CITY_61: Record<CityCode, City7> = {
  "61": {
    city: "Trabzon",

    base: {
      tr: {
        title: "61 · Duruş",
        story:
          "Trabzon bir şehir değil—duruşun kıyı gururudur." + N2 +
          "Bu kapı sana şunu öğretir: Karakter, enerji yükselince ortaya çıkar." + N2 +
          "61’in enerjisi ‘yüksek dalga’ gibidir: hızlı, güçlü, net." + N2 +
          "Trabzon’un mesajı: ‘Kendini saklama. Duruşunu göster.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Gurur kibir değilse, omurgadır.",
        reflection:
          "Bugün omurgamı nerede koruyorum?",
      },
      en: {
        title: "61 · Stance",
        story:
          "Trabzon is not only a city—it is coastal pride as stance." + N2 +
          "This gate teaches: character reveals itself when energy rises." + N2 +
          "61 feels like a high wave: fast, strong, clear." + N2 +
          "Trabzon’s message: ‘Don’t hide. Show your stance.’" + N2 +
          "Know this: if pride is not arrogance, it becomes spine.",
        reflection:
          "Where am I protecting my spine today?",
      },
    },

    deepC: {
      tr: {
        title: "61 · Matrix Derin İfşa",
        story:
          "Sistem 61’i ‘omurga protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 1 = irade. 61 = iradeyi sorumlulukla taşımak." + N2 +
          "Gölge test: Gururu savunmaya çevirmek." + NL +
          "Işık test: Gururu öz saygıya çevirmek." + N2 +
          "61 sana şunu söyler: Duruş saldırı değildir; netliktir." + N2 +
          "Bu kapı, enerjini ‘kavga’ya değil ‘yön’e çevirir.",
        reflection:
          "Ben bugün enerjimi kavga mı yapıyorum, yön mü yapıyorum?",
      },
      en: {
        title: "61 · Deep Matrix Reveal",
        story:
          "The system runs 61 as a ‘spine protocol.’" + N2 +
          "6 = responsibility, 1 = will. 61 is will carried with responsibility." + N2 +
          "Shadow test: turning pride into defense." + NL +
          "Light test: turning pride into self-respect." + N2 +
          "61 says: stance is not attack; it is clarity." + N2 +
          "This gate turns your energy from ‘fight’ into ‘direction.’",
        reflection:
          "Am I turning my energy into a fight—or into direction today?",
      },
    },

    history: {
      tr: {
        title: "61 · Tarih Katmanı",
        story:
          "Trabzon, kıyı ve dağ arasında bir karakter taşır." + N2 +
          "Kıyı cesaret verir, dağ omurga verir." + N2 +
          "Tarih katmanı şunu öğretir: Kimlik, sadece söz değil; duruştur." + N2 +
          "Bu katman, ‘omurga = kimlik’ dersini bırakır.",
        reflection:
          "Benim kimliğim hangi duruşla belli oluyor?",
      },
      en: {
        title: "61 · History Layer",
        story:
          "Trabzon carries character between coast and mountain." + N2 +
          "The coast gives courage; the mountain gives spine." + N2 +
          "This layer teaches: identity is not only words—it is stance." + N2 +
          "It leaves the lesson: spine becomes identity.",
        reflection:
          "Which stance reveals my identity?",
      },
    },

    numerology: {
      tr: {
        title: "61 · Numeroloji",
        story:
          "61 = omurga / öz saygı / net irade." + N2 +
          "61’in gölgesi:" + NL +
          "• savunma" + NL +
          "• sertleşme" + N2 +
          "61’in ışığı:" + NL +
          "• öz saygı" + NL +
          "• net sınır" + NL +
          "• yön veren enerji" + N2 +
          "Bu kapı sorar: ‘Ne için duruyorsun?’",
        reflection:
          "Bugün hangi değer için ayaktayım?",
      },
      en: {
        title: "61 · Numerology",
        story:
          "61 = spine / self-respect / clear will." + N2 +
          "Shadow of 61:" + NL +
          "• defensiveness" + NL +
          "• hardening" + N2 +
          "Light of 61:" + NL +
          "• self-respect" + NL +
          "• clear boundary" + NL +
          "• energy that guides" + N2 +
          "This gate asks: ‘What do you stand for?’",
        reflection:
          "Which value am I standing for today?",
      },
    },

    symbols: {
      tr: {
        title: "61 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Dalga: güçlü enerji." + NL +
          "• Dağ: omurga." + NL +
          "• Kalkan: savunma yerine netlik." + NL +
          "• Bayrak: kimlik." + N2 +
          "Sembol mesajı: ‘Duruşun yolun olsun.’",
        reflection:
          "Bugün duruşumu hangi davranışla gösteriyorum?",
      },
      en: {
        title: "61 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Wave: strong energy." + NL +
          "• Mountain: spine." + NL +
          "• Shield: clarity over defense." + NL +
          "• Flag: identity." + N2 +
          "Symbol message: ‘Let your stance be your path.’",
        reflection:
          "What action shows my stance today?",
      },
    },

    ritual: {
      tr: {
        title: "61 · Ritüel",
        story:
          "61 Dakika Ritüeli (Omurga):" + N2 +
          "1) Dik otur, omurganı hisset." + NL +
          "2) 6 dakika nefes al, 1 dakika dur (7 dakika)." + NL +
          "3) Bunu 8 kez tekrar et (56 dakika)." + NL +
          "4) Son 5 dakikada bir cümle yaz: ‘Benim duruşum…’" + N2 +
          "Kapanış: ‘Netim.’",
        reflection:
          "Bugün duruşumu hangi cümleyle netliyorum?",
      },
      en: {
        title: "61 · Ritual",
        story:
          "61-Minute Ritual (Spine):" + N2 +
          "1) Sit upright, feel your spine." + NL +
          "2) Breathe 6 minutes, pause 1 minute (7 minutes)." + NL +
          "3) Repeat 8 times (56 minutes)." + NL +
          "4) In the last 5 minutes write: ‘My stance is…’" + N2 +
          "Closing: ‘I am clear.’",
        reflection:
          "Which sentence clarifies my stance today?",
      },
    },

    lab: {
      tr: {
        title: "61 · LAB: Spine Engine",
        story:
          "Kod Gözü: Omurga / Öz Saygı / Yön" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Savunursam güçlüyüm’" + NL +
          "• ‘Sertlik = güven’" + N2 +
          "Rewrite:" + NL +
          "• ‘Netlik = güç’" + NL +
          "• ‘Öz saygı = güven’",
        reflection:
          "Tek cümle yaz: Bugün netliği nasıl seçiyorsun?",
      },
      en: {
        title: "61 · LAB: Spine Engine",
        story:
          "Code Eye: Spine / Self-Respect / Direction" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I defend, I’m strong’" + NL +
          "• ‘Harshness = safety’" + N2 +
          "Rewrite:" + NL +
          "• ‘Clarity = strength’" + NL +
          "• ‘Self-respect = safety’",
        reflection:
          "Write one sentence: How do you choose clarity today?",
      },
    },
  },
};
export const CITY_62: Record<CityCode, City7> = {
  "62": {
    city: "Tunceli",

    base: {
      tr: {
        title: "62 · Öz Doğruluk",
        story:
          "Tunceli bir şehir değil—öz doğruluğun dağ sesidir." + N2 +
          "Bu kapı sana şunu öğretir: Özgürlük bağırmak değildir; içerde net olmaktır." + N2 +
          "62’nin enerjisi ‘dağ + su’ gibi çalışır: sert ama temiz, güçlü ama sade." + N2 +
          "Tunceli’nin mesajı: ‘Kendine yalan söyleme.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Gerçek duruş, dış onay istemez.",
        reflection:
          "Bugün kendime hangi gerçeği net söylüyorum?",
      },
      en: {
        title: "62 · Inner Truth",
        story:
          "Tunceli is not only a city—it is the mountain voice of inner truth." + N2 +
          "This gate teaches: freedom is not shouting; it is being clear within." + N2 +
          "62 works like ‘mountain + water’: firm yet clean, powerful yet simple." + N2 +
          "Tunceli’s message: ‘Don’t lie to yourself.’" + N2 +
          "Know this: true stance needs no external approval.",
        reflection:
          "What truth am I speaking clearly to myself today?",
      },
    },

    deepC: {
      tr: {
        title: "62 · Matrix Derin İfşa",
        story:
          "Sistem 62’yi ‘iç özgürlük protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 2 = denge. 62 = sorumluluğu dengede taşımak." + N2 +
          "Gölge test: Dışarıyla savaşırken içeride dağılmak." + NL +
          "Işık test: İçeride netleşip dışarıda sade kalmak." + N2 +
          "62 sana şunu söyler: Dış düşman yoksa bile iç çatışma olabilir." + N2 +
          "Bu kapı, iç çatışmayı çözer: ‘Ben ne istiyorum?’ sorusunu netleştirir.",
        reflection:
          "Benim içimdeki savaş ne—ve barış cümlem ne?",
      },
      en: {
        title: "62 · Deep Matrix Reveal",
        story:
          "The system runs 62 as an ‘inner freedom protocol.’" + N2 +
          "6 = responsibility, 2 = balance. 62 is carrying responsibility in balance." + N2 +
          "Shadow test: fighting outside while scattering inside." + NL +
          "Light test: becoming clear inside and staying simple outside." + N2 +
          "62 says: even without an external enemy, inner conflict can exist." + N2 +
          "This gate resolves inner conflict by clarifying: ‘What do I want?’",
        reflection:
          "What is my inner war—and what is my peace sentence?",
      },
    },

    history: {
      tr: {
        title: "62 · Tarih Katmanı",
        story:
          "Tunceli, zorlu coğrafyanın taşıdığı güçlü karakter hafızasıdır." + N2 +
          "Tarih katmanı şunu öğretir: Zor şartlar insanı ya sertleştirir ya da saflaştırır." + N2 +
          "Bu katman, ‘saf duruş’ dersini bırakır: net ol, ama kirlenme." + N2 +
          "Dağ, gürültü yapmaz; varlığıyla konuşur.",
        reflection:
          "Ben gürültü yapmadan nasıl net olabilirim?",
      },
      en: {
        title: "62 · History Layer",
        story:
          "Tunceli carries memory of strong character shaped by harsh geography." + N2 +
          "This layer teaches: hard conditions either harden you or purify you." + N2 +
          "It leaves the lesson of pure stance: be clear, but don’t get dirty." + N2 +
          "A mountain doesn’t shout; it speaks by being.",
        reflection:
          "How can I be clear without making noise?",
      },
    },

    numerology: {
      tr: {
        title: "62 · Numeroloji",
        story:
          "62 = iç özgürlük / netlik / denge." + N2 +
          "62’nin gölgesi:" + NL +
          "• iç çatışma" + NL +
          "• öfkeyle karar" + N2 +
          "62’nin ışığı:" + NL +
          "• sakin netlik" + NL +
          "• öz disiplin" + NL +
          "• dengeli sorumluluk" + N2 +
          "Bu kapı sorar: ‘Gerçekten ne istiyorsun?’",
        reflection:
          "Bugün gerçek isteğim ne?",
      },
      en: {
        title: "62 · Numerology",
        story:
          "62 = inner freedom / clarity / balance." + N2 +
          "Shadow of 62:" + NL +
          "• inner conflict" + NL +
          "• decisions from anger" + N2 +
          "Light of 62:" + NL +
          "• calm clarity" + NL +
          "• self-discipline" + NL +
          "• balanced responsibility" + N2 +
          "This gate asks: ‘What do you truly want?’",
        reflection:
          "What is my true desire today?",
      },
    },

    symbols: {
      tr: {
        title: "62 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Dağ: net duruş." + NL +
          "• Akarsu: arınma." + NL +
          "• Taş: sağlam karar." + NL +
          "• Rüzgâr: özgürlük." + N2 +
          "Sembol mesajı: ‘Net ol, temiz kal.’",
        reflection:
          "Ben net olurken temiz kalabiliyor muyum?",
      },
      en: {
        title: "62 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Mountain: clear stance." + NL +
          "• Stream: cleansing." + NL +
          "• Stone: solid decision." + NL +
          "• Wind: freedom." + N2 +
          "Symbol message: ‘Be clear, stay clean.’",
        reflection:
          "Can I stay clean while being clear today?",
      },
    },

    ritual: {
      tr: {
        title: "62 · Ritüel",
        story:
          "62 Dakika Ritüeli (Net Cümle):" + N2 +
          "1) 20 dakika sessiz otur." + NL +
          "2) 20 dakika yaz: ‘Benim gerçeğim…’" + NL +
          "3) 22 dakika tek bir cümle üret: ‘Seçiyorum…’" + N2 +
          "Kapanış: ‘Kendime sadığım.’",
        reflection:
          "Bugün hangi seçimi netleştiriyorum?",
      },
      en: {
        title: "62 · Ritual",
        story:
          "62-Minute Ritual (Clear Sentence):" + N2 +
          "1) Sit silently for 20 minutes." + NL +
          "2) Write for 20 minutes: ‘My truth is…’" + NL +
          "3) For 22 minutes craft one sentence: ‘I choose…’" + N2 +
          "Closing: ‘I am loyal to myself.’",
        reflection:
          "Which choice am I clarifying today?",
      },
    },

    lab: {
      tr: {
        title: "62 · LAB: Inner Freedom Engine",
        story:
          "Kod Gözü: İç Özgürlük / Netlik / Temizlik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Öfke = güç’" + NL +
          "• ‘Savaş = çözüm’" + N2 +
          "Rewrite:" + NL +
          "• ‘Netlik = güç’" + NL +
          "• ‘Barış = çözüm’",
        reflection:
          "Tek cümle yaz: Bugün gücü nasıl yeniden tanımlıyorsun?",
      },
      en: {
        title: "62 · LAB: Inner Freedom Engine",
        story:
          "Code Eye: Inner Freedom / Clarity / Cleanliness" + N2 +
          "Rule Engine:" + NL +
          "• ‘Anger = power’" + NL +
          "• ‘Fight = solution’" + N2 +
          "Rewrite:" + NL +
          "• ‘Clarity = power’" + NL +
          "• ‘Peace = solution’",
        reflection:
          "Write one sentence: How do you redefine power today?",
      },
    },
  },
};
export const CITY_63: Record<CityCode, City7> = {
  "63": {
    city: "Sanliurfa",

    base: {
      tr: {
        title: "63 · İlk Tohum",
        story:
          "Şanlıurfa bir şehir değil—ilk tohumun hatırlayışıdır." + N2 +
          "Bu kapı sana şunu öğretir: Başlangıç bazen yeni değil; çok eski bir hatırlamadır." + N2 +
          "63’ün enerjisi ‘kaynak’ taşır: kök, doğum, ilk kayıt." + N2 +
          "Şanlıurfa’nın mesajı: ‘Hatırla ve başlat.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Kaderin başlangıcı, bilinçte atılan ilk cümledir.",
        reflection:
          "Bugün hangi ilk cümleyi yeniden yazıyorum?",
      },
      en: {
        title: "63 · First Seed",
        story:
          "Sanliurfa is not only a city—it is the remembrance of the first seed." + N2 +
          "This gate teaches: a beginning is sometimes not new, but an ancient remembering." + N2 +
          "63 carries ‘source’: root, birth, first record." + N2 +
          "Sanliurfa’s message: ‘Remember and initiate.’" + N2 +
          "Know this: the start of destiny is the first sentence you plant in consciousness.",
        reflection:
          "Which first sentence am I rewriting today?",
      },
    },

    deepC: {
      tr: {
        title: "63 · Matrix Derin İfşa",
        story:
          "Sistem 63’ü ‘kaynak protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 3 = yaratım. 63 = yaratımı sorumlulukla taşımak." + N2 +
          "Gölge test: Başlangıcı ertelemek, ‘hazır değilim’ demek." + NL +
          "Işık test: İlk adımı atıp yaratımı büyütmek." + N2 +
          "63 sana şunu söyler: Kaynak senden akar. Dışarıdan bekleme." + N2 +
          "Bu kapı, ‘ilk tohum’u verir: niyet. Niyet doğruysa yol açılır.",
        reflection:
          "Ben bugün kaynağımı nerede dışarıya veriyorum?",
      },
      en: {
        title: "63 · Deep Matrix Reveal",
        story:
          "The system runs 63 as a ‘source protocol.’" + N2 +
          "6 = responsibility, 3 = creation. 63 is carrying creation with responsibility." + N2 +
          "Shadow test: delaying the start—saying ‘I’m not ready.’" + NL +
          "Light test: taking the first step and growing creation." + N2 +
          "63 says: the source flows from you. Don’t wait outside." + N2 +
          "This gate delivers the first seed: intention. When intention is true, the path opens.",
        reflection:
          "Where am I giving my source power away today?",
      },
    },

    history: {
      tr: {
        title: "63 · Tarih Katmanı",
        story:
          "Şanlıurfa, kadim başlangıçların hafızasını taşır." + N2 +
          "Bu katman şunu öğretir: İnsan, tarih kadar eski bir bilinç taşır." + N2 +
          "Eski olan ‘geçmiş’ değil; köktür." + N2 +
          "Tarih katmanı, ‘ilk kayıt’ dersini bırakır: Ne yazarsan o yaşanır.",
        reflection:
          "Ben hangi kaydı yazarak hayatımı kuruyorum?",
      },
      en: {
        title: "63 · History Layer",
        story:
          "Sanliurfa carries the memory of ancient beginnings." + N2 +
          "This layer teaches: humans carry a consciousness as old as history." + N2 +
          "The ancient is not ‘past’—it is root." + N2 +
          "It leaves the lesson of first record: what you write is what you live.",
        reflection:
          "Which record am I writing to build my life?",
      },
    },

    numerology: {
      tr: {
        title: "63 · Numeroloji",
        story:
          "63 = kaynak / başlangıç / yaratım sorumluluğu." + N2 +
          "63’ün gölgesi:" + NL +
          "• erteleme" + NL +
          "• dış onay beklemek" + N2 +
          "63’ün ışığı:" + NL +
          "• ilk adım" + NL +
          "• niyet" + NL +
          "• kendi kaynağına sahip çıkmak" + N2 +
          "Bu kapı sorar: ‘Neyi başlatıyorsun?’",
        reflection:
          "Bugün başlattığım şey ne?",
      },
      en: {
        title: "63 · Numerology",
        story:
          "63 = source / beginning / responsibility of creation." + N2 +
          "Shadow of 63:" + NL +
          "• procrastination" + NL +
          "• waiting for external approval" + N2 +
          "Light of 63:" + NL +
          "• first step" + NL +
          "• intention" + NL +
          "• owning your source" + N2 +
          "This gate asks: ‘What are you initiating?’",
        reflection:
          "What am I initiating today?",
      },
    },

    symbols: {
      tr: {
        title: "63 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Tohum: niyet." + NL +
          "• Kaynak su: doğum." + NL +
          "• Sütun: ilk kayıt." + NL +
          "• Çember: zaman döngüsü." + N2 +
          "Sembol mesajı: ‘İlk cümleyi yaz.’",
        reflection:
          "Benim ilk cümlem ne?",
      },
      en: {
        title: "63 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Seed: intention." + NL +
          "• Spring water: birth." + NL +
          "• Pillar: first record." + NL +
          "• Circle: time cycle." + N2 +
          "Symbol message: ‘Write the first sentence.’",
        reflection:
          "What is my first sentence?",
      },
    },

    ritual: {
      tr: {
        title: "63 · Ritüel",
        story:
          "63 Dakika Ritüeli (İlk Tohum):" + N2 +
          "1) Bir sayfaya sadece şu başlığı yaz: ‘Başlatıyorum…’" + NL +
          "2) Altına tek cümle yaz: ‘Bugün … başlatıyorum.’" + NL +
          "3) 63 nefes al. Son nefeste söyle: ‘Başladı.’" + N2 +
          "Kapanış: ‘Kaynağım bende.’",
        reflection:
          "Bugün neyi başlatıyorum?",
      },
      en: {
        title: "63 · Ritual",
        story:
          "63-Minute Ritual (First Seed):" + N2 +
          "1) Write only this header: ‘I begin…’" + NL +
          "2) Under it write one sentence: ‘Today I begin …’" + NL +
          "3) Take 63 breaths. On the last say: ‘It began.’" + N2 +
          "Closing: ‘My source is within.’",
        reflection:
          "What am I beginning today?",
      },
    },

    lab: {
      tr: {
        title: "63 · LAB: Source Engine",
        story:
          "Kod Gözü: Kaynak / Niyet / İlk Adım" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Hazır olunca başlarım’" + NL +
          "• ‘Biri beni görsün’" + N2 +
          "Rewrite:" + NL +
          "• ‘Başlayınca hazır olurum’" + NL +
          "• ‘Ben kaynağım’",
        reflection:
          "Tek cümle yaz: Bugün kaynağı nasıl sahipleniyorsun?",
      },
      en: {
        title: "63 · LAB: Source Engine",
        story:
          "Code Eye: Source / Intention / First Step" + N2 +
          "Rule Engine:" + NL +
          "• ‘I’ll start when I’m ready’" + NL +
          "• ‘Someone must see me first’" + N2 +
          "Rewrite:" + NL +
          "• ‘I become ready by starting’" + NL +
          "• ‘I am the source’",
        reflection:
          "Write one sentence: How do you own the source today?",
      },
    },
  },
};
export const CITY_64: Record<CityCode, City7> = {
  "64": {
    city: "Usak",

    base: {
      tr: {
        title: "64 · İlmek",
        story:
          "Uşak bir şehir değil—kaderin ilmek ilmek örülmesidir." + N2 +
          "Bu kapı sana şunu öğretir: Büyük sonuç, küçük tekrarların toplamıdır." + N2 +
          "64’ün enerjisi dokuma gibi çalışır: sabır, ritim, desen." + N2 +
          "Uşak’ın mesajı: ‘Desenini seç, ilmeğini at.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Kader bir anda gelmez; örülür.",
        reflection:
          "Bugün kaderime hangi ilmeği atıyorum?",
      },
      en: {
        title: "64 · Stitch",
        story:
          "Usak is not only a city—it is destiny woven stitch by stitch." + N2 +
          "This gate teaches: a big outcome is the sum of small repetitions." + N2 +
          "64 works like weaving: patience, rhythm, pattern." + N2 +
          "Usak’s message: ‘Choose your pattern, place your stitch.’" + N2 +
          "Know this: destiny doesn’t arrive in one moment; it is woven.",
        reflection:
          "Which stitch am I placing into my destiny today?",
      },
    },

    deepC: {
      tr: {
        title: "64 · Matrix Derin İfşa",
        story:
          "Sistem 64’ü ‘desen protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 4 = yapı. 64 = sorumluluğu yapıya dönüştürmek." + N2 +
          "Gölge test: Rastgele yaşayıp sonra sonuç beklemek." + NL +
          "Işık test: Desen seçip sistemle yürümek." + N2 +
          "64 sana şunu söyler: İlmek atmazsan halı oluşmaz." + N2 +
          "Bu kapı, ‘niyet’ ile ‘alışkanlık’ arasındaki köprüdür: niyet desendir, alışkanlık ilmek.",
        reflection:
          "Benim desenim ne—ve ilmeğim ne?",
      },
      en: {
        title: "64 · Deep Matrix Reveal",
        story:
          "The system runs 64 as a ‘pattern protocol.’" + N2 +
          "6 = responsibility, 4 = structure. 64 is turning responsibility into structure." + N2 +
          "Shadow test: living randomly and expecting results." + NL +
          "Light test: choosing a pattern and walking with system." + N2 +
          "64 says: without stitches, no carpet forms." + N2 +
          "This gate bridges intention and habit: intention is the pattern, habit is the stitch.",
        reflection:
          "What is my pattern—and what is my stitch?",
      },
    },

    history: {
      tr: {
        title: "64 · Tarih Katmanı",
        story:
          "Uşak, dokumanın ve emeğin hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Ustalık, sabırla tekrarın içinden doğar." + N2 +
          "Desenler bir dil taşır: kimlik, hikâye, çağrı." + N2 +
          "Bu katman, ‘emek = hikâye’ dersini bırakır.",
        reflection:
          "Ben hangi emeğimle hikâyemi yazıyorum?",
      },
      en: {
        title: "64 · History Layer",
        story:
          "Usak carries the memory of weaving and labor." + N2 +
          "This layer teaches: mastery is born through patient repetition." + N2 +
          "Patterns carry a language: identity, story, call." + N2 +
          "It leaves the lesson: effort becomes story.",
        reflection:
          "Through which effort am I writing my story today?",
      },
    },

    numerology: {
      tr: {
        title: "64 · Numeroloji",
        story:
          "64 = yapı / desen / sistemli üretim." + N2 +
          "64’ün gölgesi:" + NL +
          "• düzensizlik" + NL +
          "• erteleme" + N2 +
          "64’ün ışığı:" + NL +
          "• ritim" + NL +
          "• alışkanlık" + NL +
          "• kalıcı sonuç" + N2 +
          "Bu kapı sorar: ‘Her gün hangi ilmeği atıyorsun?’",
        reflection:
          "Bugün her gün yapacağım ilmek ne?",
      },
      en: {
        title: "64 · Numerology",
        story:
          "64 = structure / pattern / systematic creation." + N2 +
          "Shadow of 64:" + NL +
          "• disorder" + NL +
          "• procrastination" + N2 +
          "Light of 64:" + NL +
          "• rhythm" + NL +
          "• habit" + NL +
          "• lasting results" + N2 +
          "This gate asks: ‘Which stitch do you place daily?’",
        reflection:
          "What is my daily stitch today?",
      },
    },

    symbols: {
      tr: {
        title: "64 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Halı: kader deseni." + NL +
          "• İlmek: küçük tekrar." + NL +
          "• Tezgâh: sistem." + NL +
          "• Renk: duygu ve niyet." + N2 +
          "Sembol mesajı: ‘Rengini seç, ilmeğini at.’",
        reflection:
          "Bugün hangi rengi seçiyorum?",
      },
      en: {
        title: "64 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Carpet: destiny pattern." + NL +
          "• Stitch: small repetition." + NL +
          "• Loom: system." + NL +
          "• Color: emotion and intention." + N2 +
          "Symbol message: ‘Choose your color, place your stitch.’",
        reflection:
          "Which color am I choosing today?",
      },
    },

    ritual: {
      tr: {
        title: "64 · Ritüel",
        story:
          "64 Dakika Ritüeli (Desen Kur):" + N2 +
          "1) Bir hedef yaz." + NL +
          "2) O hedef için 6 alışkanlık yaz." + NL +
          "3) Her alışkanlık için 4 dakikalık mini başlatma yap (toplam 24 dk)." + NL +
          "4) Kalan zamanda tek birini 40 dakika uygula." + N2 +
          "Kapanış: ‘İlmek attım.’",
        reflection:
          "Bugün hangi alışkanlığı ilmeğe çeviriyorum?",
      },
      en: {
        title: "64 · Ritual",
        story:
          "64-Minute Ritual (Build the Pattern):" + N2 +
          "1) Write one goal." + NL +
          "2) Write 6 habits for that goal." + NL +
          "3) Do a 4-minute mini-start for each (24 min total)." + NL +
          "4) Use the remaining time to practice one habit for 40 minutes." + N2 +
          "Closing: ‘I placed my stitch.’",
        reflection:
          "Which habit am I turning into a stitch today?",
      },
    },

    lab: {
      tr: {
        title: "64 · LAB: Pattern Engine",
        story:
          "Kod Gözü: Desen / Alışkanlık / Sistem" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Bir gün çok yaparım’" + NL +
          "• ‘Sonra telafi ederim’" + N2 +
          "Rewrite:" + NL +
          "• ‘Her gün az yaparım’" + NL +
          "• ‘Az = kalıcı’",
        reflection:
          "Tek cümle yaz: Bugün kalıcı olanı nasıl seçiyorsun?",
      },
      en: {
        title: "64 · LAB: Pattern Engine",
        story:
          "Code Eye: Pattern / Habit / System" + N2 +
          "Rule Engine:" + NL +
          "• ‘One day I’ll do a lot’" + NL +
          "• ‘I’ll compensate later’" + N2 +
          "Rewrite:" + NL +
          "• ‘I do a little every day’" + NL +
          "• ‘Little = lasting’",
        reflection:
          "Write one sentence: How do you choose what lasts today?",
      },
    },
  },
};
export const CITY_65: Record<CityCode, City7> = {
  "65": {
    city: "Van",

    base: {
      tr: {
        title: "65 · İnci",
        story:
          "Van bir şehir değil—genişliğin içinde saklı incidir." + N2 +
          "Bu kapı sana şunu öğretir: Ferahlık, boşluk değil; geniş kalptir." + N2 +
          "65’in enerjisi göl gibi çalışır: sakin, derin, toplayıcı." + N2 +
          "Van’ın mesajı: ‘Genişle, ama derinleş.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Değer bazen gürültüde değil, sessiz derinlikte oluşur.",
        reflection:
          "Bugün hangi duyguda genişleyip ferahlıyorum?",
      },
      en: {
        title: "65 · Pearl",
        story:
          "Van is not only a city—it is a pearl hidden inside vastness." + N2 +
          "This gate teaches: spaciousness is not emptiness; it is a wide heart." + N2 +
          "65 works like a lake: calm, deep, gathering." + N2 +
          "Van’s message: ‘Expand, but deepen.’" + N2 +
          "Know this: value often forms not in noise, but in quiet depth.",
        reflection:
          "Which emotion am I expanding into today to feel spacious?",
      },
    },

    deepC: {
      tr: {
        title: "65 · Matrix Derin İfşa",
        story:
          "Sistem 65’i ‘ferahlık protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 5 = değişim. 65 = değişimi sorumlulukla yönetmek." + N2 +
          "Gölge test: Değişimi panikle karşılamak." + NL +
          "Işık test: Değişimi geniş kalple taşımak." + N2 +
          "65 sana şunu söyler: Ferahlık, dış koşul değil; iç kapasitedir." + N2 +
          "Bu kapı, kapasiteyi büyütür: daha az tepki, daha çok seçim.",
        reflection:
          "Ben bugün hangi şeye tepki vermek yerine seçim yapıyorum?",
      },
      en: {
        title: "65 · Deep Matrix Reveal",
        story:
          "The system runs 65 as a ‘spaciousness protocol.’" + N2 +
          "6 = responsibility, 5 = change. 65 is managing change with responsibility." + N2 +
          "Shadow test: meeting change with panic." + NL +
          "Light test: carrying change with a wide heart." + N2 +
          "65 says: spaciousness is not external condition; it is inner capacity." + N2 +
          "This gate grows capacity: fewer reactions, more choices.",
        reflection:
          "Where do I choose instead of react today?",
      },
    },

    history: {
      tr: {
        title: "65 · Tarih Katmanı",
        story:
          "Van, göl hafızası taşır: toplayan, tutan, yansıtan." + N2 +
          "Göl şehirleri şunu öğretir: Derinlik, sakinlik ister." + N2 +
          "Tarih katmanı burada bir ders bırakır: Geniş olan, her şeyi içine alır ama boğmaz." + N2 +
          "Bu katman, ‘genişlik = merhamet’ dersini bırakır.",
        reflection:
          "Ben bugün neyi merhametle içine alıyorum?",
      },
      en: {
        title: "65 · History Layer",
        story:
          "Van carries lake memory: gathering, holding, reflecting." + N2 +
          "Lake cities teach: depth requires calm." + N2 +
          "This layer leaves a lesson: what is vast can hold many things without drowning them." + N2 +
          "It leaves the lesson: spaciousness becomes compassion.",
        reflection:
          "What am I holding with compassion today?",
      },
    },

    numerology: {
      tr: {
        title: "65 · Numeroloji",
        story:
          "65 = ferahlık / olgun değişim / kapasite." + N2 +
          "65’in gölgesi:" + NL +
          "• acele tepki" + NL +
          "• panik" + N2 +
          "65’in ışığı:" + NL +
          "• sakin seçim" + NL +
          "• geniş kalp" + NL +
          "• derinlik" + N2 +
          "Bu kapı sorar: ‘Kapasiten ne kadar?’",
        reflection:
          "Bugün kapasitemi büyüten tek şey ne?",
      },
      en: {
        title: "65 · Numerology",
        story:
          "65 = spaciousness / mature change / capacity." + N2 +
          "Shadow of 65:" + NL +
          "• rushed reactions" + NL +
          "• panic" + N2 +
          "Light of 65:" + NL +
          "• calm choices" + NL +
          "• wide heart" + NL +
          "• depth" + N2 +
          "This gate asks: ‘How large is your capacity?’",
        reflection:
          "What is the one thing that grows my capacity today?",
      },
    },

    symbols: {
      tr: {
        title: "65 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Göl: toplayıcı sakinlik." + NL +
          "• İnci: değerin oluşması." + NL +
          "• Martı: geniş ufuk." + NL +
          "• Ayna su: kendini görme." + N2 +
          "Sembol mesajı: ‘Sakinleş, değer oluşsun.’",
        reflection:
          "Ben sakinleşince içimde hangi değer oluşuyor?",
      },
      en: {
        title: "65 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Lake: gathering calm." + NL +
          "• Pearl: value forming." + NL +
          "• Seagull: wide horizon." + NL +
          "• Mirror-water: self-seeing." + N2 +
          "Symbol message: ‘Calm down so value can form.’",
        reflection:
          "What value forms inside me when I calm down?",
      },
    },

    ritual: {
      tr: {
        title: "65 · Ritüel",
        story:
          "65 Dakika Ritüeli (Göl Nefesi):" + N2 +
          "1) 15 dakika yavaş nefes al." + NL +
          "2) 20 dakika yaz: ‘Bugün seçiyorum…’" + NL +
          "3) 30 dakika tek bir sakin eylem: yürüyüş, su, düzenleme." + N2 +
          "Kapanış: ‘Ferahladım.’",
        reflection:
          "Bugün hangi sakin eylem beni ferahlatır?",
      },
      en: {
        title: "65 · Ritual",
        story:
          "65-Minute Ritual (Lake Breath):" + N2 +
          "1) 15 minutes of slow breathing." + NL +
          "2) 20 minutes writing: ‘Today I choose…’" + NL +
          "3) 30 minutes one calm action: walk, water, organizing." + N2 +
          "Closing: ‘I feel spacious.’",
        reflection:
          "Which calm action brings spaciousness today?",
      },
    },

    lab: {
      tr: {
        title: "65 · LAB: Spaciousness Engine",
        story:
          "Kod Gözü: Ferahlık / Kapasite / Seçim" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Tepki = güç’" + NL +
          "• ‘Hız = çözüm’" + N2 +
          "Rewrite:" + NL +
          "• ‘Seçim = güç’" + NL +
          "• ‘Sakinlik = çözüm’",
        reflection:
          "Tek cümle yaz: Bugün tepki yerine hangi seçimi yapıyorsun?",
      },
      en: {
        title: "65 · LAB: Spaciousness Engine",
        story:
          "Code Eye: Spaciousness / Capacity / Choice" + N2 +
          "Rule Engine:" + NL +
          "• ‘Reaction = power’" + NL +
          "• ‘Speed = solution’" + N2 +
          "Rewrite:" + NL +
          "• ‘Choice = power’" + NL +
          "• ‘Calm = solution’",
        reflection:
          "Write one sentence: What choice replaces reaction today?",
      },
    },
  },
};
export const CITY_66: Record<CityCode, City7> = {
  "66": {
    city: "Yozgat",

    base: {
      tr: {
        title: "66 · Sessiz İnşa",
        story:
          "Yozgat bir şehir değil—sessiz inşanın bozkır sabrıdır." + N2 +
          "Bu kapı sana şunu öğretir: Yavaşlık tembellik değil; kök kurmadır." + N2 +
          "66’nın enerjisi ‘düzenli emek’ taşır: görünmez çalışır, sonra sağlam sonuç verir." + N2 +
          "Yozgat’ın mesajı: ‘Hızla parlamak değil, sağlam kalmak.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Büyük yapı, gürültüyle değil; ritimle kurulur.",
        reflection:
          "Bugün hangi şeyi sessizce ama kararlılıkla inşa ediyorum?",
      },
      en: {
        title: "66 · Quiet Building",
        story:
          "Yozgat is not only a city—it is steppe patience of quiet construction." + N2 +
          "This gate teaches: slowness is not laziness; it is rooting." + N2 +
          "66 carries ‘consistent effort’: it works unseen, then delivers solid results." + N2 +
          "Yozgat’s message: ‘Not shining fast—staying strong.’" + N2 +
          "Know this: big structures are built not with noise, but with rhythm.",
        reflection:
          "What am I building quietly yet steadily today?",
      },
    },

    deepC: {
      tr: {
        title: "66 · Matrix Derin İfşa",
        story:
          "Sistem 66’yı ‘koruyucu yapı protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk. 66 = sorumluluğun iki kat olgun hali." + N2 +
          "Gölge test: Aşırı yüklenip tükenmek." + NL +
          "Işık test: Yükü sisteme bölmek." + N2 +
          "66 sana şunu söyler: Her şeyi tek başına taşırsan kırılırsın; sistem kurarsan büyürsün." + N2 +
          "Bu kapı, sorumluluğu ‘yük’ten ‘düzen’e çevirir.",
        reflection:
          "Ben bugün yükümü hangi sistemle hafifletiyorum?",
      },
      en: {
        title: "66 · Deep Matrix Reveal",
        story:
          "The system runs 66 as a ‘protective structure protocol.’" + N2 +
          "6 = responsibility. 66 is responsibility in its doubled mature form." + N2 +
          "Shadow test: overloading and burning out." + NL +
          "Light test: splitting load into system." + N2 +
          "66 says: carry everything alone and you break; build a system and you grow." + N2 +
          "This gate turns responsibility from burden into order.",
        reflection:
          "What system am I using to lighten my load today?",
      },
    },

    history: {
      tr: {
        title: "66 · Tarih Katmanı",
        story:
          "Yozgat, iç Anadolu’nun ağır ama sağlam ritmini taşır." + N2 +
          "Tarih katmanı şunu öğretir: Kök salan yer, fırtınada devrilmez." + N2 +
          "Bu katman, ‘yavaş güç’ dersini bırakır: acele eden yorulur, ritim kuran büyür." + N2 +
          "Bozkır, sabrın okuludur.",
        reflection:
          "Ben sabrı hangi alanda okul yapıyorum?",
      },
      en: {
        title: "66 · History Layer",
        story:
          "Yozgat carries the heavy yet solid rhythm of inner Anatolia." + N2 +
          "This layer teaches: what roots does not fall in storms." + N2 +
          "It leaves the lesson of slow power: rushing exhausts, rhythm grows." + N2 +
          "The steppe is a school of patience.",
        reflection:
          "Where am I making patience my school today?",
      },
    },

    numerology: {
      tr: {
        title: "66 · Numeroloji",
        story:
          "66 = koruma / sorumluluk / olgun düzen." + N2 +
          "66’nın gölgesi:" + NL +
          "• tükenme" + NL +
          "• ‘ben hallederim’ yükü" + N2 +
          "66’nın ışığı:" + NL +
          "• paylaşım" + NL +
          "• ritim" + NL +
          "• sağlam sistem" + N2 +
          "Bu kapı sorar: ‘Sistem mi, stres mi?’",
        reflection:
          "Bugün stresi sisteme nasıl çeviriyorum?",
      },
      en: {
        title: "66 · Numerology",
        story:
          "66 = protection / responsibility / mature order." + N2 +
          "Shadow of 66:" + NL +
          "• burnout" + NL +
          "• the load of ‘I must handle it’" + N2 +
          "Light of 66:" + NL +
          "• sharing" + NL +
          "• rhythm" + NL +
          "• strong system" + N2 +
          "This gate asks: ‘System—or stress?’",
        reflection:
          "How do I turn stress into system today?",
      },
    },

    symbols: {
      tr: {
        title: "66 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Bozkır: sade güç." + NL +
          "• Tuğla: küçük adım." + NL +
          "• Duvar: koruma." + NL +
          "• Saat: ritim." + N2 +
          "Sembol mesajı: ‘Her gün bir tuğla.’",
        reflection:
          "Bugün tuğlam ne?",
      },
      en: {
        title: "66 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Steppe: simple power." + NL +
          "• Brick: small step." + NL +
          "• Wall: protection." + NL +
          "• Clock: rhythm." + N2 +
          "Symbol message: ‘One brick a day.’",
        reflection:
          "What is my brick today?",
      },
    },

    ritual: {
      tr: {
        title: "66 · Ritüel",
        story:
          "66 Dakika Ritüeli (Tuğla Koy):" + N2 +
          "1) Bugün inşa edeceğin 1 alan seç." + NL +
          "2) 6 küçük adım yaz." + NL +
          "3) 60 dakika tek bir adımı uygula." + N2 +
          "Kapanış: ‘Bugün tuğlamı koydum.’",
        reflection:
          "Bugün hangi tek adımı gerçekten yaptım?",
      },
      en: {
        title: "66 · Ritual",
        story:
          "66-Minute Ritual (Place the Brick):" + N2 +
          "1) Choose one area to build today." + NL +
          "2) Write 6 small steps." + NL +
          "3) Execute one step for 60 minutes." + N2 +
          "Closing: ‘I placed my brick today.’",
        reflection:
          "Which one step did I truly do today?",
      },
    },

    lab: {
      tr: {
        title: "66 · LAB: Protective Structure Engine",
        story:
          "Kod Gözü: Sorumluluk / Sistem / Ritim" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Her şeyi ben yaparım’" + NL +
          "• ‘Dinlenirsem düşer’" + N2 +
          "Rewrite:" + NL +
          "• ‘Sistem kurarım’" + NL +
          "• ‘Ritimle büyürüm’",
        reflection:
          "Tek cümle yaz: Bugün sistemi nasıl kuruyorsun?",
      },
      en: {
        title: "66 · LAB: Protective Structure Engine",
        story:
          "Code Eye: Responsibility / System / Rhythm" + N2 +
          "Rule Engine:" + NL +
          "• ‘I do everything’" + NL +
          "• ‘If I rest, I fall behind’" + N2 +
          "Rewrite:" + NL +
          "• ‘I build a system’" + NL +
          "• ‘I grow through rhythm’",
        reflection:
          "Write one sentence: How do you build your system today?",
      },
    },
  },
};
export const CITY_67: Record<CityCode, City7> = {
  "67": {
    city: "Zonguldak",

    base: {
      tr: {
        title: "67 · Maden",
        story:
          "Zonguldak bir şehir değil—karanlıkta saklı değerin madenidir." + N2 +
          "Bu kapı sana şunu öğretir: Karanlık kötü değildir; derindir." + N2 +
          "67’nin enerjisi yer altı gibi çalışır: görünmeyeni saklar, sonra emeğe değer verir." + N2 +
          "Zonguldak’ın mesajı: ‘Korkma, kaz.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Gölgeye inen, ışığı daha gerçek taşır.",
        reflection:
          "Bugün hangi gölgeme inip değer çıkarıyorum?",
      },
      en: {
        title: "67 · Mine",
        story:
          "Zonguldak is not only a city—it is the mine of value hidden in darkness." + N2 +
          "This gate teaches: darkness is not evil; it is depth." + N2 +
          "67 works like underground: it stores the unseen, then rewards effort." + N2 +
          "Zonguldak’s message: ‘Don’t fear—dig.’" + N2 +
          "Know this: the one who descends into shadow carries light more truly.",
        reflection:
          "Which shadow am I entering today to extract value?",
      },
    },

    deepC: {
      tr: {
        title: "67 · Matrix Derin İfşa",
        story:
          "Sistem 67’yi ‘gölge-çıkarma protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 7 = iç görüş. 67 = iç görüşle sorumluluk almak." + N2 +
          "Gölge test: Korkup yüzeyde kalmak." + NL +
          "Işık test: Korkuyu veri yapıp derine inmek." + N2 +
          "67 sana şunu söyler: En büyük hazine, en korktuğun odanın içindedir." + N2 +
          "Bu kapı, gölgeyi düşman olmaktan çıkarır: hammadde yapar.",
        reflection:
          "Ben bugün korkuyu nasıl veriye çeviriyorum?",
      },
      en: {
        title: "67 · Deep Matrix Reveal",
        story:
          "The system runs 67 as a ‘shadow-extraction protocol.’" + N2 +
          "6 = responsibility, 7 = inner sight. 67 is taking responsibility through inner sight." + N2 +
          "Shadow test: staying on the surface out of fear." + NL +
          "Light test: turning fear into data and going deeper." + N2 +
          "67 says: the biggest treasure is inside the room you fear most." + N2 +
          "This gate turns shadow from enemy into raw material.",
        reflection:
          "How do I turn fear into data today?",
      },
    },

    history: {
      tr: {
        title: "67 · Tarih Katmanı",
        story:
          "Zonguldak, emek ve maden hafızası taşır." + N2 +
          "Tarih katmanı şunu öğretir: Değer, yerin üstünde değil; yerin altında hazırlanır." + N2 +
          "İnsanın değeri de bazen görünmez emekten doğar." + N2 +
          "Bu katman, ‘emek = değer’ dersini bırakır: kazdığın kadar parlıyorsun.",
        reflection:
          "Benim görünmeyen emeğim nerede?",
      },
      en: {
        title: "67 · History Layer",
        story:
          "Zonguldak carries the memory of labor and mining." + N2 +
          "This layer teaches: value is prepared not on the surface, but underground." + N2 +
          "Your value is also often born from invisible labor." + N2 +
          "It leaves the lesson: effort becomes value—you shine as deep as you dig.",
        reflection:
          "Where is my invisible labor today?",
      },
    },

    numerology: {
      tr: {
        title: "67 · Numeroloji",
        story:
          "67 = içe iniş / gölgeyle çalışma / gerçek güç." + N2 +
          "67’nin gölgesi:" + NL +
          "• kaçınma" + NL +
          "• erteleme" + N2 +
          "67’nin ışığı:" + NL +
          "• cesaret" + NL +
          "• iç görüş" + NL +
          "• dönüşüm" + N2 +
          "Bu kapı sorar: ‘Ne kadar derine inebilirsin?’",
        reflection:
          "Bugün derinliğim ne kadar?",
      },
      en: {
        title: "67 · Numerology",
        story:
          "67 = descent / shadow work / real power." + N2 +
          "Shadow of 67:" + NL +
          "• avoidance" + NL +
          "• procrastination" + N2 +
          "Light of 67:" + NL +
          "• courage" + NL +
          "• inner sight" + NL +
          "• transformation" + N2 +
          "This gate asks: ‘How deep can you go?’",
        reflection:
          "How deep am I willing to go today?",
      },
    },

    symbols: {
      tr: {
        title: "67 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Maden ocağı: içe iniş." + NL +
          "• Kask lambası: karanlıkta ışık." + NL +
          "• Kömür: sıkışmış enerji." + NL +
          "• Elmas: dönüşmüş kömür." + N2 +
          "Sembol mesajı: ‘Kömür elmasa dönüşür.’",
        reflection:
          "Benim kömürüm ne—hangi baskı beni elmasa çevirdi?",
      },
      en: {
        title: "67 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Mine shaft: descent." + NL +
          "• Helmet lamp: light in darkness." + NL +
          "• Coal: compressed energy." + NL +
          "• Diamond: transformed coal." + N2 +
          "Symbol message: ‘Coal becomes diamond.’",
        reflection:
          "What is my coal—and which pressure is turning it into diamond?",
      },
    },

    ritual: {
      tr: {
        title: "67 · Ritüel",
        story:
          "67 Dakika Ritüeli (Gölge Madeni):" + N2 +
          "1) Bir korkunu yaz (tek cümle)." + NL +
          "2) Altına 3 veri yaz: ‘Bu korku bana ne söylüyor?’" + NL +
          "3) 67 nefes al. Son nefeste söyle: ‘Kazıyorum.’" + N2 +
          "Kapanış: ‘Gölge = hammadde.’",
        reflection:
          "Bugün hangi korkuyu veriye çeviriyorum?",
      },
      en: {
        title: "67 · Ritual",
        story:
          "67-Minute Ritual (Shadow Mine):" + N2 +
          "1) Write one fear (one sentence)." + NL +
          "2) Write 3 data points: ‘What is this fear telling me?’" + NL +
          "3) Take 67 breaths. On the last say: ‘I dig.’" + N2 +
          "Closing: ‘Shadow is raw material.’",
        reflection:
          "Which fear am I turning into data today?",
      },
    },

    lab: {
      tr: {
        title: "67 · LAB: Shadow-to-Value Engine",
        story:
          "Kod Gözü: Gölge / Değer / Dönüşüm" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Karanlık = tehlike’" + NL +
          "• ‘Kaç = güven’" + N2 +
          "Rewrite:" + NL +
          "• ‘Karanlık = derinlik’" + NL +
          "• ‘Derinlik = değer’",
        reflection:
          "Tek cümle yaz: Bugün karanlığı nasıl derinliğe çeviriyorsun?",
      },
      en: {
        title: "67 · LAB: Shadow-to-Value Engine",
        story:
          "Code Eye: Shadow / Value / Transformation" + N2 +
          "Rule Engine:" + NL +
          "• ‘Darkness = danger’" + NL +
          "• ‘Escape = safety’" + N2 +
          "Rewrite:" + NL +
          "• ‘Darkness = depth’" + NL +
          "• ‘Depth = value’",
        reflection:
          "Write one sentence: How do you turn darkness into depth today?",
      },
    },
  },
};
export const CITY_68: Record<CityCode, City7> = {
  "68": {
    city: "Aksaray",

    base: {
      tr: {
        title: "68 · Yol",
        story:
          "Aksaray bir şehir değil—yolun disiplinidir." + N2 +
          "Bu kapı sana şunu öğretir: Geçiş, şansla değil; hazırlıkla olur." + N2 +
          "68’in enerjisi ‘kervan’ gibi çalışır: ritim, düzen, dayanıklılık." + N2 +
          "Aksaray’ın mesajı: ‘Yolda kalma; yolu yönet.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Yol seni değiştirecek—ama sen de yolu seçebilirsin.",
        reflection:
          "Bugün yolumu hangi kararla netleştiriyorum?",
      },
      en: {
        title: "68 · Path",
        story:
          "Aksaray is not only a city—it is discipline of the road." + N2 +
          "This gate teaches: transitions happen not by luck, but by preparation." + N2 +
          "68 works like a caravan: rhythm, order, endurance." + N2 +
          "Aksaray’s message: ‘Don’t get stuck on the road—manage the road.’" + N2 +
          "Know this: the road will change you, but you can choose the road too.",
        reflection:
          "Which decision clarifies my path today?",
      },
    },

    deepC: {
      tr: {
        title: "68 · Matrix Derin İfşa",
        story:
          "Sistem 68’i ‘rota ve yük protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 8 = güç. 68 = gücü sorumlulukla taşımak." + N2 +
          "Gölge test: Yükü plansız taşımak ve dağılmak." + NL +
          "Işık test: Yükü bölmek, rotayı planlamak." + N2 +
          "68 sana şunu söyler: Güç, çok taşımak değil; doğru taşımaktır." + N2 +
          "Bu kapı, ‘hedefsiz koşu’yu ‘planlı yürüyüş’e çevirir.",
        reflection:
          "Ben bugün neyi gereksiz taşıyorum?",
      },
      en: {
        title: "68 · Deep Matrix Reveal",
        story:
          "The system runs 68 as a ‘route and load protocol.’" + N2 +
          "6 = responsibility, 8 = power. 68 is carrying power with responsibility." + N2 +
          "Shadow test: carrying load without plan and scattering." + NL +
          "Light test: splitting load, planning the route." + N2 +
          "68 says: power is not carrying more; it is carrying right." + N2 +
          "This gate turns aimless running into planned walking.",
        reflection:
          "What am I carrying unnecessarily today?",
      },
    },

    history: {
      tr: {
        title: "68 · Tarih Katmanı",
        story:
          "Aksaray, geçiş yollarının ve kervan kültürünün hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Yol üzerinde olan, düzen kurmazsa kaybolur." + N2 +
          "Kervan; plan, paylaşım ve sabırdır." + N2 +
          "Bu katman, ‘yol = sistem’ dersini bırakır.",
        reflection:
          "Ben yolculuğum için hangi sistemi kuruyorum?",
      },
      en: {
        title: "68 · History Layer",
        story:
          "Aksaray carries the memory of transit routes and caravan culture." + N2 +
          "This layer teaches: if you are on the road without order, you get lost." + N2 +
          "A caravan is plan, sharing, and patience." + N2 +
          "It leaves the lesson: road requires system.",
        reflection:
          "What system am I building for my journey today?",
      },
    },

    numerology: {
      tr: {
        title: "68 · Numeroloji",
        story:
          "68 = disiplinli güç / planlı yol." + N2 +
          "68’in gölgesi:" + NL +
          "• plansızlık" + NL +
          "• aşırı yük" + N2 +
          "68’in ışığı:" + NL +
          "• plan" + NL +
          "• seçicilik" + NL +
          "• güçlü yürüyüş" + N2 +
          "Bu kapı sorar: ‘Rota net mi?’",
        reflection:
          "Bugün rotamı netleştiren 1 şey ne?",
      },
      en: {
        title: "68 · Numerology",
        story:
          "68 = disciplined power / planned path." + N2 +
          "Shadow of 68:" + NL +
          "• lack of plan" + NL +
          "• overload" + N2 +
          "Light of 68:" + NL +
          "• plan" + NL +
          "• selectivity" + NL +
          "• strong walk" + N2 +
          "This gate asks: ‘Is the route clear?’",
        reflection:
          "What one thing clarifies my route today?",
      },
    },

    symbols: {
      tr: {
        title: "68 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kervan: planlı yürüyüş." + NL +
          "• Harita: rota." + NL +
          "• Yük torbası: sorumluluk." + NL +
          "• Yol taşı: sınır işareti." + N2 +
          "Sembol mesajı: ‘Yükünü azalt, yolun açılır.’",
        reflection:
          "Bugün hangi yükü azaltıyorum?",
      },
      en: {
        title: "68 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Caravan: planned walking." + NL +
          "• Map: route." + NL +
          "• Bag: responsibility." + NL +
          "• Milestone: boundary marker." + N2 +
          "Symbol message: ‘Reduce the load, the road opens.’",
        reflection:
          "What load am I reducing today?",
      },
    },

    ritual: {
      tr: {
        title: "68 · Ritüel",
        story:
          "68 Dakika Ritüeli (Rota Planı):" + N2 +
          "1) Bugün hedefini yaz." + NL +
          "2) Hedefe giden 3 adım yaz." + NL +
          "3) Taşıdığın 8 yükü yaz, 2 tanesini bırak." + N2 +
          "4) 68 nefes al. Son nefeste söyle: ‘Yürüyorum.’" + N2 +
          "Kapanış: ‘Rota net.’",
        reflection:
          "Bugün hangi iki yükü bırakıyorum?",
      },
      en: {
        title: "68 · Ritual",
        story:
          "68-Minute Ritual (Route Plan):" + N2 +
          "1) Write your goal for today." + NL +
          "2) Write 3 steps toward it." + NL +
          "3) List 8 loads you carry, drop 2." + N2 +
          "4) Take 68 breaths. On the last say: ‘I walk.’" + N2 +
          "Closing: ‘My route is clear.’",
        reflection:
          "Which two loads am I dropping today?",
      },
    },

    lab: {
      tr: {
        title: "68 · LAB: Route Engine",
        story:
          "Kod Gözü: Rota / Yük / Plan" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Ne gelirse yaparım’" + NL +
          "• ‘Yük = normal’" + N2 +
          "Rewrite:" + NL +
          "• ‘Seçerim’" + NL +
          "• ‘Az yük = hız’",
        reflection:
          "Tek cümle yaz: Bugün yolunu nasıl seçiyorsun?",
      },
      en: {
        title: "68 · LAB: Route Engine",
        story:
          "Code Eye: Route / Load / Plan" + N2 +
          "Rule Engine:" + NL +
          "• ‘I’ll do whatever comes’" + NL +
          "• ‘Load is normal’" + N2 +
          "Rewrite:" + NL +
          "• ‘I choose’" + NL +
          "• ‘Less load = speed’",
        reflection:
          "Write one sentence: How do you choose your road today?",
      },
    },
  },
};
export const CITY_69: Record<CityCode, City7> = {
  "69": {
    city: "Bayburt",

    base: {
      tr: {
        title: "69 · Kale",
        story:
          "Bayburt bir şehir değil—küçük ama sağlam bir kaledir." + N2 +
          "Bu kapı sana şunu öğretir: Büyüklük, hacim değil; dayanıklılıktır." + N2 +
          "69’un enerjisi ‘az ama net’ çalışır: sessiz, sert, koruyucu." + N2 +
          "Bayburt’un mesajı: ‘Az görün, güçlü kal.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Kendini korumak bazen geri çekilmek değil, sağlam durmaktır.",
        reflection:
          "Bugün hangi değeri kale gibi koruyorum?",
      },
      en: {
        title: "69 · Fortress",
        story:
          "Bayburt is not only a city—it is a small yet solid fortress." + N2 +
          "This gate teaches: greatness is not size; it is endurance." + N2 +
          "69 works as ‘less but clear’: quiet, firm, protective." + N2 +
          "Bayburt’s message: ‘Look small, stay strong.’" + N2 +
          "Know this: protection is not retreating; it is standing solid.",
        reflection:
          "Which value am I protecting like a fortress today?",
      },
    },

    deepC: {
      tr: {
        title: "69 · Matrix Derin İfşa",
        story:
          "Sistem 69’u ‘koruma-kapanış protokolü’ olarak çalıştırır." + N2 +
          "6 = sorumluluk, 9 = kapanış. 69 = sorumluluğu tamamlayıp sınırı güçlendirmek." + N2 +
          "Gölge test: Kapanıp duvar olmak." + NL +
          "Işık test: Seçici kapı olmak." + N2 +
          "69 sana şunu söyler: Duvar olmak yalnızlaştırır; kapı olmak yönetir." + N2 +
          "Bu kapı, ‘koruma’ ile ‘izolasyon’ arasını ayırır.",
        reflection:
          "Ben kapı mıyım, duvar mı?",
      },
      en: {
        title: "69 · Deep Matrix Reveal",
        story:
          "The system runs 69 as a ‘protection-closure protocol.’" + N2 +
          "6 = responsibility, 9 = closure. 69 is completing responsibility and strengthening boundaries." + N2 +
          "Shadow test: becoming a wall and closing." + NL +
          "Light test: becoming a selective gate." + N2 +
          "69 says: being a wall isolates you; being a gate lets you govern." + N2 +
          "This gate separates protection from isolation.",
        reflection:
          "Am I a gate—or a wall?",
      },
    },

    history: {
      tr: {
        title: "69 · Tarih Katmanı",
        story:
          "Bayburt, kalenin ve geçidin hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Zor coğrafyada yaşayan, fazlalığı azaltır; özü korur." + N2 +
          "Bu katman, ‘az = güç’ dersini bırakır." + N2 +
          "Kale, gösteriş için değil; hayatta kalmak için vardır.",
        reflection:
          "Benim hayatımda hangi fazlalık kale duvarımı zayıflatıyor?",
      },
      en: {
        title: "69 · History Layer",
        story:
          "Bayburt carries the memory of fortress and passage." + N2 +
          "This layer teaches: in harsh geography, people reduce excess and protect essence." + N2 +
          "It leaves the lesson: less can be power." + N2 +
          "A fortress exists not for show, but for survival.",
        reflection:
          "What excess weakens my inner fortress today?",
      },
    },

    numerology: {
      tr: {
        title: "69 · Numeroloji",
        story:
          "69 = koruma / kapanış / seçicilik." + N2 +
          "69’un gölgesi:" + NL +
          "• izolasyon" + NL +
          "• sertleşme" + N2 +
          "69’un ışığı:" + NL +
          "• net sınır" + NL +
          "• seçici yakınlık" + NL +
          "• olgun korunma" + N2 +
          "Bu kapı sorar: ‘Neyi içeri alıyorsun?’",
        reflection:
          "Bugün hangi enerjiyi içeri almıyorum?",
      },
      en: {
        title: "69 · Numerology",
        story:
          "69 = protection / closure / selectivity." + N2 +
          "Shadow of 69:" + NL +
          "• isolation" + NL +
          "• hardening" + N2 +
          "Light of 69:" + NL +
          "• clear boundaries" + NL +
          "• selective intimacy" + NL +
          "• mature protection" + N2 +
          "This gate asks: ‘What do you let in?’",
        reflection:
          "Which energy am I not letting in today?",
      },
    },

    symbols: {
      tr: {
        title: "69 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kale: koruma." + NL +
          "• Kapı: yönetim." + NL +
          "• Taş: dayanıklılık." + NL +
          "• Anahtar: seçim." + N2 +
          "Sembol mesajı: ‘Azalt, güçlen.’",
        reflection:
          "Bugün hangi şeyi azaltıyorum?",
      },
      en: {
        title: "69 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Fortress: protection." + NL +
          "• Gate: governance." + NL +
          "• Stone: endurance." + NL +
          "• Key: choice." + N2 +
          "Symbol message: ‘Reduce to strengthen.’",
        reflection:
          "What am I reducing today?",
      },
    },

    ritual: {
      tr: {
        title: "69 · Ritüel",
        story:
          "69 Dakika Ritüeli (Kapı Seçimi):" + N2 +
          "1) Bugün 9 şeyi yaz: yük, gürültü, gereksiz." + NL +
          "2) 6 tanesini ele." + NL +
          "3) 69 nefes al. Son nefeste söyle: ‘Korumayı seçiyorum.’" + N2 +
          "Kapanış: ‘Kapıyım.’",
        reflection:
          "Bugün hangi 6 şeyi bırakıyorum?",
      },
      en: {
        title: "69 · Ritual",
        story:
          "69-Minute Ritual (Gate Choice):" + N2 +
          "1) List 9 things: load, noise, unnecessary." + NL +
          "2) Eliminate 6 of them." + NL +
          "3) Take 69 breaths. On the last say: ‘I choose protection.’" + N2 +
          "Closing: ‘I am a gate.’",
        reflection:
          "Which 6 things am I releasing today?",
      },
    },

    lab: {
      tr: {
        title: "69 · LAB: Gatekeeper Engine",
        story:
          "Kod Gözü: Koruma / Seçim / Sınır" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Kapan = güvende’" + NL +
          "• ‘Açık = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Seçici açık = güven’" + NL +
          "• ‘Net sınır = huzur’",
        reflection:
          "Tek cümle yaz: Bugün seçici açıklığı nasıl kuruyorsun?",
      },
      en: {
        title: "69 · LAB: Gatekeeper Engine",
        story:
          "Code Eye: Protection / Choice / Boundary" + N2 +
          "Rule Engine:" + NL +
          "• ‘Close = safe’" + NL +
          "• ‘Open = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘Selectively open = safe’" + NL +
          "• ‘Clear boundary = peace’",
        reflection:
          "Write one sentence: How do you build selective openness today?",
      },
    },
  },
};
export const CITY_70: Record<CityCode, City7> = {
  "70": {
    city: "Karaman",

    base: {
      tr: {
        title: "70 · Öz Söz",
        story:
          "Karaman bir şehir değil—öz sözün köküdür." + N2 +
          "Bu kapı sana şunu öğretir: Dil, sadece konuşmak değil; yaratmaktır." + N2 +
          "70’in enerjisi ‘sade iletişim’ taşır: az kelime, net niyet." + N2 +
          "Karaman’ın mesajı: ‘Sözü temizle.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Sözün netse kaderin netleşir.",
        reflection:
          "Bugün hangi cümleyi netleştiriyorum?",
      },
      en: {
        title: "70 · True Word",
        story:
          "Karaman is not only a city—it is the root of true word." + N2 +
          "This gate teaches: language is not only speaking; it is creating." + N2 +
          "70 carries ‘simple communication’: fewer words, clearer intention." + N2 +
          "Karaman’s message: ‘Clean your words.’" + N2 +
          "Know this: when your words are clear, your destiny becomes clear.",
        reflection:
          "Which sentence am I clarifying today?",
      },
    },

    deepC: {
      tr: {
        title: "70 · Matrix Derin İfşa",
        story:
          "Sistem 70’i ‘söz-kod protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 0 = alan. 70 = iç görüşle alanı sözle programlamak." + N2 +
          "Gölge test: Sözü dağınık kullanıp enerjiyi sızdırmak." + NL +
          "Işık test: Sözü netleştirip enerjiyi toplamak." + N2 +
          "70 sana şunu söyler: Şikâyet bir kod yazımıdır; niyet de bir kod yazımıdır." + N2 +
          "Bu kapı, şikâyeti niyete çevirir: ‘Neyi seçiyorum?’",
        reflection:
          "Ben bugün hangi şikâyeti niyete çeviriyorum?",
      },
      en: {
        title: "70 · Deep Matrix Reveal",
        story:
          "The system runs 70 as a ‘word-code protocol.’" + N2 +
          "7 = inner sight, 0 = field. 70 is programming the field through words guided by inner sight." + N2 +
          "Shadow test: using scattered words and leaking energy." + NL +
          "Light test: clarifying words and gathering energy." + N2 +
          "70 says: complaint is code-writing; intention is also code-writing." + N2 +
          "This gate turns complaint into intention: ‘What do I choose?’",
        reflection:
          "Which complaint am I turning into intention today?",
      },
    },

    history: {
      tr: {
        title: "70 · Tarih Katmanı",
        story:
          "Karaman, dil ve kök hafızası taşır: sözün kimlik olması." + N2 +
          "Tarih katmanı şunu öğretir: Dil, bir milletin omurgasıdır; insanın dili de insanın omurgasıdır." + N2 +
          "Bu katman, ‘söz = duruş’ dersini bırakır." + N2 +
          "Sözün temizse, duruşun sağlam olur.",
        reflection:
          "Benim dilim duruşumu güçlendiriyor mu?",
      },
      en: {
        title: "70 · History Layer",
        story:
          "Karaman carries memory of language and roots: words becoming identity." + N2 +
          "This layer teaches: language is the spine of a nation—and your language is the spine of your life." + N2 +
          "It leaves the lesson: word becomes stance." + N2 +
          "When words are clean, stance becomes solid.",
        reflection:
          "Do my words strengthen my stance today?",
      },
    },

    numerology: {
      tr: {
        title: "70 · Numeroloji",
        story:
          "70 = söz / netlik / iç program." + N2 +
          "70’in gölgesi:" + NL +
          "• boş konuşma" + NL +
          "• şikâyet dili" + N2 +
          "70’in ışığı:" + NL +
          "• net niyet" + NL +
          "• temiz iletişim" + NL +
          "• bilinçli kelime" + N2 +
          "Bu kapı sorar: ‘Sözün neyi büyütüyor?’",
        reflection:
          "Bugün sözüm hangi duyguyu büyütüyor?",
      },
      en: {
        title: "70 · Numerology",
        story:
          "70 = word / clarity / inner program." + N2 +
          "Shadow of 70:" + NL +
          "• empty talk" + NL +
          "• complaint language" + N2 +
          "Light of 70:" + NL +
          "• clear intention" + NL +
          "• clean communication" + NL +
          "• conscious word" + N2 +
          "This gate asks: ‘What does your word amplify?’",
        reflection:
          "Which emotion is my language amplifying today?",
      },
    },

    symbols: {
      tr: {
        title: "70 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Dil: yaratım." + NL +
          "• Mühür: sözün etkisi." + NL +
          "• Kalem: niyet yazımı." + NL +
          "• Sessizlik: sözün temizliği." + N2 +
          "Sembol mesajı: ‘Sözü seç, kaderi seç.’",
        reflection:
          "Benim mühür cümlem ne?",
      },
      en: {
        title: "70 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Tongue: creation." + NL +
          "• Seal: impact of words." + NL +
          "• Pen: writing intention." + NL +
          "• Silence: cleansing words." + N2 +
          "Symbol message: ‘Choose your words, choose your destiny.’",
        reflection:
          "What is my sealing sentence today?",
      },
    },

    ritual: {
      tr: {
        title: "70 · Ritüel",
        story:
          "70 Dakika Ritüeli (Söz Temizliği):" + N2 +
          "1) 10 dakika sessiz kal." + NL +
          "2) 30 dakika yaz: ‘Şikâyet ettiğim şey…’" + NL +
          "3) 30 dakika yaz: ‘Bunun yerine seçtiğim şey…’" + N2 +
          "Kapanış: ‘Sözüm temiz.’",
        reflection:
          "Bugün hangi seçimi sözle mühürlüyorum?",
      },
      en: {
        title: "70 · Ritual",
        story:
          "70-Minute Ritual (Word Cleansing):" + N2 +
          "1) Stay silent for 10 minutes." + NL +
          "2) Write for 30 minutes: ‘What I complain about…’" + NL +
          "3) Write for 30 minutes: ‘What I choose instead…’" + N2 +
          "Closing: ‘My words are clean.’",
        reflection:
          "Which choice am I sealing with words today?",
      },
    },

    lab: {
      tr: {
        title: "70 · LAB: Word Engine",
        story:
          "Kod Gözü: Söz / Niyet / Program" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Şikâyet = rahatlatır’" + NL +
          "• ‘Rahatlatır = doğru’" + N2 +
          "Rewrite:" + NL +
          "• ‘Niyet = güç’" + NL +
          "• ‘Güç = yaratım’",
        reflection:
          "Tek cümle yaz: Bugün hangi niyeti konuşuyorsun?",
      },
      en: {
        title: "70 · LAB: Word Engine",
        story:
          "Code Eye: Word / Intention / Program" + N2 +
          "Rule Engine:" + NL +
          "• ‘Complaint = relief’" + NL +
          "• ‘Relief = right’" + N2 +
          "Rewrite:" + NL +
          "• ‘Intention = power’" + NL +
          "• ‘Power = creation’",
        reflection:
          "Write one sentence: Which intention are you speaking today?",
      },
    },
  },
};
export const CITY_71: Record<CityCode, City7> = {
  "71": {
    city: "Kirikkale",

    base: {
      tr: {
        title: "71 · Çelik",
        story:
          "Kırıkkale bir şehir değil—çeliğin disiplinidir." + N2 +
          "Bu kapı sana şunu öğretir: Güç, sertlik değil; kontrol edilebilir netliktir." + N2 +
          "71’in enerjisi ‘keskin odak’ taşır: dağınıklığı keser, yönü netleştirir." + N2 +
          "Kırıkkale’nin mesajı: ‘Dağılma, keskinleş.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Keskinlik saldırı değildir; doğruluk çizgisidir.",
        reflection:
          "Bugün odağımı hangi noktada keskinleştiriyorum?",
      },
      en: {
        title: "71 · Steel",
        story:
          "Kirikkale is not only a city—it is the discipline of steel." + N2 +
          "This gate teaches: power is not harshness; it is controllable clarity." + N2 +
          "71 carries ‘sharp focus’: it cuts scattering and clarifies direction." + N2 +
          "Kirikkale’s message: ‘Don’t scatter—sharpen.’" + N2 +
          "Know this: sharpness is not attack; it is a line of truth.",
        reflection:
          "Where am I sharpening my focus today?",
      },
    },

    deepC: {
      tr: {
        title: "71 · Matrix Derin İfşa",
        story:
          "Sistem 71’i ‘odak protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 1 = irade. 71 = iç görüşle iradeyi netleştirmek." + N2 +
          "Gölge test: Gücü baskıya çevirmek." + NL +
          "Işık test: Gücü yön ve disipline çevirmek." + N2 +
          "71 sana şunu söyler: Keskinlik, kırmak için değil; şekil vermek içindir." + N2 +
          "Bu kapı, enerjiyi tek hatta toplar: sonuç üretir.",
        reflection:
          "Ben gücümü baskı mı yapıyorum, yön mü yapıyorum?",
      },
      en: {
        title: "71 · Deep Matrix Reveal",
        story:
          "The system runs 71 as a ‘focus protocol.’" + N2 +
          "7 = inner sight, 1 = will. 71 is clarifying will through inner sight." + N2 +
          "Shadow test: turning power into pressure." + NL +
          "Light test: turning power into direction and discipline." + N2 +
          "71 says: sharpness is not to break—it is to shape." + N2 +
          "This gate gathers energy into one line: it produces results.",
        reflection:
          "Am I turning my power into pressure—or into direction today?",
      },
    },

    history: {
      tr: {
        title: "71 · Tarih Katmanı",
        story:
          "Kırıkkale, üretim hattı hafızası taşır: düzen, ölçü, disiplin." + N2 +
          "Tarih katmanı şunu öğretir: Sistem kurmadan güç tehlikeye dönüşür." + N2 +
          "Güç, yönle birleşince koruma olur." + N2 +
          "Bu katman, ‘disiplin = güven’ dersini bırakır.",
        reflection:
          "Benim hayatımda güven hangi disiplinle geliyor?",
      },
      en: {
        title: "71 · History Layer",
        story:
          "Kirikkale carries the memory of production lines: order, measure, discipline." + N2 +
          "This layer teaches: power without system becomes danger." + N2 +
          "Power becomes protection when joined with direction." + N2 +
          "It leaves the lesson: discipline creates safety.",
        reflection:
          "Which discipline brings safety into my life today?",
      },
    },

    numerology: {
      tr: {
        title: "71 · Numeroloji",
        story:
          "71 = net irade / odak / disiplin." + N2 +
          "71’in gölgesi:" + NL +
          "• sertlik" + NL +
          "• kontrol takıntısı" + N2 +
          "71’in ışığı:" + NL +
          "• odak" + NL +
          "• sınır" + NL +
          "• doğru yön" + N2 +
          "Bu kapı sorar: ‘Tek hedefin ne?’",
        reflection:
          "Bugün tek hedefim ne?",
      },
      en: {
        title: "71 · Numerology",
        story:
          "71 = clear will / focus / discipline." + N2 +
          "Shadow of 71:" + NL +
          "• harshness" + NL +
          "• control obsession" + N2 +
          "Light of 71:" + NL +
          "• focus" + NL +
          "• boundary" + NL +
          "• right direction" + N2 +
          "This gate asks: ‘What is your single target?’",
        reflection:
          "What is my single target today?",
      },
    },

    symbols: {
      tr: {
        title: "71 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Çelik: disiplin." + NL +
          "• Bıçak: keskin seçim." + NL +
          "• Çizgi: yön." + NL +
          "• Ölçü: denge." + N2 +
          "Sembol mesajı: ‘Kes, sadeleş, hızlan.’",
        reflection:
          "Bugün neyi kesersem sadeleşirim?",
      },
      en: {
        title: "71 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Steel: discipline." + NL +
          "• Blade: sharp choice." + NL +
          "• Line: direction." + NL +
          "• Measure: balance." + N2 +
          "Symbol message: ‘Cut, simplify, accelerate.’",
        reflection:
          "What do I need to cut to simplify today?",
      },
    },

    ritual: {
      tr: {
        title: "71 · Ritüel",
        story:
          "71 Dakika Ritüeli (Tek Hedef):" + N2 +
          "1) Bugün 7 hedef yaz." + NL +
          "2) 1 hedef seç." + NL +
          "3) O hedef için 3 adım yaz." + NL +
          "4) 71 nefes al. Son nefeste söyle: ‘Netim.’" + N2 +
          "Kapanış: ‘Odak = güç.’",
        reflection:
          "Bugün tek hedefimi hangi adımla başlatıyorum?",
      },
      en: {
        title: "71 · Ritual",
        story:
          "71-Minute Ritual (Single Target):" + N2 +
          "1) List 7 goals." + NL +
          "2) Choose 1." + NL +
          "3) Write 3 steps for it." + NL +
          "4) Take 71 breaths. On the last say: ‘I am clear.’" + N2 +
          "Closing: ‘Focus is power.’",
        reflection:
          "Which step starts my single target today?",
      },
    },

    lab: {
      tr: {
        title: "71 · LAB: Focus Engine",
        story:
          "Kod Gözü: Odak / Disiplin / Net İrade" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Her şeyi yapmalıyım’" + NL +
          "• ‘Çok = değer’" + N2 +
          "Rewrite:" + NL +
          "• ‘Tek hedef = değer’" + NL +
          "• ‘Odak = hız’",
        reflection:
          "Tek cümle yaz: Bugün ‘çok’ yerine ‘tek’i nasıl seçiyorsun?",
      },
      en: {
        title: "71 · LAB: Focus Engine",
        story:
          "Code Eye: Focus / Discipline / Clear Will" + N2 +
          "Rule Engine:" + NL +
          "• ‘I must do everything’" + NL +
          "• ‘More = value’" + N2 +
          "Rewrite:" + NL +
          "• ‘Single target = value’" + NL +
          "• ‘Focus = speed’",
        reflection:
          "Write one sentence: How do you choose ‘one’ over ‘many’ today?",
      },
    },
  },
};
export const CITY_72: Record<CityCode, City7> = {
  "72": {
    city: "Batman",

    base: {
      tr: {
        title: "72 · Ham Güç",
        story:
          "Batman bir şehir değil—ham gücün yer altı enerjisidir." + N2 +
          "Bu kapı sana şunu öğretir: Ham güç tehlikeli olabilir; arıtılırsa ışık olur." + N2 +
          "72’nin enerjisi ‘yakıt’ gibidir: doğru yönetilirse hız verir, yanlış yönetilirse yakar." + N2 +
          "Batman’ın mesajı: ‘Gücünü arıt.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Enerji senin düşmanın değil; yönsüz kaldığında felakettir.",
        reflection:
          "Bugün hangi ham enerjimi bilinçle yöneteceğim?",
      },
      en: {
        title: "72 · Raw Power",
        story:
          "Batman is not only a city—it is underground energy of raw power." + N2 +
          "This gate teaches: raw power can be dangerous; refined, it becomes light." + N2 +
          "72 works like fuel: managed well it accelerates you, managed poorly it burns you." + N2 +
          "Batman’s message: ‘Refine your power.’" + N2 +
          "Know this: energy is not your enemy—when directionless, it becomes disaster.",
        reflection:
          "Which raw energy will I steer consciously today?",
      },
    },

    deepC: {
      tr: {
        title: "72 · Matrix Derin İfşa",
        story:
          "Sistem 72’yi ‘enerji arıtma protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 2 = denge. 72 = iç görüşle denge kurmak." + N2 +
          "Gölge test: Öfkeyi yakıt sanıp her şeyi yakmak." + NL +
          "Işık test: Öfkeyi yön yapmak." + N2 +
          "72 sana şunu söyler: Ham enerji, arıtılmadığında gölge üretir." + N2 +
          "Bu kapı, gölgeyi arıtır: niyet, sınır, disiplin.",
        reflection:
          "Ben öfkeyi bugün yakıt mı yapıyorum, yön mü?",
      },
      en: {
        title: "72 · Deep Matrix Reveal",
        story:
          "The system runs 72 as an ‘energy refinement protocol.’" + N2 +
          "7 = inner sight, 2 = balance. 72 is balancing through inner sight." + N2 +
          "Shadow test: treating anger as fuel and burning everything." + NL +
          "Light test: turning anger into direction." + N2 +
          "72 says: raw energy creates shadow when unrefined." + N2 +
          "This gate refines shadow through intention, boundaries, and discipline.",
        reflection:
          "Am I using anger as fuel—or as direction today?",
      },
    },

    history: {
      tr: {
        title: "72 · Tarih Katmanı",
        story:
          "Batman, enerji üretiminin hafızasını taşır: yer altından çıkan güç." + N2 +
          "Tarih katmanı şunu öğretir: Yer altı zenginliği, yönetilmezse zarar üretir." + N2 +
          "İnsanın içindeki enerji de böyledir: yönetilirse hayat verir." + N2 +
          "Bu katman, ‘güç = sorumluluk’ dersini bırakır.",
        reflection:
          "Ben hangi gücü sorumlulukla taşımalıyım?",
      },
      en: {
        title: "72 · History Layer",
        story:
          "Batman carries the memory of energy production: power extracted from underground." + N2 +
          "This layer teaches: underground wealth, unmanaged, creates harm." + N2 +
          "Your inner energy is the same: managed, it gives life." + N2 +
          "It leaves the lesson: power requires responsibility.",
        reflection:
          "Which power do I need to carry with responsibility today?",
      },
    },

    numerology: {
      tr: {
        title: "72 · Numeroloji",
        story:
          "72 = enerji / arıtma / denge." + N2 +
          "72’nin gölgesi:" + NL +
          "• öfke" + NL +
          "• sabırsızlık" + NL +
          "• aşırılık" + N2 +
          "72’nin ışığı:" + NL +
          "• disiplin" + NL +
          "• niyet" + NL +
          "• dengeli güç" + N2 +
          "Bu kapı sorar: ‘Enerjin nerede sızıyor?’",
        reflection:
          "Bugün enerjim nereden sızıyor?",
      },
      en: {
        title: "72 · Numerology",
        story:
          "72 = energy / refinement / balance." + N2 +
          "Shadow of 72:" + NL +
          "• anger" + NL +
          "• impatience" + NL +
          "• excess" + N2 +
          "Light of 72:" + NL +
          "• discipline" + NL +
          "• intention" + NL +
          "• balanced power" + N2 +
          "This gate asks: ‘Where is your energy leaking?’",
        reflection:
          "Where is my energy leaking today?",
      },
    },

    symbols: {
      tr: {
        title: "72 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Petrol: ham güç." + NL +
          "• Rafineri: arıtma." + NL +
          "• Alev: yanlış yönetilen enerji." + NL +
          "• Meşale: arıtılmış enerji." + N2 +
          "Sembol mesajı: ‘Hamı arıt, ışık yap.’",
        reflection:
          "Benim rafinerim ne—enerjimi nasıl arıtıyorum?",
      },
      en: {
        title: "72 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Oil: raw power." + NL +
          "• Refinery: purification." + NL +
          "• Flame: mismanaged energy." + NL +
          "• Torch: refined energy." + N2 +
          "Symbol message: ‘Refine the raw, turn it into light.’",
        reflection:
          "What is my refinery—how do I refine my energy?",
      },
    },

    ritual: {
      tr: {
        title: "72 · Ritüel",
        story:
          "72 Dakika Ritüeli (Arıtma):" + N2 +
          "1) Ham enerjini yaz: öfke, hırs, tutku, korku." + NL +
          "2) Altına yaz: ‘Bunu şu yöne çeviriyorum…’" + NL +
          "3) 72 nefes al. Son nefeste söyle: ‘Arıtıyorum.’" + N2 +
          "Kapanış: ‘Gücüm yönlü.’",
        reflection:
          "Bugün ham enerjimi hangi yöne çeviriyorum?",
      },
      en: {
        title: "72 · Ritual",
        story:
          "72-Minute Ritual (Refinement):" + N2 +
          "1) Write your raw energy: anger, ambition, passion, fear." + NL +
          "2) Add: ‘I turn it into this direction…’" + NL +
          "3) Take 72 breaths. On the last say: ‘I refine.’" + N2 +
          "Closing: ‘My power has direction.’",
        reflection:
          "Which direction am I giving my raw energy today?",
      },
    },

    lab: {
      tr: {
        title: "72 · LAB: Refinery Engine",
        story:
          "Kod Gözü: Enerji / Arıtma / Yön" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Öfke = güç’" + NL +
          "• ‘Yak = rahatla’" + N2 +
          "Rewrite:" + NL +
          "• ‘Öfke = veri’" + NL +
          "• ‘Veri = yön’",
        reflection:
          "Tek cümle yaz: Bugün öfkeyi nasıl veriye çeviriyorsun?",
      },
      en: {
        title: "72 · LAB: Refinery Engine",
        story:
          "Code Eye: Energy / Refinement / Direction" + N2 +
          "Rule Engine:" + NL +
          "• ‘Anger = power’" + NL +
          "• ‘Burn = relief’" + N2 +
          "Rewrite:" + NL +
          "• ‘Anger = data’" + NL +
          "• ‘Data = direction’",
        reflection:
          "Write one sentence: How do you turn anger into data today?",
      },
    },
  },
};
export const CITY_73: Record<CityCode, City7> = {
  "73": {
    city: "Sirnak",

    base: {
      tr: {
        title: "73 · Seçici Güç",
        story:
          "Şırnak bir şehir değil—seçici gücün sınır bilincidir." + N2 +
          "Bu kapı sana şunu öğretir: Hayatta kalmak, sadece dayanmak değil; doğru seçim yapmaktır." + N2 +
          "73’ün enerjisi dağ gibi çalışır: az verir, ama sağlam verir." + N2 +
          "Şırnak’ın mesajı: ‘Gereksizi kes, özü koru.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Güç, her şeye açık olmak değil; doğruya açık olmaktır.",
        reflection:
          "Bugün hangi seçim beni koruyor?",
      },
      en: {
        title: "73 · Selective Power",
        story:
          "Sirnak is not only a city—it is border consciousness of selective power." + N2 +
          "This gate teaches: survival is not only enduring; it is choosing correctly." + N2 +
          "73 works like a mountain: it gives little, but it gives solid." + N2 +
          "Sirnak’s message: ‘Cut the unnecessary, protect the essence.’" + N2 +
          "Know this: power is not being open to everything; it is being open to what is right.",
        reflection:
          "Which choice protects me today?",
      },
    },

    deepC: {
      tr: {
        title: "73 · Matrix Derin İfşa",
        story:
          "Sistem 73’ü ‘hayatta kalma zekâsı protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 3 = yaratım. 73 = iç görüşle yeni yol üretmek." + N2 +
          "Gölge test: Korkuyla kapanmak." + NL +
          "Işık test: Korkuyu bilgi yapıp seçmek." + N2 +
          "73 sana şunu söyler: Seçimsiz özgürlük yoktur." + N2 +
          "Bu kapı, ‘açık’ ile ‘sağlıklı açık’ arasını ayırır: sınır + netlik + karar.",
        reflection:
          "Ben bugün korkuyu nasıl bilgiye çevirip seçiyorum?",
      },
      en: {
        title: "73 · Deep Matrix Reveal",
        story:
          "The system runs 73 as a ‘survival intelligence protocol.’" + N2 +
          "7 = inner sight, 3 = creation. 73 is creating a new path through inner sight." + N2 +
          "Shadow test: closing out of fear." + NL +
          "Light test: turning fear into information and choosing." + N2 +
          "73 says: there is no freedom without choice." + N2 +
          "This gate separates ‘open’ from ‘healthily open’: boundary + clarity + decision.",
        reflection:
          "How do I turn fear into information and choose today?",
      },
    },

    history: {
      tr: {
        title: "73 · Tarih Katmanı",
        story:
          "Şırnak, sınır ve dağ hafızası taşır: zor coğrafya, net karakter." + N2 +
          "Tarih katmanı şunu öğretir: Zor yerde yaşayan, gereksizi azaltır; özü korur." + N2 +
          "Bu katman, ‘az = hayatta kalma’ dersini bırakır." + N2 +
          "Sadeleşmek bazen estetik değil; zekâdır.",
        reflection:
          "Ben hayatımda nerede gereksizi taşıyorum?",
      },
      en: {
        title: "73 · History Layer",
        story:
          "Sirnak carries border and mountain memory: harsh land, clear character." + N2 +
          "This layer teaches: those who live in hard places reduce excess and protect essence." + N2 +
          "It leaves the lesson: less can be survival." + N2 +
          "Simplifying is not only aesthetic; it is intelligence.",
        reflection:
          "Where am I carrying unnecessary weight in my life?",
      },
    },

    numerology: {
      tr: {
        title: "73 · Numeroloji",
        story:
          "73 = seçicilik / netlik / iç zekâ." + N2 +
          "73’ün gölgesi:" + NL +
          "• aşırı kapanma" + NL +
          "• güvensizlik" + N2 +
          "73’ün ışığı:" + NL +
          "• sağlıklı sınır" + NL +
          "• akıllı seçim" + NL +
          "• net duruş" + N2 +
          "Bu kapı sorar: ‘Neye evet, neye hayır?’",
        reflection:
          "Bugün hangi hayır beni güçlendiriyor?",
      },
      en: {
        title: "73 · Numerology",
        story:
          "73 = selectivity / clarity / inner intelligence." + N2 +
          "Shadow of 73:" + NL +
          "• overclosing" + NL +
          "• distrust" + N2 +
          "Light of 73:" + NL +
          "• healthy boundary" + NL +
          "• smart choice" + NL +
          "• clear stance" + N2 +
          "This gate asks: ‘Yes to what, no to what?’",
        reflection:
          "Which ‘no’ strengthens me today?",
      },
    },

    symbols: {
      tr: {
        title: "73 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Dağ: sağlam duruş." + NL +
          "• Sınır çizgisi: seçicilik." + NL +
          "• Bıçak: keskin karar." + NL +
          "• Kalkan: koruma." + N2 +
          "Sembol mesajı: ‘Kes, koru, yürü.’",
        reflection:
          "Bugün hangi kararı keskinleştiriyorum?",
      },
      en: {
        title: "73 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Mountain: solid stance." + NL +
          "• Border line: selectivity." + NL +
          "• Blade: sharp decision." + NL +
          "• Shield: protection." + N2 +
          "Symbol message: ‘Cut, protect, walk.’",
        reflection:
          "Which decision am I sharpening today?",
      },
    },

    ritual: {
      tr: {
        title: "73 · Ritüel",
        story:
          "73 Dakika Ritüeli (Seçim Listesi):" + N2 +
          "1) 7 şey yaz: hayatımda yoran." + NL +
          "2) 3 şey seç: hayatımda büyüten." + NL +
          "3) Yoranlardan 3 tanesini bırakma kararı yaz." + NL +
          "4) 73 nefes al. Son nefeste söyle: ‘Seçtim.’" + N2 +
          "Kapanış: ‘Gücüm seçiciliğim.’",
        reflection:
          "Bugün hangi 3 şeyi bırakıyorum?",
      },
      en: {
        title: "73 · Ritual",
        story:
          "73-Minute Ritual (Choice List):" + N2 +
          "1) List 7 things that drain you." + NL +
          "2) Choose 3 things that grow you." + NL +
          "3) Decide to drop 3 draining items." + NL +
          "4) Take 73 breaths. On the last say: ‘I chose.’" + N2 +
          "Closing: ‘My power is my selectivity.’",
        reflection:
          "Which 3 things am I releasing today?",
      },
    },

    lab: {
      tr: {
        title: "73 · LAB: Survival Intelligence Engine",
        story:
          "Kod Gözü: Seçim / Sınır / Netlik" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Açık olursam güvendeyim’" + NL +
          "• ‘Hayır = kayıp’" + N2 +
          "Rewrite:" + NL +
          "• ‘Seçici açık = güven’" + NL +
          "• ‘Hayır = güç’",
        reflection:
          "Tek cümle yaz: Bugün hangi hayırı seçiyorsun?",
      },
      en: {
        title: "73 · LAB: Survival Intelligence Engine",
        story:
          "Code Eye: Choice / Boundary / Clarity" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I’m open, I’m safe’" + NL +
          "• ‘No = loss’" + N2 +
          "Rewrite:" + NL +
          "• ‘Selectively open = safe’" + NL +
          "• ‘No = power’",
        reflection:
          "Write one sentence: Which ‘no’ are you choosing today?",
      },
    },
  },
};
export const CITY_74: Record<CityCode, City7> = {
  "74": {
    city: "Bartin",

    base: {
      tr: {
        title: "74 · Sakin Akış",
        story:
          "Bartın bir şehir değil—sakin akışın küçük derinliğidir." + N2 +
          "Bu kapı sana şunu öğretir: Büyük dönüşüm her zaman büyük gürültüyle gelmez." + N2 +
          "74’ün enerjisi ‘nehir + kıyı’ gibi çalışır: yumuşakça akar ama yön verir." + N2 +
          "Bartın’ın mesajı: ‘Hafif ak, derin kal.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Sessiz akış, en kalıcı gücü taşır.",
        reflection:
          "Bugün hangi şeyi zorlamadan akıtıyorum?",
      },
      en: {
        title: "74 · Calm Flow",
        story:
          "Bartin is not only a city—it is small depth of calm flow." + N2 +
          "This gate teaches: big transformation doesn’t always arrive with big noise." + N2 +
          "74 works like ‘river + shore’: it flows softly yet gives direction." + N2 +
          "Bartin’s message: ‘Flow lightly, stay deep.’" + N2 +
          "Know this: silent flow carries the most lasting power.",
        reflection:
          "What am I allowing to flow without forcing today?",
      },
    },

    deepC: {
      tr: {
        title: "74 · Matrix Derin İfşa",
        story:
          "Sistem 74’ü ‘yumuşak yön protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 4 = yapı. 74 = iç görüşle yapı kurmak." + N2 +
          "Gölge test: Sertleşip kontrolle yön vermek." + NL +
          "Işık test: Yumuşakça yön vermek." + N2 +
          "74 sana şunu söyler: Kontrol edersen sıkışırsın; akarsan şekil bulursun." + N2 +
          "Bu kapı, gücü sertlikten değil, süreklilikten alır.",
        reflection:
          "Ben bugün gücü sertlikte mi arıyorum, süreklilikte mi?",
      },
      en: {
        title: "74 · Deep Matrix Reveal",
        story:
          "The system runs 74 as a ‘soft direction protocol.’" + N2 +
          "7 = inner sight, 4 = structure. 74 is building structure through inner sight." + N2 +
          "Shadow test: steering through harsh control." + NL +
          "Light test: steering softly." + N2 +
          "74 says: if you control, you tighten; if you flow, you find form." + N2 +
          "This gate draws power not from hardness, but from continuity.",
        reflection:
          "Am I seeking power in harshness—or in continuity today?",
      },
    },

    history: {
      tr: {
        title: "74 · Tarih Katmanı",
        story:
          "Bartın, nehir hafızası taşır: şehir içinden geçen su." + N2 +
          "Nehir şehirleri şunu öğretir: Akış, hayatın merkezinden geçebilir." + N2 +
          "Tarih katmanı burada bir ders bırakır: Hayatın içinden geçerken boğulma; ak." + N2 +
          "Bu katman, ‘iç merkezde akış’ dersini bırakır.",
        reflection:
          "Ben hayatımın merkezinde akabiliyor muyum?",
      },
      en: {
        title: "74 · History Layer",
        story:
          "Bartin carries river memory: water passing through the city." + N2 +
          "River cities teach: flow can pass through the center of life." + N2 +
          "This layer leaves a lesson: don’t drown while moving through life—flow." + N2 +
          "It leaves the lesson: flow in the inner center.",
        reflection:
          "Can I flow through the center of my life today?",
      },
    },

    numerology: {
      tr: {
        title: "74 · Numeroloji",
        story:
          "74 = iç görüş + yapı / sakin yön." + N2 +
          "74’ün gölgesi:" + NL +
          "• katı kontrol" + NL +
          "• aşırı ciddiyet" + N2 +
          "74’ün ışığı:" + NL +
          "• yumuşak disiplin" + NL +
          "• derinlik" + NL +
          "• sakin netlik" + N2 +
          "Bu kapı sorar: ‘Zorlamadan ilerleyebilir misin?’",
        reflection:
          "Bugün zorlamadan nasıl ilerliyorum?",
      },
      en: {
        title: "74 · Numerology",
        story:
          "74 = inner sight + structure / calm direction." + N2 +
          "Shadow of 74:" + NL +
          "• rigid control" + NL +
          "• excessive seriousness" + N2 +
          "Light of 74:" + NL +
          "• gentle discipline" + NL +
          "• depth" + NL +
          "• calm clarity" + N2 +
          "This gate asks: ‘Can you move forward without forcing?’",
        reflection:
          "How do I move forward without forcing today?",
      },
    },

    symbols: {
      tr: {
        title: "74 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Nehir: yumuşak güç." + NL +
          "• Kıyı: sınır." + NL +
          "• Köprü: geçiş." + NL +
          "• Çakıl taşı: küçük ama sağlam." + N2 +
          "Sembol mesajı: ‘Yumuşak akış, sert kayayı bile şekillendirir.’",
        reflection:
          "Bugün hangi sert şeyi yumuşakça şekillendiriyorum?",
      },
      en: {
        title: "74 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• River: soft power." + NL +
          "• Shore: boundary." + NL +
          "• Bridge: transition." + NL +
          "• Pebble: small but solid." + N2 +
          "Symbol message: ‘Soft flow shapes even hard rock.’",
        reflection:
          "What hard thing am I shaping softly today?",
      },
    },

    ritual: {
      tr: {
        title: "74 · Ritüel",
        story:
          "74 Dakika Ritüeli (Yumuşak İlerleme):" + N2 +
          "1) Bugün zorladığın 1 şeyi yaz." + NL +
          "2) Yanına yaz: ‘Bunu akışla yaparsam nasıl olur?’" + NL +
          "3) 74 nefes al. Son nefeste söyle: ‘Akıyorum.’" + N2 +
          "Kapanış: ‘Yumuşak güç.’",
        reflection:
          "Bugün zorlamayı nerede bırakıyorum?",
      },
      en: {
        title: "74 · Ritual",
        story:
          "74-Minute Ritual (Soft Progress):" + N2 +
          "1) Write one thing you are forcing today." + NL +
          "2) Add: ‘How would it look if I did this with flow?’" + NL +
          "3) Take 74 breaths. On the last say: ‘I flow.’" + N2 +
          "Closing: ‘Soft power.’",
        reflection:
          "Where am I releasing forcing today?",
      },
    },

    lab: {
      tr: {
        title: "74 · LAB: Soft Direction Engine",
        story:
          "Kod Gözü: Akış / Yön / Yumuşak Disiplin" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Zorlarsam olur’" + NL +
          "• ‘Yumuşaklık = zayıflık’" + N2 +
          "Rewrite:" + NL +
          "• ‘Akarsam olur’" + NL +
          "• ‘Yumuşaklık = güç’",
        reflection:
          "Tek cümle yaz: Bugün gücü nasıl yumuşatıyorsun?",
      },
      en: {
        title: "74 · LAB: Soft Direction Engine",
        story:
          "Code Eye: Flow / Direction / Gentle Discipline" + N2 +
          "Rule Engine:" + NL +
          "• ‘If I force, it works’" + NL +
          "• ‘Softness = weakness’" + N2 +
          "Rewrite:" + NL +
          "• ‘If I flow, it works’" + NL +
          "• ‘Softness = power’",
        reflection:
          "Write one sentence: How do you soften power today?",
      },
    },
  },
};
export const CITY_75: Record<CityCode, City7> = {
  "75": {
    city: "Ardahan",

    base: {
      tr: {
        title: "75 · Soğuk Netlik",
        story:
          "Ardahan bir şehir değil—soğuğun getirdiği netliktir." + N2 +
          "Bu kapı sana şunu öğretir: Konfor azalınca öz görünür." + N2 +
          "75’in enerjisi kış gibi çalışır: gereksizi keser, doğruyu bırakır." + N2 +
          "Ardahan’ın mesajı: ‘Az ol, net ol.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Sadeleşmek bazen zorluk değil; özgürlüktür.",
        reflection:
          "Bugün hangi fazlalığı kesip netleşiyorum?",
      },
      en: {
        title: "75 · Cold Clarity",
        story:
          "Ardahan is not only a city—it is clarity brought by cold." + N2 +
          "This gate teaches: when comfort drops, essence appears." + N2 +
          "75 works like winter: it cuts the unnecessary and leaves what is true." + N2 +
          "Ardahan’s message: ‘Be less, be clear.’" + N2 +
          "Know this: simplifying is sometimes not hardship—it is freedom.",
        reflection:
          "What excess am I cutting to become clear today?",
      },
    },

    deepC: {
      tr: {
        title: "75 · Matrix Derin İfşa",
        story:
          "Sistem 75’i ‘netlik protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 5 = değişim. 75 = değişimi iç görüşle yönetmek." + N2 +
          "Gölge test: Soğuğu kalp kapatmaya çevirmek." + NL +
          "Işık test: Soğuğu netliğe çevirmek." + N2 +
          "75 sana şunu söyler: Sert koşul, karakterin filtresidir." + N2 +
          "Bu kapı, ‘duygu’yu öldürmez; ‘dağınıklığı’ öldürür.",
        reflection:
          "Ben bugün dağınıklığı nerede bırakıyorum?",
      },
      en: {
        title: "75 · Deep Matrix Reveal",
        story:
          "The system runs 75 as a ‘clarity protocol.’" + N2 +
          "7 = inner sight, 5 = change. 75 is managing change through inner sight." + N2 +
          "Shadow test: turning cold into heart-closure." + NL +
          "Light test: turning cold into clarity." + N2 +
          "75 says: harsh conditions are a filter for character." + N2 +
          "This gate doesn’t kill emotion—it kills scattering.",
        reflection:
          "Where am I releasing scattering today?",
      },
    },

    history: {
      tr: {
        title: "75 · Tarih Katmanı",
        story:
          "Ardahan, sınır ve yüksek yayla hafızası taşır." + N2 +
          "Tarih katmanı şunu öğretir: Zor coğrafyada yaşayan, gereksizi azaltır." + N2 +
          "Bu katman, ‘azlık = dayanıklılık’ dersini bırakır." + N2 +
          "Hayatta kalma bilgeliği: yükü azalt, yolu uzat.",
        reflection:
          "Benim yüküm ne—azaltsam ne olur?",
      },
      en: {
        title: "75 · History Layer",
        story:
          "Ardahan carries border and high plateau memory." + N2 +
          "This layer teaches: those in harsh geography reduce the unnecessary." + N2 +
          "It leaves the lesson: less can be resilience." + N2 +
          "Survival wisdom: reduce the load, extend the road.",
        reflection:
          "What is my load—and what changes if I reduce it?",
      },
    },

    numerology: {
      tr: {
        title: "75 · Numeroloji",
        story:
          "75 = netlik / sade güç / değişim yönetimi." + N2 +
          "75’in gölgesi:" + NL +
          "• sertleşmek" + NL +
          "• kapanmak" + N2 +
          "75’in ışığı:" + NL +
          "• net karar" + NL +
          "• sade duruş" + NL +
          "• güçlü sınır" + N2 +
          "Bu kapı sorar: ‘Neyi bırakınca güçlenirsin?’",
        reflection:
          "Bugün bırakınca güçleneceğim şey ne?",
      },
      en: {
        title: "75 · Numerology",
        story:
          "75 = clarity / simple power / managing change." + N2 +
          "Shadow of 75:" + NL +
          "• hardening" + NL +
          "• closing" + N2 +
          "Light of 75:" + NL +
          "• clear decision" + NL +
          "• simple stance" + NL +
          "• strong boundary" + N2 +
          "This gate asks: ‘What will strengthen you if released?’",
        reflection:
          "What will strengthen me if I release it today?",
      },
    },

    symbols: {
      tr: {
        title: "75 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kar: arınma." + NL +
          "• Yayla: yükseklik." + NL +
          "• Sınır çizgisi: netlik." + NL +
          "• Kurt: dayanıklılık." + N2 +
          "Sembol mesajı: ‘Azalt, netleş, yürü.’",
        reflection:
          "Bugün hangi netliği seçiyorum?",
      },
      en: {
        title: "75 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Snow: purification." + NL +
          "• Plateau: elevation." + NL +
          "• Border line: clarity." + NL +
          "• Wolf: resilience." + N2 +
          "Symbol message: ‘Reduce, clarify, walk.’",
        reflection:
          "Which clarity am I choosing today?",
      },
    },

    ritual: {
      tr: {
        title: "75 · Ritüel",
        story:
          "75 Dakika Ritüeli (Net Kesim):" + N2 +
          "1) Bugün seni yoran 7 şeyi yaz." + NL +
          "2) İçinden 5 tanesini ele." + NL +
          "3) Kalan için tek cümle yaz: ‘Bunu koruyorum.’" + NL +
          "4) 75 nefes al. Son nefeste söyle: ‘Netim.’" + N2 +
          "Kapanış: ‘Azaldım, güçlendim.’",
        reflection:
          "Bugün hangi 5 şeyi bırakıyorum?",
      },
      en: {
        title: "75 · Ritual",
        story:
          "75-Minute Ritual (Clear Cut):" + N2 +
          "1) List 7 things that drain you." + NL +
          "2) Eliminate 5." + NL +
          "3) Write one line for what remains: ‘I keep this.’" + NL +
          "4) Take 75 breaths. On the last say: ‘I am clear.’" + N2 +
          "Closing: ‘I reduced and strengthened.’",
        reflection:
          "Which 5 things am I releasing today?",
      },
    },

    lab: {
      tr: {
        title: "75 · LAB: Clarity Engine",
        story:
          "Kod Gözü: Netlik / Azaltma / Sınır" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Her şey önemli’" + NL +
          "• ‘Bırakırsam kaybederim’" + N2 +
          "Rewrite:" + NL +
          "• ‘Doğru şey önemli’" + NL +
          "• ‘Azaltırsam güçlenirim’",
        reflection:
          "Tek cümle yaz: Bugün neyi azaltıyorsun?",
      },
      en: {
        title: "75 · LAB: Clarity Engine",
        story:
          "Code Eye: Clarity / Reduction / Boundary" + N2 +
          "Rule Engine:" + NL +
          "• ‘Everything is important’" + NL +
          "• ‘If I release, I lose’" + N2 +
          "Rewrite:" + NL +
          "• ‘The right thing is important’" + NL +
          "• ‘If I reduce, I strengthen’",
        reflection:
          "Write one sentence: What are you reducing today?",
      },
    },
  },
};
export const CITY_76: Record<CityCode, City7> = {
  "76": {
    city: "Igdir",

    base: {
      tr: {
        title: "76 · Sıcak Başlangıç",
        story:
          "Iğdır bir şehir değil—sıcak bir başlangıcın ovadaki nefesidir." + N2 +
          "Bu kapı sana şunu öğretir: Yumuşaklık, güçsüzlük değil; iyileştirici sıcaklıktır." + N2 +
          "76’nın enerjisi ‘güneşli ova’ gibi çalışır: açar, büyütür, umut verir." + N2 +
          "Iğdır’ın mesajı: ‘Toprak ısınırsa hayat başlar.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Yeni başlangıç bazen yüksek sesle değil, içten bir ‘tamam’ ile gelir.",
        reflection:
          "Bugün içimde hangi yeni başlangıca ‘tamam’ diyorum?",
      },
      en: {
        title: "76 · Warm Beginning",
        story:
          "Igdir is not only a city—it is the breath of a warm beginning on the plain." + N2 +
          "This gate teaches: softness is not weakness; it is healing warmth." + N2 +
          "76 works like a sunny plain: it opens, grows, gives hope." + N2 +
          "Igdir’s message: ‘When the soil warms, life begins.’" + N2 +
          "Know this: a new beginning sometimes arrives not with loud noise, but with an inner ‘yes.’",
        reflection:
          "Which new beginning am I saying ‘yes’ to today?",
      },
    },

    deepC: {
      tr: {
        title: "76 · Matrix Derin İfşa",
        story:
          "Sistem 76’yı ‘umut protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 6 = sorumluluk. 76 = iç görüşle sorumluluğu yumuşatmak." + N2 +
          "Gölge test: Umudu ertelemek, ‘olmaz’ demek." + NL +
          "Işık test: Umudu küçük adımla başlatmak." + N2 +
          "76 sana şunu söyler: Umut, büyük hayal değil; bugün atılan küçük adımdır." + N2 +
          "Bu kapı, soğuğu çözmek gibi: sıcaklıkla açar.",
        reflection:
          "Ben bugün umudu hangi küçük adımla başlatıyorum?",
      },
      en: {
        title: "76 · Deep Matrix Reveal",
        story:
          "The system runs 76 as a ‘hope protocol.’" + N2 +
          "7 = inner sight, 6 = responsibility. 76 is softening responsibility through inner sight." + N2 +
          "Shadow test: delaying hope by saying ‘it won’t.’" + NL +
          "Light test: starting hope through a small step." + N2 +
          "76 says: hope is not a huge dream; it is a small step taken today." + N2 +
          "This gate opens like melting cold—through warmth.",
        reflection:
          "Which small step starts hope for me today?",
      },
    },

    history: {
      tr: {
        title: "76 · Tarih Katmanı",
        story:
          "Iğdır, sınır ve ova hafızası taşır: genişlik ve geçiş." + N2 +
          "Tarih katmanı şunu öğretir: Geniş ova, yeni hayat için alan açar." + N2 +
          "Bu katman, ‘alan = başlangıç’ dersini bırakır." + N2 +
          "Yeni bir şey için önce yer açarsın.",
        reflection:
          "Ben hayatımda hangi alanı açıyorum?",
      },
      en: {
        title: "76 · History Layer",
        story:
          "Igdir carries border and plain memory: openness and transition." + N2 +
          "This layer teaches: a wide plain creates space for new life." + N2 +
          "It leaves the lesson: space becomes beginning." + N2 +
          "For something new, you first make room.",
        reflection:
          "What space am I opening in my life today?",
      },
    },

    numerology: {
      tr: {
        title: "76 · Numeroloji",
        story:
          "76 = umut / yumuşak sorumluluk / yeni başlangıç." + N2 +
          "76’nın gölgesi:" + NL +
          "• pes etmek" + NL +
          "• karamsarlık" + N2 +
          "76’nın ışığı:" + NL +
          "• küçük adım" + NL +
          "• sıcaklık" + NL +
          "• yeniden başlama cesareti" + N2 +
          "Bu kapı sorar: ‘Bir adım atar mısın?’",
        reflection:
          "Bugün atacağım tek adım ne?",
      },
      en: {
        title: "76 · Numerology",
        story:
          "76 = hope / gentle responsibility / new beginning." + N2 +
          "Shadow of 76:" + NL +
          "• giving up" + NL +
          "• pessimism" + N2 +
          "Light of 76:" + NL +
          "• small step" + NL +
          "• warmth" + NL +
          "• courage to restart" + N2 +
          "This gate asks: ‘Will you take one step?’",
        reflection:
          "What is my single step today?",
      },
    },

    symbols: {
      tr: {
        title: "76 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Güneş: umut." + NL +
          "• Ova: alan." + NL +
          "• Filiz: başlangıç." + NL +
          "• Sıcak rüzgâr: yumuşatma." + N2 +
          "Sembol mesajı: ‘Isın, açıl, başla.’",
        reflection:
          "Bugün hangi filizi büyütüyorum?",
      },
      en: {
        title: "76 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Sun: hope." + NL +
          "• Plain: space." + NL +
          "• Sprout: beginning." + NL +
          "• Warm wind: softening." + N2 +
          "Symbol message: ‘Warm up, open, begin.’",
        reflection:
          "Which sprout am I growing today?",
      },
    },

    ritual: {
      tr: {
        title: "76 · Ritüel",
        story:
          "76 Dakika Ritüeli (Isın ve Başla):" + N2 +
          "1) 16 dakika yürüyüş." + NL +
          "2) 30 dakika tek bir işe başla." + NL +
          "3) 30 dakika o işi sürdür." + N2 +
          "Kapanış: ‘Başladım.’",
        reflection:
          "Bugün hangi işi başlatıyorum?",
      },
      en: {
        title: "76 · Ritual",
        story:
          "76-Minute Ritual (Warm and Begin):" + N2 +
          "1) 16 minutes walking." + NL +
          "2) 30 minutes start one task." + NL +
          "3) 30 minutes continue it." + N2 +
          "Closing: ‘I began.’",
        reflection:
          "What am I starting today?",
      },
    },

    lab: {
      tr: {
        title: "76 · LAB: Hope Engine",
        story:
          "Kod Gözü: Umut / Sıcaklık / Başlangıç" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Olmaz’" + NL +
          "• ‘Zaten geç’" + N2 +
          "Rewrite:" + NL +
          "• ‘Olur’" + NL +
          "• ‘Bugün başlar’",
        reflection:
          "Tek cümle yaz: Bugün hangi ‘olur’u seçiyorsun?",
      },
      en: {
        title: "76 · LAB: Hope Engine",
        story:
          "Code Eye: Hope / Warmth / Beginning" + N2 +
          "Rule Engine:" + NL +
          "• ‘It won’t’" + NL +
          "• ‘It’s too late’" + N2 +
          "Rewrite:" + NL +
          "• ‘It can’" + NL +
          "• ‘It begins today’",
        reflection:
          "Write one sentence: Which ‘it can’ are you choosing today?",
      },
    },
  },
};
export const CITY_77: Record<CityCode, City7> = {
  "77": {
    city: "Yalova",

    base: {
      tr: {
        title: "77 · Tazelenme",
        story:
          "Yalova bir şehir değil—tazelenmenin su hafızasıdır." + N2 +
          "Bu kapı sana şunu öğretir: Dinlenmek, kaçmak değil; güç biriktirmektir." + N2 +
          "77’nin enerjisi ‘termal su’ gibidir: içten ısıtır, gevşetir, yeniler." + N2 +
          "Yalova’nın mesajı: ‘Şifayı erteleme.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Güç, sadece çalışmakla değil; doğru dinlenmekle de büyür.",
        reflection:
          "Bugün bedenimi nasıl tazeliyorum?",
      },
      en: {
        title: "77 · Renewal",
        story:
          "Yalova is not only a city—it is water-memory of renewal." + N2 +
          "This gate teaches: resting is not escaping; it is storing power." + N2 +
          "77 works like thermal water: it warms from within, relaxes, renews." + N2 +
          "Yalova’s message: ‘Don’t postpone healing.’" + N2 +
          "Know this: power grows not only through work, but also through correct rest.",
        reflection:
          "How am I renewing my body today?",
      },
    },

    deepC: {
      tr: {
        title: "77 · Matrix Derin İfşa",
        story:
          "Sistem 77’yi ‘iç şifa protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş. 77 = iç görüşün iki kat derinleşmesi." + N2 +
          "Gölge test: Dinlenmeyi suçlulukla kesmek." + NL +
          "Işık test: Dinlenmeyi bilinçli ritüel yapmak." + N2 +
          "77 sana şunu söyler: Zihin hızlanınca beden kapanır; beden açılınca bilinç genişler." + N2 +
          "Bu kapı, ‘dur’ komutunu kutsallaştırır: durmak, şifanın başlangıcıdır.",
        reflection:
          "Ben bugün dinlenmeyi neden hak etmiyorum sanıyorum?",
      },
      en: {
        title: "77 · Deep Matrix Reveal",
        story:
          "The system runs 77 as an ‘inner healing protocol.’" + N2 +
          "7 = inner sight. 77 doubles the depth of inner sight." + N2 +
          "Shadow test: cutting rest with guilt." + NL +
          "Light test: making rest a conscious ritual." + N2 +
          "77 says: when mind speeds up, body closes; when body opens, consciousness expands." + N2 +
          "This gate sanctifies the ‘pause’ command: pausing is the start of healing.",
        reflection:
          "Why do I believe I don’t deserve rest today?",
      },
    },

    history: {
      tr: {
        title: "77 · Tarih Katmanı",
        story:
          "Yalova, suyla şifanın hafızasını taşır." + N2 +
          "Tarih katmanı şunu öğretir: Şifa, lüks değil; sürdürülebilir yaşam şartıdır." + N2 +
          "Su, bedeni temizler; ama asıl iş, sinir sistemini sakinleştirmektir." + N2 +
          "Bu katman, ‘sakinlik = şifa’ dersini bırakır.",
        reflection:
          "Benim sinir sistemim bugün neye ihtiyaç duyuyor?",
      },
      en: {
        title: "77 · History Layer",
        story:
          "Yalova carries the memory of healing through water." + N2 +
          "This layer teaches: healing is not luxury; it is required for sustainable living." + N2 +
          "Water cleanses the body, but the real work is calming the nervous system." + N2 +
          "It leaves the lesson: calm becomes healing.",
        reflection:
          "What does my nervous system need today?",
      },
    },

    numerology: {
      tr: {
        title: "77 · Numeroloji",
        story:
          "77 = derin iç görüş / şifa / yeniden başlatma." + N2 +
          "77’nin gölgesi:" + NL +
          "• tükenmişlik" + NL +
          "• durmayı bilmemek" + N2 +
          "77’nin ışığı:" + NL +
          "• bilinçli duruş" + NL +
          "• dinlenme ritmi" + NL +
          "• tazelenme" + N2 +
          "Bu kapı sorar: ‘Neyi erteledin?’",
        reflection:
          "Bugün ertelediğim şifa ne?",
      },
      en: {
        title: "77 · Numerology",
        story:
          "77 = deep inner sight / healing / restart." + N2 +
          "Shadow of 77:" + NL +
          "• burnout" + NL +
          "• inability to pause" + N2 +
          "Light of 77:" + NL +
          "• conscious pause" + NL +
          "• rhythm of rest" + NL +
          "• renewal" + N2 +
          "This gate asks: ‘What have you postponed?’",
        reflection:
          "What healing have I postponed today?",
      },
    },

    symbols: {
      tr: {
        title: "77 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Termal su: içten şifa." + NL +
          "• Buhar: gevşeme." + NL +
          "• Havlu: bakım." + NL +
          "• 77 damla: tazelenme." + N2 +
          "Sembol mesajı: ‘Dur, ısın, yenilen.’",
        reflection:
          "Bugün hangi bakım bana iyi gelir?",
      },
      en: {
        title: "77 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Thermal water: inner healing." + NL +
          "• Steam: relaxation." + NL +
          "• Towel: care." + NL +
          "• 77 drops: renewal." + N2 +
          "Symbol message: ‘Pause, warm, renew.’",
        reflection:
          "What care will nourish me today?",
      },
    },

    ritual: {
      tr: {
        title: "77 · Ritüel",
        story:
          "77 Dakika Ritüeli (Dinlenerek Güçlen):" + N2 +
          "1) 20 dakika sıcak duş / su teması." + NL +
          "2) 20 dakika sessiz uzanma." + NL +
          "3) 20 dakika hafif yürüyüş." + NL +
          "4) 17 nefes: ‘Tazeleniyorum.’" + N2 +
          "Kapanış: ‘Güç biriktirdim.’",
        reflection:
          "Bugün dinlenmeyi hangi şekilde seçiyorum?",
      },
      en: {
        title: "77 · Ritual",
        story:
          "77-Minute Ritual (Strength Through Rest):" + N2 +
          "1) 20 minutes warm shower / water contact." + NL +
          "2) 20 minutes quiet resting." + NL +
          "3) 20 minutes light walking." + NL +
          "4) 17 breaths repeating: ‘I renew.’" + N2 +
          "Closing: ‘I stored power.’",
        reflection:
          "How do I choose rest today?",
      },
    },

    lab: {
      tr: {
        title: "77 · LAB: Restoration Engine",
        story:
          "Kod Gözü: Dinlenme / Şifa / Yenilenme" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Dinlenmek = tembellik’" + NL +
          "• ‘Durursam geri kalırım’" + N2 +
          "Rewrite:" + NL +
          "• ‘Dinlenmek = yakıt’" + NL +
          "• ‘Yakıt = hız’",
        reflection:
          "Tek cümle yaz: Bugün dinlenmeyi nasıl yakıta çeviriyorsun?",
      },
      en: {
        title: "77 · LAB: Restoration Engine",
        story:
          "Code Eye: Rest / Healing / Renewal" + N2 +
          "Rule Engine:" + NL +
          "• ‘Rest = laziness’" + NL +
          "• ‘If I pause, I fall behind’" + N2 +
          "Rewrite:" + NL +
          "• ‘Rest = fuel’" + NL +
          "• ‘Fuel = speed’",
        reflection:
          "Write one sentence: How do you turn rest into fuel today?",
      },
    },
  },
};
export const CITY_78: Record<CityCode, City7> = {
  "78": {
    city: "Karabuk",

    base: {
      tr: {
        title: "78 · Dönüşüm",
        story:
          "Karabük bir şehir değil—demirin dönüşümüdür." + N2 +
          "Bu kapı sana şunu öğretir: Ham madde sensin; ustalık da sensin." + N2 +
          "78’in enerjisi ‘ateş + disiplin’ gibi çalışır: ısıtır, şekil verir, güçlendirir." + N2 +
          "Karabük’ün mesajı: ‘Isın, şekillen, dayan.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Güç, kırmadan şekil vermektir.",
        reflection:
          "Bugün hangi ham yanımı ustalığa çeviriyorum?",
      },
      en: {
        title: "78 · Transformation",
        story:
          "Karabuk is not only a city—it is the transformation of iron." + N2 +
          "This gate teaches: you are the raw material, and you are the mastery." + N2 +
          "78 works like ‘fire + discipline’: it heats, shapes, strengthens." + N2 +
          "Karabuk’s message: ‘Warm up, take shape, endure.’" + N2 +
          "Know this: power is shaping without breaking.",
        reflection:
          "Which raw part of me am I turning into mastery today?",
      },
    },

    deepC: {
      tr: {
        title: "78 · Matrix Derin İfşa",
        story:
          "Sistem 78’i ‘şekil verme protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 8 = güç. 78 = iç görüşle gücü yönetmek." + N2 +
          "Gölge test: Gücü baskı yapmak." + NL +
          "Işık test: Gücü yapı yapmak." + N2 +
          "78 sana şunu söyler: Ateşin varsa, yönün de olmalı." + N2 +
          "Bu kapı, ‘ham güç’ü ‘kontrollü güç’e çevirir: disiplin, plan, tekrar.",
        reflection:
          "Ben ateşimi bugün neye hizmet ettiriyorum?",
      },
      en: {
        title: "78 · Deep Matrix Reveal",
        story:
          "The system runs 78 as a ‘shaping protocol.’" + N2 +
          "7 = inner sight, 8 = power. 78 is managing power through inner sight." + N2 +
          "Shadow test: using power as pressure." + NL +
          "Light test: using power as structure." + N2 +
          "78 says: if you have fire, you must have direction." + N2 +
          "This gate turns raw power into controlled power: discipline, plan, repetition.",
        reflection:
          "What am I making my fire serve today?",
      },
    },

    history: {
      tr: {
        title: "78 · Tarih Katmanı",
        story:
          "Karabük, emeğin endüstriye dönüştüğü bir hafıza taşır." + N2 +
          "Tarih katmanı şunu öğretir: Büyük dönüşüm, küçük tekrarların birikimidir." + N2 +
          "Üretim hattı bir ritimdir: ritim varsa sonuç vardır." + N2 +
          "Bu katman, ‘ritim = dönüşüm’ dersini bırakır.",
        reflection:
          "Benim ritmim nerede bozuluyor?",
      },
      en: {
        title: "78 · History Layer",
        story:
          "Karabuk carries memory of labor becoming industry." + N2 +
          "This layer teaches: big transformation is accumulation of small repetitions." + N2 +
          "A production line is rhythm: with rhythm, results appear." + N2 +
          "It leaves the lesson: rhythm becomes transformation.",
        reflection:
          "Where is my rhythm breaking today?",
      },
    },

    numerology: {
      tr: {
        title: "78 · Numeroloji",
        story:
          "78 = güç + disiplin + dönüşüm." + N2 +
          "78’in gölgesi:" + NL +
          "• aşırılık" + NL +
          "• öfkeyle hareket" + N2 +
          "78’in ışığı:" + NL +
          "• kontrollü güç" + NL +
          "• sabır" + NL +
          "• ustalık" + N2 +
          "Bu kapı sorar: ‘Gücünü kontrol edebiliyor musun?’",
        reflection:
          "Bugün gücümü kontrol eden tek şey ne?",
      },
      en: {
        title: "78 · Numerology",
        story:
          "78 = power + discipline + transformation." + N2 +
          "Shadow of 78:" + NL +
          "• excess" + NL +
          "• acting from anger" + N2 +
          "Light of 78:" + NL +
          "• controlled power" + NL +
          "• patience" + NL +
          "• mastery" + N2 +
          "This gate asks: ‘Can you control your power?’",
        reflection:
          "What is the one thing that controls my power today?",
      },
    },

    symbols: {
      tr: {
        title: "78 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Demir: ham madde." + NL +
          "• Ateş: dönüşüm." + NL +
          "• Örs: şekil." + NL +
          "• Çekiç: tekrar." + N2 +
          "Sembol mesajı: ‘Tekrarla şekil bulursun.’",
        reflection:
          "Bugün hangi tekrarı yapıyorum?",
      },
      en: {
        title: "78 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Iron: raw material." + NL +
          "• Fire: transformation." + NL +
          "• Anvil: form." + NL +
          "• Hammer: repetition." + N2 +
          "Symbol message: ‘You take shape through repetition.’",
        reflection:
          "What repetition am I doing today?",
      },
    },

    ritual: {
      tr: {
        title: "78 · Ritüel",
        story:
          "78 Dakika Ritüeli (Şekil Ver):" + N2 +
          "1) Bugün dönüştürmek istediğin 1 ham yanını yaz." + NL +
          "2) Ona dair 7 küçük kural yaz (disiplin)." + NL +
          "3) 8 adım planla (güç)." + NL +
          "4) 78 nefes al. Son nefeste söyle: ‘Şekilleniyorum.’" + N2 +
          "Kapanış: ‘Ustalığa gidiyorum.’",
        reflection:
          "Bugün hangi kural beni ustalaştırır?",
      },
      en: {
        title: "78 · Ritual",
        story:
          "78-Minute Ritual (Shape):" + N2 +
          "1) Write one raw part you want to transform." + NL +
          "2) Write 7 small rules (discipline)." + NL +
          "3) Plan 8 steps (power)." + NL +
          "4) Take 78 breaths. On the last say: ‘I take shape.’" + N2 +
          "Closing: ‘I move into mastery.’",
        reflection:
          "Which rule will make me masterful today?",
      },
    },

    lab: {
      tr: {
        title: "78 · LAB: Controlled Power Engine",
        story:
          "Kod Gözü: Ateş / Disiplin / Şekil" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Ham güç = yeter’" + NL +
          "• ‘Kural = kısıt’" + N2 +
          "Rewrite:" + NL +
          "• ‘Kural = ustalık’" + NL +
          "• ‘Ustalık = özgürlük’",
        reflection:
          "Tek cümle yaz: Bugün kuralı nasıl özgürlüğe çeviriyorsun?",
      },
      en: {
        title: "78 · LAB: Controlled Power Engine",
        story:
          "Code Eye: Fire / Discipline / Form" + N2 +
          "Rule Engine:" + NL +
          "• ‘Raw power is enough’" + NL +
          "• ‘Rules are limitation’" + N2 +
          "Rewrite:" + NL +
          "• ‘Rules are mastery’" + NL +
          "• ‘Mastery is freedom’",
        reflection:
          "Write one sentence: How do you turn rules into freedom today?",
      },
    },
  },
};
export const CITY_79: Record<CityCode, City7> = {
  "79": {
    city: "Kilis",

    base: {
      tr: {
        title: "79 · Adaptasyon",
        story:
          "Kilis bir şehir değil—küçük alanda büyük adaptasyondur." + N2 +
          "Bu kapı sana şunu öğretir: Alan daralınca zihin genişler." + N2 +
          "79’un enerjisi ‘hızlı uyum’ taşır: şart değişir, sen şekil değiştirirsin." + N2 +
          "Kilis’in mesajı: ‘Darlıkta merhameti kaybetme.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Adaptasyon yalnız teknik değil; kalp işidir.",
        reflection:
          "Bugün hangi şart değişimine uyumlanıyorum?",
      },
      en: {
        title: "79 · Adaptation",
        story:
          "Kilis is not only a city—it is big adaptation inside a small space." + N2 +
          "This gate teaches: when the space narrows, the mind can widen." + N2 +
          "79 carries ‘fast adjustment’: conditions change, you change form." + N2 +
          "Kilis’s message: ‘Don’t lose compassion in tightness.’" + N2 +
          "Know this: adaptation is not only technical—it is heart work.",
        reflection:
          "Which changing condition am I adapting to today?",
      },
    },

    deepC: {
      tr: {
        title: "79 · Matrix Derin İfşa",
        story:
          "Sistem 79’u ‘dar alanda seçim protokolü’ olarak çalıştırır." + N2 +
          "7 = iç görüş, 9 = kapanış. 79 = iç görüşle döngü kapatmak." + N2 +
          "Gölge test: Darlığı panikle büyütmek." + NL +
          "Işık test: Darlıkta net seçim yapmak." + N2 +
          "79 sana şunu söyler: Darlık, seçimi hızlandırır. Çünkü fazlalığa yer yoktur." + N2 +
          "Bu kapı, ‘az alan’da ‘doğru’yu seçtirir.",
        reflection:
          "Ben bugün darlığı panik mi yapıyorum, seçim mi?",
      },
      en: {
        title: "79 · Deep Matrix Reveal",
        story:
          "The system runs 79 as a ‘choice-in-tight-space protocol.’" + N2 +
          "7 = inner sight, 9 = closure. 79 is closing loops through inner sight." + N2 +
          "Shadow test: amplifying tightness with panic." + NL +
          "Light test: making clear choices inside tightness." + N2 +
          "79 says: tight space accelerates choice—there is no room for excess." + N2 +
          "This gate forces ‘right’ selection in ‘small space.’",
        reflection:
          "Do I turn tightness into panic—or into choice today?",
      },
    },

    history: {
      tr: {
        title: "79 · Tarih Katmanı",
        story:
          "Kilis, sınır hafızası taşır: geçiş, hız, uyum." + N2 +
          "Tarih katmanı şunu öğretir: Sınırda yaşayan, hızlı öğrenir." + N2 +
          "Bu katman, ‘uyum = hayatta kalma’ dersini bırakır." + N2 +
          "Ama asıl ders: Merhamet kaybolursa uyum da zehir olur.",
        reflection:
          "Ben uyumlanırken merhameti koruyor muyum?",
      },
      en: {
        title: "79 · History Layer",
        story:
          "Kilis carries border memory: transition, speed, adaptation." + N2 +
          "This layer teaches: those who live at borders learn fast." + N2 +
          "It leaves the lesson: adaptation is survival." + N2 +
          "But the deeper lesson: without compassion, adaptation becomes poison.",
        reflection:
          "Do I keep compassion while adapting today?",
      },
    },

    numerology: {
      tr: {
        title: "79 · Numeroloji",
        story:
          "79 = hızlı seçim / uyum / döngü kapatma." + N2 +
          "79’un gölgesi:" + NL +
          "• panik" + NL +
          "• acele yanlış karar" + N2 +
          "79’un ışığı:" + NL +
          "• netlik" + NL +
          "• merhamet" + NL +
          "• hızlı ama doğru adım" + N2 +
          "Bu kapı sorar: ‘Şimdi neyi seçiyorsun?’",
        reflection:
          "Bugün hangi ‘doğru’yu seçiyorum?",
      },
      en: {
        title: "79 · Numerology",
        story:
          "79 = fast choice / adaptation / closing loops." + N2 +
          "Shadow of 79:" + NL +
          "• panic" + NL +
          "• rushed wrong decisions" + N2 +
          "Light of 79:" + NL +
          "• clarity" + NL +
          "• compassion" + NL +
          "• fast yet correct step" + N2 +
          "This gate asks: ‘What are you choosing now?’",
        reflection:
          "Which ‘right’ am I choosing today?",
      },
    },

    symbols: {
      tr: {
        title: "79 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Sınır kapısı: geçiş." + NL +
          "• Çanta: az eşya, doğru seçim." + NL +
          "• Kum saati: hızlanan zaman." + NL +
          "• Kalp: merhamet." + N2 +
          "Sembol mesajı: ‘Azalt, seç, merhamet et.’",
        reflection:
          "Bugün neyi azaltıyorum?",
      },
      en: {
        title: "79 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Border gate: transition." + NL +
          "• Bag: less items, right choices." + NL +
          "• Hourglass: accelerated time." + NL +
          "• Heart: compassion." + N2 +
          "Symbol message: ‘Reduce, choose, stay compassionate.’",
        reflection:
          "What am I reducing today?",
      },
    },

    ritual: {
      tr: {
        title: "79 · Ritüel",
        story:
          "79 Dakika Ritüeli (Azalt ve Seç):" + N2 +
          "1) Bugün 9 şeyi yaz: yük." + NL +
          "2) 7 tanesini ele." + NL +
          "3) Kalan 2 şey için 1 karar cümlesi yaz." + NL +
          "4) 79 nefes al. Son nefeste söyle: ‘Seçtim.’" + N2 +
          "Kapanış: ‘Azaldım, netleştim.’",
        reflection:
          "Bugün hangi 7 yükü bırakıyorum?",
      },
      en: {
        title: "79 · Ritual",
        story:
          "79-Minute Ritual (Reduce and Choose):" + N2 +
          "1) List 9 things: load." + NL +
          "2) Eliminate 7." + NL +
          "3) Write one decision sentence for the remaining 2." + NL +
          "4) Take 79 breaths. On the last say: ‘I chose.’" + N2 +
          "Closing: ‘I reduced and clarified.’",
        reflection:
          "Which 7 loads am I releasing today?",
      },
    },

    lab: {
      tr: {
        title: "79 · LAB: Adaptation Engine",
        story:
          "Kod Gözü: Uyum / Seçim / Merhamet" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Darlık = panik’" + NL +
          "• ‘Panik = hız’" + N2 +
          "Rewrite:" + NL +
          "• ‘Darlık = seçim’" + NL +
          "• ‘Seçim = güç’",
        reflection:
          "Tek cümle yaz: Bugün darlığı nasıl seçime çeviriyorsun?",
      },
      en: {
        title: "79 · LAB: Adaptation Engine",
        story:
          "Code Eye: Adaptation / Choice / Compassion" + N2 +
          "Rule Engine:" + NL +
          "• ‘Tightness = panic’" + NL +
          "• ‘Panic = speed’" + N2 +
          "Rewrite:" + NL +
          "• ‘Tightness = choice’" + NL +
          "• ‘Choice = power’",
        reflection:
          "Write one sentence: How do you turn tightness into choice today?",
      },
    },
  },
};
export const CITY_80: Record<CityCode, City7> = {
  "80": {
    city: "Osmaniye",

    base: {
      tr: {
        title: "80 · Koruma",
        story:
          "Osmaniye bir şehir değil—kökün korunmasıdır." + N2 +
          "Bu kapı sana şunu öğretir: Koruma, kapanmak değil; sağlam durmaktır." + N2 +
          "80’in enerjisi ‘ova + kale’ gibi çalışır: üretir ve korur." + N2 +
          "Osmaniye’nin mesajı: ‘Üret ama sınır koy.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Güç, hem açık hem korunaklı olabilmektir.",
        reflection:
          "Bugün hangi alanda hem üretip hem korunuyorum?",
      },
      en: {
        title: "80 · Protection",
        story:
          "Osmaniye is not only a city—it is protecting the root." + N2 +
          "This gate teaches: protection is not closing; it is standing solid." + N2 +
          "80 works like ‘plain + fortress’: it produces and protects." + N2 +
          "Osmaniye’s message: ‘Produce, but set boundaries.’" + N2 +
          "Know this: power is being open and protected at the same time.",
        reflection:
          "Where am I producing and protecting myself today?",
      },
    },

    deepC: {
      tr: {
        title: "80 · Matrix Derin İfşa",
        story:
          "Sistem 80’i ‘kök güvenliği protokolü’ olarak çalıştırır." + N2 +
          "8 = güç, 0 = alan. 80 = gücü alan içinde yönetmek." + N2 +
          "Gölge test: Gücü kontrol sanmak." + NL +
          "Işık test: Gücü koruma ve yön sanmak." + N2 +
          "80 sana şunu söyler: Güç, her yere yetişmek değil; doğruyu korumaktır." + N2 +
          "Bu kapı, enerjiyi savurmadan büyütmeyi öğretir: sistem + sınır.",
        reflection:
          "Ben bugün gücü nerede savuruyorum?",
      },
      en: {
        title: "80 · Deep Matrix Reveal",
        story:
          "The system runs 80 as a ‘root safety protocol.’" + N2 +
          "8 = power, 0 = field. 80 is managing power inside the field." + N2 +
          "Shadow test: mistaking power for control." + NL +
          "Light test: seeing power as protection and direction." + N2 +
          "80 says: power is not reaching everywhere; it is protecting what is right." + N2 +
          "This gate teaches growing without leaking energy: system + boundary.",
        reflection:
          "Where am I leaking my power today?",
      },
    },

    history: {
      tr: {
        title: "80 · Tarih Katmanı",
        story:
          "Osmaniye, kale ve geçit hafızası taşır: koruma kültürü." + N2 +
          "Tarih katmanı şunu öğretir: Üreten yer kendini korumazsa bereket dağılır." + N2 +
          "Bu katman, ‘koruma = sürdürülebilirlik’ dersini bırakır." + N2 +
          "Sürdürülebilir olan, hem açık hem sınırlıdır.",
        reflection:
          "Benim bereketimi koruyan sınır ne?",
      },
      en: {
        title: "80 · History Layer",
        story:
          "Osmaniye carries memory of fortress and passage: a culture of protection." + N2 +
          "This layer teaches: if a producing place doesn’t protect itself, abundance scatters." + N2 +
          "It leaves the lesson: protection makes sustainability." + N2 +
          "What lasts is open yet bounded.",
        reflection:
          "What boundary protects my abundance today?",
      },
    },

    numerology: {
      tr: {
        title: "80 · Numeroloji",
        story:
          "80 = güç + alan / koruma / sürdürülebilir büyüme." + N2 +
          "80’in gölgesi:" + NL +
          "• kontrol takıntısı" + NL +
          "• aşırı yük" + N2 +
          "80’in ışığı:" + NL +
          "• net sınır" + NL +
          "• sistem" + NL +
          "• kalıcı güç" + N2 +
          "Bu kapı sorar: ‘Gücünü ne koruyor?’",
        reflection:
          "Bugün gücümü koruyan şey ne?",
      },
      en: {
        title: "80 · Numerology",
        story:
          "80 = power + field / protection / sustainable growth." + N2 +
          "Shadow of 80:" + NL +
          "• control obsession" + NL +
          "• overload" + N2 +
          "Light of 80:" + NL +
          "• clear boundary" + NL +
          "• system" + NL +
          "• lasting power" + N2 +
          "This gate asks: ‘What protects your power?’",
        reflection:
          "What protects my power today?",
      },
    },

    symbols: {
      tr: {
        title: "80 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Kale: koruma." + NL +
          "• Ova: üretim." + NL +
          "• Çit: sınır." + NL +
          "• Anahtar: seçim." + N2 +
          "Sembol mesajı: ‘Korunan bereket büyür.’",
        reflection:
          "Bugün hangi çiti çekiyorum?",
      },
      en: {
        title: "80 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Fortress: protection." + NL +
          "• Plain: production." + NL +
          "• Fence: boundary." + NL +
          "• Key: choice." + N2 +
          "Symbol message: ‘Protected abundance grows.’",
        reflection:
          "Which fence am I placing today?",
      },
    },

    ritual: {
      tr: {
        title: "80 · Ritüel",
        story:
          "80 Dakika Ritüeli (Koru ve Üret):" + N2 +
          "1) Ürettiğin 8 şeyi yaz (iş, ilişki, fikir)." + NL +
          "2) İçinden 3 tanesini seç: ‘korunacak’." + NL +
          "3) Her biri için 1 sınır cümlesi yaz." + NL +
          "4) 80 nefes al. Son nefeste söyle: ‘Koruyorum.’" + N2 +
          "Kapanış: ‘Gücüm net.’",
        reflection:
          "Bugün neyi koruyorum?",
      },
      en: {
        title: "80 · Ritual",
        story:
          "80-Minute Ritual (Protect and Produce):" + N2 +
          "1) List 8 things you produce (work, relationships, ideas)." + NL +
          "2) Choose 3 to protect." + NL +
          "3) Write one boundary sentence for each." + NL +
          "4) Take 80 breaths. On the last say: ‘I protect.’" + N2 +
          "Closing: ‘My power is clear.’",
        reflection:
          "What am I protecting today?",
      },
    },

    lab: {
      tr: {
        title: "80 · LAB: Protection Engine",
        story:
          "Kod Gözü: Koruma / Sınır / Sistem" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Açık ol = iyi ol’" + NL +
          "• ‘Sınır = ayıp’" + N2 +
          "Rewrite:" + NL +
          "• ‘Sınır = sevgi koruması’" + NL +
          "• ‘Sistem = kalıcılık’",
        reflection:
          "Tek cümle yaz: Bugün sınırı nasıl sevgiyle kuruyorsun?",
      },
      en: {
        title: "80 · LAB: Protection Engine",
        story:
          "Code Eye: Protection / Boundary / System" + N2 +
          "Rule Engine:" + NL +
          "• ‘Be open = be good’" + NL +
          "• ‘Boundary = shame’" + N2 +
          "Rewrite:" + NL +
          "• ‘Boundary = protection of love’" + NL +
          "• ‘System = longevity’",
        reflection:
          "Write one sentence: How do you set boundaries with love today?",
      },
    },
  },
};
export const CITY_81: Record<CityCode, City7> = {
  "81": {
    city: "Duzce",

    base: {
      tr: {
        title: "81 · Yeni Sayfa",
        story:
          "Düzce bir şehir değil—yeninin açıldığı sayfadır." + N2 +
          "Bu kapı sana şunu öğretir: Yeniden kurmak utanılacak bir şey değil; ustalıktır." + N2 +
          "81’in enerjisi ‘hızlı uyum’ taşır: değişim gelir, sen düzen kurarsın." + N2 +
          "Düzce’nin mesajı: ‘Yıkıldıysa yeniden yap.’" + N2 +
          "Bu kapıdan geçerken şunu bil: Yenilik, korku değil; alan açımıdır.",
        reflection:
          "Bugün hangi yeni sayfayı açıyorum?",
      },
      en: {
        title: "81 · New Page",
        story:
          "Duzce is not only a city—it is the page where the new begins." + N2 +
          "This gate teaches: rebuilding is not shame; it is mastery." + N2 +
          "81 carries ‘fast adaptation’: change arrives, you build order." + N2 +
          "Duzce’s message: ‘If it fell, rebuild.’" + N2 +
          "Know this: newness is not fear—it is space being made.",
        reflection:
          "Which new page am I opening today?",
      },
    },

    deepC: {
      tr: {
        title: "81 · Matrix Derin İfşa",
        story:
          "Sistem 81’i ‘yeniden başlatma protokolü’ olarak çalıştırır." + N2 +
          "8 = güç, 1 = irade. 81 = gücün iradeyle yön bulması." + N2 +
          "Gölge test: Değişimi tehdit sanıp donmak." + NL +
          "Işık test: Değişimi fırsat sanıp sistem kurmak." + N2 +
          "81 sana şunu söyler: Güç, kontrol değil; yeniden kurabilme kapasitesidir." + N2 +
          "Bu kapı, ‘kırıldım’ yerine ‘kuruyorum’ dilini yerleştirir.",
        reflection:
          "Ben bugün değişimi tehdide mi, fırsata mı çeviriyorum?",
      },
      en: {
        title: "81 · Deep Matrix Reveal",
        story:
          "The system runs 81 as a ‘restart protocol.’" + N2 +
          "8 = power, 1 = will. 81 is power finding direction through will." + N2 +
          "Shadow test: freezing by seeing change as threat." + NL +
          "Light test: building systems by seeing change as opportunity." + N2 +
          "81 says: power is not control—it is the capacity to rebuild." + N2 +
          "This gate installs a new language: not ‘I broke,’ but ‘I build.’",
        reflection:
          "Do I turn change into threat—or into opportunity today?",
      },
    },

    history: {
      tr: {
        title: "81 · Tarih Katmanı",
        story:
          "Düzce, ‘yeni’ bir şehir hafızası taşır: yeniden yapılanma ve hızlı uyum." + N2 +
          "Tarih katmanı şunu öğretir: Yeni olmak, köksüz olmak değildir; yeni kök atmaktır." + N2 +
          "Bu katman, ‘yeniden kurma’ dersini bırakır: şehir bile yeniden kurulur, insan da." + N2 +
          "Yeni kök, yeni düzen, yeni yaşam.",
        reflection:
          "Ben hayatımda yeni kökü nereye atıyorum?",
      },
      en: {
        title: "81 · History Layer",
        story:
          "Duzce carries the memory of being ‘new’: rebuilding and fast adaptation." + N2 +
          "This layer teaches: being new is not being rootless; it is planting new roots." + N2 +
          "It leaves the lesson: if a city can rebuild, so can you." + N2 +
          "New root, new order, new life.",
        reflection:
          "Where am I planting a new root in my life?",
      },
    },

    numerology: {
      tr: {
        title: "81 · Numeroloji",
        story:
          "81 = güç + irade / kapanış ve yeni başlangıç." + N2 +
          "81’in gölgesi:" + NL +
          "• donma" + NL +
          "• ‘bir daha olmaz’ inancı" + N2 +
          "81’in ışığı:" + NL +
          "• yeniden kurma" + NL +
          "• güçlü karar" + NL +
          "• yeni düzen" + N2 +
          "Bu kapı sorar: ‘Yeniyi seçiyor musun?’",
        reflection:
          "Bugün yeniyi seçtiğim tek karar ne?",
      },
      en: {
        title: "81 · Numerology",
        story:
          "81 = power + will / closure and new beginning." + N2 +
          "Shadow of 81:" + NL +
          "• freezing" + NL +
          "• belief ‘it won’t happen again’" + N2 +
          "Light of 81:" + NL +
          "• rebuilding" + NL +
          "• strong decision" + NL +
          "• new order" + N2 +
          "This gate asks: ‘Do you choose the new?’",
        reflection:
          "What is my one decision that chooses the new today?",
      },
    },

    symbols: {
      tr: {
        title: "81 · Sembol Decode",
        story:
          "Bu kapının sembolleri:" + N2 +
          "• Tuğla: yeniden kurma." + NL +
          "• Plan: sistem." + NL +
          "• Fidan: yeni kök." + NL +
          "• 81 ışık noktası: yeni sayfa." + N2 +
          "Sembol mesajı: ‘Yeniyi inşa et.’",
        reflection:
          "Bugün hangi tuğlayı koyuyorum?",
      },
      en: {
        title: "81 · Symbol Decode",
        story:
          "Symbols of this gate:" + N2 +
          "• Brick: rebuilding." + NL +
          "• Plan: system." + NL +
          "• Sapling: new root." + NL +
          "• 81 light points: new page." + N2 +
          "Symbol message: ‘Build the new.’",
        reflection:
          "Which brick am I placing today?",
      },
    },

    ritual: {
      tr: {
        title: "81 · Ritüel",
        story:
          "81 Dakika Ritüeli (Yeni Düzen):" + N2 +
          "1) Bugün kurmak istediğin yeni düzeni yaz." + NL +
          "2) 8 küçük adım çıkar." + NL +
          "3) 1 adımı hemen yap." + NL +
          "4) 81 nefes al. Son nefeste söyle: ‘Kuruyorum.’" + N2 +
          "Kapanış: ‘Yeni sayfa açık.’",
        reflection:
          "Bugün hangi 1 adımı gerçekten yapıyorum?",
      },
      en: {
        title: "81 · Ritual",
        story:
          "81-Minute Ritual (New Order):" + N2 +
          "1) Write the new order you want to build." + NL +
          "2) Create 8 small steps." + NL +
          "3) Do 1 step immediately." + NL +
          "4) Take 81 breaths. On the last say: ‘I build.’" + N2 +
          "Closing: ‘New page is open.’",
        reflection:
          "Which 1 step am I truly doing today?",
      },
    },

    lab: {
      tr: {
        title: "81 · LAB: Rebuild Engine",
        story:
          "Kod Gözü: Yeniden Kurma / Güç / İrade" + N2 +
          "Kural Motoru:" + NL +
          "• ‘Yıkıldıysa bitti’" + NL +
          "• ‘Değişim = tehlike’" + N2 +
          "Rewrite:" + NL +
          "• ‘Yıkıldıysa başlar’" + NL +
          "• ‘Değişim = alan’",
        reflection:
          "Tek cümle yaz: Bugün ‘bitti’ yerine hangi cümleyi yazıyorsun?",
      },
      en: {
        title: "81 · LAB: Rebuild Engine",
        story:
          "Code Eye: Rebuilding / Power / Will" + N2 +
          "Rule Engine:" + NL +
          "• ‘If it collapsed, it’s over’" + NL +
          "• ‘Change = danger’" + N2 +
          "Rewrite:" + NL +
          "• ‘If it collapsed, it begins’" + NL +
          "• ‘Change = space’",
        reflection:
          "Write one sentence: What sentence replaces ‘it’s over’ today?",
      },
    },
  },
};

/**
 * ✅ 02–81 stub (tam boş → ekranda $ vs çıkmaz)
 * Dilersen boş olanları UI’da “yakında” diye gösterebiliriz.
 */
export const STUB_01_81: Record<CityCode, City7> = Object.fromEntries(
  Array.from({ length: 81 }, (_, i) => {
    const code = String(i + 1).padStart(2, "0") as CityCode;
    return [code, makeEmptyEntry(code)] as const;
  })
) as Record<CityCode, City7>;

/**
 * ✅ Export edilen tek veri (UI sadece bunu çağırır)
 * Sıra önemli: stub -> city overrides
 */
export const AWAKENED_7: Record<CityCode, City7> = {
  ...STUB_01_81,
  ...CITY_81,
  ...CITY_80,
  ...CITY_79,
  ...CITY_78,
  ...CITY_77,
  ...CITY_76,
  ...CITY_75,
  ...CITY_74,
  ...CITY_73,
  ...CITY_72,
  ...CITY_71,
  ...CITY_70,
  ...CITY_69,
  ...CITY_68,
  ...CITY_67,
  ...CITY_66,
  ...CITY_65,
  ...CITY_64,
  ...CITY_63,
  ...CITY_62,
  ...CITY_61,
  ...CITY_60,
  ...CITY_59,
  ...CITY_58,
  ...CITY_57,
  ...CITY_56,
  ...CITY_55,
  ...CITY_54,
  ...CITY_53,
  ...CITY_52,
  ...CITY_51,
  ...CITY_50,
  ...CITY_49,
  ...CITY_48,
  ...CITY_47,
  ...CITY_46,
  ...CITY_45,
  ...CITY_44,
  ...CITY_43,
  ...CITY_42,
  ...CITY_41,
  ...CITY_40,
  ...CITY_39,
  ...CITY_38,
  ...CITY_37,
  ...CITY_36,
  ...CITY_35,
  ...CITY_34,
  ...CITY_33,
  ...CITY_32,
  ...CITY_31,
  ...CITY_30,
  ...CITY_29,
  ...CITY_28,
  ...CITY_27,
  ...CITY_26,
  ...CITY_25,
  ...CITY_24,
  ...CITY_23,
  ...CITY_22,
  ...CITY_21,
  ...CITY_20,
  ...CITY_19,
  ...CITY_18,
  ...CITY_17,
  ...CITY_16,
  ...CITY_15,
  ...CITY_14,
  ...CITY_13,
  ...CITY_12,
  ...CITY_11,
  ...CITY_10,
  ...CITY_09,
  ...CITY_08,
  ...CITY_07,
  ...CITY_06,
  ...CITY_05,
  ...CITY_04,
  ...CITY_03,
  ...CITY_02,
  ...CITY_01,
};



/**
 * ✅ TEK API (UI sadece bunu çağırır)
 */
export function getCityContent(code: CityCode, lang: Lang, layer: Layer = "base"): CityBlock {
  const entry = AWAKENED_7[code];
  const city = entry?.city || CITY_NAMES?.[code] || "Unknown";

  if (!entry) {
    return {
      title: code + " · Unknown",
      story: "Content not found.",
      reflection: "Data missing.",
    };
  }

  const base = entry.base[lang];

  if (layer === "base") {
    return {
      title: fill(base.title, code, city),
      story: fill(base.story, code, city),
      reflection: fill(base.reflection, code, city),
    };
  }

  if (layer === "deep") {
    const blocks = [
      entry.deepC[lang],
      entry.history[lang],
      entry.numerology[lang],
      entry.symbols[lang],
      entry.ritual[lang],
    ];

    const deepStory = blocks
      .map((b) => "◆ " + fill(b.title, code, city) + N2 + fill(b.story, code, city))
      .join(N2 + "—" + N2);

    return {
      title: fill(base.title, code, city),
      story: fill(base.story, code, city) + (deepStory ? N2 + deepStory : ""),
      reflection: fill(blocks[blocks.length - 1].reflection, code, city),
    };
  }

  // LAB
  const lab = entry.lab[lang];
  return {
    title: fill(lab.title, code, city),
    story: fill(lab.story, code, city),
    reflection: fill(lab.reflection, code, city),
  };
}