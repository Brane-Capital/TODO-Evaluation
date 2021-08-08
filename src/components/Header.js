import { set } from "lodash";
import React from "react";
import styled from "styled-components";
const DEFAULT_NAME="New List"
const Div1 = styled.div`
margin: 0;
padding: 0;
border: 0;
background: none;
font-size: 100%;
vertical-align: baseline;
font-family: inherit;
font-weight: inherit;
color: inherit;
-webkit-appearance: none;
appearance: none;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
`;

const StyledCon = styled(Div1)



export default class App extends React.Component {

    constructor(props){
        super(props)
        let {name} = this.props;

        
        if(!name ){
            name = DEFAULT_NAME
        } 

        this.state={
            name : name,
            visibility: false
        }       

        this.onChange=this.onChange.bind(this)
        this.onClick=this.onClick.bind(this)

    }

    onClick(event){
        console.log("onclick event: ", this.props.id)

       this.setState({
           visibility: !this.state.visibility
       })


          
       if(this.props.onChange){

        this.props.onChange(event, event.target.name , this.props.id)
    }
     

       
    }

    onChange(event){

        let name =event.target.value

       console.log("onchange event", name)

        if(!(name == "")){
            this.setState({
                name: name,
            })
        }
     
       


       
        if(this.props.onChange){

            this.props.onClick(event, name, this.props.id)
        }


    }
     
   

    onDelete(event){
        const name =event.target.value

        if(this.props.onDelete){
            this.props.onDelete(event, name, this.props.id)
        }
    }

    render(){
      let {visibility}= this.state
        return (
        <div> 
      <form onSubmit={this.onDelete}>
      <input type="text" name="name" value={`${this.state.name} ${this.props.id}`} onClick={this.onClick} onChange={this.onChange} onSubmit={this.onChange} />
      <input type="submit" value="Delete" hidden={visibility} />
       </form>
    </div>)
    }

}