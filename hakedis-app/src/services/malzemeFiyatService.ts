import { MalzemeFiyatTakip, BirimTuru, AmbalajTuru } from '../types/malzeme';
import { getAylikEnflasyonOrani, hesaplaGuncelFiyat } from './enflasyonService';

const MALZEME_FIYAT_KEY = 'malzeme_fiyatlari';

export const getMalzemeFiyatlari = (): MalzemeFiyatTakip[] => {
  const data = localStorage.getItem(MALZEME_FIYAT_KEY);
  if (!data) return [];
  
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