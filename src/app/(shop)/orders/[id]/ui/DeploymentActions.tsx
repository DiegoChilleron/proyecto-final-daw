'use client';

import { useState } from "react";
import { IoTrash } from "react-icons/io5";
import { deleteDeployment } from "@/actions";
import { useRouter } from "next/navigation";

interface Props {
    orderItemId: string;
    status: string;
    isPaid: boolean;
}

export const DeploymentActions = ({ orderItemId, status, isPaid }: Props) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar este despliegue? Esta acción no se puede deshacer.')) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        const result = await deleteDeployment(orderItemId);
        
        setIsDeleting(false);

        if (!result.ok) {
            setError(result.message);
            return;
        }

        router.refresh();
    };

    // Solo mostrar acciones si la orden está pagada y está desplegado
    if (!isPaid || status !== 'deployed') return null;

    return (
        <div className="deployment-actions">
            {error && (
                <p className="deployment-actions__error">{error}</p>
            )}

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="deployment-actions__button deployment-actions__button--delete"
            >
                <IoTrash className={`deployment-actions__icon ${isDeleting ? 'deployment-actions__icon--loading' : ''}`} />
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
        </div>
    );
};
