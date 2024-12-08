const { Router } = require("express");
const booksManagementController = require("../controller/booksManagementController");
const validateToken = require("../middlewares/validateToken");
const router = Router();

const booksRoutes = () => {
  router.post(
    "/bookmanagement",
    validateToken,
    booksManagementController.create
  );
  router.get(
    "/booksmanagement",
    validateToken,
    booksManagementController.getAll
  );
  router.put(
    "/bookmanagement/:id",
    validateToken,
    booksManagementController.update
  );
  router.delete(
    "/bookmanagement/:id",
    validateToken,
    booksManagementController.destroy
  );
  router.get(
    "/booksmanagement/bookreport",
    validateToken,
    booksManagementController.bookReport
  );
  router.get(
    "/booksmanagement/usersreport",
    validateToken,
    booksManagementController.usersReport
  );

  return router;
};

module.exports = booksRoutes;
