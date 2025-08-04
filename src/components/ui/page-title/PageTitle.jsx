// src/components/PageTitle.jsx
import { useEffect } from "react";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null; // This component doesn't render anything visually
};

export default PageTitle;
