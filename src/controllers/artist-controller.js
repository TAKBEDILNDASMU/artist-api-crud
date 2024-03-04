import { logger } from "../apps/logging.js";
import artistService from "../services/artist-service.js";

const list = async (req, res, next) => {
  try {
    const result = await artistService.list();

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const listPaging = async (req, res, next) => {
  try {
    // Destructuring values from req.params and req.query
    const { page } = req.params;
    const { limit = 5 } = req.query;

    const request = { page, limit };
    const result = await artistService.listPaging(request);

    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const request = req.body;

    const result = await artistService.create(request);
    res.status(201).json({
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const request = req.params.username;
    const result = await artistService.get(request);
    res.status(200).json({
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    // Destructuring values from req.params and req.body
    const { username } = req.params;
    const { artist_name, artist_genre, album_recorded } = req.body;

    const request = { username, artist_name, artist_genre, album_recorded };
    const result = await artistService.update(request);

    res.status(200).json({
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { username } = req.params;

    const result = await artistService.remove(username);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  list,
  create,
  get,
  listPaging,
  update,
  remove,
};
