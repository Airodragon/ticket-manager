let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let addFlag = false; // True - modal visible false - modal hidden
let toolBoxColors = document.querySelectorAll(".color");
let modal_cont = document.querySelector(".modal-cont")
let maincont = document.querySelector(".main-cont")
let textarea_cont = document.querySelector("textarea");

let colors = ["lightpink","lightblue","lightgreen","black"];
let modalPriorityColor = colors[colors.length-1];
let allPriorityColors = document.querySelectorAll(".priority-color")
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-unlock";
let cross = document.querySelector("#btn-remove");
let ticketArr = [];

if (localStorage.getItem("jira_ticket")){
    //RETREIVE AND DISPLAY TICKETS
    ticketArr = JSON.parse(localStorage.getItem("jira_ticket"));
    ticketArr.forEach((ticketObj)=>{
        createticket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
    })
}
for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener('click',(e)=>{
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let fitleredTickets = ticketArr.filter((ticketObj,idx)=>{
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        // Remove previous Tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        fitleredTickets.forEach((ticketObj)=>{
            createticket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
        })
    })
    
    toolBoxColors[i].addEventListener("dblclick",(e)=>{
        // Remove previous Tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        ticketArr.forEach((ticketObj=>{
            createticket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
        }))
    })
}

allPriorityColors.forEach((colorELem,idx)=>{
    colorELem.addEventListener("click",(e)=>{
        allPriorityColors.forEach((priorityCOlorElem,idx)=>{
            priorityCOlorElem.classList.remove("active")
        })
        colorELem.classList.add("active");

        modalPriorityColor = colorELem.classList[1];
    })
})

addBtn.addEventListener('click',(e)=>{
    addFlag = !addFlag;
    if(addFlag){
        modal_cont.style.display = "flex";
    }
    else{
        modal_cont.style.display = "none";
    }

})
removeBtn.addEventListener('click',(e)=>{
    removeFlag = !removeFlag;
    if(removeFlag){
    cross.classList.remove("fa-times");
    // cross.classList.remove("fa");
    cross.classList.add("fa-ban");
    // cross.classList.add("fa-solid");
}
else{
    cross.classList.remove("fa-ban");
    // cross.classList.remove("fa-solid");
    // cross.classList.add("fa");
    cross.classList.add("fa-times");

    }
})

modal_cont.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key == "Tab"){
        createticket(modalPriorityColor,textarea_cont.value);
        
        addFlag = false
        setDefaultModal();
    }
})
function createticket(ticketColor,ticketTask,ticketID){
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fa fa-lock"></i>
    </div>
    `
    maincont.appendChild(ticketCont);

    if(!ticketID)
    {
    ticketArr.push({ticketColor,ticketTask,ticketID:id})
        localStorage.setItem("jira_ticket",JSON.stringify(ticketArr))
} 

    handlerRemoval(ticketCont,id);
    handelLock(ticketCont,id);
    handelColor(ticketCont,id);}
function handlerRemoval(ticket,id){
    ticket.addEventListener('click',(e)=>{
    if(!removeFlag) return;
    let idx = getTicketIdx(id);
    //DB REMOVAL
    ticketArr.splice(idx,1);
    let stringticketArr = JSON.stringify(ticketArr);
    localStorage.setItem("jira_ticket",stringticketArr);
    ticket.remove();  //UI REMOVAL

})
}
function handelLock(ticket, id){
    let lockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = lockElem.children[0];
    let tickettaskarea = ticket.querySelector(".task-area");
    ticketLock.addEventListener('click',(e)=>{
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            tickettaskarea.setAttribute("contenteditable","true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass)
            tickettaskarea.setAttribute("contenteditable","false");
        }

        ticketArr[ticketIdx].ticketTask = tickettaskarea.innerText;
        localStorage.setItem("jira_ticket",JSON.stringify(ticketArr))
    })
}
function handelColor(ticket,id){

    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx = colors.findIndex((color)=>{
            return currentTicketColor === color;
        })
        currentTicketColorIdx = currentTicketColorIdx + 1;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        ticketArr[ticketIdx].ticketColor == newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    })
}
function getTicketIdx(id){
    let ticketIdx = ticketArr.findIndex((ticketObj)=>{
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}
function setDefaultModal(){
    modal_cont.style.display="none";
        textarea_cont.value = ""
    modalPriorityColor = colors[colors.length-1];
    allPriorityColors.forEach((priorityCOlorElem,idx)=>{
        priorityCOlorElem.classList.remove("active")
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("active");
}