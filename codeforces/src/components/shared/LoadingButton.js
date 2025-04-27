import { Button, CircularProgress } from '@mui/material';

const LoadingButton = ({
  loading = false,
  children,
  startIcon,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;