'use client';

import type { Product } from "@/interfaces";
import { useRouter } from "next/navigation";

interface Props {
    product: Product;
}

export const AddToCart = ({ product }: Props) => {

    const router = useRouter();

    const handleConfigure = () => {
        router.push(`/checkout/configure/${product.slug}`);
    }

    return (
        <>
            {/*Boton */}
            <button onClick={handleConfigure} className="btn-primary my-5">
                Configurar mi web
            </button>
        </>
    )
}
