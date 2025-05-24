import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  AlertTitle
} from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';

const ContestAlert = ({ 
  open, 
  onClose, 
  title, 
  message, 
  severity = 'warning',
  actionText = 'OK',
  showRedirect = true
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Alert 
          severity={severity}
          icon={<AccessTimeIcon />}
          sx={{ 
            borderRadius: 0,
            '& .MuiAlert-icon': {
              fontSize: 28
            }
          }}
        >
          <AlertTitle sx={{ fontSize: '1.2rem' }}>{title}</AlertTitle>
          <Typography variant="body1">{message}</Typography>
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button 
          onClick={onClose}
          variant="contained"
          color={severity}
          sx={{ minWidth: 100 }}
        >
          {actionText}
        </Button>
        {showRedirect && (
          <Button
            href="/contests"
            variant="outlined"
            color={severity}
            sx={{ minWidth: 100 }}
          >
            View All Contests
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ContestAlert;