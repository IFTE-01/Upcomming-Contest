let contest_info = [];
const username = "ifte_";
const api = "633775f9b0697c2e405bcd4178ba504313313b14";
const nowUTC = new Date(new Date().toISOString());
let index = 0;
async function getContests() {
    const url = `https://clist.by/api/v4/contest/?limit=800&username=${username}&api_key=${api}&order_by=-start`;


    const res = await fetch(url);
 

    const data = await res.json();      
    const contests = data.objects;
    index = 0;

    contests.forEach(contest => { 
        let box = contest.event.toLowerCase();  
    if (isUpcoming(contest.start) && 
        (box.includes("codeforces") ||
         box.includes("atcoder beginner") ||
         (contest.href.includes("codechef") && box.includes("starter")) ||
         contest.href.includes("leetcode"))){
            contest_info[index] = [
                contest.id,
                contest.start,
                contest.event,
                contest.href,
                contest.resource.name,
                contest.duration
            ];
            let x = contest.href;
            console.log(x);
            console.log(new Date(contest.start));
            console.log(durationHM(contest.duration));
            index++;
        }
    });

    console.log("index :", index); 
    sorting();
    
}

function isUpcoming(x) { 
    const contestUTC = new Date(x);
 
    const contestBd = new Date(contestUTC.getTime() + 6 * 60 * 60 * 1000);
 
    const now = new Date();
    const nowBd = new Date(now.getTime() );

    return contestBd >= nowBd;
}

function durationHM(x)
{
    x /= 60;
    let h,m;
    
    m = x%60;
    x-=(x%60);
    h = x/60; 
    if(m!=0) return h+':'+m;
    else return h+":00";
}
function sorting()
{
    for(let i=0 ; i<index ; i++)
    {
        for(let j = i+1 ; j<index ; j++)
        {
            if((new Date(contest_info[i][1]))>(new Date(contest_info[j][1])))
            {
                let box= contest_info[i];
                contest_info[i]=contest_info[j];
                contest_info[j]=box;
            }
        }
    }
    
}
function showcard()
{
    
        const details = document.getElementById('contest_card');
        details.innerHTML = '';  
        
        
        for(let i=0 ; i<index ; i++)
        { 
            let logo;
            if(contest_info[i][3].includes("codeforces")) logo = "./photo/image1.png";
            if(contest_info[i][3].includes("atcoder")) logo = "./photo/image2.png";
            if(contest_info[i][3].includes("leetcode")) logo = "./photo/image3.png";
            if(contest_info[i][3].includes("codechef")) logo = "./photo/image4.jpg";
            let contestName;
            if(contest_info[i][3].includes("codeforces")) contestName = "Codeforces";
            if(contest_info[i][3].includes("atcoder")) contestName = "Atcoder";
            if(contest_info[i][3].includes("leetcode")) contestName = "Leetcode";
            if(contest_info[i][3].includes("codechef")) contestName = "Codechef";
            const div = document.createElement('div'); 
            div.innerHTML = `
                <div class="mt-10 border-0 shadow py-5 rounded-md bg-lime-100 h-65 hover:scale-110 duration-400">
                <div class="flex justify-center gap-5">
                    <img src="${logo}"  class="w-10">
                    <p><b>${contestName}</b></p>
                </div>
                <div class="copy_part">
                    <p>${contest_info[i][2]}</p>
                    <p>Platform:${contestName}</p>
                    <p>Starting Time: ${formatDateTimeBD(contest_info[i][1])}</p>
                    <p>Duration:${durationHM(contest_info[i][5])}</p>
                    <p>Link:${contest_info[i][3]}</p>
                </div>
                <div>
                    <button class="bg-cyan-200 py-2 px-5 rounded-md mt-2 border-0 shadow hover:scale-110 duration-400" ><a href="${contest_info[i][3]}" target="_blank">Go to link</a></button>
                    <button  class="bg-cyan-200 py-2 px-5 rounded-md mt-2 border-0 shadow hover:scale-110 duration-400" onclick="copy_func(this)">copy</button>
                </div>
                </div>
            `;
            details.appendChild(div);
        }
        /*
        contest.id,
        contest.start,
        contest.event,
        contest.href,
        contest.resource.name*/
}
function copy_func(btn) {
    const card = btn.closest('.mt-10').querySelector('.copy_part');
    const text = card.innerText;
    navigator.clipboard.writeText(text);
    alert("Copied");
}

function formatDateTimeBD(dt) {
    const utcDate = new Date(dt);
 
    const bdDate = new Date(utcDate.getTime() + 6 * 60 * 60 * 1000); 
    let h = bdDate.getHours();
    let m = bdDate.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    if (h === 0) h = 12;

    m = m.toString().padStart(2, "0");

    const time12 = `${h}:${m} ${ampm}`; 
    const day = bdDate.getDate();
    const month = bdDate.toLocaleString("en-US", { month: "short" }); 
    const year = bdDate.getFullYear();

    return `${day} ${month} ${year} - ${time12}`;
}

async function main() {
    await getContests();   /// wait for data...
    sorting();             
    showcard();  
             
}

main();