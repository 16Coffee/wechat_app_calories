App({
  globalData: {
    userInfo: null,
    healthData: {
      weight: [],
      food: [],
      exercise: []
    }
  },

  onLaunch: function() {
    // 简单初始化
    console.log('小程序启动成功');
  }
}) 