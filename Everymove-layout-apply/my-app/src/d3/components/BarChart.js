import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

/**
 * Bar Chart Component
 *
 * @param {Number} height
 * @param {Number} width
 * @param {Object} margin
 * @param {Array} data
 */

const BarChart = ({ width, height, margin = {}, data = [], childToParent }) => {
  const svgRef = useRef();
  const graphGroupRef = useRef();
  const xAxisGroupRef = useRef();
  const yAxisGroupRef = useRef();
  const barContainerRef = useRef();

  // <==========================(width x height) according to margiin convention==============================>

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // <==========================Axis Definations==============================>
  const xAxis = d3.scaleBand().rangeRound([0, innerWidth]);
  const yAxis = d3.scaleLinear().rangeRound([innerHeight, 0]);

  // <==========================Transition constants==============================>
  const trans = d3.transition().duration(500);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const graphGroup = d3.select(graphGroupRef.current);
    const xAxisGroup = d3.select(xAxisGroupRef.current);
    const yAxisGroup = d3.select(yAxisGroupRef.current);
    const barContainer = d3.select(barContainerRef.current);

    svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMin");

    // Axis Domains
    xAxis.domain(data && data.map((d) => d.xAxisValue));
    yAxis.domain([0, d3.max(data, (d) => d.yAxisValue)]);

    // Axis Calls
    xAxisGroup.transition(trans).call(d3.axisBottom(xAxis));
    yAxisGroup.transition(trans).call(
      d3
        .axisLeft(yAxis)
        .ticks(10)
        .tickSize(-Math.abs(width - 45), 0, 0)
    );

    const baseColor = "#009851";
    const pointColor = "#7ab8aa";
    let str = "";
    const onClick = (d, i) => {
      if (i.xAxisValue.substr(-1) === "역" && i.xAxisValue !== "서울역") {
        str = i.xAxisValue.slice(0, -1);
      } else str = i.xAxisValue;
      svg.selectAll("rect").each(function (d, j) {
        // if (j === i) d3.select(this).style("fill", pointColor);
        // else d3.select(this).style("fill", baseColor);
      });
      childToParent(str);
    };

    // Bar Generation/Updates
    const bars = barContainer.selectAll(".bar").data(data);
    // Exit and Remove (bars)

    bars
      .exit()
      .transition(trans)
      // .attr('y', yAxis(0))
      .attr("height", 0)
      .style("opacity", 0)
      .remove();

    // Update Existing (bars)
    bars
      .attr("rx", 0)
      .attr("x", (d) => xAxis(d.xAxisValue))
      .attr("width", 45)
      .transition()
      .duration(500)
      .attr("height", (d) => innerHeight - yAxis(d.yAxisValue))
      .attr("y", (d) => yAxis(d.yAxisValue));

    // Create New (bars)
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("x", (d) => xAxis(d.xAxisValue))
      .attr("y", (d) => yAxis(d.yAxisValue))
      .attr("width", 60)
      .attr("height", (d) => innerHeight - yAxis(d.yAxisValue))
      .attr("fill", "#009851")
      .on("click", onClick);
  }, [data]);

  return (
    <svg ref={svgRef}>
      <g ref={graphGroupRef} width={innerWidth} height={innerHeight}>
        <g
          ref={xAxisGroupRef}
          className="xAxis"
          transform={`translate(62, ${innerHeight + 15})`}
        />{" "}
        <g
          ref={yAxisGroupRef}
          className="yAxis"
          transform={`translate(60,10)`}
        />{" "}
        <g
          ref={barContainerRef}
          transform={`translate(110, 10)`}
          className="bars-group-container"
        />
      </g>{" "}
    </svg>
  );
};

BarChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.object,
  data: PropTypes.array,
};

export default BarChart;
