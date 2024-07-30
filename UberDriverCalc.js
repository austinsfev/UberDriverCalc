
const canvas = document.getElementById("myChart");
const ctx = canvas.getContext("2d");
Chart.defaults.borderColor = '#7F7F7F';
// Chart.defaults.color = '#ABABAB';



document.addEventListener('DOMContentLoaded', function() {
    addInputListeners();
    connections();
    calculations();
    savingsCalc();

});

const chart = new Chart(ctx, {
  type: "bar",

  data: {
    labels:[
    ["Electric Vehicle"],
    ["ICE Hertz Lease"]],
    datasets: [
      {
        label: "Upfront Costs",
        data: [500, 4450],
        backgroundColor: ["#58D6FD"],
        borderWidth: 1,
        stack: "Stack 1",
      },
      {
        label: "Lease Cost",
        data: [0, 350],
        backgroundColor: ["rgb(255, 194, 77)"],
        borderWidth: 1,
        stack: "Stack 2",
      },
      {
        label: "Ownership Cost",
        data: [328, 0],
        backgroundColor: ["rgb(255, 194, 177)"],
        borderWidth: 1,
        stack: "Stack 2",
      },
      {
        label: "Maintenance",
        data: [0, 0],
        backgroundColor: ["rgb(7, 46, 116)"],
        borderWidth: 1,
        stack: "Stack 2",
      },
      {
        label: "Charging Cost",
        data: [0, 0],
        backgroundColor: ["rgb(144, 238, 144)"],
        borderWidth: 1,
        stack: "Stack 2",
      },
      {
        label: "Fuel Cost",
        data: [0, 0],
        backgroundColor: ["rgb(205,92,92)"],
        borderWidth: 1,
        stack: "Stack 2",
      },
    ],
  },
  options: {
    responsive: true,
    devicePixelRatio: 2,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          tickWidth: 1000,
          color: 'white',
          autoSkip: false,
          font: function(context) {
            var width = context.chart.width;
            var size = Math.round(width / 32);

            return {
                weight: 'bold',
                size: size
            };
          }
        },
      },
      y: {
        ticks: {

          color: '#EEEEEE',
          callback: function (value, index, ticks) {
            return (
              "$" +
              Chart.Ticks.formatters.numeric.apply(this, [value, index, ticks])
            );
          },
          font: function(context) {
              var width = context.chart.width;
              var size = Math.round(width / 32);

              return {
                  weight: 'bold',
                  size: size
              };
            }
        },
        stacked: true,
        
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (context.dataset.label === "Upfront Costs"){
              label += `\u00b9` ;
            }
            if (context.dataset.label === "Lease Cost"){
              label += "\u00b2" ;
            }
            if (context.dataset.label === "Fuel Cost" || context.dataset.label === "Charging Cost"){
              label += "\u00b3" ;
            }
            if (context.dataset.label === "Maintenance"){
              label += "\u2074" ;
            }
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += "$" + context.parsed.y.toFixed(2);
            }
            return label;
          },
          title: (context) => {
            // return context[0].label.replaceAll(/Spring Free Ev|,|Traditional Lease/g, '')
          },
        },
      },
      legend: {

        labels: {
            color: '#ababab',
            useBorderRadius: true,
            borderRadius: 7,
            boxWidth: 13,
            boxHeight: 13,
            stack: false,
            font: function(context) {
              var width = context.chart.width;
              var size = Math.round(width / 32);

              return {
                  weight: 'bold',
                  size: size
              };
            }
          }
      },
    },
  },
  });

function setupRangeInputConnection(rangeId, inputId) {
    let range = document.getElementById(rangeId);
    let input = document.getElementById(inputId);

    range.addEventListener('input', function (e) {
        input.value = e.target.value;
    });
    input.addEventListener('input', function (e) {
        range.value = e.target.value;
    });
}
function connections () {

    setupRangeInputConnection("milesRange", "milesInput", );

    setupRangeInputConnection("uberMilesRange", "uberMilesInput");

    setupRangeInputConnection("gasRange", "gasInput");

    setupRangeInputConnection("chargingRange", "chargingInput");



}

let fuelResult = 0;
let chargeResult = 0;
let gasMaintenance = 0;
let evMaintenance = 0;
let overageMileageResult = 0;
let ownershipEv = 328;
let leaseGas = 350;

function calculateFuelCost(miles, gas) {
    return ((miles / 30) * gas) * 30.5;
}

function calculateChargingCost(miles, charging) {
    return ((miles / 4) * (charging / 100)) * 30.5;
}
function calculateEvMaintenanceCost (miles) {
    return (miles * 0.06) * 30.5;
}
function calculateGasMaintenanceCost (miles) {
    return (miles * 0.10) * 30.5;
}
function calculateEvOwnershipMileageRate (miles) {
  ownershipMilesEv = (miles * 30.5) - 1800;
  if (ownershipMilesEv > 0) {
    return ((.32 * ownershipMilesEv) + ownershipEv);
  } else {
    return ownershipEv;

  }
}
function calculateGasOverageMileageRate (miles) {
  overageMilesBmw = (miles * 30.5) - 1250;
  if (overageMilesBmw > 0) {
    return ((.25 * overageMilesBmw) + leaseGas);
  } else {
    return leaseGas;
  }
}


