import { Title } from '@/components';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function ProfilePage() {

    // Obtener sesión con Better Auth en Server Component (no de Prisma)
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // Protección de páginas privadas
    if (!session?.user) redirect('/auth/login');

    const { user } = session;

    return (
        <div className="profile">
            <Title title="Mi Perfil" />
            <p className="profile__subtitle">Información de tu cuenta</p>
            <div className="profile__card">
                <div className="profile__header">

                    <div className="profile__avatar">
                        {user.name?.charAt(0).toUpperCase() || 'X'}
                    </div>


                    <div className="profile__user-info">
                        <h2 className="profile__name">{user.name}</h2>
                        <p className="profile__email">{user.email}</p>
                    </div>
                </div>

                <div className="profile__details">
                    <h3 className="profile__details-title">Detalles de la cuenta</h3>

                    <div className="profile__details-grid">
                        <div className="profile__detail-item">
                            <p className="profile__detail-label">Nombre completo</p>
                            <p className="profile__detail-value">{user.name}</p>
                        </div>

                        <div className="profile__detail-item">
                            <p className="profile__detail-label">Correo electrónico</p>
                            <p className="profile__detail-value">{user.email}</p>
                        </div>

                        <div className="profile__detail-item">
                            <p className="profile__detail-label">Estado del email</p>
                            <p className="profile__detail-value">
                                {user.emailVerified ? (
                                    <span className="profile__detail-value--verified">✓ Verificado</span>
                                ) : (
                                    <span className="profile__detail-value--unverified">⚠ No verificado</span>
                                )}
                            </p>
                        </div>

                        <div className="profile__detail-item">
                            <p className="profile__detail-label">Tipo de cuenta</p>
                            <p className="profile__detail-value">{user.role}</p>
                        </div>

                        <div className="profile__detail-item">
                            <p className="profile__detail-label">ID de usuario</p>
                            <p className="profile__detail-value profile__detail-value--small">{user.id}</p>
                        </div>

                        <div className="profile__detail-item">
                            <p className="profile__detail-label">Miembro desde</p>
                            <p className="profile__detail-value">
                                {new Date(user.createdAt).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}