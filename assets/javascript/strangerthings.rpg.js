$(document).ready(function() {
    // Variables Declared//
    
    var characters = {
        "Steve Harrington": {
            name: "Steve Harrington",
            health: 120, 
            attack: 8,
            imageUrl: "assets/images/Steve.jpg",
            enemeyAttackBack: 15
        },
        "Billy Hargrove": {
            name: "Billy Hargrove",
            health: 100, 
            attack: 14,
            imageUrl: "assets/images/Billy.jpg",
            enemeyAttackBack: 5
        },
        "Eleven": {
            name: "Eleven",
            health: 150, 
            attack: 8,
            imageUrl: "assets/images/eleven.jpg",
            enemeyAttackBack: 5
        },
        "Mind Flayer": {
            name: "Mind Flayer",
            health: 180, 
            attack: 7,
            imageUrl: "assets/images/mindflayer.jpg",
            enemeyAttackBack: 25
        }
    };
    
    var currSelectedCharacter;
    var combatants = [];
    var currDefender;
    var turnCounter = 1;
    var killCount = 0;

    var renderOne = function(character, renderArea, charStatus) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
    
        if (charStatus === "enemy") {
            $(charDiv).addClass("enemy");
        }
        else if (charStatus === "defender") {

            currDefender = character;
            $(charDiv).addClass("target-enemy");
        
        }
    }

    var renderMessage = function(message) {

        var gameMessageSet = $("game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);

        if (message === "clearMessage") {
            gameMessageSet.text("")
        }

    
    }

    var renderCharacters = function(charObj, areaRender) {
        if (areaRender === "#characters-section") {
            $(areaRender).empty();
            for (var key in charObj) {
                if(charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender, "");
                }

            
            }
            
        }
    

        if (areaRender === "#selected-character") {
            renderOne(charObj, areaRender);
        }

        if (areaRender === "#available-to-attack-section") {

            for(var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender, "enemy");
            }

            $(document).on("click", ".enemy", function() {
                var name = ($(this).attr("data-name"));

                if ($("#defender").children().length === 0) {
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            
            });
       
        }

        // defender div 

        if (areaRender === "#defender") {
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++) {
                if(combatants[i].name ===charObj) {
                    renderOne(combatants[i], areaRender, "defender");
                
                }

            }
        }
        // re-render defender when attacked
        if (areaRender === "playerDamage") {
            $("#defender").empty();
            console.log("Defender Emptied");
            renderOne(charObj, "#defender", "defender");



        }
        // re-render player character 
        if (areaRender === "enemyDamage") {
            $("#selected-character").empty();
            renderOne(charObj, "#selected-character", "");
        }
        // remove defeated character
        if (areaRender ==="enemyDefeated") {
            $("#defender").empty();
            console.log("Defender Emptied");
            var gameStateMessage = "You have defeated " +charObj.name + " , choose another enemy.";
            renderMessage(gameStateMessage);
        }

    };

    var restartGame = function(inputEndGame) {

        var restart = $("<button>Restart</button").click(function() {
            location.reload();
        });

        var gameState = $("<div>").text(inputEndGame);

        $("body").append(gameState);
        $("body").appen(restart);
   
    }





    renderCharacters(characters, "#characters-section");

    $(document).on("click", ".character", function() {
    // Saves Click
    var name = $(this).attr("data-name");
    console.log(name);
  
    if (!currSelectedCharacter) {

        currSelectedCharacter = characters[name];

        for (var key in characters) {
            if (key !== name) {
                combatants.push(characters[key]);
            }
        }
    
        console.log(combatants);

        $("#characters-section").hide();

        renderCharacters(currSelectedCharacter, "#selected-character");
        renderCharacters(combatants, "#available-to-attack-section")

    }

 });

 $("#button").on("click", function() {
     console.log("THIS IS BEING CLICKED");
   if ($("#defender").children().length !== 0) {

    var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage."
    var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemeyAttackBack + " damage."
    renderMessage("clearMessage"); 
       
        currDefender.health -= (currSelectedCharacter.attack * turnCounter);

        if (currDefender.health > 0) {
        
        

            renderCharacters(currDefender, "playerDamage");

            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);
  
       
            currSelectedCharacter.health -= currSelectedCharacter.enemeyAttackBack;

            renderCharacters(currSelectedCharacter, "enemyDamage");

            if (currSelectedCharacter.health <= 0) {
                renderMessage("clearMessage");
                restartGame("You have been defeated GAME OVER");
                $("#attack-button").unbind("click");
            }
           
        }
        

    

        else{

            renderCharacters(currDefender, "enemyDefeated");

             killCount++; 

            if (killCount >= 3) {
                renderMessage("clearMessage");
                restartGame("You won!");
                

        }
   
   
       }
        turnCounter++;

    }

 });















