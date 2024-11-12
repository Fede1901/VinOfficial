import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import dynamic from "next/dynamic";

const Wallet = dynamic(() => import("@mercadopago/sdk-react").then(mod => mod.Wallet), { ssr: false });

const ComprasVinos = () => {
    const [productos, setProductos] = useState([
        { id: 1, nombre: 'Finca La Linda', precio: 7460, imagen: '/vino5.webp' },
        { id: 2, nombre: 'Mosquita Muerta', precio: 4000, imagen: '/vino4.webp' },
        { id: 3, nombre: 'Viñas de Balbo', precio: 3850, imagen: '/vino3.webp' },
        { id: 4, nombre: 'Alma Mora', precio: 5900, imagen: '/vino2.webp' },
        { id: 5, nombre: 'Nicasia', precio: 7420, imagen: '/vino1.webp' },
        { id: 6, nombre: 'Saint Felicien', precio: 8150, imagen: '/vino5.webp' },
        { id: 7, nombre: 'Portillo', precio: 5620, imagen: '/vino4.webp' },
        { id: 8, nombre: 'La Mascota', precio: 4990, imagen: '/vino2.webp' },
        { id: 9, nombre: 'Catena Zapata', precio: 9500, imagen: '/vino1.webp' },
        { id: 10, nombre: 'Luigi Bosca', precio: 7200, imagen: '/vino3.webp' },
        { id: 11, nombre: 'Chandon', precio: 9800, imagen: '/vino2.webp' },
        { id: 12, nombre: 'Tierras Altas', precio: 1500, imagen: '/vino5.webp' },
    ]);
    
    const [carrito, setCarrito] = useState([]);
    const [preferenceId, setPreferenceId] = useState(null);

    useEffect(() => {
        import("@mercadopago/sdk-react").then(({ initMercadoPago }) => {
            initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
        });
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "carrito"), (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCarrito(items);
        });
        return () => unsubscribe();
    }, []);

    const agregarAlCarrito = async (producto) => {
        const itemEnCarrito = carrito.find(item => item.nombre === producto.nombre);

        if (itemEnCarrito) {
            const itemRef = doc(db, "carrito", itemEnCarrito.id);
            await updateDoc(itemRef, { cantidad: itemEnCarrito.cantidad + 1 });
        } else {
            await addDoc(collection(db, "carrito"), { ...producto, cantidad: 1 });
        }
    };

    const eliminarDelCarrito = async (productoId) => {
        const itemRef = doc(db, "carrito", productoId);
        await deleteDoc(itemRef);
    };

    const disminuirCantidad = async (productoId, cantidad) => {
        if (cantidad > 1) {
            const itemRef = doc(db, "carrito", productoId);
            await updateDoc(itemRef, { cantidad: cantidad - 1 });
        } else {
            eliminarDelCarrito(productoId);
        }
    };

    const calcularTotal = () => carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    const crearPreferencia = async () => {
        try {
            const response = await fetch('/api/createPreference', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carrito })
            });
            if (!response.ok) throw new Error('Error en la creación de la preferencia');
            const data = await response.json();
            setPreferenceId(data.preferenceId);
        } catch (error) {
            console.error("Error al crear la preferencia:", error);
        }
    };

    return (
        <div className="compras-vinos-container w-[140%] p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-5xl mx-auto relative z-10" style={{ marginLeft: '80px' }}>
            <h2 className="text-3xl font-bold mb-6 text-center text-burgundy-700">TIENDA VIN</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {productos.map((producto) => (
                    <div key={producto.id} className="producto-card bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
                        <img src={producto.imagen} alt={producto.nombre} className="w-full h-40 object-cover rounded mb-4" />
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{producto.nombre}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">Precio: ${producto.precio}</p>
                        <button
                            onClick={() => agregarAlCarrito(producto)}
                            className="bg-burgundy-700 text-white font-medium py-1 px-4 rounded-full text-sm hover:bg-burgundy-800 transition-colors duration-200"
                        >
                            Agregar
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-burgundy-700">Carrito de compras</h2>
                {carrito.length === 0 ? (
                    <p className="mt-4 text-gray-500">El carrito está vacío</p>
                ) : (
                    carrito.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2">
                            <span className="text-gray-800 dark:text-gray-200">
                                {item.nombre} (x{item.cantidad}) - ${item.precio * item.cantidad}
                            </span>
                            <div className="flex items-center">
                                <button
                                    onClick={() => disminuirCantidad(item.id, item.cantidad)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-1 px-2 rounded-l text-sm"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => agregarAlCarrito(item)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-1 px-2 rounded-r text-sm"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-1 px-3 rounded-full ml-2 text-sm"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Total: ${calcularTotal()}</span>
                    <button
                        onClick={crearPreferencia}
                        className="bg-burgundy-700 text-white font-semibold py-2 px-6 rounded hover:bg-burgundy-800 transition-colors duration-200"
                    >
                        Pagar
                    </button>
                    {preferenceId && <Wallet initialization={{ preferenceId }} />}
                </div>
            </div>
        </div>
    );
};

export default ComprasVinos;
