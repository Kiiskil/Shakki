//https://html5.litten.com/how-to-drag-and-drop-on-an-html5-canvas/

//CHESS written with JavaScript
//v. 1.00
//Iiro Laukkanen
//1/2019

var canvas=document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var greened = false;

var next_class=null;
var next_color=null;
//chessboards dimensions
var chsCOLS=8;
var chsROWS=8;
var xsize=75;
var ysize=75;

var green_info_x = null;
var green_info_y = null;

var hits=[];
//var hits_c=0;

var board = [];

//x_plus[0]=1, x_minus:1, y_plus:2,y_minus:0

//piece attributes
var pieces=[];
pieces[1]={sign:"S", color:0,class:1,src:"/iirola/chess/kuvia/sotilas_m.png", x:null, y:null}
pieces[2]={sign:"S", color:1,class:1,src:"/iirola/chess/kuvia/sotilas_v.png", x:null, y:null}
pieces[3]={sign:"R", color:0,class:2,src:"/iirola/chess/kuvia/ratsu_m.png", x:null, y:null}
pieces[4]={sign:"R", color:1,class:2,src:"/iirola/chess/kuvia/ratsu_v.png", x:null, y:null}
pieces[5]={sign:"L", color:0,class:3,src:"/iirola/chess/kuvia/lahetti_m.png", x:null, y:null}
pieces[6]={sign:"L", color:1,class:3,src:"/iirola/chess/kuvia/lahetti_v.png", x:null, y:null}
pieces[7]={sign:"T", color:0,class:4,src:"/iirola/chess/kuvia/torini_m.png", x:null, y:null}
pieces[8]={sign:"T", color:1,class:4,src:"/iirola/chess/kuvia/torini_v.png", x:null, y:null}
pieces[9]={sign:"K", color:0,class:5,src:"/iirola/chess/kuvia/kuningas_m.png", x:null, y:null}
pieces[10]={sign:"K", color:1,class:5,src:"/iirola/chess/kuvia/kuningas_v.png", x:null, y:null}
pieces[11]={sign:"Q", color:0,class:6,src:"/iirola/chess/kuvia/kuningatar_m.png", x:null, y:null}
pieces[12]={sign:"Q", color:1,class:6,src:"/iirola/chess/kuvia/kuningatar_v.png", x:null, y:null}



function drawPiece() {
    //loop through each tile and through each piece, and compare class and color of location and piece
    for(var c=0; c<chsCOLS; c++) {
        for(var r=0; r<chsROWS; r++) {
            pieces.forEach(function(piece){    
                if(board[c][r].class==piece.class && board[c][r].color==piece.color){
                    // ctx.font = "20px Arial";
                    // ctx.fillStyle = "#0095DD";
                    // ctx.fillText(piece.sign, board[c][r].x, board[c][r].y+ysize);
                    pieceSprite(board[c][r].x, board[c][r].y, piece.src);
                    pieceInfo(piece,c,r);
                    var ax = Math.floor(board[c][r].x/xsize);
                    var ay = Math.floor(board[c][r].y/ysize);
                    //moves_active(0, ax, ay , piece);
                };
            });
        }
    }
    console.log("HITS "+hits);
    hits_c=0;
}

function pieceInfo(piece,c,r){
    //turns piece's x- and y-values to tile rather than pixelcount
            piece.x = Math.floor((board[c][r].x -100)/xsize);
            piece.y = Math.floor((board[c][r].y -8)/ysize)-1;
}

function pieceSprite(x,y,src){
    //draw pieces on canvas (location and image src)
    var imageObj = new Image();
                    imageObj.addEventListener('load',function(){
                    ctx.drawImage(imageObj, x ,y, 70,70);
                    }, false);
                    imageObj.src = src;
}

