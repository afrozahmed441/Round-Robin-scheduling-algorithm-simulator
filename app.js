function watingTime(bt, wt, p, q) {
    // creating a new array for the remaining time of the process
    let remBt = new Array(p).fill(0);

    // remBt is array which contains the remaining time of the process
    for(let i = 0; i<p; i++){
        remBt[i] = bt[i];
    }
    
    // t is the time 
    let t = 0;
    while(true) {
        // the done descibes that each process has completed its execution or not 
        let done = true;
        for(let i = 0; i<p; i++) {
            if(remBt[i] > 0) {
                done = false;
                // if the reamining process time is greater than quantam time then jst add the quantam time to time and sub the process time of process
                if(remBt[i] > q) {
                    t += q;
                    remBt[i] -= q;
                // else add the reamining process time to the time 
                // cal the waiting of the process total time - burst time of the process 
                // then set the remaining time of the process to zero;
                } else {
                    t = t + remBt[i];

                    wt[i] = t - bt[i];

                    remBt[i] = 0;
                }
            }
        }
        // if all process are completely executed then break the loop
        if(done == true){
            break;
        }
    }
    // return the waiting time array of the processes to cal the avg waiting time
 return wt;
}

function turnAroundTime(wt, bt, p, tat) {
    // cal the turn around time 
    // turn around time = burst time + waiting time (first we need to compute the waiting time)
    for(let i = 0; i<p; i++) {
        tat[i] = bt[i] + wt[i];
    }
    
    // return the turn around time array to cal the avg tat
    return tat;
}

// Main function 
function roundRobin() {
    let burstTime;
    // submit button 
    const submit = document.querySelector('.submit');
    // go button for the chart 
    const go = document.querySelector('.run');


        /**
         * take input number of process 
         * arrival time of process 
         * burst time of process
        */
    // on submit the form perform the action 
    submit.addEventListener('click', () => {
        burstTime = start();
    });

    // on click go 
    go.addEventListener("click", () => {
        draw(burstTime);
    });

}

roundRobin();
// global quantam var
var q;

var start = function()  {
    const process = document.getElementById('process');
    const burst_t = document.getElementById('burst_time');
    const qua_t = document.getElementById('quantam_time');

    const formContainer = document.querySelector('.container__form');
    
    const tableContainer = document.querySelector('.table');
    let table = document.querySelector('table');

    // remove the form 
    formContainer.remove();

    // all variables here 
    let p, bt, wt, tat, total_tat, total_wt, avgWt, avgTat;
            
    // number of process is stored in p
    p = parseInt(process.value);
    // burst time of processes in the array bt
    bt = new Array(p).fill(0);

    // processes array 
    processes = new Array(p).fill(0);

    // waiting time of processes in the array wt
    wt = new Array(p).fill(0);
    
    // turn around time of process in the array tat
    tat = new Array(p).fill(0); 

    // total waiting time
    total_wt = 0;

    //total turn around time
    total_tat = 0;

    // quantam time stored in q
    q = parseInt(qua_t.value);
    
    
    bt = burst_t.value;
    bt = bt.split(" ");

    // burst time array 
    for(let i =0; i<p; i++) {
        bt[i] = parseInt(bt[i]);
    }
    
    // processes array 
    for(let i = 0; i<p; i++) {
       processes[i] = i+1;
    }
    
        // console.log(bt);

    wt = watingTime(bt, wt, p, q);
    tat = turnAroundTime(wt, bt, p, tat);
    
    // cal total waiting time and turn around time
    for(let i = 0; i<p; i++) {
        total_wt += wt[i];
        total_tat += tat[i];
    }
    
    avgTat = total_tat / p;
    avgWt = total_wt / p;

    // console.log(avgTat);
    // console.log(avgWt);
        // testing
        // console.log(p);
        // console.log(ar_t);
        // console.log(br_t);
   
    // creating a table 
    
    const tableHead = ["Processes", "Burst time", "Waiting time", "Turn around time"];
    createTableHead(table, tableHead);
    appendTableData(table, processes, bt, wt, tat);
    
  return bt;
}

