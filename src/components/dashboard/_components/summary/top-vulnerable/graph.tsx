import config from "@/config/env";
import { useAppDispatch } from "@/hooks/use-store";
import { getDashboardPopUpTopVulnerability } from "@/store/dashboard/api";
import Konva from "konva";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import { useSearchParams } from "react-router-dom";
import {
  setShowAssetsGraph,
  setVulnerabilityData,
} from "../../../../../store/dashboard/slice";

interface Vulnerability {
  vulnerability_name: string;
  total_vulnerabilities: number;
  critical_count: number;
  false_positive_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

interface DashboardItem {
  product_id?: string;
  asset_id?: string;
  product_name?: string;
  asset_name?: string;
  vulnerability_file_name?: string;
  vulnerabilities?: Vulnerability[];
}

interface DashboardTopVulnerabilityList {
  list: (DashboardItem | null)[];
}

interface GraphProps {
  hasChildTooltip?: boolean;
  width?: number;
  height?: number;
  data: DashboardTopVulnerabilityList;
}

const Graph: React.FC<GraphProps> = ({ hasChildTooltip = true, data }) => {
  const dispatch = useAppDispatch();
  const company_id = config.COMPANY_ID;
  const [savedProductId, setSavedProductId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product") ?? "";

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth * 0.5, // 40% of screen width
    height: 400, // Fixed height
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth * 0.5, // Adjust width dynamically
        height: 400, // Keep height fixed
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const defaultNodeData = useMemo(() => {
    switch (data?.list.length) {
      case 1:
        return [
          {
            x: dimensions.width * 0.42,
            y: dimensions.height * 0.5,
            color: "#05004E",
          },
        ];
      case 2:
        return [
          {
            x: dimensions.width * 0.25,
            y: dimensions.height * 0.5,
            color: "#05004E",
          },
          {
            x: dimensions.width * 0.62,
            y: dimensions.height * 0.5,
            color: "#FF6669",
          },
        ];
      case 3:
        return [
          {
            x: dimensions.width * 0.2,
            y: dimensions.height * 0.25,
            color: "#05004E",
          },
          {
            x: dimensions.width * 0.65,
            y: dimensions.height * 0.25,
            color: "#FF6669",
          },
          {
            x: dimensions.width * 0.42,
            y: dimensions.height * 0.75,
            color: "#7E54FD",
          },
        ];
      case 4:
        return [
          {
            x: dimensions.width * 0.2,
            y: dimensions.height * 0.22,
            color: "#05004E",
          },
          {
            x: dimensions.width * 0.65,
            y: dimensions.height * 0.22,
            color: "#FF6669",
          },
          {
            x: dimensions.width * 0.2,
            y: dimensions.height * 0.75,
            color: "#197941",
          },
          {
            x: dimensions.width * 0.65,
            y: dimensions.height * 0.75,
            color: "#5E77FF",
          },
        ];
      default:
        return [
          {
            x: dimensions.width * 0.14,
            y: dimensions.height * 0.22,
            color: "#05004E",
          },
          {
            x: dimensions.width * 0.7,
            y: dimensions.height * 0.22,
            color: "#FF6669",
          },
          {
            x: dimensions.width * 0.42,
            y: dimensions.height * 0.5,
            color: "#7E54FD",
          },
          {
            x: dimensions.width * 0.14,
            y: dimensions.height * 0.75,
            color: "#197941",
          },
          {
            x: dimensions.width * 0.7,
            y: dimensions.height * 0.75,
            color: "#5E77FF",
          },
        ];
    }
  }, [dimensions, data?.list.length]);

  const [tooltip, setTooltip] = useState<{
    details:
      | {
          name: string;
          total: number;
          critical: number;
          falsePositive: number;
          high: number;
          medium: number;
          low: number;
        }[]
      | null;
    visible: boolean;
    x: number;
    y: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    details: null,
  });

  const [childPositions, setChildPositions] = useState<{
    [key: string]: { x: number; y: number; size: number; color: string }[];
  }>({});

  const getSizeByVulnerabilityCount = (count: number): number => {
    if (count <= 10) return 5;
    if (count <= 50) return 9;
    if (count <= 100) return 13;
    if (count <= 200) return 17;
    return 25;
  };

  const getSizeByVulnerability = (count: number): number => {
    if (count <= 10) return 18;
    if (count <= 50) return 22;
    if (count <= 100) return 27;
    if (count <= 200) return 32;
    return 32;
  };

  const nodes = useMemo(() => {
    return (
      data?.list?.map((item, index) => {
        if (!item) return null;

        const id = item.product_id ?? item.asset_id ?? `${index}`;
        const name = (
          item.product_name ??
          item.asset_name ??
          item.vulnerability_file_name
        )
          ?.slice(0, 2)
          .toUpperCase();

        // Ensure that defaultNode is always an object with x, y, and color properties
        const defaultNode = defaultNodeData[index % defaultNodeData.length] ?? {
          x: 0,
          y: 0,
          color: "gray", // Provide a fallback object
        };

        // Dynamically set the radius using the getSizeByVulnerability function
        const radius = getSizeByVulnerability(
          item.vulnerabilities?.length ?? 0,
        );

        return {
          id,
          name,
          x: defaultNode.x,
          y: defaultNode.y,
          color: defaultNode.color,
          children: item.vulnerabilities?.length ?? 0,
          radius: radius, // Dynamic radius based on vulnerability count
          vulnerabilities: item.vulnerabilities || [],
        };
      }) || []
    );
  }, [data?.list]);

  const getColorByVulnerability = (vulnerabilities: {
    critical_count?: number;
    high_count?: number;
    medium_count?: number;
    low_count?: number;
  }) => {
    const severityLevels = [
      {
        key: "critical_count",
        value: vulnerabilities.critical_count ?? 0,
        color: "#D04D6C",
      },
      {
        key: "high_count",
        value: vulnerabilities.high_count ?? 0,
        color: "#FB9199",
      },
      {
        key: "medium_count",
        value: vulnerabilities.medium_count ?? 0,
        color: "#FEC53D",
      },
      {
        key: "low_count",
        value: vulnerabilities.low_count ?? 0,
        color: "#31D080",
      },
    ];

    const highestSeverity = severityLevels
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)[0];

    return highestSeverity ? highestSeverity.color : "#E5D9F8";
  };

