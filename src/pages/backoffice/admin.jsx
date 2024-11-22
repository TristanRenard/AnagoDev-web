import Link from "next/link"

const AdminPage = () => (
  <main className="flex flex-1">
    <aside className="flex flex-col gap-4 p-4 pr-8 border-r border-gray-200">
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/users">Utilisateurs</Link>
      <Link href="/admin/homepage">Page d'accueil</Link>
      <Link href="/admin/products">Products</Link>
      <Link href="/admin/categories">Abonnements</Link>
      <Link href="/admin/orders">Commandes</Link>
    </aside>
    <div className="flex-1 p-4">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="text-gray-700">
        mettre les stats et des raccourcis pour les actions rapides
      </p>
    </div>
  </main>
)

export default AdminPage
