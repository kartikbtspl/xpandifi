import { Modal as MUIModal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";

export const Modal = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  isFullscreen = false,
  size = "md", // "sm", "md", "lg", "xl", "full"
  containerClassName = "",
  containerSx = {},
  modalSx = {},
  disableBackdropClick = false,
}) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Determine modal size classes
  const getSizeClass = () => {
    if (isFullscreen || size === "full") return "w-screen h-screen";
    if (size === "sm") return "w-[300px]";
    if (size === "md") return "w-[90vw] sm:w-[600px]";
    if (size === "lg") return "w-[90vw] sm:w-[800px]";
    if (size === "xl") return "w-[95vw] sm:w-[1000px]";
    return "w-[90vw] sm:w-[600px]";
  };

  return (
    <MUIModal
      open={isOpen}
      onClose={disableBackdropClick ? undefined : onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition
      // ✅ Enable MUI's focus handling to avoid aria-hidden issues
      // (Remove these two props)
      // disableAutoFocus
      // disableEnforceFocus
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0)",
        zIndex: 1300,
        ...modalSx,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className={`
    relative bg-white dark:bg-gray-900 rounded-3xl shadow-lg 
    max-h-[90vh] overflow-auto ${getSizeClass()} ${containerClassName}
  `}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "auto", // ✅ Enable scrolling
          scrollbarWidth: "none", // ✅ Firefox
          msOverflowStyle: "none", // ✅ IE
          "&::-webkit-scrollbar": {
            display: "none", // ✅ Chrome/Safari
          },
          ...containerSx,
        }}
      >
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            className="!absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:hover:text-white z-10"
            aria-label="Close modal"
          >
            <CloseIcon />
          </IconButton>
        )}

        {children}
      </Box>
    </MUIModal>
  );
};
