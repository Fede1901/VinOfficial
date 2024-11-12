import { useState, useEffect } from "react";
import { db, collection, getDocs } from '../firebase';
import Layout from '../components/Layouts/Layouts';

function Premios() {
    const [ranking, setRanking] = useState([]);
    const [showGame, setShowGame] = useState(false);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const usersRef = collection(db, "users");
                const reviewsRef = collection(db, "reviews");

                
                const userScores = {};
                const reviewsSnapshot = await getDocs(reviewsRef);
                reviewsSnapshot.forEach((doc) => {
                    const review = doc.data();
                    const { userId, points } = review;

                    if (!userScores[userId]) {
                        userScores[userId] = 0;
                    }
                    userScores[userId] += points;
                });

                const sortedScores = Object.keys(userScores)
                    .map((userId) => ({
                        userId,
                        points: userScores[userId],
                    }))
                    .sort((a, b) => b.points - a.points)
                    .slice(0, 10);

                const usersSnapshot = await getDocs(usersRef);
                const usersData = {};
                usersSnapshot.forEach((doc) => {
                    const user = doc.data();
                    usersData[doc.id] = user.username;
                });

                const rankingWithNames = sortedScores.map((user) => ({
                    username: usersData[user.userId] || "Usuario desconocido",
                    points: user.points,
                }));

                if (rankingWithNames.length > 0) {
                    setRanking(rankingWithNames);
                } else {
                 
                    setRanking([
                        { username: "Carlos Mendoza", points: 1500 },
                        { username: "Lucía González", points: 1450 },
                        { username: "Santiago Ramírez", points: 1380 },
                        { username: "Marta López", points: 1340 },
                       
                    ]);
                }
            } catch (error) {
                console.error("Error al obtener el ranking:", error);
            }
        };

        fetchRanking();
    }, []);

    const toggleGame = () => {
        setShowGame((prev) => !prev);
    };

    return (
        <Layout>
            <div className="p-8 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white rounded-lg shadow-lg max-w-2xl mx-auto mt-10 transform transition-transform duration-500 hover:scale-105">
                <h1 className="text-4xl font-extrabold text-center mb-6">Ranking de mejores reseñas</h1>
                <p className="text-center text-blue-100 mb-8">
                    Los usuarios con las mejores reseñas podrán participar por premios exclusivos.
                </p>
                <ul className="space-y-4">
                    {ranking.map((user, index) => (
                        <li
                            key={user.username}
                            className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                                index === 0 ? "bg-blue-300 text-blue-900" : "bg-blue-50 text-blue-800"
                            }`}
                        >
                            <span className="font-semibold text-lg">
                                {index + 1}. {user.username}
                            </span>
                            <span className="text-blue-600 font-medium">{user.points} puntos</span>
                        </li>
                    ))}
                </ul>
                <div className="text-center mt-8">
                    <button
                        onClick={toggleGame}
                        className="px-6 py-2 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-lg shadow-lg transform transition-transform hover:scale-105"
                    >
                     {showGame ? "🤭 Ocultar" : "😲 Mostrar"}

                    </button>
                </div>
                {showGame && (
                    <div className="mt-6 flex justify-center items-center">
                        <div className="bg-blue-200 p-4 rounded-lg shadow-lg animate-bounce text-center text-blue-900">
                            🎉 ¡Felicitaciones a los mejores! 🎉
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Premios;
