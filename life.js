var Run = true;

var LifeCanvas;
var LifeCanvasParameters;
var ImageData;

var LifeGrid;
var NewLifeGrid;

var XGridSize;
var YGridSize;
var XScale;
var YScale;

function Initialize()
{
	LifeCanvas = document.getElementById("lifeGrid");
	LifeCanvasParameters = LifeCanvas.getContext("2d");
	
	document.body.onkeyup = function(e)
	{
		// Space bar
		if(e.keyCode == 32)
		{
			Run = !Run;
		}
		// Right arrow
		else if(e.keyCode == 39 && !Run)
		{
			Run = true;
			CalculateGrid();
			Run = false;
		}
	}

	window.onclick = function(e)
	{
		Run = !Run;
	}
	
	window.onresize = ResizeCanvas;
	
	ResizeCanvas();
	setInterval(CalculateGrid,33);
}

function ResizeCanvas() 
{
  LifeCanvasParameters.clearRect(0, 0, LifeCanvas.width, LifeCanvas.height);
  
  LifeCanvas.width  = window.innerWidth;
  LifeCanvas.height = window.innerHeight;
  
  XGridSize     = parseInt(LifeCanvas.width/2);
  YGridSize     = parseInt(LifeCanvas.height/2);
  
  XScale = parseInt(LifeCanvas.width /XGridSize);
  YScale = parseInt(LifeCanvas.height/YGridSize);
	
  ImageData = LifeCanvasParameters.createImageData(XGridSize*XScale, YGridSize*YScale);
  
  ResetGrid();
  RandomizeGrid();
  DrawImage();
}

function ResetGrid()
{
	LifeGrid    = new Array(XGridSize);
	NewLifeGrid = new Array(XGridSize);
	
	for (var i = 0; i < XGridSize; i++) 
	{ 
		LifeGrid[i]    = new Array(YGridSize); 
		NewLifeGrid[i] = new Array(YGridSize);
	} 

	for (var i = 0; i < XGridSize; i++) 
	{ 
		for (var j = 0; j < YGridSize; j++)
		{
			LifeGrid[i][j]    = 0; 
			NewLifeGrid[i][j] = 0;
		}
	} 
}

function RandomizeGrid()
{
	if(Math.random() >= 0.5)
	{
		for (var i = 0; i < YGridSize; i++)
		{
			LifeGrid[parseInt(XGridSize/2) -1][i] = 1;
			LifeGrid[parseInt(XGridSize/2)][i] = 1;
		}
		
		var scaler = Math.random();
		var invscaler = 1-scaler;

		var yscaler = parseInt(scaler*YGridSize)-1;
		var yinvscaler = parseInt(invscaler*YGridSize)-1;

		for (var i = 0; i < XGridSize; i++)
		{
			LifeGrid[i][yscaler] = 1;
			LifeGrid[i][yinvscaler] = 1;
		}
	}
	else
	{
		for (var i = 0; i < XGridSize; i++)
		{
			LifeGrid[i][parseInt(YGridSize/2)-1] = 1;
			LifeGrid[i][parseInt(YGridSize/2)] = 1;
		}
		
		var scaler = Math.random();
		var invscaler = 1-scaler;

		var xscaler = parseInt(scaler*XGridSize)-1;
		var xinvscaler = parseInt(invscaler*XGridSize)-1;

		for (var i = 0; i < YGridSize; i++)
		{
			LifeGrid[xscaler][i] = 1;
			LifeGrid[xinvscaler][i] = 1;
		}
	}

	if(Math.random() >= 0.5)
	{
		for (var i = 0; i < XGridSize; i++)
		{
			LifeGrid[i][0] = 1;
			LifeGrid[i][YGridSize-1] = 1;
		}
	}

	if(Math.random() >= 0.5)
	{
		for (var i = 0; i < YGridSize; i++)
		{
			LifeGrid[XGridSize-1][i] = 1;
			LifeGrid[0][i] = 1;
		}
	}
}

