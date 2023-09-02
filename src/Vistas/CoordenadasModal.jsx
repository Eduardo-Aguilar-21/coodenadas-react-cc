import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import "leaflet/dist/leaflet.css";
import "../Styles/CoordenadasModal.css";
import { Map, Marker } from "google-maps-react";
import { useListarElementos } from "../Hooks/CRUDHooks";
import { sonidosVelocidadURL } from "../API/apiurls";
import axios from "axios";

function CoordenadasModal({
  mostrar,
  cerrar,
  guardar,
  editar,
  datosaeditar,
  title,
}) {
  const [formData, setFormData] = useState({
    latitud: "",
    longitud: "",
    radio: "",
    velocidad: "10",
    velocidadValor: "",
    sonidoVelocidad: "",
    sonidoGeocerca: "",
  });

  const [velocidades, setVelocidades] = useState([]);
  useListarElementos(`${sonidosVelocidadURL}`, velocidades, setVelocidades);

  const [idvelocidad, setIdvelocidad] = useState([]);
  const [velocidadesS, setVelocidadesS] = useState([]);
  const [audio, setAudio] = useState([]);


  const ListarSonidos = async () => {
    try {
      const response = await axios.get(`${sonidosVelocidadURL}/${idvelocidad}`);
      setVelocidadesS(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    console.log(velocidadesS)
    ListarSonidos();
    setAudio(velocidadesS.sonidoVelocidad)
  }, [formData.sonidoVelocidad]);
 
  useEffect(() => {
    if (datosaeditar) {
      setFormData({
        id: datosaeditar.id,
        latitud: datosaeditar.latitud,
        longitud: datosaeditar.longitud,
        radio: datosaeditar.radio,
        velocidad: datosaeditar.sonidosVelocidadModel.id,
        velocidadValor: datosaeditar.sonidosVelocidadModel.id,
        sonidoVelocidad: datosaeditar.sonidosVelocidadModel.id,
        sonidoGeocerca: datosaeditar.sonidoGeocerca,
      });
      //setEditando(true);
    } else {
      limpiar();
    }
  }, [datosaeditar]);

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
      latitud: "",
      longitud: "",
      radio: "",
      velocidad: "10",
      velocidadValor: "",
      sonidoVelocidad: "",
      sonidoGeocerca: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleseleccionarAudio = (e) => {
    const { value, options } = e.target;
    const selectedOption = options[options.selectedIndex];
    setFormData({
      ...formData,
      sonidoVelocidad: selectedOption.text / 10,
      velocidad: value,
      velocidadValor: selectedOption.text,
    });
    setIdvelocidad(value)
  };

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
              <h5>Latitud</h5>
              <input
                type="text"
                name="latitud"
                value={formData.latitud}
                onChange={handleInputChange}
                style={{ width: "150px" }}
              />
            </div>
            <div className="input-column">
              <h5>Longitud</h5>
              <input
                type="text"
                name="longitud"
                value={formData.longitud}
                onChange={handleInputChange}
                style={{ width: "150px" }}
              />
            </div>
          </div>
          <div>
            <h5>Radio</h5>
            <input
              type="text"
              name="radio"
              value={formData.radio}
              onChange={handleInputChange}
              style={{ width: "420px" }}
            />
          </div>
          <div className="input-row">
            <div className="input-column">
              <h5>Velocidad</h5>
              <select
                name="velocidad"
                value={formData.velocidad}
                onChange={handleseleccionarAudio}
                style={{ width: "200px", height: "40px", margin: "10px" }}
              >
                <option value="">Seleccione una velocidad</option>
                {velocidades.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-column">
              <h5>Sonido Velocidad</h5>
              <input
                type="text"
                name="sonidoVelocidad"
                value={formData.sonidoVelocidad}
                onChange={handleseleccionarAudio}
                style={{ width: "150px" }}
              />
            </div>
          </div>

          <audio controls>
              <source src={audio} type="audio/mpeg" />
              Tu navegador no admite la reproducción de audio.
            </audio>
          <div>
            <h5>Sonido Geocerca</h5>
            <input
              type="text"
              name="sonidoGeocerca"
              value={formData.sonidoGeocerca}
              onChange={handleInputChange}
              style={{ width: "150px" }}
            />
          </div>

          {/*
            <button variant="secondary" onClick={handleClose}>
              Cerrar
            </button> 
            */}
          <button variant="primary" onClick={handleSave}>
            Guardar
          </button>

          <div style={{ height: "220px", margin: "10px" }}>
            <h5>Mapa</h5>

            <Map
              google={window.google}
              zoom={13}
              style={{ height: "220px", width: "90%" }}
              initialCenter={{
                lat: parseFloat(formData.latitud) || 37.7749, // San Francisco Latitud predeterminada
                lng: parseFloat(formData.longitud) || -122.4194, // San Francisco Longitud predeterminada
              }}
            >
              {formData.latitud && formData.longitud ? (
                <Marker
                  position={{
                    lat: parseFloat(formData.latitud),
                    lng: parseFloat(formData.longitud),
                  }}
                />
              ) : null}
            </Map>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

CoordenadasModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  cerrar: PropTypes.func.isRequired,
};

export default CoordenadasModal;
