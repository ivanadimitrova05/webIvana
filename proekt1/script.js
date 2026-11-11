var currentUser=null;
function Destination(name, category, price, photo, text, photos){
    this.name=name;
    this.category=category;
    this.price=price;
    this.photo=photo;
    this.text=text;
    this.photos=photos;
}

var destinations=new Array();
destinations[0]=new Destination("Paris, France", "City break", 450, "paris.webp", "Explore the most romantic and fun city in the world!", new Array(new Photo("paris2.webp"), new Photo("paris3.webp"), new Photo("paris4.jpg")));
destinations[1]=new Destination("London, UK", "City break", 400, "london-1.jpeg", "Even though it rains a lot, there is so much to do!", new Array(new Photo("london2.avif"), new Photo("london4.jpg"), new Photo("london3.avif")));
destinations[2]=new Destination("Positano, Italy", "Beach", 500, "positano1.avif", "These views will make you feel like you're in a fairytale!", new Array(new Photo("positano2.jpg"), new Photo("positano3.jpg"), new Photo("positano5.jpg")));
destinations[3]=new Destination("Santorini, Greece", "Beach", 600, "santorini1.jpg", "Get lost exploring the peaceful black-sand beaches and beautiful streets!", new Array(new Photo("santorini2.jpg"), new Photo("santorini3.jpg"), new Photo("santorini4.webp")));
destinations[4]=new Destination("Bled, Slovenia", "Mountain", 300, "bled11.avif", "This is the most picturesque place, with glassy blue waters!", new Array(new Photo("bled2.webp"), new Photo("bled3.jpg"), new Photo("bled-snow.jpg")));
destinations[5]=new Destination("Budapest, Hungary", "Culture", 375, "budapest1.jpg", "There is something for everyone to do in this city!", new Array(new Photo("budapest2.webp"), new Photo("budapest3.jpg"), new Photo("budapest4.avif")));

function User(username, password){
    this.username=username;
    this.password=password;
}
var users=new Array();
users[0]=new User("ivana", "travel2026");
users[1]=new User("guest", "guest123");

function setLoggedIn(on){
    document.getElementById("loginCard").className = on ? "card login-card d-none" : "card login-card";
    document.getElementById("loggedIn").className = on ? "card login-card" : "card login-card d-none";
    document.getElementById("addSection").className = on ? "" : "d-none";
    document.getElementById("addNotice").className = on ? "d-none" : "alert alert-secondary mt-4";
    draw(); 
}

function login(){
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    if(username=="" || password==""){
        showAlert("loginMessage", "Please enter username and password.", "danger");
        return;
    }
    var found=null;
    for(var i=0;i<users.length;i++){
        if(users[i].username==username && users[i].password==password){
            found=users[i];
        }
    }
    if(found==null){
        showAlert("loginMessage", "Wrong username or password.", "danger");
        return;
    }
    currentUser=found;
    var welcome=document.getElementById("welcomeText");
    clearElement(welcome);

    welcome.appendChild(document.createTextNode("Welcome, "+found.username+"!"));
    var avatar=document.getElementById("avatar");
    clearElement(avatar);

    avatar.appendChild(document.createTextNode(found.username.charAt(0).toUpperCase()));
    clearElement(document.getElementById("loginMessage"));

    document.getElementById("password").value="";
    setLoggedIn(true);
}

function logout(){
    currentUser=null;
    document.getElementById("username").value="";
    document.getElementById("password").value="";
    setLoggedIn(false);
    showAlert("loginMessage", "You have been logged out.", "info");
}

