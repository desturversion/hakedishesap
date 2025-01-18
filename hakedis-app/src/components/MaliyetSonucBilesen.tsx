import { Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { MaliyetSonuc } from '../types/malzeme';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface MaliyetSonucBilesenProps {
  sonuc: MaliyetSonuc;
}

export default function MaliyetSonucBilesen({ sonuc }: MaliyetSonucBilesenProps) {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Türkçe karakterler için font ekleme
    doc.addFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    
    // Başlık
    doc.setFontSize(16);
    doc.text('Malzeme Miktarları ve Maliyetler', 15, 15);

    // İmalat ve Alan Bilgileri
    doc.setFontSize(12);
    doc.text(`İmalat: ${sonuc.imalatAdi}`, 15, 25);
    doc.text(`Toplam Alan: ${sonuc.toplamMiktar.toLocaleString('tr-TR')} m²`, 15, 32);
    doc.text(`Birim m² Maliyeti: ${(sonuc.toplamMaliyet / sonuc.toplamMiktar).toLocaleString('tr-TR')} ₺`, 15, 39);

    // Tablo başlıkları
    const headers = ['Malzeme', 'Birim', 'Gereken Miktar', 'Birim Fiyat (TL)', 'Toplam Maliyet (TL)'];
    const colWidths = [60, 25, 30, 35, 35];  // Her sütunun genişliği
    const startX = 15;
    let currentX = startX;
    let y = 50;
    
    doc.setFontSize(10);

    // Başlık satırı
    headers.forEach((header, i) => {
      const x = currentX;
      if (i >= 2) { // Sayısal değerler için sağa hizalama
        doc.text(header, x + colWidths[i], y, { align: 'right' });
      } else {
        doc.text(header, x, y);
      }
      currentX += colWidths[i];
    });

    y += 7;

    // Malzeme verileri
    sonuc.malzemeler.forEach((malzeme) => {
      currentX = startX;
      doc.text(malzeme.adi, currentX, y);
      currentX += colWidths[0];
      
      doc.text(malzeme.birim, currentX, y);
      currentX += colWidths[1];
      
      doc.text(malzeme.gerekenMiktar.toLocaleString('tr-TR'), currentX + colWidths[2], y, { align: 'right' });
      currentX += colWidths[2];
      
      doc.text(malzeme.birimFiyat.toLocaleString('tr-TR'), currentX + colWidths[3], y, { align: 'right' });
      currentX += colWidths[3];
      
      doc.text((malzeme.gerekenMiktar * malzeme.birimFiyat).toLocaleString('tr-TR'), currentX + colWidths[4], y, { align: 'right' });
      
      y += 7;
    });

    // Toplam maliyet
    y += 3;
    doc.setFont('Roboto', 'bold');
    doc.text('Toplam Maliyet:', startX, y);
    doc.text(sonuc.toplamMaliyet.toLocaleString('tr-TR'), startX + colWidths.reduce((a, b) => a + b), y, { align: 'right' });

    // Metrekare maliyeti
    y += 7;
    doc.text('Metrekare Maliyeti:', startX, y);
    doc.text(`${(sonuc.toplamMaliyet / sonuc.toplamMiktar).toLocaleString('tr-TR')}`, startX + colWidths.reduce((a, b) => a + b), y, { align: 'right' });

    doc.save('malzeme-miktar-raporu.pdf');
  };

  const exportToExcel = () => {
    const malzemeListesi = sonuc.malzemeler.map(malzeme => ({
      'Malzeme Adı': malzeme.adi,
      'Birim': malzeme.birim,
      'Gereken Miktar': malzeme.gerekenMiktar.toLocaleString('tr-TR'),
      'Birim Fiyat (TL)': malzeme.birimFiyat.toLocaleString('tr-TR'),
      'Toplam Maliyet (TL)': (malzeme.gerekenMiktar * malzeme.birimFiyat).toLocaleString('tr-TR')
    }));

    const ws = XLSX.utils.json_to_sheet([
      {
        'Malzeme Adı': 'İmalat Türü:',
        'Birim': sonuc.imalatAdi,
        'Gereken Miktar': '',
        'Birim Fiyat (TL)': '',
        'Toplam Maliyet (TL)': ''
      },
      {
        'Malzeme Adı': 'Toplam Alan:',
        'Birim': `${sonuc.toplamMiktar.toLocaleString('tr-TR')} m²`,
        'Gereken Miktar': '',
        'Birim Fiyat (TL)': '',
        'Toplam Maliyet (TL)': ''
      },
      {
        'Malzeme Adı': '',
        'Birim': '',
        'Gereken Miktar': '',
        'Birim Fiyat (TL)': '',
        'Toplam Maliyet (TL)': ''
      },
      ...malzemeListesi,
      {
        'Malzeme Adı': '',
        'Birim': '',
        'Gereken Miktar': '',
        'Birim Fiyat (TL)': '',
        'Toplam Maliyet (TL)': ''
      },
      {
        'Malzeme Adı': 'TOPLAM MALİYET:',
        'Birim': '',
        'Gereken Miktar': '',
        'Birim Fiyat (TL)': '',
        'Toplam Maliyet (TL)': sonuc.toplamMaliyet.toLocaleString('tr-TR')
      },
      {
        'Malzeme Adı': 'Metrekare Maliyeti:',
        'Birim': '',
        'Gereken Miktar': '',
        'Birim Fiyat (TL)': '',
        'Toplam Maliyet (TL)': `${(sonuc.toplamMaliyet / sonuc.toplamMiktar).toLocaleString('tr-TR')} TL/m²`
      }
    ]);

    // Excel'de sütun genişliklerini ayarla
    ws['!cols'] = [
      { wch: 25 },  // Malzeme Adı
      { wch: 10 },  // Birim
      { wch: 15 },  // Gereken Miktar
      { wch: 15 },  // Birim Fiyat
      { wch: 20 }   // Toplam Maliyet
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Malzeme Miktarları');
    XLSX.writeFile(wb, 'malzeme-miktar-raporu.xlsx');
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Malzeme Miktarları ve Maliyetler
          </Typography>
        </Grid>

        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              İmalat: {sonuc.imalatAdi}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Toplam Alan: {sonuc.toplamMiktar.toLocaleString('tr-TR')} m²
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', pl: 0 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 0, ml: 3, mt: -6 }}>
              Birim m²: {(sonuc.toplamMaliyet / sonuc.toplamMiktar).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Malzeme</TableCell>
                  <TableCell>Birim</TableCell>
                  <TableCell align="right">Gereken Miktar</TableCell>
                  <TableCell align="right">Birim Fiyat (TL)</TableCell>
                  <TableCell align="right">Toplam Maliyet (TL)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sonuc.malzemeler.map((malzeme) => (
                  <TableRow key={malzeme.adi}>
                    <TableCell>{malzeme.adi}</TableCell>
                    <TableCell>{malzeme.birim}</TableCell>
                    <TableCell align="right">{malzeme.gerekenMiktar.toLocaleString('tr-TR')}</TableCell>
                    <TableCell align="right">{malzeme.birimFiyat.toLocaleString('tr-TR')}</TableCell>
                    <TableCell align="right">{(malzeme.gerekenMiktar * malzeme.birimFiyat).toLocaleString('tr-TR')}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                    Toplam Maliyet
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {sonuc.toplamMaliyet.toLocaleString('tr-TR')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                    Metrekare Maliyeti
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {(sonuc.toplamMaliyet / sonuc.toplamMiktar).toLocaleString('tr-TR')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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