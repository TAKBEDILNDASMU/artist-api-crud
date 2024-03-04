import supertest from "supertest";
import db from "../src/apps/database.js";
import { web } from "../src/apps/web.js";
import { logger } from "../src/apps/logging.js";

describe("GET /artists", () => {
  beforeEach(async () => {
    await db.query(`
                        INSERT INTO artists (username, artist_name, artist_genre, album_recorded) 
                        VALUES
                        ('user1', 'Artist1', 'Pop', 3),
                        ('user2', 'Artist2', 'Rock', 5),
                        ('user3', 'Artist3', 'Hip Hop', 2),
                        ('user4', 'Artist4', 'Jazz', 7),
                        ('user5', 'Artist5', 'Blues', 8);
                    `);
  });

  afterEach(async () => {
    await db.query(`
                        DELETE FROM artists 
                        WHERE username IN ('user1', 'user2', 'user3', 'user4', 'user5');
                    `);
  });
  it("should get all data artists", async () => {
    const result = await supertest(web).get("/artists");

    expect(result.status).toBe(200);
    expect(result.body.data).toContainEqual({
      username: "user1",
      artist_name: "Artist1",
      artist_genre: "Pop",
      album_recorded: 3,
    });
  });

  it("should return 404 if you access wrong route", async () => {
    const result = await supertest(web).get("/artist");

    expect(result.status).toBe(404);
    expect(result.body).toEqual({
      error: "Page not found",
    });
  });
});

describe("POST /artists", () => {
  afterEach(async () => {
    await db.query("DELETE FROM artists WHERE username = 'Patrick';");
  });

  it("should be able to create new artist", async () => {
    const result = await supertest(web).post("/artists").send({
      username: "Patrick",
      artist_name: "Patrick Star",
      artist_genre: "Heavy Metal",
      album_recorded: 2,
    });

    expect(result.status).toBe(201);
    expect(result.body.data).toHaveProperty("username", "Patrick");
  });

  it("should reject if the username is not assigned", async () => {
    const result = await supertest(web).post("/artists").send({
      artist_name: "Patrick Star",
    });

    expect(result.status).toBe(400);
    expect(result.error).toBeDefined();
  });
});

describe("GET /artists/{username}", () => {
  beforeEach(async () => {
    await db.query(`
      INSERT INTO artists (username, artist_name, artist_genre, album_recorded) 
      VALUES ('Patrick', 'Patrick Star', 'Heavy Metal', 15);
    `);
  });

  afterEach(async () => {
    await db.query(`
      DELETE FROM artists WHERE username = 'Patrick';
    `);
  });

  it("should be able to get artist", async () => {
    const result = await supertest(web).get("/artists/patrick");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("Patrick");
  });

  it("should send 404 if username is not found", async () => {
    const result = await supertest(web).get("/artists/spongebob");

    expect(result.status).toBe(404);
    expect(result.body.error).toBeDefined();
  });
});

describe("GET /artists/page/{page}", () => {
  beforeEach(async () => {
    await db.query(`
                        INSERT INTO artists (username, artist_name, artist_genre, album_recorded) 
                        VALUES
                        ('user1', 'Artist1', 'Pop', 3),
                        ('user2', 'Artist2', 'Rock', 5),
                        ('user3', 'Artist3', 'Hip Hop', 2),
                        ('user4', 'Artist4', 'Jazz', 7),
                        ('user5', 'Artist5', 'Metal', 8),
                        ('user6', 'Artist5', 'Heavy Metal', 8),
                        ('user7', 'Artist5', 'Indie', 8),
                        ('user8', 'Artist5', 'Reggae', 8),
                        ('user9', 'Artist5', 'Blues', 8);
                    `);
  });

  afterEach(async () => {
    await db.query(`
                        DELETE FROM artists 
                        WHERE username IN ('user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9');
                    `);
  });

  it("should be able to do paging", async () => {
    const result = await supertest(web).get("/artists/page/1?limit=2");

    expect(result.status).toBe(200);
    expect(result.body.data).toHaveLength(2);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(5);
    expect(result.body.paging.total_item).toBe(9);
    expect(result.body.paging.item_per_page).toBe(2);
  });
});

describe("PATCH /artists/{username}", () => {
  beforeEach(async () => {
    await db.query(`
      INSERT INTO artists (username, artist_name, artist_genre, album_recorded) 
      VALUES ('Patrick', 'Patrick Star', 'Heavy Metal', 15);
    `);
  });

  afterEach(async () => {
    await db.query(`
      DELETE FROM artists WHERE username = 'Patrick'
    `);
  });

  it("should be able to update the artist", async () => {
    const result = await supertest(web).patch("/artists/patrick").send({
      artist_name: "Patrick si bintang",
      artist_genre: "Heavy Metal",
      album_recorded: 20,
    });

    expect(result.status).toBe(200);
    expect(result.body.data.artist_name).toBe("Patrick si bintang");
    expect(result.body.data.artist_genre).toBe("Heavy Metal");
    expect(result.body.data.album_recorded).toBe(20);
  });

  it("should reject if the value is incompleted", async () => {
    const result = await supertest(web).patch("/artists/patrick").send({
      artist_name: "Patrick si bintang",
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("should return 404 not found if the username is not found", async () => {
    const result = await supertest(web).patch("/artists/spongebob").send({
      artist_name: "Patrick si bintang",
      artist_genre: "Heavy Metal",
      album_recorded: 20,
    });

    expect(result.status).toBe(404);
    expect(result.body.error).toBeDefined();
  });
});

describe("DELETE /artists/{username}", () => {
  beforeEach(async () => {
    await db.query(`
      INSERT INTO artists (username, artist_name, artist_genre, album_recorded) 
      VALUES ('Patrick', 'Patrick Star', 'Heavy Metal', 15);
    `);
  });

  afterEach(async () => {
    await db.query(`
      DELETE FROM artists WHERE username = 'Patrick';
    `);
  });

  it("should be able to remove an artists", async () => {
    const result = await supertest(web).delete("/artists/patrick");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("should return 404 if the artist is not found", async () => {
    const result = await supertest(web).delete("/artists/spongebob");

    expect(result.status).toBe(404);
    expect(result.body.error).toBeDefined();
  });
});
