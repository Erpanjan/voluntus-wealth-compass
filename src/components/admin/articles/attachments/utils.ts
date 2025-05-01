
/**
 * Formats a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validates a file for size and type
 */
export const validateFile = (file: File, maxSizeMB: number = 10): boolean => {
  // Check file size
  const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
  
  if (!isValidSize) {
    console.log(`File rejected: ${file.name} (${formatFileSize(file.size)}) exceeds max size of ${maxSizeMB}MB`);
    return false;
  }
  
  // Check if it's an allowed file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  const isAllowedType = allowedTypes.includes(file.type);
  if (!isAllowedType) {
    console.log(`File rejected: ${file.name} has unsupported type: ${file.type}`);
  } else {
    console.log(`File validated successfully: ${file.name} (${formatFileSize(file.size)}, ${file.type})`);
  }
  
  return isValidSize && isAllowedType;
};

/**
 * Gets file extension from filename or URL
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Gets MIME type from file extension
 */
export const getMimeTypeFromExtension = (extension: string): string => {
  const extensionMap: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif'
  };
  
  return extensionMap[extension.toLowerCase()] || 'application/octet-stream';
};
