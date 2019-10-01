function updateDate(e) {    
    clearHolidaysCount();
    document.getElementById('hi').innerText = '';
    document.getElementById('hiStat').innerText = '';
    document.getElementById('hiFuture').innerText = '';
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
    6 : {
        29: {name: "ערב ראש השנה"},
        28: {name: "ערב ראש השנה"},
    },
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
    9 : {
        24: {name: "ערב חנוכה"},
        25: {name: "חנוכה"},
        26: {name: "חול המועד חנוכה", group: 1},
        27: {name: "חול המועד חנוכה", group: 1},
        28: {name: "חול המועד חנוכה", group: 1},
        29: {name: "חול המועד חנוכה", group: 1},
        30: {name: "חול המועד חנוכה", group: 1},
    },
    10 : {
        1 : {name: "חול המועד חנוכה", group: 1},
        2 : {name: "חול המועד חנוכה", group: 1},
    },
    11 : {
        15: {name: 'ט"ו בשבט'}
    },
    12 : {
        13: {name: 'תענית אסתר'},
        14: {name: 'פורים'},
        15: {name: 'שושן פורים'},
    },
    13 : {
        13: {name: 'תענית אסתר', leapYear: true},
        14: {name: 'פורים', leapYear: true},
        15: {name: 'שושן פורים', leapYear: true},
    },    
    1: {        
        14: {name: 'ערב פסח'},
        15: {name: 'פסח'},
        16 : {name: "חול המועד פסח", group: 1},
        17 : {name: "חול המועד פסח", group: 1},
        18 : {name: "חול המועד פזח", group: 1},
        19 : {name: "חול המועד פסח", group: 1},
        20 : {name: "חול המועד פסח", group: 1},
        21 : {name: "שביעי של פסח", group: 1},
        22 : {name: "איסרו פסח", group: 1},
    },
    2: {
        17: {name:'ל"ג בעומר'}
    },
    3 : {
        5 : {name: "ערב שבועות"},
        6 : {name: "שבועות"},
        7 : {name: "איסרו שבועות"},
    },
    5 : {
        8 : {name: "ערב תשעה באב"},
        9 : {name: "תשעה באב"},
    }
    
}
function computeTishreyBD(dateStr = null) {
    
    let currDate = new Date();    
    let currYear = currDate.getFullYear();
    let dateArr = dateStr ? dateStr.split('-') : null;
    let birthYear = dateArr ? dateArr[0] : 1980;
    let gregDay = dateArr ? dateArr[2] : 8;
    let gregMonth = dateArr ? dateArr[1] : 10;
    
    let birthDate = new Date(`${birthYear}-${gregMonth}-${gregDay}`);    
    if (!dateStr && !urlParam) {
        document.getElementById('bday').value = 
            `${birthYear}-${gregMonth}-08`;
    } else if(urlParam) {
        document.getElementById('bday').value = getUrlParam('dateStr');
        urlParam = false;
    }
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    //console.log(birthDate.toLocaleDateString('he-IL', options));
    let birthDateStr = birthDate.toLocaleDateString('he-IL', options);
    document.getElementsByTagName('h3')[0].innerText = `${uiString[11][lng]}: ${birthDateStr}`;

    let matches = 0;
    let t_matches = 0;
    let maxYear = lng === "heb" ? parseInt(birthYear) +  120: currYear;
    //let maxYear = parseInt(birthYear) + 120;
    for (let i = birthYear; i <= (maxYear); i++) {        
        let day = new Hebcal.HDate(new Date(`${i}-${gregMonth}-${gregDay}`));   
        let holy = '';
        
        //console.log(day.isLeapYear())
        let hebDay = day.getDate();
        let hebMonth = day.month;
        //console.log(hebMonth)
        let tishreyDay = holidays[hebMonth] && holidays[hebMonth][hebDay]
            ? holidays[hebMonth][hebDay] : null;
        if (tishreyDay) {
            if (lng != 'heb')     
                holy = day.holidays(false);
            //console.log(holy)
            let engDate = lng === 'eng' ? ' '  + day : '';
            let dateName = !engDate ? tishreyDay.name : holy[0].desc[descId];
            //console.log(holy)
            if (i <= currYear) {
                matches++;
                if (hebMonth == 7) {
                    t_matches++;
                }

                if (!tishreyDay.count) {
                    tishreyDay.count = 1;
                } else {
                    tishreyDay.count++;
                }
                let elem = `<div class='ageLine'>${uiString[0][lng]} ${i - birthYear} ${uiString[1][lng]} ${dateName}</div>`;
                document.getElementById('hi').insertAdjacentHTML('beforeend',elem);
            } else {
                //if (lng === "heb") {
                    let elem = `<div class='ageLine'>${uiString[0][lng]} ${i - birthYear} ${uiString[1][lng]}${dateName} </div>`;
                    document.getElementById('hiFuture').insertAdjacentHTML('beforeend',elem);
                //}
            }
        }
    }

    document.getElementById('hiMatches').innerHTML = t_matches  ? 
        `${uiString[2][lng]} ${t_matches} ${uiString[3][lng]} ${uiString[4][lng]}` :
        `${uiString[2][lng]} ${matches} ${uiString[3][lng]} ${uiString[5][lng]} <br>        
            ${uiString[6][lng]}`;
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
    console.log(location.href)
    let url = location.href
    name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
    const regexS = `[\\?&]${name}=([^&#]*)`
    const regex = new RegExp(regexS)
    const results = regex.exec(url)
    return results == null ? null : results[1]
}

function prepareStrings() {    
    document.title = uiString[7][lng];
    let elems = document.querySelectorAll(`[dic-id]`);
    elems.forEach(function(el) {
        el.innerText = uiString[el.getAttribute('dic-id')][lng];
    })
}

let lng = getUrlParam('lng') && ['heb','eng'].indexOf(getUrlParam('lng')) > -1 ? getUrlParam('lng') : 'heb';
let descId = lng === 'heb' ? 2 : 0;
if (lng != 'heb') {
    document.body.style.direction = 'ltr';
    document.body.direction = 'ltr';
}
prepareStrings();
let urlParam = false;
//console.log(getUrlParam('dateStr'))
if (getUrlParam('dateStr')) {
    urlParam = true;
}
computeTishreyBD(getUrlParam('dateStr'));
