import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const RegisterModal = ({
  open,
  onClose,
  onConfirm,
  contest,
  showRatedOption = false,
}) => {
  const { t } = useTranslation();
  const [isRated, setIsRated] = useState(false);

  const handleRegister = () => {
    onConfirm({
      contestId: contest.id,
      isRated: showRatedOption ? isRated : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("contest.registerForContest")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">{contest?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t("contest.duration")}: {contest?.durationHours}{" "}
            {t("contest.hours")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("contest.type")}: {contest?.type}
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
            label={t("contest.participateAsRated")}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t("contest.cancel")}
        </Button>
        <Button onClick={handleRegister} variant="contained">
          {t("contest.confirmRegistration")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterModal;
