import { LuGithub, LuLinkedin, LuMail, LuPhone, LuDownload } from "react-icons/lu";

// Variables de entorno
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Mi Portfolio";
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "";
const fullName = process.env.NEXT_PUBLIC_FULLNAME || siteName;
const profession = process.env.NEXT_PUBLIC_PROFESSION || "Profesional";
const bio = process.env.NEXT_PUBLIC_BIO || "";
const skillsString = process.env.NEXT_PUBLIC_SKILLS || "";
const email = process.env.NEXT_PUBLIC_EMAIL || "";
const phone = process.env.NEXT_PUBLIC_PHONE || "";
const github = process.env.NEXT_PUBLIC_GITHUB || "";
const linkedin = process.env.NEXT_PUBLIC_LINKEDIN || "";
const cvUrl = process.env.NEXT_PUBLIC_CVURL || "";

// Parsear skills
const skills = skillsString.split(",").map(s => s.trim()).filter(Boolean);

// Obtener iniciales para el avatar
const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

export default function Home() {
  return (
    <main className="portfolio">
      <div className="portfolio__container">

        {/* Hero Section */}
        <section className="hero">
          <div className="hero__avatar">
            {getInitials(fullName)}
          </div>
          <h1 className="hero__name">{fullName}</h1>
          <p className="hero__profession">{profession}</p>
          <p className="hero__bio">{bio || siteDescription}</p>

          {/* Social Links */}
          <div className="hero__social">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="GitHub">
                <LuGithub size={24} />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="LinkedIn">
                <LuLinkedin size={24} />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="hero__social-link" aria-label="Email">
                <LuMail size={24} />
              </a>
            )}
          </div>
        </section>

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="skills">
            <h2 className="skills__title">Habilidades</h2>
            <div className="skills__grid">
              {skills.map((skill, index) => (
                <span key={index} className="skills__item">{skill}</span>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="contact">
          <h2 className="contact__title">¿Hablamos?</h2>
          <p className="contact__text">Estoy disponible para nuevos proyectos y colaboraciones.</p>

          <div className="contact__links">
            {email && (
              <a href={`mailto:${email}`} className="contact__link contact__link--primary">
                <LuMail size={20} />
                {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="contact__link">
                <LuPhone size={20} />
                {phone}
              </a>
            )}
            {cvUrl && (
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="contact__link">
                <LuDownload size={20} />
                Descargar CV
              </a>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} {fullName}. Todos los derechos reservados.</p>
        </footer>

      </div>
    </main>
  );
}
