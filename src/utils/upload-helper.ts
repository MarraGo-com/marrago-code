import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

/**
 * Compresses an image and uploads it to Firebase Storage.
 * Returns the public Download URL.
 */
export async function compressAndUploadImage(file: File, path: string = 'articles'): Promise<string> {
  // 1. Configuration for Compression
  const options = { 
    maxSizeMB: 1, 
    maxWidthOrHeight: 1920, 
    useWebWorker: true, 
    fileType: 'image/webp' 
  };
  
  let compressedFile: File;
  
  try {
    // Attempt compression
    compressedFile = await imageCompression(file, options);
  } catch (error) {
    console.warn("Image compression failed, uploading original file.", error);
    compressedFile = file;
  }

  // 2. Create Unique Filename
  const nameWithoutExtension = compressedFile.name.split('.').slice(0, -1).join('.');
  const newFileName = `${Date.now()}_${nameWithoutExtension}.webp`;
  
  // 3. Upload to Firebase
  const storageRef = ref(storage, `${path}/${newFileName}`);
  const uploadTask = await uploadBytesResumable(storageRef, compressedFile);
  
  // 4. Return URL
  return await getDownloadURL(uploadTask.ref);
}