function makeCard(d,i){
    var kolona=document.createElement("div");
    kolona.className="col-12 col-md-6 col-lg-4 mb-4";

    var kartica=document.createElement("div");
    kartica.className="card h-100";

    var slika=document.createElement("img");
    slika.className="card-img-top";
    slika.src=d.photo;
    slika.alt=d.name;

    var telo=document.createElement("div");
    telo.className="card-body";

    var naslov=document.createElement("h4");
    naslov.className="card-title";
    naslov.appendChild(document.createTextNode(d.name));
    
    var tekst=document.createElement("p");
    tekst.className="card-text";
    tekst.appendChild(document.createTextNode(d.text));

    var oznaka1=document.createElement("span");
    oznaka1.className="badge badge-info mr-1";
    oznaka1.appendChild(document.createTextNode(d.category));

    var oznaka2=document.createElement("span");
    oznaka2.className="badge badge-success";
    oznaka2.appendChild(document.createTextNode("$"+d.price+" / person"));

    var izbrisi=document.createElement("button");
    izbrisi.type="button";
    izbrisi.className="btn btn-danger btn-sm";
    izbrisi.appendChild(document.createTextNode("Delete"));
    izbrisi.onclick=function(){
        deleteDestination(i);
    }

    var galleryKopce=document.createElement("a");
    galleryKopce.href="#gallery";
    galleryKopce.className="btn btn-primary btn-sm mt-2 mr-2";
    galleryKopce.appendChild(document.createTextNode("Gallery"));
    galleryKopce.onclick=function(){
        openGallery(d);
    };

    telo.appendChild(galleryKopce);
    telo.appendChild(naslov);
    telo.appendChild(tekst);
    var oznaki=document.createElement("div");
    oznaki.appendChild(oznaka1);
    oznaki.appendChild(oznaka2);

    var red=document.createElement("div");
    red.className="d-flex justify-content-between align-items-center mt-2";
    red.appendChild(oznaki);
    if(currentUser!=null){
        red.appendChild(izbrisi);
    }

    telo.appendChild(red);
    kartica.appendChild(slika);
    kartica.appendChild(telo);
    kolona.appendChild(kartica);
    return kolona;
}
function draw(){
    var kontejner=document.getElementById("cities");
    while(kontejner.firstChild){
        kontejner.removeChild(kontejner.firstChild)
    }
    var budget=document.getElementById("budget").value;
    var category=document.getElementById("filterCategory").value;
    var shown=0;

    for(var i=0;i<destinations.length;i++){
        var d=destinations[i];
        var okBudget=(budget=="" || d.price<=Number(budget));
        var okCategory=(category=="all" || d.category==category);
        if(okBudget && okCategory){
            kontejner.appendChild(makeCard(d, i));
            shown++;
        }
    }

    var nr=document.getElementById("noResults");
    if(shown==0){
        nr.className="alert alert-warning";
        nr.innerHTML="No destinations match your filter.";
    }else{
        nr.className="";
        nr.innerHTML="";
    }
    fillCalculator();
}
draw();
function resetFilter(){
    document.getElementById("budget").value="";
    document.getElementById("filterCategory").value="all";
    draw();
}

function fillCalculator(){
    var select=document.getElementById("calcDestination");
    var selected=select.value;
    while(select.firstChild){
        select.removeChild(select.firstChild);
    }
    for(var i=0;i<destinations.length;i++){
        var option=document.createElement("option");
        option.value=i;
        option.appendChild(document.createTextNode(destinations[i].name+" ($"+destinations[i].price+")"));
        select.appendChild(option);
    }
    if(selected!="" && selected<destinations.length){
        select.value=selected;
    }
}

function calculate(){
    var result=document.getElementById("calcResult");
    var index=document.getElementById("calcDestination").value;
    var people=Number(document.getElementById("people").value);
    var extra=Number(document.getElementById("extra").value);

    if(index==""){
        result.className="alert alert-warning";
        result.innerHTML="There are no destinations to calculate for.";
        return;
    }
    if(people<1 || extra<0){
        result.className="alert alert-danger";
        result.innerHTML="Please enter at least 1 person and a non-negative amount for extras";
        return;
    }

    var d=destinations[index];
    var trip=people*d.price;
    var extras=people*extra;
    var total=trip+extras;

    result.className="alert alert-info";
    result.innerHTML="<b>"+d.name+"</b>, "+people+" people<br>"+"Trip (all included): $"+trip+"<br>Extras: $"+extras+"<br><b>Total: $"+total+"</b> ($"+(total/people)+" per person)";
}

function deleteDestination(index){
    if(currentUser==null){
        alert("Please log in to delete destinations.");
        return;
    }
    if(destinations[index]==currentCity){
        currentCity=null;
        var box=document.getElementById("galleryContent");
        clearElement(box);
        var p=document.createElement("p");
        p.appendChild(document.createTextNode("Click \"Gallery\" on a destination card to see its photos."));
        box.appendChild(p);
    }
    for(var i=index;i<(destinations.length)-1;i++){
        destinations[i]=destinations[i+1];
    }
    destinations.length=destinations.length-1;
    draw();
}

function showMessage(text,kind){
    var kontejner=document.getElementById("message");
    while(kontejner.firstChild){
        kontejner.removeChild(kontejner.firstChild);
    }
    var poraka=document.createElement("div");
    poraka.className="alert alert-"+kind+" alert-dismissible fade show";

    var close=document.createElement("button");
    close.type="button";
    close.className="close";
    close.setAttribute("data-dismiss", "alert");
    close.appendChild(document.createTextNode("×"));

    poraka.appendChild(document.createTextNode(text));
    poraka.appendChild(close);
    kontejner.appendChild(poraka);
}

