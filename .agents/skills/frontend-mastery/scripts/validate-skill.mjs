#!/usr/bin/env node
/** Structural checks for this portable skill; no dependencies, network or writes. */
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MODES = Object.freeze([
  "init",
  "audit",
  "critique",
  "polish",
  "redesign",
  "distill",
  "enrich",
  "motion",
  "responsive",
  "design-system",
  "build",
  "review",
  "anti-ai",
]);

// Deliberately supports only the map/scalar YAML used in the two manifests.
// Unsupported valid YAML is reported as unsupported, not as invalid YAML generally.
export function parseManifestYaml(source) {
  const result = Object.create(null);
  const stack = [{ indent: -2, object: result }];
  for (const [index, line] of source
    .replace(/\r\n/g, "\n")
    .split("\n")
    .entries()) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const match = /^( *)([a-z][a-z0-9_-]*):(?: +(.*))?$/i.exec(line);
    if (!match || match[1].length % 2) {
      throw new Error(
        `YAML line ${index + 1}: unsupported syntax; use maps indented by two spaces.`,
      );
    }
    const indent = match[1].length;
    while (stack.length > 1 && indent <= stack.at(-1).indent) stack.pop();
    const parent = stack.at(-1);
    if (indent !== parent.indent + 2)
      throw new Error(`YAML line ${index + 1}: unexpected indentation.`);
    const [, , key, rawValue] = match;
    if (Object.hasOwn(parent.object, key))
      throw new Error(`YAML line ${index + 1}: duplicate key '${key}'.`);
    if (rawValue === undefined || !rawValue.trim()) {
      const child = Object.create(null);
      parent.object[key] = child;
      stack.push({ indent, object: child });
      continue;
    }
    const value = rawValue.trim();
    if (value.startsWith('"')) {
      const parsed = JSON.parse(value);
      if (typeof parsed !== "string")
        throw new Error(`YAML '${key}' must be a string.`);
      parent.object[key] = parsed;
    } else if (value === "true" || value === "false") {
      parent.object[key] = value === "true";
    } else if (
      /^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(value) &&
      !["null", "Null", "NULL", "True", "False", "TRUE", "FALSE"].includes(
        value,
      )
    ) {
      parent.object[key] = value;
    } else {
      throw new Error(
        `YAML '${key}': unsupported scalar; use a JSON-compatible double-quoted string.`,
      );
    }
  }
  return result;
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) &&
      relative !== ".." &&
      !path.isAbsolute(relative))
  );
}

