import type { NextPage } from 'next';
import ImageConverter from '../components/ImageConverter';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ImageConverter />
    </div>
  );
};

export default Home;
