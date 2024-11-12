import { useSession } from "next-auth/react";
import Login from "../components/Login/Login";
import Layout from "../components/Layouts/Layouts";
import Feed from "../components/Feed/Feed";

export default function Home() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="flex items-center justify-center h-screen">Cargando...</div>;
    }

    if (!session) return <Login />;

    return (
        <Layout>
            <Feed />
        </Layout>
    );
}
