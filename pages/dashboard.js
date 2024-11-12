import withAuth from '../components/withAuth/withAuth';

function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-lg">Contenido solo para usuarios autenticados.</p>
        </div>
    );
}

export default withAuth(Dashboard);
