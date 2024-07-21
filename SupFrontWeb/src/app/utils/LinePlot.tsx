import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import "./d3style.css"

function BarChart() {
    const svgRef = useRef<HTMLDivElement|null>(null);
    const data = [10, 30, 20, 50, 40];
    const width = 500;
    const height = 300;

    useEffect(() => {
        // 创建一个 SVG 容器
        const svg = d3.select(svgRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // 定义比例尺
        const xScale = d3.scaleBand<number>()
            .domain(data.map((_, i) => i))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data) ?? 0])
            .nice()
            .range([height, 0]);


        // 添加条形
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            // 添加带有工具提示的条形
            .attr('x', (_, i) => xScale(i)??0)
            .attr('y', (d) => yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => height - yScale(d))
            .on('mouseover', (event, d) => {
                tooltip.html(`Value: ${d}`)
                    .style('visibility', 'visible')
                    .style('top', `${event.pageY}px`)
                    .style('left', `${event.pageX}px`);
            })
            .on('mouseout', () => {
                tooltip.style('visibility', 'hidden');
            });

        // 创建工具提示元素
        const tooltip = d3.select(svgRef.current)
            .append('div')
            .attr('class', 'tooltip')
            .style('visibility', 'hidden');

        // 添加 x 轴
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        // 添加 y 轴
        svg.append('g')
            .call(d3.axisLeft(yScale));
    }, []);

    return (
        <div>
            <h2>条形图</h2>
            <div ref={svgRef}></div>
        </div>
    );
}

export default BarChart;