import PawPrint from "./icons/PawPrint"
import HandHeart from "./icons/HandHeart"
import DollarSign from "./icons/DollarSign"
import Map from "./icons/Map"
import Users from "./icons/Users"
import User from "./icons/User"
import BriefcaseMedical from "./icons/BriefcaseMedical"
import Stethoscope from "./icons/Stethoscope"
import { IPhoneMockup } from "react-device-mockup"
import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode, type SVGProps } from "react"

const petPhotos = Object.entries(import.meta.glob<string>("../mascotas/**/*.{jpeg,jpg,png,webp,JPEG,JPG,PNG,WEBP}", { eager: true, query: "?url", import: "default" }))
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([path, src]) => ({ path, src }))

function PetsCarousel() {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const respectPreference = () => {
      if (preference.matches) setPaused(true)
    }
    respectPreference()
    preference.addEventListener("change", respectPreference)
    return () => preference.removeEventListener("change", respectPreference)
  }, [])

  useEffect(() => {
    if (paused || hovered || focused || petPhotos.length < 2) return
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        const element = track.current
        element?.scrollTo({ left: ((active + 1) % petPhotos.length) * element.clientWidth, behavior: "smooth" })
      }
    }, 5000)
    return () => window.clearInterval(timer)
  }, [active, paused, hovered, focused])

  const goTo = (index: number) => {
    const element = track.current
    if (!element) return
    const target = Math.max(0, Math.min(index, petPhotos.length - 1))
    element.scrollTo({ left: target * element.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
  }

  if (!petPhotos.length) return null

  return (
    <section className="pets-carousel" aria-labelledby="pets-title" aria-roledescription="carrusel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
    }} onTouchStart={() => setPaused(true)}>
      <div className="pets-carousel__intro">
        <span className="section-kicker"><PawPrint aria-hidden="true" /> También son parte del equipo</span>
        <h3 id="pets-title">Nuestras mascotas</h3>
        <p>Nos acompañan todos los días y nos recuerdan por qué vale la pena construir una red para ayudar.</p>
        <div className="pets-carousel__controls">
          <button type="button" aria-label="Ver foto anterior" aria-controls="pets-photos" disabled={active === 0} onClick={() => goTo(active - 1)}><Icon name="arrow" /></button>
          <span aria-live={paused || hovered || focused ? "polite" : "off"} aria-atomic="true">{active + 1} / {petPhotos.length}</span>
          <button type="button" aria-label="Ver foto siguiente" aria-controls="pets-photos" disabled={active === petPhotos.length - 1} onClick={() => goTo(active + 1)}><Icon name="arrow" /></button>
          <button type="button" aria-label={paused ? "Reanudar carrusel automático" : "Pausar carrusel automático"} onClick={() => setPaused(!paused)}>{paused ? "▶" : "Ⅱ"}</button>
        </div>
      </div>
      <div className="pets-carousel__gallery">
        <div id="pets-photos" className="pets-carousel__track" ref={track} tabIndex={0} aria-label="Fotos de nuestras mascotas" onScroll={(event) => {
          const element = event.currentTarget
          setActive(Math.max(0, Math.min(petPhotos.length - 1, Math.round(element.scrollLeft / element.clientWidth))))
        }} onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault()
            goTo(active + (event.key === "ArrowRight" ? 1 : -1))
          }
        }}>
          {petPhotos.map((photo, index) => (
            <div className="pets-carousel__slide" key={photo.path} role="group" aria-roledescription="diapositiva" aria-label={`${index + 1} de ${petPhotos.length}`}>
              <img src={photo.src} alt={`Nuestras mascotas: foto ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="pets-carousel__thumbnails" aria-label="Elegir foto">
          {petPhotos.map((photo, index) => (
            <button type="button" key={photo.path} aria-label={`Ver foto ${index + 1}`} aria-current={active === index ? "true" : undefined} onClick={() => goTo(index)}>
              <img src={photo.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const personalityPhotos = {
  flowers: { src: "/foto_perro_con_flor.jpeg", caption: "No cambiás el mundo, pero sí su mundo" },
}

function PersonalityPhoto({ photo, className = "" }: { photo: keyof typeof personalityPhotos; className?: string }) {
  const { src, caption } = personalityPhotos[photo]
  return (
    <figure className={`personality-photo personality-photo--${photo} ${className}`} aria-hidden="true">
      <div className="personality-photo__image"><img src={src} alt="" loading="lazy" /></div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function AppMockup({ src, title }: { src: string; title: string }) {
  const container = useRef<HTMLDivElement>(null)
  const [screenWidth, setScreenWidth] = useState(220)

  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      // Leave room for the library's bezel and side buttons.
      setScreenWidth(Math.max(1, Math.floor(entry.contentRect.width / 1.08)))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="app-mockup" ref={container}>
      <IPhoneMockup screenWidth={screenWidth} screenType="island" frameColor="#252525" hideStatusBar hideNavBar>
        <img className="app-mockup__screen" src={src} alt={`Captura de la aplicación: ${title}`} loading="lazy" />
      </IPhoneMockup>
    </div>
  )
}

function WalkingPaws() {
  const container = useRef<HTMLDivElement>(null)
  const [trail, setTrail] = useState<{ x: number; y: number; angle: number; length: number; cycle: number } | null>(null)

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let timer: ReturnType<typeof setTimeout> | undefined
    let cycle = 0

    const step = () => {
      if (preference.matches) return
      const bounds = container.current?.getBoundingClientRect()
      if (bounds && bounds.bottom > 0 && bounds.top < window.innerHeight && !document.hidden) {
        const visibleTop = Math.max(0, -bounds.top)
        const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0)
        const length = Math.min(360, bounds.width - 40, visibleHeight - 32)
        const angle = Math.random() * 360
        const radians = angle * Math.PI / 180
        const halfWidth = (Math.abs(Math.cos(radians)) * 54 + Math.abs(Math.sin(radians)) * length) / 2
        const halfHeight = (Math.abs(Math.sin(radians)) * 54 + Math.abs(Math.cos(radians)) * length) / 2
        if (length >= 120) {
        setTrail({
          x: halfWidth + Math.random() * Math.max(0, bounds.width - 2 * halfWidth),
          y: visibleTop + halfHeight + Math.random() * Math.max(0, visibleHeight - 2 * halfHeight),
          angle,
          length,
          cycle: cycle++,
        })
        }
      }
      timer = setTimeout(step, 4500 + Math.random() * 2500)
    }

    const restart = () => {
      clearTimeout(timer)
      setTrail(null)
      if (!preference.matches) timer = setTimeout(step, 500 + Math.random() * 2500)
    }

    restart()
    preference.addEventListener("change", restart)
    return () => {
      clearTimeout(timer)
      preference.removeEventListener("change", restart)
    }
  }, [])

  return (
    <div className="walking-paws" ref={container} aria-hidden="true">
      {trail && (
        <div key={trail.cycle} className="walking-paws__trail" style={{ left: trail.x, top: trail.y, height: trail.length, transform: `translate(-50%, -50%) rotate(${trail.angle}deg)`, "--step-gap": `${(trail.length - 22) / 9}px` } as CSSProperties}>
          {Array.from({ length: 10 }, (_, index) => (
            <span className="walking-paws__step" key={index} style={{ "--step": index } as CSSProperties}>
              <PawPrint />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

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
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  text: string
  screenshot?: string
}

const storySteps: { label: string; title: string; text: string; items: Feature[] }[] = [
  {
    label: "Un caso que nos moviliza",
    title: "Todo empieza con un animal que necesita ayuda.",
    text: "Encontraste un animal, perdiste al tuyo o querés ayudar a encontrarle un hogar. Una publicación puede ser el primer paso para cambiar su historia.",
    items: [
      { icon: PawPrint, title: "Publicaciones de animales", text: "Perdidos, en la calle y en adopción, en un mismo lugar.", screenshot: "/screen_animales.jpeg" },
      { icon: HandHeart, title: "La historia de cada animal", text: "Conocé los detalles de cada caso y cómo podés ayudar.", screenshot: "/screen_animal_perdido.jpeg" },
    ],
  },
  {
    label: "Mirar a nuestro alrededor",
    title: "Quien necesita tu ayuda está más cerca de lo que pensás.",
    text: "Descubrí qué está pasando en tu zona. El mapa te permite ubicar las publicaciones y encontrar dónde podés dar una mano.",
    items: [
      { icon: Map, title: "Mapa de publicaciones", text: "Encontrá casos cerca tuyo.", screenshot: "/screen_mapa.png" },
      { icon: PawPrint, title: "Publicaciones en la zona", text: "Explorá los casos del área que seleccionás en el mapa.", screenshot: "/detalles_mapa.jpeg" },
    ],
  },
  {
    label: "Pasar a la acción",
    title: "Hay muchas maneras de hacer la diferencia.",
    text: "Cada caso necesita algo distinto. Sumate a una campaña o colaborá con una colecta para acercar los recursos que hacen falta.",
    items: [
      { icon: HandHeart, title: "Campañas", text: "Descubrí iniciativas y cómo participar.", screenshot: "/screen_campaña.png" },
      { icon: DollarSign, title: "Colectas", text: "Colaborá con los recursos que necesita cada caso.", screenshot: "/screen_colecta.png" },
    ],
  },
  {
    label: "Encontrarnos en comunidad",
    title: "Detrás de cada ayuda, hay personas.",
    text: "Conocé a quienes forman parte de la red. Cuando nos encontramos, organizar la ayuda es más fácil.",
    items: [
      { icon: Users, title: "Comunidad", text: "Personas y organizaciones dispuestas a colaborar.", screenshot: "/screen_comunidad.png" },
      { icon: User, title: "Perfil", text: "Mostrá quién sos y cómo participás en la manada.", screenshot: "/screen_perfil.png" },
    ],
  },
  {
    label: "Estar cuando más importa",
    title: "Cuando hay una urgencia, cada minuto cuenta.",
    text: "Consultá veterinarias, horarios y sus datos de contacto. El botón de emergencia te permite llamar rápidamente a la guardia veterinaria cuando la necesitás.",
    items: [
      { icon: BriefcaseMedical, title: "Veterinarias", text: "Información de contacto para buscar atención.", screenshot: "/listado_veterinarias.png" },
      { icon: Stethoscope, title: "Botón de emergencia", text: "Acceso rápido para llamar a la guardia veterinaria.", screenshot: "/screen_boton_guardia.png" },
    ],
  },
]
const sectionNavigation = [
  { id: "punto-de-partida", label: "El punto de partida" },
  { id: "funcionalidades", label: "Funcionalidades" },
  ...storySteps.map((step, index) => ({
    id: `funcionalidades-${index}`,
    label: step.label,
  })),
  { id: "equipo", label: "Equipo Nexo" },
  { id: "aplicacion", label: "Conocé la aplicación" },
]

export default function App() {
  const [activeSection, setActiveSection] = useState(-1)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return

    const targets = document.querySelectorAll<HTMLElement>(
      ".hero__copy > *, .hero__visual, .section-heading, .problem-card, .challenge__connector, .solution-card, .story-step__copy, .story-step__visual, .team__intro, .member, .closing__copy, .qr-area",
    )
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed")
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })

    targets.forEach((target) => {
      target.classList.add("reveal")
      observer.observe(target)
    })

    return () => {
      observer.disconnect()
      targets.forEach((target) => target.classList.remove("reveal", "is-revealed"))
    }
  }, [])

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
            <span>Proyecto Final de Grado</span>
            <span className="site-header__dot" />
            <span>Equipo Nexo</span>
          </div>
        </div>
      </header>

      <section className="hero">
        <WalkingPaws />
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
        <WalkingPaws />
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
                <span><Icon name="cruz" />Información distribuida</span>
                <span><Icon name="cruz" />Cada vez más casos</span>
                <span><Icon name="cruz" />Dificultad para coordinar ayuda</span>
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
                <span className="section-kicker">Así funciona Manada Solidaria</span>
                <h2>Un animal necesita ayuda. Una comunidad puede cambiar su historia.</h2>
              </div>
            </div>
            <p>Desde la primera publicación hasta encontrar cómo colaborar, recorré las herramientas que nos acercan.</p>
          </div>

          <div className="product-story">
            {storySteps.map((step, index) => (
              <section id={`funcionalidades-${index}`} className="story-step" key={step.label} aria-labelledby={`story-title-${index}`}>
                <span className="story-step__marker" aria-hidden="true"><PawPrint /></span>
                <div className="story-step__copy">
                  <span className="story-step__eyebrow">0{index + 1} / {step.label}</span>
                  <h3 id={`story-title-${index}`}>{step.title}</h3>
                  <p>{step.text}</p>
                  <div className="story-step__details">
                    {step.items.map((feature) => (
                      <div className="story-detail" key={feature.title}>
                        <span className="feature-card__icon"><feature.icon aria-hidden="true" /></span>
                        <div><h4>{feature.title}</h4><p>{feature.text}</p></div>
                      </div>
                    ))}
                  </div>

                </div>
                <div className={`story-step__visual product-scene product-scene--${index}${step.items.filter((item) => item.screenshot).length > 1 ? " story-step__visual--pair" : ""}`}>
                  {step.items.filter((item) => item.screenshot).map((feature) => (
                    <figure className="story-phone" key={feature.title}>
                      <AppMockup src={feature.screenshot!} title={feature.title} />
                      <figcaption>{feature.title}</figcaption>
                    </figure>
                  ))}
                  {index === 4 && (
                    <div className="product-zoom product-zoom--emergency">
                      <span className="product-zoom__label">La ayuda, a un toque</span>
                      <div className="product-zoom__crop" role="img" aria-label="Detalle de la aplicación: llamar a la guardia" />
                    </div>
                  )}

                </div>
              </section>
            ))}
          </div>
          <div className="story-invitation">
            <PersonalityPhoto photo="flowers" />
            <PawPrint aria-hidden="true" />
            <p>Tu forma de ayudar también tiene un lugar en la manada.</p>
            <a className="primary-cta" href="https://www.manadasolidaria.com" target="_blank" rel="noopener noreferrer">Conocé la aplicación <Icon name="arrow" /></a>
          </div>
        </div>
      </section>

      <section id="equipo" className="team section">
        <WalkingPaws />
        <div className="shell team__grid">
          <div className="team__intro">
            <span className="section-kicker">Las personas detrás</span>
            <div className="team__heading">
              <img className="team__logo" src="/logo_nexo.png" alt="Logo de Nexo" loading="lazy" />
              <h2>Equipo Nexo</h2>
            </div>
            <p>
              Grupo 6 del Proyecto Final de Ingeniería en Sistemas de
              Información.
            </p>
            <div className="university">
              <img className="university__logo" src="/isologotipo-utn-negro.svg" alt="Logo de la UTN" loading="lazy" />
              <span>
                Universidad Tecnológica Nacional
                <strong>Facultad Regional Villa María</strong>
              </span>
            </div>
          </div>
          <div className="team__members">
            {[
              ["abril", "Abril", "Conrero", "Frontend Developer & UX Designer"],
              ["elian", "Elian", "Enria", "Backend Developer"],
              ["rocio", "Rocío", "Menardi", "Frontend Developer & UX Designer"],
              ["lucia", "Lucía", "Rosales", "Backend Developer"],
              ["federico", "Federico", "Sanchez", "Full Stack Developer"],
            ].map(([photo, name, surname, role]) => (
              <article className="member" key={photo}>
                <img className={`member__avatar${photo === "rocio" ? " member__avatar--rocio" : ""}`} src={`/foto_${photo}.png`} alt={`${name} ${surname}`} loading="lazy" />
                <span className="member__name">
                  {name}
                  <strong>{surname}</strong>
                  <span className="member__role">{role}</span>
                </span>
              </article>
            ))}
          </div>
        </div>
        <div className="shell">
          <aside className="team-thanks" aria-labelledby="team-thanks-title">
            <img className="team-thanks__logo" src="/somos_su_voz.png" alt="Logo de Somos Su Voz" loading="lazy" />
            <div>
              <h3 id="team-thanks-title">Este proyecto también creció con su ayuda</h3>
              <p>Gracias a quienes nos acompañaron para hacer posible Manada Solidaria. Sumate a colaborar: conocé su trabajo, compartí sus publicaciones y descubrí cómo podés dar una mano. Cada aporte cuenta.</p>
              <a href="https://www.instagram.com/somos.su.voz.vmvn/" target="_blank" rel="noopener noreferrer" aria-label="Visitar el Instagram de @somos.su.voz.vmvn (se abre en otra pestaña)">@somos.su.voz.vmvn <Icon name="arrow" /></a>
            </div>
          </aside>
          <PetsCarousel />
        </div>
      </section>

      <section id="aplicacion" className="closing section">
        <div className="shell closing__card">
          <div className="closing__copy">
            <span className="closing__eyebrow">Formá parte</span>
            <h2>Tu forma de ayudar también tiene un lugar en la manada.</h2>
            <p>
              Seguí a Manada Solidaria en Instagram para conocer las novedades
              del proyecto y dejarnos tu opinión en la encuesta. Tu feedback
              nos ayuda a seguir mejorando y construyendo esta red solidaria.
            </p>
            <div className="closing__pill">
              <Icon name="location" />
              Villa María, Córdoba
            </div>
          </div>
          <div className="closing__qr-options">
            <div className="qr-area">
              <span className="qr-area__step">01 / Seguinos</span>
              <h3>Formá parte de la manada</h3>
              <img src="/Instagramqr.svg" alt="QR para seguir a Manada Solidaria en Instagram" loading="lazy" />
              <p><a href="https://www.instagram.com/manadasolidaria.vm/" target="_blank" rel="noopener noreferrer">Hacé click para formar parte</a></p>
            </div>
            <div className="qr-area">
              <span className="qr-area__step">02 / Contanos</span>
              <h3>Tu opinión suma</h3>
              <img src="/form-qr.svg" alt="QR para responder la encuesta sobre Manada Solidaria" loading="lazy" />
              <p><a href="https://forms.gle/5Smu4U77vyvyXgKm8" target="_blank" rel="noopener noreferrer">Hacé click para darnos tu opinión</a></p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer__inner">
          <span>Manada Solidaria</span>
          <span>Proyecto académico · Equipo Nexo · 2026</span>
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
