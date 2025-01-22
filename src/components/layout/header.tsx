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
              const hasMoreThanOneLinks =
                nodes.length > 1 && index + 1 !== nodes.length;
              return (
                <React.Fragment key={`${name}-${href}-${index}`}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to={href}
                        className={`inline-block max-w-[200px] truncate font-medium ${
                          hasMoreThanOneLinks
                            ? "underline decoration-solid decoration-1 underline-offset-1"
                            : ""
                        } ${
                          nodes.length > 1 && index + 1 === nodes.length
                            ? "text-borderColor-dark hover:text-borderColor-dark"
                            : ""
                        }`}
                      >
                        {name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
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
