export const validateFile = (file: Express.Multer.File | undefined): { isValid: boolean} => {
  if (!file) {
    return {
      isValid: true,
    };
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  // Check if the MIME type is in the allowed list.
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return {
      isValid: false,
    };
  }

  // Check if the file size exceeds the limit.
  if (file.size > maxFileSize) {
    return {
      isValid: false,
    };
  }

  // If all checks pass, the file is valid.
  return {
    isValid: true,
  };
};