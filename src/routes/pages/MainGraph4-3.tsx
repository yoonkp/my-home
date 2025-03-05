/**
 * main__graph의 center point에서 diameter 80영역 line에 force -800가 main node에만 적용되도록 코드작성
 */

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MAIN_NODE_ID = "박윤경의 기술 생태계";
const DIAMETER = 80; // 지름 80
const RADIUS = DIAMETER / 2;

// ------------------------------
// 1) 인터페이스
// ------------------------------
interface ExtendedGraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  isEmpty?: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink extends d3.SimulationLinkDatum<ExtendedGraphNode> {
  source: string | ExtendedGraphNode;
  target: string | ExtendedGraphNode;
}

interface GraphData {
  nodes: ExtendedGraphNode[];
  links: GraphLink[];
}

// ------------------------------
// 2) 초기 데이터
// ------------------------------
const initialGraphData: GraphData = {
  nodes: [
    { id: MAIN_NODE_ID, group: 1 },
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
    { source: MAIN_NODE_ID, target: "작업환경" },
    { source: MAIN_NODE_ID, target: "캐릭터" },
    { source: MAIN_NODE_ID, target: "목표" },
    { source: "작업환경", target: "실시간 반응 속도" },
    { source: "작업환경", target: "아키텍쳐 이해도" },
    { source: "캐릭터", target: "이해도" },
    { source: "캐릭터", target: "퍼블(개발)" },
    { source: "목표", target: "매출증대" },
    { source: "목표", target: "이펙트" },
    { source: "목표", target: "퍼블(기획)" },
  ],
};

