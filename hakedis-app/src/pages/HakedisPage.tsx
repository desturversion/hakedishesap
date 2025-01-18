import { Container, Paper, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HakedisData, HakedisSonuc } from '../types/hakedis';
import HakedisForm from '../components/HakedisForm';
import HakedisSonucBilesen from '../components/HakedisSonuc';

export default function HakedisPage() {
  const navigate = useNavigate();
  const [hakedisData, setHakedisData] = useState<HakedisData>({
    imalatListesi: [],
    yemekKesintisi: 0,
    yemekKesintisiAktif: false,
    avansKesintisi: 0,
    avansKesintisiAktif: false,
    asgariUcretKesintisi: 0,
    teminatOrani: 5
  });

  const [sonuc, setSonuc] = useState<HakedisSonuc | null>(null);

  const handleHomeClick = () => {
    navigate('/');
  };

  const hesaplaHakedis = () => {
    const imalatlar = hakedisData.imalatListesi.map(imalat => {
      const miktar = typeof imalat.isMiktari === 'string' ? Number(imalat.isMiktari) : (imalat.isMiktari || 0);
      return {
        id: imalat.id,
        isTuru: imalat.isTuru,
        brutTutar: miktar * (imalat.birimFiyat || 0)
      };
    });

    const toplamBrutHakedis = imalatlar.reduce((toplam, imalat) => toplam + imalat.brutTutar, 0);
    const teminatKesintisi = toplamBrutHakedis * (hakedisData.teminatOrani / 100);
    const toplamKesinti = hakedisData.yemekKesintisi + 
                         hakedisData.avansKesintisi + 
                         hakedisData.asgariUcretKesintisi + 
                         teminatKesintisi;
    const netHakedis = toplamBrutHakedis - toplamKesinti;

    setSonuc({
      imalatlar,
      toplamBrutHakedis,
      yemekKesintisi: hakedisData.yemekKesintisi,
      avansKesintisi: hakedisData.avansKesintisi,
      asgariUcretKesintisi: hakedisData.asgariUcretKesintisi,
      teminatKesintisi,
      toplamKesinti,
      netHakedis,
    });
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
          Hakediş Hesaplama
        </Typography>

        <HakedisForm
          data={hakedisData}
          onChange={setHakedisData}
          onSubmit={hesaplaHakedis}
        />
        {sonuc && <HakedisSonucBilesen sonuc={sonuc} />}
      </Paper>
    </Container>
  );
} 