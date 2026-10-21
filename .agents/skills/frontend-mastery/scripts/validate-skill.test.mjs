import { test } from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseManifestYaml, validateSkill } from "./validate-skill.mjs";

const source = fileURLToPath(new URL("../", import.meta.url));

async function withCopy(action) {
  const temporaryRoot = path.resolve(tmpdir());
  const temporary = await mkdtemp(
    path.join(temporaryRoot, "frontend-mastery-"),
  );
  const skill = path.join(temporary, "frontend-mastery");
  try {
    await cp(source, skill, { recursive: true });
    await action(skill);
  } finally {
    if (
      path.dirname(path.resolve(temporary)) !== temporaryRoot ||
      !path.basename(temporary).startsWith("frontend-mastery-")
    ) {
      throw new Error(
        "Refusing cleanup outside the created temporary test directory.",
      );
    }
    await rm(temporary, { recursive: true, force: true });
  }
}

async function alter(root, file, change) {
  const target = path.join(root, file);
  await writeFile(target, change(await readFile(target, "utf8")), "utf8");
}

test("complete portable bundle validates and covers all modes and linked references", async () => {
  const result = await validateSkill(source);
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.modes, 13);
  assert.equal(result.stats.references, 12);
});

test("manifest parser retains Unicode and literal invocation and rejects ambiguous YAML", () => {
  const parsed = parseManifestYaml(
    'interface:\n  default_prompt: "Use $frontend-mastery para revisão."\npolicy:\n  allow_implicit_invocation: true\n',
  );
  assert.equal(
    parsed.interface.default_prompt,
    "Use $frontend-mastery para revisão.",
  );
  assert.equal(parsed.policy.allow_implicit_invocation, true);
  assert.throws(
    () => parseManifestYaml("name: example\nname: duplicate"),
    /duplicate key/,
  );
  assert.throws(
    () => parseManifestYaml("interface:\n    name: wrong"),
    /indentation/,
  );
  assert.throws(
    () => parseManifestYaml("description: [array]"),
    /unsupported scalar/,
  );
});

test("wrong identity and missing description fail validation", async () =>
  withCopy(async (root) => {
    await alter(root, "SKILL.md", (text) =>
      text
        .replace("name: frontend-mastery", "name: unrelated")
        .replace(/^description:.*\r?\n/m, ""),
    );
    const result = await validateSkill(root);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.includes("name must")));
    assert.ok(
      result.errors.some((error) => error.includes("Description must")),
    );
  }));

test("missing reference fails with the referring path", async () =>
  withCopy(async (root) => {
    await rm(path.join(root, "references", "typography.md"));
    const result = await validateSkill(root);
    assert.equal(result.valid, false);
    assert.ok(
      result.errors.some((error) =>
        error.includes("SKILL.md → references/typography.md"),
      ),
    );
  }));

test("reference path traversal is rejected even if the file exists", async () =>
  withCopy(async (root) => {
    await writeFile(
      path.join(root, "..", "outside.md"),
      "Outside this bundle.",
    );
    await alter(
      root,
      "SKILL.md",
      (text) => `${text}\n[escaped](../outside.md)\n`,
    );
    const result = await validateSkill(root);
    assert.equal(result.valid, false);
    assert.ok(
      result.errors.some((error) =>
        error.includes("Path escapes skill directory"),
      ),
    );
  }));

test("missing operational mode fails", async () =>
  withCopy(async (root) => {
    await alter(root, "SKILL.md", (text) =>
      text.replace(/^\|[ \t]*`responsive`[ \t]*\|.*\r?\n/m, ""),
    );
    const result = await validateSkill(root);
    assert.equal(result.valid, false);
    assert.ok(
      result.errors.some(
        (error) =>
          error.includes("Missing documented mode") &&
          error.includes("responsive"),
      ),
    );
  }));

test("UI prompt missing the skill invocation fails", async () =>
  withCopy(async (root) => {
    await alter(root, "agents/openai.yaml", (text) =>
      text.replace("$frontend-mastery", "frontend design"),
    );
    const result = await validateSkill(root);
    assert.equal(result.valid, false);
    assert.ok(
      result.errors.some((error) =>
        error.includes("default_prompt must mention"),
      ),
    );
  }));

test("invalid UI scalar type fails", async () =>
  withCopy(async (root) => {
    await alter(root, "agents/openai.yaml", (text) =>
      text.replace(/^  short_description:.*$/m, "  short_description: true"),
    );
    const result = await validateSkill(root);
    assert.equal(result.valid, false);
    assert.ok(
      result.errors.some((error) =>
        error.includes("short_description must be a nonempty string"),
      ),
    );
  }));

test("unfinished scaffold outside a code fence fails", async () =>
  withCopy(async (root) => {
    await alter(
      root,
      "references/design-principles.md",
      (text) => `${text}\n[TODO: write instructions]\n`,
    );
    const result = await validateSkill(root);
    assert.equal(result.valid, false);
    assert.ok(
      result.errors.some((error) => error.includes("Unfinished scaffold")),
    );
  }));

test("documented scaffold example inside a code fence does not fail", async () =>
  withCopy(async (root) => {
    await alter(
      root,
      "references/design-principles.md",
      (text) =>
        `${text}\n\x60\x60\x60text\n[TODO: example only]\n\x60\x60\x60\n`,
    );
    assert.equal((await validateSkill(root)).valid, true);
  }));
