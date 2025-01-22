import { SVGElementProps } from "@/types/common";

const Edit = (props: SVGElementProps) => {
  const { className, ...rest } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M12.9601 6.56001L17.44 11.04M12.9601 6.56001L15.52 4L20 8.48001L17.44 11.04L12.9601 6.56001ZM12.9601 6.56001L4.26509 15.2549C4.09536 15.4246 4 15.6549 4 15.8949V20H8.1051C8.34515 20 8.57536 19.9047 8.7451 19.7349L17.44 11.04L12.9601 6.56001Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
};

export default Edit;
