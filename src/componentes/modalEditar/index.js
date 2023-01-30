import api from '../../services/api'
import { useEffect, useState } from 'react'
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
export default function ModalEditar(
    {
        categoria,
        setLista,
        handleCloseEdit,
        openEdit,
        itemClicado
    }) {
    let [tipo, setTipo] = useState('')
    let [valor, setValor] = useState('')
    let [data, setData] = useState('')
    let [descricao, setDescricao] = useState('')
    let [categoria_id, setCategoria_id] = useState('')
    let [categoriaNome, setCategoriaNome] = useState('')
    let theme = useTheme();
    let [personName, setPersonName] = useState([]);
    let [selectEntrada, setSelectEntrada] = useState(false)
    let [selectSaida, setSelecSaida] = useState(false)
    
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        )
    };
    async function detalharItem() {
        try {
            const { id } = itemClicado

            const resposta = await api.get(`/transacao/${id}`, {
                headers: {
                    Authorization: `Bearer ${getItem('token')}`
                }
            })
            const respostaLista = resposta.data.map((item) => {
                const date = new Date(item.data)
                const formatarDia = format(date, 'eee', {
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
            setValor(respostaLista[0].valor)
            if (respostaLista[0].tipo === 'entrada') {
                setSelectEntrada(true)
            } else if (respostaLista[0].tipo === 'saida') {
                setSelecSaida(true)
            }
            setData(respostaLista[0].data)
            setDescricao(respostaLista[0].descricao)
            setCategoriaNome(respostaLista[0].categoria_nome)
            setCategoria_id(respostaLista[0].categoria_id)
        } catch (error) {
            console.log(error)
        }
    }
    function radioGroup(value) {
        if (value === 'entrada' && selectSaida === true) {
            setSelecSaida(false)
            setSelectEntrada(true)
            setTipo(value)
        } else if (value === 'saida' && selectEntrada === true) {
            setSelectEntrada(false)
            setSelecSaida(true)
            setTipo(value)
        }
        return
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (!valor || !tipo || !data || !descricao) {
                alert('Os campos são obrigatórios!')
            }
            const usuario_id = getItem('userId')
            const { id } = itemClicado
            const resposta = await api.put(`/transacao/${id}`, {
                tipo, descricao, valor, data, categoria_id, usuario_id
            }, {
                headers: {
                    Authorization: `Bearer ${getItem('token')}`
                }
            }
            )
            const respostaLista = await api.get('/transacao', {
                headers: {
                    Authorization: `Bearer ${getItem('token')}`
                }
            })
            const respostaFormatada = respostaLista.data.map((item) => {
                const date = new Date(item.data)
                const formatarDia = format(date, 'eee', {
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
        } catch (error) {
            if (error) {
                alert('algo deu errado, tente novamente!')
            }
            console.log(error)
        }
    }
    useEffect(() => {
        detalharItem()
    }, [openEdit])
    return (
        <>
            <div>
                <Dialog open={openEdit} onClose={() => handleCloseEdit(false)}>
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
                                    checked={selectEntrada}
                                    onClick={(e) => radioGroup(e.target.value)}
                                />
                                <FormControlLabel
                                    value="saida"
                                    control={<Radio />}
                                    checked={selectSaida}
                                    label="Saída"
                                    onClick={(e) => radioGroup(e.target.value)}
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
                            value={valor}
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
                                        return <em>{categoriaNome}</em>;
                                    }

                                    return selected;
                                }}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem disabled value="">
                                    <em>Categoria</em>
                                </MenuItem>
                                {categoria[0] ?
                                    categoria[0].map((name) => (
                                        <MenuItem
                                            key={name.descricao}
                                            value={name.descricao}
                                            onClick={() => setCategoria_id(name.id)}
                                            style={getStyles(name.descricao, personName, theme)}
                                        >
                                            {name.descricao}
                                        </MenuItem>
                                    )) :
                                    <></>
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={data}
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
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCloseEdit(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Editar</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}