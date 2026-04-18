export type BookPage = {
  type: "cover" | "dedication" | "toc" | "quote" | "content" | "chapter" | "closing";
  title?: string;
  subtitle?: string;
  author?: string;
  body?: string;
  epigraph?: string;
  number?: number | string;
  items?: string[];
  /** Okuyucuda `chapter` + hemen sonraki `content` tek sayfada birleştirildiğinde doldurulur. */
  chapterLead?: {
    number?: number | string;
    title: string;
    epigraph?: string;
  };
};

/**
 * JSON’da sıkça: sadece `chapter` başlığı + sonraki sayfada `content` gövdesi.
 * Başlık-only sayfa “konu sıçramış / boş sayfa” gibi göründüğü için birleştiririz.
 */
export function mergeChapterWithFollowingContent(pages: BookPage[]): BookPage[] {
  const out: BookPage[] = [];
  let i = 0;
  while (i < pages.length) {
    const p = pages[i];
    const next = pages[i + 1];
    if (
      p.type === "chapter" &&
      next?.type === "content" &&
      typeof next.body === "string"
    ) {
      out.push({
        ...next,
        type: "content",
        chapterLead: {
          number: p.number,
          title: p.title ?? "",
          epigraph: p.epigraph,
        },
      });
      i += 2;
    } else {
      out.push(p);
      i += 1;
    }
  }
  return out;
}

export type BookMeta = {
  id: string;
  title: string;
  author: string;
  description: string;
  color: string;
  isPremium: boolean;
  price: number;
  freePreviewPages: number;
  chapters: string[];
  /** Varsayılan: JSON sayfaları. "pdf" ise tam metin bundled PDF ile açılır. */
  reader?: "json" | "pdf";
  /** PDF kitaplar için kütüphane kartında gösterilecek sayfa sayısı (opsiyonel). */
  pageCount?: number;
  /** "pager": yatay sayfa çevirmeli okuyucu (web + mobil). */
  readingLayout?: "scroll" | "pager";
};

