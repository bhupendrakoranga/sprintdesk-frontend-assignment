import { FadeLoader } from "react-spinners";
import type { ComponentProps } from "react";

export type LoaderProps = ComponentProps<typeof FadeLoader>;

export default function Loader({
  color = "currentColor",
  loading = true,
  "aria-label": ariaLabel,
  ...props
}: LoaderProps) {
  return (
    <FadeLoader
      {...props}
      color={color}
      loading={loading}
      aria-label={ariaLabel ?? "Loading"}
    />
  );
}
