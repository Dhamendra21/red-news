let imagekit = null;

try {
  const ImageKit = require('imagekit');

  if (
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    imagekit = new ImageKit({
      publicKey:   process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey:  process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
    console.log('✅ ImageKit initialized');
  } else {
    console.warn('⚠️  ImageKit keys missing in .env — image upload disabled');
  }
} catch (err) {
  console.warn('⚠️  imagekit package not installed:', err.message);
}

exports.uploadImage = async (fileBuffer, fileName, folder = 'news') => {
  if (!imagekit) {
    console.warn('ImageKit not configured, using placeholder');
    return {
      url: `https://placehold.co/800x500/e2e8f0/94a3b8?text=${encodeURIComponent(fileName)}`,
      fileId: `local_${Date.now()}`
    };
  }
  const response = await imagekit.upload({
    file: fileBuffer.toString('base64'),
    fileName: `${Date.now()}_${fileName}`,
    folder: `/color-saptahik/${folder}`,
    useUniqueFileName: true,
    tags: ['color-saptahik', folder]
  });
  return { url: response.url, fileId: response.fileId };
};

exports.deleteImage = async (fileId) => {
  if (!imagekit || fileId?.startsWith('local_')) return;
  return await imagekit.deleteFile(fileId);
};

exports.getAuthParams = () => {
  if (!imagekit) return null;
  return imagekit.getAuthenticationParameters();
};

exports.imagekit = imagekit;