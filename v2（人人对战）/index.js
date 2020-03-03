class FiveChess{
    constructor({el}){
        if(!el) throw new ReferenceError('can not find this element');
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);
        this.width = this.$el.width;
        this.height = this.$el.height;
        this.itemWidth = 30;
        this.coordinateList = []; // 坐标
        this.ctx = this.$el.getContext('2d');
        this.init();
        
        this.setChessColor = function(color){
            this.chessPiecesColorType = color; // 0:黑色 1:白色
        }
    }

    init(){
        this.drawLayoutBoard();
        // this.bindEvent();
        this.setCoordinateList();
    }

    // bindEvent(){
    //     this.$el.addEventListener('click', this.handleClick.bind(this),false)
    // }
    
    setCoordinateList(){
        let initX = 0,initY = 0;
        for(let i = 0; i< 19; i++){
            let list = new Array();
            this.coordinateList.push(list);
            initX = i * this.itemWidth; 
            for(let j = 0 ; j < 19; j++){
                initY = j * this.itemWidth;
                let coord = {x:initX,y:initY,isHaveChess:false,color:null}
                this.coordinateList[i].push(coord);
            }
        }
    }

    isElementNode(node){
        return node.nodeType == 1 ? true : false
    }

    drawLayoutBoard(){
        this.ctx.save();
        let totalWidth = this.itemWidth * 18;
        this.initX = (this.width - (totalWidth + 4)) / 2;
        this.initY = (this.height - (totalWidth + 4)) / 2 ;
        this.ctx.translate(this.initX,this.initY)
        this._drawRect({x:0,y:0,width:totalWidth,height:totalWidth});

        let initWidth = totalWidth,
            itemIndex = 18 / 3, // 一行3个点
            index = 0,x,tempXIndex = 3;
        while(initWidth -= this.itemWidth){
            index++;
            this._drawLine({startX:initWidth,startY:0,endX:initWidth,endY:totalWidth});
            this._drawLine({startX:0,startY:initWidth,endX:totalWidth,endY:initWidth});
            if(tempXIndex == index){
                tempXIndex += itemIndex;
                x = index * this.itemWidth;
                let tempY = 3;
                for(let i = 0; i < 3; i++){
                    this._drawCircle({x,y:tempY * this.itemWidth});
                    tempY = tempY + itemIndex;
                }
            }
        }                                                                                      
    }

    _drawRect({x,y,width,height,lineWidth = 2,color = '#333'}){
        this.ctx.beginPath();
        this.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.rect(x,y,width,height);
        this.ctx.stroke();
    }

    _drawLine({startX,startY,endX,endY,color = '#444',width = 1}){
        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(startX,startY);
        this.ctx.lineTo(endX,endY);
        this.ctx.stroke();
    }

    _drawCircle({x,y,r = 3,startAngle = 0,endAngle = 360,color = '#333'}){
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x,y,r,startAngle,endAngle * Math.PI /180,true);
        this.ctx.fill();
    }

    // handleClick(event){
    //     let mouse = this.getMouse(event,this.$el,this.initX,this.initY);
    //     let coord = this.findCoord(mouse.x,mouse.y)
    //     if(coord.isHaveChess) return;
    //     let {x , y} = coord;
    //     coord.color = this.chessPiecesColorType;
    //     this._drawCircle({x,y,r:12,color:this._getColor(this.chessPiecesColorType)})
    //     this.isWin(x/this.itemWidth,y/this.itemWidth,this.chessPiecesColorType);
    //     coord.isHaveChess = true;
    // }

    _getColor(type){
        return {
            '0':'#000',
            '1':'#fff'
        }[type]
    }

    getMouse(event,element,offsetLeft = 0 ,offsetTop = 0){
        let e = event || window.event;
        let mouse = {}, x, y;
        if(e.pageX || e.pageY){
            x = e.pageX;
            y = e.pageY;
        }else{
            x = e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop || document.documentElement.scrollTop;
        }
        x -= element.offsetLeft || offsetLeft;
        y -= element.offsetTtop || offsetTop;

        mouse.x = x;
        mouse.y = y;
        return mouse;
    }

    findCoord(x,y){
        let xIndex = Math.round(x / this.itemWidth),
            yIndex = Math.round(y / this.itemWidth);
        return this.coordinateList[xIndex][yIndex]
    }

    restart(){
        this.ctx.restore();
        this.coordinateList = [];
        this.chessPiecesColorType = 0;
        this.ctx.clearRect(0,0,this.width,this.height);
        this.init();
    }


    isWin(originX,originY,color){
        let list = [];
        for(let i = 0; i< 8; i++){
            list[i] = this['getLineList' + (i+1)](originX,originY,color)
        }
        return list;
        
    }

    validateSameColor(obj,color){
        if(!obj.isHaveChess){
            return false;
        }
        return obj.color == color
    }

    getLineList1(x,y,color){
        for(let i = 0 ; i< 4; i++){
            if(--x < 0 || --y < 0 ) break;
            let obj = this.coordinateList[x][y];
            if(!this.validateSameColor(obj,color)) return false;
        }
        return true;
        
    }
    getLineList2(x,y,color){
        for(let i = 0 ; i< 4; i++){
            if(--y < 0 ) break;
            let obj = this.coordinateList[x][y];
            if(!this.validateSameColor(obj,color)) return false;
        }
        return true;
    }
    getLineList3(x,y,color){
        for(let i = 0 ; i< 4; i++){
            ++x
            if(--y < 0 ) break;
            let obj = this.coordinateList[x][y];
            if(!this.validateSameColor(obj,color)) return false;
        }
        return true
    }
    getLineList4(x,y,color){
        for(let i = 0 ; i< 4; i++){
            ++x
            let obj = this.coordinateList[x][y];
            if(!this.validateSameColor(obj,color)) return false;
        }
        return true;
    }
    getLineList5(x,y,color){
        for(let i = 0 ; i< 4; i++){
            ++x
            ++y
            let obj = this.coordinateList[x][y];
            if(!this.validateSameColor(obj,color)) return false;
        }
        return true;
    }
    getLineList6(x,y,color){
        for(let i = 0 ; i< 4; i++){
            ++y
            let obj = this.coordinateList[x][y];
            if(!this.validateSameColor(obj,color)) return false;
        }
        return true;
    }
    getLineList7(x,y,color){
        for(let i = 0 ; i< 4; i++){
            ++y
            if(--x < 0) break;
            let obj = this.coordinateList[x][y];
            if(!this.validateSameColor(obj,color)) return false;
        }
        return true;
    }
    getLineList8(x,y,color){
        for(let i = 0 ; i< 4; i++){
            if(--x < 0) break;
            let obj = this.coordinateList[x][y];
            if(!this.validateSameColor(obj,color)) return false;
        }
        return true;
    }




    


}