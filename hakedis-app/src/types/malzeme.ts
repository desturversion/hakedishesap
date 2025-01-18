export interface DuvarKalinlik {
  id: string;
  adi: string;
  sarfiyat: number;
  harcOrani: number;  // 18.5cm duvar referans alınarak hesaplanan harç oranı (0-1 arası)
}

export interface DuvarMalzeme {
  id: string;
  adi: string;
  kalinliklar: DuvarKalinlik[];
}

export interface DuvarOzellikleri {
  malzemeler: DuvarMalzeme[];
}

export type BirimTuru = 'AD' | 'KG' | 'M3' | 'M2' | 'M' | 'TOP' | 'TON';

export type AmbalajTuru = 'torba' | 'kova' | 'adet';

export interface AmbalajSecenekleri {
  tur: AmbalajTuru;
  miktarlar: number[];
}

export interface Malzeme {
  id: string;
  adi: string;
  birim: BirimTuru;
  birimFiyat: number;
  sarfiyatOrani: number;
  guncelBirimFiyat?: number;
  ambalajTuru?: AmbalajTuru;
  ambalajMiktari?: number;
}

export const AMBALAJ_SECENEKLERI: AmbalajSecenekleri[] = [
  {
    tur: 'torba',
    miktarlar: [25, 35, 50]
  },
  {
    tur: 'kova',
    miktarlar: [12.5, 15, 20, 25]
  }
];

export interface ImalatTuru {
  id: string;
  adi: string;
  birim: BirimTuru;
  malzemeler: {
    malzemeId: string;
    sarfiyatOrani: number;
    birimFiyat: number;
  }[];
  duvarOzellikleri?: DuvarOzellikleri;
}

export interface MaliyetHesaplamaData {
  imalatId: string;
  miktar: number | null;  // Toplam imalat miktarı (m²), başlangıçta boş olabilir
  malzemeler: Malzeme[];
  secilenDuvarMalzeme?: string;  // Duvar malzeme tipi (bims, tugla, gazbeton)
  secilenDuvarKalinlik?: string;  // Duvar kalınlığı (85, 125, 185)
  secilenMalzemeler?: { [key: string]: boolean };  // Hangi malzemelerin seçili olduğunu tutan obje
}

export interface MaliyetSonuc {
  imalatAdi: string;
  toplamMiktar: number;
  malzemeler: {
    adi: string;
    birim: BirimTuru;
    birimFiyat: number;  // Artık kullanılmıyor ama geriye uyumluluk için tutuyoruz
    gerekenMiktar: number;
    toplamMaliyet: number;  // Artık kullanılmıyor ama geriye uyumluluk için tutuyoruz
  }[];
  toplamMaliyet: number;  // Artık kullanılmıyor ama geriye uyumluluk için tutuyoruz
}

export interface MalzemeFiyatGecmisi {
  tarih: Date;
  birimFiyat: number;
  enflasyonOrani?: number;
}

export interface MalzemeFiyatTakip extends Malzeme {
  fiyatGecmisi: MalzemeFiyatGecmisi[];
  sonGuncellenmeTarihi: Date;
  otomatikGuncelleme: boolean;
} 