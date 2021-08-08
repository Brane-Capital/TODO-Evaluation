import React from "react";
import styled from "styled-components";
import { KeyCode } from "./utils/constants";
import { getHashPath } from "./utils/pageAddress";
import Todos from "./utils/TodoList";
import GlobalStyle from "./GlobalStyle";
import TodoItem from "./TodoItem";
import Footer from "./Footer";
import Header from "./components/Header"
import { Col, Grid } from "./components/FlexboxGrid";

const Page = styled.div`
  .info {
    margin: 65px auto 0;
    color: #bfbfbf;
    font-size: 10px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    text-align: center;
    p {
      line-height: 1;
    }
    a {
      color: inherit;
      text-decoration: none;
      font-weight: 400;
    }
    a:hover {
      text-decoration: underline;
    }
  }
`;

const Title = styled.h1`
  width: 100%;
  height: 130px;
  line-height: 130px;
  margin: 0;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
`;

const TodoApp = styled.section`
  background: #fff;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);

  label.indicator {
    position: absolute;
    top: 14px;
    left: -8px;
    font-size: 22px;
    color: #e6e6e6;
    padding: 10px 27px 10px 27px;
  }

  input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
  input::-moz-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
  input::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }
`;

const Input = styled.input`
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
`;

const TodoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #ededed;
  }
  li:last-child {
    border-bottom: none;
  }
