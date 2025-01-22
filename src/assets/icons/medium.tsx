import { SVGElementProps } from "@/types/common";

export default function Medium(props: SVGElementProps) {
  const { className, ...rest } = props;
  return (
    <svg
      width="51"
      height="50"
      viewBox="0 0 51 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        opacity="0.21"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.321289 25V30.8333C0.321289 41.4188 8.9025 50 19.488 50H25.3213H31.1546C41.7401 50 50.3213 41.4188 50.3213 30.8333V25V19.1667C50.3213 8.58121 41.7401 0 31.1546 0H25.3213H19.488C8.9025 0 0.321289 8.58121 0.321289 19.1667V25Z"
        fill="currentColor"
        className={className}
      />
      <path
        d="M6 7L6 9L14 9L14 7L6 7ZM20 10C20 4.48 15.52 -1.95827e-07 10 -4.37114e-07C4.48 -6.78401e-07 -1.95827e-07 4.48 -4.37114e-07 10C-6.78401e-07 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10ZM2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18C5.59 18 2 14.41 2 10ZM6 11L6 13L14 13L14 11L6 11Z"
        fill="currentColor"
        transform="translate(15 15)"
        className={className}
      />
    </svg>
  );
}
