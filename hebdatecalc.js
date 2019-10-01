function updateDate(e) {
    console.log(e);
    clearHolidaysCount();
    document.getElementById('hi').innerText = '';
    document.getElementById('hiStat').innerText = '';
    document.getElementById('hiMatches').innerText = '';
    computeTishreyBD(e)
}

function clearHolidaysCount() {
    for (let hm in holidays) {
        for (let dm in holidays[hm]) {
            holidays[hm][dm].count = 0;
        }
    }
}

let holidays = {
    7: {
        1 : {name: "ראש השנה"},
        2 : {name: "ראש השנה"},
        9 : {name: "ערב יום כיפור"},
        10 : {name: "יום כיפור"},
        14 : {name: "ערב סוכות"},
        15 : {name: "סוכות"},
        16 : {name: "חול המועד", group: 1},
        17 : {name: "חול המועד", group: 1},
        18 : {name: "חול המועד", group: 1},
        19 : {name: "חול המועד", group: 1},
        20 : {name: "חול המועד", group: 1},
        21 : {name: "ערב שמחת תורה"},
        22 : {name: "שמחת תורה"}
    }, 
    6 : {
        29: {name: "ערב ראש השנה"},
        28: {name: "ערב ראש השנה"},
    }
}
function computeTishreyBD(dateStr = null) {
    let dateArr = dateStr ? dateStr.split('-') : null;
    let birthYear = dateArr ? dateArr[0] : 1980;
    let gregDay = dateArr ? dateArr[2] : 8;
    let gregMonth = dateArr ? dateArr[1] : 10;
    
    let birthDate = new Date(`${birthYear}-${gregMonth}-${gregDay}`);
    console.log(birthDate.toDateString())
    if (!dateStr) {
        document.getElementById('bday').value = 
            `${birthYear}-${gregMonth}-08`;
    }  
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log(birthDate.toLocaleDateString('he-IL', options));
    let birthDateStr = birthDate.toLocaleDateString('he-IL', options);
    document.getElementsByTagName('h3')[0].innerText = `תאריך לידה: ${birthDateStr}`;

    let matches = 0;
    for (let i = birthYear; i < 2020; i++) {
        let day = new Hebcal.HDate(new Date(`${i}-${gregMonth}-${gregDay}`));
        let hebDay = day.getDate();
        let hebMonth = day.month;
        //console.log(hebMonth)
        let tishreyDay = holidays[hebMonth] && holidays[hebMonth][hebDay]
            ? holidays[hebMonth][hebDay] : null;
        if (tishreyDay) {
            matches++;
            if (!tishreyDay.count) {
                tishreyDay.count = 1;
            } else {
                tishreyDay.count++;
            }
            let elem = `<div class='ageLine'>יומולדת ${i - birthYear} ב  ${tishreyDay.name} </div>`;
            document.getElementById('hi').insertAdjacentHTML('beforeend',elem);
        }
    }

    document.getElementById('hiMatches').innerHTML = matches ?
        `סה"כ ${matches} ימי הולדת בחגי תשרי` :
        `כיפרנו גם בשבילך!!`;
    let groupCnt = 0;
    for (let month in holidays) {
        for (let hDay in holidays[month]) {
            let dDay = holidays[month][hDay];
            if (dDay.count) {
                //console.log(hDay)
                if (!dDay.group) {
                    document.getElementById('hiStat').insertAdjacentHTML('beforeend',
                    `<div class='statLine statLine${hDay}'>${dDay.name} - ${dDay.count} </div>`);
                } else {
                    groupCnt++
                }
            }
        }
    }
    if (groupCnt) {
        document.getElementById('hiStat').insertAdjacentHTML('beforeend', 
            `ו - ${groupCnt} בחול המועד`);
    }
} 

function getUrlParam(name) {
    let url = location.href
    name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
    const regexS = `[\\?&]${name}=([^&#]*)`
    const regex = new RegExp(regexS)
    const results = regex.exec(url)
    return results == null ? null : results[1]
}

computeTishreyBD(getUrlParam('dateStr'));
