import React, { useEffect, useState } from 'react';
import './Todos.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

interface Todo {
    id: string;
    title: string;
    isDone: boolean;
};

interface TodosProps {
    filter: string;
};

const Todos: React.FC<TodosProps> = ({ filter }) => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [novoTodo, setNovoTodo] = useState<string>('');
    const [editarButton, setEditarButton] = useState<boolean>(false);
    const [todoSelecionado, setTodoSelecionado] = useState<string>('');

    const fetchTodos = async (): Promise<void> => {
        try {
            const response = await axios.get('https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos');
            setTodos(response.data);
        } catch(error) {
            console.log(error);
        };
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (editarButton && e.key === 'Enter') {
            e.preventDefault();
            handleEdit();
        } else if (e.key === 'Enter' && novoTodo.trim() !== '') {
            const novoTodoItem = {
                id: Date.now().toString(),
                title: novoTodo,
                isDone: false,
            };
            setTodos([...todos, novoTodoItem]);
            setNovoTodo('');
        };
    };

    const removerTodo = (id: string): void => {
        setTodos((prev) => {
            return prev.filter((todo) => todo.id !== id)
        });
    };

    const handleSelect = (id: string): void => {
        const selectedTodo = todos.find(todo => todo.id === id);
        // Para não editar a tarefa se fosse concluida
        if(selectedTodo?.isDone) return;
        if(selectedTodo) {
            setNovoTodo(selectedTodo.title);
            setEditarButton(true);
            setTodoSelecionado(id);
        }
    };

    const handleEdit = (): void => {
        if(novoTodo.trim() === '') return;
        if (todoSelecionado !== null) {
            const updatedTodos = todos.map(todo =>
                todo.id === todoSelecionado ? { ...todo, title: novoTodo } : todo
            );
            setTodos(updatedTodos);
            setNovoTodo('');
            setEditarButton(false);
            setTodoSelecionado('');
        }
    };

    const toggleAllTodos = (): void => {
        const concluidas = todos.every(todo => todo.isDone);
        setTodos(todos.map(todo => ({ ...todo, isDone: !concluidas })));
    };

    const toggleTodo = (id: string): void => {
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.id === id ? { ...todo, isDone: !todo.isDone } : todo));
    };

    const todosIncompletas = (): number => {
        const incompletas = todos.filter(todo => !todo.isDone);
        return incompletas.length;
    };

    const removerConcluidas = (): void => {
        setTodos((prev) => prev.filter((todo) => !todo.isDone));
    };

    // Para mostrar o botão de limpar tarefas concluidas
    const temTodosConcluidas: boolean = todos.some(todo => todo.isDone);

    const filteredTodos: Todo[] = todos.filter(todo => {
        if (filter === 'active') return !todo.isDone;
        if (filter === 'completed') return todo.isDone;
        return true;
    });

    return (
        <main className='todos'>
            <div className='criacao'>
                <FontAwesomeIcon 
                    icon={faChevronDown}
                    onClick={toggleAllTodos}
                />
                <input 
                    type="text" 
                    value={novoTodo}
                    onChange={(e) => setNovoTodo(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='What needs to be done?'
                />
                { editarButton && <button onClick={handleEdit}>Editar</button> }
            </div>
            { filteredTodos.length > 0 && (
                <>
                    <div className='todos'>
                        {filteredTodos.map((todo, id) => (
                            <div key={id}>
                                <div className="checkbox">
                                    <input 
                                        type="checkbox" 
                                        id={todo.id} 
                                        checked={todo.isDone}
                                        onChange={() => toggleTodo(todo.id)}
                                    />
                                    <label htmlFor={todo.id} className="check"></label>
                                </div>
                                <p 
                                    className={todo.isDone ? 'concluida' : ''}
                                    title='Clique duas vezes para editar' onDoubleClick={() => handleSelect(todo.id)}
                                >{todo.title}</p>
                                <span className='remover' onClick={() => removerTodo(todo.id)}>X</span>
                            </div>
                        ))}
                    </div>
                    <div className='filtros'>
                        <span>{todosIncompletas()} items left</span>
                        <nav>
                            <NavLink to='/'>All</NavLink>
                            <NavLink to='/active'>Active</NavLink>
                            <NavLink to='/completed'>Completed</NavLink>
                        </nav>
                        { temTodosConcluidas && (
                            <button 
                                className='clear' 
                                onClick={removerConcluidas}
                            >Clear Completed</button>
                        )}
                    </div>
                </>
            )}
        </main>
    );
};

export default Todos;