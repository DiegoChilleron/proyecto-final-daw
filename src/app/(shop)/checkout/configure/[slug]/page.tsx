import { getProductBySlug } from "@/actions";
import { notFound } from "next/navigation";
import { ConfigureForm } from "./ui/ConfigureForm";
import { titleFont } from "@/config/fonts";
import { ProductImage } from "@/components";
import { Metadata } from "next";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    return {
        title: `Configurar ${product?.title ?? 'Plantilla'}`,
        description: `Personaliza tu plantilla ${product?.title}`,
    }
}

export default async function ConfigurePage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    return (
        <div className="configure-page">

            <h1 className={`${titleFont.className} configure-page__title`}>Configura tu plantilla</h1>
            <p className="configure-page__subtitle">Personaliza los datos de tu sitio web.</p>

            <div className="configure-page__grid">
                {/* Información del producto */}
                <div className="configure-sidebar">
                    <div className="configure-sidebar__card">

                        <ProductImage src={product.images[0]} alt={product.title} width={400} height={300} className="configure-sidebar__image" />
                        <h2 className="configure-sidebar__title">{product.title}</h2>
                        <p className="configure-sidebar__description">{product.description}</p>

                        <div className="configure-sidebar__price-section">
                            <p className="configure-sidebar__price">{product.price} €</p>
                            <p className="configure-sidebar__price-note">Pago único</p>
                        </div>
                        
                    </div>
                </div>

                {/* Formulario de configuración */}
                <div className="configure-form-container">
                    <ConfigureForm product={product} />
                </div>
            </div>
        </div>
    );
}