  const calculateChildPositions = useCallback(
    (parent: NonNullable<(typeof nodes)[number]>, childCount: number) => {
      const positions: { x: number; y: number; size: number; color: string }[] =
        [];
      const angleStep = (2 * Math.PI) / childCount;

      const maxDistance = parent.radius * 3.7;
      const minDistance = parent.radius * 2;

      for (let i = 0; i < childCount; i++) {
        const childVulnerability =
          parent.vulnerabilities[i]?.total_vulnerabilities || 0;
        const size = getSizeByVulnerabilityCount(childVulnerability);
        const color = getColorByVulnerability(parent.vulnerabilities[i] || {});

        let x: number, y: number;
        let attempts = 0;

        do {
          const angle = i * angleStep + Math.random() * 0.2;
          const distance =
            Math.random() * (maxDistance - minDistance) + minDistance;

          x = parent.x + distance * Math.cos(angle);
          y = parent.y + distance * Math.sin(angle);

          attempts++;

          if (attempts > 50) {
            break;
          }
        } while (
          positions.some((pos) => {
            const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            return distance < size + pos.size + 5; // Reduced buffer zone
          }) ||
          Math.sqrt((x - parent.x) ** 2 + (y - parent.y) ** 2) < minDistance ||
          Math.sqrt((x - parent.x) ** 2 + (y - parent.y) ** 2) > maxDistance
        );

        // Store color with position data
        positions.push({ x, y, size, color });
      }

      return positions;
    },
    [],
  );

  const calculateTooltipPosition = (
    x: number,
    y: number,
    width: number,
    height: number,
    stageWidth: number,
    offset = 10,
  ) => {
    const padding = 10;
    let newX = x + offset;
    let newY = y - height - offset;

    if (newX + width > stageWidth - padding) {
      newX = x - width - offset;
    }

    if (newY < padding) {
      newY = y + offset;
    }

    if (newX < padding) {
      newX = padding;
    }

    return { x: newX, y: newY };
  };

  useEffect(() => {
    const newChildPositions: {
      [key: string]: { x: number; y: number; size: number; color: string }[];
    } = {};
    nodes.forEach((node) => {
      if (!node) return;
      newChildPositions[node.id] = calculateChildPositions(node, node.children);
    });
    setChildPositions(newChildPositions);
  }, [calculateChildPositions, nodes]);

  const tooltipDetails = useMemo(() => {
    const detailsMap: Record<
      string,
      Array<{
        name: string;
        total: number;
        critical: number;
        falsePositive: number;
        high: number;
        medium: number;
        low: number;
      }>
    > = {};

    data?.list?.forEach((item, index) => {
      if (!item) return;

      const id = item.product_id ?? item.asset_id ?? `${index}`;

      item.vulnerabilities?.forEach((vulnerability) => {
        const vulnerabilityName = vulnerability.vulnerability_name || "N/A";
        if (!detailsMap[id]) {
          detailsMap[id] = [];
        }

        detailsMap[id].push({
          name: vulnerabilityName,
          total: vulnerability.total_vulnerabilities || 0,
          critical: vulnerability.critical_count || 0,
          falsePositive: vulnerability.false_positive_count || 0,
          high: vulnerability.high_count || 0,
          medium: vulnerability.medium_count || 0,
          low: vulnerability.low_count || 0,
        });
      });
    });

    return detailsMap;
  }, [data?.list]);

