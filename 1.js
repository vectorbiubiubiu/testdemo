const oBack = document.querySelector('#back');
const oReback = document.querySelector('#reback');
const oReset = document.querySelector('#reset');
const oChangeRole = document.querySelector('#changeRole');
const oChessA = document.querySelector('#chess');
const oChess = document.querySelector('#chessA');
const canvasA = oChessA.getContext('2d');
const canvas = oChess.getContext('2d');
// 游戏是否结束
let gameOver = false;
let isp2p = false;
//记录当前人和电脑的落子位置
let pOne = [];
let pTwo = [];

//是否是人下棋
let isMan = true;
//是否选择悔棋
let isBack = false;
//落子位置集合
let chessArr = [];


let peopleWin = [],
	computerWin = [];
//可以赢的方式
let canWin = [];
//可以赢的种类数量
let winCount = 0;
for(let i = 0; i< 15; i++){
	canWin[i] = [];
	for(let j = 0; j<15; j++){
		canWin[i][j] = [];
	}
}
//横线赢的方式
for(let i = 0; i<15;i++){
	for(let j = 0;j<11; j++){
		//连成五个子
		for(let k = 0; k<5; k++){
			canWin[i][j+k][winCount] = true;
		}
		winCount++;
	}
}
//竖线赢的方式
for(let i = 0; i<11;i++){
	for(let j = 0;j<15; j++){
		//连成五个子
		for(let k = 0; k<5; k++){
			canWin[i+k][j][winCount] = true;
		}
		winCount++;
	}
}
//正斜线赢的方式
for(let i = 0; i<11;i++){
	for(let j = 0;j<11; j++){
		//连成五个子
		for(let k = 0; k<5; k++){
			canWin[i+k][j+k][winCount] = true;
		}
		winCount++;
	}
}
//反斜线赢的方式
for(let i = 0; i<11;i++){
	for(let j = 14;j>3; j--){
		//连成五个子
		for(let k = 0; k<5; k++){
			canWin[i+k][j-k][winCount] = true;
		}
		winCount++;
	}
}


//画棋盘
const drawChessboard = () => {
	canvas.strokeStyle = "#ccc";
	for(let i = 0; i<=15; i++){
		canvasA.moveTo(20+40*i, 20);
		canvasA.lineTo(20+40*i, 620);
		canvasA.stroke();
		canvasA.moveTo(20, 20+40*i);
		canvasA.lineTo(620, 20+40*i);
		canvasA.stroke();
	}
}


