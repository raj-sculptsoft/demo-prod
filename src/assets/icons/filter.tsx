import { SVGElementProps } from "@/types/common";

const Filter = (props: SVGElementProps) => {
  return (
    <svg
      width="22"
      height="25"
      viewBox="0 0 22 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 10C16.3848 10 20.75 7.98528 20.75 5.5C20.75 3.01472 16.3848 1 11 1C5.61522 1 1.25 3.01472 1.25 5.5C1.25 7.98528 5.61522 10 11 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.25 5.5C1.25253 10.0155 4.35614 13.938 8.75 14.979V21.25C8.75 22.4926 9.75736 23.5 11 23.5C12.2426 23.5 13.25 22.4926 13.25 21.25V14.979C17.6439 13.938 20.7475 10.0155 20.75 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Filter;
