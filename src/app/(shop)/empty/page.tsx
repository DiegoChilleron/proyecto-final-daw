import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";

export default function EmptyPage() {

  return (
    <div className="empty-state">
      <IoCartOutline size={80} className="empty-state__icon" />

        <div className="empty-state__content">
          <h1 className="empty-state__title">Tu carrito está vacío</h1>

          <Link href="/" className="empty-state__link">Volver</Link>
        </div>
    </div>
  );
}