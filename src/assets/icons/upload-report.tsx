import { SVGElementProps } from "@/types/common";

const UploadReport = (props: SVGElementProps) => {
  const { className, ...rest } = props;
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M14.5 21.5H4.5C3.39543 21.5 2.5 20.6046 2.5 19.5V5.5C2.5 4.39543 3.39543 3.5 4.5 3.5H20.5C21.6046 3.5 22.5 4.39543 22.5 5.5V14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={className}
      />
      <path
        d="M2.5 7.5H22.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M5.5 5.50989L5.51 5.49878"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M8.5 5.50989L8.51 5.49878"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M11.5 5.50989L11.51 5.49878"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M20 16.5L22.5 19M20 22.5V16.5V22.5ZM20 16.5L17.5 19L20 16.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
};

export default UploadReport;
