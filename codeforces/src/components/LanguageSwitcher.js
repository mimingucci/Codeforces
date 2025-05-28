import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

// Flag images - you can use flag icons or images
const FlagIcon = ({ country, size = 24 }) => {
  const flagStyle = {
    width: size,
    height: size * 0.75, // Typical flag ratio
    borderRadius: 2,
    objectFit: "cover",
    border: "1px solid rgba(0,0,0,0.1)",
  };

  // You can replace these with actual flag images
  const flagSrc =
    country === "en"
      ? "https://flagcdn.com/w40/gb.png" // UK flag
      : "https://flagcdn.com/w40/vn.png"; // Vietnam flag

  return <img src={flagSrc} alt={`${country} flag`} style={flagStyle} />;
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language || "en";

  const handleLanguageChange = (language) => {
    i18n
      .changeLanguage(language)
      .then(() => {
        localStorage.setItem("language", language);
      })
      .catch((err) => console.error("Language change failed:", err));
  };

  const languages = [
    { code: "en", name: "English", country: "en" },
    { code: "vi", name: "Tiếng Việt", country: "vi" },
  ];

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {languages.map((lang) => (
        <Tooltip key={lang.code} title={lang.name} arrow>
          <IconButton
            onClick={() => handleLanguageChange(lang.code)}
            sx={{
              p: 0.5,
              opacity: currentLanguage === lang.code ? 1 : 0.6,
              transform:
                currentLanguage === lang.code ? "scale(1.1)" : "scale(1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                opacity: 1,
                transform: "scale(1.1)",
              },
            }}
          >
            <FlagIcon country={lang.country} size={28} />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default LanguageSwitcher;
