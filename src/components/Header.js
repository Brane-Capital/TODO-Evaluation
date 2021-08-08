import { set } from "lodash";
import React from "react";




export default class App extends React.Component {

    constructor(props){
        super(props)
        let {name} = this.props;
        let {onClick}=this.props;

        if(!onClick){

            onClick=function(e){
                return e.target.value
            }
        }
        if(!name ){
            name = "New List"
        } 

        this.state={
            name : name,
        }

        this.onSumbit.bind(this)
        this.onChange.bind(this)

    }

    onChange(event){


        console.log("onchange: ", event.target.value)
       const {onClick}=this.props
       const name =event.target.value
        this.setState({
            name: name
        })

        if(onClick){

            console.log("onclick recieved")
            onClick.bind(this,name)
        }

    }
     
    onSumbit(event){

        this.setState({name: event.target.value});
        this.onClick(event.target.value)
    }

    render(){
      let {name }=this.state

        return (
        <div> 
      <form>
      <input type="text" name="name" onChange={this.onChange} onSubmit={this.onChange} />
       </form>
    </div>)
    }

}