function add(){
    if(currentUser==null){
        showMessage("Please log in to add destinations.", "warning");
        return;
    }
    var name=document.getElementById("name").value;
    var category=document.getElementById("category").value;
    var price=Number(document.getElementById("price").value);
    var photo=document.getElementById("photo").value;
    var text=document.getElementById("text").value;
    if(name=="" || text==""){
        showMessage("Please fill in name and description. ", "danger");
        return;
    }
    if(isNaN(price) || price<=0){
        showMessage("Price must be a positive number. ", "danger");
        return;
    }
    if(photo==""){
        photo="default.png";
    }
    destinations[destinations.length]=new Destination(name,category,price,photo,text, new Array(new Photo(photo)));
    resetFilter();
    showMessage(name+" was added as a new destination! ", "success");

    document.getElementById("name").value="";
    document.getElementById("category").value="City break";
    document.getElementById("price").value="";
    document.getElementById("photo").value="";
    document.getElementById("text").value="";
}

function Photo(src){
    this.src=src;
    this.likes=0;
    this.dislikes=0;
    this.comments=new Array();
}

var currentCity=null;
function clearElement(el){
    while(el.firstChild){
        el.removeChild(el.firstChild);
    }
}

function openGallery(d){
    currentCity=d;
    var box=document.getElementById("galleryContent");
    clearElement(box);

    var title=document.createElement("div");
    title.appendChild(document.createTextNode(d.name));
    box.appendChild(title);

    var row=document.createElement("div");
    row.className="row";
    for(var i=0;i<d.photos.length;i++){
        row.appendChild(makePhotoCard(d.photos[i], d.name));
    }
    box.appendChild(row);
}

function makeComment(text){
    var p=document.createElement("p");
    p.className="border-left pl-2 my-1";
    p.appendChild(document.createTextNode(text));
    return p;
}

function makePhotoCard(photo, city){
    var col=document.createElement("div");
    col.className="col-12 col-md-6 col-lg-4 mb-4";

    var card=document.createElement("div");
    card.className="card h-100 text-dark";

    var img=document.createElement("img");
    img.className="card-img-top";
    img.src=photo.src;
    img.alt=city;

    var body=document.createElement("div");
    body.className="card-body";

    var likeBtn=document.createElement("button");
    likeBtn.type="button";
    likeBtn.className="btn btn-success btn-sm mr-2";
    likeBtn.innerHTML="👍 "+photo.likes;
    likeBtn.onclick=function(){
        photo.likes++;
        likeBtn.innerHTML="👍 "+photo.likes;
    };

    var dislikeBtn=document.createElement("button");
    dislikeBtn.type="button";
    dislikeBtn.className="btn btn-danger btn-sm";
    dislikeBtn.innerHTML="👎 "+photo.dislikes;
    dislikeBtn.onclick=function(){
        photo.dislikes++;
        dislikeBtn.innerHTML="👎 "+photo.dislikes;
    };

    var list=document.createElement("div");
    list.className="mt-3";
    for(var j=0;j<photo.comments.length;j++){
        list.appendChild(makeComment(photo.comments[j]));
    }

    var input=document.createElement("textarea");
    input.className="form-control mt-2";
    input.placeholder="Write a comment...";

    var addBtn=document.createElement("button");
    addBtn.type="button";
    addBtn.className="btn btn-primary btn-sm mt-2";
    addBtn.appendChild(document.createTextNode("Comment"));
    addBtn.onclick=function(){
        var t=input.value;
        if(t==""){
            alert("Please write a comment first 😊");
            return;
        }
        photo.comments[photo.comments.length]=t;
        list.appendChild(makeComment(t));
        input.value="";
    };

    body.appendChild(likeBtn);
    body.appendChild(dislikeBtn);
    body.appendChild(list);
    body.appendChild(input);
    body.appendChild(addBtn);
    card.appendChild(img);
    card.appendChild(body);
    col.appendChild(card);
    return col;
}

function Answer(name, email, source, liked, rating, comment){
    this.name=name;
    this.email=email;
    this.source=source;
    this.liked=liked;
    this.rating=rating;
    this.comment=comment;
}

var answers=new Array();

