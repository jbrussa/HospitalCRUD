
export default function MedicamentosBuscar({ Nombre, setNombre, Buscar, Agregar }) {
    return (
      <form name="FormBusqueda">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-4 col-md-2">
              <label className="col-form-label">Nombre:</label>
            </div>
            <div className="col-sm-8 col-md-4">
              <input
                type="text"
                className="form-control"
                onChange={(e) => setNombre(e.target.value)}
                value={Nombre}
                maxLength="55"
                autoFocus
              />
            </div>
          </div>
  
          <hr />
  
          {/* Botones */}
          <div className="row">
            <div className="col text-center botones">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  Buscar(1)
                } /*  Función que se ejecuta al hacer clic en el botón "Buscar". Llama a la función Buscar con el argumento 1 */
              >
                <i className="fa fa-search"> </i> Buscar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => Agregar()}
              >
                <i className="fa fa-plus"> </i> Agregar
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
