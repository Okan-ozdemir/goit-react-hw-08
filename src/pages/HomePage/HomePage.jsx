import { Typography, Container, Paper, Box, Fade } from '@mui/material';
// import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in timeout={800}>
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              p: { xs: 3, sm: 6 },
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
              background: 'rgba(255,255,255,0.97)',
              textAlign: 'center',
            }}
          >
            {/* <PhoneAndroidIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} /> */}
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              color="primary"
              fontWeight={900}
              sx={{ letterSpacing: 2, textShadow: '0 2px 8px #e3f2fd' }}
            >
              Phonebook App
            </Typography>
            <Typography
              variant="h5"
              color="secondary"
              paragraph
              fontWeight={600}
              sx={{ letterSpacing: 1, mb: 2 }}
            >
              Manage your contacts with ease
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ mb: 4, color: 'text.secondary', fontStyle: 'italic' }}
            >
              Please register or log in to access your contacts.
            </Typography>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}
