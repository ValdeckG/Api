const BooksManagement = require("../models/BooksManagement");
const Users = require("../models/Users");
const Books = require("../models/Books");
const { literal, Op } = require("sequelize");
const sequelize = require("../database/db");

const create = async (req, res) => {
  const {
    type,
    management_date,
    return_date,
    is_returned,
    bookId,
    userId,
    lendingid,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    if (!type || !management_date || !bookId || !userId) {
      throw new Error("dados insuficientes");
    }

    const user = await Users.findByPk(userId);

    if (!user) {
      throw new Error("usuario não encontrado");
    }

    if (user.lending_count === 5 && type === "emprestimo") {
      throw new Error("usuario atingiu limite de emprestimos");
    }

    const bookManagementExist = await Books.count({
      where: { id: bookId, is_lending: false },
    });

    if (!bookManagementExist && type === "emprestimo") {
      throw new Error("livro ja emprestado");
    }

    const date = new Date();
    const create = await BooksManagement.create(
      {
        type,
        management_date,
        return_date,
        is_returned,
        bookId,
        userId,
        lendingid,
        devolution_date:
          type === "emprestimo"
            ? `${date.getFullYear()}-${date.getMonth()}-${+date.getDay() + 7}`
            : bookManagementExist.devolution_date,
      },
      {
        returning: true,
        transaction,
      }
    );

    await Books.update(
      {
        is_lending: type === "emprestimo",
      },
      {
        where: {
          id: bookId,
        },
        transaction,
      }
    );

    if (type === "emprestimo") {
      await Users.update(
        {
          lending_count: user.lending_count + 1,
        },
        {
          where: { id: userId },
          transaction,
        }
      );
    } else {
      await Users.update(
        {
          lending_count: user.lending_count > 0 ? user.lending_count - 1 : 0,
        },
        {
          where: { id: userId },
          transaction,
        }
      );
    }

    await transaction.commit();
    return res.status(201).json({
      message: "registrado com sucesso",
      data: create.toJSON(),
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const getAll = await BooksManagement.findAll({
      raw: true,
    });
    return res.status(200).json({
      data: getAll,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  const {
    type,
    management_date,
    return_date,
    is_returned,
    bookId,
    userId,
    lendingid,
  } = req.body;
  const { id } = req.params;
  try {
    const bookManagementExist = await BooksManagement.findOne({
      where: { bookId, userId },
    });

    if (!bookManagementExist) {
      throw new Error("gerenciamento não existe");
    }

    await BooksManagement.update(
      {
        type,
        management_date,
        return_date,
        is_returned,
        bookId,
        userId,
        lendingid,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      message: "gerenciamento atualizado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    let bookManagementLending;
    const bookManagementExist = await BooksManagement.findByPk(id);

    if (!bookManagementExist) {
      throw new Error("gerenciamento não encontrado");
    }

    if (bookManagementExist.type === "emprestimo") {
      bookManagementLending = await BooksManagement.findOne({
        where: {
          type: "devolucao",
          lendingid: bookManagementExist.id.toString(),
        },
      });
    }

    if (bookManagementLending) {
      await BooksManagement.destroy({
        where: { id },
      });
      await BooksManagement.destroy({
        where: { id: bookManagementLending.id },
      });

      return res.status(200).json({
        message: "gerenciamentos deletados com sucesso",
      });
    } else {
      await BooksManagement.destroy({
        where: { id },
      });

      return res.status(200).json({
        message: "gerenciamento deletado com sucesso",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const bookReport = async (req, res) => {
  try {
    const bookMostUsed = await BooksManagement.findAll({
      where: { type: "emprestimo" },
      include: [
        {
          model: Books,
          attributes: ["title", "id"],
          required: true,
        },
      ],
      attributes: [[literal("count(*)"), "amount"]],
      group: [literal('books_management."bookId","book.title","book.id"')],
      raw: true,
      nest: true,
      order: [["amount", "DESC"]],
    });

    return res.status(200).json({
      data: bookMostUsed,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const usersReport = async (req, res) => {
  try {
    const bookMostUsed = await BooksManagement.findAll({
      where: {
        type: "emprestimo",
        [Op.and]: literal(
          "NOT EXISTS(select 1 from books_managements as BM where BM.lendingid::INTEGER = books_management.id LIMIT 1)"
        ),
      },
      include: [
        {
          model: Users,
          required: true,
          attributes: ["id", "name"],
        },

        {
          model: Books,
          required: true,
          attributes: ["id", "title"],
        },
      ],
      attributes: ["id", "devolution_date"],
      raw: true,
      nest: true,
      order: [literal("books_management.id desc")],
    });

    return res.status(200).json({
      data: bookMostUsed,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  update,
  destroy,
  bookReport,
  usersReport,
};