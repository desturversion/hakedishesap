import { ImalatTuru, ImalatTanimi } from '../types/imalat';

export const IMALAT_TANIMLARI: Record<ImalatTuru, ImalatTanimi> = {
  kaba_siva: {
    id: 'kaba_siva',
    adi: 'Kaba Sıva',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_n45dcrhfr', sarfiyatOrani: 0.084 },
      { malzemeId: 'malzeme_1737206468646_3xp0agibd', sarfiyatOrani: 0.25 }
    ],
    aciklama: '1 M2 kaba sıva imalatı için gerekli malzemeler',
    temelImalat: true
  },
  ic_siva: {
    id: 'ic_siva',
    adi: 'İç Sıva',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_nw26xhcry', sarfiyatOrani: 0.5714 },
      { malzemeId: 'malzeme_1737206468646_3dly9abs8', sarfiyatOrani: 0.04 }
    ],
    aciklama: '1 M2 iç sıva imalatı için gerekli malzemeler',
    temelImalat: true
  },
  dis_siva: {
    id: 'dis_siva',
    adi: 'Dış Sıva',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_n45dcrhfr', sarfiyatOrani: 0.084 },
      { malzemeId: 'malzeme_1737206468646_3xp0agibd', sarfiyatOrani: 0.25 },
      { malzemeId: 'malzeme_1737206468646_e7b21qjio', sarfiyatOrani: 0.2 }
    ],
    aciklama: '1 M2 dış sıva imalatı için gerekli malzemeler',
    temelImalat: true
  },
  seramik_kaplama: {
    id: 'seramik_kaplama',
    adi: 'Seramik Kaplama',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_kv7q7fat9', sarfiyatOrani: 0.045 },
      { malzemeId: 'malzeme_1737206468646_l9g2q2ps4', sarfiyatOrani: 0.02 }
    ],
    aciklama: '1 M2 seramik kaplama imalatı için gerekli malzemeler',
    temelImalat: true
  },
  boya_badana: {
    id: 'boya_badana',
    adi: 'Boya Badana',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_0nr0qolyq', sarfiyatOrani: 0.25 },
      { malzemeId: 'malzeme_1737206468646_e7b21qjio', sarfiyatOrani: 0.2 }
    ],
    aciklama: '1 M2 boya badana imalatı için gerekli malzemeler',
    temelImalat: true
  },
  mantolama: {
    id: 'mantolama',
    adi: 'Mantolama',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_iiw7qdhza', sarfiyatOrani: 0.83 },
      { malzemeId: 'malzeme_1737206468646_iklxua2wh', sarfiyatOrani: 0.22 },
      { malzemeId: 'malzeme_1737206468646_53z298w7y', sarfiyatOrani: 0.19 },
      { malzemeId: 'malzeme_1737206468646_e7b21qjio', sarfiyatOrani: 0.2 },
      { malzemeId: 'malzeme_1737206468646_wx2nj2ud5', sarfiyatOrani: 6 }
    ],
    aciklama: '1 M2 mantolama imalatı için gerekli malzemeler',
    temelImalat: true
  },
  alcipan: {
    id: 'alcipan',
    adi: 'Alçıpan',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_dgusi15gv', sarfiyatOrani: 0.3 },
      { malzemeId: 'malzeme_1737206468646_kbuj77679', sarfiyatOrani: 0.4 },
      { malzemeId: 'malzeme_1737206468646_ra1r27ff2', sarfiyatOrani: 0.022 },
      { malzemeId: 'malzeme_1737206468646_0i6r0jckv', sarfiyatOrani: 0.1 },
      { malzemeId: 'malzeme_1737206468646_3dly9abs8', sarfiyatOrani: 0.04 }
    ],
    aciklama: '1 M2 alçıpan imalatı için gerekli malzemeler',
    temelImalat: true
  },
  saten_alci: {
    id: 'saten_alci',
    adi: 'Saten Alçı',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_3dly9abs8', sarfiyatOrani: 0.04 }
    ],
    aciklama: '1 M2 saten alçı imalatı için gerekli malzemeler',
    temelImalat: true
  },
  cephe_kara_siva: {
    id: 'cephe_kara_siva',
    adi: 'Cephe Kara Sıva',
    birim: 'M2',
    malzemeler: [
      { malzemeId: 'malzeme_1737206468646_n45dcrhfr', sarfiyatOrani: 0.084 },
      { malzemeId: 'malzeme_1737206468646_3xp0agibd', sarfiyatOrani: 0.25 },
      { malzemeId: 'malzeme_1737206468646_0i6r0jckv', sarfiyatOrani: 0.2 },
      { malzemeId: 'malzeme_1737206468646_5778ewoxn', sarfiyatOrani: 0.24 }
    ],
    aciklama: '1 M2 cephe kara sıva imalatı için gerekli malzemeler',
    temelImalat: true
  }
}; 