import { SVGElementProps } from "@/types/common";

const Vulnerabilities = (props: SVGElementProps) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_348_42046)">
        <path
          d="M12.5 15.5V15.51M12.5 9.5V11.5V9.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.49921 19.5H19.4992C19.8255 19.4977 20.1463 19.4156 20.4336 19.2609C20.7209 19.1061 20.966 18.8834 21.1474 18.6122C21.3289 18.341 21.4412 18.0295 21.4747 17.7049C21.5081 17.3803 21.4616 17.0525 21.3392 16.75L14.2392 4.5C14.0663 4.1874 13.8127 3.92683 13.505 3.74539C13.1972 3.56394 12.8465 3.46825 12.4892 3.46825C12.132 3.46825 11.7812 3.56394 11.4735 3.74539C11.1657 3.92683 10.9122 4.1874 10.7392 4.5L3.63921 16.75C3.51915 17.0456 3.47155 17.3656 3.50036 17.6833C3.52918 18.001 3.63359 18.3073 3.80486 18.5764C3.97614 18.8456 4.20932 19.0698 4.48494 19.2305C4.76056 19.3912 5.07061 19.4836 5.38921 19.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_348_42046">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Vulnerabilities;
