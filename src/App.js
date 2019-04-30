import React from 'react';
import { render } from "react-dom";
import ReactDOM from 'react-dom';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'




import logo from './logo.svg';
import './App.css';
import axios from "axios";

import moment from "moment";
import DateEditor from "./DateEditor";



const const_columns = [
    { key: "id", name: "ID", sortable: true, editable: true },
    { key: "title", name: "Title", sortable: true, editable: true },
    { key: "done", name: "Done", sortable: true, editable: true },
    { key: "finish_by_date", name: "Finish by", sortable: true, editable: true, editor: DateEditor }
];


const const_rows = [
    { id: 0, title: "example 1", done: 20 },
    { id: 1, title: "example 2", done: 40 },
    { id: 2, title: "example 3", done: 60 }
];

function getCellActions(column, row) {
    const cellActions = {
        finish_by_date: [
            {
                icon: <span className="glyphicon glyphicon-remove" />,
                callback: () => {
                    const newTodo = {
                        title: row.title,
                        done: row.done,
                        finish_by_date: row.finish_by_date
                    };

                    axios.post('https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com/todos', { newTodo })
                        .then(res => {
                            console.log(res);
                            console.log(res.data);
                        })
                }
            }
        ]
    };
    return row.hasChanged ? cellActions[column.key] : null;
}




class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: const_columns,
            rows: [],
            selectedIndexes: []
        }
    }

    // default State object
    state = {
        rows: []
    };

    //https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com

    //https://jsonplaceholder.typicode.com/users
    componentDidMount() {
        axios
            .get("https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com/todos")
            .then(response => {

                // create an array of rows only with relevant data
                const newRows = response.data.map(c => {
                    return {
                        id: c.id,
                        title: c.title,
                        done: c.done,
                        finish_by_date: c.finish_by_date
                    };
                });

                // create a new "State" object without mutating 
                // the original State object. 
                const newState = Object.assign({}, this.state, {
                    rows: newRows
                });
                this.state.origRows = newRows
                this.state.rows = newRows

                // store the new state object in the component's state
                this.setState(newState);
            })
            .catch(error => console.log(error));
    }


    handleSubmit = event => {
        let s = this.state.origRows

        const newTodo = {
            title: "",
            done: false,
            finish_by_date: new Date()
        };

        axios.post('https://jsonplaceholder.typicode.com/users', { newTodo })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }






    onGridSort = (columnName, sortDirection) => {
        var comparer = function(a, b) {
            if(sortDirection === 'ASC'){
                return (a[columnName] > b[columnName]) ? 1 : -1;
            }else if(sortDirection === 'DESC'){
                return (a[columnName] < b[columnName]) ? 1 : -1;
            }
        }
        this.state.rows.sort(comparer);

        this.setState({
            sortColumn: columnName,
            sortDirection: sortDirection,
        })
    }

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let rows = this.state.rows.slice();

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            rows[i] = update(rowToUpdate, {$merge: updated});
            rows[i].hasChanged = true;
        }

        this.setState({rows});
    };

    onRowsSelected = rows => {
        this.setState({
            selectedIndexes: this.state.selectedIndexes.concat(
                rows.map(r => r.rowIdx)
            )
        })
    }

    onRowsDeselected = rows => {
        let rowIndexes = rows.map(r => r.rowIdx)
        this.setState({
            selectedIndexes: this.state.selectedIndexes.filter(
                i => rowIndexes.indexOf(i) === -1
            )
        })
    }

    addNewRow = () => {
        var addNewRows = this.state.rows
        // same structure
        addNewRows.push({
            title: "",
            done: false,
            finish_by_date: new Date()
        })
        this.setState(this.state.rows)
        this.setState(this.state.selectedIndexes)
        console.log('added new row')
    }

    deleteRow = () => { 
        console.log(this.state.selectedIndexes)
        const selectedIndexes = this.state.selectedIndexes
        // delete one item at once
        //this.state.rows.splice(this.state.selectedIndexes, 1)
        // delete multiple items at once
        const filteredRows = this.state.rows.filter(function(element, index) {
            // user indexOf method to find
            if(selectedIndexes.indexOf(index) >= 0) {
                return false
            } else {
                return true
            }
        })
        this.setState({
            rows: filteredRows
        })
    }

    keyPress(event) {
        console.log("pressed")
        console.log(event)
    }







    render() {
        return (
            <div onKeyPress={event => this.keyPress(event)}>
            <Typography variant='display1'>
            Curtains
            </Typography>

            <ReactDataGrid
            columns={this.state.columns}
            rowGetter={i => this.state.rows[i]}
            rowsCount={20}
            onGridSort={this.onGridSort}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect={true}
            rowSelection={{
                minWidth: 5,
                    maxWidth: 50,
                    resizable: true,
                    showCheckbox: true,
                    enableShiftSelect: true,
                    onRowsSelected: this.onRowsSelected,
                    onRowsDeselected: this.onRowsDeselected,
                    selectBy: {
                        indexes: this.state.selectedIndexes
                    }
            }}
            minHeight={500} 
            getCellActions={getCellActions}
            />

            <Button onClick={this.addNewRow} variant='contained' style={{float: 'right', margin: 20}}>Add</Button>
            <Button onClick={this.deleteRow} variant='outlined' color='secondary' style={{ margin: 20 }}>Delete Rows</Button>
            <Button onClick={()=> this.handleSubmit()} variant='outlined' color='primary' style={{ margin: 20 }}>Save all changes</Button>
            </div>

        );
    }
}

export default App;
//render(<Example />, document.querySelector("#root"));
