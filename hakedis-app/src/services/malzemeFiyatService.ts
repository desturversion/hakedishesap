import { MalzemeFiyatTakip, BirimTuru, AmbalajTuru } from '../types/malzeme';
import { getAylikEnflasyonOrani, hesaplaGuncelFiyat } from './enflasyonService';

const MALZEME_FIYAT_KEY = 'malzeme_fiyatlari';

export const getMalzemeFiyatlari = (): MalzemeFiyatTakip[] => {
  const varsayilanMalzemeler: MalzemeFiyatTakip[] = [
    {
      id: 'makina_alci',
      adi: 'MAKİNA ALÇI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 91.00,
      ambalajTuru: 'torba',
      ambalajMiktari: 35,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 91.00 }]
    },
    {
      id: 'perlitli_siva_alcisi',
      adi: 'PERLİTLİ SIVA ALÇISI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 92.00,
      ambalajTuru: 'torba',
      ambalajMiktari: 35,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 92.00 }]
    },
    {
      id: 'alci_kosebent_profili',
      adi: 'ALÇI KÖŞEBENT PROFİLİ',
      birim: 'AD' as BirimTuru,
      birimFiyat: 12.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 12.00 }]
    },
    {
      id: 'brut_beton_astari',
      adi: 'BRÜT BETON ASTARI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 310.00,
      ambalajTuru: 'kova',
      ambalajMiktari: 20,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 310.00 }]
    },
    {
      id: 'saten_alci',
      adi: 'SATEN ALÇI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 93.00,
      ambalajTuru: 'torba',
      ambalajMiktari: 25,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 93.00 }]
    },
    {
      id: 'ic_cephe_silikonlu_boya',
      adi: 'İÇ CEPHE SİLİKONLU BOYA',
      birim: 'KG' as BirimTuru,
      birimFiyat: 389.00,
      ambalajTuru: 'kova',
      ambalajMiktari: 20,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 389.00 }]
    },
    {
      id: 'donati_filesi',
      adi: 'DONATI FİLESİ 165 GR',
      birim: 'TOP' as BirimTuru,
      birimFiyat: 440.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 440.00 }]
    },
    {
      id: 'fileli_kose_profili',
      adi: 'FİLELİ KÖŞE PROFİLİ',
      birim: 'AD' as BirimTuru,
      birimFiyat: 6.40,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 6.40 }]
    },
    {
      id: 'isi_levha_sivasi',
      adi: 'ISI LEVHA SIVASI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 93.19,
      ambalajTuru: 'torba',
      ambalajMiktari: 25,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 93.19 }]
    },
    {
      id: 'tavan_boyasi',
      adi: 'TAVAN BOYASI',
      birim: 'AD' as BirimTuru,
      birimFiyat: 235.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 235.00 }]
    },
    {
      id: 'kum',
      adi: 'KUM',
      birim: 'TON' as BirimTuru,
      birimFiyat: 640.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 640.00 }]
    },
    {
      id: 'cimento',
      adi: 'ÇİMENTO',
      birim: 'KG' as BirimTuru,
      birimFiyat: 145.00,
      ambalajTuru: 'torba',
      ambalajMiktari: 50,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 145.00 }]
    },
    {
      id: 'ano_citasi',
      adi: 'ANO ÇITASI',
      birim: 'AD' as BirimTuru,
      birimFiyat: 75.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 75.00 }]
    },
    {
      id: 'isi_levha_yapistirici',
      adi: 'ISI LEVHA YAPIŞTIRICISI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 91.41,
      ambalajTuru: 'torba',
      ambalajMiktari: 25,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 91.41 }]
    },
    {
      id: 'celik_civi_dubel',
      adi: 'ÇELİK ÇİVİ DÜBEL 11,5',
      birim: 'AD' as BirimTuru,
      birimFiyat: 1.76,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 1.76 }]
    },
    {
      id: 'dis_cephe_silikonlu_boya',
      adi: 'DIŞ CEPHE SİLİKONLU BOYA',
      birim: 'KG' as BirimTuru,
      birimFiyat: 2089.05,
      ambalajTuru: 'kova',
      ambalajMiktari: 15,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 2089.05 }]
    },
    {
      id: 'dis_cephe_boya_astari',
      adi: 'DIŞ CEPHE BOYA ASTARI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 335.00,
      ambalajTuru: 'kova',
      ambalajMiktari: 20,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 335.00 }]
    },
    {
      id: 'tasyunu_120_5',
      adi: 'TAŞYÜNÜ 120/5',
      birim: 'M2' as BirimTuru,
      birimFiyat: 154.50,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 154.50 }]
    },
    {
      id: 'tasyunu_120_3',
      adi: 'TAŞYÜNÜ 120/3',
      birim: 'M2' as BirimTuru,
      birimFiyat: 98.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 98.00 }]
    },
    {
      id: 'dekoratif_siva',
      adi: 'DEKORATİF SIVA',
      birim: 'KG' as BirimTuru,
      birimFiyat: 112.75,
      ambalajTuru: 'torba',
      ambalajMiktari: 25,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 112.75 }]
    },
    {
      id: 'seramik_yapistirici',
      adi: 'SERAMİK YAPIŞTIRICISI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 95.00,
      ambalajTuru: 'torba',
      ambalajMiktari: 25,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 95.00 }]
    },
    {
      id: 'derz_dolgu',
      adi: 'DERZ DOLGU',
      birim: 'KG' as BirimTuru,
      birimFiyat: 225.83,
      ambalajTuru: 'kova',
      ambalajMiktari: 20,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 225.83 }]
    },
    {
      id: 'seramik_kose_profili',
      adi: 'SERAMİK KÖŞE PROFİLİ',
      birim: 'AD' as BirimTuru,
      birimFiyat: 31.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 31.00 }]
    },
    {
      id: 'baklava_dilimli_alci_kosebent',
      adi: 'BAKLAVA DİLİMLİ ALÇI KÖŞEBENTİ',
      birim: 'AD' as BirimTuru,
      birimFiyat: 16.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 16.00 }]
    },
    {
      id: 'kalibel',
      adi: 'KALİBEL',
      birim: 'AD' as BirimTuru,
      birimFiyat: 114.75,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 114.75 }]
    },
    {
      id: 'cimento_esasli_su_yalitimi',
      adi: 'ÇİMENTO ESASLI SU YALITIMI',
      birim: 'KG' as BirimTuru,
      birimFiyat: 787.50,
      ambalajTuru: 'kova',
      ambalajMiktari: 20,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 787.50 }]
    },
    {
      id: 'seramik_artisi',
      adi: 'SERAMİK ARTISI',
      birim: 'AD' as BirimTuru,
      birimFiyat: 0.30,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 0.30 }]
    },
    {
      id: 'eps_5cm',
      adi: 'EPS 5 CM / 18 DANS',
      birim: 'AD' as BirimTuru,
      birimFiyat: 77.50,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 77.50 }]
    },
    {
      id: 'sivamatik_hazir_siva',
      adi: 'SIVAMATİK HAZIR SIVA',
      birim: 'KG' as BirimTuru,
      birimFiyat: 100.00,
      ambalajTuru: 'torba',
      ambalajMiktari: 35,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 100.00 }]
    },
    {
      id: 'silte',
      adi: 'ŞİLTE',
      birim: 'AD' as BirimTuru,
      birimFiyat: 19.50,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 19.50 }]
    },
    {
      id: 'plastik_dubel',
      adi: 'PLASTİK DÜBEL',
      birim: 'AD' as BirimTuru,
      birimFiyat: 0.80,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 0.80 }]
    },
    {
      id: 'kat_silmesi',
      adi: '48,5*5 KAT SİLMESİ',
      birim: 'M' as BirimTuru,
      birimFiyat: 80.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 80.00 }]
    },
    {
      id: 'sove_5_10',
      adi: 'SÖVE 5*10',
      birim: 'M' as BirimTuru,
      birimFiyat: 21.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 21.00 }]
    },
    {
      id: 'bims_10',
      adi: 'BİMS 10 LUK',
      birim: 'AD' as BirimTuru,
      birimFiyat: 9.25,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 9.25 }]
    },
    {
      id: 'bims_20',
      adi: 'BİMS 20 LİK',
      birim: 'AD' as BirimTuru,
      birimFiyat: 13.92,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 13.92 }]
    },
    {
      id: 'lama',
      adi: 'LAMA',
      birim: 'AD' as BirimTuru,
      birimFiyat: 2.82,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 2.82 }]
    },
    {
      id: 'kama',
      adi: 'KAMA',
      birim: 'AD' as BirimTuru,
      birimFiyat: 1.80,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 1.80 }]
    },
    {
      id: 'kopuk_600ml',
      adi: 'KÖPÜK 600 ML',
      birim: 'AD' as BirimTuru,
      birimFiyat: 70.00,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date('2025-01-18'),
      fiyatGecmisi: [{ tarih: new Date('2025-01-18'), birimFiyat: 70.00 }]
    }
  ];
  
  const data = localStorage.getItem(MALZEME_FIYAT_KEY);
  if (!data) return varsayilanMalzemeler;
  
  const malzemeler: MalzemeFiyatTakip[] = JSON.parse(data);
  return malzemeler.map(malzeme => ({
    ...malzeme,
    sonGuncellenmeTarihi: new Date(malzeme.sonGuncellenmeTarihi),
    fiyatGecmisi: malzeme.fiyatGecmisi.map(gecmis => ({
      ...gecmis,
      tarih: new Date(gecmis.tarih)
    }))
  }));
};

