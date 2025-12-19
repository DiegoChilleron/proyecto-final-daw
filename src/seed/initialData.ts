import { TemplateType, DeploymentStatus } from '@/interfaces';

interface SeedProduct {
    description: string;
    images: string[];
    price: number;
    slug: string;
    tags: string[];
    title: string;
    type: ValidTypes;
    templateType: TemplateType;
    features: string[];
}

interface SeedUser {
    name: string;
    email: string;
    password: string;
    role: 'Admin' | 'User';
    image?: string;
}

interface SeedOrderItem {
    productSlug: string;
    quantity: number;
    price: number;
    siteConfig: Record<string, unknown>;
    deploymentStatus: DeploymentStatus;
    deploymentUrl?: string;
    subdomain?: string;
}

interface SeedOrder {
    userEmail: string;
    isPaid: boolean;
    subTotal: number;
    tax: number;
    total: number;
    items: SeedOrderItem[];
    address: {
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        city: string;
        phone: string;
        countryId: string;
    };
}

type ValidTypes = 'corporate' | 'portfolio';

interface SeedData {
    users: SeedUser[];
    categories: ValidTypes[];
    products: SeedProduct[];
    orders: SeedOrder[];
}

export const initialData: SeedData = {

    users: [
        {
            name: 'Diego Chilleron',
            email: 'diegochmu@gmail.com',
            password: 'Admin123!',
            role: 'Admin',
            image: 'https://i.pravatar.cc/150?img=1'
        },
        {
            name: 'Miriam Martinez',
            email: 'miriam@example.com',
            password: 'User123!',
            role: 'User',
            image: 'https://i.pravatar.cc/150?img=2'
        }
    ],

    categories: ['corporate', 'portfolio'],

    products: [
        {
            title: 'Web Corporativa Profesional',
            description: 'Plantilla minimalista y profesional para empresas. Diseño moderno y totalmente responsive.',
            images: [
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765741224/corporate_znpqfc.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765741228/corporate_2_wktnnp.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765741440/corporate_3_mawyo9.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765741449/corporate_4_b1shtt.webp'
            ],
            price: 249,
            slug: 'corporativa-profesional',
            type: 'corporate',
            templateType: 'corporate',
            tags: ['empresa', 'profesional', 'servicios', 'responsive'],
            features: [
                'Diseño responsive',
                'Optimizado para SEO',
                'Formulario de contacto',
                'Sección de servicios',
                'Velocidad de carga optimizada'
            ]
        },
        {
            title: 'Web Corporativa Starter',
            description: 'Plantilla sencilla y efectiva para pequeñas empresas y autónomos.',
            images: [
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765741449/corporate_4_b1shtt.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765741440/corporate_3_mawyo9.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765741228/corporate_2_wktnnp.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765741224/corporate_znpqfc.webp'
            ],
            price: 199,
            slug: 'corporativa-starter',
            type: 'corporate',
            templateType: 'corporate',
            tags: ['empresa', 'pyme', 'autónomo', 'sencilla'],
            features: [
                'Diseño responsive',
                'Página única (one-page)',
                'Formulario de contacto',
                'Sección de servicios',
                'Optimizado para SEO'
            ]
        },
        {
            title: 'Portfolio Creativo',
            description: 'Plantilla moderna para diseñadores y artistas.',
            images: [
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765738829/portfolio_creativo_lfr6wr.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765739780/portfolio_creativo_2_gbfmvf.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765739787/portfolio_creativo_3_gtae42.webp'
            ],
            price: 149,
            slug: 'portfolio-creativo',
            type: 'portfolio',
            templateType: 'portfolio',
            tags: ['diseñador', 'artista', 'creativo', 'galería'],
            features: [
                'Galería de proyectos interactiva',
                'Animaciones',
                'Modo oscuro/claro',
                'Sección de habilidades',
                'Diseño responsive'
            ]
        },
        {
            title: 'Portfolio Developer',
            description: 'Plantilla minimalista para desarrolladores. Muestra tus proyectos de GitHub, stack tecnológico y experiencia.',
            images: [
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765739787/portfolio_creativo_3_gtae42.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765739780/portfolio_creativo_2_gbfmvf.webp',
                'https://res.cloudinary.com/dvworstwr/image/upload/v1765738829/portfolio_creativo_lfr6wr.webp'
            ],
            price: 149,
            slug: 'portfolio-developer',
            type: 'portfolio',
            templateType: 'portfolio',
            tags: ['desarrollador', 'programador', 'github', 'tech'],
            features: [
                'Sección de stack tecnológico',
                'Animaciones',
                'Diseño responsive'
            ]
        },
    ],

    orders: [
        // Pedido 1: Web corporativa pagada y desplegada
        {
            userEmail: 'miriam@example.com',
            isPaid: true,
            subTotal: 299,
            tax: 62.79,
            total: 361.79,
            items: [
                {
                    productSlug: 'web-corporativa-profesional',
                    quantity: 1,
                    price: 299,
                    siteConfig: {
                        siteName: 'Clínica Dental Sonrisa',
                        siteDescription: 'Tu clínica dental de confianza en Elche',
                        primaryColor: '#2563EB',
                        secondaryColor: '#1E40AF',
                        email: 'info@clinicasonrisa.es',
                        phone: '+34 965 123 456',
                        address: 'Calle Mayor 15, Elche',
                        companySlogan: 'Tu sonrisa, nuestra prioridad',
                        aboutUs: 'Somos una clínica dental familiar con más de 20 años de experiencia en Elche.',
                        services: 'Ortodoncia, Implantes, Blanqueamiento, Limpieza dental',
                        socialLinks: {
                            linkedin: 'https://linkedin.com/company/clinicasonrisa',
                            twitter: 'https://twitter.com/clinicasonrisa'
                        }
                    },
                    deploymentStatus: 'deployed',
                    deploymentUrl: 'https://clinica-sonrisa-abc12345.miswebs.com',
                    subdomain: 'clinica-sonrisa-abc12345'
                }
            ],
            address: {
                firstName: 'Miriam',
                lastName: 'Martinez',
                address: 'Calle Principal 42',
                postalCode: '03201',
                city: 'Elche',
                phone: '+34 600 123 456',
                countryId: 'ES'
            }
        },

        // Pedido 2: Portfolio pendiente de despliegue
        {
            userEmail: 'miriam@example.com',
            isPaid: true,
            subTotal: 179,
            tax: 37.59,
            total: 216.59,
            items: [
                {
                    productSlug: 'portfolio-developer',
                    quantity: 1,
                    price: 179,
                    siteConfig: {
                        siteName: 'Carlos Dev',
                        siteDescription: 'Desarrollador Full Stack especializado en React y Node.js',
                        primaryColor: '#10B981',
                        secondaryColor: '#059669',
                        email: 'carlos@carlosdev.es',
                        fullName: 'Carlos García López',
                        profession: 'Desarrollador Full Stack',
                        bio: 'Desarrollador con 5 años de experiencia creando aplicaciones web modernas.',
                        skills: 'React, Node.js, TypeScript, PostgreSQL, Docker, AWS',
                        socialLinks: {
                            github: 'https://github.com/carlosdev',
                            linkedin: 'https://linkedin.com/in/carlosdev'
                        }
                    },
                    deploymentStatus: 'pending'
                }
            ],
            address: {
                firstName: 'Miriam',
                lastName: 'Martinez',
                address: 'Calle Principal 42',
                postalCode: '03201',
                city: 'Elche',
                phone: '+34 600 123 456',
                countryId: 'ES'
            }
        },

        // Pedido 3: No pagado
        {
            userEmail: 'diegochmu@gmail.com',
            isPaid: false,
            subTotal: 199,
            tax: 41.79,
            total: 240.79,
            items: [
                {
                    productSlug: 'portfolio-creativo',
                    quantity: 1,
                    price: 199,
                    siteConfig: {
                        siteName: 'Ana Diseño',
                        siteDescription: 'Diseñadora gráfica freelance',
                        primaryColor: '#EC4899',
                        secondaryColor: '#DB2777',
                        email: 'ana@anadiseno.es',
                        fullName: 'Ana López Ruiz',
                        profession: 'Diseñadora Gráfica',
                        bio: 'Diseñadora freelance especializada en branding e identidad visual.',
                        skills: 'Illustrator, Photoshop, Figma, After Effects'
                    },
                    deploymentStatus: 'pending'
                }
            ],
            address: {
                firstName: 'Diego',
                lastName: 'Chilleron',
                address: 'Avenida de la Libertad 100',
                postalCode: '03202',
                city: 'Elche',
                phone: '+34 600 654 321',
                countryId: 'ES'
            }
        }
    ]
};