function showAlert(containerId, text, kind){
    var container=document.getElementById(containerId);
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    var box=document.createElement("div");
    box.className="alert alert-"+kind+" alert-dismissible fade show";
    var close=document.createElement("button");
    close.type="button";
    close.className="close";
    close.setAttribute("data-dismiss", "alert");
    close.appendChild(document.createTextNode("×"));
    box.appendChild(document.createTextNode(text));
    box.appendChild(close);
    container.appendChild(box);
}

function getRadioValue(name){
    var radios=document.getElementsByName(name);
    for(var i=0;i<radios.length;i++){
        if(radios[i].checked){
            return radios[i].value;
        }
    }
    return "";
}

function getCheckedValues(name){
    var boxes=document.getElementsByName(name);
    var result="";
    for(var i=0;i<boxes.length;i++){
        if(boxes[i].checked){
            if(result!=""){
                result=result+", ";
            }
            result=result+boxes[i].value;
        }
    }
    return result;
}

function updateProgress(){
    var done=0;
    if(document.getElementById("sName").value!=""){ 
        done++;
    }
    if(document.getElementById("sEmail").value!=""){ 
        done++;
    }
    if(getRadioValue("source")!=""){ 
        done++;
    }
    if(getCheckedValues("liked")!=""){ 
        done++;
    }
    if(document.getElementById("sRating").value!=""){ 
        done++;
    }
    var procent=done*20;
    var bar=document.getElementById("surveyBar");
    bar.setAttribute("style", "width: "+procent+"%");
    bar.innerHTML=procent+"%";
}

function submitSurvey(){
    var name=document.getElementById("sName").value;
    var email=document.getElementById("sEmail").value;
    var source=getRadioValue("source");
    var liked=getCheckedValues("liked");
    var rating=document.getElementById("sRating").value;
    var comment=document.getElementById("sComment").value;

    if(name==""){
        showAlert("surveyMessage", "Please enter your name.", "danger");
        return;
    }
    if(email.indexOf("@")==-1 || email.indexOf(".")==-1){
        showAlert("surveyMessage", "Please enter a valid email address.", "danger");
        return;
    }
    if(source==""){
        showAlert("surveyMessage", "Please tell us how you found us.", "danger");
        return;
    }
    if(liked==""){
        showAlert("surveyMessage", "Please select at least one thing you liked.", "danger");
        return;
    }
    if(rating==""){
        showAlert("surveyMessage", "Please choose a rating.", "danger");
        return;
    }
    answers[answers.length]=new Answer(name, email, source, liked, Number(rating), comment);
    showAlert("surveyMessage", "Thank you, "+name+"! Your answers were saved.", "success");
    resetSurvey();
    showResults();
}

function resetSurvey(){
    document.getElementById("sName").value="";
    document.getElementById("sEmail").value="";
    document.getElementById("sRating").value="";
    document.getElementById("sComment").value="";

    var radios=document.getElementsByName("source");
    for(var i=0;i<radios.length;i++){
        radios[i].checked=false;
    }

    var boxes=document.getElementsByName("liked");
    for(var i=0;i<boxes.length;i++){
        boxes[i].checked=false;
    }
    updateProgress();
}

function addCell(row, text){
    var td=document.createElement("td");
    td.appendChild(document.createTextNode(text));
    row.appendChild(td);
}

function showResults(){
    var box=document.getElementById("surveyResults");
    while(box.firstChild){
        box.removeChild(box.firstChild);
    }
    if(answers.length==0){
        return;
    }

    var sum=0;
    for(var i=0;i<answers.length;i++){
        sum=sum+answers[i].rating;
    }
    var average=sum/answers.length;

    var title=document.createElement("h4");
    title.appendChild(document.createTextNode("Responses: "+answers.length+" | Average rating: "+average));
    box.appendChild(title);

    var wrap=document.createElement("div");
    wrap.className="table-responsive";
    var table=document.createElement("table");
    table.className="table table-striped table-hover table-dark";

    var head=document.createElement("tr");
    var headers=new Array("Name", "Email", "Found us via", "Liked", "Rating", "Comment");
    for(var i=0;i<headers.length;i++){
        var th=document.createElement("th");
        th.appendChild(document.createTextNode(headers[i]));
        head.appendChild(th);
    }
    table.appendChild(head);

    for(var i=0;i<answers.length;i++){
        var a=answers[i];
        var tr=document.createElement("tr");
        addCell(tr,a.name);
        addCell(tr,a.email);
        addCell(tr,a.source);
        addCell(tr,a.liked);
        addCell(tr,a.rating);
        addCell(tr,a.comment);
        table.appendChild(tr);
    }
    wrap.appendChild(table);
    box.appendChild(wrap);
}

