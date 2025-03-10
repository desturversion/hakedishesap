import { Container, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaliyetHesaplamaData, MaliyetSonuc, ImalatTuru, MalzemeFiyatTakip, BirimTuru } from '../types/malzeme';
import MaliyetHesaplamaForm from '../components/MaliyetHesaplamaForm';
import MaliyetSonucBilesen from '../components/MaliyetSonucBilesen';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getMalzemeFiyatlari } from '../services/malzemeFiyatService';

const MALZEME_BIRIM_MAP: { [key: string]: string } = {
  'duvar_malzemesi': 'adet',
  'cimento': 'torba',
  'kum': 'ton',
  'lama': 'adet',
  'kama': 'adet',
  'kopuk': 'adet',
  'eps': 'm²',
  'yapisalYapistirici': 'kg',
  'dubel': 'adet',
  'fileSivasi': 'kg',
  'sivaFilesi': 'm²',
  'tasyunu': 'm²',
  'sap_filesi': 'm²',
  'hazirSiva': 'kg',
  'sivaAstar': 'kg',
  'icCepheAstar': 'lt',
  'icCepheBoya': 'lt',
  'disCepheAstar': 'lt',
  'disCepheBoya': 'lt',
  'gazbeton_yapiskan': 'kg'
};

const MALZEME_ADI_MAP: { [key: string]: string } = {
  'duvar_malzemesi': 'Duvar Malzemesi',
  'cimento': 'Çimento (50kg Torba)',
  'kum': 'Kum',
  'lama': 'Lama',
  'kama': 'Kama',
  'kopuk': 'Montaj Köpüğü (600ml)',
  'eps': 'EPS Levha',
  'yapisalYapistirici': 'Yapısal Yapıştırıcı',
  'dubel': 'Dübel',
  'fileSivasi': 'File Sıvası',
  'sivaFilesi': 'Sıva Filesi',
  'tasyunu': 'Taşyünü Levha',
  'sap_filesi': 'Şap Filesi',
  'hazirSiva': 'Hazır Sıva',
  'sivaAstar': 'Sıva Astarı',
  'icCepheAstar': 'İç Cephe Astarı',
  'icCepheBoya': 'İç Cephe Boyası',
  'disCepheAstar': 'Dış Cephe Astarı',
  'disCepheBoya': 'Dış Cephe Boyası',
  'gazbeton_yapiskan': 'Gazbeton Yapıştırıcı'
};

// Varsayılan imalat türlerini localStorage'dan al veya varsayılanları kullan
const getImalatTurleri = (): ImalatTuru[] => {
  const savedImalatTurleri = localStorage.getItem('imalatTurleri');
  if (savedImalatTurleri) {
    return JSON.parse(savedImalatTurleri);
  }
  return defaultImalatTurleri;
};

// Malzeme haritalarını localStorage'dan al veya varsayılanları kullan
const getMalzemeHaritalari = () => {
  const savedMalzemeAdiMap = localStorage.getItem('malzemeAdiMap');
  const savedMalzemeBirimMap = localStorage.getItem('malzemeBirimMap');
  
  return {
    malzemeAdiMap: savedMalzemeAdiMap ? JSON.parse(savedMalzemeAdiMap) : MALZEME_ADI_MAP,
    malzemeBirimMap: savedMalzemeBirimMap ? JSON.parse(savedMalzemeBirimMap) : MALZEME_BIRIM_MAP
  };
};