export const kaydetMalzemeFiyat = (malzeme: MalzemeFiyatTakip): void => {
  const mevcutMalzemeler = getMalzemeFiyatlari();
  const malzemeIndex = mevcutMalzemeler.findIndex(m => m.id === malzeme.id);
  
  if (malzemeIndex >= 0) {
    mevcutMalzemeler[malzemeIndex] = malzeme;
  } else {
    mevcutMalzemeler.push(malzeme);
  }
  
  localStorage.setItem(MALZEME_FIYAT_KEY, JSON.stringify(mevcutMalzemeler));
};

export const silMalzemeFiyat = (malzemeId: string): void => {
  const mevcutMalzemeler = getMalzemeFiyatlari();
  const yeniMalzemeler = mevcutMalzemeler.filter(m => m.id !== malzemeId);
  localStorage.setItem(MALZEME_FIYAT_KEY, JSON.stringify(yeniMalzemeler));
};

export const guncelleOtomatikFiyatlar = async (): Promise<MalzemeFiyatTakip[]> => {
  const malzemeler = getMalzemeFiyatlari();
  const enflasyonOrani = await getAylikEnflasyonOrani();
  
  const guncellenenMalzemeler = malzemeler.map(malzeme => {
    if (!malzeme.otomatikGuncelleme) return malzeme;
    
    const sonFiyat = malzeme.birimFiyat || 0;
    const guncelFiyat = hesaplaGuncelFiyat(
      sonFiyat,
      malzeme.sonGuncellenmeTarihi,
      enflasyonOrani
    );
    
    if (guncelFiyat === sonFiyat) return malzeme;
    
    const yeniMalzeme: MalzemeFiyatTakip = {
      ...malzeme,
      birimFiyat: guncelFiyat,
      sonGuncellenmeTarihi: new Date(),
      fiyatGecmisi: [
        ...malzeme.fiyatGecmisi,
        {
          tarih: new Date(),
          birimFiyat: guncelFiyat,
          enflasyonOrani
        }
      ]
    };
    
    kaydetMalzemeFiyat(yeniMalzeme);
    return yeniMalzeme;
  });
  
  return guncellenenMalzemeler;
};

export const topluMalzemeEkle = (malzemeListesi: { adi: string; birim: BirimTuru; birimFiyat: number; ambalajTuru?: string; ambalajMiktari?: number }[]): void => {
  const yeniMalzemeler: MalzemeFiyatTakip[] = malzemeListesi.map(malzeme => ({
    id: `malzeme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    adi: malzeme.adi,
    birim: malzeme.birim,
    birimFiyat: malzeme.birimFiyat,
    sarfiyatOrani: 1,
    ambalajTuru: malzeme.ambalajTuru as AmbalajTuru | undefined,
    ambalajMiktari: malzeme.ambalajMiktari,
    otomatikGuncelleme: true,
    sonGuncellenmeTarihi: new Date(),
    fiyatGecmisi: [{
      tarih: new Date(),
      birimFiyat: malzeme.birimFiyat
    }]
  }));

  const mevcutMalzemeler = getMalzemeFiyatlari();
  const birlesikMalzemeler = [...mevcutMalzemeler, ...yeniMalzemeler];
  
  localStorage.setItem(MALZEME_FIYAT_KEY, JSON.stringify(birlesikMalzemeler));
}; 