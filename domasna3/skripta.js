var VK_KRUGOVI=10;
var OSN_KRUG=92;
var PIT_ZAGUBA=20;
var PIT_ZAGUBA_SC=11;
var SC_KRUG_VREME=118;
var SC_MIN_RAST=0.8;
var KAZNA=30;

function Guma(ime, bonus, wear, css){
    this.ime=ime;
    this.bonus=bonus;
    this.wear=wear;
    this.css=css;
}
var GUMI=new Array();
GUMI[0]=new Guma("Меки", -1.5, 0.25, "soft");
GUMI[1]=new Guma("Тврди", 0, 0.08, "hard");

function Status(vid, tekst){
    this.vid=vid;
    this.tekst=tekst;
}
function rand(min, max){
    return Math.random()*(max-min)+min;
}
function randInt(min, max){
    return Math.floor(rand(min, max));
}
function pad3(n){
    if(n<10){
        return "00"+n;
    }
    if(n<100){
        return "0"+n;
    }
    return ""+n;
}
function formatTime(t){
    var ms=Math.round(t*1000);
    var m=Math.floor(ms/60000);
    var rest=ms-m*60000;
    var s=Math.floor(rest/1000);
    var mili=rest-s*1000;
    var sStr=""+s;
    if(s<10){
        sStr="0"+s;
    }
    return m+":"+sStr+"."+pad3(mili);
}
function formatGap(t){
    if (t==0){
        return "-";
    }
    var ms=Math.round(t*1000);
    var s=Math.floor(ms/1000);
    return "+"+s+"."+pad3(ms-s*1000)+" s";
}
function badge(css, tekst){
    return '<span class="badge '+css+'">'+tekst+'</span>';
}
function sporediVreme(a, b){
    return a.vkVreme-b.vkVreme;
}
function sporediBrzina(a, b){
    return b.brzina-a.brzina;
}

function Vozac(ime, tim, brzina, vestina){
    this.ime=ime;
    this.tim=tim;
    this.brzina=brzina;
    this.vestina=vestina;

    this.reset=function (gridIndex){
        this.vkVreme=gridIndex*0.3;
        this.poslKrug=0;
        this.gumaIndex=randInt(0, 2);
        this.gumaAge=0;
        this.pitStops=0;
        this.iskoristeniGumi=new Array(false, false);
        this.iskoristeniGumi[this.gumaIndex]=true;
        this.pitKrug=randInt(2, 9);
        this.status=new Array();
        this.pozicija=gridIndex+1;
        this.prevPozicija=gridIndex+1;
    };
    this.addStatus=function(vid, tekst){
        this.status[this.status.length]=new Status(vid, tekst);
    };
    this.voziKrug=function(krugNo, sc){
        this.status=new Array();
        var guma=GUMI[this.gumaIndex];
        var time;
        if(sc){
            time=SC_KRUG_VREME+rand(0, 0.6);
            this.addStatus("sc", "Безбедносно возило");
        }
        else{
            time=OSN_KRUG-this.brzina*0.07;
            time=time+guma.bonus+guma.wear*this.gumaAge;
            time=time+rand(-1,1)*(1.2-this.vestina/100);

            var izvShansa=0.03+(100-this.vestina)/500;
            if(Math.random()<izvShansa){
                if(Math.random()<0.5){
                    time=time+rand(6, 12);
                    this.addStatus("incident", "Извртување");
                }
                else{
                    time=time+rand(12, 25);
                    this.addStatus("incident", "Излетување од патека");
                }
            }
        }
        var sakaPit=false;
        if(this.pitStops==0){
            if(krugNo==this.pitKrug){
                sakaPit=true;
            }
            else if(sc && krugNo<VK_KRUGOVI && Math.random()<0.4){
                sakaPit=true;
            }
        }
        if(sakaPit){
            time=time+(sc ? PIT_ZAGUBA_SC:PIT_ZAGUBA);
            this.gumaIndex=1-this.gumaIndex;
            this.iskoristeniGumi[this.gumaIndex]=true;
            this.gumaAge=0;
            this.pitStops++;
            this.addStatus("pit", "Пит-стоп → "+GUMI[this.gumaIndex].ime);
        }
        else if(!sc){
            this.gumaAge++;
        }
        this.poslKrug=time;
        this.vkVreme+=time;
        return time;
    };
}

