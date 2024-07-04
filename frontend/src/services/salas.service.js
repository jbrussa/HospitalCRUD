import axios from "axios";

const urlResource = "http://localhost:3000/api/salas";

async function Buscar(Ala) {
  const resp = await axios.get(urlResource, {
    params: { Ala },
  });
  return resp.data;
}

async function BuscarPorId(item) {
  const resp = await axios.get(urlResource + "/" + item.IdSala);
  return resp.data;
}

async function ActivarDesactivar(item) {
  //await axios.delete(urlResource + "/" + item.IdSala);      //baja fisica
  const updatedItem = { ...item, Activo: !item.Activo };
  await axios.put(urlResource + "/" + item.IdSala, updatedItem);
}

async function Grabar(item, Func) {
  if (Func === "A") {
    await axios.post(urlResource, item);
  } else {
    await axios.put(urlResource + "/" + item.IdSala, item);
  }
}

export const salasServices = {
  Buscar,
  BuscarPorId,
  ActivarDesactivar,
  Grabar,
};
