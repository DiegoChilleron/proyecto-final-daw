'use client';

import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/utils";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

export const OrderSummary = () => {

    const router = useRouter();

    const [loaded, setLoaded] = useState(false);
    const { itemsInCart, subTotal, tax, total } = useCartStore(useShallow((state) => state.getSummaryInformation()));

    useEffect(() => {
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (itemsInCart === 0 && loaded === true) { router.replace('/empty') }
    }, [itemsInCart, loaded, router])

    if (!loaded) return <p className="loading">Cargando...</p>;


    return (
        <>
            <span className="order-summary__label">No. Productos</span>
            <span className="order-summary__value">{itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}</span>

            <span className="order-summary__label">Subtotal</span>
            <span className="order-summary__value">{currencyFormat(subTotal)}</span>


            <span className="order-summary__label">Impuestos (21%)</span>
            <span className="order-summary__value">{currencyFormat(tax)}</span>

            <span className="order-summary__total-label">Total:</span>
            <span className="order-summary__total-value">{currencyFormat(total)}</span>
        </>
    )
}