function SnapRow(pos, d, liderTime){
    this.pos=pos;
    this.change=d.prevPozicija-pos;
    this.ime=d.ime;
    this.tim=d.tim;
    this.gumaIndex=d.gumaIndex;
    this.gumaAge=d.gumaAge;
    this.pitStops=d.pitStops;
    this.poslKrug=d.poslKrug;
    this.vkVreme=d.vkVreme;
    this.gap=d.vkVreme-liderTime;
    this.status=d.status;
}

var vozaci=new Array();
function kreirajVozaci(){
    vozaci=new Array();
    vozaci[0]=new Vozac("Макс Верстапен", "Red Bull Racing", 96, 94);
    vozaci[1]=new Vozac("Луис Хамилтон", "Ferrari", 93, 95);
    vozaci[2]=new Vozac("Ландо Норис", "McLaren", 92, 91);
    vozaci[3]=new Vozac("Оскар Пиастри", "McLaren", 90, 89);
    vozaci[4]=new Vozac("Пиер Гасли", "Alpine", 85, 86);
    vozaci[5]=new Vozac("Фернандо Алонсо", "Aston Martin", 89, 93);
    vozaci[6]=new Vozac("Џорџ Расл", "Mercedes", 91, 88);
    vozaci[7]=new Vozac("Карлос Саинз", "Williams", 89, 90);
    vozaci[8]=new Vozac("Чарл Леклерк", "Ferrari", 94, 89);
    vozaci[9]=new Vozac("Александер Албон", "Williams", 86, 84);
    vozaci.sort(sporediBrzina);
}
function getStandings(){
    var list=new Array();
    for(var i=0;i<vozaci.length;i++){
        list[i]=vozaci[i];
    }
    list.sort(sporediVreme);
    return list;
}
function makeRows(){
    var order=getStandings();
    var rows=new Array();
    for(var i=0; i<order.length;i++){
        order[i].prevPozicija=order[i].pozicija;
        order[i].pozicija=i+1;
        rows[i]=new SnapRow(i+1, order[i], order[0].vkVreme);
    }
    return rows;
}
function writeTable(caption, rows, mode){
    var s='<table>';
    s+='<caption>Состојба: '+caption+'</caption>';
    s+='<thead><tr><th>Позиција</th><th>±</th><th>Возач</th><th>Тим</th><th>Гуми</th><th>Пит</th><th>Последен круг</th><th>Вкупно време</th><th>Заостанување</th><th>Статус</th></tr></thead><tbody>';
    for(var i=0;i<rows.length;i++){
        var r=rows[i];
        if(mode==2 && r.pos==1){
            s+='<tr class="winner">';
        }
        else{
            s+='<tr>';
        }
        s+='<td class="pos">'+r.pos+'</td>';
        if(r.change>0){
            s+='<td class="up">▲'+r.change+'</td>';
        }
        else if(r.change<0){
            s+='<td class="down">▼'+(-r.change)+'</td>';
        }
        else{
            s+='<td class="same">-</td>';
        }
        s+='<td class="name">'+r.ime+'</td>';
        s+='<td>'+r.tim+'</td>';
        var guma=GUMI[r.gumaIndex];
        s+='<td>'+badge(guma.css, guma.ime+' ('+r.gumaAge+')')+'</td>';
        s+='<td>'+r.pitStops+'</td>';
        s+='<td>'+(mode==0 ? '-':formatTime(r.poslKrug))+'</td>';
        s+='<td>'+formatTime(r.vkVreme)+'</td>';
        s+='<td>'+formatGap(r.gap)+'</td>';

        s+='<td>';
        if(mode==0){
            s+='Старт';
        }
        else if(r.status.length==0){
            s+='Чисто возење';
        }
        else{
            for(var j=0;j<r.status.length;j++){
                s+=badge(r.status[j].vid, r.status[j].tekst);
            }
        }
        s+='</td></tr>';
    }
    s+='</tbody></table>';
    document.write(s);
}
function writeVozaciSection(){
    var s='<section id="vozaci"><h2>Возачи</h2><table><caption>Стартна листа (според базична брзина)</caption><thead><tr><th>Старт</th><th>Возач</th><th>Тим</th><th>Базична брзина</th><th>Базична вештина</th></tr></thead><tbody>';
    for(var i=0;i<vozaci.length;i++){
        s+='<tr><td>'+(i+1)+'</td>';
        s+='<td class="name">'+vozaci[i].ime+'</td>';
        s+='<td>'+vozaci[i].tim+'</td>';
        s+='<td>'+vozaci[i].brzina+'</td>';
        s+='<td>'+vozaci[i].vestina+'</td></tr>';
    }
    s+='</tbody></table></section>';
    document.write(s);
}
function writeGumiSection(){
    var s='<section id="gumi"><h2>Гуми</h2><table>';
    s+='<caption>Два типа гуми</caption>';
    s+='<thead><tr><th>Тип</th><th>Предност (s)</th><th>Оштетување (s/круг)</th></tr></thead><tbody>';
    for(var i=0;i<GUMI.length;i++){
        s+='<tr><td>'+badge(GUMI[i].css, GUMI[i].ime)+'</td>';
        s+='<td>'+GUMI[i].bonus+'s</td>';
        s+='<td>+'+GUMI[i].wear+'s</td></tr>';
    }
    s+='</tbody></table>';
    s+='<p class="note">Секој возач мора барем еднаш да влезе во бокс и да смени тип на гуми за времетраење на трката. Пит-стопот чини време, а при безбедносно возило е поевтин.</p></section>';
    document.write(s);
}
function startTrka(){
    var scOstanati=0;
    var scIskoristen=false;
    var scAktiven=false;
    kreirajVozaci();
    for(var i=0;i<vozaci.length;i++){
        vozaci[i].reset(i);
    }
    writeVozaciSection();
    writeGumiSection();
    document.write('<section id="trka"><h2>Трка</h2>');
    document.write('<p class="note">Трката е со '+VK_KRUGOVI+' круга. '+'Табелата се прикажува на стартот и на крајот на секој круг. За нова трка освежи ја страната (F5).</p>');
    writeTable("Старт", makeRows(), 0);
    for(var krug=1;krug<=VK_KRUGOVI;krug++){
        var events=new Array();
        var beseSc=scAktiven;
        if(scOstanati==0 && !scIskoristen && krug>=2 && krug<=VK_KRUGOVI-2 && Math.random()<0.15){
            scOstanati=2;
            scIskoristen=true;
            events[events.length]=new Status("sc", "Излезе безбедносно возило! Забрането е престигнување.");
        }
        scAktiven=scOstanati>0;
        if(scAktiven){
            scOstanati--;
        }
        if(beseSc && !scAktiven){
            events[events.length]=new Status("info", "Безбедносното возило влезе во бокс - трката продолжува.");
        }
        for(var k=0;k<vozaci.length;k++){
            var d=vozaci[k];
            d.voziKrug(krug, scAktiven);
            for(var j=0;j<d.status.length;j++){
                if(d.status[j].vid!="sc"){
                    events[events.length]=new Status(d.status[j].vid, d.ime+" ("+d.tim+") - "+d.status[j].tekst);
                }
            }
        }
        if(krug==VK_KRUGOVI){
            for(var m=0;m<vozaci.length;m++){
                var dr=vozaci[m];
                if(!(dr.iskoristeniGumi[0] && dr.iskoristeniGumi[1])){
                    dr.vkVreme=dr.vkVreme+KAZNA;
                    dr.addStatus("incident", "Казна +"+KAZNA+" s");
                    events[events.length]=new Status("incident", dr.ime+" доби казна од "+KAZNA+" s (нема промена на гуми).");
                }
            }
        }
        if(scAktiven){
            var order=getStandings();
            for(var n=1;n<order.length;n++){
                var gap=order[n].vkVreme-order[n-1].vkVreme;
                if(gap>SC_MIN_RAST){
                    order[n].vkVreme=order[n-1].vkVreme+SC_MIN_RAST;
                }
            }
        }
        document.write('<h3 id="krug'+krug+'">Круг '+krug+' / '+VK_KRUGOVI+'</h3>');
        if(scAktiven){
            document.write('<div class="banner sc">🚨 БЕЗБЕДНОСНО ВОЗИЛО НА ПАТЕКА 🚨</div>');
        }
        for(var e=0;e<events.length;e++){
            document.write('<p class="log '+events[e].vid+'">'+events[e].tekst+'</p>');
        }
        if(krug==VK_KRUGOVI){
            writeTable("Крај на круг "+krug+" (finish)", makeRows(), 2);
        }
        else{
            writeTable("Крај на круг "+krug, makeRows(), 1);
        }
        if(krug<VK_KRUGOVI){
            document.write('<p><a class="btn" href="#krug'+(krug+1)+'">Следен круг ▶</a></p>');
        }
        else{
            document.write('<p><a class="btn" href="#vozaci">Назад на почеток ▲</a></p>');
        }
    }
    var pobednik=getStandings()[0];
    document.write('<div class="banner winnerBanner">🏆Победник: '+pobednik.ime+' ('+pobednik.tim+') - '+formatTime(pobednik.vkVreme)+'</div>');
    document.write('</section>');
}
startTrka();