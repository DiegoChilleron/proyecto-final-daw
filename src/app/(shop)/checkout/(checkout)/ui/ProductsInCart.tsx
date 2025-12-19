'use client';

import { useCartStore } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/utils";


export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false);

    const productsInCart = useCartStore(state => state.cart);

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) { return <p className="loading">Cargando...</p> }

    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={product.slug} className="cart-item">
                        <Image src={`/products/${product.image}`} alt={product.title} width={100} height={100} className="cart-item__image" />
                        <div className="cart-item__info">
                            <span className="cart-item__title">{product.title}</span>
                            <p className="cart-item__config">{product.siteConfig?.siteName || 'Sin configurar'}</p>
                            <p className="cart-item__subtotal">{currencyFormat(product.price * product.quantity)}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
