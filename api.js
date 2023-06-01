//exports.handler = async (event) => {

const dbocategoria = require('./Routes/getData');
const security = require('./Seguridad/Security')
const jwt = require('jsonwebtoken');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { request, res } = require('express');
var CryptoJS = require('crypto-js')

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
        try {

            parametros = [{
                "operacion":'L',
                "sub_operacion":'V',
                "correo":CryptoJS.AES.decrypt(request.body.correo, 'user2023').toString(CryptoJS.enc.Utf8),
                "pass":CryptoJS.AES.decrypt(request.body.pass, 'pass2023').toString(CryptoJS.enc.Utf8),
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                if(result == 1){
                    res.status(500).send("Revisa la parametrización enviada a la base de datos.");
                }else{
                    if(result[0].resp == "Si"){
                        security.creaToken(result[0].usuario, result[0].id_login).then((result)=>{
                            res.json([{"token":result,"resp":"Si", "id_login":result[0].id_login}]);    
                        })
                    }else{
                        res.json([{"resp":"No"}])
                        //res.status(300).send("Verfica los datos ingresados");
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

    router.route('/login').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'L',
                "sub_operacion":'U',
                "correo":request.body.correo,
                "sp":"principal_productor"
            }]
            dbocategoria.getData(parametros).then(result => {
                            res.json(result);    
            })
     
        } catch (error) {
            res.status(100).send("Revisa la estructura de la parametrización.");
        }
    })

    router.route('/incripcion').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'L',
                "sub_operacion":'N',
                "correo":request.body.correo,
                "pass":request.body.pass,
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

    
    //INSERTAMOS VEHICULO DE TRANSPORTE
    router.route('/transporte').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'T',
                "sub_operacion":'I',
                "marca":request.body.marca,
                "color":request.body.color,
                "placa":request.body.placa,
                "correo":request.body.correo,
                "url_img":request.body.url_img,
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

    //BUSCAMOS TODOS LOS VEHICULOS REGISTRADOS PARA PODER TRANSPORTAR
    router.route('/get_transporte').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'T',
                "sub_operacion":'S',
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

    router.route('/cuenta_pendiente').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'C',
                "sub_operacion":'S',
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

    router.route('/get_cuenta_envio').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'C',
                "sub_operacion":'E',
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

    router.route('/cuenta_envio').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'E',
                "sub_operacion":'I',
                "correo":request.body.correo,
                "peso":request.body.peso,
                "placa":request.body.placa,
                "conductor":request.body.conductor,
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

    router.route('/envios_benef').get((request,res)=>{
        try {
            parametros = [{
                "operacion":'E',
                "sub_operacion":'S',
                "id_generico":0,
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

    router.route('/get_conductor').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'P',
                "sub_operacion":'S',
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

    router.route('/conductor').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'P',
                "sub_operacion":'I',
                "nombres":request.body.nombres,
                "apellidos":request.body.apellidos,
                "dpi":request.body.dpi,
                "foto_perfil":request.body.foto_perfil,
                "foto_licencia":request.body.foto_licencia,
                "foto_dpi":request.body.foto_dpi,
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

    router.route('/conductor').delete((request,res)=>{
        try {
            parametros = [{
                "operacion":'P',
                "sub_operacion":'U',
                "id_generico":request.query.id_conductor,
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

    router.route('/rechaza_cuenta').post((request,res)=>{
        try {
            console.log(request.body.id)
            parametros = [{
                "operacion":'C',
                "sub_operacion":'R',
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

    router.route('/get_qr').post((request,res)=>{
    try {
        parametros = [{
            "operacion":'G',
            "sub_operacion":'S',
            "codigo_qr":request.body.codigo_qr,
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

    router.route('/actualiza_qr').post((request,res)=>{
        try {
            parametros = [{
                "operacion":'G',
                "sub_operacion":'U',
                "codigo_qr":request.body.codigo_qr,
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