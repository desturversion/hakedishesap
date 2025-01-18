import { Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { HakedisSonuc } from '../types/hakedis';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface HakedisSonucProps {
  sonuc: HakedisSonuc;
}

export default function HakedisSonucBilesen({ sonuc }: HakedisSonucProps) {
  const exportToPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    let y = 20;

    // Başlık
    doc.setFontSize(16);
    doc.text('HAKEDIS RAPORU', 105, y, { align: 'center' });
    y += 25;

    // İmalat Listesi
    doc.setFontSize(12);
    doc.text('Imalat Listesi:', 20, y);
    y += 10;
    sonuc.imalatlar.forEach((imalat, index) => {
      const text = `${index + 1}. ${imalat.isTuru}: ${imalat.brutTutar.toLocaleString('tr-TR')} TL`;
      doc.text(text, 25, y);
      y += 8;
    });

    // Toplam Brüt Hakediş
    y += 10;
    doc.text(`Toplam Brut Hakedis: ${sonuc.toplamBrutHakedis.toLocaleString('tr-TR')} TL`, 20, y);
    y += 15;

    // Kesintiler
    doc.text('Kesintiler:', 20, y);
    y += 8;
    doc.text(`* Yemek: ${sonuc.yemekKesintisi.toLocaleString('tr-TR')} TL`, 25, y);
    y += 8;
    doc.text(`* Avans: ${sonuc.avansKesintisi.toLocaleString('tr-TR')} TL`, 25, y);
    y += 8;
    doc.text(`* Asgari Ucret: ${sonuc.asgariUcretKesintisi.toLocaleString('tr-TR')} TL`, 25, y);
    y += 8;
    doc.text(`* Teminat: ${sonuc.teminatKesintisi.toLocaleString('tr-TR')} TL`, 25, y);
    y += 15;

    // Toplam Kesinti
    doc.text(`Toplam Kesinti: ${sonuc.toplamKesinti.toLocaleString('tr-TR')} TL`, 20, y);
    y += 15;

    // Net Hakediş
    doc.setFontSize(14);
    doc.text(`Net Hakedis: ${sonuc.netHakedis.toLocaleString('tr-TR')} TL`, 20, y);

    // PDF'i kaydet
    doc.save('hakedis-raporu.pdf');
  };

  const exportToExcel = () => {
    const imalatListesi = sonuc.imalatlar.map((imalat, index) => ({
      'Sıra No': index + 1,
      'İş Türü': imalat.isTuru,
      'Brüt Tutar (TL)': imalat.brutTutar.toLocaleString('tr-TR')
    }));

    const ws = XLSX.utils.json_to_sheet([
      ...imalatListesi,
      {
        'Sıra No': '',
        'İş Türü': 'Toplam Brüt Hakediş',
        'Brüt Tutar (TL)': sonuc.toplamBrutHakedis.toLocaleString('tr-TR')
      },
      {
        'Sıra No': '',
        'İş Türü': 'Kesintiler',
        'Brüt Tutar (TL)': ''
      },
      {
        'Sıra No': '',
        'İş Türü': '• Yemek',
        'Brüt Tutar (TL)': sonuc.yemekKesintisi.toLocaleString('tr-TR')
      },
      {
        'Sıra No': '',
        'İş Türü': '• Avans',
        'Brüt Tutar (TL)': sonuc.avansKesintisi.toLocaleString('tr-TR')
      },
      {
        'Sıra No': '',
        'İş Türü': '• Asgari Ücret',
        'Brüt Tutar (TL)': sonuc.asgariUcretKesintisi.toLocaleString('tr-TR')
      },
      {
        'Sıra No': '',
        'İş Türü': '• Teminat',
        'Brüt Tutar (TL)': sonuc.teminatKesintisi.toLocaleString('tr-TR')
      },
      {
        'Sıra No': '',
        'İş Türü': 'Toplam Kesinti',
        'Brüt Tutar (TL)': sonuc.toplamKesinti.toLocaleString('tr-TR')
      },
      {
        'Sıra No': '',
        'İş Türü': 'Net Hakediş',
        'Brüt Tutar (TL)': sonuc.netHakedis.toLocaleString('tr-TR')
      }
    ]);

    // Excel'de Türkçe karakter genişliklerini ayarla
    ws['!cols'] = [
      { wch: 8 },  // Sıra No
      { wch: 30 }, // İş Türü
      { wch: 15 }  // Brüt Tutar
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hakediş');
    XLSX.writeFile(wb, 'hakedis-raporu.xlsx');
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Hakediş Sonuçları
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sıra No</TableCell>
              <TableCell>İş Türü</TableCell>
              <TableCell align="right">Brüt Tutar (TL)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sonuc.imalatlar.map((imalat, index) => (
              <TableRow key={imalat.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{imalat.isTuru}</TableCell>
                <TableCell align="right">{imalat.brutTutar.toLocaleString('tr-TR')}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                Toplam Brüt Hakediş
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {sonuc.toplamBrutHakedis.toLocaleString('tr-TR')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Kesintiler:</Typography>
          <Typography>• Yemek: {sonuc.yemekKesintisi.toLocaleString('tr-TR')} TL</Typography>
          <Typography>• Avans: {sonuc.avansKesintisi.toLocaleString('tr-TR')} TL</Typography>
          <Typography>• Asgari Ücret: {sonuc.asgariUcretKesintisi.toLocaleString('tr-TR')} TL</Typography>
          <Typography>• Teminat: {sonuc.teminatKesintisi.toLocaleString('tr-TR')} TL</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Toplam Kesinti: {sonuc.toplamKesinti.toLocaleString('tr-TR')} TL
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary">
            Net Hakediş: {sonuc.netHakedis.toLocaleString('tr-TR')} TL
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={exportToPDF}
            >
              PDF İndir
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={exportToExcel}
            >
              Excel İndir
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
} 