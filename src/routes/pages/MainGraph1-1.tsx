import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// GraphNode 타입 정의
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  isEmpty?: boolean; // 빈 노드 여부 추가
}

// GraphLink 타입 정의
interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

// 초기 그래프 데이터
const initialGraphData = {
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
  ] as GraphNode[],
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
  ] as GraphLink[],
};

// 빈 노드와 링크를 추가하는 함수
function generateAdditionalNodes(graphData: typeof initialGraphData, additionalNodesCount: number) {
  const newNodes: GraphNode[] = [];

  for (let i = 0; i < additionalNodesCount; i++) {
    const newNode: GraphNode = {
      id: `빈 노드 ${i + 1}`,
      group: 0,
      isEmpty: true,
    };
    newNodes.push(newNode);
  }

  graphData.nodes = [...graphData.nodes, ...newNodes];
  return graphData;
}

const MainGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const handlePageLoad = () => {
      setIsPageLoaded(true);
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  useEffect(() => {
    if (!isPageLoaded) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    const width = container?.clientWidth || 800;
    const height = container?.clientHeight || 600;

    // 빈 노드 추가
    const graphData = generateAdditionalNodes(JSON.parse(JSON.stringify(initialGraphData)), 80);

    svg.selectAll("*").remove();

    // Simulation 생성
    const simulation = d3
      .forceSimulation<GraphNode>(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(graphData.links)
          .id((d) => d.id)
          .distance((d) => {
            const sourceNode = d.source as GraphNode;
            const targetNode = d.target as GraphNode;
            return sourceNode.isEmpty || targetNode.isEmpty ? 50 : 200;
          })
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => ((d as GraphNode).isEmpty ? -50 : -300))
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // 링크 생성
    const link = svg.append("g").attr("stroke", "#999").attr("stroke-opacity", 0.6).selectAll("line").data(graphData.links).join("line").attr("stroke-width", 2);

    // 노드 생성
    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", (d) => (d.isEmpty ? 4 : d.id === "박윤경의 기술 생태계" ? 20 : 12))
      .attr("fill", (d) => (d.isEmpty ? "#222" : d3.schemeCategory10[d.group % 10]));

    // 툴팁 생성
    const tooltip = d3
      .select(container)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-size", "12px");

    // 마우스 오버 이벤트 추가
    node
      .on("mouseover", (event, d) => {
        if (!d.isEmpty) {
          tooltip
            .style("visibility", "visible")
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`)
            .text(d.id);
        }
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
    });

    return () => {
      simulation.stop();
    };
  }, [isPageLoaded]);

  return (
    <div className="main__graph">
      <div className="graph-wrap" ref={containerRef}>
        {isPageLoaded ? <svg ref={svgRef}></svg> : null}
      </div>
    </div>
  );
};

export default MainGraph;
