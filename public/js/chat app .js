const inputObj=document.getElementById('input-send')
const token=localStorage.getItem('token')
const sendMsg=document.getElementById('send-msg')
let totalMsg=null;
const box11=document.getElementById('box11')
let activeGroup=null;
let setIntId=null;
const inviteBtn=document.getElementById('invite-btn')
const addUserBtn = document.getElementById('add-user-btn');
const usersList = document.getElementById('users-list');
const usersBox = document.getElementById('users-box');

const socket = io('http://localhost:4000');
socket.on('connect',()=>{
    console.log(socket.id);
});

socket.on('chat-message', data => {
    getAllMsg(data);
});


inputObj.addEventListener('submit',(e)=>{
    e.preventDefault();
    let sendObj={message:sendMsg.value}
    axios.post(`http://localhost:4000/user/message?gId=${activeGroup}`,sendObj, { headers: {'Authorization': token}} )
    .then((response)=>{
        socket.emit('send-chat-message', activeGroup);
        addNewLineElement(response.data.mesg,response.data.Name,response.data.mesg.userId)
        })
    .catch((err) => {
        console.log(err);
    });
})


const msgUl=document.getElementById('messages-list');

function addNewLineElement(data,Name){
    const li=document.createElement('h4');
    li.appendChild(
        document.createTextNode(Name + ' : ' + data.message +' ')
    )
    msgUl.appendChild(li)
}

async function getAllMsg(){
try {
    
    const allM=await axios.get(`http://localhost:4000/user/message?lastId=${totalMsg}&gId=${activeGroup}`, { headers: {'Authorization': token}} );
    const arr = allM.data.mesg;
    if(arr.length>0){
        totalMsg = totalMsg + arr.length;
        arr.forEach(element=>{
            addNewLineElement(element,element.user.Name,element.userId);
        })
    }
} catch (error) {
    console.log(error)
}
}

window.addEventListener('DOMContentLoaded', async()=>{
    try{
        const allG = await axios.get('http://localhost:4000/user/message/allgroup', { headers: {'Authorization': token}} );
        const arrG = allG.data.allGroup;
        const allGDiv = document.getElementById('all-groups');
        arrG.forEach(ele=>{
            const li = document.createElement('input');
            li.type = 'button';
            li.value = `${ele.group.gName}`;
            li.addEventListener('click',async()=>{
                inviteBtn.setAttribute('hidden','hidden');
                addUserBtn.setAttribute('hidden','hidden');
                activeGroup = ele.groupId;
                box11.removeAttribute('hidden');
                usersBox.removeAttribute('hidden');
                if(ele.isAdmin){
                    inviteBtn.removeAttribute('hidden');
                    addUserBtn.removeAttribute('hidden');
                }
                
                inviteBtn.removeAttribute('hidden');
                msgUl.innerHTML='';
               //clearInterval(setIntId);
                const allM = await axios.get(`http://localhost:4000/user/message?gId=${ activeGroup}`, { headers: {'Authorization': token}} );
                const arr = allM.data.mesg;
                totalMsg = arr.length;
                arr.forEach(element => {
                    addNewLineElement(element, element.user.Name,);
                });
                const allU = await axios.get(`http://localhost:4000/user/message/allUsers?gId=${activeGroup}`, { headers: {'Authorization': token}});
                const arr2 = allU.data.allUsers;
                usersList.innerHTML='';
                arr2.forEach(elem=>{
                     addNewUserElement(elem,allU.data.reqUserAdmin.isAdmin,ele.userId);
                })
                //setIntId = setInterval(getAllMsg, 1000);
            })
            allGDiv.appendChild(li);
        })
    
    }catch(err){
        console.log(err);
    }
});

const groupBtn=document.getElementById('create-group-btn')
const groupFormDiv=document.getElementById("create-Group-Div")
const groupForm=document.getElementById("create-Group-Form")

groupBtn.onclick=function(){
groupFormDiv.removeAttribute('hidden')
}
groupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const gName = document.getElementById('new-Group-Name');
    let gNameObj={gName:gName.value}
    axios.post('http://localhost:4000/user/message/creategroup', gNameObj, { headers: {'Authorization': token}})
    .then((response) => {
        console.log(response);
        window.location.reload();
    }).catch((err) => {
        console.log(err);
    });
});

inviteBtn.addEventListener('click',async()=>{
    const inputLink=document.getElementById('invite-link')
    inputLink.removeAttribute("hidden")
    const inviteLink=await axios.get(`http://localhost:4000/user/message/getInvite?gId=${activeGroup}`, { headers: {'Authorization': token}});
const secretToken=inviteLink.data.secretToken;
inputLink.value=`${secretToken}`
})
const joinGroupBtn = document.getElementById('join-group-btn');
joinGroupBtn.addEventListener('click',()=>{
    const joinGroupDiv = document.getElementById('join-group-div');
    joinGroupDiv.removeAttribute('hidden');
});
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const joinGroupFrom = document.getElementById('join-group-form');
joinGroupFrom.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const tokenInput = document.getElementById('join-group-input');
    const decodeToken = parseJwt(tokenInput.value);
    const id = +decodeToken.id;
    console.log('joinGroupForm',id);
    const joinRes = await axios.get(`http://localhost:4000/user/message/joinGroup?gId=${id}`, { headers: {'Authorization': token}});
    if(joinRes.status==200) window.location.reload();
});

addUserBtn.addEventListener('click', ()=>{
    document.getElementById('add-user-div').removeAttribute('hidden');
});
const addUserForm = document.getElementById('add-user-form');
addUserForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const addUserBy = document.getElementById('add-user-by').value;
    const addUserValue = document.getElementById('add-user-value').value;
    const addUserRes = await axios.get(`http://localhost:4000/user/message/addUser?by=${addUserBy}&value=${addUserValue}&gId=${activeGroup}`, { headers: {'Authorization': token}});
    console.log(addUserRes.data.groupmem);
});

function addNewUserElement(ele,isAd,UId){
    const li = document.createElement('h4');
    li.appendChild(document.createTextNode(ele.user.Name));
    if(isAd){
        console.log(ele);

        if(UId !== ele.userId){
            const remBtn = document.createElement('button');
            remBtn.innerHTML = 'X';
            remBtn.title = 'Remove User';
            remBtn.addEventListener('click', async () => {
                console.log('remBtn>>',ele.userId);
                const removed = await axios.get(`http://localhost:4000/user/message/removeU?id=${ele.userId}&gId=${activeGroup}`);
                window.location.reload();
            })
            li.appendChild(remBtn);
        }
        if(ele.isAdmin){
            const alreadyAdmin = document.createElement('h6').appendChild(document.createTextNode(' --Admin'));
            li.appendChild(alreadyAdmin);
        } else {
            const makeAdmin = document.createElement('button');
            makeAdmin.innerHTML = 'Make Admin';
            makeAdmin.addEventListener('click', async ()=>{
                console.log('makeAdmin',ele.userId);
                const admined = await axios.get(`http://localhost:4000/user/message/makeA?id=${ele.userId}&gId=${activeGroup}`);
                window.location.reload();
            })
            li.appendChild(makeAdmin);
        }
    }
    usersList.appendChild(li);
}