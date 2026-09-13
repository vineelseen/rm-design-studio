import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-rm-blue-600 text-rm-white border border-rm-blue-600 hover:bg-rm-blue-700 hover:border-rm-blue-700",
  secondary:
    "bg-rm-white text-rm-neutral-700 border border-rm-neutral-300 hover:bg-rm-neutral-50 hover:border-rm-neutral-400",
  ghost:
    "bg-transparent text-rm-neutral-600 border border-transparent hover:bg-rm-neutral-100 hover:text-rm-neutral-900",
};

export function Button({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-2 px-3",
        "font-body text-sm font-semibold leading-5",
        "rounded-sm transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
