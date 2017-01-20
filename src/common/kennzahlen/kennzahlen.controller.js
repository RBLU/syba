class KennzahlenController {
  constructor() {
    this.name = 'kennzahlen';

    this.data = [
      {
        name: 'Laufzeit',
        value: 234,
        settings: [0,0,280,410],
        minMaxHist: [40, 420],
        medValue: 200,
        stdAbw: 40,
        min: 0,
        max: 500
      },
      {
        name: 'Items',
        value: 2800,
        settings: [1000, 2000, 3000, 4000],
        minMaxHist: [1920,4234],
        medValue: 2344,
        stdAbw: 120,
        min: 0,
        max: 5000
      }
    ];
  }
}

export default KennzahlenController;
