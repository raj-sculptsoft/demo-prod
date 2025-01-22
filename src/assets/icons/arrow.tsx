import { SVGElementProps } from "@/types/common";

const Arrow = (props: SVGElementProps) => {
  const { className, ...rest } = props;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
      className={className}
    >
      <path
        d="M8.16699 12L12.167 8M8.16699 3.66667V12V3.66667ZM8.16699 12L4.16699 8L8.16699 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Arrow;
