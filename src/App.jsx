import React, { Component } from 'react'
import Map from './component/map/map'
import 'tui-grid/dist/tui-grid.css'
import Grid from '@toast-ui/react-grid'

class App extends Component {
  render () {
    const data = [
      { id: 1, name: 'Editor' },
      { id: 2, name: 'Grid' },
      { id: 3, name: 'Chart' }
    ]

    const columns = [
      { name: 'id', title: 'ID' },
      { name: 'name', title: 'Name' }
    ]
    return (
      <>
        <Map ncpClientId={process.env.REACT_APP_SERVICEKEY}/>
        <Grid
          data={data}
          columns={columns}
          rowHeight={25}
          bodyHeight={100}
          virtualScrolling={true}
          heightResizable={false}
          rowHeaders={['rowNum']}
        />
      </>
    )
  }
}

export default App
