// Tipos de plantilla disponibles
export type TemplateType = 'corporate' | 'portfolio' | 'ecommerce';

// Estado del despliegue
export type DeploymentStatus = 'pending' | 'building' | 'deploying' | 'deployed' | 'failed';

// Definición de campo del formulario de configuración
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'color' | 'image' | 'url' | 'email' | 'phone' | 'select';
    required: boolean;
    placeholder?: string;
    defaultValue?: string;
    options?: string[]; // Para campos select
    description?: string;
}

// Producto = Plantilla de web
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    slug: string;
    tags: string[];
    templateType: TemplateType;
    categoryId: string;
    images: string[];

    // Campos específicos para plantillas web
    features: string[];

    category?: { id: string; name: string };
    productImages?: Array<{ url: string; id?: number; productId?: string }>;
}

// Configuración del sitio (datos del formulario del cliente)
export interface SiteConfig {

    siteName: string;
    siteDescription?: string;

    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    favicon?: string;

    email?: string;
    phone?: string;
    address?: string;

    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        github?: string;
    };

    [key: string]: unknown;
}

// Producto en el carrito (para configurar antes de comprar)
export interface CartProduct {
    id: string;
    slug: string;
    title: string;
    price: number;
    quantity: number;
    templateType: TemplateType;
    image: string;
    siteConfig: SiteConfig; // Configuración del cliente
}

export interface ProductImage {
    id: number;
    url: string;
    productId: string;
}

export type CategoryType = 'corporate' | 'portfolio';