function chargingCost() {
  chart.data.datasets[4].data = [chargeResult];
  chart.update();
}
function fuelCost() {
  chart.data.datasets[5].data = [0, fuelResult];
  chart.update();
}
function maintenanceCost () {
  chart.data.datasets[3].data = [evMaintenance, gasMaintenance];
  chart.update();
}
function overageMileageCost () {
  chart.data.datasets[1].data = [0 , overageMileageGasResult];
  chart.data.datasets[2].data = [ownershipMileageEvResult, 0];
  chart.update();
}



function calculations() {

    const uberMiles = parseFloat(document.getElementById("uberMilesInput").value);
    const miles = parseFloat(document.getElementById('milesInput').value);
    const gas = parseFloat(document.getElementById('gasInput').value);
    const charging = parseFloat(document.getElementById("chargingInput").value);

    fuelResult = calculateFuelCost(miles, gas);
    chargeResult = calculateChargingCost(miles, charging);
    gasMaintenance = calculateGasMaintenanceCost(miles);
    evMaintenance = calculateEvMaintenanceCost(miles);
    ownershipMileageEvResult = calculateEvOwnershipMileageRate(miles);
    overageMileageGasResult = calculateGasOverageMileageRate(miles);



    fuelCost();
    chargingCost();
    maintenanceCost();
    overageMileageCost();
}
// On Change reflect updates
function addInputListeners() {
    document.querySelectorAll('#gasInput, #milesInput, #chargingInput, #uberMilesInput').forEach(input => {
        input.addEventListener('input', event => {
            calculations();
            savingsCalc();
        });
    });
    document.querySelectorAll('#gasRange, #milesRange, #chargingRange, #uberMilesInput').forEach(input => {
        input.addEventListener('input', event => {
            calculations();
            savingsCalc();
        });
    });
    

}
// Bottom Bar calculations
function savingsCalc() {

  const miles = parseFloat(document.getElementById('milesInput').value);

  let monthlySavings = document.getElementById("monthlySavings");
  let savedMonthly = document.getElementById('savedMonthly');
  let ownershipCost = document.getElementById('ownershipCost');
  let yearlySavings = document.getElementById('yearlySavings');
  let carbonDioxideOffset = document.getElementById('co2Offset');


    monthlySavings.textContent = '';
    savedMonthly.textContent = '';
    ownershipCost.textContent = '';
    yearlySavings.textContent = '';
    carbonDioxideOffset.textContent = '';



    let evTotal = 0;
    let gasTotal = 0;
    for (let i = 0; i < chart.data.datasets.length; i++) {
        
        const evValue = parseFloat(chart.data.datasets[i].data[0]);
        const gasValue = parseFloat(chart.data.datasets[i].data[1]);

        if (!isNaN(evValue)) {
            evTotal += evValue;
        }
        if (!isNaN(gasValue)) {
            gasTotal += gasValue;
        }
    }

    const difference = gasTotal - evTotal;
    const average = (gasTotal + evTotal) / 2;
    const percentage = (difference / (average)) * 100;
    const yearly = ( difference * 12);
    const carbonDioxideElement = ((miles * 0.78) * 30.5)
    monthlySavings.textContent += ` $${difference.toFixed(0)}`;
    savedMonthly.textContent += ` ${percentage.toFixed(1)}%`;
    ownershipCost.textContent += ` $${evTotal.toFixed(0)}`;
    yearlySavings.textContent += ` $${yearly.toFixed(0)}`;
    carbonDioxideOffset.textContent = `${carbonDioxideElement.toFixed(0)}`;

}


  
// function setBubble(range, bubble) {
//   const val = range.value;
//   const min = (range.min ? range.min : 0);
//   const max = (range.max ? range.max : 100);
//   const newVal = Number(((val - min) * 100) / (max - min));
//   bubble.innerHTML = val;

//   bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
// }

// const allRanges = document.querySelectorAll(".range-wrap");
// allRanges.forEach(wrap => {
//   const range = wrap.querySelector(".range");
//   const bubble = wrap.querySelector(".bubble");

//   range.addEventListener("input", () => {
//     setBubble(range, bubble);
//   });
//   setBubble(range, bubble);
// });

// function setBubble(range, bubble) {
//   const val = range.value;
//   const min = (range.min ? range.min : 0);
//   const max = (range.max ? range.max : 100);
//   const newVal = Number(((val - min) * 100) / (max - min));
//   bubble.innerHTML = val;

//   bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
// }
