import Link from "next/link";
import { IoCloudDone, IoTime, IoWarning } from "react-icons/io5";

interface Props {
    status: string;
    deploymentUrl?: string | null;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; modifierClass: string }> = {
    pending: {
        label: 'Pendiente',
        icon: <IoTime className="deployment-badge__icon" />,
        modifierClass: 'deployment-badge__status--pending',
    },
    deployed: {
        label: 'Desplegado',
        icon: <IoCloudDone className="deployment-badge__icon" />,
        modifierClass: 'deployment-badge__status--deployed',
    },
    failed: {
        label: 'Error en despliegue',
        icon: <IoWarning className="deployment-badge__icon" />,
        modifierClass: 'deployment-badge__status--failed',
    },
};

export const DeploymentStatusBadge = ({ status, deploymentUrl }: Props) => {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <div className="deployment-badge">
            <div className={`deployment-badge__status ${config.modifierClass}`}>
                {config.icon}
                {config.label}
            </div>
            
            {status === 'deployed' && deploymentUrl && (
                <Link href={deploymentUrl} target="_blank" className="deployment-badge__link">Ver mi web</Link>
            )}
        </div>
    );
};
