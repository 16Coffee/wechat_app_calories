Component({
  properties: {
    percent: {
      type: Number,
      value: 0
    },
    size: {
      type: Number,
      value: 200
    },
    strokeWidth: {
      type: Number,
      value: 12
    },
    activeColor: {
      type: String,
      value: '#14D173'
    },
    backgroundColor: {
      type: String,
      value: '#EEEEEE'
    },
    value: {
      type: String,
      value: '0'
    },
    valueSize: {
      type: Number,
      value: 30
    },
    label: {
      type: String,
      value: ''
    },
    labelSize: {
      type: Number,
      value: 14
    }
  },
  
  data: {
    
  },
  
  lifetimes: {
    attached: function() {
      const { size, strokeWidth } = this.properties;
      const radius = (size - strokeWidth) / 2;
      const perimeter = 2 * Math.PI * radius;
      
      this.setData({
        radius,
        perimeter,
        center: size / 2,
        right: perimeter * (1 - this.properties.percent / 100)
      });
    }
  },
  
  observers: {
    'percent': function(percent) {
      const right = this.data.perimeter * (1 - percent / 100);
      this.setData({ right });
    }
  }
}) 