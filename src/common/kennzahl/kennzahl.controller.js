import * as d3 from 'd3';
import angular from 'angular';

class KennzahlController {
  constructor($scope, $element) {
    this.name = 'kennzahl';

    const width = 500;
    const offset = 50;

    this.$onInit = () => {
      let svg = d3.select($element.find('svg')[0])
        .attr('width', width + offset * 2)
        .attr('height', 50);

      this.kz.settings.push(this.kz.max);

      svg.selectAll('rect .settings')
        .data(this.kz.settings)
        .enter()
        .append('rect')
        .attr('class', 'settings')
        .attr('x', (d, i) => {
          if (i == 0) {
            return offset;
          } else {
            return this.kz.settings[i - 1] / this.kz.max * width + offset
          }
        })
        .attr('y', (d, i) => {
          return 0;
        })
        .attr('width', (d, i) => {
          return d / this.kz.max * width
        })
        .attr('height', (d, i) => {
          return 30;
        })
        .attr('fill', (d, i) => {
          if (i == 0 || i == 4) {
            return 'red';
          } else if (i == 2) {
            return 'green';
          } else {
            return 'yellow';
          }
        });

      svg.selectAll('text .settings')
        .data(this.kz.settings)
        .enter()
        .append('text')
        .attr('class', 'settings')
        .attr('x', (d, i) => {
          if (i == 0) {
            return offset;
          } else {
            return this.kz.settings[i - 1] / this.kz.max * width + offset
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

      svg
        .append('rect')
        .attr('class', 'history')
        .attr('x',  this.kz.minMaxHist[0] / this.kz.max * width + offset)
        .attr('y', 13)
        .attr('width', (this.kz.minMaxHist[1]-this.kz.minMaxHist[0]) / this.kz.max * width)
        .attr('height', 4)
        .attr('fill', 'black');

      svg
        .append('rect')
        .attr('class', 'stdabw')
        .attr('x',  (this.kz.medValue - this.kz.stdAbw) / this.kz.max * width + offset)
        .attr('y', 10)
        .attr('width', (this.kz.stdAbw * 2)  / this.kz.max * width)
        .attr('height', 10)
        .attr('fill', 'black');

      svg
        .append('circle')
        .attr('cx', this.kz.value / this.kz.max * width + offset)
        .attr('cy', 15)
        .attr('r', 10)
        .attr('fill', 'blue')

    }


  }
}

export default KennzahlController;
