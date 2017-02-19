import * as d3 from 'd3';
import moment from 'moment';

class KennzahlController {
  /* @ngInject */
  constructor($scope, $element, $log) {
    this.name = 'kzhistorygraph';

    this.$onInit = () => {

      // initialize fixed elements, drawing is then done in de redraw function
      let svg = d3.select($element.find('svg')[0])
          .attr('height', 560)
          .attr('width', 500),
        margin = {top: 20, right: 20, bottom: 60, left: 50},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

      let viewport =
        svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
          .attr('class', 'viewport');

      // add the tooltip area to the webpage
      let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);


      $scope.$watch('vm.kz', (kz) => {
        if (kz && kz.history && kz.history.length > 0) {
          redraw(kz);
        }
      });

      function redraw(kz) {

        let zoom = d3.zoom()

          .scaleExtent([1, 40])
          .translateExtent([[-100, 0], [width + 90, 0]])
          .on('zoom', zoomed);

        // clear the elements inside of the directive
        viewport.selectAll('*').remove();

        viewport.append('defs').append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('width', width)
          .attr('height', height);

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

        let yExtent = d3.extent(kz.history, function (d) {
          return +d.NUMBERVALUE;
        });

        yScale.domain(yExtent);
        yScaleRects.domain(yExtent);


        // create the rects for the background color
        // 1st red one

        let levels = viewport.append('g')
          .attr('class', 'levels');

        levels.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', height - yScaleRects(kz.LEVELLOWERROR))
          .attr('height', Math.max(0, yScaleRects(kz.LEVELLOWERROR)))
          .attr('class', 'error');

        levels.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', height - yScaleRects(kz.LEVELLOWWARNING))
          .attr('height', Math.max(0, yScaleRects(kz.LEVELLOWWARNING) - yScaleRects(kz.LEVELLOWERROR)))
          .attr('class', 'warning');

        levels.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', height - yScaleRects(kz.LEVELNORMAL))
          .attr('height', yScaleRects(kz.LEVELNORMAL) - Math.max(0, yScaleRects(kz.LEVELLOWWARNING)))
          .attr('class', 'normal');

        levels.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', height - yScaleRects(kz.LEVELHIGHWARNING))
          .attr('height', yScaleRects(kz.LEVELHIGHWARNING) - yScaleRects(kz.LEVELNORMAL))
          .attr('class', 'warning');

        levels.append('rect')
          .attr('x', 0)
          .attr('width', width)
          .attr('y', 0)
          .attr('height', height - Math.min(height, yScaleRects(kz.LEVELHIGHWARNING)))
          .attr('class', 'error');

        let xAxis =
          d3.axisBottom(xScale)

            .tickSizeInner(-height);

        let yAxis = d3.axisLeft(yScale);

        viewport.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis xaxis');

        drawXaxis(xScale);

        viewport.append('g')
          .attr('class', 'axis yaxis')
          .call(yAxis)

          // append a small text to the yAxis showing the Kennzahl
          .append('text')
          .attr('fill', '#000')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .text(kz.NAME);

        function zoomed() {
          let transform = d3.event.transform;
          let updatedXscale = transform.rescaleX(xScale);
          d3.selectAll('.dot')
            .data(kz.history)
            .attr('cx', (d) => {
              return updatedXscale(new Date(d.STARTED));
            });

          //dots.attr('transform', 'translate(' + transform.x + ') scale( ' + transform.k+ ',1)');
          drawXaxis(updatedXscale);
        }

        function drawXaxis(scale) {
          d3.select('.xaxis')
            .call(xAxis.scale(scale))
            .selectAll('text')
            .attr('fill', '#000')
            .attr('y', 15)
            .attr('x', 5)
            .attr('dy', '.35em')
            .attr('transform', 'rotate(45)')
            .style('text-anchor', 'start');
        }

        viewport
          .append('g')
          .attr('class', 'dots')
          .attr('clip-path', 'url(#clip)')
          .selectAll('.dot')
          .data(kz.history)
          .enter().append('circle')
          .attr('class', 'dot')
          .attr('r', 5)
          .attr('cx', (d) => {
            return xScale(new Date(d.STARTED));
          })
          .attr('cy', (d) => {
            return yScale(new Date(+d.NUMBERVALUE));
          })
          .on('mouseover', function (d) {
            tooltip.transition()
              .duration(200)
              .style('opacity', .9);
            tooltip.html('Lauf Boid: ' + d.ITSSYRIUSBATCHLAUF + '<br/> (' + moment(d.STARTED).format('LL')
              + ', ' + d.NUMBERVALUE + ')')
              .style('left', (d3.event.pageX + 5) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px');
          })
          .on('mouseout', function (d) {
            tooltip.transition()
              .duration(1000)
              .style('opacity', 0);
          })
          .on('click', function (d) {
            $log.log('going to: ', {batchId: d.ITSBATCHCONFIG, runId: d.ITSBATCHLAUF});
            $scope.$root.$state.go('batches', {batchId: d.ITSBATCHCONFIG, runId: d.ITSBATCHRUN});
          });

        viewport.call(zoom);

        $scope.$on('$destroy', function () {
          d3.select('.tooltip').remove();
        });
      }

    };


  }
}

export default KennzahlController;
