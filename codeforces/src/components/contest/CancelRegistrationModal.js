import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

const CancelRegistrationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  contest 
}) => {
  const handleCancel = () => {
    onConfirm(contest.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancel Registration</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel your registration for:
          </Typography>
          <Typography variant="h6">{contest?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Type: {contest?.type}
          </Typography>
          {contest?.type === 'SYSTEM' && contest?.isRated && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Note: You are currently registered as a rated participant
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Keep Registration
        </Button>
        <Button onClick={handleCancel} variant="contained" color="error">
          Cancel Registration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelRegistrationModal;