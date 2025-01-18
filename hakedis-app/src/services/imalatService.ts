import { ImalatTanimi, ImalatTuru } from '../types/imalat';
import { IMALAT_TANIMLARI } from '../data/imalatTanimlari';

const IMALAT_TANIMLARI_KEY = 'imalatTanimlari';

export const varsayilanImalatlariKaydet = (imalatlar: Record<ImalatTuru, ImalatTanimi>) => {
  try {
    localStorage.setItem(IMALAT_TANIMLARI_KEY, JSON.stringify(imalatlar));
    return true;
  } catch (error) {
    console.error('İmalatlar kaydedilirken hata oluştu:', error);
    return false;
  }
};

export const varsayilanImalatlariYukle = (): Record<ImalatTuru, ImalatTanimi> | null => {
  try {
    const kayitliImalatlar = localStorage.getItem(IMALAT_TANIMLARI_KEY);
    if (kayitliImalatlar) {
      return JSON.parse(kayitliImalatlar);
    }
    return null;
  } catch (error) {
    console.error('Varsayılan imalatlar yüklenemedi:', error);
    return null;
  }
};

export const getImalatTanimlari = () => {
  const savedImalatlar = localStorage.getItem(IMALAT_TANIMLARI_KEY);
  return savedImalatlar ? JSON.parse(savedImalatlar) : IMALAT_TANIMLARI;
};

export const getImalatMalzemeleri = (imalatTuru: ImalatTuru) => {
  const imalatlar = getImalatTanimlari();
  const imalat = imalatlar[imalatTuru];
  return imalat ? imalat.malzemeler : [];
};

export const getImalatTanimi = (imalatTuru: ImalatTuru): ImalatTanimi | undefined => {
  const imalatlar = getImalatTanimlari();
  return imalatlar[imalatTuru];
};

export const imalatSilinebilirMi = (imalatTuru: ImalatTuru): boolean => {
  const imalat = getImalatTanimi(imalatTuru);
  return imalat ? !imalat.temelImalat : true;
};

export const localStorageImalatlariVarsayilanYap = () => {
  try {
    localStorage.setItem(IMALAT_TANIMLARI_KEY, JSON.stringify(IMALAT_TANIMLARI));
    return true;
  } catch (error) {
    console.error('İmalatlar varsayılana döndürülürken hata oluştu:', error);
    return false;
  }
}; 