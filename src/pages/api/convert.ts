import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';


const supportedFormats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff', 'bmp'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { image, format } = req.body;

  if (!image || !format) {
    return res.status(400).json({ message: 'Missing image or format field' });
  }

  
  if (!supportedFormats.includes(format)) {
    return res.status(400).json({ message: `Unsupported format: ${format}` });
  }

  try {
    // base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

   
    const convertedBuffer = await sharp(imgBuffer).toFormat(format).toBuffer();

    
    const convertedBase64 = `data:image/${format};base64,${convertedBuffer.toString('base64')}`;
    
    res.status(200).json({ convertedImage: convertedBase64 });
  } catch (error) {
    console.error('Image conversion error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
