import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import "leaflet/dist/leaflet.css";
import "../Styles/CoordenadasModal.css";
import { Map, Marker } from "google-maps-react";
import { paisesURL } from "../API/apiurls";
import { useListarElementos } from "../Hooks/CRUDHooks";

function RutasModal({
  mostrar,
  cerrar,
  guardar,
  editar,
  datosaeditar,
  title,
  paises, // Lista de países pasada como prop
}) {
  const [formData, setFormData] = useState({
    nomruta: "",
    paisId: "", // Cambiado a paisId para almacenar el ID del país
    paisNombre: "", // Agregado para almacenar el nombre del país
  });

  const [pais, setPais] = useState([]);
  useListarElementos(`${paisesURL}`, pais, setPais);

  const [markerPosition, setMarkerPosition] = useState([0, 0]);

  const handleClose = () => {
    cerrar();
  };

  const handleSave = () => {
    //console.log('Datos del formulario:', formData);
    //guardar(formData);
    if (datosaeditar) {
      editar(formData);
    } else {
      guardar(formData);
    }
    cerrar();
    limpiar();
  };

  const limpiar = () => {
    setFormData({
      nomruta: "",
      paisId: "", 
      paisNombre: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    const { value, options } = e.target;
    const selectedOption = options[options.selectedIndex];
    setFormData({
      ...formData,
      paisId: value,
      paisNombre: selectedOption.text, // Almacenando el nombre del país
    });
  };

  useEffect(() => {
    if (datosaeditar) {
      setFormData({
        id: datosaeditar.id,
        empresa: datosaeditar.empresasModel.id,
        nomruta: datosaeditar.nomruta,
        paisId: datosaeditar.paisesModel.id,
        paisNombre: datosaeditar.paisesModel.nombre,
      });
      //setEditando(true);
    } else {
      // ...
    }
  }, [datosaeditar]);

  const handleMarkerDragEnd = (e) => {
    setMarkerPosition(e.target.getLatLng());
  };

  return (
    <>
      <Modal show={mostrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-row">
            <div className="input-column">
              <h5>Nombre de Ruta</h5>
              <input
                type="text"
                name="nomruta"
                value={formData.nomruta}
                onChange={handleInputChange}
                style={{ width: "150px" }}
              />
            </div>
            <div className="input-column">
              <h5>País</h5>
              <select
                name="paisId"
                value={formData.paisId}
                onChange={handleSelectChange}
                style={{ width: "200px", height: "40px", margin: "10px" }}
              >
                <option value="">Seleccione un país</option>
                {pais.map((pais) => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button variant="primary" onClick={handleSave}>
            Guardar
          </button>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default RutasModal;
