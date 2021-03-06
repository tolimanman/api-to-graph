import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import "./Design.css";

/*
This class is incharge of presenting the data of the API on a graph.
It also presents in a list all the items that are over the threshold.
I have used chart.js for presenting the graph.

*/
class Graph extends Component {
  constructor(props) {
    super(props);

    /*
        chartData = The data/Datasets of the graph which is sent to chart.js component. 
        */
    this.state = {
      chartData: {
        labels: "",
        datasets: []
      },
      overThresholdItms: []
    };
  }
  //Loads the properties of the graph for the first time
  componentWillMount() {
    let chartData = { ...this.state.chartData };
    chartData.labels = this.props.bottom;
    chartData.datasets = [
      {
        label: this.props.category,
        data: this.props.side,
        backgroundColor: ["rgba(44, 61, 160, 0)"],
        borderColor: ["rgba(44, 61, 160, 0.8)"]
      }
    ];
    //If second metric exists draw it
    if (Object.keys(this.props.side2).length > 0) {
      chartData.datasets.push({
        label: this.props.category2,
        data: this.props.side2,
        backgroundColor: ["rgba(44, 61, 160, 0)"],
        borderColor: ["rgba(23, 155, 8, 1)"]
      });
    }

    this.setState({
      chartData: chartData
    });
  }

  //Updates the Points on the graph and the threshold every time there is a change
  componentDidUpdate(prevProps) {
    if (
      this.props.points !== prevProps.points ||
      this.props.threshold !== prevProps.threshold
    ) {
      let chartData = { ...this.state.chartData };
      chartData.labels = this.props.bottom.slice(0, this.props.points);
      chartData.datasets = [
        {
          label: this.props.category,
          data: this.props.side.slice(0, this.props.points),
          backgroundColor: ["rgba(44, 61, 160, 0)"],
          borderColor: ["rgba(44, 61, 160, 0.8)"]
        },
        {
          label: "Threshold",
          data: this.getThreshold(),
          borderColor: ["rgba(235, 0, 0, 1)"]
        }
      ];
      //If second metric exists draw it
      if (Object.keys(this.props.side2).length > 0) {
        chartData.datasets.push({
          label: this.props.category2,
          data: this.props.side2.slice(0, this.props.points),
          backgroundColor: ["rgba(44, 61, 160, 0)"],
          borderColor: ["rgba(23, 155, 8, 1)"]
        });
      }

      this.setState({
        chartData: chartData,
        overThresholdItms: this.getOverThreshold()
      });
    }
  }

  //Returns an array with size of points which presents the threshold
  getThreshold() {
    let data = [];
    let length = this.props.points;
    for (let i = 0; i < length; i++) {
      data.push(this.props.threshold);
    }
    return data;
  }

  //Returns array of all labels that their value is higher than the threshold
  getOverThreshold() {
    let data = [];
    let length = this.props.points;
    for (let i = 0; i < length; i++) {
      if (Number(this.props.side[i]) > Number(this.props.threshold)) {
        data.push(this.props.bottom[i]);
      }
    }

    return data;
  }

  //Render the graph and the list of items above threshold
  render() {
    return (
      <div>
        <Line data={this.state.chartData} width={100} height={100} />
        <div className="list-wrapper">
          <h4>List of items above threshold</h4>
          <ul>
            {this.state.overThresholdItms.map(function(name, index) {
              return <li key={index}>{name}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Graph;
