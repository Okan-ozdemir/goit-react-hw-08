import { useDispatch, useSelector } from 'react-redux';
import { changeFilter } from '../../redux/filters/filtersSlice';
import { selectNameFilter } from '../../redux/filters/selectors';
import { TextField, Box } from '@mui/material';

export const Filter = () => {
  const dispatch = useDispatch();
  const filter = useSelector(selectNameFilter);

  const handleChange = (e) => {
    dispatch(changeFilter(e.target.value));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Find contacts by name"
        type="text"
        name="filter"
        value={filter}
        onChange={handleChange}
        placeholder="Search contacts..."
      />
    </Box>
  );
};
