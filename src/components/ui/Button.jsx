/* eslint-disable react/prop-types */
import { cn } from "../../lib/utils";
import Spinner from "./Spinner";

export default function Button({ name, disabled, ...rest }) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 lg:w-24",
        name === "Cancel" ? "ring-1 ring-gray-300" : "bg-blue-600 text-white",
      )}
      disabled={disabled}
      {...rest}
    >
      {disabled ? <Spinner /> : name}
    </button>
  );
}
