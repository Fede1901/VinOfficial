import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { onAuthStateChanged } from 'firebase/auth';

function UserProfile({ setShowModal }) {
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [previousPictures, setPreviousPictures] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserProfile(user);
            } else {
                console.error("No se pudo autenticar al usuario.");
                toast.error("Por favor, inicia sesión.");
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserProfile = async (user) => {
        setLoading(true);
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                setProfilePictureUrl(userDoc.data().profilePicture || '');
            }

            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            const result = await listAll(storageRef);
            const urls = await Promise.all(result.items.map(item => getDownloadURL(item)));
            setPreviousPictures(urls);
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
            toast.error('Error al obtener los datos del usuario.');
        } finally {
            setLoading(false);
        }
    };

    
    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleUploadProfilePicture = async () => {
        if (!profilePicture) {
            toast.warn('Por favor, selecciona una foto primero.');
            return;
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            const storageRef = ref(storage, `profilePictures/${user.uid}/${profilePicture.name}`);
            await uploadBytes(storageRef, profilePicture);
            const newProfilePictureUrl = await getDownloadURL(storageRef);

            await updateDoc(doc(db, 'users', user.uid), {
                profilePicture: newProfilePictureUrl,
            });

            setProfilePictureUrl(newProfilePictureUrl);
            setPreviousPictures(prev => [...prev, newProfilePictureUrl]);
            toast.success('Foto de perfil actualizada exitosamente.');
        } catch (error) {
            console.error('Error al subir la foto de perfil:', error);
            toast.error('Error al subir la foto de perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        router.push('/');
    };

    return (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
                <ToastContainer />
                <h2 className="text-xl font-bold">Perfil del Usuario</h2>
                {loading ? (
                    <ClipLoader color="#000" loading={loading} size={50} />
                ) : (
                    profilePictureUrl && (
                        <img
                            src={profilePictureUrl}
                            alt="Foto de perfil"
                            className="w-32 h-32 rounded-full mt-4"
                        />
                    )
                )}
                <input type="file" onChange={handleProfilePictureChange} accept="image/*" className="mt-4" />
                <button
                    onClick={handleUploadProfilePicture}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mt-4"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Cambiar Foto de Perfil'}
                </button>
                <button
                    onClick={handleClose}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg mt-4"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}

export default UserProfile;
