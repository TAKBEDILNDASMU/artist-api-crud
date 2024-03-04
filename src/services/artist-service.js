import db from "../apps/database.js";
import {
  createArtistValidation,
  getArtistValidation,
  listArtistValidation,
  updateArtistValidation,
} from "../validation/artist-validation.js";
import { ResponseError } from "../errors/response-error.js";

const list = async () => {
  const listArtist = await db.query(
    "SELECT * FROM artists ORDER BY artist_name"
  );
  return listArtist;
};

const listPaging = async (request) => {
  const result = listArtistValidation.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  }

  const { limit, page } = result.value;
  // limit 5
  // 1 : (page - 1) * 5 = 0
  // 2 : (page - 1) * 5 = 5
  const offset = (page - 1) * limit;

  const results = await db.query(
    "SELECT * FROM artists ORDER BY username LIMIT ? OFFSET ?",
    [limit, offset]
  );
  let totalItem = await db.query("SELECT * FROM artists;");
  totalItem = totalItem.length;

  return {
    data: results,
    paging: {
      page: page,
      total_item: totalItem,
      total_page: Math.ceil(totalItem / limit),
      item_per_page: limit,
    },
  };
};

const create = async (request) => {
  const result = createArtistValidation.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  }

  const { username, artist_name, artist_genre, album_recorded } = result.value;

  await db.query(
    `
    INSERT INTO artists (username, artist_name, artist_genre, album_recorded)
    VALUES (?, ?, ?, ?)
  `,
    [username, artist_name, artist_genre, album_recorded]
  );

  return await db.query("SELECT * FROM artists WHERE username = ?", [username]);
};

const get = async (request) => {
  const result = getArtistValidation.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, request.error.message);
  }

  const username = result.value;

  const artist = await db.query(
    `
    SELECT * FROM artists WHERE username = ?
  `,
    [username]
  );

  if (!artist[0]) {
    throw new ResponseError(404, "Page is not found");
  }

  return artist;
};

const update = async (request) => {
  const result = updateArtistValidation.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  }

  const { username, artist_name, artist_genre, album_recorded } = result.value;

  // validation to check username exist or not in database
  const totalArtistInDatabase = await db.query(
    `
    SELECT * FROM artists WHERE username = ?;
  `,
    [username]
  );
  if (totalArtistInDatabase.length != 1) {
    throw new ResponseError(404, "Username not found");
  }

  // update if the username is exist
  await db.query(
    `
    UPDATE artists
    SET artist_name = ?, artist_genre = ?, album_recorded = ?
    WHERE username = ?;
  `,
    [artist_name, artist_genre, album_recorded, username]
  );

  // get the data from database and return the value
  return await db.query(
    `
    SELECT * FROM artists WHERE username = ?
  `,
    [username]
  );
};

const remove = async (request) => {
  const result = getArtistValidation.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  }

  const username = result.value;

  const totalArtistInDatabase = await db.query(
    `
    SELECT * FROM artists WHERE username = ?
  `,
    [username]
  );

  if (totalArtistInDatabase.length != 1) {
    throw new ResponseError(404, "Artist not found");
  }

  return await db.query(
    `
    DELETE FROM artists WHERE username = ?
  `,
    [username]
  );
};

export default {
  list,
  listPaging,
  create,
  get,
  update,
  remove,
};
