
import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
    const [itemsCarrito, setItemsCarrito] = useState([]);
    

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "carrito"), (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItemsCarrito(items);
        });
        return () => unsubscribe();
    }, []);

    const agregarAlCarrito = async (producto) => {
        const itemEnCarrito = itemsCarrito.find(item => item.nombre === producto.nombre);
        if (itemEnCarrito) {
            const itemRef = doc(db, "carrito", itemEnCarrito.id);
            await updateDoc(itemRef, { cantidad: itemEnCarrito.cantidad + 1 });
        } else {
            await addDoc(collection(db, "carrito"), {
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
                imagen: producto.imagen
            });
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

    
    const totalProductos = itemsCarrito.reduce((total, item) => total + item.cantidad, 0);

    return (
        <CarritoContext.Provider value={{ itemsCarrito, agregarAlCarrito, disminuirCantidad, eliminarDelCarrito, totalProductos }}>
            {children}
        </CarritoContext.Provider>
    );
};
