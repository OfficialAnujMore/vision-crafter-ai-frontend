import { useLoader } from './LoaderContext';
import '../styles/Loader.css';

const GlobalLoader = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default GlobalLoader;