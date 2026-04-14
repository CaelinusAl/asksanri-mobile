export type BookPage = {
  type: "cover" | "dedication" | "toc" | "quote" | "content" | "chapter" | "closing";
  title?: string;
  subtitle?: string;
  author?: string;
  body?: string;
  epigraph?: string;
  number?: number | string;
  items?: string[];
};

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
    price: 470,
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
