import { SVGElementProps } from "@/types/common";

const Search = (props: SVGElementProps) => {
  const { className, ...rest } = props;
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g opacity="0.5">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.6939 12.0352C12.4237 10.875 13.6962 7.72157 12.5361 4.99173C11.3759 2.26189 8.22245 0.989413 5.49261 2.14957C2.76278 3.30972 1.49029 6.46318 2.65045 9.19302C3.8106 11.9229 6.96406 13.1953 9.6939 12.0352Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        />
        <path
          d="M11.3906 10.8896L15.556 15.0556"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        />
      </g>
    </svg>
  );
};

export default Search;