function CalculateGrid()
{
	if(!Run)
		return;
	
	for (var i = 0; i < XGridSize; i++)
	{
		for (var j = 0; j < YGridSize; j++)
		{
			switch(LifeGrid[i][j])
			{
				case 0:
				{
					var aliveCount = 0;

					for(var k = 0; k < 3; k++)
					{
						var x = (i - 1) + k;
						
						switch (x)
						{
							case -1:
								x = XGridSize-1;
								break;
							
							case XGridSize:
								x = 0;
								break;
						}
						
						for(var l = 0; l < 3; l++)
						{
							var y = (j - 1) + l;
							
							switch(y)
							{
								case -1:
									y = YGridSize-1;
									break;
								
								case YGridSize:
									y = 0;
									break;
							}
							
							if(LifeGrid[x][y])
								aliveCount++;
						}
					}
				
					NewLifeGrid[i][j] = (aliveCount == 3) ? (LifeGrid[i][j]+1) : 0
					
					break;
				}
				default:
				{
					var aliveCount = -1;

					for(var k = 0; k < 3; k++)
					{
						var x = (i - 1) + k;
						
						switch (x)
						{
							case -1:
								x = XGridSize-1;
								break;
							
							case XGridSize:
								x = 0;
								break;
						}
						
						for(var l = 0; l < 3; l++)
						{
							var y = (j - 1) + l;
							
							switch(y)
							{
								case -1:
									y = YGridSize-1;
									break;
								
								case YGridSize:
									y = 0;
									break;
							}
							
							if(LifeGrid[x][y])
								aliveCount++;
						}
					}
				
					NewLifeGrid[i][j] = (aliveCount == 2 || aliveCount == 3) ? (LifeGrid[i][j]+1) : 0;
				
					break;
				}
			}
		}
	}

    DrawImage();
	
	for (var i = 0; i < XGridSize; i++) 
	{ 
		for (var j = 0; j < YGridSize; j++)
		{
			LifeGrid[i][j] = NewLifeGrid[i][j];
		}
	} 
}

function DrawImage()
{
	var imgIndex = 0;
	for (var i = 0; i < XGridSize; i++) 
	{ 
		imgIndex = i*XScale*4;
		for (var j = 0; j < YGridSize; j++)
		{
			for(var k = 0; k < XScale; k++)
			{
				for(var l = 0; l < YScale; l++)
				{
					var localIndex = imgIndex+l*XGridSize*XScale*4;

					switch(NewLifeGrid[i][j])
					{
						case 0:
							ImageData.data[localIndex+0] = 0;
							ImageData.data[localIndex+1] = 0;
							ImageData.data[localIndex+2] = 0;
							ImageData.data[localIndex+3] = 255;
							break;
						case 1:
							ImageData.data[localIndex+0] = 255;
							ImageData.data[localIndex+1] = 0;
							ImageData.data[localIndex+2] = 0;
							ImageData.data[localIndex+3] = 255;
							break;
						case 2:
							ImageData.data[localIndex+0] = 255;
							ImageData.data[localIndex+1] = 165;
							ImageData.data[localIndex+2] = 0;
							ImageData.data[localIndex+3] = 255;	
							break;
						case 3:
							ImageData.data[localIndex+0] = 255;
							ImageData.data[localIndex+1] = 255;
							ImageData.data[localIndex+2] = 0;
							ImageData.data[localIndex+3] = 255;	
							break;
						case 4:
							ImageData.data[localIndex+0] = 0;
							ImageData.data[localIndex+1] = 255;
							ImageData.data[localIndex+2] = 0;
							ImageData.data[localIndex+3] = 255;	
							break;
						case 5:
							ImageData.data[localIndex+0] = 0;
							ImageData.data[localIndex+1] = 255;
							ImageData.data[localIndex+2] = 255;
							ImageData.data[localIndex+3] = 255;	
							break;
						case 6:
							ImageData.data[localIndex+0] = 0;
							ImageData.data[localIndex+1] = 0;
							ImageData.data[localIndex+2] = 255;
							ImageData.data[localIndex+3] = 255;	
							break;
						case 7:
							ImageData.data[localIndex+0] = 128;
							ImageData.data[localIndex+1] = 0;
							ImageData.data[localIndex+2] = 128;
							ImageData.data[localIndex+3] = 255;	
							break;
						case 8:
							ImageData.data[localIndex+0] = 255;
							ImageData.data[localIndex+1] = 0;
							ImageData.data[localIndex+2] = 255;
							ImageData.data[localIndex+3] = 255;	
							break;
						default:
							ImageData.data[localIndex+0] = 255;
							ImageData.data[localIndex+1] = 255;
							ImageData.data[localIndex+2] = 255;
							ImageData.data[localIndex+3] = 255;	
							break;
					}
				}
				imgIndex+=4;
			}
			imgIndex-=4*XScale;
			imgIndex+=YScale*XGridSize*XScale*4;
		}
	}
	
	LifeCanvasParameters.putImageData(ImageData, 0, 0); 
}
