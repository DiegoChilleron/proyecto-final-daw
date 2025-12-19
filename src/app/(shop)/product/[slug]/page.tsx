export const revalidate = 10080; // 7 days

import { notFound } from "next/navigation";
import { titleFont } from "@/config/fonts";
import { ProductSlideshow, ProductMobileSlideshow } from "@/components";
import { getProductBySlug } from "@/actions";
import { Metadata, ResolvingMetadata } from "next";
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {

  const slug = (await params).slug
  const product = await getProductBySlug(slug);

  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? 'Descripción no disponible',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? 'Descripción no disponible',
      // la imagen debe ser una URL absoluta
      images: [`/products/${product?.images[1]}`],
    }
  }
}


export default async function ProductBySlugPage({ params }: Props) {

  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="product-detail">

      {/* Slider de imagenes */}
      <div className="product-detail__gallery">

        <ProductMobileSlideshow title={product.title} images={product.images} className="block md:hidden" />
        <ProductSlideshow title={product.title} images={product.images} className="hidden md:block" />

      </div>

      {/* Detalles del producto */}
      <div className="product-detail__info">
        <h1 className={`${titleFont.className} product-detail__title`}>{product.title}</h1>
        <p className="product-detail__price">{product.price} €</p>

        <AddToCart product={product} />

        {/* Descripción */}
        <h3 className="product-detail__description-title">Descripción</h3>
        <p className="product-detail__description">{product.description}</p>
      </div>
    </div>
  );
}