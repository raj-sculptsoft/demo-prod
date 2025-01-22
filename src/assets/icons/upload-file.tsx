import { SVGElementProps } from "@/types/common";

const UploadFile = (props: SVGElementProps) => {
  const { ...rest } = props;
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#clip0_1125_27532)">
        <path
          d="M12.5 22V13V22ZM12.5 13L16 16.5L12.5 13ZM12.5 13L9 16.5L12.5 13Z"
          fill="#697077"
        />
        <path
          d="M12.5 13L9 16.5M12.5 22V13V22ZM12.5 13L16 16.5L12.5 13Z"
          stroke="#697077"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.5 17.6073C21.9937 17.0221 23.5 15.6889 23.5 13C23.5 9 20.1667 8 18.5 8C18.5 6 18.5 2 12.5 2C6.5 2 6.5 6 6.5 8C4.83333 8 1.5 9 1.5 13C1.5 15.6889 3.00628 17.0221 4.5 17.6073"
          stroke="#697077"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1125_27532">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default UploadFile;