//when mouse is clicked, function myDown is triggered and it gets and evenet "e" as param
//the whole function is divided into if-statements of wherether there are or are not a greened tile 
function myDown(e){
    
   //turns the click's location values to boardlocations rather than pixelcount
    var locatX = Math.floor((e.pageX - 100)/xsize);
    var locatY = Math.floor((e.pageY - -8)/ysize);
    
    console.log("lokaatio "+locatX, locatY);
    if(greened==false){
        //color the clicked area green
        green_info_x = locatX;
        green_info_y = locatY;
        ctx.beginPath();
                            ctx.rect((locatX*xsize), (locatY*ysize), xsize, ysize);
                            if(board[locatX][locatY].b_color=="gray"){ctx.fillStyle = "#228B22";console.log("B_COLOR: "+board[locatX][locatY].b_color);}
                            if(board[locatX][locatY].b_color=="white"){ctx.fillStyle = "#32CD32";console.log("B_COLOR: "+board[locatX][locatY].b_color);}
                            /* var boardX = (locatY*xsize);
                            var boardY = (locatX*ysize);
                            board[locatY][locatX].x = boardX;
                            board[locatY][locatX].y = boardY; */
                            ctx.fill();
        ctx.closePath();

        
        //draw piece again on green area. Piecesprite draws image on previously greened tile
        pieces.forEach(function(piece){
            if(board[locatX][locatY].class==piece.class && board[locatX][locatY].color==piece.color){
                pieceSprite(board[locatX][locatY].x,board[locatX][locatY].y,piece.src);
                //pieceInfo(piece,locatX,locatY);
                
                console.log("JAAAAAAAAAAA  " + piece.x);
                next_class=board[locatX][locatY].class;
                next_color=board[locatX][locatY].color;
                console.log("HUURRAAA "+piece.y);
                
                //pieces moves. takes greened area and info of piece on it as params
                moves_active(1,locatX,locatY,piece);
                
                //drawPiece();
                //nullifies the greened tiles piece-params
                board[locatX][locatY].class = null;
                board[locatX][locatY].color = null;
                //green_info.class=
                //console.log("LUOKKA: "+piece.color)
            };
        });
        
        //greens the area aorund greened tile based on piece's moves
        checkGreen();

        //just info to different dunctions
        greened = true;
        //drawPiece();
        console.log("next_class " +next_class)   
    }
    else if(greened==true){
        //if one tile is selected, this happens
        //draws board, aka deletes old sprites
        drawBoard();
        //drawPiece();
            if(next_class!=null && board[locatX][locatY].badge==1){
                //draw piece in new loca
                board[locatX][locatY].class=next_class;
                board[locatX][locatY].color=next_color;
            }
            else{
                //do nothing
                board[green_info_x][green_info_y].class=next_class;
                board[green_info_x][green_info_y].color=next_color;
                
            }
        drawPiece();      
        next_class = null;
        next_color = null;
        greened = false;
        greencountX = null;
        badging_nullify();
        
    }
  console.log("greened "+greened);
}

function badging_nullify(){
     //nullify the lightgreens aka moveset
     for(var c=0; c<chsCOLS; c++) {
        for(var r=0; r<chsROWS; r++) {
            board[c][r].badge=0;
        }
    };
}

