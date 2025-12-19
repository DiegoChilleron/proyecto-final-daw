'use client';

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import Link from "next/link";


export const ProductsInCart = () => {

    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProduct = useCartStore(state => state.removeProduct);

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
                        <ProductImage src={product.image} alt={product.title} width={100} height={100} className="cart-item__image" />
                        <div className="cart-item__info">
                            <Link className="cart-item__title cart-item__title--link" href={`/product/${product.slug}`}>{product.title}</Link>
                            <p>{product.price} €</p>
                            <QuantitySelector quantity={product.quantity} onQuantityChanged={quantity => updateProductQuantity(product, quantity)} />
                            <button onClick={() => removeProduct(product)} className="cart-item__remove">Eliminar</button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
