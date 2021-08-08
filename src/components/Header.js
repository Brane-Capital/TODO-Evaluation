import { set } from "lodash";
import React from "react";
import styled from "styled-components";
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
            name = "New List"
        } 

        this.state={
            name : name,
            visibility: false
        }       

        this.onChange=this.onChange.bind(this)

    }

    onChange(event){

        const name =event.target.value

        console.log("onchange: ", event.target.value)
     
        this.setState({
            name: name,
        })


       
        if(this.props.onClick){

            console.log("onclick recieved")
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
      <input type="text" name="name" value={this.state.name} onClick={(e)=> {this.setState({visibility: !this.state.visibility})}} onChange={this.onChange} onSubmit={this.onChange} />
      <input type="submit" value="Submit" hidden={visibility} />
       </form>
    </div>)
    }

}