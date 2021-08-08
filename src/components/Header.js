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


       
        if(this.props.onClick){

            console.log("onclick recieved")
            this.props.onClick(event, name, this.props.id)
        }


    }
     
   

    onDelete(event){
        const name =event.target.value

        if(this.props.onDelete){
            this.props.onDelete(event, name)
        }
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