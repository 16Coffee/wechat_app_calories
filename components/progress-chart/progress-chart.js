Component({
  properties: {
    dataPoints: {
      type: Array,
      value: []
    },
    chartHeight: {
      type: Number,
      value: 200
    },
    lineColor: {
      type: String,
      value: '#14D173'
    },
    pointColor: {
      type: String,
      value: '#14D173'
    },
    showPoints: {
      type: Boolean,
      value: true
    }
  },
  
  data: {
    path: '',
    points: []
  },
  
  lifetimes: {
    attached: function() {
      this.drawChart();
    }
  },
  
  observers: {
    'dataPoints': function() {
      this.drawChart();
    }
  },
  
  methods: {
    drawChart() {
      const { dataPoints, chartHeight } = this.properties;
      if (!dataPoints || dataPoints.length < 2) return;
      
      const width = 100 / (dataPoints.length - 1);
      const max = Math.max(...dataPoints);
      const min = Math.min(...dataPoints);
      const range = max - min || 1;
      
      const points = dataPoints.map((point, index) => {
        const x = index * width;
        const y = chartHeight - ((point - min) / range) * chartHeight;
        return { x, y, value: point };
      });
      
      let path = `M ${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x},${points[i].y}`;
      }
      
      this.setData({ path, points });
    }
  }
}) 