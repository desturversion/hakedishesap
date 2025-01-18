import { BirimTuru } from './malzeme';

export type ImalatTuru = 
  | 'kaba_siva'
  | 'ic_siva'
  | 'dis_siva'
  | 'seramik_kaplama'
  | 'boya_badana'
  | 'mantolama'
  | 'alcipan'
  | 'saten_alci'
  | 'cephe_kara_siva';

export interface ImalatMalzeme {
  malzemeId: string;
  sarfiyatOrani: number;
}

export interface ImalatTanimi {
  id: ImalatTuru;
  adi: string;
  birim: BirimTuru;
  malzemeler: ImalatMalzeme[];
  aciklama: string;
  temelImalat: boolean;
} 