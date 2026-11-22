import assert from "node:assert/strict";
import test from "node:test";
import { agentDisplayName } from "../src/agent-display-name.mjs";

test("operator alias is scoped to one agent and never inherited from the prototype", () => {
  const env = { AGENT_NAME_OVERRIDES: JSON.stringify({ "android-A": " ZTE CN " }) };
  assert.equal(agentDisplayName(env, "android-A", "ZTE MU3356"), "ZTE CN");
  assert.equal(agentDisplayName(env, "android-B", "ZTE MU3356"), "ZTE MU3356");
  assert.equal(agentDisplayName(env, "constructor", "ZTE MU3356"), "ZTE MU3356");
});

test("invalid or absent optional aliases preserve the producer name", () => {
  for (const encoded of [undefined, "{", "null", "[]", "42", '"name"',
    ...[null, false, 12, {}, [], "", "  ", "a".repeat(65), "bad\nname"]
      .map(value => JSON.stringify({ "android-A": value }))]) {
    assert.equal(agentDisplayName({ AGENT_NAME_OVERRIDES: encoded }, "android-A", " Original "), "Original");
  }
  assert.equal(agentDisplayName({}, "android-A", undefined), "");
});