// Varsayılan imalat türleri
const defaultImalatTurleri: ImalatTuru[] = [
  {
    id: "1",
    adi: "Duvar İmalatı",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "kum", sarfiyatOrani: 0.025, birimFiyat: 0 },
      { malzemeId: "cimento", sarfiyatOrani: 0.11, birimFiyat: 0 },
      { malzemeId: "kama", sarfiyatOrani: 0.24, birimFiyat: 0 },
      { malzemeId: "lama", sarfiyatOrani: 0.206, birimFiyat: 0 },
      { malzemeId: "kopuk_600ml", sarfiyatOrani: 0.071, birimFiyat: 0 },
      { malzemeId: "bims_10", sarfiyatOrani: 12.5, birimFiyat: 0 },
      { malzemeId: "bims_20", sarfiyatOrani: 12.5, birimFiyat: 0 }
    ],
    duvarOzellikleri: {
      malzemeler: [
        {
          id: "bims",
          adi: "Bims Blok",
          kalinliklar: [
            { id: "85", adi: "8.5cm", sarfiyat: 12.5, harcOrani: 0.46 },
            { id: "125", adi: "15 cm", sarfiyat: 12.5, harcOrani: 0.81 },
            { id: "185", adi: "18.5cm", sarfiyat: 12.5, harcOrani: 1 }
          ]
        },
        {
          id: "tugla",
          adi: "Tuğla",
          kalinliklar: [
            { id: "85", adi: "8.5cm", sarfiyat: 37, harcOrani: 0.46 },
            { id: "135", adi: "13.5cm", sarfiyat: 28, harcOrani: 0.73 },
            { id: "185", adi: "18.5cm", sarfiyat: 37, harcOrani: 1 }
          ]
        },
        {
          id: "gazbeton",
          adi: "Gazbeton",
          kalinliklar: [
            { id: "85", adi: "8.5cm", sarfiyat: 6.66, harcOrani: 0.46 },
            { id: "125", adi: "12.5cm", sarfiyat: 6.66, harcOrani: 0.68 },
            { id: "185", adi: "18.5cm", sarfiyat: 6.66, harcOrani: 1 }
          ]
        }
      ]
    },
    temelImalat: true
  },
  {
    id: "imalat_1737117003146",
    adi: "Şap İmalatım",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "cimento", sarfiyatOrani: 0.5, birimFiyat: 0 },
      { malzemeId: "kum", sarfiyatOrani: 0.084, birimFiyat: 0 },
      { malzemeId: "silte", sarfiyatOrani: 1.1, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737220100341",
    adi: "Cephe Kabasıva",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "kum", sarfiyatOrani: 0.084, birimFiyat: 0 },
      { malzemeId: "cimento", sarfiyatOrani: 0.25, birimFiyat: 0 },
      { malzemeId: "brut_beton_astari", sarfiyatOrani: 0.0089909, birimFiyat: 0 },
      { malzemeId: "sivamatik_hazir_siva", sarfiyatOrani: 0.8857, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737222245692",
    adi: "Seramik Yapılması",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "seramik_kose_profili", sarfiyatOrani: 0.045, birimFiyat: 0 },
      { malzemeId: "seramik_yapistirici", sarfiyatOrani: 0.025, birimFiyat: 0 },
      { malzemeId: "seramik_artisi", sarfiyatOrani: 4, birimFiyat: 0 },
      { malzemeId: "derz_dolgu", sarfiyatOrani: 0.02, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737222333261",
    adi: "Makine Alçı+ Kaba Karışık+ Saten",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "makine_alci", sarfiyatOrani: 0.5714, birimFiyat: 0 },
      { malzemeId: "perlitli_siva_alcisi", sarfiyatOrani: 0.171428, birimFiyat: 0 },
      { malzemeId: "baklava_dilimli_alci_kosebent", sarfiyatOrani: 0.025, birimFiyat: 0 },
      { malzemeId: "alci_kosebent_profili", sarfiyatOrani: 0.3, birimFiyat: 0 },
      { malzemeId: "ano_citasi", sarfiyatOrani: 0.4, birimFiyat: 0 },
      { malzemeId: "brüt_beton_astari", sarfiyatOrani: 0.022, birimFiyat: 0 },
      { malzemeId: "donati_filesi", sarfiyatOrani: 0.1, birimFiyat: 0 },
      { malzemeId: "saten_alci", sarfiyatOrani: 0.04, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737222567132",
    adi: "Duvarda Astar + 2 kat Boya",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "ic_cephe_boyasi", sarfiyatOrani: 0.25, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737222629828",
    adi: "Çimento Esaslı Hazır Sıva Uygulaması",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "fileli_kose_profili", sarfiyatOrani: 0.3, birimFiyat: 0 },
      { malzemeId: "dontati_filesi", sarfiyatOrani: 0.3, birimFiyat: 0 },
      { malzemeId: "brüt_beton_astari", sarfiyatOrani: 0.24, birimFiyat: 0 },
      { malzemeId: "isi_levha_sivasi", sarfiyatOrani: 0.2, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737222716812",
    adi: "Anolu Kaba Sıva",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "kum", sarfiyatOrani: 0.2, birimFiyat: 0 },
      { malzemeId: "cimento", sarfiyatOrani: 0.03, birimFiyat: 0 },
      { malzemeId: "ano_citasi", sarfiyatOrani: 0.2, birimFiyat: 0 },
      { malzemeId: "brüt_beton_astari", sarfiyatOrani: 0.02, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737222845828",
    adi: "Asansör ve Şaft içi El Alçısı Uygulaması",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "perlitli_siva_alcisi", sarfiyatOrani: 0.22857, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737222893748",
    adi: "Asansör Kovası Brüt Yüzeylere Boya Yapılması",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "tavan_boyasi", sarfiyatOrani: 0.2, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737222935403",
    adi: "Tavan Alçı + Saten",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "makine_alci", sarfiyatOrani: 0.57, birimFiyat: 0 },
      { malzemeId: "perlitli_siva_alcisi", sarfiyatOrani: 0.24, birimFiyat: 0 },
      { malzemeId: "brut_beton_astari", sarfiyatOrani: 0.01, birimFiyat: 0 },
      { malzemeId: "saten_alci", sarfiyatOrani: 0.04, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737223052013",
    adi: "Bodrum Duvar ve Tavan Mantolaması",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "eps_5cm", sarfiyatOrani: 0.83, birimFiyat: 0 },
      { malzemeId: "tasyunu_120_5", sarfiyatOrani: 0.22, birimFiyat: 0 },
      { malzemeId: "isi_levha_sivasi", sarfiyatOrani: 0.19, birimFiyat: 0 },
      { malzemeId: "isi_levha_yapistirici", sarfiyatOrani: 0.19, birimFiyat: 0 },
      { malzemeId: "celik_civi_dubel", sarfiyatOrani: 6, birimFiyat: 0 },
      { malzemeId: "donati_filesi", sarfiyatOrani: 1.1, birimFiyat: 0 },
      { malzemeId: "fileli_kose_profili", sarfiyatOrani: 0.3, birimFiyat: 0 }
    ],
    temelImalat: true
  },
  {
    id: "imalat_1737223236780",
    adi: "Cephe Mantolama + Fileli Sıva+ Dekoratif Sıva + Boya",
    birim: "M2" as BirimTuru,
    malzemeler: [
      { malzemeId: "tasyunu_120_5", sarfiyatOrani: 0.21, birimFiyat: 0 },
      { malzemeId: "tasyunu_120_3", sarfiyatOrani: 0.0693, birimFiyat: 0 },
      { malzemeId: "eps_5cm", sarfiyatOrani: 0.777, birimFiyat: 0 },
      { malzemeId: "isi_levha_sivasi", sarfiyatOrani: 0.2, birimFiyat: 0 },
      { malzemeId: "isi_levha_yapistirici", sarfiyatOrani: 0.2, birimFiyat: 0 },
      { malzemeId: "celik_civi_dubel", sarfiyatOrani: 6, birimFiyat: 0 },
      { malzemeId: "dıs_cephe_boya_astari", sarfiyatOrani: 0.022, birimFiyat: 0 },
      { malzemeId: "dekoratif_siva", sarfiyatOrani: 0.14, birimFiyat: 0 },
      { malzemeId: "brut_beton_astari", sarfiyatOrani: 0.00833333333, birimFiyat: 0 },
      { malzemeId: "dıs_cephe_silikonlu_boya", sarfiyatOrani: 0.0125, birimFiyat: 0 },
      { malzemeId: "fileli_kose_profili", sarfiyatOrani: 0.5, birimFiyat: 0 }
    ],
    temelImalat: true
  }
];

