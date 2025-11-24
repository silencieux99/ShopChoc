import { bucket } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadToFirebaseStorage = async (file) => {
  try {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const fileUpload = bucket.file(`products/${fileName}`);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', async () => {
        // Rendre le fichier public
        await fileUpload.makePublic();
        
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        resolve(publicUrl);
      });

      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw error;
  }
};

export const deleteFromFirebaseStorage = async (fileUrl) => {
  try {
    // Extraire le nom du fichier de l'URL
    const fileName = fileUrl.split('/').pop();
    const file = bucket.file(`products/${fileName}`);
    await file.delete();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};
