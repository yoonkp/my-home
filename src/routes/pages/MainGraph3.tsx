import React, { useEffect, useRef } from "react";
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
const generateAdditionalNodes = (baseData: GraphData, additionalNodesCount: number, centerNodeId: string): GraphData => {
  const centerNode = baseData.nodes.find((node) => node.id === centerNodeId);
  if (!centerNode) throw new Error(`Node with ID "${centerNodeId}" not found`);

  const radius = 150; // 빈 노드들이 감싸는 반지름
  const angleStep = (2 * Math.PI) / additionalNodesCount;

  const newNodes: GraphNode[] = Array.from({ length: additionalNodesCount }, (_, i) => {
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

const MainGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 툴팁 div 생성
    const tooltip = d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "10");

    // 그래프 데이터 준비
    const graphData = generateAdditionalNodes(JSON.parse(JSON.stringify(initialGraphData)), 80, "박윤경의 기술 생태계");

    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height).style("background", "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)");

    const g = svg.append("g");

    // 줌 및 패닝 설정
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
        // 줌 시 툴팁 위치 조정
        tooltip.style("visibility", "hidden");
      });

    svg.call(zoom as any);

    // 링크 생성 및 애니메이션 효과 추가
    const link = g
      .append("g")
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke", "#4a5568")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .style("transition", "stroke-width 0.2s ease");

    // 노드 생성 및 인터랙션 효과 추가
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
      .style("transition", "all 0.3s ease")
      .style("cursor", "pointer")
      .on("mouseover", (event: MouseEvent, d: GraphNode) => {
        if (d.isEmpty) return;

        // 노드 하이라이트 효과
        d3.select(event.currentTarget as SVGCircleElement)
          .transition()
          .duration(200)
          .attr("r", d.id === "박윤경의 기술 생태계" ? 30 : 15)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);

        // 연결된 링크 하이라이트
        link
          .transition()
          .duration(200)
          .attr("stroke-width", (l) => {
            const source = typeof l.source === "string" ? l.source : l.source.id;
            const target = typeof l.target === "string" ? l.target : l.target.id;
            return source === d.id || target === d.id ? 4 : 2;
          })
          .attr("stroke-opacity", (l) => {
            const source = typeof l.source === "string" ? l.source : l.source.id;
            const target = typeof l.target === "string" ? l.target : l.target.id;
            return source === d.id || target === d.id ? 1 : 0.2;
          });

        // 툴팁 표시
        if (!d.isEmpty) {
          const containerRect = container.getBoundingClientRect();
          tooltip
            .html(d.id)
            .style("visibility", "visible")
            .style("left", `${event.pageX - containerRect.left + container.scrollLeft + 10}px`)
            .style("top", `${event.pageY - containerRect.top + container.scrollTop - 10}px`);
        }
      })
      .on("mousemove", (event) => {
        const containerRect = container.getBoundingClientRect();
        tooltip.style("left", `${event.pageX - containerRect.left + container.scrollLeft + 10}px`).style("top", `${event.pageY - containerRect.top + container.scrollTop - 10}px`);
      })
      .on("mouseout", (event, d) => {
        // 노드 효과 제거
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", d.id === "박윤경의 기술 생태계" ? 25 : 12)
          .attr("stroke", null);

        // 링크 효과 제거
        link.transition().duration(200).attr("stroke-width", 2).attr("stroke-opacity", 0.6);

        // 툴팁 숨기기
        tooltip.style("visibility", "hidden");
      })
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
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
          }) as any
      );

    // Simulation 설정
    const simulation = d3
      .forceSimulation<GraphNode>(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(graphData.links)
          .id((d: GraphNode) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody<GraphNode>().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<GraphNode>().radius((d: GraphNode) => (d.isEmpty ? 6 : 18))
      );

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (typeof d.source !== "string" ? d.source.x || 0 : 0))
        .attr("y1", (d) => (typeof d.source !== "string" ? d.source.y || 0 : 0))
        .attr("x2", (d) => (typeof d.target !== "string" ? d.target.x || 0 : 0))
        .attr("y2", (d) => (typeof d.target !== "string" ? d.target.y || 0 : 0));

      node.attr("cx", (d) => d.x || 0).attr("cy", (d) => d.y || 0);
    });

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 600;

      svg.attr("width", newWidth).attr("height", newHeight);

      simulation
        .force("center", d3.forceCenter(newWidth / 2, newHeight / 2))
        .alpha(0.3)
        .restart();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
      tooltip.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="main__graph">
      <div ref={containerRef} style={{ width: "100%", height: "60dvh", position: "relative" }}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default MainGraph;
