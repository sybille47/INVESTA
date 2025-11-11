import * as React from "react";

const NavContainer = React.forwardRef(({ className = "", ...props }, ref) => (
  <nav
    ref={ref}
    className={["top-nav", className].filter(Boolean).join(" ")}
    {...props}
  />
));
NavContainer.displayName = "NavContainer";

export { NavContainer };
