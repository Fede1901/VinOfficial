import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleGoogleLogin = async () => {
        try {
            await signIn('google');
            router.push('/');
        } catch (error) {
            setError("Error al iniciar sesión con Google");
            console.error(error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await signIn('facebook');
            router.push('/');
        } catch (error) {
            setError("Error al iniciar sesión con Facebook");
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            if (!result.error) {
                router.push('/');
            } else {
                setError("Verifica tu correo y contraseña.");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Ocurrió un error. Inténtalo nuevamente.");
        }
    };

    const handleRegisterRedirect = () => {
        router.push('/register');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#446596] px-4">
            <Image src="/logo.png" width={300} height={300} objectFit="contain" alt="Logo VIN" className="mb-4" />

            <div className="w-full max-w-xs flex flex-col items-center space-y-4 mt-4">
            {error && <p className="text-white text-center">{error}</p>}


                <form onSubmit={handleLogin} className="w-3/4 flex flex-col space-y-2">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-1 px-3 text-sm rounded-full text-gray-800"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-1 px-3 text-sm rounded-full text-gray-800"
                    />
                    <button
                        type="submit"
                        className="w-full py-1 text-sm bg-transparent border border-gray-300 rounded-full text-white font-semibold shadow-md hover:bg-gray-800 transition-colors"
                    >
                        Iniciar sesión
                    </button>
                </form>

                <div className="flex flex-col items-center space-y-1 w-3/4">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center w-full py-2 bg-white rounded-full text-gray-800 font-semibold border border-gray-300 shadow-md hover:bg-gray-100 transition-colors"
                    >
                        <FaGoogle className="mr-2 text-red-500 h-4 w-4" />
                        Ingresar con Google
                    </button>

                    <button
                        onClick={handleFacebookLogin}
                        className="flex items-center justify-center w-full py-2 bg-white rounded-full text-gray-800 font-semibold border border-gray-300 shadow-md hover:bg-gray-100 transition-colors"
                    >
                        <FaFacebook className="mr-2 text-blue-600 h-4 w-4" />
                        Ingresar con Facebook
                    </button>
                </div>

                <button
                    onClick={handleRegisterRedirect}
                    className="w-3/4 py-2 bg-[#800020] rounded-full text-white font-semibold shadow-md hover:bg-[#660016] transition-colors"
                >
                    Crear cuenta
                </button>
            </div>
            <p className="text-center mt-4 text-white text-xs w-3/4">
                Al registrarte, aceptas los <a href="#" className="underline">Términos de servicio</a> y la <a href="#" className="underline">Política de privacidad</a>, incluida la política de <a href="#" className="underline">Uso de Cookies</a>.
            </p>
        </div>
    );
}
