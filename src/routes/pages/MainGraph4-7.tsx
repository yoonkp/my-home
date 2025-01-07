/**
 * emptynode는 darg 대상이 안되도록 변경.emptynode는 lower floor처럼 존재하도록 변경.emptynode는 ‘mainnode의 force’와 nodes group중에 ‘mainnode에 직접연결된 node 하나(one)’에만 force영향을 받도록 변경
 */

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MAIN_NODE_ID = "박윤경의 기술 생태계";

// ------------------------------------
// 1) 인터페이스
// ------------------------------------
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

// ------------------------------------
// 2) 초기 데이터 (같이 사용)
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
// 3) generateAdditionalNodes
// ------------------------------------
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

// ------------------------------------
// 4) Force #1: mainNodeBoundaryForce
//     (유지 - 지름80 범위)
//     + setScaleFactor() (드래그 중 100% 등)
// ------------------------------------
function mainNodeBoundaryForce(strength = 800, initialScale = 0.5) {
  const RADIUS = 40; // diameter=80 => radius=40
  let nodes: ExtendedGraphNode[];
  let scaleFactor = initialScale;

  function force(alpha: number) {
    const eff = strength * alpha * scaleFactor;
    for (const d of nodes) {
      if (d.id !== MAIN_NODE_ID) continue;
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

  function setScaleFactor(f: number) {
    scaleFactor = f;
  }

  return Object.assign(force, { setScaleFactor });
}

// ------------------------------------
// 5) Force #2: multiSectorTwoStageForce
//     (유지 - 그룹 섹터 2단계)
//     + setScaleFactor() (드래그 중 100% 등)
// ------------------------------------
function multiSectorTwoStageForce(radiusStage1 = 150, radiusStage2 = 300, force1 = 100, force2 = 200, initialScale = 0.5) {
  let nodes: ExtendedGraphNode[];
  let groupInfos: { group: number; cx: number; cy: number }[] = [];
  let scaleFactor = initialScale;

  function force(alpha: number) {
    const eff1 = force1 * alpha * scaleFactor;
    const eff2 = force2 * alpha * scaleFactor;

    for (const d of nodes) {
      if (d.id === MAIN_NODE_ID) continue;
      if (d.group === 0) continue; // empty node는 여기서 제외

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

// ------------------------------------
// 6) Force #3: emptyNodeForce
//    empty node => 오직 (main node + main node와 직접 연결된 node 1개)에게만 영향
// ------------------------------------
function emptyNodeForce(
  forceMag = 150, // force 크기 (양수 => 끌어당김, 음수 => 반발)
  initialScale = 0.5
) {
  let nodes: ExtendedGraphNode[];
  let scaleFactor = initialScale;

  // mainNode의 직접 연결 목록 (id 모음)
  const mainAdjSet = new Set<string>();
  // empty node마다 "하나의 연결 노드"를 저장 (connectedTo)
  // 나중에 initialize 시점에 매핑해줄 것

  function force(alpha: number) {
    const eff = forceMag * alpha * scaleFactor;
    for (const d of nodes) {
      if (!d.isEmpty) continue; // empty node만 대상
      // 연결 대상: main node + d.connectedTo
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

  // 실제 거리 계산 후 force 적용
  function applyForce(target: ExtendedGraphNode, source: ExtendedGraphNode, eff: number) {
    const dx = (target.x ?? 0) - (source.x ?? 0);
    const dy = (target.y ?? 0) - (source.y ?? 0);
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    const angle = Math.atan2(dy, dx);
    // 예: 양수 eff => 'source' 위치로 끌어당기는 식
    // 여기서는 target.vx -= cos(angle)*eff 하면 "target가 source로 이동" 느낌
    target.vx = (target.vx ?? 0) - Math.cos(angle) * eff;
    target.vy = (target.vy ?? 0) - Math.sin(angle) * eff;
  }

  force.initialize = (initNodes: ExtendedGraphNode[]) => {
    nodes = initNodes;

    // (a) mainNode와 연결된 노드 set 구성
    //     links에서 source or target이 MAIN_NODE_ID 인 것 찾음
    const gLinks = (nodes as any)._links || []; // d3 forceLink 내부 구조(X)
    // 일반적으로 graphData.links를 활용
    // => 아래처럼 외부에서 links를 전달받아야 하므로, 구조 조금 수정 필요.
    // 여기서는 편의상 "graphData"를 전역에서 참조했을 수 있음.

    // 대신 아래처럼, 곧바로 initNodes 사용은 어려우므로
    // "initialize"를 호출할 때 links를 인자로 받도록 하거나,
    // Force 생성 시점에 links를 인자로 넘길 수도 있음.

    // 예시로, 아래 로직은 "initNodes"에는 _links가 없다고 가정→그냥 별도 변수 linkList 써서 함수화
  };

  function setScaleFactor(f: number) {
    scaleFactor = f;
  }

  return Object.assign(force, { setScaleFactor, mainAdjSet });
}

// ------------------------------------
// 7) MainGraph 컴포넌트
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

    // 툴팁
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

    // 데이터
    const graphData = generateAdditionalNodes(JSON.parse(JSON.stringify(initialGraphData)), 50, MAIN_NODE_ID);

    // (a) "메인 노드와 직접 연결된 노드" 파악
    //     links에서, source/target 중 하나가 MAIN_NODE_ID인 경우
    const mainConnected: string[] = [];
    graphData.links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      if (s === MAIN_NODE_ID) mainConnected.push(t);
      if (t === MAIN_NODE_ID) mainConnected.push(s);
    });

    // (b) Empty Node에 대해 "connectedTo"를 할당 (랜덤 1개)
    //     => mainConnected가 비어있지 않다고 가정
    const uniqueMainCon = Array.from(new Set(mainConnected));
    graphData.nodes.forEach((n) => {
      if (n.isEmpty) {
        // random pick
        const pick = uniqueMainCon[Math.floor(Math.random() * uniqueMainCon.length)];
        n.connectedTo = pick;
      }
    });

    // 링크 / 노드 분리
    const linkSelection = g.append("g").selectAll<SVGLineElement, GraphLink>("line").data(graphData.links).join("line").attr("stroke", "#4a5568").attr("stroke-opacity", 0.6).attr("stroke-width", 2);

    // (c) Empty Node용 G, 일반 Node용 G 분리 (lower floor)
    const emptyNodeSelection = g.append("g"); // 뒤
    const normalNodeSelection = g.append("g"); // 앞

    // empty node
    const emptyCircles = emptyNodeSelection
      .selectAll<SVGCircleElement, ExtendedGraphNode>("circle")
      .data(graphData.nodes.filter((d) => d.isEmpty))
      .join("circle")
      .attr("r", 4)
      .attr("fill", "#777") // 예: 회색
      .style("cursor", "default"); // 드래그 불가

    // normal node
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

    // ------------------------------
    // (d) Force 인스턴스 생성
    // ------------------------------
    const boundaryF = mainNodeBoundaryForce(800, 0.5);
    const sectorF = multiSectorTwoStageForce(150, 300, 100, 200, 0.5);

    // * 새 Force: emptyNodeForce(메인+직접연결)
    const eNodeF = emptyNodeForce(150, 0.5);

    // 시뮬레이션
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
      // 충돌 (메인=140, 일반=80, empty=40)
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
      // (1) 메인 노드 지름80 boundary
      .force("mainBoundary", boundaryF)
      // (2) 섹터 2단계 force(빈 노드는 제외)
      .force("multiSector", sectorF)
      // (3) emptyNode 전용 Force
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

    // ------------------------------
    // (e) 드래그: empty node 제외
    // ------------------------------
    const dragBehavior = d3
      .drag<SVGCircleElement, ExtendedGraphNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        boundaryF.setScaleFactor(1.0);
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
        boundaryF.setScaleFactor(0.5);
        sectorF.setScaleFactor(0.5);
        eNodeF.setScaleFactor(0.5);

        d.fx = null;
        d.fy = null;
      });

    // normal node에만 drag
    normalCircles.call(dragBehavior as any);

    // 마우스 오버/아웃
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