//check possible moves of pieces and badge them
//takes greened tile's location and info of the piece on the tile as params
//ye olde switch case; whole lot of if-statements and checks.
//Code checks each available tile to go to (defined by class) individually and badges them, if there is no obstacle
//Badging = value on the tile. If tile is badged, it gets greened and piece can move to it
function moves_active(badging,locatX,locatY,piece){
    hits.forEach(function(hit){
    hit=0;
    })  
    switch(piece.sign){
        case "S":
        //what color piece
            if(piece.color==1){
                //if you are on the first row (pawns), you get to move up to tiles
                if(locatY==6){
                    //change the tile
                    var a = locatX;
                    var b = locatY-1;
                    //piece-check
                    if(board[a][b].color==null){
                         //badge-value is boolean. 1 for green, 0 for regular color.
                        board[a][b].badge=1;
                        //change tile
                        b = locatY-2;
                        //piece-check and badging
                        if(board[a][b].color==null)board[a][b].badge=1;
                    }
                }
                //change the tile (one up of black pawn)
                var a = locatX;
                var b = locatY-1;
                //edgecheck
                if(b>=0){
                    //piece-check
                        //badge-value is boolean. 1 for green, 0 for regular color
                    if(board[a][b].color==null){
                        board[a][b].badge=1;
                    }
                    
                    //if(b<0)break;
                    //if piece is black, you cant go to it, so no badging
                    if(board[a][b].color==0){
                        board[a][b].badge=0;
                    }
                
                    //if(board[a][b].color==null)
                    //change tiles
                    a = locatX-1;
                    b = locatY-1;
                    //edgecheck, colorcheck for blacks
                    if(a>=0&&board[a][b].color==0)
                    {
                        //another color-check and badging
                        if(board[a][b].color!=piece.color){
                            board[a][b].badge=1;
                            hits[hits_c]=board[a][b];
                            hits_c++;
                        }
                    }
                
                    //change the tile
                    a = locatX+1;
                    b = locatY-1;
                    //check tile and badge it
                    if(a<8&&board[a][b].color==0)
                    {
                        if(board[a][b].color!=piece.color){
                            board[a][b].badge=1;
                            hits[hits_c]=board[a][b];
                            hits_c++;
                        } 
                    }
                }
            }
            //same set, but for black pieces
            if(piece.color==0){
                if(locatY==1){
                    var a = locatX;
                    var b = locatY+1;
                    if(board[a][b].color==null){
                    board[a][b].badge=1;
                    b = locatY+2;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    }
                }
                var a = locatX;
                var b = locatY+1;
                if(b<8)
                {if(board[a][b].color!=piece.color)board[a][b].badge=1;}
                else
                if(b>7)break;
            
                if(board[a][b].color==1){
                    if(board[a][b].color!=piece.color)board[a][b].badge=0;
                }
                a = locatX-1;
                b = locatY+1;
                if(a>=0&&board[a][b].color==1)
                {
                    if(board[a][b].color!=piece.color){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                    }
                }
                a = locatX+1;
                b = locatY+1;
                if(a<8&&board[a][b].color==1)
                {
                    if(board[a][b].color!=piece.color){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                    }
                }
            }
            if(badging==1){
                break;
            }
            else if(badging==0){
                //badging_nullify();
                break;
            };
        case "R":
        //same kind of set for horses, but for horse's moves. two up, one right AND two up, one left AND....
        //change tile //edge-, piece- and color-checks //badging //
            //if(typeof board[piece.x+1][piece.y+2] !== "undefined"){board[piece.x+1][piece.y+2].badge=1;}
            if(locatX+1 <8 && locatY+2 <8){
                var a = locatX+1;
                var b = locatY+2;
                if(board[a][b].color==null){
                    board[a][b].badge=1;
                }
                else if(board[a][b].color!=piece.color){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                };
            }
            if(locatX+1 <8 && locatY-2 <8 && locatY-2>=0){
                var a = locatX+1;
                var b = locatY-2;
                if(board[a][b].color==null){
                    board[a][b].badge=1;
                }
                else if(board[a][b].color!=piece.color){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                };
            }
            if(locatX+2 <8 && locatY+1 <8){
                var a = locatX+2;
                var b = locatY+1;
                if(board[a][b].color==null)
                {board[a][b].badge=1;
                }
                else if(board[a][b].color!=piece.color){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                };
            }
            if(locatX+2 <8 && locatY-1 <8 && locatY-1>=0){
                var a = locatX+2;
                var b = locatY-1;
                if(board[a][b].color==null){
                    board[a][b].badge=1;
                }
                else if(board[a][b].color!=piece.color){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                };
            }
            if(locatX-1 <8 && locatY+2 <8 && locatX-1>=0 ){
                var a = locatX-1;
                var b = locatY+2;
                if(board[a][b].color==null){
                    board[a][b].badge=1;
                }
                else if(board[a][b].color!=piece.color){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                };
            }
            if(locatX-1 <8 && locatY-2 <8 && locatX-1>=0 && locatY-2>=0){
                var a = locatX-1;
                var b = locatY-2;
                if(board[a][b].color==null){
                    board[a][b].badge=1;
                }
                else if(board[a][b].color!=piece.color){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                };
            }
            if(locatX-2 <8 && locatY+1 <8 && locatX-2>=0){
                var a = locatX-2;
                var b = locatY+1;
                if(board[a][b].color==null){
                board[a][b].badge=1;
                }
                else if(board[a][b].color!=piece.color){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                };
            }
            if(locatX-2 <8 && locatY-1 <8 && locatX-2>=0 && locatY-1>=0){
                var a = locatX-2;
                var b = locatY-1;
                if(board[a][b].color==null){
                    board[a][b].badge=1;
                }
                else if(board[a][b].color!=piece.color){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                };
            }
            if(badging==1){
                break;
            }
            else if(badging==0){
                //badging_nullify();
                break;
            };
        case "L":
        //pieces BIshop, Tower, King and Queen are generated with loop, so the variables below are booleans for stopping the loop
        //stop-variables get flagged if checks finds edges, pieces or no badge
        //in loop, if-statements for each direction
            var f=0;
            var g=0;
            var h=0;
            var j=0;
            for(i=1;i<8;i++){  
                if(locatX+i<8&&locatY+i<8&&f==0){
                    var a = locatX+i;
                    var b = locatY+i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        f=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)f=1;
                }
                if(locatX-i>=0&&locatY-i>=0&&g==0){
                    var a = locatX-i;
                    var b = locatY-i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        g=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)g=1;
                }
                if(locatX+i<8&&locatY-i>=0&&h==0){
                    var a = locatX+i;
                    var b = locatY-i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        h=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)h=1;
                }
                if(locatX-i>=0&&locatY+i<8&&j==0){
                    var a = locatX-i;
                    var b = locatY+i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        j=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)j=1;
                }

            }
            if(badging==1){
                break;
            }
            else if(badging==0){
                //badging_nullify();
                break;
            };
        case "T":
            var f=0;
            var g=0;
            var h=0;
            var j=0;
            for(i=1;i<8;i++){
                if(locatX+i<8 && f==0){
                    var a = locatX+i;
                    var b = locatY;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        f=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)f=1;
                }
                if(locatX-i>=0 && g==0){
                    var a = locatX-i;
                    var b = locatY;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        g=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)g=1;
                }
                if(locatY+i<8 && h==0){
                    var a = locatX;
                    var b = locatY+i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        h=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)h=1;
                }
                if(locatY-i>=0 && j==0){
                    var a = locatX;
                    var b = locatY-i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        j=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)j=1;
                }
            }
            if(badging==1){
                break;
            }
            else if(badging==0){
                //badging_nullify();
                break;
            };
        case "K":
        var q=0;
        var w=0;
        var e=0;
        var r=0;
        var t=0;
        var y=0;
        var u=0;
        var o=0;
        for(i=1;i<2;i++){
            if(locatX+i<8 && q==0){
                var a = locatX+i;
                var b = locatY;
                if(board[a][b].color==null)board[a][b].badge=1;
                if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                    q=1;
                }
                if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)q=1;
            }
            if(locatX-i>=0 && w==0){
                var a = locatX-i;
                var b = locatY;
                if(board[a][b].color==null)board[a][b].badge=1;
                if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                    w=1;
                }
                if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)w=1;
            }
            if(locatY+i<8 && e==0){
                var a = locatX;
                var b = locatY+i;
                if(board[a][b].color==null)board[a][b].badge=1;
                if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                    e=1;
                }
                if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)e=1;
            }
            if(locatY-i>=0 && r==0){
                var a = locatX;
                var b = locatY-i;
                if(board[a][b].color==null)board[a][b].badge=1;
                if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                    r=1;
                }
                if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)r=1;
            }
            if(locatX+i<8&&locatY+i<8 && t==0){
                var a = locatX+i;
                var b = locatY+i;
                if(board[a][b].color==null)board[a][b].badge=1;
                if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                    t=1;
                }
                if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)t=1;
            }
            if(locatX-i>=0&&locatY-i>=0 && y==0){
                var a = locatX-i;
                var b = locatY-i;
                if(board[a][b].color==null)board[a][b].badge=1;
                if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                    y=1;
                }
                if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)y=1;
            }
            if(locatX+i<8&&locatY-i>=0 && u==0){
                var a = locatX+i;
                var b = locatY-i;
                if(board[a][b].color==null)board[a][b].badge=1;
                if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                    u=1;
                }
                if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)u=1;
            }
            if(locatX-i>=0&&locatY+i<8 && o==0){
                var a = locatX-i;
                var b = locatY+i;
                if(board[a][b].color==null)board[a][b].badge=1;
                if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                    board[a][b].badge=1;
                    hits[hits_c]=board[a][b];
                    hits_c++;
                    o=1;
                }
                if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)o=1;
            }
        }
        if(badging==1){
            break;
        }
        else if(badging==0){
            //badging_nullify();
            break;
        };
        case "Q":
            var q=0;
            var w=0;
            var e=0;
            var r=0;
            var t=0;
            var y=0;
            var u=0;
            var o=0;
            for(i=1;i<8;i++){
                if(locatX+i<8 && q==0){
                    var a = locatX+i;
                    var b = locatY;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                    hits_c++;
                        q=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)q=1;
                }
                if(locatX-i>=0 && w==0){
                    var a = locatX-i;
                    var b = locatY;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        w=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)w=1;
                }
                if(locatY+i<8 && e==0){
                    var a = locatX;
                    var b = locatY+i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        e=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)e=1;
                }
                if(locatY-i>=0 && r==0){
                    var a = locatX;
                    var b = locatY-i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        r=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)r=1;
                }
                if(locatX+i<8&&locatY+i<8 && t==0){
                    var a = locatX+i;
                    var b = locatY+i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        t=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)t=1;
                }
                if(locatX-i>=0&&locatY-i>=0 && y==0){
                    var a = locatX-i;
                    var b = locatY-i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        y=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)y=1;
                }
                if(locatX+i<8&&locatY-i>=0 && u==0){
                    var a = locatX+i;
                    var b = locatY-i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        u=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)u=1;
                }
                if(locatX-i>=0&&locatY+i<8 && o==0){
                    var a = locatX-i;
                    var b = locatY+i;
                    if(board[a][b].color==null)board[a][b].badge=1;
                    if(board[a][b].color!=piece.color&&board[a][b].color!=null){
                        board[a][b].badge=1;
                        hits[hits_c]=board[a][b];
                        hits_c++;
                        o=1;
                    }
                    if(a<8 && b<8 && a>=0 && b >=0 && board[a][b].color==piece.color)o=1;
                }
            }
            if(badging==1){
                break;
            }
            else if(badging==0){
                //badging_nullify();
                break;
            };
    }
}
//greens the badged area
function checkGreen(){
    for(var c=0; c<chsCOLS; c++) {
        for(var r=0; r<chsROWS; r++) {
            if(board[c][r].badge == 1){
                ctx.beginPath();
                ctx.rect((Math.floor(board[c][r].x/xsize))*xsize, (Math.floor(board[c][r].y/ysize))*ysize, xsize, ysize);
                if(board[c][r].b_color=="white")ctx.fillStyle = "#98FB98";
                if(board[c][r].b_color=="gray")ctx.fillStyle = "#90EE90";
                ctx.fill();
                ctx.closePath();
            };
            
            /* pieces.forEach(function(piece){
                if(board[c][r].class==piece.class && board[c][r].color==piece.color){
                    pieceSprite(board[locatX][locatY].x,board[locatX][locatY].y,piece.src);
                }
            }) */
        }
    }
    drawPiece();   
}

