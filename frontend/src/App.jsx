/* Este archivo proporciona la interfaz html inicial */
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Inicio } from "./components/Inicio";
import { Menu } from "./components/Menu";
import { Pacientes } from "./components/pacientes/Pacientes";
import { ModalDialog } from "./components/ModalDialog";
import { Medicamentos } from "./components/medicamentos/Medicamentos";
import { Salas } from "./components/salas/Salas";
import { Medicos } from "./components/medicos/Medicos";


function App() {
  return (
    <>
      <BrowserRouter>
        <ModalDialog />
        <Menu />
        <div className="divBody">
          <Routes>
            <Route path="/inicio" element={<Inicio />} />{" "}
            {/* en path ponemos la url y en element el componente que llamamos en esa url */}
            {/* si no encuentra la ruta en las opciones de arriba, redirige a inicio por defecto */}
            <Route path="*" element={<Navigate to="/inicio" replace />} />{" "}
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/salas" element={<Salas />} />
            <Route path="/medicos" element={<Medicos />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
export default App;

/*  el componente Route se usa para definir una ruta
  el componente Navigate se usa para redirigir a otra ruta
  la opcion replace indica que la navegacion reemplaza la entrada actual, por lo que si quiero volver no me va a llevar de nuevo a la url anterior, que no coincidio con ninguna ruta 
*/

