Page({
  data: {
    weightInfo: {
      initial: 72.30,
      current: 74.40,
      target: 75.00,
      increased: 2.10,
      date: '2025-01-16 09:31:50'
    },
    caloriesLeft: 2371,
    foodCalories: 0,
    exerciseCalories: 0,
    weightHistory: [73.2, 73.3, 73.9, 74.6, 74.4],
    waistline: '--',
    healthHabits: {
      today: '100%',
      completed: 1,
      total: 1
    }
  },
  
  onLoad() {
    this.renderWeightChart();
  },
  
  renderWeightChart() {
    // 使用微信小程序图表组件渲染体重变化趋势图
  },
  
  addWeightRecord() {
    wx.navigateTo({
      url: '../weight-record/weight-record',
    })
  },
  
  addWaistlineRecord() {
    wx.navigateTo({
      url: '../waistline-record/waistline-record',
    })
  },
  
  navigateToMeal(e) {
    const mealType = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `../food-record/food-record?type=${mealType}`,
    })
  },
  
  navigateToExercise() {
    wx.navigateTo({
      url: '../exercise-record/exercise-record',
    })
  },
  
  // 导航到首页
  navigateToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  
  // 导航到AI页面
  navigateToAI: function() {
    wx.switchTab({
      url: '/pages/ai/ai'
    });
  },
  
  // 导航到个人页面
  navigateToProfile: function() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },
}) 