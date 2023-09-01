import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import '../Styles/Rutas.css';
import { useNavigate } from 'react-router-dom';
import { useListarElementos } from '../Hooks/CRUDHooks';
import { rutasxEmpresaURL } from '../API/apiurls';

export function Rutas() {
    const [datos, setDatos] = useState([]);
    const navigation = useNavigate();
    const empresaid = localStorage.getItem('empresa')
    useListarElementos(`${rutasxEmpresaURL}${empresaid}`, datos, setDatos);

    const handleVerCoordenadas = async(dato) => {
        await localStorage.setItem('nomRuta', dato.nomruta)
        navigation(`/coordenadas/${dato.id}`);
    }
 
    return (
        <div className='camionesMenu-contenedor'>
            <h1>Rutas de la empresa {empresaid}</h1>
            <div className="card-container">
                {datos.map((ruta) => (
                    <Card key={ruta.id} style={{ width: '18rem', marginBottom: '20px' }}>
                        <Card.Body>
                            <Card.Title>ID: {ruta.id}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nombre de Ruta: {ruta.nomruta}</Card.Subtitle>
                            <Card.Text>Empresa: {ruta.empresasModel.nombre}</Card.Text>
                            <Card.Text>País: {ruta.paisesModel.nombre}</Card.Text>
                        </Card.Body>
                        <Button onClick={() => handleVerCoordenadas(ruta)}>Ver Coordenadas</Button>
                        <Button>Descargar txt</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
