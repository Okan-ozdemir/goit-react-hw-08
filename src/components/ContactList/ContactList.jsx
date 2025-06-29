import { useSelector } from 'react-redux';
import { selectFilteredContacts } from '../../redux/contacts/selectors';
import { ContactItem } from '../ContactItem/ContactItem';
import { List, Paper, Typography } from '@mui/material';

export const ContactList = () => {
  const contacts = useSelector(selectFilteredContacts);

  if (contacts.length === 0) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Contacts
      </Typography>
      <List>
        {contacts.map((contact) => (
          <ContactItem key={contact.id} contact={contact} />
        ))}
      </List>
    </Paper>
  );
};
