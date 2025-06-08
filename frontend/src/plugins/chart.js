import { Chart as ChartJS, registerables } from 'chart.js'

ChartJS.register(...registerables)

export default {
  install: (app) => {
    app.config.globalProperties.$chart = ChartJS
  }
}
