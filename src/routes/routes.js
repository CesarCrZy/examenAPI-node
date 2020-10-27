const express =require('express');
const router = express.Router();
const mysqlConnection = require('../database');

router.get('/api/GetAll', (req, res) => {
    mysqlConnection.query('SELECT * FROM articulos', (err, rows, fields) => {
        if(!err) {
            res.json(rows).header('Access-Control-Allow-Origin: *');
        }else{
           console.log(err); 
        }
    });
});

router.get('/api/GetOne/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM articulos WHERE id = ?', [id], (err, rows, fields) => {
        if(!err) {
            res.json(rows[0]).header('Access-Control-Allow-Origin: *');
        }else{
           console.log(err); 
        }
    });
});

router.post('/api/Post', (req, res) => {
    const { id, precio, nombre, topemin, topemax, inventario} = req.body;
    const query = `
        CALL articulos(?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [id, precio, nombre, topemin, topemax, inventario], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Articulo insertado'});
        } else{
            console.log(err);
        }
    });
});

router.put('/api/Put/:id', (req, res) => {
    const {  precio, nombre, topemin, topemax, inventario} = req.body;
    const { id } = req.params;
    const query = `
        CALL articulos(?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [id, precio, nombre, topemin, topemax, inventario], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Articulo Actualizado'});
        } else{
            console.log(err);
        }
    });
});

router.delete('/api/Delete/:id', (req, res) => {
    const {id} = req.params;
    mysqlConnection.query('DELETE FROM articulos WHERE id= ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json({Status: 'Articulo Eliminado'});
        } else {
            console.log(err);
        }
    });
});


router.get('/api/GetProveedores', (req, res) => {
    mysqlConnection.query('SELECT * FROM proveedores', (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        }else{
           console.log(err); 
        }
    });
});

router.get('/api/GetAlmacenes', (req, res) => {
    mysqlConnection.query('SELECT * FROM almacenes', (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        }else{
           console.log(err); 
        }
    });
});

router.get('/api/GetRecepciones', (req, res) => {
    mysqlConnection.query(`SELECT articulos.id, articulos.nombre, articulos.topemin, articulos.topemax, proveedores.nombre as proveedor from articulos
    inner join ordenes on ordenes.idarticulo = articulos.id
    inner join proveedores on proveedores.id = ordenes.idproveedor
    where ordenes.tipoorden = 'Recepcion';`, (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        }else{
           console.log(err); 
        }
    });
});

router.get('/api/GetRecepcion/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query(`SELECT articulos.nombre, articulos.topemin, articulos.topemax, articulos.inventario, ordenes.idproveedor from articulos
    inner join ordenes on ordenes.idarticulo = articulos.id
    where articulos.id = ?;`, [id], (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        }else{
           console.log(err); 
        }
    });
});

router.get('/api/GetSalidas', (req, res) => {
    mysqlConnection.query(`SELECT articulos.id, articulos.nombre, articulos.topemin, articulos.topemax, proveedores.nombre as proveedor from articulos
    inner join ordenes on ordenes.idarticulo = articulos.id
    inner join proveedores on proveedores.id = ordenes.idproveedor
    where ordenes.tipoorden = 'Salida';`, (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        }else{
           console.log(err); 
        }
    });
});

router.post('/api/PostOrden', (req, res) => {
    const { articulo, proveedor, tipoorden} = req.body;
    const query = `INSERT INTO ordenes (idarticulo, idproveedor, tipoorden)
    VALUES (?, ?, ?);`;
    mysqlConnection.query(query, [articulo, proveedor, tipoorden], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Orden insertada'});
        } else{
            console.log(err);
        }
    });
});

router.post('/api/PostRecepcion', (req, res) => {
    const { articulo, tiporecepcion, inventario, idproveedor, almacen} = req.body;
    const query = `INSERT INTO recepcion (idarticulo, tiporecepcion, cantidad, idproveedor, idalmacen)
    VALUES (?, ?, ?, ?, ?);`;
    mysqlConnection.query(query, [articulo, tiporecepcion, inventario, idproveedor, almacen], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Recepcion insertada'});
        } else{
            console.log(err);
        }
    });
});

router.post('/api/PostSalida', (req, res) => {
    const { articulo, almacen, idproveedor, tiposalida, cantidad} = req.body;
    const query = `INSERT INTO salidas (idarticulo, idalmacen, idproveedor, tiposalida, cantidad)
    VALUES (?, ?, ?, ?, ?);`;
    mysqlConnection.query(query, [ articulo, almacen, idproveedor, tiposalida, cantidad], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Salida insertada'});
        } else{
            console.log(err);
        }
    });
});

router.put('/api/PutInventario/:id', (req, res) => {
    const { inventario } = req.body;
    const { id } = req.params;
    const query = `Update articulos set inventario = inventario  + ? where id=?;`;
    mysqlConnection.query(query, [inventario, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Inventario Actualizado'});
        } else{
            console.log(err);
        }
    });
});

router.put('/api/PutInventarioSalida/:id', (req, res) => {
    const { cantidad } = req.body;
    const { id } = req.params;
    const query = `Update articulos set inventario = inventario  - ? where id=?;`;
    mysqlConnection.query(query, [cantidad, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Inventario Actualizado'});
        } else{
            console.log(err);
        }
    });
});

module.exports = router;