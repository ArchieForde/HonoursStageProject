import React from 'react'
import LightPillarComp from './backgroundCode.jsx'

// Wrapper that ensures the LightPillar canvas fills the viewport
export function LightPillar(props) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <LightPillarComp
        topColor="#5227FF"
        bottomColor="#FF9FFC"
        intensity={1}
        rotationSpeed={0.3}
        glowAmount={0.002}
        pillarWidth={3}
        pillarHeight={0.4}
        noiseIntensity={0.5}
        pillarRotation={25}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
        {...props}
      />
    </div>
  )
}

export default LightPillar