function drawBoard(){
    //drawing the board, oscillating between black and white and giving each tile values
    for(i=0;i<chsCOLS;i++){
        for(j=0;j<chsROWS;j++){
           // board[i][j].badge=0;
                if(i%2==0){
                    if( j%2==0 ){
                        ctx.beginPath();
                        ctx.rect((j*xsize), (i*ysize), xsize, ysize);
                        ctx.fillStyle = "#e4f3fb";
                        var boardX = (i*xsize);
                        var boardY = (j*ysize);
                        board[i][j].x = boardX;
                        board[i][j].y = boardY;
                        board[i][j].b_color="white";
                        ctx.fill();
                        ctx.closePath();
                    }
                    else {
                        ctx.beginPath();
                        ctx.rect((j*xsize), (i*ysize), xsize, ysize);
                        ctx.fillStyle = "#7F7F7F";
                        var boardX = (i*xsize);
                        var boardY = (j*ysize);
                        board[i][j].x = boardX;
                        board[i][j].y = boardY;
                        board[i][j].b_color="gray";
                        ctx.fill();
                        ctx.closePath(); 
                    } 
                }
                else{
                    if( j%2==0 ){
                        ctx.beginPath();
                        ctx.rect((j*xsize), (i*ysize), xsize, ysize);
                        ctx.fillStyle = "#7F7F7F";
                        var boardX = (i*xsize);
                        var boardY = (j*ysize);
                        board[i][j].x = boardX;
                        board[i][j].y = boardY;
                        board[i][j].b_color="gray";
                        ctx.fill();9
                        ctx.closePath();
                    }
                    else {
                        ctx.beginPath();
                        ctx.rect((j*xsize), (i*ysize), xsize, ysize);
                        ctx.fillStyle = "#e4f3fb";
                        var boardX = (i*xsize);
                        var boardY = (j*ysize);
                        board[i][j].x = boardX;
                        board[i][j].y = boardY;
                        board[i][j].b_color="white";
                        ctx.fill();
                        ctx.closePath(); 
                    }
                }
        }
    }
}

