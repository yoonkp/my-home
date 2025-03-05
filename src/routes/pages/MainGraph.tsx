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

  // 새로운 빈 노드 생성
  for (let i = 0; i < additionalNodesCount; i++) {
    const newNode: GraphNode = {
      id: `빈 노드 ${i + 1}`,
      group: 0, // 빈 노드는 group 0
      isEmpty: true, // 빈 노드 여부 표시
    };
    newNodes.push(newNode);
  }

  // 기존 노드에 빈 노드 추가
  graphData.nodes = [...graphData.nodes, ...newNodes];

  return graphData;
}

const MainGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // 페이지 로드 상태 관리

  useEffect(() => {
    // 페이지 로드 완료 시 상태 업데이트
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
    if (!isPageLoaded) return; // 페이지가 로드되지 않았다면 실행하지 않음

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    const width = container?.clientWidth || 800;
    const height = container?.clientHeight || 600;

    // 빈 노드 추가
    const graphData = generateAdditionalNodes(
      JSON.parse(JSON.stringify(initialGraphData)), // 원본 데이터 보호
      80 // 추가할 빈 노드 개수
    );

    // 그래프 초기화
    svg.selectAll("*").remove();

    // Simulation 생성
    const simulation = d3
      .forceSimulation<GraphNode>(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(graphData.links)
          .id((d) => d.id)
          .distance((d) => ((d.source as GraphNode).isEmpty || (d.target as GraphNode).isEmpty ? 30 : 240)) // 빈 노드는 30, 메인 노드는 240
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => ((d as GraphNode).isEmpty ? -100 : -400)) // 빈 노드는 -100, 메인 노드는 -400
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1)) // X축 정렬
      .force("y", d3.forceY(height / 2).strength(0.1)); // Y축 정렬

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
      .attr("r", (d) => (d.isEmpty ? 4 : d.id === "박윤경의 기술 생태계" ? 20 : 12)) // 박윤경 노드 크기 증가
      .attr("fill", (d) => (d.isEmpty ? "#222" : d3.schemeCategory10[d.group % 10]))
      .attr("cursor", "pointer") // 마우스 커서 적용
      .call(
        d3
          .drag<any, GraphNode>()
          .on("start", (event: d3.D3DragEvent<any, GraphNode, GraphNode>, d: GraphNode) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event: d3.D3DragEvent<any, GraphNode, GraphNode>, d: GraphNode) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event: d3.D3DragEvent<any, GraphNode, GraphNode>, d: GraphNode) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // 마우스 오버 이벤트 추가
    node.on("mouseover", function (_, d: GraphNode) {
      const randomX = Math.random() * 100 - 50; // -50 ~ 50 범위의 랜덤 X 이동
      const randomY = Math.random() * 100 - 50; // -50 ~ 50 범위의 랜덤 Y 이동

      d.fx = (d.x || 0) + randomX; // X 좌표 변경
      d.fy = (d.y || 0) + randomY; // Y 좌표 변경

      // transition을 통해 자연스러운 움직임 추가
      d3.select(this)
        .transition()
        .duration(300) // 300ms 동안 움직임
        .attr("cx", d.fx)
        .attr("cy", d.fy);

      simulation.alpha(0.5).restart(); // 그래프 움직임 활성화
    });

    // 텍스트 라벨 추가
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(graphData.nodes.filter((d) => !d.isEmpty))
      .join("text")
      .attr("x", 15)
      .attr("y", ".31em")
      .text((d) => d.id)
      .attr("font-size", (d) => (d.id === "박윤경의 기술 생태계" ? 20 : 12)) // 박윤경 노드의 폰트 크기 증가
      .attr("fill", "#333");

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      labels.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [isPageLoaded]); // 페이지 로드 완료 후 실행

  return (
    <div className="main__graph">
      <div className="graph-wrap" ref={containerRef}>
        {isPageLoaded ? <svg ref={svgRef}></svg> : null} {/* 로드 완료 후 SVG 렌더링 */}
      </div>
    </div>
  );
};

export default MainGraph;