function unfinishedScaffold(content) {
  // Ignore code fences: instructions may intentionally demonstrate a bad example.
  let fence = null;
  let fenceLength = 0;
  return content.split(/\r?\n/).some((line) => {
    const marker = /^\s*(`{3,}|~{3,})(.*)$/.exec(line);
    if (marker) {
      if (!fence) {
        fence = marker[1][0];
        fenceLength = marker[1].length;
      } else if (
        marker[1][0] === fence &&
        marker[1].length >= fenceLength &&
        !marker[2].trim()
      )
        fence = null;
      return false;
    }
    return !fence && /^\s*\[TODO:[^\n]*\]\s*$/.test(line);
  });
}

export async function validateSkill(directory) {
  const errors = [];
  const documents = new Map();
  const stats = { modes: 0, references: 0, localLinks: 0 };
  let root;
  try {
    root = await realpath(path.resolve(directory));
  } catch {
    return { valid: false, errors: ["Skill directory does not exist."], stats };
  }

  async function readLocal(relative) {
    const candidate = path.resolve(root, relative);
    if (!isInside(root, candidate))
      throw new Error(`Path escapes skill directory: ${relative}`);
    const actual = await realpath(candidate);
    if (!isInside(root, actual))
      throw new Error(`Linked file escapes skill directory: ${relative}`);
    if (!(await stat(actual)).isFile())
      throw new Error(`Not a regular file: ${relative}`);
    const bytes = await readFile(actual);
    const content = new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: true,
    }).decode(bytes);
    if (content.charCodeAt(0) === 0xfeff)
      throw new Error(`Remove UTF-8 BOM from ${relative}`);
    return content;
  }

  let skill;
  try {
    skill = await readLocal("SKILL.md");
  } catch (error) {
    return { valid: false, errors: [`SKILL.md: ${error.message}`], stats };
  }
  documents.set("SKILL.md", skill);
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(skill);
  if (!frontmatter)
    errors.push("SKILL.md must start with delimited YAML frontmatter.");
  else {
    try {
      const metadata = parseManifestYaml(frontmatter[1]);
      const unknown = Object.keys(metadata).filter(
        (key) =>
          ![
            "name",
            "description",
            "license",
            "allowed-tools",
            "metadata",
          ].includes(key),
      );
      if (unknown.length)
        errors.push(`Unsupported frontmatter keys: ${unknown.join(", ")}`);
      if (metadata.name !== "frontend-mastery")
        errors.push("Frontmatter name must be frontend-mastery.");
      if (
        typeof metadata.description !== "string" ||
        !metadata.description.trim() ||
        metadata.description.length > 1024 ||
        /[<>]/.test(metadata.description)
      )
        errors.push(
          "Description must be a nonempty string of at most 1024 characters without angle brackets.",
        );
      if (
        typeof metadata.description === "string" &&
        metadata.description.startsWith("[TODO:")
      )
        errors.push("Description contains unfinished scaffold.");
    } catch (error) {
      errors.push(`Frontmatter: ${error.message}`);
    }
    if (!skill.slice(frontmatter[0].length).trim())
      errors.push("SKILL.md body is empty.");
  }

  for (const mode of MODES) {
    if (
      new RegExp(
        `^\\|[ \\t]*\\x60${mode}\\x60[ \\t]*\\|[^\\n|]+\\|[^\\n|]+\\|[ \\t]*$`,
        "m",
      ).test(skill)
    )
      stats.modes++;
    else
      errors.push(
        `Missing documented mode with result and write scope: ${mode}`,
      );
  }

  try {
    const agent = parseManifestYaml(await readLocal("agents/openai.yaml"));
    const ui = agent.interface;
    if (!ui || typeof ui !== "object")
      errors.push("agents/openai.yaml requires interface mapping.");
    else {
      for (const key of [
        "display_name",
        "short_description",
        "default_prompt",
      ]) {
        if (typeof ui[key] !== "string" || !ui[key].trim())
          errors.push(`interface.${key} must be a nonempty string.`);
      }
      if (
        typeof ui.short_description === "string" &&
        (ui.short_description.length < 25 || ui.short_description.length > 64)
      )
        errors.push("short_description must have 25–64 characters.");
      if (
        typeof ui.default_prompt === "string" &&
        !ui.default_prompt.includes("$frontend-mastery")
      )
        errors.push("default_prompt must mention $frontend-mastery.");
    }
    if (agent.policy?.allow_implicit_invocation === false)
      errors.push(
        "This skill should retain implicit invocation; explicit-only policy was not requested.",
      );
    if (
      agent.policy?.allow_implicit_invocation !== undefined &&
      typeof agent.policy.allow_implicit_invocation !== "boolean"
    )
      errors.push("allow_implicit_invocation must be boolean.");
  } catch (error) {
    errors.push(`agents/openai.yaml: ${error.message}`);
  }

  // Walk linked documents: paths resolve relative to the referencing file.
  const queue = ["SKILL.md"];
  const visited = new Set();
  while (queue.length) {
    const relative = queue.shift();
    if (visited.has(relative)) continue;
    visited.add(relative);
    const content = documents.get(relative);
    if (unfinishedScaffold(content))
      errors.push(`Unfinished scaffold in ${relative}`);
    for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^(?:https?:|mailto:|#)/i.test(target)) continue;
      stats.localLinks++;
      try {
        const localPath = decodeURIComponent(target.split("#")[0]);
        if (
          !localPath ||
          localPath.includes("\\") ||
          /^[a-z]+:/i.test(localPath)
        )
          throw new Error("Use a portable relative path with forward slashes.");
        const normalized = path.relative(
          root,
          path.resolve(root, path.dirname(relative), localPath),
        );
        const linked = await readLocal(normalized);
        if (!linked.trim()) throw new Error("Linked file is empty.");
        if (normalized.endsWith(".md") && !documents.has(normalized)) {
          documents.set(normalized, linked);
          queue.push(normalized);
        }
      } catch (error) {
        errors.push(`${relative} → ${target}: ${error.message}`);
      }
    }
  }
  stats.references = [...documents.keys()].filter((file) =>
    file.startsWith(`references${path.sep}`),
  ).length;
  if (!documents.has(path.join("references", "anti-ai-design.md")))
    errors.push("Anti-AI design reference must be linked from the skill.");
  if (!documents.has(path.join("references", "quality-checklist.md")))
    errors.push("Quality checklist must be linked from the skill.");
  return { valid: errors.length === 0, errors, stats };
}

const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedFile === fileURLToPath(import.meta.url)) {
  const directory =
    process.argv[2] || fileURLToPath(new URL("../", import.meta.url));
  const result = await validateSkill(directory);
  if (result.valid)
    console.log(
      `frontend-mastery valid: ${result.stats.modes} modes, ${result.stats.references} references, ${result.stats.localLinks} local links.`,
    );
  else for (const error of result.errors) console.error(`ERROR: ${error}`);
  process.exitCode = result.valid ? 0 : 1;
}
