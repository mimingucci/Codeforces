import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Box } from '@mui/material';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          bgcolor: 'background.default',
          pb: { xs: 4, md: 6 },
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}
