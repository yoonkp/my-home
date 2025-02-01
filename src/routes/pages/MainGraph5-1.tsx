import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MAIN_NODE_ID = "박윤경의 기술 생태계";

interface ExtendedGraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number; // group=0 => 빈 노드
  isEmpty?: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  // 빈 노드에 연결된 대상 노드 ID (메인 노드와 직접 연결된 노드 중 하나)
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
// 빈 노드 추가 함수
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
// Force #1: 그룹 섹터 2단계 force (빈 노드, 메인 노드 제외)
// ------------------------------
function multiSectorTwoStageForce(radiusStage1 = 150, radiusStage2 = 300, force1 = 100, force2 = 200, initialScale = 0.5) {
  let nodes: ExtendedGraphNode[];
  let groupInfos: { group: number; cx: number; cy: number }[] = [];
  let scaleFactor = initialScale;

  function force(alpha: number) {
    const eff1 = force1 * alpha * scaleFactor;
    const eff2 = force2 * alpha * scaleFactor;

    for (const d of nodes) {
      // 메인 노드나 빈 노드(그룹 0)는 제외
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
    // 메인 노드와 빈 노드 제외하고 그룹 목록 추출
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
// Force #2: 빈 노드 force (빈 노드는 메인 노드와 연결된 한 노드에만 힘 적용)
// ------------------------------
function emptyNodeForce(forceMag = 150, initialScale = 0.5) {
  let nodes: ExtendedGraphNode[];
  let scaleFactor = initialScale;

  function force(alpha: number) {
    const eff = forceMag * alpha * scaleFactor;
    for (const d of nodes) {
      if (!d.isEmpty) continue; // 빈 노드만 처리

      const mainNode = nodes.find((nd) => nd.id === MAIN_NODE_ID);
      if (!mainNode) continue;

      // 1) 메인 노드와 빈 노드 사이의 힘 적용
      applyForce(d, mainNode, eff);

      // 2) 빈 노드가 연결된 대상 노드에 힘 적용
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

    // container의 width가 768px 이하이면 초기 확대값을 0.5, 아니면 0.7로 설정
    const initialScale = containerWidth <= 768 ? 0.5 : 0.8;

    // 툴팁 생성
    const tooltip = d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "5px 8px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("transition", "all 0.15s ease-out");

    // SVG 초기화
    svg.selectAll("*").remove();
    svg.attr("width", containerWidth).attr("height", containerHeight).style("background", "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)").style("overflow", "visible");

    const g = svg.append("g");

    // 줌 설정
    let currentTransform = d3.zoomIdentity;
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      // 스크롤(휠) 및 다중 터치(핀치) 확대/축소 방지
      .filter((event) => {
        if (event.type === "wheel") return false;
        if (event.type === "touchmove" && (event as TouchEvent).touches?.length > 1) return false;
        return true;
      })
      .scaleExtent([initialScale, 5])
      .on("zoom", (event) => {
        currentTransform = event.transform;
        g.attr("transform", currentTransform.toString());
        tooltip.style("visibility", "hidden");
      });

    const initialTransform = d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(initialScale);
    svg.call(zoom as any).call(zoom.transform, initialTransform);
    currentTransform = initialTransform;

    // 그래프 데이터 생성 (깊은 복사 후 빈 노드 추가)
    const graphData = generateAdditionalNodes(JSON.parse(JSON.stringify(initialGraphData)), 50, MAIN_NODE_ID);

    // 메인 노드와 직접 연결된 노드 목록 추출
    const mainConnected: string[] = [];
    graphData.links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      if (s === MAIN_NODE_ID) mainConnected.push(t);
      if (t === MAIN_NODE_ID) mainConnected.push(s);
    });
    const uniqueMainCon = Array.from(new Set(mainConnected));

    // 각 빈 노드에 대해 메인 노드와 직접 연결된 노드 중 하나를 랜덤 할당
    graphData.nodes.forEach((n) => {
      if (n.isEmpty) {
        const pick = uniqueMainCon[Math.floor(Math.random() * uniqueMainCon.length)];
        n.connectedTo = pick;
      }
    });

    // 링크 및 노드 렌더링
    const linkSelection = g.append("g").selectAll<SVGLineElement, GraphLink>("line").data(graphData.links).join("line").attr("stroke", "#4a5568").attr("stroke-opacity", 0.6).attr("stroke-width", 2);

    // 빈 노드 렌더링 (뒤쪽)
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

    // 커스텀 force 생성
    const sectorForce = multiSectorTwoStageForce(150, 300, 100, 200, 0.5);
    const emptyForce = emptyNodeForce(150, 0.5);

    // D3 시뮬레이션 설정
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
      .force("center", d3.forceCenter(0, 0).strength(0.01))
      .force("x", d3.forceX(0).strength(0.05))
      .force("y", d3.forceY(0).strength(0.05))
      // 사용자 정의 force 추가
      .force("multiSector", sectorForce)
      .force("emptyNodeForce", emptyForce)
      .velocityDecay(0.6)
      .alpha(0.5)
      .alphaMin(0.001)
      .alphaDecay(0.003);

    // 주기적으로 시뮬레이션 알파를 높여 노드가 살짝 흔들리도록 처리
    let timer: number;
    const jiggle = () => {
      simulation.alpha(0.2);
      simulation.restart();
      timer = window.setTimeout(jiggle, 3000);
    };
    jiggle();

    // 시뮬레이션 tick 시 링크와 노드 위치 업데이트
    simulation.on("tick", () => {
      linkSelection
        .attr("x1", (d) => (typeof d.source !== "string" ? d.source.x ?? 0 : 0))
        .attr("y1", (d) => (typeof d.source !== "string" ? d.source.y ?? 0 : 0))
        .attr("x2", (d) => (typeof d.target !== "string" ? d.target.x ?? 0 : 0))
        .attr("y2", (d) => (typeof d.target !== "string" ? d.target.y ?? 0 : 0));

      emptyCircles.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);
      normalCircles.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);
    });

    // 드래그 동작 설정
    const dragBehavior = d3
      .drag<SVGCircleElement, ExtendedGraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        sectorForce.setScaleFactor(1.0);
        emptyForce.setScaleFactor(1.0);
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        sectorForce.setScaleFactor(0.5);
        emptyForce.setScaleFactor(0.5);
        d.fx = null;
        d.fy = null;
      });

    normalCircles.call(dragBehavior as any);

    // 마우스 오버/아웃 이벤트: 일반 노드에 대해
    normalCircles
      .on("mouseover", (event, d) => {
        // 노드 반경 확대 효과
        d3.select(event.currentTarget).attr("r", d.id === MAIN_NODE_ID ? 60 : 30);

        // 노드 좌표(줌 변환 적용)를 기준으로 툴팁 위치 계산
        const tooltipOffset = 10;
        const screenX = (d.x ?? 0) * currentTransform.k + currentTransform.x + tooltipOffset;
        const screenY = (d.y ?? 0) * currentTransform.k + currentTransform.y + tooltipOffset;
        tooltip.style("visibility", "visible").style("left", `${screenX}px`).style("top", `${screenY}px`).text(d.id);

        // 해당 노드와 연결된 링크 스타일 변경
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
        // 원래 크기로 복원
        d3.select(event.currentTarget).attr("r", d.id === MAIN_NODE_ID ? 50 : 20);
        tooltip.style("visibility", "hidden");
        linkSelection.style("stroke", "#4a5568").style("stroke-opacity", 0.6);
      });

    // 컴포넌트 unmount 시 cleanup
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
          height: "64dvh",
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
