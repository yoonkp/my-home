/**
 * "main__graph의 center point에서 diameter 영역 line에 force 가 main node에만 적용되도록 코드작성"된 부분 제거
 */

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MAIN_NODE_ID = "박윤경의 기술 생태계";

interface ExtendedGraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number; // group=0 => empty node
  isEmpty?: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  // emptyNodeForce에서 사용: "할당된 연결 노드"
  connectedTo?: string;
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
// 초기 그래프 데이터
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
// 빈 노드 추가
// ------------------------------
function generateAdditionalNodes(baseData: GraphData, additionalNodesCount: number, centerNodeId: string): GraphData {
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
}

// ------------------------------
// Force #1: 그룹 섹터 2단계 (mainNodeBoundaryForce 제거)
// ------------------------------
function multiSectorTwoStageForce(radiusStage1 = 150, radiusStage2 = 300, force1 = 100, force2 = 200, initialScale = 0.5) {
  let nodes: ExtendedGraphNode[];
  let groupInfos: { group: number; cx: number; cy: number }[] = [];
  let scaleFactor = initialScale;

  function force(alpha: number) {
    const eff1 = force1 * alpha * scaleFactor;
    const eff2 = force2 * alpha * scaleFactor;

    for (const d of nodes) {
      // 메인 노드나 group=0(빈 노드)는 제외
      if (d.id === MAIN_NODE_ID) continue;
      if (d.group === 0) continue;

      const info = groupInfos.find((g) => g.group === d.group);
      if (!info) continue;

      const dx = (d.x ?? 0) - info.cx;
      const dy = (d.y ?? 0) - info.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(d.y! - info.cy, d.x! - info.cx);

      if (dist <= radiusStage1) {
        d.vx = (d.vx ?? 0) - Math.cos(angle) * eff1;
        d.vy = (d.vy ?? 0) - Math.sin(angle) * eff1;
      } else if (dist <= radiusStage2) {
        d.vx = (d.vx ?? 0) - Math.cos(angle) * eff2;
        d.vy = (d.vy ?? 0) - Math.sin(angle) * eff2;
      }
    }
  }

  force.initialize = (initNodes: ExtendedGraphNode[]) => {
    nodes = initNodes;
    // 그룹 목록
    const uniqueGroups = Array.from(new Set(initNodes.filter((d) => d.id !== MAIN_NODE_ID && d.group !== 0).map((d) => d.group))).sort((a, b) => a - b);

    const groupCount = uniqueGroups.length;
    const sliceAngle = (2 * Math.PI) / groupCount;
    const sectorRadius = 300;

    groupInfos = uniqueGroups.map((grp, i) => {
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

// ------------------------------
// Force #2: emptyNodeForce
//  - empty node => 오직 (main node + main node 직접 연결된 node 1개)에게만 힘
// ------------------------------
function emptyNodeForce(forceMag = 150, initialScale = 0.5) {
  let nodes: ExtendedGraphNode[];
  let scaleFactor = initialScale;

  function force(alpha: number) {
    const eff = forceMag * alpha * scaleFactor;
    for (const d of nodes) {
      if (!d.isEmpty) continue; // empty node만

      const mainNode = nodes.find((nd) => nd.id === MAIN_NODE_ID);
      if (!mainNode) continue;

      // 1) main node -> empty node
      applyForce(d, mainNode, eff);

      // 2) empty node가 연결된 "하나의 노드"
      if (d.connectedTo) {
        const cNode = nodes.find((nd) => nd.id === d.connectedTo);
        if (cNode) {
          applyForce(d, cNode, eff);
        }
      }
    }
  }

  function applyForce(target: ExtendedGraphNode, source: ExtendedGraphNode, eff: number) {
    const dx = (target.x ?? 0) - (source.x ?? 0);
    const dy = (target.y ?? 0) - (source.y ?? 0);
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    const angle = Math.atan2(dy, dx);

    // 양수 eff => source로 끌어당기는 형태 (원하는 로직에 따라 +/- 조절)
    target.vx = (target.vx ?? 0) - Math.cos(angle) * eff;
    target.vy = (target.vy ?? 0) - Math.sin(angle) * eff;
  }

  force.initialize = (initNodes: ExtendedGraphNode[]) => {
    nodes = initNodes;
  };

  function setScaleFactor(f: number) {
    scaleFactor = f;
  }

  return Object.assign(force, { setScaleFactor });
}

// ------------------------------
// 메인 컴포넌트
// ------------------------------
const MainGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

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

    // 줌
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
        tooltip.style("visibility", "hidden");
      });

    const initialScale = 0.9;
    const initialTransform = d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(initialScale);

    svg.call(zoom as any).call(zoom.transform, initialTransform);

    // 그래프 데이터
    const graphData = generateAdditionalNodes(JSON.parse(JSON.stringify(initialGraphData)), 50, MAIN_NODE_ID);

    // "메인 노드와 직접 연결된 노드" 목록 찾기
    const mainConnected: string[] = [];
    graphData.links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      if (s === MAIN_NODE_ID) mainConnected.push(t);
      if (t === MAIN_NODE_ID) mainConnected.push(s);
    });
    const uniqueMainCon = Array.from(new Set(mainConnected));

    // empty node 에 연결할 노드 하나씩 랜덤 할당
    graphData.nodes.forEach((n) => {
      if (n.isEmpty) {
        const pick = uniqueMainCon[Math.floor(Math.random() * uniqueMainCon.length)];
        n.connectedTo = pick;
      }
    });

    // 링크 / 노드 분리
    const linkSelection = g.append("g").selectAll<SVGLineElement, GraphLink>("line").data(graphData.links).join("line").attr("stroke", "#4a5568").attr("stroke-opacity", 0.6).attr("stroke-width", 2);

    // empty node: 뒷층
    const emptyNodeSelection = g.append("g");
    const normalNodeSelection = g.append("g");

    const emptyCircles = emptyNodeSelection
      .selectAll<SVGCircleElement, ExtendedGraphNode>("circle")
      .data(graphData.nodes.filter((d) => d.isEmpty))
      .join("circle")
      .attr("r", 4)
      .attr("fill", "#777")
      .style("cursor", "default");

    const normalCircles = normalNodeSelection
      .selectAll<SVGCircleElement, ExtendedGraphNode>("circle")
      .data(graphData.nodes.filter((d) => !d.isEmpty))
      .join("circle")
      .attr("r", (d) => (d.id === MAIN_NODE_ID ? 50 : 20))
      .attr("fill", (d) => {
        const colors = ["#60A5FA", "#34D399", "#F472B6", "#FBBF24"];
        return colors[d.group - 1] || "#aaaaaa";
      })
      .style("cursor", "pointer")
      .style("transition", "r 0.2s ease-out");

    // 2가지 커스텀 Force 인스턴스 생성
    const sectorF = multiSectorTwoStageForce(150, 300, 100, 200, 0.5);
    const eNodeF = emptyNodeForce(150, 0.5);

    // D3 시뮬레이션 (mainNodeBoundaryForce 제거됨)
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
            if (d.id === MAIN_NODE_ID) return 140;
            if (d.isEmpty) return 40;
            return 80;
          })
          .strength(1)
      )
      // 중심 등
      .force("center", d3.forceCenter(0, 0).strength(0.01))
      .force("x", d3.forceX(0).strength(0.05))
      .force("y", d3.forceY(0).strength(0.05))
      // (1) 섹터 2단계 force(빈 노드 제외)
      .force("multiSector", sectorF)
      // (2) emptyNode 전용 Force
      .force("emptyNodeForce", eNodeF)
      .velocityDecay(0.6)
      .alpha(0.5)
      .alphaMin(0.001)
      .alphaDecay(0.003);

    // 흔들림
    let timer: number;
    const jiggle = () => {
      simulation.alpha(0.2);
      simulation.restart();
      timer = window.setTimeout(jiggle, 3000);
    };
    jiggle();

    // tick
    simulation.on("tick", () => {
      linkSelection
        .attr("x1", (d) => (typeof d.source !== "string" ? d.source.x ?? 0 : 0))
        .attr("y1", (d) => (typeof d.source !== "string" ? d.source.y ?? 0 : 0))
        .attr("x2", (d) => (typeof d.target !== "string" ? d.target.x ?? 0 : 0))
        .attr("y2", (d) => (typeof d.target !== "string" ? d.target.y ?? 0 : 0));

      emptyCircles.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);

      normalCircles.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);
    });

    // 드래그 (mainnodeBoundaryForce 없으므로, 나머지만 스케일 조절)
    const dragBehavior = d3
      .drag<SVGCircleElement, ExtendedGraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        sectorF.setScaleFactor(1.0);
        eNodeF.setScaleFactor(1.0);

        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        sectorF.setScaleFactor(0.5);
        eNodeF.setScaleFactor(0.5);

        d.fx = null;
        d.fy = null;
      });

    normalCircles.call(dragBehavior as any);

    // 마우스 오버/아웃 (normal node만)
    normalCircles
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("r", d.id === MAIN_NODE_ID ? 60 : 30);
        tooltip
          .style("visibility", "visible")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .text(d.id);

        linkSelection
          .style("stroke", (l) => {
            const s = typeof l.source === "string" ? l.source : l.source.id;
            const t = typeof l.target === "string" ? l.target : l.target.id;
            return s === d.id || t === d.id ? "#9fa3a9" : "#4a5568";
          })
          .style("stroke-opacity", (l) => {
            const s = typeof l.source === "string" ? l.source : l.source.id;
            const t = typeof l.target === "string" ? l.target : l.target.id;
            return s === d.id || t === d.id ? 1 : 0.3;
          });
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).attr("r", d.id === MAIN_NODE_ID ? 50 : 20);
        tooltip.style("visibility", "hidden");
        linkSelection.style("stroke", "#4a5568").style("stroke-opacity", 0.6);
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
