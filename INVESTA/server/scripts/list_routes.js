const router = require("../router");

function listRoutes(r, prefix = "") {
  if (!r || !r.stack) return;
  r.stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods).join(",").toUpperCase();
      console.log(`${methods} ${prefix}${layer.route.path}`);
    } else if (layer.name === "router" && layer.handle) {
      listRoutes(
        layer.handle,
        prefix +
          (layer.regexp && layer.regexp.source !== "^\\/?$"
            ? layer.regexp.source.replace("^\\/?", "").replace("\\/?$", "")
            : "")
      );
    }
  });
}

listRoutes(router);
