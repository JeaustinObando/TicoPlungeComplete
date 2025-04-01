import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="homeStyle">
      <div className="todo">
        <div className="logo"></div>

        <div className="container">
          <div className="esquina">
            <div className="card-principal">
              <a
                className="social-link1"
                href="https://www.instagram.com/ticoplunge?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-instagram"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="white"
                    d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
                  ></path>{" "}
                </svg>
              </a>
              <a
                className="social-link3"
                href="https://api.whatsapp.com/message/NQD6MTRNSIW5N1?autoload=1&app_absent=0"
                target="_blank"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-whatsapp"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="white"
                    d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
                  ></path>{" "}
                </svg>
              </a>
              <a
                className="social-link2"
                href="https://www.facebook.com/profile.php?id=61553047905206"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1.1em"
                  viewBox="0 0 448 512"
                  strokeWidth="0"
                  fill="currentColor"
                  stroke="currentColor"
                  className="w-5 bi bi-facebook"
                >
                  <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="row">
            <div className="cold-plunge  col">
              <h2>COLD PLUNGE</h2>
              <div className="explicacion">
                <p>
                  El "cold plunge" o inmersión en agua fría es cuando te
                  sumerges en agua muy fría, por unos pocos minutos. Piensa en
                  meterte en una piscina con agua casi helada.
                </p>
                <p>¿Por qué lo hacen las personas?</p>
                <li>
                  <strong>
                    Recuperación: Ayuda a que tus músculos se sientan mejor
                    después de hacer ejercicio.
                  </strong>
                </li>
                <li>
                  <strong>
                    Mejora la circulación: El frío hace que la sangre circule
                    mejor por tu cuerpo.
                  </strong>
                </li>
                <li>
                  <strong>
                    Refuerza el sistema inmunológico: Puede ayudar a que no te
                    enfermes tanto.
                  </strong>
                </li>
                <li>
                  <strong>
                    Mejora el ánimo: Estar en agua fría puede hacerte sentir más
                    feliz y menos estresado.
                  </strong>
                </li>
              </div>
            </div>
            <div className="col bg-image"></div>
          </div>

          <div className="row">
            <div className="col bg-pilates"></div>
            <div className="cold-plunge  col">
              <h2>PILATES</h2>
              <div className="explicacion">
                <p>
                  Los Pilates son una forma de ejercicio que te ayuda a
                  fortalecer los músculos, especialmente los del abdomen y la
                  espalda. También mejora tu postura, flexibilidad y equilibrio.
                </p>
                <p>¿Cómo se hacen? </p>
                <p>
                  Puedes hacer Pilates en una colchoneta en el suelo o usando
                  máquinas especiales. Los movimientos son lentos y controlados,
                  y prestas mucha atención a cómo respiras.
                </p>
                <p>¿Por qué son buenos?</p>
                <li>
                  <strong>
                    Fortalecen el cuerpo: Los Pilates se enfocan en fortalecer
                    el "core" o núcleo del cuerpo, que incluye los músculos del
                    abdomen, la espalda baja, las caderas y los glúteos.
                  </strong>
                </li>
                <li>
                  <strong>
                    Mejoran la postura: Una buena postura reduce el riesgo de
                    dolores de espalda y cuello, y mejora la eficiencia de tus
                    movimientos diarios.
                  </strong>
                </li>
                <li>
                  <strong>
                    Aumentan la flexibilidad: Una mayor flexibilidad puede
                    mejorar tu rango de movimiento, reducir la rigidez y hacer
                    que te sientas más ágil y menos propenso a lesiones.
                  </strong>
                </li>
                <li>
                  <strong>
                    Reducen el estrés: Los movimientos suaves y fluidos también
                    contribuyen a una sensación general de bienestar y
                    relajación.
                  </strong>
                </li>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="cold-plunge  col">
              <h2>BOXEO</h2>
              <div className="explicacion">
                <p>
                  El boxeo es un deporte en el que dos personas luchan una
                  contra la otra usando solo sus puños. Se enfrentan en un
                  cuadrilátero y tratan de golpearse entre sí mientras se mueven
                  alrededor del ring.
                </p>
                <p>Beneficios</p>
                <li>
                  <strong>
                    Ejercicio y Condición Física: El boxeo es una forma intensa
                    de ejercicio que involucra movimientos rápidos y potentes.
                    Ayuda a mejorar la resistencia cardiovascular, la fuerza
                    muscular, la coordinación y la agilidad.
                  </strong>
                </li>
                <li>
                  <strong>
                    Superación Personal y Desafío: El boxeo es un deporte
                    desafiante que requiere disciplina, determinación y
                    perseverancia. Superar los desafíos físicos y mentales que
                    presenta el boxeo puede ser muy gratificante y promover un
                    sentido de logro personal.
                  </strong>
                </li>
                <li>
                  <strong>
                    Autodefensa y Seguridad Personal: Aprender técnicas de boxeo
                    puede proporcionar a las personas habilidades prácticas de
                    autodefensa y aumentar su confianza en situaciones
                    potencialmente peligrosas.
                  </strong>
                </li>
                <li>
                  <strong>
                    Alivio del Estrés y Canalización de Emociones: Golpear el
                    saco de boxeo o participar en un combate puede ser una forma
                    efectiva de liberar tensiones, aliviar el estrés y canalizar
                    emociones negativas. Muchas personas encuentran que el boxeo
                    les proporciona un escape saludable y una forma de
                    desahogarse después de un día estresante.
                  </strong>
                </li>
              </div>
            </div>
            <div className="col bg-boxeo"></div>
          </div>

          <div className="row">
            <div className="col bg-yoga"></div>
            <div className="cold-plunge  col">
              <h2>YOGA</h2>
              <div className="explicacion">
                <p>
                  El yoga es una antigua práctica que combina movimientos
                  físicos, técnicas de respiración y meditación para promover el
                  bienestar general del cuerpo, la mente y el espíritu.
                </p>
                <p>Beneficios de la Yoga </p>
                <li>
                  <strong>
                    Bienestar físico: El yoga es una excelente manera de
                    mantenerse en forma y mejorar la salud física. Las posturas
                    de yoga fortalecen los músculos, aumentan la flexibilidad y
                    mejoran la postura corporal.
                  </strong>
                </li>
                <li>
                  <strong>
                    Reducción del estrés y la ansiedad: El yoga incluye técnicas
                    de respiración profunda y meditación que ayudan a calmar la
                    mente y reducir el estrés. La práctica regular de yoga puede
                    ayudar a gestionar la ansiedad y promover la relajación.
                  </strong>
                </li>
                <li>
                  <strong>
                    Mejora del bienestar mental: El yoga fomenta la atención
                    plena y la conciencia del momento presente. Esto puede
                    ayudar a reducir los pensamientos negativos y aumentar la
                    autoaceptación y el amor propio.
                  </strong>
                </li>
                <li>
                  <strong>
                    Aumento de la energía y la vitalidad: Las prácticas de
                    respiración en el yoga, como el pranayama, aumentan el flujo
                    de oxígeno en el cuerpo, lo que puede aumentar la energía y
                    la vitalidad.
                  </strong>
                </li>
              </div>
            </div>
          </div>

          <Link to="/AppointmentForm" className="btn-personalizado">
            RESERVA YA!!
          </Link>

          <div className="row">
            <div className="col-md-6">
              <div className="quienes-somos">
                <div className="colorback">
                  <h2>¿Quiénes somos?</h2>
                  <p>
                    Somos una empresa dedicada a cuidar la salud y promover un
                    estilo de vida activo para las personas de toda la region,
                    nuestro objetivo es crear una comunidad más sana y con
                    oportunidades de recuperación a un costo accesible para la
                    mayoría.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="visit-comunity">
                <div className="colorback">
                  <div>
                    <div>
                      <h2>¡Visítanos!</h2>
                      <p>Estamos ubicados:</p>
                      <p>
                        350m sur del Complejo Gabelo Conejo, San Ramon,
                        Alajuela, Costa Rica
                      </p>

                      <p>Horario de atención: Lunes a Viernes, 9am - 6pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer>
            <div className="colorback">
              <p>&copy;Tico Plunge</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;
