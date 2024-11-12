import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { collection, query, orderBy } from "firebase/firestore";
import Post from "./Post";

function Posts({ posts }) {
    
    const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    const [realtimePosts, loading, error] = useCollection(postsQuery);

    if (error) {
        console.error("Error al cargar las publicaciones:", error);
        return <p>Error al cargar las publicaciones.</p>;
    }

    return (
        <div>
            {loading ? (
                <p>Cargando publicaciones...</p>
            ) : realtimePosts ? (
                realtimePosts.docs.map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        name={post.data().name}
                        message={post.data().message}
                        email={post.data().email}
                        timestamp={post.data().timestamp}
                        image={post.data().image}
                        postImage={post.data().postImage}
                        comments={post.data().comments || []}
                    />
                ))
            ) : (
                posts.map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        name={post.name}
                        message={post.message}
                        email={post.email}
                        timestamp={post.timestamp}
                        image={post.image}
                        postImage={post.postImage}
                        comments={post.comments || []}
                    />
                ))
            )}
        </div>
    );
}

export default Posts;
