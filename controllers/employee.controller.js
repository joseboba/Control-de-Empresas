"use sctrict";

var Employee = require("../models/employee.model");
var Enterprise = require("../models/enterprise.model");

function saveEmployee(req, res) {
  let id = req.params.id;
  let params = req.body;
  let employee = new Employee();

  if (id != req.enterprise.sub) {
    res.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else if (
    params.name &&
    params.lastname &&
    params.email &&
    params.dpi &&
    params.departament &&
    params.position &&
    params.enterprise
  ) {
    Employee.findOne({ dpi: params.dpi }, (err, employeeFound) => {
      if (err) {
        res.status(500).send(err);
      } else if (employeeFound) {
        res
          .status(403)
          .send({ message: "Este empleado ya fue asignado:", employeeFound });
      } else {
        employee.name = params.name;
        employee.lastname = params.lastname;
        employee.phone = params.phone;
        employee.email = params.email;
        employee.position = params.position;
        employee.departament = params.departament;
        employee.salary = params.salary;
        employee.enterprise = params.enterprise;
        employee.supervisor = params.supervisor;
        employee.dpi = params.dpi;
        employee.save((err, employeeSaved) => {
          if (err) {
            res.status(500).send(err);
          } else if (employeeSaved) {
            Enterprise.findByIdAndUpdate(
              id,
              { $push: { employees: employee } },
              { new: true },
              (errE, enterpriseUpdated) => {
                if (errE) {
                  res.send(errE);
                } else if (enterpriseUpdated) {
                  res.send({
                    message: "Se ha guardado el siguiente empleado:",
                    employeeSaved,
                  });
                } else {
                  Employee.findByIdAndRemove(
                    employee._id,
                    (err, employeeDelete) => {
                      if (err) {
                        res.send(err);
                      } else if (employeeDelete) {
                        res.send({
                          message:
                            "Como no se ha asignado a una empresa se ha eliminado el usuario",
                        });
                      }
                    }
                  );
                }
              }
            );
          } else {
            res
              .status(418)
              .send({ message: "No se ha podido guardar el empleado" });
          }
        });
      }
    });
  } else {
    res.send({ message: "Ingrese los campos necesarios" });
  }
}

function updateEmployee(req, res) {
  let enterpriseId = req.params.idE;
  let employeeId = req.params.id;
  let change = req.body;

  if (enterpriseId != req.enterprise.sub) {
    res.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else {
    Employee.findOne(
      {
        $or: [
          { dpi: change.dpi },
          { email: change.email },
          { phone: change.phone },
        ],
      },
      (err, employeeFound) => {
        if (err) {
          res.status(500).send(err);
        } else if (employeeFound) {
          res.send({ message: "No puede asignar valores de otros empleados" });
        } else {
          Employee.findByIdAndUpdate(
            employeeId,
            change,
            { new: true },
            (err, employeeChanged) => {
              if (err) {
                res.status(500).send(err);
              } else if (employeeChanged) {
                res.send(employeeChanged);
              } else {
                res.status(404).send({ message: "Ingrese un ID existente" });
              }
            }
          );
        }
      }
    );
  }
}

function removeEmployee(req, res) {
  let employeeId = req.params.id;
  let id = req.params.idE;

  if (id != req.enterprise.sub) {
    res.status(403).send({ message: "No tienes acceso a esta ruta" });
  } else {
    Employee.findById(employeeId, (err, employeeFound) => {
      if (err) {
        res.status(500).send(err);
      } else if (employeeFound) {
        Employee.findByIdAndRemove(employeeId, (err, employeeDelete) => {
          if (err) {
            res.status(500).send(err);
          } else if (employeeDelete) {
            Enterprise.findByIdAndUpdate(
              id,
              { $pull: { employees: { $in: [{ _id: employeeId }] } } },
              { new: true },
              (err, employeeDeleted) => {
                if (err) {
                  res.status(500).send(err);
                } else if (employeeDeleted) {
                  res.send({
                    message: "El empleado eliminado fue:",
                    employeeDeleted,
                    employeeDelete,
                  });
                } else {
                  res
                    .status(404)
                    .send({ message: "Este empleado ya fue eliminado" });
                }
              }
            );
          } else {
            res.send({ message: "No se ha eliminado el empleado" });
          }
        });
      } else {
        res.status(404).send({ message: "Este usuario ya fue eliminado" });
      }
    });
  }
}

function searchEmployee(req, res) {
  let params = req.body;
  let enterpriseId = req.params.idE;

  if (enterpriseId != req.enterprise.sub) {
    res.send({ message: "No tiene acceso a esta ruta" });
  } else {
    Enterprise.findById(enterpriseId, (err, found) => {
      if (err) {
        res.status(500).send(err);
      } else if (found) {
        Employee.find(
          {
            $or: [
              { name: { $regex: "^" + params.name, $options: "i" } },
              { position: { $regex: "^" + params.position, $options: "i" } },
              {
                departament: {
                  $regex: "^" + params.departament,
                  $options: "i",
                },
              },
              { _id: params.id },
            ],
          },
          (err, employeesFound) => {
            if (err) {
              res.status(500).send(err);
            } else if (employeesFound) {
              res.send(employeesFound);
            } else {
              res
                .status(404)
                .send({ message: "No hay coincidencias con sus parametros" });
            }
          }
        );
      } else {
        res.status(404).send({ message: "No existen empresas" });
      }
    });
  }
}

function getEmployees(req, res) {
  let id = req.params.id;

  Enterprise.findById(id, (err, found) => {
    if (err) {
      res.status(500).send(err);
    } else if (found) {
      Employee.find({}, (err, employees) => {
        if (err) {
          res.status(500).send(err);
        } else if (employees) {
          res.send(employees);
        } else {
          res.status(404).send({ message: "No existen registros todavia" });
        }
      });
    } else {
      res.status(404).send({ message: "No existen empresas" });
    }
  });
}

module.exports = {
  saveEmployee,
  updateEmployee,
  removeEmployee,
  searchEmployee,
  getEmployees,
};
