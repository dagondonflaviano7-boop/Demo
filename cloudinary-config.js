export async function uploadToCloudinary(base64Data) {
  const CLOUDINARY_CLOUD = 'dki7swxo5';
  const CLOUDINARY_PRESET = 'ml_default';
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

  const blob = await (await fetch(base64Data)).blob();
  const fd = new FormData();
  fd.append('file', blob, 'upload.jpg');
  fd.append('upload_preset', CLOUDINARY_PRESET);
  
  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: fd });
  const data = await res.json();
  return data.secure_url;
}

export async function uploadImages(base64Array) {
  if (!base64Array || !base64Array.length) return [];
  const urls = [];
  for (const b64 of base64Array) {
    if (b64.startsWith('http')) { urls.push(b64); continue; }
    try { urls.push(await uploadToCloudinary(b64)); }
    catch(e) { 
      console.error('Cloudinary upload failed', e); 
      // Removed: urls.push(b64); to prevent massive base64 strings from crashing the DB
    }
  }
  return urls;
}