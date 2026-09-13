import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  value: string;
  className?: string;
};

export function Field({ label, value, className }: FieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="block font-body text-sm font-semibold leading-5 text-rm-neutral-700">
        {label}
      </label>
      <div
        className="flex h-8 items-center rounded-sm border border-rm-neutral-200 bg-rm-neutral-50 px-3 font-body text-sm leading-5 text-rm-neutral-500"
        aria-readonly="true"
      >
        {value}
      </div>
    </div>
  );
}
