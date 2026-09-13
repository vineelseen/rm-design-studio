import { cn } from "@/lib/cn";

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function InputField({
  label,
  value,
  onChange,
  className,
}: InputFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="block font-body text-sm font-semibold leading-5 text-rm-neutral-700">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-8 w-full rounded-sm border border-rm-neutral-300 bg-rm-white px-3 font-body text-sm leading-5 text-rm-neutral-900 outline-none focus:border-rm-blue-600 focus:ring-1 focus:ring-rm-blue-600"
      />
    </div>
  );
}
