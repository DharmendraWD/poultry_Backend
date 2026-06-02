import React from 'react'

const Loading = ({text}) => {
  return (
         <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <span className="animate-pulse text-gray-400">{text || "Loading"}</span>
      </div>
  )
}

export default Loading