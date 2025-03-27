import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Pharmacy: React.FC = () => {
  useEffect(() => {
    // Show toast notification when user visits the Pharmacy tab
    toast.info('Pharmacy Coming Soon in V2 🚀', {
      position: 'top-right',
      autoClose: 3000, // Closes after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });
  }, []);

  return null; // No need to render anything
};

export default Pharmacy;
