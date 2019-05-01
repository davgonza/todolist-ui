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

import PropTypes from 'prop-types';

const { Row } = ReactDataGrid;
const dateDisplay = ({ value }) => {
    return value == null ? null : moment(value).format("L");
};


const const_columns = [
    { key: "title", name: "Title", sortable: true, editable: true },
    { key: "priority", name: "Priority", sortable: true, editable: true },
    { key: "finish_by_date", name: "Finish by", sortable: true, editable: true, editor: DateEditor, formatter: dateDisplay }
];

class RowRenderer extends React.Component {
  static propTypes = {
    idx: PropTypes.string.isRequired
  };

  setScrollLeft = (scrollBy) => {
    this.row.setScrollLeft(scrollBy);
  };

  getRowStyle = () => {
    let isDone = this.props.row.done === true;
    return {
      color: isDone ? 'gray' : 'black',
      fontStyle: isDone ? 'italic' : 'normal'
    };
  };

  render() {
    // usually though it will just be a matter of wrapping a div, and then calling back through to the grid
    return (<div style={this.getRowStyle()}><Row ref={ node => this.row = node } {...this.props}/></div>);
  }
}


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

    state = {
        rows: [],
        refresh: false
    };

    componentDidMount() {
        axios
            .get("https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com/todos")
            .then(response => {

                const newRows = response.data.map(c => {
                    return {
                        id: c.id,
                        title: c.title,
                        done: c.done,
                        finish_by_date: c.finish_by_date
                    };
                });

                var comparer = this.returnComparer('ASC', 'finish_by_date')

                const newState = Object.assign({}, this.state, {
                    rows: newRows.sort(comparer)
                });

                this.setState(newState);
            })
            .catch(error => console.log(error));

        // set column arrow to sort
        this.grid.handleSort('finish_by_date', 'ASC');
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

    getSize() {
        let count = this.state.rows.length;

        if (this.state.refresh) {
            count++; // hack for update data-grid
            this.setState({
                refresh: false
            });
        }

        return count;
    }

    refresh() {
        this.setState({
            refresh: true
        });
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

        if (selectedIndexes.length !== 1) {
            return;
        }

        let rowId = this.state.rows[selectedIndexes[0]].id

        axios.delete(`https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com/todos/${rowId}`)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
            
        let filteredSelectedIndexes = []

        // delete one item at once
        const filteredRows = this.state.rows.filter(function(element, index) {
            // user indexOf method to find
            if(selectedIndexes.indexOf(index) >= 0) {
                filteredSelectedIndexes = selectedIndexes.filter(i => i !== index);
                return false
            } else {
                return true
            }
        })
        this.setState({ selectedIndexes: filteredSelectedIndexes });
        this.setState({ rows: filteredRows });
    }

    markAsDone = () => { 
        console.log(this.state.selectedIndexes)

        const selectedIndexes = this.state.selectedIndexes

        if (selectedIndexes.length !== 1) {
            return;
        }

        let row = this.state.rows[selectedIndexes[0]]
        row.done = true;

        let rows = this.state.rows.slice()

        rows[selectedIndexes[0]] = row
            
        this.setState({rows});

        const todo = { done: true };

        let url = 'https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com/todos/' + row.id;
        axios.put(url, todo)
            .then(res => {
                console.log(res);
                console.log(res.data);
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

    myEditCallback = (row) => {
        console.log(row);
        
        var finishDate = new Date(row.finish_by_date);
            
        if (row.isNew) {
            try {
                axios.post('https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com/todos', 
                    { 
                        title: row.title,
                        done: row.done,
                        finish_by_date: finishDate
                    })
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                    })
            } catch (e) {
                console.log(`:( Axios request failed: ${e}`)
            }
        }
        else {
            const todo = {                
                title: row.title,
                done: row.done,
                finish_by_date: finishDate
            };

            let url = 'https://cors-anywhere.herokuapp.com/https://minimal-todo-server.herokuapp.com/todos/' + row.id;
            axios.put(url, todo)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                })
        }

        const rows = this.state.rows;
        const index = rows.indexOf(row);

        rows[index].canSave = false;

        this.setState({ rows });
        this.refresh();
    };

    getEditRowAction = (column, row, state) => {
        const cellActions = {
            finish_by_date: [
                {
                    icon: <span className="glyphicon glyphicon-pencil" />,
                    callback: () => {
                        this.myEditCallback(row);
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
            To-Do List
            </Typography>

            <ReactDataGrid
            columns={this.state.columns}
            rowGetter={i => this.state.rows[i]}
            ref={grid => (this.grid = grid)}
            rowsCount={this.getSize()}
            onGridSort={this.onGridSort}
            rowRenderer={RowRenderer}
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
            getCellActions= {(column, row) => this.getEditRowAction(column, row)}
            />

            <Button onClick={this.addNewRow} variant='contained' style={{float: 'right', margin: 20}}>Add</Button>
            <Button onClick={this.deleteRow} variant='outlined' color='secondary' style={{ margin: 20 }}>Delete</Button>
            <Button onClick={this.markAsDone} variant='outlined' color='secondary' style={{ margin: 40 }}>Done</Button>
            </div>

        );
    }
}

export default App;
//render(<Example />, document.querySelector("#root"));
