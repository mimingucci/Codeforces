import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Autocomplete,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Key as KeyIcon,
  Visibility,
  VisibilityOff,
  Public as PublicIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import countries from "../../utils/countries";

// Updated to take userId as a prop instead of using URL params
const Setting = ({ userId }) => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Profile data state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields state - Profile Info
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState(null);

  // Form fields state - Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user data on component mount or when userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = HandleCookies.getCookie("token");

        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const response = await UserApi.getUserById(userId);

        if (response?.data?.code === "200") {
          const userData = response.data.data;
          setUser(userData);
          setFirstname(userData.firstname || "");
          setLastname(userData.lastname || "");
          setDescription(userData.description || "");

          if (userData.country) {
            const userCountry = countries.find(
              (c) => c.name === userData.country
            );
            setCountry(userCountry || null);
          }
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset messages when switching tabs
    setError("");
    setSuccess("");
  };

  // Handle profile update submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await UserApi.updateUser({
        accessToken: HandleCookies.getCookie("token"),
        id: userId,
        firstname,
        lastname,
        description,
        country: country?.name || null,
      });

      if (response?.data?.code === "200") {
        setSuccess("Profile information updated successfully");
        showSuccessToast("Profile updated successfully");
      } else {
        setError(response?.data?.message || "Failed to update profile");
        showErrorToast(response?.data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating your profile");
      showErrorToast("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change submission
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    // Form validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setSaving(true);

    try {
      const response = await UserApi.changePassword({
        accessToken: HandleCookies.getCookie("token"),
        email: user.email,
        password: newPassword,
      });

      if (response?.data?.code === "200") {
        setSuccess("Password changed successfully");
        showSuccessToast("Password changed successfully");
        // Reset form fields
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response?.data?.message || "Failed to change password");
        showErrorToast(response?.data?.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError("An error occurred while changing your password");
      showErrorToast("An error occurred while changing your password");
    } finally {
      setSaving(false);
    }
  };

  // Toast notifications
  const showSuccessToast = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showErrorToast = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ToastContainer />

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<PersonIcon />}
              label="Profile Information"
              iconPosition="start"
            />
            <Tab
              icon={<KeyIcon />}
              label="Change Password"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Profile Information Tab */}
        <Box
          role="tabpanel"
          hidden={activeTab !== 0}
          id="profile-settings-tab"
          aria-labelledby="profile-settings-tab"
          sx={{ p: 3 }}
        >
          {activeTab === 0 && (
            <Box component="form" onSubmit={handleProfileUpdate} noValidate>
              {error && activeTab === 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              {success && activeTab === 0 && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <Typography variant="h6" component="h2" gutterBottom>
                Personal Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your profile information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option.name}
                    value={country}
                    onChange={(e, newValue) => setCountry(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <PublicIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                    placeholder="Tell us about yourself..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ alignSelf: "flex-start", mt: 2 }}
                        >
                          <DescriptionIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: "right" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={
                    saving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Password Change Tab */}
        <Box
          role="tabpanel"
          hidden={activeTab !== 1}
          id="password-settings-tab"
          aria-labelledby="password-settings-tab"
          sx={{ p: 3 }}
        >
          {activeTab === 1 && (
            <Box component="form" onSubmit={handlePasswordChange} noValidate>
              {error && activeTab === 1 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              {success && activeTab === 1 && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <Typography variant="h6" component="h2" gutterBottom>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your account password
              </Typography>

              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 3, textAlign: "right" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={
                    saving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={saving || !newPassword || !confirmPassword}
                >
                  {saving ? "Changing Password..." : "Change Password"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Setting;
