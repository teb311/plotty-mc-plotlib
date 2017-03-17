const testData = `
[
  {
    "height": 200,
    "label": "Oranges"
  },
  {
    "height": 300,
    "label": "Apples"
  },
  {
    "height": 250,
    "label": "Pears"
  }
]
`

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
                                height: Number,
                                label: string, // optional, Array index if not supplied
                              },
                              ...
                            ]
    @param {integer} barWidth The width of each bar, in pixels
  */
  constructChart(barWidth) {
    // TODO: parameterize domain and range
    let heights = this.data.map(d => d.height);
    let maxHeight = Math.max(...heights);
    let width = (barWidth * this.data.length + 2 * barWidth) || 500;
    barWidth = barWidth || width / this.data.length;

    // TODO: and replace below with append to svg
    this.svg = d3.select(this)
      .append("svg")
      .attr("height", maxHeight + 100) //TODO: Magic 100 padding voodoo removal
      .attr("width", width);


    var bar = this.svg.selectAll("g")
        .data(this.data)
      .enter().append("g")
        .attr("transform", (d, i) => `translate(${(barWidth + 5) * i}, 100)`); //TODO: Magic 5 padding voodoo removal

    bar.append("rect")
        .attr("y", d => maxHeight - d.height)
        .attr("width", barWidth)
        .attr("height", d => d.height);

    bar.append("text")
        .attr("x", (barWidth / 2) - 10) //TODO: Magic 10 padding voodoo removal
        .attr("y", d => (maxHeight - d.height) - 10) //TODO: Magic 50 padding voodoo removal
        // .attr("dy", ".35em")
        .text(d => d.label);
  }
}

const BarD3 = document.registerElement('bar-chart', BarD3Proto);
