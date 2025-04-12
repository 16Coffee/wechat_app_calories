Page({
  data: {
    userInfo: {
      currentWeight: '74.4',
      targetWeight: '75.0',
      daysCount: 30
    },
    healthTips: [
      '无糖可乐不含糖分，是控制体重和血糖的理想选择，每天适量饮用，享受甜蜜无负担。',
      '无糖可乐含有碳酸成分，能够增加饱腹感，帮助控制食欲，是减肥期间的理想饮品。',
      '无糖可乐搭配均衡饮食和适当运动，帮助你保持健康生活方式，享受美味同时不用担心摄入过多热量。'
    ],
    currentTipIndex: 0
  },
  
  onLoad: function() {
    // 随机选择一个健康小贴士
    const randomIndex = Math.floor(Math.random() * this.data.healthTips.length);
    this.setData({
      currentTipIndex: randomIndex
    });
  },
  
  navigateToRecord: function() {
    wx.switchTab({
      url: '/pages/record/record',
    });
  },
  
  navigateToFoodPlan: function() {
    wx.navigateTo({
      url: '/pages/food-record/food-record',
    });
  },
  
  navigateToExercise: function() {
    wx.navigateTo({
      url: '/pages/exercise-record/exercise-record',
    });
  },
  
  navigateToAnalysis: function() {
    wx.navigateTo({
      url: '/pages/health-assessment/health-assessment',
    });
  }
}) 