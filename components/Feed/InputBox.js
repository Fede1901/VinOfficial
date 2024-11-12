import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import { db, storage } from "../../firebase";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

function InputBox() {
    const { data: session } = useSession();
    const inputRef = useRef(null);
    const filepickerRef = useRef(null);
    const [imageToPost, setImageToPost] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const addEmoji = (emoji) => {
        if (inputRef.current) {
            const start = inputRef.current.selectionStart;
            const end = inputRef.current.selectionEnd;
            const text = inputRef.current.value;
            inputRef.current.value = text.slice(0, start) + emoji.native + text.slice(end);
            inputRef.current.setSelectionRange(start + emoji.native.length, start + emoji.native.length);
            inputRef.current.focus();
        }
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

    const sendPost = async (e) => {
        e.preventDefault();

        if (!inputRef.current.value || !session) return;

        try {
            const docRef = await addDoc(collection(db, "posts"), {
                message: inputRef.current.value,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
                timestamp: serverTimestamp(),
            });

            if (imageToPost) {
                const imageRef = ref(storage, `posts/${docRef.id}`);
                await uploadString(imageRef, imageToPost, "data_url");

                
                const url = await getDownloadURL(imageRef);
                console.log("URL de la imagen subida:", url); 

                
                await updateDoc(doc(db, "posts", docRef.id), { postImage: url });
                removeImage();
            }

            
            inputRef.current.value = "";
        } catch (error) {
            console.error("Error al enviar la publicación:", error);
        }
    };

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            setImageToPost(readerEvent.target.result);
        };
    };

    const removeImage = () => setImageToPost(null);

    if (!session) return null;

    return (
        <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6 dark:bg-gray-800 dark:text-white">
            <div className="flex space-x-4 p-4 items-center">
                <Image 
                    className="rounded-full"
                    src={session.user.image}
                    width={40}
                    height={40}
                    alt="Perfil"
                />
                <form className="flex flex-1">
                    <input 
                        className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none dark:hover:text-gray-500"
                        type="text" 
                        ref={inputRef}
                        placeholder={`Comparte con la comunidad de Vin tu reseña, ${session.user.name}`} 
                    />
                    <button hidden type="submit" onClick={sendPost}>Enviar</button>
                </form>

                {imageToPost && (
                    <div onClick={removeImage} className="flex flex-col cursor-pointer transition duration-150 hover:brightness-110 transform hover:scale-105">
                        <Image className="h-10 object-contain" src={imageToPost} alt="Imagen añadida" width={40} height={40} />
                        <p className="text-xs text-red-500 text-center">Quitar</p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-evenly p-3 border-t relative">
                <div className="inputIcon dark:hover:text-gray-500" onClick={() => alert("Transmisión en vivo iniciada (Funcionalidad a implementar).")}>
                    <VideoCameraIcon className="h-7 text-red-500" />
                    <p className="text-xs sm:text-sm xl:text-base">En VIVO</p>
                </div>
                
                <div onClick={() => filepickerRef.current.click()} className="inputIcon dark:hover:text-gray-500">
                    <CameraIcon className="h-7 text-green-400" />
                    <p className="text-xs sm:text-sm xl:text-base">Foto/Video</p>
                    <input ref={filepickerRef} hidden type="file" onChange={addImageToPost} />
                </div>
                
                <div className="inputIcon dark:hover:text-gray-500" onClick={toggleEmojiPicker}>
                    <EmojiHappyIcon className="h-7 text-yellow-300" />
                    <p className="text-xs sm:text-sm xl:text-base">Reacción</p>
                </div>
                
                {showEmojiPicker && (
                    <div className="absolute bottom-12 right-10 z-50 bg-white p-2 rounded-md shadow-md">
                        <Picker onSelect={addEmoji} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default InputBox;
