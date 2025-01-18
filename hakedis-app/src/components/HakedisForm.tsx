import { Grid, TextField, Button, IconButton, Paper, Typography, Switch, FormControlLabel } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { HakedisData, Imalat } from '../types/hakedis';
import { v4 as uuidv4 } from 'uuid';

interface HakedisFormProps {
  data: HakedisData;
  onChange: (data: HakedisData) => void;
  onSubmit: () => void;
}

export default function HakedisForm({ data, onChange, onSubmit }: HakedisFormProps) {
  const hesaplaFormul = (formul: string): number => {
    try {
      const islem = formul.substring(1).replace(/,/g, '.');
      const sonuc = new Function(`return ${islem}`)();
      return typeof sonuc === 'number' && isFinite(sonuc) ? sonuc : 0;
    } catch (error) {
      console.error('Formül hesaplama hatası:', error);
      return 0;
    }
  };

  const handleImalatChange = (id: string, field: keyof Imalat, value: string) => {
    const yeniImalatlar = data.imalatListesi.map(imalat => {
      if (imalat.id === id) {
        if (field === 'isMiktari') {
          if (value.startsWith('=')) {
            return { 
              ...imalat, 
              [field]: value,
              isMiktariFormul: value
            };
          }
          return { ...imalat, [field]: value, isMiktariFormul: undefined };
        }
        if (field === 'isTuru') {
          return { ...imalat, [field]: value };
        }
        return { ...imalat, [field]: value === '' ? null : Number(value) };
      }
      return imalat;
    });

    onChange({ ...data, imalatListesi: yeniImalatlar });
  };

  const handleFocus = (imalat: Imalat) => {
    if (imalat.isMiktariFormul) {
      const yeniImalatlar = data.imalatListesi.map(item => {
        if (item.id === imalat.id) {
          return {
            ...item,
            isMiktari: imalat.isMiktariFormul || ''
          };
        }
        return item;
      });
      onChange({ ...data, imalatListesi: yeniImalatlar });
    }
  };

  const handleBlur = (imalat: Imalat) => {
    if (imalat.isMiktariFormul) {
      try {
        const sonuc = hesaplaFormul(imalat.isMiktariFormul);
        const yeniImalatlar = data.imalatListesi.map(item => {
          if (item.id === imalat.id) {
            return {
              ...item,
              isMiktari: sonuc,
              isMiktariFormul: imalat.isMiktariFormul
            };
          }
          return item;
        });
        onChange({ ...data, imalatListesi: yeniImalatlar });
      } catch (error) {
        console.error('Formül hesaplama hatası:', error);
      }
    }
  };

  const handleKesintiChange = (field: keyof Omit<HakedisData, 'imalatListesi'>) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...data,
        [field]: Number(event.target.value),
      });
  };

  const handleKesintiBooleanChange = (field: 'yemekKesintisiAktif' | 'avansKesintisiAktif') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...data,
        [field]: event.target.checked,
        ...(event.target.checked ? {} : {
          [field === 'yemekKesintisiAktif' ? 'yemekKesintisi' : 'avansKesintisi']: 0
        })
      });
  };

  const yeniImalatEkle = () => {
    const yeniImalat: Imalat = {
      id: uuidv4(),
      isMiktari: '',
      isTuru: '',
      birimFiyat: 0
    };
    onChange({
      ...data,
      imalatListesi: [...data.imalatListesi, yeniImalat]
    });
  };

  const imalatSil = (id: string) => {
    onChange({
      ...data,
      imalatListesi: data.imalatListesi.filter(imalat => imalat.id !== id)
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            İmalat Listesi
          </Typography>
          {data.imalatListesi.map((imalat, index) => (
            <Paper key={imalat.id} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    İmalat #{index + 1}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="İş Türü"
                    type="text"
                    value={imalat.isTuru}
                    onChange={(e) => handleImalatChange(imalat.id, 'isTuru', e.target.value)}
                    inputProps={{
                      placeholder: 'İş türünü giriniz'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="İş Miktarı"
                    type="text"
                    value={imalat.isMiktari}
                    onChange={(e) => handleImalatChange(imalat.id, 'isMiktari', e.target.value)}
                    onFocus={() => handleFocus(imalat)}
                    onBlur={() => handleBlur(imalat)}
                    inputProps={{
                      placeholder: 'İş miktarını giriniz veya =5+3 gibi formül yazın'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Birim Fiyat (TL)"
                    type="number"
                    value={imalat.birimFiyat || ''}
                    onChange={(e) => handleImalatChange(imalat.id, 'birimFiyat', e.target.value)}
                    inputProps={{
                      placeholder: 'Birim fiyatı giriniz'
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <IconButton 
                    color="error" 
                    onClick={() => imalatSil(imalat.id)}
                    sx={{ mt: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={yeniImalatEkle}
            variant="outlined"
            fullWidth
            sx={{ mt: 2, mb: 4 }}
          >
            Yeni İmalat Ekle
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Kesinti Bilgileri
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={data.yemekKesintisiAktif}
                onChange={handleKesintiBooleanChange('yemekKesintisiAktif')}
                color="primary"
              />
            }
            label="Yemek Kesintisi"
          />
          <TextField
            required
            fullWidth
            label="Yemek Kesintisi (TL)"
            type="number"
            value={data.yemekKesintisi || ''}
            onChange={handleKesintiChange('yemekKesintisi')}
            disabled={!data.yemekKesintisiAktif}
            inputProps={{
              placeholder: 'Yemek kesintisi tutarını giriniz'
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={data.avansKesintisiAktif}
                onChange={handleKesintiBooleanChange('avansKesintisiAktif')}
                color="primary"
              />
            }
            label="Avans Kesintisi"
          />
          <TextField
            required
            fullWidth
            label="Avans Kesintisi (TL)"
            type="number"
            value={data.avansKesintisi || ''}
            onChange={handleKesintiChange('avansKesintisi')}
            disabled={!data.avansKesintisiAktif}
            inputProps={{
              placeholder: 'Avans kesintisi tutarını giriniz'
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Asgari Ücret Kesintisi (TL)"
            type="number"
            value={data.asgariUcretKesintisi}
            onChange={handleKesintiChange('asgariUcretKesintisi')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Teminat Oranı (%)"
            type="number"
            value={data.teminatOrani}
            onChange={handleKesintiChange('teminatOrani')}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            Hesapla
          </Button>
        </Grid>
      </Grid>
    </form>
  );
} 