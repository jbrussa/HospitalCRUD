import axios from "axios";

//const urlResource = "https://labsys.frc.utn.edu.ar/dds-express/api/articulosfamilias";
const urlResource = "http://localhost:3000/api/tipoMedicamentos";

async function Buscar() {
  const resp = await axios.get(urlResource);
  return resp.data;
}
export const tipoMedicamentosService = {
  Buscar
};
