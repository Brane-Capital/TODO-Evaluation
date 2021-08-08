import { set } from "lodash";
import React from "react";




export default class App extends React.Component {

    constructor(props){
        super(props)
        let {name} = this.props;

        
        if(!name ){
            name = "New List"
        } 

        this.state={
            name : name,
        }

       

        this.onChange=this.onChange.bind(this)

    }

    onChange(event){

        const name =event.target.value

        console.log("onchange: ", event.target.value)
     
        this.setState({
            name: name
        })


        console.log("===============================")
        if(this.props.onClick){

            console.log("onclick recieved")
            this.props.onClick(event, name)
        }
        console.log("===============================")


    }
     
   

    onDelete(event){

        //this.props.onDelete(this.state.name)
    }

    render(){

        return (
        <div> 
      <form>
      <input type="text" name="name" onChange={this.onChange} onSubmit={this.onChange} />
       </form>
    </div>)
    }

}