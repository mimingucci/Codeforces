import { useState, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import {
  PhotoCamera,
  Clear,
  Upload,
  AccountCircle,
} from "@mui/icons-material";
import { DeleteOutline } from '@mui/icons-material';
import Cropper from "react-easy-crop";
import HandleCookies from "../../utils/HandleCookies";
import UserApi from "../../getApi/UserApi";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

export default function ImageUploader({ user, isHome = false }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [confirmUnsetOpen, setConfirmUnsetOpen] = useState(false);


  const filePicekerRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return "No file selected";
    if (!ALLOWED_TYPES.includes(file.type)) return "Invalid file type";
    if (file.size > MAX_FILE_SIZE) return "File size too large (max 5MB)";
    return null;
  };

  const getCurrentAvatar = () => {
    if (imagePreview) return imagePreview;
    return user?.avatar || null;
  };

  const previewFile = async (e) => {
    try {
      const file = e.target.files[0];
      const errorMessage = validateFile(file);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
        setAvatar(file);
        setCropDialogOpen(true);
        setError("");
      };
    } catch (err) {
      setError("Error reading file");
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImage = async () => {
    try {
      const canvas = document.createElement("canvas");
      const image = new Image();
      image.src = imagePreview;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      });
    } catch (err) {
      console.error(err);
      setError("Error cropping image");
      return null;
    }
  };

  const handleUploadAvatar = async () => {
    try {
      setLoading(true);
      setError("");

      const croppedImage = await getCroppedImage();
      if (!croppedImage) return;

      await UserApi.unsetImage(HandleCookies.getCookie("token"));
      await UserApi.uploadImage({
        file: croppedImage,
        accessToken: HandleCookies.getCookie("token"),
      });

      window.location.replace("/profile/" + user?.username);
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsetAvatar = async () => {
    try {
      setLoading(true);
      setError("");
      
      await UserApi.unsetImage(HandleCookies.getCookie("token"));
      window.location.replace("/profile/" + user?.username);
    } catch (err) {
      setError("Failed to remove avatar");
    } finally {
      setLoading(false);
      setConfirmUnsetOpen(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <input
        ref={filePicekerRef}
        accept="image/*"
        onChange={previewFile}
        type="file"
        hidden
      />
      
      <Box sx={{ mb: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>

      <Box sx={{ position: "relative", width: 200, height: 200, margin: "auto", mb: 2 }}>
      {getCurrentAvatar() ? (
          <Box
            component="img"
            src={getCurrentAvatar()}
            alt="Profile"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: "100%",
              height: "100%",
              '&:hover': {
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }
            }}
          >
            <AccountCircle sx={{ width: "60%", height: "60%" }} />
          </Avatar>
        )}
        {isHome && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            right: 0, 
            display: 'flex', 
            gap: 1 
          }}>
            <IconButton
              sx={{
                backgroundColor: "error.main",
                "&:hover": { backgroundColor: "error.dark" },
                color: "white",
              }}
              onClick={() => setConfirmUnsetOpen(true)}
              disabled={loading}
            >
              <DeleteOutline />
            </IconButton>
            <IconButton
              sx={{
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "primary.dark" },
                color: "white",
              }}
              onClick={() => filePicekerRef.current.click()}
              disabled={loading}
            >
              <PhotoCamera />
            </IconButton>
          </Box>
        )}
      </Box>

      {imagePreview && (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<Clear />}
            onClick={() => {
              setImagePreview(null);
              setAvatar(null);
              setError("");
              if (filePicekerRef.current) {
                filePicekerRef.current.value = '';
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={handleUploadAvatar}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </Box>
      )}

      <Dialog
        open={cropDialogOpen}
        maxWidth="md"
        fullWidth
        onClose={() => setCropDialogOpen(false)}
      >
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          <Box sx={{ position: "relative", height: 400 }}>
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setCropDialogOpen(false);
            }}
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
      open={confirmUnsetOpen}
      onClose={() => setConfirmUnsetOpen(false)}
      aria-labelledby="unset-avatar-dialog"
    >
      <DialogTitle id="unset-avatar-dialog">
        Remove Profile Picture
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to remove your profile picture? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setConfirmUnsetOpen(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUnsetAvatar}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteOutline />}
        >
          {loading ? "Removing..." : "Remove"}
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
}
