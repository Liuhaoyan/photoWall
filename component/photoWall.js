(function(){
    function getRangeRandom(low,high){
        return Math.ceil(Math.random()*(high - low) +low);
    }
    var ImgFigure=React.createClass({
        handleClick:function(){
            if(this.props.isCenter){
               this.props.inverse();
            }
            else{
                this.props.center();
            }
        },
        render:function(){
            var styleObj={
                top:this.props.info.pos.top,
                left:this.props.info.pos.left,
                transform:'rotate('+ this.props.info.rotate +'deg)',
            };
            if(this.props.isInverse){
                styleObj.transform='rotateY(180deg)';
            }
            return (
                <figure className="img-figure" style={styleObj} onClick={this.handleClick}>
                    <img src={'img/'+this.props.data.fileName}/>
                    <figcaption>
                        <h2>{this.props.data.title}</h2>
                        <div className="is_back">{this.props.data.desc}</div>
                    </figcaption>
                </figure>
            );
        }
    });
    var Controller=React.createClass({
        handleClick:function(){
            if(this.props.isCenter){
                this.props.inverse();
            }
            else{
                this.props.center();
            }
        },
        render:function(){
            return (
               <span className="controller" onClick={this.handleClick}>
               </span>
            );
        }
    });
    var PhotoWall=React.createClass({
        Const : {
          centerPos :{
              x:0,
              y:0
          },
          hRangePos : {
              xLeftMin :0,
              xLeftMax :0,
              xRightMin :0,
              xRightMax :0,
              yMin :0,
              yMax :0
          }
        },
        getInitialState : function(){
            return {
                imgInfoArr :[{
                    pos:{
                        top:0,
                        left:0
                    },
                    rotate:0,
                    isCenter:false,
                    isInverse:false
                }]
            };
        },
        rearrage :function(centerIndex){
            var imgInfoArr =this.state.imgInfoArr;
            imgInfoArr[centerIndex].pos={
                left:this.Const.centerPos.x,
                top:this.Const.centerPos.y
            };
            imgInfoArr[centerIndex].rotate=0;
            imgInfoArr[centerIndex].isCenter=true;
            // imgInfoArr[centerIndex].isInverse=true;
            for(var i=0;i<imgInfoArr.length;i++){
                if(i == centerIndex){
                    continue;
                }
                if(i<imgInfoArr.length/2){
                    imgInfoArr[i].pos={
                        top:getRangeRandom(this.Const.hRangePos.yMin,this.Const.hRangePos.yMax),
                        left:getRangeRandom(this.Const.hRangePos.xLeftMin,this.Const.hRangePos.xLeftMax)
                    };
                }
                else{
                    imgInfoArr[i].pos={
                        top:getRangeRandom(this.Const.hRangePos.yMin,this.Const.hRangePos.yMax),
                        left:getRangeRandom(this.Const.hRangePos.xRightMin,this.Const.hRangePos.xRightMax)
                    };
                }
                imgInfoArr[i].rotate =getRangeRandom(-30,30);
                imgInfoArr[i].isCenter=false;
                imgInfoArr[i].isInverse=false;
            }
                this.setState({
                imgInfoArr:this.state.imgInfoArr
            });
        },
        center:function(centerIndex){
            return function(){
                console.log(centerIndex);
                this.rearrage(centerIndex);
            }.bind(this);
        },
        componentDidMount :function(){
            var imgInfoArr =this.state.imgInfoArr;
            var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
                stageW=stageDOM.clientWidth,
                stageH=stageDOM.clientHeight,
                halfStageW =stageW/2,
                halfStageH=stageH/2;
            var imgFigureDOM =ReactDOM.findDOMNode(this.refs.imgFigure0),
                imgFigureW=imgFigureDOM.clientWidth,
                imgFigureH=imgFigureDOM.clientHeight,
                halfImgFigureW=imgFigureW/2,
                halfImgFigureH=imgFigureH/2;

            this.Const.centerPos={
                x:halfStageW-halfImgFigureW,
                y:halfStageH- halfImgFigureH
            };
            this.Const.hRangePos={
                xLeftMin :-halfImgFigureW,
                xLeftMax :halfStageW-3*halfImgFigureW,
                xRightMin : halfStageW+halfImgFigureW,
                xRightMax :stageW-halfImgFigureW,
                yMin :-halfImgFigureH,
                yMax :stageH-halfImgFigureH
            };
            this.rearrage(0);
        },
        inverse:function(index){
            return function(){
                this.state.imgInfoArr[index].isInverse=!this.state.imgInfoArr[index].isInverse;
                this.setState({
                    imgInfoArr:this.state.imgInfoArr
                });
            }.bind(this);
        },
        render:function(){
            var imgFigureArr=[];
            var controllerArr=[];
            imgDatas.forEach(function(value,index){
                if(!this.state.imgInfoArr[index]){
                    this.state.imgInfoArr[index]={
                        pos:{
                            left:0,
                            top:0
                        },
                        rotate:0,
                        isCenter:false,
                        isInverse:false
                    }
                }
                imgFigureArr.push(<ImgFigure data={value} key={index} info={this.state.imgInfoArr[index]} ref={'imgFigure'+index} center={this.center(index)} isCenter={this.state.imgInfoArr[index].isCenter} inverse={this.inverse(index)} isInverse={this.state.imgInfoArr[index].isInverse} />);
                controllerArr.push(<Controller key={index} center={this.center(index)}/>);
            }.bind(this));
            return (
                <section className="stage" ref="stage">
                    <section>
                        {imgFigureArr}
                    </section>
                    <nav>
                        {controllerArr}
                    </nav>
                </section>

            );
        }
    });
    ReactDOM.render(
        <PhotoWall />,
        document.getElementById('photoWall')
    );













})();
