import api from '../../services/api'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { getItem } from '../../utils/Storege'


export default function DetalharUsuario({openDetalhar, setOpenDetalhar}) {
    const [email, setEmail] = useState('')
    const [nome, setNome] = useState('')

    async function detalharItem() {
        try {
            const  localArray = []
            const resposta = await api.get(`/usuario`, {
                headers: {
                    Authorization: `Bearer ${getItem('token')}`
                }
            })
            localArray.push(resposta.data)
            setEmail(localArray[0].email)
            setNome(localArray[0].nome)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        detalharItem()
    }, [openDetalhar])
    return (
        <>
            <div>
                <Dialog open={openDetalhar} onClose={() => setOpenDetalhar(false)}>
                    <DialogTitle>Informações do Usuario</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email"
                            type="text"
                            fullWidth
                            value={email}
                            variant="outlined"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Usuário"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={nome}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDetalhar(false)}>Fechar</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}