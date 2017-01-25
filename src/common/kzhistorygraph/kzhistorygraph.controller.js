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

      $scope.$watch('vm.kz', (kz) => {
        if (!kz) {
          return;
        }


        // clear the elements inside of the directive
        g.selectAll('*').remove();

        let xScale = d3.scaleTime()
          .rangeRound([0, width]);

        let yScale = d3.scaleLinear()
          .rangeRound([height, 0]);

        let yScaleRects = d3.scaleLinear()
          .rangeRound([0, height]);


        xScale.domain(d3.extent(kz.history, function (d) {
          return d.start;
        }));
        yScale.domain(d3.extent(kz.history, function (d) {
          return +d.value;
        }));
        yScaleRects.domain(d3.extent(kz.history, function (d) {
          return +d.value;
        }));

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
            return xScale(d.start);
          })
          .y(function (d) {
            return yScale(d.value);
          });


        let xAxis =
          d3.axisBottom(xScale)
            .tickFormat((d) => {
              return moment(d).format('D.M. HH:mm');
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

      });
    }
  }
}

export default KennzahlController;
