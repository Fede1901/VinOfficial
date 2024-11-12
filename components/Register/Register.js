import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaWineGlass } from 'react-icons/fa';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Confetti from 'react-confetti';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [welcomeMessage, setWelcomeMessage] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [fadeOut, setFadeOut] = useState(false); 
    const [showConfetti, setShowConfetti] = useState(false); 
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Registrar usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar datos adicionales en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                createdAt: new Date(),
            });

            // Mensaje de bienvenida, temporizador para redirección y confetti
            setWelcomeMessage("Bienvenido a la comunidad de VIN, conecta con el vino");
            setCountdown(3);
            setShowConfetti(true); // Activar confetti

            // Mostrar un toast como animación extra
            toast.success("Registro exitoso!", {
                position: "top-center",
                icon: <FaWineGlass className="text-[#8B1A2B]" />,
                autoClose: 2000
            });
        } catch (err) {
            setError("Error al registrar: " + err.message);
        }
    };

    useEffect(() => {
        if (countdown > 0 && welcomeMessage) {
            const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (countdown === 0) {
            setFadeOut(true);
            setTimeout(() => {
                setShowConfetti(false);
                router.push('/');
            }, 500); 
        }
    }, [countdown, welcomeMessage, router]);

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-[#446596] px-4 ${fadeOut ? 'fade-out' : ''}`}>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
                <div className="flex justify-center mb-4">
                    <Image
                        src="/logo3.png"
                        alt="Logo de VIN"
                        width={120}
                        height={120}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
                {welcomeMessage ? (
                    <div className="text-center animate__animated animate__fadeIn">
                        <FaWineGlass className="text-[#8B1A2B] text-6xl mx-auto mb-2 animate-bounce" />
                        <p className="text-[#8B1A2B] text-lg font-semibold">{welcomeMessage}</p>
                        <p className="text-gray-700 mt-2">
                            Usted está siendo redirigido para que inicie sesión... en {countdown} segundos.
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Crear cuenta</h2>
                        <form onSubmit={handleRegister} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#8B1A2B] hover:bg-[#6f1121] text-white font-semibold py-2 rounded-lg transition duration-200"
                            >
                                Registrar
                            </button>
                            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Register;
