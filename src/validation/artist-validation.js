import Joi from "joi";

const listArtistValidation = Joi.object({
  page: Joi.number().required().min(0),
  limit: Joi.number().positive().required(),
});

const createArtistValidation = Joi.object({
  username: Joi.string().max(255).required(),
  artist_name: Joi.string().max(255).optional(),
  artist_genre: Joi.string().max(255).optional(),
  album_recorded: Joi.number().positive().optional(),
});

const updateArtistValidation = Joi.object({
  username: Joi.string().max(255).required(),
  artist_name: Joi.string().max(255).required(),
  artist_genre: Joi.string().max(255).required(),
  album_recorded: Joi.number().positive().required(),
});

const getArtistValidation = Joi.string().max(255).required();

export {
  listArtistValidation,
  createArtistValidation,
  getArtistValidation,
  updateArtistValidation,
};
