"use strict";

var Store = require("../models/store.model");
var Enterprise = require("../models/enterprise.model");
var Product = require("../models/product.model");

//CREATE STORE
function saveStore(req, res) {
  let id = req.params.id;
  let params = req.body;
  let store = new Store();

  if (id != req.enterprise.sub) {
    res.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else if (
    params.direction &&
    params.phone &&
    params.manager &&
    params.email
  ) {
    Enterprise.findById(id, (err, enterpriseFound) => {
      if (err) {
        res.status(500).send(err);
      } else if (enterpriseFound) {
        Store.findOne({ phone: params.phone }, (err, found) => {
          if (err) {
            res.status(500).send(err);
          } else if (found) {
            res
              .status(406)
              .send({
                message:
                  "No puede crear una empresa con un telefono ya existente",
              });
          } else {
            store.mall = params.mall;
            store.direction = params.direction;
            store.phone = params.phone;
            store.email = params.email;
            store.manager = params.manager;
            store.save({}, (err, storeCreate) => {
              if (err) {
                res.status(500).send(err);
              } else if (storeCreate) {
                Enterprise.findByIdAndUpdate(
                  id,
                  { $push: { stores: store } },
                  { new: true },
                  (err, enterpriseUpdate) => {
                    if (err) {
                      res.status(500).send(err);
                    } else if (enterpriseUpdate) {
                      res.send({
                        message: "Se ha guradado la siguiente tienda: ",
                        storeCreate,
                      });
                    } else {
                      res
                        .status(418)
                        .send({ message: "No se pudo crear la tienda" });
                    }
                  }
                );
              } else {
                res
                  .status(418)
                  .send({ message: "No se ha podido guardar la empresa" });
              }
            });
          }
        });
      } else {
        res
          .status(404)
          .send({ message: "La empresa no existe, no puede crear tiendas" });
      }
    });
  } else {
    res.status(400).send({ message: "No existe la empresa" });
  }
}

function updateStore(req, res) {
  let params = req.body;
  let id = req.params.id;
  let enterpriseId = req.params.idE;
  if (enterpriseId != req.enterprise.sub) {
    res.status(403).send({ message: "No tiene acceso a la ruta" });
  } else {
    Store.findOne({ phone: params.phone }, (err, found) => {
      if (err) {
        res.status(500).send(err);
      } else if (found) {
        res
          .status(406)
          .send({ message: "No puede cambiar el teleono a uno ya existente" });
      } else {
        Store.findByIdAndUpdate(
          id,
          params,
          { new: true },
          (err, storeChanged) => {
            if (err) {
              res.status(500).send(err);
            } else if (storeChanged) {
              res.send(storeChanged);
            } else {
              res
                .status(418)
                .send({ message: "No se pudo actualizar la tienda" });
            }
          }
        );
      }
    });
  }
}

function removeStore(req, res) {
  let storeId = req.params.id;
  let enterpriseId = req.params.idE;

  if (enterpriseId != req.enterprise.sub) {
    req.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else {
    Store.findByIdAndRemove(storeId, (err, deleted) => {
      if (err) {
        res.status(500).send(err);
      } else if (deleted) {
        Enterprise.findByIdAndUpdate(
          enterpriseId,
          { $pull: { store: storeId } },
          { new: true },
          (err, updated) => {
            if (err) {
              res.status(500).send(err);
            } else if (updated) {
              res.send({
                message: "Se ha eliminado la seiguiente tienda: ",
                deleted,
              });
            }
          }
        );
      } else {
        res.status(404).send({ message: "Ya ha sido eliminada la tienda" });
      }
    });
  }
}

function searchStores(req, res) {
  let params = req.body;
  let enterpriseId = req.params.idE;

  if (enterpriseId != req.enterprise.sub) {
    res.status(403).send({ message: "No tiene acceso a esta ruta" });
  } else {
    Store.find(
      {
        $or: [
          { name: { $regex: "^" + params.name, $options: "i" } },
          { manager: { $regex: "^" + params.manager, $options: "i" } },
          { email: { $regex: "^" + params.email, $options: "i" } },
          { _id: params.id },
        ],
      },
      (err, found) => {
        if (err) {
          res.status(500).send(err);
        } else if (found) {
          res.send(found);
        } else {
          res.status(404).send({ message: "No existe su registro" });
        }
      }
    );
  }
}

function getStores(req, res) {
  let enterpriseId = req.params.idE;

  if (enterpriseId != req.enterprise.sub) {
    res.status(403).send({ message: "No tiene acceso a la ruta" });
  } else {
    Store.find({}, (err, found) => {
      if (err) {
        res.status(500).send(err);
      } else if (found) {
        res.send(found);
      } else {
        res.status(404).send({ message: "No hay registros aún" });
      }
    });
  }
}

module.exports = {
  saveStore,
  updateStore,
  removeStore,
  searchStores,
  getStores,
};
