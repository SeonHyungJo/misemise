import React, { Component } from 'react'
import { connect } from 'react-redux'
import Map from './component/map/map'
import 'tui-grid/dist/tui-grid.css'
import Grid from '@toast-ui/react-grid'
import { bindActionCreators } from 'redux'
import { getDataAsync } from './modules'

class App extends Component {
  render () {
    const { data } = this.props

    const columns = [
      { name: 'id', title: '지역' },
      { name: 'name', title: '수치' },
      { name: 'etc', title: '단계' }
    ]

    const gridData = []

    let getLevel = (_num) => {
      _num = parseInt(_num, 10)

      let container = []
      container.push({ min: 0, max: 15, level: '좋음' })
      container.push({ min: 16, max: 35, level: '보통' })
      container.push({ min: 36, max: 75, level: '나쁨' })
      container.push({ min: 76, max: 999, level: '매우나쁨' })

      return container.filter((info) => {
        let condition = info.min <= _num && _num <= info.max
        return condition
      })[0]
    }

    // if (data.airData) {
    //   var exception = ['dataTime', 'totalCount', 'serviceKey', 'searchCondition', '_returnType', 'itemCode', 'dataTerm', 'resultCode', 'resultMsg']
    //   for (var item in data.airData) {
    //     if (data.airData.hasOwnProperty(item) && !exception.includes(item)) {
    //       gridData.push({
    //         id: item, name: data.airData[item], etc: getLevel(data.airData[item]).level
    //       })
    //     }
    //   }
    // }

    return (
      <>
        <Map ncpClientId={process.env.REACT_APP_SERVICEKEY}/>
        <Grid
          data={gridData}
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

const mapStateToProps = (state) => ({
  data: state.data
})

const maDispatchToPrope = (dispatch) => ({
  getDataAsync: bindActionCreators(getDataAsync, dispatch)
})

export default connect(mapStateToProps, maDispatchToPrope)(App)
