import { LuMail, LuPhone, LuMapPin, LuLinkedin, LuTwitter, LuBriefcase } from "react-icons/lu";
import Image from "next/image";

// Variables de entorno
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Mi Empresa";
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "";
const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "";
const companySlogan = process.env.NEXT_PUBLIC_COMPANY_SLOGAN || siteDescription;
const aboutUs = process.env.NEXT_PUBLIC_ABOUT_US || "";
const servicesString = process.env.NEXT_PUBLIC_SERVICES || "";
const email = process.env.NEXT_PUBLIC_EMAIL || "";
const phone = process.env.NEXT_PUBLIC_PHONE || "";
const address = process.env.NEXT_PUBLIC_ADDRESS || "";
const linkedin = process.env.NEXT_PUBLIC_LINKEDIN || "";
const twitter = process.env.NEXT_PUBLIC_TWITTER || "";

// Parsear servicios
const services = servicesString.split(",").map(s => s.trim()).filter(Boolean);

export default function Home() {
  return (
    <main className="corporate">

      {/* Header */}
      <header className="header">
        <div className="header__container">
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={120} height={40} className="header__logo-img" />
          ) : (
            <span className="header__logo">{siteName}</span>
          )}
          <nav className="header__nav">
            <a href="#about" className="header__link">Nosotros</a>
            <a href="#services" className="header__link">Servicios</a>
            <a href="#contact" className="header__link">Contacto</a>
            {email && (
              <a href={`mailto:${email}`} className="header__cta">Contáctanos</a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          <h1 className="hero__title">{siteName}</h1>
          <p className="hero__subtitle">{companySlogan}</p>
          <a href="#contact" className="hero__cta">Solicitar información</a>
        </div>
      </section>

      {/* About Section */}
      {aboutUs && (
        <section id="about" className="about">
          <div className="about__container">
            <h2 className="about__title">Sobre Nosotros</h2>
            <p className="about__text">{aboutUs}</p>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section id="services" className="services">
          <div className="services__container">
            <h2 className="services__title">Nuestros Servicios</h2>
            <div className="services__grid">
              {services.map((service, index) => (
                <div key={index} className="services__item">
                  <div className="services__icon">
                    <LuBriefcase size={28} />
                  </div>
                  <h3 className="services__name">{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact__container">
          <h2 className="contact__title">Contacto</h2>

          <div className="contact__info">
            {email && (
              <a href={`mailto:${email}`} className="contact__item">
                <span className="contact__icon"><LuMail size={20} /></span>
                {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="contact__item">
                <span className="contact__icon"><LuPhone size={20} /></span>
                {phone}
              </a>
            )}
            {address && (
              <span className="contact__item">
                <span className="contact__icon"><LuMapPin size={20} /></span>
                {address}
              </span>
            )}
          </div>

          {(linkedin || twitter) && (
            <div className="contact__social">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="LinkedIn">
                  <LuLinkedin size={24} />
                </a>
              )}
              {twitter && (
                <a href={twitter} target="_blank" rel="noopener noreferrer" className="contact__social-link" aria-label="Twitter">
                  <LuTwitter size={24} />
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer__text">© {new Date().getFullYear()} {siteName}. Todos los derechos reservados.</p>
      </footer>

    </main>
  );
}
