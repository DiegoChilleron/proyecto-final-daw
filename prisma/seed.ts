import { PrismaClient, Prisma } from "../generated/prisma/client";
import { initialData } from '../src/seed/initialData';
import { countries } from '../src/seed/seed-countries';
import { PrismaPg } from '@prisma/adapter-pg'
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import 'dotenv/config'

const scryptAsync = promisify(scrypt);

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
    adapter,
});

const categoriesData: Prisma.CategoryCreateInput[] = initialData.categories.map(
    (category) => ({
        name: category,
    })
);

const productData: Prisma.ProductCreateInput[] = initialData.products.map(
    (product) => ({
        title: product.title,
        description: product.description,
        price: product.price,
        slug: product.slug,
        tags: product.tags,
        templateType: product.templateType,
        features: product.features,
        category: {
            connectOrCreate: {
                where: { name: product.type },
                create: { name: product.type },
            },
        },
        productImages: {
            create: product.images.map((image) => ({ url: image })),
        },
    })
);

// Hashear contraseñas con scrypt (igual que Better Auth)
async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

export async function main() {
    try {
        // Limpiar datos existentes
        await prisma.orderAddress.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.userAddress.deleteMany();
        await prisma.account.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
        await prisma.productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.country.deleteMany();

        // Insertar países
        await prisma.country.createMany({ data: countries });

        // Insertar categorías
        await prisma.category.createMany({ data: categoriesData });

        // Insertar productos
        const createdProducts: Record<string, string> = {};
        for (const product of productData) {
            const created = await prisma.product.create({ data: product });
            createdProducts[created.slug] = created.id;
        }

        // Insertar usuarios con contraseñas hasheadas
        const createdUsers: Record<string, string> = {};
        for (const user of initialData.users) {
            const hashedPassword = await hashPassword(user.password);

            const createdUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: user.role,
                    image: user.image,
                    emailVerified: true,
                }
            });

            createdUsers[user.email] = createdUser.id;

            // Crear cuenta credential (requerido por Better Auth)
            await prisma.account.create({
                data: {
                    userId: createdUser.id,
                    accountId: createdUser.id,
                    providerId: 'credential',
                    password: hashedPassword,
                }
            });
        }

        // Insertar pedidos
        for (const order of initialData.orders) {
            const userId = createdUsers[order.userEmail];
            if (!userId) continue;

            const createdOrder = await prisma.order.create({
                data: {
                    userId,
                    subTotal: order.subTotal,
                    tax: order.tax,
                    total: order.total,
                    itemsInOrder: order.items.length,
                    isPaid: order.isPaid,
                    paidAt: order.isPaid ? new Date() : null,
                }
            });

            // Crear dirección del pedido
            await prisma.orderAddress.create({
                data: {
                    orderId: createdOrder.id,
                    firstName: order.address.firstName,
                    lastName: order.address.lastName,
                    address: order.address.address,
                    address2: order.address.address2,
                    postalCode: order.address.postalCode,
                    city: order.address.city,
                    phone: order.address.phone,
                    countryId: order.address.countryId,
                }
            });

            // Crear items del pedido
            for (const item of order.items) {
                const productId = createdProducts[item.productSlug];
                if (!productId) continue;

                await prisma.orderItem.create({
                    data: {
                        orderId: createdOrder.id,
                        productId,
                        quantity: item.quantity,
                        price: item.price,
                        siteConfig: item.siteConfig as Prisma.InputJsonValue,
                        deploymentStatus: item.deploymentStatus as 'pending' | 'deployed' | 'failed',
                        deploymentUrl: item.deploymentUrl,
                        subdomain: item.subdomain,
                        deployedAt: item.deploymentStatus === 'deployed' ? new Date() : null,
                    }
                });
            }
        }

        console.log('Seed ejecutado correctamente');
        console.log('\nUsuarios creados:');
        initialData.users.forEach(user => {
            console.log(`   - ${user.email} (${user.role}) - Password: ${user.password}`);
        });
        console.log(`\nPedidos creados: ${initialData.orders.length}`);

    } catch (error) {
        console.log('Error al ejecutar el seed:', error);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });