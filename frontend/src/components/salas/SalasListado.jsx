import moment from "moment";

function SalasListado({
  Items,
  Consultar,
  Modificar,
  ActivarDesactivar,
}) {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-sm table-bordered table-striped">
        <thead>
          <tr>
            <th className="text-center">Id</th>
            <th className="text-center">Ala</th>
            <th className="text-center">Fecha Ultimo Control</th>
            <th className="text-center">Activo</th>
            <th className="text-center">Tipo de Sala</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Items &&
            Items.map((Item) => (
              <tr key={Item.IdSala}>
                <td>{Item.IdSala}</td>
                <td className="text-end">{Item.Ala}</td>
                <td className="text-end">
                  {moment(Item.FechaUltimoControl).format("DD/MM/YYYY")}
                </td>
                <td>{Item.Activo ? "SI" : "NO"}</td>
                <td>
                  {
                   Item.tipoSala.NombreTipoSala
                  }
                </td>
                <td className="text-center text-nowrap">
                  {" "}
                  {/* botones para cada fila */}
                  <button /* boton consultar */
                    className="btn btn-sm btn-outline-primary"
                    title="Consultar"
                    onClick={() => Consultar(Item)}
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                  <button /* boton modificar */
                    className="btn btn-sm btn-outline-primary"
                    title="Modificar"
                    onClick={() => Modificar(Item)}
                  >
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button /* boton activar, cambia su estilo segun su estado */
                    className={
                      "btn btn-sm " +
                      (Item.Activo
                        ? "btn-outline-danger"
                        : "btn-outline-success")
                    }
                    title={Item.Activo ? "Desactivar" : "Activar"}
                    onClick={() => ActivarDesactivar(Item)}
                  >
                    <i
                      className={"fa fa-" + (Item.Activo ? "times" : "check")}
                    ></i>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export { SalasListado };