window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Button animation//
Math.randMinMax = function(min, max, round) {
    var val = min + (Math.random() * (max - min));
    
    if( round ) val = Math.round( val );
    
    return val;
};
Math.TO_RAD = Math.PI/180;
Math.getAngle = function( x1, y1, x2, y2 ) {
    
    var dx = x1 - x2,
        dy = y1 - y2;
    
    return Math.atan2(dy,dx);
};
Math.getDistance = function( x1, y1, x2, y2 ) {
    
    var     xs = x2 - x1,
        ys = y2 - y1;       
    
    xs *= xs;
    ys *= ys;
     
    return Math.sqrt( xs + ys );
};

var     FX = {};

(function() {
    
    var canvas = document.getElementById('myCanvas'),
        ctx = canvas.getContext('2d'),
        lastUpdate = new Date(),
        mouseUpdate = new Date(),
        lastMouse = [],
        width, height;

    FX.particles = [];

    setFullscreen();
    document.getElementById('button').addEventListener('mousedown', buttonEffect);

    function buttonEffect() {

        var button = document.getElementById('button'),
            height = button.offsetHeight,
            left = button.offsetLeft,
            top = button.offsetTop,
            width = button.offsetWidth,
            x, y, degree;

        for(var i=0;i<40;i=i+1) {

            if( Math.random() < 0.5 ) {

                y = Math.randMinMax(top, top+height);

                if( Math.random() < 0.5 ) {
                    x = left;
                    degree = Math.randMinMax(-45,45);
                } else {
                    x = left + width;
                    degree = Math.randMinMax(135,225);
                }
      
            } else {

                x = Math.randMinMax(left, left+width);

                if( Math.random() < 0.5 ) {
                    y = top;
                    degree = Math.randMinMax(45,135);
                } else {
                    y = top + height;
                    degree = Math.randMinMax(-135, -45);
                }
                
            }
            createParticle({
                x: x,
                y: y,
                degree: degree,
                speed: Math.randMinMax(100, 150),
                vs: Math.randMinMax(-4,-1)
            });
        }
    }
    window.setTimeout(buttonEffect, 100); 

    loop();

    window.addEventListener('resize', setFullscreen );

    function createParticle( args ) {

        var options = {
            x: width/2,
            y: height/2,
            color: 'hsla('+ Math.randMinMax(160, 290) +', 100%, 50%, '+(Math.random().toFixed(2))+')',
            degree: Math.randMinMax(0, 360),
            speed: Math.randMinMax(300, 350),
            vd: Math.randMinMax(-90,90),
            vs: Math.randMinMax(-8,-5)
        };

        for (key in args) {
          options[key] = args[key];
        }

        FX.particles.push( options );
    }

    function loop() {

        var     thisUpdate = new Date(),
            delta = (lastUpdate - thisUpdate) / 1000,
            amount = FX.particles.length,
            size = 2,
            i = 0,
            p;

        ctx.fillStyle = 'rgba(15,15,15,0.25)';
        ctx.fillRect(0,0,width,height);

        ctx.globalCompositeStyle = 'lighter';

        for(;i<amount;i=i+1) {

            p = FX.particles[ i ];

            p.degree += (p.vd * delta);
            p.speed += (p.vs);// * delta);
            if( p.speed < 0 ) continue;

            p.x += Math.cos(p.degree * Math.TO_RAD) * (p.speed * delta);
            p.y += Math.sin(p.degree * Math.TO_RAD) * (p.speed * delta);

            ctx.save();
        
            ctx.translate( p.x, p.y );
            ctx.rotate( p.degree * Math.TO_RAD );

            ctx.fillStyle = p.color;
            ctx.fillRect( -size, -size, size*2, size*2 );

            ctx.restore();
        }

        lastUpdate = thisUpdate;

        requestAnimFrame( loop );
    }

    function setFullscreen() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    
    }

});
})