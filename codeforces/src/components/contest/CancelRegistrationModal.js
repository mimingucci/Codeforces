import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const CancelRegistrationModal = ({ open, onClose, onConfirm, contest }) => {
  const { t } = useTranslation();

  const handleCancel = () => {
    onConfirm(contest.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("contest.cancelRegistrationTitle")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            {t("contest.cancelRegistrationConfirm")}
          </Typography>
          <Typography variant="h6">{contest?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t("contest.type")}: {contest?.type}
          </Typography>
          {contest?.type === "SYSTEM" && contest?.isRated && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {t("contest.noteRatedParticipant")}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t("contest.keepRegistration")}
        </Button>
        <Button onClick={handleCancel} variant="contained" color="error">
          {t("contest.cancelRegistration")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelRegistrationModal;
