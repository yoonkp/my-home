import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// 타입 정의
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  isEmpty?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// 초기 그래프 데이터
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

// 빈 노드 생성 함수
const generateAdditionalNodes = (baseData: GraphData, additionalNodesCount: number): GraphData => {
  const newNodes: GraphNode[] = Array.from({ length: additionalNodesCount }, (_, i) => ({
    id: `빈 노드 ${i + 1}`,
    group: 0,
    isEmpty: true,
  }));

  return {
    nodes: [...baseData.nodes, ...newNodes],
    links: [...baseData.links],
  };
};

const MainGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 그래프 데이터 준비
    const graphData = generateAdditionalNodes(JSON.parse(JSON.stringify(initialGraphData)), 80);

    svg.selectAll("*").remove();

    // SVG 배경 설정
    svg.attr("width", width).attr("height", height).style("background", "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)");

    // 메인 그룹 요소 생성
    const g = svg.append("g");

    // 줌 기능 추가
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom as any);

    // Simulation 생성
    const simulation = d3
      .forceSimulation<GraphNode>(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(graphData.links)
          .id((d) => d.id)
          .distance((d) => {
            const sourceNode = typeof d.source === "string" ? graphData.nodes.find((n) => n.id === d.source) : d.source;
            const targetNode = typeof d.target === "string" ? graphData.nodes.find((n) => n.id === d.target) : d.target;
            return sourceNode?.isEmpty || targetNode?.isEmpty ? 50 : 200;
          })
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => (d.isEmpty ? -50 : -300))
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => (d.isEmpty ? 5 : 15))
      )
      .alphaMin(0.001)
      .alphaDecay(0.005)
      .velocityDecay(0.1);

    // 지속적인 움직임을 위한 타이머 설정
    setInterval(() => {
      simulation.alpha(0.1);
      simulation.restart();
    }, 3000);

    // 링크 생성
    const link = g.append("g").selectAll<SVGLineElement, GraphLink>("line").data(graphData.links).join("line").attr("stroke", "#4a5568").attr("stroke-opacity", 0.6).attr("stroke-width", 2);

    // 노드 생성
    const node = g
      .append("g")
      .selectAll<SVGCircleElement, GraphNode>("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", (d) => (d.isEmpty ? 4 : d.id === "박윤경의 기술 생태계" ? 25 : 12))
      .attr("fill", (d) => {
        const colors = ["#60A5FA", "#34D399", "#F472B6", "#FBBF24"];
        return colors[d.group - 1] || colors[0];
      })
      .call(drag(simulation) as any);

    // 툴팁 생성
    const tooltip = d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(17, 24, 39, 0.95)")
      .style("color", "#e2e8f0")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("font-size", "14px");

    // 드래그 함수
    function drag(simulation: d3.Simulation<GraphNode, undefined>) {
      return d3
        .drag<SVGCircleElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.01);
          d.fx = null;
          d.fy = null;
        });
    }

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (typeof d.source !== "string" ? d.source.x || 0 : 0))
        .attr("y1", (d) => (typeof d.source !== "string" ? d.source.y || 0 : 0))
        .attr("x2", (d) => (typeof d.target !== "string" ? d.target.x || 0 : 0))
        .attr("y2", (d) => (typeof d.target !== "string" ? d.target.y || 0 : 0));

      node.attr("cx", (d) => d.x || 0).attr("cy", (d) => d.y || 0);
    });

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, []);

  return (
    <div className="main__graph">
      <div ref={containerRef} style={{ width: "100%", height: "60dvh" }}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};
export default MainGraph;
