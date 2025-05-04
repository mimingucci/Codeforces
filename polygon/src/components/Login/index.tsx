'use client';

import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [values, setValues] = useState<{
    password: string;
    showPassword: boolean;
  }>({
    password: '',
    showPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClickShowPassword: () => void = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword: (e: React.MouseEvent) => void = (event) => {
    event.preventDefault();
  };

  const isEmailAddress = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handlePasswordChange =
    (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > 0 && isEmailAddress(email)) {
        setEnableSubmit(true);
      } else {
        setEnableSubmit(false);
      }
      setValues({
        ...values,
        [prop]: e.target.value,
      });
    };

  const handleEmailChange = (prop: string) => {
    if (values.password.length > 0 && isEmailAddress(prop)) {
      setEnableSubmit(true);
    } else {
      setEnableSubmit(false);
    }
    setEmail(prop);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      if (result?.ok) {
        router.push('/'); // Or wherever you want to redirect after login
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
        }}
      >
        {/* Left side - Image */}
        <Box
          sx={{
            flex: '1 1 50%',
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#1b2756',
            p: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Image
              src="/images/topcoder2.svg"
              alt="Polygon"
              width={300}
              height={300}
              style={{
                objectFit: 'contain',
                margin: 'auto',
              }}
              priority
            />
          </Box>
        </Box>

        {/* Right side - Login Form */}
        <Box
          sx={{
            flex: '1 1 50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            bgcolor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: { xs: '100%', sm: '450px', borderRadius: 2 },
              borderRadius: 2,
            }}
          >
            <Stack spacing={3}>
              {/* Logo for mobile */}
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Image
                  src="/images/topcoder1.svg"
                  alt="Codeforces"
                  width={200}
                  height={150}
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>

              <Typography variant="h4" align="center" fontWeight="bold">
                Welcome Back
              </Typography>

              <Typography variant="body1" align="center" color="text.secondary">
                Sign in to continue to Polygon
              </Typography>

              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  align="center"
                  sx={{
                    bgcolor: 'error.lighter',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  {error}
                </Typography>
              )}

              <form onSubmit={handleLogin}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    onChange={(e) => handleEmailChange(e.target.value)}
                    error={!!error}
                    disabled={isLoading}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handlePasswordChange('password')}
                    error={!!error}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            disabled={isLoading}
                          >
                            {values.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={!enableSubmit || isLoading}
                    sx={{
                      py: 1.5,
                      mt: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </Stack>
              </form>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don&apos;t have an account?{' '}
                <Typography
                  component="a"
                  href="http://localhost:3000" // Make sure to use full URL
                  target="_blank" // Add this to open in new tab
                  rel="noopener noreferrer" // Security best practice for external links
                  color="primary"
                  sx={{
                    textDecoration: 'none',
                    fontWeight: 'medium',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign up
                </Typography>
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
