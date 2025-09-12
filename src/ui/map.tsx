import React from 'react';
import { RadarMapOptions } from '../@types/types';

const RadarMapJS = require('./map.jsx').default;

export interface RadarMapProps {
  /**
   * Configuration options for the RadarMap component
   */
  mapOptions?: RadarMapOptions;
  /**
   * Child components to render within the map
   */
  children?: React.ReactNode;
}

/**
 * TypeScript wrapper for the RadarMap component that provides type safety
 * while delegating the implementation to the JavaScript version.
 * 
 * @param props - The props for the RadarMap component
 * @returns The RadarMap component with proper TypeScript typing
 */
const RadarMap: React.FC<RadarMapProps> = (props) => {
  return React.createElement(RadarMapJS, props);
};

export default RadarMap;