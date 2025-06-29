import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from '../../redux/contacts/operations';
import { selectFilteredContacts, selectIsLoading, selectError } from '../../redux/contacts/selectors';
import { ContactForm } from '../../components/ContactForm/ContactForm';
import { ContactList } from '../../components/ContactList/ContactList';
import { Filter } from '../../components/Filter/Filter';
import { Box, Typography, Container, CircularProgress, Alert, Paper } from '@mui/material';

export default function ContactsPage() {
  const dispatch = useDispatch();
  const contacts = useSelector(selectFilteredContacts);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
      <Paper
        elevation={8}
        sx={{
          p: { xs: 2, sm: 5 },
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          background: 'rgba(255,255,255,0.98)',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={800} color="primary" gutterBottom letterSpacing={1}>
            Your Contacts
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Add, search, and manage your personal contacts easily.
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <ContactForm />
        </Box>
        {isLoading && !contacts.length && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {contacts.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom fontWeight={600} color="secondary">
              Find contacts by name
            </Typography>
            <Filter />
            <ContactList />
          </>
        )}
        {!isLoading && contacts.length === 0 && !error && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No contacts yet. Add your first contact!
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
