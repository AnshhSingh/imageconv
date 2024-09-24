"use client"
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const supportedFormats = ['png', 'jpeg', 'webp', 'gif', 'avif', 'tiff', 'bmp'];

const ImageConverter = () => {
  const [images, setImages] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<{ name: string; src: string }[]>([]);
  const [outputFormat, setOutputFormat] = useState<string>('png');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // multi img
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(Array.from(files));
      setError(null); 
    }
  };

  const convertImages = async () => {
    setIsConverting(true);
    setError(null); 
    const newConvertedImages: { name: string; src: string }[] = [];

    try {
      await Promise.all(
        images.map(async (file) => {
          const reader = new FileReader();
          const imageSrc = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              if (reader.result) {
                resolve(reader.result as string);
              } else {
                reject(new Error('Failed to read file.'));
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          // Send the image to the server for conversion
          const res = await fetch('/api/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageSrc, format: outputFormat }),
          });

          if (!res.ok) {
            throw new Error('Failed to convert image.');
          }

          const data = await res.json();
          newConvertedImages.push({
            name: `${file.name.split('.')[0]}.${outputFormat}`,
            src: data.convertedImage,
          });
        })
      );

      setConvertedImages(newConvertedImages);
    } catch (err) {
      console.error(err);
      setError('An error occurred while converting the images.');
    } finally {
      setIsConverting(false);
    }
  };


  const downloadAsZip = () => {
    const zip = new JSZip();
    const folder = zip.folder('converted_images');

    convertedImages.forEach((image) => {
      const base64Data = image.src.split(',')[1];
      folder?.file(image.name, base64Data, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'converted_images.zip');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Image Format Converter</h1>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-600"
        />

        {images.length > 0 && (
          <>
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">Select Output Format</label>
              <select
                onChange={(e) => setOutputFormat(e.target.value)}
                value={outputFormat}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600"
              >
                {supportedFormats.map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={convertImages}
              disabled={isConverting}
              className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition ${
                isConverting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isConverting ? 'Converting...' : 'Convert Images'}
            </button>
          </>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {convertedImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Converted Images</h3>
            <button
              onClick={downloadAsZip}
              className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Download All as Zip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageConverter;
