/**
 * Ders başına SANRI «ile Çöz» alt metni ve placeholder (TR/EN).
 */

type Hint = { tr: { sub: string; placeholder: string }; en: { sub: string; placeholder: string } };

const BY_LESSON: Record<string, Hint> = {
  "kod-nedir": {
    tr: {
      sub:
        "Burada düz açıklama yok — kelimeyi, sayıyı veya cümleyi kod gibi parçalayan Üst Bilinç okuması.\n\n" +
        "İsim, şehir, kısa kavram veya rakam — SANRI katman kırılımlarıyla okur.\n\n" +
        "Bu dersin kalbi rakam ritmidir; dilersen bugün içinden geçen tek cümleyi de ekle.",
      placeholder: "Bugün içinden geçen bir cümle… veya 7, 23, bir saat, bir tarih…",
    },
    en: {
      sub:
        "No flat lecture — upper-consciousness reading of number, word, or sentence as code.\n\n" +
        "The heart of this lesson is number rhythm; you may add one sentence from today.",
      placeholder: "A sentence from today… or 7, 23, a time, a date…",
    },
  },
  "insan-kod": {
    tr: {
      sub:
        "Burada düz açıklama yok — kelimeyi kod gibi parçalayan Üst Bilinç Kodlama okuması.\n\n" +
        "İsim, şehir, kısa kavram, ilişki kelimesi veya ders pratiğindeki kod — SANRI ses ve katman kırılımlarıyla okur.\n\n" +
        "Adının veya seni çağıran bir kelimenin üzerinde iki dakika kal: sana ne hissettirdi? Yaz.",
      placeholder: "Adın, lakabın, seni çağıran bir kelime… (örn: Selin, annem, ev)",
    },
    en: {
      sub:
        "Upper-consciousness code reading — not a lecture.\n\n" +
        "Stay two minutes with your name or a word that calls you: what does it feel like? Write it.",
      placeholder: "Your name, nickname, or a word that summons you…",
    },
  },
  "kelimeyi-parcalamak": {
    tr: {
      sub:
        "Burada düz açıklama yok — kelimeyi kod gibi parçalayan Üst Bilinç Kodlama okuması.\n\n" +
        "İsim, şehir, kısa kavram, ilişki kelimesi veya ders pratiğindeki kod — SANRI ses ve katman kırılımlarıyla okur; hece, ters ayna ve anagramı karıştırmadan gösterir.",
      placeholder:
        "Son günlerde sık kullandığın veya içini sıkıştıran bir kelime… Hecelere böl ve her parçaya tek satırlık bir his notu düş (SANRI katmanlarıyla birlikte okur).",
    },
    en: {
      sub:
        "No flat lecture — upper-consciousness reading: split as code; syllables, reversal, multiset in order.\n\n" +
        "Name, place, concept, relationship word — SANRI shows layers.",
      placeholder: "A word you use often or that tightens you — note one feeling line per piece.",
    },
  },
  "anlam-katmanlari": {
    tr: {
      sub: "Bir kelime veya kısa cümle seç — SANRI yüzey, alt ve derin katmanı ayrı başlıklarda okusun.",
      placeholder: "Senin için bugün «titreten» bir kelime…",
    },
    en: {
      sub: "Pick a word or short line — surface, sub-layer, deep layer as separate sections.",
      placeholder: "A word that trembles for you today…",
    },
  },
  "tekrar-eden-kelimeler": {
    tr: {
      sub: "Aynı kelimeyi kim tekrar ediyor, hangi tonla? SANRI temayı ve farkı yüzeye çıkarsın.",
      placeholder: "Tekrar duyduğun bir kelime ve kim söylüyor…",
    },
    en: {
      sub: "Who repeats the same word, in what tone? Bring theme and contrast forward.",
      placeholder: "A repeated word and who says it…",
    },
  },
  "ic-ses-ayrimi": {
    tr: {
      sub: "İçinden geçen bir cümleyi yaz — bu ses sana mı ait, yoksa taşınan bir ton mu? SANRI ayırır.",
      placeholder: "Bugün kulak kabartan bir iç cümle…",
    },
    en: {
      sub: "Write an inner line — is it yours or carried? SANRI helps separate.",
      placeholder: "An inner sentence that startled you today…",
    },
  },
  "ilk-okuma-pratigi": {
    tr: {
      sub: "Kısa bir alıntı veya kendi cümlen (en fazla 2–3 satır) — SONUÇ değil SÜREÇ: SANRI nasıl okuduğunu göstersin.",
      placeholder: "2–3 satırlık bir metin parçası veya not…",
    },
    en: {
      sub: "A short quote or your lines — process of reading, not the final verdict.",
      placeholder: "2–3 lines of text or notes…",
    },
  },
  "donguler-tekrar": {
    tr: {
      sub: "Tekrar eden bir ilişki veya duygu örüntüsünü yaz — SANRI döngünün kodunu ve kök ipucunu göstersin.",
      placeholder: "Tanıştığın bir döngü, tekrar eden tema…",
    },
    en: {
      sub: "Describe a repeating emotional or relational pattern — code of the cycle.",
      placeholder: "A loop you recognise in relationships…",
    },
  },
  "karmik-bag-nedir": {
    tr: {
      sub: "Bırakamadığın bir çekim veya yoğun bağ — SANRI bağı bir etiket etmeden «motor» ve «döngü» olarak okusun.",
      placeholder: "Bu bağ beni nereye çekiyor? (kısaca)",
    },
    en: {
      sub: "A bond you cannot drop — read motor and loop without moral label.",
      placeholder: "Where does this pull drag me? (brief)",
    },
  },
  "ruhsal-bag-travma-bagi": {
    tr: {
      sub: "«Onsuz yapamam» hissi veren bir bağ veya kişi — gerçek bağ mı, travma bağı mı? SANRI netleştirsin.",
      placeholder: "Bu ilişkide seni ne kilitlemişti?",
    },
    en: {
      sub: "A «can't live without» tie — real bond or trauma bond? SANRI clarifies hooks.",
      placeholder: "What locked you in this tie?",
    },
  },
  "neden-aldatiliriz": {
    tr: {
      sub: "Aldatılma deneyimini veya korkunu üç cümleyle — SANRI görülmeyen sinyalleri ve rol kırılmasını adlandırsın.",
      placeholder: "İhanet, güven kırıklığı, görmediğin uyarılar…",
    },
    en: {
      sub: "Betrayal theme in three lines — missed signals and role fracture.",
      placeholder: "Breach of trust, what you did not let yourself see…",
    },
  },
  "neden-kandiriliriz": {
    tr: {
      sub: "Kandırıldığını hissettiğin bir durum — SANRI hangi yanılsamayı seçtiğini ve sezgisini nasıl susturduğunu göstersin.",
      placeholder: "İnatla görmek istemediğin bir şey…",
    },
    en: {
      sub: "A situation where you were fooled — illusions chosen, intuition muted.",
      placeholder: "What you refused to look at…",
    },
  },
  "disil-eril-kodlar": {
    tr: {
      sub: "Bir ilişkide akış, sınır, yön — SANRI dişil/eril kod dengesizliğini yargılamadan okusun.",
      placeholder: "Kim ileri gidiyor, kim çekiliyor, nerede tıkanıyor?",
    },
    en: {
      sub: "Flow, border, direction in a bond — feminine/masculine code without moral heat.",
      placeholder: "Who advances, who retreats, where it jams?",
    },
  },
  "duygu-kodlari-kritik": {
    tr: {
      sub: "Aktif olan duygu motorunu yaz: terk, değersizlik, kontrol, görünmeme… SANRI hangisinin şu an ateşlediğini göstersin.",
      placeholder: "Bu ilişkide en çok titreten duygu hangisi?",
    },
    en: {
      sub: "Name the emotion engine: abandonment, worthlessness, control, invisibility… which fires now.",
      placeholder: "Which feeling drives this bond most?",
    },
  },
  "olay-kodlama": {
    tr: {
      sub: "Son günlerde içini titreten bir olay — SANRI olayı üç satırda ve «mesaj» olarak okusun.",
      placeholder: "Ne oldu, ne hissettirdi, ne çağrıştırdı?",
    },
    en: {
      sub: "A recent event that shook you — three lines + message reading.",
      placeholder: "What happened, felt, evoked?",
    },
  },
  "sistem-mesajlari": {
    tr: {
      sub: "Haber akışından veya gündemden takılı kalan bir tema — SANRI kolektif mesaj ile senin kişisel katmanını ayırsın.",
      placeholder: "Tekrar eden haber, slogan, korku teması…",
    },
    en: {
      sub: "A recurring headline or collective fear — collective vs personal layer.",
      placeholder: "A theme that keeps returning in the news…",
    },
  },
  "kisisel-matrix": {
    tr: {
      sub: "Hayatında tekrar ettiğini fark ettiğin bir «kural» veya hamle — SANRI kişisel matrix kodunu adlandırsın.",
      placeholder: "Yine aynı yerde takılıyorum: …",
    },
    en: {
      sub: "A rule or move you repeat — name your personal matrix code.",
      placeholder: "I keep doing the same thing when…",
    },
  },
  "kor-noktalar": {
    tr: {
      sub: "Görmediğin bir şey için kullandığın strateji (meşguliyet, şaka, erteleme…) — SANRI kör noktayı açsın.",
      placeholder: "Görmek için neye sarılıyorum?",
    },
    en: {
      sub: "Your strategy not to see — busy, joke, delay… blind spot surfaces.",
      placeholder: "What I use to not look…",
    },
  },
  "kirilma-noktalari": {
    tr: {
      sub: "Son kırılma anın veya dönüş eşiği — SANRI kaybı ve kazanılan yönü birlikte okusun.",
      placeholder: "O anda ne söyledi iç ses, ne kırıldı?",
    },
    en: {
      sub: "A break or threshold moment — loss and gain of direction together.",
      placeholder: "At the break, what did inner voice say?",
    },
  },
  "kendi-kodunu-yaz": {
    tr: {
      sub: "Kendi dilinle üç kural veya işaret yaz — SANRI bunları tek bir «kod sayfası» gibi birleştirsin.",
      placeholder: "Benim sistemimde şu olursa şunu yaparım…",
    },
    en: {
      sub: "Three rules or signs in your words — one code sheet.",
      placeholder: "In my system, when… then I…",
    },
  },
  "final-hatirlama": {
    tr: {
      sub: "Bu yolculuktan tek cümle — SANRI öğrenilen değil, hatırlanan ne ise onu yansıtsın.",
      placeholder: "Şimdi hatırladığım şey…",
    },
    en: {
      sub: "One sentence from the journey — remembered, not «learned».",
      placeholder: "What I remember now…",
    },
  },
};

const MOD_FALLBACK: Record<number, Hint> = {
  1: BY_LESSON["kod-nedir"]!,
  2: BY_LESSON["donguler-tekrar"]!,
  3: BY_LESSON["olay-kodlama"]!,
};

export function getLessonSanriHints(
  lessonId: string,
  modId: number,
  lang: "tr" | "en"
): { sub: string; placeholder: string } {
  const pack = BY_LESSON[lessonId]?.[lang] ?? MOD_FALLBACK[modId]?.[lang];
  if (pack) return pack;
  return { sub: "", placeholder: "" };
}
