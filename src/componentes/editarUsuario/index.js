import api from '../../services/api'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { getItem, setItem } from '../../utils/Storege'


export default function EditarUsuario({open, setOpen}) {
    const [email, setEmail] = useState('')
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
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
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if(!email || !nome || !senha){
                return alert('todos os campos devem ser preenchidos!')
            }
            if(senha.length < 7){
                return alert('senha deve ter 8 ou mais digítos!')
            }
            if(senha !== confirmacaoSenha){
                alert('senha e confirmação devem ser iguais')
                return
            }
            const resposta = await api.put('/usuario', {
                email, nome, senha
            }, {
                headers: {
                    Authorization: `Bearer ${getItem('token')}`
                }
            })
            setItem('userNome', nome)
            if(resposta.data){
                alert('usuario editado!')
                setOpen(false)
                return
            }
        } catch (error) {
            if (error) {
                alert('algo deu errado, tente novamente!')
            }
            console.log(error)
        }
    }
    useEffect(() => {
        detalharItem()
    }, [open])
    return (
        <>
            <div>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Editar usuario</DialogTitle>
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
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Nova Senha"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Confirmaçao da senha"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setConfirmacaoSenha(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Editar</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}