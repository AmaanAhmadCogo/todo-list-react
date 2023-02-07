import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import { useState } from "react";
import { v4 as uuid } from "uuid";

import { MdOutlineLibraryAdd } from "react-icons/md"

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

        // setTodo("");
        // setCategory("");

        alert("A to-do has been succesfully added!");

        window.location.reload(true);
    };

    const deleteTodo = (id) => {

        if (todos.length === 1) {
            localStorage.clear();
            window.location.reload(true);
        } 

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
        const results = todos.filter(todo => {
            if (search_item2 === "") return todo
            return todo.text.toLowerCase().includes(search_item2.toLowerCase())
        })

        setSearchedItem2({
            query: search_item2,
            list: results
        })
        finalHandleChange();
    }

    const handleChange3 = () => {
        const results = todos.filter(todo => {
            return todo.type == search_item3 ? todo : console.log("not found");
        })

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

        if (search_item2.length === 0 && search_item3.length === 0 && search_item1.length === 0) {
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
            <div style={{
                display: "flex",
                justfyContent: "center",
                alignItems: "center",
                fontFamily: 'Pacifico',
                marginLeft:"30px"
            }}>
                <h1>To-Do List :</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontFamily: "Caveat" }}>
                <div style={{ paddingLeft: "30px" }}><h3 style={{ fontSize: "20px" }}>Add a todo : </h3></div>

                <div style={{ paddingLeft: "40px", display: "flex", justifyContent: "center" }}>
                    <input type="text"
                        placeholder="reminder here.."
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                        style={{ width: "200px", height: "20px", fontFamily: "Caveat", fontSize: "20px" }}
                    />
                    &nbsp;
                    <input type="date"
                        placeholder="Date..."
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ width: "200px", height: "22px" }}
                    />
                    &nbsp;
                    <input type="text"
                        placeholder="Category.."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: "200px", height: "20px", fontFamily: "Caveat", fontSize: "20px" }}
                    />
                    &nbsp;
                    <MdOutlineLibraryAdd size={24} onClick={() => {
                        (date === "" || todo === "" || category === "") ? alert("some fields are empty!!") : addTodo()
                    }} />
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", fontFamily: "Caveat" }}>
                <div className="todos">
                    <h3 style={{ fontSize: "30px" }}>All Todos :</h3>
                    <ol>
                        {todos.map((todo) => {
                            return (
                                <li>
                                    <div style={styles.todos}>
                                        <span>{"Date: " + todo.time} &nbsp;<br /></span>
                                        <span>{"Category: " + todo.type} &nbsp;<br /></span>
                                        <span>Task:<br /></span>
                                        <span>{todo.status === true ? <s>{todo.text}</s> : todo.text} &nbsp;<br /></span>
                                        <span style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                            <span><button type="checkbox" style={styles.checkbox} onClick={() => {
                                                markasdone(todo.id);
                                            }} >Done</button></span>
                                            <span><button style={styles.delete} onClick={() => { deleteTodo(todo.id) }}>Delete</button> <br /></span>
                                        </span>
                                    </div>
                                </li>)
                        })}
                    </ol>
                </div>
                <div>
                    <h3 style={{ fontSize: "30px" }}>Filtered out :</h3>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input type="text"
                            placeholder="write here..."
                            value={search_item2}
                            onChange={(e) => {
                                setSearchItem2(e.target.value);
                            }}
                            style={{ width: "150px", height: "20px", fontFamily: "Caveat", fontSize: "20px" }}
                        />
                        &nbsp;
                        <input type="date"
                            value={search_item1}
                            onChange={(e) => setSearchItem1(e.target.value)}
                            style={{ width: "150px", height: "22px" }}
                        />
                        &nbsp;
                        <select
                            value={search_item3}
                            onChange={(e) => {
                                setSearchItem3(e.target.value)
                            }}
                            style={{ width: "150px", height: "26px", fontFamily: "Caveat", fontSize: "20px" }}
                        >
                            {options.map((option) => (
                                <option val={option.val}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <ol>
                        {(final_item.query === '' ? "" : final_item.list.map(todo => {
                            return (
                                <li>
                                    <div style={styles.todos}>
                                        <span>{"Date: " + todo.time} &nbsp;<br/></span>
                                        <span>{"Category: " + todo.type} &nbsp;<br /></span>
                                        <span>Task:<br /></span>
                                        <span>{todo.status === true ? <s>{todo.text}</s> : todo.text} <br /></span>
                                        <span style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                            <span><button type="checkbox" style={styles.checkbox} onClick={() => {
                                                markasdone(todo.id);
                                            }} >Done</button></span>
                                            <span><button style={styles.delete} onClick={() => { deleteTodo(todo.id) }}>Delete</button><br /></span>
                                        </span>
                                    </div>
                                </li>)
                        }))}
                    </ol>
                </div>
            </div>
        </>
    )
}

ReactDOM.render(<App />, document.getElementById("root"));

const styles = {
    todos: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        width: "300px",
        marginBottom: "15px"
    },
    checkbox: {
        width: "50px",
        height: "20px",
        fontFamily: "Caveat",
        // fontSize:"20px"
    },
    delete: {
        fontFamily: "Caveat",
    },
};