// ------------------------------
// 3) 추가 노드 생성 함수
// ------------------------------
const generateAdditionalNodes = (baseData: GraphData, additionalNodesCount: number, centerNodeId: string): GraphData => {
  const centerNode = baseData.nodes.find((n) => n.id === centerNodeId);
  if (!centerNode) throw new Error(`Node with ID "${centerNodeId}" not found`);

  const radius = 150;
  const angleStep = (2 * Math.PI) / additionalNodesCount;

  const newNodes: ExtendedGraphNode[] = Array.from({ length: additionalNodesCount }, (_, i) => {
    const angle = i * angleStep;
    return {
      id: `빈 노드 ${i + 1}`,
      group: 0,
      isEmpty: true,
      x: (centerNode.x || 0) + radius * Math.cos(angle),
      y: (centerNode.y || 0) + radius * Math.sin(angle),
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

// ------------------------------
// 4) 커스텀 Force: mainNodeBoundaryForce
// ------------------------------
// - main node가 반경 RADIUS(=40) 바깥으로 나가지 못하도록,
//   시뮬레이션 매 tick마다 velocity를 보정해주는 Force
//
function mainNodeBoundaryForce(strength = 500) {
  // D3 Force 스펙에 맞춰 closure 변수 정의
  let nodes: ExtendedGraphNode[];
  function force(alpha: number) {
    // alpha를 곱해서, 시뮬레이션이 안정될수록 힘이 줄어들도록 하는 편
    const effStrength = strength * alpha;

    for (const d of nodes) {
      if (d.id !== MAIN_NODE_ID) continue; // main node만 처리

      const x = d.x ?? 0;
      const y = d.y ?? 0;
      const dist = Math.sqrt(x * x + y * y);

      // 반경 RADIUS (=40) 넘어서면, 원점(0,0) 쪽으로 속도 보정
      if (dist > RADIUS) {
        const angle = Math.atan2(y, x);
        // “거리가 멀수록 힘도 강하게” 하려면 ratio를 사용할 수도 있음
        // const ratio = (dist - RADIUS) / dist;
        // 여기서는 단순히 -effStrength로 고정
        d.vx = d.vx ?? 0;
        d.vy = d.vy ?? 0;

        // 원점 방향으로 velocity를 -effStrength만큼 보정
        d.vx -= Math.cos(angle) * effStrength;
        d.vy -= Math.sin(angle) * effStrength;
      }
    }
  }

  // force가 초기화될 때 node 목록을 받음
  force.initialize = function (initNodes: ExtendedGraphNode[]) {
    nodes = initNodes;
  };

  return force;
}

// ------------------------------
// 5) 메인 컴포넌트
// ------------------------------
const MainGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    // 컨테이너 크기
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

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

    // 초기화
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

    // 초기 위치
    const initialScale = 0.9;
    const initialTransform = d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(initialScale);

    svg.call(zoom as any).call(zoom.transform, initialTransform);

    // 그래프 데이터 생성
    const graphData = generateAdditionalNodes(JSON.parse(JSON.stringify(initialGraphData)), 100, MAIN_NODE_ID);

    // link, node 생성
    const link = g.append("g").selectAll<SVGLineElement, GraphLink>("line").data(graphData.links).join("line").attr("stroke", "#4a5568").attr("stroke-opacity", 0.6).attr("stroke-width", 2);

    const node = g
      .append("g")
      .selectAll<SVGCircleElement, ExtendedGraphNode>("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", (d) => {
        if (d.isEmpty) return 4;
        if (d.id === MAIN_NODE_ID) return 50;
        return 20;
      })
      .attr("fill", (d) => {
        const colors = ["#60A5FA", "#34D399", "#F472B6", "#FBBF24"];
        return colors[d.group - 1] || colors[0];
      })
      .style("cursor", "pointer")
      .style("transition", "r 0.2s ease-out");

    // 드래그 핸들러
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

    node
      .call(drag as any)
      .on("mouseover", (event, d) => {
        if (!d.isEmpty) {
          d3.select(event.currentTarget).attr("r", (nodeDatum) => (nodeDatum.id === MAIN_NODE_ID ? 60 : 30));

          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .text(d.id);

          // 연결된 링크 강조
          link
            .style("stroke", (l) => {
              const sourceId = typeof l.source === "string" ? l.source : (l.source as ExtendedGraphNode).id;
              const targetId = typeof l.target === "string" ? l.target : (l.target as ExtendedGraphNode).id;
              return sourceId === d.id || targetId === d.id ? "#9fa3a9" : "#4a5568";
            })
            .style("stroke-opacity", (l) => {
              const sourceId = typeof l.source === "string" ? l.source : (l.source as ExtendedGraphNode).id;
              const targetId = typeof l.target === "string" ? l.target : (l.target as ExtendedGraphNode).id;
              return sourceId === d.id || targetId === d.id ? 1 : 0.3;
            });
        }
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).attr("r", (nodeDatum) => (nodeDatum.isEmpty ? 4 : nodeDatum.id === MAIN_NODE_ID ? 50 : 20));
        tooltip.style("visibility", "hidden");
        link.style("stroke", "#4a5568").style("stroke-opacity", 0.6);
      });

    // ------------------------------
    // 시뮬레이션
    // ------------------------------
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
          if (d.id === MAIN_NODE_ID) {
            return -1200; // 기존 반발력
          } else if (!d.isEmpty) {
            return -600;
          } else {
            return -180;
          }
        })
      )
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => {
            if (d.id === MAIN_NODE_ID) {
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
      // (중요) main node만 diameter=80 영역 밖으로 못 나가도록 하는 force
      .force("mainNodeBoundary", mainNodeBoundaryForce(800)) // 강도 800
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

    // tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (typeof d.source !== "string" ? d.source.x || 0 : 0))
        .attr("y1", (d) => (typeof d.source !== "string" ? d.source.y || 0 : 0))
        .attr("x2", (d) => (typeof d.target !== "string" ? d.target.x || 0 : 0))
        .attr("y2", (d) => (typeof d.target !== "string" ? d.target.y || 0 : 0));

      node.attr("cx", (d) => d.x || 0).attr("cy", (d) => d.y || 0);
    });

    // 리사이즈
    window.addEventListener("resize", () => {
      const newContainerWidth = container.clientWidth;
      const newContainerHeight = container.clientHeight;
      svg.attr("width", newContainerWidth).attr("height", newContainerHeight);

      const newTransform = d3.zoomIdentity.translate(newContainerWidth / 2, newContainerHeight / 2).scale(initialScale);

      svg.call(zoom.transform, newTransform);
    });

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
