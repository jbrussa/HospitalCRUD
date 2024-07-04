import { NavLink } from "react-router-dom"; /* usamos NavLink para crear los links de navegacion, que aplica un estilo css cuando el link esta activo */

function Menu() {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-md">
      <a className="navbar-brand">
        &nbsp;<i> Hospital </i>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        {" "}
        {/* boton para desplegar o colapsar */}
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {" "}
        {/* contenido desplegable o colapsable */}
        <ul className="navbar-nav mr-auto">
          {" "}
          {/* lista de navegacion */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/inicio">
              Inicio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/medicos">
              Medicos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/pacientes">
              Pacientes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/medicamentos">
              Medicamentos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/salas">
              Salas
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export { Menu };
