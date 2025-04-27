import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box
} from '@mui/material';
import { useState } from 'react';

const RegisterModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  contest,
  showRatedOption = false 
}) => {
  const [isRated, setIsRated] = useState(false);

  const handleRegister = () => {
    onConfirm({
      contestId: contest.id,
      isRated: showRatedOption ? isRated : undefined
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register for Contest</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">{contest?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Duration: {contest?.durationHours} hours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Type: {contest?.type}
          </Typography>
        </Box>

        {showRatedOption && (
          <FormControlLabel
            control={
              <Checkbox 
                checked={isRated}
                onChange={(e) => setIsRated(e.target.checked)}
              />
            }
            label="Participate as rated contestant"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleRegister} variant="contained">
          Confirm Registration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterModal;