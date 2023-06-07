var noOfTiles = 3;
var timer = 30;
var timerText = document.getElementById('timer');
var colorArr = ['rgb(212, 32, 68)','rgb(156, 55, 211)','rgb(55, 159, 211)','rgb(55, 211, 130)','rgb(128, 211, 55)'];
var undo = [];
var redo = [];
var noOfMoves = 0;
var started = false;
var moves = document.getElementById("moves");
var undo_btn = document.getElementById("undo");
var redo_btn = document.getElementById("redo");

var inc_btn = document.getElementById('inc-plt');
var dec_btn = document.getElementById('dec-plt');
dec_btn.disabled = true;


var timerFunc = setInterval(countDown, 1000);

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var node = document.getElementById(data);
  if (node.parentElement.lastChild == node && (ev.target.childNodes.length==0 || node.id.localeCompare(ev.target.lastChild.id)<0))
  {
    if(ev.target.className == 'pole')
    saveState(ev);
    ev.target.appendChild(document.getElementById(data));
      noOfMoves++;
      moves.innerHTML = "Moves = "+noOfMoves;
      started=true;
      if (document.getElementById("pole-3").childNodes.length == noOfTiles) {
        setTimeout(win,100);
      }
  }
}

function saveState(ev)
{
  var id = ev.dataTransfer.getData("text");
  var node = document.getElementById(id);
  undo.push({parent: node.parentElement,target: ev.target,tile:node});
  undo_btn.disabled = false;
}

function undo_mtd()
{
  if (undo.length > 0) {
    var state = undo.pop();
    redo.push({parent:state.target,target:state.parent,tile:state.tile});
    state['parent'].appendChild(state['tile']);
    noOfMoves--;
    if(undo.length == 0)
    {
      undo_btn.disabled = true;
    }
    redo_btn.disabled = false;
    moves.innerHTML = "Moves = "+noOfMoves;
  }
}

function redo_mtd()
{
  if (redo.length > 0) {
    var state = redo.pop();
    undo.push({parent:state.target,target:state.parent,tile:state.tile});
    state['parent'].appendChild(state['tile']);
    noOfMoves++;
    if(redo.length == 0)
    {
      redo_btn.disabled = true;
    }
    undo_btn.disabled = false;
    moves.innerHTML = "Moves = "+noOfMoves;
  }
}

function win()
{
  if(!alert('You Won!'))
  {
    noOfTiles=3;
    reset();
  }
}

function increasePlates()
{
  if (noOfTiles>=3 && dec_btn.disabled == true)
  {
    dec_btn.disabled = false;
  }
  noOfTiles++;
  reset();
  if (noOfTiles>=8)
  {
    inc_btn.disabled = true;
  }
}

function decreasePlates()
{
  if (noOfTiles<=8 && inc_btn.disabled == true)
  {
    inc_btn.disabled = false;
  }
  noOfTiles--;
  reset();
  if (noOfTiles<=3)
  {
    dec_btn.disabled = true;
  }
}

function createPlates()
{
  var pole = document.getElementById("pole-1");
  for (let i = 0; i < noOfTiles; i++) {
    var tile = document.createElement('div');
    tile.id="tile"+(i+1);
    tile.draggable='true';
    tile.className='tile';
    tile.addEventListener("dragstart", function(ev){drag(ev);});
    tile.style.backgroundColor = colorArr[i%colorArr.length];
    tile.style.width = (100 + i*30) +'px';
    pole.prepend(tile);
  }
}

function reset()
{
  for (let i = 1; i <= 3; i++) {
    var pole = document.getElementById('pole-'+i);
    while (pole.firstChild) {
      pole.removeChild(pole.firstChild)
    }
  }
  started=false;
  timer = noOfTiles*10;
  
  undo.length = 0;
  undo_btn.disabled = true;

  redo.length = 0;
  redo_btn.disabled = true;
  noOfMoves=0;
    moves.innerText = "Moves = "+noOfMoves;
    createPlates();
}

function lose()
{
  alert("You Lost! Didn't Complete in Time");
  reset();
  timerFunc = setInterval(countDown, 1000);
}

function countDown()
{
  if(timer == 0)
  {
    clearTimeout(timerFunc);
    setTimeout(lose,100);
  }
  timerText.innerHTML = "Time Left = " + timer;
  if (started) {
    timer--;
  }
}

window.onload = reset();