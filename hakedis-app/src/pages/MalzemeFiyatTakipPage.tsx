import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  IconButton, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  FormControlLabel, 
  Switch, 
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { MalzemeFiyatTakip, AmbalajTuru, BirimTuru, AMBALAJ_SECENEKLERI } from '../types/malzeme';
import { getMalzemeFiyatlari, kaydetMalzemeFiyat, silMalzemeFiyat, guncelleOtomatikFiyatlar, topluMalzemeEkle } from '../services/malzemeFiyatService';
import { MalzemeFiyatTakipTablosu } from '../components/MalzemeFiyatTakip';

export const varsayilanMalzemeler = [
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

export const MalzemeFiyatTakipPage: React.FC = () => {
  const navigate = useNavigate();
  const [malzemeler, setMalzemeler] = useState<MalzemeFiyatTakip[]>([]);
  const [yeniMalzemeDialogOpen, setYeniMalzemeDialogOpen] = useState(false);
  const [yeniMalzeme, setYeniMalzeme] = useState<Partial<MalzemeFiyatTakip>>({
    id: '',
    adi: '',
    birim: 'M2' as BirimTuru,
    birimFiyat: 0,
    sarfiyatOrani: 1,
    otomatikGuncelleme: true,
    sonGuncellenmeTarihi: new Date(),
    fiyatGecmisi: []
  });
  const [secilenAmbalajTuru, setSecilenAmbalajTuru] = useState<AmbalajTuru | undefined>(undefined);
  const [secilenAmbalajMiktari, setSecilenAmbalajMiktari] = useState<number | undefined>(undefined);

  useEffect(() => {
    const malzemeler = getMalzemeFiyatlari();
    setMalzemeler(malzemeler);

    // Her sayfa yüklendiğinde otomatik fiyat güncellemesi yap
    guncelleOtomatikFiyatlar().then(guncellenenMalzemeler => {
      setMalzemeler(guncellenenMalzemeler);
    });
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleYeniMalzemeDialogOpen = () => {
    setYeniMalzemeDialogOpen(true);
  };

  const handleYeniMalzemeDialogClose = () => {
    setYeniMalzemeDialogOpen(false);
    setYeniMalzeme({
      id: '',
      adi: '',
      birim: 'M2' as BirimTuru,
      birimFiyat: 0,
      sarfiyatOrani: 1,
      otomatikGuncelleme: true,
      sonGuncellenmeTarihi: new Date(),
      fiyatGecmisi: []
    });
    setSecilenAmbalajTuru(undefined);
    setSecilenAmbalajMiktari(undefined);
  };

  const handleYeniMalzemeKaydet = () => {
    if (!yeniMalzeme.adi || !yeniMalzeme.birimFiyat) return;

    const yeniMalzemeTam: MalzemeFiyatTakip = {
      id: `malzeme_${Date.now()}`,
      adi: yeniMalzeme.adi,
      birim: secilenAmbalajTuru === 'adet' ? 'AD' : 'KG',
      birimFiyat: yeniMalzeme.birimFiyat,
      sarfiyatOrani: yeniMalzeme.sarfiyatOrani || 1,
      otomatikGuncelleme: yeniMalzeme.otomatikGuncelleme || false,
      sonGuncellenmeTarihi: new Date(),
      fiyatGecmisi: [{
        tarih: new Date(),
        birimFiyat: yeniMalzeme.birimFiyat,
      }],
      ambalajTuru: secilenAmbalajTuru || undefined,
      ambalajMiktari: secilenAmbalajMiktari || undefined
    };

    kaydetMalzemeFiyat(yeniMalzemeTam);
    setMalzemeler([...malzemeler, yeniMalzemeTam]);
    handleYeniMalzemeDialogClose();
  };

  const handleMalzemeGuncelle = (guncelMalzeme: MalzemeFiyatTakip) => {
    kaydetMalzemeFiyat(guncelMalzeme);
    setMalzemeler(malzemeler.map(malzeme => 
      malzeme.id === guncelMalzeme.id ? guncelMalzeme : malzeme
    ));
  };

  const handleMalzemeSil = (malzemeId: string) => {
    silMalzemeFiyat(malzemeId);
    setMalzemeler(malzemeler.filter(malzeme => malzeme.id !== malzemeId));
  };

  const handleTopluMalzemeSil = (malzemeIds: string[]) => {
    malzemeIds.forEach(id => silMalzemeFiyat(id));
    setMalzemeler(malzemeler.filter(malzeme => !malzemeIds.includes(malzeme.id)));
  };

  const handleVarsayilanMalzemeleriEkle = () => {
    topluMalzemeEkle(varsayilanMalzemeler);
    const malzemeler = getMalzemeFiyatlari();
    setMalzemeler(malzemeler);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, position: 'relative' }}>
        <IconButton 
          sx={{ position: 'absolute', top: 16, left: 16 }}
          onClick={handleHomeClick}
        >
          <HomeIcon />
        </IconButton>

        <Typography variant="h4" gutterBottom sx={{ mt: 4, textAlign: 'center' }}>
          Malzeme Fiyat Takibi
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleYeniMalzemeDialogOpen}
          >
            Yeni Malzeme Ekle
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleVarsayilanMalzemeleriEkle}
          >
            Varsayılan Malzemeleri Ekle
          </Button>
        </Stack>

        <MalzemeFiyatTakipTablosu 
          malzemeler={malzemeler}
          onMalzemeGuncelle={handleMalzemeGuncelle}
          onMalzemeSil={handleMalzemeSil}
          onTopluMalzemeSil={handleTopluMalzemeSil}
        />

        <Dialog open={yeniMalzemeDialogOpen} onClose={handleYeniMalzemeDialogClose}>
          <DialogTitle>Yeni Malzeme Ekle</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Malzeme Adı"
                fullWidth
                value={yeniMalzeme.adi}
                onChange={(e) => setYeniMalzeme({ ...yeniMalzeme, adi: e.target.value })}
              />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Ambalaj Türü</InputLabel>
                <Select
                  value={secilenAmbalajTuru || undefined}
                  label="Ambalaj Türü"
                  onChange={(e) => {
                    setSecilenAmbalajTuru(e.target.value as AmbalajTuru);
                    setSecilenAmbalajMiktari(undefined);
                  }}
                >
                  <MenuItem value={undefined}>Seçiniz</MenuItem>
                  <MenuItem value="adet">Adet</MenuItem>
                  <MenuItem value="torba">Torba</MenuItem>
                  <MenuItem value="kova">Kova</MenuItem>
                </Select>
              </FormControl>

              {secilenAmbalajTuru && secilenAmbalajTuru !== 'adet' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Ambalaj Miktarı</InputLabel>
                  <Select
                    value={secilenAmbalajMiktari || undefined}
                    label="Ambalaj Miktarı"
                    onChange={(e) => setSecilenAmbalajMiktari(Number(e.target.value))}
                  >
                    <MenuItem value={undefined}>Seçiniz</MenuItem>
                    {AMBALAJ_SECENEKLERI
                      .find(a => a.tur === secilenAmbalajTuru)
                      ?.miktarlar.map(miktar => (
                        <MenuItem key={miktar} value={miktar}>
                          {miktar} kg
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                margin="dense"
                label="Birim Fiyat (TL)"
                type="number"
                fullWidth
                value={yeniMalzeme.birimFiyat || ''}
                onChange={(e) => setYeniMalzeme({ ...yeniMalzeme, birimFiyat: parseFloat(e.target.value) })}
                sx={{ mt: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={yeniMalzeme.otomatikGuncelleme || false}
                    onChange={(e) => setYeniMalzeme({ ...yeniMalzeme, otomatikGuncelleme: e.target.checked })}
                  />
                }
                label="Otomatik Fiyat Güncellemesi"
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleYeniMalzemeDialogClose}>İptal</Button>
            <Button 
              onClick={handleYeniMalzemeKaydet}
              variant="contained"
              disabled={!yeniMalzeme.adi || !yeniMalzeme.birimFiyat || (!secilenAmbalajTuru) || (secilenAmbalajTuru !== 'adet' && !secilenAmbalajMiktari)}
            >
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}; 