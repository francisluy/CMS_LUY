/* eslint-disable react/prop-types */
import { cn } from "../../lib/utils";

export default function UploadField({
  id,
  name,
  src,
  disabled,
  className,
  children,
}) {
  return (
    <div className="flex grow flex-col gap-2 lg:max-w-[400px]">
      <h3>{name}</h3>
      <div
        className={cn(
          "flex aspect-video max-w-full rounded object-center ring-1 ring-green-600 ",
          className,
        )}
      >
        <img src={src} className="grow object-contain" />
      </div>
      <label
        htmlFor={id}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1B8057] px-4 py-2 text-[#EDE9A3]"
        disabled={disabled}
      >
        Upload new
      </label>
      {children}
    </div>
  );
}
