import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import { useState } from "react";
import { v4 as uuid } from "uuid";

const App = () => {

    const [todo, setTodo] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const [search_item1, setSearchItem1] = useState("");
    const [search_item2, setSearchItem2] = useState("");
    const [search_item3, setSearchItem3] = useState("");

    const [searched_item1, setSearchedItem1] = useState({
        query: '',
        list: []
    })
    const [searched_item2, setSearchedItem2] = useState({
        query: '',
        list: []
    })
    const [searched_item3, setSearchedItem3] = useState({
        query: '',
        list: []
    })

    const [final_item, setFinalItem] = useState({
        query: '',
        list: []
    })

    const [options, setOptions] = useState([
        { label: 'Select category', val: '' },
    ]);

    const [todos, setTodos] = useState([]);


    /// local storage
    useEffect(() => {
        let arr = localStorage.getItem("todos");
        if (arr) {
            setTodos(JSON.parse(arr));
        } else {
            setTodos([]);
        }

        let opt = localStorage.getItem("options");
        if (opt) {
            setOptions(JSON.parse(opt));
        } else {
            setOptions([{ label: 'Select category', val: '' }])
        }
    }, [])

    // setSearch_item1, 2, 3... were taking time to set values and there function i.e. 
    // handlechange(), 1,2,.. were functioning before the values could be saved
    // used useEffect to synchronice, let the value be saved then call function.
    useEffect(() => {
        handleChange1();
    }, [search_item1]);

    useEffect(() => {
        handleChange2();
    }, [search_item2]);

    useEffect(() => {
        handleChange3();
    }, [search_item3]);

    ///---------------------------------------------------------------------------

    useEffect(() => {
        finalHandleChange();
    }, [searched_item1]);

    useEffect(() => {
        finalHandleChange();
    }, [searched_item2]);

    useEffect(() => {
        finalHandleChange();
    }, [searched_item3]);

    // ----------------------------------------------------------------------------

    const addTodo = () => {
        const id = uuid();
        // setTodos([...todos, todo]);
        setTodos([...todos, { id: id, text: todo, status: false, type: category, time: date }]);
        localStorage.setItem("todos", JSON.stringify([...todos, { id: id, text: todo, status: false, type: category, time: date }]));

        setOptions([...options, { label: category, val: category }]);
        localStorage.setItem("options", JSON.stringify([...options, { label: category, val: category }]))
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((t) => (t.id !== id)))
        localStorage.setItem("todos", JSON.stringify(todos.filter((t) => (t.id !== id))));

        if (final_item.query !== '') {
            setFinalItem({
                query: final_item.query,
                list: final_item.list.filter((t) => (t.id !== id))
            })
        }
    }

    const markasdone = (id) => {
        setTodos(
            todos.map((t) => {
                if (t.id === id) {
                    t.status = !t.status;
                }
                return t;
            })
        )
    }


    const handleChange1 = () => {
        // console.log(e.target.value);
        const results = todos.filter(todo => {
            if (search_item1 === "") return todo
            return todo.time === search_item1 ? todo : console.log("date does not exist");
        })

        // console.log(results);
        setSearchedItem1({
            query: search_item1,
            list: results
        })

        finalHandleChange();
    }

    const handleChange2 = () => {
        // console.log(e.target.value + "vwve");
        const results = todos.filter(todo => {
            if (search_item2 === "") return todo
            return todo.text.includes(search_item2)
        })

        // console.log(results);
        setSearchedItem2({
            query: search_item2,
            list: results
        })

        // console.log("e : ", e.target.value);
        // console.log("search_item2 : ", search_item2);
        // console.log("list : ", searched_item2.list);
        finalHandleChange();
    }

    const handleChange3 = () => {
        // console.log("handlechange3 called");
        console.log("type of :", typeof (search_item3))
        const results = todos.filter(todo => {
            // if (search_item3 === "") return todo
            return todo.type == search_item3 ? todo : console.log("not found");
            // return String(todo.type) === search_item3 ? todo : console.log("not found");
        })

        // console.log(results);
        setSearchedItem3({
            query: search_item3,
            list: results
        })

        finalHandleChange();
    }

    function getCommon(array1, array2) {
        return array1.filter(object1 => {
            return array2.some(object2 => {
                return object1.id === object2.id;
            });
        });
    }


    const finalHandleChange = () => {
        // console.log("final handle change called");
        if (search_item2.length === 0 && search_item3.length === 0 && search_item1.length === 0) {
            // console.log("nothign to display right now");
            return;
        } else if (search_item1.length === 0 && search_item2.length === 0) {
            setFinalItem({
                query: searched_item3.query,
                list: searched_item3.list
            })
            return;
        } else if (search_item1.length === 0 && search_item3.length === 0) {
            setFinalItem({
                query: searched_item2.query,
                list: searched_item2.list
            })
        } else if (search_item2.length === 0 && search_item3.length === 0) {
            setFinalItem({
                query: searched_item1.query,
                list: searched_item1.list
            })
        } else if (search_item1.length === 0) {
            const arr = getCommon(searched_item2.list, searched_item3.list);
            setFinalItem({
                query: searched_item2.query,
                list: arr
            })
        } else if (search_item2.length === 0) {
            const arr = getCommon(searched_item1.list, searched_item3.list);
            setFinalItem({
                query: searched_item3.query,
                list: arr
            })
        }
        else if (search_item3.length === 0) {
            const arr = getCommon(searched_item1.list, searched_item2.list);
            setFinalItem({
                query: searched_item1.query,
                list: arr
            })
        } else {
            const arr = getCommon(searched_item1.list, searched_item2.list);
            const arr2 = getCommon(arr, searched_item3.list);
            setFinalItem({
                query: searched_item1.query + searched_item2.query + searched_item3.query,
                list: arr2
            })
        }

    }

    return (
        <>
            <h1>To-Do List :</h1>
            <div>
                <input type="text"
                    placeholder="reminder here.."
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                />
                <input type="date"
                    placeholder="Date..."
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <input type="text"
                    placeholder="Category.."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <button onClick={() => {
                    (date === "" || todo === "" || category === "") ? alert("some fields are empty!!") : addTodo()
                }}>Add</button>
            </div>

            <div>
                <input type="text"
                    placeholder="write here..."
                    value={search_item2}
                    onChange={(e) => {
                        setSearchItem2(e.target.value);
                    }}
                />
                <input type="date"
                    value={search_item1}
                    onChange={(e) => setSearchItem1(e.target.value)}
                />
                <select
                    value={search_item3}
                    onChange={(e) => {
                        setSearchItem3(e.target.value)
                    }}
                >
                    {options.map((option) => (
                        <option val={option.val}>{option.label}</option>
                    ))}
                </select>
                <h3>Filtered out :</h3>
                <ol>
                    {(final_item.query === '' ? "" : final_item.list.map(todo => {
                        return <li>
                            <button type="checkbox" onClick={() => { markasdone(todo.id) }} />
                            {todo.status === true ? <s>{todo.text}</s> : todo.text} {<br />}
                            {todo.time} {<br />}
                            {todo.type} {<br />}
                            <button onClick={() => { deleteTodo(todo.id) }}>Delete</button> {<br />}
                        </li>
                    }))}
                </ol>

            </div>
            <div className="todos">
                <h3>All Todos :</h3>
                <ol>
                    {todos.map((todo) => {
                        return <li>
                            <button type="checkbox" onClick={() => { markasdone(todo.id) }} />
                            {todo.status === true ? <s>{todo.text}</s> : todo.text} {<br />}
                            {todo.time} {" "}{<br />}
                            {todo.type} {" "}{<br />}
                            <button onClick={() => { deleteTodo(todo.id) }}>Delete</button> {<br />}</li>
                    })}
                </ol>
            </div>
        </>
    )
}

ReactDOM.render(<App />, document.getElementById("root"));