// function to create table headings 
var createTableHead = function(table, tableHeadings) {
    // if a table exists remove it 
    if(table.tHead) {
        table.tHead.remove();
    }
    // creating the table head (thead)
    let tHead = table.createTHead();
    // creating a row 
    let row = tHead.insertRow();
    // from the array of headings 
    tableHeadings.forEach(el => {
        // creaing the table heading tag
        let th = document.createElement("th");
        // creating a text node
        let text = document.createTextNode(el);
        th.appendChild(text);
        row.appendChild(th);
    })
}

// function to appende the data to the table
var appendTableData = function(table, pro, bt, wt, tat) {
    // if table body exists remove it
    if(table.tBody) {
        table.tBody.remove();
    }
    // for process
    for(let i = 0; i<pro.length; i++){
        createTableData(table, pro[i], bt[i], wt[i], tat[i]);
    }
    
    
}

// create a table data and text node and insert it into the row
var createTableData = function(table, p, bt, wt, tat) {
    // setting the run button after table
    let run = document.querySelector('.run');
    run.innerHTML = "";
    run.innerHTML = "Gantt Chart";
    run.style.display = "block";
    run.style.marginTop = table.style.height * 2 + 'rem';

    let arr = [p, bt, wt, tat];
    let row = table.insertRow();
    for(let i = 0; i<arr.length; i++) {
        let td = document.createElement("td");
        td.style.textAlign = "center";
        let text = document.createTextNode(arr[i]);
        td.appendChild(text);
        row.appendChild(td);
    }
}

var draw = function(burstTime) {
    const fresh = document.querySelector('fresh');
    let th = '';
    let td = '';

    let burstTimes = [];
    
    for(let i = 0; i<burstTime.length; i++) {
        burstTimes[i] = {"burstTime": burstTime[i], "P": i+1};
    }

    let done = false;
    while(!done) {
        done = true;
        burstTimes.forEach(el => {
            if(el.burstTime > 0) {
                th += `<th style = "height: 60px; width: ${el.burstTime > q ? q*20 : el.burstTime*20}px;">P ${el.P}</th>`;
                td += `<td>${el.burstTime > q ? q : el.burstTime}</td>`;
                el.burstTime -= q;
                done = false;
            } 
        });
    }

    fresh.innerHTML = `<table id="resultTable" style="width:70%">
                        <tr>
                          ${th}
                        </tr>
                        <tr>
                          ${td}
                        </tr>
                        </table>`;

    animate(burstTime);

}

var animate = function(burstTime) {
    let sum = 0;
    let distance;
    const fresh = document.querySelector('fresh');
    const resultTable = document.getElementById('resultTable');
    
    const markup = '<div id="curtain" style="position:absolute; right:-1000px; width:100%; background-color:white; height:125px;"></div>';
    fresh.insertAdjacentHTML('afterbegin', markup);

    const curtain = document.getElementById('curtain');
    
    let width = resultTable.style.width;
    let left = resultTable.offsetLeft;

    curtain.style.width = width;
    curtain.style.position.left = left;

    burstTime.forEach(el => {
        sum += el;
    });
   
    distance = curtain.style.width;
    animationSteps(sum, 0);

    curtain.animate({
        left: [0, distance]
           },{ duration: sum*1000/2,        // number in ms [this would be equiv of your speed].
               easing: 'linear',
               iterations: 1,         // infinity or a number.
  });
  
}

var animationSteps = function(steps, cur) {
    const timer = document.getElementById('timer');
    const time = document.querySelector('.time');

    time.style.visibility = "visible";

    timer.innerHTML = cur;

    if(cur < steps) {
        setTimeout( () => {
           animationSteps(steps, cur+1);
        }, 500);
    }
}
