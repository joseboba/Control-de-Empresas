"use strict";

var Store = require("../models/store.model");
var Enterprise = require("../models/enterprise.model");
var Product = require("../models/product.model");
var Store = require("../models/store.model");

function saveProduct(req, res) {
  let params = req.body;
  let enterpriseId = req.params.idE;
  let product = new Product();

  if (enterpriseId != req.enterprise.sub) {
    res.status(403).send({ message: "No tiene acceso a esta ruta" });
  } else {
    Enterprise.findById(enterpriseId, (err, found) => {
      if (err) {
        res.status(500).send(err);
      } else if (found) {
        if (params.name && params.stock && params.description) {
          product.name = params.name;
          product.description = params.description;
          product.priceCost = params.priceCost;
          product.priceSell = params.priceSell;
          product.brand = params.brand;
          product.provider = params.provider;
          product.stock = params.stock;
          product.enterprise = params.enterprise;
          product.save((err, saved) => {
            if (err) {
              res.status(500).send(err);
            } else if (saved) {
              Enterprise.findByIdAndUpdate(
                enterpriseId,
                { $push: { products: product } },
                { new: true },
                (err, savedP) => {
                  if (err) {
                    res.status(500).send(err);
                  } else if (savedP) {
                    res.send({ savedP });
                  } else {
                    res
                      .status(418)
                      .send({
                        message:
                          "No se ha podido agregar el producto al stock de la empresa",
                      });
                  }
                }
              ).populate("products");
            } else {
              res
                .status(418)
                .send({ message: "No se ha guardado el producto" });
            }
          });
        } else {
          res.status(404).send({ message: "Ingrese los campos necesarios" });
        }
      } else {
        res.status(404).send({ message: "No existe la empresa" });
      }
    });
  }
}

function removeProduct(req, res) {
  let id = req.params.id;
  let storeId = req.params.idS;
  let enterpriseId = req.params.idE;
  let storeOrEnterprise = req.body;

  if (enterpriseId != req.enterprise.sub) {
    res.status(403).send({ message: "No tiene acceso a estas rutas" });
  } else {
    if (storeOrEnterprise.params == "Store") {
      Product.findByIdAndRemove(id, (err, productDeleted) => {
        if (err) {
          res.status(500).send(err);
        } else if (productDeleted) {
          Store.findById(storeId, (err, find) => {
            if (err) {
              res.status(500).send(err);
            } else if (find) {
              Store.findByIdAndUpdate(
                storeId,
                { $pull: { product: { _id: storeOrEnterprise.id } } },
                { new: true },
                (err, deleted) => {
                  if (err) {
                    res.status(500).send(er);
                  } else if (deleted) {
                    res.send(deleted);
                  } else {
                    res
                      .status(418)
                      .send({ message: "No se ha eliminado el producto" });
                  }
                }
              );
            }
          });
        } else {
          res
            .status(418)
            .send({ message: "No se ha podido eliminar el producto" });
        }
      });
    } else {
      Enterprise.findByIdAndUpdate(
        enterpriseId,
        { $pull: { products: id } },
        { new: true },
        (err, deletedE) => {
          if (err) {
            res.status(500).send(er);
          } else if (deletedE) {
            Store.findById(storeId, (err, find) => {
              if (err) {
                res.status(500).send(err);
              } else if (find) {
                Store.findByIdAndUpdate(
                  storeId,
                  { $pull: { product: { _id: storeOrEnterprise.id } } },
                  { new: true },
                  (err, deleted) => {
                    if (err) {
                      res.status(500).send(er);
                    } else if (deleted) {
                      res.send(deleted);
                    } else {
                      res
                        .status(418)
                        .send({ message: "No se ha eliminado el producto" });
                    }
                  }
                );
              }
            });
          } else {
            res.status(418).send({ message: "No se ha eliminado el producto" });
          }
        }
      );
    }
  }
}

function updateProduct(req, res) {
  let id = req.params.id;
  let enterpriseId = req.params.idE;
  let params = req.body;

  if (enterpriseId != req.enterprise.sub) {
    res.status(403).send({ message: "Usted no tiene acceso a esta ruta" });
  } else {
    if (params.stock) {
      Product.findByIdAndUpdate(
        id,
        { stock: stock + params.stock },
        { new: true },
        (err, updated) => {
          if (err) {
            res.status(500).send(err);
          } else if (updated) {
            res.send({
              message: "Se ha actualizado el stock correctamente:",
              updated,
            });
          } else {
            res.status(418).send({ message: "Codigo de producto incorrecto" });
          }
        }
      );
    } else {
      Product.findByIdAndUpdate(id, params, { new: true }, (err, updated) => {
        if (err) {
          res.status(500).send(err);
        } else if (updated) {
          res.send({ message: "Se ha actualizado correctamente:", updated });
        } else {
          res.status(418).send({ message: "Codigo de producto incorrecto" });
        }
      });
    }
  }
}

module.exports = {
  saveProduct,
  removeProduct,
  updateProduct,
};

// Product.findByIdAndRemove(id, (err, removed) =>{
//     if(err){
//         res.status(500).send(err);
//     }else if(removed){
//         Enterprise.findByIdAndUpdate(storeOrEnterprise.idE, {$pull:{$in:[{stock:{_id: id}}]}}, {new: true}, (err, stockErased) =>{
//             if(err){
//                 res.status(500).send(err);
//             }else if(stockErased){
//                 Store.findByIdAndUpdate(storeOrEnterprise.idS, {$pull:{$in:[{stock:{_id: id}}]}}, {new: true},(err, foundS) =>{
//                     if(err){
//                         res.status(500).send(err);
//                     }else if(foundS){
//                         res.send({message: 'Se ha eliminado el siguiente producto: '})
//                     }
//                 });
//             }else{
//                 res.status(418).send({message: 'No se pudo eliminar de la empresa'})
//             }
//         });
//     }else{
//         res.status(404).send({message: 'Ya se eliminó el registro'})
//     }
// });
