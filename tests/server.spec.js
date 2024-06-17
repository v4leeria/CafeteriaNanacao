const request = require("supertest");
const app = require("../index");

describe("Solicitudes CRUD de /cafes", () => {
  it("GET devuelve status(200) y al menos un objeto", async () => {
    const { body: cafes, statusCode } = await request(app).get("/cafes");
    expect(statusCode).toBe(200);
    expect(Array.isArray(cafes)).toBe(true);
    expect(cafes.length).toBeGreaterThan(0);
    expect(cafes[0]).toHaveProperty("id");
    expect(cafes[0]).toHaveProperty("nombre");
  });

  it("DELETE devuelve 404 si no exite el id", async () => {
    const eliminarCafe = 999;
    const jwt = "Bearer token";
    const { statusCode, body } = await request(app)
      .delete(`/cafes/${eliminarCafe}`)
      .set("Authorization", jwt);
    expect(statusCode).toBe(404);
    expect(body).toHaveProperty(
      "message",
      "No se encontró ningún cafe con ese id"
    );
  });

  it("POST agrega un nuevo café y devuelve 201", async () => {
    const id = Math.floor(Math.random() * 999);
    const nuevoCafe = { id, nombre: "Latte" };
    const { body: cafes, statusCode } = await request(app)
      .post("/cafes")
      .send(nuevoCafe);
    expect(statusCode).toBe(201);
    expect(Array.isArray(cafes)).toBe(true);
    expect(cafes).toContainEqual(nuevoCafe);
  });

  it("PUT devuelve 400 si el id del parámetro no coincide con el id del payload", async () => {
    const idParametro = 1;
    const cafeActualizado = { id: 2, nombre: "Espresso" };
    const { statusCode, body } = await request(app)
      .put(`/cafes/${idParametro}`)
      .send(cafeActualizado);
    expect(statusCode).toBe(400);
    expect(body).toHaveProperty(
      "message",
      "El id del parámetro no coincide con el id del café recibido"
    );
  });
});
