// ==UserScript==
// @name     J-Archive Reader
// @version  1
// @grant    none
// @include  https://www.j-archive.com/showgame.php?game_id=*
// ==/UserScript==


//notes: be sure to enable audio for the page in the browser (top left of address bar, under page permissions)
//game can be paused by pressing "p" on the keyboard

//todo: make pictures work for final jeopardy
var stylin = document.createElement("style");
var heightW = window.innerHeight;
var winMult = heightW/920;
var boxHeight = 700*winMult;
var fontScaled = 600*winMult;
var textScaled = 860*winMult;
var titleHeight = 200*winMult;
var imgScaled = 640*winMult;
//console.log(winMult);
stylin.innerHTML = "  td.clue2{\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  width: 900px;\n  height: " + boxHeight + "px;\n  background: #0000AF;\n  border: 3px solid #73AD21;\n  font-size:" + fontScaled + "%\n  }\n  td.clue2 table tbody tr td{\n  width: " + textScaled + "px;\n  }\n  td.category_name2{\n  position: fixed;\n  bottom: " + boxHeight + "px;\n  right: 0;\n  width: 900px;\n  height: " + titleHeight + "px;\n  background: #0000AF;\n  border: 3px solid #73AD21;\n  font-size:" + fontScaled + "%\n  }\n	div.pause_note{\n  position: fixed;\n  left: 0;\n  top: 0;\n  color: yellow;\n  font-size: 300%\n  }\n"
var music = document.createElement("div");
music.innerHTML = "<audio controls=\"\" src=\"https://ia800302.us.archive.org/3/items/JeopardyTheme/Jeopardy.mp3\">            Your browser does not support the            <code>audio</code> element.    </audio>"
var dome = document.getElementsByTagName("head")[0];
dome.appendChild(stylin);
var bod = document.getElementsByTagName("body")[0];
var pauseNotice = document.createElement("div");
pauseNotice.innerHTML = "<h1>PAUSED</h1>"
pauseNotice.className = "pause_note"
pauseNotice.setAttribute("hidden", "true")
document.getElementById("content").append(pauseNotice);
var categories = document.getElementsByClassName("category_name")
var comments = document.getElementsByClassName("category_comments")
var clues = document.getElementsByClassName("clue")
var voices = window.speechSynthesis.getVoices();
//change speaker value to voices[0] for male voice, voices[1] for female voice
var speaker = voices[1];
var msg = new SpeechSynthesisUtterance('Pick a clue to start the game.');
msg.voice = speaker;
window.speechSynthesis.speak(msg);
var i = 0;
var clue2 = clues[0];
var cat2 = categories[0];
var cluehoo = document.getElementById('clue_J_1_1');
var reID = /toggle\('(.*?)',/;
var reHTML = /stuck', '(.*)'/;
var reBack = /\\/g;
var correct = ''
var clueID
var clueHTML
var cloohoo
var question
var toggler
var v
var longOne = false;
var isPause = false;
var doubleJ = "";
var isPic;

function answerRead(){
  if (isPause){
    setTimeout(answerRead, 3000);
  }
  else{
  	try{
  		if (i < 61){
  			toggler = clue2.getElementsByTagName("div")[0].getAttribute("onmouseover");
  		}
  		else{
    		toggler = document.getElementsByClassName("final_round")[0].getElementsByTagName("div")[0].getAttribute("onmouseover");
  		}
  		try{
  			clueID = reID.exec(toggler);
        rawHTML = reHTML.exec(toggler);
        clueHTML = rawHTML[1].replaceAll(reBack, "");
    		cloohoo = document.getElementById(clueID[1]);
        cloohoo.innerHTML = clueHTML;
  		}catch(e){
    		console.log(e);
  		};
  		if (i < 61){
  			correct = clue2.getElementsByClassName('correct_response')[0].innerText;
  		}
  		else{
    		correct = document.getElementsByClassName("clue2")[0].getElementsByTagName("em")[0].innerText;
    		cloohoo.innerHTML = document.getElementsByClassName("clue2")[0].getElementsByTagName("em")[0].innerHTML;
  		}
      textHeight = clue2.getElementsByClassName("clue_text")[0].clientHeight;
      if (textHeight > boxHeight*0.9){
        clue2.style.fontSize = boxHeight/textHeight*0.9*fontScaled + "%"  
        longOne = true;
      }
  		msg = new SpeechSynthesisUtterance("what is " + correct);
  		msg.voice = speaker;
  		if (i < 61){
  			msg.addEventListener('end', function () {
     			setTimeout(clueRead, 2000);
				})
  		}
  		window.speechSynthesis.speak(msg);
  	}catch(e){clueRead()}
  }
}

function musicPlay(){
  bod.appendChild(music);
  music.getElementsByTagName("audio")[0].play();
  setTimeout(answerRead, 35000); 
  
}

function clueRead(){
  if (isPause){
    setTimeout(clueRead, 3000);
  }
  else{
    if (longOne == true){
      clue2.style.fontSize = "100%"
      longOne = false;
    }
    if (isPic){
      clue2.removeChild(imgElement);
      isPic = false;
    }
  	var c = 0;
    
  	c = (i%5*6)+Math.floor(i/5)
  	clue2.className = "clue"
  
  	if (i > 29){
    	c += 24;
  	}
    if (i > 59){
      c = 60
    }
  	clue2 = clues[c]
    
  	if (i%5 == 0){
    	cat2.className = "category_name"
      if (i == 30){
        doubleJ = "Double jeopardy. "
      }
      else if (i == 60){
        doubleJ = "Final jeopardy. "
      }
      else{
        doubleJ = ""
      }
  		msg = new SpeechSynthesisUtterance(doubleJ + categories[i/5].textContent + comments[i/5].textContent);
      msg.voice = speaker;
    	window.speechSynthesis.speak(msg);
    	cat2 = categories[i/5]
    	cat2.className = "category_name2"
  	}
    try{
  		question = clue2.getElementsByClassName('clue_text')[0].innerText;
  		msg = new SpeechSynthesisUtterance(question);
      msg.voice = speaker;
      if (i == 60){
        msg.addEventListener('end', function () {
     			musicPlay();
				})
      }
      else{
  			msg.addEventListener('end', function () {
     			setTimeout(answerRead, 4000);
				})
      }
      links = clue2.getElementsByTagName('a');
      if (links.length > 1){
        ref = links[1].getAttribute("href");
        imgElement = document.createElement("img");
        imgElement.setAttribute("src", ref);
        imgElement.setAttribute("style", "position: fixed; left: 0; bottom: 0; width: " + imgScaled + "px");
        clue2.appendChild(imgElement);
        isPic = true;
      }
  		clue2.className = "clue2"
      textHeight = clue2.getElementsByClassName("clue_text")[0].clientHeight;
      if (textHeight > boxHeight*0.9){
        clue2.style.fontSize = boxHeight/textHeight*0.9*fontScaled + "%"
        longOne = true;
      }
  		window.speechSynthesis.speak(msg);
  		i += 1;
    }catch(e){
      clue2.className = "clue2";
      i +=1;
      clueRead();
    }
  }
}

function clueLabel(){
  for (let n = 0; n < clues.length; n++){
    try{
      clues[n].getElementsByClassName("clue_text")[0].setAttribute("number", n);
    }catch(e){console.log(e)}
    
  }
  
}

function respondo(aEvent){
  v = parseInt(aEvent.target.getAttribute("number"));
  i = Math.floor(v/6)+v%6*5
 	if (v > 29){
    i += 25
  }
  if (v==60){
    i = 60;
  }
  document.removeEventListener("click", respondo);
  clueRead();
}

function pause(aEvent){
  if (aEvent.keyCode == 80){
    if(isPause){
      isPause = false;
      pauseNotice.setAttribute("hidden", "true")
    }
    else{
      isPause = true;
      pauseNotice.removeAttribute("hidden")
    }
  }
}

function clueAbscond(){
  document.addEventListener("click", respondo);
  document.addEventListener("keydown", pause);
}

clueLabel();
clueAbscond();
