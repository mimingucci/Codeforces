import React, { useEffect } from "react";

const StylesheetLoader = () => {
  useEffect(() => {
    const urls = [
      "https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-base.css",
      "https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-dark-theme.css",
    ];

    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};

export default StylesheetLoader;