  const handleParentClick = async (id: string) => {
    const selectedItem = data.list.find(
      (item) => item?.product_id === id || item?.asset_id === id,
    );

    const apiParams: { product_id?: string; asset_id?: string } = {
      product_id: savedProductId ?? product_id ?? undefined,
    };

    if (selectedItem) {
      apiParams.asset_id = selectedItem.asset_id;

      if (selectedItem.product_id) {
        apiParams.product_id = selectedItem.product_id;
        setSavedProductId(selectedItem.product_id);
      }

      if (hasChildTooltip) {
        await getDashboardPopUpTopVulnerability({
          company_id: company_id,
          ...apiParams,
        }).then((res) => {
          dispatch(setVulnerabilityData(res as DashboardTopVulnerabilityList));
        });
      }
    }

    // Ensure this line is always executed, even if selectedItem is not found
    dispatch(setShowAssetsGraph(true));
  };

  const handleCloseTooltip = () => {
    setSavedProductId(null);
  };

  // Tooltip and visualization logic remains the same
  useEffect(() => {
    if (!hasChildTooltip) {
      handleCloseTooltip();
    }
  }, [hasChildTooltip]);

  const addCursorStyle = (
    e: Konva.KonvaEventObject<MouseEvent>,
    action: "enter" | "leave",
  ) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const cursorStyle = action === "enter" ? "pointer" : "default";
    stage.container().style.cursor = cursorStyle;
  };

  const hasVulnerabilities = data?.list.some(
    (item) => item?.vulnerabilities?.length,
  );

  function truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }

  return (
    <div className="no-scrollbar overflow-scroll">
      {hasVulnerabilities ? (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseLeave={() =>
            setTooltip({ visible: false, x: 0, y: 0, details: null })
          }
        >
          <Layer>
            {nodes.map((node) => {
              if (!node) return null;
              const children = childPositions[node.id] || [];
              return (
                <React.Fragment key={node.id}>
                  {children.map((child, index) => {
                    const childVulnerabilityDetails =
                      tooltipDetails[node.id]?.[index] || null;
                    return (
                      <React.Fragment key={`${node.id}-child-${index}`}>
                        <Line
                          points={[node.x, node.y, child.x, child.y]}
                          stroke="#E5D9F8"
                          strokeWidth={1}
                        />
                        <Circle
                          x={child.x}
                          y={child.y}
                          radius={child.size}
                          fill={child.color}
                          onMouseEnter={(e) => {
                            const stage = e.target.getStage();
                            if (!stage) return;
                            const { x, y } = calculateTooltipPosition(
                              child.x,
                              child.y,
                              180,
                              100,
                              600,
                              10,
                            );

                            setTooltip({
                              visible: true,
                              x,
                              y,
                              details: childVulnerabilityDetails
                                ? [childVulnerabilityDetails]
                                : null,
                            });
                          }}
                          onMouseLeave={() =>
                            setTooltip({
                              visible: false,
                              x: 0,
                              y: 0,
                              details: null,
                            })
                          }
                        />
                      </React.Fragment>
                    );
                  })}

                  <Group
                    onClick={() => handleParentClick(node.id)}
                    onMouseEnter={(e) => addCursorStyle(e, "enter")}
                    onMouseLeave={(e) => addCursorStyle(e, "leave")}
                  >
                    <Circle
                      x={node.x}
                      y={node.y}
                      radius={node.radius}
                      fill={node.color}
                    />
                    <Text
                      x={node.x - 30}
                      y={node.y - 6}
                      text={node.name}
                      fontSize={10}
                      fill="white"
                      width={60}
                      fontStyle="700"
                      wrap="char"
                      align="center"
                      ellipsis
                    />
                  </Group>
                </React.Fragment>
              );
            })}

            {tooltip.visible && tooltip.details && hasChildTooltip && (
              <Group>
                <Rect
                  x={tooltip.x}
                  y={tooltip.y}
                  width={185}
                  height={130}
                  fill="black"
                  cornerRadius={5}
                  shadowBlur={5}
                />
                <Text
                  x={tooltip.x + 10}
                  y={tooltip.y + 10}
                  text={tooltip.details
                    .map(
                      (detail) =>
                        `Vulnerability Name: ${truncateText(detail.name, 8)}\n` +
                        `Total: ${detail.total}\n` +
                        `False Positive: ${detail.falsePositive}\n` +
                        `Critical: ${detail.critical}\n` +
                        `High: ${detail.high}\n` +
                        `Medium: ${detail.medium}\n` +
                        `Low: ${detail.low}`,
                    )
                    .join("\n\n")}
                  fontSize={12}
                  fill="white"
                  lineHeight={1.4}
                />
              </Group>
            )}
          </Layer>
        </Stage>
      ) : (
        <div className="text-center">No Vulnerabilities Found</div>
      )}
    </div>
  );
};

export default Graph;
