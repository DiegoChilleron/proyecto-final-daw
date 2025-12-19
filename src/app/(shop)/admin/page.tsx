import { Title } from '@/components';
import Link from 'next/link';


export default async function AdminPage() {


    return (
        <div>
            <Title title="Panel de Administración" />

            <div className="admin-container">
                <Link href="/admin/users" className="btn-secondary">Usuarios</Link>
                <Link href="/admin/products" className="btn-secondary">Productos</Link>
                <Link href="/admin/orders" className="btn-secondary">Ordenes</Link>

            </div>
        </div>
    );
}