/* eslint-disable react/prop-types */
import { cn } from "../../lib/utils";

export default function InputField({ name, children, status }) {
  return (
    <div className="flex flex-col gap-2">
      <h3>{name}</h3>
      {children}
      <p className={cn("input-status", status ? "block" : "hidden")}>
        {status}
      </p>
    </div>
  );
}
