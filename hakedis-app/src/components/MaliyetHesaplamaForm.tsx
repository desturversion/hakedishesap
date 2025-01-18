import { Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { MaliyetHesaplamaData, ImalatTuru, Malzeme, BirimTuru, MalzemeFiyatTakip } from '../types/malzeme';
import { useState, useEffect } from 'react';

interface MaliyetHesaplamaFormProps {
  data: MaliyetHesaplamaData;
  imalatTurleri: ImalatTuru[];
  onChange: (data: MaliyetHesaplamaData) => void;
  onSubmit: () => void;
  malzemeAdiMap: { [key: string]: string };
  malzemeBirimMap: { [key: string]: string };
  malzemeFiyatlari: MalzemeFiyatTakip[];
}

export default function MaliyetHesaplamaForm({ 
  data, 
  imalatTurleri, 
  onChange, 
  onSubmit,
  malzemeAdiMap,
  malzemeBirimMap,
  malzemeFiyatlari
}: MaliyetHesaplamaFormProps) {
  const [secilenImalat, setSecilenImalat] = useState<ImalatTuru | null>(null);
  const [secilenMalzemeler, setSecilenMalzemeler] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (secilenImalat?.id === '1' && secilenImalat.duvarOzellikleri) {
      // Duvar imalatı seçildiğinde varsayılan malzeme ve kalınlık seç
      if (!data.secilenDuvarMalzeme) {
        handleDuvarMalzemeChange(secilenImalat.duvarOzellikleri.malzemeler[0].id);
      }
    }
  }, [secilenImalat]);

  const handleImalatChange = (imalatId: string) => {
    const imalat = imalatTurleri.find(i => i.id === imalatId);
    if (!imalat) return;

    setSecilenImalat(imalat);

    // Malzeme listesini oluştur
    const malzemeler: Malzeme[] = imalat.malzemeler.map(malzeme => ({
      id: malzeme.malzemeId,
      adi: malzemeAdiMap[malzeme.malzemeId] || '',
      birim: malzemeBirimMap[malzeme.malzemeId] as BirimTuru || 'M2',
      birimFiyat: malzeme.birimFiyat,
      sarfiyatOrani: malzeme.sarfiyatOrani
    }));

    // Seçili malzemeleri sıfırla
    setSecilenMalzemeler({});

    onChange({
      ...data,
      imalatId,
      malzemeler,
      secilenMalzemeler: {},
      secilenDuvarMalzeme: undefined,
      secilenDuvarKalinlik: undefined
    });
  };

  const handleDuvarMalzemeChange = (malzemeId: string) => {
    const duvarMalzeme = secilenImalat?.duvarOzellikleri?.malzemeler.find(m => m.id === malzemeId);
    if (!duvarMalzeme) return;

    // Varsayılan olarak ilk kalınlığı seç
    const varsayilanKalinlik = duvarMalzeme.kalinliklar[0];
    handleDuvarKalinlikChange(malzemeId, varsayilanKalinlik.id);
  };

  const handleDuvarKalinlikChange = (malzemeId: string, kalinlikId: string) => {
    const duvarMalzeme = secilenImalat?.duvarOzellikleri?.malzemeler.find(m => m.id === malzemeId);
    if (!duvarMalzeme) return;

    const kalinlik = duvarMalzeme.kalinliklar.find(k => k.id === kalinlikId);
    if (!kalinlik) return;

    // Malzeme listesini güncelle
    const yeniMalzemeler = data.malzemeler.map(malzeme => {
      // Duvar malzemesi için sarfiyat oranını güncelle
      if (malzeme.id === 'duvar_malzemesi') {
        return {
          ...malzeme,
          sarfiyatOrani: kalinlik.sarfiyat // Burada sarfiyat oranı güncelleniyor
        };
      }
      // Çimento ve kum için harç oranını uygula
      if (malzeme.id === 'cimento' || malzeme.id === 'kum') {
        const orijinalMalzeme = secilenImalat?.malzemeler.find(m => m.malzemeId === malzeme.id);
        if (orijinalMalzeme) {
          // Harç oranını 18.5 ile çarp ve kalınlık azaldıkça azalt
          const harcOrani = 18.5 * (kalinlik.sarfiyat / 100); // Kalınlık oranına göre ayarlama
          const yeniSarfiyatOrani = orijinalMalzeme.sarfiyatOrani * harcOrani; // Sarfiyat oranı ile çarpılıyor
          return {
            ...malzeme,
            sarfiyatOrani: yeniSarfiyatOrani
          };
        }
      }
      return malzeme;
    });

    onChange({
      ...data,
      secilenDuvarMalzeme: malzemeId,
      secilenDuvarKalinlik: kalinlikId,
      malzemeler: yeniMalzemeler
    });
  };

  const handleMalzemeSecim = (malzemeId: string, secili: boolean) => {
    const yeniSecilenMalzemeler = {
      ...secilenMalzemeler,
      [malzemeId]: secili
    };
    setSecilenMalzemeler(yeniSecilenMalzemeler);

    // MaliyetHesaplamaData'yı da güncelle
    onChange({
      ...data,
      secilenMalzemeler: yeniSecilenMalzemeler
    });
  };

  const handleBirimFiyatChange = (malzemeId: string, yeniFiyat: number) => {
    const yeniMalzemeler = data.malzemeler.map(malzeme => {
      if (malzeme.id === malzemeId) {
        return {
          ...malzeme,
          birimFiyat: yeniFiyat,
          // Kullanıcının girdiği fiyatı kullanmak için özel bir alan ekleyelim
          guncelBirimFiyat: yeniFiyat
        };
      }
      return malzeme;
    });

    onChange({
      ...data,
      malzemeler: yeniMalzemeler
    });
  };

  // Hesaplama butonuna tıklandığında
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hesaplamada güncel fiyatları kullan
    const yeniMalzemeler = data.malzemeler.map(malzeme => ({
      ...malzeme,
      birimFiyat: malzeme.guncelBirimFiyat || malzeme.birimFiyat
    }));

    // Önce state'i güncelle
    onChange({
      ...data,
      malzemeler: yeniMalzemeler
    });

    // Sonra hesaplamayı başlat
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
              value={data.imalatId}
              label="İmalat Türü"
              onChange={(e) => handleImalatChange(e.target.value)}
            >
              {imalatTurleri.map(imalat => (
                <MenuItem key={imalat.id} value={imalat.id}>
                  {imalat.adi}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {secilenImalat?.id === '1' && secilenImalat.duvarOzellikleri && (
          <>
            <Grid item xs={12} sm={6}>
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
                  Duvar Malzemesi
                </InputLabel>
                <Select
                  value={data.secilenDuvarMalzeme || ''}
                  label="Duvar Malzemesi"
                  onChange={(e) => handleDuvarMalzemeChange(e.target.value)}
                >
                  {secilenImalat.duvarOzellikleri.malzemeler.map(malzeme => (
                    <MenuItem key={malzeme.id} value={malzeme.id}>
                      {malzeme.adi}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!data.secilenDuvarMalzeme}>
                <InputLabel 
                  sx={{ 
                    backgroundColor: 'transparent !important',
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.87)',
                      backgroundColor: 'transparent !important'
                    }
                  }}
                >
                  Duvar Kalınlığı
                </InputLabel>
                <Select
                  value={data.secilenDuvarKalinlik || ''}
                  label="Duvar Kalınlığı"
                  onChange={(e) => data.secilenDuvarMalzeme && handleDuvarKalinlikChange(data.secilenDuvarMalzeme, e.target.value)}
                >
                  {data.secilenDuvarMalzeme && secilenImalat.duvarOzellikleri.malzemeler
                    .find(m => m.id === data.secilenDuvarMalzeme)
                    ?.kalinliklar.map(kalinlik => (
                      <MenuItem key={kalinlik.id} value={kalinlik.id}>
                        {kalinlik.adi}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Toplam İmalat Miktarı (m²)"
            type="number"
            value={data.miktar || ''}
            onChange={(e) => onChange({ ...data, miktar: e.target.value ? Number(e.target.value) : null })}
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

        {secilenImalat && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Malzeme Seçimi ve Fiyatlandırma
            </Typography>
            <Paper sx={{ p: 2 }}>
              {data.malzemeler.map((malzeme) => (
                <Grid container spacing={2} key={malzeme.id} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={secilenMalzemeler[malzeme.id] || false}
                          onChange={(e) => handleMalzemeSecim(malzeme.id, e.target.checked)}
                        />
                      }
                      label={`${malzeme.adi} (${malzeme.sarfiyatOrani.toLocaleString('tr-TR')} ${malzeme.birim}/m²)`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={`Birim Fiyat (TL/${malzeme.birim})`}
                      type="number"
                      value={malzeme.birimFiyat ?? ''}
                      onChange={(e) => handleBirimFiyatChange(malzeme.id, e.target.value ? Number(e.target.value) : 0)}
                      disabled={!secilenMalzemeler[malzeme.id]}
                      placeholder={(() => {
                        const malzemeFiyat = malzemeFiyatlari.find(m => m.id === malzeme.id);
                        return malzemeFiyat?.birimFiyat?.toString() || '0';
                      })()}
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
              ))}
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!secilenImalat || !data.miktar}
          >
            Malzeme Miktarlarını ve Maliyeti Hesapla
          </Button>
        </Grid>
      </Grid>
    </form>
  );
} 