export default function MalzemeMaliyetPage() {
  const navigate = useNavigate();
  const [hesaplamaData, setHesaplamaData] = useState<MaliyetHesaplamaData>({
    imalatId: '',
    miktar: null,
    malzemeler: []
  });

  const [sonuc, setSonuc] = useState<MaliyetSonuc | null>(null);
  const [imalatTurleri, setImalatTurleri] = useState<ImalatTuru[]>(getImalatTurleri());
  const { malzemeAdiMap: initialMalzemeAdiMap } = getMalzemeHaritalari();
  const [malzemeAdiMap, setMalzemeAdiMap] = useState<{ [key: string]: string }>(initialMalzemeAdiMap);
  const [malzemeBirimMap, setMalzemeBirimMap] = useState<{ [key: string]: BirimTuru }>({
    '1': 'M2',
    '2': 'M2',
    '3': 'M2',
    '4': 'M2',
    '5': 'M2',
    '6': 'M2',
    '7': 'M2',
    '8': 'M2',
    '9': 'M2',
    '10': 'M2',
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [secilenImalatId, setSecilenImalatId] = useState<string>('');
  const [duzenlenenSarfiyatlar, setDuzenlenenSarfiyatlar] = useState<{
    [key: string]: number;
  }>({});
  const [malzemeFiyatlari, setMalzemeFiyatlari] = useState<MalzemeFiyatTakip[]>([]);
  const [malzemeSecimDialogOpen, setMalzemeSecimDialogOpen] = useState(false);
  const [yeniMalzemeDialogOpen, setYeniMalzemeDialogOpen] = useState(false);
  const [secilenYeniMalzemeler, setSecilenYeniMalzemeler] = useState<string[]>([]);
  const [yeniMalzeme, setYeniMalzeme] = useState<{
    id: string;
    adi: string;
    birim: BirimTuru;
    birimFiyat: number;
  }>({
    id: '',
    adi: '',
    birim: 'M2',
    birimFiyat: 0,
  });
  const [yeniImalatDialogOpen, setYeniImalatDialogOpen] = useState(false);
  const [yeniImalat, setYeniImalat] = useState<{
    id: string;
    adi: string;
  }>({
    id: '',
    adi: ''
  });
  const [aramaMetni, setAramaMetni] = useState('');
  const [imalatHataMesaji, setImalatHataMesaji] = useState('');

  useEffect(() => {
    // Malzeme fiyatlarını yükle
    const fiyatlar = getMalzemeFiyatlari();
    setMalzemeFiyatlari(fiyatlar);

    // Malzeme haritalarını güncelle
    const yeniMalzemeAdiMap = { ...malzemeAdiMap };
    const yeniMalzemeBirimMap = { ...malzemeBirimMap };

    fiyatlar.forEach(malzeme => {
      yeniMalzemeAdiMap[malzeme.id] = malzeme.adi;
      yeniMalzemeBirimMap[malzeme.id] = malzeme.birim;
    });

    setMalzemeAdiMap(yeniMalzemeAdiMap);
    setMalzemeBirimMap(yeniMalzemeBirimMap);

    // Mevcut imalat türlerindeki malzemelere birim fiyat ekle
    const guncelImalatTurleri = imalatTurleri.map(imalat => ({
      ...imalat,
      malzemeler: imalat.malzemeler.map(malzeme => {
        const malzemeFiyat = fiyatlar.find(f => f.id === malzeme.malzemeId);
        return {
          ...malzeme,
          birimFiyat: malzemeFiyat?.birimFiyat || 0
        };
      })
    }));

    setImalatTurleri(guncelImalatTurleri);
    localStorage.setItem('imalatTurleri', JSON.stringify(guncelImalatTurleri));
  }, []);

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
    setSecilenImalatId('');
    setDuzenlenenSarfiyatlar({});
  };

  const handleImalatSecim = (imalatId: string) => {
    setSecilenImalatId(imalatId);
    const imalat = imalatTurleri.find(i => i.id === imalatId);
    if (imalat) {
      const sarfiyatlar: { [key: string]: number } = {};
      imalat.malzemeler.forEach(m => {
        sarfiyatlar[m.malzemeId] = m.sarfiyatOrani;
      });
      setDuzenlenenSarfiyatlar(sarfiyatlar);
    }
  };

  const handleSarfiyatChange = (malzemeId: string, yeniDeger: number) => {
    setDuzenlenenSarfiyatlar(prev => ({
      ...prev,
      [malzemeId]: yeniDeger
    }));
  };

  const handleMalzemeSecimDialogOpen = () => {
    setMalzemeSecimDialogOpen(true);
    setSecilenYeniMalzemeler([]);
  };

  const handleMalzemeSecimDialogClose = () => {
    setMalzemeSecimDialogOpen(false);
    setSecilenYeniMalzemeler([]);
  };

  const handleMalzemeSecimToggle = (malzemeId: string) => {
    setSecilenYeniMalzemeler(prev => {
      if (prev.includes(malzemeId)) {
        return prev.filter(id => id !== malzemeId);
      } else {
        return [...prev, malzemeId];
      }
    });
  };

  const handleYeniMalzemeDialogOpen = () => {
    setYeniMalzemeDialogOpen(true);
    setYeniMalzeme({
      id: '',
      adi: '',
      birim: 'M2',
      birimFiyat: 0
    });
  };

  const handleYeniMalzemeDialogClose = () => {
    setYeniMalzemeDialogOpen(false);
  };

  const handleYeniMalzemeEkle = () => {
    if (!secilenImalatId || !yeniMalzeme.adi || !yeniMalzeme.birim) return;

    // Benzersiz ID oluştur
    const yeniId = `ozel_${Date.now()}`;

    // Malzeme haritalarını güncelle
    setMalzemeAdiMap(prev => ({
      ...prev,
      [yeniId]: yeniMalzeme.adi
    }));
    setMalzemeBirimMap(prev => ({
      ...prev,
      [yeniId]: yeniMalzeme.birim
    }));

    // İmalat türüne ekle
    const yeniImalatTurleri = imalatTurleri.map(imalat => {
      if (imalat.id === secilenImalatId) {
        return {
          ...imalat,
          malzemeler: [...imalat.malzemeler, {
            malzemeId: yeniId,
            sarfiyatOrani: 1,
            birimFiyat: yeniMalzeme.birimFiyat
          }]
        };
      }
      return imalat;
    });

    setImalatTurleri(yeniImalatTurleri);
    localStorage.setItem('imalatTurleri', JSON.stringify(yeniImalatTurleri));

    // Sarfiyat oranlarını güncelle
    setDuzenlenenSarfiyatlar(prev => ({
      ...prev,
      [yeniId]: 1
    }));

    handleYeniMalzemeDialogClose();
  };

  const handleMalzemeSil = (malzemeId: string) => {
    const yeniImalatTurleri = imalatTurleri.map(imalat => {
      if (imalat.id === secilenImalatId) {
        return {
          ...imalat,
          malzemeler: imalat.malzemeler.filter(m => m.malzemeId !== malzemeId)
        };
      }
      return imalat;
    });

    setImalatTurleri(yeniImalatTurleri);
    localStorage.setItem('imalatTurleri', JSON.stringify(yeniImalatTurleri));

    const { [malzemeId]: _, ...kalanSarfiyatlar } = duzenlenenSarfiyatlar;
    setDuzenlenenSarfiyatlar(kalanSarfiyatlar);
  };

  const handleSarfiyatKaydet = () => {
    const yeniImalatTurleri = imalatTurleri.map(imalat => {
      if (imalat.id === secilenImalatId) {
        return {
          ...imalat,
          malzemeler: imalat.malzemeler.map(malzeme => ({
            ...malzeme,
            sarfiyatOrani: duzenlenenSarfiyatlar[malzeme.malzemeId] || malzeme.sarfiyatOrani
          }))
        };
      }
      return imalat;
    });

    setImalatTurleri(yeniImalatTurleri);
    localStorage.setItem('imalatTurleri', JSON.stringify(yeniImalatTurleri));
    handleSettingsClose();
  };

  const hesaplaMaliyet = () => {
    const secilenImalat = imalatTurleri.find(i => i.id === hesaplamaData.imalatId);
    if (!secilenImalat || hesaplamaData.miktar === null) return;

    // Duvar kalınlığına göre harç oranını belirle
    let harcOrani = 1; // Varsayılan olarak 1
    if (secilenImalat.id === '1' && hesaplamaData.secilenDuvarMalzeme && hesaplamaData.secilenDuvarKalinlik) {
      const duvarMalzeme = secilenImalat.duvarOzellikleri?.malzemeler.find(m => m.id === hesaplamaData.secilenDuvarMalzeme);
      const kalinlik = duvarMalzeme?.kalinliklar.find(k => k.id === hesaplamaData.secilenDuvarKalinlik);
      if (kalinlik) {
        // Kalınlık değerini al (örn: "13.5cm" -> 13.5)
        const kalinlikDegeri = parseFloat(kalinlik.adi);
        // Harç oranını hesapla: kalınlık/18.5
        harcOrani = kalinlikDegeri / 18.5;
        console.log('Seçilen kalınlık:', kalinlik.adi, 'Kalınlık değeri:', kalinlikDegeri, 'Harç oranı:', harcOrani);
      }
    }

    const malzemeMaliyetleri = secilenImalat.malzemeler.map(malzeme => {
      if (!hesaplamaData.secilenMalzemeler?.[malzeme.malzemeId]) return null;

      // Güncel malzeme bilgilerini al
      const hesaplamaMalzeme = hesaplamaData.malzemeler.find(m => m.id === malzeme.malzemeId);
      if (!hesaplamaMalzeme) return null;

      // Malzeme adını al
      const malzemeAdi = malzemeAdiMap[malzeme.malzemeId]?.toLocaleUpperCase('tr-TR') || '';

      // Toplam gereken miktarı hesapla
      let gerekenMiktar = hesaplamaData.miktar! * hesaplamaMalzeme.sarfiyatOrani;
      
      // Kum ve çimento için harç oranını uygula
      if (secilenImalat.id === '1') {
        // Çimento için tüm olası yazım şekilleri
        const isCimento = ['CIMENTO', 'ÇİMENTO', 'ÇIMENTO', 'CİMENTO', 'ÇIMENTO', 'CIMENTO'].some(variant => 
          malzemeAdi.includes(variant)
        );
        const isKum = malzemeAdi.includes('KUM');

        if (isCimento || isKum) {
          gerekenMiktar = gerekenMiktar * harcOrani;
          console.log(`${malzemeAdi} için gereken miktar:`, gerekenMiktar, '(Harç oranı:', harcOrani, ')');
        }
      }
      
      // Birim fiyatı al ve toplam maliyeti hesapla
      const birimFiyat = hesaplamaMalzeme.birimFiyat;
      const toplamMaliyet = gerekenMiktar * birimFiyat;

      return {
        adi: malzemeAdiMap[malzeme.malzemeId],
        birim: malzemeBirimMap[malzeme.malzemeId] as BirimTuru,
        birimFiyat,
        gerekenMiktar,
        toplamMaliyet
      };
    }).filter((m): m is NonNullable<typeof m> => m !== null);

    const toplamMaliyet = malzemeMaliyetleri.reduce((toplam, m) => toplam + m.toplamMaliyet, 0);

    setSonuc({
      imalatAdi: secilenImalat.adi,
      toplamMiktar: hesaplamaData.miktar,
      malzemeler: malzemeMaliyetleri,
      toplamMaliyet
    });
  };

  const handleMalzemeEkle = () => {
    if (!secilenImalatId || secilenYeniMalzemeler.length === 0) return;

    const yeniImalatTurleri = imalatTurleri.map(imalat => {
      if (imalat.id === secilenImalatId) {
        const mevcutMalzemeIds = new Set(imalat.malzemeler.map(m => m.malzemeId));
        const yeniMalzemeler = secilenYeniMalzemeler
          .filter(id => !mevcutMalzemeIds.has(id))
          .map(id => {
            // Malzeme fiyat bilgisini bul
            const malzemeFiyat = malzemeFiyatlari.find(m => m.id === id);
            return {
              malzemeId: id,
              sarfiyatOrani: 1,
              birimFiyat: malzemeFiyat?.birimFiyat || 0
            };
          });

        return {
          ...imalat,
          malzemeler: [...imalat.malzemeler, ...yeniMalzemeler]
        };
      }
      return imalat;
    });

    setImalatTurleri(yeniImalatTurleri);
    localStorage.setItem('imalatTurleri', JSON.stringify(yeniImalatTurleri));

    // Yeni eklenen malzemelerin sarfiyat oranlarını ayarla
    const yeniSarfiyatlar = { ...duzenlenenSarfiyatlar };
    secilenYeniMalzemeler.forEach(id => {
      if (!duzenlenenSarfiyatlar[id]) {
        yeniSarfiyatlar[id] = 1;
      }
    });
    setDuzenlenenSarfiyatlar(yeniSarfiyatlar);

    handleMalzemeSecimDialogClose();
  };

  const handleYeniImalatDialogOpen = () => {
    setYeniImalatDialogOpen(true);
    setYeniImalat({
      id: '',
      adi: ''
    });
  };

  const handleYeniImalatDialogClose = () => {
    setYeniImalatDialogOpen(false);
  };

  const handleYeniImalatEkle = () => {
    if (!yeniImalat.adi) return;

    // Aynı isimde imalat türü var mı kontrol et
    const ayniIsimdeImalat = imalatTurleri.find(
      imalat => imalat.adi.toLowerCase() === yeniImalat.adi.toLowerCase()
    );

    if (ayniIsimdeImalat) {
      setImalatHataMesaji('Bu isimde bir imalat türü zaten mevcut!');
      return;
    }

    // Benzersiz ID oluştur
    const yeniId = `imalat_${Date.now()}`;
    
    const yeniImalatBilgisi: ImalatTuru = {
      id: yeniId,
      adi: yeniImalat.adi,
      malzemeler: [],
      duvarOzellikleri: undefined,
      birim: 'M2' as BirimTuru
    };

    const yeniImalatListesi = [...imalatTurleri, yeniImalatBilgisi];
    setImalatTurleri(yeniImalatListesi);
    localStorage.setItem('imalatTurleri', JSON.stringify(yeniImalatListesi));

    setImalatHataMesaji('');
    handleYeniImalatDialogClose();
    setSecilenImalatId(yeniId);
  };

  const handleImalatTuruSil = (imalatId: string) => {
    const yeniImalatTurleri = imalatTurleri.filter(imalat => imalat.id !== imalatId);
    setImalatTurleri(yeniImalatTurleri);
    localStorage.setItem('imalatTurleri', JSON.stringify(yeniImalatTurleri));
    
    if (secilenImalatId === imalatId) {
      setSecilenImalatId('');
      setDuzenlenenSarfiyatlar({});
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, position: 'relative' }}>
        <IconButton 
          sx={{ position: 'absolute', top: 16, left: 16 }}
          onClick={() => navigate('/')}
        >
          <HomeIcon />
        </IconButton>
        
        <IconButton 
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={handleSettingsOpen}
        >
          <SettingsIcon />
        </IconButton>

        <Typography variant="h4" gutterBottom sx={{ mt: 4, textAlign: 'center' }}>
          Malzeme Miktarı ve Maliyet Hesaplama
        </Typography>

        <MaliyetHesaplamaForm
          data={hesaplamaData}
          imalatTurleri={imalatTurleri}
          onChange={setHesaplamaData}
          onSubmit={hesaplaMaliyet}
          malzemeAdiMap={malzemeAdiMap}
          malzemeBirimMap={malzemeBirimMap}
          malzemeFiyatlari={malzemeFiyatlari}
        />

        {sonuc && <MaliyetSonucBilesen sonuc={sonuc} />}

        <Dialog open={settingsOpen} onClose={handleSettingsClose} maxWidth="md" fullWidth>
          <DialogTitle>İmalat Sarfiyat Ayarları</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
              <Grid item xs={9}>
                <FormControl fullWidth>
                  <InputLabel 
                    sx={{ 
                      backgroundColor: 'transparent !important',
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.87)',
                        backgroundColor: 'transparent !important'
                      }
                    }}
                  >
                    İmalat Türü
                  </InputLabel>
                  <Select
                    value={secilenImalatId}
                    label="İmalat Türü"
                    onChange={(e) => handleImalatSecim(e.target.value)}
                  >
                    {imalatTurleri.map(imalat => (
                      <MenuItem 
                        key={imalat.id} 
                        value={imalat.id}
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <span>{imalat.adi}</span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImalatTuruSil(imalat.id);
                          }}
                          sx={{ ml: 2 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleYeniImalatDialogOpen}
                  fullWidth
                  sx={{ height: '56px' }}
                >
                  Yeni İmalat
                </Button>
              </Grid>
            </Grid>

            {secilenImalatId && (
              <Paper sx={{ p: 2, mt: 2 }}>
                {imalatTurleri
                  .find(i => i.id === secilenImalatId)
                  ?.malzemeler.map(malzeme => (
                    <Grid container spacing={2} key={malzeme.malzemeId} alignItems="center">
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          label={`${malzemeAdiMap[malzeme.malzemeId]} Sarfiyat Oranı (${malzemeBirimMap[malzeme.malzemeId]}/m²)`}
                          type="number"
                          value={duzenlenenSarfiyatlar[malzeme.malzemeId] ?? ''}
                          onChange={(e) => handleSarfiyatChange(malzeme.malzemeId, e.target.value ? Number(e.target.value) : 0)}
                          placeholder={malzeme.sarfiyatOrani.toString()}
                          InputLabelProps={{
                            shrink: true,
                            sx: {
                              backgroundColor: 'transparent !important',
                              '& .MuiInputLabel-root': {
                                color: 'rgba(0, 0, 0, 0.87)',
                                backgroundColor: 'transparent !important'
                              }
                            }
                          }}
                          sx={{ mt: 2 }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton 
                          onClick={() => handleMalzemeSil(malzeme.malzemeId)}
                          color="error"
                          sx={{ mt: 2 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
              
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleMalzemeSecimDialogOpen}
                      fullWidth
                    >
                      Listeden Malzeme Ekle
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleYeniMalzemeDialogOpen}
                      fullWidth
                    >
                      Yeni Malzeme Ekle
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSettingsClose}>İptal</Button>
            <Button onClick={handleSarfiyatKaydet} variant="contained" color="primary">
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={malzemeSecimDialogOpen} onClose={handleMalzemeSecimDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>Malzeme Listesinden Seç</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Malzeme Ara"
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  backgroundColor: 'transparent !important',
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 0, 0, 0.87)',
                    backgroundColor: 'transparent !important'
                  }
                }
              }}
            />
            <List>
              {malzemeFiyatlari
                .filter(malzeme => 
                  malzeme.adi.toLowerCase().includes(aramaMetni.toLowerCase()) ||
                  malzeme.birim.toLowerCase().includes(aramaMetni.toLowerCase())
                )
                .map((malzeme) => {
                  const secilenImalat = imalatTurleri.find(i => i.id === secilenImalatId);
                  const mevcutMalzeme = secilenImalat?.malzemeler.some(m => m.malzemeId === malzeme.id);

                  return (
                    <ListItem
                      key={malzeme.id}
                      sx={{ 
                        opacity: mevcutMalzeme ? 0.5 : 1, 
                        pointerEvents: mevcutMalzeme ? 'none' : 'auto',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                      onClick={() => !mevcutMalzeme && handleMalzemeSecimToggle(malzeme.id)}
                    >
                      <ListItemText
                        primary={malzeme.adi}
                        secondary={`${malzeme.birimFiyat} TL/${malzeme.birim}`}
                      />
                      <ListItemSecondaryAction>
                        <Checkbox
                          checked={secilenYeniMalzemeler.includes(malzeme.id)}
                          onChange={() => handleMalzemeSecimToggle(malzeme.id)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMalzemeSecimDialogClose}>İptal</Button>
            <Button 
              onClick={handleMalzemeEkle} 
              variant="contained" 
              disabled={secilenYeniMalzemeler.length === 0}
            >
              Seçilen Malzemeleri Ekle
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={yeniMalzemeDialogOpen} onClose={handleYeniMalzemeDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Yeni Malzeme Ekle</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Malzeme Adı"
                  value={yeniMalzeme.adi}
                  onChange={(e) => setYeniMalzeme(prev => ({ ...prev, adi: e.target.value }))}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      backgroundColor: 'transparent !important',
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.87)',
                        backgroundColor: 'transparent !important'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Birim (m², kg, adet vb.)"
                  value={yeniMalzeme.birim}
                  onChange={(e) => {
                    const birimStr = e.target.value.toUpperCase();
                    const birim = (['AD', 'KG', 'M3', 'M2', 'M', 'TOP', 'TON'].includes(birimStr) ? birimStr : 'M2') as BirimTuru;
                    setYeniMalzeme(prev => ({ ...prev, birim }));
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      backgroundColor: 'transparent !important',
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.87)',
                        backgroundColor: 'transparent !important'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Birim Fiyat (TL)"
                  type="number"
                  value={yeniMalzeme.birimFiyat}
                  onChange={(e) => setYeniMalzeme(prev => ({ ...prev, birimFiyat: Number(e.target.value) || 0 }))}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      backgroundColor: 'transparent !important',
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.87)',
                        backgroundColor: 'transparent !important'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleYeniMalzemeDialogClose}>İptal</Button>
            <Button 
              onClick={handleYeniMalzemeEkle} 
              variant="contained" 
              disabled={!yeniMalzeme.adi || !yeniMalzeme.birim}
            >
              Malzeme Ekle
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={yeniImalatDialogOpen} onClose={handleYeniImalatDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Yeni İmalat Türü Ekle</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="İmalat Türü Adı"
                  value={yeniImalat.adi}
                  onChange={(e) => {
                    setYeniImalat(prev => ({ ...prev, adi: e.target.value }));
                    setImalatHataMesaji('');
                  }}
                  error={!!imalatHataMesaji}
                  helperText={imalatHataMesaji}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      backgroundColor: 'transparent !important',
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.87)',
                        backgroundColor: 'transparent !important'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleYeniImalatDialogClose}>İptal</Button>
            <Button 
              onClick={handleYeniImalatEkle} 
              variant="contained" 
              disabled={!yeniImalat.adi}
            >
              İmalat Türü Ekle
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
} 