export const BOOKS: BookMeta[] = [
  {
    id: "kitap_112",
    title: "112. Kitap: Kendini Yaratan Tanrıça",
    author: "Celine River",
    description: "İlahi hatırlayış ve bilinç uyanışı metni. Her bölüm bir 'Kapı' gibi açılır.",
    color: "#c8a0ff",
    isPremium: true,
    price: 369,
    freePreviewPages: 6,
    chapters: [
      "Kitabın Niyeti",
      "Zihnin Oyunu",
      "Zaman-Para-Ölüm Üçgeni",
      "Kendini Yaratan",
      "Dişilin Geri Dönüşü",
      "Caelinus: Cennete Ait Olan",
      "Tanrı İçeriden Konuşur",
      "Uyanıştan Sonra Ne Olur?",
      "Boşluk ve Birleşme",
    ],
  },
  {
    id: "matrix_code",
    title: "Matrix Code: İkra",
    author: "Celine River & Rahmi Ergün",
    description: "Seçilmişlerin yolculuğu. Kodların öğretisi, evrensel semboller ve bilinç yükselişi.",
    color: "#48BB78",
    isPremium: true,
    price: 369,
    freePreviewPages: 6,
    chapters: [
      "Ruhsal Uyanış: Benim Hikâyem",
      "Evren, Bilinç ve Cehennemden Geçiş",
      "Kurban Edilen Dişil Enerji ve Koç Sembolizmi",
      "Simülasyonun Sesi — Müzikal Frekanslar",
      "Ay, Güneş ve Bilinç Yükselişi",
      "Yazı, Yazgı ve Gizli Mesajlar",
      "Matrix Sayı Kodları ve Anlamları",
      "Metatronik Izgara, Bilinç ve Ruhsal Uyanış",
      "Dünya — Bir Aşk Hikayesi",
      "Güvercinler ve Kendini Bulma Süreci",
      "Kaval Kemiği ve Ruhun Frekansı",
      "Fare, Sıçan ve Kedinin Sembolik Anlamları",
      "Semboller, Anlamlar ve Gerçeklik Üzerine",
      "Cehennem, Kuyu ve Bilgelik Yolculuğu",
      "Gözyaşı, Dişil Enerji ve Ruhun Arınması",
    ],
  },
  {
    id: "beyin_orgazm",
    title: "Beyin Orgazmı",
    author: "Celine River",
    description:
      "Bilgelik, hatırlayış ve bilinç titreşimi. Beyin, kalp, pineal, frekans ve yaratım üzerine tam metin.",
    color: "#D946EF",
    isPremium: true,
    price: 369,
    /** Uzun metin; önizleme sayısı düşük olunca okuma kesiliyordu (ör. 6 sonrası kilit). */
    freePreviewPages: 80,
    readingLayout: "pager",
    pageCount: 213,
    chapters: [
      "Zihin-Gönül Portalı: Hisseden Beynin Kodları",
      "His Kodları: Evrenin Gerçek Bilgi Taşıyıcıları",
      "Sezgi Alanı: Beynin Kuantum Zıplama Merkezi",
      "Beyin: Kozmik Bir Anten",
      "Bilgi Orgazmı: Bilinç Genişlemesinin Tanrısal Hâli",
      "Tantra ve Kozmik Sinir Sistemi",
      "Tanrı’nın Bakışı",
      "Erilin Sırrı: Birleşmedeki Mühür",
      "Kozmik Seks: Kundalini’yi Uyandıran Birleşme",
      "Zihin Orgazmı – Beynin Frekansa Boyun Eğmesi",
    ],
  },
  {
    id: "nurun_frekansi",
    title: "Nurun Frekansı",
    author: "Celine River",
    description: "Âl-i İmrân Suresi — Işık, soy, rahim ve sırrın frekansla açılışı.",
    color: "#ED8936",
    isPremium: false,
    price: 0,
    freePreviewPages: 999,
    chapters: [
      "Hayy'dan İmrân'a — Işık, Soy, Rahim",
      "Ölçüyü Koyan — Mîzanın Efendisi",
      "Rahmet Dağıtımı — Kalbe İnen Nur",
      "Dünya Süsüdür Ama Kalbinle Sarılırsan Yanarsın",
      "Şahitlik Eden Nur",
      "Oyun Bozuldu",
      "Dış Süsler, İç Tuzaklar",
      "Seçilmişlik Sırrı",
      "Rahimdeki Dua",
      "Söz, Rahme Düşünce",
      "Rahimde Konuşan Işık",
      "Yürüyen Kelâm",
      "Nurla Yalnız Kalanlar",
      "Işık Tanrı Değildir",
      "Adem Gibi — Yaratımın Titreşimsel Kopyası",
      "İbrahim'in Sırrı",
      "İbrahim'in Yolculuğu",
      "İbrahim'in Soyu",
      "Bilgiyi Eğip Bükenler",
    ],
  },
  {
    id: "oku",
    title: "OKU",
    author: "Celine River",
    description: "İkra — Oku demek değil, Hatırla demek. Bakara Suresi: Bilincin Aynası.",
    color: "#E53E3E",
    isPremium: false,
    price: 0,
    freePreviewPages: 999,
    chapters: [
      "Bismillah — Yaratımın Frekansı",
      "Fâtiha — Bilincin Kapısını Açan Dua",
      "Bakara Suresi — Benliğin İnekle İmtihanı",
      "İkiyüzlü Bilinç — Gölgeyle Dans",
      "Nuru Satmak ve Yarı Yolda Kalmak",
      "Yaradan'ı Hatırlayan, Cenneti İçinde Bulur",
      "Sembollerin Ardındaki Gerçek",
      "Bilgiyi Alan Ama Taşıyamayan Benlik",
      "Bakara — Ayet 58-74",
      "Bakara — Ayet 80-96",
      "Bakara — Ayet 99-129",
      "Bakara — Ayet 144",
    ],
  },
];

export function getBookById(id: string): BookMeta | undefined {
  return BOOKS.find((b) => b.id === id);
}

export function getFreeBooks(): BookMeta[] {
  return BOOKS.filter((b) => !b.isPremium);
}

export function getPremiumBooks(): BookMeta[] {
  return BOOKS.filter((b) => b.isPremium);
}
