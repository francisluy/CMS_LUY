/* eslint-disable react/prop-types */
import { cn } from "../../lib/utils";
import Spinner from "./Spinner";
import { LuTrash2 } from "react-icons/lu";

export function SaveButton({ className, disabled, ...rest }) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white lg:w-24",
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {disabled ? <Spinner /> : "Save"}
    </button>
  );
}

export function CancelButton({ className, disabled, ...rest }) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 ring-1 ring-gray-300 lg:w-24",
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {disabled ? <Spinner /> : "Cancel"}
    </button>
  );
}

export function EditButton({ className, disabled, ...rest }) {
  return (
    <button
      className={cn(
        "flex w-24 items-center justify-center gap-2 rounded-md bg-[#1B8057] px-4 py-2 text-[#EDE9A3]",
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {disabled ? <Spinner /> : "Edit"}
    </button>
  );
}

export function DeleteButton({ className, disabled, ...rest }) {
  return (
    <button className={cn("text-lg", className)} disabled={disabled} {...rest}>
      {disabled ? <Spinner /> : <LuTrash2 />}
    </button>
  );
}
