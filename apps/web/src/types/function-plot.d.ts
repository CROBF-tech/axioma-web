declare module "function-plot" {
  import type {
    Chart,
    FunctionPlotDatum,
    FunctionPlotOptions,
  } from "function-plot"

  export default function functionPlot(options: FunctionPlotOptions): Chart
  export * from "function-plot"
}
