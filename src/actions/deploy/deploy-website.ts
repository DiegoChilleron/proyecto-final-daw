'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { DeployResult } from './types';
import { generateSubdomain } from './subdomain-generator';
import { updateDeploymentStatus, markDeploymentFailed } from './deployment-status';
import {
    findTemplateSource,
    prepareBuildDirectory,
    configureEnvironment,
    buildProject,
    getOutputDirectory
} from './template-builder';
import { uploadDirToS3, generateDeploymentUrl } from './s3-client';

export async function deployWebsite(orderItemId: string): Promise<DeployResult> {
    try {
        const orderItem = await prisma.orderItem.findUnique({
            where: { id: orderItemId },
            include: { product: true, order: true },
        });

        if (!orderItem) {
            return { ok: false, message: 'OrderItem no encontrado' };
        }

        if (!orderItem.order.isPaid) {
            return { ok: false, message: 'El pedido no está pagado' };
        }

        const siteConfig = orderItem.siteConfig as Record<string, unknown>;
        const templateType = orderItem.product.templateType;
        const templateSlug = orderItem.product.slug;

        const subdomain = generateSubdomain(
            (siteConfig.siteName as string) || orderItem.product.title,
            orderItem.id
        );

        const sourceDir = await findTemplateSource(templateType, templateSlug);
        if (!sourceDir) {
            await markDeploymentFailed(orderItemId);
            return { ok: false, message: `No se encontró template para ${templateType}` };
        }

        const buildDir = await prepareBuildDirectory(sourceDir, subdomain);
        await configureEnvironment(buildDir, siteConfig);
        await buildProject(buildDir);

        const outDir = await getOutputDirectory(buildDir);
        if (!outDir) {
            await markDeploymentFailed(orderItemId);
            return { ok: false, message: 'No se generó el directorio de salida estático' };
        }

        await uploadDirToS3(outDir, subdomain);
        const finalUrl = generateDeploymentUrl(subdomain);
        await updateDeploymentStatus(orderItemId, 'deployed', finalUrl, subdomain);

        try { revalidatePath(`/orders/${orderItem.orderId}`); } catch { /* */ }

        return { ok: true, message: 'Web desplegada correctamente', deploymentUrl: finalUrl };

    } catch (error) {
        await markDeploymentFailed(orderItemId);
        return {
            ok: false,
            message: `Error en el despliegue: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        };
    }
}

export async function deployOrderWebsites(orderId: string): Promise<DeployResult[]> {
    const orderItems = await prisma.orderItem.findMany({ where: { orderId } });
    const results: DeployResult[] = [];

    for (const item of orderItems) {
        results.push(await deployWebsite(item.id));
    }

    return results;
}
