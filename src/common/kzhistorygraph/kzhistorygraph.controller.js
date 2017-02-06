import * as d3 from 'd3';
import moment from 'moment';

class KennzahlController {
  /* @ngInject */
  constructor($scope, $element) {
    this.name = 'kzhistorygraph';

    this.$onInit = () => {
      let svg = d3.select($element.find('svg')[0])
          .attr('height', 560)
          .attr('width', 500),
        margin = {top: 20, right: 20, bottom: 60, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // add the tooltip area to the webpage
      var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      $scope.$watch('vm.kz', (kz) => {
        if (!kz || !kz.history ||kz.history.length == 0) {
          return;
        }

        // clear the elements inside of the directive
        g.selectAll('*').remove();

        // set ranges (=screen dimensions) on scale functions
        let xScale = d3.scaleTime()
          .rangeRound([0, width]);

        let yScale = d3.scaleLinear()
          .rangeRound([height, 0]);

        let yScaleRects = d3.scaleLinear()
          .rangeRound([0, height]);

        // set data ranges to be displayed
        xScale.domain(d3.extent(kz.history, function (d) {
          return new Date(d.STARTED);
        }));

        // compute min/max of graph to be shown
        // to remove extreme outliers we show all data that is within
        // 3 standard deviation of the of the mean.
        let mean = d3.mean(kz.history, (d) => {return +d.NUMBERVALUE});
        let sd = d3.deviation(kz.history, (d) => {return +d.NUMBERVALUE});

        const dataExtent = d3.extent(kz.history, function (d) {
          return +d.NUMBERVALUE;
        });

        yScale.domain(dataExtent);
        yScaleRects.domain(dataExtent);

        let cValue = function(d) {
            return "yellow";
        };
        let color = d3.scaleOrdinal(d3.schemeCategory10);

        // create the rects for the background color
        // 1st red one
        g.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', height - yScaleRects(kz.settings[0]))
          .attr('height', Math.max(0, yScaleRects(kz.settings[0])))
          .attr('class', 'error');

        g.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', height - yScaleRects(kz.settings[1]))
          .attr('height', Math.max(0, yScaleRects(kz.settings[1]) - yScaleRects(kz.settings[0])))
          .attr('class', 'warning');

        g.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', height - yScaleRects(kz.settings[2]))
          .attr('height', yScaleRects(kz.settings[2]) - Math.max(0, yScaleRects(kz.settings[1])))
          .attr('class', 'normal');

        g.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', height - yScaleRects(kz.settings[3]))
          .attr('height', yScaleRects(kz.settings[3]) - yScaleRects(kz.settings[2]))
          .attr('class', 'warning');

        g.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', 0)
          .attr('height', height - Math.min(height, yScaleRects(kz.settings[3])))
          .attr('class', 'error');

        // create the line function, maps data to x/y coordinates
        var line = d3.line()
          .x(function (d) {
            return xScale(new Date(d.STARTED));
          })
          .y(function (d) {
            return yScale(+d.NUMBERVALUE);
          });


        let xAxis =
          d3.axisBottom(xScale)
            .tickFormat((d) => {
              return moment(d).format('L');
            })
            .tickSizeInner(-height);


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

        g.append("g")
          .call(d3.axisLeft(yScale))
          .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text(kz.name);

        g.append("path")
          .datum(kz.history)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);

        g.selectAll(".dot")
          .data(kz.history)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", (d) => {return xScale(new Date(d.STARTED));})
          .attr("cy", (d) => {return yScale(new Date(+d.NUMBERVALUE));})
          .style("fill", function(d) { return color(cValue(d));})
          .on("mouseover", function(d) {
            tooltip.transition()
              .duration(200)
              .style("opacity", .9);
            tooltip.html("Lauf Boid: " + d["lauf"] + "<br/> (" + moment(d.STARTED).format("LL")
              + ", " + d.NUMBERVALUE + ")")
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          })
          .on("click", function(d) {
            $scope.$root.$state.go('batches', {batchId: d.itsBatchConfig, run: d.lauf})
          })



      });
    }
  }
}

export default KennzahlController;
