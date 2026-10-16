import { useEffect, useState, type ReactNode, type SVGProps } from "react"

type IconName = "arrow" | "bell" | "campaign" | "cases" | "check" | "cruz" | "heart" | "location" | "network" | "search" | "vet"

function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    campaign: (
      <>
        <path d="m3 11 15-6v14L3 13v-2Z" />
        <path d="M11.5 16.5 13 21H8l-1.5-6" />
        <path d="M21 9v6" />
      </>
    ),
    cases: (
      <>
        <path d="M14 4h6v6" />
        <path d="M10 20H4v-6" />
        <path d="M20 10a8 8 0 0 0-14.9-4" />
        <path d="M4 14a8 8 0 0 0 14.9 4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    cruz: <path d="m6 6 12 12M18 6 6 18" />,
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    network: (
      <>
        <circle cx="12" cy="7" r="3" />
        <circle cx="5" cy="17" r="3" />
        <circle cx="19" cy="17" r="3" />
        <path d="m9.5 9-2.8 5.2M14.5 9l2.8 5.2M8 17h8" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    vet: (
      <>
        <path d="M9 3h6v18H9z" />
        <path d="M3 9h18v6H3z" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}

function LogoPlaceholder({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`logo ${light ? "logo--light" : ""}`}
      aria-label="Espacio reservado para el logo de Manada Solidaria"
    >
      <div className="logo__mark">
        <img src="logo_manada.png" />
      </div>
      <div className="logo__type">
        <strong>Manada</strong>
        <strong>Solidaria</strong>
      </div>
    </div>
  )
}

type Feature = {
  icon: IconName
  title: string
  text: string
  screenshot?: string
}

const featureGroups: { title: string; description: string; items: Feature[] }[] = [
  {
    title: "Ayudar a los animales",
    description: "Encontrá casos y distintas formas de dar una mano.",
    items: [
      { icon: "heart", title: "Publicaciones de animales", text: "Conocé animales perdidos, encontrados y en adopción.", screenshot: "/screen_animal_perdido.jpeg" },
      { icon: "campaign", title: "Campañas", text: "Descubrí iniciativas solidarias y cómo participar.", screenshot: "/screen_campaña.png" },
      { icon: "cases", title: "Colectas", text: "Colaborá con los recursos que necesita cada caso.", screenshot: "/screen_colecta.png" },
      { icon: "location", title: "Mapa de publicaciones", text: "Ubicá todas las publicaciones y encontrá casos cerca tuyo.", screenshot: "/screen_mapa.png" },
    ],
  },
  {
    title: "Comunidad",
    description: "Conectá con las personas que forman parte de la red.",
    items: [
      { icon: "network", title: "Comunidad", text: "Encontrá personas y organizaciones dispuestas a colaborar.", screenshot: "/screen_comunidad.png" },
      { icon: "heart", title: "Perfil", text: "Mostrá quién sos y cómo participás en Manada Solidaria.", screenshot: "/screen_perfil.png" },
    ],
  },
  {
    title: "Emergencias",
    description: "Accedé rápido a la información cuando más importa.",
    items: [
      { icon: "vet", title: "Veterinarias", text: "Consultá veterinarias y sus datos de contacto." },
      { icon: "bell", title: "Botón de emergencia", text: "Accedé rápidamente a las opciones de ayuda ante una urgencia.", screenshot: "/screen_boton_guardia.png" },
    ],
  },
]
const sectionNavigation = [
  { id: "punto-de-partida", label: "El punto de partida" },
  { id: "funcionalidades", label: "Funcionalidades" },
  { id: "equipo", label: "Equipo Nexo" },
  { id: "aplicacion", label: "Conocé la aplicación" },
]

export default function App() {
  const [activeSection, setActiveSection] = useState(-1)

  useEffect(() => {
    const updateSection = () => {
      const threshold = window.innerHeight * 0.35
      let current = -1
      sectionNavigation.forEach(({ id }, index) => {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= threshold) {
          current = index
        }
      })
      setActiveSection(current)
    }

    updateSection()
    window.addEventListener("scroll", updateSection, { passive: true })
    window.addEventListener("resize", updateSection)
    return () => {
      window.removeEventListener("scroll", updateSection)
      window.removeEventListener("resize", updateSection)
    }
  }, [])

  const nextSection = sectionNavigation[activeSection + 1]

  return (
    <main id="inicio">
      <header className="site-header">
        <div className="shell site-header__inner">
          <LogoPlaceholder />
          <div className="site-header__meta">
            <span>Proyecto Final</span>
            <span className="site-header__dot" />
            <span>Equipo Nexo</span>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__copy">
            <div className="eyebrow">
              <span className="eyebrow__line" />
              Bienestar animal en Villa María
            </div>
            <h1>
              La ayuda se vuelve más fuerte cuando{" "}
              <em>nos encuentra unidos.</em>
            </h1>
            <p className="hero__lead">
              Manada Solidaria propone reunir animales que necesitan ayuda y personas
              dispuestas a colaborar en un mismo lugar.
            </p>
            <div className="hero__actions">
              <a className="primary-cta" href="#punto-de-partida">
                Conocer la propuesta
                <Icon name="arrow" />
              </a>
              <span className="hero__note">
                Una aplicación web con propósito local
              </span>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__arch">
              <img
                src="/animals-hero.jpg"
                alt="Un perro y un gato descansando juntos"
              />
            </div>
            <div className="hero__paw paw paw--one">●</div>
            <div className="hero__paw paw paw--two">●</div>
          </div>
        </div>
        <div className="hero__footer shell">
          <span>PERDIDOS</span>
          <i />
          <span>EN LA CALLE</span>
          <i />
          <span>ENCONTRADOS</span>
          <i />
          <span>EN ADOPCIÓN</span>
        </div>
      </section>

      <section id="punto-de-partida" className="challenge section">
        <div className="shell">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <span className="section-kicker">El punto de partida</span>
              <h2>Muchas ganas de ayudar. Información dispersa.</h2>
            </div>
          </div>

          <div className="challenge__grid">
            <article className="problem-card">
              <div className="problem-card__top">
                <span>Hoy</span>
              </div>
              <h3>Los casos circulan por canales distintos.</h3>
              <p>
                Publicaciones, historias y mensajes se pierden entre
                conversaciones. Buscar información y coordinar ayuda requiere
                tiempo.
              </p>
              <div className="scattered-lines">
                <span><Icon name="cruz" /> Informacion distribuida</span>
                <span><Icon name="cruz" /> Falta de transparencia</span>
                <span><Icon name="cruz" /> Dificultad para coordinar ayuda</span>
              </div>
            </article>

            <div className="challenge__connector" aria-hidden="true">
              <Icon name="arrow" />
            </div>

            <article className="solution-card">
              <div className="solution-card__top">
                <span>La propuesta</span>
                <Icon name="heart" />
              </div>
              <h3>Un mismo lugar para encontrarnos y organizarnos.</h3>
              <p>
                Manada Solidaria busca centralizar los casos y facilitar el
                vínculo entre quienes necesitan ayuda y quienes pueden
                brindarla.
              </p>
              <div className="solution-card__checks">
                <span>
                  <Icon name="check" /> Información accesible
                </span>
                <span>
                  <Icon name="check" /> Facilidad para ayudar
                </span>
                <span>
                  <Icon name="check" /> Comunidad conectada
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="funcionalidades" className="features section">
        <div className="shell">
          <div className="features__intro">
            <div className="section-heading section-heading--light">
              <span className="section-number">02</span>
              <div>
                <span className="section-kicker">Funcionalidades</span>
                <h2>Todo lo necesario para activar una red solidaria.</h2>
              </div>
            </div>
            <p>
              El alcance del proyecto contempla herramientas para informar,
              buscar, conectar y acompañar.
            </p>
          </div>

          <div className="feature-groups">
            {featureGroups.map((group, groupIndex) => (
              <section className="feature-group" key={group.title} aria-labelledby={`feature-group-${groupIndex}`}>
                <div className="feature-group__heading">
                  <span className="feature-group__number">0{groupIndex + 1}</span>
                  <div>
                    <h3 id={`feature-group-${groupIndex}`}>{group.title}</h3>
                    <p>{group.description}</p>
                  </div>
                </div>
                <div className="feature-grid">
                  {group.items.map((feature) => (
                    <article className="feature-card" key={feature.title}>
                      <div className="feature-card__copy">
                        <span className="feature-card__icon"><Icon name={feature.icon} /></span>
                        <h4>{feature.title}</h4>
                        <p>{feature.text}</p>
                      </div>
                      <div className="feature-card__screenshot">
                        {feature.screenshot ? (
                          <img src={feature.screenshot} alt={`Captura de la aplicación: ${feature.title}`} loading="lazy" />
                        ) : (
                          <div className="feature-card__placeholder">
                            <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="3" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="m3 17 5-5 4 4 4-6 5 7" />
                            </svg>
                            <span>Captura de {feature.title.toLocaleLowerCase("es")}</span>
                            <small>Próximamente</small>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <p className="scope-note">
            <span>Alcance proyectado</span>
            Algunas funcionalidades forman parte de la propuesta académica y
            pueden encontrarse en distintas etapas de desarrollo.
          </p>
        </div>
      </section>

      <section id="equipo" className="team section">
        <div className="shell team__grid">
          <div className="team__intro">
            <span className="section-kicker">Las personas detrás</span>
            <h2>Equipo Nexo</h2>
            <p>
              Grupo 6 del Proyecto Final de Ingeniería en Sistemas de
              Información.
            </p>
            <div className="university">
              <span className="university__monogram">UTN</span>
              <span>
                Universidad Tecnológica Nacional
                <strong>Facultad Regional Villa María</strong>
              </span>
            </div>
          </div>
          <div className="team__members">
            {[
              ["AC", "Abril", "Conrero"],
              ["EE", "Elian", "Enria"],
              ["RM", "Rocío", "Menardi"],
              ["LR", "Lucía", "Rosales"],
              ["FS", "Federico", "Sanchez"],
            ].map(([initials, name, surname], index) => (
              <article className="member" key={initials}>
                <span className={`member__avatar member__avatar--${index + 1}`}>
                  {initials}
                </span>
                <span className="member__name">
                  {name}
                  <strong>{surname}</strong>
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="aplicacion" className="closing section">
        <div className="shell closing__card">
          <div className="closing__copy">
            <LogoPlaceholder light />
            <span className="closing__eyebrow">Conocé la aplicación</span>
            <h2>Sumate a una comunidad que transforma intención en ayuda.</h2>
            <p>
              Explorá Manada Solidaria y descubrí una nueva manera de conectar
              por el bienestar animal.
            </p>
            <div className="closing__pill">
              <Icon name="location" />
              Villa María, Córdoba
            </div>
          </div>
          <div className="qr-area">
            <div className="qr-placeholder">
              <span>[QR DE LA APLICACIÓN]</span>
            </div>
            <p>Escaneá para conocer la propuesta</p>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer__inner">
          <span>Manada Solidaria</span>
          <span>Proyecto académico · Equipo Nexo · 2025</span>
        </div>
      </footer>
      {activeSection >= 0 && (
        <a
          className={`section-navigation ${nextSection ? "" : "section-navigation--top"}`}
          href={nextSection ? `#${nextSection.id}` : "#inicio"}
          aria-label={nextSection ? `Ir a ${nextSection.label}` : "Volver al inicio"}
        >
          <Icon name="arrow" />
        </a>
      )}
    </main>
  )
}
