'use client';

import { useAddressStore, useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/utils";
import { clsx } from "clsx";
import { placeOrder } from "@/actions";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

export const PlaceOrder = () => {

    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const address = useAddressStore((state) => state.address);

    const { itemsInCart, subTotal, tax, total } = useCartStore(useShallow((state) => state.getSummaryInformation()));

    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true);
        // await sleep(2);

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            siteConfig: product.siteConfig,
        }));

        const resp = await placeOrder(productsToOrder, address);
        if (!resp.ok) {
            setIsPlacingOrder(false);
            setErrorMessage(resp.message);
            return;
        }

        // Todo salió bien
        clearCart();
        router.replace('/orders/' + resp.order?.id);

    };

    if (!loaded) return (<p className="loading">Cargando....</p>);

    return (
        <div className="card">
            <h2 className="card__title">Dirección de facturación</h2>
            <div className="card__content">
                <p className="page-section__title">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            <div className="card__divider"></div>
            <h2 className="card__title">Resumen de orden</h2>
            <div className="order-summary">

                <span className="order-summary__label">No. Productos</span>
                <span className="order-summary__value">{itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}</span>

                <span className="order-summary__label">Subtotal</span>
                <span className="order-summary__value">{currencyFormat(subTotal)}</span>


                <span className="order-summary__label">Impuestos (21%)</span>
                <span className="order-summary__value">{currencyFormat(tax)}</span>

                <span className="order-summary__total-label">Total:</span>
                <span className="order-summary__total-value">{currencyFormat(total)}</span>

            </div>

            <div className="card__footer">
                <p className="checkout-terms">
                    <span className="checkout-terms__text">
                        Al hacer clic en "Confirmar orden", acepta nuestros <a href="#" className="checkout-terms__link">términos y condiciones</a> y <a href="#" className="checkout-terms__link">política de privacidad</a>.
                    </span>
                </p>

                <button className="checkout-error">{errorMessage}</button>

                <button onClick={onPlaceOrder} className={
                    clsx({
                        'btn-primary': !isPlacingOrder,
                        'btn-disabled': isPlacingOrder,
                    })
                }
                >Confirmar orden</button>
            </div>
        </div>
    )
}