//画棋子
const drawChessman = (x, y, temp) => {
	canvas.beginPath();
	canvas.arc(20+x*40,20+y*40, 18, 0, 360);
	canvas.closePath();
	canvas.fillStyle = temp ? "#fff" : "#000";
	canvas.fill();
}
//清理棋子
const clearChessman = (x, y) => {
	canvas.clearRect(x*40, y*40, 40, 40);
}
//电脑下
const computerStep = () => {
	let peopleScore = [];
	let computerScore = [];
	let maxScore = 0;
	let currentX = 0;
	let currentY = 0;
	//重置悔棋部分
	isBack = false;
	pOne = [];
	pTwo = [];
	for(let i = 0; i<15; i++){
		peopleScore[i] = [];
		computerScore[i] = [];
		for(let j = 0; j<15; j++){
			peopleScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(let i = 0; i<15; i++){
		for(let j = 0; j<15; j++){
			if(chessArr[i][j] == 0){
				for(let k = 0;k<winCount;k++){
					if(canWin[i][j][k]){
						switch(peopleWin[k]){
							case 1:peopleScore[i][j]+=100;
								break;
							case 2:peopleScore[i][j]+=400;
								break;
							case 3:peopleScore[i][j]+=800;
								break;
							case 4:peopleScore[i][j]+=2000;
								break;
						}
						switch(computerWin[k]){
							case 1:computerScore[i][j]+=150;
								break;
							case 2:computerScore[i][j]+=450;
								break;
							case 3:computerScore[i][j]+=850;
								break;
							case 4:computerScore[i][j]+=10000;
								break;
						}
					}
				}
				if(peopleScore[i][j]>maxScore){
					maxScore = peopleScore[i][j];
					currentX = i;
					currentY = j;
				}else if(peopleScore[i][j] == maxScore){
					if(computerScore[i][j]>computerScore[currentX][currentY]){
						currentX = i;
						currentY = j;
					}
				}
				if(computerScore[i][j]>maxScore){
					maxScore = computerScore[i][j];
					currentX = i;
					currentY = j;
				}else if(computerScore[i][j] == maxScore){
					if(peopleScore[i][j]>peopleScore[currentX][currentY]){
						currentX = i;
						currentY = j;
					}
				}
			}
		}
	}
	drawChessman(currentX, currentY, false);
	if(!pTwo[0]){
		pTwo[0] = [];
	}
	pTwo[0].push([currentX, currentY]);
	chessArr[currentX][currentY] = 2;
	for(let i = 0; i<winCount; i++){
		if(canWin[currentX][currentY][i]){
			computerWin[i]++;
			//人不可能赢
			peopleWin[i] += 10;
			if(computerWin[i]==5){
				alert('computer win!')
				gameOver = true;
			}
		}
	}
	if(!gameOver){
		isMan = !isMan;
	}

}

oChess.addEventListener('click', (event) => {
	if(gameOver){
		return;
	}
	if(!isp2p){
		if(!isMan){
			return;
		}
	}
	//重置悔棋部分
	isBack = false;
	pOne = [];
	pTwo = [];
	let x = Math.floor(event.offsetX/40),
		y = Math.floor(event.offsetY/40);
	if(chessArr[x][y] == 0){
		drawChessman(x, y, isMan);

		if(isp2p && !isMan){
			if(!pTwo[0]){
				pTwo[0] = [];
			}
			pTwo[0].push([x,y]);
		}else{
			if(!pOne[0]){
				pOne[0] = [];
			}
			pOne[0].push([x, y]);
		}
		chessArr[x][y] =  1;
		for(let i = 0; i<winCount; i++){
			if(canWin[x][y][i]){

				if(isp2p && !isMan){
					computerWin[i]++;
					peopleWin[i] += 10;
					if(computerWin[i]==5){
						alert('opponent win!')
						gameOver = true;
					}
				}else{
					peopleWin[i]++;

					computerWin[i] += 10;
					if(peopleWin[i]==5){
						alert('you win!')
						gameOver = true;
					}
				}
			}

		}
		if(!gameOver){
			if(!isp2p){
				computerStep();
			}
			isMan = !isMan;
		}
	}

})

//悔棋
oBack.addEventListener('click', (event) => {
	let currentOne = [];
	let currentTwo = [];
	isBack = true;
	currentOne = pOne[0].pop();
	pOne[1].push(currentOne);
	currentTwo = pTwo[0].pop();
	pTwo[1].push(currentTwo);

	if(!currentOne){
		return;
	}
	clearChessman(currentOne[0], currentOne[1], true);
	clearChessman(currentTwo[0], currentTwo[1], true);
	chessArr[currentOne[0]][ currentOne[1]] = 0;
	chessArr[currentTwo[0]][ currentTwo[1]] = 0;
	for(let i = 0; i<winCount; i++){
		if(canWin[currentOne[0]][currentOne[1]][i]){
			peopleWin[i]--;
			computerWin[i] -= 10;
		}
	}
	for(let i = 0; i<winCount; i++){
		if(canWin[currentTwo[0]][currentTwo[1]][i]){
			computerWin[i]--;
			peopleWin[i] -= 10;
		}
	}
	gameOver = false;

})

//取消悔棋
oReback.addEventListener('click', (event) => {
	let currentOne = [];
	let currentTwo = [];

	if(!isBack){
		return;
	}
	console.log(pTwo[0])
	currentOne = pOne[1].pop();
	pOne[0].push(currentOne);
	currentTwo = pTwo[1].pop();
	pTwo[0].push(currentTwo);
	console.log(pTwo)

	if(!currentOne){
		return;
	}
	if(!pOne[1].length){
		isBack = false;
	}
	drawChessman(currentOne[0], currentOne[1], true);
	chessArr[currentOne[0]][currentOne[1]] =  1;
	for(let i = 0; i<winCount; i++){
		if(canWin[currentOne[0]][currentOne[1]][i]){
			peopleWin[i]++;
			//电脑不可能赢
			computerWin[i] = 10;
			if(peopleWin[i]==5){
				alert('you win!')
				gameOver = true;
			}
		}
	}
	if(!gameOver){
		if(!isp2p){
			//为了防止二次到已走位置
			drawChessman(currentTwo[0], currentTwo[1], false);
			chessArr[currentTwo[0]][currentTwo[1]] =  2;
			for(let i = 0; i<winCount; i++){
				if(canWin[currentTwo[0]][currentTwo[1]][i]){
					computerWin[i]++;
					peopleWin[i] += 10;
					if(computerWin[i]==5){
						alert('computer win!')
						gameOver = true;
					}
				}
			}
		}else{
			drawChessman(currentTwo[0], currentTwo[1], false);
			chessArr[currentTwo[0]][currentTwo[1]] =  2;
			for(let i = 0; i<winCount; i++){
				if(canWin[currentTwo[0]][currentTwo[1]][i]){
					computerWin[i]++;
					peopleWin[i] += 10;
					if(computerWin[i]==5){
						alert('opponent win!')
						gameOver = true;
					}
				}
			}
		}
		isMan = !isMan;
	}

})
//重制棋盘
oReset.addEventListener('click', (event) => {
	canvas.clearRect(0,0,640,640);
	gameOver = false;
	isMan = true;
	for(let i = 0;i<winCount;i++){
		peopleWin[i] = 0;
		computerWin[i] = 0;
	}
	for(let i = 0;i<15;i++){
		chessArr[i] = [];
		for(let j = 0;j<15;j++){
			chessArr[i][j] = 0;
		}
	}
	for(let i = 0; i<2; i++){
		pOne[i] = [];
		pTwo[i] = [];
	}
})

//切换角色
oChangeRole.addEventListener('click', (event) => {
	isp2p = !isp2p;
	oChangeRole.innerHTML = isp2p ? "人对人" : "人机";
	oReset.click();
});

// 初始化
(()=>{
	drawChessboard();
	oReset.click();
})()
