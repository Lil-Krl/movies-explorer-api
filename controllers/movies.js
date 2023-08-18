const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const CurrentErr = require('../errors/CurrentErr');

const createMovie = async (req, res, next) => {
  try {
    await Movie.create({ ...req.body, owner: req.user._id });

    res.status(201).send({ message: 'Фильм создан' });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequest('Переданы некорректные данные при создании фильма'));
    } else {
      next(err);
    }
  }
};

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });

    res.send(movies);
  } catch (err) {
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      throw new NotFound('Фильм с указанным _id не найден');
    }

    if (movie.owner.toString() !== req.user._id) {
      throw new CurrentErr('Нельзя удалить чужой фильм');
    }

    await movie.deleteOne();

    res.send({ message: 'Фильм удален' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequest('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
