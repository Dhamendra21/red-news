import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X } from 'lucide-react';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropperModal({ isOpen, onClose, imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState(null);
  const [aspect, setAspect] = useState(undefined);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCrop(null);
      setCompletedCrop(null);
      setAspect(undefined);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const handleSave = () => {
    if (!completedCrop || !imgRef.current) return;
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);
    
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    
    ctx.drawImage(
      image,
      cropX,
      cropY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      onCropComplete(blob);
    }, 'image/jpeg', 0.95);
  };

  const aspects = [
    { label: 'Free', value: undefined },
    { label: 'Square (1:1)', value: 1 },
    { label: 'Sidebar Ad (300x250)', value: 300 / 250 },
    { label: 'Banner Ad (728x90)', value: 728 / 90 },
    { label: 'Wide (16:9)', value: 16 / 9 },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Crop Image</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 flex flex-col items-center justify-center overflow-auto flex-1 min-h-[400px]">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                style={{ maxWidth: '100%', maxHeight: '50vh' }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {aspects.map(a => (
              <button
                key={a.label}
                type="button"
                onClick={() => {
                  setAspect(a.value);
                  if (imgRef.current && a.value) {
                    setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, a.value));
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  aspect === a.value 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSave}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
