class KennzahlenController {
  constructor() {
    this.name = 'kennzahlen';

    this.data = [
      {
        name: 'Laufzeit',
        value: 234,
        minValue: 40,
        maxValue: 300,
        medValue: 200,
        stdAbw: 40,
        lowError: 0,
        lowWarning: 0,
        highWarning: 300,
        highError: 400
      },
      {
        name: 'Items',
        value: 2344,
        minValue: 0,
        maxValue: 4234,
        medValue: 2344,
        stdAbw: 120,
        lowError: 1000,
        lowWarning: 2000,
        highWarning: 3000,
        highError: 4000
      }
    ];
  }
}

export default KennzahlenController;
