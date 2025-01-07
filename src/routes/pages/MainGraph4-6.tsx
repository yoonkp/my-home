/**
 * nodes 중 mainnode를 제외한 group의 n개 갯수에 따라, 360도 원형이 있다는 가정하에 
360도 면적/n개(1개면 각기 360도면적을 차지, 2개면 각기 180도면적을 차지, 3개면 각기 120도 면적을 차지 4개면 각기 90도 면적을 차지... ...)하는 
단, mainnode를 제외한 각기 node group은 고유의 자기 영역의 conter point 부분부터 시작된 2단계 영역을 가진 점진적 force를(force100, force200 2단계영역) . 코드
 */
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MAIN_NODE_ID = "박윤경의 기술 생태계";

// ------------------------------------
// 1) 인터페이스
// ------------------------------------
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

// ------------------------------------
// 2) 초기 데이터
// ------------------------------------
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

// ------------------------------------
// 3) 추가 노드 생성 함수
// ------------------------------------
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

// ------------------------------------
// 4) Force #1: mainNodeBoundaryForce
//    + setScaleFactor()로 힘 비율 조절
// ------------------------------------
function mainNodeBoundaryForce(strength = 800, initialScale = 0.5) {
  const RADIUS = 40; // diameter=80 => radius=40
  let nodes: ExtendedGraphNode[];
  let scaleFactor = initialScale;

  function force(alpha: number) {
    const eff = strength * alpha * scaleFactor;
    for (const d of nodes) {
      if (d.id !== MAIN_NODE_ID) continue; // main node만
      const x = d.x ?? 0;
      const y = d.y ?? 0;
      const dist = Math.sqrt(x * x + y * y);
      if (dist > RADIUS) {
        const angle = Math.atan2(y, x);
        d.vx = (d.vx ?? 0) - Math.cos(angle) * eff;
        d.vy = (d.vy ?? 0) - Math.sin(angle) * eff;
      }
    }
  }

  force.initialize = (initNodes: ExtendedGraphNode[]) => {
    nodes = initNodes;
  };

  // 외부에서 drag할 때 setScaleFactor(1.0/0.5) 변경 가능
  function setScaleFactor(f: number) {
    scaleFactor = f;
  }

  // 반환할 때 메서드를 같이 실어보냄
  return Object.assign(force, { setScaleFactor });
}

// ------------------------------------
// 5) Force #2: multiSectorTwoStageForce
//    + setScaleFactor()로 힘 비율 조절
// ------------------------------------
function multiSectorTwoStageForce(radiusStage1 = 150, radiusStage2 = 300, force1 = 100, force2 = 200, initialScale = 0.5) {
  let nodes: ExtendedGraphNode[];
  let groupInfos: { group: number; cx: number; cy: number }[] = [];
  let scaleFactor = initialScale;

  function force(alpha: number) {
    // scaleFactor에 따라 힘이 줄거나 늘어남
    const eff1 = force1 * alpha * scaleFactor;
    const eff2 = force2 * alpha * scaleFactor;

    for (const d of nodes) {
      // 메인 노드나 group=0(빈 노드)는 무시
      if (d.id === MAIN_NODE_ID) continue;
      if (d.group === 0) continue;

      // 자신의 그룹 섹터 중심
      const info = groupInfos.find((g) => g.group === d.group);
      if (!info) continue;

      const dx = (d.x ?? 0) - info.cx;
      const dy = (d.y ?? 0) - info.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(d.y! - info.cy, d.x! - info.cx);

      // 2단계 로직
      if (dist <= radiusStage1) {
        // 1단계
        d.vx = (d.vx ?? 0) - Math.cos(angle) * eff1;
        d.vy = (d.vy ?? 0) - Math.sin(angle) * eff1;
      } else if (dist <= radiusStage2) {
        // 2단계
        d.vx = (d.vx ?? 0) - Math.cos(angle) * eff2;
        d.vy = (d.vy ?? 0) - Math.sin(angle) * eff2;
      } else {
        // 그 이상은 적용 X
      }
    }
  }

  force.initialize = (initNodes: ExtendedGraphNode[]) => {
    nodes = initNodes;

    // 그룹 목록 (메인 노드, 빈 노드 제외)
    const uniqueGroups = Array.from(new Set(initNodes.filter((d) => d.id !== MAIN_NODE_ID && d.group !== 0).map((d) => d.group))).sort((a, b) => a - b);

    // 그룹당 섹터 각도
    const groupCount = uniqueGroups.length;
    const sliceAngle = (2 * Math.PI) / groupCount;
    const sectorRadius = 300; // 섹터 중심 반경

    groupInfos = uniqueGroups.map((grp, i) => {
      // 각 그룹별 중심 각도
      const midAngle = sliceAngle * i + sliceAngle / 2;
      const cx = sectorRadius * Math.cos(midAngle);
      const cy = sectorRadius * Math.sin(midAngle);
      return { group: grp, cx, cy };
    });
  };

  function setScaleFactor(f: number) {
    scaleFactor = f;
  }

  return Object.assign(force, { setScaleFactor });
}

// ------------------------------------
// 6) 메인 컴포넌트
// ------------------------------------
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
    const graphData = generateAdditionalNodes(
      JSON.parse(JSON.stringify(initialGraphData)),
      50, // 빈 노드 수 예시
      MAIN_NODE_ID
    );

    // link, node
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
        return colors[d.group - 1] || "#AAAAAA";
      })
      .style("cursor", "pointer")
      .style("transition", "r 0.2s ease-out");

    // ------------------------------
    // (A) Force 인스턴스 생성
    //     초기 scaleFactor=0.5 (평소 50%)
    // ------------------------------
    const boundaryF = mainNodeBoundaryForce(800, 0.5);
    const sectorF = multiSectorTwoStageForce(150, 300, 100, 200, 0.5);

    // ------------------------------
    // (B) D3 시뮬레이션
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
            return -1200;
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
      // 기본 중심 유도
      .force("center", d3.forceCenter(0, 0).strength(0.01))
      .force("x", d3.forceX(0).strength(0.05))
      .force("y", d3.forceY(0).strength(0.05))
      // (1) 메인 노드 바운더리 Force(50% → 드래그 중 100%)
      .force("mainNodeBoundary", boundaryF)
      // (2) 그룹 섹터 2단계 Force(50% → 드래그 중 100%)
      .force("multiSector", sectorF)
      .velocityDecay(0.6)
      .alpha(0.5)
      .alphaMin(0.001)
      .alphaDecay(0.003);

    // ------------------------------
    // (C) 드래그 이벤트에서 scaleFactor 변경
    // ------------------------------
    const dragBehavior = d3
      .drag<SVGCircleElement, ExtendedGraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();

        // 드래그 시작: Force 100%
        boundaryF.setScaleFactor(1.0);
        sectorF.setScaleFactor(1.0);

        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);

        // 드래그 끝: Force 50%로 되돌림
        boundaryF.setScaleFactor(0.5);
        sectorF.setScaleFactor(0.5);

        d.fx = null;
        d.fy = null;
      });

    node.call(dragBehavior as any);

    // ------------------------------
    // (D) 마우스오버/아웃
    // ------------------------------
    node
      .on("mouseover", (event, d) => {
        if (!d.isEmpty) {
          d3.select(event.currentTarget).attr("r", (nodeDatum) => (nodeDatum.id === MAIN_NODE_ID ? 60 : 30));

          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .text(d.id);

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
