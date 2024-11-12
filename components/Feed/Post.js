import Image from "next/image";
import { ChatAltIcon, ThumbUpIcon, ShareIcon, TrashIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot, updateDoc, deleteDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import CommentBox from "../CommentBox/CommentBox";
import { Picker } from 'emoji-mart';

function Post({ id, name, message, email, image, timestamp, postImage }) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const postRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      if (snapshot.exists()) {
        const likesArray = Array.isArray(snapshot.data().likes) ? snapshot.data().likes : [];
        setIsLiked(likesArray.includes(session?.user.email));
      }
    });

    const commentsRef = collection(db, "posts", id, "comments");
    const q = query(commentsRef, orderBy("timestamp", "asc"));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPostComments(commentsData);
    });

    return () => {
      unsubscribe();
      unsubscribeComments();
    };
  }, [id, session]);

  const handleLike = async () => {
    if (!session) {
      alert("Por favor inicia sesión para dar like");
      return;
    }

    const postRef = doc(db, "posts", id);
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(session.user.email),
      });
      setIsLiked(false);
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(session.user.email),
      });
      setIsLiked(true);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deleteDoc(doc(db, "posts", id));
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("Por favor inicia sesión para comentar");
      return;
    }

    if (comment.trim() !== "") {
      const commentsRef = collection(db, "posts", id, "comments");
      await addDoc(commentsRef, {
        content: comment,
        reactions: { like: [], love: [], haha: [], wow: [] },
        timestamp: serverTimestamp(),
        user: session.user.email,
        points: 0
      });
      setComment("");
      setShowCommentBox(false);
      setShowEmojiPicker(false);
    }
  };

  const addEmoji = (emoji) => {
    setComment((prevComment) => prevComment + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="post-container bg-white dark:bg-gray-800 shadow-md rounded-lg mb-5 mt-4">
      {/* Contenido del Post */}
      <div className="p-5">
        <div className="flex items-center space-x-2">
          <Image className="rounded-full" src={image} width={40} height={40} alt="Foto de perfil" />
          <div>
            <p className="font-medium">{name}</p>
            {timestamp ? (
              <p className="text-xs text-gray-400">{new Date(timestamp.seconds * 1000).toLocaleString()}</p>
            ) : (
              <p className="text-xs text-gray-400">Cargando...</p>
            )}
            <p className="text-xs text-gray-400">{email}</p>
          </div>
          {session?.user?.email === email && (
            <TrashIcon 
              onClick={() => setShowConfirmDelete(true)} 
              className="h-5 cursor-pointer text-[#8B1A2B] hover:text-[#6f1121] ml-auto" 
              title="Eliminar publicación" 
            />
          )}
        </div>
        <p className="pt-4">{message}</p>
      </div>

      {postImage && (
        <div className="relative w-full h-[500px] max-h-[700px] flex items-center justify-center bg-white">
          <Image
            src={postImage}
            alt="Imagen del post"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "contain" }}
            fill
          />
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-3 border-t dark:border-gray-700">
        <div className={`inputIcon rounded-none ${isLiked ? "text-blue-500" : "dark:hover:text-gray-500"}`} onClick={handleLike}>
          <ThumbUpIcon className="h-5" />
          <p className="text-xs sm:text-base">{isLiked ? "Te gusta" : "Me gusta"}</p>
        </div>
        <div className="inputIcon rounded-none dark:hover:text-gray-500" onClick={() => setShowCommentBox(!showCommentBox)}>
          <ChatAltIcon className="h-5" />
          <p className="text-xs sm:text-base">Comentar</p>
        </div>
        <div className="inputIcon rounded-none dark:hover:text-gray-500">
          <ShareIcon className="h-5" />
          <p className="text-xs sm:text-base">Compartir</p>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
            <h2 className="text-lg font-bold text-[#8B1A2B]">Confirmación de eliminación</h2>
            <p className="text-sm text-gray-600 mt-2">¿Estás seguro de que deseas eliminar esta publicación?</p>
            <div className="flex justify-center mt-4 space-x-4">
              <button onClick={handleDeletePost} className="bg-[#8B1A2B] text-white px-4 py-2 rounded hover:bg-[#6f1121]">
                Sí, eliminar
              </button>
              <button onClick={() => setShowConfirmDelete(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="comments-section bg-white dark:bg-gray-800 rounded-b-lg">
        {postComments.map((comment) => (
          <CommentBox key={comment.id} comment={comment} postId={id} />
        ))}
      </div>

      {showCommentBox && (
        <form onSubmit={handleCommentSubmit} className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-b-lg">
          <div className="flex items-center">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="border p-2 rounded mb-2 flex-1 dark:bg-gray-600 dark:border-gray-500"
            />
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="ml-2">
              😀
            </button>
          </div>
          {showEmojiPicker && <Picker onSelect={addEmoji} />}
          <button type="submit" className="bg-blue-500 text-white py-1 px-2 rounded mt-2">Enviar</button>
        </form>
      )}
    </div>
  );
}

export default Post;
