declare module "@maplibre/maplibre-react-native" {
  export interface MapRef {
    getCenter(): Promise<{ lng: number; lat: number }>;
    getZoom(): Promise<number>;
    getBearing(): Promise<number>;
    getPitch(): Promise<number>;
    getBounds(): Promise<{ ne: [number, number]; sw: [number, number] }>;
    project(coordinate: [number, number]): Promise<{ x: number; y: number }>;
    unproject(point: { x: number; y: number }): Promise<[number, number]>;
    queryRenderedFeatures(
      point: [number, number] | [[number, number], [number, number]],
      filter?: string[],
      layerIDs?: string[],
    ): Promise<GeoJSON.FeatureCollection>;
  }
}
