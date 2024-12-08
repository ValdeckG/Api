const { literal } = require("sequelize");
const Books = require("../models/Books");
const BooksManagement = require("../models/BooksManagement");

const create = async (req, res) => {
  const { title, author, gender, year } = req.body;
  try {
    if (!title || !author || !gender || !year) {
      throw new Error("dados insuficientes");
    }

    const bookExist = await Books.findOne({ where: { title } });

    if (bookExist) {
      throw new Error("livro ja cadastrado");
    }

    const create = await Books.create(
      {
        title,
        author,
        gender,
        year,
      },
      {
        raw: true,
      }
    );

    return res.status(201).json({
      message: "livro registrado com sucesso",
      data: create,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const getAll = await Books.findAll({
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
  const { title, author, gender, year } = req.body;
  const { id } = req.params;
  try {
    if (!title || !author || !gender || !year) {
      throw new Error("dados insuficientes");
    }

    const bookExist = await Books.findByPk(id);

    if (!bookExist) {
      throw new Error("livro não encontrado");
    }

    await Books.update(
      {
        title,
        author,
        gender,
        year,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      message: "livro atualizado com sucesso",
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
    const bookExist = await Books.findByPk(id);

    if (!bookExist) {
      throw new Error("livro não encontrado");
    }

    const inBookManagement = await BooksManagement.findOne({
      where: {
        bookId: id,
      },
    });

    if (inBookManagement) {
      throw new Error("livro cadastrado em um ou mais gerenciamentos");
    }

    await Books.destroy({
      where: { id },
    });

    return res.status(200).json({
      message: "livro deletado com sucesso",
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
};
