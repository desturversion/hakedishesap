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
  { adi: 'MAKİNA ALÇI', birim: 'KG' as BirimTuru, birimFiyat: 3.25, ambalajTuru: 'torba', ambalajMiktari: 35 },
  { adi: 'PERLİTLİ SIVA ALÇI', birim: 'KG' as BirimTuru, birimFiyat: 3.25, ambalajTuru: 'torba', ambalajMiktari: 35 },
  { adi: 'ALÇI KÖŞE PROFİLİ', birim: 'M' as BirimTuru, birimFiyat: 10.02, ambalajTuru: 'adet' },
  { adi: 'SIVA FİLESİ 75 GR', birim: 'M2' as BirimTuru, birimFiyat: 8.00, ambalajTuru: 'adet' },
  { adi: 'BRÜT BETON ASTARI', birim: 'KG' as BirimTuru, birimFiyat: 17.50, ambalajTuru: 'kova', ambalajMiktari: 20 },
  { adi: 'SATEN ALÇI', birim: 'KG' as BirimTuru, birimFiyat: 3.50, ambalajTuru: 'torba', ambalajMiktari: 35 },
  { adi: 'KONSANTRE ASTAR', birim: 'KG' as BirimTuru, birimFiyat: 29.00, ambalajTuru: 'kova', ambalajMiktari: 20 },
  { adi: 'İÇ CEPHE SİLİKONLU BOYA', birim: 'KG' as BirimTuru, birimFiyat: 17.50, ambalajTuru: 'kova', ambalajMiktari: 25 },
  { adi: 'DONATİ FİLESİ 165 GR', birim: 'M2' as BirimTuru, birimFiyat: 8.10, ambalajTuru: 'adet' },
  { adi: 'FİLELİ KÖŞE PROFİL', birim: 'M' as BirimTuru, birimFiyat: 11.17, ambalajTuru: 'adet' },
  { adi: 'LEVHA SIVASI', birim: 'KG' as BirimTuru, birimFiyat: 3.28, ambalajTuru: 'torba', ambalajMiktari: 25 },
  { adi: 'PLASTİK BEYAZ BOYA', birim: 'KG' as BirimTuru, birimFiyat: 14.00, ambalajTuru: 'kova', ambalajMiktari: 25 },
  { adi: 'KUM', birim: 'M3' as BirimTuru, birimFiyat: 1350.00, ambalajTuru: 'adet' },
  { adi: 'ÇİMENTO', birim: 'KG' as BirimTuru, birimFiyat: 2.23, ambalajTuru: 'torba', ambalajMiktari: 50 },
  { adi: 'ANO ÇITASI', birim: 'M' as BirimTuru, birimFiyat: 25.00, ambalajTuru: 'adet' },
  { adi: 'TAVAN BOYASI', birim: 'KG' as BirimTuru, birimFiyat: 14.00, ambalajTuru: 'kova', ambalajMiktari: 20 },
  { adi: 'TAŞYÜNÜ 120/5', birim: 'M2' as BirimTuru, birimFiyat: 120.00, ambalajTuru: 'adet' },
  { adi: 'LEVHA YAPIŞTIRICI', birim: 'KG' as BirimTuru, birimFiyat: 3.28, ambalajTuru: 'torba', ambalajMiktari: 25 },
  { adi: 'ÇELİK ÇİVİLİ DÜBEL 11,5 CM', birim: 'AD' as BirimTuru, birimFiyat: 2.21, ambalajTuru: 'adet' },
  { adi: 'DIŞ CEPHE SİLİKONLU BOYA', birim: 'KG' as BirimTuru, birimFiyat: 32.50, ambalajTuru: 'kova', ambalajMiktari: 25 },
  { adi: 'DIŞ CEPHE BOYA ASTARI', birim: 'KG' as BirimTuru, birimFiyat: 32.50, ambalajTuru: 'kova', ambalajMiktari: 20 },
  { adi: 'TAŞYÜNÜ 120/3', birim: 'M2' as BirimTuru, birimFiyat: 78.00, ambalajTuru: 'adet' },
  { adi: 'ÇELİK ÇİVİLİ DÜBEL 13,5 CM', birim: 'AD' as BirimTuru, birimFiyat: 2.21, ambalajTuru: 'adet' },
  { adi: 'DEKORATİF SIVA', birim: 'KG' as BirimTuru, birimFiyat: 4.2268, ambalajTuru: 'torba', ambalajMiktari: 25 },
  { adi: 'SERAMİK YAPIŞTIRICI', birim: 'KG' as BirimTuru, birimFiyat: 5.2, ambalajTuru: 'torba', ambalajMiktari: 25 },
  { adi: 'DERZ DOLGU', birim: 'KG' as BirimTuru, birimFiyat: 6, ambalajTuru: 'torba', ambalajMiktari: 20 },
  { adi: 'SERAMİK KÖŞE PROFİLİ', birim: 'M' as BirimTuru, birimFiyat: 11.6, ambalajTuru: 'adet' },
  { adi: 'BAKLAVA DİLİMLİ ALÇI KÖŞEBENTİ', birim: 'M' as BirimTuru, birimFiyat: 10.02, ambalajTuru: 'adet' },
  { adi: 'DEKORATİF SIVA ASTARI', birim: 'KG' as BirimTuru, birimFiyat: 27.50, ambalajTuru: 'kova', ambalajMiktari: 20 },
  { adi: 'KALİBEL', birim: 'M2' as BirimTuru, birimFiyat: 114.20, ambalajTuru: 'adet' },
  { adi: 'ÇİMENTO ESASLI SÜRME SU YALITIMI', birim: 'KG' as BirimTuru, birimFiyat: 36.00, ambalajTuru: 'torba', ambalajMiktari: 25 },
  { adi: 'PAH BANDI', birim: 'M' as BirimTuru, birimFiyat: 19.00, ambalajTuru: 'adet' },
  { adi: 'XPE 30 KG/M3 BASINÇ DAYANIMI', birim: 'M2' as BirimTuru, birimFiyat: 46.00, ambalajTuru: 'adet' },
  { adi: 'SERAMİK KLİPS', birim: 'AD' as BirimTuru, birimFiyat: 0.25, ambalajTuru: 'adet' },
  { adi: 'SERAMİK TAKOZ', birim: 'AD' as BirimTuru, birimFiyat: 0.45, ambalajTuru: 'adet' },
  { adi: 'ÇİMENTO ESASLI SIVA', birim: 'KG' as BirimTuru, birimFiyat: 3.28, ambalajTuru: 'torba', ambalajMiktari: 35 },
  { adi: 'EPS 5 CM/22 YOĞUNLUK', birim: 'M2' as BirimTuru, birimFiyat: 95.73, ambalajTuru: 'adet' },
  { adi: '300-30 plak', birim: 'AD' as BirimTuru, birimFiyat: 295, ambalajTuru: 'adet' },
  { adi: '0.60 mm kalın.gizli taşıyıcı profil (alüminyum)', birim: 'M' as BirimTuru, birimFiyat: 17.5, ambalajTuru: 'adet' },
  { adi: '1.00 mm kalın.gizli taşıyıcı alüminyum kenar u profil', birim: 'M' as BirimTuru, birimFiyat: 17.5, ambalajTuru: 'adet' },
  { adi: '0.50 mm birleşim klipsi', birim: 'AD' as BirimTuru, birimFiyat: 2.45, ambalajTuru: 'adet' },
  { adi: '0.50 mm taşıyıcı ek parça', birim: 'AD' as BirimTuru, birimFiyat: 1.74, ambalajTuru: 'adet' },
  { adi: 'Çelik dübel (6x45 vida, kovan, 1-demir ve somun)', birim: 'AD' as BirimTuru, birimFiyat: 2.25, ambalajTuru: 'adet' },
  { adi: 'Çiftli yay (0.60 mm kalın.yay çeliğinden mamul)', birim: 'AD' as BirimTuru, birimFiyat: 2.67, ambalajTuru: 'adet' },
  { adi: 'Askı çubuğu 40 cm (4 mm galvanizli çubuk)', birim: 'AD' as BirimTuru, birimFiyat: 4.6, ambalajTuru: 'adet' },
  { adi: 'Vida ve plastik dübel', birim: 'AD' as BirimTuru, birimFiyat: 0.7, ambalajTuru: 'adet' }
];

export const MalzemeFiyatTakipPage: React.FC = () => {
  const navigate = useNavigate();
  const [malzemeler, setMalzemeler] = useState<MalzemeFiyatTakip[]>([]);
  const [yeniMalzemeDialogOpen, setYeniMalzemeDialogOpen] = useState(false);
  const [yeniMalzeme, setYeniMalzeme] = useState<Partial<MalzemeFiyatTakip>>({
    adi: '',
    birim: 'AD' as BirimTuru,
    birimFiyat: undefined,
    otomatikGuncelleme: false,
    sarfiyatOrani: 1
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
      adi: '',
      birim: 'AD' as BirimTuru,
      birimFiyat: undefined,
      otomatikGuncelleme: false,
      sarfiyatOrani: 1
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