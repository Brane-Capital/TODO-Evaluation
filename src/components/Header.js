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

       

        this.onChange =this.onChange.bind(this)

    }

    onChange(event){
        const name =event.target.value


        console.log("onchange: ", event.target.value)
        if(this.props.onClick){

            
            this.props.onClick(event, name)
        }
        this.setState({
            name: name
        })

       


    }
     
   

    onDelete(event){

        this.props.onDelete(this.state.name)
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