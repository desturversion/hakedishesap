import { ThemeProvider, CssBaseline, Container, Typography, Button, Grid, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import HakedisPage from './pages/HakedisPage';
import MalzemeMaliyetPage from './pages/MalzemeMaliyetPage';
import { MalzemeFiyatTakipPage } from './pages/MalzemeFiyatTakipPage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFB74D',
    },
    secondary: {
      main: '#90CAF9',
    },
    background: {
      default: '#2A2A2E',
      paper: '#3A3A3E',
    },
    info: {
      main: '#64B5F6',
    },
    error: {
      main: '#FF5252',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: {
      fontWeight: 600,
      color: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FFB74D 30%, #FFA726 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FFA726 30%, #FF9800 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
          background: 'linear-gradient(145deg, #3A3A3E 0%, #2A2A2E 100%)',
        },
      },
    },
  },
});

function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #2A2A2E 0%, #1A1A1E 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            mb: 6,
            background: 'linear-gradient(45deg, #FFB74D 30%, #FFA726 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255,183,77,0.3)',
          }}
        >
          İnşaat Yönetim Sistemi
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Button
              component={Link}
              to="/hakedis"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                background: 'linear-gradient(145deg, #3A3A3E 0%, #2A2A2E 100%)',
                '&:hover': {
                  background: 'linear-gradient(145deg, #FFB74D 0%, #FFA726 100%)',
                },
              }}
            >
              <Typography variant="h5">Hakediş Modülü</Typography>
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              component={Link}
              to="/malzeme-maliyet"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                background: 'linear-gradient(145deg, #3A3A3E 0%, #2A2A2E 100%)',
                '&:hover': {
                  background: 'linear-gradient(145deg, #90CAF9 0%, #64B5F6 100%)',
                },
              }}
            >
              <Typography variant="h5">Malzeme Maliyetlendirme</Typography>
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              component={Link}
              to="/malzeme-fiyat-takip"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                background: 'linear-gradient(145deg, #3A3A3E 0%, #2A2A2E 100%)',
                '&:hover': {
                  background: 'linear-gradient(145deg, #64B5F6 0%, #42A5F5 100%)',
                },
              }}
            >
              <Typography variant="h5">Malzeme Fiyat Takibi</Typography>
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hakedis" element={<HakedisPage />} />
            <Route path="/malzeme-maliyet" element={<MalzemeMaliyetPage />} />
            <Route path="/malzeme-fiyat-takip" element={<MalzemeFiyatTakipPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
