const DEFAULTS = {
  color: '#3182bd'
}

// const testData = `
// [
//   {
//     "value": 200,
//     "label": "Oranges"
//   },
//   {
//     "value": 300,
//     "label": "Apples"
//   },
//   {
//     "value": 250,
//     "label": "Pears"
//   }
// ]
// `

let testData = [];
for(let i = 0; i < 26; i++) {
  testData.push({
    value: i * 10,
    label: String.fromCharCode(65 + i) // ASCII
  });
}
testData = JSON.stringify(testData); // I know, hilarious really.

window.onload = function() {
  let barChart = document.createElement('bar-chart');
  barChart.setAttribute('data', testData);

  document.body.append(barChart);
}

class BarD3Proto extends HTMLElement {

  /**
    Just call the "consturctor"
  */
  attachedCallback() {
    this.svg = null; // We're marking intent to use this.svg
    this.setAttribute('class', 'plotty-mc bar-chart');
    this.innerText = " ";

    this.data = JSON.parse(this.getAttribute('data'));
    console.log(this.data);
    this.constructChart();
  }

  /**
    Given an Array of Objects in the following format, construct the internal d3 svg
    element

    @param {Array} data A JSON string, typically supplied in the HTML attribute following
                             the format:
                             [
                              {
                                value: Number,
                                label: string, // optional, Array index if not supplied
                              },
                              ...
                            ]
    @param {integer} barWidth The width of each bar, in pixels
  */
  constructChart(barWidth, barColor = DEFAULTS.color) {
    // TODO: parameterize domain and range
    let values = this.data.map(d => d.value);
    let maxvalue = Math.max(...values);
    let width = (barWidth * this.data.length + 2 * barWidth) || 500;
    barWidth = barWidth || width / this.data.length;

    // TODO: and replace below with append to svg
    this.svg = d3.select(this)
      .append("svg")
      .attr("height", maxvalue + 100) //TODO: Magic 100 padding voodoo removal
      .attr("width", width);


    var bar = this.svg.selectAll("g")
        .data(this.data)
      .enter().append("g")
        .attr("transform", (d, i) => `translate(${(barWidth + 5) * i}, 100)`); //TODO: Magic 5 padding voodoo removal

    bar.append("rect")
        .attr("y", d => maxvalue - d.value)
        .attr("width", barWidth)
        .attr("height", d => d.value)
        .attr("fill", DEFAULTS.color);

    bar.append("text")
        .attr("y", d => (maxvalue - d.value) - 10) //TODO: Magic 50 padding voodoo removal
        .attr("x", barWidth / 2) // TODO: not perfect -- subtract width of self
        .text(d => d.label); //TODO: Rotate
  }
}

const BarD3 = document.registerElement('bar-chart', BarD3Proto);
