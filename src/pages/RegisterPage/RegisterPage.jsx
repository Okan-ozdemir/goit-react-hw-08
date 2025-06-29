import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/auth/operations';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isLoggedIn, error } = useAuth();

  useEffect(() => {
    // Reset form errors when error changes
    if (error) {
      setFormErrors(prev => ({
        ...prev,
        submit: error
      }));
      setIsSubmitting(false);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (name.trim().length > 50) {
      errors.name = 'Name must be less than 50 characters';
    } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇа-яА-Я\s'-]+$/.test(name.trim())) {
      errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    } else if (email.trim().length > 100) {
      errors.email = 'Email must be less than 100 characters';
    }
    
    // Password validation - user-friendly but secure
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 7) {
      errors.password = 'Password must be at least 7 characters long';
    } else if (password.length > 32) {
      errors.password = 'Password must be less than 32 characters';
    }
    // Removed restrictive password rules - let users choose their own passwords
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started with:', {
      name: name,
      email: email,
      password: password ? '[HIDDEN]' : 'MISSING'
    });
    
    if (validateForm()) {
      setIsSubmitting(true);
      setFormErrors({});
      
      try {
        // Clean the data before sending
        const cleanData = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password
        };
        
        console.log('Sending registration data:', {
          name: cleanData.name,
          email: cleanData.email,
          password: cleanData.password ? '[HIDDEN]' : 'MISSING'
        });
        
        const resultAction = await dispatch(register(cleanData));
        
        if (register.fulfilled.match(resultAction)) {
          // Registration successful, will be redirected by the useEffect
          console.log('Registration successful:', resultAction.payload);
          // Clear any previous errors
          setFormErrors({});
        } else if (register.rejected.match(resultAction)) {
          // Handle specific error messages from the API
          const errorMessage = resultAction.payload || 'Registration failed. Please try again.';
          console.error('Registration failed:', errorMessage);
          setFormErrors({ submit: errorMessage });
        }
      } catch (error) {
        console.error('Unexpected error during registration:', error);
        setFormErrors({ submit: 'An unexpected error occurred. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Form validation failed:', formErrors);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isLoggedIn) {
    return <Navigate to="/contacts" replace />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={8}
        sx={{ 
          mt: 8, 
          p: { xs: 3, sm: 5 },
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          background: 'rgba(255,255,255,0.98)',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 800, color: 'primary.main', letterSpacing: 1 }}>
          Create an Account
        </Typography>
        
        {formErrors.submit && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {formErrors.submit}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!formErrors.name}
            helperText={formErrors.name}
            disabled={isSubmitting}
            inputProps={{
              minLength: 2,
              maxLength: 50,
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
            disabled={isSubmitting}
            inputProps={{
              maxLength: 100,
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password}
            disabled={isSubmitting}
            inputProps={{
              minLength: 7,
              maxLength: 32,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText sx={{ mt: -1, mb: 1 }}>
            Password must be at least 7 characters long
          </FormHelperText>
          
          {/* Password security suggestions */}
          <Box sx={{ mt: 1, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              💡 Password security tips:
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • Use at least 7 characters
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • Combine letters, numbers, and special characters
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • Avoid using personal information
            </Typography>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
