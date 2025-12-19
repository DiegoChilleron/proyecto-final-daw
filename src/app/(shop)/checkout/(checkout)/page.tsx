import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";


export default function CheckoutPage() {
  return (
    <div className="page-container">
      <div className="page-container__inner">
        <Title title='Verificar orden' />
        <div className="page-container__grid">

          {/* Carrito */}
          <div className="page-section">
            <span className="page-section__title">Ajustar elementos</span>
            <Link href="/cart" className="page-section__link">Editar carrito</Link>

            {/* Items */}
            <ProductsInCart />
          </div>

          {/* Resumen de orden */}
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
} 