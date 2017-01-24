import * as d3 from 'd3';
import angular from 'angular';

class KennzahlController {
  /* @ngInject */
  constructor($scope, $element) {
    this.name = 'kennzahl';

    const width = 500;
    const offset = 20;


    this.$onInit = () => {
      let svg = d3.select($element.find('svg')[0])
        .attr('width', width + offset * 2)
        .attr('height', 50);


      let g = svg.append('g')
        .attr('transform', 'translate('+offset+',0)');

      let xScale = d3.scaleLinear()
        .domain([this.kz.min, this.kz.max])
        .range([0, width - (offset *2)]);

      // add the max value of our data to the settings array, so we can draw the
      // last red rect from the last settings value to the max value
      this.kz.settings.push(this.kz.max);

      g.selectAll('rect .settings')
        .data(this.kz.settings)
        .enter()
        .append('rect')
        .attr('class', function(d,i ) {
          if (i == 0 || i == 4) {
            return 'settings kz-settings-error';
          } else if (i == 2) {
            return 'settings kz-settings-normal';
          } else {
            return 'settings kz-settings-warning';
          }
        })
        .attr('x', (d, i) => {
          if (i == 0) {
            return 0;
          } else {
            return xScale(this.kz.settings[i - 1]);
          }
        })
        .attr('y', (d, i) => {
          return 0;
        })
        .attr('width', (d, i) => {
          return xScale(d);
        })
        .attr('height', (d, i) => {
          return 30;
        })


      g.selectAll('text .settings')
        .data(this.kz.settings)
        .enter()
        .append('text')
        .attr('class', 'settings')
        .attr('x', (d, i) => {
          if (i == 0) {
            return 0;
          } else {
            return xScale(this.kz.settings[i - 1]);
          }
        })
        .attr('y', 45)
        .text((d, i) => {
          if (i == 0) {
            return 0;
          } else {
            return this.kz.settings[i - 1]
          }
        })
        .attr('text-anchor', 'middle');

      g
        .append('rect')
        .attr('class', 'history')
        .attr('x',  xScale(this.kz.minMaxHist[0]))
        .attr('y', 13)
        .attr('width', xScale(this.kz.minMaxHist[1]-this.kz.minMaxHist[0]))
        .attr('height', 4)
        .attr('fill', 'black');

      g
        .append('rect')
        .attr('class', 'stdabw')
        .attr('x',  xScale(this.kz.medValue - this.kz.stdAbw))
        .attr('y', 10)
        .attr('width', xScale(this.kz.stdAbw * 2))
        .attr('height', 10)
        .attr('fill', 'black');

      g
        .append('circle')
        .attr('cx', xScale(this.kz.value))
        .attr('cy', 15)
        .attr('r', 10)
        .attr('fill', 'blue')

    }


  }
}

export default KennzahlController;
