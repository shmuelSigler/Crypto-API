//coins api - https://api.coincap.io/v2/assets?search=${coin}
//logo api - https://shapeshift.io/getcoins

var html= document.getElementsByTagName('table')[0];

const request = function (){
    fetch(`https://api.coincap.io/v2/assets`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        //console.log(data.data[0].priceUsd);
        var table="<tr><th>rank</th><th>logo</th><th>name</th><th>price</th><th>market cap</th><th>vwap(24hr)</th><th>supply</th><th>volume (24hr)</th><th>change (24hr)</th></tr>";

        for(var i=0; i<data.data.length ;i++){
            table += `<tr id=${data.data[i].symbol}><td>${data.data[i].rank}</td><td></td><td><a target="_blank" href=${data.data[i].explorer}>${data.data[i].name}<br><small>${data.data[i].symbol}</small></a></td><td>$${thousands_separators(data.data[i].priceUsd)}</td><td>${mOrb(data.data[i].marketCapUsd)}</td><td>$${thousands_separators(data.data[i].vwap24Hr)}</td><td>${thousands_separators(data.data[i].supply)}</td><td>${mOrb(data.data[i].volumeUsd24Hr)}</td><td>${Number(data.data[i].changePercent24Hr).toFixed(2)}%</td></tr>`; 
        }
        html.innerHTML = table; 
        const tr= document.querySelectorAll('tr:not(:first-child)');       //except first child
        precent(tr);
        logoRequest(tr);
        
    })
}

request();
setInterval(request,10000);         //response from api takes a while

function thousands_separators(num) {
    num=Number(num);
    num = num.toFixed(2);           //toFixed() convert num to str
    //num = num.toString();
    var re = /\B(?=(\d{3})+(?!\d))/g;
    num = num.replace(re, ",");
    return num;
  }

  function mOrb(num){
      num=Number(num);
      num=Math.trunc(num);
      if(num < 1000000000){
        num=num/1000000;
        num=num.toFixed(2);
        //num=num.toString();
        num=`$`+num+`m`;
        return num;
      }
      else{
        num=num/1000000000;
        num=num.toFixed(2);
        //num=num.toString();
        num=`$`+num+`b`;
        return num;
      }
  }

  function precent(el){
      for(const td of el){
        let num=td.children[8].innerText;
        num=Number.parseFloat(num);
        if( num<0 ) td.children[8].style.color='red';
        else  td.children[8].style.color='green'
      }
  }

const logoRequest = function(el){
    //console.log(el[1].children[1]);
    for(const row of el ){
        console.log(row);       //print every <tr id='..'> ....... </tr>
    }
    fetch(`https://shapeshift.io/getcoins`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        for(const coin of Object.entries(data)){
            var img = document.createElement('img');
            img.src = coin[1].imageSmall;
            var a = document.createElement('a');
            a.href= coin[1].image;
            a.setAttribute("data-lightbox", `image-${coin[0]}`);
            a.setAttribute("data-title", coin[1].name);
            a.appendChild(img);
            for(const row of el ){
                if(coin[0]=='KNC') continue;
                if(row.id == coin[0]){                 //coin[0] is the same as the tr id, for example ATOM or BTC
                    row.children[1].append(a);        //row.children[1] is the td of logo, empty <td></td>
                    break;
                }
            }
            
        }
        
    })
 }

