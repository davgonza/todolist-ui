import React from 'react';
import { render } from "react-dom";
import ReactDOM from 'react-dom';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import Typography from '@material-ui/core/Typography'
import { Button, ListItemText } from '@material-ui/core'




import logo from './logo.svg';
import './App.css';
import axios from "axios";

import moment from "moment";
import DateEditor from "./DateEditor";
import linq from "linq";



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




class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: const_columns,
            rows: [],
            selectedIndexes: []
        }

        this.addNewRow = this.addNewRow.bind(this);
    }

    // default State object
    state = {
        rows: []
    };

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

                var comparer = this.returnComparer('ASC', 'id')
                this.state.rows = newRows.sort(comparer);

                // store the new state object in the component's state
                this.setState(newState);
            })
            .catch(error => console.log(error));
        
        this.grid.handleSort('id', 'DESC');
    }

    onGridSort = (columnName, sortDirection) => {
        var comparer = this.returnComparer(sortDirection, columnName)
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
            rows[i].canSave = true;
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
        let addNewRows = this.state.rows.slice()

        addNewRows.push({
            id: 11,
            title: "",
            done: false
        });

        addNewRows[this.state.rows.length].canSave = true;
        addNewRows[this.state.rows.length].isNew = true;
        this.setState({rows: addNewRows});
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

    returnComparer(sortDirection, columnName) {
        return function (a, b) {
            if (sortDirection === 'ASC') {
                return (a[columnName] > b[columnName]) ? 1 : -1;
            }
            else if (sortDirection === 'DESC') {
                return (a[columnName] < b[columnName]) ? 1 : -1;
            }
        };
    }

    keyPress(event) {
        console.log("pressed")
        console.log(event)
    }



    myCallback = (row) => {
        console.log(row);
        
        var rowIds = Array.from(this.state.rows, p => p.id);
        let isNew = rowIds.indexOf(row.id) < 0;

        if (isNew) {
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
        else {
            const todo = {                
                title: row.title,
                done: row.done,
                finish_by_date: row.finish_by_date
            };

            let url = 'https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com/todos/' + row.id;
            axios.put(url, todo)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                })
            
            todo.id = row.id;
            const rows = this.state.rows;
            const index = rows.indexOf(todo);
            rows[index] = todo;

            this.setState({ rows });
        }
    };

    getCellActions = (column, row, state) => {
        const cellActions = {
            finish_by_date: [
                {
                    icon: <span className="glyphicon glyphicon-remove" />,
                    callback: () => {


                        this.myCallback(row);
                    }
                }
            ]
        };
        return row.canSave ? cellActions[column.key] : null;

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
            ref={grid => (this.grid = grid)}
            rowsCount={20}
            onGridSort={this.onGridSort}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect={true}
            rowSelection={{
                minWidth: 5,
                    maxWidth: 50,
                    resizable: true,
                    showCheckbox: true,
                    enableShiftSelect: false,
                    onRowsSelected: this.onRowsSelected,
                    onRowsDeselected: this.onRowsDeselected,
                    selectBy: {
                        indexes: this.state.selectedIndexes
                    }
            }}
            minHeight={500} 
            getCellActions= {(column, row) => this.getCellActions(column, row)}
            />

            <Button onClick={this.addNewRow} variant='contained' style={{float: 'right', margin: 20}}>Add</Button>
            <Button onClick={this.deleteRow} variant='outlined' color='secondary' style={{ margin: 20 }}>Delete Rows</Button>
            </div>

        );
    }
}

export default App;
//render(<Example />, document.querySelector("#root"));
