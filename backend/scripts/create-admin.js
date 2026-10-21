import "dotenv/config";
import readline from "node:readline/promises";
import { Writable } from "node:stream";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createDatabase } from "../src/models/database.js";
import { password } from "../src/validators/index.js";

// Password input is deliberately hidden and never accepted as a command argument.
let hidden = false;
const output = new Writable({
  write(chunk, encoding, callback) {
    if (!hidden) process.stdout.write(chunk);
    callback();
  },
});
const prompt = readline.createInterface({
  input: process.stdin,
  output,
  terminal: true,
});
let db, local;
try {
  if (!process.stdin.isTTY)
    throw new Error("Execute este comando em um terminal interativo.");
  const name = z
    .string()
    .trim()
    .min(2)
    .max(160)
    .parse(await prompt.question("Nome do administrador: "));
  const email = z
    .email()
    .parse((await prompt.question("E-mail: ")).trim().toLowerCase());
  process.stdout.write("Senha (12–72 caracteres, entrada oculta): ");
  hidden = true;
  const entered = password.parse(await prompt.question(""));
  hidden = false;
  process.stdout.write("\nConfirme a senha: ");
  hidden = true;
  const confirmation = await prompt.question("");
  hidden = false;
  process.stdout.write("\n");
  if (entered !== confirmation) throw new Error("As senhas não coincidem.");
  if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
    const { startLocalDatabase } = await import("../../scripts/local-db.mjs");
    local = await startLocalDatabase();
    process.env.DATABASE_URL = local.url;
  }
  db = createDatabase();
  await db.administrator.create({
    data: { name, email, passwordHash: await bcrypt.hash(entered, 12) },
  });
  console.log("Administrador criado. Acesse /admin/login.");
} catch (error) {
  console.error(
    error.code === "P2002" ? "Este e-mail já está cadastrado." : error.message,
  );
  process.exitCode = 1;
} finally {
  hidden = false;
  prompt.close();
  await db?.$disconnect();
  await local?.close();
}
