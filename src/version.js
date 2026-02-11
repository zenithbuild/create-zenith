// ---------------------------------------------------------------------------
// version.js — Zenith Version Authority (V0)
// ---------------------------------------------------------------------------
// This is the SINGLE SOURCE OF TRUTH for versions used in generated projects.
// create-zenith must NEVER read from its own node_modules to find these.
// ---------------------------------------------------------------------------

export const VERSIONS = {
    // Zenith Packages (Pinned V0)
    zenith: "1.0.0", // Combined/aliased if needed, or individual packages:
    "@zenithbuild/core": "1.0.0",
    "@zenithbuild/cli": "1.0.0",
    "@zenithbuild/router": "1.0.0",
    "@zenithbuild/runtime": "1.0.0",

    // Peer Dependencies / Tools
    "typescript": "5.3.0", // Example pinned version
    "@types/node": "20.10.0"
};

export const ENGINES = {
    node: ">=18.0.0"
};
