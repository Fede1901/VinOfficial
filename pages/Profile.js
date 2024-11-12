import UserProfile from '../components/Profile/UserProfile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const [showModal, setShowModal] = useState(false); 

    useEffect(() => {
    
        toast.success('Bienvenido/a a tu perfil!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mb-4"
            >
                Abrir Perfil
            </button>

            {}
            {showModal && <UserProfile setShowModal={setShowModal} />} 

            <ToastContainer />
        </div>
    );
}