function init(){
    //2-dimensional array that hold class (which piece), pieces color and coordinates (x for x-axis and y for y-axis), 
    //and if theres a badge and color of tile
    
    for(var c=0; c<chsCOLS; c++) {
        board[c] = [];
        for(var r=0; r<chsROWS; r++) {
        board[c][r] = {x:0,y:0, class: null, color:null, badge:0, b_color:null};
        }
    }
        //next is initializing the class and color of board
        //sotilaat 
        for(x in board){
            board[x][1].class=1;
            board[x][1].color=0;
            board[x][6].class=1;
            board[x][6].color=1;
            }
        //tornit
        board[0][0].class=4;
        board[0][7].class=4;
        board[0][0].color=0;
        board[0][7].color=1;
        board[7][0].class=4;
        board[7][7].class=4;
        board[7][0].color=0;
        board[7][7].color=1;
        //ratsut
        board[1][0].class=2;
        board[1][0].color=0;
        board[6][0].class=2;
        board[6][0].color=0;
        board[1][7].class=2;
        board[6][7].class=2;
        board[1][7].color=1;
        board[6][7].color=1;
        //lähetit
        board[2][0].class=3;
        board[5][0].class=3;
        board[2][0].color=0;
        board[5][0].color=0;
        board[2][7].class=3;
        board[5][7].class=3;
        board[2][7].color=1;
        board[5][7].color=1;
        //kuningattaret
        board[3][0].class=6;
        board[3][7].class=6;
        board[3][0].color=0;
        board[3][7].color=1;
        //kuninkaat
        board[4][0].class=5;
        board[4][7].class=5;
        board[4][0].color=0;
        board[4][7].color=1;

        board.forEach(function(element){
        console.log(element);
        })
        pieces.forEach(function(element){
            console.log(element);})
}

function drawGame(){
    init();
    drawBoard();
    drawPiece();
}

drawGame();
canvas.onmousedown = myDown;
//canvas.onmouseup = myUp;
