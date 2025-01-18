export interface Imalat {
  id: string;
  isMiktari: number | string | null;
  isMiktariFormul?: string;
  isTuru: string;
  birimFiyat: number;
}

export interface HakedisData {
  imalatListesi: Imalat[];
  yemekKesintisi: number;
  yemekKesintisiAktif: boolean;
  avansKesintisi: number;
  avansKesintisiAktif: boolean;
  asgariUcretKesintisi: number;
  teminatOrani: number;
}

export interface HakedisSonuc {
  imalatlar: {
    id: string;
    isTuru: string;
    brutTutar: number;
  }[];
  toplamBrutHakedis: number;
  yemekKesintisi: number;
  avansKesintisi: number;
  asgariUcretKesintisi: number;
  teminatKesintisi: number;
  toplamKesinti: number;
  netHakedis: number;
} 