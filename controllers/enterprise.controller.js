"use strict";

var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var Enterprise = require("../models/enterprise.model");
var Employee = require("../models/employee.model");
var Store = require("../models/store.model");
var Product = require("../models/product.model");

//LOGIN
function login(req, res) {
  var params = req.body;

  if (params.user && params.password) {
    Enterprise.findOne({ user: params.user }, (err, enterpriseFound) => {
      if (err) {
        res.status(500).send(err);
      } else if (enterpriseFound) {
        bcrypt.compare(
          params.password,
          enterpriseFound.password,
          (err, password) => {
            if (err) res.status(500).send(err);
            else if (password)
              res.send({ token: jwt.createToken(enterpriseFound) });
          }
        );
      } else {
        res.status(404).send({ message: "Usuario o contraseña incorrectos" });
      }
    });
  } else {
    res
      .status(404)
      .send({ message: "Ingrese los datos necesarios para iniciar sesion" });
  }
}

//GUARDAR
function saveEnterprise(req, res) {
  var enterprise = new Enterprise();
  var params = req.body;

  if (
    params.CEO &&
    params.name &&
    params.email &&
    params.phones &&
    params.direction &&
    params.socialApproach &&
    params.password
  ) {
    Enterprise.findOne({ name: params.name }, (err, enterpriseFound) => {
      if (err) {
        res.status(500).send(err);
      } else if (enterpriseFound) {
        res.send({
          message:
            "Esta empresa ya fue creada, no puedes registrar dos veces la misma empresa",
        });
      } else {
        enterprise.name = params.name;
        enterprise.email = params.email;
        enterprise.user = enterprise._id;
        enterprise.password = params.password;
        enterprise.socialMedia = params.socialMedia;
        enterprise.phones = params.phones;
        enterprise.direction = params.direction;
        enterprise.CEO = params.CEO;
        enterprise.socialApproach = params.socialApproach;
        bcrypt.hash(params.password, null, null, (err, password) => {
          if (err) {
            res.status(500).send({ message: "Error en el servidor", err });
          } else if (password) {
            enterprise.password = password;

            enterprise.save((err, enterpriseSaved) => {
              if (err) {
                res.status(500).send(err);
              } else if (enterpriseSaved) {
                res.send(enterpriseSaved);
              } else {
                res.status(418).send({ message: "No se guardó la empresa" });
              }
            });
          } else {
            res.send(404).send({ message: "Error al encriptar contraseña" });
          }
        });
      }
    });
  } else {
    res.send({ message: "Ingrese los campos necesarios" });
  }
}

//ACTUALIZAR
function updateEnterprise(req, res) {
  let enterpriseId = req.params.id;
  let update = req.body;

  if (enterpriseId != req.enterprise.sub) {
    res
      .status(403)
      .send({ message: "No tiene permisos para ingresar a la ruta" });
  } else {
    Enterprise.findByIdAndUpdate(
      enterpriseId,
      update,
      { new: true },
      (err, enterpirseUpdated) => {
        if (err) {
          res.status(500).send(err);
        } else if (enterpirseUpdated) {
          res.send({
            message: "Los cambios han sido efectuados con exito",
            enterpirseUpdated,
          });
        } else {
          res.status(404).send({ message: "Ingrese un ID existente" });
        }
      }
    );
  }
}

