import React from 'react'
import { Hourglass } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div style={{height: '80vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',}}>
    <Hourglass
    visible={true}
    height="80"
    width="80"
    ariaLabel="hourglass-loading"
    wrapperStyle={{}}
    wrapperClass=""
    colors={['#F76D60', '#000']}
    />
    </div>
  )
}

export default Loader
