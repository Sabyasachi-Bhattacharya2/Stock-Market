const listSectionElement = document.getElementById('list');
const listarrangementElement = document.getElementById('listarrangement');
const theDetailSection = document.getElementById('detail');
const btn1mElement = document.getElementById('btn1m');
const btn3mElement = document.getElementById('btn3m');
const btn1yElement = document.getElementById('btn1y');
const btn5yElement = document.getElementById('btn5y');
const noOfYearsElement = document.getElementById('noOfYears');
async function chartSection() {
    const chartSectionFetch = await fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata');
    const theChartJson = await chartSectionFetch.json();
    const theData = theChartJson.stocksStatsData;
    
        
        theData.forEach(element => {
            Object.entries(element).forEach(([symbol, details]) => { 
                const profitClass = (details.profit == 0)? 'redIfZero':'';
                if(details.bookValue != null) {
                const listSectionElementDiv = `<div id="listarrangement">
                    <button class="buttondesign">${symbol}</button>
                    <div>${details.bookValue}</div>
                    <div class = ${profitClass}>${details.profit.toFixed(2)}%</div>
                </div>`;
                listSectionElement.insertAdjacentHTML("beforeend", listSectionElementDiv);
                
                

                
            }
        });  
    }); 
    detailsSec("AAPL", theData);
    graphDrawing("AAPL");
    const buttons = document.querySelectorAll('#listarrangement button');
    buttons.forEach((btn)=> {
            const sym = btn.textContent;
            btn.addEventListener('click', () => {
            detailsSec(sym, theData);
            graphDrawing(sym);
        });
    });
}


async function detailsSec(symbol, theData) {
    theDetailSection.innerHTML = '';
    const detailSectionFetch = await fetch('https://stocks3.onrender.com/api/stocks/getstocksprofiledata');
    const theDetailJson = await detailSectionFetch.json();
    const theDataDetails1 = theDetailJson.stocksProfileData;
    for (const iterator of theData) {
        const dataTop = iterator[symbol];
        if(dataTop) {
            const divElem = document.createElement('div');
            divElem.innerHTML = `${symbol}&emsp;&nbsp;${dataTop.bookValue.toFixed(2)}&emsp;&nbsp;${dataTop.profit.toFixed(2)}`;
            divElem.classList.add('three-element-div');
            theDetailSection.appendChild(divElem);
            break;
        }
    }
    for (const iterator of theDataDetails1) {
        const det = iterator[symbol];
        if(det) {
            const divElem = document.createElement('div');
            divElem.textContent = det.summary;
            theDetailSection.appendChild(divElem);
            return;
        }
    }
    
}



document.addEventListener("DOMContentLoaded", ()=> {
    chartSection();
    
});

async function graphDrawing(sym) {
    const listOfStockData = await fetch('https://stocks3.onrender.com/api/stocks/getstocksdata');
    const graphSectionJson = await listOfStockData.json();
    const stocksData = graphSectionJson.stocksData;
    for (const stElement of stocksData) {
        const timeAndPrice = stElement[sym];
        if(timeAndPrice) {
            noOfYearsElement.textContent = '5 Years Data';
            kirayeKaFunction(timeAndPrice["5y"].value, timeAndPrice["5y"].timeStamp);
            btn1mElement.addEventListener('click', ()=> {
                noOfYearsElement.textContent = '1 Month Data';
                noOfYearsElement.style.width = '22%';
                kirayeKaFunction(timeAndPrice["1mo"].value, timeAndPrice["1mo"].timeStamp);
            });
            btn3mElement.addEventListener('click', ()=> {
                noOfYearsElement.textContent = '3 Months Data';
                noOfYearsElement.style.width = '44%';
                kirayeKaFunction(timeAndPrice["3mo"].value, timeAndPrice["3mo"].timeStamp);
            });
            btn1yElement.addEventListener('click', ()=> {
                noOfYearsElement.textContent = '1 Year Data';
                noOfYearsElement.style.width = '66%';
                kirayeKaFunction(timeAndPrice["1y"].value, timeAndPrice["1y"].timeStamp);
            });
            btn5yElement.addEventListener('click', ()=> {
                noOfYearsElement.textContent = '5 Years Data';
                noOfYearsElement.style.width = '88%';
                kirayeKaFunction(timeAndPrice["5y"].value, timeAndPrice["5y"].timeStamp);
            });
        }
    }
}




function kirayeKaFunction(y, x) {
    var trace1 = {
    type: "scatter",
    mode: "lines",
    name: 'AAPL High',
    x: x,
    y: y,
    line: {color: '#17BECF'}
    }

    var data = [trace1];

    var layout = {
    title: 'Stock Market Plot',
    };

    Plotly.newPlot('myDiv', data, layout);
}