import * as d3 from 'd3';
import angular from 'angular';

class KennzahlController {
  /* @ngInject */
  constructor($scope, $element, kennzahlenService) {
    this.name = 'kennzahl';
    this.editmode = false;

    const width = 500;
    const offset = 20;

    let svg = d3.select($element.find('svg')[0])
      .attr('width', width + offset * 2)
      .attr('height', 50);

    let g = svg.append('g')
      .attr('transform', 'translate('+offset+',0)');


    this.$onInit = () => {
      $scope.$watch('vm.kz', (newValues) => {
        if (this.kz) {
          redraw(this.kz);
        }
      });
    };

    this.editLevels = (stats) => {
      this.levels = {
        BOID: stats.BOID,
        LEVELLOWERROR: stats.LEVELLOWERROR,
        LEVELLOWWARNING: stats.LEVELLOWWARNING,
        LEVELNORMAL: stats.LEVELNORMAL,
        LEVELHIGHWARNING: stats.LEVELHIGHWARNING
      };
      this.editmode = true;
    };

    this.saveLevels = () => {
        kennzahlenService.saveKzConfig(this.levels)
          .then((results) => {
             console.log("KennzahlConfig successfully saved", results);
             _.merge(this.kz.kzstat, this.levels);
             this.editmode = false;
             redraw(this.kz);
          });
    };



    function redraw(kz) {
      g.selectAll('*').remove();

      let stats = kz.kzstat;
      let run = kz.runstat;
      let low = _.isNumber(stats.LEVELMIN) ? stats.LEVELMIN : stats.MIN;
      let high = Math.max(_.isNumber(stats.LEVELMAX) ? stats.LEVELMAX : stats.MAX, stats.LEVELHIGHWARNING);

      let xScale = d3.scaleLinear()
        .domain([low , high])
        .range([0, width - (offset *2)]);

      // add the max value of our data to the settings array, so we can draw the
      // last red rect from the last settings value to the max value
      let settingsArray = [stats.LEVELLOWERROR, stats.LEVELLOWWARNING, stats.LEVELNORMAL, stats.LEVELHIGHWARNING, stats.LEVELMAX || stats.MAX];

      g.selectAll('rect .settings')
        .data(settingsArray)
        .enter()
        .append('rect')
        .attr('class', function(d,i ) {
          if (i == 0 || i == 4) {
            return 'settings error';
          } else if (i == 2) {
            return 'settings normal';
          } else {
            return 'settings warning';
          }
        })
        .attr('x', (d, i) => {
          if (i == 0) {
            return 0;
          } else {
            return xScale(Math.min(settingsArray[i - 1], high));
          }
        })
        .attr('y', (d, i) => {
          return 0;
        })
        .attr('width', (d, i) => {
          if (i == 0) {
            return xScale(d);
          }  else {
            return xScale(d -  settingsArray[i - 1]);
          }
        })
        .attr('height', (d, i) => {
          return 30;
        });

      let settingsCaptions = [low].concat(settingsArray).concat(high);


      g.selectAll('text .settings')
        .data(settingsCaptions)
        .enter()
        .append('text')
        .attr('class', 'settings')
        .attr('x', (d, i) => {
            return xScale(d);
        })
        .attr('y', 45)
        .text((d, i) => {
            return d;
        })
        .attr('text-anchor', 'middle');

      g
        .append('rect')
        .attr('class', 'history')
        .attr('x',  xScale(stats.MIN))
        .attr('y', 13)
        .attr('width', xScale(stats.MAX-stats.MIN))
        .attr('height', 4)
        .attr('fill', 'black');

      g
        .append('rect')
        .attr('class', 'stdabw')
        .attr('x',  Math.max(xScale(stats.AVG - stats.STDDEV), 0))
        .attr('y', 10)
        .attr('width', xScale(stats.STDDEV * 2))
        .attr('height', 10)
        .attr('fill', 'black');

      g
        .append('circle')
        .attr('cx', xScale(run.NUMBERVALUE))
        .attr('cy', 15)
        .attr('r', 10)
        .attr('fill', 'blue')

    };
  }
}

export default KennzahlController;
