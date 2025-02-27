import React from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";

export default function Header({
  children,
  nodes,
}: {
  nodes: { name: string; href: string }[];
  children?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 rounded-lg pt-5 shadow-gray-200 backdrop-blur-md">
      <div className="flex justify-between">
        <Breadcrumb className="mb-5">
          <BreadcrumbList className="sm:gap-1">
            {nodes.map(({ name, href }, index) => {
              // Check if there are multiple breadcrumb links and if this is NOT the last item
              const hasMoreThanOneLinks =
                nodes.length > 1 && index + 1 !== nodes.length;
              return (
                <React.Fragment key={`${name}-${href}-${index}`}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to={href}
                        className={`inline-block max-w-[1200px] truncate font-medium ${
                          hasMoreThanOneLinks
                            ? "underline decoration-solid decoration-1 underline-offset-1"
                            : ""
                        } ${
                          // Style the last breadcrumb differently (no underline, different text color)
                          nodes.length > 1 && index + 1 === nodes.length
                            ? "text-borderColor-dark hover:text-borderColor-dark"
                            : ""
                        }`}
                      >
                        {name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {/* Add separator if this is not the last breadcrumb */}
                  {hasMoreThanOneLinks && (
                    <BreadcrumbSeparator className="[&>svg]:h-4 [&>svg]:w-5" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {children}
    </header>
  );
}
