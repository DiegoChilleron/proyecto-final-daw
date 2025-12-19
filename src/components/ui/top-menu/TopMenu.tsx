'use client'

import Link from "next/link"
import { titleFont } from "@/config/fonts";
import { IoCartOutline } from "react-icons/io5";
import { useCartStore, useUIStore } from "@/store";
import { useEffect, useState } from "react";


export const TopMenu = () => {

    const openSideMenu = useUIStore(state => state.openSideMenu);
    const totalItemsInCart = useCartStore(state => state.getTotalItems());


    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);


    return (
        <nav className="top-menu">
            <div>
                <Link href="/">
                    <span className={`${titleFont.className} top-menu__logo`}>Generador de webs</span>
                </Link>
            </div>

            {/* Menú central */}
            <div className="top-menu__nav">
                <Link className="top-menu__nav-link" href="/templates/corporate">Corporativas</Link>
                <Link className="top-menu__nav-link" href="/templates/portfolio">Portfolios</Link>
            </div>

            {/* Busqueda, carrito, menu */}
            <div className="top-menu__actions">
                <Link href={(totalItemsInCart === 0 && loaded) ? '/empty' : '/cart'}>
                    <div className="top-menu__cart">
                        {
                            (loaded && totalItemsInCart > 0) && (
                                <span className="top-menu__cart-badge">{totalItemsInCart}</span>
                            )
                        }
                        <IoCartOutline className="top-menu__icon" />
                    </div>
                </Link>
                <button onClick={openSideMenu} className="top-menu__button">Menú</button>
            </div>
        </nav>
    )
}
