var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM medicos', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('medicos', { title: 'medicos', medicos: results,opcion: 'disabled', estado: true })
        }
    });
});

router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT * FROM medicos', (error, results) => {
    if (error) {
    console.log("Error en la consulta", error)
    res.status(500).send("Error en la consulta")
    } else {
    res.render('medicos', { title: 'medicos', claveSeleccionada: clave, medicos: results, opcion: 'disabled', estado: false })
    }
    });
    }); 
    // actualizar medicos
    router.post('/actualizar/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    const nombre = req.body.medico;
    const apellidos = req.body.apellido;
    const correo = req.body.correo;
    const especialidad = req.body.consultorio;
    const consultorio = req.body.especialidad;
    connection.query(`UPDATE medicos SET nombres='${nombre}', apellidos='${apellidos}', especialidad='${especialidad}', consultorio='${consultorio}', correo='${correo}' WHERE cedula=${cedula}`, (error, result) => {
    if (error) {
    console.log("Ocurrio un error en la ejecución", error)
    res.status(500).send("Error en la consulta");
    } else {
    res.redirect('/medicos');
    }
    });
    })

router.get('/agregar-medico', function (req, res, next) {
    connection.query('SELECT especialidad FROM medicos', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {

            let especialidades = ['Medicina general', 'Cardiología', 'Medicina interna', 'Dermatología', 'Rehabilitación física', 'Psicología', 'Odontología', 'Radiología']
            let resultsEspecialidades = results.map(objeto => objeto.especialidad);//separar packete
            let resultsSinRepetidos = especialidades.filter((elemento) => {//filtrar repetidos
                return !resultsEspecialidades.includes(elemento);
            });
            res.render('registro-medicosHB', { layout: 'registro', especialidades: resultsSinRepetidos })
        }
    });
});

//Agregar medicos
router.post('/agregar', (req, res) => {
    const cedula = req.body.cedula;
    const nombre = req.body.nombre;
    const apellidos = req.body.apellido;
    const correo = req.body.correo;
    const consultorio = req.body.consultorio;
    const especialidad = req.body.especialidad;
    connection.query(`INSERT INTO medicos (cedula, nombres, apellidos, especialidad,consultorio, correo) VALUES (${cedula},'${nombre}', '${apellidos}', '${especialidad}', '${consultorio}', '${correo}')`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/medicos');
        }
    });
})

//eliminar medicos
router.get('/eliminar/:cedula', function (req, res, next) {
    const cedula = req.params.cedula
    connection.query(`DELETE FROM cita_medica WHERE id_medico=${cedula}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query(`DELETE FROM medicos WHERE cedula=${cedula}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/medicos')
                }
            });
        }
    });
});
module.exports = router;