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

        this.setState={
            name : name,
            onClick: onClick
        }

        this.onSumbit.bind(this)

    }
     
    onSumbit(event){

        console.log("Event value ", event.target.value)
        this.setState({name: event.target.value});
        this.state.onClick(event.target.value)
    }

    render(){

        return (
        <div> 
      <form>
      <input type="text" name="name"  onSubmit={this.onSumbit} />
       </form>
    </div>)
    }

}