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
    let height = Math.max(...heights);
    let width = (barWidth * this.data.length + 2 * barWidth) || 500;

    // TODO: and replace below with append to svg
    // this.svg = d3.select(this)
    //   .append("svg")
    //   .attr("height", height)
    //   .attr("width", width);

    d3.select(this).selectAll("div")
        .data(this.data)
      .enter().append("div")
        .attr('class', "plotty-mc bar-chart")
        // TODO: Fix so the commented out works... I want vertical bars
        // .style("width", (barWidth || width / this.data.length) + 'px')
        // .style("height", d => d.height + 'px')
        .style("height", (10) + 'px')
        .style("width", d => d.height + 'px')
        .text(d => d.label);

  }
}

const BarD3 = document.registerElement('bar-chart', BarD3Proto);
