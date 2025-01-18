import React, { useState, useEffect } from 'react';
import { MalzemeFiyatTakip, BirimTuru, AmbalajTuru } from '../types/malzeme';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  TextField,
  Box,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Checkbox,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

interface AmbalajSecenek {
  tur: 'torba' | 'kova';
  miktarlar: number[];
}

const AMBALAJ_SECENEKLERI: AmbalajSecenek[] = [
  {
    tur: 'torba',
    miktarlar: [12.5, 15, 20, 25, 35, 50]
  },
  {
    tur: 'kova',
    miktarlar: [12.5, 15, 20, 25, 35]
  }
];

interface Props {
  malzemeler: MalzemeFiyatTakip[];
  onMalzemeGuncelle: (malzeme: MalzemeFiyatTakip) => void;
  onMalzemeSil: (malzemeId: string) => void;
  onTopluMalzemeSil: (malzemeIds: string[]) => void;
}

export const MalzemeFiyatTakipTablosu: React.FC<Props> = ({ 
  malzemeler, 
  onMalzemeGuncelle, 
  onMalzemeSil,
  onTopluMalzemeSil 
}) => {
  const [duzenlemeModu, setDuzenlemeModu] = useState<{ [key: string]: boolean }>({});
  const [yeniFiyatlar, setYeniFiyatlar] = useState<{ [key: string]: number }>({});
  const [yeniAmbalajTuru, setYeniAmbalajTuru] = useState<{ [key: string]: AmbalajTuru }>({});
  const [yeniBirim, setYeniBirim] = useState<{ [key: string]: BirimTuru }>({});
  const [yeniAmbalajMiktari, setYeniAmbalajMiktari] = useState<{ [key: string]: number }>({});
  const [aramaMetni, setAramaMetni] = useState('');
  const [filtrelenmisListe, setFiltrelenmisListe] = useState<MalzemeFiyatTakip[]>(malzemeler);
  const [silmeDialogOpen, setSilmeDialogOpen] = useState(false);
  const [silinecekMalzemeId, setSilinecekMalzemeId] = useState<string | null>(null);
  const [secilenMalzemeler, setSecilenMalzemeler] = useState<string[]>([]);
  const [topluSilmeDialogOpen, setTopluSilmeDialogOpen] = useState(false);

  useEffect(() => {
    const filtreliMalzemeler = malzemeler.filter(malzeme => 
      malzeme.adi.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      malzeme.birim.toLowerCase().includes(aramaMetni.toLowerCase())
    );
    setFiltrelenmisListe(filtreliMalzemeler);
  }, [malzemeler, aramaMetni]);

  const handleDuzenle = (malzeme: MalzemeFiyatTakip) => {
    setDuzenlemeModu({ ...duzenlemeModu, [malzeme.id]: true });
    setYeniFiyatlar({ ...yeniFiyatlar, [malzeme.id]: malzeme.birimFiyat || 0 });
    setYeniAmbalajTuru({ ...yeniAmbalajTuru, [malzeme.id]: malzeme.ambalajTuru || 'adet' });
    setYeniBirim({ ...yeniBirim, [malzeme.id]: malzeme.birim });
    setYeniAmbalajMiktari({ ...yeniAmbalajMiktari, [malzeme.id]: malzeme.ambalajMiktari || 0 });
  };

  const handleKaydet = (malzeme: MalzemeFiyatTakip) => {
    const yeniFiyat = yeniFiyatlar[malzeme.id];
    const ambalajTuru = yeniAmbalajTuru[malzeme.id] as AmbalajTuru | undefined;
    const birim = yeniBirim[malzeme.id];
    const ambalajMiktari = yeniAmbalajMiktari[malzeme.id];

    const yeniMalzeme: MalzemeFiyatTakip = {
      ...malzeme,
      birimFiyat: yeniFiyat,
      birim: birim,
      ambalajTuru: ambalajTuru,
      ambalajMiktari: ambalajTuru === 'adet' ? undefined : ambalajMiktari,
      sonGuncellenmeTarihi: new Date(),
      fiyatGecmisi: [
        ...malzeme.fiyatGecmisi,
        {
          tarih: new Date(),
          birimFiyat: yeniFiyat,
        }
      ]
    };
    
    onMalzemeGuncelle(yeniMalzeme);
    setDuzenlemeModu({ ...duzenlemeModu, [malzeme.id]: false });
  };

  const handleSilmeDialogAc = (malzemeId: string) => {
    setSilinecekMalzemeId(malzemeId);
    setSilmeDialogOpen(true);
  };

  const handleSilmeDialogKapat = () => {
    setSilinecekMalzemeId(null);
    setSilmeDialogOpen(false);
  };

  const handleMalzemeSil = () => {
    if (silinecekMalzemeId) {
      onMalzemeSil(silinecekMalzemeId);
      handleSilmeDialogKapat();
    }
  };

  const formatBirim = (birim: BirimTuru, ambalajMiktari?: number, ambalajTuru?: AmbalajTuru) => {
    if (birim === 'KG' && ambalajMiktari && ambalajTuru) {
      return `${ambalajMiktari} KG ${ambalajTuru}`;
    }

    return birim;
  };

  const tekrarEdenMalzemeler = malzemeler.reduce((acc, malzeme) => {
    const adiNormalize = malzeme.adi.toLowerCase().trim();
    acc[adiNormalize] = (acc[adiNormalize] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const handleTekrarEdenleriSec = () => {
    const tekrarEdenIds: string[] = [];
    const tekrarSayilari: { [key: string]: number } = {};
    
    malzemeler.forEach(malzeme => {
      const adiNormalize = malzeme.adi.toLowerCase().trim();
      if (tekrarEdenMalzemeler[adiNormalize] > 1) {
        tekrarSayilari[adiNormalize] = (tekrarSayilari[adiNormalize] || 0) + 1;
        if (tekrarSayilari[adiNormalize] > 1) { // İlk malzemeyi hariç tut
          tekrarEdenIds.push(malzeme.id);
        }
      }
    });
    
    setSecilenMalzemeler(tekrarEdenIds);
  };

  const handleTopluSilmeDialogAc = () => {
    if (secilenMalzemeler.length > 0) {
      setTopluSilmeDialogOpen(true);
    }
  };

  const handleTopluSilmeDialogKapat = () => {
    setTopluSilmeDialogOpen(false);
  };

  const handleTopluSil = () => {
    onTopluMalzemeSil(secilenMalzemeler);
    setSecilenMalzemeler([]);
    setTopluSilmeDialogOpen(false);
  };

  const handleTumunuSec = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSecilenMalzemeler(filtrelenmisListe.map(m => m.id));
    } else {
      setSecilenMalzemeler([]);
    }
  };

  const handleMalzemeSecim = (malzemeId: string) => {
    setSecilenMalzemeler(prev => 
      prev.includes(malzemeId) 
        ? prev.filter(id => id !== malzemeId)
        : [...prev, malzemeId]
    );
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Malzeme adı veya birim ile arama yapın..."
          value={aramaMetni}
          onChange={(e) => setAramaMetni(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {Object.entries(tekrarEdenMalzemeler)
        .filter(([_, count]) => count > 1)
        .map(([malzemeAdi, count]) => (
          <Alert severity="warning" sx={{ mb: 2 }} key={malzemeAdi}>
            "{malzemeAdi.toUpperCase()}" isimli malzeme {count} kez tekrar ediyor.
          </Alert>
        ))}

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleTekrarEdenleriSec}
          disabled={!Object.values(tekrarEdenMalzemeler).some(count => count > 1)}
        >
          Tekrar Edenleri Seç
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleTopluSilmeDialogAc}
          disabled={secilenMalzemeler.length === 0}
        >
          Seçilenleri Sil ({secilenMalzemeler.length})
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filtrelenmisListe.length > 0 && secilenMalzemeler.length === filtrelenmisListe.length}
                  indeterminate={secilenMalzemeler.length > 0 && secilenMalzemeler.length < filtrelenmisListe.length}
                  onChange={handleTumunuSec}
                />
              </TableCell>
              <TableCell>Malzeme Adı</TableCell>
              <TableCell>Birim</TableCell>
              <TableCell>Birim Fiyat</TableCell>
              <TableCell>Son Güncelleme</TableCell>
              <TableCell>Otomatik Güncelleme</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrelenmisListe.map((malzeme) => {
              const malzemeAdiNormalize = malzeme.adi.toLowerCase().trim();
              const tekrarEdiyor = tekrarEdenMalzemeler[malzemeAdiNormalize] > 1;

              return (
                <TableRow key={malzeme.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={secilenMalzemeler.includes(malzeme.id)}
                      onChange={() => handleMalzemeSecim(malzeme.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {malzeme.adi}
                      {tekrarEdiyor && (
                        <Tooltip title="Bu malzeme birden fazla kez eklenmiş">
                          <WarningIcon color="warning" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {duzenlemeModu[malzeme.id] ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={yeniBirim[malzeme.id] || malzeme.birim}
                            onChange={(e) => setYeniBirim({
                              ...yeniBirim,
                              [malzeme.id]: e.target.value as BirimTuru
                            })}
                          >
                            <MenuItem value="AD">AD</MenuItem>
                            <MenuItem value="KG">KG</MenuItem>
                            <MenuItem value="M3">M³</MenuItem>
                            <MenuItem value="M2">M²</MenuItem>
                            <MenuItem value="M">M</MenuItem>
                            <MenuItem value="TOP">TOP</MenuItem>
                            <MenuItem value="TON">TON</MenuItem>
                          </Select>
                        </FormControl>
                        {yeniBirim[malzeme.id] === 'KG' && (
                          <>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={yeniAmbalajTuru[malzeme.id] || 'adet'}
                                onChange={(e) => {
                                  setYeniAmbalajTuru({
                                    ...yeniAmbalajTuru,
                                    [malzeme.id]: e.target.value as AmbalajTuru
                                  });
                                  if (e.target.value === 'adet') {
                                    setYeniAmbalajMiktari({
                                      ...yeniAmbalajMiktari,
                                      [malzeme.id]: 0
                                    });
                                  }
                                }}
                              >
                                <MenuItem value="adet">Adet</MenuItem>
                                <MenuItem value="torba">Torba</MenuItem>
                                <MenuItem value="kova">Kova</MenuItem>
                              </Select>
                            </FormControl>
                            {yeniAmbalajTuru[malzeme.id] !== 'adet' && (
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                  value={yeniAmbalajMiktari[malzeme.id] || ''}
                                  onChange={(e) => setYeniAmbalajMiktari({
                                    ...yeniAmbalajMiktari,
                                    [malzeme.id]: Number(e.target.value)
                                  })}
                                >
                                  {AMBALAJ_SECENEKLERI
                                    .find(a => a.tur === yeniAmbalajTuru[malzeme.id])
                                    ?.miktarlar.map(miktar => (
                                      <MenuItem key={miktar} value={miktar}>
                                        {miktar} kg
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            )}
                          </>
                        )}
                      </Box>
                    ) : (
                      formatBirim(malzeme.birim, malzeme.ambalajMiktari, malzeme.ambalajTuru)
                    )}
                  </TableCell>
                  <TableCell>
                    {duzenlemeModu[malzeme.id] ? (
                      <TextField
                        type="number"
                        size="small"
                        value={yeniFiyatlar[malzeme.id]}
                        onChange={(e) => setYeniFiyatlar({
                          ...yeniFiyatlar,
                          [malzeme.id]: parseFloat(e.target.value)
                        })}
                      />
                    ) : (
                      `${malzeme.birimFiyat?.toFixed(2)} TL`
                    )}
                  </TableCell>
                  <TableCell>
                    {malzeme.sonGuncellenmeTarihi.toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={malzeme.otomatikGuncelleme}
                      onChange={() => onMalzemeGuncelle({
                        ...malzeme,
                        otomatikGuncelleme: !malzeme.otomatikGuncelleme
                      })}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {duzenlemeModu[malzeme.id] ? (
                        <IconButton onClick={() => handleKaydet(malzeme)}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => handleDuzenle(malzeme)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton 
                        onClick={() => handleSilmeDialogAc(malzeme.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tekil Silme Dialog */}
      <Dialog open={silmeDialogOpen} onClose={handleSilmeDialogKapat}>
        <DialogTitle>Malzeme Silme Onayı</DialogTitle>
        <DialogContent>
          Bu malzemeyi silmek istediğinizden emin misiniz?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSilmeDialogKapat}>İptal</Button>
          <Button onClick={handleMalzemeSil} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toplu Silme Dialog */}
      <Dialog open={topluSilmeDialogOpen} onClose={handleTopluSilmeDialogKapat}>
        <DialogTitle>Toplu Malzeme Silme Onayı</DialogTitle>
        <DialogContent>
          <Typography>
            {secilenMalzemeler.length} adet malzemeyi silmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTopluSilmeDialogKapat}>İptal</Button>
          <Button onClick={handleTopluSil} color="error" variant="contained">
            Seçilenleri Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 