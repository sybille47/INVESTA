import * as React from "react";

const SearchBar = React.forwardRef(
  ({ className, placeholder = "Search...", ...props }, ref) => (
    <input
      ref={ref}
      className={className}
      type="search"
      placeholder={placeholder}
      {...props}
    />
  )
);
SearchBar.displayName = "SearchBar";

export { SearchBar };

