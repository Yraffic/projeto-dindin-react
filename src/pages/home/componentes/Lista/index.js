import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import api from '../../../../services/api'
import ModalEditar from  '../../../../componentes/modalEditar'
import { getItem } from '../../../../utils/Storege'
import { useState, forwardRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'data', headerName: 'Data', width: 136 },
  { field: 'dia', headerName: 'Dia da semana', width: 136 },
  { field: 'tipo', headerName: 'Tipo', width: 136 },
  { field: 'categoria_nome', headerName: 'Categoria', width: 136 },
  { field: 'descricao', headerName: 'Descrição', width: 136 },
  { field: 'valor', headerName: 'Valor', type: 'number', width: 90},
];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DataTable({ lista, setLista, categoria }) {
  const [itemClicado, setItemClicado] = useState([])
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false)
  
  function handleOpenEdit(){
    setOpenEdit(true)
  }

  function handleCloseEdit(){
    setOpenEdit(false)
  }

  function handleClickOpen(){
    setOpen(true)
  };


  function handleClose(){
    setOpen(false)
  };
  
  async function deletarTransao(id) {
    try {
      const resposta = await api.delete(`/transacao/${id}`, {
        headers: {
          Authorization: `Bearer ${getItem('token')}`
        }
      })

      const respostaLista = await api.get('/transacao', {
        headers: {
          Authorization: `Bearer ${getItem('token')}`
        }
      })
      setLista([...respostaLista.data])
      setOpen(false)
      return 
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
      <div style={{ height: 400, width: '816px' }}>
        <Button
          variant="outlined"
          onClick={()=> handleClickOpen()}
        >
          Deletar
        </Button>
        <Button
          variant="outlined"
          onClick={()=> handleOpenEdit()}
        >
          Editar
        </Button>
        <DataGrid
          rows={lista}
          onRowClick={(item) => setItemClicado(item.row)}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Deseja deletar essa transação?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
               confirme para continuar!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={()=> deletarTransao(itemClicado.id)}>Confirmar</Button>
          </DialogActions>
        </Dialog>
          <ModalEditar 
            openEdit={openEdit}
            categoria={categoria} 
            handleCloseEdit={handleCloseEdit}
            itemClicado={itemClicado}
            setLista={setLista}
          />

      </div>
    </>
  );
}