// TCMB'den enflasyon verilerini çekmek için örnek bir servis
// Gerçek uygulamada bir API endpoint'i kullanılmalıdır

export interface EnflasyonVeri {
  tarih: Date;
  oran: number;
}

export const getAylikEnflasyonOrani = async (): Promise<number> => {
  // TODO: Burada TCMB API'si veya başka bir kaynaktan güncel enflasyon oranı çekilecek
  // Şimdilik sabit bir değer döndürüyoruz
  return 3.5; // Örnek: %3.5
};

export const hesaplaGuncelFiyat = (eskiFiyat: number, eskiTarih: Date, enflasyonOrani: number): number => {
  const bugun = new Date();
  const ayFarki = (bugun.getFullYear() - eskiTarih.getFullYear()) * 12 + 
                 (bugun.getMonth() - eskiTarih.getMonth());
  
  // Bileşik faiz formülü ile fiyat güncelleme
  const guncelFiyat = eskiFiyat * Math.pow(1 + (enflasyonOrani / 100), ayFarki);
  
  return Number(guncelFiyat.toFixed(2));
}; 