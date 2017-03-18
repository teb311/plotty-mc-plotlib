const DEFAULTS = {
  color: '#3182bd'
}

let testData = [];
for(let i = 0; i < 26; i++) {
  testData.push({
    value: 30 + Math.random() * 200,
    units: "Unknown",
    label: String.fromCharCode(65 + i) + String.fromCharCode(97 + i).repeat(4) // ASCII
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
    let svgWidth = (barWidth * this.data.length + 2 * barWidth) || 500;
    barWidth = barWidth || svgWidth / this.data.length;

    // Yessss, do you love this?!
    // TODO: Dependency inject these later, so hot.
    function height(dataPoint, index) {
      return dataPoint.value;
    }

    function width(dataPoint, index) {
      return barWidth;
    }

    const padding = 5; // TODO: upgrade
    function x(dataPoint, index) {
      return (barWidth + padding) * index;
    }

    function y(dataPoint, index) {
      return maxvalue - dataPoint.value;
    }

    function fill(dataPoint, index) {
      return dataPoint.color || DEFAULTS.color
    }

    function textRotate(dataPoint, index) {
      let rotX = x(dataPoint, index);
      let degrees = 270;
      let botPadding = 2;
      return `rotate(${degrees} ${rotX} ${maxvalue}) translate(${botPadding} ${barWidth / 2})`
    }

    function gTranlate(dataPoint, index) {
      return `translate(${x(dataPoint, index)}, 0})`;
    }

    // TODO: and replace below with append to svg
    this.svg = d3.select(this)
      .append("svg")
      .attr("height", maxvalue + 100) //TODO: Magic 100 padding voodoo removal
      .attr("width", svgWidth);


    var bar = this.svg.selectAll("g")
        .data(this.data)
        .enter().append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", gTranlate)

    bar.append("rect")
        .attr("y", y)
        .attr("x", x)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", DEFAULTS.color);

    bar.append("text")
        .attr("y", maxvalue)
        .attr("x", x)
        .attr("transform", textRotate)
        .text(d => d.label); //TODO: Rotate
  }
}

const BarD3 = document.registerElement('bar-chart', BarD3Proto);
