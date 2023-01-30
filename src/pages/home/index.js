import './style.css'
import { useEffect, useState } from 'react'
import { getItem } from '../../utils/Storege'
import Lista from './componentes/Lista'
import Navbar from '../../componentes/header'
import api from '../../services/api'
import ModalCadastrarTransacao from '../../componentes/modal'
import { format } from 'date-fns'
import ptBR from 'date-fns/esm/locale/pt-BR/index.js'
export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [categoria, setCategoria] = useState([])
  const [lista, setLista] = useState([])
  const [valorEntrada, setValorEntrada] = useState([])
  const [valorSaida, setValorSaida] = useState([])
  const [valorTotal, setValorTotal] = useState([])

  function abrirModal() {
    setShowModal(true)
    handleCategorias()
  }
  async function categorias() {
    try {
      const localArray = [...categoria]

      const resposta = await api.get('/categoria', {
        headers: {
          Authorization: `Bearer ${getItem('token')}`
        }
      })

      localArray.push(resposta.data)
      setCategoria(localArray)
    } catch (error) {
      console.log(error)
    }
  }

  async function transacoes() {
    try {
      const localArray = [...lista]

      const resposta = await api.get('/transacao', {
        headers: {
          Authorization: `Bearer ${getItem('token')}`
        }
      })
      const respostaLista = resposta.data.map((item) => {
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
      localArray.push(respostaLista)

      setLista([...localArray[0]])
    } catch (error) {
      console.log(error)
    }
  }

  function handleCategorias() {

  }
  useEffect(() => {
    handleCategorias(categorias())
  }, [])

  useEffect(() => {
    transacoes()
  }, [])
  useEffect(()=>{
    setValorEntrada('')
    setValorSaida('')
    setValorTotal('')
    const localArray = [...lista]
    const valoresEntrada = []
    let  valorEntrada;
    for(let i of localArray){
      let contador = 0
      if(i.tipo === 'entrada'){
        valoresEntrada.push(Number(i.valor))
      }
      for(let j of valoresEntrada){
        contador += j
      }
      valorEntrada = contador
    }
    setValorEntrada(valorEntrada)

    const valoresSaida = []
    let  valorSaida;
    for(let i of localArray){
      let contador = 0
      if(i.tipo === 'saida'){
        valoresSaida.push(Number(i.valor))
      }
      for(let j of valoresSaida){
        contador += j
      }
      valorSaida = contador
    }
    setValorSaida(valorSaida)
    const total = valorEntrada + valorSaida
    setValorTotal(total)
  },[showModal, lista])
  return (
    <div className='conteiner-home'>
      <Navbar />
      <div className='registros'>
        <div className="conteiner-informacao">
          <Lista
            lista={lista}
            transacoes={transacoes}
            setLista={setLista}
            key={lista.id}
            categoria={categoria}
          />
        </div>
        <div className='adicionar-registro'>
          <div className='resumo'>
            <h1>Resumo</h1>
            <div className='entradas'>
              <div className='resumo-entrada'>
                <p>Entradas</p>
                <p className='valor-entrada'>R$ 0</p>
              </div>
              <div className='resumo-saida'>
                <p>Saídas</p>
                <p className='valor-saida'>R$ 0</p>
              </div>
            </div>
            <div className='saldo'>
              <h2>Saldo</h2>
              <p className='valor-saldo'>R$ 0</p>
            </div>
          </div>
          <button
            className='add-registro'
            onClick={() => abrirModal()}
          >
            Adicionar Registro
          </button>
        </div>
      </div>
      {showModal &&
        <ModalCadastrarTransacao
          showModal={showModal}
          setLista={setLista}
          categoria={categoria}
          transacoes={transacoes}
          setShowModal={setShowModal}
        />
      }
    </div>
  )
}