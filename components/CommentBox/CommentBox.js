import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";
import { ThumbUpIcon, HeartIcon, EmojiHappyIcon, SparklesIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";

function CommentBox({ comment, postId }) {
  const { data: session } = useSession();
  const [reactions, setReactions] = useState(comment?.reactions || {}); 
  const [points, setPoints] = useState(comment?.points || 0);

  useEffect(() => {
   
    if (!comment?.id) {
      console.error("ID de comentario no disponible");
      return;
    }

    const commentRef = doc(db, "posts", postId, "comments", comment.id);
    const unsubscribe = onSnapshot(commentRef, (doc) => {
      if (doc.exists()) {
        setReactions(doc.data().reactions || {});
        setPoints(doc.data().points || 0);
      } else {
        console.error("Documento de comentario no encontrado");
      }
    });
    return () => unsubscribe();
  }, [postId, comment?.id]);

  const handleReaction = async (reactionType) => {
    if (!session) {
      console.error("El usuario no está autenticado");
      return;
    }

    const userHasReacted = Array.isArray(reactions[reactionType]) && reactions[reactionType].includes(session.user.email);

    if (userHasReacted) {
      console.log(`El usuario ya ha reaccionado con ${reactionType}`);
      return;
    }

    try {
      const commentRef = doc(db, "posts", postId, "comments", comment.id);
      const updatedReactions = {
        ...reactions,
        [reactionType]: [...(reactions[reactionType] || []), session.user.email]
      };

      await updateDoc(commentRef, {
        reactions: updatedReactions,
        points: points + 10
      });

      setReactions(updatedReactions);
      setPoints(points + 10);
    } catch (error) {
      console.error("Error al actualizar la reacción en Firestore:", error);
    }
  };

  return (
    <div className="p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <p>{comment?.content || "Contenido no disponible"}</p>
      <p className="text-xs text-gray-500">Puntos: {points}</p>
      <div className="flex space-x-4 mt-2">
        <button onClick={() => handleReaction("like")}>
          <ThumbUpIcon className="h-5 w-5 text-blue-500" />
        </button>
        <button onClick={() => handleReaction("love")}>
          <HeartIcon className="h-5 w-5 text-red-500" />
        </button>
        <button onClick={() => handleReaction("haha")}>
          <EmojiHappyIcon className="h-5 w-5 text-yellow-500" />
        </button>
        <button onClick={() => handleReaction("wow")}>
          <SparklesIcon className="h-5 w-5 text-purple-500" />
        </button>
      </div>
    </div>
  );
}

export default CommentBox;
