/**
 * 우선순위 2.node 그룹인 (빨강, 노랑, 녹색)간에
 * 근접 가까워졌을 때 node 색상이 근접한 두 개의 node 합산색으로 변경되는 예시
 */

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// ---------------------------------------------
// 1) 커스텀 속성을 포함한 확장 인터페이스
// ---------------------------------------------
interface ExtendedGraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  isEmpty?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  // -- 추가 속성 --
  originalColor?: string;
  currentColor?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<ExtendedGraphNode> {
  source: string | ExtendedGraphNode;
  target: string | ExtendedGraphNode;
}

interface GraphData {
  nodes: ExtendedGraphNode[];
  links: GraphLink[];
}

// ---------------------------------------------
// 2) 초기 데이터
// ---------------------------------------------
const initialGraphData: GraphData = {
  nodes: [
    { id: "박윤경의 기술 생태계", group: 1 },
    { id: "작업환경", group: 2 },
    { id: "실시간 반응 속도", group: 2 },
    { id: "아키텍쳐 이해도", group: 2 },
    { id: "캐릭터", group: 3 },
    { id: "이해도", group: 3 },
    { id: "퍼블(개발)", group: 3 },
    { id: "목표", group: 4 },
    { id: "매출증대", group: 4 },
    { id: "이펙트", group: 4 },
    { id: "퍼블(기획)", group: 4 },
  ],
  links: [
    { source: "박윤경의 기술 생태계", target: "작업환경" },
    { source: "박윤경의 기술 생태계", target: "캐릭터" },
    { source: "박윤경의 기술 생태계", target: "목표" },
    { source: "작업환경", target: "실시간 반응 속도" },
    { source: "작업환경", target: "아키텍쳐 이해도" },
    { source: "캐릭터", target: "이해도" },
    { source: "캐릭터", target: "퍼블(개발)" },
    { source: "목표", target: "매출증대" },
    { source: "목표", target: "이펙트" },
    { source: "목표", target: "퍼블(기획)" },
  ],
};

// ---------------------------------------------
// 3) 빈 노드 생성 함수
// ---------------------------------------------
const generateAdditionalNodes = (baseData: GraphData, additionalNodesCount: number, centerNodeId: string): GraphData => {
  const centerNode = baseData.nodes.find((node) => node.id === centerNodeId);
  if (!centerNode) throw new Error(`Node with ID "${centerNodeId}" not found`);

  const radius = 150;
  const angleStep = (2 * Math.PI) / additionalNodesCount;

  const newNodes: ExtendedGraphNode[] = Array.from({ length: additionalNodesCount }, (_, i) => {
    const angle = i * angleStep;
    return {
      id: `빈 노드 ${i + 1}`,
      group: 0,
      isEmpty: true,
      x: (centerNode.x ?? 0) + radius * Math.cos(angle),
      y: (centerNode.y ?? 0) + radius * Math.sin(angle),
    };
  });

  const newLinks: GraphLink[] = newNodes.map((node) => ({
    source: centerNodeId,
    target: node.id,
  }));

  return {
    nodes: [...baseData.nodes, ...newNodes],
    links: [...baseData.links, ...newLinks],
  };
};

