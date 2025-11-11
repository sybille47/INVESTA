import * as React from "react";

const Table = React.forwardRef(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={className}
      {...props}
    />
  )
);
Table.displayName = "Table";

const TableHead = React.forwardRef(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={className}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableBody = React.forwardRef(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={className}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={className}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHeader = React.forwardRef(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={className}
      {...props}
    />
  )
);
TableHeader.displayName = "TableHeader";

const TableCell = React.forwardRef(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={className}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export { Table, TableHead, TableBody, TableRow, TableHeader, TableCell };