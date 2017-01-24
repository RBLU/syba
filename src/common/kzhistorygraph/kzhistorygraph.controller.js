import * as d3 from 'd3';
import moment from 'moment';

class KennzahlController {
  /* @ngInject */
  constructor($scope, $element) {
    this.name = 'kzhistorygraph';

    this.$onInit = () => {
      let svg = d3.select("svg")
          .attr('height', 560)
          .attr('width', 500),
        margin = {top: 20, right: 20, bottom: 60, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      let xScale = d3.scaleTime()
        .rangeRound([0, width]);

      var yScale = d3.scaleLinear()
        .rangeRound([height, 0]);

      var line = d3.line()
        .x(function(d) { return xScale(d.start); })
        .y(function(d) { return yScale(d.value); });

      xScale.domain(d3.extent(this.kz.history, function(d) { return d.start; }));
      yScale.domain(d3.extent(this.kz.history, function(d) { return d.value; }));

      let xAxis =
        d3.axisBottom(xScale)
          .tickFormat((d) => {
            return moment(d).format('D.M. HH:mm');
          });

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll('text')
        .attr("y", 15)
        .attr("x", 5)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
       // .select(".domain")

      //      .remove();

      g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(this.kz.name);

      g.append("path")
        .datum(this.kz.history)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    }


  }
}

export default KennzahlController;
