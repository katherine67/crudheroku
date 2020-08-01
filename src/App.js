import React from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';


const url="https://arcane-lake-16312.herokuapp.com/read.php";
const url1="https://arcane-lake-16312.herokuapp.com/insert.php";

class App extends React.Component {
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      id:'',
      Nombres:'',
      Correo:'',
      Contraseña:'',
      tipoModal:''
    }
  }

peticionGet=()=>{
  axios.get(url).then(Response=>{
    this.setState({data: Response.data});
  }).catch(error=>{
    console.log(error.menssage);
  })
}

peticionPost=async()=>{
  delete this.state.form.id;
 await axios.post(url1,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.menssage);
  })
}

peticionPut=()=>{
  axios.put(url+this.state.form.id, this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  })
}

peticionDelete=()=>{
  axios.delete(url+this.state.form.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}


modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

seleccionarUsuarios=(usuarios)=>{
  this.setState({
  tipoModal: 'actualizar',
  form: {
  id: usuarios.id,
  Nombres: usuarios.Nombres,
  Correo: usuarios.Correo,
  Contraseña: usuarios.Contraseña

    }
  })
}

handleChange=async e=>{
e.persist();
await this.setState({ 
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});
console.log(this.state.form);
}

componentDidMount(){
 this.peticionGet();
}

  render(){
    const {form}=this.state;
    return(
      <div className="App">
        <br/>
        <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar usuario</button>
        <br /><br/>
        <table className="table">
          <thead>
            <tr>
              <td>ID</td>
              <td>Nombres</td>
              <td>Correo</td>
              <td>Contraseña</td>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(usuarios=>{
              return(
                <tr>
                <td>{usuarios.id}</td>
                <td>{usuarios.Nombres}</td>
                <td>{usuarios.Correo}</td>
                <td>{usuarios.Contraseña}</td>
                
                <td>
                  <button className="btn btn-primary" onClick={()=>{this.seleccionarUsuarios(usuarios); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                  {" "}
                  <button className="btn btn-danger" onClick={()=>{this.seleccionarUsuarios(usuarios); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>

                </tr>
              )
            })}
          </tbody>
        </table>


        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{display: 'block'}}>
            <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
              <br/>
              <label htmlFor="id">Nombres</label>
              <input className="form-control" type="text" name="Nombres" id="Nombres" onChange={this.handleChange} value={form?form.Nombres: ''}/>
              <br/>
              <label htmlFor="id">Correo</label>
              <input className="form-control" type="text" name="Correo" id="Correo" onChange={this.handleChange} value={form?form.Correo: ''}/>
              <br/>
              <label htmlFor="id">Contraseña</label>
              <input className="form-control" type="text" name="Contraseña" id="Contraseña" onChange={this.handleChange} value={form?form.Contraseña: ''}/>
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal=='insertar'?
            <button className="btn btn-success" onClick={()=>this.peticionPost()}>
              Insertar
            </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
               Actualizar
           </button>
  }
             
            <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


      <Modal isOpen={this.state.modalEliminar}>
        <ModalBody>
          Estas Seguro de elimitar Usuario? {form && form.Nombres}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Si</button>
          <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
        </ModalFooter>
      </Modal>
      </div>

    );
  }
}
export default App;
