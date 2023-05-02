//exports.handler = async (event) => {

const dbocategoria = require('./Routes/getData');
const security = require('./Seguridad/Security')
const jwt = require('jsonwebtoken');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { request, res } = require('express');

var app = express();
var router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api',router);
app.use('*', (req, res) => res.status(404).send("No existe la ruta de la petición. :d"));

try {

    //CREAMOS UNA CUENTA DEL CLIENTE
    router.route('/count').post((request,res)=>{
        let parametros   = request.body
        try {
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    if(result[0].resp == "Si"){
                        security.creaToken(result[0].usuario, result[0].id_login).then((result)=>{
                            res.json([{"token":result,"resp":"Si"}]);    
                        })
                    }else{
                        res.status(300).send("Verfica los datos ingresados");
                    }
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    //OBTENEMOS LOS DATOS DEL USUARIO 
    router.route('/count').get((request,res)=>{
        try {
        security.validaSeguridad(request.headers.authorization).then((resp)=>{
            if (resp == 'N' || !resp){
                return res.status(401).json({ error: 'No autorizado :D' });        
            }else if(resp == 'T') {
                return res.status(403).json({ error: 'No autorizado, token expiró' });        
            }      
            parametros = [{
                "operacion":"L",
                "sub_operacion":"B",
                "sp":"principal_beneficio"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        })
      
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    //VALIDAMOS LAS CREDENCIALES DE LOGIN
    router.route('/login').get((request,res)=>{
        try {
            parametros = [{
                "operacion":'L',
                "sub_operacion":'V',
                "correo":request.query.correo,
                "pass":request.query.pass,
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    if(result[0].resp == "Si"){
                        security.creaToken(result[0].usuario, result[0].id_login).then((result)=>{
                            res.json(result);    
                        })
                    }else{
                        res.status(300).send("Las credenciales no coinciden.");
                    }   
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/transporte').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'T',
                "sub_operacion":'I',
                "marca":request.body.marca,
                "color":request.body.color,
                "placa":request.body.placa,
                "correo":request.body.correo,
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                            res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/transporte').get((request,res)=>{
        try {
            parametros = [{
                "operacion":'T',
                "sub_operacion":'S',
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/transporte').delete((request,res)=>{
        try {
            parametros = [{
                "operacion":'T',
                "sub_operacion":'D',
                "id_generico":request.query.id_transporte,
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/cuenta').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'C',
                "sub_operacion":'I',
                "etiqueta":request.body.etiqueta,
                "peso":request.body.peso,
                "parcialidades":request.body.parcialidades,
                "correo":request.body.correo,
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/cuenta').get((request,res)=>{
        try {
            parametros = [{
                "operacion":'C',
                "sub_operacion":'S',
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/cuenta').put((request,res)=>{
        try {
            console.log(request.query.param3)
            parametros = [{
                "operacion":'C',
                "sub_operacion":'U',
                "id_generico":request.query.id_generico,
                "estado":request.query.estado,
                "correo":request.query.correo,
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/cuenta_envio').get((request,res)=>{
        try {
            parametros = [{
                "operacion":'C',
                "sub_operacion":'E',
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/cuenta_envio').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'E',
                "sub_operacion":'I',
                "correo":request.body.correo,
                "peso":request.body.peso,
                "placa":request.body.placa,
                "id_generico":request.body.id_generico,
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/envios').get((request,res)=>{
        try {
            parametros = [{
                "operacion":'E',
                "sub_operacion":'S',
                "id_generico":request.query.id_generico,
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    res.json(result);    
                }
            })
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })
    

} catch (error) {
    res.status(200).send("Revisa la estructura de la parametrización.");
}


var port = process.env.PORT || 8097;
app.listen(port);
console.log('api iniciado en el puerto: ' + port);
//}