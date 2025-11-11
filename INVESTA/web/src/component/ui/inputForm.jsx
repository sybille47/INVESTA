import * as React from "react";

const Label = React.forwardRef(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={className}
      {...props}
    />
  )
);
Label.displayName = "Label";

const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      className={className}
      type={type}
      {...props}
    />
  )
);
Input.displayName = "Input";

const FormGroup = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      {...props}
    />
  )
);
FormGroup.displayName = "FormGroup";

export { Label, Input, FormGroup };