/* eslint-disable react/prop-types */
import { cn } from "../../lib/utils";

export default function Section({ name, className, children }) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex h-16 w-full items-center bg-gradient-to-r from-green-200 to-amber-50 px-4 text-xl font-semibold">
        <h2>{name}</h2>
      </div>
      <div
        className={cn("box-shadow m-4 grow rounded-lg bg-white p-4", className)}
      >
        {children}
      </div>
    </div>
  );
}
