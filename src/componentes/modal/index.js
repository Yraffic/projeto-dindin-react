import api from '../../services/api'
import { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { getItem } from '../../utils/Storege'
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns'
import ptBR from 'date-fns/esm/locale/pt-BR/index.js'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function ModalCadastrarTransacao(
    {
        showModal,
        setShowModal,
        categoria,
        setLista,
        transacoes
    }) {
    const [tipo, setTipo] = useState('')
    const [valor, setValor] = useState('')
    const [data, setData] = useState('')
    const [descricao, setDescricao] = useState('')
    const [categoria_id, setCategoria_id] = useState('')
    const theme = useTheme();
    const [personName, setPersonName] = useState([]);


    const opcoesCategoria = categoria[0].map((item) => {
        return { names: item.descricao, id: item.id }
    })
    const names = opcoesCategoria

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (!valor || !tipo || !data || !descricao) {
                alert('Os campos são obrigatórios!')
            }

            const idUser = getItem('userId')

            console.log({ tipo, descricao, valor, data, categoria_id, idUser })
            const resposta = await api.post('/transacao', {
                tipo, descricao, valor, data, categoria_id, idUser
            }, {
                headers: {
                    Authorization: `Bearer ${getItem('token')}`
                }
            })
            const respostaLista = await api.get('/transacao', {
                headers: {
                    Authorization: `Bearer ${getItem('token')}`
                }
            })
            const respostaFormatada = respostaLista.data.map((item) => {
                const date = new Date(item.data)
                const formatarDia = format(date, 'eee',{
                  locale: ptBR
                })
                const formatar = Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short'
                })
                const itensArray = {
                  id: item.id,
                  usuario_id: item.usuario_id,
                  categoria_id: item.categoria_id,
                  categoria_nome: item.categoria_nome,
                  data: formatar.format(date),
                  dia: formatarDia,
                  tipo: item.tipo,
                  descricao: item.descricao,
                  valor: item.valor
                }
                return itensArray
              })
            setLista([...respostaFormatada])
            
            if (resposta.data) {
                alert('transacao cadastrada!')
                setShowModal(false)
            }

        } catch (error) {
            if (error) {
                alert('algo deu errado, tente novamente!')
            }
            console.log(error)
        }
    }

    function fecharModal() {
        setShowModal(false)
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        )
    };
    return (
        <>
            <div>
                <Dialog open={showModal} onClose={fecharModal}>
                    <DialogTitle>Adcionar transação</DialogTitle>
                    <DialogContent>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Tipo</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel
                                    value="entrada"
                                    control={<Radio />}
                                    label="Entrada"
                                    onClick={(e) => setTipo(e.target.value)}
                                />
                                <FormControlLabel
                                    value="saida"
                                    control={<Radio />}
                                    label="Saída"
                                    onClick={(e) => setTipo(e.target.value)}
                                />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Valor"
                            type="number"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setValor(e.target.value)}
                        />
                        <FormControl sx={{ width: '550px' }}>
                            <Select
                                multiple
                                displayEmpty
                                value={personName}
                                onChange={handleChange}
                                input={<OutlinedInput />}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return <em>Categoria</em>;
                                    }

                                    return selected;
                                }}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem disabled value="">
                                    <em>Categoria</em>
                                </MenuItem>
                                {names.map((name) => (
                                    <MenuItem
                                        key={name.names}
                                        value={name.names}
                                        onClick={() => setCategoria_id(name.id)}
                                        style={getStyles(name.names, personName, theme)}
                                    >
                                        {name.names}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            type="date"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setData(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Descrição"
                            type="text"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={fecharModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Cadastrar</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}