`;

// class App extends React.Component {
//   state = {
//     newTodo: "",
//     filter: getHashPath() || "active",
//     items: [],
//     headers: [{
//       id: 0,
//       name: "All"
//     }],
//     currentHeaderId: 0 
//   };

//    constructor(props){
//      super(props)
//      this.addHeader=this.addHeader.bind(this)
//      this.deleteHeader=this.deleteHeader.bind(this)
//      this.updateHeader=this.updateHeader.bind(this)
//      this.updateCurrentHeader=this.updateCurrentHeader.bind(this)
//    }
//   todos = new Todos();

//   loadItems(filter) {
//     if (filter == null || filter == this.state.filter) {
//       this.setState({ items: this.todos.filter(this.state.filter) });
//     } else {
//       this.setState({ filter, items: this.todos.filter(filter) });
//     }
//   }


//   loadItemsByHeaderId(filter){
//     if (filter == null || filter == this.state.filter) {
//       this.setState({ items: this.todos.filterHeaderId(this.state.filter , this.state.currentHeaderId) });
//     } else {
//       this.setState({ filter, items: this.todos.filterHeaderId(filter, this.state.currentHeaderId) });
//     }
//   }

//   inputText = event => {
//     this.setState({ newTodo: event.target.value });
//   };

//   newTodoKeyDown = event => {
//     if (event.keyCode == KeyCode.Enter) {
//       event.preventDefault();
//       var title = this.state.newTodo.trim();
//       if (title) {
//         this.todos.add(title);
//         this.setState({ newTodo: "" });
//         const filter =
//           this.state.filter == "completed" ? "active" : this.state.filter;
//         this.loadItems(filter);
//       }
//     }
//   };

//   toggle = todo => {
//     return () => {
//       this.todos.toggle(todo);
//       this.loadItems();
//     };
//   };

//   update = todo => {

//     todo.headerId= this.state.currentHeaderId
//     console.log("curentHeader ID", this.state.currentHeaderId)

//     return newName => {

//       this.todos.rename(todo.id, newName);
//       this.loadItems();
//     };
//   };

//   destroy = todo => {
//     return () => {
//       this.todos.delete(todo);
//       this.loadItems();
//     };
//   };

//   hashchange = () => {
//     this.loadItems(getHashPath());
//   };

//   componentDidMount() {
//     this.loadItems();
//     window.addEventListener("hashchange", this.hashchange);
//   }

//   componentWillUnmount() {
//     window.removeEventListener("hashchange", this.hashchange);
//   }


//   updateHeader(event, name, id){
//       let {headers}=this.state
//       console.log("UpdateHeaderId: ", id)

//       headers.map(header =>{
              //      if(header.id == id ){
              //        header.name = name 
              //      }
              //  })
//       this.setState({headers: headers, currentHeaderId: id})
           
         
      
//   }

//   updateCurrentHeader(event, name, id){
  

//     console.log("UpdateCurrentHeaderId: ", id)
//     this.setState({currentHeaderId: id})
         
       
    
// }


//   deleteHeader(event, name, id ){

//        let {headers}=this.state

//        let count = 0 
//        let count1=-1


//        headers.map(header=>{
//          if(header.id == id ){
//             count1=count
//          }
//          count++
//        })
//        headers.splice(count1, 1)
//        console.log("delete headers: " , headers )

       
//        this.setState({
//          headers: headers
//        })

//        // delete all the tods with the ids too 

//   }

//   addHeader(event, name){

  
//     let {headers} =this.state
//     let curId= (headers.length)
//     if(curId < 0 ){
//       curId =0
//     }
//     headers.push({
//        id: curId,
//        name: 'New List'
//     })

//     console.log(" curren id 1 : ", curId)
//     console.log("headers: ", headers)
//     this.setState({
//       headers: headers,
//       currentHeaderId: (headers.length - 1)
//     })
//   }




//   render() {
//     const { newTodo, filter, items, headers} = this.state;

//     return (
//       <Page>
//         <GlobalStyle />

//           <input type="submit" value="add" onClick={this.addHeader} ></input>
//         { 

//         ()=>{
//         return (
//          <Grid> 
//          headers.map((header)=>{

          
//            <div>
//            <Header  id={header.id} name={header.name} onClick={this.updateCurrentHeader} onChange={this.updateHeader} onDelete={this.onDelete} />
//            <Header  id={header.id} name={header.name} onClick={this.updateCurrentHeader} onChange={this.updateHeader} onDelete={this.onDelete} />

//            </div>
           

           
          
//          })
//          </Grid>)
//         }
          
//         }
        
      
//         <Title>todos</Title>
//         <TodoApp>
//           <label className="indicator">❯</label>
//           <Input
//             placeholder="What needs to be done?"
//             value={newTodo}
//             onChange={this.inputText}
//             onKeyDown={this.newTodoKeyDown}
//             autoFocus={true}
//           />
//           <TodoList>
//             {items.map((todo, index) => (
//               <TodoItem
//                 key={index}
//                 todo={todo}
//                 filter={filter}
//                 onToggle={this.toggle(todo)}
//                 onUpdate={this.update(todo)}
//                 onDestroy={this.destroy(todo)}
//               />
//             ))}
//           </TodoList>
//           <Footer filter={filter} itemCount={items.length} />
//         </TodoApp>
//         <footer className="info">
//           <p>Double-click to edit a todo</p>
//           <p>
//             An adaptation of <a href="http://todomvc.com">TodoMVC</a>
//           </p>
//         </footer>
//       </Page>
//     );
//   }
// }


class App extends React.Component {

   constructor(props){
        super(props)

        this.onClickHeader=this.onClickHeader.bind(this, "")
        this.onDeleteHeader=this.onDeleteHeader.bind(this)
   }

   onClickHeader(event,  name){
    console.log(`name : ${name.target.value}`)

   }

   onDeleteHeader(event, name ){


    console.log(`delete : ${name.target.value}`)
   }

  

  render(){ 
    return (
    <Grid> 
       <Col><Header   onClick={this.onClickHeader} onDelete={this.onDeleteHeader} /></Col> 
       <Col>  <Header   onClick={this.onClickHeader} onDelete={this.onDeleteHeader} /></Col> 

       <Col>  <Header   onClick={this.onClickHeader} onDelete={this.onDeleteHeader} /></Col> 

     </Grid>
   
  );

  }
}

export default App;