//ELIMINAR
function removeEnterprise(req, res) {
  let enterpriseId = req.params.id;

  if (enterpriseId != req.enterprise.sub) {
    res.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else {
    Enterprise.findByIdAndRemove(enterpriseId, (err, found) => {
      if (err) {
        res.status(500).send(err);
      } else if (found) {
        if (found.employees.length > 0) {
          Employee.deleteMany({ enterprise: found.name }, (err, deleted) => {
            if (err) {
              res.status(500).send(err);
            } else if (deleted) {
              if (found.stores.length > 0) {
                Store.deleteMany({ _id: found.stores }, (err, deleted2) => {
                  if (err) {
                    res.status(500).send(err);
                  } else if (deleted2) {
                    if (found.prodcts.length > 0) {
                      Product.deleteMany(
                        { _id: found.products },
                        (err, deleted3) => {
                          if (err) {
                            res.status(500).send(err);
                          } else if (deleted3) {
                            res.send(found);
                          } else {
                            res.send(found);
                          }
                        }
                      );
                    } else {
                      res.send(found);
                    }
                  } else {
                    res
                      .status(404)
                      .send({ message: "No hay registros de tiendas" });
                  }
                });
              } else {
                res.send(found);
              }
            } else {
              res
                .status(404)
                .send({ message: "No hay registros de empleados" });
            }
          });
        } else {
          res.send(found);
        }
      } else {
        res.status(404).send({ message: "Esta empresa ya fue eliminada" });
      }
    });
  }
}

//CONTAR EMPLEADOS
function count(req, res) {
  let enterpriseId = req.params.id;
  Enterprise.findById(enterpriseId, (err, found) => {
    if (err) {
      res.status(500).send(err);
    } else if (found) {
      res.send({
        message:
          "La empresa contiene la siguiente cantidad de empleados activos: " +
          found.employees.length,
      });
    } else {
      res.status(404).send({ message: "No existe la empresa" });
    }
  });
}

function setProduct(req, res) {
  var params = req.body;
  var enterpriseId = req.params.idE;
  var storeId = req.params.idS;

  if (enterpriseId != req.enterprise.sub) {
    res.send({ message: "No tiene acceso a esta ruta" });
  } else {
    Store.findOne(
      { _id: storeId, product: { $elemMatch: { products: params.product } } },
      (err, found) => {
        if (err) {
          res.status(500).send(err);
        } else if (found) {
          res.send({ message: "Este producto aun esta en existencia" });
        } else {
          Product.findById(params.product, (err, pro) => {
            if (err) {
              res.status(500).send(err);
            } else if (pro && pro.stock - params.quantity >= 0) {
              var newQuantity = pro.stock - params.quantity;
              Product.findByIdAndUpdate(
                params.product,
                { stock: newQuantity, $push: { store: storeId } },
                { new: true },
                (err, added) => {
                  if (err) {
                    res
                      .status(500)
                      .send({ error: "Error interno del servidor", err });
                  } else if (added) {
                    Store.findByIdAndUpdate(
                      storeId,
                      {
                        $push: {
                          product: {
                            products: params.product,
                            quantity: params.quantity,
                          },
                        },
                      },
                      { new: true },
                      (err, updated) => {
                        if (err) {
                          res.status(500).send({ err });
                        } else if (updated) {
                          res.send({
                            "Producto asignado": updated.products,
                            updated,
                          });
                        } else {
                          res.status(400).send({
                            message: "No ha sido posible asignar el producto.",
                          });
                        }
                      }
                    );
                  } else {
                    res
                      .status(400)
                      .send({ message: "Sucursal no registrada." });
                  }
                }
              );
            } else {
              res.status(404).send({
                message: "El producto no existe o se encuentra agotado.",
              });
            }
          });
        }
      }
    );
  }
}

function getProduct(req, res) {
  let id = req.params.idE;

  if (id != req.enterprise.sub) {
    res.status(403).send({ message: "Usted no tiene acceso a esta ruta" });
  } else {
    Product.find({}, (err, found) => {
      if (err) {
        res.status(500).send(err);
      } else if (found) {
        res.send({
          message:
            "Estos son los productos existentes, stock actual y a que sucursal pertenece:",
          found,
        });
      }
    });
  }
}

function valueOnStore(req, res) {
  let id = req.params.idE;
  let params = req.body;
  if (id != req.enterprise.sub) {
    res.status(403).send({ message: "Usted no tiene acceso a esta ruta" });
  } else {
    Store.findOne({ _id: params.idS }, { product: 1 }, (err, found) => {
      if (err) {
        res.status(500).send(err);
      } else if (found) {
        res.send({ message: "Estos son los productos de su sucursal", found });
      } else {
        res.status(404).send({ message: "Su sucursal no existe" });
      }
    });
  }
}

module.exports = {
  login,
  saveEnterprise,
  updateEnterprise,
  removeEnterprise,
  count,
  setProduct,
  getProduct,
  valueOnStore,
};
