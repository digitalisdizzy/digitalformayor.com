// i mispelled carousel the whole script sob

const carosuelDiv = document.getElementById("carosuel")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function divideIntoPoints(n) {
  if (n <= 1) return [0];
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(i / (n - 1));
  }
  return result;
}

function getCarosuels(){return new Promise(async (resolve, reject) => {
    const carosuelInfo = await fetch("/carosuel/carosuel.json")
    if(!carosuelInfo.ok){
        resolve([`<div class="carosuel_member c_error"><h1>${carosuelInfo.status} ${carosuelInfo.statusText} error retrieving carosuels</h1></div>`])
    } else {
        const json = await carosuelInfo.json()
        
        const carosuels = []
        for(const carosuel of json.carosuels){
            const carosuelResponse = await fetch(`/carosuel/${carosuel}`)
            if(!carosuelResponse.ok){
                carosuels.push(`<div class="carosuel_member c_error"><h1>${carosuelInfo.status} ${carosuelInfo.statusText} error retrieving carosuel "${carosuel}"</h1></div>`)
            } else {
                const text = await carosuelResponse.text()
                carosuels.push(text)
            }
        }

        resolve(carosuels)
    }
})}

function smoothScrollTo(element, target) {
    return new Promise(resolve => {
        element.scrollTo({ left: target, behavior: 'smooth' });

        function check() {
            if (Math.abs(element.scrollLeft - target) < 1) {
                resolve();
            } else {
                requestAnimationFrame(check);
            }
        }
        requestAnimationFrame(check);
    });
}

async function startCarosuel(carosuelLength){
    const carosuels = await getCarosuels()
    carosuels.forEach(carosuel => {
        carosuelDiv.innerHTML += carosuel
    });

    const sections = divideIntoPoints(carosuels.length)
    let currentCarosuel = -1

    async function nextCarosuel(){
        currentCarosuel += 1
        if(currentCarosuel >= carosuels.length){
            currentCarosuel = 0
        }

        await smoothScrollTo(carosuelDiv, (carosuelDiv.scrollWidth - carosuelDiv.clientWidth) * sections[currentCarosuel])
    }

    while(true){
        await nextCarosuel()
        await sleep(carosuelLength)
    }
}

startCarosuel(5000)