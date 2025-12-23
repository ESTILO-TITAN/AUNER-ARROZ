import { CLOUDINARY_CONFIG } from '../config/constants';

// Servicio de Cloudinary para subir imágenes y videos
export const cloudinaryService = {
  // Subir imagen
  async uploadImage(imageUri) {
    const formData = new FormData();
    
    // Obtener el nombre del archivo
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    });
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('transformation', 'f_webp,q_auto'); // Convertir a WebP
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      return { url: data.secure_url, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },

  // Subir video
  async uploadVideo(videoUri) {
    const formData = new FormData();
    
    const filename = videoUri.split('/').pop();
    
    formData.append('file', {
      uri: videoUri,
      name: filename,
      type: 'video/mp4',
    });
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('resource_type', 'video');
    formData.append('transformation', 'f_webm,q_auto,h_720'); // 720p WebM
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      return { url: data.secure_url, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },

  // Eliminar archivo
  async deleteFile(publicId) {
    // Nota: La eliminación requiere firma del servidor
    // Por seguridad, esto debería hacerse desde un backend
    console.warn('La eliminación de archivos debe hacerse desde el servidor');
    return { error: 'Not implemented on client' };
  },
};
