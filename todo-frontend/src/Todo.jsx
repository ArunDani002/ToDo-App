import { useEffect, useState } from "react"

export default function Todo() {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [todos, setTodos] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [editingId, setEdititngId] = useState(-1)
    const apiUrl = "http://localhost:3000"

    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")




    useEffect(() => {
        getItems()
    }, [])

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                setTodos(res)
            })

    }

    const handleEdit = async (item) => {
        setEdititngId(item._id)
        setEditTitle(item.title)
        setEditDescription(item.description)


    }

    const handleUpdate = async (id) => {
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
           await fetch(apiUrl + "/todos" + `/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editTitle, description: editDescription
                })
            }).then((res) => {
                if (res.ok) {
                    const updated = todos.map((item) => {
                        if (item._id == id) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updated)
                    setMessage("Item updated successfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 2000);
                    setEdititngId(-1)
                }



            })

        }
    }
    const handleDelete = (id) => {
        // {console.log(id)}
        if (window.confirm('Are you sure to delete?')) {
            fetch(apiUrl + "/todos" + `/${id}`, {
                method: "DELETE",

            })
                .then(() => {
                    const updatedTodos = todos.filter((item) => item._id !== id)
                    setTodos(updatedTodos)
                })

        }

    }

    const handleSubmit = async () => {
        setError('')
        if (title.trim() !== '' && description.trim() !== '') {

            await fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title, description
                })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }])
                    setMessage("Item added successfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 2000)
                    setTitle("")
                    setDescription("")
                } else {
                    setError("unale to create to do item")
                    setTimeout(() => {
                        setError("")
                    }, 2000);

                }

            }).catch(() => {
                setError("unable to create todo item")
                setTimeout(() => {
                    setError("")
                }, 3000);
            })


        }

    }

    return (
        <>
            <div className="row p-3 bg-success text-light">
                <h1>To DO App</h1>
            </div>
            <div className="row">
                <h3>Add item</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder="Title" className="form-control" />
                    <input type="text" onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Description" className="form-control" />
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
                {/* {error && <p>{error}</p>} */}
                <p className="text-danger">{error}</p>
            </div>
            <div className="row mt-3 ">
                <h3>Tasks</h3>
                
                {todos.length <= 0? 
                <> <div className="d-flex justify-content-center mt-5">
                    <p className="text-warning ">No Tasks!</p> 
                    </div></> : <ul className="list-group">
                    {
                        todos.map((item) => {
                            return (
                                <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                                    <div className="d-flex flex-column">
                                        {editingId == -1 || editingId !== item._id ?
                                            <><span className="fw-bold">{item.title}</span>
                                                <span >{item.description}</span></> : <>
                                                <div className="form-group d-flex gap-2">
                                                    <input type="text" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} placeholder="Title" className="form-control" />
                                                    <input type="text" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} placeholder="Description" className="form-control" />
                                                </div></>}
                                    </div>
                                    <div className="d-flex gap-2">
                                        {editingId == -1 || editingId !== item._id ?
                                            <>
                                                <button className="btn btn-warning" onClick={() => handleEdit(item)} >Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                            </>
                                            : <>
                                                <button className="btn btn-warning" onClick={() => handleUpdate(item._id)} >Update</button>
                                                <button className="btn btn-danger" onClick={() => setEdititngId(-1)}>Cancel</button>
                                            </>}

                                        {/* {console.log(item)} */}

                                    </div>

                                </li>
                            )
                        })
                    }

                </ul>  }

                
            </div>
        </>
    )
}