
import React from 'react';
import { render } from "react-dom";
import ReactDOM from 'react-dom';
import ReactDataGrid from 'react-data-grid';
import update from 'immutability-helper';
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'




const const_columns = [
    { key: "id", name: "ID", sortable: true, editable: true },
    { key: "title", name: "Title", sortable: true, editable: true },
    { key: "complete", name: "Complete", sortable: true, editable: true }
];

const const_rows = [
    { id: 0, title: "Task 1", complete: 20 },
    { id: 1, title: "Task 2", complete: 40 },
    { id: 2, title: "Task 3", complete: 60 }
];





class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: const_columns,
            rows: const_rows,
            selectedIndexes: []
        }
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
            room: "", 
            length: "", 
            width: "" , 
            pleats: "", 
            style: "", 
            notes: ""
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
        var styles = {
            height: 0,
            margin: 0,
            padding: 0,
            overflow: "hidden",
            borderWidth: 0,
            position: "absolute",
            backgroundColor: "blue",
            width: "50%"
        };



        return (
            <div onKeyPress={event => this.keyPress(event)}>
            <Typography variant='display1'>
            Curtains
            </Typography>

            <ReactDataGrid
            columns={this.state.columns}
            rowGetter={i => this.state.rows[i]}
            rowsCount={3}
            onGridSort={this.onGridSort}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect={true}
            style={styles}
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
            minHeight={500} />

            <Button onClick={this.addNewRow} variant='contained' style={{float: 'right', margin: 20}}>Add</Button>
            <Button onClick={this.deleteRow} variant='outlined' color='secondary' style={{ margin: 20 }}>Delete Rows</Button>
            <Button onClick={()=> this.submit()} variant='outlined' color='primary' style={{ margin: 20 }}>Save all changes</Button>
            </div>

        );
    }
};
render(<Example />, document.querySelector("#root"));
