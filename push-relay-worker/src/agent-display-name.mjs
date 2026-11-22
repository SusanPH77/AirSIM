// Operator-owned display metadata. Authentication and routing always use agent_id.
export function agentDisplayName(env, agentID, reportedName) {
  const fallback = typeof reportedName === "string" ? reportedName.trim() : "";
  try {
    const aliases = JSON.parse(env.AGENT_NAME_OVERRIDES || "{}");
    if (!aliases || Array.isArray(aliases) || typeof aliases !== "object"
        || !Object.prototype.hasOwnProperty.call(aliases, agentID)) return fallback;
    const value = aliases[agentID];
    if (typeof value !== "string") return fallback;
    const name = value.trim();
    if (!name || name.length > 64 || /[\u0000-\u001f\u007f]/.test(name)) return fallback;
    return name;
  } catch {
    // A malformed optional display setting must not interrupt heartbeat delivery.
    return fallback;
  }
}