// ---------------------------------------------
// 4) 메인 컴포넌트
// ---------------------------------------------
const MainGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // (A) 색상 합산 함수
    const combineColors = (color1: string, color2: string) => {
      const c1 = d3.color(color1);
      const c2 = d3.color(color2);
      if (!c1 || !c2) return color1;

      const r = Math.min(255, c1.r + c2.r);
      const g = Math.min(255, c1.g + c2.g);
      const b = Math.min(255, c1.b + c2.b);

      return d3.rgb(r, g, b).formatHex();
    };

    // (B) 그룹2가 될 때 사용할 색상 3가지
    const subColors = ["#ff0000", "#ffff00", "#00ff00"]; // 빨강, 노랑, 초록

    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    // 컨테이너 크기 설정
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // 툴팁 생성
    const tooltip = d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("transition", "all 0.15s ease-out");

    // SVG 초기화
    svg.selectAll("*").remove();
    svg.attr("width", containerWidth).attr("height", containerHeight).style("background", "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)").style("overflow", "visible");

    const g = svg.append("g");

    // 줌 설정
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
        tooltip.style("visibility", "hidden");
      });

    // 초기 확대·이동
    const initialScale = 0.9;
    const initialTransform = d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(initialScale);

    svg.call(zoom as any).call(zoom.transform, initialTransform);

    // (C) 추가 노드 생성 후 data 준비
    const graphData = generateAdditionalNodes(JSON.parse(JSON.stringify(initialGraphData)) as GraphData, 100, "박윤경의 기술 생태계");

    // (D) 그룹2 노드에 originalColor 설정
    graphData.nodes.forEach((node) => {
      if (node.group === 2) {
        const randomIndex = Math.floor(Math.random() * subColors.length);
        node.originalColor = subColors[randomIndex];
      }
    });

    // link 생성
    const link = g.append("g").selectAll<SVGLineElement, GraphLink>("line").data(graphData.links).join("line").attr("stroke", "#4a5568").attr("stroke-opacity", 0.6).attr("stroke-width", 2);

    // node 생성
    const node = g
      .append("g")
      .selectAll<SVGCircleElement, ExtendedGraphNode>("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", (d) => {
        if (d.isEmpty) return 4;
        if (d.id === "박윤경의 기술 생태계") return 50;
        return 20;
      })
      // fill: 임시(그룹별 기본 색)
      .attr("fill", (d) => {
        const colors = ["#60A5FA", "#34D399", "#F472B6", "#FBBF24"];
        return colors[d.group - 1] || colors[0];
      })
      .style("cursor", "pointer")
      .style("transition", "r 0.2s ease-out");

    // 드래그 설정
    const drag = d3
      .drag<SVGCircleElement, ExtendedGraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

    // 마우스 오버/아웃 설정
    node
      .on("mouseover", (event, d) => {
        if (!d.isEmpty) {
          d3.select(event.currentTarget).attr("r", (nodeDatum) => (nodeDatum.id === "박윤경의 기술 생태계" ? 60 : 30));
          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .text(d.id);

          // 연결된 링크 강조
          link
            .style("stroke", (l) => {
              const sourceId = typeof l.source === "string" ? l.source : l.source.id;
              const targetId = typeof l.target === "string" ? l.target : l.target.id;
              return sourceId === d.id || targetId === d.id ? "#9fa3a9" : "#4a5568";
            })
            .style("stroke-opacity", (l) => {
              const sourceId = typeof l.source === "string" ? l.source : l.source.id;
              const targetId = typeof l.target === "string" ? l.target : l.target.id;
              return sourceId === d.id || targetId === d.id ? 1 : 0.3;
            });
        }
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).attr("r", (nodeDatum) => (nodeDatum.isEmpty ? 4 : nodeDatum.id === "박윤경의 기술 생태계" ? 50 : 20));
        tooltip.style("visibility", "hidden");

        link.style("stroke", "#4a5568").style("stroke-opacity", 0.6);
      });

    // (E) 시뮬레이션 설정
    const simulation = d3
      .forceSimulation<ExtendedGraphNode>(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink<ExtendedGraphNode, GraphLink>(graphData.links)
          .id((d) => d.id)
          .distance(300)
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => {
          if (d.id === "박윤경의 기술 생태계") {
            return -1200; // 메인 노드 강한 반발
          } else if (!d.isEmpty) {
            return -600; // 일반 노드
          } else {
            return -180; // 빈 노드
          }
        })
      )
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => {
            if (d.id === "박윤경의 기술 생태계") {
              return 140;
            } else if (!d.isEmpty) {
              return 80;
            } else {
              return 40;
            }
          })
          .strength(1)
      )
      .force("center", d3.forceCenter(0, 0))
      .force("x", d3.forceX(0).strength(0.05))
      .force("y", d3.forceY(0).strength(0.05))
      .velocityDecay(0.6)
      .alpha(0.5)
      .alphaMin(0.001)
      .alphaDecay(0.003);

    // 흔들림 유지
    let timer: number;
    const jiggle = () => {
      simulation.alpha(0.2);
      simulation.restart();
      timer = window.setTimeout(jiggle, 3000);
    };
    jiggle();

    // (F) tick 이벤트: 노드 위치·색상 업데이트
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (typeof d.source !== "string" ? d.source.x ?? 0 : 0))
        .attr("y1", (d) => (typeof d.source !== "string" ? d.source.y ?? 0 : 0))
        .attr("x2", (d) => (typeof d.target !== "string" ? d.target.x ?? 0 : 0))
        .attr("y2", (d) => (typeof d.target !== "string" ? d.target.y ?? 0 : 0));

      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);

      // --- 그룹2 근접 색상 합산 로직 ---
      const threshold = 20; // 20px 이하로 가까우면 합산
      graphData.nodes.forEach((current) => {
        if (current.group === 2) {
          // 1) 매 tick마다 currentColor를 originalColor로 초기화
          current.currentColor = current.originalColor;

          // 2) 가장 가까운 그룹2 노드를 찾는다
          let minDist = Infinity;
          let closestNode: ExtendedGraphNode | null = null;

          graphData.nodes.forEach((other) => {
            if (other !== current && other.group === 2) {
              const dx = (current.x ?? 0) - (other.x ?? 0);
              const dy = (current.y ?? 0) - (other.y ?? 0);
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < minDist) {
                minDist = dist;
                closestNode = other;
              }
            }
          });

          // 3) threshold보다 가깝다면 합산색 적용
          if (closestNode && minDist < threshold && closestNode.originalColor) {
            const newColor = combineColors(current.originalColor || "#000000", closestNode.originalColor);
            current.currentColor = newColor;
          }
        }
      });

      // --- fill 재반영 ---
      node.attr("fill", (d) => {
        if (d.group === 2) {
          return d.currentColor || d.originalColor || "#ff0000";
        } else {
          // 기존 그룹별 색상
          const colors = ["#60A5FA", "#34D399", "#F472B6", "#FBBF24"];
          return colors[d.group - 1] || colors[0];
        }
      });
    });

    // (G) 리사이즈 핸들러
    window.addEventListener("resize", () => {
      const newContainerWidth = container.clientWidth;
      const newContainerHeight = container.clientHeight;
      svg.attr("width", newContainerWidth).attr("height", newContainerHeight);

      const newTransform = d3.zoomIdentity.translate(newContainerWidth / 2, newContainerHeight / 2).scale(initialScale);
      svg.call(zoom.transform, newTransform);
    });

    // (H) cleanup
    return () => {
      clearTimeout(timer);
      simulation.stop();
      svg.selectAll("*").remove();
      tooltip.remove();
    };
  }, []);

  return (
    <div className="main__graph">
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "74vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default MainGraph;
